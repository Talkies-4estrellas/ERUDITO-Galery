"use client";

import Link from "next/link";
import { fichas } from "@/data/fichas";
import { useFavoritos } from "@/hooks/useFavoritos";
import FichaObra from "@/components/FichaObra";

export default function PaginaFavoritos() {
  const { favoritos, listo } = useFavoritos();
  const obras = fichas.filter((f) => favoritos.includes(f.id));

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-8">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold tracking-wide text-white">
          Favoritos
        </h1>
        {listo && (
          <p className="text-sm text-zinc-400">
            {obras.length} {obras.length === 1 ? "obra" : "obras"}
          </p>
        )}
      </div>

      {!listo ? null : obras.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
          {obras.map((ficha) => (
            <FichaObra key={ficha.id} ficha={ficha} fluida />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center text-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="size-12 text-zinc-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <p className="mt-4 text-sm text-zinc-400">
            Aún no has guardado ninguna obra.
          </p>
          <Link
            href="/obras"
            className="mt-4 rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300"
          >
            Explorar obras
          </Link>
        </div>
      )}
    </section>
  );
}
