import { useEffect, useState } from 'react';
import { Code, FileCode, Settings, Box } from 'lucide-react';

interface Tab {
  title: string;
  icon: string;
  content: string;
}

interface LeftPanel {
  title: string;
  description: string;
  additional: string;
}

interface RightPanel {
  tabs: Tab[];
}

interface AboutData {
  leftPanel: LeftPanel;
  rightPanel: RightPanel;
}

export function AboutSection() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetch('/about.json')
      .then(res => res.json())
      .then(data => setAboutData(data))
      .catch(() => {
        setAboutData({
          leftPanel: {
            title: '为什么选择 AE Scripts Marketplace？',
            description: '在数以千计的 GitHub 仓库中找到合适的 AE 脚本可能让人不知所措。AE Scripts Marketplace 通过提供智能搜索、分类筛选和质量指标来解决这个问题，帮助您快速找到所需的脚本。',
            additional: '无论您是动态图形设计师、视频编辑师，还是 AE 爱好者，都能找到适合各种用途的脚本。所有脚本采用开放的 JSX/ExtendScript 标准，兼容 After Effects 2024、2025、2026 等版本。',
          },
          rightPanel: {
            tabs: [
              {
                title: '表达式',
                icon: 'Code',
                content: 'AE 表达式是 JavaScript 代码片段，用于创建动态动画和效果。我们的表达式库包含数百个经过优化的表达式，从简单的关键帧控制到复杂的粒子系统。所有表达式都经过测试，兼容 After Effects 2024+ 版本。'
              },
              {
                title: '脚本',
                icon: 'FileCode',
                content: 'AE 脚本使用 ExtendScript 编写，可以自动化复杂的工作流程。我们的脚本库涵盖动画制作、批量处理、UI 设计等多个领域。每个脚本都提供详细的使用说明和示例，帮助您快速上手。'
              },
              {
                title: '预设',
                icon: 'Settings',
                content: '预设是预先配置好的动画效果和模板，可以直接应用到您的项目中。包含转场、文字动画、特效预设等多种类型。支持 After Effects 2024、2025、2026 等版本，一键导入即可使用。'
              },
              {
                title: '扩展',
                icon: 'Extension',
                content: '扩展是功能完整的 AE 插件，提供全新的工作流程和工具集。从 3D 渲染到音频可视化，从数据驱动动画到 AI 辅助创作，扩展插件让 AE 的能力无限扩展。'
              },
            ],
          },
        });
      });
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return Code;
      case 'FileCode':
        return FileCode;
      case 'Settings':
        return Settings;
      case 'Extension':
        return Box;
      default:
        return Code;
    }
  };

  if (!aboutData) return null;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* About card */}
          <div className="terminal-window card-hover hover:border-primary/50 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            <div className="terminal-header">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">README.md</span>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  <span className="text-muted-foreground">##</span> {aboutData.leftPanel.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {aboutData.leftPanel.description}
                </p>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {aboutData.leftPanel.additional}
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
          <div className="terminal-window card-hover hover:border-primary/50 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="terminal-header">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
              <div className="ml-auto flex gap-2">
                {aboutData.rightPanel.tabs.map((tab, index) => {
                  const Icon = getIcon(tab.icon);
                  const isActive = index === activeTab;
                  return (
                    <button
                      key={tab.title}
                      onClick={() => setActiveTab(index)}
                      className={`text-xs font-mono flex items-center gap-1.5 px-3 py-1.5 rounded transition-all ${
                        isActive 
                          ? 'text-primary' 
                          : 'text-muted-foreground hover:text-blue-400 hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {tab.title}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="p-6">
              <div className="code-block text-sm space-y-4">
                <div>
                  <span className="code-keyword">export const</span>
                  <span className="code-function"> {aboutData.rightPanel.tabs[activeTab].title}</span>
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
                  <span className="code-comment"> * {aboutData.rightPanel.tabs[activeTab].content}</span>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
