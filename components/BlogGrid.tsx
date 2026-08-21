"use client";

import Image from "next/image";
import Link from "next/link";
import {
  articulos,
  COLOR_CATEGORIA,
  formatearFecha,
  type Articulo,
} from "@/data/articulos";

/* ── Tarjeta compacta ──────────────────────────────────────────── */
function TarjetaArticulo({ articulo }: { articulo: Articulo }) {
  const color = COLOR_CATEGORIA[articulo.categoria] ?? "bg-zinc-400/15 text-zinc-400 ring-zinc-400/25";

  return (
    <Link href={`/blog/${articulo.id}`}>
      <article className="group flex flex-col overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10 transition hover:ring-amber-400/20 h-full">
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
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            <span>{articulo.minLectura} min</span>
            <span>·</span>
            <span>{formatearFecha(articulo.fecha)}</span>
          </div>
          <h3 className="text-sm font-bold leading-snug text-white transition group-hover:text-amber-300 line-clamp-2 flex-1">
            {articulo.titulo}
          </h3>
          <p className="text-[11px] text-zinc-400 mt-auto pt-2 border-t border-white/5">
            {articulo.autor}
          </p>
        </div>
      </article>
    </Link>
  );
}

/* ── Hero del artículo principal ───────────────────────────────── */
function HeroArticulo({ articulo }: { articulo: Articulo }) {
  const color = COLOR_CATEGORIA[articulo.categoria] ?? "bg-zinc-400/15 text-zinc-400 ring-zinc-400/25";

  return (
    <Link href={`/blog/${articulo.id}`}>
      <article className="group relative overflow-hidden rounded-3xl" style={{ minHeight: "420px" }}>
        <Image
          src={articulo.imagen}
          alt={articulo.titulo}
          fill
          sizes="100vw"
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent" />

        <div className="relative flex h-full flex-col justify-end p-8 sm:p-12" style={{ minHeight: "420px" }}>
          <div className="max-w-xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ring-1 ${color}`}>
                {articulo.categoria}
              </span>
              <span className="text-xs text-zinc-400">
                {articulo.minLectura} min de lectura · {formatearFecha(articulo.fecha)}
              </span>
            </div>
            <h2 className="text-2xl font-bold leading-snug text-white sm:text-3xl lg:text-4xl">
              {articulo.titulo}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300 line-clamp-2 sm:line-clamp-3">
              {articulo.extracto}
            </p>
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <p className="text-xs text-zinc-400">
                Por <span className="text-white">{articulo.autor}</span>
              </p>
              <span className="rounded-full bg-amber-400 px-5 py-2 text-xs font-bold text-zinc-900 transition group-hover:bg-amber-300">
                Leer artículo →
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ── BlogGrid principal ────────────────────────────────────────── */
export default function BlogGrid() {
  const [hero, ...resto] = articulos;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
      {/* Hero */}
      <div className="mb-12">
        <HeroArticulo articulo={hero} />
      </div>

      {/* Sub-encabezado */}
      <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Más artículos · {resto.length} publicaciones
      </p>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resto.map((a) => (
          <TarjetaArticulo key={a.id} articulo={a} />
        ))}
      </div>
    </div>
  );
}
