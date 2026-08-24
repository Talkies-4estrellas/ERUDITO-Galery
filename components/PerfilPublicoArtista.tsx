"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { ObraPropia } from "@/hooks/useObrasArtista";

function iniciales(nombre: string): string {
  const p = nombre.trim().split(/\s+/);
  if (p.length >= 2) return (p[0][0] + p[p.length - 1][0]).toUpperCase();
  return (nombre.slice(0, 2) || "AR").toUpperCase();
}

interface Artista {
  nombre: string;
  bio: string;
  especialidad: string;
  pais: string;
  slug: string;
  avatar_url?: string;
  banner_url?: string;
  email: string;
}

interface Props { slug: string }

export default function PerfilPublicoArtista({ slug }: Props) {
  const [artista, setArtista] = useState<Artista | null>(null);
  const [obras,   setObras]   = useState<ObraPropia[]>([]);
  const [listo,   setListo]   = useState(false);
  const [filtroTecnica, setFiltroTecnica] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("usuarios")
          .select("nombre, bio, especialidad, pais, slug, avatar_url, banner_url, email")
          .eq("slug", slug)
          .eq("rol", "artista")
          .single();

        if (data) {
          setArtista({
            nombre:      data.nombre ?? "",
            bio:         data.bio ?? "",
            especialidad: data.especialidad ?? "",
            pais:        data.pais ?? "",
            slug:        data.slug ?? slug,
            avatar_url:  data.avatar_url ?? undefined,
            banner_url:  data.banner_url ?? undefined,
            email:       data.email ?? "",
          });
          const res = await fetch(`/api/artista/obras?email=${encodeURIComponent(data.email ?? "")}`)
            .then(r => r.json()).catch(() => ({ obras: [] }));
          const todasObras: ObraPropia[] = res.obras ?? [];
          setObras(todasObras.filter((o: ObraPropia) => o.estado === "aprobada"));
        }
      } catch { /* noop */ }
      setListo(true);
    })();
  }, [slug]);

  if (!listo) return null;

  if (!artista) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-amber-400/10 text-4xl font-bold text-amber-400">
          AR
        </div>
        <h1 className="text-xl font-semibold text-white">Artista no encontrado</h1>
        <p className="max-w-sm text-sm text-zinc-500">
          El perfil «{slug}» no existe o aún no ha publicado su perfil en ERUDITO.
        </p>
        <Link href="/artistas"
          className="rounded-full bg-white/5 px-5 py-2 text-sm text-zinc-400 ring-1 ring-white/10 hover:bg-white/10">
          Ver artistas
        </Link>
      </div>
    );
  }

  const tecnicas = [...new Set(obras.map(o => o.tecnica).filter(Boolean))];
  const obrasMostradas = filtroTecnica ? obras.filter(o => o.tecnica === filtroTecnica) : obras;
  const totalValor = obras.filter(o => o.precio > 0).reduce((s, o) => s + o.precio, 0);

  return (
    <div className="w-full pb-20">

      {/* ── PORTADA ─────────────────────────────────────────── */}
      <div className="relative">
        {artista.banner_url ? (
          <div className="h-48 w-full overflow-hidden sm:h-60">
            <img src={artista.banner_url} alt="" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-amber-950/60 via-zinc-900 to-zinc-950 sm:h-60" />
        )}

        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="relative flex flex-col gap-3 pb-4 sm:flex-row sm:items-end sm:gap-6">

            {/* Avatar */}
            <div className="absolute -top-14 left-0 size-28 overflow-hidden rounded-full ring-4 ring-zinc-950 sm:-top-16 sm:size-36">
              {artista.avatar_url ? (
                <Image src={artista.avatar_url} alt={artista.nombre} fill sizes="144px" className="object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center bg-amber-400 text-4xl font-bold text-zinc-900 sm:text-5xl">
                  {iniciales(artista.nombre || "AR")}
                </div>
              )}
            </div>

            <div className="ml-32 mt-2 flex flex-1 items-start justify-between gap-3 pt-2 sm:ml-44 sm:mt-0">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white sm:text-2xl">
                    {artista.nombre || "Artista"}
                  </h1>
                  <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-amber-400 ring-1 ring-amber-400/30">
                    Artista
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-zinc-400">
                  {artista.especialidad || "Arte"}
                  {artista.pais && <> · <span className="text-zinc-500">{artista.pais}</span></>}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-14 flex gap-6 border-t border-white/10 pt-3 sm:mt-2">
            {[
              { valor: obras.length,                                                       etiqueta: "Obras" },
              { valor: tecnicas.length,                                                    etiqueta: "Técnicas" },
              { valor: totalValor > 0 ? `$${(totalValor / 1000).toFixed(0)}k` : "—",     etiqueta: "Valor en catálogo" },
            ].map(({ valor, etiqueta }) => (
              <div key={etiqueta} className="text-center">
                <p className="text-lg font-bold text-white">{valor}</p>
                <p className="text-[11px] text-zinc-500">{etiqueta}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CUERPO ──────────────────────────────────────────── */}
      <div className="mx-auto mt-6 max-w-6xl px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">

          {/* Sidebar */}
          <aside className="space-y-4">

            {/* Bio */}
            <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
              <h2 className="mb-2 text-sm font-semibold text-white">Acerca del artista</h2>
              <p className={`text-xs leading-relaxed ${artista.bio ? "text-zinc-300" : "italic text-zinc-600"}`}>
                {artista.bio || "Este artista aún no ha añadido una biografía."}
              </p>
            </div>

            {/* Técnicas */}
            {tecnicas.length > 0 && (
              <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                <h2 className="mb-3 text-sm font-semibold text-white">Técnicas</h2>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setFiltroTecnica(null)}
                    className={`w-full rounded-xl px-3 py-2 text-left text-xs transition hover:bg-white/5 ${!filtroTecnica ? "bg-amber-400/10 font-semibold text-amber-400" : "text-zinc-400"}`}
                  >
                    Todas ({obras.length})
                  </button>
                  {tecnicas.map(tec => {
                    const count = obras.filter(o => o.tecnica === tec).length;
                    return (
                      <button
                        key={tec}
                        type="button"
                        onClick={() => setFiltroTecnica(tec === filtroTecnica ? null : tec)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition hover:bg-white/5 ${filtroTecnica === tec ? "bg-amber-400/10 font-semibold text-amber-400" : "text-zinc-300"}`}
                      >
                        <span>{tec}</span>
                        <span className={`text-[10px] ${filtroTecnica === tec ? "text-amber-400" : "text-zinc-600"}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Link al catálogo */}
            <Link href="/catalogo/fisicos"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900/70 p-4 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-zinc-900 hover:text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
              </svg>
              Explorar catálogo completo
            </Link>
          </aside>

          {/* Obras */}
          <main className="min-w-0">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {filtroTecnica ? `${filtroTecnica}` : "Obras"}
                </h2>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {obrasMostradas.length === 0
                    ? "Sin obras publicadas"
                    : `${obrasMostradas.length} ${obrasMostradas.length === 1 ? "obra" : "obras"}`}
                </p>
              </div>
              {filtroTecnica && (
                <button type="button" onClick={() => setFiltroTecnica(null)}
                  className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 hover:bg-white/10">
                  Ver todas
                </button>
              )}
            </div>

            {obrasMostradas.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/10 py-16 text-center">
                <p className="text-sm text-zinc-500">
                  {filtroTecnica
                    ? `No hay obras de "${filtroTecnica}" en este perfil`
                    : "Este artista aún no tiene obras publicadas"}
                </p>
                {filtroTecnica ? (
                  <button type="button" onClick={() => setFiltroTecnica(null)}
                    className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 hover:bg-white/10">
                    Ver todas las obras
                  </button>
                ) : (
                  <Link href="/artistas"
                    className="rounded-full bg-white/5 px-5 py-2 text-xs text-zinc-400 ring-1 ring-white/10 hover:bg-white/10">
                    Ver otros artistas
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {obrasMostradas.map(obra => (
                  <TarjetaObraPublica key={obra.id} obra={obra} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function TarjetaObraPublica({ obra }: { obra: ObraPropia }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10 transition hover:ring-amber-400/30">
      <div className="relative aspect-[3/4] bg-zinc-800">
        {obra.imagen ? (
          <Image src={obra.imagen} alt={obra.titulo} fill sizes="220px"
            className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-10 text-zinc-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
            </svg>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-zinc-950/80 to-transparent" />
      </div>

      <div className="p-3">
        <p className="truncate text-xs font-bold uppercase tracking-wide text-white">{obra.titulo}</p>
        <p className="mt-0.5 text-[10px] text-zinc-500">
          {obra.anio}{obra.tecnica && ` · ${obra.tecnica}`}
        </p>
        {obra.precio > 0 && (
          <p className="mt-1 text-xs font-semibold text-amber-400">
            ${obra.precio.toLocaleString("es-MX")} MXN
          </p>
        )}
        <span className="mt-1.5 inline-block rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-zinc-500 ring-1 ring-white/10">
          {obra.tipo}
        </span>
      </div>
    </div>
  );
}
