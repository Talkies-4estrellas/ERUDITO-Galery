"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  articulos,
  CATEGORIAS,
  COLOR_CATEGORIA,
  formatearFecha,
  type Articulo,
} from "@/data/articulos";

function TarjetaArticulo({ articulo, destacado }: { articulo: Articulo; destacado?: boolean }) {
  const color = COLOR_CATEGORIA[articulo.categoria] ?? "bg-zinc-400/15 text-zinc-400 ring-zinc-400/25";

  if (destacado) {
    return (
      <Link href={`/blog/${articulo.id}`}>
      <article className="group relative overflow-hidden rounded-3xl bg-zinc-900 ring-1 ring-white/10 lg:grid lg:grid-cols-[1fr_420px]">
        <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[340px]">
          <Image
            src={articulo.imagen}
            alt={articulo.titulo}
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-zinc-900/80 lg:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent lg:hidden" />
        </div>

        <div className="flex flex-col justify-center gap-4 p-6 lg:p-8">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ring-1 ${color}`}>
              {articulo.categoria}
            </span>
            <span className="text-[11px] text-zinc-500">{articulo.minLectura} min de lectura</span>
          </div>

          <h2 className="text-xl font-bold leading-snug text-white lg:text-2xl">
            {articulo.titulo}
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400 line-clamp-3">
            {articulo.extracto}
          </p>

          <div className="mt-auto flex items-center justify-between pt-2 border-t border-white/10">
            <p className="text-xs text-zinc-500">
              <span className="text-zinc-300">{articulo.autor}</span>
              {" · "}
              {formatearFecha(articulo.fecha)}
            </p>
            <span className="rounded-full bg-amber-400 px-4 py-1.5 text-xs font-bold text-zinc-900 transition group-hover:bg-amber-300">
              Leer →
            </span>
          </div>
        </div>
      </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${articulo.id}`}>
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10 transition hover:ring-white/20">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={articulo.imagen}
          alt={articulo.titulo}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/70 to-transparent" />
        <span className={`absolute left-3 bottom-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ring-1 ${color}`}>
          {articulo.categoria}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          <span>{articulo.minLectura} min</span>
          <span>·</span>
          <span>{formatearFecha(articulo.fecha)}</span>
        </div>

        <h3 className="text-sm font-bold leading-snug text-white transition group-hover:text-amber-300 line-clamp-2">
          {articulo.titulo}
        </h3>

        <p className="text-xs leading-relaxed text-zinc-500 line-clamp-2 flex-1">
          {articulo.extracto}
        </p>

        <p className="text-[11px] text-zinc-400 mt-auto pt-2 border-t border-white/5">
          {articulo.autor}
        </p>
      </div>
    </article>
    </Link>
  );
}

export default function BlogGrid() {
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const filtrados = articulos.filter((a) => {
    const okCat = !categoriaActiva || a.categoria === categoriaActiva;
    const q = busqueda.toLowerCase();
    const okQ = !q || a.titulo.toLowerCase().includes(q) || a.extracto.toLowerCase().includes(q) || a.autor.toLowerCase().includes(q);
    return okCat && okQ;
  });

  const [destacado, ...resto] = filtrados;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
      {/* Encabezado */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
          Perspectivas
        </p>
        <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
          Blog de arte
        </h1>
        <p className="mt-2 max-w-lg text-sm text-zinc-400">
          Movimientos, mercado, técnicas y entrevistas con quienes definen el arte contemporáneo.
        </p>
      </div>

      {/* Búsqueda */}
      <div className="relative mb-5 max-w-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar artículos…"
          className="w-full rounded-full bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 ring-1 ring-white/10 outline-none transition focus:ring-amber-400/50"
        />
      </div>

      {/* Filtros de categoría */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoriaActiva(null)}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
            !categoriaActiva
              ? "bg-white text-zinc-900"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
          }`}
        >
          Todos
        </button>
        {CATEGORIAS.map((cat) => {
          const color = COLOR_CATEGORIA[cat] ?? "";
          const activo = categoriaActiva === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoriaActiva(activo ? null : cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium ring-1 transition ${
                activo ? color : "bg-zinc-800 text-zinc-400 ring-white/10 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {filtrados.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/10 py-20 text-center">
          <p className="text-sm text-zinc-500">No hay artículos en esta categoría.</p>
          <button type="button" onClick={() => setCategoriaActiva(null)}
            className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 hover:bg-white/10">
            Ver todos
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Artículo destacado */}
          {destacado && !categoriaActiva && (
            <TarjetaArticulo articulo={destacado} destacado />
          )}

          {/* Grid de tarjetas */}
          {(categoriaActiva ? filtrados : resto).length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(categoriaActiva ? filtrados : resto).map((a) => (
                <TarjetaArticulo key={a.id} articulo={a} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
