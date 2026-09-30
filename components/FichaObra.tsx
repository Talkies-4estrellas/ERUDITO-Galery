"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [hovered, setHovered]   = useState(false);
  const [cardRect, setCardRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted]   = useState(false);
  const artRef     = useRef<HTMLElement>(null);
  const capsulaRef = useRef<HTMLDivElement>(null);
  const hideRef    = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const mostrar = useCallback(() => {
    if (hideRef.current) clearTimeout(hideRef.current);
    if (!capsulaRef.current) return;
    const rect = capsulaRef.current.getBoundingClientRect();
    if (window.innerHeight - rect.bottom - 8 < 120) return;
    setCardRect(rect);
    setHovered(true);
  }, []);

  const ocultar = useCallback(() => {
    hideRef.current = setTimeout(() => {
      setHovered(false);
      setCardRect(null);
    }, 80);
  }, []);

  const handleTap = useCallback(() => {
    if (hovered) { ocultar(); } else { mostrar(); }
  }, [hovered, mostrar, ocultar]);

  useEffect(() => {
    if (!hovered) return;
    const cerrar = () => { setHovered(false); setCardRect(null); };
    window.addEventListener("scroll", cerrar, { passive: true });
    return () => window.removeEventListener("scroll", cerrar);
  }, [hovered]);

  const tooltipStyle = cardRect ? (() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    /* Móvil: ancho completo para que siempre quede bajo su obra */
    if (vw < 640) {
      return {
        position: "fixed" as const,
        left: 8,
        top: cardRect.bottom + 4,
        width: vw - 16,
        maxHeight: vh - cardRect.bottom - 16,
        overflowY: "auto" as const,
        zIndex: 9999,
      };
    }
    const tw = Math.min(cardRect.width + 32, 300);
    let lft  = cardRect.left + cardRect.width / 2 - tw / 2;
    lft = Math.max(8, Math.min(lft, vw - tw - 8));
    return {
      position: "fixed" as const,
      left: lft,
      top: cardRect.bottom + 8,
      width: tw,
      maxHeight: vh - cardRect.bottom - 16,
      overflowY: "auto" as const,
      zIndex: 9999,
    };
  })() : null;

  const tooltip =
    hovered && cardRect && tooltipStyle && mounted
      ? createPortal(
          <>
            <div
              className="fixed inset-0 sm:hidden"
              style={{ zIndex: 9998 }}
              onClick={ocultar}
            />
            <div
              style={tooltipStyle}
              onMouseEnter={() => { if (hideRef.current) clearTimeout(hideRef.current); }}
              onMouseLeave={ocultar}
              className="rounded-2xl bg-zinc-900 px-4 py-4 shadow-2xl ring-1 ring-white/15 backdrop-blur-md opacity-0 scale-95 animate-[fichaTooltip_180ms_ease_forwards]"
            >
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Descripción</p>
              <p className="text-[13px] leading-relaxed text-zinc-200">{ficha.descripcion}</p>
              <div className="mt-3 border-t border-white/10 pt-3 flex items-center gap-2">
                <Estrellas n={ficha.estrellas} />
                {ficha.precio > 0 && (
                  <span className="ml-auto shrink-0 text-xs font-semibold text-amber-400">
                    ${ficha.precio.toLocaleString("es-MX")}
                  </span>
                )}
              </div>
            </div>
          </>,
          document.body
        )
      : null;

  return (
    <>
      <article
        ref={artRef}
        className={`group ${fluida ? "w-full" : "w-60 shrink-0 snap-start sm:w-64"}`}
      >
        {/* ── IMAGEN con overlay ─────────────────────────────────── */}
        <Link
          href={`/obra/${ficha.id}`}
          className="relative block aspect-[3/4] overflow-hidden rounded-3xl bg-zinc-800 ring-1 ring-white/10"
        >
          <Image
            src={ficha.imagen}
            alt={ficha.titulo}
            fill
            sizes="256px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badge tipo */}
          <div className="absolute right-3 top-3 z-10 rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-md">
            {TIPO_LABEL[ficha.tipo]}
          </div>

          {/* Favorito */}
          <div className="absolute left-3 top-3 z-10">
            <BotonFavorito id={ficha.id} />
          </div>

          {/* Comparar */}
          {comparable && (
            <div className="absolute left-3 top-12 z-10">
              <BotonComparar id={ficha.id} />
            </div>
          )}

          {/* ── INFO OVERLAY ── gradiente en la parte inferior ─── */}
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/75 to-transparent px-4 pb-4 pt-20">
            <p className="truncate text-sm font-bold uppercase tracking-wide text-white leading-tight">
              {ficha.titulo}
            </p>
            <p className="mt-0.5 text-[10px] text-zinc-500">{ficha.anio}</p>

            <div className="mt-1.5">
              <Estrellas n={ficha.estrellas} />
            </div>

            <p className="mt-1.5 line-clamp-3 text-[11px] leading-relaxed text-zinc-300">
              {ficha.descripcion}
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-1">
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
          </div>
        </Link>

        {/* ── CÁPSULA ARTISTA — dispara el tooltip ──────────────── */}
        <div
          ref={capsulaRef}
          className="mt-3 cursor-pointer"
          onMouseEnter={mostrar}
          onMouseLeave={ocultar}
          onClick={handleTap}
        >
          <CapsulaArtista artista={ficha.artista} />
        </div>
      </article>

      {tooltip}
    </>
  );
}
