import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Mail, MessageCircle, ShieldCheck } from 'lucide-react';

type Language = 'ko' | 'en';

const languageStorageKey = 'rago-x-language';
const legacyLanguageStorageKey = 'kl-store-language';
const supportEmail = 'support@icube-x.com';

const supportContent = {
  ko: {
    documentTitle: '고객센터 | RAGO-X',
    back: 'RAGO-X로 돌아가기',
    eyebrow: '고객센터',
    title: '무엇을 도와드릴까요?',
    description: '서비스 이용 관련 문의를 이메일로 보내주시면 담당자가 확인 후 답변드립니다.',
    emailLabel: '이메일 문의',
    emailHelp: '문의 내용과 회신 받을 이메일을 함께 적어 보내주세요.',
    emailCta: 'support@icube-x.com',
    responseTitle: '답변 안내',
    responseBody: '영업일 기준으로 순차 확인 후 24시간 이내 답변드립니다.',
    privacyTitle: '개인정보 문의',
    privacyBody: '개인정보 열람, 정정, 삭제 요청도 고객센터 이메일로 접수할 수 있습니다.',
    faqTitle: '문의 전 확인',
    faqBody: '서비스 이용약관과 개인정보처리방침에서 기본 정책을 확인할 수 있습니다.',
    terms: '서비스 이용약관',
    privacy: '개인정보처리방침',
  },
  en: {
    documentTitle: 'Customer Support | RAGO-X',
    back: 'Back to RAGO-X',
    eyebrow: 'Customer Support',
    title: 'How can we help?',
    description: 'Email us for questions about service usage. Our team will review your message and reply.',
    emailLabel: 'Email support',
    emailHelp: 'Please include your question and the email address where we can reply.',
    emailCta: 'support@icube-x.com',
    responseTitle: 'Response time',
    responseBody: 'We review support requests in order and reply within 24 hours on business days.',
    privacyTitle: 'Privacy requests',
    privacyBody: 'Requests to access, correct, or delete personal data can also be sent to support.',
    faqTitle: 'Before contacting us',
    faqBody: 'You can review the basic policies in our Terms of service and Privacy policy.',
    terms: 'Terms of service',
    privacy: 'Privacy policy',
  },
} as const;

function detectInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  const savedLanguage = window.localStorage.getItem(languageStorageKey)
    ?? window.localStorage.getItem(legacyLanguageStorageKey);
  if (savedLanguage === 'ko' || savedLanguage === 'en') return savedLanguage;

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const languages = navigator.languages.length ? navigator.languages : [navigator.language];
  const hasKoreanLocale = languages.some((locale) => locale.toLowerCase().startsWith('ko'));

  return timezone === 'Asia/Seoul' || hasKoreanLocale ? 'ko' : 'en';
}

export function SupportPage() {
  const [language] = useState<Language>(detectInitialLanguage);
  const t = supportContent[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t.documentTitle;
  }, [language, t.documentTitle]);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="border-b border-gray-200 bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <a href="/" className="mb-10 flex w-fit items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            {t.back}
          </a>
          <p className="mb-4 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
            {t.eyebrow}
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-normal text-gray-950 md:text-5xl">
            {t.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            {t.description}
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-6 shadow-sm md:col-span-2">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-950">{t.emailLabel}</h2>
            <p className="mt-2 text-gray-600">{t.emailHelp}</p>
            <a
              href={`mailto:${supportEmail}`}
              className="mt-4 inline-flex text-base font-bold text-blue-600 transition-colors hover:text-blue-700"
            >
              {t.emailCta}
            </a>
          </div>

          <InfoBlock icon={Clock} title={t.responseTitle} body={t.responseBody} />
          <InfoBlock icon={ShieldCheck} title={t.privacyTitle} body={t.privacyBody} />

          <div className="rounded-lg border border-gray-200 p-6 md:col-span-2">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-950">{t.faqTitle}</h2>
            <p className="mt-2 text-gray-600">{t.faqBody}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
              <a href="/terms" className="rounded-lg border border-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50">
                {t.terms}
              </a>
              <a href="/privacy" className="rounded-lg border border-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50">
                {t.privacy}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoBlock({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Clock;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-green-100 text-green-600">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="text-xl font-bold text-gray-950">{title}</h2>
      <p className="mt-2 leading-7 text-gray-600">{body}</p>
    </div>
  );
}
