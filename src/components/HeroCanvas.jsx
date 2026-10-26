import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../hooks/useReducedMotion';

const GAP = 30; // grid spacing, px
const REACH = 150; // pointer influence radius, px
const PULL = 9; // how far lit dots lean towards the pointer, px
const RIPPLE_SPEED = 0.38; // px per ms
const RIPPLE_BAND = 42; // ring thickness, px
const AMBIENT_EVERY = 3600; // ms between ripples that start on their own

const VIOLET = [167, 139, 250];
const CYAN = [103, 232, 249];

// Interactive dot grid behind the hero: dots near the pointer light up, lean in and
// link together; ripples sweep across on their own and from every click or tap.
export default function HeroCanvas({ heroRef }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const hero = heroRef.current;
    const ctx = canvas.getContext('2d');
    const reduce = prefersReducedMotion();
    const pointer = { x: 0, y: 0, active: false };
    const ripples = [];
    let w = 0;
    let h = 0;
    let dots = [];
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let nextAmbient = last + 1200;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      if (pointer.active) {
        const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, REACH * 1.7);
        g.addColorStop(0, 'rgba(139, 92, 246, .16)');
        g.addColorStop(1, 'rgba(139, 92, 246, 0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      const lit = [];
      for (const d of dots) {
        let energy = 0;
        let ox = 0;
        let oy = 0;
        if (pointer.active) {
          const dx = pointer.x - d.x;
          const dy = pointer.y - d.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REACH) {
            const k = 1 - dist / REACH;
            energy = k;
            ox = (dx / (dist || 1)) * PULL * k * k;
            oy = (dy / (dist || 1)) * PULL * k * k;
          }
        }
        for (const r of ripples) {
          const band = Math.abs(Math.hypot(d.x - r.x, d.y - r.y) - r.radius);
          if (band < RIPPLE_BAND) energy = Math.max(energy, (1 - band / RIPPLE_BAND) * r.strength);
        }
        d.glow += (energy - d.glow) * 0.16;

        const x = d.x + ox;
        const y = d.y + oy;
        ctx.fillStyle = d.glow > 0.04 ? `rgba(${d.rgb}, ${0.12 + d.glow * 0.7})` : 'rgba(196, 181, 253, .13)';
        ctx.beginPath();
        ctx.arc(x, y, 1 + d.glow * 1.7, 0, Math.PI * 2);
        ctx.fill();
        if (d.glow > 0.3) lit.push({ x, y, glow: d.glow, rgb: d.rgb });
      }

      // Link neighbouring lit dots into a small constellation.
      ctx.lineWidth = 1;
      for (let i = 0; i < lit.length; i += 1) {
        for (let j = i + 1; j < lit.length; j += 1) {
          const a = lit[i];
          const b = lit[j];
          if (Math.abs(a.x - b.x) > GAP * 1.6 || Math.abs(a.y - b.y) > GAP * 1.6) continue;
          ctx.strokeStyle = `rgba(${a.rgb}, ${Math.min(a.glow, b.glow) * 0.28})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          const t = x / w; // violet on the left, cyan on the right
          const rgb = VIOLET.map((v, i) => Math.round(v + (CYAN[i] - v) * t)).join(', ');
          dots.push({ x, y, glow: 0, rgb });
        }
      }
      if (reduce) draw();
    };

    const addRipple = (x, y, strength = 1) => ripples.push({ x, y, radius: 0, strength });

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(now - last, 50);
      last = now;
      if (!visible) return;
      if (now > nextAmbient) {
        addRipple(w * (0.25 + Math.random() * 0.7), h * (0.15 + Math.random() * 0.7), 0.7);
        nextAmbient = now + AMBIENT_EVERY;
      }
      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const r = ripples[i];
        r.radius += RIPPLE_SPEED * dt;
        r.strength *= 0.992;
        if (r.radius > Math.hypot(w, h) || r.strength < 0.05) ripples.splice(i, 1);
      }
      draw();
    };

    const toLocal = (e) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      Object.assign(pointer, toLocal(e), { active: true });
    };
    const onLeave = () => { pointer.active = false; };
    const onDown = (e) => {
      const p = toLocal(e);
      addRipple(p.x, p.y, 1);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (reduce) return () => ro.disconnect();

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
    hero.addEventListener('pointerdown', onDown);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
      hero.removeEventListener('pointerdown', onDown);
    };
  }, [heroRef]);

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />;
}
