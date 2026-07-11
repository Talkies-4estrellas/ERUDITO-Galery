"use client";

import { useState } from "react";
import type { FichaArte } from "@/data/fichas";

interface Props {
  ficha: FichaArte;
}

// Índice del mes actual (Junio = 5)
const MES_ACTUAL = 5;

export default function EstadisticasValor({ ficha }: Props) {
  const [abierta, setAbierta] = useState<string | null>(null);

  /* ── Gráfica de interés ──────────────────────────────────────────── */
  const maxInteres = Math.max(...ficha.graficaInteres);
  const deltaInteres =
    ficha.graficaInteres[ficha.graficaInteres.length - 1] -
    ficha.graficaInteres[ficha.graficaInteres.length - 2];
  const totalInteres = ficha.graficaInteres.reduce((a, b) => a + b, 0);

  /* ── Gráfica de valor ────────────────────────────────────────────── */
  const precios = ficha.graficaValor.map((p) => p.valor);
  const minPrecio = Math.min(...precios);
  const maxPrecio = Math.max(...precios);
  const rango = maxPrecio - minPrecio || 1;
  // Normaliza a 15-100% para que siempre haya barra visible
  const alturaPct = (v: number) => 15 + ((v - minPrecio) / rango) * 85;

  const precioActual = ficha.graficaValor[MES_ACTUAL].valor;
  const precioAnterior = ficha.graficaValor[MES_ACTUAL - 1].valor;
  const cambioPct = (((precioActual - precioAnterior) / precioAnterior) * 100).toFixed(1);
  const subio = precioActual >= precioAnterior;

  /* ── Secciones del acordeón ──────────────────────────────────────── */
  const secciones = [
    {
      titulo: "CERTIFICACIONES",
      contenido: ficha.certificaciones.join(" · "),
    },
    {
      titulo: "Activo Financiero",
      contenido:
        "Esta obra puede adquirirse como activo de inversión. Su valor se actualiza periódicamente según el mercado, las subastas recientes y el interés de los coleccionistas.",
    },
    {
      titulo: "Entregables",
      contenido:
        ficha.tipo === "Físico"
          ? "Obra original con certificado de autenticidad, ficha técnica completa y embalaje especializado para transporte."
          : ficha.tipo === "Impresión Oficial"
          ? "Impresión de alta calidad con sello oficial, certificado de edición limitada y ficha técnica completa."
          : "Archivo JPG certificado en alta resolución, certificado de autenticidad digital y ficha técnica completa de la obra.",
    },
    {
      titulo: "FAQs",
      contenido:
        "¿Dudas sobre el proceso de compra, los envíos o la certificación? Consulta las preguntas frecuentes o escríbenos desde la sección de Contacto.",
    },
  ];

  return (
    <section className="w-full">
      <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Valor y demanda
      </p>

      <div>
        <div>
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Interés mensual */}
            <div className="rounded-2xl bg-zinc-900 p-5 ring-1 ring-white/10">
              <p className="text-2xl font-bold text-white">
                {totalInteres}{" "}
                <span
                  className={`align-middle text-xs font-semibold ${
                    deltaInteres >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {deltaInteres >= 0 ? "↑" : "↓"} {deltaInteres >= 0 ? "+" : ""}
                  {deltaInteres}
                </span>
              </p>
              <div className="mt-4 flex h-28 items-end justify-between gap-2 px-1">
                {ficha.graficaInteres.map((altura, i) => (
                  <div
                    key={i}
                    className="w-3 rounded-full bg-gradient-to-t from-fuchsia-800 via-purple-500 to-purple-300"
                    style={{ height: `${(altura / maxInteres) * 100}%` }}
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
                <p className="text-2xl font-bold text-white">
                  ${precioActual.toLocaleString("es-MX")}
                  <span className="ml-1.5 align-middle text-xs font-normal text-zinc-500">
                    MXN
                  </span>
                </p>
                <span
                  className={`text-xs font-semibold ${
                    subio ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {subio ? "↑" : "↓"} {subio ? "+" : ""}
                  {cambioPct}%
                </span>
              </div>
              <div className="relative mt-4 h-28 border-t border-dashed border-zinc-600 pt-1">
                <span className="absolute -top-2 right-0 text-[8px] uppercase text-zinc-500">
                  máx
                </span>
                <div className="flex h-full items-end justify-between gap-1">
                  {ficha.graficaValor.map(({ mes, valor }, i) => (
                    <div
                      key={mes}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                    >
                      <div
                        className={`w-full rounded-sm ${
                          i === MES_ACTUAL ? "bg-cyan-400" : "bg-zinc-600"
                        }`}
                        style={{ height: `${alturaPct(valor)}%` }}
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

          {/* Acordeones */}
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
                    <path
                      d="M6 9l6 6 6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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
      </div>
    </section>
  );
}
