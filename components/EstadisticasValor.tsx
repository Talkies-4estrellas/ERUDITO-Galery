"use client";

import { useState } from "react";

// Datos de muestra — más adelante vendrán del mercado real de cada obra
const interesMensual = [45, 70, 38, 82, 60, 75, 65];

const valorPorMes: { mes: string; valor: number; destacado?: boolean }[] = [
  { mes: "Ene", valor: 40 },
  { mes: "Feb", valor: 55 },
  { mes: "Mar", valor: 35 },
  { mes: "Abr", valor: 48 },
  { mes: "May", valor: 60 },
  { mes: "Jun", valor: 90, destacado: true },
  { mes: "Jul", valor: 52 },
  { mes: "Ago", valor: 44 },
  { mes: "Sep", valor: 58 },
  { mes: "Oct", valor: 38 },
  { mes: "Nov", valor: 50 },
  { mes: "Dic", valor: 62 },
];

const secciones = [
  {
    titulo: "CERTIFICACIONES",
    contenido:
      "Obra verificada por ERUDITO Galery. Incluye certificado digital de autenticidad firmado por la galería y registro permanente en nuestro catálogo.",
  },
  {
    titulo: "Activo Financiero",
    contenido:
      "Esta obra puede adquirirse como activo de inversión. Su valor se actualiza periódicamente según el mercado, las subastas recientes y el interés de los coleccionistas.",
  },
  {
    titulo: "Entregables",
    contenido:
      "Archivo JPG certificado en alta resolución, certificado de autenticidad y ficha técnica completa de la obra.",
  },
  {
    titulo: "FAQs",
    contenido:
      "¿Dudas sobre el proceso de compra, los envíos o la certificación? Consulta las preguntas frecuentes o escríbenos desde la sección de Contacto.",
  },
];

export default function EstadisticasValor() {
  const [abierta, setAbierta] = useState<string | null>(null);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-8">
      <h2 className="mb-5 text-lg font-semibold tracking-wide text-white">
        Valor actual de la obra
      </h2>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Interés mensual */}
            <div className="rounded-2xl bg-zinc-900 p-5 ring-1 ring-white/10">
              <p className="text-2xl font-bold text-white">
                854{" "}
                <span className="align-middle text-xs font-semibold text-emerald-400">
                  ↑ +25
                </span>
              </p>
              <div className="mt-4 flex h-28 items-end justify-between gap-2 px-1">
                {interesMensual.map((altura, i) => (
                  <div
                    key={i}
                    className="w-3 rounded-full bg-gradient-to-t from-fuchsia-800 via-purple-500 to-purple-300"
                    style={{ height: `${altura}%` }}
                  />
                ))}
              </div>
              <p className="mt-4 text-sm font-semibold text-white">
                Interés mensual
              </p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                Visitas, favoritos y pujas registradas sobre esta obra en los
                últimos meses.
              </p>
            </div>

            {/* Valor estimado por mes */}
            <div className="rounded-2xl bg-zinc-900 p-5 ring-1 ring-white/10">
              <div className="flex items-start justify-between">
                <p className="text-2xl font-bold text-white">$890.93</p>
                <span className="text-zinc-500" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
              <div className="relative mt-4 h-28 border-t border-dashed border-zinc-600 pt-1">
                <span className="absolute -top-2 right-0 text-[8px] uppercase text-zinc-500">
                  máx
                </span>
                <div className="flex h-full items-end justify-between gap-1">
                  {valorPorMes.map(({ mes, valor, destacado }) => (
                    <div key={mes} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                      <div
                        className={`w-full rounded-sm ${
                          destacado ? "bg-cyan-400" : "bg-zinc-600"
                        }`}
                        style={{ height: `${valor}%` }}
                      />
                      <span className="text-[7px] uppercase text-zinc-500">
                        {mes}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                Valor estimado de mercado por mes (último año).
              </p>
            </div>
          </div>

          {/* Acordeones de información */}
          <div className="mt-6 space-y-3">
            {secciones.map((seccion) => (
              <div
                key={seccion.titulo}
                className="overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-white/10"
              >
                <button
                  type="button"
                  onClick={() =>
                    setAbierta(
                      abierta === seccion.titulo ? null : seccion.titulo
                    )
                  }
                  aria-expanded={abierta === seccion.titulo}
                  className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-medium text-zinc-100 transition hover:bg-white/5"
                >
                  {seccion.titulo}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className={`shrink-0 transition-transform duration-200 ${
                      abierta === seccion.titulo ? "rotate-180" : ""
                    }`}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {abierta === seccion.titulo && (
                  <p className="px-5 pb-4 text-sm leading-relaxed text-zinc-400">
                    {seccion.contenido}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Columna de compra */}
        <aside className="h-fit rounded-2xl bg-zinc-900/60 p-5 ring-1 ring-white/10">
          <p className="text-center font-serif text-3xl font-bold text-white">
            10.00 <span className="text-base">USD</span>{" "}
            <span className="align-middle text-sm font-semibold text-emerald-400">
              ↑ +20
            </span>
          </p>

          <div className="mt-4 rounded-xl bg-gradient-to-b from-zinc-300 to-zinc-400 px-4 py-3 text-zinc-900">
            <p className="border-b border-zinc-600/50 pb-1.5 text-center text-xs font-bold tracking-[0.25em]">
              TIPO
            </p>
            <p className="pt-2 text-sm font-medium">JPG Certificado</p>
          </div>

          <button
            type="button"
            className="mt-4 w-full rounded-full bg-fuchsia-600 py-3 font-serif text-sm font-bold tracking-[0.2em] text-white transition hover:bg-fuchsia-500"
          >
            COMPRAR
          </button>

          <p className="mt-4 text-center text-sm text-zinc-300">Pago Seguro</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm font-bold text-zinc-500">
            <span className="italic">PayPal</span>
            <span className="lowercase">stripe</span>
            <span className="italic tracking-tight">VISA</span>
            <span className="flex" aria-label="Mastercard">
              <span className="size-3.5 rounded-full bg-zinc-500" />
              <span className="-ml-1.5 size-3.5 rounded-full bg-zinc-600" />
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}
