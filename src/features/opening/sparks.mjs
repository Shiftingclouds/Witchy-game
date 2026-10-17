import { LANTERN_LIGHT } from './geometry.mjs';

/** Gold sparks rise from the lantern; a few slower fireflies wander over the lake. Returns a stop function. */
export function startSparks(canvas, { reduced }) {
  if (reduced) return () => {};
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  let W = 0;
  let H = 0;
  let frame = 0;
  const fit = () => {
    W = canvas.width = canvas.clientWidth * dpr;
    H = canvas.height = canvas.clientHeight * dpr;
  };
  const lx = LANTERN_LIGHT.x / 100;
  const ly = LANTERN_LIGHT.y / 100;
  const spark = () => ({
    x: W * (lx + (Math.random() - 0.5) * 0.03),
    y: H * (ly + Math.random() * 0.03),
    vx: (Math.random() - 0.5) * 0.25,
    vy: -(0.25 + Math.random() * 0.55),
    r: (0.7 + Math.random() * 1.5) * dpr,
    life: 0,
    max: 380 + Math.random() * 420,
    tw: Math.random() * 6.28,
    kind: 'spark',
  });
  const fly = () => ({
    x: W * Math.random(),
    y: H * (0.6 + Math.random() * 0.3),
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.12,
    r: (0.8 + Math.random() * 1.2) * dpr,
    life: 0,
    max: 600 + Math.random() * 600,
    tw: Math.random() * 6.28,
    kind: 'fly',
  });
  fit();
  const parts = [];
  for (let i = 0; i < 26; i++) {
    const p = spark();
    p.life = Math.random() * p.max;
    p.y += p.vy * p.life;
    parts.push(p);
  }
  for (let i = 0; i < 14; i++) parts.push(fly());

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (const p of parts) {
      p.life++;
      p.tw += 0.05;
      p.x += p.vx + Math.sin(p.tw * 0.6) * 0.15;
      p.y += p.vy;
      const t = p.life / p.max;
      const a = Math.min(1, t * 6) * (1 - t) * (0.55 + 0.45 * Math.sin(p.tw));
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
      g.addColorStop(0, `rgba(255,240,200,${a})`);
      g.addColorStop(0.3, `rgba(255,196,96,${a * 0.6})`);
      g.addColorStop(1, 'rgba(255,150,50,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 5, 0, 6.283);
      ctx.fill();
      if (p.life > p.max) Object.assign(p, p.kind === 'spark' ? spark() : fly());
    }
    frame = requestAnimationFrame(draw);
  };
  draw();
  addEventListener('resize', fit);
  return () => {
    cancelAnimationFrame(frame);
    removeEventListener('resize', fit);
  };
}
