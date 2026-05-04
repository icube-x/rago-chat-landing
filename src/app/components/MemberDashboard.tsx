import { useState } from 'react';
import { Search, MessageSquare, FileText, Sparkles, Database, User, LogOut, Menu, X, Folder, FolderOpen, Plus, Trash2, ChevronDown, ChevronRight, Clock, TrendingUp } from 'lucide-react';
import { useTenant } from '@/app/contexts/TenantContext';

interface MemberDashboardProps {
  userEmail: string;
  onLogout: () => void;
}

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: string[];
}

interface ChatSession {
  id: string;
  title: string;
  cabinet: string;
  cabinetId: string;
  lastMessage: string;
  timestamp: string;
  messages: Message[];
}

interface Project {
  id: string;
  name: string;
}

interface Cabinet {
  id: string;
  name: string;
  projectId: string;
}

export function MemberDashboard({ userEmail, onLogout }: MemberDashboardProps) {
  const { currentTenant } = useTenant();
  const [activeView, setActiveView] = useState<'chat' | 'search'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Project & Cabinet selection
  const [selectedProject, setSelectedProject] = useState('1');
  const [selectedCabinet, setSelectedCabinet] = useState('1');

  const projects: Project[] = [
    { id: '1', name: 'Customer Support KB' },
    { id: '2', name: 'Product Documentation' },
    { id: '3', name: 'Internal Wiki' },
    { id: '4', name: 'HR Knowledge Base' }
  ];

  const cabinets: Cabinet[] = [
    { id: '1', name: 'FAQ', projectId: '1' },
    { id: '2', name: 'QA 히스토리', projectId: '1' },
    { id: '3', name: '제품메뉴얼', projectId: '2' },
    { id: '4', name: '업무메뉴얼', projectId: '3' },
    { id: '5', name: '사규집', projectId: '4' }
  ];

  const filteredCabinets = cabinets.filter(c => c.projectId === selectedProject);
  const currentProject = projects.find(p => p.id === selectedProject);
  const currentCabinet = cabinets.find(c => c.id === selectedCabinet);

  // Chat sessions state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 'session-1',
      title: 'RAG 시스템에 대한 질문',
      cabinet: 'FAQ',
      cabinetId: '1',
      lastMessage: 'RAG란 무엇인가요?',
      timestamp: '2026-05-03 10:30',
      messages: [
        {
          id: 1,
          role: 'assistant',
          content: '안녕하세요! 무엇을 도와드릴까요? 문서에 대해 궁금한 점을 질문해주세요.',
          timestamp: '2026-05-03 10:30:00',
        },
        {
          id: 2,
          role: 'user',
          content: 'RAG란 무엇인가요?',
          timestamp: '2026-05-03 10:30:15',
        },
        {
          id: 3,
          role: 'assistant',
          content: 'RAG(Retrieval-Augmented Generation)는 대규모 언어 모델의 성능을 향상시키기 위해 외부 지식 베이스에서 관련 정보를 검색하여 활용하는 기술입니다.',
          timestamp: '2026-05-03 10:30:20',
          sources: ['RAG_개요.pdf', '벡터DB_가이드.pdf']
        }
      ]
    },
    {
      id: 'session-2',
      title: '벡터 임베딩 설명',
      cabinet: 'FAQ',
      cabinetId: '1',
      lastMessage: '벡터 임베딩의 목적은 무엇인가요?',
      timestamp: '2026-05-02 16:45',
      messages: [
        {
          id: 1,
          role: 'assistant',
          content: '안녕하세요! 무엇을 도와드릴까요? 문서에 대해 궁금한 점을 질문해주세요.',
          timestamp: '2026-05-02 16:45:00',
        }
      ]
    }
  ]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('session-1');
  const [isChatMenuExpanded, setIsChatMenuExpanded] = useState(true);

  const currentSession = chatSessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Stats
  const stats = [
    { label: '총 질의 수', value: '156', icon: MessageSquare, colorClass: 'text-blue-600' },
    { label: '이번 주', value: '23', icon: TrendingUp, colorClass: 'text-green-600' },
    { label: '평균 응답시간', value: '1.2초', icon: Clock, colorClass: 'text-purple-600' },
  ];

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: '새 대화',
      cabinet: currentCabinet?.name || 'FAQ',
      cabinetId: selectedCabinet,
      lastMessage: '',
      timestamp: new Date().toISOString(),
      messages: [
        {
          id: 1,
          role: 'assistant',
          content: '안녕하세요! 무엇을 도와드릴까요? 문서에 대해 궁금한 점을 질문해주세요.',
          timestamp: new Date().toISOString(),
        }
      ]
    };
    setChatSessions([newSession, ...chatSessions]);
    setCurrentSessionId(newSession.id);
    setShowChatHistory(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    const filtered = chatSessions.filter(s => s.id !== sessionId);
    setChatSessions(filtered);
    if (currentSessionId === sessionId && filtered.length > 0) {
      setCurrentSessionId(filtered[0].id);
    } else if (filtered.length === 0) {
      handleNewChat();
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !currentSession) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    // Update session messages
    const updatedMessages = [...messages, userMessage];
    const updatedSessions = chatSessions.map(s =>
      s.id === currentSessionId
        ? {
            ...s,
            messages: updatedMessages,
            lastMessage: inputMessage,
            timestamp: new Date().toISOString(),
            title: s.title === '새 대화' ? inputMessage.slice(0, 30) + (inputMessage.length > 30 ? '...' : '') : s.title
          }
        : s
    );
    setChatSessions(updatedSessions);
    setInputMessage('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const assistantMessage: Message = {
        id: updatedMessages.length + 1,
        role: 'assistant',
        content: `${inputMessage}에 대한 답변입니다. 실제 환경에서는 RAG 시스템이 관련 문서를 검색하여 정확한 답변을 제공합니다.`,
        timestamp: new Date().toISOString(),
        sources: ['문서1.pdf', '문서2.pdf']
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      const finalSessions = chatSessions.map(s =>
        s.id === currentSessionId
          ? { ...s, messages: finalMessages }
          : s
      );
      setChatSessions(finalSessions);
      setIsLoading(false);
    }, 1500);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // Mock search results
    setSearchResults([
      {
        id: 1,
        title: 'RAG 시스템 개요',
        content: 'RAG(Retrieval-Augmented Generation)는 검색 기반 생성 모델로...',
        document: 'RAG_개요.pdf',
        score: 0.95
      },
      {
        id: 2,
        title: '벡터 데이터베이스 소개',
        content: '벡터 데이터베이스는 임베딩 벡터를 효율적으로 저장하고 검색...',
        document: '벡터DB_가이드.pdf',
        score: 0.87
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Unified Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Database className="w-7 h-7 text-blue-600" />
            <div className="flex-1">
              <h1 className="font-semibold">KL-Store</h1>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500">{currentTenant?.name}</p>
                {currentTenant?.plan === 'TRIAL' && currentTenant?.billing?.trialDaysRemaining && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium">
                    Trial {currentTenant.billing.trialDaysRemaining}일 남음
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-3">
          <nav className="space-y-1">
            {/* AI Chat Menu with expandable sessions */}
            <div>
              <button
                onClick={() => {
                  setActiveView('chat');
                  setIsChatMenuExpanded(!isChatMenuExpanded);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  activeView === 'chat' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">AI 채팅</span>
                </div>
                {isChatMenuExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {/* Chat Sessions Submenu */}
              {isChatMenuExpanded && (
                <div className="mt-1 ml-2 space-y-1">
                  <button
                    onClick={handleNewChat}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    새 대화
                  </button>

                  <div className="max-h-96 overflow-y-auto">
                    {chatSessions.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => {
                          setCurrentSessionId(session.id);
                          setActiveView('chat');
                        }}
                        className={`p-2 mb-1 rounded-lg cursor-pointer group hover:bg-gray-50 transition-colors ${
                          currentSessionId === session.id && activeView === 'chat' ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium truncate">{session.title}</h4>
                            <p className="text-xs text-gray-400 mt-0.5">{new Date(session.timestamp).toLocaleDateString('ko-KR')}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSession(session.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Document Search Menu */}
            <button
              onClick={() => setActiveView('search')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeView === 'search' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">문서 검색</span>
            </button>
          </nav>
        </div>

        {/* Usage Stats */}
        <div className="p-3 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase px-3 py-2 mb-2">이용 현황</p>
          <div className="space-y-2">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <stat.icon className={`w-4 h-4 ${stat.colorClass}`} />
                  <span className="text-xs text-gray-600">{stat.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">Member</p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h2 className="text-xl font-semibold">
                  {activeView === 'chat' && 'AI 채팅'}
                  {activeView === 'search' && '문서 검색'}
                </h2>
                <p className="text-sm text-gray-500">
                  {activeView === 'chat' && 'RAG 기반 AI 어시스턴트'}
                  {activeView === 'search' && '벡터 유사도 검색'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {/* Chat View */}
          {activeView === 'chat' && (
            <div className="flex-1 flex flex-col max-w-4xl mx-auto p-6" style={{ height: 'calc(100vh - 100px)' }}>
              {/* Info Banner */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-800">
                      <strong>{currentSession?.title}</strong>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      💡 이전 대화 내용을 기억하며 연속된 질문에 답변합니다
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.sources && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-2">참고 문서:</p>
                          <div className="flex flex-wrap gap-2">
                            {message.sources.map((source, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                              >
                                <FileText className="w-3 h-3 inline mr-1" />
                                {source}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="text-xs opacity-60 mt-2">
                        {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area with Cabinet Selector */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                {/* Cabinet Selector */}
                <div className="flex gap-3 mb-3 pb-3 border-b border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-gray-400" />
                      <select
                        value={selectedProject}
                        onChange={(e) => {
                          setSelectedProject(e.target.value);
                          const newCabinets = cabinets.filter(c => c.projectId === e.target.value);
                          if (newCabinets.length > 0) {
                            setSelectedCabinet(newCabinets[0].id);
                          }
                        }}
                        className="text-sm border-0 focus:outline-none focus:ring-0 bg-transparent font-medium text-gray-700"
                      >
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <span className="text-gray-400">/</span>
                      <select
                        value={selectedCabinet}
                        onChange={(e) => setSelectedCabinet(e.target.value)}
                        className="text-sm border-0 focus:outline-none focus:ring-0 bg-transparent font-medium text-blue-600"
                      >
                        {filteredCabinets.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="질문을 입력하세요..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    전송
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search View */}
          {activeView === 'search' && (
            <div className="max-w-4xl mx-auto p-6">
              {/* Info Banner */}
              <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Search className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-purple-800">
                      <strong>유사도 검색</strong> - {currentCabinet?.name} 캐비닛에서 관련 문서를 찾습니다.
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      💡 벡터 유사도 기반으로 원본 문서 내용을 그대로 보여줍니다 (Retrieval Only)
                    </p>
                  </div>
                </div>
              </div>

              {/* Search Input with Cabinet Selector */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                {/* Cabinet Selector */}
                <div className="flex gap-3 mb-3 pb-3 border-b border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-gray-400" />
                      <select
                        value={selectedProject}
                        onChange={(e) => {
                          setSelectedProject(e.target.value);
                          const newCabinets = cabinets.filter(c => c.projectId === e.target.value);
                          if (newCabinets.length > 0) {
                            setSelectedCabinet(newCabinets[0].id);
                          }
                        }}
                        className="text-sm border-0 focus:outline-none focus:ring-0 bg-transparent font-medium text-gray-700"
                      >
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <span className="text-gray-400">/</span>
                      <select
                        value={selectedCabinet}
                        onChange={(e) => setSelectedCabinet(e.target.value)}
                        className="text-sm border-0 focus:outline-none focus:ring-0 bg-transparent font-medium text-purple-600"
                      >
                        {filteredCabinets.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Search Input */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="문서에서 검색..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    검색
                  </button>
                </div>
              </div>

              {/* Search Results */}
              <div className="space-y-4">
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <div key={result.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{result.title}</h3>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {(result.score * 100).toFixed(0)}% 일치
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{result.content}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FileText className="w-4 h-4" />
                        <span>{result.document}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">검색어를 입력하여 문서를 찾아보세요</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
