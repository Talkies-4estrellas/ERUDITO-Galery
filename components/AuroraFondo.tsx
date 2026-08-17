"use client";
import { useEffect, useRef } from "react";

export default function AuroraFondo() {
  const r1 = useRef<HTMLDivElement>(null);
  const r2 = useRef<HTMLDivElement>(null);
  const r3 = useRef<HTMLDivElement>(null);
  const r4 = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    // mouse
    let tx = 0, ty = 0, cx = 0, cy = 0;
    // scroll
    let lastScroll = window.scrollY;
    let scrollVel = 0;
    let targetBright = 0, currentBright = 0;

    const onMouseMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth  - 0.5) * 50;
      ty = (e.clientY / window.innerHeight - 0.5) * 30;
    };

    const onScroll = () => {
      const sy = window.scrollY;
      scrollVel = Math.min(Math.abs(sy - lastScroll) * 0.015, 0.5);
      lastScroll = sy;
      targetBright = scrollVel;
    };

    const tick = () => {
      const sy = lastScroll;

      // mouse lerp
      cx += (tx - cx) * 0.04;
      cy += (ty - cy) * 0.04;

      // brightness lerp (decays back to 0)
      targetBright *= 0.92;
      currentBright += (targetBright - currentBright) * 0.08;

      const boost = 1 + currentBright;

      // cada rayo se mueve en parallax a distinta velocidad con el scroll
      if (r1.current) r1.current.style.transform =
        `translateX(${cx * 0.4}px) translateY(${cy * 0.4 - sy * 0.06}px)`;
      if (r2.current) r2.current.style.transform =
        `translateX(${cx * 0.7}px) translateY(${cy * 0.7 - sy * 0.10}px)`;
      if (r3.current) r3.current.style.transform =
        `translateX(${cx * 0.5}px) translateY(${cy * 0.5 - sy * 0.08}px)`;
      if (r4.current) r4.current.style.transform =
        `translateX(${cx * 0.9}px) translateY(${cy * 0.9 - sy * 0.14}px)`;

      // brillo global al hacer scroll
      if (wrapRef.current) wrapRef.current.style.opacity = String(Math.min(boost, 1.4));

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll",    onScroll,    { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll",    onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes flicker-1 {
          0%,100% { opacity: 0.75; } 40% { opacity: 0.95; } 70% { opacity: 0.65; }
        }
        @keyframes flicker-2 {
          0%,100% { opacity: 0.80; } 30% { opacity: 0.60; } 65% { opacity: 1.00; }
        }
        @keyframes flicker-3 {
          0%,100% { opacity: 0.70; } 50% { opacity: 0.90; } 80% { opacity: 0.55; }
        }
        @keyframes flicker-4 {
          0%,100% { opacity: 0.85; } 35% { opacity: 0.65; } 60% { opacity: 1.00; }
        }
      `}</style>

      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        style={{ zIndex: 0, mixBlendMode: "screen" }}
        aria-hidden
      >
        <div ref={wrapRef} className="absolute inset-0" style={{ willChange: "opacity" }}>

          {/* Línea 1 — naranja profundo, izquierda */}
          <div ref={r1} style={{
            position: "absolute", top: "-20%", bottom: "-20%",
            left: "8%", width: "7%",
            background: `linear-gradient(to bottom,
              transparent          0%,
              rgba(180,55,0,0.08) 15%,
              rgba(234,88,12,0.22) 38%,
              rgba(249,115,22,0.30) 55%,
              rgba(234,88,12,0.18) 72%,
              rgba(160,45,0,0.06) 85%,
              transparent         97%)`,
            filter: "blur(28px)",
            willChange: "transform",
            animation: "flicker-1 9s ease-in-out infinite",
          }} />

          {/* Línea 2 — naranja→ámbar→blanco cálido, centro */}
          <div ref={r2} style={{
            position: "absolute", top: "-20%", bottom: "-20%",
            left: "34%", width: "5%",
            background: `linear-gradient(to bottom,
              transparent           0%,
              rgba(220,80,0,0.06)  12%,
              rgba(249,115,22,0.20) 30%,
              rgba(251,175,36,0.32) 48%,
              rgba(255,235,180,0.40) 62%,
              rgba(249,115,22,0.20) 76%,
              rgba(200,65,0,0.06)  88%,
              transparent          97%)`,
            filter: "blur(22px)",
            willChange: "transform",
            animation: "flicker-2 13s ease-in-out infinite",
          }} />

          {/* Línea 3 — ámbar-naranja, centro-derecha */}
          <div ref={r3} style={{
            position: "absolute", top: "-20%", bottom: "-20%",
            left: "58%", width: "6%",
            background: `linear-gradient(to bottom,
              transparent            0%,
              rgba(200,65,0,0.07)   14%,
              rgba(249,115,22,0.22)  35%,
              rgba(251,160,36,0.30)  54%,
              rgba(249,115,22,0.18)  70%,
              rgba(180,55,0,0.06)   84%,
              transparent           97%)`,
            filter: "blur(26px)",
            willChange: "transform",
            animation: "flicker-3 11s ease-in-out infinite",
          }} />

          {/* Línea 4 — naranja suave, derecha */}
          <div ref={r4} style={{
            position: "absolute", top: "-20%", bottom: "-20%",
            left: "82%", width: "8%",
            background: `linear-gradient(to bottom,
              transparent            0%,
              rgba(160,45,0,0.06)   15%,
              rgba(220,78,10,0.18)   37%,
              rgba(249,115,22,0.25)  56%,
              rgba(220,78,10,0.14)   72%,
              rgba(140,40,0,0.05)   85%,
              transparent           96%)`,
            filter: "blur(30px)",
            willChange: "transform",
            animation: "flicker-4 16s ease-in-out infinite",
          }} />

        </div>
      </div>
    </>
  );
}
