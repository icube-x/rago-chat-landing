import { useState, useEffect } from 'react';
import { Key, Plus, Trash2, Eye, EyeOff, RefreshCw, Info, X, Database } from 'lucide-react';

interface SystemSecret {
  id: number;
  provider: string;
  secretKey: string;      // 환경변수 이름 (예: OPENAI_API_KEY)
  secretValue: string;    // 실제 비밀 값 (예: sk-proj-abc123...)
  usageScope: string;
  env: string;
  isActive: boolean;
  rotatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface VectorDBConfig {
  id: string;
  vectorStore: string;
  host: string;
  port: number;
  apiKey: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RedisConfig {
  id: string;
  host: string;
  port: number;
  password: string;
  database: number;
  isCluster: boolean;
  createdAt: string;
  updatedAt: string;
}

export function SystemSettings() {
  // Vector DB Configuration
  const [vectorDBConfig, setVectorDBConfig] = useState<VectorDBConfig>({
    id: 'vdb-1',
    vectorStore: 'qdrant',
    host: 'localhost',
    port: 6333,
    apiKey: 'qdrant-1234567890-abcdefghijklmnop',
    isActive: true,
    createdAt: '2025-12-01 10:00',
    updatedAt: '2026-01-15 00:00'
  });

  const [showVectorDBModal, setShowVectorDBModal] = useState(false);
  const [vectorDBSaved, setVectorDBSaved] = useState(false);

  // Redis Configuration
  const [redisConfig, setRedisConfig] = useState<RedisConfig>({
    id: 'redis-1',
    host: 'localhost',
    port: 6379,
    password: 'redis_password_1234',
    database: 0,
    isCluster: false,
    createdAt: '2025-12-01 10:00',
    updatedAt: '2026-01-15 00:00'
  });

  const [showRedisModal, setShowRedisModal] = useState(false);
  const [redisSaved, setRedisSaved] = useState(false);
  const [showRedisPassword, setShowRedisPassword] = useState(false);

  const [secrets, setSecrets] = useState<SystemSecret[]>([
    {
      id: 1,
      provider: 'openai',
      secretKey: 'OPENAI_API_KEY',
      secretValue: 'sk-proj-1234567890abcdefghijklmnopqrstuvwxyz',
      usageScope: 'embedding',
      env: 'prod',
      isActive: true,
      rotatedAt: '2026-01-01 00:00',
      createdAt: '2025-12-01 10:00',
      updatedAt: '2026-01-01 00:00'
    },
    {
      id: 2,
      provider: 'openai',
      secretKey: 'OPENAI_CHAT_KEY',
      secretValue: 'sk-proj-abcdefghijklmnopqrstuvwxyz1234567890',
      usageScope: 'chat',
      env: 'prod',
      isActive: true,
      rotatedAt: null,
      createdAt: '2025-12-01 10:00',
      updatedAt: '2025-12-01 10:00'
    },
    {
      id: 3,
      provider: 'qdrant',
      secretKey: 'QDRANT_API_KEY',
      secretValue: 'qdrant-1234567890-abcdefghijklmnop',
      usageScope: 'vector_store',
      env: 'prod',
      isActive: true,
      rotatedAt: '2026-01-15 00:00',
      createdAt: '2025-12-01 10:00',
      updatedAt: '2026-01-15 00:00'
    },
    {
      id: 4,
      provider: 'slack',
      secretKey: 'SLACK_WEBHOOK_URL',
      secretValue: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX',
      usageScope: 'notification',
      env: 'prod',
      isActive: true,
      rotatedAt: null,
      createdAt: '2025-12-01 10:00',
      updatedAt: '2025-12-01 10:00'
    },
    {
      id: 5,
      provider: 'openai',
      secretKey: 'OPENAI_API_KEY_DEV',
      secretValue: 'sk-proj-devkey1234567890abcdefghijklmnopqr',
      usageScope: 'embedding',
      env: 'dev',
      isActive: true,
      rotatedAt: null,
      createdAt: '2025-12-10 10:00',
      updatedAt: '2025-12-10 10:00'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState<string>('prod');
  const [visibleSecrets, setVisibleSecrets] = useState<Set<number>>(new Set());
  const [showModalSecretValue, setShowModalSecretValue] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRotateModal, setShowRotateModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [rotatingSecret, setRotatingSecret] = useState<SystemSecret | null>(null);
  const [newSecretValue, setNewSecretValue] = useState('');
  const [showRotateSecretValue, setShowRotateSecretValue] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingSecretId, setPendingSecretId] = useState<number | null>(null);
  const [password, setPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState<Record<number, number>>({});
  const [newSecret, setNewSecret] = useState({
    provider: 'openai',
    secretKey: '',
    secretValue: '',
    usageScope: '',
    env: 'prod'
  });

  // 타이머 관리
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const updated = { ...prev };
        let hasChanges = false;

        Object.keys(updated).forEach((key) => {
          const id = parseInt(key);
          if (updated[id] > 0) {
            updated[id] = updated[id] - 1;
            hasChanges = true;
            
            // 시간이 0이 되면 마스킹
            if (updated[id] === 0) {
              setVisibleSecrets((prevVisible) => {
                const newVisible = new Set(prevVisible);
                newVisible.delete(id);
                return newVisible;
              });
              delete updated[id];
            }
          }
        });

        return hasChanges ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePasswordSubmit = () => {
    // 암호 체크는 하지 않음 - 입력만 하면 통과
    if (password.trim() !== '' && pendingSecretId !== null) {
      // 마스킹 해제
      setVisibleSecrets((prev) => {
        const newVisible = new Set(prev);
        newVisible.add(pendingSecretId);
        return newVisible;
      });

      // 20초 타이머 시작
      setTimeLeft((prev) => ({
        ...prev,
        [pendingSecretId]: 20
      }));

      // 모달 닫기
      setShowPasswordModal(false);
      setPendingSecretId(null);
      setPassword('');
    }
  };

  const toggleSecretVisibility = (id: number) => {
    const isVisible = visibleSecrets.has(id);
    
    if (isVisible) {
      // 이미 보이는 경우 - 즉시 마스킹
      const newVisible = new Set(visibleSecrets);
      newVisible.delete(id);
      setVisibleSecrets(newVisible);
      
      // 타이머 제거
      setTimeLeft((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } else {
      // 마스킹 상태인 경우 - 암호 확인 모달 표시
      setPendingSecretId(id);
      setShowPasswordModal(true);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('정말 이 비밀키를 삭제하시겠습니까?')) {
      setSecrets(secrets.filter(s => s.id !== id));
    }
  };

  const filteredSecrets = secrets.filter(s => s.env === selectedEnv);

  const getProviderBadge = (provider: string) => {
    const colors: Record<string, string> = {
      openai: 'bg-green-100 text-green-700',
      qdrant: 'bg-purple-100 text-purple-700',
      slack: 'bg-pink-100 text-pink-700',
      aws: 'bg-orange-100 text-orange-700'
    };
    
    return (
      <span className={`px-2 py-1 ${colors[provider] || 'bg-gray-100 text-gray-700'} rounded text-xs font-medium`}>
        {provider}
      </span>
    );
  };

  const getEnvBadge = (env: string) => {
    const colors: Record<string, string> = {
      prod: 'bg-red-100 text-red-700',
      beta: 'bg-yellow-100 text-yellow-700',
      dev: 'bg-blue-100 text-blue-700',
      local: 'bg-gray-100 text-gray-700'
    };
    
    return (
      <span className={`px-2 py-1 ${colors[env] || 'bg-gray-100 text-gray-700'} rounded text-xs font-medium uppercase`}>
        {env}
      </span>
    );
  };

  // 비밀키 추가 확인 처리
  const handleAddClick = () => {
    setShowAddModal(false);
    setShowConfirmModal(true);
  };

  const handleConfirmAdd = () => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const newId = Math.max(...secrets.map(s => s.id)) + 1;
    
    setSecrets([...secrets, {
      id: newId,
      provider: newSecret.provider,
      secretKey: newSecret.secretKey,
      secretValue: newSecret.secretValue,
      usageScope: newSecret.usageScope,
      env: newSecret.env,
      isActive: true,
      rotatedAt: null,
      createdAt: now,
      updatedAt: now
    }]);

    setShowConfirmModal(false);
    setNewSecret({
      provider: 'openai',
      secretKey: '',
      secretValue: '',
      usageScope: '',
      env: 'prod'
    });
    setShowModalSecretValue(false);
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setShowConfirmModal(false);
    setNewSecret({
      provider: 'openai',
      secretKey: '',
      secretValue: '',
      usageScope: '',
      env: 'prod'
    });
    setShowModalSecretValue(false);
  };

  // 비밀키 교체 처리
  const handleRotateClick = (secret: SystemSecret) => {
    setRotatingSecret(secret);
    setShowRotateModal(true);
  };

  const handleConfirmRotate = () => {
    if (rotatingSecret) {
      const updatedSecrets = secrets.map(s => {
        if (s.id === rotatingSecret.id) {
          return {
            ...s,
            secretValue: newSecretValue,
            rotatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
            updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
          };
        }
        return s;
      });
      setSecrets(updatedSecrets);
      setShowRotateModal(false);
      setRotatingSecret(null);
      setNewSecretValue('');
      setShowRotateSecretValue(false);
    }
  };

  const handleCancelRotate = () => {
    setShowRotateModal(false);
    setRotatingSecret(null);
    setNewSecretValue('');
    setShowRotateSecretValue(false);
  };

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-semibold">시스템 설정</h2>
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
              title="시스템 설정 안내"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600">API 키 및 시스템 비밀키를 관리합니다</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          비밀키 추가
        </button>
      </div>

      {/* Environment Selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">환경:</span>
          <div className="flex gap-2">
            {['prod', 'beta', 'dev', 'local'].map((env) => (
              <button
                key={env}
                onClick={() => setSelectedEnv(env)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedEnv === env
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {env.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">총 비밀키</p>
              <p className="text-2xl font-semibold">{filteredSecrets.length}</p>
            </div>
            <Key className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">활성화</p>
              <p className="text-2xl font-semibold text-green-600">
                {filteredSecrets.filter(s => s.isActive).length}
              </p>
            </div>
            <Key className="w-10 h-10 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">비활성화</p>
              <p className="text-2xl font-semibold text-gray-600">
                {filteredSecrets.filter(s => !s.isActive).length}
              </p>
            </div>
            <Key className="w-10 h-10 text-gray-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">최근 교체</p>
              <p className="text-2xl font-semibold text-blue-600">
                {filteredSecrets.filter(s => s.rotatedAt).length}
              </p>
            </div>
            <RefreshCw className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Vector Database Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-lg">벡터 데이터베이스 설정</h3>
          </div>
          <button
            onClick={() => setShowVectorDBModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Database className="w-4 h-4" />
            설정 변경
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Vector Store</p>
              <p className="font-medium text-gray-900">{vectorDBConfig.vectorStore}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Host</p>
              <p className="font-medium text-gray-900">{vectorDBConfig.host}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Port</p>
              <p className="font-medium text-gray-900">{vectorDBConfig.port}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">마지막 업데이트</p>
              <p className="font-medium text-gray-900">{vectorDBConfig.updatedAt}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-blue-600">
              ℹ️ 이 설정은 모든 프로젝트와 캐비닛에서 공통으로 사용됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Redis Configuration */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-lg">Redis 설정</h3>
          </div>
          <button
            onClick={() => setShowRedisModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Database className="w-4 h-4" />
            설정 변경
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Host</p>
              <p className="font-medium text-gray-900">{redisConfig.host}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Port</p>
              <p className="font-medium text-gray-900">{redisConfig.port}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Password</p>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono text-gray-700">
                  {showRedisPassword ? redisConfig.password : '••••••••••••••••••••'}
                </code>
                <button
                  type="button"
                  onClick={() => setShowRedisPassword(!showRedisPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showRedisPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Database</p>
              <p className="font-medium text-gray-900">{redisConfig.database}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">클러스터 모드</p>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                redisConfig.isCluster 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${redisConfig.isCluster ? 'bg-purple-500' : 'bg-gray-400'}`} />
                {redisConfig.isCluster ? 'Cluster' : 'Standalone'}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">마지막 업데이트</p>
              <p className="font-medium text-gray-900">{redisConfig.updatedAt}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-blue-600">
              ℹ️ 이 설정은 모든 프로젝트와 캐비닛에서 공통으로 사용됩니다.
            </p>
          </div>
        </div>
      </div>

      {/* Secrets Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Provider</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Secret Key</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Secret Value</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Usage Scope</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">환경</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">상태</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">최근 교체</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSecrets.map((secret) => (
                <tr key={secret.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {getProviderBadge(secret.provider)}
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm font-mono text-gray-700">
                      {secret.secretKey}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-gray-700">
                        {visibleSecrets.has(secret.id) 
                          ? secret.secretValue
                          : '••••••••••••••••••••••••••••••••'}
                      </code>
                      <button
                        onClick={() => toggleSecretVisibility(secret.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {visibleSecrets.has(secret.id) ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      {visibleSecrets.has(secret.id) && timeLeft[secret.id] && (
                        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                          {timeLeft[secret.id]}초
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{secret.usageScope}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getEnvBadge(secret.env)}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      secret.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${secret.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {secret.isActive ? '활성' : '비활성'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {secret.rotatedAt || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleRotateClick(secret)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="교체"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(secret.id)}
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
              <h3 className="font-semibold text-lg">비밀키 추가</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provider
                </label>
                <select 
                  value={newSecret.provider}
                  onChange={(e) => setNewSecret({...newSecret, provider: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="openai">OpenAI</option>
                  <option value="qdrant">Qdrant</option>
                  <option value="pinecone">Pinecone</option>
                  <option value="slack">Slack</option>
                  <option value="aws">AWS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secret Name
                </label>
                <input
                  type="text"
                  value={newSecret.secretKey}
                  onChange={(e) => setNewSecret({...newSecret, secretKey: e.target.value})}
                  placeholder="예: OPENAI_API_KEY"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secret Value
                </label>
                <div className="relative">
                  <input
                    type={showModalSecretValue ? "text" : "password"}
                    value={newSecret.secretValue}
                    onChange={(e) => setNewSecret({...newSecret, secretValue: e.target.value})}
                    placeholder="예: sk-proj-1234567890abcdefghijklmnopqrstuvwxyz"
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowModalSecretValue(!showModalSecretValue)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showModalSecretValue ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usage Scope
                </label>
                <input
                  type="text"
                  value={newSecret.usageScope}
                  onChange={(e) => setNewSecret({...newSecret, usageScope: e.target.value})}
                  placeholder="예: embedding, chat, admin"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  환경
                </label>
                <select 
                  value={newSecret.env}
                  onChange={(e) => setNewSecret({...newSecret, env: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="prod">Production</option>
                  <option value="beta">Beta</option>
                  <option value="dev">Development</option>
                  <option value="local">Local</option>
                </select>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-900">
                  <strong>보안 주의:</strong> 실제 비밀키 값은 안전한 비밀 관리 시스템(AWS Secrets Manager, Vault 등)에 저장하고, 
                  여기서는 참조만 관리합니다.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleAddClick}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                추가
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
              <h3 className="font-semibold text-lg text-gray-900">비밀키 추가 확인</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-700 mb-4">
                다음 비밀키를 추가하시겠습니까?
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider:</span>
                  <span className="font-medium text-gray-900">{newSecret.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Secret Name:</span>
                  <span className="font-mono text-gray-900">{newSecret.secretKey}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Secret Value:</span>
                  <span className="font-mono text-gray-900">{'•'.repeat(32)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Usage Scope:</span>
                  <span className="font-medium text-gray-900">{newSecret.usageScope}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">환경:</span>
                  {getEnvBadge(newSecret.env)}
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

      {/* Rotate Modal */}
      {showRotateModal && rotatingSecret && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-lg text-gray-900">비밀키 교체 확인</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-700 mb-4">
                다음 비밀키를 교체하시겠습니까?
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider:</span>
                  <span className="font-medium text-gray-900">{rotatingSecret.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Secret Name:</span>
                  <span className="font-mono text-gray-900">{rotatingSecret.secretKey}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Secret Value:</span>
                  <div className="relative">
                    <input
                      type={showRotateSecretValue ? "text" : "password"}
                      value={newSecretValue}
                      onChange={(e) => setNewSecretValue(e.target.value)}
                      placeholder="예: sk-proj-1234567890abcdefghijklmnopqrstuvwxyz"
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRotateSecretValue(!showRotateSecretValue)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showRotateSecretValue ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Usage Scope:</span>
                  <span className="font-medium text-gray-900">{rotatingSecret.usageScope}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">환경:</span>
                  {getEnvBadge(rotatingSecret.env)}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleConfirmRotate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                확인
              </button>
              <button
                onClick={handleCancelRotate}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
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
                <h3 className="font-semibold text-xl">🔐 시스템 설정 안내</h3>
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
                <h4 className="font-semibold text-lg mb-3 text-blue-600">🎯 핵심 목적: 보안 자격 증명 관리</h4>
                <p className="text-gray-700 leading-relaxed">
                  이 화면은 <strong>RAG 시스템이 외부 서비스와 통신하기 위한 API 키와 비밀키를 관리</strong>하기 위한 것입니다. 
                  OpenAI, Vector DB, 알림 서비스 등 모든 외부 연동에 필요한 자격 증명을 
                  <strong>안전하고 체계적으로</strong> 관리합니다.
                </p>
              </div>

              {/* 주요 기능 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-purple-600">🔧 주요 기능</h4>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h5 className="font-semibold text-blue-900 mb-2">1. 환경별 비밀키 관리</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>PROD</strong>: 프로덕션 환경용 실제 운영 키</li>
                      <li>• <strong>BETA</strong>: 베타 테스트용 검증 키</li>
                      <li>• <strong>DEV</strong>: 개발 환경용 테스트 키</li>
                      <li>• <strong>LOCAL</strong>: 로컬 개발용 임시 키</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h5 className="font-semibold text-green-900 mb-2">2. 비밀키 추가 및 교체</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Provider별로 API 키 등록 (OpenAI, Qdrant, Slack 등)</li>
                      <li>• Secret Name(환경변수명)과 Secret Value(실제 값) 분리 관리</li>
                      <li>• Usage Scope로 용도 명시 (embedding, chat, vector_store 등)</li>
                      <li>• 비밀키 교체 시 이력 자동 기록 (Rotated At)</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h5 className="font-semibold text-purple-900 mb-2">3. 보안 기능</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>비밀키 마스킹</strong>: 기본적으로 모든 비밀키 값이 마스킹(••••••)으로 표시</li>
                      <li>• <strong>마스킹 해제</strong>: 👁️ 아이콘 클릭 → 비밀번호 입력 → 20초간 실제 값 표시</li>
                      <li>• <strong>자동 재마스킹</strong>: 20초 후 자동으로 마스킹 복원 (남은 시간 표시)</li>
                      <li>• <strong>수동 마스킹</strong>: 🙈 아이콘 클릭 시 즉시 마스킹 및 타이머 취소</li>
                      <li>• <strong>활성화/비활성화</strong>: 즉시 사용 제어</li>
                      <li>• <strong>교체 이력 추적</strong>: 비밀키 교체 시 자동으로 날짜 기록</li>
                      <li>• <strong>삭제 확인 절차</strong>: 실수로 삭제 방지</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <h5 className="font-semibold text-orange-900 mb-2">4. 통계 대시보드</h5>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• 환경별 총 비밀키 개수</li>
                      <li>• 활성화/비활성화 비밀키 현황</li>
                      <li>• 최근 교체된 비밀키 개수</li>
                      <li>• 환경별 필터링으로 명확한 관리</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 비밀키 구조 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-green-600">📋 비밀키 구조</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-semibold text-blue-600">Provider</span>
                      <p className="text-gray-700 mt-1">
                        API 제공자: OpenAI, Qdrant, Pinecone, Slack, AWS 등
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-green-600">Secret Name</span>
                      <p className="text-gray-700 mt-1">
                        환경 변수 이름 (예: OPENAI_API_KEY, QDRANT_API_KEY)
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-purple-600">Secret Value</span>
                      <p className="text-gray-700 mt-1">
                        실제 비밀키 값 (예: sk-proj-1234..., qdrant-5678...)
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-orange-600">Usage Scope</span>
                      <p className="text-gray-700 mt-1">
                        사용 범위: embedding (임베딩용), chat (챗봇용), vector_store (벡터 DB용), notification (알림용)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 마스킹 해제 방법 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-indigo-600">👁️ 비밀키 마스킹 해제 방법</h4>
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    비밀키 값을 확인하려면 <strong>👁️ 아이콘 클릭</strong> → <strong>비밀번호 인증</strong>을 거쳐야 합니다. 
                    인증 후 비밀키가 <strong>20초간 표시</strong>되며, 남은 시간이 실시간으로 카운트다운됩니다. 
                    20초 경과 시 자동으로 마스킹되며, 🙈 아이콘을 클릭하면 즉시 마스킹할 수 있습니다.
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-indigo-100">
                    <p className="text-sm text-gray-700">
                      <strong>보안 정책:</strong> 비밀키 확인은 반드시 비밀번호 인증이 필요하며, 
                      일정 시간 후 자동으로 마스킹되어 보안을 강화합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 실무 활용 시나리오 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-orange-600">💡 실무 활용 시나리오</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 1: API 키 교체 (보안 강화)</h5>
                    <p className="text-sm text-gray-700">
                      OpenAI API 키 유출 의심 → 교체 버튼 클릭 → 새 키 입력 → 교체 완료 → 이력 자동 기록
                    </p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 2: 환경별 키 분리 관리</h5>
                    <p className="text-sm text-gray-700">
                      PROD 환경에는 유료 키 등록 + DEV 환경에는 무료/테스트 키 등록 → 비용 최적화
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 3: 새 서비스 연동</h5>
                    <p className="text-sm text-gray-700">
                      Pinecone 추가 도입 → "비밀키 추가" 버튼 → Provider=Pinecone, Usage=vector_store → 즉시 사용 가능
                    </p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4 py-2">
                    <h5 className="font-semibold text-gray-900 mb-1">시나리오 4: 장애 대응</h5>
                    <p className="text-sm text-gray-700">
                      API 호출 오류 발생 → 해당 키 비활성화 → 백업 키로 전환 → 문제 해결 후 재활성화
                    </p>
                  </div>
                </div>
              </div>

              {/* 보안 베스트 프랙티스 */}
              <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                <h4 className="font-semibold text-red-900 mb-2">🔒 보안 베스트 프랙티스</h4>
                <ul className="text-sm text-red-800 leading-relaxed space-y-1">
                  <li>• <strong>실제 운영 환경</strong>에서는 AWS Secrets Manager, HashiCorp Vault 등 전문 비밀 관리 시스템 사용 필수</li>
                  <li>• <strong>정기적인 키 교체</strong>: 3~6개월마다 비밀키 교체 권장</li>
                  <li>• <strong>최소 권한 원칙</strong>: 각 키는 필요한 최소한의 권한만 부여</li>
                  <li>• <strong>환경 분리</strong>: PROD와 DEV 환경의 키는 절대 혼용 금지</li>
                  <li>• <strong>접근 제한</strong>: 시스템 관리자만 이 화면에 접근하도록 권한 설정</li>
                </ul>
              </div>

              {/* 워크플로우 */}
              <div>
                <h4 className="font-semibold text-lg mb-3 text-purple-600">🔄 비밀키 관리 워크플로우</h4>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span className="text-gray-700">외부 서비스 가입 및 API 키 발급 (OpenAI, Qdrant 등)</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <span className="text-gray-700 font-semibold">➡️ 이 화면: "비밀키 추가" 버튼 클릭</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      <span className="text-gray-700 font-semibold">➡️ 이 화면: Provider, Secret Name, Value, Usage, 환경 입력</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                      <span className="text-gray-700 font-semibold">➡ 이 화면: 비밀키 추가 확인 및 완료</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                      <span className="text-gray-700">모델 관리, 캐비닛 설정 등에서 자동으로 해당 키 사용</span>
                    </div>
                    <div className="ml-3 border-l-2 border-gray-300 h-4"></div>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">6</span>
                      <span className="text-gray-700">정기적으로 교체 버튼으로 키 갱신 (보안 강화)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 요약 */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">📌 요약</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  이 화면은 RAG 시스템의 <strong>모든 외부 연동 자격 증명을 중앙 집중식으로 관리</strong>하는 핵심 보안 화면입니다. 
                  환경별로 분리하여 안전하게 관리하고, 정기적인 교체와 이력 추적을 통해 <strong>보안 위협을 최소화</strong>합니다.
                  <br />
                  실제 운영 환경에서는 반드시 전문 비밀 관리 시스템(AWS Secrets Manager, Vault 등)과 연동하여 사용하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-lg text-gray-900">비밀키 확인</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-700 mb-4">
                비밀키를 확인하려면 비밀번호를 입력하세요.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">비밀번호:</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호 입력"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                확인
              </button>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vector DB Configuration Modal */}
      {showVectorDBModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-xl">벡터 데이터베이스 설정</h3>
                </div>
                <button
                  onClick={() => setShowVectorDBModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-900">
                  ℹ️ <strong>시스템 전역 설정:</strong> 이 설정은 모든 프로젝트와 캐비닛에 공통으로 적용됩니다.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vector Store *
                </label>
                <select 
                  value={vectorDBConfig.vectorStore}
                  onChange={(e) => setVectorDBConfig({...vectorDBConfig, vectorStore: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="qdrant">Qdrant</option>
                  <option value="pinecone">Pinecone</option>
                  <option value="chroma">Chroma</option>
                  <option value="weaviate">Weaviate</option>
                  <option value="milvus">Milvus</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">벡터 임베딩을 저장할 데이터베이스</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Host *
                </label>
                <input
                  type="text"
                  value={vectorDBConfig.host}
                  onChange={(e) => setVectorDBConfig({...vectorDBConfig, host: e.target.value})}
                  placeholder="예: localhost, 192.168.1.100, vector-db.example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-sm text-gray-500 mt-1">벡터 데이터베이스 호스트 주소</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Port *
                </label>
                <input
                  type="number"
                  value={vectorDBConfig.port}
                  onChange={(e) => setVectorDBConfig({...vectorDBConfig, port: parseInt(e.target.value)})}
                  placeholder="예: 6333"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-sm text-gray-500 mt-1">벡터 데이터베이스 포트 번호</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={vectorDBConfig.apiKey}
                  onChange={(e) => setVectorDBConfig({...vectorDBConfig, apiKey: e.target.value})}
                  placeholder="예: qdrant-1234567890-abcdefghijklmnop"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-sm text-gray-500 mt-1">벡터 데이터베이스 인증 키 (선택사항)</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-900">
                  <strong>⚠️ 주의:</strong> 벡터 데이터베이스 설정을 변경하면 모든 캐비닛에 영향을 미칩니다. 
                  변경 전 충분한 테스트를 권장합니다.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setVectorDBConfig({
                    ...vectorDBConfig,
                    updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
                  });
                  setVectorDBSaved(true);
                  setShowVectorDBModal(false);
                  setTimeout(() => setVectorDBSaved(false), 2000);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                저장
              </button>
              <button
                onClick={() => setShowVectorDBModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Redis Configuration Modal */}
      {showRedisModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-xl">Redis 설정</h3>
                </div>
                <button
                  onClick={() => setShowRedisModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-900">
                  ℹ️ <strong>시스템 전역 설정:</strong> 이 설정은 모든 프로젝트와 캐비닛에 공통으로 적용됩니다.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Host *
                </label>
                <input
                  type="text"
                  value={redisConfig.host}
                  onChange={(e) => setRedisConfig({...redisConfig, host: e.target.value})}
                  placeholder="예: localhost, 192.168.1.100, redis.example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-sm text-gray-500 mt-1">Redis 호스트 주소</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Port *
                </label>
                <input
                  type="number"
                  value={redisConfig.port}
                  onChange={(e) => setRedisConfig({...redisConfig, port: parseInt(e.target.value)})}
                  placeholder="예: 6379"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-sm text-gray-500 mt-1">Redis 포트 번호</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showRedisPassword ? "text" : "password"}
                    value={redisConfig.password}
                    onChange={(e) => setRedisConfig({...redisConfig, password: e.target.value})}
                    placeholder="예: redis_password_1234"
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRedisPassword(!showRedisPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showRedisPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">Redis 인증 비밀번호 (선택사항)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Database
                </label>
                <input
                  type="number"
                  value={redisConfig.database}
                  onChange={(e) => setRedisConfig({...redisConfig, database: parseInt(e.target.value)})}
                  placeholder="예: 0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={redisConfig.isCluster}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {redisConfig.isCluster 
                    ? '클러스터 모드에서는 Database 선택이 지원되지 않습니다' 
                    : '사용할 Redis 데이터베이스 번호 (0-15)'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  클러스터 모드
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setRedisConfig({...redisConfig, isCluster: false, database: 0})}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      !redisConfig.isCluster
                        ? 'border-green-600 bg-green-50 text-green-900'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${!redisConfig.isCluster ? 'bg-green-600' : 'bg-gray-400'}`} />
                      <span className="font-medium">Standalone</span>
                    </div>
                    <p className="text-xs mt-1">단일 인스턴스</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRedisConfig({...redisConfig, isCluster: true, database: 0})}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                      redisConfig.isCluster
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${redisConfig.isCluster ? 'bg-purple-600' : 'bg-gray-400'}`} />
                      <span className="font-medium">Cluster</span>
                    </div>
                    <p className="text-xs mt-1">클러스터 모드</p>
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {redisConfig.isCluster 
                    ? '📌 클러스터 모드: 고가용성 및 수평 확장을 위한 분산 Redis 구성' 
                    : '📌 Standalone: 단일 Redis 인스턴스로 운영'}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-900">
                  <strong>⚠️ 주의:</strong> Redis 설정을 변경하면 모든 캐비닛에 영향을 미칩니다. 
                  변경 전 충분한 테스트를 권장합니다.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setRedisConfig({
                    ...redisConfig,
                    updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
                  });
                  setRedisSaved(true);
                  setShowRedisModal(false);
                  setTimeout(() => setRedisSaved(false), 2000);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                저장
              </button>
              <button
                onClick={() => setShowRedisModal(false)}
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