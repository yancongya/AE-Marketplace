import { useEffect, useRef, useState } from 'react';

interface StatsData {
  expressions: number;
  scripts: number;
  presets: number;
  extensions: number;
}

interface HeroData {
  title: string;
  subtitle: string;
  stats: {
    label: string;
    comment: string;
    suffix: string;
  };
  description: {
    line1: string;
    line2: string;
  };
  fileHeader: string;
  fileComment: string;
}

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [heroData, setHeroData] = useState<HeroData | null>(null);

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
      if (!heroData) return;
  
      const fullText = heroData.title;
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
    }, [heroData]);

  useEffect(() => {
    if (!statsData) return;
    if (!heroData) return;

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
    fetch('/hero.json')
      .then(res => res.json())
      .then(data => setHeroData(data))
      .catch(() => {
        setHeroData({
          title: 'AE Scripts Marketplace',
          subtitle: '基于开放的 ExtendScript 生态系统',
          stats: {
            label: 'scripts',
            comment: '发现来自 GitHub 的',
            suffix: '个开源 AE 脚本'
          },
          description: {
            line1: 'AI 语义搜索或关键字筛选，按分类浏览，按热度排序。',
            line2: '所有脚本采用开放的 ExtendScript 标准，一键安装'
          },
          fileHeader: 'skills.marketplace',
          fileComment: '// main.ts'
        });
      });
  }, []);

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

    // Theme change listener to redraw chart
    const handleThemeChange = () => {
      if (pointPositions.length > 0) {
        drawRadarChart();
      }
    };

    // Watch for theme changes
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

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
      
      // Check if canvas is visible and has valid dimensions
      if (width === 0 || height === 0) return;
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Better theme detection - check if light class is present
      const isDarkMode = !document.documentElement.classList.contains('light');
      
      // Adjust margin for mobile - more aggressive for small screens
      const isMobile = width < 640;
      const margin = isMobile ? 40 : 50;
      const radius = Math.max(0, Math.min(width, height) / 2 - margin);

      ctx.clearRect(0, 0, width, height);

      const numPoints = radarData.length;

      // Theme-aware colors
      const gridColor = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';
      const axisColor = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)';
      const polygonFill = isDarkMode ? 'rgba(96, 165, 250, 0.25)' : 'rgba(59, 130, 246, 0.2)';
      const polygonFillEnd = isDarkMode ? 'rgba(96, 165, 250, 0.03)' : 'rgba(59, 130, 246, 0.05)';
      const polygonStroke = isDarkMode ? '#60a5fa' : '#3b82f6';
      const textColor = isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)';
      const mutedTextColor = isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
      const pointStroke = isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';

      // Draw grid circles
      ctx.strokeStyle = gridColor;
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

        ctx.strokeStyle = axisColor;
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
      gradient.addColorStop(0, polygonFill);
      gradient.addColorStop(1, polygonFillEnd);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Stroke
      ctx.strokeStyle = polygonStroke;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw data points
      pointPositions.forEach((pos, index) => {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isDragging && draggedPointIndex === index ? 7 : 5, 0, Math.PI * 2);
        ctx.fillStyle = radarData[index].color;
        ctx.fill();
        ctx.strokeStyle = pointStroke;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Draw category labels with values next to them
      const fontSize = isMobile ? 9 : 11;
      const labelOffset = isMobile ? 30 : 35;
      const valueOffset = isMobile ? 12 : 15;
      
      ctx.font = `${fontSize}px JetBrains Mono`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      radarData.forEach((item, index) => {
        const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
        
        // Category label and value next to it
        const labelX = centerX + Math.cos(angle) * (radius + labelOffset);
        const labelY = centerY + Math.sin(angle) * (radius + labelOffset);
        
        // Draw label
        ctx.fillStyle = item.color;
        ctx.fillText(item.category, labelX - valueOffset, labelY);
        
        // Draw value next to label
        ctx.fillStyle = textColor;
        ctx.font = `bold ${fontSize}px JetBrains Mono`;
        ctx.fillText(formatNumber(item.count), labelX + valueOffset, labelY);
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

    // Touch events with passive option
    canvas.addEventListener('touchstart', handleMouseDown, { passive: true });
    canvas.addEventListener('touchmove', handleMouseMove, { passive: true });
    canvas.addEventListener('touchend', handleMouseUp, { passive: true });

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
      observer.disconnect();
      if (animationId) cancelAnimationFrame(animationId);
      if (springAnimationId) cancelAnimationFrame(springAnimationId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('touchstart', handleMouseDown, { passive: true } as any);
      canvas.removeEventListener('touchmove', handleMouseMove, { passive: true } as any);
      canvas.removeEventListener('touchend', handleMouseUp, { passive: true } as any);
    };
  }, [statsData]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  if (!heroData) {
    const data = {
      title: 'AE Scripts Marketplace',
      subtitle: '基于开放的 ExtendScript 生态系统',
      stats: {
        label: 'scripts',
        comment: '发现来自 GitHub 的',
        suffix: '个开源 AE 脚本'
      },
      description: {
        line1: 'AI 语义搜索或关键字筛选，按分类浏览，按热度排序。',
        line2: '所有脚本采用开放的 ExtendScript 标准，一键安装'
      },
      fileHeader: 'skills.marketplace',
      fileComment: '// main.ts'
    };
    setHeroData(data);
  }



  return (
    <section className="relative min-h-screen px-4 sm:px-6 lg:px-8 bg-background bg-grid flex flex-col lg:flex-row">
      {/* Navbar spacer */}
      <div className="h-12 flex-shrink-0" />
      
      <div className="flex-1 max-w-7xl mx-auto w-full py-8 sm:py-12 flex items-center">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full">
          {/* Left side - Code editor */}
          <div className="col-span-12 lg:col-span-7 space-y-4 w-full lg:w-auto">
{/* File header with window controls - centered on mobile */}
            <div className="flex items-center gap-2 px-4 py-2 h-8 w-full justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0ms' }}>
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
              <span className="ml-2 text-xs font-mono text-muted-foreground">{heroData?.fileHeader || 'skills.marketplace'}</span>
            </div>
            
            <div className="space-y-4 font-mono w-full max-w-2xl mx-auto lg:mx-0 lg:max-w-none">
              {/* File comment */}
              <div className="text-code-comment text-xs sm:text-sm text-center lg:text-left animate-fade-in-up" style={{ animationDelay: '100ms' }}>{heroData?.fileComment || '// main.ts'}</div>
              
              {/* Main title with blue prompt - centered on mobile */}
              <div className="flex items-start gap-2 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <span className="text-primary text-3xl sm:text-4xl md:text-[40px] font-bold leading-tight">{'>'}</span>
                <h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold text-foreground leading-tight whitespace-pre font-mono">
                  {typedText}
                  <span 
                    className={`inline-block w-[3px] h-8 sm:h-10 md:h-[40px] bg-primary align-middle ml-0.5 ${!isTyping ? 'animate-caret-blink' : ''}`} 
                  />
                </h1>
              </div>
              
              {/* Subtitle - centered on mobile */}
              <div className="text-muted-foreground text-sm sm:text-base text-center lg:text-left animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                {heroData?.subtitle || '基于开放的 ExtendScript 生态系统'}
              </div>

              {/* Stats code block */}
              <div className="rounded-lg p-3 sm:p-4 space-y-2 border border-border card-hover hover:border-primary/50 cursor-default animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <div className="text-base sm:text-lg leading-relaxed">
                  <span className="code-keyword">const</span>
                  <span className="code-function"> {heroData?.stats?.label || 'scripts'}</span>
                  <span className="text-foreground"> =</span>
                  <span className="code-number text-xl sm:text-2xl md:text-[28px] font-bold ml-2">{formatNumber(animatedCount)}</span>
                  <span className="text-foreground">;</span>
                </div>
                <div className="text-xs sm:text-sm code-comment">
                  <span>{'// '}{heroData?.stats?.comment || '发现来自 GitHub 的'}{animatedCount.toLocaleString()}{heroData?.stats?.suffix || '个开源 AE 脚本'}</span>
                </div>
              </div>

              {/* JSDoc comment block */}
              <div className="p-3 sm:p-4 border-l-4 border-accent card-hover hover:border-primary hover:bg-accent/5 cursor-default animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <div className="text-xs sm:text-sm text-accent leading-relaxed">
                  <div>{'/**'}</div>
                  <div>{' * '}{heroData?.description?.line1 || 'AI 语义搜索或关键字筛选，按分类浏览，按热度排序。'}</div>
                  <div>{' * '}{heroData?.description?.line2 || '所有脚本采用开放的 ExtendScript 标准，一键安装'}</div>
                  <div>{' */'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Radar chart - hidden on mobile */}
          <div className="hidden lg:block lg:col-span-5 animate-scale-in" style={{ animationDelay: '600ms' }}>
            <div className="terminal-window card-hover hover:border-primary/50">
              <div className="terminal-header">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-yellow" />
                <span className="terminal-dot terminal-dot-green" />
                <span className="ml-2 text-xs font-mono text-muted-foreground">radar-analysis.tsx</span>
              </div>
              
              <div className="p-3 sm:p-4">
                <canvas 
                  ref={canvasRef}
                  className="w-full"
                  style={{ height: 'auto', aspectRatio: '4/3' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      </section>
  );
}
