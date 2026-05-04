import { useState } from 'react';
import { Send, Loader2, FileText, Zap, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, Sparkles, X } from 'lucide-react';

interface RetrievedChunk {
  chunkId: number;
  docId: string;
  fileName: string;
  chunkIndex: number;
  content: string;
  score: number;
  metadata: {
    page?: number;
    source: string;
  };
}

interface TestResult {
  query: string;
  answer: string;
  retrievedChunks: RetrievedChunk[];
  responseTime: number;
  model: string;
  embeddingModel: string;
  timestamp: string;
}

export function RAGTestPanel() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [expandedChunks, setExpandedChunks] = useState<Set<number>>(new Set());
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const handleTest = async () => {
    if (!query.trim()) return;

    // 새로운 AbortController 생성
    const controller = new AbortController();
    setAbortController(controller);

    setIsLoading(true);
    
    try {
      // Simulate API call - 실제 환경에서는 fetch에 signal 전달
      // await fetch('/api/rag/test', { signal: controller.signal, ... })
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, 3000); // 3초로 늘림 (취소 테스트용)
        
        // abort 이벤트 리스너
        controller.signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new Error('요청이 취소되었습니다'));
        });
      });

      const mockResult: TestResult = {
        query: query,
        answer: 'RAG(Retrieval-Augmented Generation)는 대규모 언어 모델의 성능을 향상시키기 위해 외부 지식 베이스에서 관련 정보를 색하여 활용하는 기술입니다. 먼저 사용자의 질문에 대해 벡터 데이터베이스에서 의미적으로 유사한 문서 청크를 검색합니다. 검색된 청크들은 컨텍스트로 활용되어 LLM에 전달되며, 모델은 이 정보를 바탕으로 더 정확하고 최신의 답변을 생성합니다. 이를 통해 hallucination을 줄이고, 특정 도메인 지식을 효과적으로 활용할 수 있습니다.',
        retrievedChunks: [
          {
            chunkId: 1,
            docId: 'uuid-1',
            fileName: 'product_documentation.pdf',
            chunkIndex: 0,
            content: 'RAG(Retrieval-Augmented Generation)는 대규모 언어 모델의 성능을 향상시키기 위해 외부 지식 베이스에서 관련 정보를 검색하여 활용하는 기술입니다. 이를 통해 모델은 더 정확하고 최신의 정보를 제공할 수 있습니다.',
            score: 0.94,
            metadata: {
              page: 1,
              source: 'product_documentation.pdf'
            }
          },
          {
            chunkId: 3,
            docId: 'uuid-2',
            fileName: 'user_manual_v2.docx',
            chunkIndex: 0,
            content: '청크 분할(Chunking)은 긴 문서를 작은 단위로 나누는 과정으로, RAG 시스템의 성능에 중요한 영향을 미칩니다. 적절한 청크 크기는 컨텍스트를 유지하면서도 검색 정확도를 높일 수 있습니다.',
            score: 0.87,
            metadata: {
              page: 1,
              source: 'user_manual_v2.docx'
            }
          },
          {
            chunkId: 2,
            docId: 'uuid-1',
            fileName: 'product_documentation.pdf',
            chunkIndex: 1,
            content: '벡터 임베딩은 텍스트를 고차원 벡터 공간으로 변환하는 과정입니다. 의미적으로 유사한 텍스트는 벡터 공간에서 가까이 위치하게 되며, 이를 통해 효율적인 의미 검색이 가능합니다.',
            score: 0.82,
            metadata: {
              page: 2,
              source: 'product_documentation.pdf'
            }
          }
        ],
        responseTime: 1.24,
        model: 'gpt-4-turbo-preview',
        embeddingModel: 'text-embedding-3-large',
        timestamp: new Date().toLocaleString('ko-KR')
      };

      setTestResult(mockResult);
      setTestHistory(prev => [mockResult, ...prev].slice(0, 5)); // Keep last 5 tests
    } catch (error) {
      console.error('테스트 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const toggleChunkExpand = (chunkId: number) => {
    setExpandedChunks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chunkId)) {
        newSet.delete(chunkId);
      } else {
        newSet.add(chunkId);
      }
      return newSet;
    });
  };

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 0.8) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 0.7) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 0.9) return 'bg-green-500';
    if (score >= 0.8) return 'bg-blue-500';
    if (score >= 0.7) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">RAG 테스트</h3>
          <p className="text-sm text-gray-600">문서 ingestion 후 질의응답 성능을 테스트합니다</p>
        </div>
      </div>

      {/* Query Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          테스트 질문
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleTest()}
            placeholder="예: RAG가 무엇인가요?"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleTest}
            disabled={isLoading || !query.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                테스트 중...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                테스트
              </>
            )}
          </button>
          {isLoading && (
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center gap-2 font-medium"
            >
              <X className="w-4 h-4" />
              취소
            </button>
          )}
        </div>
        
        {/* Quick Test Queries */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">빠른 테스트:</span>
          {[
            'RAG가 무엇인가요?',
            '벡터 임베딩에 대해 설명해주세요',
            '청킹의 중요성은?'
          ].map((quickQuery) => (
            <button
              key={quickQuery}
              onClick={() => setQuery(quickQuery)}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              {quickQuery}
            </button>
          ))}
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <div className="space-y-4">
          {/* Metadata */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-600">응답 시간</span>
              </div>
              <p className="text-lg font-semibold text-green-900">{testResult.responseTime}s</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-600">검색된 청크</span>
              </div>
              <p className="text-lg font-semibold text-blue-900">{testResult.retrievedChunks.length}개</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-600">생성 모델</span>
              </div>
              <p className="text-sm font-semibold text-purple-900 truncate">{testResult.model}</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-pink-600" />
                <span className="text-xs font-medium text-pink-600">임베딩 모델</span>
              </div>
              <p className="text-sm font-semibold text-pink-900 truncate">{testResult.embeddingModel}</p>
            </div>
          </div>

          {/* Answer */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-5 border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-purple-900">생성된 답변</h4>
            </div>
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{testResult.answer}</p>
          </div>

          {/* Retrieved Chunks */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">검색된 청크</h4>
              <span className="text-xs text-gray-500">
                (검색 점수 순)
              </span>
            </div>
            <div className="space-y-3">
              {testResult.retrievedChunks.map((chunk) => {
                const isExpanded = expandedChunks.has(chunk.chunkId);
                return (
                  <div
                    key={chunk.chunkId}
                    className={`rounded-lg p-4 border-2 transition-all ${getScoreColor(chunk.score)}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {chunk.fileName}
                          </span>
                          <span className="text-xs text-gray-500">
                            Chunk #{chunk.chunkIndex}
                          </span>
                          {chunk.metadata.page && (
                            <span className="text-xs text-gray-500">
                              • Page {chunk.metadata.page}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className={`px-3 py-1 rounded-full flex items-center gap-1.5`}>
                          <div className={`w-2 h-2 rounded-full ${getScoreBadgeColor(chunk.score)}`}></div>
                          <span className="text-sm font-semibold text-gray-900">
                            {(chunk.score * 100).toFixed(1)}%
                          </span>
                        </div>
                        <button
                          onClick={() => toggleChunkExpand(chunk.chunkId)}
                          className="p-1 hover:bg-white/50 rounded transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className={`text-sm text-gray-700 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {chunk.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>테스트 시간: {testResult.timestamp}</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!testResult && !isLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-2">질문을 입력하고 테스트 버튼을 눌러보세요</p>
          <p className="text-sm text-gray-400">
            문서 ingestion이 완료된 후 RAG 시스템의 성능을 확인할 수 있습니다
          </p>
        </div>
      )}

      {/* Test History (Optional) */}
      {testHistory.length > 1 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">최근 테스트 기록</h4>
          <div className="space-y-2">
            {testHistory.slice(1).map((test, idx) => (
              <button
                key={idx}
                onClick={() => setTestResult(test)}
                className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-gray-700 truncate flex-1">{test.query}</p>
                  <span className="text-xs text-gray-500 flex-shrink-0">{test.timestamp}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}