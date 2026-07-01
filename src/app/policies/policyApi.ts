import { policies, type PolicyDocument, type PolicySlug, type PolicyTocItem } from '@/app/policies/policyContent';

const policyCodes: Record<PolicySlug, string> = {
  terms: 'TERMS_OF_SERVICE',
  privacy: 'PRIVACY_POLICY',
};

const fallbackTitles: Record<PolicySlug, string> = {
  terms: '서비스 이용약관',
  privacy: '개인정보처리방침',
};

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace(/\/+$/, '');

type PolicyApiResponse = Record<string, unknown>;

export async function fetchPolicy(slug: PolicySlug, languageCode = 'ko-KR'): Promise<PolicyDocument> {
  const url = new URL('/api/v2/policies', apiBaseUrl);
  url.searchParams.set('code', policyCodes[slug]);
  url.searchParams.set('language_code', languageCode);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Policy API failed with ${response.status}`);
  }

  const payload = unwrapPolicyPayload((await response.json()) as PolicyApiResponse);
  return normalizePolicy(slug, payload);
}

export function getFallbackPolicy(slug: PolicySlug): PolicyDocument {
  return policies[slug];
}

function unwrapPolicyPayload(payload: PolicyApiResponse): PolicyApiResponse {
  const nested = payload.data ?? payload.policy ?? payload.result;
  return isRecord(nested) ? nested : payload;
}

function normalizePolicy(slug: PolicySlug, payload: PolicyApiResponse): PolicyDocument {
  const rawContent = readString(payload, [
    'content',
    'contentHtml',
    'content_html',
    'body',
    'bodyHtml',
    'body_html',
    'description',
  ]);

  if (!rawContent) {
    throw new Error('Policy API response does not include content');
  }

  const title = readString(payload, ['title', 'name', 'policyTitle', 'policy_title']) || fallbackTitles[slug];
  const effectiveDate = formatEffectiveDate(
    readString(payload, [
      'effectiveDate',
      'effective_date',
      'effectiveFrom',
      'effective_from',
      'effectiveAt',
      'effective_at',
      'startDate',
      'start_date',
    ]),
  );
  const format = readString(payload, ['contentFormat', 'content_format', 'format', 'mimeType', 'mime_type']);
  const contentHtml = buildContentHtml(rawContent, format);
  const toc = buildToc(contentHtml);

  return {
    slug,
    title,
    effectiveDate,
    contentHtml,
    toc,
  };
}

function readString(payload: PolicyApiResponse, keys: string[]): string {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return '';
}

function formatEffectiveDate(value: string): string {
  if (!value) return '';
  if (value.startsWith('시행일')) return value;

  const dateOnly = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (dateOnly) {
    return `시행일 ${dateOnly.replace(/-/g, '. ')}`;
  }

  return `시행일 ${value}`;
}

function buildContentHtml(content: string, format: string): string {
  const normalizedFormat = format.toLowerCase();
  const looksLikeHtml = normalizedFormat.includes('html') || /<\/?[a-z][\s\S]*>/i.test(content);
  const html = looksLikeHtml ? content : markdownToHtml(content);

  return ensureSections(sanitizeHtml(html));
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, '')
    .replace(/\sjavascript:/gi, '');
}

function markdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const parts: string[] = [];
  let listItems: string[] = [];
  let listTag: 'ol' | 'ul' = 'ol';
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    parts.push(`<p>${escapeHtml(paragraph.join(' '))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    parts.push(`<${listTag}>${listItems.map((item) => `<li>${item}</li>`).join('')}</${listTag}>`);
    listItems = [];
    listTag = 'ol';
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = Math.min(heading[1].length, 3);
      parts.push(`<h${level}>${escapeHtml(heading[2])}</h${level}>`);
      continue;
    }

    const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      if (listItems.length && listTag !== 'ol') {
        flushList();
      }
      listTag = 'ol';
      listItems.push(escapeHtml(ordered[1]));
      continue;
    }

    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      if (listItems.length && listTag !== 'ul') {
        flushList();
      }
      listTag = 'ul';
      listItems.push(escapeHtml(unordered[1]));
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return parts.join('\n');
}

function ensureSections(html: string): string {
  if (/<section[\s>]/i.test(html)) return html;

  let sectionIndex = 0;
  const blocks = html.split(/(?=<h2[\s>])/i).filter((block) => block.trim());

  return blocks
    .map((block) => {
      if (!/^<h2[\s>]/i.test(block.trim())) {
        return `<section id="intro">${block}</section>`;
      }

      sectionIndex += 1;
      const id = `article-${sectionIndex}`;
      return `<section id="${id}">${block}</section>`;
    })
    .join('\n');
}

function buildToc(contentHtml: string): PolicyTocItem[] {
  const toc: PolicyTocItem[] = [];
  const sectionPattern = /<section[^>]*id="([^"]+)"[^>]*>[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  let match: RegExpExecArray | null;

  while ((match = sectionPattern.exec(contentHtml))) {
    toc.push({
      id: match[1],
      label: stripTags(match[2]).replace(/^제\d+조\s*[()]?/u, '').replace(/[()]/g, '').trim() || stripTags(match[2]),
    });
  }

  return toc;
}

function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isRecord(value: unknown): value is PolicyApiResponse {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
