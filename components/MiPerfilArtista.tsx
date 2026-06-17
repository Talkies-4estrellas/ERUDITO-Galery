"use client";

import { useState } from "react";
import { fichas } from "@/data/fichas";
import FichaObra from "@/components/FichaObra";
import { usePerfil, type DatosPerfil } from "@/hooks/usePerfil";

const PORTFOLIO = fichas.slice(0, 4);
const AVG_RATING = (
  PORTFOLIO.reduce((s, f) => s + f.estrellas, 0) / PORTFOLIO.length
).toFixed(1);
const TOTAL_CERTS = PORTFOLIO.reduce(
  (s, f) => s + f.certificaciones.length,
  0
);

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  if (partes.length >= 2)
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  return (nombre.slice(0, 2) || "AR").toUpperCase();
}

export default function MiPerfilArtista() {
  const { perfil, guardar, cerrarSesion } = usePerfil();
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState<DatosPerfil | null>(null);

  if (!perfil) return null;

  function iniciarEdicion() {
    setForm({ ...perfil! });
    setEditando(true);
  }

  function cancelar() {
    setForm(null);
    setEditando(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    guardar(form);
    setEditando(false);
    setForm(null);
  }

  const nombreMostrar = perfil.nombre || "Tu nombre";
  const bioMostrar =
    perfil.bio ||
    "Añade una breve biografía para que los coleccionistas te conozcan.";
  const espMostrar = perfil.especialidad || "Sin especialidad";

  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-20 pt-8 sm:px-8">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-6 rounded-3xl bg-zinc-900/70 p-8 ring-1 ring-white/10 sm:flex-row sm:items-start">
        {/* Avatar con iniciales */}
        <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-amber-400 text-3xl font-bold text-zinc-900 ring-4 ring-amber-400/25">
          {iniciales(nombreMostrar)}
        </div>

        {/* Información / Formulario */}
        <div className="flex-1 w-full text-center sm:text-left">
          {editando && form ? (
            <form onSubmit={submit} className="space-y-3">
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Tu nombre"
                className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-lg font-semibold text-white placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />
              <div className="flex gap-3">
                <input
                  value={form.especialidad}
                  onChange={(e) =>
                    setForm({ ...form, especialidad: e.target.value })
                  }
                  placeholder="Especialidad (ej. Pintura al óleo)"
                  className="flex-1 rounded-xl bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
                <input
                  value={form.pais}
                  onChange={(e) => setForm({ ...form, pais: e.target.value })}
                  placeholder="País"
                  className="w-32 rounded-xl bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
              </div>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Cuéntanos sobre tu trayectoria y estilo artístico..."
                rows={4}
                className="w-full resize-none rounded-xl bg-zinc-800 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300"
                >
                  Guardar cambios
                </button>
                <button
                  type="button"
                  onClick={cancelar}
                  className="rounded-full bg-white/5 px-5 py-2 text-sm text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-white">
                    {nombreMostrar}
                  </h1>
                  <p className="mt-1 text-sm text-zinc-400">
                    {espMostrar}
                    {perfil.pais && (
                      <>
                        {" · "}
                        <span className="text-zinc-500">{perfil.pais}</span>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={iniciarEdicion}
                    className="flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-amber-400"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="size-3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
                      />
                    </svg>
                    Editar perfil
                  </button>
                  <button
                    type="button"
                    onClick={cerrarSesion}
                    className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-500 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-red-400"
                  >
                    Salir
                  </button>
                </div>
              </div>

              <p
                className={`mt-4 text-sm leading-relaxed ${
                  perfil.bio ? "text-zinc-300" : "italic text-zinc-600"
                }`}
              >
                {bioMostrar}
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────── */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {[
          { etiqueta: "Obras", valor: PORTFOLIO.length.toString() },
          { etiqueta: "Valoración", valor: `${AVG_RATING} ★` },
          { etiqueta: "Certificaciones", valor: TOTAL_CERTS.toString() },
        ].map(({ etiqueta, valor }) => (
          <div
            key={etiqueta}
            className="rounded-2xl bg-zinc-900/70 px-4 py-5 text-center ring-1 ring-white/10"
          >
            <p className="text-2xl font-semibold text-amber-400">{valor}</p>
            <p className="mt-1 text-xs text-zinc-500">{etiqueta}</p>
          </div>
        ))}
      </div>

      {/* ── Portfolio ───────────────────────────────────────── */}
      <div className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-wide text-white">
            Mis obras en galería
          </h2>
          <span className="text-xs text-zinc-500">
            {PORTFOLIO.length} publicadas
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
          {PORTFOLIO.map((ficha) => (
            <FichaObra key={ficha.id} ficha={ficha} fluida />
          ))}
        </div>
      </div>
    </section>
  );
}
