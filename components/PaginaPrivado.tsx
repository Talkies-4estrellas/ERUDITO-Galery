"use client";

import Link from "next/link";
import { fichas } from "@/data/fichas";
import { useAuth } from "@/hooks/useAuth";
import FichaObra from "@/components/FichaObra";
import PageFade from "@/components/PageFade";

const OBRAS_PRIVADAS = fichas.filter((f) => f.precio > 2000);

const BENEFICIOS = [
  { icono: "🖼️", titulo: "Obras exclusivas",    desc: "Piezas de alto valor no disponibles en el catálogo público." },
  { icono: "🔔", titulo: "Alertas de subasta",  desc: "Notificaciones anticipadas antes de cada puja." },
  { icono: "📊", titulo: "Análisis de mercado", desc: "Informes trimestrales con tendencias y valoraciones." },
  { icono: "🤝", titulo: "Asesor personal",     desc: "Un curador dedicado a tu colección." },
];

export default function PaginaPrivado() {
  const { user, salir } = useAuth();

  if (!user) {
    return (
      <PageFade>
        <section className="mx-auto flex w-full max-w-lg flex-col items-center px-4 pb-20 pt-16 text-center sm:px-8">
          <div className="flex size-20 items-center justify-center rounded-full bg-amber-400/10 ring-1 ring-amber-400/20">
            <span className="text-3xl">🔒</span>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-white">Área Privada</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Esta sección es exclusiva para miembros de ERUDITO Galery. Inicia sesión o
            crea una cuenta para acceder a obras premium, análisis de mercado y subastas privadas.
          </p>

          <div className="mt-8 flex gap-3">
            <Link
              href="/login"
              className="rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/registro"
              className="rounded-full bg-white/5 px-6 py-2.5 text-sm text-zinc-300 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              Crear cuenta
            </Link>
          </div>

          {/* Beneficios vista previa */}
          <div className="mt-12 grid w-full gap-3 text-left sm:grid-cols-2">
            {BENEFICIOS.map((b) => (
              <div key={b.titulo} className="rounded-2xl bg-zinc-900 p-4 ring-1 ring-white/10">
                <span className="text-xl">{b.icono}</span>
                <p className="mt-2 text-sm font-semibold text-white">{b.titulo}</p>
                <p className="mt-1 text-xs text-zinc-400">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </PageFade>
    );
  }

  return (
    <PageFade>
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 ring-1 ring-amber-400/20">
                Miembro
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-white">Área Privada</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Bienvenido, <span className="text-zinc-200">{user.email}</span>
            </p>
          </div>
          <button
            onClick={salir}
            className="rounded-full bg-white/5 px-4 py-2 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Obras disponibles", valor: OBRAS_PRIVADAS.length },
            { label: "Subastas activas",  valor: 3 },
            { label: "Tu colección",      valor: 0 },
            { label: "Alertas activas",   valor: 2 },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-zinc-900 p-4 ring-1 ring-white/10 text-center">
              <p className="text-2xl font-bold text-amber-400">{stat.valor}</p>
              <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Obras exclusivas */}
        <div className="mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-bold text-white">Obras exclusivas</h2>
            <span className="text-xs text-zinc-500">Solo visible para miembros</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
            {OBRAS_PRIVADAS.map((ficha) => (
              <FichaObra key={ficha.id} ficha={ficha} fluida />
            ))}
          </div>
        </div>

        {/* Próximas subastas */}
        <div className="mt-12">
          <h2 className="text-lg font-bold text-white">Próximas subastas</h2>
          <div className="mt-5 space-y-3">
            {[
              { titulo: "Colección Herrán — Lote 4 piezas",   fecha: "15 Jul 2026", inicio: "$12,000" },
              { titulo: "Obras modernistas — Subasta cerrada", fecha: "22 Jul 2026", inicio: "$8,500" },
              { titulo: "Arte contemporáneo — Edición #7",    fecha: "3 Ago 2026",  inicio: "$5,200" },
            ].map((sub) => (
              <div
                key={sub.titulo}
                className="flex items-center justify-between rounded-2xl bg-zinc-900 p-4 ring-1 ring-white/10"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{sub.titulo}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{sub.fecha}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500">Precio inicial</p>
                  <p className="text-sm font-bold text-amber-400">{sub.inicio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Beneficios miembro */}
        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          {BENEFICIOS.map((b) => (
            <div key={b.titulo} className="flex gap-4 rounded-2xl bg-zinc-900 p-5 ring-1 ring-white/10">
              <span className="text-2xl">{b.icono}</span>
              <div>
                <p className="text-sm font-semibold text-white">{b.titulo}</p>
                <p className="mt-1 text-xs text-zinc-400">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageFade>
  );
}
