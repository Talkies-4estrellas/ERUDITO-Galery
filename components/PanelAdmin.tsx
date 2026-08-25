"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePerfil } from "@/hooks/usePerfil";
import { useToast } from "@/components/ToastProvider";
import { supabase } from "@/lib/supabase";
import PageFade from "@/components/PageFade";

// ── tipos ───────────────────────────────────────────────────────────────────
type SeccionAdmin = "dashboard" | "obras" | "solicitudes" | "usuarios" | "cocina" | "eventos";
type RolFiltro    = "todos" | "artista" | "empresa" | "productor" | "comprador" | "admin";

interface Stats { obras: number; artistas: number; eventos: number; perfiles: number; }

interface ObraRow {
  id_obra: number; titulo: string; anio: string;
  precio: number | null; tipo: string | null;
  artistas: { nombre: string }[] | null;
}

interface EventoRow {
  id_evento: number; titulo: string; lugar: string | null;
  modalidad: string | null;
  fecha_corta: { mes: string; dia: string } | null;
}

interface SolicitudRow {
  id: number; email: string; clave: string;
  rol: "artista" | "empresa"; nombre: string; bio: string;
  especialidad: string; pais: string; motivacion: string;
  estado: "pendiente" | "aprobado" | "rechazado";
  created_at: string; motivo?: string;
}

interface ObraPendienteRow {
  id_obra: number; titulo: string; anio: string | null;
  imagen_principal: string | null; tecnica: string | null;
  movimiento: string | null; precio: number | null;
  tipo: string | null; estado: string;
  artista_email: string | null; empresa_email: string | null;
  nombre_artista: string | null;
}

interface UsuarioRow {
  id: string; email: string; rol: string; nombre: string;
  especialidad: string; pais: string; slug: string | null;
  created_at: string;
}

// ── colores por rol ─────────────────────────────────────────────────────────
const ROL_COLOR: Record<string, string> = {
  artista:   "bg-amber-400/10 text-amber-400",
  empresa:   "bg-violet-400/10 text-violet-400",
  productor: "bg-orange-400/10 text-orange-400",
  comprador: "bg-sky-400/10 text-sky-400",
  admin:     "bg-rose-400/10 text-rose-400",
};

// ── nav items ───────────────────────────────────────────────────────────────
const NAV_ITEMS: { id: SeccionAdmin; label: string; icono: string }[] = [
  { id: "dashboard",    label: "Dashboard",    icono: "▦" },
  { id: "obras",        label: "Obras",        icono: "🖼" },
  { id: "solicitudes",  label: "Solicitudes",  icono: "📋" },
  { id: "usuarios",     label: "Usuarios",     icono: "👥" },
  { id: "cocina",       label: "Cocina",       icono: "🍽" },
  { id: "eventos",      label: "Eventos",      icono: "📅" },
];

// ── sub-componentes simples ─────────────────────────────────────────────────
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

function Badge({ n }: { n: number }) {
  if (n === 0) return null;
  return (
    <span className="ml-auto rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold leading-none text-zinc-900">
      {n}
    </span>
  );
}

// ── Modal rechazo solicitud ─────────────────────────────────────────────────
function ModalRechazo({
  solicitud, motivo, setMotivo, onConfirmar, onCancelar, cargando,
}: {
  solicitud: SolicitudRow; motivo: string; setMotivo: (v: string) => void;
  onConfirmar: () => void; onCancelar: () => void; cargando: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onCancelar}>
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 p-6 ring-1 ring-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <p className="text-xs font-semibold uppercase tracking-widest text-red-400">Confirmar rechazo</p>
        <h2 className="mt-1 text-base font-bold text-white">{solicitud.nombre || "Sin nombre"}</h2>
        <p className="text-xs text-zinc-500">{solicitud.email} · {solicitud.rol}</p>
        <div className="mt-4 space-y-2">
          <label className="text-xs font-medium text-zinc-400">
            Motivo <span className="text-zinc-600">(opcional — se enviará por email)</span>
          </label>
          <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={3}
            placeholder="Ej: El portafolio no cumple los requisitos mínimos…"
            className="w-full resize-none rounded-xl bg-zinc-800 px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 ring-1 ring-white/10 outline-none focus:ring-red-400/40" />
        </div>
        <div className="mt-5 flex gap-3">
          <button onClick={onConfirmar} disabled={cargando}
            className="flex-1 rounded-full bg-red-500/80 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50">
            {cargando ? "Rechazando…" : "Confirmar rechazo"}
          </button>
          <button onClick={onCancelar} disabled={cargando}
            className="rounded-full bg-white/5 px-5 py-2.5 text-sm text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
//  COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════════════════════════
export default function PanelAdmin() {
  const { perfil, listo, cerrarSesion } = usePerfil();
  const { toast } = useToast();

  // ── datos ──────────────────────────────────────────────────────────────────
  const [stats, setStats]                     = useState<Stats>({ obras: 0, artistas: 0, eventos: 0, perfiles: 0 });
  const [obras, setObras]                     = useState<ObraRow[]>([]);
  const [eventos, setEventos]                 = useState<EventoRow[]>([]);
  const [solicitudes, setSolicitudes]         = useState<SolicitudRow[]>([]);
  const [obrasPendientes, setObrasPendientes] = useState<ObraPendienteRow[]>([]);
  const [usuarios, setUsuarios]               = useState<UsuarioRow[]>([]);
  const [cargandoData, setCargandoData]       = useState(true);

  // ── ui ─────────────────────────────────────────────────────────────────────
  const [seccion, setSeccion]                           = useState<SeccionAdmin>("dashboard");
  const [sidebarAbierto, setSidebarAbierto]             = useState(false);
  const [rolFiltro, setRolFiltro]                       = useState<RolFiltro>("todos");
  const [accionando, setAccionando]                     = useState<number | null>(null);
  const [accionandoObra, setAccionandoObra]             = useState<number | null>(null);
  const [solicitudArechazar, setSolicitudArechazar]     = useState<SolicitudRow | null>(null);
  const [motivoRechazo, setMotivoRechazo]               = useState("");

  // ── carga inicial ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!listo) return;
    if (!perfil || perfil.rol !== "admin") { setCargandoData(false); return; }

    Promise.all([
      supabase.from("obras").select("*",    { count: "exact", head: true }).eq("estado", "aprobada"),
      supabase.from("artistas").select("*", { count: "exact", head: true }),
      supabase.from("eventos").select("*",  { count: "exact", head: true }),
      supabase.from("perfiles").select("*", { count: "exact", head: true }),
      supabase.from("obras").select("id_obra, titulo, anio, precio, tipo, artistas(nombre)")
        .eq("estado", "aprobada").order("id_obra", { ascending: false }).limit(10),
      supabase.from("eventos").select("id_evento, titulo, lugar, modalidad, fecha_corta")
        .order("id_evento", { ascending: false }).limit(6),
      supabase.from("solicitudes").select("*").eq("estado", "pendiente")
        .order("created_at", { ascending: false }),
      fetch("/api/admin/obras").then((r) => r.json()),
      fetch("/api/admin/usuarios").then((r) => r.json()),
    ]).then(([obrasC, artistasC, eventosC, perfilesC, obrasD, eventosD, solicD, obrasPendD, usuariosD]) => {
      setStats({ obras: obrasC.count ?? 0, artistas: artistasC.count ?? 0, eventos: eventosC.count ?? 0, perfiles: perfilesC.count ?? 0 });
      setObras((obrasD.data as ObraRow[]) ?? []);
      setEventos((eventosD.data as EventoRow[]) ?? []);
      setSolicitudes((solicD.data as SolicitudRow[]) ?? []);
      setObrasPendientes((obrasPendD.obras ?? []) as ObraPendienteRow[]);
      setUsuarios((usuariosD.usuarios ?? []) as UsuarioRow[]);
      setCargandoData(false);
    });
  }, [listo, perfil]);

  // ── realtime solicitudes ───────────────────────────────────────────────────
  useEffect(() => {
    if (!listo || !perfil || perfil.rol !== "admin") return;
    const canal = supabase.channel("solicitudes-admin")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "solicitudes" }, (payload) => {
        const nueva = payload.new as SolicitudRow;
        if (nueva.estado === "pendiente") {
          setSolicitudes((prev) => [nueva, ...prev]);
          toast(`Nueva solicitud de ${nueva.nombre}`, { icono: "🔔" });
        }
      }).subscribe();
    return () => { supabase.removeChannel(canal); };
  }, [listo, perfil, toast]);

  // ── acciones ───────────────────────────────────────────────────────────────
  async function gestionarObra(id: number, estado: "aprobada" | "rechazada") {
    setAccionandoObra(id);
    try {
      const res = await fetch("/api/admin/obras", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, estado }),
      });
      if (!res.ok) throw new Error();
      setObrasPendientes((prev) => prev.filter((o) => o.id_obra !== id));
      toast(estado === "aprobada" ? "Obra aprobada y publicada" : "Obra rechazada",
        { icono: estado === "aprobada" ? "✓" : "✗" });
    } catch { toast("Error al procesar la obra", { icono: "✗" }); }
    finally { setAccionandoObra(null); }
  }

  function notificar(email: string, nombre: string, rol: string, estado: "aprobado" | "rechazado", motivo?: string) {
    fetch("/api/notificar-solicitud", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nombre, rol, estado, motivo }),
    }).catch(() => {});
  }

  async function aprobar(s: SolicitudRow) {
    setAccionando(s.id);
    try {
      const slug = s.rol === "empresa"
        ? s.nombre.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 50)
        : null;
      const { error } = await supabase.from("usuarios").insert({
        email: s.email, clave: s.clave, rol: s.rol,
        nombre: s.nombre, bio: s.bio, especialidad: s.especialidad,
        pais: s.pais, avatar_url: "", slug,
      });
      if (error && error.code !== "23505") throw error;
      await supabase.from("solicitudes")
        .update({ estado: "aprobado", revisado_at: new Date().toISOString() }).eq("id", s.id);
      setSolicitudes((prev) => prev.filter((x) => x.id !== s.id));
      toast(`${s.nombre} aprobado`, { icono: "✓" });
      notificar(s.email, s.nombre, s.rol, "aprobado");
    } catch { toast("Error al aprobar", { icono: "✗" }); }
    finally { setAccionando(null); }
  }

  async function rechazar(s: SolicitudRow, motivo: string) {
    setAccionando(s.id);
    try {
      await supabase.from("solicitudes")
        .update({ estado: "rechazado", revisado_at: new Date().toISOString(), motivo: motivo || null })
        .eq("id", s.id);
      setSolicitudes((prev) => prev.filter((x) => x.id !== s.id));
      toast(`Solicitud de ${s.nombre} rechazada`, { icono: "✗" });
      notificar(s.email, s.nombre, s.rol, "rechazado", motivo || undefined);
    } catch { toast("Error al rechazar", { icono: "✗" }); }
    finally { setAccionando(null); }
  }

  // ── guards ─────────────────────────────────────────────────────────────────
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
          <Link href="/"
            className="mt-6 rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300">
            Volver al inicio
          </Link>
        </div>
      </PageFade>
    );
  }

  // ── derived ────────────────────────────────────────────────────────────────
  const usuariosFiltrados = rolFiltro === "todos" ? usuarios : usuarios.filter((u) => u.rol === rolFiltro);
  const conteoRol = (r: string) => usuarios.filter((u) => u.rol === r).length;
  const ROLES_FILTRO: { id: RolFiltro; label: string }[] = [
    { id: "todos",     label: `Todos (${usuarios.length})` },
    { id: "artista",   label: `Artistas (${conteoRol("artista")})` },
    { id: "empresa",   label: `Empresas (${conteoRol("empresa")})` },
    { id: "productor", label: `Productores (${conteoRol("productor")})` },
    { id: "comprador", label: `Compradores (${conteoRol("comprador")})` },
    { id: "admin",     label: `Admin (${conteoRol("admin")})` },
  ];

  const modalidadColor: Record<string, string> = {
    Presencial: "text-emerald-400 bg-emerald-400/10",
    Virtual:    "text-sky-400 bg-sky-400/10",
    Híbrido:    "text-violet-400 bg-violet-400/10",
    "En línea": "text-sky-400 bg-sky-400/10",
  };

  // ── secciones de contenido ─────────────────────────────────────────────────
  function renderContenido() {
    switch (seccion) {

      // ── DASHBOARD ──────────────────────────────────────────────────────────
      case "dashboard": return (
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-bold text-white">Dashboard</h2>
            <p className="mt-0.5 text-sm text-zinc-500">Vista general de la plataforma</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Obras en catálogo",    valor: stats.obras,    icono: "🖼️", color: "text-amber-400",   href: "/obras"    },
              { label: "Artistas registrados", valor: stats.artistas, icono: "👤", color: "text-violet-400",  href: "/artistas" },
              { label: "Eventos activos",      valor: stats.eventos,  icono: "📅", color: "text-emerald-400", href: "/eventos"  },
              { label: "Usuarios totales",     valor: stats.perfiles, icono: "👥", color: "text-sky-400",     href: "#"         },
            ].map((s) => (
              <Link key={s.label} href={s.href}
                className="group rounded-2xl bg-zinc-800/60 p-5 ring-1 ring-white/10 transition hover:ring-white/20">
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{s.icono}</span>
                  <span className={`text-xs font-medium ${s.color} opacity-0 transition group-hover:opacity-100`}>Ver →</span>
                </div>
                <p className={`mt-3 text-3xl font-bold tabular-nums ${s.color}`}>{s.valor}</p>
                <p className="mt-1 text-sm text-zinc-400">{s.label}</p>
              </Link>
            ))}
          </div>

          {/* Alertas rápidas */}
          {(obrasPendientes.length > 0 || solicitudes.length > 0) && (
            <div className="grid gap-3 sm:grid-cols-2">
              {obrasPendientes.length > 0 && (
                <button onClick={() => setSeccion("obras")}
                  className="flex items-center gap-4 rounded-2xl bg-amber-400/5 p-4 ring-1 ring-amber-400/20 text-left transition hover:bg-amber-400/10">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-lg">🖼</span>
                  <div>
                    <p className="text-sm font-semibold text-amber-400">{obrasPendientes.length} obra{obrasPendientes.length > 1 ? "s" : ""} pendiente{obrasPendientes.length > 1 ? "s" : ""}</p>
                    <p className="text-xs text-zinc-500">Requieren aprobación</p>
                  </div>
                  <span className="ml-auto text-xs text-zinc-500">Revisar →</span>
                </button>
              )}
              {solicitudes.length > 0 && (
                <button onClick={() => setSeccion("solicitudes")}
                  className="flex items-center gap-4 rounded-2xl bg-violet-400/5 p-4 ring-1 ring-violet-400/20 text-left transition hover:bg-violet-400/10">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-lg">📋</span>
                  <div>
                    <p className="text-sm font-semibold text-violet-400">{solicitudes.length} solicitud{solicitudes.length > 1 ? "es" : ""} pendiente{solicitudes.length > 1 ? "s" : ""}</p>
                    <p className="text-xs text-zinc-500">Artistas y empresas</p>
                  </div>
                  <span className="ml-auto text-xs text-zinc-500">Revisar →</span>
                </button>
              )}
            </div>
          )}

          {/* Últimas obras */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Últimas obras publicadas</h3>
              <Link href="/obras" className="text-xs text-amber-400 hover:underline">Ver catálogo →</Link>
            </div>
            <div className="overflow-x-auto rounded-2xl ring-1 ring-white/10">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="bg-zinc-800/60">
                    {["#", "Obra", "Artista", "Precio", "Tipo"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {obras.length === 0 ? (
                    <tr><td colSpan={5} className="bg-zinc-900 px-4 py-8 text-center text-sm text-zinc-600">Sin obras</td></tr>
                  ) : obras.map((o) => (
                    <tr key={o.id_obra} className="bg-zinc-900 transition hover:bg-zinc-800/50">
                      <td className="px-4 py-3 text-xs text-zinc-600">{o.id_obra}</td>
                      <td className="px-4 py-3 font-medium text-zinc-200">{o.titulo}
                        {o.anio && <span className="ml-2 text-xs text-zinc-500">{o.anio}</span>}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{o.artistas?.[0]?.nombre ?? <span className="text-zinc-600">—</span>}</td>
                      <td className="px-4 py-3 font-semibold text-amber-400">
                        {o.precio != null ? `$${o.precio.toLocaleString("es-MX")}` : <span className="text-zinc-600">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {o.tipo ? <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 ring-1 ring-white/10">{o.tipo}</span> : <span className="text-zinc-600">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info infra */}
          <div className="rounded-2xl border border-dashed border-white/10 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">Infraestructura</p>
            <div className="mt-3 grid gap-4 text-xs sm:grid-cols-3">
              <div><p className="text-zinc-600">Base de datos</p><p className="mt-0.5 font-medium text-zinc-300">Supabase PostgreSQL</p></div>
              <div><p className="text-zinc-600">Storage</p><p className="mt-0.5 font-medium text-zinc-300">Supabase Storage · bucket obras</p></div>
              <div><p className="text-zinc-600">Hosting</p><p className="mt-0.5 font-medium text-zinc-300">Vercel — rama master</p></div>
            </div>
          </div>
        </div>
      );

      // ── OBRAS ──────────────────────────────────────────────────────────────
      case "obras": return (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Obras pendientes</h2>
            <p className="mt-0.5 text-sm text-zinc-500">Obras subidas por artistas y galerías que requieren aprobación</p>
          </div>

          {obrasPendientes.length === 0 ? (
            <div className="rounded-2xl bg-zinc-800/40 px-4 py-16 text-center ring-1 ring-white/10">
              <span className="text-4xl">✓</span>
              <p className="mt-3 text-sm text-zinc-500">Sin obras pendientes — todo al día</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {obrasPendientes.map((o) => (
                <div key={o.id_obra} className="rounded-2xl bg-zinc-800/60 p-4 ring-1 ring-white/10">
                  <div className="flex gap-3">
                    {o.imagen_principal ? (
                      <img src={o.imagen_principal} alt={o.titulo}
                        className="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-white/10" />
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-zinc-700 ring-1 ring-white/10">
                        <span className="text-2xl opacity-30">🖼️</span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-zinc-200">{o.titulo}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {o.nombre_artista ?? o.artista_email ?? o.empresa_email ?? "—"}
                        {o.anio ? ` · ${o.anio}` : ""}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {o.tecnica && <span className="rounded-full bg-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400 ring-1 ring-white/10">{o.tecnica}</span>}
                        {o.tipo && <span className="rounded-full bg-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400 ring-1 ring-white/10">{o.tipo}</span>}
                        {o.precio != null && o.precio > 0 && (
                          <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                            ${o.precio.toLocaleString("es-MX")} MXN
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => gestionarObra(o.id_obra, "aprobada")} disabled={accionandoObra === o.id_obra}
                      className="flex-1 rounded-xl bg-emerald-400/10 py-2 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-400/20 transition hover:bg-emerald-400/20 disabled:opacity-50">
                      {accionandoObra === o.id_obra ? "…" : "Aprobar y publicar"}
                    </button>
                    <button onClick={() => gestionarObra(o.id_obra, "rechazada")} disabled={accionandoObra === o.id_obra}
                      className="flex-1 rounded-xl bg-red-400/10 py-2 text-xs font-semibold text-red-400 ring-1 ring-red-400/20 transition hover:bg-red-400/20 disabled:opacity-50">
                      {accionandoObra === o.id_obra ? "…" : "Rechazar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );

      // ── SOLICITUDES ────────────────────────────────────────────────────────
      case "solicitudes": return (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Solicitudes de acceso</h2>
            <p className="mt-0.5 text-sm text-zinc-500">Artistas y empresas que solicitan unirse a la galería</p>
          </div>

          {solicitudes.length === 0 ? (
            <div className="rounded-2xl bg-zinc-800/40 px-4 py-16 text-center ring-1 ring-white/10">
              <span className="text-4xl">✓</span>
              <p className="mt-3 text-sm text-zinc-500">Sin solicitudes pendientes</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {solicitudes.map((s) => (
                <div key={s.id} className="rounded-2xl bg-zinc-800/60 p-5 ring-1 ring-white/10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold text-zinc-200">{s.nombre || "Sin nombre"}</p>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${ROL_COLOR[s.rol] ?? ""}`}>
                          {s.rol}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-zinc-500">{s.email}</p>
                      {s.especialidad && <p className="mt-1 text-xs text-zinc-400">{s.especialidad}</p>}
                      {s.pais && <p className="text-xs text-zinc-500">{s.pais}</p>}
                      {s.motivacion && (
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-500">&ldquo;{s.motivacion}&rdquo;</p>
                      )}
                      <p className="mt-2 text-[10px] text-zinc-600">
                        {new Date(s.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2">
                      <button onClick={() => aprobar(s)} disabled={accionando === s.id}
                        className="rounded-xl bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-400/20 transition hover:bg-emerald-400/20 disabled:opacity-50">
                        {accionando === s.id ? "…" : "Aprobar"}
                      </button>
                      <button onClick={() => { setSolicitudArechazar(s); setMotivoRechazo(""); }} disabled={accionando === s.id}
                        className="rounded-xl bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-400 ring-1 ring-red-400/20 transition hover:bg-red-400/20 disabled:opacity-50">
                        {accionando === s.id ? "…" : "Rechazar"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );

      // ── USUARIOS ───────────────────────────────────────────────────────────
      case "usuarios": return (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Usuarios del sistema</h2>
            <p className="mt-0.5 text-sm text-zinc-500">{usuarios.length} cuentas registradas</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {ROLES_FILTRO.map(({ id, label }) => (
              <button key={id} onClick={() => setRolFiltro(id)}
                className={`rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition ${
                  rolFiltro === id
                    ? "bg-amber-400 text-zinc-900 ring-amber-400"
                    : "bg-zinc-800 text-zinc-400 ring-white/10 hover:bg-zinc-700 hover:text-zinc-200"
                }`}>
                {label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto rounded-2xl ring-1 ring-white/10">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-zinc-800/60">
                  {["Nombre", "Email", "Rol", "Especialidad", "País", "Desde"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usuariosFiltrados.length === 0 ? (
                  <tr><td colSpan={6} className="bg-zinc-900 px-4 py-8 text-center text-sm text-zinc-600">Sin usuarios en esta categoría</td></tr>
                ) : usuariosFiltrados.map((u) => (
                  <tr key={u.id} className="bg-zinc-900 transition hover:bg-zinc-800/50">
                    <td className="px-4 py-3 font-medium text-zinc-200">
                      {u.nombre || <span className="italic text-zinc-600">sin nombre</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${ROL_COLOR[u.rol] ?? "bg-zinc-800 text-zinc-400"}`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400">{u.especialidad || <span className="text-zinc-600">—</span>}</td>
                    <td className="px-4 py-3 text-xs text-zinc-400">{u.pais || <span className="text-zinc-600">—</span>}</td>
                    <td className="px-4 py-3 text-[10px] text-zinc-600">
                      {new Date(u.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

      // ── COCINA ─────────────────────────────────────────────────────────────
      case "cocina": return (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Gestión de Cocina</h2>
            <p className="mt-0.5 text-sm text-zinc-500">Productos gastronómicos y productores de la plataforma</p>
          </div>
          <div className="rounded-2xl bg-zinc-800/40 px-4 py-16 text-center ring-1 ring-white/10">
            <span className="text-4xl">🍽</span>
            <p className="mt-3 text-sm font-medium text-zinc-300">Próximamente</p>
            <p className="mt-1 text-xs text-zinc-500">
              Gestión de productos cocina: crear, editar, asignar productores y subir imágenes.
            </p>
            <Link href="/cocina"
              className="mt-5 inline-block rounded-full bg-amber-400/10 px-5 py-2 text-xs font-semibold text-amber-400 ring-1 ring-amber-400/20 transition hover:bg-amber-400/20">
              Ver tienda cocina →
            </Link>
          </div>
        </div>
      );

      // ── EVENTOS ────────────────────────────────────────────────────────────
      case "eventos": return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Eventos registrados</h2>
              <p className="mt-0.5 text-sm text-zinc-500">{eventos.length} eventos en la agenda</p>
            </div>
            <Link href="/eventos" className="rounded-full bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-400/20 transition hover:bg-emerald-400/20">
              Ver agenda →
            </Link>
          </div>

          {eventos.length === 0 ? (
            <div className="rounded-2xl bg-zinc-800/40 px-4 py-16 text-center ring-1 ring-white/10">
              <p className="text-sm text-zinc-500">Sin eventos registrados</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {eventos.map((e) => (
                <div key={e.id_evento} className="flex gap-4 rounded-2xl bg-zinc-800/60 p-4 ring-1 ring-white/10">
                  {e.fecha_corta && (
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-400/10 text-center">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">{e.fecha_corta.mes}</span>
                      <span className="text-lg font-bold leading-none text-white">{e.fecha_corta.dia}</span>
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
              ))}
            </div>
          )}
        </div>
      );
    }
  }

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <PageFade className="flex flex-1 overflow-hidden">
      <div className="flex flex-1 overflow-hidden">

        {/* ── Overlay mobile ── */}
        {sidebarAbierto && (
          <div className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarAbierto(false)} />
        )}

        {/* ══════════════════════════════════════════════
            SIDEBAR
        ══════════════════════════════════════════════ */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 flex w-56 shrink-0 flex-col bg-zinc-900 border-r border-white/8
          transition-transform duration-300
          ${sidebarAbierto ? "translate-x-0" : "-translate-x-full"}
          lg:sticky lg:top-0 lg:translate-x-0 lg:z-auto lg:h-full
        `}>
          {/* Logo / título */}
          <div className="flex h-16 items-center gap-3 px-5 border-b border-white/8">
            <div className="flex size-7 items-center justify-center rounded-lg bg-amber-400 text-xs font-black text-zinc-900">
              A
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white">ERUDITO</p>
              <p className="truncate text-[10px] text-zinc-500">Panel admin</p>
            </div>
            <button onClick={() => setSidebarAbierto(false)}
              className="ml-auto rounded-lg p-1 text-zinc-500 hover:text-white lg:hidden">
              ✕
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
            {NAV_ITEMS.map(({ id, label, icono }) => {
              const badge = id === "obras" ? obrasPendientes.length
                : id === "solicitudes" ? solicitudes.length : 0;
              const activo = seccion === id;
              return (
                <button key={id}
                  onClick={() => { setSeccion(id); setSidebarAbierto(false); }}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    activo
                      ? "bg-amber-400/10 text-amber-400 font-semibold"
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                  }`}>
                  <span className="text-base leading-none">{icono}</span>
                  <span className="flex-1 text-left">{label}</span>
                  {badge > 0 && <Badge n={badge} />}
                </button>
              );
            })}
          </nav>

          {/* Perfil + cerrar sesión */}
          <div className="border-t border-white/8 p-4 space-y-2">
            <div className="rounded-xl bg-white/5 px-3 py-2.5">
              <p className="text-xs font-semibold text-zinc-300 truncate">{perfil.nombre || "Admin"}</p>
              <p className="text-[10px] text-zinc-500 truncate">{perfil.email ?? ""}</p>
            </div>
            <button onClick={cerrarSesion}
              className="w-full rounded-xl bg-white/5 py-2 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-red-500/10 hover:text-red-400 hover:ring-red-500/20">
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* ══════════════════════════════════════════════
            CONTENIDO PRINCIPAL
        ══════════════════════════════════════════════ */}
        <div className="flex flex-1 flex-col min-w-0">

          {/* Topbar (mobile + título de sección) */}
          <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-white/8 bg-zinc-950/80 backdrop-blur px-4 lg:px-6">
            <button onClick={() => setSidebarAbierto(true)}
              className="flex size-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white lg:hidden">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">Admin</span>
              <span className="text-zinc-700">/</span>
              <span className="text-sm font-semibold text-zinc-200 capitalize">
                {NAV_ITEMS.find((n) => n.id === seccion)?.label}
              </span>
            </div>
            <span className="ml-auto rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-rose-400 ring-1 ring-rose-500/20">
              Administrador
            </span>
          </header>

          {/* Sección activa */}
          <main className="flex-1 overflow-y-auto p-5 lg:p-8">
            {renderContenido()}
          </main>
        </div>

      </div>

      {/* Modal rechazo */}
      {solicitudArechazar && (
        <ModalRechazo
          solicitud={solicitudArechazar}
          motivo={motivoRechazo}
          setMotivo={setMotivoRechazo}
          cargando={accionando === solicitudArechazar.id}
          onConfirmar={() => { rechazar(solicitudArechazar, motivoRechazo); setSolicitudArechazar(null); }}
          onCancelar={() => setSolicitudArechazar(null)}
        />
      )}
    </PageFade>
  );
}
