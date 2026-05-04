import { LandingPage } from '@/app/components/LandingPage';

function App() {
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
