"use client";

import Link from "next/link";
import { usePerfil } from "@/hooks/usePerfil";
import { useFavoritos } from "@/hooks/useFavoritos";

function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  if (partes.length >= 2)
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  return (nombre.slice(0, 2) || "CO").toUpperCase();
}

export default function PerfilComprador() {
  const { perfil, cerrarSesion } = usePerfil();
  const { favoritos } = useFavoritos();

  if (!perfil) return null;

  const nombreMostrar = perfil.nombre || "Coleccionista";

  return (
    <section className="mx-auto w-full max-w-lg px-4 py-16 sm:px-8">
      {/* Tarjeta principal */}
      <div className="flex flex-col items-center gap-5 rounded-3xl bg-zinc-900/70 p-8 text-center ring-1 ring-white/10">
        {/* Avatar */}
        <div className="flex size-20 items-center justify-center rounded-full bg-cyan-400/20 text-2xl font-bold text-cyan-400 ring-4 ring-cyan-400/20">
          {iniciales(nombreMostrar)}
        </div>

        <div>
          <h1 className="text-xl font-semibold text-white">{nombreMostrar}</h1>
          <span className="mt-1.5 inline-block rounded-full bg-cyan-400/10 px-3 py-0.5 text-[11px] font-medium text-cyan-400 ring-1 ring-cyan-400/20">
            Coleccionista
          </span>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/favoritos"
          className="flex items-center justify-between rounded-2xl bg-zinc-900/70 px-5 py-4 ring-1 ring-white/10 transition hover:ring-amber-400/30"
        >
          <div className="text-left">
            <p className="text-sm font-semibold text-white">Favoritos</p>
            <p className="text-xs text-zinc-500">
              {favoritos.length}{" "}
              {favoritos.length === 1 ? "obra guardada" : "obras guardadas"}
            </p>
          </div>
          <span className="text-amber-400">→</span>
        </Link>

        <Link
          href="/comparar"
          className="flex items-center justify-between rounded-2xl bg-zinc-900/70 px-5 py-4 ring-1 ring-white/10 transition hover:ring-cyan-400/30"
        >
          <div className="text-left">
            <p className="text-sm font-semibold text-white">Comparar</p>
            <p className="text-xs text-zinc-500">Obras seleccionadas</p>
          </div>
          <span className="text-cyan-400">→</span>
        </Link>

        <Link
          href="/obras"
          className="col-span-full flex items-center justify-between rounded-2xl bg-zinc-900/70 px-5 py-4 ring-1 ring-white/10 transition hover:ring-white/20"
        >
          <div className="text-left">
            <p className="text-sm font-semibold text-white">Galería</p>
            <p className="text-xs text-zinc-500">Explorar todas las obras</p>
          </div>
          <span className="text-zinc-400">→</span>
        </Link>
      </div>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={cerrarSesion}
          className="text-xs text-zinc-600 underline-offset-2 transition hover:text-red-400 hover:underline"
        >
          Cambiar tipo de perfil
        </button>
      </div>
    </section>
  );
}
