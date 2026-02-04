import { useState } from 'react';
import { Code, Key, Terminal, AlertCircle, ChevronRight, Copy, Check } from 'lucide-react';

export function APISection() {
  const [copied, setCopied] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateApiKey = () => {
    setHasApiKey(true);
  };

  const apiKey = 'aes_mp_live_51H8m...8x2L';

  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/scripts',
      description: '获取所有脚本列表',
      params: ['page', 'limit', 'sort', 'category']
    },
    {
      method: 'GET',
      path: '/api/v1/scripts/:id',
      description: '获取单个脚本详情',
      params: ['id']
    },
    {
      method: 'GET',
      path: '/api/v1/search',
      description: '搜索脚本',
      params: ['q', 'type']
    },
    {
      method: 'GET',
      path: '/api/v1/categories',
      description: '获取所有分类',
      params: []
    }
  ];

  return (
    <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot terminal-dot-red" />
            <span className="terminal-dot terminal-dot-yellow" />
            <span className="terminal-dot terminal-dot-green" />
            <span className="ml-auto text-xs text-blue-400 font-mono flex items-center gap-1">
              <ChevronRight className="w-3 h-3" />
              REST API
            </span>
          </div>
          <div className="p-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              <span className="text-purple-400">#</span> API Documentation
            </h1>
            <p className="text-gray-400">
              通过 REST API 以编程方式访问 AE Scripts Marketplace 数据，支持关键字搜索和 AI 语义搜索。
            </p>
          </div>
        </div>

        {/* Table of contents */}
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot terminal-dot-green" />
            <span className="ml-2 text-xs text-gray-500 font-mono">table_of_contents.md</span>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-3">
              <button className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Key className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-sm text-gray-300">1. 认证</span>
              </button>
              <button className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Code className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm text-gray-300">2. 端点</span>
              </button>
              <button className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-sm text-gray-300">3. 代码示例</span>
              </button>
              <button className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                </div>
                <span className="text-sm text-gray-300">4. 错误处理</span>
              </button>
            </div>
          </div>
        </div>

        {/* Authentication */}
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot terminal-dot-green" />
            <span className="ml-2 text-xs text-gray-500 font-mono">认证</span>
          </div>
          <div className="p-6">
            {!hasApiKey ? (
              <div className="text-center py-8">
                <Key className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">您还没有 API Key。</p>
                <button 
                  onClick={generateApiKey}
                  className="px-6 py-3 rounded-lg bg-blue-500 text-white font-medium flex items-center gap-2 mx-auto hover:bg-blue-600 transition-colors"
                >
                  <Key className="w-4 h-4" />
                  生成 API Key
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-400">您的 API Key：</p>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-black/50 border border-gray-800">
                  <code className="flex-1 text-sm font-mono text-green-400">{apiKey}</code>
                  <button 
                    onClick={() => handleCopy(apiKey)}
                    className="p-2 rounded hover:bg-white/10 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  请在请求头中添加：Authorization: Bearer {'{'}your_api_key{'}'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Endpoints */}
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot terminal-dot-blue" />
            <span className="ml-2 text-xs text-gray-500 font-mono">端点</span>
          </div>
          <div className="divide-y divide-gray-800">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-mono ${
                    endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                    endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                    endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono text-white">{endpoint.path}</code>
                </div>
                <p className="text-sm text-gray-400 mb-2">{endpoint.description}</p>
                {endpoint.params.length > 0 && (
                  <div className="flex gap-2">
                    {endpoint.params.map((param, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-white/5 text-xs text-gray-500 font-mono">
                        {param}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Code example */}
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot terminal-dot-purple" />
            <span className="ml-2 text-xs text-gray-500 font-mono">代码示例</span>
          </div>
          <div className="p-6">
            <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
              <code>{`// 使用 fetch 获取脚本列表
const response = await fetch(
  'https://api.aescripts.com/v1/scripts?page=1&limit=10',
  {
    headers: {
      'Authorization': 'Bearer your_api_key',
      'Content-Type': 'application/json'
    }
  }
);

const data = await response.json();
console.log(data.scripts);`}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
