import { useState } from 'react';
import {
  Upload,
  Download,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Play,
  Database,
  HardDrive,
  Folder,
  Eye,
  ChevronUp,
  Info,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader,
  X,
  MessageSquare,
} from 'lucide-react';
import { DocumentDetailModal } from './DocumentDetailModal';
import { CabinetModal } from './CabinetModal';
import { ProjectModal } from './ProjectModal';
import { DocumentQAPanel } from './DocumentQAPanel';
import React from 'react';

interface Document {
  id: string;
  fileName: string;
  fileType: 'docx' | 'pdf' | 'hwp';
  size: string;
  processingStep: 'UPLOADED' | 'PARSING' | 'CHUNKING' | 'EMBEDDING' | 'QA_GENERATING';
  status: 'IN_PROGRESS' | 'SUCCESS' | 'FAILED';
  processingHistory: Array<{
    id: number;
    processing_step: 'UPLOAD' | 'PARSING' | 'CHUNKING' | 'EMBEDDING' | 'QA_GENERATING';
    processing_status: 'SUCCESS' | 'IN_PROGRESS' | 'FAILED' | 'PENDING';
    created_at: string;
  }>;
  createdAt: string;
  updatedAt: string;
  meta?: any;
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

interface DocumentManagementProps {
  cabinetId: string;
  projectInfo: ProjectInfo;
  cabinetInfo: CabinetInfo;
}

export function DocumentManagement({ cabinetId, projectInfo: projectInfoProp, cabinetInfo: cabinetInfoProp }: DocumentManagementProps) {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showCabinetModal, setShowCabinetModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [isStorageInfoExpanded, setIsStorageInfoExpanded] = useState(false);
  const [expandedQADocId, setExpandedQADocId] = useState<string | null>(null);
  const [showDocQAModal, setShowDocQAModal] = useState(false);
  const [selectedDocForQA, setSelectedDocForQA] = useState<Document | null>(null);

  // Use props for project and cabinet info
  const projectInfo = projectInfoProp;
  const cabinetInfo = cabinetInfoProp;

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'uuid-1',
      fileName: 'product_documentation.pdf',
      fileType: 'pdf',
      size: '2.4 MB',
      processingStep: 'QA_GENERATING',
      status: 'SUCCESS',
      processingHistory: [
        { id: 1, processing_step: 'UPLOAD', processing_status: 'SUCCESS', created_at: '2026-01-27 10:30' },
        { id: 2, processing_step: 'PARSING', processing_status: 'SUCCESS', created_at: '2026-01-27 10:31' },
        { id: 3, processing_step: 'CHUNKING', processing_status: 'SUCCESS', created_at: '2026-01-27 10:32' },
        { id: 4, processing_step: 'EMBEDDING', processing_status: 'SUCCESS', created_at: '2026-01-27 10:33' },
        { id: 5, processing_step: 'QA_GENERATING', processing_status: 'SUCCESS', created_at: '2026-01-27 10:35' }
      ],
      createdAt: '2026-01-27 10:30',
      updatedAt: '2026-01-27 10:35'
    },
    {
      id: 'uuid-2',
      fileName: 'user_manual_v2.docx',
      fileType: 'docx',
      size: '1.8 MB',
      processingStep: 'EMBEDDING',
      status: 'SUCCESS',
      processingHistory: [
        { id: 1, processing_step: 'UPLOAD', processing_status: 'SUCCESS', created_at: '2026-01-27 09:15' },
        { id: 2, processing_step: 'PARSING', processing_status: 'SUCCESS', created_at: '2026-01-27 09:16' },
        { id: 3, processing_step: 'CHUNKING', processing_status: 'SUCCESS', created_at: '2026-01-27 09:17' },
        { id: 4, processing_step: 'EMBEDDING', processing_status: 'SUCCESS', created_at: '2026-01-27 09:22' }
      ],
      createdAt: '2026-01-27 09:15',
      updatedAt: '2026-01-27 09:22'
    },
    {
      id: 'uuid-3',
      fileName: 'api_reference.pdf',
      fileType: 'pdf',
      size: '856 KB',
      processingStep: 'EMBEDDING',
      status: 'IN_PROGRESS',
      processingHistory: [
        { id: 1, processing_step: 'UPLOAD', processing_status: 'SUCCESS', created_at: '2026-01-27 08:45' },
        { id: 2, processing_step: 'PARSING', processing_status: 'SUCCESS', created_at: '2026-01-27 08:46' },
        { id: 3, processing_step: 'CHUNKING', processing_status: 'SUCCESS', created_at: '2026-01-27 08:47' },
        { id: 4, processing_step: 'EMBEDDING', processing_status: 'IN_PROGRESS', created_at: '2026-01-27 08:48' }
      ],
      createdAt: '2026-01-27 08:45',
      updatedAt: '2026-01-27 08:48'
    },
    {
      id: 'uuid-4',
      fileName: 'faq_database.hwp',
      fileType: 'hwp',
      size: '542 KB',
      processingStep: 'CHUNKING',
      status: 'IN_PROGRESS',
      processingHistory: [
        { id: 1, processing_step: 'UPLOAD', processing_status: 'SUCCESS', created_at: '2026-01-26 16:20' },
        { id: 2, processing_step: 'PARSING', processing_status: 'SUCCESS', created_at: '2026-01-26 16:21' },
        { id: 3, processing_step: 'CHUNKING', processing_status: 'IN_PROGRESS', created_at: '2026-01-26 16:21' }
      ],
      createdAt: '2026-01-26 16:20',
      updatedAt: '2026-01-26 16:21'
    },
    {
      id: 'uuid-5',
      fileName: 'error_document.pdf',
      fileType: 'pdf',
      size: '1.2 MB',
      processingStep: 'PARSING',
      status: 'FAILED',
      processingHistory: [
        { id: 1, processing_step: 'UPLOAD', processing_status: 'SUCCESS', created_at: '2026-01-26 14:10' },
        { id: 2, processing_step: 'PARSING', processing_status: 'FAILED', created_at: '2026-01-26 14:11' }
      ],
      createdAt: '2026-01-26 14:10',
      updatedAt: '2026-01-26 14:11'
    },
    {
      id: 'uuid-6',
      fileName: 'installation_guide.pdf',
      fileType: 'pdf',
      size: '3.1 MB',
      processingStep: 'CHUNKING',
      status: 'SUCCESS',
      processingHistory: [
        { id: 1, processing_step: 'UPLOAD', processing_status: 'SUCCESS', created_at: '2026-01-26 11:20' },
        { id: 2, processing_step: 'PARSING', processing_status: 'SUCCESS', created_at: '2026-01-26 11:21' },
        { id: 3, processing_step: 'CHUNKING', processing_status: 'SUCCESS', created_at: '2026-01-26 11:25' }
      ],
      createdAt: '2026-01-26 11:20',
      updatedAt: '2026-01-26 11:25'
    },
    {
      id: 'uuid-7',
      fileName: 'release_notes_2024.docx',
      fileType: 'docx',
      size: '924 KB',
      processingStep: 'PARSING',
      status: 'IN_PROGRESS',
      processingHistory: [
        { id: 1, processing_step: 'UPLOAD', processing_status: 'SUCCESS', created_at: '2026-01-26 10:15' },
        { id: 2, processing_step: 'PARSING', processing_status: 'IN_PROGRESS', created_at: '2026-01-26 10:16' }
      ],
      createdAt: '2026-01-26 10:15',
      updatedAt: '2026-01-26 10:16'
    },
    {
      id: 'uuid-8',
      fileName: 'troubleshooting_guide.pdf',
      fileType: 'pdf',
      size: '2.8 MB',
      processingStep: 'QA_GENERATING',
      status: 'SUCCESS',
      processingHistory: [
        { id: 1, processing_step: 'UPLOAD', processing_status: 'SUCCESS', created_at: '2026-01-25 15:30' },
        { id: 2, processing_step: 'PARSING', processing_status: 'SUCCESS', created_at: '2026-01-25 15:31' },
        { id: 3, processing_step: 'CHUNKING', processing_status: 'SUCCESS', created_at: '2026-01-25 15:32' },
        { id: 4, processing_step: 'EMBEDDING', processing_status: 'SUCCESS', created_at: '2026-01-25 15:33' },
        { id: 5, processing_step: 'QA_GENERATING', processing_status: 'SUCCESS', created_at: '2026-01-25 15:35' }
      ],
      createdAt: '2026-01-25 15:30',
      updatedAt: '2026-01-25 15:35'
    },
    {
      id: 'uuid-9',
      fileName: 'best_practices.hwp',
      fileType: 'hwp',
      size: '1.5 MB',
      processingStep: 'QA_GENERATING',
      status: 'IN_PROGRESS',
      processingHistory: [
        { id: 1, processing_step: 'UPLOAD', processing_status: 'SUCCESS', created_at: '2026-01-25 14:10' },
        { id: 2, processing_step: 'PARSING', processing_status: 'SUCCESS', created_at: '2026-01-25 14:11' },
        { id: 3, processing_step: 'CHUNKING', processing_status: 'SUCCESS', created_at: '2026-01-25 14:12' },
        { id: 4, processing_step: 'EMBEDDING', processing_status: 'SUCCESS', created_at: '2026-01-25 14:13' },
        { id: 5, processing_step: 'QA_GENERATING', processing_status: 'IN_PROGRESS', created_at: '2026-01-25 14:12' }
      ],
      createdAt: '2026-01-25 14:10',
      updatedAt: '2026-01-25 14:12'
    },
    {
      id: 'uuid-10',
      fileName: 'quick_start_guide.pdf',
      fileType: 'pdf',
      size: '680 KB',
      processingStep: 'EMBEDDING',
      status: 'SUCCESS',
      processingHistory: [
        { id: 1, processing_step: 'UPLOAD', processing_status: 'SUCCESS', created_at: '2026-01-25 09:45' },
        { id: 2, processing_step: 'PARSING', processing_status: 'SUCCESS', created_at: '2026-01-25 09:46' },
        { id: 3, processing_step: 'CHUNKING', processing_status: 'SUCCESS', created_at: '2026-01-25 09:47' },
        { id: 4, processing_step: 'EMBEDDING', processing_status: 'SUCCESS', created_at: '2026-01-25 09:48' }
      ],
      createdAt: '2026-01-25 09:45',
      updatedAt: '2026-01-25 09:48'
    },
    {
      id: 'uuid-11',
      fileName: 'security_guidelines.docx',
      fileType: 'docx',
      size: '1.3 MB',
      processingStep: 'UPLOADED',
      status: 'IN_PROGRESS',
      processingHistory: [
        { id: 1, processing_step: 'UPLOAD', processing_status: 'SUCCESS', created_at: '2026-01-24 16:20' },
        { id: 2, processing_step: 'PARSING', processing_status: 'PENDING', created_at: '2026-01-24 16:20' }
      ],
      createdAt: '2026-01-24 16:20',
      updatedAt: '2026-01-24 16:20'
    },
    {
      id: 'uuid-12',
      fileName: 'architecture_design.pdf',
      fileType: 'pdf',
      size: '4.2 MB',
      processingStep: 'PARSING',
      status: 'FAILED',
      processingHistory: [
        { id: 1, processing_step: 'UPLOAD', processing_status: 'SUCCESS', created_at: '2026-01-24 13:10' },
        { id: 2, processing_step: 'PARSING', processing_status: 'FAILED', created_at: '2026-01-24 13:18' }
      ],
      createdAt: '2026-01-24 13:10',
      updatedAt: '2026-01-24 13:18'
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Delete confirmation modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  // QA generation confirmation modal states
  const [showQAModal, setShowQAModal] = useState(false);
  const [documentForQA, setDocumentForQA] = useState<Document | null>(null);

  // Pagination calculations
  const totalPages = Math.ceil(documents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = documents.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    // Adjust current page if needed
    const newTotalPages = Math.ceil((documents.length - 1) / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleDownload = (doc: Document) => {
    // 실제 환경에서는 서버에서 파일을 가져와야 합니다
    // 여기서는 브라우저의 기본 다운로드 기능을 시연합니다
    
    // Mock: 빈 파일 생성 (실제로는 서버에서 파일 데이터를 받아와야 함)
    const mockContent = `RAGO-X Admin - Document Download\n\n파일명: ${doc.fileName}\n문서 ID: ${doc.id}\n파일 타입: ${doc.fileType}\n크기: ${doc.size}\n업로드 일시: ${doc.createdAt}\n\n이것은 데모용 파일입니다.\n실제 환경에서는 서버에서 원본 파일을 다운로드합니다.`;
    
    // Blob 생성
    const blob = new Blob([mockContent], { type: 'text/plain' });
    
    // 다운로드 링크 생성
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName; // 원본 파일명 사용
    
    // 다운로드 트리거
    document.body.appendChild(link);
    link.click();
    
    // 정리
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleGenerateQA = (doc: Document) => {
    // QA 생성 로직 (실제로는 API 호출)
    console.log(`QA 생성 시작: ${doc.fileName} (ID: ${doc.id})`);
    // 실제 환경에서는 백엔드 API를 호출하여 QA 생성 작업을 시작합니다.
  };

  const getStatusIcon = (step: Document['processingStep']) => {
    switch (step) {
      case 'UPLOADED':
        return <Clock className="w-5 h-5 text-gray-600" />;
      case 'PARSING':
      case 'CHUNKING':
      case 'EMBEDDING':
      case 'QA_GENERATING':
        return <Loader className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusText = (step: Document['processingStep']) => {
    const statusMap = {
      'UPLOADED': '업로드됨',
      'PARSING': '파싱',
      'CHUNKING': '청킹',
      'EMBEDDING': '임베딩',
      'QA_GENERATING': 'QA 생성',
      'FAILED': '실패'
    };
    return statusMap[step];
  };

  const getStatusColor = (step: Document['processingStep']) => {
    switch (step) {
      case 'UPLOADED':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'PARSING':
      case 'CHUNKING':
      case 'EMBEDDING':
      case 'QA_GENERATING':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'FAILED':
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  // 상태 관련 함수
  const getProcessStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <Loader className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getProcessStatusText = (status: Document['status']) => {
    const statusMap = {
      'IN_PROGRESS': '진행중',
      'SUCCESS': '성공',
      'FAILED': '실패'
    };
    return statusMap[status];
  };

  const getProcessStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SUCCESS':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'FAILED':
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const stepCounts = {
    UPLOADED: documents.filter(d => d.processingStep === 'UPLOADED').length,
    PROCESSING: documents.filter(d => ['PARSING', 'CHUNKING', 'EMBEDDING', 'QA_GENERATING'].includes(d.processingStep)).length,
    SUCCESS: documents.filter(d => d.status === 'SUCCESS').length,
    FAILED: documents.filter(d => d.status === 'FAILED').length,
  };

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-semibold">문서 관리</h2>
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
              title="문서 관리 안내"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600">문서를 업로드하고 처리 상태를 모니터링합니다</p>
        </div>
      </div>

      {/* Project and Cabinet Info Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Project Card */}
        {projectInfo && (
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
        )}

        {/* Cabinet Card */}
        {cabinetInfo && (
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
        )}
      </div>

      {/* Storage Info */}
      {cabinetInfo && (
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <button
            onClick={() => setIsStorageInfoExpanded(!isStorageInfoExpanded)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-gray-600" />
              <span className="font-medium">저장소 정보</span>
            </div>
            {isStorageInfoExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {isStorageInfoExpanded && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Storage Type</p>
                  <p className="font-semibold text-gray-900">{cabinetInfo.storageType}</p>
                  <p className="text-xs text-gray-600 mt-2 font-mono break-all">{cabinetInfo.storagePath}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Vector Store</p>
                  <p className="font-semibold text-gray-900">{cabinetInfo.vectorStore}</p>
                  <p className="text-xs text-gray-600 mt-2 font-mono break-all">{cabinetInfo.collectionName}</p>
                  <p className="text-xs text-gray-600 mt-1">{cabinetInfo.embeddingDim} dimensions</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Embedding Model</p>
                  <p className="font-semibold text-gray-900">{cabinetInfo.embeddingModel}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 mb-8 hover:border-blue-400 transition-colors">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">문서 업로드</h3>
          <p className="text-gray-600 mb-4">
            PDF, DOCX, HWP 파일을 드래그하거나 클릭하여 업로드하세요
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            파일 선택
          </button>
          <p className="text-sm text-gray-500 mt-4">최대 파일 크기: 10MB</p>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto overflow-y-visible pt-32 -mt-32">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">문서 ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">파일명</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">타입</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">크기</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">처리 파이프라인</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">업로드 일시</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentDocuments.map((doc) => {
                // EMBEDDING 단계를 완료한 문서만 Q&A 테스트 가능
                const canTestQA = doc.processingHistory.some(
                  h => h.processing_step === 'EMBEDDING' && h.processing_status === 'SUCCESS'
                );
                
                return (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {doc.id.substring(0, 8)}...
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">{doc.fileName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded uppercase">
                        {doc.fileType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{doc.size}</td>
                    <td className="px-6 py-4">
                      {/* Pipeline Visualization - Dot Style with QA */}
                      <div className="flex items-center justify-center">
                        <div className="group relative">
                          <div className="flex items-center gap-2">
                            {/* Main Pipeline: UPLOAD → PARSING → CHUNKING → EMBEDDING */}
                            {['UPLOAD', 'PARSING', 'CHUNKING', 'EMBEDDING'].map((step) => {
                              const historyItem = doc.processingHistory.find(h => h.processing_step === step);
                              const status = historyItem?.processing_status || 'PENDING';
                              
                              return (
                                <div
                                  key={step}
                                  className={`w-3 h-3 rounded-full transition-all ${
                                    status === 'SUCCESS'
                                      ? 'bg-green-500'
                                      : status === 'IN_PROGRESS'
                                      ? 'bg-blue-500 animate-pulse'
                                      : status === 'FAILED'
                                      ? 'bg-red-500'
                                      : 'bg-gray-300 border-2 border-gray-400'
                                  }`}
                                />
                              );
                            })}
                            
                            {/* Separator */}
                            <div className="w-px h-3 bg-gray-300 mx-1"></div>
                            
                            {/* QA Generation (Optional) */}
                            {(() => {
                              const qaItem = doc.processingHistory.find(h => h.processing_step === 'QA_GENERATING');
                              const status = qaItem?.processing_status || 'PENDING';
                              
                              return (
                                <div
                                  className={`w-3 h-3 rounded-full transition-all ${
                                    status === 'SUCCESS'
                                      ? 'bg-purple-500'
                                      : status === 'IN_PROGRESS'
                                      ? 'bg-purple-400 animate-pulse'
                                      : status === 'FAILED'
                                      ? 'bg-red-500'
                                      : 'bg-gray-200'
                                  }`}
                                />
                              );
                            })()}
                          </div>
                          
                          {/* Detailed Tooltip */}
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-[9999] pointer-events-none">
                            <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-2xl whitespace-nowrap border border-gray-700">
                              <div className="font-semibold mb-2 text-blue-400">처리 파이프라인</div>
                              <div className="space-y-1">
                                {['UPLOAD', 'PARSING', 'CHUNKING', 'EMBEDDING'].map((step) => {
                                  const item = doc.processingHistory.find(h => h.processing_step === step);
                                  const status = item?.processing_status || 'PENDING';
                                  const stepNames = {
                                    'UPLOAD': '업로드',
                                    'PARSING': '파싱',
                                    'CHUNKING': '청킹',
                                    'EMBEDDING': '임베딩'
                                  };
                                  
                                  return (
                                    <div key={step} className="flex items-center gap-2">
                                      <span className={`font-medium ${
                                        status === 'SUCCESS' ? 'text-green-400' :
                                        status === 'IN_PROGRESS' ? 'text-blue-400' :
                                        status === 'FAILED' ? 'text-red-400' :
                                        'text-gray-500'
                                      }`}>
                                        {stepNames[step as keyof typeof stepNames]}:
                                      </span>
                                      <span className={status === 'PENDING' ? 'text-gray-500' : ''}>
                                        {status === 'SUCCESS' ? '완료' :
                                         status === 'IN_PROGRESS' ? '진행중' :
                                         status === 'FAILED' ? '실패' :
                                         '대기'}
                                      </span>
                                      {item && status !== 'PENDING' && (
                                        <span className="text-gray-400 text-xs">({item.created_at})</span>
                                      )}
                                    </div>
                                  );
                                })}
                                
                                {/* QA Section */}
                                <div className="border-t border-gray-700 pt-1 mt-1">
                                  {(() => {
                                    const qaItem = doc.processingHistory.find(h => h.processing_step === 'QA_GENERATING');
                                    const status = qaItem?.processing_status || 'PENDING';
                                    
                                    return (
                                      <div className="flex items-center gap-2">
                                        <span className={`font-medium ${
                                          status === 'SUCCESS' ? 'text-purple-400' :
                                          status === 'IN_PROGRESS' ? 'text-purple-400' :
                                          status === 'FAILED' ? 'text-red-400' :
                                          'text-gray-500'
                                        }`}>
                                          QA 생성:
                                        </span>
                                        <span className={status === 'PENDING' ? 'text-gray-500' : ''}>
                                          {status === 'SUCCESS' ? '완료' :
                                           status === 'IN_PROGRESS' ? '진행중' :
                                           status === 'FAILED' ? '실패' :
                                           '미실행'}
                                        </span>
                                        {qaItem && status !== 'PENDING' && (
                                          <span className="text-gray-400 text-xs">({qaItem.created_at})</span>
                                        )}
                                      </div>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{doc.createdAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Q&A 테스트 버튼 */}
                        <button
                          onClick={() => {
                            setSelectedDocForQA(doc);
                            setShowDocQAModal(true);
                          }}
                          disabled={!canTestQA}
                          className={`p-2 rounded-lg transition-colors ${
                            !canTestQA
                              ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                          title={canTestQA ? '문서 Q&A 테스트' : '임베딩 완료 후 사용 가능'}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="다운로드"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDocumentForQA(doc);
                            setShowQAModal(true);
                          }}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="QA 생성"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDocumentToDelete(doc);
                            setShowDeleteModal(true);
                          }}
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
        
        {/* Pagination 추가 공간 확보 */}
        <div className="h-4"></div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-6">
          <div className="text-sm text-gray-600">
            총 {documents.length}개 문서 중 {startIndex + 1}-{Math.min(endIndex, documents.length)} 표시
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
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && documentToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">문서 삭제 확인</h3>
            <p className="text-gray-600 mb-6">
              "{documentToDelete.fileName}" 문서를 삭제하시겠습니까?
            </p>
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  handleDelete(documentToDelete.id);
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QA Generation Confirmation Modal */}
      {showQAModal && documentForQA && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">QA 생성 확인</h3>
            <p className="text-gray-600 mb-6">
              "{documentForQA.fileName}" 문서에 대한 QA를 생성하시겠습니까?
            </p>
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => setShowQAModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  handleGenerateQA(documentForQA);
                  setShowQAModal(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xl">📄 문서 관리 안내</h3>
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
                <h4 className="font-semibold text-lg mb-3 text-blue-600">🎯 핵심 목적: RAG 파이프라인의 시작점</h4>
                <p className="text-gray-700 leading-relaxed">
                  이 화면은 <strong>RAG 시스템의 원 데이터를 업로드하고 처리 상태를 모니터링</strong>하기 위한 것입니다. 
                  문서를 업로드하면 자동으로 파싱 → 청킹 → 임베딩 → QA 생성의 파이프라인이 실행됩니다.
                </p>
              </div>

              {/* 주요 기능 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-purple-600">🔧 주요 기능</h4>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-2">1. 문서 업로드</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• PDF, DOCX, HWP 형식 지원</li>
                      <li>• 드래그 앤 드롭 또는 파일 선택으로 업로드</li>
                      <li>• 최대 파일 크기: 10MB</li>
                      <li>• 선택된 캐비닛의 저장소 경로에 자동 저장</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h5 className="font-semibold text-green-900 mb-2">2. 처리 단계 모니터링 (ProcessingStep)</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>업로드됨 (UPLOADED)</strong>: 파일 업로드 완료, 처리 대기 중</li>
                      <li>• <strong>파싱 중 (PARSING)</strong>: 문서 텍스트 추출 작업 진행 중</li>
                      <li>• <strong>청킹 중 (CHUNKING)</strong>: 추출된 텍스트를 청크로 분할 중</li>
                      <li>• <strong>임베딩 중 (EMBEDDING)</strong>: 각 청크를 벡터로 변환 중</li>
                      <li>• <strong>QA 생성 중 (QA_GENERATING)</strong>: 청크 기반 질의응답 자동 생성 중</li>
                      <li>• <strong>완료 (COMPLETED)</strong>: 모든 파이프라인 단계 완료</li>
                      <li>• <strong>실패 (FAILED)</strong>: 처리 중 오류 발생</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h5 className="font-semibold text-yellow-900 mb-2">3. 문서 관리</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 문서 다운로드: 원본 파일 다시 받기</li>
                      <li>• 문서 삭제: 문서 및 관련 데이터 완전 제거</li>
                      <li>• 처리 통계: 총 문서, 완료, 처리 중, 실패 개 확인</li>
                      <li>• 페이지네이션으로 많은 문서 효율적으로 탐색</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 저장소 정보 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-green-600">🗄️ 저장소 정보</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-700 mb-3">
                    각 캐비닛은 독립적인 저장소 설정을 가지고 있으며, 업로드된 문서는 해당 설정에 따라 처리됩니다:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 font-semibold">Storage:</span>
                      <span className="text-gray-700">파일 저장 위치 (Local, S3 등)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-600 font-semibold">Vector DB:</span>
                      <span className="text-gray-700">임베딩 벡터 저장소 (Qdrant, Milvus 등)</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-orange-600 font-semibold">Embedding Model:</span>
                      <span className="text-gray-700">벡터 생성에 사용되는 모델 및 차원</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 실무 활용 시나리오 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-orange-600">💡 실무 활용 시나리오</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 1: 신규 문서 추가</h5>
                    <p className="text-sm text-gray-700">
                      신규 제품 매뉴얼 업로드 → 자동 파이프라인 실행 → 완료 상태 확인 → 즉시 검색 가능
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 2: 오래된 문서 교체</h5>
                    <p className="text-sm text-gray-700">
                      구버전 문서 삭제 → 신버전 문서 업로드 → 처리 완료 대기 → RAG 시스템에 최신 정보 반영
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 3: 처리 실패 디버깅</h5>
                    <p className="text-sm text-gray-700">
                      실패 상태 문서 확인 → 오류 로그 분석 → 문서 형식 수정 후 재업로드
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 4: 대량 문서 업로드</h5>
                    <p className="text-sm text-gray-700">
                      여러 문서 한번에 업로드 → 처리 중 상태 모니터링 → 완료된 문서부터 순차적으로 검색 가능
                    </p>
                  </div>
                </div>
              </div>

              {/* 워크플로우 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-purple-600">🔄 문서 처리 워크플로우</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span className="text-gray-700 font-semibold">➡️ 이 화면: 문서 업로드 (PDF, DOCX, HWP)</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <span className="text-gray-700">백그라운드: 문서 파싱 (텍스트 추출)</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      <span className="text-gray-700">청크 관리 화면: 텍스트 청킹 (분할)</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                      <span className="text-gray-700">모델 관리 화면: 청크 임베딩 (벡터 변환)</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                      <span className="text-gray-700">QA 관리 화면: QA 자동 생성 및 평가</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">6</span>
                      <span className="text-gray-700 font-semibold">➡️ 이 화면: 처리 완료 확인 → RAG 시스템 사용 가능</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 요약 */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">📌 요약</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  이 화면은 RAG 파이프라인의 <strong>입구(Entry Point)</strong>입니다. 
                  문서를 업로드하고 7단계의 처리 과정을 모니터링하여 
                  최종적으로 <strong>검색 가능한 지식베이스</strong>를 구축합니다.
                  <br />
                  각 단계의 상태를 실시간으로 확인하고 문제가 있을 경우 즉시 대응할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cabinet Settings Modal */}
      {showCabinetModal && (
        <CabinetModal
          cabinetInfo={cabinetInfo}
          onClose={() => setShowCabinetModal(false)}
        />
      )}

      {/* Project Settings Modal */}
      {showProjectModal && (
        <ProjectModal
          projectInfo={projectInfo}
          onClose={() => setShowProjectModal(false)}
        />
      )}

      {/* Document Q&A Modal */}
      {showDocQAModal && selectedDocForQA && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <DocumentQAPanel
              docId={selectedDocForQA.id}
              fileName={selectedDocForQA.fileName}
              cabinetId={cabinetInfo.uuid}
              onClose={() => setShowDocQAModal(false)}
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}