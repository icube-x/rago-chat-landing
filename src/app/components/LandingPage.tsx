import { useEffect, useState } from 'react';
import { Database, Zap, Shield, Users, ArrowRight, Check, MessageSquare, FileText, Brain, Star, ChevronRight, Code, X, Languages } from 'lucide-react';
import { fetchPlanPrices, type PlanPriceCode, type PlanPriceMap } from '@/app/subscription/planPricesApi';

type Language = 'ko' | 'en';

const languageStorageKey = 'kl-store-language';

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
      faq: '자주묻는 질문',
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
        description: '문서형식의 PDF 문서를 업로드해 지식베이스로 만들고 자연어로 검색할 수 있습니다. 현재 PDF, TXT, DOCX 형식의 문서를 지원합니다. 그밖의 다양한 문서형식은 추후 지원예정입니다.',
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
      description: 'RAGO-X는 다양한 분야에서 활용됩니다',
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
    otherUseCasesSection: {
      title: '그밖의 활용사례',
    },
    otherUseCases: [
      {
        title: '연구활동/논문분석',
        description: '논문 및 연구사례 조사',
      },
      {
        title: '법률/규정/컴플라이언스',
        description: '법률, 판례, 내부규정',
      },
      {
        title: '의료/병원',
        description: '의학지식, 논문 기반 질의응답',
      },
      {
        title: '금융/투자',
        description: '시장뉴스 QA, 애널리스트 자료 검색',
      },
      {
        title: '제조/산업',
        description: '설비 메뉴얼 검색, 장애대응, 부품 QA',
      },
      {
        title: '기타',
        description: '조직별 맞춤 지식 검색 및 QA',
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
        features: ['프로젝트 1개', '문서함(캐비닛) 1개', '문서 5개', '저장 공간 30MB', '질문 50회', '제한된 관리자 기능'],
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
    faqSection: {
      title: '자주묻는 질문',
      description: 'RAGO-X 도입 전에 많이 궁금해하는 내용을 정리했습니다',
    },
    faqs: [
      {
        question: 'RAGO-X는 어떤 문서를 검색할 수 있나요?',
        answer: '문서형식의 PDF 문서를 업로드해 지식베이스로 만들고 자연어로 검색할 수 있습니다. 현재 PDF, TXT, DOCX 형식의 문서를 지원합니다. 그밖의 다양한 문서형식은 추후 지원예정입니다.',
      },
      {
        question: '답변의 근거를 확인할 수 있나요?',
        answer: '네. AI가 생성한 답변이 어떤 원문과 청크를 기반으로 했는지 함께 확인할 수 있어 검토와 품질 관리가 쉽습니다.',
      },
      {
        question: '팀별로 권한을 나눠 관리할 수 있나요?',
        answer: '조직, 프로젝트, 캐비닛 단위로 사용자와 권한을 관리할 수 있어 부서별 지식 운영에 적합합니다.',
      },
      {
        question: '기존 서비스와 연동할 수 있나요?',
        answer: 'API 액세스를 통해 내부 시스템, 업무 도구, 고객 지원 채널 등과 연동하는 워크플로우를 구성할 수 있습니다.',
      },
      {
        question: '무료로 체험할 수 있나요?',
        answer: 'Trial 플랜으로 신용카드 없이 14일 동안 주요 기능을 테스트할 수 있습니다.',
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
      about: '회사소개',
      careers: '채용',
      privacy: '개인정보처리방침',
      terms: '서비스 이용약관',
      customerCenter: '고객센터',
      businessInfo: {
        companyService: '회사명: 아이큐브엑스 | 서비스명: RAGO-X',
        ceo: '대표자: 이상원',
        address: '사업장 주소: 서울시 서초구 사임당로8길13, 4층 402-740A호',
        businessNumber: '사업자등록번호: 282-48-01199',
        mailOrderNumber: '통신판매업 신고번호: 제2026-서울서초-2466호',
        contact: '고객센터: support@icube-x.com',
        privacyOfficer: '개인정보 보호책임자: 이상원',
      },
    },
  },
  en: {
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      useCases: 'Use cases',
      docs: 'Docs',
      faq: 'FAQ',
      login: 'Log in',
      startFree: 'Start free',
      languageLabel: 'Select language',
    },
    hero: {
      badge: 'A new standard for AI knowledge management',
      titleLine1: 'Connect your knowledge',
      titleLine2: 'and find answers the',
      titleHighlight: 'smart way',
      description: 'RAGO-X searches every document and dataset in your organization with RAG, then delivers the information you need in natural language.',
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
      description: 'RAGO-X helps teams work with knowledge across many domains',
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
    otherUseCasesSection: {
      title: 'Other Use Cases',
    },
    otherUseCases: [
      {
        title: 'Research / Paper Analysis',
        description: 'Search papers and research cases',
      },
      {
        title: 'Legal / Policy / Compliance',
        description: 'Laws, precedents, and internal policies',
      },
      {
        title: 'Healthcare / Hospitals',
        description: 'Medical knowledge and paper-based Q&A',
      },
      {
        title: 'Finance / Investment',
        description: 'Market news Q&A and analyst report search',
      },
      {
        title: 'Manufacturing / Industry',
        description: 'Equipment manual search, issue response, and parts Q&A',
      },
      {
        title: 'Other',
        description: 'Custom knowledge search and Q&A workflows',
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
        features: ['1 project', '1 document cabinet', '5 documents', '30MB storage', '50 questions', 'Limited admin features'],
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
    faqSection: {
      title: 'Frequently Asked Questions',
      description: 'Answers to common questions before adopting RAGO-X',
    },
    faqs: [
      {
        question: 'What documents can RAGO-X search?',
        answer: 'Teams can upload common document formats such as PDF, HWP, DOCX, and TXT, then turn them into a searchable knowledge base.',
      },
      {
        question: 'Can I inspect the evidence behind an answer?',
        answer: 'Yes. RAGO-X shows the source text and chunks used to generate an AI answer, which helps teams review quality and trust the result.',
      },
      {
        question: 'Can permissions be managed by team?',
        answer: 'You can manage users and permissions by organization, project, and cabinet, making it suitable for department-level knowledge operations.',
      },
      {
        question: 'Can it integrate with existing services?',
        answer: 'API access lets you connect RAGO-X with internal systems, work tools, support channels, and custom workflows.',
      },
      {
        question: 'Is there a free trial?',
        answer: 'The Trial plan lets you test the main features for 14 days without a credit card.',
      },
    ],
    cta: {
      title: 'Start using RAGO-X today',
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
      customerCenter: 'Customer support',
      businessInfo: {
        companyService: 'Company: icube-x | Service: RAGO-X',
        ceo: 'Representative: Sangwon Lee',
        address: 'Address: 4F 402-740A, 13 Saimdang-ro 8-gil, Seocho-gu, Seoul, Korea',
        businessNumber: 'Business registration no.: 282-48-01199',
        mailOrderNumber: 'Mail-order business registration: Not yet registered',
        contact: 'Support: support@icube-x.com',
        privacyOfficer: 'Privacy officer: Sangwon Lee',
      },
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

const planPriceCodeByName: Partial<Record<string, PlanPriceCode>> = {
  Starter: 'starter',
  Pro: 'pro',
  Business: 'business',
};

const screenshotShowcase = {
  ko: {
    eyebrow: '서비스 미리보기',
    title: '실제 화면으로 확인하는 RAGO-X',
    description: '문서 업로드부터 RAG 실행, 답변 근거 확인, 운영 관리까지 핵심 흐름을 자동으로 살펴보세요.',
    items: [
      {
        title: '대시보드',
        description: '조직의 지식베이스 현황과 주요 사용 지표를 한 화면에서 확인합니다.',
        image: '/screen_images_kr/dashboard.jpg',
      },
      {
        title: '문서 관리',
        description: '업로드된 문서를 분류하고 처리 상태를 관리해 검색 가능한 지식으로 전환합니다.',
        image: '/screen_images_kr/documents.jpg',
      },
      {
        title: 'RAG 실행',
        description: '실제 문서 기반으로 질문을 테스트하고 답변 품질을 빠르게 검증합니다.',
        image: '/screen_images_kr/rag-test.jpg',
      },
      {
        title: '사용자 화면',
        description: '사용자 관점에서 답변과 관련 정보를 살펴보는 흐름을 확인합니다.',
        image: '/screen_images_kr/user-screen.jpg',
      },
      {
        title: '답변 근거',
        description: 'AI 답변이 어떤 원문과 청크를 근거로 생성됐는지 투명하게 추적합니다.',
        image: '/screen_images_kr/rag-evidence.jpg',
      },
      {
        title: 'QA 관리',
        description: '질문과 답변 이력을 관리하고 평가 흐름을 통해 서비스 품질을 개선합니다.',
        image: '/screen_images_kr/qa.jpg',
      },
      {
        title: '사용자 관리',
        description: '조직 구성원과 권한을 관리해 팀 단위로 안전하게 지식을 운영합니다.',
        image: '/screen_images_kr/users.jpg',
      },
    ],
  },
  en: {
    eyebrow: 'Product Preview',
    title: 'See RAGO-X in Real Screens',
    description: 'Walk through the core flow from document upload to RAG testing, answer evidence, and admin operations.',
    items: [
      {
        title: 'Dashboard',
        description: 'Track knowledge base status and key usage signals from a single operational view.',
        image: '/screen_images_en/Dashboard.jpg',
      },
      {
        title: 'Document Management',
        description: 'Organize uploaded files and turn processed documents into searchable knowledge.',
        image: '/screen_images_en/Documents.jpg',
      },
      {
        title: 'RAG Testing',
        description: 'Test questions against real documents and validate response quality quickly.',
        image: '/screen_images_en/RAG Test.jpg',
      },
      {
        title: 'AI RAG Chatting',
        description: 'Ask questions in natural language and get grounded answers from connected documents.',
        image: '/screen_images_en/AI RAG chatting.jpg',
      },
      {
        title: 'Project Management',
        description: 'Create projects and organize knowledge work by team or service.',
        image: '/screen_images_en/Projects.jpg',
      },
      {
        title: 'Cabinet Management',
        description: 'Configure document repositories and vector database settings per cabinet.',
        image: '/screen_images_en/Cabinets.jpg',
      },
      {
        title: 'QA Management',
        description: 'Manage question history and improve quality through review workflows.',
        image: '/screen_images_en/QA.jpg',
      },
      {
        title: 'User Management',
        description: 'Control members and permissions so teams can operate knowledge securely.',
        image: '/screen_images_en/Users.jpg',
      },
    ],
  },
} as const;

function detectInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const savedLanguage = window.localStorage.getItem(languageStorageKey);
  if (savedLanguage === 'ko' || savedLanguage === 'en') {
    return savedLanguage;
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const languages = navigator.languages.length ? navigator.languages : [navigator.language];
  const hasKoreanLocale = languages.some((locale) => locale.toLowerCase().indexOf('ko') === 0);

  return timezone === 'Asia/Seoul' || hasKoreanLocale ? 'ko' : 'en';
}

function getLanguageCode(language: Language): string {
  return language === 'ko' ? 'ko-KR' : 'en-US';
}

function getPlanPrice(planName: string, fallbackPrice: string, planPrices: PlanPriceMap): string {
  const planCode = planPriceCodeByName[planName];
  return planCode ? planPrices[planCode] ?? fallbackPrice : fallbackPrice;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [language, setLanguage] = useState<Language>(detectInitialLanguage);
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [planPrices, setPlanPrices] = useState<PlanPriceMap>({});

  const t = translations[language];
  const showcase = screenshotShowcase[language];
  const currentScreenshot = showcase.items[activeScreenshot];

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(languageStorageKey, language);
  }, [language]);

  useEffect(() => {
    let ignore = false;

    fetchPlanPrices(getLanguageCode(language))
      .then((prices) => {
        if (!ignore) {
          setPlanPrices(prices);
        }
      })
      .catch(() => {
        if (!ignore) {
          setPlanPrices({});
        }
      });

    return () => {
      ignore = true;
    };
  }, [language]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveScreenshot((index) => (index + 1) % showcase.items.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [showcase.items.length]);

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
            <div className="flex items-center">
              <img
                src="/rago-x-logo.png"
                alt="RAGO-X"
                className="h-10 w-auto"
              />
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
              <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t.nav.faq}
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

      {/* Product Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-4">
              {showcase.eyebrow}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {showcase.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {showcase.description}
            </p>
          </div>

          <div className="relative">
            <div className="max-w-[90%] mx-auto">
            <div className="rounded-lg border border-gray-200 bg-gray-950 p-2 shadow-2xl">
              <div className="flex items-center gap-1.5 px-3 py-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-gray-100">
                {showcase.items.map((item, index) => (
                  <img
                    key={item.image}
                    src={item.image}
                    alt={item.title}
                    className={`absolute inset-0 h-full w-full object-contain transition-all duration-700 ease-out ${
                      index === activeScreenshot
                        ? 'opacity-100 translate-x-0 scale-100'
                        : 'opacity-0 translate-x-4 scale-[1.01]'
                    }`}
                  />
                ))}
              </div>
            </div>
            </div>

            <div className="mt-6 text-center min-h-[76px]">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{currentScreenshot.title}</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">{currentScreenshot.description}</p>
            </div>

            <div className="mt-8 overflow-x-auto pb-2" aria-label={showcase.eyebrow}>
              <div className="flex gap-3 min-w-max px-1">
                {showcase.items.map((item, index) => {
                  const selected = index === activeScreenshot;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setActiveScreenshot(index)}
                      className={`w-40 flex-shrink-0 rounded-lg border p-1 text-left transition-all ${
                        selected
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      aria-current={selected}
                    >
                      <span className="block aspect-[16/10] overflow-hidden rounded-md bg-gray-100">
                        <img
                          src={item.image}
                          alt=""
                          className="h-full w-full object-contain"
                          aria-hidden="true"
                        />
                      </span>
                      <span className={`block truncate px-2 py-2 text-sm font-medium ${
                        selected ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {item.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
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

          <div className="mt-14">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {t.otherUseCasesSection.title}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {t.otherUseCases.map((useCase) => (
                <div
                  key={useCase.title}
                  className="bg-white p-5 rounded-lg border border-gray-200 flex items-start gap-3"
                >
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {useCase.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
              const displayedPrice = getPlanPrice(plan.name, plan.price, planPrices);

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
                      <span className="text-2xl font-bold text-gray-900">{displayedPrice}</span>
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

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t.faqSection.title}
            </h2>
            <p className="text-xl text-gray-600">
              {t.faqSection.description}
            </p>
          </div>

          <div className="space-y-4">
            {t.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border border-gray-200 bg-white p-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                  <span className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </span>
                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-500 transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
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
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between mb-8">
            <div>
              <div className="inline-flex items-center mb-4 rounded-md bg-white px-3 py-2">
                <img
                  src="/rago-x-logo.png"
                  alt="RAGO-X"
                  className="h-9 w-auto"
                />
              </div>
              <p className="text-sm text-gray-400">
                {t.footer.tagline}
              </p>
            </div>

            <nav aria-label={t.footer.company}>
              <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm md:justify-end">
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.about}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.careers}</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">{t.footer.privacy}</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">{t.footer.terms}</a></li>
                <li><a href="/support" className="hover:text-white transition-colors">{t.footer.customerCenter}</a></li>
              </ul>
            </nav>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="mb-6 grid gap-2 text-xs leading-6 text-gray-400 sm:grid-cols-2 lg:grid-cols-3">
              {Object.values(t.footer.businessInfo).map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>

            <div className="text-center text-sm text-gray-400">
              © 2026 icube-x / RAGO-X. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
