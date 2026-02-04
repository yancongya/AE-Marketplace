import { 
  Star, GitFork, Download, ExternalLink, Copy, 
  Terminal, Heart, Share2, Check,
  FileCode, BookOpen, Package
} from 'lucide-react';
import type { AEScript } from '@/types';
import { useState } from 'react';

interface ScriptDetailProps {
  script: AEScript;
  onBack: () => void;
}

export function ScriptDetail({ script, onBack }: ScriptDetailProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'readme' | 'install' | 'download'>('readme');

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const installCommand = `npx ae-scripts add ${script.author}/${script.name.toLowerCase()}`;

  return (
    <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-mono">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-green-400">$</span> pwd: ~ / {script.category} /
          </button>
          <span className="text-blue-400">{script.name.toLowerCase().replace(/-/g, '_')}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="terminal-window">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-blue-400">{script.name.toLowerCase().replace(/-/g, '_')}</h1>
                    <p className="mt-2 text-gray-400 text-sm leading-relaxed">
                      <span className="code-comment">// {script.description}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <Heart className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <Share2 className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <button className="px-4 py-2 rounded-lg bg-white text-black font-medium text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors">
                  <Terminal className="w-4 h-4" />
                  在 After Effects 中运行
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-yellow" />
                <span className="terminal-dot terminal-dot-green" />
                <span className="ml-2 text-xs text-gray-500 font-mono">$ git log --oneline --stat</span>
              </div>
              <div className="p-4 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-mono">
                    <span className="text-yellow-500">stars:</span>
                    <span className="text-white ml-1">{formatNumber(script.stars)}</span>
                  </span>
                </div>
                {script.forks && (
                  <div className="flex items-center gap-2">
                    <GitFork className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-mono">
                      <span className="text-blue-400">forks:</span>
                      <span className="text-white ml-1">{formatNumber(script.forks)}</span>
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-mono">
                    <span className="text-green-400">downloads:</span>
                    <span className="text-white ml-1">{formatNumber(script.downloads)}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-gray-500">
                    <span className="text-green-400">updated:</span>
                    <span className="text-white ml-1">{script.updatedAt}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Content tabs */}
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-yellow" />
                <span className="terminal-dot terminal-dot-green" />
                <span className="ml-2 text-xs text-gray-500 font-mono">SKILL.md</span>
                <span className="ml-auto text-xs text-gray-500 font-mono">readonly</span>
              </div>
              
              {/* Tab buttons */}
              <div className="border-b border-gray-800">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('readme')}
                    className={`px-4 py-3 text-sm font-mono border-b-2 transition-colors ${
                      activeTab === 'readme'
                        ? 'border-blue-400 text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 inline mr-2" />
                    README
                  </button>
                  <button
                    onClick={() => setActiveTab('install')}
                    className={`px-4 py-3 text-sm font-mono border-b-2 transition-colors ${
                      activeTab === 'install'
                        ? 'border-blue-400 text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <Package className="w-4 h-4 inline mr-2" />
                    安装
                  </button>
                  <button
                    onClick={() => setActiveTab('download')}
                    className={`px-4 py-3 text-sm font-mono border-b-2 transition-colors ${
                      activeTab === 'download'
                        ? 'border-blue-400 text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    下载
                  </button>
                </div>
              </div>

              {/* Tab content */}
              <div className="p-6">
                {activeTab === 'readme' && (
                  <div className="space-y-6">
                    {/* Metadata table */}
                    <div className="overflow-hidden rounded-lg border border-gray-800">
                      <table className="w-full text-sm">
                        <tbody>
                          <tr className="border-b border-gray-800">
                            <td className="px-4 py-3 bg-white/5 text-blue-400 font-mono w-32">name</td>
                            <td className="px-4 py-3 text-white font-mono">{script.name.toLowerCase().replace(/-/g, '_')}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 bg-white/5 text-blue-400 font-mono">description</td>
                            <td className="px-4 py-3 text-gray-400">{script.description}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Usage section */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">Usage</h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        Run all {script.name.toLowerCase().replace(/-/g, '_')} operations.
                      </p>
                    </div>

                    {/* Arguments */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Arguments:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                        <li>$ARGUMENTS: Configuration options for the script</li>
                      </ul>
                    </div>

                    {/* Instructions */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Instructions:</h4>
                      <ol className="list-decimal list-inside text-sm text-gray-400 space-y-2">
                        <li>Download and install the script using one of the methods below</li>
                        <li>Restart After Effects</li>
                        <li>Access the script from Window {'>'} Extensions menu</li>
                        <li>Configure settings as needed</li>
                      </ol>
                    </div>

                    {/* Code preview */}
                    {script.code && (
                      <div className="rounded-lg bg-black/50 border border-gray-800 p-4">
                        <pre className="text-xs font-mono text-gray-300 overflow-x-auto">
                          <code>{script.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'install' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-mono text-gray-400">$ install --global</h4>
                      <div className="flex gap-2">
                        <span className="px-3 py-1.5 rounded bg-white/5 text-gray-400 text-xs font-mono">npx</span>
                        <span className="px-3 py-1.5 rounded bg-white/5 text-gray-400 text-xs font-mono">bunx</span>
                        <span className="px-3 py-1.5 rounded bg-white/5 text-gray-400 text-xs font-mono">pnpm</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-black/50 border border-gray-800">
                        <code className="flex-1 text-sm font-mono text-gray-300">{installCommand}</code>
                        <button 
                          onClick={() => handleCopy(installCommand)}
                          className="p-2 rounded hover:bg-white/10 transition-colors"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'download' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-mono text-gray-400">$ download --local</h4>
                      <button className="w-full px-4 py-3 rounded-lg bg-blue-500 text-white font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
                        <Download className="w-4 h-4" />
                        wget script.zip
                      </button>
                      <button className="w-full px-4 py-3 rounded-lg bg-white text-black font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
                        <Terminal className="w-4 h-4" />
                        在 After Effects 中运行
                      </button>
                      <p className="text-xs text-gray-500 font-mono">
                        <span className="text-yellow-500">[HINT]</span> 下载包含完整脚本文件和所有依赖
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Package info */}
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="text-xs text-gray-500 font-mono">package.json</span>
                <div className="ml-auto flex gap-2">
                  <Share2 className="w-3 h-3 text-gray-500" />
                  <Heart className="w-3 h-3 text-gray-500" />
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  {script.authorAvatar && (
                    <img 
                      src={script.authorAvatar} 
                      alt={script.author}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                </div>
                <div className="code-block text-xs space-y-1">
                  <div>
                    <span className="code-string">&quot;author&quot;</span>
                    <span className="text-white">: </span>
                    <span className="code-string">&quot;{script.author}&quot;</span>
                  </div>
                  {script.repository && (
                    <div>
                      <span className="code-string">&quot;repository&quot;</span>
                      <span className="text-white">: </span>
                      <span className="code-string">&quot;{script.repository}&quot;</span>
                    </div>
                  )}
                </div>
                <button className="w-full px-4 py-2 rounded-lg bg-white/5 text-gray-300 text-sm font-mono flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                  $ gh browse
                </button>
              </div>
            </div>

            {/* Related scripts */}
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="text-xs text-gray-500 font-mono">related-imports.ts</span>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 font-mono mb-4">
                  <span className="code-comment">// 相关脚本</span>
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-blue-400 font-mono">import code-reviewer</span>
                    </div>
                    <span className="text-xs text-gray-500">★ 41</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
