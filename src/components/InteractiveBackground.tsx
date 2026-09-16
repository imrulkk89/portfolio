import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  glyph?: string;
}

const GLYPHS = ['0', '1', '{ }', '< >', '=>', 'go()', 'mongo', 'node', 'fn()', '&&', '||', '::', 'nil', 'struct', 'ts'];

interface InteractiveBackgroundProps {
  interactive?: boolean;
}

export const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ interactive = true }) => {
  const { isDark } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; radius: number; isDown: boolean }>({
    x: -1000,
    y: -1000,
    radius: 120,
    isDown: false
  });
  const [particleSpeed, setParticleSpeed] = useState<number>(1);
  const [showGlyphs, setShowGlyphs] = useState<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const particleCount = Math.min(Math.floor((width * height) / 14000), 80);

    const colors = isDark
      ? ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6']
      : ['#059669', '#0891b2', '#2563eb', '#7c3aed', '#64748b'];

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        const isGlyph = Math.random() > 0.65;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.7 * particleSpeed,
          vy: (Math.random() - 0.5) * 0.7 * particleSpeed,
          size: isGlyph ? 10 : Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: isDark ? (Math.random() * 0.4 + 0.2) : (Math.random() * 0.35 + 0.15),
          glyph: isGlyph ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : undefined
        });
      }
    }

    initParticles();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = e.touches[0].clientX - rect.left;
        mouseRef.current.y = e.touches[0].clientY - rect.top;
      }
    };

    const handleMouseDown = () => {
      mouseRef.current.isDown = true;
      // Burst effect on click
      for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        particles.push({
          x: mouseRef.current.x,
          y: mouseRef.current.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2 + 1.5,
          color: '#10b981',
          alpha: 0.9,
          glyph: undefined
        });
      }
      if (particles.length > 130) {
        particles.splice(0, 15);
      }
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle background grid pattern
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 48;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw mouse interaction glow
      if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        const gradient = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          mouseRef.current.radius
        );
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, mouseRef.current.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Mouse interaction: push away or attract
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRef.current.radius) {
          const force = (1 - dist / mouseRef.current.radius) * 1.5;
          const angle = Math.atan2(dy, dx);
          if (mouseRef.current.isDown) {
            // Attract when clicked
            p.vx += Math.cos(angle) * force * 0.4;
            p.vy += Math.sin(angle) * force * 0.4;
          } else {
            // Repel on hover
            p.vx -= Math.cos(angle) * force * 0.3;
            p.vy -= Math.sin(angle) * force * 0.3;
          }
        }

        // Slight friction so speed doesn't explode
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Render particle or code glyph
        if (showGlyphs && p.glyph) {
          ctx.font = '10px "Fira Code", monospace';
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.65;
          ctx.fillText(p.glyph, p.x, p.y);
          ctx.globalAlpha = 1.0;
        } else {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }

        // Draw connecting lines between close particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          const maxDist = 110;

          if (dist2 < maxDist) {
            const lineAlpha = (1 - dist2 / maxDist) * 0.12;
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [interactive, particleSpeed, showGlyphs, isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-300">
      <canvas
        ref={canvasRef}
        id="interactive-bg-canvas"
        className={`w-full h-full block transition-opacity duration-300 ${isDark ? 'opacity-75' : 'opacity-65'}`}
      />
      {/* Subtle radial vignette gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-b pointer-events-none transition-colors duration-300 ${
          isDark
            ? 'from-transparent via-[#0a0c10]/40 to-[#0a0c10]'
            : 'from-transparent via-[#f8fafc]/50 to-[#f8fafc]'
        }`}
      />
    </div>
  );
};
