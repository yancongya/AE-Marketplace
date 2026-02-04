import { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { stats } from '@/data/mockData';

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Draw growth chart
    const drawChart = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;

      ctx.clearRect(0, 0, width, height);

      // Generate growth data points
      const points: [number, number][] = [];
      const days = 30;
      for (let i = 0; i <= days; i++) {
        const x = padding + (i / days) * chartWidth;
        const growth = Math.pow(i / days, 2.5);
        const y = padding + chartHeight - growth * chartHeight;
        points.push([x, y]);
      }

      // Draw gradient area
      const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
      gradient.addColorStop(0, 'rgba(96, 165, 250, 0.3)');
      gradient.addColorStop(1, 'rgba(96, 165, 250, 0)');

      ctx.beginPath();
      ctx.moveTo(points[0][0], height - padding);
      points.forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.lineTo(points[points.length - 1][0], height - padding);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw line
      ctx.beginPath();
      points.forEach(([x, y], i) => {
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw axes
      ctx.strokeStyle = '#3a3a3a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.stroke();

      // Draw labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px JetBrains Mono';
      ctx.textAlign = 'center';
      
      const dates = ['11月24日', '12月1日', '12月8日', '12月15日', '12月22日', '12月29日', '1月5日', '1月12日', '1月19日', '2月2日'];
      dates.forEach((date, i) => {
        const x = padding + (i / (dates.length - 1)) * chartWidth;
        ctx.fillText(date, x, height - padding + 20);
      });

      // Y-axis labels
      ctx.textAlign = 'right';
      const yLabels = ['0', '15000', '30000', '45000', '60000'];
      yLabels.forEach((label, i) => {
        const y = height - padding - (i / (yLabels.length - 1)) * chartHeight;
        ctx.fillText(label, padding - 10, y + 3);
      });
    };

    drawChart();

    return () => window.removeEventListener('resize', resize);
  }, []);

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
                  <span className="code-number text-3xl font-bold ml-2"> {formatNumber(stats.totalScripts)}</span>
                  <span className="text-muted-foreground">;</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground font-mono">
                  <span className="code-comment">// 发现来自 GitHub 的开源 AE 扩展脚本</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Chart */}
          <div className="terminal-window">
            <div className="terminal-header">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">trend-analytics.tsx</span>
            </div>
            <div className="p-4">
              <canvas 
                ref={canvasRef}
                className="w-full h-64"
              />
              <p className="mt-4 text-xs text-center text-muted-foreground font-mono">
                根据脚本最后 push 时间统计，非当日提交的数量
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="terminal-window p-6">
            <p className="text-muted-foreground text-sm leading-relaxed">
              This <span className="text-primary">AE Scripts marketplace</span> shares even more examples to inspire you. 
              Explore community-built extensions that extend what After Effects can do—from automated keyframing 
              and expression builders to color grading and motion tracking.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <ChevronRight className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Motion Design Weekly</p>
                <p className="text-xs text-muted-foreground">Industry Publication</p>
              </div>
            </div>
          </div>

          <div className="terminal-window p-6">
            <p className="text-muted-foreground text-sm leading-relaxed">
              We&apos;ve added scripts to our pipeline, making it possible to use the large and{' '}
              <span className="text-primary">growing</span> collection of community extensions. 
              It has significantly improved our motion graphics workflow.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <ChevronRight className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">School of Motion</p>
                <p className="text-xs text-muted-foreground">Online Education Platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
