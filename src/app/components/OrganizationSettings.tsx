import { useState } from 'react';
import { Building2, Users, CreditCard, Key, Copy, Check, Mail, Trash2, Shield, X } from 'lucide-react';
import { useTenant } from '@/app/contexts/TenantContext';

export function OrganizationSettings() {
  const { currentTenant, role } = useTenant();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'MEMBER' | 'ADMIN' | 'OWNER'>('MEMBER');
  const [copiedInviteCode, setCopiedInviteCode] = useState(false);

  // Mock 데이터
  const inviteCode = `${currentTenant?.slug}-invite-2024-abc123`;
  const members = [
    {
      id: '1',
      email: 'admin@acme.com',
      name: 'John Doe',
      role: 'OWNER' as const,
      status: 'ACTIVE' as const,
      joinedAt: '2024-01-15',
    },
    {
      id: '2',
      email: 'user1@acme.com',
      name: 'Jane Smith',
      role: 'ADMIN' as const,
      status: 'ACTIVE' as const,
      joinedAt: '2024-02-10',
    },
    {
      id: '3',
      email: 'user2@acme.com',
      name: 'Bob Johnson',
      role: 'MEMBER' as const,
      status: 'ACTIVE' as const,
      joinedAt: '2024-03-01',
    },
    {
      id: '4',
      email: 'invited@example.com',
      name: null,
      role: 'MEMBER' as const,
      status: 'INVITED' as const,
      joinedAt: null,
    },
  ];

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(`${window.location.origin}/invite/${inviteCode}`);
    setCopiedInviteCode(true);
    setTimeout(() => setCopiedInviteCode(false), 2000);
  };

  const handleSendInvite = () => {
    // API 호출
    console.log('Sending invite to:', inviteEmail, 'with role:', inviteRole);
    setInviteEmail('');
  };

  const handleRemoveMember = (memberId: string) => {
    if (confirm('이 사용자를 조직에서 제거하시겠습니까?')) {
      console.log('Removing member:', memberId);
    }
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      MASTER: 'bg-red-100 text-red-700',
      OWNER: 'bg-purple-100 text-purple-700',
      ADMIN: 'bg-blue-100 text-blue-700',
      MEMBER: 'bg-gray-100 text-gray-700',
    };
    const names = {
      MASTER: '플랫폼 관리자',
      OWNER: '조직 소유자',
      ADMIN: '조직 관리자',
      MEMBER: '일반 사용자',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${badges[role as keyof typeof badges]}`}>
        {names[role as keyof typeof names]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ACTIVE: 'bg-green-100 text-green-700',
      INVITED: 'bg-yellow-100 text-yellow-700',
      SUSPENDED: 'bg-red-100 text-red-700',
    };
    const names = {
      ACTIVE: '활성',
      INVITED: '초대됨',
      SUSPENDED: '정지',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${badges[status as keyof typeof badges]}`}>
        {names[status as keyof typeof names]}
      </span>
    );
  };

  if (!currentTenant) {
    return (
      <div className="max-w-7xl">
        <p className="text-gray-600">조직 정보를 불러오는 중...</p>
      </div>
    );
  }

  const isOwner = role === 'OWNER' || role === 'MASTER';

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">조직 설정</h2>
        <p className="text-gray-600">{currentTenant.name}의 설정 및 멤버 관리</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Organization Info & Plan */}
        <div className="col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold">조직 정보</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  조직명
                </label>
                <input
                  type="text"
                  value={currentTenant.name}
                  disabled={!isOwner}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  슬러그 (URL)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentTenant.slug}
                    disabled={!isOwner}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 font-mono text-sm"
                  />
                  <span className="text-sm text-gray-500">.rago-x.chat</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  조직 ID
                </label>
                <input
                  type="text"
                  value={currentTenant.uuid}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                />
              </div>

              {isOwner && (
                <div className="pt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    변경사항 저장
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Member Management */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold">멤버 관리</h3>
              </div>
              {isOwner && (
                <button
                  onClick={handleCopyInviteCode}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {copiedInviteCode ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">복사됨!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>초대 링크 복사</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Invite Form */}
            {isOwner && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium mb-3">새 멤버 초대</h4>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="이메일 주소"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MEMBER">일반 사용자</option>
                    <option value="ADMIN">조직 관리자</option>
                    <option value="OWNER">조직 소유자</option>
                  </select>
                  <button
                    onClick={handleSendInvite}
                    disabled={!inviteEmail}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>초대</span>
                  </button>
                </div>
              </div>
            )}

            {/* Members List */}
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{member.name || member.email}</p>
                        {member.name && (
                          <p className="text-sm text-gray-500">{member.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getRoleBadge(member.role)}
                    {getStatusBadge(member.status)}
                    {member.joinedAt && (
                      <span className="text-xs text-gray-500">
                        {member.joinedAt}
                      </span>
                    )}
                    {isOwner && member.role !== 'OWNER' && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Plan & Usage */}
        <div className="space-y-6">
          {/* Plan Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold">결제 정보</h3>
            </div>

            <div className="space-y-4">
              {/* Plan Type */}
              <div>
                <p className="text-sm text-gray-600 mb-1">현재 플랜</p>
                <p className="text-2xl font-bold text-blue-600">
                  {currentTenant.plan === 'TRIAL' ? 'Trial (무료 체험)' : '사용자당 과금제'}
                </p>
              </div>

              {/* Trial Info */}
              {currentTenant.plan === 'TRIAL' && currentTenant.billing?.trialEndsAt && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>체험 기간</strong>
                  </p>
                  <p className="text-sm text-orange-700 mt-1">
                    {currentTenant.billing.trialDaysRemaining}일 남음 ({currentTenant.billing.trialEndsAt} 종료)
                  </p>
                </div>
              )}

              {/* Billing Info for PAID plan */}
              {currentTenant.plan === 'PAID' && currentTenant.billing && (
                <>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">사용자당 요금</p>
                    <p className="text-xl font-semibold">
                      {currentTenant.billing.pricePerUser.toLocaleString()}원 / 월
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">현재 사용자 수</p>
                    <p className="text-xl font-semibold">{currentTenant.billing.currentUsers}명</p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-blue-800 font-medium">월 예상 요금</span>
                      <span className="text-lg font-bold text-blue-900">
                        {(currentTenant.billing.pricePerUser * currentTenant.billing.currentUsers).toLocaleString()}원
                      </span>
                    </div>
                    <p className="text-xs text-blue-600">
                      다음 결제일: {currentTenant.billing.nextBillingDate}
                    </p>
                  </div>
                </>
              )}

              {/* Status */}
              <div>
                <p className="text-sm text-gray-600 mb-1">상태</p>
                <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                  currentTenant.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-700'
                    : currentTenant.status === 'TRIAL_EXPIRED'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {currentTenant.status === 'ACTIVE' ? '활성' :
                   currentTenant.status === 'TRIAL_EXPIRED' ? 'Trial 만료' :
                   currentTenant.status === 'SUSPENDED' ? '정지' : currentTenant.status}
                </span>
              </div>

              {/* Action Buttons */}
              {isOwner && (
                <div className="space-y-2 pt-2">
                  {currentTenant.plan === 'TRIAL' && (
                    <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">
                      정식 플랜으로 전환
                    </button>
                  )}
                  {currentTenant.plan === 'PAID' && (
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      결제 수단 관리
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Usage Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold mb-4">사용량</h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">사용자</span>
                  <span className="font-medium">
                    {members.filter(m => m.status === 'ACTIVE').length} / {currentTenant.settings?.maxUsers}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(members.filter(m => m.status === 'ACTIVE').length / (currentTenant.settings?.maxUsers || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">프로젝트</span>
                  <span className="font-medium">3 / {currentTenant.settings?.maxProjects}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(3 / (currentTenant.settings?.maxProjects || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">벡터</span>
                  <span className="font-medium">
                    {(45892).toLocaleString()} / {currentTenant.settings?.maxVectors.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{
                      width: `${(45892 / (currentTenant.settings?.maxVectors || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          {isOwner && (
            <div className="bg-red-50 rounded-lg border border-red-200 p-6">
              <h3 className="font-semibold text-red-900 mb-4">위험 영역</h3>
              <p className="text-sm text-red-700 mb-4">
                조직을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.
              </p>
              <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                조직 삭제
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
