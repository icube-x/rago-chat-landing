import { useState } from 'react';
import { Database, Mail, CheckCircle, RefreshCw } from 'lucide-react';

interface VerifyEmailProps {
  email: string;
  onVerified: () => void;
}

export function VerifyEmail({ email, onVerified }: VerifyEmailProps) {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleResendEmail = async () => {
    setResending(true);
    setResent(false);

    try {
      // 실제 API 호출
      // await fetch('/api/auth/resend-verification', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      // Mock: 재발송 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResent(true);
    } catch (err) {
      console.error('Failed to resend email:', err);
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setChecking(true);

    try {
      // 실제 API 호출
      // const response = await fetch('/api/auth/check-verification', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });
      // const data = await response.json();

      // Mock: 인증 확인 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));

      // 실제로는 API에서 verified 상태를 받아와야 함
      // if (data.verified) {
      //   onVerified();
      // }

      // Mock: 데모 목적으로 바로 인증 완료로 처리
      onVerified();
    } catch (err) {
      console.error('Failed to check verification:', err);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Database className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-semibold">KL-Store</h1>
          </div>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Header */}
          <h2 className="text-2xl font-semibold text-center mb-2">
            이메일을 확인해주세요
          </h2>
          <p className="text-center text-gray-600 mb-6">
            <span className="font-medium text-gray-900">{email}</span>로<br />
            인증 링크를 보냈습니다
          </p>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              📧 이메일을 확인하고 인증 링크를 클릭해주세요.
            </p>
            <p className="text-xs text-gray-500">
              이메일이 오지 않았다면 스팸 폴더를 확인해주세요.
            </p>
          </div>

          {/* Success Message */}
          {resent && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm mb-4">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>인증 이메일을 다시 보냈습니다!</span>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {/* Check Verification Button */}
            <button
              onClick={handleCheckVerification}
              disabled={checking}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {checking ? '확인 중...' : '인증 완료 확인'}
            </button>

            {/* Resend Button */}
            <button
              onClick={handleResendEmail}
              disabled={resending}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
              {resending ? '전송 중...' : '이메일 재발송'}
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              이메일을 받지 못하셨나요?{' '}
              <a href="#" className="text-blue-600 hover:underline">
                고객지원
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
