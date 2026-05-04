import { X, Database, Calendar, Info } from 'lucide-react';

interface ProjectInfo {
  id: string;
  name: string;
  uuid: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

interface ProjectModalProps {
  projectInfo: ProjectInfo;
  onClose: () => void;
}

export function ProjectModal({ projectInfo, onClose }: ProjectModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 sticky top-0 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-base">{projectInfo.name}</h3>
              <p className="text-xs text-gray-500">프로젝트 설정</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Basic Info */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-900 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-blue-600" />
              기본 정보
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded px-3 py-2">
                <p className="text-xs text-gray-500 mb-1">Project ID</p>
                <code className="text-xs font-mono text-gray-900">{projectInfo.id}</code>
              </div>
              <div className="bg-gray-50 rounded px-3 py-2">
                <p className="text-xs text-gray-500 mb-1">UUID</p>
                <code className="text-xs font-mono text-gray-900">{projectInfo.uuid}</code>
              </div>
              <div className="bg-gray-50 rounded px-3 py-2 col-span-2">
                <p className="text-xs text-gray-500 mb-1">활성 상태</p>
                <div className="flex items-center gap-1.5">
                  {projectInfo.isActive ? (
                    <>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-green-700">활성</span>
                    </>
                  ) : (
                    <>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-700">비활성</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {projectInfo.description && (
            <div>
              <h4 className="text-sm font-semibold mb-2 text-gray-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-purple-600" />
                설명
              </h4>
              <div className="bg-purple-50 rounded px-3 py-2 border border-purple-200">
                <p className="text-sm text-gray-700">{projectInfo.description}</p>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-green-600" />
              생성 및 수정 일시
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 rounded px-3 py-2 border border-green-200">
                <p className="text-xs text-gray-500 mb-1">생성일</p>
                <p className="text-xs font-medium text-gray-900">{projectInfo.createdAt}</p>
              </div>
              <div className="bg-blue-50 rounded px-3 py-2 border border-blue-200">
                <p className="text-xs text-gray-500 mb-1">최종 수정일</p>
                <p className="text-xs font-medium text-gray-900">{projectInfo.updatedAt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
