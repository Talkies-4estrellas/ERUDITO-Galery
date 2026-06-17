"use client";

import type { Rol } from "@/hooks/usePerfil";

interface Props {
  onElegir: (rol: Rol) => void;
}

export default function SelectorRol({ onElegir }: Props) {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-20 sm:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-wide text-white">
          Bienvenido a ERUDITO
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          Elige cómo quieres participar en la galería
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Tarjeta Artista */}
        <button
          type="button"
          onClick={() => onElegir("artista")}
          className="group flex flex-col items-center gap-5 rounded-3xl bg-zinc-900/70 p-8 ring-1 ring-white/10 transition hover:bg-amber-400/10 hover:ring-amber-400/40"
        >
          <span className="flex size-16 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-400 ring-1 ring-amber-400/30 transition group-hover:bg-amber-400/25">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="size-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
              />
            </svg>
          </span>
          <div className="text-center">
            <p className="text-lg font-semibold text-white transition group-hover:text-amber-400">
              Soy Artista
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
              Exhibe tu obra, gestiona tu portfolio y conecta con coleccionistas
              de todo el mundo.
            </p>
          </div>
          <span className="mt-auto rounded-full bg-amber-400 px-5 py-1.5 text-xs font-semibold text-zinc-900 opacity-0 transition group-hover:opacity-100">
            Continuar →
          </span>
        </button>

        {/* Tarjeta Coleccionista */}
        <button
          type="button"
          onClick={() => onElegir("comprador")}
          className="group flex flex-col items-center gap-5 rounded-3xl bg-zinc-900/70 p-8 ring-1 ring-white/10 transition hover:bg-cyan-400/10 hover:ring-cyan-400/40"
        >
          <span className="flex size-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400 ring-1 ring-cyan-400/20 transition group-hover:bg-cyan-400/20">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="size-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </span>
          <div className="text-center">
            <p className="text-lg font-semibold text-white transition group-hover:text-cyan-400">
              Soy Coleccionista
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
              Descubre obras únicas, guarda tus favoritas y compáralas antes de
              tomar tu decisión.
            </p>
          </div>
          <span className="mt-auto rounded-full bg-cyan-400 px-5 py-1.5 text-xs font-semibold text-zinc-900 opacity-0 transition group-hover:opacity-100">
            Continuar →
          </span>
        </button>
      </div>
    </section>
  );
}
