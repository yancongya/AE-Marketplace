import { ChevronLeft, ChevronRight as ChevronRightIcon, Code, FileCode } from 'lucide-react';
import { ScriptCard } from './ScriptCard';
import { aeScripts } from '@/data/mockData';
import type { AEScript } from '@/types';
import { TabPanel } from './TabPanel';
import { useState } from 'react';

interface TabGridProps {
  onScriptClick: (script: AEScript) => void;
  category?: string;
  title?: string;
}

export function ExpressionsTab({ onScriptClick, category, title }: TabGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredScripts = aeScripts.filter(script => {
    if (category === 'expressions') {
      return script.category === 'expressions' || script.tags.includes('expressions');
    }
    if (category === 'scripts') {
      return script.category !== 'expressions';
    }
    return true;
  });

  const sortedScripts = [...filteredScripts].sort((a, b) => {
    return b.stars - a.stars;
  });

  const totalPages = Math.ceil(sortedScripts.length / itemsPerPage);
  const paginatedScripts = sortedScripts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  return (
    <TabPanel
      title={title || '浏览 AE 扩展脚本'}
      count={sortedScripts.length}
      icon={category === 'expressions' ? <Code className="w-6 h-6 text-primary" /> : <FileCode className="w-6 h-6 text-primary" />}
      searchPlaceholder={`用 AI 搜索 ${formatNumber(aeScripts.length)} 个脚本...`}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedScripts.map((script) => (
          <ScriptCard
            key={script.id}
            script={script}
            onClick={() => onScriptClick(script)}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-md bg-secondary text-muted-foreground disabled:opacity-30 hover:bg-secondary/80 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 rounded-md text-sm font-mono transition-all ${
              currentPage === page
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md bg-secondary text-muted-foreground disabled:opacity-30 hover:bg-secondary/80 transition-colors"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
        
        <span className="ml-4 text-xs text-muted-foreground font-mono">
          {formatNumber(sortedScripts.length)} 个脚本
        </span>
      </div>
    </TabPanel>
  );
}
