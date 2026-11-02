"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Su contenido aparece (sube y se aclara) al entrar en pantalla. Lo que ya se ve al cargar no se anima;
 * sin JavaScript o con «reducir movimiento» todo se ve normal desde el principio.
 */
export default function Revelar({ children, className = "", retraso = 0 }: { children: ReactNode; className?: string; retraso?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.9) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(32px) scale(0.98)";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.style.transition = `opacity 0.7s ease ${retraso}ms, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${retraso}ms`;
        el.style.opacity = "";
        el.style.transform = "";
        io.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [retraso]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
