import { useState } from 'react';
import { Folder, Save, Database, HardDrive, Settings, Plus, X, Info, Trash2 } from 'lucide-react';

interface Cabinet {
  id: number;
  projectId: number;
  cabinetUuid: string;
  cabinetName: string;
  storageType: string;
  storageRootPath: string;
  storagePath: string;
  // S3 specific
  s3BucketName?: string;
  s3Region?: string;
  s3AccessKeyId?: string;
  s3SecretAccessKey?: string;
  s3Endpoint?: string;
  // GCS specific
  gcsBucketName?: string;
  gcsProjectId?: string;
  gcsServiceAccountJson?: string;
  // MinIO specific
  minioEndpoint?: string;
  minioAccessKey?: string;
  minioSecretKey?: string;
  minioBucketName?: string;
  minioUseSSL?: boolean;
  vectorStore: string;
  collectionName: string;
  systemProfileId: string;
  embeddingModelName: string;
  embeddingDim: number;
  isActive: boolean;
}

interface SystemProfile {
  id: string;
  name: string;
  description: string;
  llmModelConfigId: string;
  embeddingModelConfigId: string;
  isActive: boolean;
}

interface Model {
  id: string;
  modelType: 'LLM' | 'EMBEDDING';
  provider: string;
  modelName: string;
  dimension?: number;
}

interface EmbeddingConfig {
  id: string;
  modelId: string;
  chunkSize: number;
  overlap: number;
}

export function CabinetSettings({ cabinetId }: { cabinetId: string }) {
  // Mock system profiles data
  const systemProfiles: SystemProfile[] = [
    {
      id: 'sp-1',
      name: 'Production Profile',
      description: 'GPT-4 + OpenAI Embedding',
      llmModelConfigId: 'llm-1',
      embeddingModelConfigId: 'emb-1',
      isActive: true
    },
    {
      id: 'sp-2',
      name: 'Development Profile',
      description: 'GPT-3.5 + Small Embedding',
      llmModelConfigId: 'llm-2',
      embeddingModelConfigId: 'emb-2',
      isActive: true
    },
    {
      id: 'sp-3',
      name: 'High Quality Profile',
      description: 'GPT-4 + Large Embedding',
      llmModelConfigId: 'llm-1',
      embeddingModelConfigId: 'emb-3',
      isActive: true
    }
  ];

  const models: Model[] = [
    { id: '3', modelType: 'EMBEDDING', provider: 'OpenAI', modelName: 'text-embedding-3-small', dimension: 1536 },
    { id: '4', modelType: 'EMBEDDING', provider: 'OpenAI', modelName: 'text-embedding-3-large', dimension: 3072 }
  ];

  const embeddingConfigs: EmbeddingConfig[] = [
    { id: 'emb-1', modelId: '3', chunkSize: 512, overlap: 50 },
    { id: 'emb-2', modelId: '3', chunkSize: 256, overlap: 25 },
    { id: 'emb-3', modelId: '4', chunkSize: 1024, overlap: 100 }
  ];

  // Get embedding model info from system profile
  const getEmbeddingInfoFromProfile = (profileId: string) => {
    const profile = systemProfiles.find(p => p.id === profileId);
    if (!profile) return { modelName: '', dimension: 0 };
    
    const embConfig = embeddingConfigs.find(c => c.id === profile.embeddingModelConfigId);
    if (!embConfig) return { modelName: '', dimension: 0 };
    
    const model = models.find(m => m.id === embConfig.modelId);
    return {
      modelName: model?.modelName || '',
      dimension: model?.dimension || 0
    };
  };

  const [cabinet, setCabinet] = useState<Cabinet>({
    id: 1,
    projectId: 1,
    cabinetUuid: 'cab-uuid-1234-5678',
    cabinetName: 'Main Cabinet',
    storageType: 'local',
    storageRootPath: '/',
    storagePath: '/data/documents',
    vectorStore: 'qdrant',
    collectionName: 'main_collection',
    systemProfileId: 'sp-1',
    embeddingModelName: 'text-embedding-3-small',
    embeddingDim: 1536,
    isActive: true
  });

  const [saved, setSaved] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCreateConfirmModal, setShowCreateConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [newCabinet, setNewCabinet] = useState<Partial<Cabinet>>({
    projectId: 1,
    cabinetName: '',
    storageType: 'minio',
    storageRootPath: '/',
    storagePath: '/data/documents',
    vectorStore: 'qdrant',
    collectionName: '',
    systemProfileId: 'sp-1',
    embeddingModelName: 'text-embedding-3-small',
    embeddingDim: 1536,
    isActive: true
  });

  const handleSave = () => {
    setSaved(true);
    setShowConfirmModal(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleConfirmSave = () => {
    // 실제로는 API 호출로 캐비닛 설정 업데이트
    console.log('Updating cabinet:', cabinet);
    handleSave();
  };

  const handleSystemProfileChange = (profileId: string, isNew: boolean = false) => {
    const embInfo = getEmbeddingInfoFromProfile(profileId);
    if (isNew) {
      setNewCabinet({
        ...newCabinet,
        systemProfileId: profileId,
        embeddingModelName: embInfo.modelName,
        embeddingDim: embInfo.dimension
      });
    }
  };

  const handleCreateCabinet = () => {
    // 실제로는 API 호출로 캐비닛 생성
    console.log('Creating new cabinet:', newCabinet);
    setShowCreateModal(false);
    setShowCreateConfirmModal(false);
    // 폼 초기화
    setNewCabinet({
      projectId: 1,
      cabinetName: '',
      storageType: 'minio',
      storageRootPath: '/',
      storagePath: '/data/documents',
      vectorStore: 'qdrant',
      collectionName: '',
      systemProfileId: 'sp-1',
      embeddingModelName: 'text-embedding-3-small',
      embeddingDim: 1536,
      isActive: true
    });
  };

  const handleCreateConfirm = () => {
    setShowCreateConfirmModal(true);
  };

  const handleDeleteCabinet = () => {
    // 실제로는 API 호출로 캐비닛 삭제
    console.log('Deleting cabinet:', cabinet);
    setShowDeleteModal(false);
    // 삭제 후 캐비닛 목록으로 이동하거나 다른 처리
  };

  const handleDeactivateCabinet = () => {
    // 캐비닛 비활성화 처리
    setCabinet({ ...cabinet, isActive: false });
    setShowDeactivateModal(false);
  };

  const handleActivateCabinet = () => {
    // 캐비닛 활성화 처리
    setCabinet({ ...cabinet, isActive: true });
    setShowActivateModal(false);
  };

  // 캐비닛 생성 폼 유효성 검사
  const isCreateFormValid = () => {
    // MinIO 필수 필드 체크
    if (!newCabinet.cabinetName || 
        !newCabinet.collectionName || 
        !newCabinet.minioEndpoint ||
        !newCabinet.minioAccessKey ||
        !newCabinet.minioSecretKey ||
        !newCabinet.systemProfileId) {
      return false;
    }
    
    return true;
  };

  // Get current profile info for display
  const currentProfile = systemProfiles.find(p => p.id === cabinet.systemProfileId);
  const currentEmbConfig = currentProfile ? embeddingConfigs.find(c => c.id === currentProfile.embeddingModelConfigId) : null;
  const currentEmbModel = currentEmbConfig ? models.find(m => m.id === currentEmbConfig.modelId) : null;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-semibold">캐비닛 관리</h2>
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
              title="캐비닛 관리 안내"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600">Cabinet ID: {cabinetId} - 문서 저장소 및 벡터 데이터베이스 설정</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-sm ${cabinet.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            {cabinet.isActive ? '활성화' : '비활성화'}
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            새 캐비닛 추가
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Folder className="w-5 h-5 text-blue-600" />
            기본 정보
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project ID
              </label>
              <input
                type="text"
                value={cabinet.projectId}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
              <p className="text-sm text-gray-500 mt-1">프로젝트 식별자</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cabinet UUID
              </label>
              <input
                type="text"
                value={cabinet.cabinetUuid}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
              <p className="text-sm text-gray-500 mt-1">고유 식별자 (자동 생성)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cabinet 이름
              </label>
              <input
                type="text"
                value={cabinet.cabinetName}
                onChange={(e) => setCabinet({ ...cabinet, cabinetName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                활성화 상태
              </label>
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={cabinet.isActive}
                  onChange={(e) => {
                    // 체크를 푸는 경우 (활성화 → 비활성화)
                    if (!e.target.checked) {
                      setShowDeactivateModal(true);
                    } else {
                      // 체크하는 경우 (비활성화 → 활성화)
                      setShowActivateModal(true);
                    }
                  }}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <p className="font-medium">캐비닛 활성화</p>
                  <p className="text-sm text-gray-600">비활성화 시 문서 업로드 및 검색이 불가능합니다</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Storage Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-purple-600" />
            MinIO 오브젝트 스토리지 설정
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endpoint URL *
              </label>
              <input
                type="text"
                value={cabinet.minioEndpoint || ''}
                onChange={(e) => setCabinet({ ...cabinet, minioEndpoint: e.target.value })}
                placeholder="minio.example.com:9000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                호스트명과 포트를 입력하세요 (프로토콜 제외)
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Key *
                </label>
                <input
                  type="text"
                  value={cabinet.minioAccessKey || ''}
                  onChange={(e) => setCabinet({ ...cabinet, minioAccessKey: e.target.value })}
                  placeholder="minioadmin"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secret Key *
                </label>
                <input
                  type="password"
                  value={cabinet.minioSecretKey || ''}
                  onChange={(e) => setCabinet({ ...cabinet, minioSecretKey: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={cabinet.minioUseSSL || false}
                  onChange={(e) => setCabinet({ ...cabinet, minioUseSSL: e.target.checked })}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <p className="font-medium">Secure (Use SSL)</p>
                  <p className="text-sm text-gray-600">HTTPS를 사용하여 MinIO 서버에 안전하게 연결</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Vector Store Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-green-600" />
            벡터 데이터베이스 설정
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vector Store
              </label>
              <select
                value={cabinet.vectorStore}
                onChange={(e) => setCabinet({ ...cabinet, vectorStore: e.target.value })}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              >
                <option value="qdrant">Qdrant</option>
                <option value="pinecone">Pinecone</option>
                <option value="chroma">Chroma</option>
                <option value="weaviate">Weaviate</option>
                <option value="milvus">Milvus</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">벡터 임베딩을 저장할 데이터베이스 (변경 불가)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection Name
              </label>
              <input
                type="text"
                value={cabinet.collectionName}
                onChange={(e) => setCabinet({ ...cabinet, collectionName: e.target.value })}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
              <p className="text-sm text-gray-500 mt-1">벡터 저장소 내 컬렉션 이름 (변경 불가)</p>
            </div>
          </div>
        </div>

        {/* System Profile & Embedding Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-600" />
            시스템 프로필 & 임베딩 설정
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시스템 프로필
              </label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{currentProfile?.name}</p>
                    <p className="text-sm text-gray-600">{currentProfile?.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    프로필 적용됨
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                모델 관리에서 설정한 시스템 프로필 (캐비닛 생성 후 변경 불가)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  임베딩 모델
                </label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                  {currentEmbModel?.modelName || cabinet.embeddingModelName}
                </div>
                <p className="text-sm text-gray-500 mt-1">{currentEmbModel?.provider}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  임베딩 차원 (Dimension)
                </label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900">
                  {currentEmbModel?.dimension || cabinet.embeddingDim}
                </div>
                <p className="text-sm text-gray-500 mt-1">자동 설정됨</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-900">
                <strong>주의:</strong> 시스템 프로필, Vector Store, Collection Name은 한번 설정되면 중간에 바뀔 수 없습니다.
                임베딩 모델을 변경하려면 모델 관리에서 새 시스템 프로필을 생성하고 새 캐비닛을 만들어야 합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Trash2 className="w-5 h-5" />
            캐비닛 삭제
          </button>
          <button
            onClick={() => setShowConfirmModal(true)}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Save className="w-5 h-5" />
            {saved ? '저장됨!' : '설정 저장'}
          </button>
        </div>
      </div>

      {/* Delete Cabinet Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-red-600">캐비닛 삭제 확인</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 font-medium mb-2">
                '{cabinet.cabinetName}' 캐비닛을 정말 삭제하시겠습니까?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-red-900 font-semibold mb-2">⚠️ 경고: 복구 불가능한 작업</p>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• 모든 문서 파일이 삭제됩니다</li>
                  <li>• 벡터 데이터베이스의 모든 임베딩이 삭제됩니다</li>
                  <li>• 이 작업은 되돌릴 수 없습니다</li>
                  <li>• 관련된 모든 QA 데이터도 삭제됩니다</li>
                </ul>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                삭제하기 전에 중요한 데이터를 백업했는지 확인하세요.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDeleteCabinet}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Trash2 className="w-5 h-5" />
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Cabinet Modal */}
      {showCreateModal && (() => {
        const newProfile = systemProfiles.find(p => p.id === newCabinet.systemProfileId);
        const newEmbConfig = newProfile ? embeddingConfigs.find(c => c.id === newProfile.embeddingModelConfigId) : null;
        const newEmbModel = newEmbConfig ? models.find(m => m.id === newEmbConfig.modelId) : null;

        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold">새 캐비닛 추가</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      프로젝트 선택
                    </label>
                    <select
                      value={newCabinet.projectId}
                      onChange={(e) => setNewCabinet({ ...newCabinet, projectId: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={1}>Project 1 - RAG 시스템</option>
                      <option value={2}>Project 2 - 문서 검색 엔진</option>
                      <option value={3}>Project 3 - 챗봇 백엔드</option>
                      <option value={4}>Project 4 - 지식 베이스</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cabinet 이름 *
                    </label>
                    <input
                      type="text"
                      value={newCabinet.cabinetName}
                      onChange={(e) => setNewCabinet({ ...newCabinet, cabinetName: e.target.value })}
                      placeholder="예: Main Cabinet"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      저장소 타입
                    </label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border-2 border-blue-300 rounded-lg">
                      <Database className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">MinIO Object Storage</span>
                      <span className="ml-auto text-xs text-blue-700 bg-blue-100 px-3 py-1 rounded-full font-medium">고정</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">이 시스템은 MinIO 오브젝트 스토리지만 지원합니다</p>
                  </div>

                  {/* MinIO Storage Configuration - 항상 표시 */}
                  {(true) && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Endpoint URL *
                        </label>
                        <input
                          type="text"
                          value={newCabinet.minioEndpoint || ''}
                          onChange={(e) => setNewCabinet({ ...newCabinet, minioEndpoint: e.target.value })}
                          placeholder="minio.example.com:9000"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          호스트명과 포트를 입력하세요 (프로토콜 제외)
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Access Key *
                          </label>
                          <input
                            type="text"
                            value={newCabinet.minioAccessKey || ''}
                            onChange={(e) => setNewCabinet({ ...newCabinet, minioAccessKey: e.target.value })}
                            placeholder="minioadmin"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Secret Key *
                          </label>
                          <input
                            type="password"
                            value={newCabinet.minioSecretKey || ''}
                            onChange={(e) => setNewCabinet({ ...newCabinet, minioSecretKey: e.target.value })}
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                          <input
                            type="checkbox"
                            checked={newCabinet.minioUseSSL || false}
                            onChange={(e) => setNewCabinet({ ...newCabinet, minioUseSSL: e.target.checked })}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div>
                            <p className="font-medium">Secure (Use SSL)</p>
                            <p className="text-sm text-gray-600">HTTPS를 사용하여 MinIO 서버에 안전하게 연결</p>
                          </div>
                        </label>
                      </div>
                    </>
                  )}

                  {/* Azure Blob Storage */}
                  {newCabinet.storageType === 'azure' && (
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-center text-gray-600 text-sm">
                      <p>Azure Blob Storage 설정은 추후 추가 예정입니다.</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vector Store
                    </label>
                    <select
                      value={newCabinet.vectorStore}
                      onChange={(e) => setNewCabinet({ ...newCabinet, vectorStore: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="qdrant">Qdrant</option>
                      <option value="pinecone">Pinecone</option>
                      <option value="chroma">Chroma</option>
                      <option value="weaviate">Weaviate</option>
                      <option value="milvus">Milvus</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Collection Name *
                    </label>
                    <input
                      type="text"
                      value={newCabinet.collectionName}
                      onChange={(e) => setNewCabinet({ ...newCabinet, collectionName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="벡터 저장소 내 컬렉션 이름"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시스템 프로필 선택 *
                    </label>
                    <select
                      value={newCabinet.systemProfileId}
                      onChange={(e) => handleSystemProfileChange(e.target.value, true)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {systemProfiles.filter(p => p.isActive).map(profile => (
                        <option key={profile.id} value={profile.id}>
                          {profile.name} - {profile.description}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      모델 관리에서 설정한 시스템 프로필을 선택하세요
                    </p>
                  </div>

                  {newEmbModel && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">선택된 임베딩 설정</h5>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">임베딩 모델</p>
                          <p className="font-medium text-gray-900">{newEmbModel.modelName}</p>
                          <p className="text-xs text-gray-500">{newEmbModel.provider}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">임베딩 차원</p>
                          <p className="font-medium text-gray-900">{newEmbModel.dimension}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-900">
                      <strong>주의:</strong> 시스템 프로필, Vector Store, Collection Name은 한번 설정되면 변경할 수 없습니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleCreateConfirm}
                  disabled={!isCreateFormValid()}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium ${
                    isCreateFormValid() 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  캐비닛 생성
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Confirm Save Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">설정 저장 확인</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">캐비닛 설정을 저장하시겠습니까?</p>
              <p className="text-sm text-gray-500 mt-2">변경사항이 적용됩니다.</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Save className="w-5 h-5" />
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Confirm Modal */}
      {showCreateConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">캐비닛 생성 확인</h3>
              <button
                onClick={() => setShowCreateConfirmModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">새 캐비닛을 생성하시겠습니까?</p>
              <p className="text-sm text-gray-500 mt-2">변경사항이 적용됩니다.</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreateConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCreateCabinet}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Plus className="w-5 h-5" />
                캐비닛 생성
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xl">🗄️ 캐비닛 관리 안내</h3>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* 핵심 목적 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-blue-600">🎯 핵심 목적: RAG 시스템의 저장소 설정</h4>
                <p className="text-gray-700 leading-relaxed">
                  이 화면은 <strong>RAG 시스템의 문서 저장소와 벡터 데이터베이스를 설정하고 관리</strong>하기 위한 것입니다. 
                  캐비닛은 물리적 저장소, 벡터 DB, 시스템 프로필(임베딩 모델 포함)을 하나로 묶은 독립적인 단위로, 
                  프로젝트 내에서 용도별로 여러 개의 캐비닛을 운영할 수 있습니다.
                </p>
              </div>

              {/* 주요 기능 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-purple-600">🔧 주요 기능</h4>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-2">1. 기본 정보 관리</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>Cabinet UUID</strong>: 캐비닛의 고유 식별자 (자동 생성)</li>
                      <li>• <strong>Cabinet 이름</strong>: 사용자가 지정하는 캐비닛 이름</li>
                      <li>• <strong>활성화 상태</strong>: 캐비닛 사용 가능 여부 제어</li>
                      <li>• 비활성화 시 문서 업로드 및 검색 차단</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h5 className="font-semibold text-purple-900 mb-2">2. 저장소 설정 (Storage)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>저장소 타입</strong>: Local, S3, NFS, Azure, GCS 선택</li>
                      <li>• <strong>Base Path + Storage Path</strong>: 문서 파일의 물리적 저장 경로</li>
                      <li>• 클라우드 스토리지를 사용하면 확장성 및 백업 용이</li>
                      <li>• 전체 경로가 자동으로 표시되어 경로 오류 방지</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h5 className="font-semibold text-green-900 mb-2">3. 벡터 데이터베이스 설정 (Vector Store)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>Vector Store</strong>: Qdrant, Pinecone, Chroma, Weaviate, Milvus 선택</li>
                      <li>• <strong>Collection Name</strong>: 벡터 저장소  컬렉션 이름</li>
                      <li>• <strong>⚠️ 중요</strong>: 캐비닛 생성 후에는 변경 불가</li>
                      <li>• 다른 Vector Store를 사용하려면 새 캐비닛 생성 필요</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <h5 className="font-semibold text-orange-900 mb-2">4. 시스템 프로필 & 임베딩 설정</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>시스템 프로필</strong>: 모델 관리에서 설정한 프로필 선택</li>
                      <li>• <strong>자동 임베딩 설정</strong>: 선택한 프로필의 임베딩 모델이 자동 적용</li>
                      <li>• <strong>⚠️ 중요</strong>: 캐비닛 생성 후에는 변경 불가</li>
                      <li>• 다른 임베딩 모델을 사용하려면 새 시스템 프로필과 새 캐비닛 필요</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 시스템 프로필 연동 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-green-600">🔗 시스템 프로필 연동</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-700 mb-3">
                    캐비닛은 <strong>모델 관리 {'>'} 시스템 프로필</strong>에서 설정한 프로필을 사용합니다.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 font-semibold">1.</span>
                      <span className="text-gray-700">모델 관리에서 LLM과 Embedding 모델 조합으로 시스템 프로필 생성</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 font-semibold">2.</span>
                      <span className="text-gray-700">캐비닛 생성 시 원하는 시스템 프로필 선택</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 font-semibold">3.</span>
                      <span className="text-gray-700">선택한 프로필의 임베딩 모델이 캐비닛에 자동 적용</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    ➡️ 이렇게 하면 동일한 시스템 프로필을 여러 캐비닛에서 재사용할 수 있습니다.
                  </p>
                </div>
              </div>

              {/* 실무 활용 시나리오 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-orange-600">💡 실무 활용 시나리오</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 1: 프로필별 캐비닛 분리</h5>
                    <p className="text-sm text-gray-700">
                      Production Profile 캐비닛 + Development Profile 캐비닛 → 각 환경에 최적화된 모델 조합 적용
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 2: 문서 유형별 캐비닛 분리</h5>
                    <p className="text-sm text-gray-700">
                      기술 문서 캐비닛 + 마케팅 자료 캐비닛 → 각 도메인에 맞는 시스템 프로필 적용
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 3: 모델 비교 테스트</h5>
                    <p className="text-sm text-gray-700">
                      동일 문서를 여러 캐비닛에 업로드 (각기 다른 시스템 프로필) → 성능 비교 후 최적 프로필 선정
                    </p>
                  </div>
                </div>
              </div>

              {/* 중요 규칙 */}
              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
                <h4 className="font-semibold text-yellow-900 mb-2">⚠️ 중요 규칙: 변경 불가 항목</h4>
                <ul className="text-sm text-yellow-800 leading-relaxed space-y-1">
                  <li>• <strong>시스템 프로필</strong>: 한번 선택하면 변경 불가</li>
                  <li>• <strong>Vector Store</strong>: 한번 선택하면 변경 불가</li>
                  <li>• <strong>Collection Name</strong>: 한번 설정하면 변경 불가</li>
                  <li>• <strong>이유</strong>: 벡터 데이터베이스의 스키마와 인덱스가 초기 설정에 종속됨</li>
                  <li>• <strong>해결</strong>: 다른 설정을 사용하려면 새 캐비닛을 생성해야 함</li>
                </ul>
              </div>

              {/* 요약 */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">📌 요약</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  이 화면은 RAG 시스템의 <strong>인프라 설정</strong>을 담당합니다. 
                  캐비닛은 문서 저장소, 벡터 DB, 시스템 프로필을 하나로 묶은 <strong>독립적인 저장 단위</strong>이며, 
                  프로젝트 내에서 용도별로 여러 캐비닛을 운영할 수 있습니다.
                  <br /><br />
                  시스템 프로필은 모델 관리에서 생성하고, 캐비닛 생성 시 선택합니다.
                  단, 시스템 프로필, Vector Store, Collection Name은 <strong>생성 후 변경 불가</strong>하므로 신중히 설정하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Cabinet Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-orange-600">캐비닛 비활성화 확인</h3>
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 font-medium mb-4">
                캐비닛이 비활성화됩니다.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-900 font-semibold mb-2">⚠️ 비활성화 영향</p>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• 비활성 상태에서는 문서 업로드가 제한되며,</li>
                  <li>• 문서적재 파이프라인이 중단됩니다.</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDeactivateCabinet}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activate Cabinet Modal */}
      {showActivateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-green-600">캐비닛 활성화 확인</h3>
              <button
                onClick={() => setShowActivateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 font-medium mb-4">
                캐비닛이 활성화됩니다.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-900 font-semibold mb-2">⚠️ 활성화 영향</p>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• 활성 상태에서는 문서 업로드가 가능하며,</li>
                  <li>• 문서적재 파이프라인이 재개됩니다.</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowActivateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleActivateCabinet}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}