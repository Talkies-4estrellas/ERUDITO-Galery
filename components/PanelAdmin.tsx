"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePerfil } from "@/hooks/usePerfil";
import { useToast } from "@/components/ToastProvider";
import { supabase } from "@/lib/supabase";
import PageFade from "@/components/PageFade";

// ── tipos ──────────────────────────────────────────────────────────────
interface Stats { obras: number; artistas: number; eventos: number; perfiles: number; }

interface ObraRow {
  id_obra: number;
  titulo: string;
  anio: string;
  precio: number | null;
  tipo: string | null;
  artistas: { nombre: string }[] | null;
}

interface EventoRow {
  id_evento: number;
  titulo: string;
  lugar: string | null;
  modalidad: string | null;
  fecha_corta: { mes: string; dia: string } | null;
}

interface SolicitudRow {
  id: number;
  email: string;
  clave: string;
  rol: "artista" | "empresa";
  nombre: string;
  bio: string;
  especialidad: string;
  pais: string;
  motivacion: string;
  estado: "pendiente" | "aprobado" | "rechazado";
  created_at: string;
}

// ── sub-componentes ───────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <svg className="size-8 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function StatCard({
  label, valor, icono, href, color,
}: {
  label: string; valor: number; icono: string; href: string; color: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl bg-zinc-900 p-5 ring-1 ring-white/10 transition hover:ring-white/20"
    >
      <div className="flex items-start justify-between">
        <span className="text-2xl">{icono}</span>
        <span className={`text-xs font-medium ${color} opacity-0 transition group-hover:opacity-100`}>Ver →</span>
      </div>
      <p className={`mt-3 text-3xl font-bold tabular-nums ${color}`}>{valor}</p>
      <p className="mt-1 text-sm text-zinc-400">{label}</p>
    </Link>
  );
}

// ── componente principal ──────────────────────────────────────────────
export default function PanelAdmin() {
  const { perfil, listo, cerrarSesion } = usePerfil();
  const { toast } = useToast();

  const [stats, setStats]               = useState<Stats>({ obras: 0, artistas: 0, eventos: 0, perfiles: 0 });
  const [obras, setObras]               = useState<ObraRow[]>([]);
  const [eventos, setEventos]           = useState<EventoRow[]>([]);
  const [solicitudes, setSolicitudes]   = useState<SolicitudRow[]>([]);
  const [cargandoData, setCargandoData] = useState(true);
  const [accionando, setAccionando]     = useState<number | null>(null);

  // ── carga inicial ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!listo) return;
    if (!perfil || perfil.rol !== "admin") {
      setCargandoData(false);
      return;
    }

    Promise.all([
      supabase.from("obras").select("*",   { count: "exact", head: true }),
      supabase.from("artistas").select("*", { count: "exact", head: true }),
      supabase.from("eventos").select("*",  { count: "exact", head: true }),
      supabase.from("perfiles").select("*", { count: "exact", head: true }),
      supabase.from("obras").select("id_obra, titulo, anio, precio, tipo, artistas(nombre)")
        .order("id_obra", { ascending: false }).limit(10),
      supabase.from("eventos").select("id_evento, titulo, lugar, modalidad, fecha_corta")
        .order("id_evento", { ascending: false }).limit(5),
      supabase.from("solicitudes").select("*").eq("estado", "pendiente")
        .order("created_at", { ascending: false }),
    ]).then(([obrasC, artistasC, eventosC, perfilesC, obrasData, eventosData, solicitudesData]) => {
      setStats({
        obras:    obrasC.count    ?? 0,
        artistas: artistasC.count ?? 0,
        eventos:  eventosC.count  ?? 0,
        perfiles: perfilesC.count ?? 0,
      });
      setObras((obrasData.data as ObraRow[]) ?? []);
      setEventos((eventosData.data as EventoRow[]) ?? []);
      setSolicitudes((solicitudesData.data as SolicitudRow[]) ?? []);
      setCargandoData(false);
    });
  }, [listo, perfil]);

  // ── Realtime: nuevas solicitudes ──────────────────────────────────────
  useEffect(() => {
    if (!listo || !perfil || perfil.rol !== "admin") return;

    const canal = supabase
      .channel("solicitudes-admin")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "solicitudes" },
        (payload) => {
          const nueva = payload.new as SolicitudRow;
          if (nueva.estado === "pendiente") {
            setSolicitudes((prev) => [nueva, ...prev]);
            toast(`Nueva solicitud de ${nueva.nombre}`, { icono: "🔔" });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(canal); };
  }, [listo, perfil, toast]);

  async function notificar(email: string, nombre: string, rol: string, estado: "aprobado" | "rechazado") {
    fetch("/api/notificar-solicitud", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nombre, rol, estado }),
    }).catch(() => {});
  }

  async function aprobar(s: SolicitudRow) {
    setAccionando(s.id);
    try {
      const slug =
        s.rol === "empresa"
          ? s.nombre.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
              .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 50)
          : null;

      const { error: errInsert } = await supabase.from("usuarios").insert({
        email: s.email, clave: s.clave, rol: s.rol,
        nombre: s.nombre, bio: s.bio, especialidad: s.especialidad,
        pais: s.pais, avatar_url: "", slug,
      });

      if (errInsert && errInsert.code !== "23505") throw errInsert;

      await supabase.from("solicitudes")
        .update({ estado: "aprobado", revisado_at: new Date().toISOString() })
        .eq("id", s.id);

      setSolicitudes((prev) => prev.filter((x) => x.id !== s.id));
      toast(`${s.nombre} aprobado`, { icono: "✓" });
      notificar(s.email, s.nombre, s.rol, "aprobado");
    } catch (err) {
      console.error("Error al aprobar:", err);
      toast("Error al aprobar la solicitud", { icono: "✗" });
    } finally {
      setAccionando(null);
    }
  }

  async function rechazar(s: SolicitudRow) {
    setAccionando(s.id);
    try {
      await supabase.from("solicitudes")
        .update({ estado: "rechazado", revisado_at: new Date().toISOString() })
        .eq("id", s.id);

      setSolicitudes((prev) => prev.filter((x) => x.id !== s.id));
      toast(`Solicitud de ${s.nombre} rechazada`, { icono: "✗" });
      notificar(s.email, s.nombre, s.rol, "rechazado");
    } catch (err) {
      console.error("Error al rechazar:", err);
      toast("Error al rechazar la solicitud", { icono: "✗" });
    } finally {
      setAccionando(null);
    }
  }

  // ── estados de carga / acceso ──────────────────────────────────────
  if (!listo || cargandoData) return <Spinner />;

  if (!perfil || perfil.rol !== "admin") {
    return (
      <PageFade>
        <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-20 text-center">
          <span className="text-5xl">⛔</span>
          <h1 className="mt-4 text-lg font-bold text-white">Acceso restringido</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Esta área es solo para administradores de ERUDITO Galery.
          </p>
          <Link
            href="/"
            className="mt-6 rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300"
          >
            Volver al inicio
          </Link>
        </div>
      </PageFade>
    );
  }

  const statCards = [
    { label: "Obras en catálogo",    valor: stats.obras,    icono: "🖼️", href: "/obras",    color: "text-amber-400"   },
    { label: "Artistas registrados", valor: stats.artistas, icono: "👤", href: "/artistas", color: "text-violet-400"  },
    { label: "Eventos activos",      valor: stats.eventos,  icono: "📅", href: "/eventos",  color: "text-emerald-400" },
    { label: "Usuarios totales",     valor: stats.perfiles, icono: "👥", href: "#usuarios", color: "text-sky-400"     },
  ];

  const acciones = [
    { label: "Catálogo de obras",   href: "/obras",    icono: "🖼️" },
    { label: "Directorio artistas", href: "/artistas", icono: "👤" },
    { label: "Agenda de eventos",   href: "/eventos",  icono: "📅" },
    { label: "Página principal",    href: "/",         icono: "🏠" },
    { label: "Mi perfil",           href: "/perfil",   icono: "⚙️" },
  ];

  const modalidadColor: Record<string, string> = {
    Presencial: "text-emerald-400 bg-emerald-400/10",
    Virtual:    "text-sky-400 bg-sky-400/10",
    Híbrido:    "text-violet-400 bg-violet-400/10",
    "En línea": "text-sky-400 bg-sky-400/10",
  };

  const rolColor: Record<string, string> = {
    artista: "bg-amber-400/10 text-amber-400",
    empresa: "bg-violet-400/10 text-violet-400",
  };

  return (
    <PageFade>
      <section className="mx-auto w-full max-w-5xl px-4 pb-20 pt-8 sm:px-8">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-rose-400 ring-1 ring-rose-500/20">
              Administrador
            </span>
            <h1 className="mt-2 text-2xl font-bold text-white">Panel de administración</h1>
            <p className="mt-1 text-sm text-zinc-400">{perfil.email ?? "—"}</p>
          </div>
          <button
            onClick={cerrarSesion}
            className="shrink-0 rounded-full bg-white/5 px-4 py-2 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
          >
            Cerrar sesión
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statCards.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* ── Solicitudes pendientes ── */}
        <div className="mt-10">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-sm font-semibold text-white">Solicitudes pendientes</h2>
            {solicitudes.length > 0 && (
              <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-zinc-900">
                {solicitudes.length}
              </span>
            )}
          </div>

          {solicitudes.length === 0 ? (
            <div className="rounded-2xl bg-zinc-900 px-4 py-8 text-center ring-1 ring-white/10">
              <p className="text-sm text-zinc-600">Sin solicitudes pendientes</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {solicitudes.map((s) => (
                <div key={s.id} className="rounded-2xl bg-zinc-900 p-5 ring-1 ring-white/10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold text-zinc-200">
                          {s.nombre || "Sin nombre"}
                        </p>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${rolColor[s.rol]}`}>
                          {s.rol}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-zinc-500">{s.email}</p>
                      {s.especialidad && (
                        <p className="mt-1 text-xs text-zinc-400">{s.especialidad}</p>
                      )}
                      {s.pais && (
                        <p className="text-xs text-zinc-500">{s.pais}</p>
                      )}
                      {s.motivacion && (
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                          &ldquo;{s.motivacion}&rdquo;
                        </p>
                      )}
                      <p className="mt-2 text-[10px] text-zinc-600">
                        {new Date(s.created_at).toLocaleDateString("es-MX", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2">
                      <button
                        onClick={() => aprobar(s)}
                        disabled={accionando === s.id}
                        className="rounded-xl bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-400/20 transition hover:bg-emerald-400/20 disabled:opacity-50"
                      >
                        {accionando === s.id ? "…" : "Aprobar"}
                      </button>
                      <button
                        onClick={() => rechazar(s)}
                        disabled={accionando === s.id}
                        className="rounded-xl bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-400 ring-1 ring-red-400/20 transition hover:bg-red-400/20 disabled:opacity-50"
                      >
                        {accionando === s.id ? "…" : "Rechazar"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Tabla obras ── */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Últimas obras registradas</h2>
            <Link href="/obras" className="text-xs text-amber-400 transition hover:underline">
              Ver catálogo completo →
            </Link>
          </div>
          <div className="overflow-x-auto rounded-2xl ring-1 ring-white/10">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="bg-zinc-800/60">
                  {["#", "Obra", "Artista", "Precio", "Tipo"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {obras.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="bg-zinc-900 px-4 py-8 text-center text-sm text-zinc-600">
                      Sin obras registradas aún
                    </td>
                  </tr>
                ) : (
                  obras.map((o) => (
                    <tr key={o.id_obra} className="bg-zinc-900 transition hover:bg-zinc-800/50">
                      <td className="px-4 py-3 text-xs text-zinc-600">{o.id_obra}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-zinc-200">{o.titulo}</span>
                        {o.anio && <span className="ml-2 text-xs text-zinc-500">{o.anio}</span>}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">
                        {o.artistas?.[0]?.nombre ?? <span className="text-zinc-600">—</span>}
                      </td>
                      <td className="px-4 py-3 font-semibold text-amber-400">
                        {o.precio != null
                          ? `$${o.precio.toLocaleString("es-MX")}`
                          : <span className="text-zinc-600">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {o.tipo ? (
                          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 ring-1 ring-white/10">
                            {o.tipo}
                          </span>
                        ) : <span className="text-zinc-600">—</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Eventos recientes ── */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Eventos registrados</h2>
            <Link href="/eventos" className="text-xs text-emerald-400 transition hover:underline">
              Ver agenda →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {eventos.length === 0 ? (
              <p className="col-span-full rounded-2xl bg-zinc-900 px-4 py-8 text-center text-sm text-zinc-600 ring-1 ring-white/10">
                Sin eventos registrados
              </p>
            ) : (
              eventos.map((e) => (
                <div key={e.id_evento} className="flex gap-4 rounded-2xl bg-zinc-900 p-4 ring-1 ring-white/10">
                  {e.fecha_corta && (
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-400/10 text-center">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                        {e.fecha_corta.mes}
                      </span>
                      <span className="text-lg font-bold leading-none text-white">
                        {e.fecha_corta.dia}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-200">{e.titulo}</p>
                    <p className="mt-0.5 truncate text-xs text-zinc-500">{e.lugar ?? "—"}</p>
                    {e.modalidad && (
                      <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${modalidadColor[e.modalidad] ?? "text-zinc-400 bg-zinc-800"}`}>
                        {e.modalidad}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Acciones rápidas ── */}
        <div className="mt-10 rounded-3xl bg-zinc-900 p-6 ring-1 ring-white/10">
          <h2 className="mb-4 text-sm font-semibold text-white">Navegación rápida</h2>
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {acciones.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-3 text-sm text-zinc-300 ring-1 ring-white/5 transition hover:bg-zinc-700 hover:text-white"
              >
                <span>{a.icono}</span>
                <span>{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Info infraestructura ── */}
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
            Infraestructura
          </p>
          <div className="mt-3 grid gap-4 text-xs sm:grid-cols-3">
            <div>
              <p className="text-zinc-600">Base de datos</p>
              <p className="mt-0.5 font-medium text-zinc-300">Supabase PostgreSQL</p>
            </div>
            <div>
              <p className="text-zinc-600">Storage</p>
              <p className="mt-0.5 font-medium text-zinc-300">Supabase Storage · bucket obras</p>
            </div>
            <div>
              <p className="text-zinc-600">Hosting</p>
              <p className="mt-0.5 font-medium text-zinc-300">Vercel — rama master</p>
            </div>
          </div>
        </div>

      </section>
    </PageFade>
  );
}
