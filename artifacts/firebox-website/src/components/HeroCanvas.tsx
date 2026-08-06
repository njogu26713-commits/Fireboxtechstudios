import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulseOffset: number;
}

interface FloatingShape {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  sides: number; // 3 = triangle, 4 = square, 6 = hexagon
}

export default function HeroCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to fill its container
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // Primary color components (purple ~270 75% 65%)
    const primary = { r: 147, g: 82, b: 219 };   // ~#9352db
    const secondary = { r: 180, g: 60, b: 220 };  // ~#b43cdc

    // ── Particles ─────────────────────────────────────────────────────────────
    const PARTICLE_COUNT = 55;
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2.5 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    // ── Floating geometric shapes ──────────────────────────────────────────────
    const SHAPE_COUNT = 8;
    const shapes: FloatingShape[] = Array.from({ length: SHAPE_COUNT }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 28 + 14,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.008,
      opacity: Math.random() * 0.12 + 0.04,
      sides: [3, 4, 6][Math.floor(Math.random() * 3)],
    }));

    // ── Orbs (large blurred blobs) ─────────────────────────────────────────────
    const orbs = [
      { x: W() * 0.2, y: H() * 0.3, r: 180, vx: 0.08, vy: 0.05, color: primary },
      { x: W() * 0.8, y: H() * 0.6, r: 140, vx: -0.06, vy: -0.07, color: secondary },
      { x: W() * 0.5, y: H() * 0.8, r: 120, vx: 0.04, vy: -0.05, color: primary },
    ];

    function polygon(ctx: CanvasRenderingContext2D, x: number, y: number, sides: number, size: number, rotation: number) {
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 / sides) * i + rotation;
        const px = x + Math.cos(angle) * size;
        const py = y + Math.sin(angle) * size;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
    }

    let t = 0;
    const MAX_DIST = 130;

    function draw() {
      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);

      // ── Background gradient ──────────────────────────────────────────────────
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, 'rgba(18,10,35,1)');
      bg.addColorStop(0.5, 'rgba(25,12,45,1)');
      bg.addColorStop(1, 'rgba(12,8,28,1)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // ── Orbs ────────────────────────────────────────────────────────────────
      for (const orb of orbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -orb.r || orb.x > w + orb.r) orb.vx *= -1;
        if (orb.y < -orb.r || orb.y > h + orb.r) orb.vy *= -1;

        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        const { r, g: gv, b } = orb.color;
        g.addColorStop(0, `rgba(${r},${gv},${b},0.18)`);
        g.addColorStop(0.5, `rgba(${r},${gv},${b},0.06)`);
        g.addColorStop(1, `rgba(${r},${gv},${b},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Floating shapes ──────────────────────────────────────────────────────
      for (const s of shapes) {
        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotationSpeed;
        if (s.x < -s.size) s.x = w + s.size;
        else if (s.x > w + s.size) s.x = -s.size;
        if (s.y < -s.size) s.y = h + s.size;
        else if (s.y > h + s.size) s.y = -s.size;

        const { r, g: gv, b } = primary;
        ctx.strokeStyle = `rgba(${r},${gv},${b},${s.opacity})`;
        ctx.lineWidth = 1;
        polygon(ctx, s.x, s.y, s.sides, s.size, s.rotation);
        ctx.stroke();
      }

      // ── Particles + connections ──────────────────────────────────────────────
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Pulsing glow
        const pulse = 0.6 + 0.4 * Math.sin(t * 0.02 + p.pulseOffset);
        const { r, g: gv, b } = primary;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        grd.addColorStop(0, `rgba(${r},${gv},${b},${p.opacity * pulse})`);
        grd.addColorStop(1, `rgba(${r},${gv},${b},0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Dot core
        ctx.fillStyle = `rgba(${r},${gv},${b},${p.opacity * pulse * 1.2})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.25;
            const { r, g: gv, b } = primary;
            ctx.strokeStyle = `rgba(${r},${gv},${b},${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // ── Scan line ────────────────────────────────────────────────────────────
      const scanY = ((t * 0.4) % (h + 60)) - 30;
      const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      scanGrad.addColorStop(0, 'rgba(147,82,219,0)');
      scanGrad.addColorStop(0.5, 'rgba(147,82,219,0.06)');
      scanGrad.addColorStop(1, 'rgba(147,82,219,0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 20, w, 40);

      t++;
      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} style={{ display: 'block', width: '100%', height: '100%' }} />;
}
