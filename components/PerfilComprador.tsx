"use client";

import { useState } from "react";
import Link from "next/link";
import { usePerfil, type DatosPerfil } from "@/hooks/usePerfil";
import { useFavoritos } from "@/hooks/useFavoritos";
import { useComparacion } from "@/hooks/useComparacion";
import { fichas } from "@/data/fichas";
import FichaObra from "@/components/FichaObra";

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  if (partes.length >= 2)
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  return (nombre.slice(0, 2) || "CO").toUpperCase();
}

const INPUT =
  "w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50";

export default function PerfilComprador() {
  const { perfil, guardar, cerrarSesion } = usePerfil();
  const { favoritos } = useFavoritos();
  const { seleccion: comparando } = useComparacion();

  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState<DatosPerfil | null>(null);

  if (!perfil) return null;

  const nombreMostrar = perfil.nombre || "Coleccionista";
  const obrasColeccion = fichas.filter((f) => favoritos.includes(f.id));

  function iniciarEdicion() {
    setForm({ ...perfil! });
    setEditando(true);
  }
  function cancelar() { setForm(null); setEditando(false); }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    guardar(form);
    setEditando(false);
    setForm(null);
  }

  return (
    <div className="w-full pb-20">

      {/* ── Portada + cabecera ───────────────────────────────── */}
      <div className="relative">
        {/* Cover */}
        <div className="h-44 w-full bg-gradient-to-br from-zinc-800 via-cyan-950/40 to-zinc-900 sm:h-56" />

        {/* Info superpuesta */}
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="relative flex flex-col gap-4 pb-4 sm:flex-row sm:items-end sm:gap-6">

            {/* Avatar grande */}
            <div className="absolute -top-14 left-0 flex size-28 items-center justify-center rounded-full bg-cyan-400/20 text-4xl font-bold text-cyan-400 ring-4 ring-zinc-950 sm:-top-16 sm:size-36 sm:text-5xl">
              {iniciales(nombreMostrar)}
            </div>

            {/* Nombre + acciones (a la derecha del avatar) */}
            <div className="ml-32 mt-2 flex flex-1 flex-col gap-1 sm:ml-44 sm:mt-0">
              {editando && form ? (
                <form onSubmit={submit} className="flex flex-wrap gap-2 py-2">
                  <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
                    placeholder="Tu nombre" className={INPUT + " max-w-xs"} />
                  <input value={form.especialidad} onChange={e => setForm({...form, especialidad: e.target.value})}
                    placeholder="Intereses (ej. Arte moderno)" className={INPUT + " max-w-xs"} />
                  <input value={form.pais} onChange={e => setForm({...form, pais: e.target.value})}
                    placeholder="País" className={INPUT + " w-32"} />
                  <div className="flex gap-2">
                    <button type="submit" className="rounded-full bg-cyan-400 px-4 py-1.5 text-xs font-semibold text-zinc-900 hover:bg-cyan-300">
                      Guardar
                    </button>
                    <button type="button" onClick={cancelar} className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 hover:bg-white/10">
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-start justify-between gap-4 pt-2">
                  <div>
                    <h1 className="text-xl font-bold text-white sm:text-2xl">{nombreMostrar}</h1>
                    <p className="mt-0.5 text-sm text-zinc-400">
                      {perfil.especialidad || "Coleccionista de arte"}
                      {perfil.pais && <> · <span className="text-zinc-500">{perfil.pais}</span></>}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={iniciarEdicion}
                      className="flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-cyan-400">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                      </svg>
                      Editar
                    </button>
                    <button type="button" onClick={cerrarSesion}
                      className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-500 ring-1 ring-white/10 transition hover:text-red-400">
                      Salir
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Barra de stats */}
          <div className="mt-12 flex gap-6 border-t border-white/10 pt-3 sm:mt-2">
            {[
              { valor: favoritos.length,   etiqueta: "En colección" },
              { valor: comparando.length,  etiqueta: "Comparando"  },
              { valor: fichas.length,      etiqueta: "Obras disponibles" },
            ].map(({ valor, etiqueta }) => (
              <div key={etiqueta} className="text-center">
                <p className="text-lg font-bold text-white">{valor}</p>
                <p className="text-[11px] text-zinc-500">{etiqueta}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Layout 3 columnas ────────────────────────────────── */}
      <div className="mx-auto mt-6 max-w-6xl px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr_220px]">

          {/* ── Sidebar izquierdo ─────────────────────────────── */}
          <aside className="space-y-4">
            {/* Acerca de */}
            <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
              <h2 className="mb-3 text-sm font-semibold text-white">Acerca de</h2>
              <p className={`text-xs leading-relaxed ${perfil.bio ? "text-zinc-300" : "italic text-zinc-600"}`}>
                {perfil.bio || "Añade una descripción sobre tus intereses artísticos."}
              </p>
              {!editando && (
                <button type="button" onClick={iniciarEdicion}
                  className="mt-3 text-xs text-cyan-400 underline-offset-2 hover:underline">
                  Editar bio
                </button>
              )}
            </div>

            {/* Navegación */}
            <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
              <h2 className="mb-3 text-sm font-semibold text-white">Explorar</h2>
              <nav className="space-y-1">
                {[
                  { href: "/favoritos", label: "Mis favoritos",    badge: favoritos.length,   color: "text-amber-400"  },
                  { href: "/comparar",  label: "Comparar obras",   badge: comparando.length,  color: "text-cyan-400"   },
                  { href: "/obras",     label: "Galería",          badge: null,               color: "text-zinc-400"   },
                  { href: "/artistas",  label: "Artistas",         badge: null,               color: "text-zinc-400"   },
                  { href: "/catalogo",  label: "Catálogo",         badge: null,               color: "text-zinc-400"   },
                  { href: "/servicios", label: "Servicios",        badge: null,               color: "text-zinc-400"   },
                ].map(({ href, label, badge, color }) => (
                  <Link key={href} href={href}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white">
                    <span>{label}</span>
                    {badge !== null && badge > 0 && (
                      <span className={`text-xs font-semibold ${color}`}>{badge}</span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* ── Centro: Mi colección ──────────────────────────── */}
          <main className="min-w-0">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Mi colección</h2>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {obrasColeccion.length === 0
                    ? "Guarda obras desde la galería para verlas aquí"
                    : `${obrasColeccion.length} ${obrasColeccion.length === 1 ? "obra" : "obras"} guardadas`}
                </p>
              </div>
              <Link href="/obras"
                className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white">
                + Explorar
              </Link>
            </div>

            {obrasColeccion.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-white/10 py-16 text-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-12 text-zinc-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
                <p className="text-sm text-zinc-500">Aún no tienes obras en tu colección</p>
                <Link href="/obras"
                  className="rounded-full bg-amber-400 px-5 py-2 text-xs font-semibold text-zinc-900 transition hover:bg-amber-300">
                  Ir a la galería
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {obrasColeccion.map((ficha) => (
                  <FichaObra key={ficha.id} ficha={ficha} fluida />
                ))}
              </div>
            )}
          </main>

          {/* ── Sidebar derecho ───────────────────────────────── */}
          <aside className="space-y-4">
            {/* Actividad reciente */}
            <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
              <h2 className="mb-3 text-sm font-semibold text-white">Actividad</h2>
              <div className="space-y-3">
                {favoritos.length > 0 ? (
                  <>
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-[10px] text-amber-400">♥</span>
                      <p className="text-xs text-zinc-400">
                        <span className="font-semibold text-white">{favoritos.length}</span> obras en favoritos
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-[10px] text-cyan-400">⇄</span>
                      <p className="text-xs text-zinc-400">
                        <span className="font-semibold text-white">{comparando.length}</span> obras en comparación
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-xs italic text-zinc-600">Sin actividad reciente</p>
                )}
              </div>
            </div>

            {/* Artistas destacados */}
            {obrasColeccion.length > 0 && (
              <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                <h2 className="mb-3 text-sm font-semibold text-white">Artistas en tu colección</h2>
                <div className="space-y-2">
                  {[...new Map(obrasColeccion.map(o => [o.artista.id, o.artista])).values()].map(artista => (
                    <Link key={artista.id} href={`/artista/${artista.id}`}
                      className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-white/5">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-[11px] font-bold text-amber-400">
                        {artista.nombre.slice(0, 2).toUpperCase()}
                      </div>
                      <p className="text-xs text-zinc-300 line-clamp-1">{artista.nombre}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>

        </div>
      </div>
    </div>
  );
}
