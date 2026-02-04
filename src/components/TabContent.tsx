import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';

interface TabContentProps {
  title: string;
  icon?: ReactNode;
  iconSrc?: string;
  iconEmoji?: string;
  subtitle?: string;
  content: string;
  onBack: () => void;
  author?: string;
  updatedAt?: string;
  tags?: string[];
}

const TAG_COLORS = [
  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'bg-green-500/20 text-green-400 border-green-500/30',
  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
];

function getTagColor(index: number): string {
  return TAG_COLORS[index % TAG_COLORS.length];
}

export function TabContent({ 
  title, 
  icon, 
  iconSrc,
  iconEmoji,
  subtitle, 
  content,
  onBack,
  author,
  updatedAt,
  tags
}: TabContentProps) {
  return (
    <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
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

            {(updatedAt || author) && (
              <div className="flex items-center gap-4 p-2 rounded bg-black/30 border border-border">
                {updatedAt && (
                  <span className="text-sm text-muted-foreground font-mono">
                    <span className="text-green-400">$</span> 更新日期: {updatedAt}
                  </span>
                )}
                {author && (
                  <span className="text-sm text-muted-foreground font-mono">
                    <span className="text-green-400">$</span> 作者: {author}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {(tags && tags.length > 0) && (
          <div className="terminal-window">
            <div className="terminal-header">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">标签</span>
            </div>
            <div className="p-4 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={tag}
                  className={`px-3 py-1 rounded-full text-xs font-mono border ${getTagColor(index)}`}
                >
                  {tag}
                </span>
              ))}
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
