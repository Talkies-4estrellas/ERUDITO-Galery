"use client";

import { useEffect, useRef, useState } from "react";
import type { PuntoGrafica } from "@/data/fichas";

/** Las 12 barras del valor estimado; crecen al entrar en pantalla y el mes actual va en ámbar. */
export default function GraficaValorMini({ puntos }: { puntos: PuntoGrafica[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimar(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setAnimar(true); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (puntos.length === 0) return null;
  const valores = puntos.map((p) => p.valor);
  const min = Math.min(...valores);
  const rango = Math.max(...valores) - min || 1;
  const mesActual = Math.min(new Date().getMonth(), puntos.length - 1);

  return (
    <div ref={ref} className="flex h-32 items-end gap-1.5">
      {puntos.map(({ mes, valor }, i) => (
        <div key={mes} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
          <div
            className={`w-full rounded-t-md transition-[height] duration-700 ease-out motion-reduce:transition-none ${
              i === mesActual ? "bg-amber-400" : i > mesActual ? "bg-zinc-700/60" : "bg-zinc-600"
            }`}
            style={{ height: animar ? `${15 + ((valor - min) / rango) * 85}%` : "0%", transitionDelay: `${i * 50}ms` }}
          />
          <span className={`text-[10px] ${i === mesActual ? "font-semibold text-amber-400" : "text-zinc-500"}`}>{mes}</span>
        </div>
      ))}
    </div>
  );
}
