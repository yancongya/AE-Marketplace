import { useState, useEffect } from 'react';
import { ChevronRight, Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);

  useEffect(() => {
    fetch('/faq.json')
      .then(res => res.json())
      .then(data => setFaqItems(data))
      .catch(() => {
        setFaqItems([
          {
            question: '什么是 AE Scripts?',
            answer: 'AE Scripts 是用 JavaScript/ExtendScript 编写的自动化工具，可以扩展 After Effects 的功能。'
          },
          {
            question: '如何安装脚本?',
            answer: '将 .jsx 或 .jsxbin 文件复制到 After Effects 的 Scripts 文件夹中，然后通过 File > Scripts 菜单运行。'
          },
          {
            question: '脚本和表达式有什么区别?',
            answer: '脚本可以访问 AE 的完整 API，实现复杂自动化；表达式只能应用于属性的单帧计算。'
          },
          {
            question: '脚本是否收费?',
            answer: '市场上既有免费开源脚本，也有付费商业脚本。'
          },
          {
            question: '如何运行脚本?',
            answer: '通过 After Effects 的 File > Scripts 菜单，或直接将脚本文件拖入 AE 窗口。'
          },
          {
            question: '脚本支持哪些 AE 版本?',
            answer: '大多数脚本支持 AE CC 2018 及以上版本，具体请查看脚本说明。'
          }
        ]);
      });
  }, []);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot terminal-dot-red" />
            <span className="terminal-dot terminal-dot-yellow" />
            <span className="terminal-dot terminal-dot-green" />
            <span className="ml-2 text-xs text-muted-foreground font-mono">FAQ.md</span>
            <span className="ml-auto text-xs text-muted-foreground font-mono">{faqItems.length} questions</span>
          </div>
          <div className="p-6">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              <span className="text-muted-foreground">#</span> 常见问题
            </h2>
              <p className="text-sm text-muted-foreground font-mono">
              关于 AE Scripts、After Effects 和 2025 年 AE 扩展的所有信息
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div 
              key={index}
              className="terminal-window overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-mono">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-blue-400 font-mono text-sm">Q:</span>
                  <span className="text-foreground text-sm">{item.question}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">[+]</span>
                  {openIndex === index ? (
                    <Minus className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-4 pb-4 pl-16">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-sm">
            还有关于 AE Scripts 的问题？
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-3 rounded-lg border border-gray-700 text-muted-foreground font-mono text-sm inline-flex items-center gap-2 hover:bg-secondary transition-colors"
          >
            <span className="text-green-400">$</span> cd ↑ top
            <ChevronRight className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      </div>
    </section>
  );
}
