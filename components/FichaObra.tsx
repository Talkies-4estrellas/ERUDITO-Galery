"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { FichaArte } from "@/data/fichas";
import CapsulaArtista from "@/components/CapsulaArtista";
import BotonFavorito from "@/components/BotonFavorito";
import BotonComparar from "@/components/BotonComparar";

interface Props {
  ficha: FichaArte;
  fluida?: boolean;
  comparable?: boolean;
}

const TIPO_LABEL: Record<FichaArte["tipo"], string> = {
  "Físico":            "Original",
  "JPG Certificado":   "Digital",
  "Impresión Oficial": "Ed. limitada",
};

function Estrellas({ n }: { n: number }) {
  return (
    <div aria-label={`${n} de 5 estrellas`} className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`text-xs ${i < n ? "text-amber-400" : "text-white/20"}`}>★</span>
      ))}
    </div>
  );
}

export default function FichaObra({ ficha, fluida = false, comparable = false }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className={`relative ${hovered ? "z-30" : ""} ${fluida ? "w-full" : "w-60 shrink-0 snap-start sm:w-64"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >

      {/* ── IMAGEN ─────────────────────────────────────────── */}
      <Link
        href={`/obra/${ficha.id}`}
        className="relative block aspect-[3/4] overflow-hidden rounded-3xl bg-zinc-800 ring-1 ring-white/10"
      >
        <Image
          src={ficha.imagen}
          alt={ficha.titulo}
          fill
          sizes="256px"
          className={`object-cover transition-transform duration-500 ${hovered ? "scale-105" : ""}`}
        />

        {/* Badge tipo — siempre visible */}
        <div className="absolute right-3 top-3 z-10 rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-md">
          {TIPO_LABEL[ficha.tipo]}
        </div>

        {/* Favorito — siempre visible */}
        <div className="absolute left-3 top-3 z-10">
          <BotonFavorito id={ficha.id} />
        </div>

        {/* Comparar — siempre visible */}
        {comparable && (
          <div className="absolute left-3 top-12 z-10">
            <BotonComparar id={ficha.id} />
          </div>
        )}

        {/* Overlay idle: blur + gradiente + título — desaparece en hover */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 transition-opacity duration-300"
          style={{ opacity: hovered ? 0 : 1 }}
        >
          <div
            className="absolute inset-x-0 bottom-0 h-[55%] backdrop-blur-xl"
            style={{
              WebkitMaskImage: "linear-gradient(to top, black 40%, transparent 85%)",
              maskImage:        "linear-gradient(to top, black 40%, transparent 85%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="w-fit rounded-2xl bg-black/60 px-3 py-2.5 backdrop-blur-sm">
              <div className="mb-1.5">
                <Estrellas n={ficha.estrellas} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-amber-400 leading-tight">
                {ficha.titulo}
              </h3>
              <p className="mt-0.5 text-[10px] text-amber-300/70">{ficha.anio}</p>
            </div>
          </div>
        </div>

        {/* Botón "Ver obra" — solo en hover */}
        <div
          className="absolute inset-x-4 bottom-4 transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <div className="w-full rounded-full bg-amber-300 py-2.5 text-center text-xs font-bold text-zinc-900">
            Ver obra
          </div>
        </div>
      </Link>

      {/* ── SECCIÓN INFERIOR ───────────────────────────────── */}
      <div className="relative mt-3 h-[52px]">

        {/* Idle: cápsula artista */}
        <div
          className="absolute inset-0 transition-opacity duration-200"
          style={{ opacity: hovered ? 0 : 1, pointerEvents: hovered ? "none" : "auto" }}
        >
          <CapsulaArtista artista={ficha.artista} />
        </div>

        {/* Hover: panel con toda la info */}
        <div
          className="absolute left-0 right-0 top-0 z-20 transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0, pointerEvents: hovered ? "auto" : "none" }}
        >
          <div className="rounded-2xl bg-zinc-900/95 p-4 shadow-2xl ring-1 ring-white/10 backdrop-blur-sm">

            {/* Título + año */}
            <p className="truncate text-sm font-bold uppercase tracking-wide text-white leading-tight">
              {ficha.titulo}
            </p>
            <p className="mt-0.5 text-[10px] text-zinc-500">{ficha.anio}</p>

            {/* Estrellas */}
            <div className="mt-2">
              <Estrellas n={ficha.estrellas} />
            </div>

            {/* Descripción */}
            <p className="mt-1.5 line-clamp-3 text-[11px] leading-relaxed text-zinc-400">
              {ficha.descripcion}
            </p>

            {/* Tags + precio */}
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1">
                {ficha.movimiento && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-zinc-300 ring-1 ring-white/10">
                    {ficha.movimiento}
                  </span>
                )}
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-zinc-400 ring-1 ring-white/10">
                  {ficha.tamano}
                </span>
              </div>
              {ficha.precio > 0 && (
                <span className="shrink-0 text-xs font-semibold text-amber-400">
                  ${ficha.precio.toLocaleString("es-MX")}
                </span>
              )}
            </div>

            {/* Artista */}
            <div className="mt-3 border-t border-white/10 pt-3">
              <CapsulaArtista artista={ficha.artista} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
