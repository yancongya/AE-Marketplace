import { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';

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

  useEffect(() => {
    if (!statsData) return;

    const total = statsData.expressions + statsData.scripts + statsData.presets + statsData.extensions;

    // Animate number counting
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
    if (!statsData) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationProgress = 0;
    let animationId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const radarData = [
      { category: '表达式', count: statsData.expressions, color: '#8b5cf6' },
      { category: '脚本', count: statsData.scripts, color: '#3b82f6' },
      { category: '预设', count: statsData.presets, color: '#10b981' },
      { category: '扩展', count: statsData.extensions, color: '#f59e0b' }
    ];

    const maxValue = Math.max(...radarData.map(d => d.count));

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

      // Draw animated polygon
      const currentProgress = Math.min(animationProgress, 1);
      
      ctx.beginPath();
      radarData.forEach((item, index) => {
        const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
        const value = (item.count / maxValue) * currentProgress;
        const x = centerX + Math.cos(angle) * radius * value;
        const y = centerY + Math.sin(angle) * radius * value;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
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
      radarData.forEach((item, index) => {
        const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
        const value = item.count / maxValue;
        const pointX = centerX + Math.cos(angle) * radius * value;
        const pointY = centerY + Math.sin(angle) * radius * value;
        
        ctx.beginPath();
        ctx.arc(pointX, pointY, 5, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
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

    const animate = () => {
      animationProgress += 0.02;
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
    };
  }, [statsData]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  return (
    <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left side - Main content */}
          <div className="space-y-8">
            {/* Terminal window */}
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-yellow" />
                <span className="terminal-dot terminal-dot-green" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">ae_scripts.market</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-2">
                  <span className="text-primary font-mono">{'>'}</span>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                    AE Scripts
                    <br />
                    <span className="text-gradient">Marketplace</span>
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ChevronRight className="w-4 h-4 text-primary" />
                  <span className="font-mono text-sm">基于开放的 ExtendScript 生态系统</span>
                </div>
              </div>
            </div>

            {/* Stats card */}
            <div className="terminal-window">
              <div className="p-6">
                <div className="code-block">
                  <span className="code-keyword">const</span>
                  <span className="text-foreground"> scripts </span>
                  <span className="code-keyword">=</span>
                  <span className="code-number text-3xl font-bold ml-2"> {formatNumber(animatedCount)}</span>
                  <span className="text-muted-foreground">;</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground font-mono">
                  <span className="code-comment">// 一些自用或自制的ae表达式 脚本 预设 扩展等。</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Radar Chart */}
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="terminal-dot terminal-dot-red" />
                <span className="terminal-dot terminal-dot-yellow" />
                <span className="terminal-dot terminal-dot-green" />
                <span className="ml-2 text-xs text-muted-foreground font-mono">radar-analysis.tsx</span>
              </div>
              <div className="p-4">
                <canvas 
                  ref={canvasRef}
                  className="w-full h-64"
                />
              </div>
            </div>
        </div>
      </div>
    </section>
  );
}
