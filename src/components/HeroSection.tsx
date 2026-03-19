import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';
import { loadContent } from '@/lib/content';

export interface StatsData {
  expressions: number;
  scripts: number;
  presets: number;
  extensions: number;
}

interface HeroSectionProps {
  statsData?: StatsData | null;
}

export function HeroSection({ statsData: externalStatsData }: HeroSectionProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const { translations } = useI18n();
  const navigate = useNavigate();
  const isInitialized = useRef(false);
  const hasMounted = useRef(false);

  // 使用外部传入的 statsData 或者自己加载（用于独立使用）
  useEffect(() => {
    if (externalStatsData) {
      setStatsData(externalStatsData);
    } else {
      loadContent().then(data => {
        setStatsData({
          expressions: data.expressions.length,
          scripts: data.scripts.length,
          presets: data.presets.length,
          extensions: data.extensions.length,
        });
      });
    }

    // 获取最新的 commit 时间
    fetch('https://api.github.com/repos/yancongya/AE-Marketplace/commits?per_page=1')
      .then(res => res.json())
      .then(data => {
        if (data && data[0] && data[0].commit) {
          const commitDate = data[0].commit.committer.date;
          const relativeTime = formatRelativeTime(commitDate);
          setLastUpdate(relativeTime);
        }
      })
      .catch(err => {
        console.error('Failed to fetch last update:', err);
      });
  }, [externalStatsData]);

  // Typing animation for title
  useEffect(() => {
      if (!translations) return;
  
      const fullText = translations.hero.title;
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
    }, [translations]);

  useEffect(() => {
    if (!statsData) return;
    if (!translations) return;

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
    if (!statsData || !translations) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 确保在数据准备好后才初始化
    if (!hasMounted.current) {
      // 首次初始化，设置 canvas 尺寸
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    let animationProgress = 0;
    let animationId: number;

    // Drag interaction state
    let isDragging = false;
    let draggedPointIndex = -1;
    let dragOffset = { x: 0, y: 0 };
    let pointPositions: { x: number; y: number; originalX: number; originalY: number }[] = [];
    let springAnimationId: number | null = null;

    const resize = () => {
      // 如果正在动画中，不执行 resize
      if (animationProgress < 1) return;

      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      // resize 后立即重绘
      if (hasMounted.current && pointPositions.length > 0) {
        drawRadarChart();
      }
    };

    // 只在首次初始化时调用 resize
    if (!hasMounted.current) {
      resize();
    }
    window.addEventListener('resize', resize);

    // Theme change listener to redraw chart
    const handleThemeChange = () => {
      if (pointPositions.length > 0) {
        // 获取当前尺寸并重绘
        const size = getCanvasSize();
        drawRadarChart(size);
      }
    };

    // Watch for theme changes
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    const radarData = [
      { category: translations!.radar.categories.expressions, count: statsData?.expressions || 3200, color: '#8b5cf6' },
      { category: translations!.radar.categories.scripts, count: statsData?.scripts || 4500, color: '#3b82f6' },
      { category: translations!.radar.categories.presets, count: statsData?.presets || 2800, color: '#10b981' },
      { category: translations!.radar.categories.extensions, count: statsData?.extensions || 2347, color: '#f59e0b' }
    ];

    const maxValue = Math.max(...radarData.map(d => d.count));

    // 缓存 canvas 尺寸，避免在动画过程中重复计算
    let cachedSize: { width: number; height: number } | null = null;

    const getCanvasSize = () => {
      const size = {
        width: canvas.offsetWidth,
        height: canvas.offsetHeight
      };
      return size;
    };

    const getPointPosition = (index: number, progress: number, size: { width: number; height: number }) => {
      const { width, height } = size;
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

    const drawRadarChart = (size?: { width: number; height: number }) => {
      const { width, height } = size || getCanvasSize();

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

        pointPositions.forEach((pos) => {
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
        canvas.style.cursor = 'default';

        // 定义路由映射
        const routePaths = ['/expressions', '/scripts', '/presets', '/extensions'];

        // 如果拖拽了某个点，跳转到对应页面
        if (draggedPointIndex >= 0 && draggedPointIndex < routePaths.length) {
          const targetPath = routePaths[draggedPointIndex];
          navigate(targetPath);
        }

        draggedPointIndex = -1;
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
        // 首次获取并缓存尺寸
        if (!cachedSize) {
          cachedSize = getCanvasSize();
        }
        pointPositions = radarData.map((_, index) => {
          const pos = getPointPosition(index, animationProgress, cachedSize!);
          return { x: pos.x, y: pos.y, originalX: pos.x, originalY: pos.y };
        });
        // 使用缓存的尺寸绘制
        drawRadarChart(cachedSize);
      } else {
        // 动画结束后，清除缓存
        cachedSize = null;
        drawRadarChart();
      }

      if (animationProgress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        cachedSize = null;
        drawRadarChart();
        isInitialized.current = true;
      }
    };

    // 只在首次挂载时播放动画
    if (!hasMounted.current) {
      hasMounted.current = true;
      animate();
    } else {
      // 后续重新渲染时，直接绘制静态图表
      animationProgress = 1;
      pointPositions = radarData.map((_, index) => {
        const pos = getPointPosition(index, 1, cachedSize!);
        return { x: pos.x, y: pos.y, originalX: pos.x, originalY: pos.y };
      });
      drawRadarChart();
    }

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
      // 组件卸载时重置状态，允许重新挂载时播放动画
      hasMounted.current = false;
      isInitialized.current = false;
    };
  }, [statsData, translations, navigate]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);
    const months = Math.floor(diffInSeconds / 2592000);
    const years = Math.floor(diffInSeconds / 31536000);

    const locale = localStorage.getItem('locale') || 'zh';

    if (years > 0) {
      return locale === 'zh' ? `${years} 年前` : `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (months > 0) {
      return locale === 'zh' ? `${months} 个月前` : `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
      return locale === 'zh' ? `${days} 天前` : `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return locale === 'zh' ? `${hours} 小时前` : `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return locale === 'zh' ? `${minutes} 分钟前` : `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return locale === 'zh' ? '刚刚' : 'just now';
    }
  };

  if (!translations) return null;

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
              <span className="ml-2 text-xs font-mono text-muted-foreground">{translations.hero.fileHeader}</span>
            </div>
            
            <div className="space-y-4 font-mono w-full max-w-2xl mx-auto lg:mx-0 lg:max-w-none">
              {/* File comment */}
              <div className="text-code-comment text-xs sm:text-sm text-center lg:text-left animate-fade-in-up" style={{ animationDelay: '100ms' }}>{translations.hero.fileComment}</div>
              
              {/* Main title with blue prompt - centered on mobile */}
              <div className="flex items-start gap-2 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <span className="text-primary text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold leading-tight">{'>'}</span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-foreground leading-tight whitespace-pre font-mono">
                  {typedText}
                  <span
                    className={`inline-block w-[2px] sm:w-[3px] h-6 sm:h-8 md:h-10 lg:h-[40px] bg-primary align-middle ml-0.5 ${!isTyping ? 'animate-caret-blink' : ''}`}
                  />
                </h1>
              </div>
              
              {/* Subtitle - centered on mobile */}
              <div className="text-muted-foreground text-sm sm:text-base text-center lg:text-left animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                {translations.hero.subtitle}
              </div>

              {/* Stats code block */}
              <div className="rounded-lg p-3 sm:p-4 space-y-2 border border-border card-hover hover:border-primary/50 cursor-default animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <div className="text-sm sm:text-base md:text-lg leading-relaxed">
                  <span className="code-keyword">const</span>
                  <span className="code-function"> {translations.hero.stats.label}</span>
                  <span className="text-foreground"> =</span>
                  <span className="code-number text-lg sm:text-xl md:text-2xl lg:text-[28px] font-bold ml-2">{formatNumber(animatedCount)}</span>
                  <span className="text-foreground">;</span>
                </div>
                <div className="text-xs sm:text-sm code-comment">
                  <span>{'// '}{translations.hero.stats.comment}{animatedCount.toLocaleString()}{translations.hero.stats.suffix}</span>
                </div>
              </div>

              {/* JSDoc comment block */}
              <div className="p-3 sm:p-4 border-l-4 border-accent card-hover hover:border-primary hover:bg-accent/5 cursor-default animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <div className="text-xs sm:text-sm text-accent leading-relaxed">
                  <div>{'/**'}</div>
                  <div>{' * '}{translations.hero.description.line1}</div>
                  <div>{' * '}{translations.hero.description.line2}</div>
                  <div>{' */'}</div>
                </div>
              </div>

              {/* Last update time */}
              {lastUpdate && (
                <div className="p-3 sm:p-4 rounded-lg border border-border card-hover hover:border-primary/50 cursor-default animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-code-purple text-lg">{'//'}</span>
                    <span className="text-muted-foreground text-sm sm:text-base font-mono">
                      {translations.hero.lastUpdate.label}: <span className="text-foreground font-semibold">{lastUpdate}</span>
                    </span>
                  </div>
                </div>
              )}
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
