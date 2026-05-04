import { useState } from 'react';
import { Cpu, Plus, Edit, Trash2, X, Settings, Activity, Database, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface Model {
  id: string;
  modelType: 'LLM' | 'EMBEDDING';
  provider: string;
  modelName: string;
  modelVersion: string;
  dimension?: number;
  isDeprecated: boolean;
  createdAt: string;
}

interface EmbeddingModelConfig {
  id: string;
  modelId: string;
  normalize: boolean;
  distanceMetric: 'cosine' | 'l2' | 'dot';
  extraParams: any;
  createdAt: string;
}

interface LLMModelConfig {
  id: string;
  modelId: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  systemPrompt: string;
  extraParams: any;
  createdAt: string;
}

interface SystemProfile {
  id: string;
  name: string;
  description: string;
  llmModelConfigId: string;
  embeddingModelConfigId: string;
  isActive: boolean;
  createdAt: string;
}

interface EmbeddingRun {
  id: string;
  documentId: string;
  embeddingModelConfigId: string;
  vectorStore: string;
  status: 'PENDING' | 'DONE' | 'FAILED';
  createdAt: string;
}

export function ModelManagement() {
  const [activeTab, setActiveTab] = useState<'models' | 'configs' | 'profiles' | 'runs'>('models');
  const [modelTypeFilter, setModelTypeFilter] = useState<'ALL' | 'LLM' | 'EMBEDDING'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [expandedModelId, setExpandedModelId] = useState<string | null>(null);
  const [expandedRunId, setExpandedRunId] = useState<string | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Pagination for embedding runs
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Config modals
  const [showAddLLMConfigModal, setShowAddLLMConfigModal] = useState(false);
  const [showAddEmbeddingConfigModal, setShowAddEmbeddingConfigModal] = useState(false);
  const [showEditLLMConfigModal, setShowEditLLMConfigModal] = useState(false);
  const [showEditEmbeddingConfigModal, setShowEditEmbeddingConfigModal] = useState(false);
  const [editingLLMConfig, setEditingLLMConfig] = useState<LLMModelConfig | null>(null);
  const [editingEmbeddingConfig, setEditingEmbeddingConfig] = useState<EmbeddingModelConfig | null>(null);
  
  const [newLLMConfig, setNewLLMConfig] = useState({
    modelId: '',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.9,
    systemPrompt: ''
  });

  const [newEmbeddingConfig, setNewEmbeddingConfig] = useState({
    modelId: '',
    distanceMetric: 'cosine',
    normalize: true
  });

  // Profile modal
  const [showAddProfileModal, setShowAddProfileModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<SystemProfile | null>(null);
  const [showActiveCabinetsError, setShowActiveCabinetsError] = useState(false);
  const [activeCabinetsError, setActiveCabinetsError] = useState<{
    message: string;
    cabinets: Array<{
      id: number;
      project_id: number;
      cabinet_uuid: string;
      name: string;
    }>;
  } | null>(null);
  const [newProfile, setNewProfile] = useState({
    name: '',
    description: '',
    llmModelConfigId: '',
    embeddingModelConfigId: '',
    isActive: false
  });

  // Mock data
  const [models, setModels] = useState<Model[]>([
    {
      id: '1',
      modelType: 'LLM',
      provider: 'OpenAI',
      modelName: 'gpt-4',
      modelVersion: 'gpt-4-0613',
      isDeprecated: false,
      createdAt: '2024-01-15 10:30'
    },
    {
      id: '2',
      modelType: 'LLM',
      provider: 'OpenAI',
      modelName: 'gpt-3.5-turbo',
      modelVersion: 'gpt-3.5-turbo-0125',
      isDeprecated: false,
      createdAt: '2024-01-10 09:15'
    },
    {
      id: '3',
      modelType: 'EMBEDDING',
      provider: 'OpenAI',
      modelName: 'text-embedding-3-small',
      modelVersion: 'v1',
      dimension: 1536,
      isDeprecated: false,
      createdAt: '2024-01-12 14:20'
    },
    {
      id: '4',
      modelType: 'EMBEDDING',
      provider: 'OpenAI',
      modelName: 'text-embedding-3-large',
      modelVersion: 'v1',
      dimension: 3072,
      isDeprecated: false,
      createdAt: '2024-01-18 11:45'
    },
    {
      id: '5',
      modelType: 'LLM',
      provider: 'Anthropic',
      modelName: 'claude-3-opus',
      modelVersion: '20240229',
      isDeprecated: false,
      createdAt: '2024-02-01 16:00'
    }
  ]);

  const [embeddingConfigs, setEmbeddingConfigs] = useState<EmbeddingModelConfig[]>([
    {
      id: 'ec1',
      modelId: '3',
      normalize: true,
      distanceMetric: 'cosine',
      extraParams: {},
      createdAt: '2024-01-15 10:30'
    },
    {
      id: 'ec2',
      modelId: '4',
      normalize: true,
      distanceMetric: 'l2',
      extraParams: {},
      createdAt: '2024-01-20 14:20'
    }
  ]);

  const [llmConfigs, setLlmConfigs] = useState<LLMModelConfig[]>([
    {
      id: 'lc1',
      modelId: '1',
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.9,
      systemPrompt: 'You are a helpful assistant.',
      extraParams: {},
      createdAt: '2024-01-15 10:30'
    },
    {
      id: 'lc2',
      modelId: '2',
      temperature: 0.5,
      maxTokens: 1024,
      topP: 0.95,
      systemPrompt: 'You are a precise and accurate assistant.',
      extraParams: {},
      createdAt: '2024-01-16 11:20'
    }
  ]);

  const [systemProfiles, setSystemProfiles] = useState<SystemProfile[]>([
    {
      id: 'sp1',
      name: 'Production Profile',
      description: 'Main production system profile with GPT-4 and text-embedding-3-small',
      llmModelConfigId: 'lc1',
      embeddingModelConfigId: 'ec1',
      isActive: true,
      createdAt: '2024-01-20 10:00'
    },
    {
      id: 'sp2',
      name: 'Development Profile',
      description: 'Development profile with GPT-3.5 for testing',
      llmModelConfigId: 'lc2',
      embeddingModelConfigId: 'ec1',
      isActive: false,
      createdAt: '2024-01-22 14:30'
    }
  ]);

  const [embeddingRuns, setEmbeddingRuns] = useState<EmbeddingRun[]>([
    {
      id: 'er1',
      documentId: 'doc-123',
      embeddingModelConfigId: 'ec1',
      vectorStore: 'chroma',
      status: 'DONE',
      createdAt: '2024-02-05 10:30'
    },
    {
      id: 'er2',
      documentId: 'doc-124',
      embeddingModelConfigId: 'ec1',
      vectorStore: 'chroma',
      status: 'DONE',
      createdAt: '2024-02-05 11:15'
    },
    {
      id: 'er3',
      documentId: 'doc-125',
      embeddingModelConfigId: 'ec2',
      vectorStore: 'chroma',
      status: 'PENDING',
      createdAt: '2024-02-08 09:00'
    },
    {
      id: 'er4',
      documentId: 'doc-126',
      embeddingModelConfigId: 'ec1',
      vectorStore: 'chroma',
      status: 'FAILED',
      createdAt: '2024-02-07 16:45'
    }
  ]);

  const [newModel, setNewModel] = useState<Partial<Model>>({
    modelType: 'LLM',
    provider: '',
    modelName: '',
    modelVersion: '',
    dimension: undefined,
    isDeprecated: false
  });

  const filteredModels = models.filter(m => 
    modelTypeFilter === 'ALL' || m.modelType === modelTypeFilter
  );

  const handleAddModel = () => {
    if (!newModel.provider || !newModel.modelName || !newModel.modelVersion) {
      alert('모든 필수 필드를 입력해주세요.');
      return;
    }

    const model: Model = {
      id: String(models.length + 1),
      modelType: newModel.modelType as 'LLM' | 'EMBEDDING',
      provider: newModel.provider,
      modelName: newModel.modelName,
      modelVersion: newModel.modelVersion,
      dimension: newModel.dimension,
      isDeprecated: false,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    setModels([...models, model]);
    setShowAddModal(false);
    setNewModel({
      modelType: 'LLM',
      provider: '',
      modelName: '',
      modelVersion: '',
      dimension: undefined,
      isDeprecated: false
    });
  };

  const handleDeleteModel = (id: string) => {
    if (confirm('정말 이 모델을 삭제하시겠습니까?')) {
      setModels(models.filter(m => m.id !== id));
    }
  };

  const handleToggleDeprecated = (id: string) => {
    setModels(models.map(m => 
      m.id === id ? { ...m, isDeprecated: !m.isDeprecated } : m
    ));
  };

  const getModelConfigs = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (!model) return null;

    if (model.modelType === 'LLM') {
      return llmConfigs.filter(c => c.modelId === modelId);
    } else {
      return embeddingConfigs.filter(c => c.modelId === modelId);
    }
  };

  const handleAddProfile = () => {
    if (!newProfile.name || !newProfile.llmModelConfigId || !newProfile.embeddingModelConfigId) {
      alert('프로필 이름과 모델 설정을 모두 선택해주세요.');
      return;
    }

    const profile: SystemProfile = {
      id: `sp${systemProfiles.length + 1}`,
      name: newProfile.name,
      description: newProfile.description,
      llmModelConfigId: newProfile.llmModelConfigId,
      embeddingModelConfigId: newProfile.embeddingModelConfigId,
      isActive: newProfile.isActive,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    setSystemProfiles([...systemProfiles, profile]);
    setShowAddProfileModal(false);
    setNewProfile({
      name: '',
      description: '',
      llmModelConfigId: '',
      embeddingModelConfigId: '',
      isActive: false
    });
  };

  const handleToggleProfileActive = (profileId: string) => {
    const profile = systemProfiles.find(p => p.id === profileId);
    
    if (profile && profile.isActive) {
      // 활성화 상태를 비활성화로 변경하려는 경우
      // Mock: API 호출로 활성 캐비닛 체크
      
      // 🔴 테스트용: 비활성화 시도 시 항상 오류 표시 (실제 API 연동 시 이 부분을 실제 API 호출로 교체)
      const mockActiveCabinets = [
        {
          id: 34,
          project_id: 4,
          cabinet_uuid: '4e1e96e3-c78e-49fc-beb7-f4a152f88cdf',
          name: 'Main Cabinet'
        },
        {
          id: 35,
          project_id: 4,
          cabinet_uuid: '8a2f96e3-d89e-41fc-aeb7-e5c163g99eae',
          name: 'Development Cabinet'
        }
      ];

      // 테스트를 위해 항상 오류 발생
      setActiveCabinetsError({
        message: 'System profile has active cabinets',
        cabinets: mockActiveCabinets
      });
      setShowActiveCabinetsError(true);
      return;
    }
    
    // 비활성화 -> 활성화로 변경하는 경우는 그냥 진행
    setSystemProfiles(systemProfiles.map(p =>
      p.id === profileId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const handleEditProfile = (profile: SystemProfile) => {
    setEditingProfile(profile);
    setNewProfile({
      name: profile.name,
      description: profile.description,
      llmModelConfigId: profile.llmModelConfigId,
      embeddingModelConfigId: profile.embeddingModelConfigId,
      isActive: profile.isActive
    });
    setShowEditProfileModal(true);
  };

  const handleUpdateProfile = () => {
    if (!newProfile.name || !newProfile.llmModelConfigId || !newProfile.embeddingModelConfigId) {
      alert('프로필 이름과 모델 설정을 모두 선택해주세요.');
      return;
    }

    if (editingProfile) {
      // 비활성화를 시도하는 경우 (활성화 상태에서 비활성화로 변경)
      if (editingProfile.isActive && !newProfile.isActive) {
        // Mock: API 호출로 활성 캐비닛 체크
        // 실제로는 API 응답을 받아서 처리
        
        // 🔴 테스트용: 비활성화 시도 시 항상 오류 표시 (실제 API 연동 시 이 부분을 실제 API 호출로 교체)
        const mockActiveCabinets = [
          {
            id: 34,
            project_id: 4,
            cabinet_uuid: '4e1e96e3-c78e-49fc-beb7-f4a152f88cdf',
            name: 'Main Cabinet'
          },
          {
            id: 35,
            project_id: 4,
            cabinet_uuid: '8a2f96e3-d89e-41fc-aeb7-e5c163g99eae',
            name: 'Development Cabinet'
          }
        ];

        // 테스트를 위해 항상 오류 발생
        setActiveCabinetsError({
          message: 'System profile has active cabinets',
          cabinets: mockActiveCabinets
        });
        setShowActiveCabinetsError(true);
        return;
      }

      setSystemProfiles(systemProfiles.map(p =>
        p.id === editingProfile.id
          ? {
              ...p,
              name: newProfile.name,
              description: newProfile.description,
              llmModelConfigId: newProfile.llmModelConfigId,
              embeddingModelConfigId: newProfile.embeddingModelConfigId,
              isActive: newProfile.isActive
            }
          : p
      ));
      setShowEditProfileModal(false);
      setEditingProfile(null);
      setNewProfile({
        name: '',
        description: '',
        llmModelConfigId: '',
        embeddingModelConfigId: '',
        isActive: false
      });
    }
  };

  // Pagination handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddLLMConfig = () => {
    console.log('handleAddLLMConfig called', newLLMConfig);
    
    if (!newLLMConfig.modelId || !newLLMConfig.systemPrompt) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    const config: LLMModelConfig = {
      id: `lc${llmConfigs.length + 1}`,
      modelId: newLLMConfig.modelId,
      temperature: newLLMConfig.temperature,
      maxTokens: newLLMConfig.maxTokens,
      topP: newLLMConfig.topP,
      systemPrompt: newLLMConfig.systemPrompt,
      extraParams: {},
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    console.log('Adding LLM config:', config);
    setLlmConfigs([...llmConfigs, config]);
    setShowAddLLMConfigModal(false);
    setNewLLMConfig({
      modelId: '',
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.9,
      systemPrompt: ''
    });
  };

  const handleAddEmbeddingConfig = () => {
    console.log('handleAddEmbeddingConfig called', newEmbeddingConfig);
    
    if (!newEmbeddingConfig.modelId) {
      alert('모델을 선택해주세요.');
      return;
    }

    const config: EmbeddingModelConfig = {
      id: `ec${embeddingConfigs.length + 1}`,
      modelId: newEmbeddingConfig.modelId,
      normalize: newEmbeddingConfig.normalize,
      distanceMetric: newEmbeddingConfig.distanceMetric,
      extraParams: {},
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    console.log('Adding Embedding config:', config);
    setEmbeddingConfigs([...embeddingConfigs, config]);
    setShowAddEmbeddingConfigModal(false);
    setNewEmbeddingConfig({
      modelId: '',
      distanceMetric: 'cosine',
      normalize: true
    });
  };

  // LLM Config 수정/삭제
  const handleEditLLMConfig = (config: LLMModelConfig) => {
    setEditingLLMConfig(config);
    setShowEditLLMConfigModal(true);
  };

  const handleUpdateLLMConfig = () => {
    if (!editingLLMConfig) return;

    setLlmConfigs(llmConfigs.map(c =>
      c.id === editingLLMConfig.id ? editingLLMConfig : c
    ));
    setShowEditLLMConfigModal(false);
    setEditingLLMConfig(null);
  };

  const handleDeleteLLMConfig = (id: string) => {
    if (confirm('정말 이 LLM 설정을 삭제하시겠습니까?')) {
      setLlmConfigs(llmConfigs.filter(c => c.id !== id));
    }
  };

  // Embedding Config 수정/삭제
  const handleEditEmbeddingConfig = (config: EmbeddingModelConfig) => {
    setEditingEmbeddingConfig(config);
    setShowEditEmbeddingConfigModal(true);
  };

  const handleUpdateEmbeddingConfig = () => {
    if (!editingEmbeddingConfig) return;

    setEmbeddingConfigs(embeddingConfigs.map(c =>
      c.id === editingEmbeddingConfig.id ? editingEmbeddingConfig : c
    ));
    setShowEditEmbeddingConfigModal(false);
    setEditingEmbeddingConfig(null);
  };

  const handleDeleteEmbeddingConfig = (id: string) => {
    if (confirm('정말 이 Embedding 설정을 삭제하시겠습니까?')) {
      setEmbeddingConfigs(embeddingConfigs.filter(c => c.id !== id));
    }
  };

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-semibold">모델 관리</h2>
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
              title="모델 관리 안내"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600">LLM 및 Embedding 모델을 등록하고 설정을 관리합니다</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('models')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'models'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>모델 목록</span>
              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                {models.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('configs')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'configs'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" />
              <span>모델 설정</span>
              <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                {llmConfigs.length + embeddingConfigs.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'profiles'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Database className="w-4 h-4" />
              <span>시스템 프로필</span>
              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                {systemProfiles.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('runs')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'runs'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Activity className="w-4 h-4" />
              <span>임베딩 실행 이력</span>
              <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-full">
                {embeddingRuns.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Models Tab */}
      {activeTab === 'models' && (
        <div>
          {/* Filter and Add Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">모델 타입:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setModelTypeFilter('ALL')}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    modelTypeFilter === 'ALL'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  전체 ({models.length})
                </button>
                <button
                  onClick={() => setModelTypeFilter('LLM')}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    modelTypeFilter === 'LLM'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  LLM ({models.filter(m => m.modelType === 'LLM').length})
                </button>
                <button
                  onClick={() => setModelTypeFilter('EMBEDDING')}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    modelTypeFilter === 'EMBEDDING'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  EMBEDDING ({models.filter(m => m.modelType === 'EMBEDDING').length})
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>새 모델 등록</span>
            </button>
          </div>

          {/* Models List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">모델 타입</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Provider</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">모델명</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">버전</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Dimension</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">상태</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">등록일</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredModels.flatMap((model) => {
                  const rows = [
                    <tr key={model.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          model.modelType === 'LLM'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {model.modelType}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">{model.provider}</td>
                      <td className="px-6 py-4">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{model.modelName}</code>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{model.modelVersion}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {model.dimension ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                            {model.dimension}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {model.isDeprecated ? (
                          <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                            Deprecated
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{model.createdAt}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setExpandedModelId(expandedModelId === model.id ? null : model.id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="설정 보기"
                          >
                            {expandedModelId === model.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleToggleDeprecated(model.id)}
                            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                              model.isDeprecated
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            }`}
                          >
                            {model.isDeprecated ? '활성화' : '비활성화'}
                          </button>
                          <button
                            onClick={() => handleDeleteModel(model.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ];

                  if (expandedModelId === model.id) {
                    rows.push(
                      <tr key={`${model.id}-expanded`}>
                        <td colSpan={8} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">연결된 설정:</p>
                            {model.modelType === 'LLM' ? (
                              <div className="space-y-2">
                                {llmConfigs.filter(c => c.modelId === model.id).map(config => (
                                  <div key={config.id} className="p-3 bg-white rounded-lg border border-gray-200">
                                    <div className="grid grid-cols-4 gap-4 text-xs">
                                      <div>
                                        <span className="text-gray-500">Temperature:</span>
                                        <span className="ml-2 font-medium">{config.temperature}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Max Tokens:</span>
                                        <span className="ml-2 font-medium">{config.maxTokens}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Top P:</span>
                                        <span className="ml-2 font-medium">{config.topP}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">등록:</span>
                                        <span className="ml-2 font-medium">{config.createdAt}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {llmConfigs.filter(c => c.modelId === model.id).length === 0 && (
                                  <p className="text-sm text-gray-500">연결된 설정이 없습니다.</p>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {embeddingConfigs.filter(c => c.modelId === model.id).map(config => (
                                  <div key={config.id} className="p-3 bg-white rounded-lg border border-gray-200">
                                    <div className="grid grid-cols-4 gap-4 text-xs">
                                      <div>
                                        <span className="text-gray-500">Distance Metric:</span>
                                        <span className="ml-2 font-medium">{config.distanceMetric}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Normalize:</span>
                                        <span className="ml-2 font-medium">{config.normalize ? 'Yes' : 'No'}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Distance:</span>
                                        <span className="ml-2 font-medium">{config.distanceMetric}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">등록:</span>
                                        <span className="ml-2 font-medium">{config.createdAt}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                {embeddingConfigs.filter(c => c.modelId === model.id).length === 0 && (
                                  <p className="text-sm text-gray-500">연결된 설정�� 없습니다.</p>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return rows;
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Configs Tab - Placeholder */}
      {activeTab === 'configs' && (
        <div>
          {/* LLM Configs Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">LLM 모델 설정</h3>
              <button
                onClick={() => setShowAddLLMConfigModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>새 설정 추가</span>
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">모델</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Temperature</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Max Tokens</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Top P</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">System Prompt</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">등록일</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {llmConfigs.map((config) => {
                    const model = models.find(m => m.id === config.modelId);
                    return (
                      <tr key={config.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          {model && (
                            <div>
                              <code className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {model.modelName}
                              </code>
                              <p className="text-xs text-gray-500 mt-1">{model.provider}</p>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm font-medium">
                            {config.temperature}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                            {config.maxTokens}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm font-medium">
                            {config.topP}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-700 truncate" title={config.systemPrompt}>
                              {config.systemPrompt}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{config.createdAt}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditLLMConfig(config)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="수정"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLLMConfig(config.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Embedding Configs Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Embedding 모델 설정</h3>
              <button
                onClick={() => setShowAddEmbeddingConfigModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>새 설정 추가</span>
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">모델</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Chunk Size</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Overlap</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Normalize</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Distance Metric</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">등록일</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {embeddingConfigs.map((config) => {
                    const model = models.find(m => m.id === config.modelId);
                    return (
                      <tr key={config.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          {model && (
                            <div>
                              <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                {model.modelName}
                              </code>
                              <p className="text-xs text-gray-500 mt-1">{model.provider}</p>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                            {config.distanceMetric}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                            {config.overlap}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {config.normalize ? (
                            <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                              Yes
                            </span>
                          ) : (
                            <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm font-medium uppercase">
                            {config.distanceMetric}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{config.createdAt}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditEmbeddingConfig(config)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="수정"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEmbeddingConfig(config.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Profiles Tab - Placeholder */}
      {activeTab === 'profiles' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">시스템 프로필 관리</h3>
              <p className="text-sm text-gray-600">LLM과 Embedding 모델의 조합을 정의하여 시스템 프로필을 생성합니다</p>
            </div>
            <button 
              onClick={() => setShowAddProfileModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>새 프로필 추가</span>
            </button>
          </div>

          <div className="grid gap-6">
            {systemProfiles.map((profile) => {
              const llmConfig = llmConfigs.find(c => c.id === profile.llmModelConfigId);
              const embeddingConfig = embeddingConfigs.find(c => c.id === profile.embeddingModelConfigId);
              const llmModel = llmConfig ? models.find(m => m.id === llmConfig.modelId) : null;
              const embeddingModel = embeddingConfig ? models.find(m => m.id === embeddingConfig.modelId) : null;

              return (
                <div key={profile.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold">{profile.name}</h4>
                          {profile.isActive && (
                            <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{profile.description}</p>
                        <p className="text-xs text-gray-500 mt-2">등록일: {profile.createdAt}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditProfile(profile)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-6">
                      {/* LLM Model Config */}
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Cpu className="w-4 h-4 text-blue-600" />
                          <h5 className="text-sm font-semibold text-blue-900">LLM Model</h5>
                        </div>
                        {llmModel && llmConfig ? (
                          <div className="space-y-2">
                            <div>
                              <code className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {llmModel.modelName}
                              </code>
                              <p className="text-xs text-blue-600 mt-1">{llmModel.provider} - {llmModel.modelVersion}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-blue-200">
                              <div>
                                <p className="text-xs text-blue-600">Temperature</p>
                                <p className="text-sm font-medium text-blue-900">{llmConfig.temperature}</p>
                              </div>
                              <div>
                                <p className="text-xs text-blue-600">Max Tokens</p>
                                <p className="text-sm font-medium text-blue-900">{llmConfig.maxTokens}</p>
                              </div>
                              <div>
                                <p className="text-xs text-blue-600">Top P</p>
                                <p className="text-sm font-medium text-blue-900">{llmConfig.topP}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-blue-600">설정 없음</p>
                        )}
                      </div>

                      {/* Embedding Model Config */}
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Database className="w-4 h-4 text-purple-600" />
                          <h5 className="text-sm font-semibold text-purple-900">Embedding Model</h5>
                        </div>
                        {embeddingModel && embeddingConfig ? (
                          <div className="space-y-2">
                            <div>
                              <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                {embeddingModel.modelName}
                              </code>
                              <p className="text-xs text-purple-600 mt-1">{embeddingModel.provider} - Dim: {embeddingModel.dimension}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-purple-200">
                              <div>
                                <p className="text-xs text-purple-600">Chunk Size</p>
                                <p className="text-sm font-medium text-purple-900">{embeddingConfig.chunkSize} {embeddingConfig.chunkUnit}</p>
                              </div>
                              <div>
                                <p className="text-xs text-purple-600">Overlap</p>
                                <p className="text-sm font-medium text-purple-900">{embeddingConfig.overlap}</p>
                              </div>
                              <div>
                                <p className="text-xs text-purple-600">Distance</p>
                                <p className="text-sm font-medium text-purple-900 uppercase">{embeddingConfig.distanceMetric}</p>
                              </div>
                              <div>
                                <p className="text-xs text-purple-600">Normalize</p>
                                <p className="text-sm font-medium text-purple-900">{embeddingConfig.normalize ? 'Yes' : 'No'}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-purple-600">설정 없음</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Config ID: LLM #{profile.llmModelConfigId} / Embedding #{profile.embeddingModelConfigId}
                    </div>
                    <button
                      onClick={() => handleToggleProfileActive(profile.id)}
                      className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                        profile.isActive
                          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {profile.isActive ? '비활성화' : '활성화'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Runs Tab - Placeholder */}
      {activeTab === 'runs' && (
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-1">임베딩 실행 이력</h3>
            <p className="text-sm text-gray-600">문서별 임베딩 생성 작업의 실행 이력을 조회합니다</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">완료</p>
                  <p className="text-2xl font-semibold text-green-600">
                    {embeddingRuns.filter(r => r.status === 'DONE').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">대기중</p>
                  <p className="text-2xl font-semibold text-orange-600">
                    {embeddingRuns.filter(r => r.status === 'PENDING').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">실패</p>
                  <p className="text-2xl font-semibold text-red-600">
                    {embeddingRuns.filter(r => r.status === 'FAILED').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Runs Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">실행 ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">문서 ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Embedding Config</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Vector Store</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">상태</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">생성일시</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(() => {
                  // Pagination calculations
                  const totalPages = Math.ceil(embeddingRuns.length / itemsPerPage);
                  const startIndex = (currentPage - 1) * itemsPerPage;
                  const endIndex = startIndex + itemsPerPage;
                  const currentRuns = embeddingRuns.slice(startIndex, endIndex);

                  return currentRuns.map((run) => {
                  const config = embeddingConfigs.find(c => c.id === run.embeddingModelConfigId);
                  const model = config ? models.find(m => m.id === config.modelId) : null;

                  const getStatusColor = (status: EmbeddingRun['status']) => {
                    switch (status) {
                      case 'DONE':
                        return 'bg-green-100 text-green-700';
                      case 'PENDING':
                        return 'bg-orange-100 text-orange-700';
                      case 'FAILED':
                        return 'bg-red-100 text-red-700';
                    }
                  };

                  const getStatusText = (status: EmbeddingRun['status']) => {
                    switch (status) {
                      case 'DONE':
                        return '완료';
                      case 'PENDING':
                        return '대기중';
                      case 'FAILED':
                        return '실패';
                    }
                  };

                  const rows = [
                    <tr key={run.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {run.id}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {run.documentId}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        {model && config ? (
                          <div>
                            <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              {model.modelName}
                            </code>
                            <p className="text-xs text-gray-500 mt-1">
                              Distance: {config.distanceMetric}, Normalize: {config.normalize ? 'Yes' : 'No'}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium uppercase">
                          {run.vectorStore}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(run.status)}`}>
                          {getStatusText(run.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{run.createdAt}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {run.status === 'FAILED' && (
                            <button
                              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                              title="재시도"
                            >
                              재시도
                            </button>
                          )}
                          <button
                            onClick={() => setExpandedRunId(expandedRunId === run.id ? null : run.id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="상세보기"
                          >
                            {expandedRunId === run.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ];

                  if (expandedRunId === run.id) {
                    rows.push(
                      <tr key={`${run.id}-expanded`}>
                        <td colSpan={7} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">실행 상세 정보</h4>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                              {/* 왼쪽: 실행 정보 */}
                              <div className="space-y-3">
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                  <p className="text-xs text-gray-500 mb-2">실행 정보</p>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">실행 ID:</span>
                                      <code className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{run.id}</code>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">문서 ID:</span>
                                      <code className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{run.documentId}</code>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">Vector Store:</span>
                                      <span className="font-medium text-gray-900 uppercase">{run.vectorStore}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">생성일시:</span>
                                      <span className="font-medium text-gray-900">{run.createdAt}</span>
                                    </div>
                                    {run.status === 'DONE' && (
                                      <>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-gray-600">처리된 청크:</span>
                                          <span className="font-medium text-green-600">142개</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-gray-600">생성된 벡터:</span>
                                          <span className="font-medium text-green-600">142개</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-gray-600">소요 시간:</span>
                                          <span className="font-medium text-gray-900">2분 34초</span>
                                        </div>
                                      </>
                                    )}
                                    {run.status === 'PENDING' && (
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">대기 순서:</span>
                                        <span className="font-medium text-orange-600">3번째</span>
                                      </div>
                                    )}
                                    {run.status === 'FAILED' && (
                                      <div className="pt-2 border-t border-gray-200">
                                        <p className="text-xs text-gray-500 mb-1">오류 메시지:</p>
                                        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                          Connection timeout: Failed to connect to vector store
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* 오른쪽: 모델 및 설정 정보 */}
                              <div className="space-y-3">
                                {model && config && (
                                  <>
                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                      <p className="text-xs text-gray-500 mb-2">Embedding 모델</p>
                                      <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                          <span className="text-gray-600">모델명:</span>
                                          <code className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded">{model.modelName}</code>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-gray-600">Provider:</span>
                                          <span className="font-medium text-gray-900">{model.provider}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-gray-600">Dimension:</span>
                                          <span className="font-medium text-gray-900">{model.dimension || '-'}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                      <p className="text-xs text-gray-500 mb-2">청크 설정</p>
                                      <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                          <span className="text-gray-600">Distance Metric:</span>
                                          <span className="font-medium text-gray-900">{config.distanceMetric}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-gray-600">Normalize:</span>
                                          <span className="font-medium text-gray-900">{config.normalize ? 'Yes' : 'No'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-gray-600">Distance Metric:</span>
                                          <span className="font-medium text-gray-900 uppercase">{config.distanceMetric}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span className="text-gray-600">Normalize:</span>
                                          <span className="font-medium text-gray-900">{config.normalize ? 'Yes' : 'No'}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return rows;
                  });
                })()}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              총 {embeddingRuns.length}개 중 {Math.min((currentPage - 1) * itemsPerPage + 1, embeddingRuns.length)}-{Math.min(currentPage * itemsPerPage, embeddingRuns.length)}개 표시
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">이전</span>
              </button>
              
              <div className="flex items-center gap-1">
                {(() => {
                  const totalPages = Math.ceil(embeddingRuns.length / itemsPerPage);
                  return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page and adjacent pages
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2 text-gray-400">...</span>;
                    }
                    return null;
                  });
                })()}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === Math.ceil(embeddingRuns.length / itemsPerPage)}
                className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors ${
                  currentPage === Math.ceil(embeddingRuns.length / itemsPerPage)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm">다음</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Model Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">새 모델 등록</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provider *
                </label>
                <input
                  type="text"
                  value={newModel.provider}
                  onChange={(e) => setNewModel({ ...newModel, provider: e.target.value })}
                  placeholder="예: OpenAI, Anthropic, Cohere"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  모델 타입 *
                </label>
                <select
                  value={newModel.modelType}
                  onChange={(e) => setNewModel({ ...newModel, modelType: e.target.value as 'LLM' | 'EMBEDDING' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LLM">LLM</option>
                  <option value="EMBEDDING">EMBEDDING</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  모델명 *
                </label>
                <input
                  type="text"
                  value={newModel.modelName}
                  onChange={(e) => setNewModel({ ...newModel, modelName: e.target.value })}
                  placeholder="예: gpt-4, text-embedding-3-small"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  모델 버전 *
                </label>
                <input
                  type="text"
                  value={newModel.modelVersion}
                  onChange={(e) => setNewModel({ ...newModel, modelVersion: e.target.value })}
                  placeholder="예: gpt-4-0613, v1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {newModel.modelType === 'EMBEDDING' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimension
                  </label>
                  <input
                    type="number"
                    value={newModel.dimension || ''}
                    onChange={(e) => setNewModel({ ...newModel, dimension: parseInt(e.target.value) || undefined })}
                    placeholder="예: 1536, 3072"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAddModel}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add LLM Config Modal */}
      {showAddLLMConfigModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">새 LLM 설정 추가</h3>
              <button
                onClick={() => setShowAddLLMConfigModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  모델 선택 *
                </label>
                <select
                  value={newLLMConfig.modelId}
                  onChange={(e) => setNewLLMConfig({ ...newLLMConfig, modelId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">모델을 선택하세요</option>
                  {models.filter(m => m.modelType === 'LLM' && !m.isDeprecated).map(model => (
                    <option key={model.id} value={model.id}>
                      {model.provider} - {model.modelName} ({model.modelVersion})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={newLLMConfig.temperature}
                  onChange={(e) => setNewLLMConfig({ ...newLLMConfig, temperature: parseFloat(e.target.value) || 0 })}
                  placeholder="예: 0.7"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">0-2 사이의 값 (높을수록 창의적)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Tokens *
                </label>
                <input
                  type="number"
                  min="1"
                  value={newLLMConfig.maxTokens}
                  onChange={(e) => setNewLLMConfig({ ...newLLMConfig, maxTokens: parseInt(e.target.value) || 0 })}
                  placeholder="예: 2048"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Top P *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={newLLMConfig.topP}
                  onChange={(e) => setNewLLMConfig({ ...newLLMConfig, topP: parseFloat(e.target.value) || 0 })}
                  placeholder="예: 0.9"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">0-1 사이의 값</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Prompt *
                </label>
                <textarea
                  rows={4}
                  value={newLLMConfig.systemPrompt}
                  onChange={(e) => setNewLLMConfig({ ...newLLMConfig, systemPrompt: e.target.value })}
                  placeholder="예: You are a helpful assistant."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddLLMConfigModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAddLLMConfig}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Embedding Config Modal */}
      {showAddEmbeddingConfigModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">새 Embedding 설정 추가</h3>
              <button
                onClick={() => setShowAddEmbeddingConfigModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  모델 선택 *
                </label>
                <select
                  value={newEmbeddingConfig.modelId}
                  onChange={(e) => setNewEmbeddingConfig({ ...newEmbeddingConfig, modelId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">모델을 선택하세요</option>
                  {models.filter(m => m.modelType === 'EMBEDDING' && !m.isDeprecated).map(model => (
                    <option key={model.id} value={model.id}>
                      {model.provider} - {model.modelName} (Dim: {model.dimension})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance Metric *
                </label>
                <select
                  value={newEmbeddingConfig.distanceMetric}
                  onChange={(e) => setNewEmbeddingConfig({ ...newEmbeddingConfig, distanceMetric: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="cosine">Cosine</option>
                  <option value="l2">L2 (Euclidean)</option>
                  <option value="dot">Dot Product</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newEmbeddingConfig.normalize}
                    onChange={(e) => setNewEmbeddingConfig({ ...newEmbeddingConfig, normalize: e.target.checked })}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Normalize vectors</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddEmbeddingConfigModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAddEmbeddingConfig}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add System Profile Modal */}
      {showAddProfileModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">새 시스템 프로필 추가</h3>
              <button
                onClick={() => setShowAddProfileModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로필 이름 *
                </label>
                <input
                  type="text"
                  value={newProfile.name}
                  onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                  placeholder="예: Production Profile"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명
                </label>
                <textarea
                  rows={3}
                  value={newProfile.description}
                  onChange={(e) => setNewProfile({ ...newProfile, description: e.target.value })}
                  placeholder="프로필에 대한 설명을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">LLM 모델 설정</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LLM Config 선택 *
                  </label>
                  <select
                    value={newProfile.llmModelConfigId}
                    onChange={(e) => setNewProfile({ ...newProfile, llmModelConfigId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">LLM 설정을 선택하세요</option>
                    {llmConfigs.map(config => {
                      const model = models.find(m => m.id === config.modelId);
                      return (
                        <option key={config.id} value={config.id}>
                          {model ? `${model.provider} - ${model.modelName}` : 'Unknown'} (Temp: {config.temperature}, MaxTokens: {config.maxTokens})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Embedding 모델 설정</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Embedding Config 선택 *
                  </label>
                  <select
                    value={newProfile.embeddingModelConfigId}
                    onChange={(e) => setNewProfile({ ...newProfile, embeddingModelConfigId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Embedding 설정을 선택하세요</option>
                    {embeddingConfigs.map(config => {
                      const model = models.find(m => m.id === config.modelId);
                      return (
                        <option key={config.id} value={config.id}>
                          {model ? `${model.provider} - ${model.modelName}` : 'Unknown'} ({config.distanceMetric})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newProfile.isActive}
                    onChange={(e) => setNewProfile({ ...newProfile, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">활성화 상태로 생성</span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  활성화하면 시스템에서 이 프로필을 즉시 사용합니다
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddProfileModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAddProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit System Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">시스템 프로필 수정</h3>
              <button
                onClick={() => {
                  setShowEditProfileModal(false);
                  setEditingProfile(null);
                  setNewProfile({
                    name: '',
                    description: '',
                    llmModelConfigId: '',
                    embeddingModelConfigId: '',
                    isActive: false
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로필 이름 *
                </label>
                <input
                  type="text"
                  value={newProfile.name}
                  onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                  placeholder="예: Production Profile"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명
                </label>
                <textarea
                  rows={3}
                  value={newProfile.description}
                  onChange={(e) => setNewProfile({ ...newProfile, description: e.target.value })}
                  placeholder="프로필에 대한 설명을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">LLM 모델 설정</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LLM Config 선택 *
                  </label>
                  <select
                    value={newProfile.llmModelConfigId}
                    onChange={(e) => setNewProfile({ ...newProfile, llmModelConfigId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">LLM 설정을 선택하세요</option>
                    {llmConfigs.map(config => {
                      const model = models.find(m => m.id === config.modelId);
                      return (
                        <option key={config.id} value={config.id}>
                          {model ? `${model.provider} - ${model.modelName}` : 'Unknown'} (Temp: {config.temperature}, MaxTokens: {config.maxTokens})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Embedding 모델 설정</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Embedding Config 선택 *
                  </label>
                  <select
                    value={newProfile.embeddingModelConfigId}
                    onChange={(e) => setNewProfile({ ...newProfile, embeddingModelConfigId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Embedding 설정을 선택하세요</option>
                    {embeddingConfigs.map(config => {
                      const model = models.find(m => m.id === config.modelId);
                      return (
                        <option key={config.id} value={config.id}>
                          {model ? `${model.provider} - ${model.modelName}` : 'Unknown'} ({config.distanceMetric})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newProfile.isActive}
                    onChange={(e) => setNewProfile({ ...newProfile, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">활성화 상태</span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  활성화하면 시스템에서 이 프로필을 즉시 사용합니다
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowEditProfileModal(false);
                  setEditingProfile(null);
                  setNewProfile({
                    name: '',
                    description: '',
                    llmModelConfigId: '',
                    embeddingModelConfigId: '',
                    isActive: false
                  });
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                수정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Cabinets Error Modal */}
      {showActiveCabinetsError && activeCabinetsError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-red-600">시스템 프로필 비활성화 불가</h3>
              <button
                onClick={() => {
                  setShowActiveCabinetsError(false);
                  setActiveCabinetsError(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-900 font-medium">
                  이 시스템 프로필을 사용하는 활성화된 캐비닛이 있어 비활성화할 수 없습니다.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">활성화된 캐비닛 목록</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">캐비닛 이름</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">프로젝트 ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">UUID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {activeCabinetsError.cabinets.map((cabinet) => (
                        <tr key={cabinet.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{cabinet.id}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{cabinet.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{cabinet.project_id}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 font-mono text-xs">{cabinet.cabinet_uuid}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="text-sm font-semibold text-blue-900 mb-2">해결 방법</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>캐비닛 관리</strong>로 이동하여 위 캐비닛들을 비활성화하거나 삭제하세요</li>
                  <li>• 또는 해당 캐비닛들이 다른 시스템 프로필을 사용하도록 변경하세요</li>
                  <li>• 모든 캐비닛을 처리한 후 다시 이 프로필을 비활성화할 수 있습니다</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowActiveCabinetsError(false);
                  setActiveCabinetsError(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit LLM Config Modal */}
      {showEditLLMConfigModal && editingLLMConfig && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">LLM 설정 수정</h3>
              <button
                onClick={() => {
                  setShowEditLLMConfigModal(false);
                  setEditingLLMConfig(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={editingLLMConfig.temperature}
                  onChange={(e) => setEditingLLMConfig({ ...editingLLMConfig, temperature: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Tokens *
                </label>
                <input
                  type="number"
                  min="1"
                  value={editingLLMConfig.maxTokens}
                  onChange={(e) => setEditingLLMConfig({ ...editingLLMConfig, maxTokens: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Top P *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={editingLLMConfig.topP}
                  onChange={(e) => setEditingLLMConfig({ ...editingLLMConfig, topP: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Prompt *
                </label>
                <textarea
                  rows={4}
                  value={editingLLMConfig.systemPrompt}
                  onChange={(e) => setEditingLLMConfig({ ...editingLLMConfig, systemPrompt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowEditLLMConfigModal(false);
                  setEditingLLMConfig(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleUpdateLLMConfig}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Embedding Config Modal */}
      {showEditEmbeddingConfigModal && editingEmbeddingConfig && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Embedding 설정 수정</h3>
              <button
                onClick={() => {
                  setShowEditEmbeddingConfigModal(false);
                  setEditingEmbeddingConfig(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance Metric *
                </label>
                <select
                  value={editingEmbeddingConfig.distanceMetric}
                  onChange={(e) => setEditingEmbeddingConfig({ ...editingEmbeddingConfig, distanceMetric: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="cosine">Cosine</option>
                  <option value="l2">L2 (Euclidean)</option>
                  <option value="dot">Dot Product</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-normalize"
                  checked={editingEmbeddingConfig.normalize}
                  onChange={(e) => setEditingEmbeddingConfig({ ...editingEmbeddingConfig, normalize: e.target.checked })}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="edit-normalize" className="text-sm font-medium text-gray-700">
                  Normalize Vectors
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowEditEmbeddingConfigModal(false);
                  setEditingEmbeddingConfig(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleUpdateEmbeddingConfig}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                저장
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
                <h3 className="font-semibold text-xl">🤖 모델 관리 안내</h3>
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
                <h4 className="font-semibold text-lg mb-3 text-blue-600">🎯 핵심 목적: AI 모델의 중앙 관리</h4>
                <p className="text-gray-700 leading-relaxed">
                  이 화면은 <strong>RAG 시스템에서 사용하는 LLM과 임베딩 모델을 등록하고, 설정을 관리하며, 임베딩 실행 이력을 추적</strong>하기 위한 것입니다. 
                  4개의 탭(모델 목록, 모델 설정, 시스템 프로필, 임베딩 실행 이력)으로 구성되어 
                  <strong>모델의 전체 라이프사이클</strong>을 관리합니다.
                </p>
              </div>

              {/* 주요 기능 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-purple-600">🔧 주요 기능 (4개 탭)</h4>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-2">1. 모델 목록 탭</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>LLM 및 임베딩 모델 등록</strong>: OpenAI, HuggingFace, 로컬 모델 등</li>
                      <li>• <strong>모델 정보</strong>: Provider, 모델명, 버전, 차원(임베딩), Deprecated 여부</li>
                      <li>• <strong>펼침 기능</strong>: 각 모델에 연결된 설정 목록 확인</li>
                      <li>• <strong>필터링</strong>: ALL, LLM, EMBEDDING 타입별 필터</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h5 className="font-semibold text-green-900 mb-2">2. 모델 설정 탭</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>LLM 설정</strong>: Temperature, Max Tokens, Top P, System Prompt</li>
                      <li>• <strong>임베딩 설정</strong>: Chunk Size, Overlap, Distance Metric, Normalize</li>
                      <li>• <strong>설정 편집</strong>: 기존 설정 수정 가능</li>
                      <li>• <strong>설정 조합</strong>: 하나의 모델에 여러 설정 조합 생성 가능</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h5 className="font-semibold text-purple-900 mb-2">3. 시스템 프로필 탭</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>프로필 생성</strong>: LLM 설정 + 임베딩 설정을 하나로 묶은 프로필</li>
                      <li>• <strong>활성화 관리</strong>: 프로필별로 활성화/비활성화 제어</li>
                      <li>• <strong>용도별 프로필</strong>: Production, Beta, Dev 등 환경별 프로필 운영</li>
                      <li>• <strong>즉시 전환</strong>: 활성 프로필 변경으로 시스템 전체 모델 전환</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <h5 className="font-semibold text-orange-900 mb-2">4. 임베딩 실행 이력 탭</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>임베딩 작업 추적</strong>: 문서별 임베딩 실행 내역</li>
                      <li>• <strong>상태 모니터링</strong>: PENDING, DONE, FAILED 상태 확인</li>
                      <li>• <strong>상세 정보 펼침</strong>: 청크 ID, 벡터 차원, 실행 시간 등</li>
                      <li>• <strong>페이지네이션</strong>: 대량 이력 효율적 조회</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 시스템 프로필 개념 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-green-600">🎭 시스템 프로필이란?</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-700 mb-3">
                    시스템 프로필은 <strong>LLM 설정 + 임베딩 설정을 하나로 묶은 논리적 단위</strong>입니다.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 font-semibold">LLM 설정:</span>
                      <span className="text-gray-700">응답 생성용 (Temperature, Max Tokens 등)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-600 font-semibold">임베딩 설정:</span>
                      <span className="text-gray-700">벡터 변환용 (Chunk Size, Distance Metric 등)</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    ➡️ 프로필 하나를 활성화하면 시스템 전체가 해당 설정으로 동작합니다.
                  </p>
                </div>
              </div>

              {/* 실무 활용 시나리오 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-orange-600">💡 실무 활용 시나리오</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 1: 새 모델 도입</h5>
                    <p className="text-sm text-gray-700">
                      모델 목록 탭 → 새 모델 추가 (예: GPT-4) → 모델 설정 탭 → 설정 추가 → 시스템 프로필에 반영
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 2: A/B 테스팅</h5>
                    <p className="text-sm text-gray-700">
                      동일 모델로 Temperature 다른 설정 2개 생성 → 각각 프로필 생성 → 프로필 전환하며 성능 비교
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 3: 임베딩 작업 모니터링</h5>
                    <p className="text-sm text-gray-700">
                      문서 업로드 후 → 임베딩 실행 이력 탭 → 상태 확인 (PENDING → DONE) → FAILED 시 재시도
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 4: 환경별 프로필 운영</h5>
                    <p className="text-sm text-gray-700">
                      Production 프로필(고성능 모델) + Dev 프로필(저비용 모델) → 환경 전환 시 프로필만 변경
                    </p>
                  </div>
                </div>
              </div>

              {/* LLM vs 임베딩 모델 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-purple-600">🔍 LLM vs 임베딩 모델</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-2">LLM (Large Language Model)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>역할</strong>: 텍스트 생성, 응답 생성</li>
                      <li>• <strong>예시</strong>: GPT-4, Claude, LLaMA</li>
                      <li>• <strong>주요 파라미터</strong>: Temperature, Max Tokens</li>
                      <li>• <strong>사용처</strong>: QA 답변, 요약, 대화</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h5 className="font-semibold text-green-900 mb-2">임베딩 모델</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>역할</strong>: 텍스트 → 벡터 변환</li>
                      <li>• <strong>예시</strong>: text-embedding-3-small, sentence-transformers</li>
                      <li>• <strong>주요 파라미터</strong>: Dimension, Distance Metric</li>
                      <li>• <strong>사용처</strong>: 문서 검색, 유사도 계산</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 워크플로우 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-blue-600">🔄 모델 관리 워크플로우</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span className="text-gray-700 font-semibold">➡️ 모델 목록 탭: 사용할 모델 등록 (LLM + 임베딩)</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <span className="text-gray-700 font-semibold">➡️ 모델 설정 탭: 각 모델의 파라미터 설정</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      <span className="text-gray-700 font-semibold">➡️ 시스템 프로필 탭: LLM + 임베딩 설정을 묶어 프로필 생성</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                      <span className="text-gray-700 font-semibold">➡️ 시스템 프로필 탭: 프로필 활성화</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                      <span className="text-gray-700">문서 관리 화면: 문서 업로드 및 청킹</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">6</span>
                      <span className="text-gray-700 font-semibold">➡️ 임베딩 실행 이력 탭: 청크 임베딩 작업 모니터링</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">7</span>
                      <span className="text-gray-700">QA 관리 화면: LLM으로 QA 생성 및 평가</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 주요 파라미터 설명 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-green-600">⚙️ 주요 파라미터 설명</h4>
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-1 text-sm">LLM 파라미터</h5>
                    <div className="text-xs text-gray-700 space-y-1">
                      <p>• <strong>Temperature</strong> (0.0~1.0): 응답 창의성 (낮을수록 일관적, 높을수록 다양함)</p>
                      <p>• <strong>Max Tokens</strong>: 생성할 최대 토큰 수</p>
                      <p>• <strong>Top P</strong> (0.0~1.0): 누적 확률 기반 샘플링</p>
                      <p>• <strong>System Prompt</strong>: 시스템 지시사항</p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <h5 className="font-semibold text-green-900 mb-1 text-sm">임베딩 파라미터</h5>
                    <div className="text-xs text-gray-700 space-y-1">
                      <p>• <strong>Chunk Size</strong>: 임베딩할 청크 크기</p>
                      <p>• <strong>Overlap</strong>: 청크 간 중복 영역</p>
                      <p>• <strong>Distance Metric</strong>: cosine(일반), l2(유클리드), dot(내적)</p>
                      <p>• <strong>Normalize</strong>: 벡터 정규화 여부</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 베스트 프랙티스 */}
              <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded">
                <h4 className="font-semibold text-amber-900 mb-2">💡 베스트 프랙티스</h4>
                <ul className="text-sm text-amber-800 leading-relaxed space-y-1">
                  <li>• <strong>환경별 프로필</strong>: Production, Beta, Dev 프로필 분리 운영</li>
                  <li>• <strong>설정 버전 관리</strong>: 모델 설정 변경 시 새 설정 추가(기존 유지) 후 비교</li>
                  <li>• <strong>임베딩 모니터링</strong>: FAILED 상태 발생 시 즉시 확인 및 재시도</li>
                  <li>• <strong>Deprecated 표시</strong>: 구형 모델은 Deprecated 체크하여 신규 사용 방지</li>
                  <li>• <strong>Temperature 조절</strong>: 사실 기반 답변은 낮게(0.3), 창의적 답변은 높게(0.8)</li>
                </ul>
              </div>

              {/* 요약 */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">📌 요약</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  이 화면은 RAG 시스템의 <strong>AI 모델을 통합 관리</strong>하는 중앙 허브입니다. 
                  모델 등록 → 설정 구성 → 프로필 생성 → 임베딩 실행 이력 추적까지 
                  <strong>모델의 전체 라이프사이클</strong>을 관리하며, 프로필 전환으로 
                  시스템 전체의 AI 동작을 즉시 변경할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}