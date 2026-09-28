"use client";

import { useRef, useState } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { usePerfil, generarSlug, type DatosPerfil } from "@/hooks/usePerfil";
import { useObrasEmpresa, type ObraEmpresa } from "@/hooks/useObrasEmpresa";
import FormObraEmpresa from "@/components/FormObraEmpresa";
import { useToast } from "@/components/ToastProvider";

type Vista = "obras" | "analisis" | "ajustes";

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  if (partes.length >= 2)
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  return (nombre.slice(0, 2) || "EM").toUpperCase();
}

const INPUT =
  "w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-violet-400/50";

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
        blob => { URL.revokeObjectURL(blobUrl); blob ? resolve(blob) : reject(new Error("webp")); },
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

/* ── Modal de recorte ─────────────────────────────────────────── */
function CropModal({ file, tipo, onConfirm, onCerrar }: {
  file: File;
  tipo: "avatar" | "banner";
  onConfirm: (blob: Blob) => void;
  onCerrar: () => void;
}) {
  const isAvatar = tipo === "avatar";
  const OW = isAvatar ? 400 : 1200;
  const OH = isAvatar ? 400 : 400;

  const [src, setSrc] = useState("");
  const [nw, setNw] = useState(0);
  const [nh, setNh] = useState(0);
  const [cw, setCw] = useState(0);
  const [ch, setCh] = useState(0);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragOrigin = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      setScale(s => Math.max(0.1, Math.min(8, s * (1 - e.deltaY * 0.001))));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  function clampedOffset(ox: number, oy: number, s: number, _cw: number, _ch: number) {
    if (nw === 0 || _cw === 0) return { x: ox, y: oy };
    const maxX = Math.max(0, (nw * s - _cw) / 2);
    const maxY = Math.max(0, (nh * s - _ch) / 2);
    return { x: Math.max(-maxX, Math.min(maxX, ox)), y: Math.max(-maxY, Math.min(maxY, oy)) };
  }

  function applyZoom(s: number) {
    const newS = Math.max(0.1, Math.min(8, s));
    setScale(newS);
    setOffset(o => clampedOffset(o.x, o.y, newS, cw, ch));
  }

  function onImgLoad() {
    const img = imgRef.current;
    const el = containerRef.current;
    if (!img || !el) return;
    const w = el.clientWidth, h = el.clientHeight;
    setCw(w); setCh(h);
    setNw(img.naturalWidth); setNh(img.naturalHeight);
    setScale(Math.max(w / img.naturalWidth, h / img.naturalHeight));
    setOffset({ x: 0, y: 0 });
  }

  function startDrag(mx: number, my: number) {
    isDragging.current = true;
    dragOrigin.current = { mx, my, ox: offset.x, oy: offset.y };
  }
  function moveDrag(mx: number, my: number) {
    if (!isDragging.current) return;
    const { mx: sx, my: sy, ox, oy } = dragOrigin.current;
    setOffset(clampedOffset(ox + mx - sx, oy + my - sy, scale, cw, ch));
  }
  function stopDrag() { isDragging.current = false; }

  function confirmar() {
    const img = imgRef.current;
    const el = containerRef.current;
    if (!img || !el || nw === 0) return;
    const w = el.clientWidth, h = el.clientHeight;
    const canvas = document.createElement("canvas");
    canvas.width = OW; canvas.height = OH;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(OW / w, OH / h);
    const imgLeft = w / 2 - (nw * scale) / 2 + offset.x;
    const imgTop  = h / 2 - (nh * scale) / 2 + offset.y;
    ctx.drawImage(img, imgLeft, imgTop, nw * scale, nh * scale);
    canvas.toBlob(blob => { if (blob) onConfirm(blob); }, "image/webp", 0.85);
  }

  const imgLeft = cw > 0 ? cw / 2 - (nw * scale) / 2 + offset.x : 0;
  const imgTop  = ch > 0 ? ch / 2 - (nh * scale) / 2 + offset.y : 0;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl bg-zinc-900 p-6 shadow-2xl ring-1 ring-white/10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              {isAvatar ? "Ajustar logo" : "Ajustar portada"}
            </p>
            <p className="text-xs text-zinc-500">Arrastra para mover · rueda del ratón para zoom</p>
          </div>
          <button type="button" onClick={onCerrar}
            className="flex size-8 items-center justify-center rounded-full text-zinc-500 transition hover:bg-white/10 hover:text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          ref={containerRef}
          className={`relative mx-auto overflow-hidden rounded-2xl bg-zinc-800 cursor-grab active:cursor-grabbing select-none ${isAvatar ? "w-[280px] h-[280px]" : "w-full"}`}
          style={!isAvatar ? { aspectRatio: "3 / 1" } : undefined}
          onMouseDown={e => startDrag(e.clientX, e.clientY)}
          onMouseMove={e => moveDrag(e.clientX, e.clientY)}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchStart={e => { const t = e.touches[0]; startDrag(t.clientX, t.clientY); }}
          onTouchMove={e => { e.preventDefault(); const t = e.touches[0]; moveDrag(t.clientX, t.clientY); }}
          onTouchEnd={stopDrag}
        >
          {src && (
            <img ref={imgRef} src={src} onLoad={onImgLoad} draggable={false} alt=""
              style={nw > 0 ? {
                position: "absolute", width: nw * scale, height: nh * scale,
                left: imgLeft, top: imgTop, userSelect: "none", pointerEvents: "none",
              } : { display: "none" }} />
          )}

          {/* Borde redondeado para logo */}
          {isAvatar && cw > 0 && (
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-violet-400/50" />
          )}

          {/* Guías de tercios para banner */}
          {!isAvatar && cw > 0 && (
            <svg width="100%" height="100%" className="pointer-events-none absolute inset-0">
              <line x1="33.33%" y1="0" x2="33.33%" y2="100%" stroke="rgba(255,255,255,0.13)" strokeWidth="1" />
              <line x1="66.66%" y1="0" x2="66.66%" y2="100%" stroke="rgba(255,255,255,0.13)" strokeWidth="1" />
              <line x1="0" y1="33.33%" x2="100%" y2="33.33%" stroke="rgba(255,255,255,0.13)" strokeWidth="1" />
              <line x1="0" y1="66.66%" x2="100%" y2="66.66%" stroke="rgba(255,255,255,0.13)" strokeWidth="1" />
              <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)"
                fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.4" />
            </svg>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button type="button" onClick={() => applyZoom(scale * 0.85)}
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-lg font-light text-zinc-400 transition hover:bg-white/10 hover:text-white">−</button>
          <input type="range" min={10} max={500} value={Math.round(scale * 100)}
            onChange={e => applyZoom(Number(e.target.value) / 100)}
            className="flex-1 cursor-pointer accent-violet-500" />
          <button type="button" onClick={() => applyZoom(scale * 1.15)}
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-lg font-light text-zinc-400 transition hover:bg-white/10 hover:text-white">+</button>
          <span className="w-10 text-right text-xs tabular-nums text-zinc-500">{Math.round(scale * 100)}%</span>
        </div>

        <div className="mt-5 flex gap-3">
          <button type="button" onClick={confirmar}
            className="flex-1 rounded-full bg-violet-500 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400">
            Aplicar
          </button>
          <button type="button" onClick={onCerrar}
            className="rounded-full bg-white/5 px-6 py-2.5 text-sm text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

/* Tarjeta de obra publicada por la empresa */
function TarjetaObraEmpresa({
  obra,
  onEditar,
  onEliminar,
}: {
  obra: ObraEmpresa;
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
            className="flex items-center gap-1 rounded-full bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-400">
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
        <div className="mb-1 flex items-center gap-1.5">
          <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-400/15 text-[9px] font-bold text-violet-400">
            {obra.nombreArtista.slice(0, 1).toUpperCase()}
          </div>
          <p className="truncate text-[11px] font-semibold text-violet-300">{obra.nombreArtista}</p>
        </div>
        <p className="truncate text-xs font-bold uppercase tracking-wide text-white">{obra.titulo}</p>
        <p className="mt-0.5 text-[10px] text-zinc-500">
          {obra.anio}{obra.tecnica && ` · ${obra.tecnica}`}
        </p>
        {obra.estado !== "aprobada" && (
          <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            obra.estado === "rechazada"
              ? "bg-red-400/10 text-red-400"
              : "bg-amber-400/10 text-amber-400"
          }`}>
            {obra.estado === "rechazada" ? "Rechazada" : "En revisión"}
          </span>
        )}
        {obra.precio > 0 && (
          <p className="mt-1 text-xs font-semibold text-violet-400">
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

export default function MiPerfilEmpresa() {
  const { perfil, guardar, cerrarSesion } = usePerfil();
  const { toast } = useToast();
  const { obras, listo: obrasListas, agregar, actualizar, eliminar } = useObrasEmpresa();

  const [vista, setVista] = useState<Vista>("obras");
  const [formAjustes, setFormAjustes] = useState<DatosPerfil | null>(null);
  const [subiendoAvatar, setSubiendoAvatar] = useState(false);
  const [subiendoBanner, setSubiendoBanner] = useState(false);
  const [dragOverAvatar, setDragOverAvatar] = useState(false);
  const [dragOverBanner, setDragOverBanner] = useState(false);
  const [cropFile, setCropFile] = useState<{ file: File; tipo: "avatar" | "banner" } | null>(null);
  const [modalObra, setModalObra] = useState<null | "nueva" | string>(null);
  const [pendingAction, setPendingAction] = useState<{
    tipo: "eliminar" | "editar";
    obraId: string;
    titulo: string;
  } | null>(null);

  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  if (!perfil) return null;

  const slug = perfil.slug || generarSlug(perfil.nombre);

  function abrirAjustes() { setFormAjustes({ ...perfil! }); setVista("ajustes"); }
  function cerrarAjustes() { setFormAjustes(null); setVista("obras"); }
  function cerrarVista() { setVista("obras"); }
  function submitAjustes(e: React.FormEvent) {
    e.preventDefault();
    if (!formAjustes) return;
    guardar(formAjustes);
    toast("Perfil actualizado", { icono: "✓" });
    cerrarAjustes();
  }

  function procesarArchivo(file: File, tipo: "avatar" | "banner") {
    if (!file.type.startsWith("image/")) return;
    setCropFile({ file, tipo });
  }

  async function confirmarCrop(blob: Blob, tipo: "avatar" | "banner") {
    setCropFile(null);
    const setSub = tipo === "avatar" ? setSubiendoAvatar : setSubiendoBanner;
    setSub(true);
    try {
      const clave = perfil?.email || perfil?.slug || "empresa";
      const form = new FormData();
      form.append("file", new File([blob], `${tipo}.webp`, { type: "image/webp" }));
      form.append("tipo", tipo);
      form.append("clave", clave);
      if (perfil?.email)  form.append("email",  perfil.email);
      if (perfil?.nombre) form.append("nombre", perfil.nombre);
      const res = await fetch("/api/perfil/imagen", { method: "POST", body: form });
      if (!res.ok) throw new Error("upload");
      const { url } = await res.json();
      setFormAjustes(prev => prev ? { ...prev, [`${tipo}_url`]: url } : prev);
    } catch { /* el usuario puede reintentar */ }
    finally { setSub(false); }
  }

  function manejarImagen(e: React.ChangeEvent<HTMLInputElement>, tipo: "avatar" | "banner") {
    const file = e.target.files?.[0];
    if (!file) return;
    procesarArchivo(file, tipo);
    e.target.value = "";
  }

  function manejarDrop(e: React.DragEvent, tipo: "avatar" | "banner") {
    e.preventDefault();
    setDragOverAvatar(false);
    setDragOverBanner(false);
    const file = e.dataTransfer.files?.[0];
    if (file) procesarArchivo(file, tipo);
  }

  function guardarObra(datos: Omit<ObraEmpresa, "id">) {
    if (modalObra === "nueva") agregar(datos);
    else if (typeof modalObra === "string") actualizar(modalObra, datos);
  }

  function confirmarAccion() {
    if (!pendingAction) return;
    if (pendingAction.tipo === "eliminar") {
      eliminar(pendingAction.obraId);
      toast(`"${pendingAction.titulo}" eliminada`, { icono: "✓" });
    } else {
      setModalObra(pendingAction.obraId);
    }
    setPendingAction(null);
  }

  const obraEnEdicion =
    typeof modalObra === "string" && modalObra !== "nueva"
      ? obras.find((o) => o.id === modalObra)
      : undefined;

  const nombreMostrar = perfil.nombre || "Tu galería";
  const obrasConPrecio = obras.filter((o) => o.precio > 0);
  const totalValor = obrasConPrecio.reduce((s, o) => s + o.precio, 0);
  const artistasRepresentados = [...new Set(obras.map((o) => o.nombreArtista).filter(Boolean))];

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
            <div className="h-44 w-full bg-gradient-to-br from-violet-950/60 via-zinc-900 to-zinc-950 sm:h-56" />
          )}

          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <div className="relative flex flex-col gap-4 pb-4 sm:flex-row sm:items-end sm:gap-6">

              {/* Avatar empresa */}
              <div className="absolute -top-14 left-0 size-28 overflow-hidden rounded-2xl ring-4 ring-zinc-950 sm:-top-16 sm:size-36">
                {perfil.avatar_url ? (
                  <NextImage src={perfil.avatar_url} alt={nombreMostrar} fill sizes="144px" className="object-cover" />
                ) : (
                  <div className="flex size-full items-center justify-center bg-violet-500 text-4xl font-bold text-white sm:text-5xl">
                    {iniciales(nombreMostrar)}
                  </div>
                )}
              </div>

              {/* Nombre + Ver pública */}
              <div className="ml-32 mt-2 flex items-end justify-between gap-4 pt-2 sm:ml-44 sm:mt-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-white sm:text-2xl">{nombreMostrar}</h1>
                    <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-violet-400 ring-1 ring-violet-400/30">
                      Galería
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-zinc-400">
                    {perfil.especialidad || "Galería / empresa de arte"}
                    {perfil.pais && <> · <span className="text-zinc-500">{perfil.pais}</span></>}
                  </p>
                </div>
                <Link href={`/empresa/${slug}`}
                  className="flex shrink-0 items-center gap-1.5 rounded-full bg-violet-500/10 px-4 py-1.5 text-xs text-violet-400 ring-1 ring-violet-400/30 transition hover:bg-violet-500/20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  Ver pública
                </Link>
              </div>
            </div>

            {/* Stats bar */}
            <div className="mt-12 flex gap-6 border-t border-white/10 pt-3 sm:mt-2">
              {[
                { valor: obras.length,                 etiqueta: "Obras publicadas"      },
                { valor: artistasRepresentados.length, etiqueta: "Artistas representados" },
                { valor: totalValor > 0 ? `$${(totalValor / 1000).toFixed(0)}k` : "—",
                                                       etiqueta: "Valor en catálogo MXN" },
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
                  {perfil.bio || "Añade una descripción de tu galería o empresa."}
                </p>
                <button type="button" onClick={abrirAjustes}
                  className="mt-3 text-xs text-violet-400 underline-offset-2 hover:underline">
                  Editar descripción
                </button>
              </div>

              {/* Artistas representados */}
              {artistasRepresentados.length > 0 && (
                <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                  <h2 className="mb-3 text-sm font-semibold text-white">Artistas representados</h2>
                  <div className="space-y-2">
                    {artistasRepresentados.map((nombre) => (
                      <div key={nombre} className="flex items-center gap-2.5 rounded-xl px-2 py-1.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-400/10 text-[11px] font-bold text-violet-400">
                          {nombre.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-zinc-200">{nombre}</p>
                          <p className="text-[10px] text-zinc-500">
                            {obras.filter(o => o.nombreArtista === nombre).length} obras
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navegación */}
              <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                <h2 className="mb-3 text-sm font-semibold text-white">Mi espacio</h2>
                <nav className="space-y-1">
                  {[
                    { id: "obras",   label: "Obras publicadas", badge: obras.length || undefined },
                    { id: "analisis", label: "Análisis" },
                  ].map(({ id, label, badge }) => (
                    <button key={id} type="button" onClick={() => setVista(id as Vista)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                        vista === id
                          ? "bg-violet-400/10 text-violet-400 ring-1 ring-violet-400/20"
                          : "text-zinc-300 hover:bg-white/5 hover:text-white"
                      }`}>
                      <span>{label}</span>
                      {badge !== undefined && (
                        <span className="text-xs font-semibold text-violet-400">{badge}</span>
                      )}
                    </button>
                  ))}
                </nav>
                <div className="mt-3 border-t border-white/5 pt-3">
                  <button type="button" onClick={abrirAjustes}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                      vista === "ajustes"
                        ? "bg-violet-400/10 text-violet-400 ring-1 ring-violet-400/20"
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

              {/* ── Obras publicadas ── */}
              {vista === "obras" && (
                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Obras publicadas</h2>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {!obrasListas
                          ? "Cargando..."
                          : obras.length === 0
                          ? "Aún no has publicado ninguna obra"
                          : `${obras.length} ${obras.length === 1 ? "obra disponible" : "obras disponibles"}`}
                      </p>
                    </div>
                    <button type="button" onClick={() => setModalObra("nueva")}
                      className="flex items-center gap-2 rounded-full bg-violet-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-400">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="size-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      Publicar obra
                    </button>
                  </div>

                  {obrasListas && obras.length === 0 ? (
                    <button type="button" onClick={() => setModalObra("nueva")}
                      className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/10 py-16 text-center transition hover:border-violet-400/30 hover:bg-violet-400/5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-10 text-zinc-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                      </svg>
                      <p className="text-sm font-medium text-zinc-500">Publica la primera obra de tu galería</p>
                      <p className="text-xs text-zinc-600">Asigna el artista, imagen, técnica y precio</p>
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {obras.map((obra) => (
                        <TarjetaObraEmpresa
                          key={obra.id}
                          obra={obra}
                          onEditar={() => setPendingAction({ tipo: "editar", obraId: obra.id, titulo: obra.titulo })}
                          onEliminar={() => setPendingAction({ tipo: "eliminar", obraId: obra.id, titulo: obra.titulo })}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Análisis ── */}
              {vista === "analisis" && (
                <SeccionAnalisis
                  obras={obras}
                  obrasListas={obrasListas}
                  artistasRepresentados={artistasRepresentados}
                  totalValor={totalValor}
                  obrasConPrecio={obrasConPrecio}
                  onVolver={cerrarVista}
                />
              )}

              {/* ── Ajustes ── */}
              {vista === "ajustes" && formAjustes && (
                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">Ajustes</h2>
                      <p className="mt-0.5 text-xs text-zinc-500">Personaliza el perfil de tu galería</p>
                    </div>
                    <button type="button" onClick={cerrarAjustes}
                      className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white">
                      ← Volver
                    </button>
                  </div>

                  <form onSubmit={submitAjustes} className="space-y-5 rounded-2xl bg-zinc-900/70 p-6 ring-1 ring-white/10">

                    {/* ── Imágenes ── */}
                    <div>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Logo */}
                        <div>
                          <p className="mb-2 text-xs font-medium text-zinc-400">Logo</p>
                          <button type="button" onClick={() => avatarRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); setDragOverAvatar(true); }}
                            onDragEnter={e => { e.preventDefault(); setDragOverAvatar(true); }}
                            onDragLeave={() => setDragOverAvatar(false)}
                            onDrop={e => manejarDrop(e, "avatar")}
                            className={`group relative flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-800 ring-1 transition ${dragOverAvatar ? "scale-[1.02] ring-violet-400/60 bg-violet-400/5" : "ring-white/10 hover:ring-violet-400/40"}`}>
                            {formAjustes.avatar_url ? (
                              <img src={formAjustes.avatar_url} alt="" className="size-full object-cover" />
                            ) : (
                              <div className="flex size-20 items-center justify-center rounded-full bg-violet-500 text-3xl font-bold text-white">
                                {iniciales(nombreMostrar)}
                              </div>
                            )}
                            <div className={`absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/55 transition ${dragOverAvatar ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                              {subiendoAvatar ? (
                                <span className="text-xs text-white">Subiendo…</span>
                              ) : dragOverAvatar ? (
                                <>
                                  <IconoCamera />
                                  <span className="text-xs text-white">Suelta para subir</span>
                                </>
                              ) : (
                                <>
                                  <IconoCamera />
                                  <span className="text-xs text-white">Cambiar logo</span>
                                </>
                              )}
                            </div>
                          </button>
                          <input ref={avatarRef} type="file" accept="image/*" className="hidden"
                            onChange={e => manejarImagen(e, "avatar")} />
                          <p className="mt-1.5 text-[10px] text-zinc-600">400 × 400 px recomendado</p>
                        </div>
                        {/* Portada */}
                        <div>
                          <p className="mb-2 text-xs font-medium text-zinc-400">Portada</p>
                          <button type="button" onClick={() => bannerRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); setDragOverBanner(true); }}
                            onDragEnter={e => { e.preventDefault(); setDragOverBanner(true); }}
                            onDragLeave={() => setDragOverBanner(false)}
                            onDrop={e => manejarDrop(e, "banner")}
                            className={`group relative block h-32 w-full overflow-hidden rounded-2xl ring-1 transition ${dragOverBanner ? "scale-[1.02] ring-violet-400/60 bg-violet-400/5" : "ring-white/10 hover:ring-violet-400/40"}`}>
                            {formAjustes.banner_url ? (
                              <img src={formAjustes.banner_url} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-zinc-800 via-violet-950/40 to-zinc-900" />
                            )}
                            <div className={`absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/55 transition ${dragOverBanner ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                              {subiendoBanner ? (
                                <span className="text-xs text-white">Subiendo…</span>
                              ) : dragOverBanner ? (
                                <>
                                  <IconoCamera />
                                  <span className="text-xs text-white">Suelta para subir</span>
                                </>
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
                          <p className="mt-1.5 text-[10px] text-zinc-600">1200 × 400 px recomendado</p>
                        </div>
                      </div>
                      <p className="mt-3 text-[10px] text-zinc-600">
                        Las imágenes se convierten a .webp automáticamente
                      </p>
                    </div>

                    {/* ── Datos ── */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-400">Nombre de la galería</label>
                        <input value={formAjustes.nombre}
                          onChange={e => setFormAjustes({ ...formAjustes, nombre: e.target.value })}
                          placeholder="Galería Norte Arte" className={INPUT} />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-zinc-400">País</label>
                        <input value={formAjustes.pais}
                          onChange={e => setFormAjustes({ ...formAjustes, pais: e.target.value })}
                          placeholder="México" className={INPUT} />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-400">Tipo / especialidad</label>
                      <input value={formAjustes.especialidad}
                        onChange={e => setFormAjustes({ ...formAjustes, especialidad: e.target.value })}
                        placeholder="Arte contemporáneo, esculturas, fotografía…" className={INPUT} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-zinc-400">Descripción</label>
                      <textarea value={formAjustes.bio}
                        onChange={e => setFormAjustes({ ...formAjustes, bio: e.target.value })}
                        placeholder="Historia de la galería, misión y tipo de arte que representa…"
                        rows={4} className={INPUT + " resize-none"} />
                    </div>

                    {/* URL pública */}
                    <div className="rounded-xl bg-violet-400/5 px-4 py-3 ring-1 ring-violet-400/20">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-violet-400">URL pública</p>
                      <p className="font-mono text-xs text-violet-300">/empresa/{slug}</p>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button type="submit"
                        className="flex-1 rounded-full bg-violet-500 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400">
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

              {/* Tu perfil público */}
              <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                <h2 className="mb-3 text-sm font-semibold text-white">Tu galería pública</h2>
                <p className="mb-3 text-xs leading-relaxed text-zinc-400">
                  Así te ven los coleccionistas y compradores en ERUDITO.
                </p>
                <Link href={`/empresa/${slug}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500/10 py-2.5 text-xs font-semibold text-violet-400 ring-1 ring-violet-400/30 transition hover:bg-violet-500/20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  Ver perfil público
                </Link>
              </div>

              <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                <h2 className="mb-3 text-sm font-semibold text-white">Estadísticas</h2>
                {obras.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-4 text-center">
                    <p className="text-xs text-zinc-500">Aún no tienes obras publicadas</p>
                    <button type="button" onClick={() => setModalObra("nueva")}
                      className="rounded-full bg-violet-400/10 px-4 py-2 text-xs font-semibold text-violet-400 ring-1 ring-violet-400/20 transition hover:bg-violet-400/20">
                      + Publica tu primera obra
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[
                      { label: "Obras publicadas",       valor: obras.length.toString(),                          color: "text-violet-400" },
                      { label: "Artistas representados", valor: artistasRepresentados.length.toString(),           color: "text-white"      },
                      { label: "Con precio",             valor: obrasConPrecio.length.toString(),                  color: "text-white"      },
                      { label: "Físicas",                valor: obras.filter(o => o.tipo === "Físico").length.toString(), color: "text-white" },
                      { label: "Ediciones limitadas",    valor: obras.filter(o => o.tipo === "Edición limitada").length.toString(), color: "text-white" },
                    ].map(({ label, valor, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-xs text-zinc-400">{label}</span>
                        <span className={`text-xs font-semibold ${color}`}>{valor}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {obras.length > 0 && (
                <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
                  <h2 className="mb-3 text-sm font-semibold text-white">Técnicas en catálogo</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {[...new Set(obras.map(o => o.tecnica).filter(Boolean))].map(t => (
                      <span key={t}
                        className="rounded-full bg-violet-400/10 px-2.5 py-0.5 text-[11px] text-violet-400 ring-1 ring-violet-400/20">
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

      {cropFile && (
        <CropModal
          file={cropFile.file}
          tipo={cropFile.tipo}
          onConfirm={blob => confirmarCrop(blob, cropFile.tipo)}
          onCerrar={() => setCropFile(null)}
        />
      )}

      {/* ── Modal de obra ───────────────────────────────────── */}
      {modalObra !== null && (
        <FormObraEmpresa
          inicial={obraEnEdicion}
          onGuardar={guardarObra}
          onCerrar={() => setModalObra(null)}
        />
      )}

      {/* ── Modal de confirmación (editar / eliminar) ─────── */}
      {pendingAction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => setPendingAction(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-zinc-900 p-6 shadow-2xl ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <p className={`text-xs font-semibold uppercase tracking-widest ${
              pendingAction.tipo === "eliminar" ? "text-red-400" : "text-violet-400"
            }`}>
              {pendingAction.tipo === "eliminar" ? "Confirmar eliminación" : "Confirmar edición"}
            </p>
            <h2 className="mt-2 truncate text-base font-bold text-white">
              {pendingAction.titulo}
            </h2>
            <p className="mt-1.5 text-sm text-zinc-400">
              {pendingAction.tipo === "eliminar"
                ? "Esta obra se eliminará permanentemente. Esta acción no se puede deshacer."
                : "¿Deseas abrir el formulario de edición para esta obra?"}
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={confirmarAccion}
                className={`flex-1 rounded-full py-2.5 text-sm font-semibold text-white transition ${
                  pendingAction.tipo === "eliminar"
                    ? "bg-red-500/80 hover:bg-red-500"
                    : "bg-violet-500 hover:bg-violet-400"
                }`}
              >
                {pendingAction.tipo === "eliminar" ? "Eliminar" : "Editar obra"}
              </button>
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                className="rounded-full bg-white/5 px-5 py-2.5 text-sm text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Sección Análisis del catálogo                              */
/* ─────────────────────────────────────────────────────────── */

function BarraProgreso({ valor, total, color }: { valor: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((valor / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-7 text-right text-[11px] font-semibold text-zinc-400">{valor}</span>
    </div>
  );
}

function FilaMetrica({ label, valor, accent = false }: { label: string; valor: string | number; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-xs text-zinc-400">{label}</span>
      <span className={`text-xs font-semibold ${accent ? "text-violet-400" : "text-white"}`}>{valor}</span>
    </div>
  );
}

interface SeccionAnalisisProps {
  obras: ObraEmpresa[];
  obrasListas: boolean;
  artistasRepresentados: string[];
  totalValor: number;
  obrasConPrecio: ObraEmpresa[];
  onVolver: () => void;
}

function SeccionAnalisis({ obras, obrasListas, artistasRepresentados, totalValor, obrasConPrecio, onVolver }: SeccionAnalisisProps) {
  const total = obras.length;

  const aprobadas  = obras.filter(o => o.estado === "aprobada").length;
  const pendientes = obras.filter(o => !o.estado || o.estado === "pendiente").length;
  const rechazadas = obras.filter(o => o.estado === "rechazada").length;

  const precioProm = obrasConPrecio.length > 0
    ? Math.round(totalValor / obrasConPrecio.length)
    : 0;
  const precioMax  = obrasConPrecio.length > 0 ? Math.max(...obrasConPrecio.map(o => o.precio)) : 0;
  const precioMin  = obrasConPrecio.length > 0 ? Math.min(...obrasConPrecio.map(o => o.precio)) : 0;

  // Por tipo
  const tipos = [...new Set(obras.map(o => o.tipo).filter(Boolean))];
  const porTipo = tipos.map(t => ({ t, n: obras.filter(o => o.tipo === t).length }))
    .sort((a, b) => b.n - a.n);

  // Por técnica
  const tecnicas = [...new Set(obras.map(o => o.tecnica).filter(Boolean))];
  const porTecnica = tecnicas.map(t => ({ t, n: obras.filter(o => o.tecnica === t).length }))
    .sort((a, b) => b.n - a.n).slice(0, 8);

  // Artistas con más obras
  const porArtista = artistasRepresentados
    .map(nombre => ({ nombre, n: obras.filter(o => o.nombreArtista === nombre).length }))
    .sort((a, b) => b.n - a.n).slice(0, 6);

  if (!obrasListas) {
    return <div className="py-20 text-center text-sm text-zinc-500">Cargando análisis…</div>;
  }

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/10 py-20 text-center">
        <p className="text-sm text-zinc-500">Publica obras para ver el análisis de tu catálogo</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Análisis del catálogo</h2>
          <p className="mt-0.5 text-xs text-zinc-500">{total} {total === 1 ? "obra en catálogo" : "obras en catálogo"}</p>
        </div>
        <button type="button" onClick={onVolver}
          className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white">
          ← Volver
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">

        {/* Estado de obras */}
        <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
          <h3 className="mb-4 text-sm font-semibold text-white">Estado del catálogo</h3>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-emerald-400">Aprobadas</span>
              </div>
              <BarraProgreso valor={aprobadas} total={total} color="bg-emerald-500" />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-amber-400">En revisión</span>
              </div>
              <BarraProgreso valor={pendientes} total={total} color="bg-amber-500" />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-red-400">Rechazadas</span>
              </div>
              <BarraProgreso valor={rechazadas} total={total} color="bg-red-500" />
            </div>
          </div>
        </div>

        {/* Valoración */}
        <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
          <h3 className="mb-1 text-sm font-semibold text-white">Valoración del catálogo</h3>
          <p className="mb-4 text-[10px] text-zinc-500">Solo obras con precio asignado</p>
          <FilaMetrica label="Obras con precio" valor={obrasConPrecio.length} accent />
          <FilaMetrica label="Valor total" valor={totalValor > 0 ? `$${totalValor.toLocaleString("es-MX")} MXN` : "—"} accent />
          <FilaMetrica label="Precio promedio" valor={precioProm > 0 ? `$${precioProm.toLocaleString("es-MX")}` : "—"} />
          <FilaMetrica label="Precio máximo" valor={precioMax > 0 ? `$${precioMax.toLocaleString("es-MX")}` : "—"} />
          <FilaMetrica label="Precio mínimo" valor={precioMin > 0 ? `$${precioMin.toLocaleString("es-MX")}` : "—"} />
        </div>

        {/* Por tipo */}
        {porTipo.length > 0 && (
          <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
            <h3 className="mb-4 text-sm font-semibold text-white">Distribución por tipo</h3>
            <div className="space-y-3">
              {porTipo.map(({ t, n }) => (
                <div key={t}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs text-zinc-300">{t}</span>
                  </div>
                  <BarraProgreso valor={n} total={total} color="bg-violet-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Artistas con más obras */}
        {porArtista.length > 0 && (
          <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
            <h3 className="mb-4 text-sm font-semibold text-white">Artistas por aportación</h3>
            <div className="space-y-3">
              {porArtista.map(({ nombre, n }, i) => (
                <div key={nombre} className="flex items-center gap-3">
                  <span className="w-4 text-[10px] font-bold text-zinc-600">{i + 1}</span>
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-violet-400/10 text-[10px] font-bold text-violet-400">
                    {nombre.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-zinc-200">{nombre}</p>
                    <BarraProgreso valor={n} total={total} color="bg-violet-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Por técnica */}
        {porTecnica.length > 0 && (
          <div className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10 sm:col-span-2">
            <h3 className="mb-4 text-sm font-semibold text-white">Técnicas en catálogo</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {porTecnica.map(({ t, n }) => (
                <div key={t}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs text-zinc-300">{t}</span>
                  </div>
                  <BarraProgreso valor={n} total={total} color="bg-violet-400/70" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
