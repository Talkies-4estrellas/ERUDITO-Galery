"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePerfil, type Rol } from "@/hooks/usePerfil";
import { useToast } from "@/components/ToastProvider";
import { supabase } from "@/lib/supabase";

interface Props {
  modo: "login" | "registro";
}

type Paso = "form" | "rol" | "confirmar";

const ROLES: {
  id: Rol;
  titulo: string;
  desc: string;
  icono: string;
  color: string;
  ring: string;
  badge: string;
}[] = [
  {
    id: "artista",
    titulo: "Soy Artista",
    desc: "Exhibe tu obra, gestiona tu portfolio y conecta con coleccionistas.",
    icono: "🎨",
    color: "hover:bg-amber-400/10 hover:ring-amber-400/40",
    ring: "bg-amber-400/10 ring-amber-400/20 text-amber-400",
    badge: "bg-amber-400 text-zinc-900",
  },
  {
    id: "comprador",
    titulo: "Soy Coleccionista",
    desc: "Descubre obras únicas, guárdalas y compáralas antes de adquirirlas.",
    icono: "♥",
    color: "hover:bg-cyan-400/10 hover:ring-cyan-400/40",
    ring: "bg-cyan-400/10 ring-cyan-400/20 text-cyan-400",
    badge: "bg-cyan-400 text-zinc-900",
  },
  {
    id: "empresa",
    titulo: "Soy Galería / Empresa",
    desc: "Representa artistas y publica su obra desde un perfil empresarial.",
    icono: "🏛️",
    color: "hover:bg-violet-500/10 hover:ring-violet-400/40",
    ring: "bg-violet-500/10 ring-violet-400/20 text-violet-400",
    badge: "bg-violet-500 text-white",
  },
];

export default function FormAuth({ modo }: Props) {
  const { entrar, registrar } = useAuth();
  const { elegirRol } = usePerfil();
  const { toast } = useToast();
  const router = useRouter();

  const [paso, setPaso]           = useState<Paso>("form");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [enviando, setEnviando]   = useState(false);
  const [errorClave, setErrorClave] = useState<"credenciales" | "general" | null>(null);
  const [errorMsg, setErrorMsg]   = useState("");
  const [reenviando, setReen]     = useState(false);
  const [reenviado, setReenviado] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrorClave(null);
    setErrorMsg("");

    if (modo === "registro" && password !== confirmar) {
      setErrorClave("general");
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    setEnviando(true);
    try {
      if (modo === "login") {
        await entrar(email, password);
        // Sincronizar email en perfil local si ya tiene rol elegido
        const raw = localStorage.getItem("erudito-perfil");
        if (raw) {
          const p = JSON.parse(raw);
          if (!p.email) localStorage.setItem("erudito-perfil", JSON.stringify({ ...p, email }));
        }
        toast("Sesión iniciada correctamente", { icono: "✓" });
        router.push("/perfil");
      } else {
        await registrar(email, password);
        // Avanzar a selección de rol
        setPaso("rol");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      if (msg.includes("Invalid login credentials")) {
        setErrorClave("credenciales");
      } else if (msg.includes("User already registered")) {
        setErrorClave("general");
        setErrorMsg("Ya existe una cuenta con ese email. ¿Quieres iniciar sesión?");
      } else {
        setErrorClave("general");
        setErrorMsg(msg);
      }
    } finally {
      setEnviando(false);
    }
  }

  function seleccionarRol(rol: Rol) {
    elegirRol(rol, email);
    setPaso("confirmar");
  }

  async function reenviarEmail() {
    if (!email) return;
    setReen(true);
    await supabase.auth.resend({ type: "signup", email });
    setReen(false);
    setReenviado(true);
    setTimeout(() => setReenviado(false), 4000);
  }

  /* ── Paso 2: Selección de rol ───────────────────────────────────────── */
  if (paso === "rol") {
    return (
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Paso 2 de 3
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">¿Cómo participas en ERUDITO?</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Esto personaliza tu experiencia. Puedes cambiarlo después.
          </p>
        </div>

        <div className="grid gap-3">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => seleccionarRol(r.id)}
              className={`group flex items-center gap-5 rounded-2xl bg-zinc-900 p-5 text-left ring-1 ring-white/10 transition ${r.color}`}
            >
              <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl text-xl ring-1 ${r.ring}`}>
                {r.icono}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-white">{r.titulo}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">{r.desc}</p>
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

  /* ── Paso 3: Confirmar email ─────────────────────────────────────────── */
  if (paso === "confirmar") {
    return (
      <div className="mx-auto w-full max-w-sm text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Paso 3 de 3
        </p>
        <div className="mt-4 flex size-16 items-center justify-center rounded-full bg-amber-400/10 ring-1 ring-amber-400/20 mx-auto">
          <span className="text-3xl">✉️</span>
        </div>
        <h2 className="mt-5 text-lg font-bold text-white">Revisa tu correo</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Enviamos un enlace de confirmación a{" "}
          <span className="font-semibold text-zinc-200">{email}</span>.
        </p>

        <div className="mt-4 rounded-2xl bg-zinc-800/60 p-4 text-left text-xs text-zinc-400 ring-1 ring-white/5 space-y-2">
          <p className="flex gap-2"><span className="text-amber-400 font-bold">1</span> Abre tu bandeja de entrada (o carpeta de spam)</p>
          <p className="flex gap-2"><span className="text-amber-400 font-bold">2</span> Busca un correo de <span className="text-zinc-300">noreply@supabase.io</span></p>
          <p className="flex gap-2"><span className="text-amber-400 font-bold">3</span> Haz clic en <span className="text-amber-400 font-medium">"Confirm your email"</span></p>
          <p className="flex gap-2"><span className="text-amber-400 font-bold">4</span> Regresa aquí e inicia sesión</p>
        </div>

        <button
          onClick={reenviarEmail}
          disabled={reenviando || reenviado}
          className="mt-5 w-full rounded-full border border-white/10 py-2.5 text-sm text-zinc-400 transition hover:border-white/20 hover:text-zinc-200 disabled:opacity-50"
        >
          {reenviado ? "✓ Email reenviado" : reenviando ? "Enviando…" : "Reenviar correo de confirmación"}
        </button>

        <Link href="/login" className="mt-3 block text-sm text-amber-400 hover:text-amber-300">
          Ya confirmé — Iniciar sesión →
        </Link>
      </div>
    );
  }

  /* ── Paso 1: Formulario email + contraseña ──────────────────────────── */
  const INPUT =
    "w-full rounded-xl bg-zinc-800 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-amber-400/50 transition";

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-8 text-center">
        <span className="text-2xl">🎨</span>
        {modo === "registro" && (
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Paso 1 de 3
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
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com" required className={INPUT} />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-400">Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres" required minLength={6} className={INPUT} />
        </div>

        {modo === "registro" && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">Confirmar contraseña</label>
            <input type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)}
              placeholder="Repite la contraseña" required className={INPUT} />
          </div>
        )}

        {errorClave === "credenciales" && (
          <div className="rounded-xl bg-red-500/10 px-4 py-3 ring-1 ring-red-500/20">
            <p className="text-sm font-semibold text-red-400">Email o contraseña incorrectos</p>
            <p className="mt-0.5 text-xs text-red-400/70">
              Verifica tus datos o{" "}
              <Link href="/registro" className="underline hover:text-red-300">crea una cuenta nueva</Link>.
            </p>
          </div>
        )}

        {errorClave === "general" && (
          <div className="rounded-xl bg-red-500/10 px-4 py-3 ring-1 ring-red-500/20">
            <p className="text-sm text-red-400">{errorMsg}</p>
            {errorMsg.includes("Ya existe") && (
              <Link href="/login" className="mt-1 block text-xs text-red-400/70 underline hover:text-red-300">
                Ir a iniciar sesión →
              </Link>
            )}
          </div>
        )}

        <button type="submit" disabled={enviando}
          className="w-full rounded-full bg-amber-400 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300 disabled:opacity-50">
          {enviando
            ? "Procesando…"
            : modo === "login"
            ? "Iniciar sesión"
            : "Continuar →"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        {modo === "login" ? (
          <>¿No tienes cuenta?{" "}
            <Link href="/registro" className="text-amber-400 hover:text-amber-300">Regístrate gratis</Link>
          </>
        ) : (
          <>¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-amber-400 hover:text-amber-300">Inicia sesión</Link>
          </>
        )}
      </p>
    </div>
  );
}
