"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePerfil, type DatosPerfil } from "@/hooks/usePerfil";
import { useObrasArtista, type ObraPropia } from "@/hooks/useObrasArtista";
import FormObraArtista from "@/components/FormObraArtista";
import { uploadWebp } from "@/lib/uploadWebp";

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  if (partes.length >= 2)
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  return (nombre.slice(0, 2) || "AR").toUpperCase();
}

const INPUT =
  "w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50";

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
          <Image src={obra.imagen} alt={obra.titulo} fill sizes="220px" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-10 text-zinc-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
        )}
        {/* Botones en hover */}
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
  const { perfil, guardar, cerrarSesion } = usePerfil();
  const { obras, listo: obrasListas, agregar, actualizar, eliminar } = useObrasArtista();

  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [formPerfil, setFormPerfil] = useState<DatosPerfil | null>(null);
  const [modalObra, setModalObra] = useState<null | "nueva" | string>(null);
  const [subiendoAvatar, setSubiendoAvatar] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);

  async function onAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !perfil) return;
    e.target.value = "";
    setSubiendoAvatar(true);
    try {
      const url = await uploadWebp(file, "/api/upload?carpeta=avatars");
      await guardar({ ...perfil, avatar_url: url });
    } catch { /* silencioso — el usuario verá que no cambió */ }
    finally { setSubiendoAvatar(false); }
  }

  if (!perfil) return null;

  function iniciarEdicion() { setFormPerfil({ ...perfil! }); setEditandoPerfil(true); }
  function cancelar() { setFormPerfil(null); setEditandoPerfil(false); }
  function submitPerfil(e: React.FormEvent) {
    e.preventDefault();
    if (!formPerfil) return;
    guardar(formPerfil);
    setEditandoPerfil(false);
    setFormPerfil(null);
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
          {/* Cover */}
          <div className="h-44 w-full bg-gradient-to-br from-zinc-800 via-amber-950/30 to-zinc-900 sm:h-56" />

          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <div className="relative flex flex-col gap-4 pb-4 sm:flex-row sm:items-end sm:gap-6">

              {/* Avatar con upload */}
              <div className="absolute -top-14 left-0 sm:-top-16">
                <button
                  type="button"
                  onClick={() => avatarRef.current?.click()}
                  disabled={subiendoAvatar}
                  className="group relative flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-amber-400 text-4xl font-bold text-zinc-900 ring-4 ring-zinc-950 sm:size-36 sm:text-5xl"
                >
                  {perfil?.avatar_url ? (
                    <Image src={perfil.avatar_url} alt={nombreMostrar} fill sizes="144px" className="object-cover" />
                  ) : (
                    iniciales(nombreMostrar)
                  )}
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 opacity-0 transition group-hover:opacity-100">
                    {subiendoAvatar ? (
                      <svg className="size-6 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-6 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/>
                        </svg>
                        <span className="text-[10px] font-semibold text-white">Foto</span>
                      </>
                    )}
                  </span>
                </button>
                <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={onAvatarFile} />
              </div>

              {/* Nombre / formulario */}
              <div className="ml-32 mt-2 flex flex-1 flex-col gap-1 sm:ml-44 sm:mt-0">
                {editandoPerfil && formPerfil ? (
                  <form onSubmit={submitPerfil} className="flex flex-wrap gap-2 py-2">
                    <input value={formPerfil.nombre}
                      onChange={e => setFormPerfil({...formPerfil, nombre: e.target.value})}
                      placeholder="Tu nombre" className={INPUT + " max-w-xs"} />
                    <input value={formPerfil.especialidad}
                      onChange={e => setFormPerfil({...formPerfil, especialidad: e.target.value})}
                      placeholder="Especialidad (ej. Pintura al óleo)" className={INPUT + " max-w-xs"} />
                    <input value={formPerfil.pais}
                      onChange={e => setFormPerfil({...formPerfil, pais: e.target.value})}
                      placeholder="País" className={INPUT + " w-32"} />
                    <div className="flex gap-2">
                      <button type="submit"
                        className="rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold text-zinc-900 hover:bg-amber-300">
                        Guardar
                      </button>
                      <button type="button" onClick={cancelar}
                        className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 hover:bg-white/10">
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-start justify-between gap-4 pt-2">
                    <div>
                      <h1 className="text-xl font-bold text-white sm:text-2xl">{nombreMostrar}</h1>
                      <p className="mt-0.5 text-sm text-zinc-400">
                        {perfil.especialidad || "Artista"}
                        {perfil.pais && <> · <span className="text-zinc-500">{perfil.pais}</span></>}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button type="button" onClick={iniciarEdicion}
                        className="flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-amber-400">
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
              {/* Bio */}
              <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                <h2 className="mb-3 text-sm font-semibold text-white">Acerca de</h2>
                {editandoPerfil && formPerfil ? (
                  <textarea
                    value={formPerfil.bio}
                    onChange={e => setFormPerfil({...formPerfil, bio: e.target.value})}
                    placeholder="Tu trayectoria y estilo artístico..."
                    rows={4}
                    className={INPUT + " resize-none"}
                  />
                ) : (
                  <>
                    <p className={`text-xs leading-relaxed ${perfil.bio ? "text-zinc-300" : "italic text-zinc-600"}`}>
                      {perfil.bio || "Añade una biografía para que los coleccionistas te conozcan."}
                    </p>
                    {!editandoPerfil && (
                      <button type="button" onClick={iniciarEdicion}
                        className="mt-3 text-xs text-amber-400 underline-offset-2 hover:underline">
                        Editar bio
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Navegación */}
              <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                <h2 className="mb-3 text-sm font-semibold text-white">Accesos rápidos</h2>
                <nav className="space-y-1">
                  {[
                    { label: "Mis obras",   badge: obras.length,  color: "text-amber-400", action: () => {} },
                  ].map(({ label, badge, color }) => (
                    <div key={label}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-zinc-300">
                      <span>{label}</span>
                      {badge > 0 && <span className={`text-xs font-semibold ${color}`}>{badge}</span>}
                    </div>
                  ))}
                  {[
                    { href: "/obras",     label: "Galería pública" },
                    { href: "/artistas",  label: "Otros artistas"  },
                    { href: "/catalogo",  label: "Catálogo"        },
                    { href: "/servicios", label: "Servicios"       },
                  ].map(({ href, label }) => (
                    <Link key={href} href={href}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white">
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            {/* ── Centro: Mis obras ─────────────────────────── */}
            <main className="min-w-0">
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
            </main>

            {/* ── Sidebar derecho ───────────────────────────── */}
            <aside className="space-y-4">
              {/* Estadísticas */}
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

              {/* Técnicas usadas */}
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
