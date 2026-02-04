import { Search, Zap, Github } from 'lucide-react';

export function AboutSection() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* About card */}
          <div className="terminal-window">
            <div className="terminal-header">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">ABOUT.md</span>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  <span className="text-muted-foreground">##</span> 为什么选择 AE Scripts Marketplace？
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  在数以千计的 GitHub 仓库中找到合适的 AE 脚本可能让人不知所措。AE Scripts 
                  Marketplace 通过提供智能搜索、分类筛选和质量指标来解决这个问题，帮助您快速找到所需的脚本。
                </p>
              </div>
              
                <p className="text-sm text-muted-foreground leading-relaxed">
                无论您是动态图形设计师、视频编辑师，还是 AE 爱好者，都能找到适合各种用途的脚本。
                所有脚本采用开放的 JSX/ExtendScript 标准，兼容 After Effects 2024、2025、2026 等版本。
              </p>

              <div className="pt-4 border-t border-gray-800">
                <p className="text-sm font-mono">
                  <span className="text-yellow-500">[INFO]</span>
                  <span className="text-muted-foreground"> 准备好探索最大的 AE 脚本集合了吗？</span>
                </p>
              </div>
            </div>
          </div>

          {/* Features card */}
          <div className="terminal-window">
            <div className="terminal-header">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
              <div className="ml-auto flex gap-4">
                <button className="text-xs text-muted-foreground font-mono flex items-center gap-1 hover:text-blue-400 transition-colors">
                  <Search className="w-3 h-3" />
                  浏览与发现
                </button>
                <button className="text-xs text-muted-foreground font-mono flex items-center gap-1 hover:text-blue-400 transition-colors">
                  <Zap className="w-3 h-3" />
                  快速安装
                </button>
                <button className="text-xs text-muted-foreground font-mono flex items-center gap-1 hover:text-blue-400 transition-colors">
                  <Github className="w-3 h-3" />
                  GitHub
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="code-block text-sm space-y-4">
                <div>
                  <span className="code-keyword">export const</span>
                  <span className="code-function"> 浏览与发现</span>
                  <span className="text-foreground"> = () {'=>'} {'{'}</span>
                </div>
                <div className="pl-4">
                  <span className="code-keyword">return</span>
                  <span className="text-foreground"> (</span>
                </div>
                <div className="pl-8">
                  <span className="code-comment">/**</span>
                </div>
                <div className="pl-8">
                  <span className="code-comment"> * 通过分类、作者和热度智能筛选，搜索 58000+ AE 脚本。</span>
                </div>
                <div className="pl-8">
                  <span className="code-comment"> * 兼容 After Effects 2024、2025、2026 等版本。</span>
                </div>
                <div className="pl-8">
                  <span className="code-comment"> */</span>
                </div>
                <div className="pl-4">
                  <span className="text-foreground">);</span>
                </div>
                <div>
                  <span className="text-foreground">{'}'}</span>
                </div>
              </div>

              {/* Progress bars */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-blue-500 rounded-full" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">75%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-purple-500 rounded-full" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">50%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full w-1/4 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">25%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
