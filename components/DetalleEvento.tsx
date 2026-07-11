"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Evento } from "@/data/eventos";
import { fichas } from "@/data/fichas";
import FichaObra from "@/components/FichaObra";

interface Cuenta {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  pasado: boolean;
}

function calcularCuenta(fechaISO: string): Cuenta {
  const objetivo = new Date(fechaISO).getTime();
  const diff = objetivo - Date.now();
  if (diff <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0, pasado: true };
  return {
    dias: Math.floor(diff / 86_400_000),
    horas: Math.floor((diff % 86_400_000) / 3_600_000),
    minutos: Math.floor((diff % 3_600_000) / 60_000),
    segundos: Math.floor((diff % 60_000) / 1_000),
    pasado: false,
  };
}

function Reloj({ fecha }: { fecha: string }) {
  const [cuenta, setCuenta] = useState<Cuenta>(() => calcularCuenta(fecha));

  useEffect(() => {
    const t = setInterval(() => setCuenta(calcularCuenta(fecha)), 1000);
    return () => clearInterval(t);
  }, [fecha]);

  if (cuenta.pasado) {
    return (
      <p className="text-sm font-semibold text-amber-400">
        Este evento ya ha concluido
      </p>
    );
  }

  const unidades = [
    { valor: cuenta.dias, label: "días" },
    { valor: cuenta.horas, label: "horas" },
    { valor: cuenta.minutos, label: "min" },
    { valor: cuenta.segundos, label: "seg" },
  ];

  return (
    <div className="flex gap-3 sm:gap-4">
      {unidades.map(({ valor, label }) => (
        <div
          key={label}
          className="flex min-w-[56px] flex-col items-center rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10 sm:min-w-[68px]"
        >
          <span className="text-2xl font-bold tabular-nums text-white sm:text-3xl">
            {String(valor).padStart(2, "0")}
          </span>
          <span className="mt-0.5 text-[10px] uppercase tracking-widest text-zinc-500">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

const TIPO_COLOR: Record<Evento["tipo"], string> = {
  Subasta: "bg-amber-400/10 text-amber-400 ring-amber-400/20",
  Exposición: "bg-sky-400/10 text-sky-400 ring-sky-400/20",
};

const TIPO_CTA: Record<Evento["tipo"], string> = {
  Subasta: "Registrarse para pujar",
  Exposición: "Reservar entrada",
};

export default function DetalleEvento({ evento }: { evento: Evento }) {
  const obrasDelEvento = fichas.filter((f) => evento.fichasIds.includes(f.id));

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
        <Image
          src={evento.imagen}
          alt={evento.titulo}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/30 via-zinc-950/40 to-zinc-950" />

        {/* Botón volver */}
        <div className="absolute left-4 top-4 sm:left-8">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full bg-zinc-950/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md ring-1 ring-white/10 transition hover:bg-zinc-800"
          >
            ← Inicio
          </Link>
        </div>
      </div>

      {/* Contenido */}
      <div className="mx-auto max-w-4xl px-4 pb-24 sm:px-8">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 pt-6">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ${TIPO_COLOR[evento.tipo]}`}>
            {evento.tipo}
          </span>
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-zinc-400 ring-1 ring-white/10">
            {evento.modalidad}
          </span>
        </div>

        {/* Título */}
        <h1 className="mt-4 text-2xl font-bold uppercase tracking-wide sm:text-3xl lg:text-4xl">
          {evento.titulo}
        </h1>

        {/* Fecha y lugar */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
          <span>
            📅 {new Date(evento.fecha + "T12:00:00").toLocaleDateString("es-MX", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="hidden text-zinc-700 sm:block">·</span>
          <span>📍 {evento.lugar}</span>
        </div>

        {/* Separador */}
        <div className="my-8 h-px bg-white/10" />

        {/* Countdown */}
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            {evento.tipo === "Subasta" ? "La subasta comienza en" : "El evento comienza en"}
          </p>
          <Reloj fecha={evento.fecha} />
        </div>

        <div className="my-8 h-px bg-white/10" />

        {/* Descripción */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Acerca del evento
          </h2>
          <p className="leading-relaxed text-zinc-300">{evento.descripcion}</p>
        </div>

        {/* CTA */}
        <button
          type="button"
          className="mt-8 rounded-full bg-amber-400 px-8 py-3 text-sm font-bold text-zinc-900 transition hover:bg-amber-300 active:scale-95"
        >
          {TIPO_CTA[evento.tipo]} →
        </button>

        <div className="my-10 h-px bg-white/10" />

        {/* Obras del evento */}
        {obrasDelEvento.length > 0 && (
          <div>
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              {evento.tipo === "Subasta" ? "Lotes en subasta" : "Obras en exhibición"}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {obrasDelEvento.map((ficha) => (
                <FichaObra key={ficha.id} ficha={ficha} fluida />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
