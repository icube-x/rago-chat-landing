import { useState } from 'react';
import { Send, Loader2, FileText, Sparkles, ChevronDown, ChevronUp, X, Image as ImageIcon, Table as TableIcon, XCircle } from 'lucide-react';

interface DocumentQAPanelProps {
  docId: string;
  fileName: string;
  cabinetId: string;
  onClose: () => void;
  isModal?: boolean;
}

interface Asset {
  type: 'image' | 'table' | 'chart';
  url?: string;
  caption?: string;
  data?: any;
}

interface QAResult {
  documentInfo: {
    docId: string;
    fileName: string;
    totalChunks: number;
    totalPages: number;
  };
  query: string;
  answer: string;
  retrievedChunks: Array<{
    chunkId: number;
    content: string;
    score: number;
    usedInGeneration: boolean; // LLM이 실제로 답변 생성에 사용했는지 여부
    metadata: { 
      page?: number; 
      source?: string;
      chunk_index?: number;
      assets?: Asset[];
    };
  }>;
  retrievedChunksCount: number;
  avgSimilarityScore: number;
  topSimilarityScore: number;
  responseTime: number;
  embeddingTime: number;
  retrievalTime: number;
  generationTime: number;
}

export function DocumentQAPanel({ 
  docId, 
  fileName, 
  cabinetId,
  onClose,
  isModal = false
}: DocumentQAPanelProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<QAResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showChunks, setShowChunks] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    // 새로운 AbortController 생성
    const controller = new AbortController();
    setAbortController(controller);
    
    setIsLoading(true);
    setError(null);

    try {
      // Mock API call - 실제 환경에서는 fetch에 signal 전달
      // await fetch('/api/qa', { signal: controller.signal, ... })
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, 3000); // 3초로 늘림 (취소 테스트용)
        
        // abort 이벤트 리스너
        controller.signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new Error('요청이 취소되었습니다'));
        });
      });

      // Mock response
      const mockResult: QAResult = {
        documentInfo: {
          docId,
          fileName,
          totalChunks: 245,
          totalPages: 50
        },
        query: query.trim(),
        answer: `${fileName} 문서의 내용을 기반으로 답변드립니다.\n\n질문하신 "${query.trim()}"에 대한 답변은 다음과 같습니다:\n\n이 문서는 제품의 설치 및 운영에 관한 포괄적인 가이드를 제공합니다. 주요 섹션에는 시스템 요구사항, 단계별 설치 절차, 구성 옵션, 그리고 일반적인 문제 해결 방법이 포함되어 있습니다.\n\n특히 중요한 것은 초기 설정 과정에서 데이터베이스 연결 정보를 올바르게 구성하는 것입니다. 이는 시스템의 안정적인 운영을 위한 핵심 요소입니다.`,
        retrievedChunks: [
          {
            chunkId: 1245,
            content: `이 제품의 설치를 시작하기 전에 다음 시스템 요구사항을 확인하십시오: CPU 2GHz 이상, RAM 8GB 이상, HDD 50GB 이상의 여유 공간. 운영체제는 Windows 10 이상 또는 Ubuntu 20.04 LTS 이상을 권장합니다.`,
            score: 0.9234,
            usedInGeneration: true,
            metadata: { 
              page: 12, 
              source: fileName,
              chunk_index: 0,
              assets: [
                {
                  type: 'table',
                  caption: '시스템 요구사항 비교표'
                }
              ]
            }
          },
          {
            chunkId: 1246,
            content: `설치 과정은 다음 단계로 구성됩니다: 1) 설치 파일 다운로드, 2) 관리자 권한으로 설치 프로그램 실행, 3) 라이선스 동의, 4) 설치 경로 선택, 5) 데이터베이스 연결 설정, 6) 설치 완료 및 재부팅.`,
            score: 0.8976,
            usedInGeneration: true,
            metadata: { 
              page: 13, 
              source: fileName,
              chunk_index: 1,
              assets: [
                {
                  type: 'image',
                  url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
                  caption: '설치 프로세스 플로우차트'
                }
              ]
            }
          },
          {
            chunkId: 1247,
            content: `데이터베이스 연결 설정 시 주의사항: 호스트 주소는 IP 또는 도메인 형식으로 입력 가능하며, 포트 번호는 기본값 3306을 사용합니다. 사용자 이름과 비밀번호는 데이터베이스 관리자로부터 제공받은 정보를 정확히 입력해야 합니다.`,
            score: 0.8845,
            usedInGeneration: true,
            metadata: { 
              page: 14, 
              source: fileName,
              chunk_index: 2
            }
          },
          {
            chunkId: 1248,
            content: `설치가 완료된 후 시스템 관리자 계정으로 로그인하여 초기 설정을 진행합니다. 관리자 패널에서 사용자 권한, 보안 정책, 백업 스케줄 등을 구성할 수 있습니다.`,
            score: 0.8512,
            usedInGeneration: false, // 검색만 되고 답변에 사용되지 않음
            metadata: { 
              page: 15, 
              source: fileName,
              chunk_index: 3,
              assets: [
                {
                  type: 'image',
                  url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
                  caption: '관리자 대시보드 스크린샷'
                },
                {
                  type: 'table',
                  caption: '사용자 권한 설정 목록'
                }
              ]
            }
          },
          {
            chunkId: 1249,
            content: `일반적인 설치 오류 해결 방법: "데이터베이스 연결 실패" 오류가 발생하는 경우 방화벽 설정을 확인하고, 데이터베이스 서버가 실행 중인지 점검하십시오. "권한 거부" 오류는 관리자 권한으로 재실행하여 해결할 수 있습니다.`,
            score: 0.8201,
            usedInGeneration: false, // 검색만 되고 답변에 사용되지 않음
            metadata: { 
              page: 16, 
              source: fileName,
              chunk_index: 4
            }
          },
          {
            chunkId: 1250,
            content: `제품 업데이트 및 패치 관리: 정기적인 업데이트를 통해 최신 기능과 보안 패치를 적용할 수 있습니다. 자동 업데이트 기능을 활성화하거나 수동으로 업데이트 파일을 다운로드하여 설치할 수 있습니다.`,
            score: 0.7845,
            usedInGeneration: false, // 검색만 되고 답변에 사용되지 않음
            metadata: { 
              page: 20, 
              source: fileName,
              chunk_index: 5
            }
          }
        ],
        retrievedChunksCount: 6,
        avgSimilarityScore: 0.8754,
        topSimilarityScore: 0.9234,
        responseTime: 1.456,
        embeddingTime: 0.234,
        retrievalTime: 0.098,
        generationTime: 1.124
      };

      setResult(mockResult);
    } catch (err: any) {
      setError(err.message || '검색에 실패했습니다');
    } finally {
      setIsLoading(false);
      setAbortController(null); // AbortController 초기화
    }
  };

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      setIsLoading(false);
      setAbortController(null);
    }
  };

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 shadow-sm ${isModal ? '' : 'mt-4 mb-4'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">문서별 Q&A 테스트</h3>
            <p className="text-sm text-gray-600">{fileName}</p>
          </div>
        </div>
        {isModal && (
          <button
            onClick={onClose}
            className="px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Document Info */}
      <div className="bg-white rounded-lg p-3 mb-4 border border-blue-200 shadow-sm">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">🔍 검색 범위:</span> 이 문서의 청크만 검색됩니다
          <span className="text-xs text-gray-600 ml-2">(다른 문서는 검색되지 않음)</span>
        </p>
      </div>

      {/* Query Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이 문서에 대해 질문하세요
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSubmit()}
            placeholder="예: 이 문서의 주요 내용은?"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !query.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                검색 중...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                전송
              </>
            )}
          </button>
          {isLoading && (
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-sm"
            >
              <X className="w-4 h-4" />
              취소
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-800">❌ {error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4">
          {/* Metrics */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white rounded-lg p-3 border border-green-200 shadow-sm">
              <p className="text-xs font-medium text-green-600 mb-1">검색 청크</p>
              <p className="text-xl font-bold text-green-900">
                {result.retrievedChunksCount}개
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
              <p className="text-xs font-medium text-blue-600 mb-1">평균 유사도</p>
              <p className="text-xl font-bold text-blue-900">
                {(result.avgSimilarityScore * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-purple-200 shadow-sm">
              <p className="text-xs font-medium text-purple-600 mb-1">최고 유사도</p>
              <p className="text-xl font-bold text-purple-900">
                {(result.topSimilarityScore * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-orange-200 shadow-sm">
              <p className="text-xs font-medium text-orange-600 mb-1">응답 시간</p>
              <p className="text-xl font-bold text-orange-900">
                {result.responseTime.toFixed(2)}s
              </p>
            </div>
          </div>

          {/* Answer */}
          <div className="bg-white rounded-lg p-5 border border-blue-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">AI 답변</h4>
            </div>
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {result.answer}
            </p>
          </div>

          {/* Performance Breakdown */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">⚡ 성능 분석</h4>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <p className="text-gray-600 mb-1">임베딩 생성</p>
                <p className="font-semibold text-gray-900">{result.embeddingTime.toFixed(3)}s</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">벡터 검색</p>
                <p className="font-semibold text-gray-900">{result.retrievalTime.toFixed(3)}s</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">답변 생성</p>
                <p className="font-semibold text-gray-900">{result.generationTime.toFixed(3)}s</p>
              </div>
            </div>
          </div>

          {/* Retrieved Chunks */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-700">검색된 청크 ({result.retrievedChunks.length}개)</p>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  ✅ {result.retrievedChunks.filter(c => c.usedInGeneration).length}개 답변에 사용
                </span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                  ⏭️ {result.retrievedChunks.filter(c => !c.usedInGeneration).length}개 미사용
                </span>
              </div>
            </div>

            {result.retrievedChunks.map((chunk, idx) => {
              // LLM 사용 여부에 따른 색상 결정
              const getChunkStyle = (used: boolean) => {
                if (used) {
                  return {
                    border: 'border-blue-500',
                    bg: 'bg-blue-50',
                    badge: 'bg-blue-100 text-blue-700',
                    label: '✅ 답변에 사용됨',
                    icon: '✅'
                  };
                } else {
                  return {
                    border: 'border-gray-300',
                    bg: 'bg-gray-50',
                    badge: 'bg-gray-100 text-gray-600',
                    label: '⏭️ 검색만 됨',
                    icon: '⏭️'
                  };
                }
              };

              const style = getChunkStyle(chunk.usedInGeneration);

              return (
                <div
                  key={idx}
                  className={`${style.bg} border-2 ${style.border} rounded-lg p-4 hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-700">
                        Chunk #{chunk.chunkId}
                      </span>
                      {chunk.metadata.page && (
                        <span className="text-xs text-gray-500">
                          • Page {chunk.metadata.page}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${style.badge} font-medium`}>
                        {style.label}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">
                        {style.icon}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${chunk.score * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-green-600">
                        {(chunk.score * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {chunk.content}
                  </p>
                  
                  {/* Assets */}
                  {chunk.metadata.assets && chunk.metadata.assets.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="text-xs font-medium text-gray-600 mb-2">📎 연관 에셋:</p>
                      <div className="flex flex-wrap gap-2">
                        {chunk.metadata.assets.map((asset, assetIdx) => (
                          <div key={assetIdx} className="flex items-center gap-2">
                            {asset.type === 'image' && asset.url && (
                              <div className="group relative">
                                <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded px-2 py-1 text-xs text-blue-700 hover:bg-blue-100 transition-colors">
                                  <ImageIcon className="w-3 h-3" />
                                  <span>{asset.caption || '이미지'}</span>
                                </div>
                                {/* Image Preview on Hover */}
                                <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-10 bg-white border border-gray-300 rounded-lg shadow-lg p-2">
                                  <img 
                                    src={asset.url} 
                                    alt={asset.caption || '이미지'}
                                    className="w-48 h-auto rounded"
                                  />
                                  {asset.caption && (
                                    <p className="text-xs text-gray-600 mt-1 text-center">{asset.caption}</p>
                                  )}
                                </div>
                              </div>
                            )}
                            {asset.type === 'table' && (
                              <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded px-2 py-1 text-xs text-green-700">
                                <TableIcon className="w-3 h-3" />
                                <span>{asset.caption || '테이블'}</span>
                              </div>
                            )}
                            {asset.type === 'chart' && (
                              <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 rounded px-2 py-1 text-xs text-purple-700">
                                <Sparkles className="w-3 h-3" />
                                <span>{asset.caption || '차트'}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !isLoading && !error && (
        <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            이 문서에 대해 질문을 입력하세요
          </p>
          <p className="text-xs text-gray-400 mt-1">
            검색 범위가 이 문서로 제한됩니다
          </p>
        </div>
      )}
    </div>
  );
}