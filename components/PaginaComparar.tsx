"use client";

import Image from "next/image";
import Link from "next/link";
import { fichas, type FichaArte } from "@/data/fichas";
import { useComparacion } from "@/hooks/useComparacion";

const MES_ACTUAL = 5;

function filaComparacion(
  etiqueta: string,
  obras: FichaArte[],
  valor: (f: FichaArte) => React.ReactNode
) {
  return (
    <div className="grid grid-cols-[100px_1fr] gap-3 border-t border-white/5 py-3 first:border-t-0 sm:grid-cols-[140px_1fr]">
      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {etiqueta}
      </span>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${obras.length}, 1fr)` }}
      >
        {obras.map((f) => (
          <div key={f.id} className="text-sm text-zinc-200">
            {valor(f)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PaginaComparar() {
  const { seleccion, alternar, limpiar, listo } = useComparacion();
  const obras = fichas.filter((f) => seleccion.includes(f.id));

  if (!listo) return null;

  if (obras.length < 2) {
    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-8">
        <h1 className="text-2xl font-semibold tracking-wide text-white">
          Comparar obras
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          Selecciona al menos 2 obras desde la galería para compararlas lado
          a lado — precio, tendencia de valor y atributos.
        </p>
        <Link
          href="/obras"
          className="mt-6 inline-block rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300"
        >
          Ir a Obras
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-8">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold tracking-wide text-white">
          Comparar obras
        </h1>
        <button
          type="button"
          onClick={limpiar}
          className="text-xs text-zinc-400 underline-offset-2 transition hover:text-amber-400 hover:underline"
        >
          Limpiar comparación
        </button>
      </div>

      {/* Tarjetas superiores: imagen + quitar */}
      <div
        className="mt-6 grid gap-4"
        style={{ gridTemplateColumns: `repeat(${obras.length}, 1fr)` }}
      >
        {obras.map((ficha) => (
          <div key={ficha.id} className="text-center">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-white/10">
              <Image
                src={ficha.imagen}
                alt={ficha.titulo}
                fill
                sizes="220px"
                className="object-cover"
              />
            </div>
            <h2 className="mt-3 text-sm font-bold uppercase tracking-wide text-white">
              {ficha.titulo}
            </h2>
            <Link
              href={`/artista/${ficha.artista.id}`}
              className="mt-0.5 block text-xs text-zinc-400 transition hover:text-amber-400"
            >
              {ficha.artista.nombre}
            </Link>
            <button
              type="button"
              onClick={() => alternar(ficha.id)}
              className="mt-2 text-[11px] text-zinc-500 underline-offset-2 hover:text-red-400 hover:underline"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      {/* Tabla de comparación */}
      <div className="mt-8 rounded-2xl bg-zinc-900/70 px-5 ring-1 ring-white/10">
        {filaComparacion("Año", obras, (f) => f.anio)}
        {filaComparacion("Precio", obras, (f) => (
          <span className="font-semibold text-white">
            ${f.precio.toLocaleString("es-MX")} MXN
          </span>
        ))}
        {filaComparacion("Tendencia", obras, (f) => {
          const actual = f.graficaValor[MES_ACTUAL].valor;
          const anterior = f.graficaValor[MES_ACTUAL - 1].valor;
          const cambio = (((actual - anterior) / anterior) * 100).toFixed(1);
          const subio = actual >= anterior;
          return (
            <span
              className={`font-semibold ${
                subio ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {subio ? "↑" : "↓"} {subio ? "+" : ""}
              {cambio}%
            </span>
          );
        })}
        {filaComparacion("Tipo", obras, (f) => f.tipo)}
        {filaComparacion("Tamaño", obras, (f) => f.tamano)}
        {filaComparacion("Color", obras, (f) => f.color)}
        {filaComparacion("Movimiento", obras, (f) => f.movimiento)}
        {filaComparacion("Técnica", obras, (f) => f.tecnica)}
        {filaComparacion("Valoración", obras, (f) => (
          <span className="text-amber-400">
            {"★".repeat(f.estrellas)}
            <span className="text-zinc-700">
              {"★".repeat(5 - f.estrellas)}
            </span>
          </span>
        ))}
        {filaComparacion("Certificaciones", obras, (f) => (
          <span className="text-xs text-zinc-400">
            {f.certificaciones.length}
          </span>
        ))}
        {filaComparacion("", obras, (f) => (
          <Link
            href={`/obra/${f.id}`}
            className="inline-block rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200 ring-1 ring-white/10 transition hover:bg-amber-400 hover:text-zinc-900"
          >
            Ver detalle
          </Link>
        ))}
      </div>
    </section>
  );
}
