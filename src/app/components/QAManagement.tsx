import { useState } from 'react';
import { HelpCircle, ThumbsUp, ThumbsDown, Star, User, Bot, Plus, Trash2, Info, X, Database, Folder, ChevronLeft, ChevronRight, Filter, FileText, Search, Calendar, Check, Download, MessageSquare } from 'lucide-react';

interface QA {
  id: number;
  chunkId: number;
  docId: number;
  docName: string;
  question: string;
  answer: string;
  generatedBy: string;
  createdAt: string;
  evaluations: QAEvaluation[];
}

interface QAEvaluation {
  id: number;
  qaId: number;
  evaluatorType: 'HUMAN' | 'AUTO';
  score: number; // 1-10
  feedback: string;
  createdAt: string;
}

interface ProjectInfo {
  id: string;
  name: string;
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

export function QAManagement({ 
  cabinetId, 
  projectInfo, 
  cabinetInfo 
}: { 
  cabinetId: string;
  projectInfo?: ProjectInfo;
  cabinetInfo?: CabinetInfo;
}) {
  const [qas, setQas] = useState<QA[]>([
    {
      id: 1,
      chunkId: 1,
      docId: 1,
      docName: 'RAG_개요.pdf',
      question: 'RAG란 무엇인가요?',
      answer: 'RAG(Retrieval-Augmented Generation)는 대규모 언어 모델의 성능을 향상시키기 위해 외부 지식 베이스에서 관련 정보를 검색하여 활용하는 기술입니다.',
      generatedBy: 'gpt-4-turbo',
      createdAt: '2026-01-27 10:33',
      evaluations: [
        {
          id: 1,
          qaId: 1,
          evaluatorType: 'HUMAN',
          score: 9,
          feedback: '매우 정확한 답변입니다.',
          createdAt: '2026-01-27 11:00'
        }
      ]
    },
    {
      id: 2,
      chunkId: 2,
      docId: 1,
      docName: 'RAG_개요.pdf',
      question: '벡터 임베딩의 목적은 무엇인가요?',
      answer: '벡터 임베딩은 텍스트를 고차원 벡터 공간으로 변환하여 의미적으로 유사한 텍스트를 효율적으로 검색하기 위한 것입니다.',
      generatedBy: 'gpt-4-turbo',
      createdAt: '2026-01-27 10:33',
      evaluations: [
        {
          id: 2,
          qaId: 2,
          evaluatorType: 'AUTO',
          score: 8,
          feedback: 'Semantic similarity: 0.92',
          createdAt: '2026-01-27 10:34'
        }
      ]
    },
    {
      id: 3,
      chunkId: 3,
      docId: 2,
      docName: '청킹_전략.pdf',
      question: '청크 크기는 어떻게 결정하나요?',
      answer: '청크 크기는 컨텍스트 유지와 검색 정확도 사이의 균형을 고려하여 결정합니다. 일반적으로 512-1024 토큰이 적절합니다.',
      generatedBy: 'claude-3-opus',
      createdAt: '2026-01-27 09:20',
      evaluations: []
    },
    {
      id: 4,
      chunkId: 4,
      docId: 2,
      docName: '청킹_전략.pdf',
      question: '의미 단위 청킹이란 무엇인가요?',
      answer: '의미 단위 청킹은 문장이나 단락의 의미적 경계를 고려하여 청크를 분할하는 방법으로, 문맥 보존에 유리합니다.',
      generatedBy: 'gpt-4-turbo',
      createdAt: '2026-01-27 09:25',
      evaluations: []
    },
    {
      id: 5,
      chunkId: 5,
      docId: 3,
      docName: '임베딩_모델.pdf',
      question: '임베딩 차원 수의 영향은 무엇인가요?',
      answer: '임베딩 차원 수가 클수록 더 풍부한 의미를 표현할 수 있지만, 저장 공간과 계산 비용이 증가합니다.',
      generatedBy: 'gpt-4-turbo',
      createdAt: '2026-01-26 14:15',
      evaluations: [
        {
          id: 3,
          qaId: 5,
          evaluatorType: 'HUMAN',
          score: 7,
          feedback: '기본적인 내용은 맞으나 더 구체적인 예시가 필요합니다.',
          createdAt: '2026-01-26 15:00'
        }
      ]
    }
  ]);

  // Mock document metadata
  const [documentMetadata] = useState([
    { id: 1, name: 'RAG_개요.pdf', uuid: 'doc-a1b2c3d4-e5f6', uploadedAt: '2026-01-27 10:30', size: '2.4 MB', chunkCount: 15 },
    { id: 2, name: '청킹_전략.pdf', uuid: 'doc-b2c3d4e5-f6g7', uploadedAt: '2026-01-27 09:15', size: '1.8 MB', chunkCount: 12 },
    { id: 3, name: '임베딩_모델.pdf', uuid: 'doc-c3d4e5f6-g7h8', uploadedAt: '2026-01-26 14:00', size: '3.1 MB', chunkCount: 20 },
    { id: 4, name: '벡터_데이터베이스.pdf', uuid: 'doc-d4e5f6g7-h8i9', uploadedAt: '2026-01-25 16:20', size: '2.7 MB', chunkCount: 18 },
    { id: 5, name: 'LLM_활용_가이드.pdf', uuid: 'doc-e5f6g7h8-i9j0', uploadedAt: '2026-01-24 11:45', size: '4.2 MB', chunkCount: 25 },
    { id: 6, name: '프롬프트_엔지니어링.pdf', uuid: 'doc-f6g7h8i9-j0k1', uploadedAt: '2026-01-23 13:20', size: '3.5 MB', chunkCount: 22 },
    { id: 7, name: 'Fine-tuning_가이드.pdf', uuid: 'doc-g7h8i9j0-k1l2', uploadedAt: '2026-01-22 09:30', size: '4.8 MB', chunkCount: 28 },
    { id: 8, name: '토큰_최적화_전략.pdf', uuid: 'doc-h8i9j0k1-l2m3', uploadedAt: '2026-01-21 15:45', size: '2.1 MB', chunkCount: 14 },
  ]);

  const [selectedQA, setSelectedQA] = useState<QA | null>(null);
  const [newEvaluation, setNewEvaluation] = useState({ score: 5, feedback: '' });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [documentSearchQuery, setDocumentSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unevaluated'>('all');
  const [selectedDocId, setSelectedDocId] = useState<number | 'all'>('all');
  
  // Evaluation templates by score range
  const evaluationTemplates = [
    { range: '9-10점', score: 10, label: '완벽', color: 'bg-green-100 border-green-300 hover:bg-green-200', textColor: 'text-green-900', examples: [
      '완벽한 답변입니다.',
      '매우 정확하고 상세한 답변입니다.',
      '기대 이상의 우수한 답변입니다.',
      '전문성이 돋보이는 완벽한 답변입니다.'
    ]},
    { range: '7-8점', score: 8, label: '우수', color: 'bg-blue-100 border-blue-300 hover:bg-blue-200', textColor: 'text-blue-900', examples: [
      '대체로 정확한 답변입니다.',
      '좋은 답변이나 일부 보완이 필요합니다.',
      '핵심 내용은 잘 설명되어 있습니다.',
      '기본적인 내용은 정확하나 더 구체적인 예시가 필요합니다.'
    ]},
    { range: '5-6점', score: 6, label: '보통', color: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200', textColor: 'text-yellow-900', examples: [
      '부분적으로 정확한 답변입니다.',
      '추가 정보가 필요합니다.',
      '핵심은 파악했으나 세부 내용이 부족합니다.',
      '일부 내용이 불명확합니다.'
    ]},
    { range: '3-4점', score: 4, label: '미흡', color: 'bg-orange-100 border-orange-300 hover:bg-orange-200', textColor: 'text-orange-900', examples: [
      '부정확한 내용이 포함되어 있습니다.',
      '상당한 개선이 필요합니다.',
      '질문과 답변의 연관성이 낮습니다.',
      '핵심 내용이 누락되었습니다.'
    ]},
    { range: '1-2점', score: 2, label: '불량', color: 'bg-red-100 border-red-300 hover:bg-red-200', textColor: 'text-red-900', examples: [
      '완전히 잘못된 답변입니다.',
      '질문과 관련 없는 내용입니다.',
      '사용할 수 없는 수준의 답변입니다.',
      '전면적인 재작성이 필요합니다.'
    ]}
  ];
  
  // Get unique documents from QAs
  const documents = Array.from(new Set(qas.map(qa => JSON.stringify({ id: qa.docId, name: qa.docName }))))
    .map(str => JSON.parse(str))
    .sort((a, b) => a.name.localeCompare(b.name));
  
  // Filter documents by search query
  const filteredDocuments = documentMetadata.filter(doc =>
    doc.name.toLowerCase().includes(documentSearchQuery.toLowerCase())
  );
  
  // Filter QAs based on status and document
  const filteredQAs = qas
    .filter(qa => filterStatus === 'all' || qa.evaluations.length === 0)
    .filter(qa => selectedDocId === 'all' || qa.docId === selectedDocId);
  
  // Get selected document info
  const selectedDocument = selectedDocId === 'all' 
    ? null 
    : documentMetadata.find(doc => doc.id === selectedDocId);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredQAs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQAs = filteredQAs.slice(startIndex, endIndex);
  
  // Reset to page 1 when filter changes
  const handleFilterChange = (newFilter: 'all' | 'unevaluated') => {
    setFilterStatus(newFilter);
    setCurrentPage(1);
  };

  const handleAddEvaluation = () => {
    if (!selectedQA) return;
    
    const evaluation: QAEvaluation = {
      id: Date.now(),
      qaId: selectedQA.id,
      evaluatorType: 'HUMAN',
      score: newEvaluation.score,
      feedback: newEvaluation.feedback,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    setQas(qas.map(qa => 
      qa.id === selectedQA.id 
        ? { ...qa, evaluations: [...qa.evaluations, evaluation] }
        : qa
    ));

    setNewEvaluation({ score: 5, feedback: '' });
    setSelectedQA(null);
  };

  const getAverageScore = (qa: QA) => {
    if (qa.evaluations.length === 0) return null;
    return (qa.evaluations.reduce((sum, e) => sum + e.score, 0) / qa.evaluations.length).toFixed(1);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Download functions
  const downloadAsCSV = () => {
    // CSV Header
    const headers = ['QA_ID', '문서명', '문서_ID', '청크_ID', '질문', '답변', '생성_모델', '생성_일시', '평균_점수', '평가_횟수', '평가_상세'];
    
    // CSV Rows
    const rows = filteredQAs.map(qa => {
      const avgScore = getAverageScore(qa) || 'N/A';
      const evaluationDetails = qa.evaluations.map(e => 
        `[${e.evaluatorType}|${e.score}점|${e.feedback || '피드백없음'}|${e.createdAt}]`
      ).join(';');
      
      return [
        qa.id,
        `"${qa.docName}"`,
        qa.docId,
        qa.chunkId,
        `"${qa.question.replace(/"/g, '""')}"`,
        `"${qa.answer.replace(/"/g, '""')}"`,
        qa.generatedBy,
        qa.createdAt,
        avgScore,
        qa.evaluations.length,
        `"${evaluationDetails}"`
      ].join(',');
    });
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const bom = '\uFEFF'; // UTF-8 BOM for Excel compatibility
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const fileName = `QA_데이터_${selectedDocument ? selectedDocument.name : '전체'}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowDownloadModal(false);
  };

  const downloadAsJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      project: projectInfo?.name || 'Unknown',
      cabinet: cabinetInfo?.name || 'Unknown',
      filter: {
        status: filterStatus,
        document: selectedDocument ? selectedDocument.name : '전체',
        documentId: selectedDocId
      },
      totalCount: filteredQAs.length,
      data: filteredQAs.map(qa => ({
        id: qa.id,
        chunkId: qa.chunkId,
        docId: qa.docId,
        docName: qa.docName,
        question: qa.question,
        answer: qa.answer,
        generatedBy: qa.generatedBy,
        createdAt: qa.createdAt,
        averageScore: getAverageScore(qa) ? parseFloat(getAverageScore(qa)!) : null,
        evaluations: qa.evaluations
      }))
    };
    
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const fileName = `QA_데이터_${selectedDocument ? selectedDocument.name : '전체'}_${new Date().toISOString().slice(0, 10)}.json`;
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowDownloadModal(false);
  };

  // Fine-tuning용 JSONL 형식 (Instruction Tuning)
  const downloadAsJSONL_Instruction = () => {
    const jsonlLines = filteredQAs.map(qa => 
      JSON.stringify({
        instruction: qa.question,
        input: `문서: ${qa.docName}\n컨텍스트: 이 질문은 청크 ID ${qa.chunkId}에서 생성되었습니다.`,
        output: qa.answer,
        metadata: {
          qa_id: qa.id,
          doc_id: qa.docId,
          chunk_id: qa.chunkId,
          average_score: getAverageScore(qa) ? parseFloat(getAverageScore(qa)!) : null
        }
      })
    );
    
    const jsonlContent = jsonlLines.join('\n');
    const blob = new Blob([jsonlContent], { type: 'application/jsonl' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const fileName = `QA_Instruction_${selectedDocument ? selectedDocument.name : '전체'}_${new Date().toISOString().slice(0, 10)}.jsonl`;
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowDownloadModal(false);
  };

  // Fine-tuning용 JSONL 형식 (Chat Format - OpenAI/Anthropic)
  const downloadAsJSONL_Chat = () => {
    const jsonlLines = filteredQAs.map(qa => 
      JSON.stringify({
        messages: [
          {
            role: "user",
            content: qa.question
          },
          {
            role: "assistant",
            content: qa.answer
          }
        ],
        metadata: {
          qa_id: qa.id,
          doc_name: qa.docName,
          doc_id: qa.docId,
          chunk_id: qa.chunkId,
          average_score: getAverageScore(qa) ? parseFloat(getAverageScore(qa)!) : null,
          generated_by: qa.generatedBy
        }
      })
    );
    
    const jsonlContent = jsonlLines.join('\n');
    const blob = new Blob([jsonlContent], { type: 'application/jsonl' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const fileName = `QA_Chat_${selectedDocument ? selectedDocument.name : '전체'}_${new Date().toISOString().slice(0, 10)}.jsonl`;
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowDownloadModal(false);
  };

  // Fine-tuning용 JSONL 형식 (Prompt-Completion Format)
  const downloadAsJSONL_PromptCompletion = () => {
    const jsonlLines = filteredQAs.map(qa => 
      JSON.stringify({
        prompt: qa.question,
        completion: qa.answer,
        metadata: {
          qa_id: qa.id,
          doc_name: qa.docName,
          doc_id: qa.docId,
          chunk_id: qa.chunkId,
          average_score: getAverageScore(qa) ? parseFloat(getAverageScore(qa)!) : null
        }
      })
    );
    
    const jsonlContent = jsonlLines.join('\n');
    const blob = new Blob([jsonlContent], { type: 'application/jsonl' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const fileName = `QA_PromptCompletion_${selectedDocument ? selectedDocument.name : '전체'}_${new Date().toISOString().slice(0, 10)}.jsonl`;
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowDownloadModal(false);
  };

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-semibold">QA 관리</h2>
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
              title="QA 관리 안내"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600">자동 생성된 질의응답을 관리하고 평가합니다</p>
        </div>
      </div>

      {/* Project & Cabinet Info */}
      {projectInfo && cabinetInfo && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Project Info */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-blue-600 mb-1">PROJECT</p>
                <h3 className="text-lg font-bold text-gray-900 truncate">{projectInfo.name}</h3>
              </div>
            </div>
          </div>

          {/* Cabinet Info */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Folder className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-purple-600 mb-1">CABINET</p>
                <h3 className="text-lg font-bold text-gray-900 truncate">{cabinetInfo.name}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">총 QA</p>
              <p className="text-2xl font-semibold">{qas.length}</p>
            </div>
            <HelpCircle className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">평가됨</p>
              <p className="text-2xl font-semibold text-green-600">
                {qas.filter(qa => qa.evaluations.length > 0).length}
              </p>
            </div>
            <ThumbsUp className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">평균 점수</p>
              <p className="text-2xl font-semibold">
                {qas.filter(qa => qa.evaluations.length > 0).length > 0
                  ? (qas
                      .filter(qa => qa.evaluations.length > 0)
                      .reduce((sum, qa) => sum + parseFloat(getAverageScore(qa) || '0'), 0) /
                      qas.filter(qa => qa.evaluations.length > 0).length
                    ).toFixed(1)
                  : 'N/A'}
              </p>
            </div>
            <Star className="w-10 h-10 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">미평가</p>
              <p className="text-2xl font-semibold text-gray-600">
                {qas.filter(qa => qa.evaluations.length === 0).length}
              </p>
            </div>
            <HelpCircle className="w-10 h-10 text-gray-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-6">
        {/* Status Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-1 inline-flex gap-1">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>모두 보기</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              filterStatus === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}>
              {qas.filter(qa => selectedDocId === 'all' || qa.docId === selectedDocId).length}
            </span>
          </button>
          <button
            onClick={() => handleFilterChange('unevaluated')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              filterStatus === 'unevaluated'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>평가 안됨</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              filterStatus === 'unevaluated'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}>
              {qas.filter(qa => qa.evaluations.length === 0 && (selectedDocId === 'all' || qa.docId === selectedDocId)).length}
            </span>
          </button>
        </div>

        {/* Document Filter & Download Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDocumentModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {selectedDocument ? selectedDocument.name : '모든 문서'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
              {selectedDocId === 'all' ? documentMetadata.length : qas.filter(qa => qa.docId === selectedDocId).length}
            </span>
          </button>

          <button
            onClick={() => setShowDownloadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            title="QA 데이터 다운로드"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">다운로드</span>
          </button>
        </div>
      </div>

      {/* QA List */}
      <div className="space-y-4">
        {paginatedQAs.map((qa) => {
          const avgScore = getAverageScore(qa);
          
          return (
            <div key={qa.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-lg">{qa.question}</h3>
                  </div>
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">{qa.answer}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 ml-4">
                  {avgScore && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className={`font-semibold ${getScoreColor(parseFloat(avgScore))}`}>
                        {avgScore}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedQA(qa)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    평가하기
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{qa.docName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bot className="w-4 h-4" />
                      <span>{qa.generatedBy}</span>
                    </div>
                    <div>Chunk ID: {qa.chunkId}</div>
                    <div>{qa.createdAt}</div>
                  </div>
                  <div className="text-gray-500">
                    평가 {qa.evaluations.length}개
                  </div>
                </div>

                {/* Evaluations */}
                {qa.evaluations.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {qa.evaluations.map((evaluation) => (
                      <div key={evaluation.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {evaluation.evaluatorType === 'HUMAN' ? (
                              <User className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Bot className="w-4 h-4 text-purple-600" />
                            )}
                            <span className="font-medium">
                              {evaluation.evaluatorType === 'HUMAN' ? '사람' : '자동'}
                            </span>
                            <span className={`font-semibold ${getScoreColor(evaluation.score)}`}>
                              {evaluation.score}/10
                            </span>
                          </div>
                          <span className="text-gray-500 text-xs">{evaluation.createdAt}</span>
                        </div>
                        {evaluation.feedback && (
                          <p className="text-gray-700">{evaluation.feedback}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-6 bg-white rounded-lg border border-gray-200 p-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>이전</span>
        </button>
        <div className="text-sm text-gray-600">
          페이지 <span className="font-semibold text-gray-900">{currentPage}</span> / {totalPages}
        </div>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>다음</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Evaluation Modal */}
      {selectedQA && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">QA 평가</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedQA.question}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedQA(null);
                    setNewEvaluation({ score: 5, feedback: '' });
                  }}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors ml-4"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Quick Evaluation Templates */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  빠른 평가 (템플릿 선택)
                </label>
                <div className="space-y-3">
                  {evaluationTemplates.map((template) => (
                    <div key={template.range}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${template.color} border-2`}>
                            {template.label} ({template.range})
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {template.examples.map((example, idx) => (
                          <button
                            key={idx}
                            onClick={() => setNewEvaluation({ score: template.score, feedback: example })}
                            className={`text-left p-3 rounded-lg border-2 transition-all text-sm ${
                              newEvaluation.feedback === example && newEvaluation.score === template.score
                                ? `${template.color} border-opacity-100`
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {newEvaluation.feedback === example && newEvaluation.score === template.score && (
                                <Check className={`w-4 h-4 ${template.textColor} flex-shrink-0 mt-0.5`} />
                              )}
                              <span className={newEvaluation.feedback === example && newEvaluation.score === template.score ? template.textColor : 'text-gray-700'}>
                                {example}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">또는 직접 입력</span>
                </div>
              </div>

              {/* Manual Score Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  점수 (1-10)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newEvaluation.score}
                    onChange={(e) => setNewEvaluation({ ...newEvaluation, score: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <div className="w-16 text-center">
                    <span className={`text-2xl font-bold ${getScoreColor(newEvaluation.score)}`}>
                      {newEvaluation.score}
                    </span>
                  </div>
                </div>
              </div>

              {/* Manual Feedback Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  피드백
                </label>
                <textarea
                  value={newEvaluation.feedback}
                  onChange={(e) => setNewEvaluation({ ...newEvaluation, feedback: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="평가에 대한 추가 의견을 작성하세요..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={!newEvaluation.feedback}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    newEvaluation.feedback
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  평가 제출
                </button>
                <button
                  onClick={() => {
                    setSelectedQA(null);
                    setNewEvaluation({ score: 5, feedback: '' });
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedQA && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-xl text-gray-900">평가 제출 확인</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-700">다음 내용으로 평가를 제출하시겠습니까?</p>
              
              {/* 평가 내용 미리보기 */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-1">질문</p>
                  <p className="text-sm text-gray-900">{selectedQA.question}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1">평가 점수</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${getScoreColor(newEvaluation.score)}`}>
                      {newEvaluation.score}
                    </span>
                    <span className="text-gray-500">/ 10점</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1">피드백</p>
                  <p className="text-sm text-gray-900">{newEvaluation.feedback}</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="text-sm text-blue-800">
                  <strong>참고:</strong> 제출된 평가는 수정할 수 없으니 내용을 확인해 주세요.
                </p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  handleAddEvaluation();
                  setShowConfirmModal(false);
                }}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                확인 및 제출
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Selection Modal */}
      {showDocumentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-xl">문서 선택</h3>
                <button
                  onClick={() => {
                    setShowDocumentModal(false);
                    setDocumentSearchQuery('');
                  }}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="문서명으로 검색..."
                  value={documentSearchQuery}
                  onChange={(e) => setDocumentSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Document List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {/* All Documents Option */}
                <button
                  onClick={() => {
                    setSelectedDocId('all');
                    setCurrentPage(1);
                    setShowDocumentModal(false);
                    setDocumentSearchQuery('');
                  }}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedDocId === 'all'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedDocId === 'all' ? 'bg-blue-600' : 'bg-gray-200'
                      }`}>
                        <FileText className={`w-5 h-5 ${
                          selectedDocId === 'all' ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className={`font-semibold ${
                          selectedDocId === 'all' ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          모든 문서
                        </h4>
                        <p className="text-sm text-gray-500">전체 {documentMetadata.length}개 문서</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">QA {qas.length}개</p>
                      </div>
                      {selectedDocId === 'all' && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Individual Documents */}
                {filteredDocuments.map((doc) => {
                  const qaCount = qas.filter(qa => qa.docId === doc.id).length;
                  const isSelected = selectedDocId === doc.id;
                  
                  return (
                    <button
                      key={doc.id}
                      onClick={() => {
                        setSelectedDocId(doc.id);
                        setCurrentPage(1);
                        setShowDocumentModal(false);
                        setDocumentSearchQuery('');
                      }}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-blue-600' : 'bg-gray-200'
                          }`}>
                            <FileText className={`w-5 h-5 ${
                              isSelected ? 'text-white' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold truncate ${
                              isSelected ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {doc.name}
                            </h4>
                            <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">
                              UUID: {doc.uuid}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{doc.uploadedAt}</span>
                              </div>
                              <span>•</span>
                              <span>{doc.size}</span>
                              <span>•</span>
                              <span>청크 {doc.chunkCount}개</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">QA {qaCount}개</p>
                            {qaCount > 0 && (
                              <p className="text-xs text-gray-500">
                                미평가 {qas.filter(qa => qa.docId === doc.id && qa.evaluations.length === 0).length}
                              </p>
                            )}
                          </div>
                          {isSelected && (
                            <Check className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {filteredDocuments.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">검색 결과가 없습니다</p>
                </div>
              )}
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
                <h3 className="font-semibold text-xl">📊 QA 관리 안내</h3>
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
                <h4 className="font-semibold text-lg mb-3 text-blue-600">🎯 핵심 목적: RAG 시스템 품질 검증</h4>
                <p className="text-gray-700 leading-relaxed">
                  이 화면은 <strong>파이프라인에서 자동 생성된 QA를 조회하고 평가</strong>하기 위한 것입니다. 
                  청크 기반으로 생성된 질문-답변 쌍을 검토하고, 사람 또는 AI의 평가를 통해 RAG 시스템의 성능을 모니터링합니다.
                </p>
              </div>

              {/* 주요 기능 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-purple-600">🔧 주요 기능</h4>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-2">1. QA 조회 및 필터링</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 파이프라인이 생성한 QA를 문서별로 필터링하여 조회</li>
                      <li>• 평가 여부(전체/미평가)로 필터링</li>
                      <li>• 문서 선택 모달에서 UUID, 청크 개수 등 상세 정보 확인</li>
                      <li>• 각 QA가 어떤 청크(Chunk)에서 생성되었는지 추적</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h5 className="font-semibold text-green-900 mb-2">2. 품질 평가 시스템</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>사람(HUMAN)</strong>: 도메인 전문가가 직접 평가 (1-10점)</li>
                      <li>• <strong>자동(AUTO)</strong>: AI가 의미적 유사도 등으로 자동 평가</li>
                      <li>• 피드백을 통한 개선점 기록</li>
                      <li>• 평균 점수로 QA 품질을 한눈에 파악</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h5 className="font-semibold text-yellow-900 mb-2">3. 성능 모니터링</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 평균 점수로 RAG 시스템의 전반적 품질 추적</li>
                      <li>• 평가되지 않은 QA 파악</li>
                      <li>• 문서별, 청크별로 어떤 콘텐츠가 좋은/나쁜 결과를 내는지 분석</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 실무 활용 시나리오 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-green-600">💡 실무 활용 시나리오</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 1: 청킹 전략 검증</h5>
                    <p className="text-sm text-gray-700">
                      파이프라인이 생성한 QA 평가 → 답변 품질이 낮으면 → 해당 청크의 분할 방법 검토 및 조정
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 2: 문서 품질 검증</h5>
                    <p className="text-sm text-gray-700">
                      문서별 필터링 → 특정 문서의 QA 평가 → 낮은 점수 발견 시 해당 문서의 구조나 내용 개선
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 3: Fine-tuning 데이터셋 구축</h5>
                    <p className="text-sm text-gray-700">
                      고품질 QA만 필터링 → 학습 데이터로 활용 → 도메인 특화 LLM 개발
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 4: 임베딩 모델 성능 평가</h5>
                    <p className="text-sm text-gray-700">
                      여러 임베딩 모델로 생성된 QA 비교 → 평가 점수로 최적 모델 선정
                    </p>
                  </div>
                </div>
              </div>

              {/* 워크플로우 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-orange-600">🔄 이 화면의 역할</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span className="text-gray-700">파이프라인에서 QA가 자동 생성됨 (백그라운드)</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <span className="text-gray-700 font-semibold">➡️ 이 화면: 생성된 QA 조회 및 필터링</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      <span className="text-gray-700 font-semibold">➡️ 이 화면: 문서별/상태별 필터로 원하는 QA 찾기</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                      <span className="text-gray-700 font-semibold">➡️ 이 화면: 사람/AI가 QA 품질 평가</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                      <span className="text-gray-700">평가 결과 분석 → 청킹/임베딩 전략 개선 (다른 화면)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 요약 */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">📌 요약</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  이 화면은 RAG 파이프라인이 생성한 QA를 <strong>조회, 필터링, 평가</strong>하여 
                  시스템 품질을 검증하는 <strong>품질 관리 대시보드</strong>입니다. 
                  문서별 필터링과 평가 상태 필터를 통해 효율적으로 QA를 관리할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xl">📊 QA 데이터 다운로드</h3>
                <button
                  onClick={() => setShowDownloadModal(false)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* 설명 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-blue-600">🎯 다운로드 형식 선택</h4>
                <p className="text-gray-700 leading-relaxed mb-2">
                  현재 필터링된 <strong>{filteredQAs.length}개의 QA 데이터</strong>를 다양한 형식으로 다운로드할 수 있습니다.
                </p>
              </div>

              {/* 분석용 형식 */}
              <div>
                <h5 className="font-semibold text-md mb-3 text-gray-800">📊 데이터 분석 및 관리용</h5>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={downloadAsCSV}
                    className="flex flex-col items-start gap-2 p-4 bg-blue-50 border-2 border-blue-200 text-left rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Download className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">CSV</span>
                    </div>
                    <p className="text-sm text-gray-700">엑셀, 스프레드시트 분석용</p>
                  </button>
                  <button
                    onClick={downloadAsJSON}
                    className="flex flex-col items-start gap-2 p-4 bg-green-50 border-2 border-green-200 text-left rounded-lg hover:bg-green-100 hover:border-green-300 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Download className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-900">JSON</span>
                    </div>
                    <p className="text-sm text-gray-700">구조화된 데이터 저장용</p>
                  </button>
                </div>
              </div>

              {/* 파인튜닝용 형식 */}
              <div>
                <h5 className="font-semibold text-md mb-3 text-gray-800">🤖 LLM Fine-tuning용 (JSONL)</h5>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-3">
                  <p className="text-sm text-purple-900">
                    <strong>추천:</strong> JSONL 형식은 LLM 파인튜닝에 최적화된 포맷입니다. 각 줄이 하나의 학습 샘플입니다.
                  </p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={downloadAsJSONL_Instruction}
                    className="w-full flex flex-col items-start gap-2 p-4 bg-purple-50 border-2 border-purple-200 text-left rounded-lg hover:bg-purple-100 hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Download className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-900">Instruction Tuning 형식</span>
                    </div>
                    <p className="text-sm text-gray-700">Alpaca, Vicuna 등 instruction-following 모델용</p>
                    <code className="text-xs bg-white px-2 py-1 rounded border border-purple-200 text-purple-800 mt-1">
                      {`{"instruction": "질문", "input": "컨텍스트", "output": "답변"}`}
                    </code>
                  </button>
                  <button
                    onClick={downloadAsJSONL_Chat}
                    className="w-full flex flex-col items-start gap-2 p-4 bg-orange-50 border-2 border-orange-200 text-left rounded-lg hover:bg-orange-100 hover:border-orange-300 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Download className="w-5 h-5 text-orange-600" />
                      <span className="font-semibold text-orange-900">Chat 형식 (OpenAI/Anthropic)</span>
                    </div>
                    <p className="text-sm text-gray-700">GPT, Claude 등 대화형 모델 파인튜닝용</p>
                    <code className="text-xs bg-white px-2 py-1 rounded border border-orange-200 text-orange-800 mt-1">
                      {`{"messages": [{"role": "user", "content": "..."}, ...]}`}
                    </code>
                  </button>
                  <button
                    onClick={downloadAsJSONL_PromptCompletion}
                    className="w-full flex flex-col items-start gap-2 p-4 bg-red-50 border-2 border-red-200 text-left rounded-lg hover:bg-red-100 hover:border-red-300 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Download className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-red-900">Prompt-Completion 형식</span>
                    </div>
                    <p className="text-sm text-gray-700">기본 Completion 모델용 (GPT-3 등)</p>
                    <code className="text-xs bg-white px-2 py-1 rounded border border-red-200 text-red-800 mt-1">
                      {`{"prompt": "질문", "completion": "답변"}`}
                    </code>
                  </button>
                </div>
              </div>

              {/* 주의사항 */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-sm text-yellow-900">
                  <strong>팁:</strong> 고품질 학습 데이터를 위해 평가 점수가 높은 QA만 필터링하여 다운로드하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}