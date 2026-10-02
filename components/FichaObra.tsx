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

  /* Cierre suave para hover en desktop — no-op en táctil */
  const ocultar = useCallback(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    hideRef.current = setTimeout(() => {
      setHovered(false);
      setCardRect(null);
    }, 80);
  }, []);

  /* Cierre inmediato para tap, scroll y backdrop */
  const cerrar = useCallback(() => {
    if (hideRef.current) clearTimeout(hideRef.current);
    setHovered(false);
    setCardRect(null);
  }, []);

  const handleTap = useCallback(() => {
    if (hovered) { cerrar(); } else { mostrar(); }
  }, [hovered, cerrar, mostrar]);

  useEffect(() => {
    if (!hovered) return;
    window.addEventListener("scroll", cerrar, { passive: true });
    return () => window.removeEventListener("scroll", cerrar);
  }, [hovered, cerrar]);

  const tooltipStyle = cardRect ? (() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    /* Móvil: mismo ancho y posición exacta de la tarjeta, sin clamping */
    if (vw < 640) {
      return {
        position: "fixed" as const,
        left: cardRect.left,
        top: cardRect.bottom + 4,
        width: cardRect.width,
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
              onClick={cerrar}
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

          {/* Catálogo: gradiente + blur + texto */}
          {fluida && <>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[8] h-[45%] sm:h-[72%] bg-gradient-to-t from-zinc-500/90 via-zinc-400/50 to-transparent" />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[9] backdrop-blur-sm h-[45%] sm:h-[72%]"
              style={{
                maskImage: "linear-gradient(to top, black 40%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to top, black 40%, transparent 100%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 z-10 px-2 sm:px-4 pb-3 sm:pb-4 pt-8 sm:pt-20">
              <div className="flex items-baseline justify-between gap-2 mb-1.5">
                <p className="truncate font-bold uppercase tracking-wide text-white leading-tight text-[10px] sm:text-sm">
                  {ficha.titulo}
                </p>
                <span className="hidden sm:inline shrink-0 font-medium text-zinc-300 text-[10px]">
                  {ficha.anio}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-[8px] font-semibold uppercase tracking-widest text-zinc-500 mb-0.5">Descripción</p>
                <p className="line-clamp-2 text-[11px] leading-relaxed text-zinc-300">{ficha.descripcion}</p>
              </div>
              <div className="hidden sm:flex justify-center mt-2">
                <Estrellas n={ficha.estrellas} />
              </div>
              {ficha.precio > 0 && (
                <span className="sm:hidden mt-1 block text-[10px] font-semibold text-amber-400">
                  ${ficha.precio.toLocaleString("es-MX")}
                </span>
              )}
            </div>
          </>}

          {/* Home: panel semitransparente */}
          {!fluida && (
            <div
              className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4 pt-4 backdrop-blur-md"
              style={{ background: "rgba(60,57,54,0.45)" }}
            >
              <div className="flex items-baseline justify-between gap-2 mb-1.5">
                <p className="truncate font-bold uppercase tracking-wide text-white leading-tight text-sm">
                  {ficha.titulo}
                </p>
                <span className="shrink-0 font-medium text-zinc-300 text-[10px]">
                  {ficha.anio}
                </span>
              </div>
              <p className="text-[8px] font-semibold uppercase tracking-widest text-zinc-500 mb-0.5">Descripción</p>
              <p className="line-clamp-2 text-[11px] leading-relaxed text-zinc-300">{ficha.descripcion}</p>
              <div className="flex justify-center mt-2">
                <Estrellas n={ficha.estrellas} />
              </div>
            </div>
          )}
        </Link>

        {/* ── CÁPSULA ARTISTA — dispara el tooltip ──────────────── */}
        <div
          ref={capsulaRef}
          className="mt-3 cursor-pointer"
          onMouseEnter={mostrar}
          onMouseLeave={ocultar}
          onClick={handleTap}
        >
          <CapsulaArtista artista={ficha.artista} compacta={fluida} />
        </div>
      </article>

      {tooltip}
    </>
  );
}
