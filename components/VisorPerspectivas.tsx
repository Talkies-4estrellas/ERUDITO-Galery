"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  titulo: string;
  imagenes: string[];
}

export default function VisorPerspectivas({ titulo, imagenes }: Props) {
  const [actual, setActual] = useState(0);

  const irA = (indice: number) =>
    setActual((indice + imagenes.length) % imagenes.length);

  return (
    <div className="relative flex flex-col items-center rounded-2xl bg-gradient-to-b from-zinc-200 via-zinc-300 to-zinc-400 p-5 shadow-2xl sm:p-7">
      {/* Obra enmarcada sobre "pared" de museo */}
      <div className="relative flex aspect-[4/3] w-full items-center justify-center rounded-lg bg-zinc-100 p-4 shadow-inner sm:p-6">
        <div className="relative h-full w-full border-8 border-zinc-800 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <Image
            key={imagenes[actual]}
            src={imagenes[actual]}
            alt={`${titulo} — perspectiva ${actual + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Flechas */}
      <button
        type="button"
        onClick={() => irA(actual - 1)}
        aria-label="Perspectiva anterior"
        className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full bg-zinc-800/70 p-1.5 text-white transition hover:bg-zinc-800"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => irA(actual + 1)}
        aria-label="Perspectiva siguiente"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-zinc-800/70 p-1.5 text-white transition hover:bg-zinc-800"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Puntos para cambiar de perspectiva */}
      <div className="mt-4 flex items-center gap-2">
        {imagenes.map((img, indice) => (
          <button
            key={img}
            type="button"
            onClick={() => irA(indice)}
            aria-label={`Ver perspectiva ${indice + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              indice === actual
                ? "w-6 bg-zinc-800"
                : "w-2 bg-zinc-500 hover:bg-zinc-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
