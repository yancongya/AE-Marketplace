import { ChevronLeft, Copy, Check, ExternalLink, List, X, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import mermaid from 'mermaid';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'inherit',
  flowchart: { curve: 'basis' },
  sequence: { actorMargin: 50 },
});

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
  filename?: string;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '');
}

function extractHeadings(content: string): Heading[] {
  const lines = content.split('\n');
  const headings: Heading[] = [];
  let counter = 0;

  lines.forEach((line) => {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = slugify(text) || `heading-${counter++}`;
      headings.push({ id, text, level });
    }
  });

  return headings;
}

function MermaidDiagram({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [scale, setScale] = useState(1);
  const { isDark } = useTheme();
  const [id] = useState(() => `mermaid-${Math.random().toString(36).slice(2, 9)}`);
  const wheelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mermaidTheme = isDark ? 'dark' : 'default';

  useEffect(() => {
    mermaid.initialize({ theme: mermaidTheme });
  }, [mermaidTheme]);

  useEffect(() => {
    if (!code || !containerRef.current) return;
    let isMounted = true;

    const renderDiagram = async () => {
      try {
        const trimmedCode = code.trim();
        if (!trimmedCode) return;
        mermaid.initialize({ theme: mermaidTheme });
        const { svg: svgContent } = await mermaid.render(id, trimmedCode);
        if (isMounted) {
          setSvg(svgContent);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      }
    };

    renderDiagram();
    return () => { isMounted = false; };
  }, [code, id, mermaidTheme]);

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.1, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.1, 0.1));
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      toast.success('代码已复制到剪贴板');
    } catch {
      toast.error('复制失败');
    }
  }, [code]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!isExpanded) return;
    e.preventDefault();
    
    if (wheelTimeoutRef.current) {
      clearTimeout(wheelTimeoutRef.current);
    }

    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    const newScale = Math.max(0.1, Math.min(3, scale + delta));
    setScale(newScale);

    wheelTimeoutRef.current = setTimeout(() => {
      wheelTimeoutRef.current = null;
    }, 50);
  }, [isExpanded, scale]);

  if (error) {
    return (
      <div className="mermaid-error rounded-lg border border-red-500/30 bg-red-500/10 p-4 my-4">
        <p className="text-red-400 text-sm mb-2">渲染失败</p>
        <pre className="text-xs text-red-300/70 overflow-x-auto">{code}</pre>
      </div>
    );
  }

  return (
    <>
      <div className="relative group my-4">
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <button 
            onClick={handleCopy}
            className="p-1.5 rounded bg-primary/20 hover:bg-primary/40" 
            title="复制代码"
          >
            <Copy className="w-4 h-4 text-muted-foreground" />
          </button>
          <button 
            onClick={() => setIsExpanded(true)}
            className="p-1.5 rounded bg-primary/20 hover:bg-primary/40" 
            title="全屏查看"
          >
            <Maximize className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div ref={containerRef} className="mermaid-content flex justify-center p-4 bg-muted/30 rounded-lg overflow-hidden">
          {svg ? <div className="mermaid-svg" dangerouslySetInnerHTML={{ __html: svg }} /> : <span className="text-muted-foreground">加载中...</span>}
        </div>
      </div>

      <Dialog.Root open={isExpanded} onOpenChange={setIsExpanded}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/90 z-[100]" />
          <Dialog.Content className="fixed inset-0 z-[100] flex flex-col bg-background" aria-describedby={undefined}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shrink-0">
              <span className="text-sm font-medium text-foreground">Mermaid 图表 - 全屏模式</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleZoomOut}
                  className="p-2 rounded hover:bg-secondary transition-colors"
                  title="缩小"
                >
                  <ZoomOut className="w-4 h-4 text-muted-foreground" />
                </button>
                <span className="text-sm text-muted-foreground font-mono min-w-[3.5rem] text-center">{Math.round(scale * 100)}%</span>
                <button 
                  onClick={handleZoomIn}
                  className="p-2 rounded hover:bg-secondary transition-colors"
                  title="放大"
                >
                  <ZoomIn className="w-4 h-4 text-muted-foreground" />
                </button>
                <button 
                  onClick={handleReset}
                  className="px-2 py-1 rounded hover:bg-secondary transition-colors text-xs"
                  title="重置"
                >
                  重置
                </button>
                <div className="w-px h-6 bg-border mx-2" />
                <button 
                  onClick={handleCopy}
                  className="p-2 rounded hover:bg-secondary transition-colors"
                  title="复制代码"
                >
                  <Copy className="w-4 h-4 text-muted-foreground" />
                </button>
                <Dialog.Close className="p-2 rounded hover:bg-secondary transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </Dialog.Close>
              </div>
            </div>
            <div 
              className="flex-1 flex justify-center items-center overflow-auto p-8"
              onWheel={handleWheel}
            >
              <div 
                className="transition-transform duration-75 origin-center"
                style={{ transform: `scale(${scale})` }}
              >
                {svg ? <div className="mermaid-svg" dangerouslySetInnerHTML={{ __html: svg }} /> : <span className="text-muted-foreground">加载中...</span>}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const { isDark } = useTheme();
  const childrenArray = Array.isArray(children) ? children : [children];
  const codeChild = childrenArray.find((c: React.ReactElement) => 
    c?.type === 'code' || (c?.props?.children && typeof c.props.children === 'string')
  );
  const codeElement = codeChild?.props?.children;
  const className = codeChild?.props?.className || '';
  const isMermaid = className.includes('mermaid');
  
  if (isMermaid && typeof codeElement === 'string') {
    return <MermaidDiagram code={codeElement.trim()} />;
  }

  const codeString = typeof codeElement === 'string' ? codeElement : '';
  const language = className.replace('language-', '') || 'code';

  const handleCopy = async () => {
    if (!codeString) return;
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      toast.success('代码已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('复制失败');
    }
  };

  return (
    <div className="relative group my-4 rounded-lg border border-border w-full">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <span className="text-xs text-muted-foreground font-mono">{language}</span>
        <button 
          onClick={handleCopy} 
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-secondary/50 transition-colors" 
          title="复制代码"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
        </button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={isDark ? vscDarkPlus : vs}
          showLineNumbers
          customStyle={{
            margin: 0,
            borderRadius: '0 0 0.5rem 0.5rem',
            fontSize: '0.875rem',
            lineHeight: '1.625rem',
          }}
          lineNumberStyle={{
            fontSize: '0.75rem',
            paddingRight: '1rem',
            textAlign: 'right',
            color: 'rgba(156, 163, 175, 0.5)',
          }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    </div>
  );
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

function TableOfContents({ headings }: { headings: Heading[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveId(id);
    }
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const scrollPosition = window.scrollY + 120;

        for (let i = headings.length - 1; i >= 0; i--) {
          const heading = headings[i];
          const element = document.getElementById(heading.id);
          if (element) {
            const elementTop = element.offsetTop;
            if (scrollPosition >= elementTop) {
              setActiveId(heading.id);
              break;
            }
          }
        }
      }, 10);
    };

    const updateActiveHeading = () => {
      if (headings.length > 0) {
        const firstVisible = headings.find(h => {
          const el = document.getElementById(h.id);
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          return rect.top >= 0 && rect.top < window.innerHeight;
        });
        if (firstVisible) {
          setActiveId(firstVisible.id);
        } else if (!activeId) {
          setActiveId(headings[0].id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const timeoutId = setTimeout(updateActiveHeading, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      clearTimeout(timeoutId);
    };
  }, [headings, activeId]);

  if (headings.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="xl:hidden fixed bottom-4 right-4 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg"
        title="目录"
      >
        <List className="w-5 h-5" />
      </button>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40 xl:hidden" />
          <Dialog.Content className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl p-4 xl:hidden max-h-[60vh] overflow-auto" aria-describedby={undefined}>
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="font-medium">目录</Dialog.Title>
              <Dialog.Close className="p-1 rounded hover:bg-secondary">
                <X className="w-5 h-5 text-muted-foreground" />
              </Dialog.Close>
            </div>
            <nav className="space-y-1">
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className={`block w-full text-left px-3 py-2 rounded text-sm transition-all ${
                    activeId === heading.id
                      ? 'bg-primary/20 text-primary font-bold'
                      : heading.level === 1
                        ? 'text-foreground/90'
                        : heading.level === 2
                          ? 'text-muted-foreground/70 pl-6'
                          : 'text-muted-foreground/50 pl-10'
                  } hover:bg-secondary/50`}
                >
                  {heading.text}
                </button>
              ))}
            </nav>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="hidden xl:block w-64 flex-shrink-0 sticky top-6 h-fit max-h-[calc(100vh-6rem)] overflow-hidden">
        <div className="terminal-window h-full flex flex-col">
          <div className="terminal-header flex-shrink-0">
            <span className="terminal-dot terminal-dot-red" />
            <span className="terminal-dot terminal-dot-yellow" />
            <span className="terminal-dot terminal-dot-green" />
            <span className="ml-2 text-xs text-muted-foreground font-mono">目录</span>
          </div>
          <ScrollArea.Root className="flex-1 overflow-hidden">
            <ScrollArea.Viewport className="w-full h-full p-4">
              <nav className="space-y-1 pr-2">
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    onClick={() => scrollToHeading(heading.id)}
                    className={`block w-full text-left px-3 py-1.5 rounded text-sm transition-all truncate ${
                      activeId === heading.id 
                        ? 'bg-primary/20 text-primary font-bold' 
                        : heading.level === 1 
                          ? 'text-foreground/90 hover:bg-secondary/50' 
                          : heading.level === 2 
                            ? 'text-muted-foreground/70 pl-6 hover:bg-secondary/50' 
                            : 'text-muted-foreground/50 pl-10 hover:bg-secondary/50'
                    }`}
                    title={heading.text}
                  >
                    {heading.text}
                  </button>
                ))}
              </nav>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical" className="flex select-none touch-none p-0.5 bg-black/20 w-2">
              <ScrollArea.Thumb className="flex-1 bg-white/20 rounded-[10px] relative" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </div>
      </div>
    </>
  );
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
  tags,
  filename
}: TabContentProps) {
  const headings = useMemo(() => extractHeadings(content), [content]);

  return (
    <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col xl:flex-row gap-6">
          <div className={`${headings.length > 0 ? 'xl:flex-[3]' : 'flex-1'} min-w-0 space-y-6 w-full`}>
            <div className="flex items-center gap-2 text-sm font-mono">
              <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <span className="text-success">$</span> cd ..
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
                    {iconSrc ? <img src={iconSrc} alt={title} className="w-12 h-12 rounded-full" /> : 
                     icon ? <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">{icon}</div> :
                     iconEmoji ? <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">{iconEmoji}</div> : null}
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                      {subtitle && <p className="text-sm text-muted-foreground font-mono">{subtitle}</p>}
                    </div>
                  </div>
                  <button onClick={onBack} className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium flex items-center gap-2 hover:bg-primary/20 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> 返回
                  </button>
                </div>
                {(updatedAt || author) && (
                  <div className="flex items-center gap-4 p-2 rounded bg-muted/30 border border-border">
                    {updatedAt && <span className="text-sm text-muted-foreground font-mono"><span className="text-success">$</span> 更新日期: {updatedAt}</span>}
                    {author && <span className="text-sm text-muted-foreground font-mono"><span className="text-success">$</span> 作者: {author}</span>}
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
                    <span key={tag} className={`px-3 py-1 rounded-full text-xs font-mono border ${getTagColor(index)}`}>{tag}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="terminal-window">
              <div className="terminal-header">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-yellow" />
                <span className="terminal-dot terminal-dot-green" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">{filename || 'README.md'}</span>
              </div>
              <div className="p-6">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => {
                      const id = slugify(String(children));
                      return <h1 id={id} className="text-2xl font-bold text-foreground mt-6 mb-4">{children}</h1>;
                    },
                    h2: ({ children }) => {
                      const id = slugify(String(children));
                      return <h2 id={id} className="text-xl font-semibold text-foreground mt-5 mb-3">{children}</h2>;
                    },
                    h3: ({ children }) => {
                      const id = slugify(String(children));
                      return <h3 id={id} className="text-lg font-semibold text-foreground mt-4 mb-2">{children}</h3>;
                    },
                    ul: ({ children }) => <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside text-muted-foreground ml-4 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
                    p: ({ children }) => <p className="text-muted-foreground leading-relaxed">{children}</p>,
                    a: ({ href, children }) => (
                      <a href={href} className="text-primary hover:underline inline-flex items-center gap-1" target="_blank" rel="noopener noreferrer">
                        {children}<ExternalLink className="w-3 h-3" />
                      </a>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-4 text-muted-foreground italic">{children}</blockquote>
                    ),
                    code: ({ className, children }) => {
                      const isInline = !className;
                      if (isInline) return <code className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-sm">{children}</code>;
                      return <code className={className}>{children}</code>;
                    },
                    pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4 rounded-lg border border-border">
                        <table className="w-full border-collapse">{children}</table>
                      </div>
                    ),
                    th: ({ children }) => <th className="border-b border-border px-4 py-3 text-left font-semibold bg-muted/30">{children}</th>,
                    td: ({ children }) => <td className="border-t border-border/50 px-4 py-3 text-muted-foreground">{children}</td>,
                    hr: () => <hr className="border-border my-6" />,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <TableOfContents headings={headings} />
          </div>
        </div>
      </div>
    </section>
  );
}
