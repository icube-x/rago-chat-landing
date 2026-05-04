import { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Edit, X, Check, ExternalLink, FileText, Info, Filter, Search, Calendar, SlidersHorizontal, File, HardDrive } from 'lucide-react';

interface EnqueryAnswer {
  id: number;
  task_id: string;
  channel: string;
  question: string;
  ai_answer: string;
  human_answer: string | null;
  final_answer: string | null;
  action: 'WAITING' | 'APPROVE' | 'EDIT' | 'REJECT';
  human: string | null;
  score: number | null;
  reason: string | null;
  created_at: string;
  updated_at: string;
  cited_chunks: CitedChunk[];
}

interface CitedChunk {
  chunk_id: number;
  doc_uuid: string;
  chunk_index: number;
  content: string;
  file_name: string;
  file_type: string;
  file_size: number;
}

export function QueryMonitor({ cabinetId }: { cabinetId: string }) {
  const [enqueries, setEnqueries] = useState<EnqueryAnswer[]>([
    {
      id: 1,
      task_id: 'task-abc123',
      channel: 'kakao',
      question: 'RAG 시스템의 주요 장점은 무엇인가요?',
      ai_answer: 'RAG 시스템의 주요 장점은 실시간 정보 업데이트, 정확도 향상, 그리고 투명한 출처 제공입니다.',
      human_answer: null,
      final_answer: 'RAG 시스템의 주요 장점은 실시간 정보 업데이트, 정확도 향상, 그리고 투명한 출처 제공입니다.',
      action: 'APPROVE',
      human: 'admin@example.com',
      score: 9,
      reason: null,
      created_at: '2026-01-27 14:30',
      updated_at: '2026-01-27 14:32',
      cited_chunks: [
        { chunk_id: 1, doc_uuid: 'doc-001', chunk_index: 0, content: 'RAG는 외부 지식을 활용하여...', file_name: 'product_documentation.pdf', file_type: 'pdf', file_size: 12345 },
        { chunk_id: 2, doc_uuid: 'doc-001', chunk_index: 1, content: '벡터 검색을 통해...', file_name: 'product_documentation.pdf', file_type: 'pdf', file_size: 12345 }
      ]
    },
    {
      id: 2,
      task_id: 'task-def456',
      channel: 'email',
      question: '청크 크기는 어떻게 설정해야 하나요?',
      ai_answer: '청크 크기는 일반적으로 512-1024 토큰이 적절합니다.',
      human_answer: '청크 크기는 문서 특성에 따라 다르지만, 일반적으로 512-1024 토큰이 권장됩니다. 기술 문서의 경우 더 큰 크기가 필요할 수 있습니다.',
      final_answer: '청크 크기는 문서 특성에 따라 다르지만, 일반적으로 512-1024 토큰이 권장됩니다. 기술 문서의 경우 더 큰 크기가 필요할 수 있습니다.',
      action: 'EDIT',
      human: 'expert@example.com',
      score: 7,
      reason: 'AI 답변에 문서 특성별 가이드가 부족함',
      created_at: '2026-01-27 13:15',
      updated_at: '2026-01-27 13:20',
      cited_chunks: [
        { chunk_id: 3, doc_uuid: 'doc-002', chunk_index: 0, content: '청크 분할 전략...', file_name: 'user_manual_v2.docx', file_type: 'docx', file_size: 6789 }
      ]
    },
    {
      id: 3,
      task_id: 'task-ghi789',
      channel: 'slack',
      question: '벡터 데이터베이스 비용은 얼마인가요?',
      ai_answer: '벡터 데이터베이스 비용은 프로바이더에 따라 다릅니다.',
      human_answer: '죄송합니다. 비용 관련 문의는 영업팀으로 문의 부탁드립니다.',
      final_answer: '죄송합니다. 비용 관련 문의는 영업팀으로 문의 부탁드립니다.',
      action: 'REJECT',
      human: 'support@example.com',
      score: 2,
      reason: '비용 관련 정보는 공개되지 않음',
      created_at: '2026-01-27 12:00',
      updated_at: '2026-01-27 12:05',
      cited_chunks: []
    },
    {
      id: 4,
      task_id: 'task-jkl012',
      channel: 'web',
      question: '임베딩 모델은 어떤 것을 사용하나요?',
      ai_answer: '주로 OpenAI의 text-embedding-3-small 모델을 사용합니다.',
      human_answer: null,
      final_answer: '주로 OpenAI의 text-embedding-3-small 모델을 사용합니다.',
      action: 'WAITING',
      human: null,
      score: null,
      reason: null,
      created_at: '2026-01-27 15:45',
      updated_at: '2026-01-27 15:45',
      cited_chunks: [
        { chunk_id: 5, doc_uuid: 'doc-001', chunk_index: 2, content: '임베딩 모델 선택...', file_name: 'product_documentation.pdf', file_type: 'pdf', file_size: 12345 }
      ]
    }
  ]);

  const [selectedEnquery, setSelectedEnquery] = useState<EnqueryAnswer | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all', // all, pending, approved, edited, rejected
    searchQuery: ''
  });

  // Apply filters to enqueries
  const filteredEnqueries = enqueries
    .filter((enquery) => {
      // Status filter
      if (filters.status !== 'all') {
        if (filters.status === 'pending' && enquery.action !== 'WAITING') return false;
        if (filters.status === 'approved' && enquery.action !== 'APPROVE') return false;
        if (filters.status === 'edited' && enquery.action !== 'EDIT') return false;
        if (filters.status === 'rejected' && enquery.action !== 'REJECT') return false;
      }

      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchQuestion = enquery.question.toLowerCase().includes(query);
        const matchAiAnswer = enquery.ai_answer.toLowerCase().includes(query);
        const matchHumanAnswer = enquery.human_answer?.toLowerCase().includes(query);
        if (!matchQuestion && !matchAiAnswer && !matchHumanAnswer) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by newest first
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  // Update stats based on filtered data
  const filteredStats = {
    total: filteredEnqueries.length,
    pending: filteredEnqueries.filter(e => e.action === 'WAITING').length,
    approved: filteredEnqueries.filter(e => e.action === 'APPROVE').length,
    edited: filteredEnqueries.filter(e => e.action === 'EDIT').length,
    rejected: filteredEnqueries.filter(e => e.action === 'REJECT').length,
    avgScore: filteredEnqueries.filter(e => e.score !== null).length > 0
      ? (filteredEnqueries.filter(e => e.score !== null).reduce((sum, e) => sum + (e.score || 0), 0) / 
         filteredEnqueries.filter(e => e.score !== null).length).toFixed(1)
      : 'N/A'
  };

  const stats = {
    total: enqueries.length,
    pending: enqueries.filter(e => e.action === 'WAITING').length,
    approved: enqueries.filter(e => e.action === 'APPROVE').length,
    edited: enqueries.filter(e => e.action === 'EDIT').length,
    rejected: enqueries.filter(e => e.action === 'REJECT').length,
    avgScore: enqueries.filter(e => e.score !== null).length > 0
      ? (enqueries.filter(e => e.score !== null).reduce((sum, e) => sum + (e.score || 0), 0) / 
         enqueries.filter(e => e.score !== null).length).toFixed(1)
      : 'N/A'
  };

  const getActionBadge = (action: EnqueryAnswer['action']) => {
    const styles = {
      WAITING: 'bg-gray-100 text-gray-700',
      APPROVE: 'bg-green-100 text-green-700',
      EDIT: 'bg-yellow-100 text-yellow-700',
      REJECT: 'bg-red-100 text-red-700'
    };
    
    const icons = {
      WAITING: <MessageSquare className="w-4 h-4" />,
      APPROVE: <ThumbsUp className="w-4 h-4" />,
      EDIT: <Edit className="w-4 h-4" />,
      REJECT: <X className="w-4 h-4" />
    };
    
    const labels = {
      WAITING: '대기 중',
      APPROVE: '승인',
      EDIT: '수정',
      REJECT: '거절'
    };
    
    return (
      <span className={`px-3 py-1 ${styles[action]} rounded-full text-sm flex items-center gap-1`}>
        {icons[action]}
        {labels[action]}
      </span>
    );
  };

  const getChannelBadge = (channel: string) => {
    const styles: Record<string, string> = {
      kakao: 'bg-yellow-100 text-yellow-700',
      email: 'bg-blue-100 text-blue-700',
      slack: 'bg-purple-100 text-purple-700',
      web: 'bg-gray-100 text-gray-700'
    };
    
    return (
      <span className={`px-2 py-1 ${styles[channel] || 'bg-gray-100 text-gray-700'} rounded text-xs font-medium uppercase`}>
        {channel}
      </span>
    );
  };

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold mb-2">질의 모니터</h2>
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors mb-2"
              title="질의 모니터 안내"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600">Cabinet ID: {cabinetId} - 실시간 사용자 질의와 AI 응답을 모니터링합니다</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">총 질의</p>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">대기 중</p>
          <p className="text-2xl font-semibold text-gray-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">승인</p>
          <p className="text-2xl font-semibold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">수정</p>
          <p className="text-2xl font-semibold text-yellow-600">{stats.edited}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">거절</p>
          <p className="text-2xl font-semibold text-red-600">{stats.rejected}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-gray-600 text-sm mb-1">평균 점수</p>
          <p className="text-2xl font-semibold">{stats.avgScore}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="p-4">
          <div className="flex items-center gap-4">
            {/* Status Filter */}
            <div className="flex-shrink-0">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체 상태</option>
                <option value="pending">대기 중</option>
                <option value="approved">승인</option>
                <option value="edited">수정</option>
                <option value="rejected">거절</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  placeholder="질문, 답변 내용 검색..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Reset Button */}
            {(filters.status !== 'all' || filters.searchQuery) && (
              <button
                onClick={() => setFilters({
                  status: 'all',
                  searchQuery: ''
                })}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
              >
                초기화
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 mt-3">
            {filteredStats.total === stats.total ? (
              <span>전체 {stats.total}개 질의</span>
            ) : (
              <span>
                전체 {stats.total}개 중 <strong className="text-blue-600">{filteredStats.total}개</strong> 표시
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredEnqueries.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">필터 조건과 일치하는 질의가 없습니다</h3>
          <p className="text-gray-600 mb-4">필터 조건을 변경하거나 초기화해보세요</p>
          <button
            onClick={() => setFilters({
              status: 'all',
              searchQuery: ''
            })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            필터 초기화
          </button>
        </div>
      )}

      {/* Enqueries List */}
      <div className="space-y-4">
        {filteredEnqueries.map((enquery) => (
          <div key={enquery.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-lg">{enquery.question}</h3>
                  {getChannelBadge(enquery.channel)}
                  {getActionBadge(enquery.action)}
                </div>
              </div>
              
              <button
                onClick={() => setSelectedEnquery(enquery)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                상세보기
              </button>
            </div>

            {/* AI Answer */}
            <div className="mb-3">
              <div className="text-sm font-medium text-gray-600 mb-2">🤖 AI 답변</div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-gray-700">{enquery.ai_answer}</p>
              </div>
            </div>

            {/* Human Answer (if edited or rejected) */}
            {enquery.human_answer && (
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-600 mb-2">👤 사람 답변</div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <p className="text-gray-700">{enquery.human_answer}</p>
                </div>
              </div>
            )}

            {/* Cited Chunks */}
            {enquery.cited_chunks.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-600 mb-2">📚 인용된 청크 ({enquery.cited_chunks.length}개)</div>
                <div className="flex gap-2 flex-wrap">
                  {enquery.cited_chunks.map((chunk, idx) => (
                    <div key={idx} className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded border border-purple-200">
                      <FileText className="w-3 h-3 inline mr-1" />
                      Chunk #{chunk.chunk_id}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <div>Task ID: <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{enquery.task_id}</code></div>
                  <div>{enquery.created_at}</div>
                  {enquery.human && <div>처리자: {enquery.human}</div>}
                </div>
                {enquery.score !== null && (
                  <div className="flex items-center gap-2">
                    <span>AI 품질:</span>
                    <span className="font-semibold">{enquery.score}/10</span>
                  </div>
                )}
              </div>
              {enquery.reason && (
                <div className="mt-2 text-sm text-gray-600">
                  사유: {enquery.reason}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedEnquery && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">질의 상세 정보</h3>
                  {getActionBadge(selectedEnquery.action)}
                  {getChannelBadge(selectedEnquery.channel)}
                </div>
                <button
                  onClick={() => setSelectedEnquery(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Task ID</p>
                  <code className="text-sm bg-white px-2 py-1 rounded border border-gray-200">{selectedEnquery.task_id}</code>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">ID</p>
                  <p className="text-sm font-medium">#{selectedEnquery.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">생성 시간</p>
                  <p className="text-sm font-medium">{selectedEnquery.created_at}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">수정 시간</p>
                  <p className="text-sm font-medium">{selectedEnquery.updated_at}</p>
                </div>
                {selectedEnquery.human && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">처리자</p>
                    <p className="text-sm font-medium">{selectedEnquery.human}</p>
                  </div>
                )}
                {selectedEnquery.score !== null && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">AI 품질 점수</p>
                    <p className="text-sm font-medium">
                      <span className={`${
                        selectedEnquery.score >= 8 ? 'text-green-600' : 
                        selectedEnquery.score >= 5 ? 'text-yellow-600' : 
                        'text-red-600'
                      } font-semibold`}>{selectedEnquery.score}</span>/10
                    </p>
                  </div>
                )}
              </div>

              {/* Question */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  질문
                </h4>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">{selectedEnquery.question}</p>
              </div>

              {/* AI Answer */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  🤖 AI 답변
                </h4>
                <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  {selectedEnquery.ai_answer}
                </p>
              </div>

              {/* Human Answer */}
              {selectedEnquery.human_answer && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    👤 사람 답변 (수정/거절)
                  </h4>
                  <p className="text-gray-700 bg-green-50 p-4 rounded-lg border border-green-200">
                    {selectedEnquery.human_answer}
                  </p>
                </div>
              )}

              {/* Final Answer */}
              {selectedEnquery.final_answer && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    ✅ 최종 답변
                  </h4>
                  <p className="text-gray-700 bg-purple-50 p-4 rounded-lg border border-purple-200">
                    {selectedEnquery.final_answer}
                  </p>
                </div>
              )}

              {/* Reason */}
              {selectedEnquery.reason && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    📝 처리 사유
                  </h4>
                  <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    {selectedEnquery.reason}
                  </p>
                </div>
              )}

              {/* Cited Chunks */}
              {selectedEnquery.cited_chunks.length > 0 ? (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    인용된 청크 ({selectedEnquery.cited_chunks.length}개)
                  </h4>
                  <div className="space-y-3">
                    {selectedEnquery.cited_chunks.map((chunk, idx) => (
                      <div key={idx} className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        {/* Chunk Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-purple-600" />
                            <span className="font-medium text-sm text-purple-900">Chunk #{chunk.chunk_id}</span>
                            <span className="text-xs text-gray-500">• Index {chunk.chunk_index}</span>
                          </div>
                        </div>

                        {/* File Info */}
                        <div className="flex items-center gap-4 mb-3 text-xs text-gray-600 bg-white p-2 rounded border border-purple-100">
                          <div className="flex items-center gap-1">
                            <File className="w-3 h-3" />
                            <span className="font-medium">{chunk.file_name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="px-1.5 py-0.5 bg-gray-100 rounded uppercase font-medium">{chunk.file_type}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <HardDrive className="w-3 h-3" />
                            <span>{(chunk.file_size / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        </div>

                        {/* Doc UUID */}
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Document UUID</p>
                          <code className="text-xs bg-white px-2 py-1 rounded border border-purple-100 font-mono">
                            {chunk.doc_uuid}
                          </code>
                        </div>

                        {/* Chunk Content */}
                        <div>
                          <p className="text-xs text-gray-500 mb-2">내용</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{chunk.content}</p>
                        </div>
                      </div>
                    ))}</div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">인용된 청크가 없습니다</p>
                </div>
              )}

              {/* Action Form (if pending) */}
              {selectedEnquery.action === 'WAITING' && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-medium mb-4">답변 검토</h4>
                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      승인
                    </button>
                    <button className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2">
                      <Edit className="w-4 h-4" />
                      수정
                    </button>
                    <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                      <X className="w-4 h-4" />
                      거절
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">질의 모니터 안내</h3>
                </div>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* 핵심 목적 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-blue-600">🎯 핵심 목적</h4>
                <p className="text-gray-700 leading-relaxed">
                  질의 모니터는 <strong>실제 사용자가 RAG 시스템에 질문하고 받은 AI 답변을 실시간으로 모니터링하고 품질 관리</strong>하는 화면입니다. 
                  AI가 제공한 답변의 품질을 검토하고, 필요 시 사람이 개입하여 답변을 수정하거나 거절할 수 있는 
                  <strong>Human-in-the-Loop</strong> 시스템입니다.
                </p>
              </div>

              {/* 주요 기능 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-purple-600">⚙️ 주요 기능</h4>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      실시간 질의 모니터링
                    </h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>다양한 채널:</strong> Kakao, Email, Slack, Web 등 여러 채널의 질의 통합 관리</li>
                      <li>• <strong>AI 답변 즉시 확인:</strong> AI가 생성한 답변을 실시간으로 확인</li>
                      <li>• <strong>인용 출처 추적:</strong> 답변에 사용된 문서 청크(Chunk) 확인 가능</li>
                      <li>• <strong>통계 대시보드:</strong> 총 질의, 대기 중, 승인, 수정, 거절, 평균 점수 한눈에 파악</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h5 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      3가지 검토 액션
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <div className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium flex items-center gap-1 mt-0.5">
                          <ThumbsUp className="w-3 h-3" />
                          승인
                        </div>
                        <p className="text-gray-700 flex-1">
                          <strong>AI 답변이 정확하고 완벽할 때:</strong> 그대로 사용자에게 전달. 최종 답변 = AI 답변
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium flex items-center gap-1 mt-0.5">
                          <Edit className="w-3 h-3" />
                          수정
                        </div>
                        <p className="text-gray-700 flex-1">
                          <strong>AI 답변이 부족하거나 보완이 필요할 때:</strong> 사람이 답변 수정. 최종 답변 = 사람 답변
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium flex items-center gap-1 mt-0.5">
                          <X className="w-3 h-3" />
                          거절
                        </div>
                        <p className="text-gray-700 flex-1">
                          <strong>AI 답변이 부적절하거나 답변 불가할 때:</strong> 거절 사유와 함께 대체 답변 작성
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h5 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      답변 품질 평가
                    </h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>점수 부여:</strong> 각 답변에 1-10점 품질 점수 기록</li>
                      <li>• <strong>사유 작성:</strong> 수정 또는 거절 시 이유 명시</li>
                      <li>• <strong>처리자 추적:</strong> 누가 어떤 결정을 내렸는지 기록</li>
                      <li>• <strong>평균 점수 집계:</strong> AI 성능 KPI 측정용 지표</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 사용 방법 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-orange-600">📖 사용 방법</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">1단계: 질의 목록 확인</h5>
                    <p className="text-sm text-gray-700">
                      메인 화면에서 사용자 질문, AI 답변, 채널, 상태를 한눈에 확인합니다. 
                      <strong>대기 중</strong> 상태인 질의는 아직 검토가 필요합니다.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">2단계: 상세보기 클릭</h5>
                    <p className="text-sm text-gray-700">
                      각 질의 카드의 <strong>상세보기</strong> 버튼을 클릭하면 모달에서 전체 내용, 인용된 청크(문서 출처), 
                      검토 액션 버튼이 표시됩니다.
                    </p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">3단계: AI 답변 검토</h5>
                    <p className="text-sm text-gray-700">
                      AI 답변이 정확한지, 인용된 청크가 적절한지, 사용자에게 도움이 되는지 평가합니다. 
                      필요 시 인용 출처 문서를 직접 확인할 수도 있습니다.
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">4단계: 액션 선택</h5>
                    <p className="text-sm text-gray-700">
                      <strong>승인</strong>(그대로 사용), <strong>수정</strong>(답변 개선), <strong>거절</strong>(답변 불가) 중 하나를 선택합니다. 
                      수정 또는 거절 시에는 사유를 작성합니다.
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">5단계: 품질 점수 부여</h5>
                    <p className="text-sm text-gray-700">
                      AI 답변의 품질을 1-10점으로 평가합니다. 이 데이터는 AI 성능 개선과 QA 학습 데이터로 활용됩니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 실무 활용 시나리오 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-green-600">💡 실무 활용 시나리오</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 1: 고객 지원 품질 관리</h5>
                    <p className="text-sm text-gray-700">
                      고객이 카카오톡으로 문의 → AI 자동 응답 → CS 담당자가 질의 모니터에서 확인 → 
                      정확하면 승인, 부족하면 수정하여 고품질 답변 제공
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 2: AI 성능 모니터링</h5>
                    <p className="text-sm text-gray-700">
                      평균 점수를 주기적으로 확인 → 점수가 낮은 질의 유형 분석 → 
                      문서 보강 또는 프롬프트 튜닝으로 AI 성능 개선
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 3: 학습 데이터 수집</h5>
                    <p className="text-sm text-gray-700">
                      수정된 답변들을 모아서 → QA 관리 화면에서 새로운 QA로 등록 → 
                      Fine-tuning 데이터로 활용하여 AI 지속 개선
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 4: 부적절 질의 필터링</h5>
                    <p className="text-sm text-gray-700">
                      비용 문의, 개인정보 요청 등 답변 불가한 질의 → 거절 처리 + 안내 메시지 작성 → 
                      사용자에게 올바른 문의 경로 안내
                    </p>
                  </div>
                </div>
              </div>

              {/* 데이터 구조 설명 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-indigo-600">🗂️ 화면 구성 요소</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong className="text-gray-900">통계 카드 (상단):</strong>
                      <p className="text-gray-700 mt-1">총 질의, 대기 중, 승인, 수정, 거절, 평균 점수를 실시간으로 표시. 한눈에 현황 파악 가능.</p>
                    </div>
                    <div>
                      <strong className="text-gray-900">질의 카드 (목록):</strong>
                      <p className="text-gray-700 mt-1">질문, AI 답변, 사람 답변(수정 시), 채널 배지, 상태 배지, 인용 청크 개수, Task ID, 처리자, 품질 점수 표시.</p>
                    </div>
                    <div>
                      <strong className="text-gray-900">상세 모달:</strong>
                      <p className="text-gray-700 mt-1">질문과 답변 전체 내용, 인용된 청크의 상세 정보(Chunk ID, 파일명, 내용), 검토 액션 버튼(대기 중인 경우).</p>
                    </div>
                    <div>
                      <strong className="text-gray-900">채널 배지:</strong>
                      <p className="text-gray-700 mt-1">질의가 들어온 채널(Kakao, Email, Slack, Web 등)을 색상별로 구분하여 표시.</p>
                    </div>
                    <div>
                      <strong className="text-gray-900">인용 청크:</strong>
                      <p className="text-gray-700 mt-1">AI가 답변을 생성할 때 참조한 문서 조각들. Chunk ID를 클릭하면 원본 문서 내용 확인 가능.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 모범 사례 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-blue-600">✨ 모범 사례 (Best Practices)</h4>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">1.</span>
                      <span><strong>신속한 검토:</strong> 대기 중인 질의는 가능한 빨리 검토하여 사용자 대기 시간을 최소화하세요.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">2.</span>
                      <span><strong>명확한 사유:</strong> 수정 또는 거절 시 구체적인 이유를 작성하여 AI 개선에 활용하세요.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">3.</span>
                      <span><strong>인용 출처 확인:</strong> AI가 참조한 청크가 적절한지 반드시 확인하여 잘못된 정보 전달을 방지하세요.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">4.</span>
                      <span><strong>일관된 기준:</strong> 팀 내에서 승인/수정/거절 기준을 명확히 하여 일관성 있는 품질 관리를 하세요.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">5.</span>
                      <span><strong>통계 모니터링:</strong> 평균 점수가 낮아지면 문서 업데이트나 시스템 개선이 필요한 시점입니다.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">6.</span>
                      <span><strong>피드백 루프:</strong> 수정된 답변을 QA 관리에 추가하여 AI가 같은 질문에 더 나은 답변을 하도록 학습시키세요.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 요약 */}
              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                <h4 className="font-semibold text-green-900 mb-2">📌 요약</h4>
                <p className="text-sm text-green-800 leading-relaxed">
                  질의 모니터는 <strong>실제 사용자 질의에 대한 AI 답변을 실시간으로 검토하고 품질을 관리</strong>하는 Human-in-the-Loop 시스템입니다. 
                  승인/수정/거절 액션을 통해 고품질 답변을 보장하고, 수집된 데이터는 AI 성능 개선과 학습에 활용됩니다. 
                  고객 만족도를 높이고 RAG 시스템의 신뢰성을 지속적으로 향상시키는 핵심 도구입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}