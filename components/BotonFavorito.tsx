"use client";

import { useFavoritos } from "@/hooks/useFavoritos";

interface Props {
  id: number;
  /** Tamaño del botón; "sm" para tarjetas, "lg" para el detalle de obra */
  tamano?: "sm" | "lg";
}

export default function BotonFavorito({ id, tamano = "sm" }: Props) {
  const { esFavorito, alternar, listo } = useFavoritos();
  const activo = esFavorito(id);

  return (
    <button
      type="button"
      aria-label={activo ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-pressed={activo}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        alternar(id);
      }}
      className={`flex items-center justify-center rounded-full backdrop-blur transition ${
        tamano === "sm" ? "size-8" : "size-11"
      } ${
        activo
          ? "bg-amber-400 text-zinc-900"
          : "bg-black/50 text-white hover:bg-black/70"
      } ${listo ? "opacity-100" : "opacity-0"}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={activo ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        className={tamano === "sm" ? "size-4" : "size-5"}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}
