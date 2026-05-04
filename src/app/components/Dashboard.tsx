import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Line as ChartLine } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend
} from 'chart.js';
import { TrendingUp, Database, Zap, Clock, Activity, Folder, LayoutGrid } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  ChartLegend
);

const queryData = [
  { id: 'q1', time: '00:00', queries: 45 },
  { id: 'q2', time: '04:00', queries: 23 },
  { id: 'q3', time: '08:00', queries: 89 },
  { id: 'q4', time: '12:00', queries: 156 },
  { id: 'q5', time: '16:00', queries: 134 },
  { id: 'q6', time: '20:00', queries: 78 },
];

const responseTimeData = [
  { id: 'rt1', time: '00:00', ms: 245 },
  { id: 'rt2', time: '04:00', ms: 198 },
  { id: 'rt3', time: '08:00', ms: 312 },
  { id: 'rt4', time: '12:00', ms: 278 },
  { id: 'rt5', time: '16:00', ms: 289 },
  { id: 'rt6', time: '20:00', ms: 234 },
];

const embeddingModelData = [
  { id: 'em1', name: 'text-embedding-3-small', value: 45 },
  { id: 'em2', name: 'text-embedding-3-large', value: 30 },
  { id: 'em3', name: 'all-MiniLM-L6-v2', value: 25 },
];

const llmModelData = [
  { id: 'd1', date: '04/05', gpt4: 180, gpt35: 145, claude: 42 },
  { id: 'd2', date: '04/06', gpt4: 195, gpt35: 132, claude: 38 },
  { id: 'd3', date: '04/07', gpt4: 210, gpt35: 156, claude: 51 },
  { id: 'd4', date: '04/08', gpt4: 188, gpt35: 141, claude: 45 },
  { id: 'd5', date: '04/09', gpt4: 225, gpt35: 138, claude: 48 },
  { id: 'd6', date: '04/10', gpt4: 218, gpt35: 127, claude: 52 },
  { id: 'd7', date: '04/11', gpt4: 229, gpt35: 117, claude: 63 },
];

const llmModelSummary = [
  { name: 'GPT-4', total: 1445, color: '#3b82f6' },
  { name: 'GPT-3.5-turbo', total: 956, color: '#8b5cf6' },
  { name: 'Claude 3 Sonnet', total: 339, color: '#06b6d4' },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4'];

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

interface DashboardProps {
  projectInfo: ProjectInfo;
  cabinetInfo: CabinetInfo;
}

export function Dashboard({ projectInfo, cabinetInfo }: DashboardProps) {
  const [viewMode, setViewMode] = useState<'cabinet' | 'all'>('cabinet');

  return (
    <div className="max-w-7xl">
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2">대시보드</h2>
            <p className="text-gray-600">RAG 파이프라인 성능 및 통계 모니터링</p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cabinet')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'cabinet'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              캐비닛별 보기
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              전체 보기
            </button>
          </div>
        </div>
      </div>

      {/* Project and Cabinet Info Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Project Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-blue-600 mb-1">PROJECT</p>
              <h3 className="text-lg font-bold text-gray-900 truncate">{projectInfo.name}</h3>
            </div>
          </div>
        </div>

        {/* Cabinet Card (conditional based on view mode) */}
        {viewMode === 'cabinet' ? (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Folder className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-purple-600 mb-1">CABINET</p>
                <h3 className="text-lg font-bold text-gray-900 truncate">{cabinetInfo.name}</h3>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <LayoutGrid className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-green-600 mb-1">SCOPE</p>
                <h3 className="text-lg font-bold text-gray-900">전체 캐비닛</h3>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5%</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">총 쿼리 (24시간)</p>
          <p className="text-3xl font-semibold">2,547</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <DatabaseIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+3.2%</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">벡터 임베딩</p>
          <p className="text-3xl font-semibold">45,892</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>-8.3%</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">평균 응답 시간</p>
          <p className="text-3xl font-semibold">258ms</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex items-center gap-1 text-red-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+2.1%</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">처리 대기중</p>
          <p className="text-3xl font-semibold">12</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Query Volume Chart */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold mb-2">사용자 질의 횟수 (24시간)</h3>
          <p className="text-sm text-gray-500 mb-4">시간대별 질의 요청 수</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={queryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="queries" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Response Time Chart */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold mb-2">평균 응답 시간 (24시간)</h3>
          <p className="text-sm text-gray-500 mb-4">질의에 대한 답변 생성 시간</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="ms" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Embedding Model Distribution */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold mb-6">임베딩 모델 분포</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={embeddingModelData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {embeddingModelData.map((entry, index) => (
                  <Cell key={`cell-${entry.id}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {embeddingModelData.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* LLM Model Usage */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold mb-2">LLM 모델 호출 분포 (7일)</h3>
          <p className="text-sm text-gray-500 mb-4">날짜별 모델 사용 추이</p>

          <div style={{ height: '250px' }}>
            <ChartLine
              data={{
                labels: llmModelData.map(d => d.date),
                datasets: [
                  {
                    label: 'GPT-4',
                    data: llmModelData.map(d => d.gpt4),
                    borderColor: '#3b82f6',
                    backgroundColor: '#3b82f6',
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                  },
                  {
                    label: 'GPT-3.5-turbo',
                    data: llmModelData.map(d => d.gpt35),
                    borderColor: '#8b5cf6',
                    backgroundColor: '#8b5cf6',
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                  },
                  {
                    label: 'Claude 3 Sonnet',
                    data: llmModelData.map(d => d.claude),
                    borderColor: '#06b6d4',
                    backgroundColor: '#06b6d4',
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                    labels: {
                      usePointStyle: true,
                      padding: 15,
                    },
                  },
                  tooltip: {
                    backgroundColor: '#fff',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    titleColor: '#1f2937',
                    bodyColor: '#1f2937',
                    padding: 12,
                    cornerRadius: 8,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: '#f0f0f0',
                    },
                    ticks: {
                      color: '#9ca3af',
                    },
                  },
                  x: {
                    grid: {
                      color: '#f0f0f0',
                    },
                    ticks: {
                      color: '#9ca3af',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Vector Database Stats */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="font-semibold mb-6">벡터 데이터베이스 상태</h3>
          {viewMode === 'cabinet' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">벡터 스토어</p>
                  <p className="font-medium">{cabinetInfo.vectorStore}</p>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{cabinetInfo.collectionName}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    정상 운영 중
                  </div>
                  <span className="text-xs text-gray-500">Status: Green</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">벡터 개수</p>
                  <p className="text-xl font-semibold">45,892</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">세그먼트</p>
                  <p className="text-xl font-semibold">5</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">차원</p>
                  <p className="text-xl font-semibold">{cabinetInfo.embeddingDim}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">벡터 스토어</p>
                  <p className="font-medium">{cabinetInfo.vectorStore}</p>
                  <p className="text-xs text-gray-500 mt-1">프로젝트 내 모든 컬렉션</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    정상 운영 중
                  </div>
                  <span className="text-xs text-gray-500">모든 컬렉션 정상</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">전체 벡터 개수</p>
                <p className="text-2xl font-semibold mb-3">138,247</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">faq</span>
                    <span className="font-mono font-medium">45,892</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">qa_history</span>
                    <span className="font-mono font-medium">52,134</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">product_manual</span>
                    <span className="font-mono font-medium">40,221</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">전체 세그먼트</p>
                  <p className="text-xl font-semibold">14</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">평균 차원</p>
                  <p className="text-xl font-semibold">1,536</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
    </svg>
  );
}