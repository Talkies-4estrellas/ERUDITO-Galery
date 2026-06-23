"use client";

import { useState } from "react";
import { useResenas } from "@/hooks/useResenas";

interface Props {
  obraId: string;
}

function Estrellas({
  valor,
  onChange,
  readonly,
}: {
  valor: number;
  onChange?: (n: number) => void;
  readonly?: boolean;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => !readonly && setHover(n)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`text-xl transition-colors ${readonly ? "cursor-default" : "cursor-pointer"} ${
            n <= (hover || valor) ? "text-amber-400" : "text-zinc-700"
          }`}
          aria-label={readonly ? undefined : `${n} estrellas`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function formatearFechaCorta(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SeccionResenas({ obraId }: Props) {
  const { resenas, agregar, promedio } = useResenas(obraId);

  const [nombre, setNombre] = useState("");
  const [estrellas, setEstrellas] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) { setError("Escribe tu nombre."); return; }
    if (estrellas === 0)  { setError("Selecciona una puntuación."); return; }
    if (!comentario.trim()) { setError("Escribe un comentario."); return; }

    agregar({ nombre: nombre.trim(), estrellas, comentario: comentario.trim() });
    setEnviado(true);
    setNombre("");
    setEstrellas(0);
    setComentario("");
    setError("");
    setTimeout(() => setEnviado(false), 3500);
  }

  return (
    <section className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Reseñas
          </p>
          <h2 className="mt-0.5 text-lg font-bold text-white">
            {resenas.length === 0
              ? "Sin reseñas aún"
              : `${resenas.length} ${resenas.length === 1 ? "reseña" : "reseñas"}`}
          </h2>
        </div>
        {resenas.length > 0 && (
          <div className="ml-auto flex flex-col items-end gap-0.5">
            <Estrellas valor={Math.round(promedio)} readonly />
            <p className="text-[11px] text-zinc-500">
              {promedio.toFixed(1)} / 5 promedio
            </p>
          </div>
        )}
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10 space-y-4"
      >
        <p className="text-sm font-medium text-white">Deja tu reseña</p>

        {/* Nombre */}
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400" htmlFor="resena-nombre">
            Tu nombre
          </label>
          <input
            id="resena-nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre o alias"
            className="w-full rounded-xl bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none ring-1 ring-white/10 transition focus:ring-amber-400/50"
          />
        </div>

        {/* Puntuación */}
        <div className="space-y-1.5">
          <p className="text-xs text-zinc-400">Puntuación</p>
          <Estrellas valor={estrellas} onChange={setEstrellas} />
        </div>

        {/* Comentario */}
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400" htmlFor="resena-comentario">
            Comentario
          </label>
          <textarea
            id="resena-comentario"
            rows={3}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Comparte tu experiencia con esta obra…"
            className="w-full resize-none rounded-xl bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none ring-1 ring-white/10 transition focus:ring-amber-400/50"
          />
        </div>

        {error && <p className="text-xs text-rose-400">{error}</p>}

        {enviado ? (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-400 ring-1 ring-emerald-400/20">
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 shrink-0">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
            </svg>
            ¡Gracias por tu reseña!
          </div>
        ) : (
          <button
            type="submit"
            className="w-full rounded-xl bg-amber-400 py-2.5 text-sm font-bold text-zinc-900 transition hover:bg-amber-300 active:scale-95"
          >
            Publicar reseña
          </button>
        )}
      </form>

      {/* Lista de reseñas */}
      {resenas.length > 0 && (
        <ul className="space-y-4">
          {resenas.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl bg-zinc-900/50 p-4 ring-1 ring-white/8"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-xs font-bold text-amber-400">
                    {r.nombre.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{r.nombre}</p>
                    <p className="text-[10px] text-zinc-600">
                      {formatearFechaCorta(r.fecha)}
                    </p>
                  </div>
                </div>
                <Estrellas valor={r.estrellas} readonly />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                {r.comentario}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
