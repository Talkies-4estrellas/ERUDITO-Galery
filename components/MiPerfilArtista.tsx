"use client";

import { useRef, useState } from "react";
import NextImage from "next/image";
import { usePerfil, type DatosPerfil } from "@/hooks/usePerfil";
import { useAuth } from "@/hooks/useAuth";
import { useObrasArtista, type ObraPropia } from "@/hooks/useObrasArtista";
import FormObraArtista from "@/components/FormObraArtista";
import { supabase } from "@/lib/supabase";

type Vista = "obras" | "ajustes";

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  if (partes.length >= 2)
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  return (nombre.slice(0, 2) || "AR").toUpperCase();
}

const INPUT =
  "w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50";

function IconoCamera() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
  );
}

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

/* Tarjeta de obra propia */
function TarjetaObra({
  obra,
  onEditar,
  onEliminar,
}: {
  obra: ObraPropia;
  onEditar: () => void;
  onEliminar: () => void;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10">
      <div className="relative aspect-[3/4] bg-zinc-800">
        {obra.imagen ? (
          <NextImage src={obra.imagen} alt={obra.titulo} fill sizes="220px" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-10 text-zinc-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          <button type="button" onClick={onEditar}
            className="flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-semibold text-zinc-900 hover:bg-amber-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
            </svg>
            Editar
          </button>
          <button type="button" onClick={onEliminar}
            className="flex items-center gap-1 rounded-full bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-red-400 ring-1 ring-red-400/30 hover:bg-red-400/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            Eliminar
          </button>
        </div>
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

export default function MiPerfilArtista() {
  const { user } = useAuth();
  const { perfil, guardar, cerrarSesion } = usePerfil();
  const { obras, listo: obrasListas, agregar, actualizar, eliminar } = useObrasArtista();

  const [vista, setVista] = useState<Vista>("obras");
  const [formAjustes, setFormAjustes] = useState<DatosPerfil | null>(null);
  const [subiendoAvatar, setSubiendoAvatar] = useState(false);
  const [subiendoBanner, setSubiendoBanner] = useState(false);
  const [modalObra, setModalObra] = useState<null | "nueva" | string>(null);

  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  if (!perfil) return null;

  function abrirAjustes() { setFormAjustes({ ...perfil! }); setVista("ajustes"); }
  function cerrarAjustes() { setFormAjustes(null); setVista("obras"); }
  function submitAjustes(e: React.FormEvent) {
    e.preventDefault();
    if (!formAjustes) return;
    guardar(formAjustes);
    cerrarAjustes();
  }

  async function manejarImagen(e: React.ChangeEvent<HTMLInputElement>, tipo: "avatar" | "banner") {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const setSub = tipo === "avatar" ? setSubiendoAvatar : setSubiendoBanner;
    setSub(true);
    try {
      const url = await subirImagen(file, tipo, user.id);
      setFormAjustes(prev => prev ? { ...prev, [`${tipo}_url`]: url } : prev);
    } catch { /* el usuario puede reintentar */ }
    finally { setSub(false); e.target.value = ""; }
  }

  function guardarObra(datos: Omit<ObraPropia, "id">) {
    if (modalObra === "nueva") agregar(datos);
    else if (typeof modalObra === "string") actualizar(modalObra, datos);
  }

  const obraEnEdicion =
    typeof modalObra === "string" && modalObra !== "nueva"
      ? obras.find((o) => o.id === modalObra)
      : undefined;

  const nombreMostrar = perfil.nombre || "Tu nombre";
  const obrasConPrecio = obras.filter((o) => o.precio > 0);
  const totalValor = obrasConPrecio.reduce((s, o) => s + o.precio, 0);

  return (
    <>
      <div className="w-full pb-20">

        {/* ── Portada + cabecera ─────────────────────────────── */}
        <div className="relative">
          {perfil.banner_url ? (
            <div className="h-44 w-full overflow-hidden sm:h-56">
              <img src={perfil.banner_url} alt="" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="h-44 w-full bg-gradient-to-br from-zinc-800 via-amber-950/30 to-zinc-900 sm:h-56" />
          )}

          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <div className="relative flex flex-col gap-4 pb-4 sm:flex-row sm:items-end sm:gap-6">

              {/* Avatar */}
              <div className="absolute -top-14 left-0 size-28 overflow-hidden rounded-full ring-4 ring-zinc-950 sm:-top-16 sm:size-36">
                {perfil.avatar_url ? (
                  <NextImage src={perfil.avatar_url} alt={nombreMostrar} fill sizes="144px" className="object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center bg-amber-400 text-4xl font-bold text-zinc-900 sm:text-5xl">
                    {iniciales(nombreMostrar)}
                  </div>
                )}
              </div>

              {/* Nombre */}
              <div className="ml-32 mt-2 pt-2 sm:ml-44 sm:mt-0">
                <h1 className="text-xl font-bold text-white sm:text-2xl">{nombreMostrar}</h1>
                <p className="mt-0.5 text-sm text-zinc-400">
                  {perfil.especialidad || "Artista"}
                  {perfil.pais && <> · <span className="text-zinc-500">{perfil.pais}</span></>}
                </p>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-12 flex gap-6 border-t border-white/10 pt-3 sm:mt-2">
              {[
                { valor: obras.length,          etiqueta: "Obras publicadas" },
                { valor: obrasConPrecio.length,  etiqueta: "Con precio"       },
                { valor: totalValor > 0
                    ? `$${(totalValor / 1000).toFixed(0)}k`
                    : "—",                       etiqueta: "Valor total MXN"  },
              ].map(({ valor, etiqueta }) => (
                <div key={etiqueta} className="text-center">
                  <p className="text-lg font-bold text-white">{valor}</p>
                  <p className="text-[11px] text-zinc-500">{etiqueta}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Layout 3 columnas ──────────────────────────────── */}
        <div className="mx-auto mt-6 max-w-6xl px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr_220px]">

            {/* ── Sidebar izquierdo ─────────────────────────── */}
            <aside className="space-y-4">

              {/* Acerca de */}
              <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                <h2 className="mb-3 text-sm font-semibold text-white">Acerca de</h2>
                <p className={`text-xs leading-relaxed ${perfil.bio ? "text-zinc-300" : "italic text-zinc-600"}`}>
                  {perfil.bio || "Añade una biografía para que los coleccionistas te conozcan."}
                </p>
                <button type="button" onClick={abrirAjustes}
                  className="mt-3 text-xs text-amber-400 underline-offset-2 hover:underline">
                  Editar bio
                </button>
              </div>

              {/* Navegación */}
              <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                <h2 className="mb-3 text-sm font-semibold text-white">Mi espacio</h2>
                <nav className="space-y-1">
                  <button type="button" onClick={() => setVista("obras")}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                      vista === "obras"
                        ? "bg-white/10 text-white"
                        : "text-zinc-300 hover:bg-white/5 hover:text-white"
                    }`}>
                    <span>Mis obras</span>
                    {obras.length > 0 && (
                      <span className="text-xs font-semibold text-amber-400">{obras.length}</span>
                    )}
                  </button>
                </nav>

                <div className="mt-3 border-t border-white/5 pt-3">
                  <button type="button" onClick={abrirAjustes}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                      vista === "ajustes"
                        ? "bg-white/10 text-white"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    Ajustes
                  </button>
                </div>
              </div>
            </aside>

            {/* ── Centro ────────────────────────────────────── */}
            <main className="min-w-0">

              {/* ── Mis obras ── */}
              {vista === "obras" && (
                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Mis obras</h2>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {!obrasListas
                          ? "Cargando..."
                          : obras.length === 0
                          ? "Aún no has subido ninguna obra"
                          : `${obras.length} ${obras.length === 1 ? "obra publicada" : "obras publicadas"}`}
                      </p>
                    </div>
                    <button type="button" onClick={() => setModalObra("nueva")}
                      className="flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-zinc-900 transition hover:bg-amber-300">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="size-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Añadir obra
                    </button>
                  </div>

                  {obrasListas && obras.length === 0 ? (
                    <button type="button" onClick={() => setModalObra("nueva")}
                      className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/10 py-16 text-center transition hover:border-amber-400/30 hover:bg-amber-400/5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-10 text-zinc-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                      </svg>
                      <p className="text-sm font-medium text-zinc-500">Sube tu primera obra</p>
                      <p className="text-xs text-zinc-600">Imagen, descripción, técnica y precio</p>
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {obras.map((obra) => (
                        <TarjetaObra
                          key={obra.id}
                          obra={obra}
                          onEditar={() => setModalObra(obra.id)}
                          onEliminar={() => eliminar(obra.id)}
                        />
                      ))}
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
                      <p className="mt-0.5 text-xs text-zinc-500">Personaliza tu perfil de artista</p>
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
                              <div className="h-full w-full bg-gradient-to-br from-zinc-800 via-amber-950/30 to-zinc-900" />
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
                                <div className="flex size-full items-center justify-center bg-amber-400 text-lg font-bold text-zinc-900">
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
                          Las imágenes se convierten a .webp automáticamente · avatar 400×400 · portada 1200×400
                        </p>
                      </div>
                    ) : (
                      <p className="rounded-xl bg-white/5 px-4 py-3 text-xs text-zinc-500">
                        Inicia sesión con cuenta verificada para subir foto de perfil y portada.
                      </p>
                    )}

                    {/* ── Datos ── */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-400">Nombre artístico</label>
                        <input value={formAjustes.nombre}
                          onChange={e => setFormAjustes({ ...formAjustes, nombre: e.target.value })}
                          placeholder="Tu nombre o seudónimo" className={INPUT} />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-400">País</label>
                        <input value={formAjustes.pais}
                          onChange={e => setFormAjustes({ ...formAjustes, pais: e.target.value })}
                          placeholder="México" className={INPUT} />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-400">Especialidad</label>
                      <input value={formAjustes.especialidad}
                        onChange={e => setFormAjustes({ ...formAjustes, especialidad: e.target.value })}
                        placeholder="Pintura al óleo, escultura, fotografía…" className={INPUT} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-400">Biografía</label>
                      <textarea value={formAjustes.bio}
                        onChange={e => setFormAjustes({ ...formAjustes, bio: e.target.value })}
                        placeholder="Cuéntanos sobre tu trayectoria y estilo artístico…"
                        rows={4} className={INPUT + " resize-none"} />
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button type="submit"
                        className="flex-1 rounded-full bg-amber-400 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300">
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

            {/* ── Sidebar derecho ───────────────────────────── */}
            <aside className="space-y-4">
              <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                <h2 className="mb-3 text-sm font-semibold text-white">Estadísticas</h2>
                <div className="space-y-3">
                  {[
                    { label: "Obras subidas",    valor: obras.length.toString(),          color: "text-amber-400" },
                    { label: "Con precio",        valor: obrasConPrecio.length.toString(), color: "text-white"     },
                    { label: "Físicas",           valor: obras.filter(o => o.tipo === "Físico").length.toString(), color: "text-white" },
                    { label: "JPG Certificado",   valor: obras.filter(o => o.tipo === "JPG Certificado").length.toString(), color: "text-white" },
                  ].map(({ label, valor, color }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">{label}</span>
                      <span className={`text-xs font-semibold ${color}`}>{valor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {obras.length > 0 && (
                <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                  <h2 className="mb-3 text-sm font-semibold text-white">Técnicas</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {[...new Set(obras.map(o => o.tecnica).filter(Boolean))].map(t => (
                      <span key={t}
                        className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[11px] text-amber-400 ring-1 ring-amber-400/20">
                        {t}
                      </span>
                    ))}
                    {obras.every(o => !o.tecnica) && (
                      <p className="text-xs italic text-zinc-600">Sin técnicas registradas</p>
                    )}
                  </div>
                </div>
              )}
            </aside>

          </div>
        </div>
      </div>

      {/* ── Modal de obra ───────────────────────────────────── */}
      {modalObra !== null && (
        <FormObraArtista
          inicial={obraEnEdicion}
          onGuardar={guardarObra}
          onCerrar={() => setModalObra(null)}
        />
      )}
    </>
  );
}
