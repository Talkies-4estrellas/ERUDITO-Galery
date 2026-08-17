"use client";

import { useRef } from "react";
import Link from "next/link";
import type { FichaArte } from "@/data/fichas";
import FichaObra from "@/components/FichaObra";

interface Props {
  titulo?: string;
  lista?: FichaArte[];
}

export default function FilaFichas({
  titulo = "Obras destacadas",
  lista = [],
}: Props) {
  const pista = useRef<HTMLDivElement>(null);

  const desplazar = (direccion: 1 | -1) => {
    pista.current?.scrollBy({
      left: direccion * (pista.current.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-wide text-white">
          {titulo}
        </h2>
        <div className="flex items-center gap-3">
          <Link
            href="/catalogo/fisicos"
            className="rounded-full bg-amber-400/10 px-4 py-1.5 text-xs font-semibold text-amber-400 ring-1 ring-amber-400/20 transition hover:bg-amber-400 hover:text-zinc-900"
          >
            Ver más
          </Link>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => desplazar(-1)}
              aria-label="Desplazar a la izquierda"
              className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/25"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => desplazar(1)}
              aria-label="Desplazar a la derecha"
              className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/25"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Pista horizontal con snap; scrollbar oculta */}
      <div
        ref={pista}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {lista.map((ficha) => (
          <FichaObra key={ficha.id} ficha={ficha} />
        ))}
      </div>
    </section>
  );
}
