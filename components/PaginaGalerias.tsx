"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Galeria } from "@/lib/db";

function iniciales(nombre: string): string {
  const p = nombre.trim().split(/\s+/);
  if (p.length >= 2) return (p[0][0] + p[p.length - 1][0]).toUpperCase();
  return (nombre.slice(0, 2) || "GA").toUpperCase();
}

const POR_PAGINA = 20;

interface Props {
  galerias: Galeria[];
}

export default function PaginaGalerias({ galerias }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [pagina,   setPagina]   = useState(1);

  const filtradas = useMemo(() => {
    setPagina(1);
    const q = busqueda.trim().toLowerCase();
    if (!q) return galerias;
    return galerias.filter(
      (g) =>
        g.nombre.toLowerCase().includes(q) ||
        g.especialidad.toLowerCase().includes(q) ||
        g.pais.toLowerCase().includes(q)
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [galerias, busqueda]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginadas    = filtradas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-8">

      {/* Encabezado */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-wide text-white">Galerías</h1>
        <p className="text-sm text-zinc-400">
          Instituciones y espacios de arte que forman parte de ERUDITO.
        </p>
      </div>

      {/* Buscador */}
      <div className="relative mt-6">
        <svg className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
          fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, especialidad o país…"
          className="w-full rounded-xl bg-zinc-900 py-2.5 pl-9 pr-4 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 outline-none focus:ring-violet-400/50"
        />
      </div>

      {/* Contador */}
      <p className="mt-4 text-xs text-zinc-500">
        {filtradas.length} {filtradas.length === 1 ? "galería" : "galerías"}
        {busqueda.trim() && " encontradas"}
      </p>

      {/* Grid */}
      {filtradas.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/10 py-20 text-center">
          <p className="text-sm text-zinc-500">
            {busqueda.trim() ? "Sin galerías con esa búsqueda" : "Próximamente galerías e instituciones de arte"}
          </p>
          {busqueda.trim() && (
            <button
              type="button"
              onClick={() => setBusqueda("")}
              className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 hover:bg-white/10"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginadas.map((galeria) => (
            <TarjetaGaleria key={galeria.email} galeria={galeria} />
          ))}
        </div>
      )}

      {filtradas.length > 0 && totalPaginas > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => { setPagina((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            disabled={pagina === 1}
            className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-300 ring-1 ring-white/10 transition hover:bg-violet-400/10 hover:text-violet-400 hover:ring-violet-400/20 disabled:opacity-30 disabled:pointer-events-none"
          >
            ←
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => { setPagina(n); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`rounded-full px-4 py-2 text-sm ring-1 transition ${
                n === pagina
                  ? "bg-violet-400 text-zinc-900 ring-violet-400 font-semibold"
                  : "bg-zinc-800 text-zinc-300 ring-white/10 hover:bg-violet-400/10 hover:text-violet-400 hover:ring-violet-400/20"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => { setPagina((p) => Math.min(totalPaginas, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            disabled={pagina === totalPaginas}
            className="rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-300 ring-1 ring-white/10 transition hover:bg-violet-400/10 hover:text-violet-400 hover:ring-violet-400/20 disabled:opacity-30 disabled:pointer-events-none"
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}

function TarjetaGaleria({ galeria }: { galeria: Galeria }) {
  const href = galeria.slug ? `/empresa/${galeria.slug}` : `/empresa/${galeria.nombre.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10 transition hover:ring-violet-400/40"
    >
      {/* Banner mini */}
      <div className="relative h-20 overflow-hidden bg-gradient-to-br from-zinc-800 via-violet-950/40 to-zinc-900">
        {galeria.banner_url && (
          <Image src={galeria.banner_url} alt="" fill sizes="320px" className="object-cover opacity-60" />
        )}

        {/* Avatar */}
        <div className="absolute -bottom-6 left-4 size-14 overflow-hidden rounded-xl ring-2 ring-zinc-900">
          {galeria.avatar_url ? (
            <Image src={galeria.avatar_url} alt={galeria.nombre} fill sizes="56px" className="object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center bg-violet-500 text-lg font-bold text-white">
              {iniciales(galeria.nombre)}
            </div>
          )}
        </div>

        {/* Badge obras */}
        {galeria.obraCount > 0 && (
          <div className="absolute right-3 top-3 rounded-full bg-zinc-900/80 px-2 py-0.5 text-[10px] font-semibold text-violet-400 ring-1 ring-violet-400/30 backdrop-blur-sm">
            {galeria.obraCount} {galeria.obraCount === 1 ? "obra" : "obras"}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-4 pb-4 pt-8">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-white group-hover:text-violet-300 transition">
              {galeria.nombre}
            </h2>
            <p className="mt-0.5 truncate text-[11px] text-zinc-400">
              {galeria.especialidad || "Galería de arte"}
              {galeria.pais && <> · {galeria.pais}</>}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-violet-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-violet-400 ring-1 ring-violet-400/20">
            Galería
          </span>
        </div>

        {galeria.bio && (
          <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-zinc-500">
            {galeria.bio}
          </p>
        )}

        <p className="mt-3 text-[11px] font-medium text-violet-400 transition group-hover:text-violet-300">
          Ver galería →
        </p>
      </div>
    </Link>
  );
}
