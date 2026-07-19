import { useEffect, useMemo, useState } from 'react';

import { fetchPolicy } from '@/app/policies/policyApi';
import type { PolicyDocument, PolicySlug } from '@/app/policies/policyContent';

interface PolicyPageProps {
  slug: PolicySlug;
}

const policyNavItems: Array<{ slug: PolicySlug; label: string; href: string }> = [
  { slug: 'privacy', label: '개인정보처리방침', href: '/privacy' },
  { slug: 'terms', label: '서비스 이용약관', href: '/terms' },
];

export function PolicyPage({ slug }: PolicyPageProps) {
  const [policy, setPolicy] = useState<PolicyDocument | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [activeId, setActiveId] = useState('');

  const sectionIds = useMemo(() => policy?.toc.map((item) => item.id) ?? [], [policy?.toc]);

  useEffect(() => {
    let isMounted = true;
    setPolicy(null);
    setStatus('loading');

    fetchPolicy(slug)
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
  }, [slug]);

  useEffect(() => {
    if (!policy) {
      document.title = '약관·정책 | RAGO-X';
      setActiveId('');
      return;
    }

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
          <p className="mb-4 text-sm font-bold text-[#8a94a6]">약관·정책</p>
          <nav aria-label="약관 및 정책" className="flex flex-wrap gap-2 lg:block">
            {policyNavItems.map((item) => (
              <a
                key={item.slug}
                href={item.href}
                className={`block rounded-lg px-4 py-3 text-sm font-bold transition-colors lg:mt-2 lg:text-base ${
                  item.slug === slug ? 'bg-[#f6f7f9] text-[#111827]' : 'text-[#4b5563] hover:bg-[#f6f7f9]'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="w-full max-w-[1130px] px-5 py-7 leading-[1.75] md:px-10 md:py-9 xl:px-[72px] xl:pb-20">
          <a href="/" className="mb-5 inline-flex text-sm font-bold text-[#8a94a6]">
            RAGO-X로 돌아가기
          </a>
          <h1 className="mb-3 text-[30px] font-bold leading-tight text-[#111827] md:text-[40px]">
            {policy?.title ?? policyNavItems.find((item) => item.slug === slug)?.label}
          </h1>
          {policy?.effectiveDate ? (
            <p className="mb-12 text-base font-bold text-[#8a94a6] md:mb-[76px] md:text-[19px]">
              {policy.effectiveDate}
            </p>
          ) : null}
          {status === 'loading' ? (
            <p className="mt-8 text-sm font-bold text-[#8a94a6]">정책을 불러오는 중입니다.</p>
          ) : null}
          {status === 'error' ? (
            <p className="mt-8 text-sm font-bold text-[#8a94a6]">
              정책을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
            </p>
          ) : null}
          {policy ? <div className="policy-content" dangerouslySetInnerHTML={{ __html: policy.contentHtml }} /> : null}
        </main>

        {policy ? (
          <aside className="sticky top-0 hidden h-screen bg-white px-7 py-[68px] xl:block" aria-label="목차">
            <p className="mb-4 text-sm font-bold text-[#8a94a6]">목차</p>
            <nav>
              {policy.toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`mb-3.5 block text-[15px] font-bold transition-colors ${
                    activeId === item.id ? 'text-[#059669]' : 'text-[#4b5563] hover:text-[#111827]'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
