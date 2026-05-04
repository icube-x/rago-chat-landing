import { useState } from 'react';
import { Layers, FileText, Search, Settings, Eye, Info, Database, Folder, Edit2, Save, X, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { CabinetModal } from './CabinetModal';
import { ProjectModal } from './ProjectModal';

interface Chunk {
  id: number;
  docId: string;
  fileName: string;
  chunkIndex: number;
  content: string;
  chunkingConfigId: number;
  metadata: {
    doc_id: string;
    source: string;
    page?: number;
    chunk_index: number;
    assets?: Array<{
      type: 'image' | 'table' | string;
      asset_id: string;
      path: string;
      caption?: string;
    }>;
  };
  createdAt: string;
}

interface ChunkingConfig {
  id: number;
  methodName: string;
  chunkSize: number;
  chunkOverlap: number;
  unit: 'token' | 'char';
  splitterVersion: string;
}

interface ProjectInfo {
  id: string;
  name: string;
  uuid: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

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

export function ChunkManagement({ 
  cabinetId, 
  projectInfo, 
  cabinetInfo 
}: { 
  cabinetId: string;
  projectInfo?: ProjectInfo;
  cabinetInfo?: CabinetInfo;
}) {
  const [chunks, setChunks] = useState<Chunk[]>([
    {
      id: 1,
      docId: 'uuid-1',
      fileName: 'product_documentation.pdf',
      chunkIndex: 0,
      content: 'RAG(Retrieval-Augmented Generation)는 대규모 언어 모델의 성능을 향상시키기 위해 외부 지식 베이스에서 관련 정보를 검색하여 활용하는 기술입니다. 이를 통해 모델은 더 정확하고 최신의 정보를 제공할 수 있습니다.',
      chunkingConfigId: 1,
      metadata: {
        doc_id: 'uuid-1',
        source: 'product_documentation.pdf',
        page: 1,
        chunk_index: 0,
        assets: [
          {
            type: 'image',
            asset_id: 'asset-1',
            path: 'images/product_documentation_page1.png',
            caption: 'Product Documentation Page 1'
          }
        ]
      },
      createdAt: '2026-01-27 10:32'
    },
    {
      id: 2,
      docId: 'uuid-1',
      fileName: 'product_documentation.pdf',
      chunkIndex: 1,
      content: '벡터 임베딩은 텍스트를 고차원 벡터 공간으로 변환하는 과정입니다. 의미적으로 유사한 텍스트는 벡터 공간에서 가까이 위치하게 되며, 이를 통해 효율적인 의미 검색이 가능합니다.',
      chunkingConfigId: 1,
      metadata: {
        doc_id: 'uuid-1',
        source: 'product_documentation.pdf',
        page: 2,
        chunk_index: 1,
        assets: [
          {
            type: 'table',
            asset_id: 'asset-2',
            path: 'tables/product_documentation_page2.csv',
            caption: 'Product Documentation Page 2 Table'
          }
        ]
      },
      createdAt: '2026-01-27 10:32'
    },
    {
      id: 3,
      docId: 'uuid-2',
      fileName: 'user_manual_v2.docx',
      chunkIndex: 0,
      content: '청크 분할(Chunking)은 긴 문서를 작은 단위로 나누는 과정으로, RAG 시스템의 성능에 중요한 영향을 미칩니다. 적절한 청크 크기는 컨텍스트를 유지하면서도 검색 정확도를 높일 수 있습니다.',
      chunkingConfigId: 1,
      metadata: {
        doc_id: 'uuid-2',
        source: 'user_manual_v2.docx',
        page: 1,
        chunk_index: 0,
        assets: [
          {
            type: 'image',
            asset_id: 'asset-3',
            path: 'images/user_manual_v2_page1.png',
            caption: 'User Manual Page 1'
          }
        ]
      },
      createdAt: '2026-01-27 09:18'
    }
  ]);

  const [configs, setConfigs] = useState<ChunkingConfig[]>([
    {
      id: 1,
      methodName: 'fixed_overlap',
      chunkSize: 512,
      chunkOverlap: 50,
      unit: 'token',
      splitterVersion: 'langchain-0.2'
    },
    {
      id: 2,
      methodName: 'paragraph',
      chunkSize: 1024,
      chunkOverlap: 0,
      unit: 'char',
      splitterVersion: 'langchain-0.2'
    },
    {
      id: 3,
      methodName: 'section',
      chunkSize: 2048,
      chunkOverlap: 100,
      unit: 'token',
      splitterVersion: 'langchain-0.2'
    },
    {
      id: 4,
      methodName: 'sentence',
      chunkSize: 256,
      chunkOverlap: 20,
      unit: 'char',
      splitterVersion: 'langchain-0.2'
    }
  ]);

  const [selectedConfig, setSelectedConfig] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingChunk, setViewingChunk] = useState<Chunk | null>(null);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);
  const [editingConfig, setEditingConfig] = useState<ChunkingConfig | null>(null);
  const [editForm, setEditForm] = useState<{
    chunkSize: number;
    chunkOverlap: number;
    unit: 'token' | 'char';
  }>({
    chunkSize: 0,
    chunkOverlap: 0,
    unit: 'token'
  });
  const [confirmingChange, setConfirmingChange] = useState<{
    from: ChunkingConfig;
    to: ChunkingConfig;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Info modal state
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showCabinetModal, setShowCabinetModal] = useState(false);

  const chunkingMethodInfo: Record<string, { title: string; description: string; examples: string[] }> = {
    fixed_overlap: {
      title: 'Fixed Overlap',
      description: '구조가 거의 없는 문서에 적합한 기본 모드. 문단이나 섹션 구조를 신뢰하기 어려워 의미 단위 분할이 힘든 경우, 일정 길이로 자르고 overlap으로 문맥을 보완하는 방식이 가장 안정적입니다.',
      examples: ['OCR로 추출한 텍스트 (스캔 PDF)', '채팅 로그', '이메일 모음', '자유 형식 보고서', '포맷이 제각각인 원본 데이터']
    },
    paragraph: {
      title: 'Paragraph',
      description: '설명 중심의 일반 문서에 가장 자연스러운 모드. 문단 하나가 보통 하나의 주제나 설명 단위이기 때문에, 문단 기준으로 나누면 문맥이 자연스럽게 유지됩니다. 검색 결과도 사람이 읽기에 가장 자연스럽습니다.',
      examples: ['블로그 글', '제품 설명서', '기술 해설 문서', '뉴스 기사', '강의 노트', '일반 보고서']
    },
    section: {
      title: 'Section',
      description: '구조화된 문서에 최적화된 모드. 제목(헤더) 단위로 내용이 명확히 구분되는 문서에 적합합니다. 사용자 질문도 보통 특정 주제나 항목(섹션)을 묻는 경우가 많아, 섹션 단위 청킹이 검색 정확도를 크게 높여줍니다.',
      examples: ['API 문서', '개발 가이드', '사내 위키 / Notion 문서', 'Markdown 문서', '정책 / 규정 문서', '법률 조항 문서']
    },
    sentence: {
      title: 'Sentence',
      description: '정밀 질의응답이 중요한 전문 문서용 모드. 답변이 문장 단위로 정확히 존재하는 경우가 많습니다. 문장 기반으로 잘게 나누면, 매우 구체적인 질문에 대해서도 정확한 근거 문장을 찾기 쉬워집니다.',
      examples: ['논문', '의학 문서', '법률 판례', '계약서', '연구 보고서', 'FAQ 데이터셋']
    }
  };

  const filteredChunks = chunks.filter(chunk =>
    chunk.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chunk.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConfigData = configs.find(c => c.id === selectedConfig);

  const handleEditConfig = (config: ChunkingConfig) => {
    setEditingConfig(config);
    setEditForm({
      chunkSize: config.chunkSize,
      chunkOverlap: config.chunkOverlap,
      unit: config.unit
    });
  };

  const handleSaveConfig = () => {
    if (editingConfig) {
      setConfigs(configs.map(c => 
        c.id === editingConfig.id 
          ? { ...c, ...editForm }
          : c
      ));
      setEditingConfig(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingConfig(null);
  };

  const handleConfigClick = (config: ChunkingConfig) => {
    // 같은 설정을 클릭하면 아무것도 하지 않음
    if (config.id === selectedConfig) {
      return;
    }
    
    const currentConfig = configs.find(c => c.id === selectedConfig);
    if (currentConfig) {
      setConfirmingChange({
        from: currentConfig,
        to: config
      });
    }
  };

  const handleConfirmChange = () => {
    if (confirmingChange) {
      setSelectedConfig(confirmingChange.to.id);
      setConfirmingChange(null);
      // TODO: 실제 API 호출하여 캐비닛 설정 변경
    }
  };

  const handleCancelChange = () => {
    setConfirmingChange(null);
  };

  const totalPages = Math.ceil(filteredChunks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentChunks = filteredChunks.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-semibold">청크 관리</h2>
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
              title="청크 관리 안내"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600">문서 청크와 분할 설정을 관리합니다</p>
        </div>
      </div>

      {/* Project & Cabinet Info */}
      {projectInfo && cabinetInfo && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Project Info */}
          <button
            onClick={() => setShowProjectModal(true)}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-blue-600 mb-1">PROJECT</p>
                <h3 className="text-lg font-bold text-gray-900 truncate">{projectInfo.name}</h3>
              </div>
            </div>
          </button>

          {/* Cabinet Info */}
          <button
            onClick={() => setShowCabinetModal(true)}
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Folder className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-purple-600 mb-1">CABINET</p>
                <h3 className="text-lg font-bold text-gray-900 truncate">{cabinetInfo.name}</h3>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Chunking Config Selection */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">청킹 설정</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {configs.map(config => {
              const methodInfo = chunkingMethodInfo[config.methodName];
              const isTooltipVisible = showTooltip === config.id;
              return (
                <div key={config.id} className="relative">
                  <div
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedConfig === config.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{config.methodName}</div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: 저장 기능 구현
                          }}
                          className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-green-600 transition-colors"
                          title="저장"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditConfig(config);
                          }}
                          className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                          title="설정"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowTooltip(isTooltipVisible ? null : config.id);
                          }}
                          className={`p-1 rounded-lg transition-colors ${
                            isTooltipVisible 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                          }`}
                          title="정보"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div 
                      onClick={() => handleConfigClick(config)}
                      className="text-sm text-gray-600 space-y-1 cursor-pointer"
                    >
                      <div>크기: {config.chunkSize} {config.unit}</div>
                      <div>오버랩: {config.chunkOverlap} {config.unit}</div>
                      <div className="text-xs text-gray-500">{config.splitterVersion}</div>
                    </div>
                  </div>
                  
                  {/* Tooltip */}
                  {isTooltipVisible && (
                    <div className="absolute left-0 top-full mt-2 w-80 bg-gray-900 text-white text-sm rounded-lg p-4 shadow-xl z-10">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold">{methodInfo?.title}</div>
                        <button
                          onClick={() => setShowTooltip(null)}
                          className="text-gray-400 hover:text-white -mt-1"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="text-gray-300 mb-3 leading-relaxed">{methodInfo?.description}</div>
                      <div className="border-t border-gray-700 pt-2">
                        <div className="text-xs text-gray-400 mb-1">적합한 문서:</div>
                        <ul className="text-xs text-gray-300 space-y-0.5">
                          {methodInfo?.examples.map((example, idx) => (
                            <li key={idx}>• {example}</li>
                          ))}
                        </ul>
                      </div>
                      {/* Arrow */}
                      <div className="absolute bottom-full left-8 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-900"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold">통계</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">총 청크 수</p>
              <p className="text-3xl font-semibold">{chunks.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">평균 길이</p>
              <p className="text-2xl font-semibold">
                {Math.round(chunks.reduce((sum, c) => sum + c.content.length, 0) / chunks.length)} 자
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="청크 내용 또는 파일명으로 검색..."
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Chunks List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Chunk ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">문서</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Index</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">내용 미리보기</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Config</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentChunks.map((chunk) => (
                <tr key={chunk.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {chunk.id}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium text-sm">{chunk.fileName}</div>
                        <div className="text-xs text-gray-500">ID: {chunk.docId.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-700">#{chunk.chunkIndex}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {chunk.content}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded font-medium inline-block w-fit">
                        {configs.find(c => c.id === chunk.chunkingConfigId)?.methodName || 'unknown'}
                      </span>
                      <div className="text-xs text-gray-500 space-y-0.5">
                        <div>
                          크기: {configs.find(c => c.id === chunk.chunkingConfigId)?.chunkSize || '-'} {configs.find(c => c.id === chunk.chunkingConfigId)?.unit || ''}
                        </div>
                        <div>
                          오버랩: {configs.find(c => c.id === chunk.chunkingConfigId)?.chunkOverlap || '-'} {configs.find(c => c.id === chunk.chunkingConfigId)?.unit || ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingChunk(chunk)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="전체 보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            총 {filteredChunks.length}개 청크 중 {startIndex + 1}-{Math.min(endIndex, filteredChunks.length)} 표시
          </div>
          
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
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
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-colors ${
                currentPage === totalPages
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

      {/* Chunk Viewer Modal */}
      {viewingChunk && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Chunk #{viewingChunk.id}</h3>
                  <p className="text-sm text-gray-600">
                    {viewingChunk.fileName} - Index {viewingChunk.chunkIndex}
                  </p>
                </div>
                <button
                  onClick={() => setViewingChunk(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {viewingChunk.content}
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">생성 일시:</span>
                  <span className="ml-2 font-medium">{viewingChunk.createdAt}</span>
                </div>
              </div>
              
              {/* Metadata Section */}
              {viewingChunk.metadata && (() => {
                const { doc_id, source, page, chunk_index, assets, ...otherMetadata } = viewingChunk.metadata;
                return (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Database className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-700">메타데이터</span>
                    </div>
                    
                    {/* Basic Metadata */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs font-medium text-gray-500 mb-1">doc_id</p>
                        <p className="text-sm text-gray-900 break-words font-mono">{doc_id}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs font-medium text-gray-500 mb-1">source</p>
                        <p className="text-sm text-gray-900 break-words">{source}</p>
                      </div>
                      {page !== undefined && (
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-xs font-medium text-gray-500 mb-1">page</p>
                          <p className="text-sm text-gray-900">{page}</p>
                        </div>
                      )}
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs font-medium text-gray-500 mb-1">chunk_index</p>
                        <p className="text-sm text-gray-900">{chunk_index}</p>
                      </div>
                      {Object.entries(otherMetadata).map(([key, value]) => (
                        <div key={key} className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-xs font-medium text-gray-500 mb-1">{key}</p>
                          <p className="text-sm text-gray-900 break-words">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Assets */}
                    {assets && assets.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-semibold text-gray-700">연관 에셋 ({assets.length})</span>
                        </div>
                        <div className="space-y-2">
                          {assets.map((asset, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="flex items-start gap-3">
                                <div className={`px-2 py-1 rounded text-xs font-medium ${
                                  asset.type === 'image' 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : asset.type === 'table'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {asset.type}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium text-gray-700">ID:</span>
                                    <code className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                                      {asset.asset_id}
                                    </code>
                                  </div>
                                  <div className="text-xs text-gray-600 mb-1">
                                    <span className="font-medium">Path:</span> {asset.path}
                                  </div>
                                  {asset.caption && (
                                    <div className="text-xs text-gray-600">
                                      <span className="font-medium">Caption:</span> {asset.caption}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
              
              {/* Chunking Config Details */}
              {(() => {
                const config = configs.find(c => c.id === viewingChunk.chunkingConfigId);
                if (config) {
                  return (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Settings className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-semibold text-gray-700">청킹 설정 정보</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          <span className="text-purple-500">방법:</span> {config.methodName}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          <span className="text-blue-500">크기:</span> {config.chunkSize} {config.unit}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <span className="text-green-500">오버랩:</span> {config.chunkOverlap} {config.unit}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          <span className="text-gray-500">버전:</span> {config.splitterVersion}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Edit Config Modal */}
      {editingConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">청킹 설정 편집</h3>
                  <p className="text-sm text-gray-600">{editingConfig.methodName}</p>
                </div>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Chunk Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  청크 크기
                </label>
                <input
                  type="number"
                  value={editForm.chunkSize}
                  onChange={(e) => setEditForm({ ...editForm, chunkSize: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>

              {/* Chunk Overlap */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  오버랩
                </label>
                <input
                  type="number"
                  value={editForm.chunkOverlap}
                  onChange={(e) => setEditForm({ ...editForm, chunkOverlap: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  단위
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="token"
                      checked={editForm.unit === 'token'}
                      onChange={(e) => setEditForm({ ...editForm, unit: e.target.value as 'token' | 'char' })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Token</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="char"
                      checked={editForm.unit === 'char'}
                      onChange={(e) => setEditForm({ ...editForm, unit: e.target.value as 'token' | 'char' })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Character</span>
                  </label>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs font-medium text-blue-600 mb-2">미리보기</p>
                <div className="text-sm text-gray-700 space-y-1">
                  <div>크기: {editForm.chunkSize} {editForm.unit}</div>
                  <div>오버랩: {editForm.chunkOverlap} {editForm.unit}</div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Change Modal */}
      {confirmingChange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">청킹 설정 변경 확인</h3>
                </div>
                <button
                  onClick={handleCancelChange}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">이 캐비닛의 청킹 방법을 변경하시겠습니까?</p>
                  <p className="text-xs">변경 시 기존청크는 유지되며 새로 업로드되는 문서에 적용됩니다.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 mb-2">현재 설정</p>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div className="font-semibold text-gray-900 mb-2">{confirmingChange.from.methodName}</div>
                    <div>크기: {confirmingChange.from.chunkSize} {confirmingChange.from.unit}</div>
                    <div>오버랩: {confirmingChange.from.chunkOverlap} {confirmingChange.from.unit}</div>
                    <div className="text-xs text-gray-500">{confirmingChange.from.splitterVersion}</div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-xs font-medium text-blue-600 mb-2">변경할 설정</p>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div className="font-semibold text-blue-900 mb-2">{confirmingChange.to.methodName}</div>
                    <div>크기: {confirmingChange.to.chunkSize} {confirmingChange.to.unit}</div>
                    <div>오버랩: {confirmingChange.to.chunkOverlap} {confirmingChange.to.unit}</div>
                    <div className="text-xs text-gray-500">{confirmingChange.to.splitterVersion}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end">
              <button
                onClick={handleCancelChange}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmChange}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                변경
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
                <h3 className="font-semibold text-xl">🧩 청크 관리 안내</h3>
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
                <h4 className="font-semibold text-lg mb-3 text-blue-600">🎯 핵심 목적: RAG 검색 품질의 핵심</h4>
                <p className="text-gray-700 leading-relaxed">
                  이 화면은 <strong>문서를 검색 가능한 작은 단위(청크)로 분할하고 관리</strong>하기 위한 것입니다. 
                  청킹 전략은 RAG 시스템의 검색 정확도와 응답 품질에 가장 큰 영향을 미치는 요소입니다.
                </p>
              </div>

              {/* 주요 기능 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-purple-600">🔧 주요 기능</h4>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-2">1. 청킹 설정 (ChunkingConfigs)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>4가지 청킹 방법</strong>: Fixed Overlap, Paragraph, Section, Sentence</li>
                      <li>• 청크 크기(Chunk Size): 한 청크의 최대 길이 설정</li>
                      <li>• 오버랩(Overlap): 청크 간 중복 영역으로 문맥 유지</li>
                      <li>• 단위 선택: Token 또는 Character</li>
                      <li>• 각 방법별 상세 정보 제공 (i 아이콘 클릭)</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h5 className="font-semibold text-green-900 mb-2">2. 청크 조회 및 검색</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 생성된 모든 청크 목록 확인</li>
                      <li>• 청크 내용 또는 파일명으로 검색</li>
                      <li>• 각 청크의 인덱스, 생성 시간, 적용된 설정 확인</li>
                      <li>• 전체 내용 보기로 상세 확인 가능</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h5 className="font-semibold text-yellow-900 mb-2">3. 청킹 방법 변경</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 캐비닛별 청킹 방법 실시간 변경 가능</li>
                      <li>• 변경 전/후 비교 확인</li>
                      <li>• 기존 청크는 유지, 신규 문서부터 새 설정 적용</li>
                      <li>• 청크 크기와 오버랩 커스텀 편집 가능</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 청킹 방법 상세 설명 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-green-600">📚 청킹 방법 선택 가이드</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
                    <h5 className="font-semibold text-gray-900 mb-1">Fixed Overlap (고정 오버랩)</h5>
                    <p className="text-sm text-gray-700 mb-2">
                      구조가 없는 문서에 가장 안정적. 일정 길이로 자르고 오버랩으로 문맥 보완.
                    </p>
                    <p className="text-xs text-gray-600">
                      💡 적합: OCR 텍스트, 채팅 로그, 이메일, 자유 형식 보고서
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50">
                    <h5 className="font-semibold text-gray-900 mb-1">Paragraph (문단 기반)</h5>
                    <p className="text-sm text-gray-700 mb-2">
                      일반 문서에 가장 자연스러움. 문단 단위로 나누어 문맥 유지.
                    </p>
                    <p className="text-xs text-gray-600">
                      💡 적합: 블로그, 제품 설명서, 기술 문서, 뉴스 기사
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
                    <h5 className="font-semibold text-gray-900 mb-1">Section (섹션 기반)</h5>
                    <p className="text-sm text-gray-700 mb-2">
                      구조화된 문서 최적화. 제목(헤더) 단위로 명확히 구분.
                    </p>
                    <p className="text-xs text-gray-600">
                      💡 적합: API 문서, 개발 가이드, 위키, Markdown 문서
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50">
                    <h5 className="font-semibold text-gray-900 mb-1">Sentence (문장 기반)</h5>
                    <p className="text-sm text-gray-700 mb-2">
                      정밀 질의응답용. 문장 단위로 잘게 나누어 정확한 근거 제시.
                    </p>
                    <p className="text-xs text-gray-600">
                      💡 적합: 논문, 의학 문서, 법률 판례, 계약서, FAQ
                    </p>
                  </div>
                </div>
              </div>

              {/* 파라미터 설명 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-orange-600">⚙️ 핵심 파라미터</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-semibold text-blue-600">청크 크기 (Chunk Size)</span>
                      <p className="text-gray-700 mt-1">
                        한 청크의 최대 길이. 너무 크면 노이즈 증가, 너무 작으면 문맥 손실.
                        <br />
                        <span className="text-xs text-gray-600">권장: 512~1024 tokens</span>
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-green-600">오버랩 (Chunk Overlap)</span>
                      <p className="text-gray-700 mt-1">
                        인접 청크 간 중복 영역. 문장이 잘리는 것을 방지하고 문맥 연속성 유지.
                        <br />
                        <span className="text-xs text-gray-600">권장: 청크 크기의 10~20%</span>
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-purple-600">단위 (Unit)</span>
                      <p className="text-gray-700 mt-1">
                        <strong>Token</strong>: LLM이 이해하는 단위, 정확한 제어<br />
                        <strong>Character</strong>: 문자 수 기준, 간단한 설정
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 실무 활용 시나리오 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-purple-600">💡 실무 활용 시나리오</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 1: 청킹 전략 최적화</h5>
                    <p className="text-sm text-gray-700">
                      검색 결과 품질 낮음 → 청킹 방법 변경 → 테스트 → QA 평가로 성능 확인
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 2: 문서 유형별 설정</h5>
                    <p className="text-sm text-gray-700">
                      기술 문서 → Section / 논문 → Sentence / 일반 문서 → Paragraph
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 3: 청크 품질 검증</h5>
                    <p className="text-sm text-gray-700">
                      생성된 청크 내용 확인 → 문맥이 잘 유지되는지 검토 → 파라미터 조정
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 4: A/B 테스팅</h5>
                    <p className="text-sm text-gray-700">
                      여러 청킹 설정으로 동일 문서 처리 → QA 평가 점수 비교 → 최적 설정 선택
                    </p>
                  </div>
                </div>
              </div>

              {/* 워크플로우 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-blue-600">🔄 청킹 워크플로우</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span className="text-gray-700">문서 관리 화면: 문서 업로드 및 파싱</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <span className="text-gray-700 font-semibold">➡️ 이 화면: 청킹 설정 선택 (방법, 크기, 오버랩)</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      <span className="text-gray-700 font-semibold">➡️ 이 화면: 문서 자동 청킹 (백그라운드)</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                      <span className="text-gray-700 font-semibold">➡️ 이 화면: 생성된 청크 조회 및 검증</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                      <span className="text-gray-700">모델 관리 화면: 청크 임베딩 (벡터 변환)</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">6</span>
                      <span className="text-gray-700">QA 관리 화면: 청크 기반 QA 생성 및 평가</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 베스트 프랙티스 */}
              <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded">
                <h4 className="font-semibold text-amber-900 mb-2">💡 베스트 프랙티스</h4>
                <ul className="text-sm text-amber-800 leading-relaxed space-y-1">
                  <li>• <strong>작게 시작</strong>: 먼저 기본 설정으로 테스트 후 점진적 최적화</li>
                  <li>• <strong>오버랩 필수</strong>: 0으로 설정하면 문장이 잘려 품질 저하</li>
                  <li>• <strong>통계 활용</strong>: 평균 청크 길이를 확인하여 설정 적정성 판단</li>
                  <li>• <strong>QA 평가 연계</strong>: 청킹 변경 후 QA 평가 점수로 성능 측정</li>
                </ul>
              </div>

              {/* 요약 */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">📌 요약</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  이 화면은 RAG 시스템의 <strong>검색 품질을 결정하는 핵심 단계</strong>입니다. 
                  문서 유형에 맞는 청킹 방법을 선택하고, 청크 크기와 오버랩을 최적화하여 
                  <strong>정확한 검색과 자연스러운 응답</strong>을 구현합니다.
                  <br />
                  생성된 청크를 직접 확인하고 품질을 검증하여 시스템을 지속적으로 개선할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {showProjectModal && projectInfo && (
        <ProjectModal
          projectInfo={projectInfo}
          onClose={() => setShowProjectModal(false)}
        />
      )}

      {/* Cabinet Modal */}
      {showCabinetModal && cabinetInfo && (
        <CabinetModal
          cabinetInfo={cabinetInfo}
          onClose={() => setShowCabinetModal(false)}
        />
      )}
    </div>
  );
}