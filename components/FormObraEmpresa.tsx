"use client";

import { useEffect, useRef, useState } from "react";
import InputImagen from "@/components/InputImagen";
import type { ObraEmpresa, TamanoObra, ColorObra, TipoObra } from "@/hooks/useObrasEmpresa";

type Datos = Omit<ObraEmpresa, "id">;

const VACIO: Datos = {
  nombreArtista: "",
  titulo: "",
  anio: "",
  descripcion: "",
  imagen: "",
  tecnica: "",
  tamano: "Mediano",
  color: "Multicolor",
  movimiento: "",
  precio: 0,
  tipo: "Físico",
};

const INPUT =
  "w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-violet-400/50";

const SELECT = INPUT + " cursor-pointer";

interface Props {
  inicial?: ObraEmpresa;
  onGuardar: (datos: Datos) => void;
  onCerrar: () => void;
}

export default function FormObraEmpresa({ inicial, onGuardar, onCerrar }: Props) {
  const [form, setForm] = useState<Datos>(inicial ? { ...inicial } : { ...VACIO });
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function set<K extends keyof Datos>(key: K, value: Datos[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombreArtista.trim() || !form.titulo.trim()) return;
    onGuardar(form);
    onCerrar();
  }

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onCerrar(); }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
    >
      <div className="w-full max-w-lg overflow-y-auto rounded-t-3xl bg-zinc-900 ring-1 ring-white/10 sm:max-h-[92vh] sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-base font-semibold text-white">
            {inicial ? "Editar obra" : "Publicar obra"}
          </h2>
          <button type="button" onClick={onCerrar}
            className="flex size-8 items-center justify-center rounded-full bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 px-6 py-5">

          {/* Artista — campo destacado */}
          <div className="rounded-2xl bg-violet-400/5 p-4 ring-1 ring-violet-400/20">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-violet-400">
              Artista representado *
            </label>
            <input
              value={form.nombreArtista}
              onChange={e => set("nombreArtista", e.target.value)}
              placeholder="Nombre completo del artista"
              required
              className={INPUT.replace("ring-white/10", "ring-violet-400/30") + " focus:ring-violet-400/60"}
            />
            <p className="mt-1.5 text-[11px] text-zinc-500">
              Los visitantes verán este nombre y serán dirigidos al perfil de tu galería.
            </p>
          </div>

          {/* Imagen */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">Imagen de la obra</label>
            <InputImagen
              value={form.imagen}
              onChange={(url) => set("imagen", url)}
              accentColor="violet"
            />
          </div>

          {/* Título + Año */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Título *</label>
              <input value={form.titulo} onChange={e => set("titulo", e.target.value)}
                placeholder="Nombre de la obra" required className={INPUT} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Año</label>
              <input value={form.anio} onChange={e => set("anio", e.target.value)}
                placeholder="2024" className={INPUT} />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">Descripción</label>
            <textarea value={form.descripcion} onChange={e => set("descripcion", e.target.value)}
              placeholder="Historia, contexto e inspiración de la obra..."
              rows={3} className={INPUT + " resize-none"} />
          </div>

          {/* Técnica + Movimiento */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Técnica</label>
              <input value={form.tecnica} onChange={e => set("tecnica", e.target.value)}
                placeholder="Óleo, acrílico..." className={INPUT} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Movimiento</label>
              <input value={form.movimiento} onChange={e => set("movimiento", e.target.value)}
                placeholder="Surrealismo..." className={INPUT} />
            </div>
          </div>

          {/* Tamaño + Color */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Tamaño</label>
              <select value={form.tamano} onChange={e => set("tamano", e.target.value as TamanoObra)} className={SELECT}>
                {(["Pequeño", "Mediano", "Grande", "Extra grande"] as TamanoObra[]).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Color dominante</label>
              <select value={form.color} onChange={e => set("color", e.target.value as ColorObra)} className={SELECT}>
                {(["Cálido", "Frío", "Neutro", "Multicolor"] as ColorObra[]).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Precio + Tipo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Precio (USD)</label>
              <input type="number" min={0} value={form.precio}
                onChange={e => set("precio", Number(e.target.value))}
                placeholder="0" className={INPUT} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">Tipo</label>
              <select value={form.tipo} onChange={e => set("tipo", e.target.value as TipoObra)} className={SELECT}>
                {(["Físico", "JPG Certificado", "Edición limitada"] as TipoObra[]).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2 pb-1">
            <button type="submit"
              className="flex-1 rounded-full bg-violet-500 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400">
              {inicial ? "Guardar cambios" : "Publicar obra"}
            </button>
            <button type="button" onClick={onCerrar}
              className="rounded-full bg-white/5 px-5 py-2.5 text-sm text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
