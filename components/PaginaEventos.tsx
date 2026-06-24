"use client";

import { useState } from "react";
import Image from "next/image";
import { eventos, type Evento } from "@/data/eventos";

type FiltroTipo = "Todos" | "Subasta" | "Exposición";
type FiltroModal = "Todos" | "En línea" | "Presencial";

function diasRestantes(fechaISO: string): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const evento = new Date(fechaISO);
  evento.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((evento.getTime() - hoy.getTime()) / 86_400_000));
}

function formatearFechaLarga(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ── Modal de registro ───────────────────────────────────────── */
function ModalRegistro({ evento, onClose }: { evento: Evento; onClose: () => void }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [fase, setFase] = useState<"form" | "enviado">("form");

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const registros = JSON.parse(localStorage.getItem("erudito-registros-eventos") || "[]");
    registros.push({ eventoId: evento.id, nombre, email, tel, fecha: new Date().toISOString() });
    localStorage.setItem("erudito-registros-eventos", JSON.stringify(registros));
    setFase("enviado");
  }

  const INPUT = "w-full rounded-xl bg-zinc-800 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 outline-none focus:ring-amber-400/50";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-md rounded-t-3xl bg-zinc-900 p-6 ring-1 ring-white/10 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/20 sm:hidden" />

        {fase === "enviado" ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-emerald-400/10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-8 text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-white">¡Registro confirmado!</p>
              <p className="mt-1 text-sm text-zinc-400">
                Te esperamos el {formatearFechaLarga(evento.fecha)}.
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">{evento.lugar}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 rounded-full bg-white/5 px-6 py-2 text-sm text-zinc-400 ring-1 ring-white/10 hover:bg-white/10"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">{evento.tipo} · {evento.modalidad}</p>
              <h2 className="mt-1 text-base font-bold text-white">{evento.titulo}</h2>
              <p className="mt-0.5 text-xs text-zinc-500">{formatearFechaLarga(evento.fecha)}</p>
            </div>

            <form onSubmit={enviar} className="space-y-3">
              <input required value={nombre} onChange={e => setNombre(e.target.value)}
                placeholder="Nombre completo" className={INPUT} />
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Correo electrónico" className={INPUT} />
              <input value={tel} onChange={e => setTel(e.target.value)}
                placeholder="Teléfono (opcional)" className={INPUT} />

              <div className="flex gap-2 pt-1">
                <button type="submit"
                  className="flex-1 rounded-full bg-amber-400 py-3 text-sm font-bold text-zinc-900 transition hover:bg-amber-300">
                  Confirmar asistencia
                </button>
                <button type="button" onClick={onClose}
                  className="rounded-full bg-white/5 px-4 text-zinc-400 ring-1 ring-white/10 hover:bg-white/10">
                  ✕
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Tarjeta de evento ───────────────────────────────────────── */
function TarjetaEvento({ evento, onRegistrar }: { evento: Evento; onRegistrar: (e: Evento) => void }) {
  const dias = diasRestantes(evento.fecha);
  const esHoy = dias === 0;
  const esPasado = new Date(evento.fecha) < new Date();

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10 transition hover:ring-amber-400/20">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={evento.imagen}
          alt={evento.titulo}
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Fecha badge */}
        <div className="absolute left-4 top-4 flex flex-col items-center rounded-xl bg-zinc-950/90 px-3 py-2 text-center leading-none backdrop-blur">
          <span className="text-xl font-bold text-amber-400">{evento.fechaCorta.dia}</span>
          <span className="text-[10px] uppercase tracking-widest text-zinc-400">{evento.fechaCorta.mes}</span>
        </div>

        {/* Countdown */}
        {!esPasado && (
          <div className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold backdrop-blur-sm ${
            esHoy ? "bg-amber-400 text-zinc-900" : "bg-zinc-950/80 text-zinc-300"
          }`}>
            {esHoy ? "¡Hoy!" : `${dias} día${dias !== 1 ? "s" : ""}`}
          </div>
        )}

        {esPasado && (
          <div className="absolute right-4 top-4 rounded-full bg-zinc-800/90 px-3 py-1 text-[11px] text-zinc-500 backdrop-blur-sm">
            Finalizado
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-zinc-900 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-400 ring-1 ring-amber-400/20">
            {evento.tipo}
          </span>
          <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-zinc-400 ring-1 ring-white/10">
            {evento.modalidad}
          </span>
        </div>

        <h3 className="mt-3 text-base font-bold uppercase tracking-wide text-white leading-snug">
          {evento.titulo}
        </h3>
        <p className="mt-1 text-xs text-zinc-500">{evento.lugar}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">
          {evento.descripcion}
        </p>

        <button
          type="button"
          disabled={esPasado}
          onClick={() => !esPasado && onRegistrar(evento)}
          className={`mt-5 w-full rounded-full py-2.5 text-xs font-bold transition ${
            esPasado
              ? "cursor-default bg-white/5 text-zinc-600 ring-1 ring-white/5"
              : "bg-white/5 text-zinc-200 ring-1 ring-white/10 hover:bg-amber-400 hover:text-zinc-900"
          }`}
        >
          {esPasado ? "Evento finalizado" : "Registrarme →"}
        </button>
      </div>
    </article>
  );
}

/* ── Página principal ────────────────────────────────────────── */
export default function PaginaEventos() {
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("Todos");
  const [filtroModal, setFiltroModal] = useState<FiltroModal>("Todos");
  const [eventoActivo, setEventoActivo] = useState<Evento | null>(null);

  const filtrados = eventos.filter((e) => {
    const okTipo = filtroTipo === "Todos" || e.tipo === filtroTipo;
    const okModal = filtroModal === "Todos" || e.modalidad === filtroModal;
    return okTipo && okModal;
  });

  const proximos = filtrados.filter((e) => new Date(e.fecha) >= new Date());
  const pasados = filtrados.filter((e) => new Date(e.fecha) < new Date());

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
      {/* Encabezado */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">Agenda</p>
        <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">Eventos</h1>
        <p className="mt-2 max-w-lg text-sm text-zinc-400">
          Subastas y exposiciones de arte, en línea y presenciales. Registra tu asistencia con un clic.
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-8 flex flex-wrap gap-3">
        {/* Tipo */}
        <div className="flex gap-1.5 rounded-full bg-zinc-900 p-1 ring-1 ring-white/10">
          {(["Todos", "Subasta", "Exposición"] as FiltroTipo[]).map((f) => (
            <button key={f} type="button" onClick={() => setFiltroTipo(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                filtroTipo === f ? "bg-amber-400 text-zinc-900" : "text-zinc-400 hover:text-white"
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Modalidad */}
        <div className="flex gap-1.5 rounded-full bg-zinc-900 p-1 ring-1 ring-white/10">
          {(["Todos", "En línea", "Presencial"] as FiltroModal[]).map((f) => (
            <button key={f} type="button" onClick={() => setFiltroModal(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                filtroModal === f ? "bg-amber-400 text-zinc-900" : "text-zinc-400 hover:text-white"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/10 py-20 text-center">
          <p className="text-sm text-zinc-500">Sin eventos para este filtro.</p>
          <button type="button" onClick={() => { setFiltroTipo("Todos"); setFiltroModal("Todos"); }}
            className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 hover:bg-white/10">
            Ver todos
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Próximos */}
          {proximos.length > 0 && (
            <div>
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-zinc-500">Próximos</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {proximos.map((e) => (
                  <TarjetaEvento key={e.id} evento={e} onRegistrar={setEventoActivo} />
                ))}
              </div>
            </div>
          )}

          {/* Pasados */}
          {pasados.length > 0 && (
            <div>
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-zinc-500">Anteriores</h2>
              <div className="grid gap-5 sm:grid-cols-2 opacity-60">
                {pasados.map((e) => (
                  <TarjetaEvento key={e.id} evento={e} onRegistrar={setEventoActivo} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {eventoActivo && (
        <ModalRegistro evento={eventoActivo} onClose={() => setEventoActivo(null)} />
      )}
    </div>
  );
}
