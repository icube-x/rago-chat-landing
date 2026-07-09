import { useEffect, useMemo, useState } from 'react';

import { detectInitialLanguage, getPolicyLanguageCode, getPolicyPath } from '@/app/language';
import { fetchPolicy } from '@/app/policies/policyApi';
import type { PolicyDocument, PolicySlug } from '@/app/policies/policyTypes';

interface PolicyPageProps {
  slug: PolicySlug;
}

const policyTranslations = {
  ko: {
    sectionLabel: '약관·정책',
    navLabel: '약관 및 정책',
    tocLabel: '목차',
    backLabel: 'RAGO-X로 돌아가기',
    loading: '정책을 불러오는 중입니다.',
    error: '정책을 불러오지 못했습니다.',
    policies: {
      privacy: '개인정보처리방침',
      terms: '서비스 이용약관',
    },
  },
  en: {
    sectionLabel: 'Terms & Policies',
    navLabel: 'Terms and policies',
    tocLabel: 'Contents',
    backLabel: 'Back to RAGO-X',
    loading: 'Loading policy.',
    error: 'Unable to load policy.',
    policies: {
      privacy: 'Privacy policy',
      terms: 'Terms of service',
    },
  },
} as const;

export function PolicyPage({ slug }: PolicyPageProps) {
  const language = useMemo(() => detectInitialLanguage(), []);
  const languageCode = getPolicyLanguageCode(language);
  const t = policyTranslations[language];
  const [policy, setPolicy] = useState<PolicyDocument | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [activeId, setActiveId] = useState('');

  const sectionIds = useMemo(() => policy?.toc.map((item) => item.id) ?? [], [policy?.toc]);

  useEffect(() => {
    let isMounted = true;
    setPolicy(null);
    setStatus('loading');

    fetchPolicy(slug, languageCode)
      .then((nextPolicy) => {
        if (!isMounted) return;
        setPolicy(nextPolicy);
        setStatus('ready');
      })
      .catch(() => {
        if (!isMounted) return;
        setPolicy(null);
        setStatus('error');
      });

    return () => {
      isMounted = false;
    };
  }, [languageCode, slug]);

  useEffect(() => {
    if (!policy) return;

    document.title = `${policy.title} | RAGO-X`;
    setActiveId(policy.toc[0]?.id ?? '');
  }, [policy]);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-18% 0px -64% 0px',
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sectionIds]);

  return (
    <div className="min-h-screen bg-white text-[#1f2933]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[312px_minmax(0,1fr)_320px]">
        <aside className="border-b border-[#e5e7eb] bg-white px-4 py-5 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-4 lg:py-10">
          <p className="mb-4 text-sm font-bold text-[#8a94a6]">{t.sectionLabel}</p>
          <nav aria-label={t.navLabel} className="flex flex-wrap gap-2 lg:block">
            {(['privacy', 'terms'] as const).map((itemSlug) => (
              <a
                key={itemSlug}
                href={getPolicyPath(itemSlug, language)}
                className={`block rounded-lg px-4 py-3 text-sm font-bold transition-colors lg:mt-2 lg:text-base ${
                  itemSlug === slug ? 'bg-[#f6f7f9] text-[#111827]' : 'text-[#4b5563] hover:bg-[#f6f7f9]'
                }`}
              >
                {t.policies[itemSlug]}
              </a>
            ))}
          </nav>
        </aside>

        <main className="w-full max-w-[1130px] px-5 py-7 leading-[1.75] md:px-10 md:py-9 xl:px-[72px] xl:pb-20">
          <a href="/" className="mb-5 inline-flex text-sm font-bold text-[#8a94a6]">
            {t.backLabel}
          </a>
          {policy ? (
            <>
              <h1 className="mb-3 text-[26px] font-bold leading-tight text-[#111827] md:text-[34px]">
                {policy.title}
              </h1>
              <div className="mb-12 flex flex-wrap gap-x-5 gap-y-2 text-sm font-normal text-[#8a94a6] md:mb-[76px] md:text-base">
                <div>{policy.effectiveDate}</div>
                <div>{policy.updatedAt}</div>
                <div>{policy.version}</div>
              </div>
            </>
          ) : null}
          {status === 'loading' ? (
            <p className="mb-8 text-sm font-bold text-[#8a94a6]">{t.loading}</p>
          ) : null}
          {status === 'error' ? (
            <p className="mb-8 text-sm font-bold text-[#8a94a6]">{t.error}</p>
          ) : null}
          {policy ? <div className="policy-content" dangerouslySetInnerHTML={{ __html: policy.contentHtml }} /> : null}
        </main>

        <aside className="sticky top-0 hidden h-screen bg-white px-7 py-[68px] xl:block" aria-label={t.tocLabel}>
          <p className="mb-4 text-sm font-bold text-[#8a94a6]">{t.tocLabel}</p>
          <nav>
            {policy?.toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`mb-3.5 block text-sm font-bold transition-colors ${
                  activeId === item.id ? 'text-[#059669]' : 'text-[#4b5563] hover:text-[#111827]'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
