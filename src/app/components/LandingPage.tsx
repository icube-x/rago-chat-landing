import { useState } from 'react';
import { Database, Zap, Shield, Users, ArrowRight, Check, MessageSquare, FileText, Brain, Star, ChevronRight, Code, X } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const features = [
    {
      icon: Brain,
      title: 'AI 기반 검색',
      description: 'RAG 기술로 정확한 답변을 즉시 찾아드립니다',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: FileText,
      title: '문서 관리',
      description: '문서를 업로드하고 지식기반을 구축합니다',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: MessageSquare,
      title: '자연어 대화',
      description: '복잡한 쿼리 없이 일상 언어로 정보를 찾을 수 있습니다',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: Users,
      title: '팀 협업',
      description: '조직 단위로 지식을 공유하고 협업하세요',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: Shield,
      title: '보안',
      description: '엔터프라이즈급 보안으로 데이터를 안전하게 보호합니다',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      icon: Zap,
      title: '빠른 성능',
      description: '벡터 DB 기반 고속 검색으로 즉각적인 응답을 제공합니다',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  const plans = [
    {
      name: 'Trial',
      price: '무료',
      priceDetail: '14일 체험',
      description: '테스트용',
      features: [
        '조직 1개',
        '관리자 1명',
        '문서 10개',
        '저장 공간 1GB',
        '월 질문 500회',
        '기본 기능',
      ],
      cta: '무료 체험 시작',
      highlighted: false,
    },
    {
      name: 'Starter',
      price: '₩50,000~',
      priceDetail: '월',
      description: '소규모 팀',
      features: [
        '사용자 3~5명',
        '문서 1,000개',
        '저장 공간 10GB',
        '월 질문 5,000회',
        '이메일 지원',
        'API 액세스',
      ],
      cta: '시작하기',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '₩300,000~',
      priceDetail: '월',
      description: '일반 기업팀',
      features: [
        '사용자 10~20명',
        '문서 10,000개',
        '저장 공간 100GB',
        '월 질문 50,000회',
        '우선 지원',
        '고급 분석',
        '커스텀 모델',
      ],
      cta: '시작하기',
      highlighted: true,
    },
    {
      name: 'Business',
      price: '₩1,500,000~',
      priceDetail: '월',
      description: '부서 단위',
      features: [
        '사용자 50명',
        '저장 공간 500GB',
        '월 질문 300,000회',
        '승인 워크플로우',
        '감사 로그',
        '전담 지원',
        'SLA 보장',
      ],
      cta: '시작하기',
      highlighted: false,
    },
    {
      name: 'Enterprise',
      price: '별도 견적',
      priceDetail: '맞춤형',
      description: '대기업/보안',
      features: [
        '전용 인프라',
        'SSO/SAML',
        '전용 Qdrant',
        'SLA 보장',
        '온프레미스 옵션',
        '프라이빗 클라우드',
        '맞춤 개발',
        '24/7 전담 지원',
      ],
      cta: '견적 문의',
      highlighted: false,
    },
  ];

  const useCases = [
    {
      title: '고객 지원',
      description: 'FAQ와 문의 이력을 학습하여 고객 문의에 즉시 답변하세요',
      icon: MessageSquare,
    },
    {
      title: '사내 위키',
      description: '회사의 모든 문서와 지식을 한 곳에서 검색하고 활용하세요',
      icon: FileText,
    },
    {
      title: '제품 문서',
      description: '제품 매뉴얼과 가이드를 AI가 이해하고 사용자에게 설명합니다',
      icon: Brain,
    },
    {
      title: 'API 제공',
      description: '조직의 다양한 서비스와 연동하여 새로운 비즈니스를 창출할 수 있습니다',
      icon: Code,
    },
  ];


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
                기능
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                요금제
              </a>
              <a href="#use-cases" className="text-gray-600 hover:text-gray-900 transition-colors">
                활용 사례
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                문서
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowComingSoonModal(true)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                로그인
              </button>
              <button
                onClick={() => setShowComingSoonModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                무료로 시작하기
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
            <span>AI 기반 지식 관리의 새로운 기준</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            지식을 연결하고<br />
            답을 찾는 가장 <span className="text-blue-600">스마트한 방법</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            RAG 기술로 조직의 모든 문서와 데이터를 검색하여,
            필요한 정보를 자연어로 즉시 찾아드립니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowComingSoonModal(true)}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg flex items-center gap-2"
            >
              무료로 시작하기
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg"
            >
              기능 보기
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              강력한 기능
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              최신 AI 기술로 조직의 지식 관리를 혁신하세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
                >
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
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
              다양한 활용 사례
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              KL-Store는 다양한 분야에서 활용됩니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, idx) => {
              const Icon = useCase.icon;
              return (
                <div
                  key={idx}
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
              합리적인 요금제
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              팀의 규모에 맞는 플랜을 선택하세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative rounded-lg border-2 p-6 ${
                  plan.highlighted
                    ? 'border-blue-600 shadow-xl lg:scale-105'
                    : 'border-gray-200'
                } ${plan.highlighted ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full font-medium">
                      인기 플랜
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
                  {plan.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setShowComingSoonModal(true)}
                  className={`w-full py-2.5 text-sm rounded-lg font-medium transition-colors ${
                    plan.highlighted
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            신용카드 없이 무료로 시작할 수 있습니다
          </p>
          <button
            onClick={() => setShowComingSoonModal(true)}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg inline-flex items-center gap-2"
          >
            무료로 시작하기
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
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">준비중입니다</h3>
              <p className="text-gray-600 mb-6">
                곧 서비스를 시작할 예정입니다.<br />
                조금만 기다려 주세요!
              </p>
              <button
                onClick={() => setShowComingSoonModal(false)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                확인
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
                AI 기반 지식 관리 플랫폼
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">제품</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">기능</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">요금제</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">통합</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">리소스</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">문서</a></li>
                <li><a href="#" className="hover:text-white transition-colors">가이드</a></li>
                <li><a href="#" className="hover:text-white transition-colors">블로그</a></li>
                <li><a href="#" className="hover:text-white transition-colors">지원</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">회사</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">회사 소개</a></li>
                <li><a href="#" className="hover:text-white transition-colors">채용</a></li>
                <li><a href="#" className="hover:text-white transition-colors">개인정보처리방침</a></li>
                <li><a href="#" className="hover:text-white transition-colors">이용약관</a></li>
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
