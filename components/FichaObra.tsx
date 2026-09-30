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
  const [hovered, setHovered]     = useState(false);
  const [cardRect, setCardRect]   = useState<DOMRect | null>(null);
  const [mounted, setMounted]     = useState(false);
  const artRef  = useRef<HTMLElement>(null);
  const imgRef  = useRef<HTMLAnchorElement>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const mostrar = useCallback(() => {
    if (hideRef.current) clearTimeout(hideRef.current);
    /* Usa solo el rect de la imagen para no incluir el panel de info */
    if (imgRef.current) setCardRect(imgRef.current.getBoundingClientRect());
    setHovered(true);
  }, []);

  const ocultar = useCallback(() => {
    hideRef.current = setTimeout(() => {
      setHovered(false);
      setCardRect(null);
    }, 80);
  }, []);

  /* Cierra el tooltip si el usuario hace scroll vertical de la página */
  useEffect(() => {
    if (!hovered) return;
    const cerrar = () => { setHovered(false); setCardRect(null); };
    window.addEventListener("scroll", cerrar, { passive: true });
    return () => window.removeEventListener("scroll", cerrar);
  }, [hovered]);

  /* Calcula posición del tooltip (fixed) */
  const tooltipStyle = cardRect ? (() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const tw = Math.min(cardRect.width + 32, 300);
    let lft  = cardRect.left + cardRect.width / 2 - tw / 2;
    lft = Math.max(8, Math.min(lft, vw - tw - 8));

    /* Espacio disponible abajo y arriba */
    const spaceBelow = vh - cardRect.bottom - 12;
    const spaceAbove = cardRect.top - 12;

    /* Mostrar abajo si cabe al menos 120 px, si no arriba */
    if (spaceBelow >= 120) {
      return {
        position: "fixed" as const,
        left: lft, top: cardRect.bottom + 8,
        width: tw, maxHeight: spaceBelow, overflowY: "auto" as const,
        zIndex: 9999,
      };
    }
    return {
      position: "fixed" as const,
      left: lft, bottom: vh - cardRect.top + 8,
      width: tw, maxHeight: Math.max(spaceAbove, 120), overflowY: "auto" as const,
      zIndex: 9999,
    };
  })() : {};

  const tooltip =
    hovered && cardRect && mounted
      ? createPortal(
          <div
            style={tooltipStyle}
            onMouseEnter={() => { if (hideRef.current) clearTimeout(hideRef.current); }}
            onMouseLeave={ocultar}
            className="rounded-2xl bg-zinc-900 px-4 py-4 shadow-2xl ring-1 ring-white/15 backdrop-blur-md
                       opacity-0 scale-95 animate-[fichaTooltip_180ms_ease_forwards]"
          >
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              Descripción
            </p>
            <p className="text-[13px] leading-relaxed text-zinc-200">{ficha.descripcion}</p>
            <div className="mt-3 border-t border-white/10 pt-3 flex items-center gap-2">
              <Estrellas n={ficha.estrellas} />
              {ficha.precio > 0 && (
                <span className="ml-auto shrink-0 text-xs font-semibold text-amber-400">
                  ${ficha.precio.toLocaleString("es-MX")}
                </span>
              )}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <article
        ref={artRef}
        className={`group ${fluida ? "w-full" : "w-60 shrink-0 snap-start sm:w-64"}`}
        onMouseEnter={mostrar}
        onMouseLeave={ocultar}
      >
        {/* ── IMAGEN ─────────────────────────────────────────── */}
        <Link
          ref={imgRef}
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

          {/* Botón "Ver obra" — aparece en hover */}
          <div
            className="absolute inset-x-4 bottom-4 transition-opacity duration-300"
            style={{ opacity: hovered ? 1 : 0 }}
          >
            <div className="w-full rounded-full bg-amber-300 py-2.5 text-center text-xs font-bold text-zinc-900">
              Ver obra
            </div>
          </div>
        </Link>

        {/* ── PANEL DE INFO — siempre visible ────────────────── */}
        <div className="mt-3 rounded-2xl bg-zinc-900/95 px-4 py-3.5 ring-1 ring-white/10">

          {/* Título + año */}
          <p className="truncate text-sm font-bold uppercase tracking-wide text-white leading-tight">
            {ficha.titulo}
          </p>
          <p className="mt-0.5 text-[10px] text-zinc-500">{ficha.anio}</p>

          {/* Estrellas */}
          <div className="mt-2">
            <Estrellas n={ficha.estrellas} />
          </div>

          {/* Descripción — truncada, el tooltip muestra la completa */}
          <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-zinc-400">
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
      </article>

      {tooltip}
    </>
  );
}
