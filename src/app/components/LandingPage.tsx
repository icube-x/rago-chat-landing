import { useEffect, useState } from 'react';
import { Database, Zap, Shield, Users, ArrowRight, Check, MessageSquare, FileText, Brain, Star, ChevronRight, Code, X, Languages } from 'lucide-react';

type Language = 'ko' | 'en';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const translations = {
  ko: {
    nav: {
      features: '기능',
      pricing: '요금제',
      useCases: '활용 사례',
      docs: '문서',
      login: '로그인',
      startFree: '무료로 시작하기',
      languageLabel: '언어 선택',
    },
    hero: {
      badge: 'AI 기반 지식 관리의 새로운 기준',
      titleLine1: '지식을 연결하고',
      titleLine2: '답을 찾는 가장',
      titleHighlight: '스마트한 방법',
      description: 'RAG 기술로 조직의 모든 문서와 데이터를 검색하여, 필요한 정보를 자연어로 즉시 찾아드립니다.',
      viewFeatures: '기능 보기',
    },
    featuresSection: {
      title: '강력한 기능',
      description: '최신 AI 기술로 조직의 지식 관리를 혁신하세요',
    },
    features: [
      {
        title: 'AI 기반 검색',
        description: 'RAG 기술로 정확한 답변을 즉시 찾아드립니다',
      },
      {
        title: '문서 관리',
        description: '문서를 업로드하고 지식기반을 구축합니다',
      },
      {
        title: '자연어 대화',
        description: '복잡한 쿼리 없이 일상 언어로 정보를 찾을 수 있습니다',
      },
      {
        title: '팀 협업',
        description: '조직 단위로 지식을 공유하고 협업하세요',
      },
      {
        title: '보안',
        description: '엔터프라이즈급 보안으로 데이터를 안전하게 보호합니다',
      },
      {
        title: '빠른 성능',
        description: '벡터 DB 기반 고속 검색으로 즉각적인 응답을 제공합니다',
      },
    ],
    useCasesSection: {
      title: '다양한 활용 사례',
      description: 'KL-Store는 다양한 분야에서 활용됩니다',
    },
    useCases: [
      {
        title: '고객 지원',
        description: 'FAQ와 문의 이력을 학습하여 고객 문의에 즉시 답변하세요',
      },
      {
        title: '사내 위키',
        description: '회사의 모든 문서와 지식을 한 곳에서 검색하고 활용하세요',
      },
      {
        title: '제품 문서',
        description: '제품 매뉴얼과 가이드를 AI가 이해하고 사용자에게 설명합니다',
      },
      {
        title: 'API 제공',
        description: '조직의 다양한 서비스와 연동하여 새로운 비즈니스를 창출할 수 있습니다',
      },
    ],
    pricingSection: {
      title: '합리적인 요금제',
      description: '팀의 규모에 맞는 플랜을 선택하세요',
      popular: '인기 플랜',
    },
    plans: [
      {
        name: 'Trial',
        price: '무료',
        priceDetail: '14일 체험',
        description: '테스트용',
        features: ['조직 1개', '관리자 1명', '문서 10개', '저장 공간 1GB', '월 질문 500회', '기본 기능'],
        cta: '무료 체험 시작',
      },
      {
        name: 'Starter',
        price: '₩50,000~',
        priceDetail: '월',
        description: '소규모 팀',
        features: ['사용자 3~5명', '문서 1,000개', '저장 공간 10GB', '월 질문 5,000회', '이메일 지원', 'API 액세스'],
        cta: '시작하기',
      },
      {
        name: 'Pro',
        price: '₩300,000~',
        priceDetail: '월',
        description: '일반 기업팀',
        features: ['사용자 10~20명', '문서 10,000개', '저장 공간 100GB', '월 질문 50,000회', '우선 지원', '고급 분석', '커스텀 모델'],
        cta: '시작하기',
      },
      {
        name: 'Business',
        price: '₩1,500,000~',
        priceDetail: '월',
        description: '부서 단위',
        features: ['사용자 50명', '저장 공간 500GB', '월 질문 300,000회', '승인 워크플로우', '감사 로그', '전담 지원', 'SLA 보장'],
        cta: '시작하기',
      },
      {
        name: 'Enterprise',
        price: '별도 견적',
        priceDetail: '맞춤형',
        description: '대기업/보안',
        features: ['전용 인프라', 'SSO/SAML', '전용 Qdrant', 'SLA 보장', '온프레미스 옵션', '프라이빗 클라우드', '맞춤 개발', '24/7 전담 지원'],
        cta: '견적 문의',
      },
    ],
    cta: {
      title: '지금 바로 시작하세요',
      description: '신용카드 없이 무료로 시작할 수 있습니다',
    },
    modal: {
      title: '준비중입니다',
      descriptionLine1: '곧 서비스를 시작할 예정입니다.',
      descriptionLine2: '조금만 기다려 주세요!',
      confirm: '확인',
      closeLabel: '닫기',
    },
    footer: {
      tagline: 'AI 기반 지식 관리 플랫폼',
      product: '제품',
      resources: '리소스',
      company: '회사',
      features: '기능',
      pricing: '요금제',
      integrations: '통합',
      docs: '문서',
      guides: '가이드',
      blog: '블로그',
      support: '지원',
      about: '회사 소개',
      careers: '채용',
      privacy: '개인정보처리방침',
      terms: '이용약관',
    },
  },
  en: {
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      useCases: 'Use cases',
      docs: 'Docs',
      login: 'Log in',
      startFree: 'Start free',
      languageLabel: 'Select language',
    },
    hero: {
      badge: 'A new standard for AI knowledge management',
      titleLine1: 'Connect your knowledge',
      titleLine2: 'and find answers the',
      titleHighlight: 'smart way',
      description: 'KL-Store searches every document and dataset in your organization with RAG, then delivers the information you need in natural language.',
      viewFeatures: 'View features',
    },
    featuresSection: {
      title: 'Powerful Features',
      description: 'Transform organizational knowledge management with modern AI technology',
    },
    features: [
      {
        title: 'AI-Powered Search',
        description: 'Find accurate answers instantly with RAG technology',
      },
      {
        title: 'Document Management',
        description: 'Upload documents and build a reliable knowledge base',
      },
      {
        title: 'Natural Language Chat',
        description: 'Find information in everyday language without complex queries',
      },
      {
        title: 'Team Collaboration',
        description: 'Share knowledge and collaborate across your organization',
      },
      {
        title: 'Security',
        description: 'Protect your data with enterprise-grade security',
      },
      {
        title: 'Fast Performance',
        description: 'Get immediate responses through high-speed vector database search',
      },
    ],
    useCasesSection: {
      title: 'Built for Many Use Cases',
      description: 'KL-Store helps teams work with knowledge across many domains',
    },
    useCases: [
      {
        title: 'Customer Support',
        description: 'Train on FAQs and support history to answer customer questions instantly',
      },
      {
        title: 'Internal Wiki',
        description: 'Search and use every company document and piece of knowledge in one place',
      },
      {
        title: 'Product Documentation',
        description: 'Help AI understand product manuals and guides, then explain them to users',
      },
      {
        title: 'API Access',
        description: "Connect with your organization's services and create new business workflows",
      },
    ],
    pricingSection: {
      title: 'Straightforward Pricing',
      description: 'Choose the plan that fits your team size',
      popular: 'Popular',
    },
    plans: [
      {
        name: 'Trial',
        price: 'Free',
        priceDetail: '14-day trial',
        description: 'For testing',
        features: ['1 organization', '1 admin', '10 documents', '1GB storage', '500 questions/month', 'Core features'],
        cta: 'Start free trial',
      },
      {
        name: 'Starter',
        price: 'From ₩50,000',
        priceDetail: 'per month',
        description: 'Small teams',
        features: ['3-5 users', '1,000 documents', '10GB storage', '5,000 questions/month', 'Email support', 'API access'],
        cta: 'Get started',
      },
      {
        name: 'Pro',
        price: 'From ₩300,000',
        priceDetail: 'per month',
        description: 'Business teams',
        features: ['10-20 users', '10,000 documents', '100GB storage', '50,000 questions/month', 'Priority support', 'Advanced analytics', 'Custom models'],
        cta: 'Get started',
      },
      {
        name: 'Business',
        price: 'From ₩1,500,000',
        priceDetail: 'per month',
        description: 'Departments',
        features: ['50 users', '500GB storage', '300,000 questions/month', 'Approval workflows', 'Audit logs', 'Dedicated support', 'SLA guarantee'],
        cta: 'Get started',
      },
      {
        name: 'Enterprise',
        price: 'Custom quote',
        priceDetail: 'Tailored',
        description: 'Enterprise and security',
        features: ['Dedicated infrastructure', 'SSO/SAML', 'Dedicated Qdrant', 'SLA guarantee', 'On-premise option', 'Private cloud', 'Custom development', '24/7 dedicated support'],
        cta: 'Contact sales',
      },
    ],
    cta: {
      title: 'Start using KL-Store today',
      description: 'Start free without a credit card',
    },
    modal: {
      title: 'Coming soon',
      descriptionLine1: 'We are preparing to launch the service soon.',
      descriptionLine2: 'Please check back shortly.',
      confirm: 'OK',
      closeLabel: 'Close',
    },
    footer: {
      tagline: 'AI-powered knowledge management platform',
      product: 'Product',
      resources: 'Resources',
      company: 'Company',
      features: 'Features',
      pricing: 'Pricing',
      integrations: 'Integrations',
      docs: 'Docs',
      guides: 'Guides',
      blog: 'Blog',
      support: 'Support',
      about: 'About',
      careers: 'Careers',
      privacy: 'Privacy policy',
      terms: 'Terms of service',
    },
  },
} as const;

const featureVisuals = [
  { icon: Brain, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { icon: FileText, color: 'text-green-600', bgColor: 'bg-green-100' },
  { icon: MessageSquare, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { icon: Users, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { icon: Shield, color: 'text-red-600', bgColor: 'bg-red-100' },
  { icon: Zap, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
];

const useCaseIcons = [MessageSquare, FileText, Brain, Code];

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') {
      return 'ko';
    }

    return window.localStorage.getItem('kl-store-language') === 'en' ? 'en' : 'ko';
  });

  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem('kl-store-language', language);
  }, [language]);

  const showComingSoon = () => setShowComingSoonModal(true);

  const handleLoginClick = () => {
    onLogin();
    showComingSoon();
  };

  const handleGetStartedClick = () => {
    onGetStarted();
    showComingSoon();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Database className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">KL-Store</span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t.nav.features}
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t.nav.pricing}
              </a>
              <a href="#use-cases" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t.nav.useCases}
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t.nav.docs}
              </a>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1" aria-label={t.nav.languageLabel}>
                {(['ko', 'en'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      language === lang
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    aria-pressed={language === lang}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
                className="sm:hidden w-10 h-10 rounded-lg border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label={t.nav.languageLabel}
              >
                <Languages className="w-5 h-5" />
              </button>
              <button
                onClick={handleLoginClick}
                className="px-3 sm:px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                {t.nav.login}
              </button>
              <button
                onClick={handleGetStartedClick}
                className="hidden sm:inline-flex px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t.nav.startFree}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm mb-6">
            <Star className="w-4 h-4" />
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {t.hero.titleLine1}<br />
            {t.hero.titleLine2} <span className="text-blue-600">{t.hero.titleHighlight}</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStartedClick}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg flex items-center gap-2"
            >
              {t.nav.startFree}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg"
            >
              {t.hero.viewFeatures}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.featuresSection.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.featuresSection.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.map((feature, idx) => {
              const visual = featureVisuals[idx];
              const Icon = visual.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  <div className={`w-12 h-12 ${visual.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${visual.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.useCasesSection.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.useCasesSection.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.useCases.map((useCase, idx) => {
              const Icon = useCaseIcons[idx];
              return (
                <div
                  key={useCase.title}
                  className="bg-white p-8 rounded-lg border border-gray-200"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600">
                    {useCase.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.pricingSection.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.pricingSection.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {t.plans.map((plan, idx) => {
              const highlighted = idx === 2;

              return (
                <div
                  key={plan.name}
                  className={`relative rounded-lg border-2 p-6 ${
                    highlighted
                      ? 'border-blue-600 shadow-xl lg:scale-105'
                      : 'border-gray-200'
                  } ${highlighted ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                  {highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full font-medium whitespace-nowrap">
                        {t.pricingSection.popular}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-2">
                      <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                      {plan.priceDetail && (
                        <div className="text-sm text-gray-600 mt-1">{plan.priceDetail}</div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={handleGetStartedClick}
                    className={`w-full py-2.5 text-sm rounded-lg font-medium transition-colors ${
                      highlighted
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            {t.cta.title}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t.cta.description}
          </p>
          <button
            onClick={handleGetStartedClick}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg inline-flex items-center gap-2"
          >
            {t.nav.startFree}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowComingSoonModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label={t.modal.closeLabel}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.modal.title}</h3>
              <p className="text-gray-600 mb-6">
                {t.modal.descriptionLine1}<br />
                {t.modal.descriptionLine2}
              </p>
              <button
                onClick={() => setShowComingSoonModal(false)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t.modal.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-semibold text-white">KL-Store</span>
              </div>
              <p className="text-sm text-gray-400">
                {t.footer.tagline}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">{t.footer.product}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">{t.footer.features}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{t.footer.pricing}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.integrations}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">{t.footer.resources}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.docs}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.guides}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.blog}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.support}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">{t.footer.company}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.about}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.careers}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.privacy}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.terms}</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-sm text-center text-gray-400">
            © 2024 KL-Store. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
