"use client";

import { useRef, useState, type DragEvent } from "react";
import Image from "next/image";
import { uploadWebp } from "@/lib/uploadWebp";

interface Props {
  value: string;
  onChange: (url: string) => void;
  accentColor?: "amber" | "violet";
}

type Estado = "idle" | "convirtiendo" | "subiendo" | "error";

const RING: Record<NonNullable<Props["accentColor"]>, string> = {
  amber:  "ring-amber-400/40 focus-within:ring-amber-400/60",
  violet: "ring-violet-400/40 focus-within:ring-violet-400/60",
};

const BTN: Record<NonNullable<Props["accentColor"]>, string> = {
  amber:  "bg-amber-400/10 text-amber-400 hover:bg-amber-400/20",
  violet: "bg-violet-400/10 text-violet-400 hover:bg-violet-400/20",
};

export default function InputImagen({
  value,
  onChange,
  accentColor = "amber",
}: Props) {
  const [estado, setEstado] = useState<Estado>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [drag, setDrag] = useState(false);
  const [mostrarUrl, setMostrarUrl] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function procesar(file: File) {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("El archivo debe ser una imagen.");
      setEstado("error");
      return;
    }
    setErrorMsg("");
    try {
      setEstado("convirtiendo");
      // Si ya es WebP saltamos la conversión directamente a "subiendo"
      if (file.type !== "image/webp") {
        // breve pausa para que el UI muestre "Convirtiendo"
        await new Promise((r) => setTimeout(r, 60));
      }
      setEstado("subiendo");
      const url = await uploadWebp(file, "/api/upload");
      onChange(url);
      setEstado("idle");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Error al subir la imagen.");
      setEstado("error");
    }
  }

  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) procesar(file);
    e.target.value = "";
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) procesar(file);
  }

  const cargando = estado === "convirtiendo" || estado === "subiendo";
  const etiqueta = estado === "convirtiendo" ? "Convirtiendo a WebP…" : "Subiendo…";

  return (
    <div className="space-y-2">
      {/* Zona de drop / preview */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => !cargando && inputRef.current?.click()}
        className={`relative flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-zinc-800 ring-1 transition ${
          drag ? "ring-amber-400 scale-[1.01]" : RING[accentColor]
        } ${cargando ? "cursor-wait" : ""}`}
      >
        {/* Preview de imagen actual */}
        {value && !cargando && (
          <Image
            src={value}
            alt="Vista previa"
            fill
            sizes="480px"
            className="object-cover"
          />
        )}

        {/* Overlay semitransparente sobre el preview */}
        {value && !cargando && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/40 opacity-0 transition hover:opacity-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-7 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-xs font-semibold text-white">Cambiar imagen</span>
          </div>
        )}

        {/* Estado vacío */}
        {!value && !cargando && (
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-8 text-zinc-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-zinc-300">
                {drag ? "Suelta aquí" : "Sube una imagen"}
              </p>
              <p className="mt-0.5 text-[10px] text-zinc-500">
                JPG, PNG, HEIC… — se convierte a WebP automáticamente
              </p>
            </div>
          </div>
        )}

        {/* Spinner de carga */}
        {cargando && (
          <div className="flex flex-col items-center gap-3">
            <svg className="size-8 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <p className="text-xs font-semibold text-zinc-300">{etiqueta}</p>
          </div>
        )}
      </div>

      {/* Badge WebP si hay imagen */}
      {value && !cargando && (
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-400/20">
            ✓ WebP
          </span>
          <p className="truncate text-[10px] text-zinc-600">{value}</p>
        </div>
      )}

      {/* Error */}
      {estado === "error" && (
        <p className="text-xs text-rose-400">{errorMsg}</p>
      )}

      {/* Toggle para pegar URL manualmente */}
      <button
        type="button"
        onClick={() => setMostrarUrl((v) => !v)}
        className="text-[10px] text-zinc-600 transition hover:text-zinc-400"
      >
        {mostrarUrl ? "▲ Ocultar URL" : "▾ O pega una URL directamente"}
      </button>

      {mostrarUrl && (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-xl bg-zinc-800 px-3 py-2 text-xs text-zinc-300 placeholder-zinc-600 ring-1 ring-white/10 outline-none focus:ring-amber-400/40"
        />
      )}

      {/* Input file oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileInput}
      />
    </div>
  );
}
