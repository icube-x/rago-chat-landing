import type { PolicyDocument, PolicySlug, PolicyTocItem } from '@/app/policies/policyTypes';
import type { PolicyLanguageCode } from '@/app/language';

const policyCodes: Record<PolicySlug, string> = {
  terms: 'TERMS_OF_SERVICE',
  privacy: 'PRIVACY_POLICY',
};

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'https://api.rago-x.chat').replace(/\/+$/, '');

type PolicyApiResponse = Record<string, unknown>;

interface PolicyPayload {
  type: string;
  title: string;
  effectiveDate: string;
  contentFormat: string;
  content: string;
  version: string;
  updatedAt: string;
}

export async function fetchPolicy(slug: PolicySlug, languageCode: PolicyLanguageCode = 'ko-KR'): Promise<PolicyDocument> {
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
  return normalizePolicy(slug, payload, languageCode);
}

function unwrapPolicyPayload(payload: PolicyApiResponse): PolicyApiResponse {
  const nested = payload.data ?? payload.policy ?? payload.result;
  return isRecord(nested) ? nested : payload;
}

function normalizePolicy(slug: PolicySlug, payload: PolicyApiResponse, languageCode: PolicyLanguageCode): PolicyDocument {
  const policyPayload = readPolicyPayload(payload);
  const contentHtml = buildContentHtml(policyPayload.content, policyPayload.contentFormat);
  const toc = buildToc(contentHtml);
  const labels = getPolicyMetaLabels(languageCode);

  return {
    slug,
    title: policyPayload.title,
    effectiveDate: formatPolicyMeta(labels.effectiveDate, policyPayload.effectiveDate),
    updatedAt: formatPolicyMeta(labels.updatedAt, policyPayload.updatedAt),
    version: formatPolicyMeta(labels.version, policyPayload.version),
    contentHtml,
    toc,
  };
}

function getPolicyMetaLabels(languageCode: PolicyLanguageCode): Record<'effectiveDate' | 'updatedAt' | 'version', string> {
  if (languageCode === 'en-US') {
    return {
      effectiveDate: 'Effective date',
      updatedAt: 'Updated',
      version: 'Version',
    };
  }

  return {
    effectiveDate: '시행일자',
    updatedAt: '개정일자',
    version: '버전',
  };
}

function readPolicyPayload(payload: PolicyApiResponse): PolicyPayload {
  const policyPayload = {
    type: readRequiredString(payload, 'type'),
    title: readRequiredString(payload, 'title'),
    effectiveDate: readRequiredString(payload, 'effectiveDate'),
    contentFormat: readRequiredString(payload, 'contentFormat'),
    content: readRequiredString(payload, 'content'),
    version: readRequiredString(payload, 'version'),
    updatedAt: readRequiredString(payload, 'updatedAt'),
  };

  return policyPayload;
}

function readRequiredString(payload: PolicyApiResponse, key: keyof PolicyPayload): string {
  const value = payload[key];
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  throw new Error(`Policy API response does not include ${key}`);
}

function formatPolicyMeta(label: string, value: string): string {
  if (value.startsWith(label)) return value;

  const dateOnly = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (dateOnly) {
    return `${label} ${dateOnly.replace(/-/g, '. ')}`;
  }

  return `${label} ${value}`;
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
  const lines = markdown.replace(/\\n/g, '\n').replace(/\r\n/g, '\n').split('\n');
  const parts: string[] = [];
  let listItems: string[] = [];
  let listTag: 'ol' | 'ul' = 'ol';
  let paragraph: string[] = [];
  let shouldContinuePlainTextList = false;

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
      shouldContinuePlainTextList = false;
      continue;
    }

    if (isHorizontalRule(trimmed)) {
      flushParagraph();
      flushList();
      shouldContinuePlainTextList = false;
      parts.push('<hr />');
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      shouldContinuePlainTextList = false;
      const level = Math.min(heading[1].length, 3);
      parts.push(`<h${level}>${escapeHtml(heading[2])}</h${level}>`);
      continue;
    }

    const articleHeading = trimmed.match(/^(Article\s+\d+[.)]?\s+.+)$/i);
    if (articleHeading) {
      flushParagraph();
      flushList();
      shouldContinuePlainTextList = false;
      parts.push(`<h2>${escapeHtml(articleHeading[1])}</h2>`);
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
      shouldContinuePlainTextList = false;
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
      shouldContinuePlainTextList = false;
      continue;
    }

    if (isPlainTextListItem(trimmed, listItems, listTag, shouldContinuePlainTextList)) {
      flushParagraph();
      if (listItems.length && listTag !== 'ul') {
        flushList();
      }
      listTag = 'ul';
      listItems.push(escapeHtml(trimmed));
      shouldContinuePlainTextList = expectsPlainTextListContinuation(trimmed);
      continue;
    }

    flushList();
    shouldContinuePlainTextList = false;
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return parts.join('\n');
}

function isHorizontalRule(line: string): boolean {
  return /^[-*_⸻]{3,}$/.test(line);
}

function isPlainTextListItem(
  line: string,
  listItems: string[],
  listTag: 'ol' | 'ul',
  shouldContinuePlainTextList: boolean,
): boolean {
  if (/^["“][^"”]+["”]\s+means\b/i.test(line)) {
    return true;
  }

  if (line.endsWith(';') || /;\s*(and|or)$/i.test(line)) {
    return true;
  }

  if (listTag === 'ul' && listItems.length && shouldContinuePlainTextList) {
    return true;
  }

  return false;
}

function expectsPlainTextListContinuation(line: string): boolean {
  return /(?:;\s*(?:and|or)?|\b(?:and|or))$/i.test(line);
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
