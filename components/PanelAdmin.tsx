"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { fichas } from "@/data/fichas";
import { artistas } from "@/data/artistas";
import { articulos } from "@/data/articulos";
import { eventos } from "@/data/eventos";
import PageFade from "@/components/PageFade";

const ADMIN_EMAILS = ["firestarshyni@gmail.com"];

interface StatCardProps {
  label: string;
  valor: number;
  icono: string;
  href: string;
  color: string;
}

function StatCard({ label, valor, icono, href, color }: StatCardProps) {
  return (
    <Link href={href} className="group rounded-2xl bg-zinc-900 p-5 ring-1 ring-white/10 transition hover:ring-white/20">
      <div className="flex items-start justify-between">
        <span className="text-2xl">{icono}</span>
        <span className={`text-xs font-medium ${color} opacity-0 transition group-hover:opacity-100`}>Ver →</span>
      </div>
      <p className={`mt-3 text-3xl font-bold ${color}`}>{valor}</p>
      <p className="mt-1 text-sm text-zinc-400">{label}</p>
    </Link>
  );
}

export default function PanelAdmin() {
  const { user, cargando, salir } = useAuth();

  if (cargando) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <svg className="size-8 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    return (
      <PageFade>
        <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-20 text-center">
          <span className="text-4xl">⛔</span>
          <h1 className="mt-4 text-lg font-bold text-white">Acceso restringido</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Esta área es solo para administradores de ERUDITO Galery.
          </p>
          <Link href="/" className="mt-6 rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300">
            Volver al inicio
          </Link>
        </div>
      </PageFade>
    );
  }

  const stats = [
    { label: "Obras en catálogo", valor: fichas.length,    icono: "🖼️", href: "/obras",    color: "text-amber-400" },
    { label: "Artistas",          valor: artistas.length,  icono: "👤", href: "/artistas", color: "text-violet-400" },
    { label: "Artículos de blog", valor: articulos.length, icono: "📝", href: "/blog",     color: "text-sky-400" },
    { label: "Eventos activos",   valor: eventos.length,   icono: "📅", href: "/eventos",  color: "text-emerald-400" },
  ];

  const acciones = [
    { label: "Ver catálogo público",  href: "/obras",    icono: "→" },
    { label: "Gestionar servicios",   href: "/servicios", icono: "→" },
    { label: "Ver área privada",      href: "/privado",  icono: "→" },
    { label: "Página de contacto",    href: "/contacto", icono: "→" },
  ];

  return (
    <PageFade>
      <section className="mx-auto w-full max-w-5xl px-4 pb-20 pt-8 sm:px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-rose-400 ring-1 ring-rose-500/20">
              Admin
            </span>
            <h1 className="mt-2 text-2xl font-bold text-white">Panel de administración</h1>
            <p className="mt-1 text-sm text-zinc-400">{user.email}</p>
          </div>
          <button
            onClick={salir}
            className="rounded-full bg-white/5 px-4 py-2 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Acciones rápidas */}
        <div className="mt-8 rounded-3xl bg-zinc-900 p-6 ring-1 ring-white/10">
          <h2 className="mb-4 text-sm font-semibold text-white">Acciones rápidas</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {acciones.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex items-center justify-between rounded-xl bg-zinc-800 px-4 py-3 text-sm text-zinc-300 ring-1 ring-white/5 transition hover:bg-zinc-700 hover:text-white"
              >
                <span>{a.label}</span>
                <span className="text-zinc-500">{a.icono}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Obras recientes */}
        <div className="mt-8">
          <h2 className="mb-4 text-sm font-semibold text-white">Últimas obras en catálogo</h2>
          <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-800/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Obra</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400 sm:table-cell">Artista</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Precio</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-400">Tipo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {fichas.slice(0, 8).map((f) => (
                  <tr key={f.id} className="bg-zinc-900 transition hover:bg-zinc-800/50">
                    <td className="px-4 py-3">
                      <Link href={`/obra/${f.id}`} className="font-medium text-zinc-200 hover:text-amber-400">
                        {f.titulo}
                      </Link>
                      <span className="ml-2 text-xs text-zinc-500">{f.anio}</span>
                    </td>
                    <td className="hidden px-4 py-3 text-zinc-400 sm:table-cell">{f.artista.nombre}</td>
                    <td className="px-4 py-3 font-semibold text-amber-400">${f.precio.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 ring-1 ring-white/10">
                        {f.tipo}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Supabase */}
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-5">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Infraestructura</p>
          <div className="mt-3 grid gap-2 text-xs text-zinc-400 sm:grid-cols-3">
            <div>
              <span className="text-zinc-600">Base de datos</span>
              <p className="mt-0.5 font-medium text-zinc-300">Supabase PostgreSQL</p>
            </div>
            <div>
              <span className="text-zinc-600">Storage</span>
              <p className="mt-0.5 font-medium text-zinc-300">Supabase Storage · bucket obras</p>
            </div>
            <div>
              <span className="text-zinc-600">Hosting</span>
              <p className="mt-0.5 font-medium text-zinc-300">Vercel — rama master</p>
            </div>
          </div>
        </div>
      </section>
    </PageFade>
  );
}
