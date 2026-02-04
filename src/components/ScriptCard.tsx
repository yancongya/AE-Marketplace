import { Star, Download } from 'lucide-react';
import type { AEScript } from '@/types';

interface ScriptCardProps {
  script: AEScript;
  onClick: () => void;
}

export function ScriptCard({ script, onClick }: ScriptCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div 
      onClick={onClick}
      className="terminal-window card-hover cursor-pointer group"
    >
      <div className="terminal-header">
        <span className="terminal-dot terminal-dot-red" />
        <span className="terminal-dot terminal-dot-yellow" />
        <span className="terminal-dot terminal-dot-green" />
        <span className="ml-auto text-xs text-gray-500 font-mono flex items-center gap-2">
          <Star className="w-3 h-3 text-yellow-500" />
          {formatNumber(script.stars)}
        </span>
      </div>
      
      <div className="p-4 space-y-3">
        {/* Code preview */}
        <div className="code-block text-xs space-y-1">
          <div>
            <span className="code-keyword">export</span>
            <span className="code-function"> {script.name.toLowerCase().replace(/-/g, '_')}</span>
          </div>
          <div className="pl-4">
            <span className="code-keyword">from</span>
            <span className="code-string"> &quot;{script.author}/{script.name.toLowerCase()}&quot;</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
          {script.description}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <div className="flex items-center gap-2">
            {script.authorAvatar && (
              <img 
                src={script.authorAvatar} 
                alt={script.author}
                className="w-5 h-5 rounded-full"
              />
            )}
            <span className="text-xs text-gray-500 font-mono">{script.author}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {formatNumber(script.downloads)}
            </span>
          </div>
        </div>

        {/* Date */}
        <div className="text-xs text-gray-600 font-mono">
          {script.updatedAt}
        </div>
      </div>
    </div>
  );
}
