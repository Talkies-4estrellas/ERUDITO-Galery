"use client";

import { useState } from "react";
import Image from "next/image";
import { usePerfil, type DatosPerfil } from "@/hooks/usePerfil";
import { useObrasArtista, type ObraPropia } from "@/hooks/useObrasArtista";
import FormObraArtista from "@/components/FormObraArtista";

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  if (partes.length >= 2)
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  return (nombre.slice(0, 2) || "AR").toUpperCase();
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
      {/* Imagen */}
      <div className="relative aspect-[3/4] bg-zinc-800">
        {obra.imagen ? (
          <Image
            src={obra.imagen}
            alt={obra.titulo}
            fill
            sizes="220px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="size-10 text-zinc-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
        )}

        {/* Botones flotantes visibles en hover */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={onEditar}
            className="flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-semibold text-zinc-900 transition hover:bg-amber-300"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
            </svg>
            Editar
          </button>
          <button
            type="button"
            onClick={onEliminar}
            className="flex items-center gap-1 rounded-full bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-red-400 ring-1 ring-red-400/30 transition hover:bg-red-400/20"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="truncate text-xs font-bold uppercase tracking-wide text-white">
          {obra.titulo}
        </p>
        <p className="mt-0.5 text-[10px] text-zinc-500">
          {obra.anio}
          {obra.tecnica && ` · ${obra.tecnica}`}
        </p>
        {obra.precio > 0 && (
          <p className="mt-1 text-xs font-semibold text-amber-400">
            ${obra.precio.toLocaleString("en-US")} USD
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
  const { obras, listo: obrasListas, agregar, actualizar, eliminar } =
    useObrasArtista();

  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [formPerfil, setFormPerfil] = useState<DatosPerfil | null>(null);

  // null = cerrado, "nueva" = nueva obra, string = id de obra a editar
  const [modalObra, setModalObra] = useState<null | "nueva" | string>(null);

  if (!perfil) return null;

  /* ─── Perfil handlers ───── */
  function iniciarEdicionPerfil() {
    setFormPerfil({ ...perfil! });
    setEditandoPerfil(true);
  }
  function cancelarEdicionPerfil() {
    setFormPerfil(null);
    setEditandoPerfil(false);
  }
  function submitPerfil(e: React.FormEvent) {
    e.preventDefault();
    if (!formPerfil) return;
    guardar(formPerfil);
    setEditandoPerfil(false);
    setFormPerfil(null);
  }

  /* ─── Obra handlers ───── */
  function guardarObra(datos: Omit<ObraPropia, "id">) {
    if (modalObra === "nueva") {
      agregar(datos);
    } else if (typeof modalObra === "string") {
      actualizar(modalObra, datos);
    }
  }

  const obraEnEdicion =
    typeof modalObra === "string" && modalObra !== "nueva"
      ? obras.find((o) => o.id === modalObra)
      : undefined;

  const nombreMostrar = perfil.nombre || "Tu nombre";
  const bioMostrar =
    perfil.bio ||
    "Añade una breve biografía para que los coleccionistas te conozcan.";
  const espMostrar = perfil.especialidad || "Sin especialidad";

  return (
    <>
      <section className="mx-auto w-full max-w-4xl px-4 pb-20 pt-8 sm:px-8">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-zinc-900/70 p-8 ring-1 ring-white/10 sm:flex-row sm:items-start">
          <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-amber-400 text-3xl font-bold text-zinc-900 ring-4 ring-amber-400/25">
            {iniciales(nombreMostrar)}
          </div>

          <div className="w-full flex-1 text-center sm:text-left">
            {editandoPerfil && formPerfil ? (
              <form onSubmit={submitPerfil} className="space-y-3">
                <input
                  value={formPerfil.nombre}
                  onChange={(e) =>
                    setFormPerfil({ ...formPerfil, nombre: e.target.value })
                  }
                  placeholder="Tu nombre"
                  className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-lg font-semibold text-white placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
                <div className="flex gap-3">
                  <input
                    value={formPerfil.especialidad}
                    onChange={(e) =>
                      setFormPerfil({
                        ...formPerfil,
                        especialidad: e.target.value,
                      })
                    }
                    placeholder="Especialidad (ej. Pintura al óleo)"
                    className="flex-1 rounded-xl bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                  <input
                    value={formPerfil.pais}
                    onChange={(e) =>
                      setFormPerfil({ ...formPerfil, pais: e.target.value })
                    }
                    placeholder="País"
                    className="w-32 rounded-xl bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                  />
                </div>
                <textarea
                  value={formPerfil.bio}
                  onChange={(e) =>
                    setFormPerfil({ ...formPerfil, bio: e.target.value })
                  }
                  placeholder="Cuéntanos sobre tu trayectoria y estilo artístico..."
                  rows={3}
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
                    onClick={cancelarEdicionPerfil}
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
                      onClick={iniciarEdicionPerfil}
                      className="flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-amber-400"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
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
                <p className={`mt-4 text-sm leading-relaxed ${perfil.bio ? "text-zinc-300" : "italic text-zinc-600"}`}>
                  {bioMostrar}
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── Stats ───────────────────────────────────────────── */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          {[
            { etiqueta: "Obras subidas", valor: obras.length.toString() },
            { etiqueta: "Con precio", valor: obras.filter((o) => o.precio > 0).length.toString() },
            { etiqueta: "Físicas", valor: obras.filter((o) => o.tipo === "Físico").length.toString() },
          ].map(({ etiqueta, valor }) => (
            <div key={etiqueta} className="rounded-2xl bg-zinc-900/70 px-4 py-5 text-center ring-1 ring-white/10">
              <p className="text-2xl font-semibold text-amber-400">{valor}</p>
              <p className="mt-1 text-xs text-zinc-500">{etiqueta}</p>
            </div>
          ))}
        </div>

        {/* ── Mis obras ───────────────────────────────────────── */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-wide text-white">
                Mis obras
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                {obrasListas
                  ? obras.length === 0
                    ? "Aún no has subido ninguna obra"
                    : `${obras.length} ${obras.length === 1 ? "obra publicada" : "obras publicadas"}`
                  : "Cargando..."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModalObra("nueva")}
              className="flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-zinc-900 transition hover:bg-amber-300"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="size-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Añadir obra
            </button>
          </div>

          {obrasListas && obras.length === 0 ? (
            /* Estado vacío */
            <button
              type="button"
              onClick={() => setModalObra("nueva")}
              className="mt-5 flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/10 py-14 text-center transition hover:border-amber-400/30 hover:bg-amber-400/5"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-10 text-zinc-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-sm font-medium text-zinc-500">
                Sube tu primera obra
              </p>
              <p className="text-xs text-zinc-600">
                Añade imagen, descripción, técnica y precio
              </p>
            </button>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
      </section>

      {/* ── Modal de obra ─────────────────────────────────────── */}
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
