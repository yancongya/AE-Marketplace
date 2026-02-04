import { ChevronLeft, Star } from 'lucide-react';
import type { ReactNode } from 'react';

interface TabContentProps {
  title: string;
  icon?: ReactNode;
  iconSrc?: string;
  iconEmoji?: string;
  subtitle?: string;
  command?: string;
  stars?: number;
  downloads?: number;
  updatedAt?: string;
  content: string;
  onBack: () => void;
}

export function TabContent({ 
  title, 
  icon, 
  iconSrc,
  iconEmoji,
  subtitle, 
  command,
  stars,
  downloads,
  updatedAt,
  content,
  onBack 
}: TabContentProps) {
  return (
    <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-2 text-sm font-mono">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="text-green-400">$</span> cd ..
          </button>
        </div>

        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot terminal-dot-red" />
            <span className="terminal-dot terminal-dot-yellow" />
            <span className="terminal-dot terminal-dot-green" />
            <span className="ml-auto text-xs text-muted-foreground font-mono">readonly</span>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {iconSrc ? (
                  <img src={iconSrc} alt={title} className="w-12 h-12 rounded-full" />
                ) : icon ? (
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    {icon}
                  </div>
                ) : iconEmoji ? (
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                    {iconEmoji}
                  </div>
                ) : null}
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                  {subtitle && (
                    <p className="text-sm text-muted-foreground font-mono">{subtitle}</p>
                  )}
                </div>
              </div>
              <button 
                onClick={onBack}
                className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium flex items-center gap-2 hover:bg-primary/20 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                返回
              </button>
            </div>

            {command && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-black/50 border border-border">
                <span className="text-green-400 font-mono">$</span>
                <code className="text-sm text-foreground font-mono">{command}</code>
              </div>
            )}
          </div>
        </div>

        {(stars || downloads || updatedAt) && (
          <div className="terminal-window">
            <div className="terminal-header">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">git log --oneline --stat</span>
            </div>
            <div className="p-4 flex flex-wrap gap-6">
              {stars && (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-mono">
                    <span className="text-yellow-500">stars:</span>
                    <span className="text-foreground ml-1">{stars.toLocaleString()}</span>
                  </span>
                </div>
              )}
              {downloads && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">
                    <span className="text-green-400">downloads:</span>
                    <span className="text-foreground ml-1">{downloads.toLocaleString()}</span>
                  </span>
                </div>
              )}
              {updatedAt && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-muted-foreground">
                    <span className="text-green-400">updated:</span>
                    <span className="text-foreground ml-1">{updatedAt}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot terminal-dot-red" />
            <span className="terminal-dot terminal-dot-yellow" />
            <span className="terminal-dot terminal-dot-green" />
            <span className="ml-2 text-xs text-muted-foreground font-mono">README.md</span>
          </div>
          <div className="p-6 prose prose-invert max-w-none">
            {content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i} className="text-2xl font-bold text-foreground mt-6 mb-4">{line.slice(2)}</h1>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-xl font-semibold text-foreground mt-5 mb-3">{line.slice(3)}</h2>;
              }
              if (line.startsWith('- ')) {
                return <li key={i} className="text-muted-foreground ml-4">{line.slice(2)}</li>;
              }
              if (line.trim()) {
                return <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>;
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
