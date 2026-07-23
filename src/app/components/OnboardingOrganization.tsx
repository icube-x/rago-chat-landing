import { useState, useEffect } from 'react';
import { Database, Building2, Link2, Check, AlertCircle } from 'lucide-react';

interface OnboardingOrganizationProps {
  initialOrganizationName?: string;
  onComplete: (organizationData: {
    name: string;
    slug: string;
    plan: 'TRIAL' | 'STARTER' | 'PRO';
  }) => void;
  onSkip: () => void;
}

export function OnboardingOrganization({ initialOrganizationName = '', onComplete, onSkip }: OnboardingOrganizationProps) {
  const [organizationName, setOrganizationName] = useState(initialOrganizationName);
  const [slug, setSlug] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'TRIAL' | 'STARTER' | 'PRO'>('TRIAL');
  const [slugError, setSlugError] = useState('');
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [loading, setLoading] = useState(false);

  // 조직명에서 자동으로 슬러그 생성
  useEffect(() => {
    if (organizationName) {
      const autoSlug = organizationName
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(autoSlug);
    }
  }, [organizationName]);

  // 슬러그 중복 체크
  useEffect(() => {
    if (!slug) {
      setSlugError('');
      return;
    }

    const checkSlug = async () => {
      setIsCheckingSlug(true);
      setSlugError('');

      try {
        // 실제 API 호출
        // const response = await fetch(`/api/organizations/check-slug?slug=${slug}`);
        // const data = await response.json();

        // Mock: 슬러그 체크 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 300));

        // Mock: "test"는 이미 사용 중이라고 가정
        if (slug === 'test') {
          setSlugError('이미 사용 중인 슬러그입니다.');
        }
      } catch (err) {
        console.error('Failed to check slug:', err);
      } finally {
        setIsCheckingSlug(false);
      }
    };

    const timer = setTimeout(checkSlug, 500);
    return () => clearTimeout(timer);
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!organizationName.trim()) {
      return;
    }

    if (!slug.trim()) {
      return;
    }

    if (slugError) {
      return;
    }

    setLoading(true);

    try {
      // 실제 API 호출
      // await fetch('/api/organizations', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name: organizationName, slug, plan: selectedPlan }),
      // });

      // Mock: 조직 생성 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));

      onComplete({ name: organizationName, slug, plan: selectedPlan });
    } catch (err) {
      console.error('Failed to create organization:', err);
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'TRIAL' as const,
      name: 'Trial',
      price: '무료 (14일)',
      recommended: true,
      features: [
        '조직 1개',
        '관리자 1명',
        '문서 50개',
        '저장 1GB',
        '월 질문 500회',
      ],
    },
    {
      id: 'STARTER' as const,
      name: 'Starter',
      price: '₩50,000~/월',
      features: [
        '사용자 3~5명',
        '문서 1,000개',
        '저장 10GB',
        '월 질문 5,000회',
        '이메일 지원',
      ],
    },
    {
      id: 'PRO' as const,
      name: 'Pro',
      price: '₩300,000~/월',
      features: [
        '사용자 10~20명',
        '문서 10,000개',
        '저장 100GB',
        '월 질문 50,000회',
        '우선 지원',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Database className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-semibold">RAGO-X</h1>
          </div>
        </div>

        {/* Progress */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 mb-2">Step 1 of 2</p>
          <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">조직 만들기</h2>
          <p className="text-gray-600 mb-6">팀과 함께 사용할 조직을 생성합니다</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                조직명 *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="예: Acme Corporation"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                조직 슬러그 (URL) *
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase())}
                  placeholder="acme-corp"
                  required
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    slugError ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {isCheckingSlug && (
                <p className="mt-1 text-xs text-gray-500">슬러그 확인 중...</p>
              )}
              {slugError && (
                <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  {slugError}
                </div>
              )}
              {!slugError && !isCheckingSlug && slug && (
                <p className="mt-1 text-xs text-gray-500">
                  조직의 고유 URL: {slug}.rago-x.chat
                </p>
              )}
            </div>

            {/* Plan Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                플랜 선택 *
              </label>
              <div className="grid grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                      selectedPlan === plan.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
                          추천
                        </span>
                      </div>
                    )}

                    {selectedPlan === plan.id && (
                      <div className="absolute top-3 right-3">
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}

                    <div className="mb-2">
                      <h3 className="font-semibold text-lg">{plan.name}</h3>
                      <p className="text-sm text-gray-600">{plan.price}</p>
                    </div>

                    <ul className="space-y-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                          <Check className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onSkip}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                건너뛰기
              </button>
              <button
                type="submit"
                disabled={loading || !organizationName || !slug || !!slugError || isCheckingSlug}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {loading ? '생성 중...' : '다음'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
