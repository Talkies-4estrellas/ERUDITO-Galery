"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePerfil, type DatosPerfil } from "@/hooks/usePerfil";
import { useAuth } from "@/hooks/useAuth";
import { useFavoritos } from "@/hooks/useFavoritos";
import { useComparacion } from "@/hooks/useComparacion";
import { getFichas } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import type { FichaArte } from "@/data/fichas";
import FichaObra from "@/components/FichaObra";

type Vista = "coleccion" | "favoritos" | "artistas" | "comparar" | "ajustes";

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  if (partes.length >= 2)
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  return (nombre.slice(0, 2) || "CO").toUpperCase();
}

const INPUT =
  "w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50";

async function aWebP(file: File): Promise<Blob> {
  const img = new Image();
  const blobUrl = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      canvas.toBlob(
        blob => { URL.revokeObjectURL(blobUrl); blob ? resolve(blob) : reject(new Error("webp")); },
        "image/webp", 0.85
      );
    };
    img.onerror = () => { URL.revokeObjectURL(blobUrl); reject(new Error("load")); };
    img.src = blobUrl;
  });
}

async function subirImagen(file: File, tipo: "avatar" | "banner", userId: string): Promise<string> {
  const webp = await aWebP(file);
  const path = `${userId}/${tipo}.webp`;
  const { error } = await supabase.storage
    .from("perfiles")
    .upload(path, webp, { upsert: true, contentType: "image/webp" });
  if (error) throw error;
  const { data } = supabase.storage.from("perfiles").getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}

function IconoCamera() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
  );
}

export default function PerfilComprador() {
  const { user } = useAuth();
  const { perfil, guardar, cerrarSesion } = usePerfil();
  const { favoritos } = useFavoritos();
  const { seleccion: comparando } = useComparacion();
  const [fichas, setFichas] = useState<FichaArte[]>([]);

  useEffect(() => {
    getFichas().then(setFichas).catch(() => {});
  }, []);

  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState<DatosPerfil | null>(null);
  const [vista, setVista] = useState<Vista>("coleccion");
  const [formAjustes, setFormAjustes] = useState<DatosPerfil | null>(null);
  const [subiendoAvatar, setSubiendoAvatar] = useState(false);
  const [subiendoBanner, setSubiendoBanner] = useState(false);

  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  if (!perfil) return null;

  // Sin sistema de compras todavía
  const compras: string[] = [];

  const nombreMostrar    = perfil.nombre || "Coleccionista";
  const obrasFavoritas   = fichas.filter(f => favoritos.includes(f.id));
  const obrasAdquiridas  = fichas.filter(f => compras.includes(f.id));
  const obrasComparando  = fichas.filter(f => comparando.includes(f.id));

  const artistasMapa = new Map<string, { artista: FichaArte["artista"]; obras: number }>();
  [...obrasFavoritas, ...obrasAdquiridas].forEach(f => {
    const prev = artistasMapa.get(f.artista.id);
    artistasMapa.set(f.artista.id, { artista: f.artista, obras: (prev?.obras ?? 0) + 1 });
  });
  const artistasSeguidos = [...artistasMapa.values()];

  function iniciarEdicion() { setForm({ ...perfil! }); setEditando(true); }
  function cancelar() { setForm(null); setEditando(false); }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    guardar(form);
    setEditando(false);
    setForm(null);
  }

  function abrirAjustes() { setFormAjustes({ ...perfil! }); setVista("ajustes"); }
  function cerrarAjustes() { setFormAjustes(null); setVista("coleccion"); }
  function submitAjustes(e: React.FormEvent) {
    e.preventDefault();
    if (!formAjustes) return;
    guardar(formAjustes);
    cerrarAjustes();
  }

  async function manejarImagen(
    e: React.ChangeEvent<HTMLInputElement>,
    tipo: "avatar" | "banner"
  ) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const setSub = tipo === "avatar" ? setSubiendoAvatar : setSubiendoBanner;
    setSub(true);
    try {
      const url = await subirImagen(file, tipo, user.id);
      setFormAjustes(prev => prev ? { ...prev, [`${tipo}_url`]: url } : prev);
    } catch {
      // el usuario puede reintentar
    } finally {
      setSub(false);
      e.target.value = "";
    }
  }

  const navItems: { id: Vista; label: string; badge: number; color: string }[] = [
    { id: "coleccion", label: "Mi colección",  badge: obrasAdquiridas.length, color: "text-amber-400" },
    { id: "favoritos", label: "Mis favoritos", badge: favoritos.length,        color: "text-amber-400" },
    { id: "artistas",  label: "Artistas",      badge: artistasSeguidos.length, color: "text-cyan-400"  },
    { id: "comparar",  label: "Comparar obras",badge: comparando.length,       color: "text-cyan-400"  },
  ];

  return (
    <div className="w-full pb-20">

      {/* ── Portada + cabecera ───────────────────────────────── */}
      <div className="relative">
        {/* Cover */}
        {perfil.banner_url ? (
          <div className="h-44 w-full overflow-hidden sm:h-56">
            <img src={perfil.banner_url} alt="" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="h-44 w-full bg-gradient-to-br from-zinc-800 via-cyan-950/40 to-zinc-900 sm:h-56" />
        )}

        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="relative flex flex-col gap-4 pb-4 sm:flex-row sm:items-end sm:gap-6">

            {/* Avatar */}
            <div className="absolute -top-14 left-0 size-28 overflow-hidden rounded-full ring-4 ring-zinc-950 sm:-top-16 sm:size-36">
              {perfil.avatar_url ? (
                <img src={perfil.avatar_url} alt={nombreMostrar} className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center bg-cyan-400/20 text-4xl font-bold text-cyan-400 sm:text-5xl">
                  {iniciales(nombreMostrar)}
                </div>
              )}
            </div>

            {/* Nombre + acciones */}
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

          {/* Stats */}
          <div className="mt-12 flex gap-6 border-t border-white/10 pt-3 sm:mt-2">
            {[
              { valor: obrasAdquiridas.length, etiqueta: "Adquiridas" },
              { valor: favoritos.length,       etiqueta: "Favoritos"  },
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

            {/* Explorar */}
            <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
              <h2 className="mb-3 text-sm font-semibold text-white">Explorar</h2>

              <nav className="space-y-1">
                {navItems.map(item => (
                  <button key={item.id} type="button"
                    onClick={() => setVista(item.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                      vista === item.id
                        ? "bg-white/10 text-white"
                        : "text-zinc-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className={`text-xs font-semibold ${item.color}`}>{item.badge}</span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Ajustes */}
              <div className="mt-3 border-t border-white/5 pt-3">
                <button type="button" onClick={abrirAjustes}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                    vista === "ajustes"
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  Ajustes
                </button>
              </div>
            </div>

          </aside>

          {/* ── Centro ─────────────────────────────────────────── */}
          <main className="min-w-0">

            {/* ── Mi colección ── */}
            {vista === "coleccion" && (
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Mi colección</h2>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {obrasAdquiridas.length === 0
                        ? "Aquí aparecerán las obras que adquieras"
                        : `${obrasAdquiridas.length} ${obrasAdquiridas.length === 1 ? "obra adquirida" : "obras adquiridas"}`}
                    </p>
                  </div>
                  <Link href="/catalogo"
                    className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white">
                    + Explorar
                  </Link>
                </div>
                {obrasAdquiridas.length === 0 ? (
                  <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-white/10 py-16 text-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-12 text-zinc-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    <p className="text-sm text-zinc-500">Aún no has adquirido ninguna obra</p>
                    <Link href="/catalogo"
                      className="rounded-full bg-amber-400 px-5 py-2 text-xs font-semibold text-zinc-900 transition hover:bg-amber-300">
                      Explorar galería
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {obrasAdquiridas.map(ficha => <FichaObra key={ficha.id} ficha={ficha} fluida />)}
                  </div>
                )}
              </div>
            )}

            {/* ── Mis favoritos ── */}
            {vista === "favoritos" && (
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Mis favoritos</h2>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {obrasFavoritas.length === 0
                        ? "Marca obras con ♥ para guardarlas aquí"
                        : `${obrasFavoritas.length} ${obrasFavoritas.length === 1 ? "obra" : "obras"} guardadas`}
                    </p>
                  </div>
                  <Link href="/catalogo"
                    className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white">
                    + Explorar
                  </Link>
                </div>
                {obrasFavoritas.length === 0 ? (
                  <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-white/10 py-16 text-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-12 text-zinc-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                    <p className="text-sm text-zinc-500">Aún no tienes obras favoritas</p>
                    <Link href="/catalogo"
                      className="rounded-full bg-amber-400 px-5 py-2 text-xs font-semibold text-zinc-900 transition hover:bg-amber-300">
                      Ir a la galería
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {obrasFavoritas.map(ficha => (
                      <div key={ficha.id} className="relative">
                        <FichaObra ficha={ficha} fluida />
                        {compras.includes(ficha.id) && (
                          <span className="absolute left-2 top-2 rounded-full bg-cyan-400 px-2 py-0.5 text-[10px] font-bold text-zinc-900 shadow">
                            Adquirida
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Artistas ── */}
            {vista === "artistas" && (
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Artistas</h2>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {artistasSeguidos.length === 0
                        ? "Los artistas de tus obras guardadas aparecerán aquí"
                        : `${artistasSeguidos.length} ${artistasSeguidos.length === 1 ? "artista" : "artistas"} en tu círculo`}
                    </p>
                  </div>
                  <Link href="/artistas"
                    className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white">
                    Ver todos
                  </Link>
                </div>
                {artistasSeguidos.length === 0 ? (
                  <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-white/10 py-16 text-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-12 text-zinc-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                    <p className="text-sm text-zinc-500">Guarda obras para ver sus artistas aquí</p>
                    <Link href="/catalogo"
                      className="rounded-full bg-amber-400 px-5 py-2 text-xs font-semibold text-zinc-900 transition hover:bg-amber-300">
                      Explorar galería
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {artistasSeguidos.map(({ artista, obras }) => (
                      <Link key={artista.id} href={`/artista/${artista.id}`}
                        className="flex items-center gap-4 rounded-2xl bg-zinc-900/70 p-4 ring-1 ring-white/10 transition hover:bg-zinc-900 hover:ring-white/20">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-base font-bold text-amber-400">
                          {artista.nombre.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">{artista.nombre}</p>
                          <p className="mt-0.5 text-xs text-zinc-500">
                            {obras} {obras === 1 ? "obra guardada" : "obras guardadas"}
                          </p>
                        </div>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="ml-auto size-4 shrink-0 text-zinc-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Comparar obras ── */}
            {vista === "comparar" && (
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Comparar obras</h2>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {obrasComparando.length === 0
                        ? "Agrega obras desde la galería para compararlas"
                        : `${obrasComparando.length} ${obrasComparando.length === 1 ? "obra" : "obras"} en cola`}
                    </p>
                  </div>
                  {obrasComparando.length >= 2 && (
                    <Link href="/comparar"
                      className="rounded-full bg-cyan-400 px-4 py-1.5 text-xs font-semibold text-zinc-900 transition hover:bg-cyan-300">
                      Ver comparación →
                    </Link>
                  )}
                </div>
                {obrasComparando.length === 0 ? (
                  <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-white/10 py-16 text-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-12 text-zinc-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                    <p className="text-sm text-zinc-500">Selecciona al menos 2 obras para comparar</p>
                    <Link href="/catalogo"
                      className="rounded-full bg-amber-400 px-5 py-2 text-xs font-semibold text-zinc-900 transition hover:bg-amber-300">
                      Ir a la galería
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {obrasComparando.map(ficha => <FichaObra key={ficha.id} ficha={ficha} fluida />)}
                    </div>
                    {obrasComparando.length < 2 && (
                      <p className="mt-4 text-center text-xs text-zinc-500">
                        Agrega al menos una obra más para activar la comparación
                      </p>
                    )}
                    {obrasComparando.length >= 2 && (
                      <div className="mt-6 text-center">
                        <Link href="/comparar"
                          className="inline-block rounded-full bg-cyan-400 px-8 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-cyan-300">
                          Comparar lado a lado →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Ajustes ── */}
            {vista === "ajustes" && formAjustes && (
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Ajustes</h2>
                    <p className="mt-0.5 text-xs text-zinc-500">Personaliza tu perfil de coleccionista</p>
                  </div>
                  <button type="button" onClick={cerrarAjustes}
                    className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white">
                    ← Volver
                  </button>
                </div>

                <form onSubmit={submitAjustes} className="space-y-5 rounded-2xl bg-zinc-900/70 p-6 ring-1 ring-white/10">

                  {/* ── Imágenes ── */}
                  {user ? (
                    <div>
                      {/* Banner */}
                      <div className="relative overflow-hidden rounded-2xl">
                        <button type="button" onClick={() => bannerRef.current?.click()}
                          className="group relative block h-28 w-full overflow-hidden rounded-2xl">
                          {formAjustes.banner_url ? (
                            <img src={formAjustes.banner_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-zinc-800 via-cyan-950/40 to-zinc-900" />
                          )}
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 opacity-0 transition group-hover:opacity-100">
                            {subiendoBanner ? (
                              <span className="text-xs text-white">Subiendo…</span>
                            ) : (
                              <>
                                <IconoCamera />
                                <span className="text-xs text-white">Cambiar portada</span>
                              </>
                            )}
                          </div>
                        </button>
                        <input ref={bannerRef} type="file" accept="image/*" className="hidden"
                          onChange={e => manejarImagen(e, "banner")} />

                        {/* Avatar sobre el banner */}
                        <div className="absolute bottom-[-20px] left-4">
                          <button type="button" onClick={() => avatarRef.current?.click()}
                            className="group relative block size-16 overflow-hidden rounded-full ring-4 ring-zinc-900">
                            {formAjustes.avatar_url ? (
                              <img src={formAjustes.avatar_url} alt="" className="size-full object-cover" />
                            ) : (
                              <div className="flex size-full items-center justify-center bg-cyan-400/20 text-lg font-bold text-cyan-400">
                                {iniciales(nombreMostrar)}
                              </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 transition group-hover:opacity-100">
                              {subiendoAvatar
                                ? <span className="text-[9px] text-white">…</span>
                                : <IconoCamera />
                              }
                            </div>
                          </button>
                          <input ref={avatarRef} type="file" accept="image/*" className="hidden"
                            onChange={e => manejarImagen(e, "avatar")} />
                        </div>
                      </div>
                      <p className="mt-8 text-[11px] text-zinc-600">
                        Las imágenes se convierten a .webp automáticamente · Tamaño recomendado: avatar 400×400 · portada 1200×400
                      </p>
                    </div>
                  ) : (
                    <p className="rounded-xl bg-white/5 px-4 py-3 text-xs text-zinc-500">
                      Inicia sesión para subir foto de perfil y portada.
                    </p>
                  )}

                  {/* ── Datos ── */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-400">Nombre</label>
                      <input value={formAjustes.nombre}
                        onChange={e => setFormAjustes({ ...formAjustes, nombre: e.target.value })}
                        placeholder="Tu nombre completo" className={INPUT} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-400">País</label>
                      <input value={formAjustes.pais}
                        onChange={e => setFormAjustes({ ...formAjustes, pais: e.target.value })}
                        placeholder="México" className={INPUT} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">Intereses artísticos</label>
                    <input value={formAjustes.especialidad}
                      onChange={e => setFormAjustes({ ...formAjustes, especialidad: e.target.value })}
                      placeholder="Arte moderno, fotografía, escultura…" className={INPUT} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">Sobre mí</label>
                    <textarea value={formAjustes.bio}
                      onChange={e => setFormAjustes({ ...formAjustes, bio: e.target.value })}
                      placeholder="Cuéntanos sobre tus intereses artísticos…"
                      rows={4} className={INPUT + " resize-none"} />
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button type="submit"
                      className="flex-1 rounded-full bg-cyan-400 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-cyan-300">
                      Guardar cambios
                    </button>
                    <button type="button" onClick={cerrarAjustes}
                      className="rounded-full bg-white/5 px-6 py-2.5 text-sm text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10">
                      Cancelar
                    </button>
                  </div>
                  <div className="border-t border-white/5 pt-4">
                    <button type="button" onClick={cerrarSesion}
                      className="w-full rounded-full py-2 text-xs text-red-400 transition hover:bg-red-500/10">
                      Cerrar sesión
                    </button>
                  </div>
                </form>
              </div>
            )}

          </main>

          {/* ── Sidebar derecho ───────────────────────────────── */}
          <aside className="space-y-4">
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

            {artistasSeguidos.length > 0 && (
              <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                <h2 className="mb-3 text-sm font-semibold text-white">Artistas en tu círculo</h2>
                <div className="space-y-2">
                  {artistasSeguidos.map(({ artista }) => (
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
