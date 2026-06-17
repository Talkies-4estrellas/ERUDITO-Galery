"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  OBRA_VACIA,
  type ObraPropia,
  type TamanoObra,
  type ColorObra,
  type TipoObra,
} from "@/hooks/useObrasArtista";

interface Props {
  inicial?: ObraPropia;
  onGuardar: (datos: Omit<ObraPropia, "id">) => void;
  onCerrar: () => void;
}

const INPUT =
  "w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50";

const SELECT = INPUT + " cursor-pointer";

const LABEL = "block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-1";

export default function FormObraArtista({ inicial, onGuardar, onCerrar }: Props) {
  const [form, setForm] = useState<Omit<ObraPropia, "id">>(
    inicial ? { ...inicial } : { ...OBRA_VACIA }
  );
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [form.imagen]);

  // Bloquea scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    onGuardar(form);
    onCerrar();
  }

  const tieneImagen = form.imagen.trim() !== "" && !imgError;

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
      onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}
    >
      {/* Panel */}
      <div className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-zinc-950 ring-1 ring-white/10 sm:max-h-[88dvh] sm:max-w-2xl sm:rounded-3xl">
        {/* Cabecera */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-6 py-4">
          <h2 className="text-base font-semibold text-white">
            {inicial ? "Editar obra" : "Añadir nueva obra"}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="flex size-7 items-center justify-center rounded-full bg-white/5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cuerpo con scroll */}
        <form onSubmit={submit} className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-5">

            {/* Preview de imagen */}
            <div>
              <label className={LABEL}>Imagen de la obra</label>
              <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-zinc-800 ring-1 ring-white/10">
                  {tieneImagen ? (
                    <Image
                      src={form.imagen}
                      alt="Vista previa"
                      fill
                      sizes="80px"
                      className="object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-8 text-zinc-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                    </div>
                  )}
                </div>
                <input
                  value={form.imagen}
                  onChange={(e) => set("imagen", e.target.value)}
                  placeholder="https://... URL de la imagen"
                  className={INPUT + " flex-1"}
                />
              </div>
              {imgError && (
                <p className="mt-1 text-xs text-red-400">URL de imagen no válida o inaccesible.</p>
              )}
            </div>

            {/* Título + Año */}
            <div className="grid grid-cols-[1fr_100px] gap-3">
              <div>
                <label className={LABEL}>Título <span className="text-amber-400">*</span></label>
                <input
                  value={form.titulo}
                  onChange={(e) => set("titulo", e.target.value)}
                  placeholder="Nombre de la obra"
                  required
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL}>Año</label>
                <input
                  value={form.anio}
                  onChange={(e) => set("anio", e.target.value)}
                  placeholder="2024"
                  className={INPUT}
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className={LABEL}>Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={(e) => set("descripcion", e.target.value)}
                placeholder="Describe la obra, su proceso, inspiración o significado..."
                rows={3}
                className={INPUT + " resize-none"}
              />
            </div>

            {/* Técnica + Movimiento */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Técnica</label>
                <input
                  value={form.tecnica}
                  onChange={(e) => set("tecnica", e.target.value)}
                  placeholder="Óleo, Acuarela, Mixta..."
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL}>Movimiento</label>
                <input
                  value={form.movimiento}
                  onChange={(e) => set("movimiento", e.target.value)}
                  placeholder="Muralismo, Abstracto..."
                  className={INPUT}
                />
              </div>
            </div>

            {/* Tamaño + Color */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Tamaño</label>
                <select
                  value={form.tamano}
                  onChange={(e) => set("tamano", e.target.value as TamanoObra)}
                  className={SELECT}
                >
                  <option value="Pequeño">Pequeño</option>
                  <option value="Mediano">Mediano</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>
              <div>
                <label className={LABEL}>Paleta de color</label>
                <select
                  value={form.color}
                  onChange={(e) => set("color", e.target.value as ColorObra)}
                  className={SELECT}
                >
                  <option value="Cálido">Cálido</option>
                  <option value="Frío">Frío</option>
                  <option value="Neutro">Neutro</option>
                </select>
              </div>
            </div>

            {/* Precio + Tipo */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={LABEL}>Precio (USD)</label>
                <input
                  type="number"
                  min={0}
                  value={form.precio || ""}
                  onChange={(e) => set("precio", Number(e.target.value))}
                  placeholder="0"
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL}>Tipo de obra</label>
                <select
                  value={form.tipo}
                  onChange={(e) => set("tipo", e.target.value as TipoObra)}
                  className={SELECT}
                >
                  <option value="Físico">Físico</option>
                  <option value="JPG Certificado">JPG Certificado</option>
                  <option value="Impresión Oficial">Impresión Oficial</option>
                </select>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="mt-6 flex gap-3 pb-2">
            <button
              type="submit"
              className="flex-1 rounded-full bg-amber-400 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300"
            >
              {inicial ? "Guardar cambios" : "Publicar obra"}
            </button>
            <button
              type="button"
              onClick={onCerrar}
              className="rounded-full bg-white/5 px-5 py-2.5 text-sm text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
