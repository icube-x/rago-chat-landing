import { X, Database, HardDrive, Folder, Sparkles } from 'lucide-react';

interface CabinetInfo {
  id: string;
  name: string;
  projectId: string;
  uuid: string;
  storageType: string;
  storageRootPath: string;
  storagePath: string;
  vectorStore: string;
  collectionName: string;
  embeddingModel: string;
  embeddingDim: number;
  isActive: boolean;
}

interface CabinetModalProps {
  cabinetInfo: CabinetInfo;
  onClose: () => void;
}

export function CabinetModal({ cabinetInfo, onClose }: CabinetModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 sticky top-0 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="font-semibold text-base">{cabinetInfo.name}</h3>
              <p className="text-xs text-gray-500">캐비닛 설정</p>
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
              <Database className="w-4 h-4 text-purple-600" />
              기본 정보
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded px-3 py-2">
                <p className="text-xs text-gray-500 mb-1">Cabinet ID</p>
                <code className="text-xs font-mono text-gray-900">{cabinetInfo.id}</code>
              </div>
              <div className="bg-gray-50 rounded px-3 py-2">
                <p className="text-xs text-gray-500 mb-1">UUID</p>
                <code className="text-xs font-mono text-gray-900">{cabinetInfo.uuid}</code>
              </div>
              <div className="bg-gray-50 rounded px-3 py-2">
                <p className="text-xs text-gray-500 mb-1">Project ID</p>
                <code className="text-xs font-mono text-gray-900">{cabinetInfo.projectId}</code>
              </div>
              <div className="bg-gray-50 rounded px-3 py-2">
                <p className="text-xs text-gray-500 mb-1">활성 상태</p>
                <div className="flex items-center gap-1.5">
                  {cabinetInfo.isActive ? (
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

          {/* Storage Settings */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-900 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-blue-600" />
              저장소 설정
            </h4>
            <div className="space-y-2">
              <div className="bg-blue-50 rounded px-3 py-2 border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-700">Storage Type</span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-blue-600 text-white rounded">
                    {cabinetInfo.storageType}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded px-3 py-2">
                <p className="text-xs text-gray-500 mb-1">Base Path</p>
                <code className="text-xs font-mono text-blue-600 break-all">
                  {cabinetInfo.storageRootPath}
                </code>
              </div>
              <div className="bg-gray-50 rounded px-3 py-2">
                <p className="text-xs text-gray-500 mb-1">Upload Path</p>
                <code className="text-xs font-mono text-blue-600 break-all">
                  {cabinetInfo.storagePath}
                </code>
              </div>
            </div>
          </div>

          {/* Vector Store Settings */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-900 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-green-600" />
              벡터 데이터베이스
            </h4>
            <div className="space-y-2">
              <div className="bg-green-50 rounded px-3 py-2 border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-700">Vector Store</span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-green-600 text-white rounded">
                    {cabinetInfo.vectorStore}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 rounded px-3 py-2">
                <p className="text-xs text-gray-500 mb-1">Collection Name</p>
                <code className="text-xs font-mono text-purple-600 break-all">
                  {cabinetInfo.collectionName}
                </code>
              </div>
            </div>
          </div>

          {/* Embedding Model Settings */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-600" />
              임베딩 모델
            </h4>
            <div className="space-y-2">
              <div className="bg-orange-50 rounded px-3 py-2 border border-orange-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-700">Embedding Model</span>
                  <code className="text-xs font-mono font-semibold text-orange-700">
                    {cabinetInfo.embeddingModel}
                  </code>
                </div>
              </div>
              <div className="bg-gray-50 rounded px-3 py-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-700">Vector Dimension</span>
                  <span className="text-sm font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                    {cabinetInfo.embeddingDim}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}