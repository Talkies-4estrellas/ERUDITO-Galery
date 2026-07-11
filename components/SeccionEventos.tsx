"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { eventos } from "@/data/eventos";

export default function SeccionEventos() {
  const pista = useRef<HTMLDivElement>(null);

  const desplazar = (dir: 1 | -1) => {
    pista.current?.scrollBy({
      left: dir * (pista.current.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold tracking-wide text-white">
          Próximos eventos
        </h2>
        <div className="flex items-center gap-3">
          <p className="hidden text-xs text-zinc-500 sm:block">
            Subastas y exposiciones de la galería
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => desplazar(-1)}
              aria-label="Evento anterior"
              className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/25"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => desplazar(1)}
              aria-label="Evento siguiente"
              className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/25"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        ref={pista}
        className="mt-5 flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {eventos.map((evento) => (
          <article
            key={evento.id}
            className="relative w-72 shrink-0 overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10 transition hover:ring-amber-400/30 sm:w-80"
          >
            {/* Stretched link — cubre toda la tarjeta */}
            <Link href={evento.href} className="absolute inset-0 z-10" aria-label={evento.titulo} />

            <div className="relative aspect-[16/10]">
              <Image
                src={evento.imagen}
                alt={evento.titulo}
                fill
                sizes="320px"
                className="object-cover"
              />
              <div className="absolute left-3 top-3 flex flex-col items-center rounded-lg bg-zinc-950/90 px-2.5 py-1.5 text-center leading-none backdrop-blur">
                <span className="text-base font-bold text-amber-400">
                  {evento.fechaCorta.dia}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400">
                  {evento.fechaCorta.mes}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex gap-2">
                <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-400 ring-1 ring-amber-400/20">
                  {evento.tipo}
                </span>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-zinc-400 ring-1 ring-white/10">
                  {evento.modalidad}
                </span>
              </div>

              <h3 className="mt-2.5 text-sm font-bold uppercase tracking-wide text-white">
                {evento.titulo}
              </h3>
              <p className="mt-1 text-xs text-zinc-500">{evento.lugar}</p>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                {evento.descripcion}
              </p>

              {/* Visual — el clic lo maneja el stretched link */}
              <div className="mt-4 w-full rounded-full bg-white/5 py-2 text-center text-xs font-semibold text-zinc-200 ring-1 ring-white/10 transition group-hover:bg-amber-400 group-hover:text-zinc-900">
                Más información
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
