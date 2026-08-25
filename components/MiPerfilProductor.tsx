"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { usePerfil, type DatosPerfil } from "@/hooks/usePerfil";
import { useToast } from "@/components/ToastProvider";
import { supabase } from "@/lib/supabase";
import { COLOR_COCINA, type ProductoCocina, type CategoriaCocina } from "@/data/cocina";

type Vista = "productos" | "ajustes";

const ICONO_CAT: Record<CategoriaCocina, string> = {
  Vinos:      "🍷",
  Aceites:    "🫒",
  Especias:   "🌶️",
  Chocolates: "🍫",
  Conservas:  "🫙",
  Mieles:     "🍯",
};

const INPUT =
  "w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50";

function iniciales(nombre: string): string {
  const p = nombre.trim().split(/\s+/);
  if (p.length >= 2) return (p[0][0] + p[p.length - 1][0]).toUpperCase();
  return (nombre.slice(0, 2) || "PR").toUpperCase();
}

function IconoCamera() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
  );
}

async function aWebP(file: File): Promise<Blob> {
  const img = new window.Image();
  const blobUrl = URL.createObjectURL(file);
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => { URL.revokeObjectURL(blobUrl); blob ? resolve(blob) : reject(new Error("webp")); },
        "image/webp", 0.85
      );
    };
    img.onerror = () => { URL.revokeObjectURL(blobUrl); reject(new Error("load")); };
    img.src = blobUrl;
  });
}

async function subirImagen(file: File, tipo: "avatar" | "banner", clave: string): Promise<string> {
  const webp = await aWebP(file);
  const form = new FormData();
  form.append("file", new File([webp], `${tipo}.webp`, { type: "image/webp" }));
  form.append("tipo", tipo);
  form.append("clave", clave);
  const res = await fetch("/api/perfil/imagen", { method: "POST", body: form });
  if (!res.ok) throw new Error("upload");
  const { url } = await res.json();
  return url;
}

/* ── Tarjeta de producto ────────────────────────────────────── */
function TarjetaProducto({ producto }: { producto: ProductoCocina }) {
  const color = COLOR_COCINA[producto.categoria];
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/cocina/${producto.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10 transition hover:ring-amber-400/20"
    >
      <div className="relative aspect-[3/4] bg-zinc-800">
        {producto.imagen && !imgError ? (
          <NextImage
            src={producto.imagen}
            alt={producto.nombre}
            fill
            sizes="220px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">
            {ICONO_CAT[producto.categoria]}
          </div>
        )}
        {producto.destacado && (
          <div className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-zinc-900">
            Destacado
          </div>
        )}
      </div>
      <div className="p-3">
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ring-1 ${color}`}>
          {producto.categoria}
        </span>
        <p className="mt-1.5 truncate text-xs font-bold uppercase tracking-wide text-white">
          {producto.nombre}
        </p>
        <p className="mt-0.5 text-[10px] text-zinc-500">{producto.unidad}</p>
        <p className="mt-1 text-xs font-semibold text-amber-400">
          ${producto.precio.toLocaleString("es-MX")} MXN
        </p>
      </div>
    </Link>
  );
}

/* ── Componente principal ────────────────────────────────────── */
export default function MiPerfilProductor() {
  const { perfil, guardar, cerrarSesion } = usePerfil();
  const { toast } = useToast();

  const [vista, setVista] = useState<Vista>("productos");
  const [productos, setProductos] = useState<ProductoCocina[]>([]);
  const [cargando, setCargando] = useState(true);
  const [formAjustes, setFormAjustes] = useState<DatosPerfil | null>(null);
  const [subiendoAvatar, setSubiendoAvatar] = useState(false);
  const [subiendoBanner, setSubiendoBanner] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!perfil?.email) { setCargando(false); return; }
    supabase
      .from("productos_cocina")
      .select("*")
      .eq("productor_email", perfil.email)
      .eq("activo", true)
      .order("id")
      .then(({ data }) => {
        setProductos((data ?? []) as ProductoCocina[]);
        setCargando(false);
      });
  }, [perfil?.email]);

  if (!perfil) return null;

  const nombreMostrar = perfil.nombre || "Tu nombre";
  const perfilPublicoHref = `/cocina/productor/${encodeURIComponent(nombreMostrar)}`;
  const categorias = [...new Set(productos.map((p) => p.categoria))];
  const precioPromedio = productos.length
    ? Math.round(productos.reduce((s, p) => s + p.precio, 0) / productos.length)
    : 0;

  function abrirAjustes() { setFormAjustes({ ...perfil! }); setVista("ajustes"); }
  function cerrarAjustes() { setFormAjustes(null); setVista("productos"); }
  function submitAjustes(e: React.FormEvent) {
    e.preventDefault();
    if (!formAjustes) return;
    guardar(formAjustes);
    toast("Perfil actualizado", { icono: "✓" });
    cerrarAjustes();
  }

  async function manejarImagen(e: React.ChangeEvent<HTMLInputElement>, tipo: "avatar" | "banner") {
    const file = e.target.files?.[0];
    if (!file) return;
    const setSub = tipo === "avatar" ? setSubiendoAvatar : setSubiendoBanner;
    setSub(true);
    try {
      const clave = perfil?.email || perfil?.slug || "productor";
      const url = await subirImagen(file, tipo, clave);
      setFormAjustes(prev => prev ? { ...prev, [`${tipo}_url`]: url } : prev);
    } catch { /* el usuario puede reintentar */ }
    finally { setSub(false); e.target.value = ""; }
  }

  const navItems: { id: Vista; label: string; badge?: number }[] = [
    { id: "productos", label: "Mis Productos", badge: productos.length || undefined },
  ];

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
            <div className="h-44 w-full bg-gradient-to-br from-amber-950/60 via-zinc-900 to-zinc-950 sm:h-56" />
          )}

          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <div className="relative flex flex-col gap-4 pb-4 sm:flex-row sm:items-end sm:gap-6">

              {/* Avatar — círculo igual que artista */}
              <div className="absolute -top-14 left-0 size-28 overflow-hidden rounded-full ring-4 ring-zinc-950 sm:-top-16 sm:size-36">
                {perfil.avatar_url ? (
                  <NextImage src={perfil.avatar_url} alt={nombreMostrar} fill sizes="144px" className="object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center bg-amber-400 text-4xl font-bold text-zinc-900 sm:text-5xl">
                    {iniciales(nombreMostrar)}
                  </div>
                )}
              </div>

              {/* Nombre + enlace público */}
              <div className="ml-32 mt-2 flex flex-1 flex-wrap items-end justify-between gap-3 pt-2 sm:ml-44 sm:mt-0">
                <div>
                  <h1 className="text-xl font-bold text-white sm:text-2xl">{nombreMostrar}</h1>
                  <p className="mt-0.5 text-sm text-zinc-400">
                    {perfil.especialidad || "Productor artesanal"}
                    {perfil.pais && <> · <span className="text-zinc-500">{perfil.pais}</span></>}
                  </p>
                </div>
                <Link
                  href={perfilPublicoHref}
                  className="flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-2 text-xs text-zinc-300 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  Ver perfil público
                </Link>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-12 flex gap-6 border-t border-white/10 pt-3 sm:mt-2">
              {[
                { valor: productos.length,   etiqueta: "Productos" },
                { valor: categorias.length,  etiqueta: "Categorías" },
                { valor: precioPromedio > 0 ? `$${precioPromedio.toLocaleString("es-MX")}` : "—", etiqueta: "Precio prom." },
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr_220px]">

            {/* ── Sidebar izquierdo ─────────────────────────── */}
            <aside className="space-y-4">

              {/* Acerca de */}
              <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                <h2 className="mb-3 text-sm font-semibold text-white">Acerca de</h2>
                <p className={`text-xs leading-relaxed ${perfil.bio ? "text-zinc-300" : "italic text-zinc-600"}`}>
                  {perfil.bio || "Añade una descripción de tu producción."}
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
                  {navItems.map(item => (
                    <button key={item.id} type="button" onClick={() => setVista(item.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                        vista === item.id
                          ? "bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20"
                          : "text-zinc-300 hover:bg-white/5 hover:text-white"
                      }`}>
                      <span>{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="text-xs font-semibold text-amber-400">{item.badge}</span>
                      )}
                    </button>
                  ))}
                </nav>

                <div className="mt-3 border-t border-white/5 pt-3">
                  <button type="button" onClick={abrirAjustes}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                      vista === "ajustes"
                        ? "bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    Ajustes
                  </button>
                </div>
              </div>
            </aside>

            {/* ── Centro ────────────────────────────────────── */}
            <main className="min-w-0">

              {/* ── Mis Productos ── */}
              {vista === "productos" && (
                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Mis productos</h2>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {cargando
                          ? "Cargando..."
                          : productos.length === 0
                          ? "Aún no tienes productos asignados"
                          : `${productos.length} ${productos.length === 1 ? "producto" : "productos"}`}
                      </p>
                    </div>
                    <Link href="/cocina"
                      className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white">
                      Ver tienda →
                    </Link>
                  </div>

                  {!cargando && productos.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-white/10 py-16 text-center">
                      <span className="text-5xl">🍽️</span>
                      <p className="text-sm text-zinc-500">Aún no tienes productos asignados</p>
                      <p className="text-xs text-zinc-600">Contacta al equipo de ERUDITO para vincular tus productos</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {productos.map((p) => (
                        <TarjetaProducto key={p.id} producto={p} />
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
                      <p className="mt-0.5 text-xs text-zinc-500">Personaliza tu perfil de productor</p>
                    </div>
                    <button type="button" onClick={cerrarAjustes}
                      className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white">
                      ← Volver
                    </button>
                  </div>

                  <form onSubmit={submitAjustes} className="space-y-5 rounded-2xl bg-zinc-900/70 p-6 ring-1 ring-white/10">

                    {/* Imágenes */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="mb-2 text-xs font-medium text-zinc-400">Foto de perfil</p>
                        <button type="button" onClick={() => avatarRef.current?.click()}
                          className="group relative flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-800 ring-1 ring-white/10 transition hover:ring-amber-400/40">
                          {formAjustes.avatar_url ? (
                            <img src={formAjustes.avatar_url} alt="" className="size-full object-cover" />
                          ) : (
                            <div className="flex size-20 items-center justify-center rounded-full bg-amber-400 text-3xl font-bold text-zinc-900">
                              {iniciales(nombreMostrar)}
                            </div>
                          )}
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/55 opacity-0 transition group-hover:opacity-100">
                            {subiendoAvatar
                              ? <span className="text-xs text-white">Subiendo…</span>
                              : <><IconoCamera /><span className="text-xs text-white">Cambiar foto</span></>}
                          </div>
                        </button>
                        <input ref={avatarRef} type="file" accept="image/*" className="hidden"
                          onChange={e => manejarImagen(e, "avatar")} />
                        <p className="mt-1.5 text-[10px] text-zinc-600">400 × 400 px recomendado</p>
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-medium text-zinc-400">Portada</p>
                        <button type="button" onClick={() => bannerRef.current?.click()}
                          className="group relative block h-32 w-full overflow-hidden rounded-2xl ring-1 ring-white/10 transition hover:ring-amber-400/40">
                          {formAjustes.banner_url ? (
                            <img src={formAjustes.banner_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-zinc-800 via-amber-950/30 to-zinc-900" />
                          )}
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/55 opacity-0 transition group-hover:opacity-100">
                            {subiendoBanner
                              ? <span className="text-xs text-white">Subiendo…</span>
                              : <><IconoCamera /><span className="text-xs text-white">Cambiar portada</span></>}
                          </div>
                        </button>
                        <input ref={bannerRef} type="file" accept="image/*" className="hidden"
                          onChange={e => manejarImagen(e, "banner")} />
                        <p className="mt-1.5 text-[10px] text-zinc-600">1200 × 400 px recomendado</p>
                      </div>
                    </div>

                    {/* Datos */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-400">Nombre del productor</label>
                        <input value={formAjustes.nombre}
                          onChange={e => setFormAjustes({ ...formAjustes, nombre: e.target.value })}
                          placeholder="Monte Xanic" className={INPUT} />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-400">País / Región</label>
                        <input value={formAjustes.pais}
                          onChange={e => setFormAjustes({ ...formAjustes, pais: e.target.value })}
                          placeholder="México" className={INPUT} />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-400">Especialidad</label>
                      <input value={formAjustes.especialidad}
                        onChange={e => setFormAjustes({ ...formAjustes, especialidad: e.target.value })}
                        placeholder="Viticultura, apicultura, chocolatería artesanal…" className={INPUT} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-400">Descripción</label>
                      <textarea value={formAjustes.bio}
                        onChange={e => setFormAjustes({ ...formAjustes, bio: e.target.value })}
                        placeholder="Cuéntanos sobre tu historia, proceso y filosofía de producción…"
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
            <aside className="hidden space-y-4 lg:block">

              <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                <h2 className="mb-3 text-sm font-semibold text-white">Estadísticas</h2>
                {productos.length === 0 ? (
                  <p className="text-xs italic text-zinc-600">Sin productos asignados aún</p>
                ) : (
                  <div className="space-y-3">
                    {[
                      { label: "Productos",    valor: productos.length.toString(),           color: "text-amber-400" },
                      { label: "Categorías",   valor: categorias.length.toString(),          color: "text-amber-400" },
                      { label: "Destacados",   valor: productos.filter(p => p.destacado).length.toString(), color: "text-emerald-400" },
                      { label: "Precio prom.", valor: `$${precioPromedio.toLocaleString("es-MX")}`, color: "text-white" },
                    ].map(({ label, valor, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-xs text-zinc-400">{label}</span>
                        <span className={`text-xs font-semibold ${color}`}>{valor}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {categorias.length > 0 && (
                <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                  <h2 className="mb-3 text-sm font-semibold text-white">Categorías</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {categorias.map(cat => (
                      <span key={cat}
                        className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[11px] text-amber-400 ring-1 ring-amber-400/20">
                        {ICONO_CAT[cat]} {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                <h2 className="mb-2 text-sm font-semibold text-white">Tu perfil público</h2>
                <p className="mb-3 text-xs text-zinc-500">Así te ven los visitantes de Cocina</p>
                <Link href={perfilPublicoHref}
                  className="flex w-full items-center justify-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-400 ring-1 ring-amber-400/20 transition hover:bg-amber-400/20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  Ver perfil público
                </Link>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </>
  );
}
