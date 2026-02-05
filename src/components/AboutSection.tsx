import { useState } from 'react';
import { Code, FileCode, Settings, Box } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export function AboutSection() {
  const [activeTab, setActiveTab] = useState(0);
  const { translations } = useI18n();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return Code;
      case 'FileCode':
        return FileCode;
      case 'Settings':
        return Settings;
      case 'Box':
        return Box;
      default:
        return Code;
    }
  };

  if (!translations) return null;

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
                  <span className="text-muted-foreground">##</span> {translations.about.leftPanel.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {translations.about.leftPanel.description}
                </p>
              </div>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {translations.about.leftPanel.additional}
              </p>

              <div className="pt-4 border-t border-gray-800">
                <p className="text-sm font-mono">
                  <span className="text-yellow-500">[INFO]</span>
                  <span className="text-muted-foreground"> {translations.about.leftPanel.readyToExplore}</span>
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
                {translations.about.rightPanel.tabs.map((tab, index) => {
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
                  <span className="code-function"> {translations.about.rightPanel.tabs[activeTab].title}</span>
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
                  <span className="code-comment"> * {translations.about.rightPanel.tabs[activeTab].content}</span>
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
