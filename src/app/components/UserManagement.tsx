import { useState } from 'react';
import { Users, Plus, Trash2, Edit, Shield, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
      isActive: true,
      lastLogin: '2026-01-29 14:30',
      createdAt: '2025-12-01 10:00'
    },
    {
      id: 2,
      name: 'Kim Manager',
      email: 'kim.manager@example.com',
      role: 'manager',
      isActive: true,
      lastLogin: '2026-01-29 09:15',
      createdAt: '2025-12-15 10:00'
    },
    {
      id: 3,
      name: 'Lee Viewer',
      email: 'lee.viewer@example.com',
      role: 'viewer',
      isActive: true,
      lastLogin: '2026-01-28 16:45',
      createdAt: '2026-01-05 10:00'
    },
    {
      id: 4,
      name: 'Park Manager',
      email: 'park.manager@example.com',
      role: 'manager',
      isActive: false,
      lastLogin: '2026-01-20 11:30',
      createdAt: '2025-12-20 10:00'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'viewer' as User['role'],
    password: ''
  });

  const handleDelete = (id: number) => {
    if (confirm('정말 이 사용자를 삭제하시겠습니까?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleToggleActive = (id: number) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, isActive: !u.isActive } : u
    ));
  };

  const handleAddUser = () => {
    const user: User = {
      id: Math.max(...users.map(u => u.id)) + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isActive: true,
      lastLogin: null,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    
    setUsers([...users, user]);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'viewer', password: '' });
  };

  const handleEditUser = () => {
    if (!editingUser) return;
    
    setUsers(users.map(u => 
      u.id === editingUser.id ? editingUser : u
    ));
    setEditingUser(null);
  };

  const getRoleBadge = (role: User['role']) => {
    const styles = {
      admin: 'bg-red-100 text-red-700',
      manager: 'bg-blue-100 text-blue-700',
      viewer: 'bg-gray-100 text-gray-700'
    };
    
    const labels = {
      admin: '관리자',
      manager: '매니저',
      viewer: '뷰어'
    };
    
    return (
      <span className={`px-3 py-1 ${styles[role]} rounded-full text-sm font-medium flex items-center gap-1`}>
        <Shield className="w-3 h-3" />
        {labels[role]}
      </span>
    );
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    admins: users.filter(u => u.role === 'admin').length
  };

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">사용자 관리</h2>
          <p className="text-gray-600">시스템 사용자 및 권한을 관리합니다</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          사용자 추가
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">총 사용자</p>
              <p className="text-2xl font-semibold">{stats.total}</p>
            </div>
            <Users className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">활성 사용자</p>
              <p className="text-2xl font-semibold text-green-600">{stats.active}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">비활성 사용자</p>
              <p className="text-2xl font-semibold text-gray-600">{stats.inactive}</p>
            </div>
            <XCircle className="w-10 h-10 text-gray-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">관리자</p>
              <p className="text-2xl font-semibold text-red-600">{stats.admins}</p>
            </div>
            <Shield className="w-10 h-10 text-red-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">사용자</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">이메일</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">권한</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">상태</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">마지막 로그인</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">생성일</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(user.id)}
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        user.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {user.isActive ? '활성' : '비활성'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.lastLogin || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.createdAt}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="수정"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="삭제"
                        disabled={user.id === 1}
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-lg">사용자 추가</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="홍길동"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  권한
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="viewer">뷰어 (읽기 전용)</option>
                  <option value="manager">매니저 (읽기/쓰기)</option>
                  <option value="admin">관리자 (전체 권한)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {newUser.role === 'viewer' && '• 대시보드 및 데이터 조회만 가능'}
                  {newUser.role === 'manager' && '• 문서 업로드, 수정, 삭제 가능'}
                  {newUser.role === 'admin' && '• 시스템 설정 및 사용자 관리 가능'}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleAddUser}
                disabled={!newUser.name || !newUser.email || !newUser.password}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                추가
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewUser({ name: '', email: '', role: 'viewer', password: '' });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-lg">사용자 수정</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  권한
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as User['role'] })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="viewer">뷰어 (읽기 전용)</option>
                  <option value="manager">매니저 (읽기/쓰기)</option>
                  <option value="admin">관리자 (전체 권한)</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleEditUser}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                저장
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
