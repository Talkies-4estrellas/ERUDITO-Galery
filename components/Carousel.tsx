"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Obra } from "@/data/obras";

const INTERVALO_MS = 6000;

export default function Carousel({ obras }: { obras: Obra[] }) {
  if (!obras.length) return null;

  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);

  const irA = useCallback((indice: number) => {
    setActual((indice + obras.length) % obras.length);
  }, []);

  const siguiente = useCallback(() => irA(actual + 1), [actual, irA]);
  const anterior = useCallback(() => irA(actual - 1), [actual, irA]);

  // Avance automático; se pausa cuando el cursor está sobre el carrusel
  useEffect(() => {
    if (pausado) return;
    const temporizador = setInterval(siguiente, INTERVALO_MS);
    return () => clearInterval(temporizador);
  }, [pausado, siguiente]);

  const obra = obras[actual];

  return (
    <section
      className="mx-auto w-full max-w-6xl px-4 pb-6 pt-6 sm:px-8 sm:pb-10"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl ring-1 ring-white/10">
        {obras.map((item, indice) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              indice === actual ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={indice !== actual}
          >
            <Image
              src={item.imagen}
              alt={item.titulo}
              fill
              priority={indice === 0}
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="object-cover"
            />
          </div>
        ))}

        {/* Tarjeta de información — solo en desktop (overlay) */}
        <div className="hidden sm:block absolute bottom-6 left-6 max-w-md rounded-xl bg-black/60 p-5 backdrop-blur-md">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-base font-bold uppercase tracking-wider text-white">
              {obra.titulo}
            </h2>
            <span className="text-xs text-zinc-400">{obra.anio}</span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-zinc-300">
            {obra.descripcion}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div aria-label={`${obra.estrellas} de 5 estrellas`} className="text-sm">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < obra.estrellas ? "text-amber-400" : "text-zinc-600"}>★</span>
              ))}
            </div>
            <Link
              href={`/obra/${obra.id}`}
              className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-zinc-900 transition hover:bg-amber-400"
            >
              Ver más
            </Link>
          </div>
        </div>

        {/* Flechas de navegación */}
        <button
          type="button"
          onClick={anterior}
          aria-label="Obra anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/70"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={siguiente}
          aria-label="Obra siguiente"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/70"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Tarjeta de información — solo en móvil (debajo de la imagen) */}
      <div className="sm:hidden mt-3 rounded-xl bg-zinc-900/95 px-4 py-3.5 ring-1 ring-white/10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white leading-tight">
            {obra.titulo}
          </h2>
          <span className="shrink-0 text-xs text-zinc-400">{obra.anio}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-300">
          {obra.descripcion}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div aria-label={`${obra.estrellas} de 5 estrellas`} className="text-sm">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < obra.estrellas ? "text-amber-400" : "text-zinc-600"}>★</span>
            ))}
          </div>
          <Link
            href={`/obra/${obra.id}`}
            className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-zinc-900 transition hover:bg-amber-400"
          >
            Ver más
          </Link>
        </div>
      </div>

      {/* Indicadores (puntos) */}
      <div className="mt-5 flex items-center justify-center gap-2.5">
        {obras.map((item, indice) => (
          <button
            key={item.id}
            type="button"
            onClick={() => irA(indice)}
            aria-label={`Ir a la obra ${indice + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              indice === actual
                ? "w-7 bg-white"
                : "w-2.5 bg-zinc-600 hover:bg-zinc-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
