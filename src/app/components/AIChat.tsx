import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Settings, Loader } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface SystemProfile {
  id: string;
  name: string;
  llmModelId: string;
  llmModelName: string;
  embeddingModelId: string;
  embeddingModelName: string;
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [showSettings, setShowSettings] = useState(false);
  const [systemProfiles, setSystemProfiles] = useState<SystemProfile[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 시스템 프로필 목록 가져오기
  useEffect(() => {
    fetchSystemProfiles();
  }, []);

  const fetchSystemProfiles = async () => {
    setIsLoadingProfiles(true);
    try {
      // Mock 데이터 - 실제로는 API 호출
      // const response = await fetch('/api/system-profiles');
      // const profiles = await response.json();

      const mockProfiles: SystemProfile[] = [
        {
          id: 'profile-001',
          name: 'GPT-4 Standard',
          llmModelId: 'llm-001',
          llmModelName: 'GPT-4',
          embeddingModelId: 'emb-001',
          embeddingModelName: 'text-embedding-3-small'
        },
        {
          id: 'profile-002',
          name: 'GPT-3.5 Fast',
          llmModelId: 'llm-002',
          llmModelName: 'GPT-3.5 Turbo',
          embeddingModelId: 'emb-001',
          embeddingModelName: 'text-embedding-3-small'
        },
        {
          id: 'profile-003',
          name: 'Claude Premium',
          llmModelId: 'llm-003',
          llmModelName: 'Claude 3 Sonnet',
          embeddingModelId: 'emb-002',
          embeddingModelName: 'text-embedding-3-large'
        },
      ];

      setSystemProfiles(mockProfiles);
      if (mockProfiles.length > 0) {
        setSelectedProfileId(mockProfiles[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch system profiles:', error);
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !selectedProfileId) return;

    const selectedProfile = systemProfiles.find(p => p.id === selectedProfileId);
    if (!selectedProfile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 실제 API 호출
      // const response = await fetch('/api/chat/completions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     systemProfileId: selectedProfileId,
      //     messages: [...messages, userMessage].map(m => ({
      //       role: m.role,
      //       content: m.content
      //     })),
      //     temperature: temperature
      //   })
      // });
      // const data = await response.json();

      // Mock 응답
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `안녕하세요! ${selectedProfile.llmModelName} 모델을 사용한 응답입니다.\n\n질문: "${userMessage.content}"\n\n현재는 Mock 응답입니다. 실제 환경에서는 선택한 시스템 프로필(${selectedProfile.name})의 LLM 모델이 답변을 생성합니다.\n\nTemperature: ${temperature}`,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (confirm('대화 내역을 모두 삭제하시겠습니까?')) {
      setMessages([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2">AI 채팅</h2>
            <p className="text-gray-600">LLM과 자유롭게 대화하고 프롬프트를 테스트하세요</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              disabled={messages.length === 0}
            >
              <Trash2 className="w-4 h-4" />
              <span>대화 삭제</span>
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                showSettings
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>설정</span>
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold mb-4">채팅 설정</h3>
          {isLoadingProfiles ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시스템 프로필 (LLM 모델)
                </label>
                <select
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {systemProfiles.map(profile => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name} ({profile.llmModelName})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  {systemProfiles.find(p => p.id === selectedProfileId)?.llmModelName} 모델 사용
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature: {temperature.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>정확함 (0)</span>
                  <span>창의적 (2)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chat Container */}
      <div className="bg-white rounded-lg border border-gray-200 flex flex-col" style={{ height: 'calc(100% - 180px)' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">대화를 시작해보세요</h3>
              <p className="text-gray-500 max-w-md">
                선택한 LLM 모델과 자유롭게 대화할 수 있습니다. 프롬프트 테스트나 AI 기능 검증에 활용하세요.
              </p>
            </div>
          ) : (
            <>
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-2xl rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-3">
                    <Loader className="w-5 h-5 text-gray-600 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요... (Shift+Enter로 줄바꿈)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            현재 프로필: <span className="font-medium">{systemProfiles.find(p => p.id === selectedProfileId)?.name}</span>
            {' '}({systemProfiles.find(p => p.id === selectedProfileId)?.llmModelName})
            {' '} | Temperature: <span className="font-medium">{temperature.toFixed(1)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
