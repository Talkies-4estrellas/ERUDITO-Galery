"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { DatosPerfil } from "@/hooks/usePerfil";
import type { ObraEmpresa } from "@/hooks/useObrasEmpresa";

const CLAVE_PERFIL = "erudito-perfil";
const CLAVE_OBRAS  = "erudito-mis-obras-empresa";

function iniciales(nombre: string): string {
  const p = nombre.trim().split(/\s+/);
  if (p.length >= 2) return (p[0][0] + p[p.length - 1][0]).toUpperCase();
  return (nombre.slice(0, 2) || "GA").toUpperCase();
}

interface Props { slug: string }

export default function PerfilPublicoEmpresa({ slug }: Props) {
  const [perfil, setPerfil] = useState<DatosPerfil | null>(null);
  const [obras,  setObras]  = useState<ObraEmpresa[]>([]);
  const [listo,  setListo]  = useState(false);
  const [artistaActivo, setArtistaActivo] = useState<string | null>(null);

  useEffect(() => {
    try {
      const rawP = localStorage.getItem(CLAVE_PERFIL);
      const rawO = localStorage.getItem(CLAVE_OBRAS);
      const p: DatosPerfil | null = rawP ? JSON.parse(rawP) : null;
      const o: ObraEmpresa[]      = rawO ? JSON.parse(rawO) : [];
      if (p?.rol === "empresa" && p?.slug === slug) {
        setPerfil(p);
        setObras(o);
      }
    } catch { /* noop */ }
    setListo(true);
  }, [slug]);

  if (!listo) return null;

  if (!perfil) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex size-20 items-center justify-center rounded-2xl bg-violet-500/10 text-4xl font-bold text-violet-400">
          GA
        </div>
        <h1 className="text-xl font-semibold text-white">Galería no encontrada</h1>
        <p className="max-w-sm text-sm text-zinc-500">
          La galería «{slug}» no existe o aún no ha publicado su perfil en ERUDITO.
        </p>
        <Link href="/obras"
          className="rounded-full bg-white/5 px-5 py-2 text-sm text-zinc-400 ring-1 ring-white/10 hover:bg-white/10">
          Ver galería
        </Link>
      </div>
    );
  }

  const artistasRepresentados = [...new Set(obras.map(o => o.nombreArtista).filter(Boolean))];
  const obrasMostradas = artistaActivo
    ? obras.filter(o => o.nombreArtista === artistaActivo)
    : obras;
  const totalValor = obras.filter(o => o.precio > 0).reduce((s, o) => s + o.precio, 0);

  return (
    <div className="w-full pb-20">

      {/* ── PORTADA ─────────────────────────────────────────────── */}
      <div className="relative">
        <div className="h-48 w-full bg-gradient-to-br from-zinc-800 via-violet-950/40 to-zinc-900 sm:h-60" />

        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="relative flex flex-col gap-3 pb-4 sm:flex-row sm:items-end sm:gap-6">

            {/* Avatar cuadrado empresa */}
            <div className="absolute -top-14 left-0 flex size-28 shrink-0 items-center justify-center rounded-2xl bg-violet-500 text-4xl font-bold text-white ring-4 ring-zinc-950 sm:-top-16 sm:size-36 sm:text-5xl">
              {iniciales(perfil.nombre || "GA")}
            </div>

            <div className="ml-32 mt-2 flex flex-1 items-start justify-between gap-3 pt-2 sm:ml-44 sm:mt-0">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white sm:text-2xl">
                    {perfil.nombre || "Galería sin nombre"}
                  </h1>
                  <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-violet-400 ring-1 ring-violet-400/30">
                    Galería
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-zinc-400">
                  {perfil.especialidad || "Galería de arte"}
                  {perfil.pais && <> · <span className="text-zinc-500">{perfil.pais}</span></>}
                </p>
              </div>
              <Link href="/perfil"
                className="hidden shrink-0 rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 sm:block">
                Editar perfil
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-14 flex gap-6 border-t border-white/10 pt-3 sm:mt-2">
            {[
              { valor: obras.length,                 etiqueta: "Obras"              },
              { valor: artistasRepresentados.length,  etiqueta: "Artistas"           },
              { valor: totalValor > 0 ? `$${(totalValor/1000).toFixed(0)}k` : "—",
                                                     etiqueta: "Valor en catálogo"  },
            ].map(({ valor, etiqueta }) => (
              <div key={etiqueta} className="text-center">
                <p className="text-lg font-bold text-white">{valor}</p>
                <p className="text-[11px] text-zinc-500">{etiqueta}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CUERPO ──────────────────────────────────────────────── */}
      <div className="mx-auto mt-6 max-w-6xl px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Bio */}
            <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
              <h2 className="mb-2 text-sm font-semibold text-white">Acerca de</h2>
              <p className={`text-xs leading-relaxed ${perfil.bio ? "text-zinc-300" : "italic text-zinc-600"}`}>
                {perfil.bio || "Esta galería aún no ha añadido una descripción."}
              </p>
            </div>

            {/* Artistas representados */}
            {artistasRepresentados.length > 0 && (
              <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                <h2 className="mb-3 text-sm font-semibold text-white">Artistas representados</h2>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setArtistaActivo(null)}
                    className={`w-full rounded-xl px-3 py-2 text-left text-xs transition hover:bg-white/5 ${!artistaActivo ? "bg-violet-500/10 font-semibold text-violet-400" : "text-zinc-400"}`}
                  >
                    Todos ({obras.length})
                  </button>
                  {artistasRepresentados.map(nombre => {
                    const count = obras.filter(o => o.nombreArtista === nombre).length;
                    return (
                      <button
                        key={nombre}
                        type="button"
                        onClick={() => setArtistaActivo(nombre === artistaActivo ? null : nombre)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition hover:bg-white/5 ${artistaActivo === nombre ? "bg-violet-500/10 font-semibold text-violet-400" : "text-zinc-300"}`}
                      >
                        <span>{nombre}</span>
                        <span className={`text-[10px] ${artistaActivo === nombre ? "text-violet-400" : "text-zinc-600"}`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

          {/* Obras */}
          <main className="min-w-0">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {artistaActivo ? `Obras de ${artistaActivo}` : "Catálogo"}
                </h2>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {obrasMostradas.length === 0
                    ? "Sin obras publicadas"
                    : `${obrasMostradas.length} ${obrasMostradas.length === 1 ? "obra" : "obras"}`}
                </p>
              </div>
              {artistaActivo && (
                <button type="button" onClick={() => setArtistaActivo(null)}
                  className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 hover:bg-white/10">
                  Ver todas
                </button>
              )}
            </div>

            {obrasMostradas.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/10 py-16 text-center">
                <p className="text-sm text-zinc-500">Esta galería aún no ha publicado obras</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {obrasMostradas.map(obra => (
                  <TarjetaPublica key={obra.id} obra={obra} onFiltrar={setArtistaActivo} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function TarjetaPublica({ obra, onFiltrar }: { obra: ObraEmpresa; onFiltrar: (a: string) => void }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10 transition hover:ring-violet-400/30">
      <div className="relative aspect-[3/4] bg-zinc-800">
        {obra.imagen ? (
          <Image src={obra.imagen} alt={obra.titulo} fill sizes="220px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-10 text-zinc-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
            </svg>
          </div>
        )}

        {/* Desenfoque progresivo */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] backdrop-blur-md"
          style={{ WebkitMaskImage: "linear-gradient(to top, black 30%, transparent 90%)", maskImage: "linear-gradient(to top, black 30%, transparent 90%)" }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-zinc-950/80 to-transparent" />

        {/* Artista — al hacer clic filtra las obras de ese artista */}
        <button
          type="button"
          onClick={() => onFiltrar(obra.nombreArtista)}
          className="absolute bottom-3 left-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-violet-500/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm transition hover:bg-violet-400"
        >
          <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-white/20 text-[8px] font-bold">
            {obra.nombreArtista.slice(0,1).toUpperCase()}
          </div>
          <span className="truncate">{obra.nombreArtista}</span>
          <span className="ml-auto text-[9px] font-normal opacity-70">Ver obras →</span>
        </button>
      </div>

      <div className="p-3">
        <p className="truncate text-xs font-bold uppercase tracking-wide text-white">{obra.titulo}</p>
        <p className="mt-0.5 text-[10px] text-zinc-500">
          {obra.anio}{obra.tecnica && ` · ${obra.tecnica}`}
        </p>
        {obra.precio > 0 && (
          <p className="mt-1 text-xs font-semibold text-violet-400">
            ${obra.precio.toLocaleString("en-US")} USD
          </p>
        )}
      </div>
    </div>
  );
}
