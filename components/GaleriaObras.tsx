"use client";

import { useMemo, useState } from "react";
import { fichas, type FichaArte } from "@/data/fichas";
import FichaObra from "@/components/FichaObra";

type ClaveFiltro = "tamano" | "color" | "movimiento" | "tecnica";

const grupos: { clave: ClaveFiltro; titulo: string }[] = [
  { clave: "tamano", titulo: "Tamaños" },
  { clave: "color", titulo: "Color" },
  { clave: "movimiento", titulo: "Movimiento" },
  { clave: "tecnica", titulo: "Técnica" },
];

const valoresDe = (clave: ClaveFiltro): string[] => [
  ...new Set(fichas.map((ficha) => ficha[clave])),
];

type Seleccion = Record<ClaveFiltro, string[]>;

const seleccionVacia: Seleccion = {
  tamano: [],
  color: [],
  movimiento: [],
  tecnica: [],
};

export default function GaleriaObras() {
  const [seleccion, setSeleccion] = useState<Seleccion>(seleccionVacia);

  const alternar = (clave: ClaveFiltro, valor: string) =>
    setSeleccion((previa) => ({
      ...previa,
      [clave]: previa[clave].includes(valor)
        ? previa[clave].filter((v) => v !== valor)
        : [...previa[clave], valor],
    }));

  const hayFiltros = grupos.some(({ clave }) => seleccion[clave].length > 0);

  // OR dentro de cada grupo, AND entre grupos
  const resultado = useMemo(
    () =>
      fichas.filter((ficha: FichaArte) =>
        grupos.every(
          ({ clave }) =>
            seleccion[clave].length === 0 ||
            seleccion[clave].includes(ficha[clave])
        )
      ),
    [seleccion]
  );

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-8">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold tracking-wide text-white">
          Obras
        </h1>
        <p className="text-sm text-zinc-400">
          {resultado.length} {resultado.length === 1 ? "obra" : "obras"}
        </p>
      </div>

      {/* Filtros */}
      <div className="mt-6 space-y-4 rounded-2xl bg-zinc-900/70 p-5 ring-1 ring-white/10">
        {grupos.map(({ clave, titulo }) => (
          <div key={clave} className="flex flex-wrap items-center gap-2">
            <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-widest text-amber-400">
              {titulo}
            </span>
            {valoresDe(clave).map((valor) => {
              const activo = seleccion[clave].includes(valor);
              return (
                <button
                  key={valor}
                  type="button"
                  onClick={() => alternar(clave, valor)}
                  aria-pressed={activo}
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    activo
                      ? "bg-amber-400 font-semibold text-zinc-900"
                      : "bg-white/5 text-zinc-300 ring-1 ring-white/10 hover:bg-white/15"
                  }`}
                >
                  {valor}
                </button>
              );
            })}
          </div>
        ))}

        {hayFiltros && (
          <button
            type="button"
            onClick={() => setSeleccion(seleccionVacia)}
            className="text-xs text-zinc-400 underline-offset-2 transition hover:text-amber-400 hover:underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Cuadrícula de resultados */}
      {resultado.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
          {resultado.map((ficha) => (
            <FichaObra key={ficha.id} ficha={ficha} fluida />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-sm text-zinc-400">
          Ninguna obra coincide con los filtros seleccionados.
        </p>
      )}
    </section>
  );
}
