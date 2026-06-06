import { useState, useEffect } from 'react';
import { Database, Lock, Mail, AlertCircle, UserPlus, User, Hash, CheckCircle, X } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string, role: string) => void;
  error?: string;
  onNavigateToSignup?: () => void;
  onNavigateToLanding?: () => void;
}

export function Login({ onLogin, error, onNavigateToSignup, onNavigateToLanding }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('OWNER');
  const [rememberEmail, setRememberEmail] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showPasswordResetSuccessModal, setShowPasswordResetSuccessModal] = useState(false);
  
  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    employeeNumber: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Forgot password form state
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    employeeNumber: '',
    email: ''
  });

  // Load saved email on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save or remove email based on checkbox
    if (rememberEmail && email) {
      localStorage.setItem('savedEmail', email);
    } else {
      localStorage.removeItem('savedEmail');
    }

    // Skip validation and proceed directly to login (allow empty email/password for quick access)
    onLogin(email || 'admin@example.com', password, selectedRole);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!registerForm.employeeNumber || !registerForm.name || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    // Here you would typically send the registration form data to a server
    // For this example, we'll just show a success modal
    console.log('등록 신청:', registerForm);
    
    setShowRegisterModal(false);
    setShowSuccessModal(true);
    
    // Reset form
    setRegisterForm({
      employeeNumber: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!forgotPasswordForm.employeeNumber || !forgotPasswordForm.email) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    
    // Here you would typically send the forgot password form data to a server
    // For this example, we'll just show a success modal
    console.log('비밀번호 재설정 요청:', forgotPasswordForm);
    
    setShowForgotPasswordModal(false);
    setShowPasswordResetSuccessModal(true);
    
    // Reset form
    setForgotPasswordForm({
      employeeNumber: '',
      email: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 cursor-pointer hover:bg-blue-700 transition-colors"
            onClick={() => onNavigateToLanding && onNavigateToLanding()}
          >
            <Database className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">RAGO-X Admin</h1>
          <p className="text-gray-600 mt-2">관리자 대시보드에 로그인하세요</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              역할 (테스트용)
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="MASTER">플랫폼 관리자 (MASTER)</option>
                <option value="OWNER">조직 소유자 (OWNER)</option>
                <option value="ADMIN">조직 관리자 (ADMIN)</option>
                <option value="MEMBER">일반 사용자 (MEMBER)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberEmail}
                onChange={(e) => setRememberEmail(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">아이디 저장</span>
            </label>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700"
              onClick={() => setShowForgotPasswordModal(true)}
            >
              비밀번호 찾기
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            로그인
          </button>
        </form>

        {/* Register Button */}
        <button
          type="button"
          className="w-full bg-gray-100 text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-4"
          onClick={() => onNavigateToSignup ? onNavigateToSignup() : setShowRegisterModal(true)}
        >
          신규 등록
        </button>
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">신규 등록</h1>
              <p className="text-gray-600 mt-2">신규 관리자 계정을 등록하세요</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사원번호 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={registerForm.employeeNumber}
                    onChange={(e) => setRegisterForm({ ...registerForm, employeeNumber: e.target.value })}
                    placeholder="12345"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    placeholder="홍길동"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    placeholder="admin@example.com"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>안내:</strong> 등록 신청 후 관리자 승인이 필요합니다. 승인 완료 시 이메일로 알림을 받으실 수 있습니다.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                등록 신청
              </button>
            </form>

            <button
              type="button"
              className="w-full bg-gray-100 text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-4"
              onClick={() => setShowRegisterModal(false)}
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">등록 성공</h1>
              <p className="text-gray-600 mt-2">신규 관리자 계정이 등록되었습니다</p>
            </div>

            <button
              type="button"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => setShowSuccessModal(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">비밀번호 찾기</h1>
              <p className="text-gray-600 mt-2">비밀번호를 재설정하세요</p>
            </div>

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사원번호 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={forgotPasswordForm.employeeNumber}
                    onChange={(e) => setForgotPasswordForm({ ...forgotPasswordForm, employeeNumber: e.target.value })}
                    placeholder="12345"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={forgotPasswordForm.email}
                    onChange={(e) => setForgotPasswordForm({ ...forgotPasswordForm, email: e.target.value })}
                    placeholder="admin@example.com"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                비밀번호 재설정 요청
              </button>
            </form>

            <button
              type="button"
              className="w-full bg-gray-100 text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mt-4"
              onClick={() => setShowForgotPasswordModal(false)}
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* Password Reset Success Modal */}
      {showPasswordResetSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">비밀번호 재설정 성공</h1>
              <p className="text-gray-600 mt-2">비밀번호 재설정 요청이 완료되었습니다. 이메일로 새 비밀번호를 확인하세요.</p>
            </div>

            <button
              type="button"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => setShowPasswordResetSuccessModal(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}