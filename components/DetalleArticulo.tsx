import Image from "next/image";
import Link from "next/link";
import type { Articulo } from "@/data/articulos";
import { COLOR_CATEGORIA, formatearFecha } from "@/data/articulos";

interface Props {
  articulo: Articulo;
  relacionados: Articulo[];
}

export default function DetalleArticulo({ articulo, relacionados }: Props) {
  const color = COLOR_CATEGORIA[articulo.categoria] ?? "bg-zinc-400/15 text-zinc-400 ring-zinc-400/25";

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
        <Image
          src={articulo.imagen}
          alt={articulo.titulo}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[80%] backdrop-blur-xl"
          style={{
            WebkitMaskImage: "linear-gradient(to top, black 45%, transparent 90%)",
            maskImage: "linear-gradient(to top, black 45%, transparent 90%)",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-zinc-950/95 via-zinc-950/50 to-transparent" />

        {/* Volver */}
        <Link
          href="/blog"
          className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-1.5 text-xs text-white backdrop-blur-md transition hover:bg-black/60"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Blog
        </Link>

        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-8 sm:px-8">
          <div className="mx-auto max-w-3xl space-y-3">
            <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-[11px] font-semibold uppercase tracking-widest ring-1 ${color}`}>
              {articulo.categoria}
            </span>
            <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
              {articulo.titulo}
            </h1>
          </div>
        </div>
      </section>

      {/* ── CUERPO ───────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_260px]">

          {/* Artículo */}
          <article>
            {/* Meta autor */}
            <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-sm font-bold text-amber-400">
                {articulo.autor.slice(0, 1)}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{articulo.autor}</p>
                <p className="text-xs text-zinc-500">
                  {formatearFecha(articulo.fecha)} · {articulo.minLectura} min de lectura
                </p>
              </div>
            </div>

            {/* Extracto destacado */}
            <p className="mb-8 text-base font-medium leading-relaxed text-zinc-300 sm:text-lg">
              {articulo.extracto}
            </p>

            {/* Párrafos del contenido */}
            <div className="space-y-5">
              {articulo.contenido.map((parrafo, i) => (
                <p key={i} className="text-sm leading-relaxed text-zinc-400 sm:text-base">
                  {parrafo}
                </p>
              ))}
            </div>

            {/* Etiqueta categoría al pie */}
            <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6">
              <p className="text-xs text-zinc-500">Categoría</p>
              <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-[11px] font-semibold uppercase tracking-widest ring-1 ${color}`}>
                {articulo.categoria}
              </span>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Sobre el autor */}
            <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Autor</p>
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-lg font-bold text-amber-400">
                  {articulo.autor.slice(0, 1)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{articulo.autor}</p>
                  <p className="text-xs text-zinc-500">Colaborador ERUDITO</p>
                </div>
              </div>
            </div>

            {/* Artículos relacionados */}
            {relacionados.length > 0 && (
              <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">Más artículos</p>
                <div className="space-y-4">
                  {relacionados.map((rel) => {
                    const relColor = COLOR_CATEGORIA[rel.categoria] ?? "";
                    return (
                      <Link key={rel.id} href={`/blog/${rel.id}`} className="group flex gap-3">
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                          <Image src={rel.imagen} alt={rel.titulo} fill sizes="56px" className="object-cover transition group-hover:scale-105" />
                        </div>
                        <div className="min-w-0">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest ring-1 ${relColor}`}>
                            {rel.categoria}
                          </span>
                          <p className="mt-0.5 text-xs font-semibold leading-snug text-white transition group-hover:text-amber-300 line-clamp-2">
                            {rel.titulo}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <Link href="/blog" className="mt-4 flex items-center gap-1 text-xs text-zinc-500 transition hover:text-amber-400">
                  Ver todos los artículos →
                </Link>
              </div>
            )}

            {/* CTA Newsletter */}
            <div className="rounded-2xl bg-amber-400/5 p-5 ring-1 ring-amber-400/20">
              <p className="text-sm font-bold text-white">Newsletter ERUDITO</p>
              <p className="mt-1 text-xs text-zinc-400">Novedades de arte, subastas y análisis de mercado cada semana.</p>
              <Link href="/#newsletter"
                className="mt-3 flex items-center justify-center rounded-full bg-amber-400 py-2 text-xs font-bold text-zinc-900 transition hover:bg-amber-300">
                Suscribirme
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
