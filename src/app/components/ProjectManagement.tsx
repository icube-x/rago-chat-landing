import { useState } from 'react';
import { Folder, Plus, Edit2, Trash2, Calendar, User, Info, X } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: 'active';
  cabinetCount: number;
  docCount: number;
  createdAt: string;
  updatedAt: string;
}

export function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Customer Support KB',
      description: '고객 지원 지식 베이스',
      owner: 'admin@example.com',
      status: 'active',
      cabinetCount: 2,
      docCount: 156,
      createdAt: '2025-01-01 10:00',
      updatedAt: '2026-02-08 15:30'
    },
    {
      id: '2',
      name: 'Product Documentation',
      description: '제품 문서화 프로젝트',
      owner: 'admin@example.com',
      status: 'active',
      cabinetCount: 1,
      docCount: 89,
      createdAt: '2025-02-15 10:00',
      updatedAt: '2026-02-07 12:00'
    },
    {
      id: '3',
      name: 'Internal Wiki',
      description: '사내 위키 시스템',
      owner: 'manager@example.com',
      status: 'active',
      cabinetCount: 1,
      docCount: 234,
      createdAt: '2025-03-01 10:00',
      updatedAt: '2026-02-05 09:00'
    },
    {
      id: '4',
      name: 'HR Knowledge Base',
      description: 'HR 부서 지식 관리',
      owner: 'hr@example.com',
      status: 'active',
      cabinetCount: 1,
      docCount: 45,
      createdAt: '2025-04-10 10:00',
      updatedAt: '2026-01-20 14:00'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    owner: '',
    status: 'active' as 'active'
  });

  const handleAddClick = () => {
    setShowAddModal(false);
    setShowConfirmModal(true);
  };

  const handleConfirmAdd = () => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const newId = (Math.max(...projects.map(p => parseInt(p.id))) + 1).toString();
    
    setProjects([...projects, {
      id: newId,
      name: newProject.name,
      description: newProject.description,
      owner: newProject.owner,
      status: newProject.status,
      cabinetCount: 0,
      docCount: 0,
      createdAt: now,
      updatedAt: now
    }]);

    setShowConfirmModal(false);
    setNewProject({
      name: '',
      description: '',
      owner: '',
      status: 'active'
    });
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setShowConfirmModal(false);
    setNewProject({
      name: '',
      description: '',
      owner: '',
      status: 'active'
    });
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingProject) {
      const updatedProjects = projects.map(p => {
        if (p.id === editingProject.id) {
          return {
            ...editingProject,
            updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
          };
        }
        return p;
      });
      setProjects(updatedProjects);
      setShowEditModal(false);
      setEditingProject(null);
    }
  };

  const handleDelete = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project && project.cabinetCount > 0) {
      alert(`캐비닛이 ${project.cabinetCount}개 있어 삭제할 수 없습니다. 먼저 캐비닛을 삭제해주세요.`);
      return;
    }
    
    if (confirm('정말 이 프로젝트를 삭제하시겠습니까?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-700'
    };
    
    const labels: Record<string, string> = {
      active: '활성'
    };
    
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${colors[status]}`}>
        <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
        {labels[status]}
      </span>
    );
  };

  const filteredProjects = filterStatus === 'all' 
    ? projects 
    : projects.filter(p => p.status === filterStatus);

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-semibold">프로젝트 관리</h2>
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
              title="프로젝트 관리 안내"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600">RAG 프로젝트를 생성하고 관리합니다</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          프로젝트 생성
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">전체 프로젝트</p>
              <p className="text-2xl font-semibold">{projects.length}</p>
            </div>
            <Folder className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">활성 프로젝트</p>
              <p className="text-2xl font-semibold text-green-600">
                {projects.filter(p => p.status === 'active').length}
              </p>
            </div>
            <Folder className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">총 캐비닛</p>
              <p className="text-2xl font-semibold text-purple-600">
                {projects.reduce((sum, p) => sum + p.cabinetCount, 0)}
              </p>
            </div>
            <Folder className="w-10 h-10 text-purple-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">총 문서</p>
              <p className="text-2xl font-semibold text-orange-600">
                {projects.reduce((sum, p) => sum + p.docCount, 0)}
              </p>
            </div>
            <Folder className="w-10 h-10 text-orange-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">상태:</span>
          <div className="flex gap-2">
            {[
              { value: 'all', label: '전체' },
              { value: 'active', label: '활성' }
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => setFilterStatus(status.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">프로젝트명</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">설명</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">소유자</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">상태</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">캐비닛</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">문서</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">생성일</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">최종 수정</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Folder className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-gray-900">{project.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {project.description}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{project.owner}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(project.status)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-gray-900">{project.cabinetCount}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-gray-900">{project.docCount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{project.createdAt}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {project.updatedAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(project)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="수정"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-lg">프로젝트 생성</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로젝트명 *
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  placeholder="예: 고객응대 지식베이스"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  placeholder="프로젝트 설명을 입력하세요"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  소유자 *
                </label>
                <input
                  type="email"
                  value={newProject.owner}
                  onChange={(e) => setNewProject({...newProject, owner: e.target.value})}
                  placeholder="예: 지식관리팀"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상태
                </label>
                <select 
                  value={newProject.status}
                  onChange={(e) => setNewProject({...newProject, status: e.target.value as 'active'})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">활성</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleAddClick}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                생성
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Add Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-lg text-gray-900">프로젝트 생성 확인</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-700 mb-4">
                다음 프로젝트를 생성하시겠습니까?
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">프로젝트명:</span>
                  <span className="font-medium text-gray-900">{newProject.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">설명:</span>
                  <span className="font-medium text-gray-900">{newProject.description || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">소유자:</span>
                  <span className="font-medium text-gray-900">{newProject.owner}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">상태:</span>
                  {getStatusBadge(newProject.status)}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleConfirmAdd}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                확인
              </button>
              <button
                onClick={handleCancelAdd}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-lg">프로젝트 수정</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로젝트명 *
                </label>
                <input
                  type="text"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명
                </label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  소유자 *
                </label>
                <input
                  type="email"
                  value={editingProject.owner}
                  onChange={(e) => setEditingProject({...editingProject, owner: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상태
                </label>
                <select 
                  value={editingProject.status}
                  onChange={(e) => setEditingProject({...editingProject, status: e.target.value as 'active'})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">활성</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                저장
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProject(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
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
                <h3 className="font-semibold text-xl">📁 프로젝트 관리 안내</h3>
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
                <h4 className="font-semibold text-lg mb-3 text-blue-600">🎯 핵심 목적: RAG 시스템의 최상위 단위</h4>
                <p className="text-gray-700 leading-relaxed">
                  이 화면은 <strong>RAG 시스템의 최상위 단위인 프로젝트를 생성하고 관리</strong>하기 위한 것입니다. 
                  프로젝트는 <strong>여러 개의 캐비닛과 문서를 포함</strong>하는 논리적 그룹이며, 
                  팀이나 부서별, 용도별로 RAG 시스템을 <strong>독립적으로 운영</strong>할 수 있게 합니다.
                </p>
              </div>

              {/* 주요 기능 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-purple-600">🔧 주요 기능</h4>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-2">1. 프로젝트 생성 및 관리</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>프로젝트 생성</strong>: 프로젝트명, 설명, 소유자 지정</li>
                      <li>• <strong>프로젝트 수정</strong>: 프로젝트 정보 업데이트</li>
                      <li>• <strong>프로젝트 삭제</strong>: 캐비닛이 없는 프로젝트만 삭제 가능</li>
                      <li>• <strong>상태 관리</strong>: 활성/비활성 상태 토글</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h5 className="font-semibold text-green-900 mb-2">2. 프로젝트 통계</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>전체 프로젝트 수</strong>: 시스템의 모든 프로젝트 개수</li>
                      <li>• <strong>활성 프로젝트 수</strong>: 현재 운영 중인 프로젝트</li>
                      <li>• <strong>총 캐비닛 수</strong>: 모든 프로젝트의 캐비닛 합계</li>
                      <li>• <strong>총 문서 수</strong>: 모든 프로젝트의 문서 합계</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h5 className="font-semibold text-purple-900 mb-2">3. 필터 및 조회</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>상태 필터</strong>: 전체 / 활성 프로젝트 필터링</li>
                      <li>• <strong>프로젝트 목록</strong>: 테이블 형식으로 명확한 정보 표시</li>
                      <li>• <strong>소유자 정보</strong>: 프로젝트 담당자 확인</li>
                      <li>• <strong>생성/수정 이력</strong>: 프로젝트 생성일 및 최종 수정일</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 프로젝트 계층 구조 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-green-600">🏗️ RAG 시스템 계층 구조</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 font-semibold w-24">1️⃣ 프로젝트</span>
                      <div className="flex-1">
                        <p className="text-gray-700 font-medium">최상위 단위 (이 화면에서 관리)</p>
                        <p className="text-gray-600 text-xs mt-1">예: "고객 지원 KB", "제품 문서화", "사내 위키"</p>
                      </div>
                    </div>
                    <div className="ml-6 border-l-2 border-gray-300 pl-6">
                      <div className="flex items-start gap-3">
                        <span className="text-purple-600 font-semibold w-24">2️⃣ 캐비닛</span>
                        <div className="flex-1">
                          <p className="text-gray-700 font-medium">프로젝트 내 문서 그룹</p>
                          <p className="text-gray-600 text-xs mt-1">예: "FAQ 캐비닛", "매뉴얼 캐비닛"</p>
                        </div>
                      </div>
                      <div className="ml-6 mt-3 border-l-2 border-gray-300 pl-6">
                        <div className="flex items-start gap-3">
                          <span className="text-orange-600 font-semibold w-24">3️⃣ 문서</span>
                          <div className="flex-1">
                            <p className="text-gray-700 font-medium">실제 데이터 파일</p>
                            <p className="text-gray-600 text-xs mt-1">예: "product_manual.pdf", "faq_2026.docx"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 실무 활용 시나리오 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-orange-600">💡 실무 활용 시나리오</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 1: 부서별 지식베이스 구축</h5>
                    <p className="text-sm text-gray-700">
                      HR 프로젝트, 영업 프로젝트, 개발 프로젝트를 각각 생성 → 각 부서가 독립적으로 문서 관리
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 2: 고객별 맞춤형 RAG 시스템</h5>
                    <p className="text-sm text-gray-700">
                      고객사 A 프로젝트, 고객사 B 프로젝트 생성 → 고객별로 독립된 지식베이스 제공
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 3: 프로젝트 삭제 전 정리</h5>
                    <p className="text-sm text-gray-700">
                      프로젝트 삭제 시도 → 캐비닛 있으면 경고 → 캐비닛 먼저 삭제 → 프로젝트 삭제 완료
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 4: 프로젝트 소유권 이전</h5>
                    <p className="text-sm text-gray-700">
                      프로젝트 수정 → 소유자 변경 → 담당 팀/담당자 업데이트 → 알림 발송
                    </p>
                  </div>
                </div>
              </div>

              {/* 프로젝트 필드 설명 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-purple-600">📋 프로젝트 필드 설명</h4>
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-1 text-sm">프로젝트명 (필수)</h5>
                    <p className="text-xs text-gray-700">
                      프로젝트를 식별하는 고유 이름. 명확하고 직관적으로 작성 (예: "고객응대 지식베이스")
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <h5 className="font-semibold text-green-900 mb-1 text-sm">설명 (선택)</h5>
                    <p className="text-xs text-gray-700">
                      프로젝트의 목적, 범위, 사용 용도를 기술. 팀원들이 이해하기 쉽게 작성
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <h5 className="font-semibold text-purple-900 mb-1 text-sm">소유자 (필수)</h5>
                    <p className="text-xs text-gray-700">
                      프로젝트 담당자 또는 담당 팀. 이메일 또는 팀명 입력 (예: "지식관리팀", "admin@company.com")
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                    <h5 className="font-semibold text-orange-900 mb-1 text-sm">상태</h5>
                    <p className="text-xs text-gray-700">
                      활성 (운영 중) / 비활성 (일시 중단). 활성 프로젝트만 실제 서비스에서 사용
                    </p>
                  </div>
                </div>
              </div>

              {/* 워크플로우 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-blue-600">🔄 프로젝트 관리 워크플로우</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span className="text-gray-700 font-semibold">➡️ 이 화면: "프로젝트 생성" 버튼 클릭</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <span className="text-gray-700 font-semibold">➡️ 이 화면: 프로젝트명, 설명, 소유자 입력</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      <span className="text-gray-700 font-semibold">➡️ 이 화면: 생성 확인 및 완료</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                      <span className="text-gray-700">상단 프로젝트 선택 드롭다운: 생성된 프로젝트 선택</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                      <span className="text-gray-700">캐비닛 관리 화면: 캐비닛 생성</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">6</span>
                      <span className="text-gray-700">문서 관리 화면: 문서 업로드 및 관리</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 삭제 제약 사항 */}
              <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                <h4 className="font-semibold text-red-900 mb-2">⚠️ 프로젝트 삭제 시 주의사항</h4>
                <ul className="text-sm text-red-800 leading-relaxed space-y-1">
                  <li>• <strong>캐비닛 확인</strong>: 프로젝트 내 캐비닛이 1개 이상 있으면 삭제 불가</li>
                  <li>• <strong>삭제 순서</strong>: 문서 삭제 → 캐비닛 삭제 → 프로젝트 삭제</li>
                  <li>• <strong>데이터 복구 불가</strong>: 프로젝트 삭제 시 연관된 모든 데이터 영구 삭제</li>
                  <li>• <strong>삭제 전 백업</strong>: 중요 데이터는 반드시 백업 후 삭제</li>
                  <li>• <strong>확인 절차</strong>: 삭제 버튼 클릭 시 확인 모달로 한 번 더 확인</li>
                </ul>
              </div>

              {/* 베스트 프랙티스 */}
              <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded">
                <h4 className="font-semibold text-amber-900 mb-2">💡 베스트 프랙티스</h4>
                <ul className="text-sm text-amber-800 leading-relaxed space-y-1">
                  <li>• <strong>명명 규칙</strong>: 프로젝트명은 팀/부서/용도가 명확히 드러나도록 작성</li>
                  <li>• <strong>소유자 지정</strong>: 실제 담당자 또는 담당 팀을 명확히 지정</li>
                  <li>• <strong>설명 작성</strong>: 프로젝트 목적, 대상 사용자, 주요 용도를 상세히 기술</li>
                  <li>• <strong>정기적 정리</strong>: 사용하지 않는 프로젝트는 주기적으로 삭제 또는 비활성화</li>
                  <li>• <strong>권한 관리</strong>: 프로젝트 소유자만 수정/삭제할 수 있도록 권한 설정</li>
                </ul>
              </div>

              {/* 요약 */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">📌 요약</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  이 화면은 RAG 시스템의 <strong>최상위 단위인 프로젝트를 생성하고 관리</strong>하는 시작점입니다. 
                  프로젝트 생성 후 → 캐비닛 추가 → 문서 업로드 순으로 진행하며, 
                  <strong>팀/부서/고객별로 독립된 지식베이스</strong>를 구축할 수 있습니다.
                  삭제 시에는 반드시 캐비닛과 문서를 먼저 삭제해야 하며, 
                  프로젝트명과 소유자를 명확히 지정하여 <strong>효율적인 관리</strong>를 수행하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}