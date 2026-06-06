import { useState, useEffect } from 'react';
import { Database, Mail, Building2, Shield, CheckCircle, XCircle } from 'lucide-react';

interface InviteInfo {
  organizationName: string;
  organizationPlan: string;
  inviterName: string;
  inviterEmail: string;
  role: string;
  roleName: string;
  email: string;
}

interface InviteAcceptProps {
  inviteCode: string;
  onAcceptAsNewUser: (email: string) => void;
  onAcceptAsExistingUser: () => void;
  onDecline: () => void;
}

export function InviteAccept({ inviteCode, onAcceptAsNewUser, onAcceptAsExistingUser, onDecline }: InviteAcceptProps) {
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);

  useEffect(() => {
    loadInviteInfo();
  }, [inviteCode]);

  const loadInviteInfo = async () => {
    setLoading(true);
    setError('');

    try {
      // 실제 API 호출
      // const response = await fetch(`/api/invites/${inviteCode}`);
      // const data = await response.json();

      // Mock: 초대 정보 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockInviteInfo: InviteInfo = {
        organizationName: 'Acme Corporation',
        organizationPlan: 'PRO',
        inviterName: 'John Doe',
        inviterEmail: 'john@acme.com',
        role: 'PROJECT_ADMIN',
        roleName: '프로젝트 관리자',
        email: 'newuser@example.com',
      };

      setInviteInfo(mockInviteInfo);
    } catch (err) {
      setError('초대 정보를 불러올 수 없습니다. 초대 링크가 만료되었거나 잘못되었습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (hasAccount) {
      onAcceptAsExistingUser();
    } else {
      if (inviteInfo) {
        onAcceptAsNewUser(inviteInfo.email);
      }
    }
  };

  const handleDecline = () => {
    if (confirm('초대를 거절하시겠습니까?')) {
      onDecline();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Database className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">초대 정보를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !inviteInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm text-center">
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">초대를 찾을 수 없습니다</h2>
            <p className="text-gray-600 mb-6">
              {error || '초대 링크가 만료되었거나 잘못되었습니다.'}
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              홈으로 가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (hasAccount === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Database className="w-10 h-10 text-blue-600" />
              <h1 className="text-3xl font-semibold">RAGO-X</h1>
            </div>
          </div>

          {/* Invite Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            {/* Header */}
            <h2 className="text-2xl font-semibold text-center mb-2">
              조직 초대
            </h2>
            <p className="text-center text-gray-600 mb-6">
              <span className="font-medium text-gray-900">{inviteInfo.inviterName}</span>님이 초대했습니다
            </p>

            {/* Organization Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6 border border-blue-100">
              <div className="flex items-start gap-3 mb-3">
                <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">조직</p>
                  <p className="font-semibold text-gray-900">{inviteInfo.organizationName}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{inviteInfo.organizationPlan} Plan</p>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-3">
                <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">역할</p>
                  <p className="font-semibold text-gray-900">{inviteInfo.roleName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">초대자</p>
                  <p className="font-semibold text-gray-900">{inviteInfo.inviterEmail}</p>
                </div>
              </div>
            </div>

            {/* Account Question */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 text-center mb-3">
                RAGO-X 계정이 있으신가요?
              </p>

              <button
                onClick={() => setHasAccount(true)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                네, 계정이 있습니다
              </button>

              <button
                onClick={() => setHasAccount(false)}
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                아니요, 계정이 없습니다
              </button>
            </div>

            {/* Decline */}
            <div className="mt-6 text-center">
              <button
                onClick={handleDecline}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                초대 거절
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Database className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-semibold">RAGO-X</h1>
          </div>
        </div>

        {/* Confirmation Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Header */}
          <h2 className="text-2xl font-semibold text-center mb-2">
            초대를 수락하시겠습니까?
          </h2>
          <p className="text-center text-gray-600 mb-6">
            {hasAccount ? '로그인 후' : '가입 후'} <span className="font-medium text-gray-900">{inviteInfo.organizationName}</span>에 자동으로 추가됩니다
          </p>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">조직:</span>
                <span className="font-medium text-gray-900">{inviteInfo.organizationName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">역할:</span>
                <span className="font-medium text-gray-900">{inviteInfo.roleName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">플랜:</span>
                <span className="font-medium text-gray-900">{inviteInfo.organizationPlan}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleAccept}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {hasAccount ? '초대 수락하고 로그인' : '초대 수락하고 가입하기'}
            </button>

            <button
              onClick={() => setHasAccount(null)}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              뒤로 가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
