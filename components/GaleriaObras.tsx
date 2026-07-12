"use client";

import { useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import type { FichaArte } from "@/data/fichas";
import FichaObra from "@/components/FichaObra";
import { useComparacion, MAX_COMPARAR } from "@/hooks/useComparacion";

type ClaveFiltro = "tamano" | "color" | "movimiento" | "tecnica";

const claves: ClaveFiltro[] = ["tamano", "color", "movimiento", "tecnica"];

const grupos: { clave: ClaveFiltro; titulo: string }[] = [
  { clave: "tamano", titulo: "Tamaños" },
  { clave: "color", titulo: "Color" },
  { clave: "movimiento", titulo: "Movimiento" },
  { clave: "tecnica", titulo: "Técnica" },
];

type Seleccion = Record<ClaveFiltro, string[]>;

// Quita tildes y pone en minúsculas para comparar URL ↔ chips
const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

function seleccionDesdeParams(params: URLSearchParams): Seleccion {
  const sel: Seleccion = { tamano: [], color: [], movimiento: [], tecnica: [] };
  for (const clave of claves) {
    const urlVals = params.getAll(clave);
    if (!urlVals.length) continue;
    const chips = valoresDe(clave);
    // Activa el chip cuyo valor normalizado coincide con el param
    sel[clave] = urlVals.flatMap((v) =>
      chips.filter((c) => normalizar(c) === normalizar(v))
    );
  }
  return sel;
}

// ──────────────────────────────────────────────────────────────
// Inner: necesita Suspense porque usa useSearchParams
// ──────────────────────────────────────────────────────────────
function GaleriaObrasInner({ fichas }: { fichas: FichaArte[] }) {
  const valoresDe = (clave: ClaveFiltro): string[] => [
    ...new Set(fichas.map((f) => f[clave])),
  ];
  const searchParams = useSearchParams();
  const router = useRouter();
  const { seleccion: comparando, limpiar: limpiarComparacion, listo: comparacionLista } =
    useComparacion();

  // URL como única fuente de verdad — se recalcula en cada cambio de URL
  const seleccion = useMemo(
    () => seleccionDesdeParams(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const hayFiltros = claves.some((c) => seleccion[c].length > 0);

  function alternar(clave: ClaveFiltro, valor: string) {
    const nueva: Seleccion = {
      ...seleccion,
      [clave]: seleccion[clave].includes(valor)
        ? seleccion[clave].filter((v) => v !== valor)
        : [...seleccion[clave], valor],
    };
    const params = new URLSearchParams();
    for (const c of claves) {
      for (const v of nueva[c]) {
        params.append(c, normalizar(v));
      }
    }
    const qs = params.size > 0 ? `?${params}` : "";
    router.replace(`/obras${qs}`, { scroll: false });
  }

  function limpiar() {
    router.replace("/obras", { scroll: false });
  }

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
            onClick={limpiar}
            className="text-xs text-zinc-400 underline-offset-2 transition hover:text-amber-400 hover:underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Cuadrícula */}
      {resultado.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
          {resultado.map((ficha) => (
            <FichaObra key={ficha.id} ficha={ficha} fluida comparable />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-sm text-zinc-400">
          Ninguna obra coincide con los filtros seleccionados.
        </p>
      )}

      {/* Barra flotante de comparación */}
      {comparacionLista && comparando.length > 0 && (
        <div className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl bg-zinc-900 px-5 py-3 shadow-2xl ring-1 ring-white/15 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2">
          <p className="text-sm text-zinc-200">
            <span className="font-semibold text-cyan-400">
              {comparando.length}
            </span>{" "}
            / {MAX_COMPARAR} para comparar
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={limpiarComparacion}
              className="text-xs text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline"
            >
              Limpiar
            </button>
            <Link
              href="/comparar"
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                comparando.length >= 2
                  ? "bg-cyan-400 text-zinc-900 hover:bg-cyan-300"
                  : "cursor-not-allowed bg-white/10 text-zinc-500"
              }`}
              aria-disabled={comparando.length < 2}
              onClick={(e) => {
                if (comparando.length < 2) e.preventDefault();
              }}
            >
              Comparar
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

// ──────────────────────────────────────────────────────────────
// Export público — envuelve en Suspense para satisfacer Next.js
// ──────────────────────────────────────────────────────────────
export default function GaleriaObras({ fichas }: { fichas: FichaArte[] }) {
  return (
    <Suspense>
      <GaleriaObrasInner fichas={fichas} />
    </Suspense>
  );
}
