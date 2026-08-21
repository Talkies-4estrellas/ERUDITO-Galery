"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { type Rol } from "@/hooks/usePerfil";
import { useToast } from "@/components/ToastProvider";
import { supabase } from "@/lib/supabase";

interface Props {
  modo: "login" | "registro";
}

type Paso = "form" | "rol" | "solicitud" | "enviada";

const ROLES: {
  id: Rol;
  titulo: string;
  desc: string;
  nota?: string;
  icono: string;
  color: string;
  ring: string;
}[] = [
  {
    id: "comprador",
    titulo: "Soy Coleccionista",
    desc: "Descubre obras únicas, guárdalas y compáralas antes de adquirirlas.",
    icono: "♥",
    color: "hover:bg-cyan-400/10 hover:ring-cyan-400/40",
    ring: "bg-cyan-400/10 ring-cyan-400/20 text-cyan-400",
  },
  {
    id: "artista",
    titulo: "Soy Artista",
    desc: "Exhibe tu obra, gestiona tu portfolio y conecta con coleccionistas.",
    nota: "Requiere evaluación del administrador",
    icono: "🎨",
    color: "hover:bg-amber-400/10 hover:ring-amber-400/40",
    ring: "bg-amber-400/10 ring-amber-400/20 text-amber-400",
  },
  {
    id: "empresa",
    titulo: "Soy Galería / Empresa",
    desc: "Representa artistas y publica su obra desde un perfil empresarial.",
    nota: "Requiere evaluación del administrador",
    icono: "🏛️",
    color: "hover:bg-violet-500/10 hover:ring-violet-400/40",
    ring: "bg-violet-500/10 ring-violet-400/20 text-violet-400",
  },
];

function OjoIcono({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
        strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function FormAuth({ modo }: Props) {
  const { entrar } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [paso, setPaso]             = useState<Paso>("form");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [confirmar, setConfirmar]   = useState("");
  const [enviando, setEnviando]     = useState(false);
  const [errorClave, setErrorClave] = useState<"credenciales" | "general" | null>(null);
  const [errorMsg, setErrorMsg]     = useState("");
  const [verClave, setVerClave]     = useState(false);
  const [verConf, setVerConf]       = useState(false);

  // Solicitud
  const [rolElegido, setRolElegido]     = useState<Rol | null>(null);
  const [nombre, setNombre]             = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [pais, setPais]                 = useState("");
  const [bio, setBio]                   = useState("");
  const [motivacion, setMotivacion]     = useState("");

  const INPUT = "w-full rounded-xl bg-zinc-800 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-amber-400/50 transition";

  function guardarLocal(datos: {
    rol: Rol; nombre: string; bio: string; especialidad: string;
    pais: string; email: string; slug?: string; avatar_url: string;
  }) {
    localStorage.setItem("erudito-perfil", JSON.stringify(datos));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrorClave(null);
    setErrorMsg("");

    if (modo === "registro") {
      if (password !== confirmar) {
        setErrorClave("general");
        setErrorMsg("Las contraseñas no coinciden.");
        return;
      }
      setPaso("rol");
      return;
    }

    setEnviando(true);
    try {
      // 1. Usuarios de desarrollo (accesos_prueba)
      const { data: prueba } = await supabase
        .from("accesos_prueba")
        .select("*")
        .eq("email", email)
        .eq("clave", password)
        .maybeSingle();

      if (prueba) {
        guardarLocal({
          rol: prueba.rol, nombre: prueba.nombre ?? "", bio: prueba.bio ?? "",
          especialidad: prueba.especialidad ?? "", pais: prueba.pais ?? "",
          email: prueba.email, slug: prueba.slug ?? undefined, avatar_url: prueba.avatar_url ?? "",
        });
        toast("Sesión iniciada", { icono: "✓" });
        router.push("/perfil");
        return;
      }

      // 2. Usuarios registrados en la app
      const { data: usuario } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", email)
        .eq("clave", password)
        .maybeSingle();

      if (usuario) {
        guardarLocal({
          rol: usuario.rol, nombre: usuario.nombre ?? "", bio: usuario.bio ?? "",
          especialidad: usuario.especialidad ?? "", pais: usuario.pais ?? "",
          email: usuario.email, slug: usuario.slug ?? undefined, avatar_url: usuario.avatar_url ?? "",
        });
        toast("Sesión iniciada", { icono: "✓" });
        router.push("/perfil");
        return;
      }

      // 3. Solicitudes pendientes o rechazadas
      const { data: solicitud } = await supabase
        .from("solicitudes")
        .select("estado")
        .eq("email", email)
        .eq("clave", password)
        .maybeSingle();

      if (solicitud) {
        if (solicitud.estado === "pendiente") {
          setErrorClave("general");
          setErrorMsg("Tu solicitud está siendo revisada por el administrador. Te contactaremos pronto.");
          return;
        }
        if (solicitud.estado === "rechazado") {
          setErrorClave("general");
          setErrorMsg("Tu solicitud fue rechazada. Contacta a ERUDITO para más información.");
          return;
        }
      }

      // 4. Supabase Auth (usuarios legacy)
      await entrar(email, password);
      const raw = localStorage.getItem("erudito-perfil");
      if (raw) {
        const p = JSON.parse(raw);
        if (!p.email) localStorage.setItem("erudito-perfil", JSON.stringify({ ...p, email }));
      }
      toast("Sesión iniciada correctamente", { icono: "✓" });
      router.push("/perfil");
    } catch (err: unknown) {
      const e = err as { message?: unknown; code?: string; status?: number };
      const raw = typeof e?.message === "string" ? e.message : "";
      const msg = raw || (err instanceof Error ? err.message : "Error inesperado");
      if (
        msg.toLowerCase().includes("invalid login credentials") ||
        e?.code === "invalid_credentials" ||
        e?.status === 400
      ) {
        setErrorClave("credenciales");
      } else {
        setErrorClave("general");
        setErrorMsg(msg || `Error ${e?.status ?? "desconocido"}`);
      }
    } finally {
      setEnviando(false);
    }
  }

  async function seleccionarRol(rol: Rol) {
    setErrorClave(null);
    setErrorMsg("");

    if (rol === "comprador") {
      setEnviando(true);
      try {
        const { error } = await supabase.from("usuarios").insert({
          email, clave: password, rol,
          nombre: "", bio: "", especialidad: "", pais: "", avatar_url: "", slug: null,
        });
        if (error) {
          if (error.code === "23505") {
            setErrorClave("general");
            setErrorMsg("Ya existe una cuenta con ese email. ¿Quieres iniciar sesión?");
            setPaso("form");
            return;
          }
          throw error;
        }
        guardarLocal({ rol, nombre: "", bio: "", especialidad: "", pais: "", email, avatar_url: "" });
        toast("¡Bienvenido a ERUDITO Galery!", { icono: "✓" });
        router.push("/perfil");
      } catch (err: unknown) {
        const e = err as { message?: string };
        setErrorClave("general");
        setErrorMsg(e?.message || "Error al crear la cuenta. Intenta de nuevo.");
        setPaso("form");
      } finally {
        setEnviando(false);
      }
    } else {
      setRolElegido(rol);
      setPaso("solicitud");
    }
  }

  async function enviarSolicitud(e: React.FormEvent) {
    e.preventDefault();
    setErrorClave(null);
    setErrorMsg("");
    setEnviando(true);
    try {
      const { error } = await supabase.from("solicitudes").insert({
        email, clave: password,
        rol: rolElegido,
        nombre, bio, especialidad, pais, motivacion,
      });
      if (error) {
        if (error.code === "23505") {
          setErrorClave("general");
          setErrorMsg("Ya existe una solicitud con ese email. Contacta a ERUDITO si tienes dudas.");
          return;
        }
        throw error;
      }
      setPaso("enviada");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setErrorClave("general");
      setErrorMsg(e?.message || "Error al enviar la solicitud. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  /* ── Solicitud: formulario de evaluación ────────────────────────────── */
  if (paso === "solicitud") {
    return (
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Evaluación · {rolElegido === "artista" ? "Artista" : "Galería / Empresa"}
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">Cuéntanos sobre ti</h2>
          <p className="mt-1 text-sm text-zinc-400">
            El equipo de ERUDITO revisará tu solicitud y te notificará.
          </p>
        </div>

        {errorClave === "general" && (
          <div className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 ring-1 ring-red-500/20">
            <p className="text-sm text-red-400">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={enviarSolicitud} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
              {rolElegido === "artista" ? "Nombre completo" : "Nombre de la galería / empresa"}{" "}
              <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder={rolElegido === "artista" ? "Tu nombre completo" : "Galería de Arte XYZ"}
              required
              className={INPUT}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">Especialidad</label>
            <input
              type="text"
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
              placeholder={rolElegido === "artista" ? "Pintura al óleo, fotografía…" : "Arte contemporáneo, esculturas…"}
              className={INPUT}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">País</label>
            <input
              type="text"
              value={pais}
              onChange={(e) => setPais(e.target.value)}
              placeholder="México"
              className={INPUT}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">Descripción / Biografía</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Cuéntanos sobre tu trabajo y trayectoria…"
              rows={3}
              className={INPUT + " resize-none"}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
              ¿Por qué quieres unirte a ERUDITO? <span className="text-amber-400">*</span>
            </label>
            <textarea
              value={motivacion}
              onChange={(e) => setMotivacion(e.target.value)}
              placeholder="Comparte tu motivación y lo que esperas de la plataforma…"
              required
              rows={3}
              className={INPUT + " resize-none"}
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-full bg-amber-400 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300 disabled:opacity-50"
          >
            {enviando ? "Enviando solicitud…" : "Enviar solicitud →"}
          </button>

          <button
            type="button"
            onClick={() => setPaso("rol")}
            className="w-full text-center text-sm text-zinc-500 transition hover:text-zinc-300"
          >
            ← Volver a elegir rol
          </button>
        </form>
      </div>
    );
  }

  /* ── Solicitud enviada ───────────────────────────────────────────────── */
  if (paso === "enviada") {
    return (
      <div className="mx-auto w-full max-w-sm text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-400/10 ring-1 ring-amber-400/20">
          <span className="text-3xl">📋</span>
        </div>
        <h2 className="mt-5 text-lg font-bold text-white">Solicitud enviada</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Recibimos tu solicitud como{" "}
          <span className="font-semibold text-zinc-200">
            {rolElegido === "artista" ? "artista" : "galería / empresa"}
          </span>.{" "}
          El equipo de ERUDITO la revisará pronto.
        </p>

        <div className="mt-4 space-y-2 rounded-2xl bg-zinc-800/60 p-4 text-left text-xs text-zinc-400 ring-1 ring-white/5">
          <p className="flex gap-2">
            <span className="font-bold text-amber-400">1</span> Tu solicitud está en revisión
          </p>
          <p className="flex gap-2">
            <span className="font-bold text-amber-400">2</span> El administrador la evaluará pronto
          </p>
          <p className="flex gap-2">
            <span className="font-bold text-amber-400">3</span> Al ser aprobada podrás iniciar sesión
          </p>
        </div>

        <Link href="/" className="mt-5 block text-sm text-amber-400 hover:text-amber-300">
          Volver al inicio →
        </Link>
      </div>
    );
  }

  /* ── Paso 2: Selección de rol ───────────────────────────────────────── */
  if (paso === "rol") {
    return (
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Paso 2 de 2
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">¿Cómo participas en ERUDITO?</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Esto personaliza tu experiencia. Puedes cambiarlo después.
          </p>
        </div>

        {errorClave === "general" && (
          <div className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 ring-1 ring-red-500/20">
            <p className="text-sm text-red-400">{errorMsg}</p>
          </div>
        )}

        <div className="grid gap-3">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              disabled={enviando}
              onClick={() => seleccionarRol(r.id)}
              className={`group flex items-center gap-5 rounded-2xl bg-zinc-900 p-5 text-left ring-1 ring-white/10 transition disabled:opacity-50 ${r.color}`}
            >
              <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl text-xl ring-1 ${r.ring}`}>
                {r.icono}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-white">{r.titulo}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">{r.desc}</p>
                {r.nota && (
                  <p className="mt-1 text-[10px] text-amber-400/70">{r.nota}</p>
                )}
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                className="size-4 shrink-0 text-zinc-600 transition group-hover:text-zinc-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ── Paso 1: Formulario email + contraseña ──────────────────────────── */
  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-8 text-center">
        <span className="text-2xl">🎨</span>
        {modo === "registro" && (
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Paso 1 de 2
          </p>
        )}
        <h1 className="mt-2 text-xl font-bold text-white">
          {modo === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {modo === "login"
            ? "Accede a tu espacio en ERUDITO Galery"
            : "Únete a la comunidad de arte"}
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            className={INPUT}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-400">Contraseña</label>
          <div className="relative">
            <input
              type={verClave ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              className={INPUT + " pr-10"}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setVerClave(!verClave)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
            >
              <OjoIcono visible={verClave} />
            </button>
          </div>
        </div>

        {modo === "registro" && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                type={verConf ? "text" : "password"}
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="Repite la contraseña"
                required
                className={INPUT + " pr-10"}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setVerConf(!verConf)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
              >
                <OjoIcono visible={verConf} />
              </button>
            </div>
          </div>
        )}

        {errorClave === "credenciales" && (
          <div className="rounded-xl bg-red-500/10 px-4 py-3 ring-1 ring-red-500/20">
            <p className="text-sm font-semibold text-red-400">Email o contraseña incorrectos</p>
            <p className="mt-0.5 text-xs text-red-400/70">
              Verifica tus datos o{" "}
              <Link href="/registro" className="underline hover:text-red-300">
                crea una cuenta nueva
              </Link>.
            </p>
          </div>
        )}

        {errorClave === "general" && (
          <div className="rounded-xl bg-red-500/10 px-4 py-3 ring-1 ring-red-500/20">
            <p className="text-sm text-red-400">{errorMsg}</p>
            {errorMsg.includes("Ya existe") && (
              <Link
                href="/login"
                className="mt-1 block text-xs text-red-400/70 underline hover:text-red-300"
              >
                Ir a iniciar sesión →
              </Link>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full rounded-full bg-amber-400 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300 disabled:opacity-50"
        >
          {enviando
            ? "Procesando…"
            : modo === "login"
            ? "Iniciar sesión"
            : "Continuar →"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        {modo === "login" ? (
          <>
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="text-amber-400 hover:text-amber-300">
              Regístrate gratis
            </Link>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-amber-400 hover:text-amber-300">
              Inicia sesión
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
