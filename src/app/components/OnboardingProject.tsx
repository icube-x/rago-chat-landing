import { useState } from 'react';
import { Database, FolderCog, FileText, Users, BookOpen, Briefcase } from 'lucide-react';

interface OnboardingProjectProps {
  organizationName: string;
  onComplete: (projectData: {
    name: string;
    description: string;
    template: string;
  }) => void;
  onSkip: () => void;
}

export function OnboardingProject({ organizationName, onComplete, onSkip }: OnboardingProjectProps) {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const [loading, setLoading] = useState(false);

  const templates = [
    {
      id: 'customer-support',
      name: '고객 지원 KB',
      description: 'FAQ와 고객 문의 답변을 관리합니다',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 'product-docs',
      name: '제품 문서',
      description: '제품 가이드와 매뉴얼을 정리합니다',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 'internal-wiki',
      name: '내부 위키',
      description: '회사 내부 문서와 지식을 공유합니다',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      id: 'blank',
      name: '빈 프로젝트',
      description: '처음부터 직접 설정합니다',
      icon: Briefcase,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName.trim()) {
      return;
    }

    setLoading(true);

    try {
      // 실제 API 호출
      // await fetch('/api/projects', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name: projectName, description, template: selectedTemplate }),
      // });

      // Mock: 프로젝트 생성 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));

      onComplete({ name: projectName, description, template: selectedTemplate });
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Database className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-semibold">RAGO-X</h1>
          </div>
        </div>

        {/* Progress */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 mb-2">Step 2 of 2</p>
          <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">첫 프로젝트 만들기</h2>
          <p className="text-gray-600 mb-6">
            <span className="font-medium">{organizationName}</span>에서 사용할 프로젝트를 만듭니다
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프로젝트명 *
              </label>
              <div className="relative">
                <FolderCog className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="예: Customer Support KB"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명 (선택)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                템플릿 선택
              </label>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedTemplate === template.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 ${template.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${template.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                          <p className="text-xs text-gray-600">{template.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onSkip}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                나중에 하기
              </button>
              <button
                type="submit"
                disabled={loading || !projectName}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {loading ? '생성 중...' : '프로젝트 만들기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
