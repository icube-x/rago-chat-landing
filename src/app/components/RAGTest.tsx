import { RAGTestPanel } from './RAGTestPanel';
import { Sparkles, Database, Folder, HardDrive } from 'lucide-react';

interface RAGTestProps {
  cabinetId: string;
  cabinetInfo?: {
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
  };
  projectInfo?: {
    id: string;
    name: string;
  };
}

export function RAGTest({ cabinetId, cabinetInfo, projectInfo }: RAGTestProps) {
  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-semibold">RAG 테스트</h2>
        </div>
        <p className="text-gray-600">
          문서 ingestion 완료 후 RAG 시스템의 질의응답 성능을 테스트합니다
        </p>
      </div>

      {/* Test Target Cabinet Info - 큰 카드로 강조 */}
      {cabinetInfo && (
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl border-2 border-purple-300 p-6 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">테스트 대상 캐비닛</p>
              <h3 className="text-2xl font-bold text-gray-900">{cabinetInfo.name}</h3>
            </div>
          </div>

          {/* Cabinet Details Grid */}
          <div className="grid grid-cols-4 gap-6 mt-4 pt-4 border-t border-purple-200">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Folder className="w-4 h-4 text-purple-600" />
                <p className="text-xs font-semibold text-purple-600 uppercase">프로젝트</p>
              </div>
              <p className="font-bold text-gray-900">{projectInfo?.name || 'Unknown'}</p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-4 h-4 text-blue-600" />
                <p className="text-xs font-semibold text-blue-600 uppercase">벡터 스토어</p>
              </div>
              <p className="font-bold text-gray-900">{cabinetInfo.vectorStore}</p>
              <p className="text-xs text-gray-600 mt-1 font-mono">{cabinetInfo.collectionName}</p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-green-600" />
                <p className="text-xs font-semibold text-green-600 uppercase">임베딩 모델</p>
              </div>
              <p className="font-bold text-gray-900">{cabinetInfo.embeddingModel}</p>
              <p className="text-xs text-gray-600 mt-1">{cabinetInfo.embeddingDim} dimensions</p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-orange-600" />
                <p className="text-xs font-semibold text-orange-600 uppercase">저장소 타입</p>
              </div>
              <p className="font-bold text-gray-900">{cabinetInfo.storageType}</p>
              <p className="text-xs text-gray-600 mt-1 font-mono truncate">{cabinetInfo.storagePath}</p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="mt-4 bg-white/60 rounded-lg px-4 py-3 border border-purple-200">
            <p className="text-sm text-purple-900">
              <span className="font-bold">⚠️ 검색 범위:</span> 이 캐비닛(<strong>{cabinetInfo.name}</strong>)에 업로드된 문서들만 검색됩니다. 
              다른 캐비닛의 문서는 검색되지 않습니다.
            </p>
          </div>
        </div>
      )}

      {/* Test Info Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">1</span>
            </div>
            <h3 className="font-semibold text-purple-900">질문 입력</h3>
          </div>
          <p className="text-sm text-purple-700">
            테스트하고 싶은 질문을 입력합니다. 문서에서 답변을 찾을 수 있는 질문이어야 합니다.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">2</span>
            </div>
            <h3 className="font-semibold text-blue-900">검색 확인</h3>
          </div>
          <p className="text-sm text-blue-700">
            벡터 검색으로 찾아낸 관련 문서 청크와 검색 점수를 확인합니다.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">3</span>
            </div>
            <h3 className="font-semibold text-green-900">답변 평가</h3>
          </div>
          <p className="text-sm text-green-700">
            생성된 답변이 검색된 청크를 기반으로 정확하게 작성되었는지 평가합니다.
          </p>
        </div>
      </div>

      {/* RAG Test Panel */}
      <RAGTestPanel />

      {/* Tips */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">💡 테스트 팁</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span><strong>검색 점수가 낮다면:</strong> 청킹 전략을 변경하거나 임베딩 모델을 교체해보세요.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span><strong>답변이 부정확하다면:</strong> 검색된 청크에 충분한 정보가 있는지 확인하고, 프롬프트 튜닝을 고려하세요.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span><strong>응답 시간이 느리다면:</strong> 벡터 데이터베이스 인덱스 최적화나 캐싱을 활용하세요.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span><strong>관련 없는 청크가 검색된다면:</strong> 청크 크기를 조정하거나 메타데이터 필터링을 추가하세요.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}