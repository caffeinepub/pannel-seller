import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

interface LightningBolt {
  segments: Point[][];
  alpha: number;
  maxAlpha: number;
  phase: "flash" | "flicker" | "fade";
  flickerCount: number;
  flickerTimer: number;
  timer: number;
  impactX: number;
  impactY: number;
  flashTimer: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulse: number;
  pulseSpeed: number;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface ImpactGlow {
  x: number;
  y: number;
  alpha: number;
  radius: number;
}

// Midpoint displacement with perpendicular offset for jagged "Z" shape
function generateBoltPoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  depth: number,
  jitterFactor: number,
): Point[] {
  if (depth === 0)
    return [
      { x: x1, y: y1 },
      { x: x2, y: y2 },
    ];

  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);

  // Perpendicular direction
  const perpX = -dy / len;
  const perpY = dx / len;

  // Jitter is 60-80% of segment length
  const jitter = len * jitterFactor * (Math.random() - 0.5) * 2;

  const offsetX = mx + perpX * jitter;
  const offsetY = my + perpY * jitter;

  const left = generateBoltPoints(
    x1,
    y1,
    offsetX,
    offsetY,
    depth - 1,
    jitterFactor * 0.65,
  );
  const right = generateBoltPoints(
    offsetX,
    offsetY,
    x2,
    y2,
    depth - 1,
    jitterFactor * 0.65,
  );

  return [...left.slice(0, -1), ...right];
}

function generateBranch(
  main: Point[],
  startIdxFraction: number,
  angleOffset: number,
  depth: number,
): Point[] {
  const idx = Math.floor(main.length * startIdxFraction);
  const start = main[idx];

  // Direction from main bolt near that point
  const prevIdx = Math.max(0, idx - 1);
  const nextIdx = Math.min(main.length - 1, idx + 1);
  const dx = main[nextIdx].x - main[prevIdx].x;
  const dy = main[nextIdx].y - main[prevIdx].y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;

  // Rotate by angleOffset (15-35 degrees)
  const angle = Math.atan2(dy, dx) + angleOffset;
  const branchLen = len * (3 + Math.random() * 4) * (4 - depth);
  const endX = start.x + Math.cos(angle) * branchLen;
  const endY = start.y + Math.sin(angle) * branchLen;

  return generateBoltPoints(start.x, start.y, endX, endY, depth, 0.5);
}

function spawnBolt(canvas: HTMLCanvasElement): LightningBolt {
  const w = canvas.width;
  const h = canvas.height;

  const startX = w * (0.1 + Math.random() * 0.8);
  const startY = 0;
  const endX = startX + (Math.random() - 0.5) * w * 0.4;
  const endY = h * (0.4 + Math.random() * 0.4);

  const main = generateBoltPoints(startX, startY, endX, endY, 7, 0.7);

  const allSegments: Point[][] = [main];

  // Branches at 15-35 degree angles
  const branchCount = 2 + Math.floor(Math.random() * 3);
  for (let b = 0; b < branchCount; b++) {
    const fracPos = 0.2 + Math.random() * 0.6;
    const side = Math.random() < 0.5 ? 1 : -1;
    const angleOff = side * (0.26 + Math.random() * 0.35); // 15-35 degrees in radians
    const branch = generateBranch(main, fracPos, angleOff, 4);
    allSegments.push(branch);

    // Sub-branch with decreasing probability
    if (Math.random() < 0.4) {
      const subSide = Math.random() < 0.5 ? 1 : -1;
      const subAngle = subSide * (0.3 + Math.random() * 0.3);
      const sub = generateBranch(
        branch,
        0.3 + Math.random() * 0.4,
        subAngle,
        2,
      );
      allSegments.push(sub);
    }
  }

  return {
    segments: allSegments,
    alpha: 0,
    maxAlpha: 0.9 + Math.random() * 0.1,
    phase: "flash",
    flickerCount: Math.floor(Math.random() * 2) + 2, // 2-3 flickers
    flickerTimer: 0,
    timer: 0,
    impactX: endX,
    impactY: endY,
    flashTimer: 0,
  };
}

export default function LightningBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flashAlphaRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let bolts: LightningBolt[] = [];
    let particles: Particle[] = [];
    let sparks: SparkParticle[] = [];
    let impactGlows: ImpactGlow[] = [];
    let time = 0;
    // 1.5-4 seconds at 60fps = 90-240 frames
    let nextBoltFrame = 60 + Math.floor(Math.random() * 60);

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Ambient dim particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.18 + 0.04, // max 0.22 — very dim
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    function spawnSparks(x: number, y: number) {
      for (let i = 0; i < 20; i++) {
        const angle = Math.PI + (Math.random() - 0.5) * Math.PI; // mostly upward
        const speed = Math.random() * 5 + 1;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          life: Math.random() * 25 + 15,
          maxLife: 40,
        });
      }
    }

    function triggerBolt(delayed = false) {
      if (delayed) {
        setTimeout(
          () => {
            const b = spawnBolt(canvas!);
            bolts.push(b);
            impactGlows.push({
              x: b.impactX,
              y: b.impactY,
              alpha: 1,
              radius: 40,
            });
            spawnSparks(b.impactX, b.impactY);
            flashAlphaRef.current = Math.max(
              flashAlphaRef.current,
              0.04 + Math.random() * 0.04,
            );
          },
          50 + Math.random() * 120,
        );
      } else {
        const b = spawnBolt(canvas!);
        bolts.push(b);
        impactGlows.push({ x: b.impactX, y: b.impactY, alpha: 1, radius: 40 });
        spawnSparks(b.impactX, b.impactY);
        flashAlphaRef.current = Math.max(
          flashAlphaRef.current,
          0.04 + Math.random() * 0.04,
        );
      }
    }

    function drawBoltSegments(bolt: LightningBolt) {
      const mainSeg = bolt.segments[0];

      for (let si = 0; si < bolt.segments.length; si++) {
        const seg = bolt.segments[si];
        const isMain = si === 0;
        const segAlpha = isMain ? bolt.alpha : bolt.alpha * 0.5;
        const baseWidth = isMain ? 2 : 1;

        if (seg.length < 2) continue;

        // Outer electric blue glow (large, blurred)
        ctx!.save();
        ctx!.globalAlpha = segAlpha * 0.25;
        ctx!.strokeStyle = "#4488ff";
        ctx!.lineWidth = baseWidth * 18;
        ctx!.shadowColor = "#3366cc";
        ctx!.shadowBlur = 30;
        ctx!.lineJoin = "round";
        ctx!.lineCap = "round";
        ctx!.beginPath();
        ctx!.moveTo(seg[0].x, seg[0].y);
        for (let i = 1; i < seg.length; i++) ctx!.lineTo(seg[i].x, seg[i].y);
        ctx!.stroke();
        ctx!.restore();

        // Inner blue-white glow
        ctx!.save();
        ctx!.globalAlpha = segAlpha * 0.6;
        ctx!.strokeStyle = "#c8e8ff";
        ctx!.lineWidth = baseWidth * 4;
        ctx!.shadowColor = "#88aaff";
        ctx!.shadowBlur = 12;
        ctx!.lineJoin = "round";
        ctx!.lineCap = "round";
        ctx!.beginPath();
        ctx!.moveTo(seg[0].x, seg[0].y);
        for (let i = 1; i < seg.length; i++) ctx!.lineTo(seg[i].x, seg[i].y);
        ctx!.stroke();
        ctx!.restore();

        // Pure white core — very thin 1px
        ctx!.save();
        ctx!.globalAlpha = segAlpha;
        ctx!.strokeStyle = "#ffffff";
        ctx!.lineWidth = isMain ? 1 : 0.6;
        ctx!.shadowColor = "#ffffff";
        ctx!.shadowBlur = 4;
        ctx!.lineJoin = "round";
        ctx!.lineCap = "round";
        ctx!.beginPath();
        ctx!.moveTo(seg[0].x, seg[0].y);
        for (let i = 1; i < seg.length; i++) ctx!.lineTo(seg[i].x, seg[i].y);
        ctx!.stroke();
        ctx!.restore();
      }

      // Suppress TS warning — mainSeg is used conceptually for impact glow
      void mainSeg;
    }

    function frame() {
      time++;
      const w = canvas!.width;
      const h = canvas!.height;

      // Dark background
      ctx!.fillStyle = "#020510";
      ctx!.fillRect(0, 0, w, h);

      // Subtle dark blue radial gradient
      const grad = ctx!.createRadialGradient(
        w / 2,
        h * 0.4,
        0,
        w / 2,
        h * 0.4,
        w * 0.65,
      );
      grad.addColorStop(0, "rgba(10, 15, 50, 0.8)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);

      // Screen flash overlay (thunder flash)
      if (flashAlphaRef.current > 0) {
        ctx!.save();
        ctx!.globalAlpha = flashAlphaRef.current;
        ctx!.fillStyle = "#ddeeff";
        ctx!.fillRect(0, 0, w, h);
        ctx!.restore();
        flashAlphaRef.current = Math.max(0, flashAlphaRef.current - 0.006);
      }

      // Dim ambient particles (max 30% opacity)
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        const a = Math.min(0.3, p.alpha * (0.7 + 0.3 * Math.sin(p.pulse)));
        ctx!.save();
        ctx!.globalAlpha = a;
        ctx!.fillStyle = "#334466";
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }

      // Impact glows
      impactGlows = impactGlows.filter((g) => g.alpha > 0);
      for (const g of impactGlows) {
        g.alpha -= 0.04;
        if (g.alpha <= 0) continue;
        const ig = ctx!.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.radius);
        ig.addColorStop(0, `rgba(255,255,255,${g.alpha * 0.9})`);
        ig.addColorStop(0.3, `rgba(100,170,255,${g.alpha * 0.7})`);
        ig.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.save();
        ctx!.fillStyle = ig;
        ctx!.beginPath();
        ctx!.arc(g.x, g.y, g.radius, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }

      // Sparks (gravity-affected)
      sparks = sparks.filter((s) => s.life > 0);
      for (const s of sparks) {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.15;
        s.vx *= 0.96;
        s.life--;
        s.alpha = s.life / s.maxLife;
        ctx!.save();
        ctx!.globalAlpha = s.alpha * 0.8;
        ctx!.fillStyle = "#aaccff";
        ctx!.shadowColor = "#4488ff";
        ctx!.shadowBlur = 4;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, 1.2, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }

      // Spawn bolts: 90-240 frame intervals
      if (time >= nextBoltFrame) {
        triggerBolt(false);
        // 20% chance of return stroke 50-120ms later
        if (Math.random() < 0.2) triggerBolt(true);
        nextBoltFrame = time + 90 + Math.floor(Math.random() * 150);
      }

      // Update and draw bolts
      bolts = bolts.filter((b) => b.alpha > 0.005 || b.phase !== "fade");
      for (const bolt of bolts) {
        bolt.timer++;

        if (bolt.phase === "flash") {
          // Instant bright appearance: 2-4 frames
          bolt.alpha = Math.min(bolt.alpha + 0.5, bolt.maxAlpha);
          bolt.flashTimer++;
          if (bolt.flashTimer >= 3) {
            bolt.phase = "flicker";
            bolt.flickerTimer = 0;
          }
        } else if (bolt.phase === "flicker") {
          // Quick 2-3 flickers before fade
          bolt.flickerTimer++;
          if (bolt.flickerTimer % 4 < 2) {
            bolt.alpha = bolt.maxAlpha * (0.4 + Math.random() * 0.3);
          } else {
            bolt.alpha = bolt.maxAlpha * (0.85 + Math.random() * 0.15);
          }
          if (bolt.flickerTimer >= bolt.flickerCount * 4) {
            bolt.phase = "fade";
            bolt.alpha = bolt.maxAlpha;
          }
        } else {
          // Fade: 8-15 frames
          bolt.alpha = Math.max(0, bolt.alpha - 0.07);
        }

        if (bolt.alpha > 0.005) drawBoltSegments(bolt);
      }

      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
      style={{ pointerEvents: "none" }}
    />
  );
}
