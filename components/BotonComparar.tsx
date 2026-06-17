"use client";

import { useComparacion } from "@/hooks/useComparacion";

interface Props {
  id: number;
}

export default function BotonComparar({ id }: Props) {
  const { estaSeleccionada, alternar, lleno, listo } = useComparacion();
  const activo = estaSeleccionada(id);
  const deshabilitado = !activo && lleno;

  return (
    <button
      type="button"
      aria-label={activo ? "Quitar de comparación" : "Agregar a comparación"}
      aria-pressed={activo}
      disabled={deshabilitado}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        alternar(id);
      }}
      title={
        deshabilitado
          ? "Ya tienes 3 obras para comparar"
          : activo
          ? "Quitar de comparación"
          : "Agregar a comparación"
      }
      className={`flex items-center justify-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur transition ${
        activo
          ? "bg-cyan-400 text-zinc-900"
          : deshabilitado
          ? "cursor-not-allowed bg-black/40 text-zinc-600"
          : "bg-black/50 text-white hover:bg-black/70"
      } ${listo ? "opacity-100" : "opacity-0"}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="size-3"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 7.5h6m-6 4.5h6m-6 4.5h3.75M5.25 4.5h13.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V5.25a.75.75 0 0 1 .75-.75Z"
        />
      </svg>
      {activo ? "Comparando" : "Comparar"}
    </button>
  );
}
