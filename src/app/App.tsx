import { LandingPage } from '@/app/components/LandingPage';
import { PolicyPage } from '@/app/components/PolicyPage';
import { SupportPage } from '@/app/components/SupportPage';

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  if (path === '/terms' || path === '/terms.html' || path === '/terms-en.html' || path.startsWith('/policy-terms')) {
    return <PolicyPage slug="terms" />;
  }

  if (path === '/privacy' || path === '/privacy.html' || path.startsWith('/policy-privacy')) {
    return <PolicyPage slug="privacy" />;
  }

  if (path === '/support' || path === '/support.html' || path === '/customer-support') {
    return <SupportPage />;
  }

  const handleGetStarted = () => {
    // 회원가입 페이지로 이동하는 로직
    console.log('Get started clicked');
  };

  const handleLogin = () => {
    // 로그인 페이지로 이동하는 로직
    console.log('Login clicked');
  };

  return <LandingPage onGetStarted={handleGetStarted} onLogin={handleLogin} />;
}

export default App;
