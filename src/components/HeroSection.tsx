import { useEffect, useRef, useState } from 'react';

interface StatsData {
  expressions: number;
  scripts: number;
  presets: number;
  extensions: number;
}

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    fetch('/stats.json')
      .then(res => res.json())
      .then(data => setStatsData(data))
      .catch(() => {
        setStatsData({
          expressions: 3200,
          scripts: 4500,
          presets: 2800,
          extensions: 2347
        });
      });
  }, []);

  // Typing animation for title
  useEffect(() => {
    const fullText = 'AE Scripts\nMarketplace';
    let index = 0;
    const typingSpeed = 80;

    const typeNextChar = () => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
        setTimeout(typeNextChar, typingSpeed);
      } else {
        setIsTyping(false);
      }
    };

    typeNextChar();
  }, []);

  useEffect(() => {
    if (!statsData) return;

    const total = statsData.expressions + statsData.scripts + statsData.presets + statsData.extensions;

    const duration = 1500;
    const start = 0;
    const end = total;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (end - start) * easeOutQuart);
      
      setAnimatedCount(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [statsData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationProgress = 0;
    let animationId: number;

    // Drag interaction state
    let isDragging = false;
    let draggedPointIndex = -1;
    let dragOffset = { x: 0, y: 0 };
    let pointPositions: { x: number; y: number; originalX: number; originalY: number }[] = [];
    let springAnimationId: number | null = null;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const radarData = [
      { category: '表达式', count: statsData?.expressions || 3200, color: '#8b5cf6' },
      { category: '脚本', count: statsData?.scripts || 4500, color: '#3b82f6' },
      { category: '预设', count: statsData?.presets || 2800, color: '#10b981' },
      { category: '扩展', count: statsData?.extensions || 2347, color: '#f59e0b' }
    ];

    const maxValue = Math.max(...radarData.map(d => d.count));

    const getPointPosition = (index: number, progress: number) => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - 50;
      const numPoints = radarData.length;
      const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
      const value = (radarData[index].count / maxValue) * progress;
      return {
        x: centerX + Math.cos(angle) * radius * value,
        y: centerY + Math.sin(angle) * radius * value
      };
    };

    const drawRadarChart = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - 50;

      ctx.clearRect(0, 0, width, height);

      const numPoints = radarData.length;

      // Draw grid circles
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / 4) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw axes
      radarData.forEach((_, index) => {
        const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
      });

      // Draw polygon using current point positions
      const currentProgress = Math.min(animationProgress, 1);
      
      ctx.beginPath();
      pointPositions.forEach((pos, index) => {
        if (index === 0) {
          ctx.moveTo(pos.x, pos.y);
        } else {
          ctx.lineTo(pos.x, pos.y);
        }
      });
      ctx.closePath();
      
      // Fill with gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(96, 165, 250, 0.25)');
      gradient.addColorStop(1, 'rgba(96, 165, 250, 0.03)');
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Stroke
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw data points
      pointPositions.forEach((pos, index) => {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isDragging && draggedPointIndex === index ? 7 : 5, 0, Math.PI * 2);
        ctx.fillStyle = radarData[index].color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Draw category labels with values next to them
      ctx.font = '11px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      radarData.forEach((item, index) => {
        const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
        
        // Category label and value next to it
        const labelX = centerX + Math.cos(angle) * (radius + 35);
        const labelY = centerY + Math.sin(angle) * (radius + 35);
        
        // Draw label
        ctx.fillStyle = item.color;
        ctx.fillText(item.category, labelX - 15, labelY);
        
        // Draw value next to label
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = 'bold 11px JetBrains Mono';
        ctx.fillText(formatNumber(item.count), labelX + 20, labelY);
      });
    };

    const springBack = () => {
      if (springAnimationId) {
        cancelAnimationFrame(springAnimationId);
      }

      const animateSpring = () => {
        let allBack = true;
        const springStrength = 0.15;
        const damping = 0.8;

        pointPositions.forEach((pos, index) => {
          const dx = pos.originalX - pos.x;
          const dy = pos.originalY - pos.y;
          
          if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
            allBack = false;
            pos.x += dx * springStrength;
            pos.y += dy * springStrength;
          } else {
            pos.x = pos.originalX;
            pos.y = pos.originalY;
          }
        });

        drawRadarChart();

        if (!allBack) {
          springAnimationId = requestAnimationFrame(animateSpring);
        }
      };

      animateSpring();
    };

    const getMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      const mousePos = getMousePos(e);
      
      pointPositions.forEach((pos, index) => {
        const dx = mousePos.x - pos.x;
        const dy = mousePos.y - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 15) {
          isDragging = true;
          draggedPointIndex = index;
          dragOffset.x = dx;
          dragOffset.y = dy;
          canvas.style.cursor = 'grabbing';
        }
      });
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || draggedPointIndex === -1) {
        // Hover effect
        const mousePos = getMousePos(e);
        let hovering = false;
        pointPositions.forEach((pos) => {
          const dx = mousePos.x - pos.x;
          const dy = mousePos.y - pos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 15) {
            hovering = true;
          }
        });
        canvas.style.cursor = hovering ? 'grab' : 'default';
        return;
      }

      const mousePos = getMousePos(e);
      pointPositions[draggedPointIndex].x = mousePos.x - dragOffset.x;
      pointPositions[draggedPointIndex].y = mousePos.y - dragOffset.y;
      drawRadarChart();
    };

    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        draggedPointIndex = -1;
        canvas.style.cursor = 'default';
        springBack();
      }
    };

    // Mouse events
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    // Touch events
    canvas.addEventListener('touchstart', handleMouseDown);
    canvas.addEventListener('touchmove', handleMouseMove);
    canvas.addEventListener('touchend', handleMouseUp);

    const animate = () => {
      animationProgress += 0.02;
      
      // Update point positions during initial animation
      if (animationProgress <= 1) {
        pointPositions = radarData.map((_, index) => {
          const pos = getPointPosition(index, animationProgress);
          return { x: pos.x, y: pos.y, originalX: pos.x, originalY: pos.y };
        });
      }
      
      drawRadarChart();
      
      if (animationProgress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        drawRadarChart();
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationId) cancelAnimationFrame(animationId);
      if (springAnimationId) cancelAnimationFrame(springAnimationId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('touchstart', handleMouseDown);
      canvas.removeEventListener('touchmove', handleMouseMove);
      canvas.removeEventListener('touchend', handleMouseUp);
    };
  }, [statsData]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  return (
    <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-background bg-grid">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left side - Code editor (55%) */}
          <div className="lg:col-span-7 space-y-4">
            {/* File header with window controls */}
            <div className="flex items-center gap-2 px-4 py-2 h-8">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
              <span className="ml-2 text-xs font-mono text-muted-foreground">skills.marketplace</span>
            </div>
            
            <div className="space-y-4 font-mono">
              {/* File comment */}
              <div className="text-code-comment text-sm">// main.ts</div>
              
              {/* Main title with blue prompt */}
              <div className="flex items-start gap-2">
                <span className="text-primary text-[40px] font-bold leading-tight">{'>'}</span>
                <h1 className="text-[40px] font-bold text-foreground leading-tight whitespace-pre font-mono">
                  {typedText}
                  <span 
                    className={`inline-block w-[3px] h-[40px] bg-primary align-middle ml-0.5 ${!isTyping ? 'animate-caret-blink' : ''}`} 
                  />
                </h1>
              </div>
              
              {/* Subtitle */}
              <div className="text-muted-foreground text-base ml-9">
                基于开放的 ExtendScript 生态系统
              </div>

              {/* Stats code block */}
              <div className="rounded-lg p-4 space-y-2 border border-border">
                <div className="text-lg leading-relaxed">
                  <span className="code-keyword">const</span>
                  <span className="code-function"> scripts</span>
                  <span className="text-foreground"> =</span>
                  <span className="code-number text-[28px] font-bold ml-2">{formatNumber(animatedCount)}</span>
                  <span className="text-foreground">;</span>
                </div>
                <div className="text-sm code-comment">
                  <span>{'// 发现来自 GitHub 的 '}</span>
                  <span className="code-function">{animatedCount.toLocaleString()}</span>
                  <span>{' 个开源 AE 脚本'}</span>
                </div>
              </div>

              {/* JSDoc comment block */}
              <div className="p-4 border-l-4 border-accent">
                <div className="text-sm text-accent leading-relaxed">
                  <div>{'/**'}</div>
                  <div>{' * AI 语义搜索或关键字筛选，按分类浏览，按热度排序。'}</div>
                  <div>{' * 所有脚本采用开放的 ExtendScript 标准，一键安装'}</div>
                  <div>{' */'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Radar chart (40%) */}
          <div className="lg:col-span-5">
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-yellow" />
                <span className="terminal-dot terminal-dot-green" />
                <span className="ml-2 text-xs font-mono text-muted-foreground">radar-analysis.tsx</span>
              </div>
              
              <div className="p-4">
                <canvas 
                  ref={canvasRef}
                  className="w-full"
                  style={{ height: '320px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Floating avatar icon */}
        <div className="fixed right-8 bottom-8 z-40">
          <div 
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg"
          >
            <span className="text-black text-base font-bold">AI</span>
          </div>
        </div>
      </div>
    </section>
  );
}
