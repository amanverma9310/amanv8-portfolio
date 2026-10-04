import { useEffect, useRef } from 'react';

// A decorative star field: no extra WebGL context and no React updates per frame.
export default function MovingStars() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current, context = canvas.getContext('2d');
    if (!context) return;
    const host = canvas.parentElement;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, stars = [], raf = 0, visible = false, disposed = false, last = 0, time = 0;
    let earthArea = { left: 0, top: 0, width: 0, height: 0 };
    const seedStars = () => {
      let seed = 9310;
      const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
      const count = Math.max(150, Math.min(520, Math.round(width * height / 2600)));
      stars = Array.from({ length: count }, () => ({
        x: random(), y: random(), depth: .3 + random() * .7,
        size: .25 + random() * .65, phase: random() * Math.PI * 2,
        opacity: .15 + random() * .48,
      }));
    };
    const paint = () => {
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        // Faster layered drift, while keeping the small background stars subtle.
        const x = ((star.x + time * .008 * star.depth) % 1) * width;
        const y = ((star.y + time * .003 * star.depth) % 1) * height;
        const twinkle = motion.matches ? 1 : .78 + .22 * Math.sin(time * .7 + star.phase);
        context.globalAlpha = star.opacity * twinkle;
        context.fillStyle = star.depth > .75 ? '#e6e4ff' : '#aabbd7';
        context.beginPath(); context.arc(x, y, star.size, 0, Math.PI * 2); context.fill();
      }
      // Every two seconds, alternate groups of two and three passing stars.
      // Keep their path in the Earth column; the form stays in front of the canvas.
      const burst = Math.floor(time / 2);
      if (!motion.matches && burst > 0 && earthArea.width > 0) {
        const count = burst % 2 === 0 ? 3 : 2;
        for (let i = 0; i < count; i++) {
          const age = time % 2 - i * .13;
          const duration = 1.25;
          if (age < 0 || age > duration) continue;
          const progress = age / duration;
          const startX = earthArea.left + earthArea.width + 20;
          const travelX = earthArea.width * .9 + 40;
          const lane = .12 + i * .19 + (burst % 3) * .055;
          const startY = earthArea.top + earthArea.height * lane;
          const travelY = earthArea.height * .14;
          const x = startX - progress * travelX;
          const y = startY + progress * travelY;
          const tail = 22 + i * 5;
          const slope = travelY / travelX;
          const fade = Math.min(1, progress * 8, (1 - progress) * 7);
          const trail = context.createLinearGradient(x, y, x + tail, y - tail * slope);
          trail.addColorStop(0, 'rgba(225,239,255,.8)');
          trail.addColorStop(1, 'rgba(225,239,255,0)');
          context.globalAlpha = fade;
          context.strokeStyle = trail; context.lineWidth = 1.2;
          context.beginPath(); context.moveTo(x, y); context.lineTo(x + tail, y - tail * slope); context.stroke();
          context.fillStyle = '#edf6ff'; context.shadowColor = '#abcaff'; context.shadowBlur = 5;
          context.beginPath(); context.arc(x, y, 1.4 + i * .25, 0, Math.PI * 2); context.fill();
          context.shadowBlur = 0;
        }
      }
      context.globalAlpha = 1;
    };
    const tick = (now) => {
      raf = 0;
      if (disposed || !visible || document.hidden) return;
      if (!motion.matches) time += Math.max(0, (now - (last || now)) / 1000);
      last = now; paint();
      if (!motion.matches) raf = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(raf); raf = 0; last = 0;
      if (disposed || !visible || document.hidden) return;
      paint(); if (!motion.matches) raf = requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(() => {
      width = host.clientWidth; height = host.clientHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio); canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const globe = host.querySelector('.contact-earth-globe');
      if (globe) {
        const sectionRect = host.getBoundingClientRect(), globeRect = globe.getBoundingClientRect();
        earthArea = { left: globeRect.left - sectionRect.left, top: globeRect.top - sectionRect.top,
          width: globeRect.width, height: globeRect.height - 70 };
      }
      seedStars(); paint();
    });
    resize.observe(host);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(host);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    return () => {
      disposed = true; cancelAnimationFrame(raf); resize.disconnect(); observer.disconnect();
      document.removeEventListener('visibilitychange', sync); motion.removeEventListener('change', sync);
    };
  }, []);
  return <canvas ref={canvasRef} className="contact-moving-stars" aria-hidden="true" />;
}
