"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ToastProvider";
import { supabase } from "@/lib/supabase";

interface Props {
  modo: "login" | "registro";
}

export default function FormAuth({ modo }: Props) {
  const { entrar, registrar } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [confirmar, setConfirmar]     = useState("");
  const [enviando, setEnviando]       = useState(false);
  const [errorClave, setErrorClave]   = useState<"credenciales" | "confirmar" | "general" | null>(null);
  const [errorMsg, setErrorMsg]       = useState("");
  const [reenviando, setReen]         = useState(false);
  const [reenviado, setReenviado]     = useState(false);

  function parsearError(msg: string) {
    if (msg.includes("Email not confirmed"))        return "confirmar";
    if (msg.includes("Invalid login credentials"))  return "credenciales";
    return "general";
  }

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
        toast("Sesión iniciada correctamente", { icono: "✓" });
        router.push("/perfil");
      } else {
        await registrar(email, password);
        // Mostrar pantalla de "revisa tu email" en vez de redirigir
        setErrorClave("confirmar");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      const clave = parsearError(msg);
      setErrorClave(clave as typeof errorClave);
      if (clave === "general") setErrorMsg(msg);
    } finally {
      setEnviando(false);
    }
  }

  async function reenviarEmail() {
    if (!email) return;
    setReen(true);
    await supabase.auth.resend({ type: "signup", email });
    setReen(false);
    setReenviado(true);
    setTimeout(() => setReenviado(false), 4000);
  }

  const INPUT =
    "w-full rounded-xl bg-zinc-800 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-amber-400/50 transition";

  /* ── Estado: email pendiente de confirmar ── */
  if (errorClave === "confirmar") {
    return (
      <div className="mx-auto w-full max-w-sm text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-amber-400/10 ring-1 ring-amber-400/20 mx-auto">
          <span className="text-3xl">✉️</span>
        </div>
        <h2 className="mt-5 text-lg font-bold text-white">Revisa tu correo</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Enviamos un enlace de confirmación a{" "}
          <span className="font-semibold text-zinc-200">{email}</span>.
          Haz clic en ese enlace para activar tu cuenta y luego vuelve aquí a iniciar sesión.
        </p>

        <div className="mt-4 rounded-2xl bg-zinc-800/60 p-4 text-left text-xs text-zinc-400 ring-1 ring-white/5 space-y-1.5">
          <p>1. Abre tu bandeja de entrada (o carpeta de spam)</p>
          <p>2. Busca un correo de <span className="text-zinc-300">noreply@supabase.io</span></p>
          <p>3. Haz clic en <span className="text-amber-400 font-medium">"Confirm your email"</span></p>
          <p>4. Regresa aquí e inicia sesión</p>
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

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-8 text-center">
        <span className="text-2xl">🎨</span>
        <h1 className="mt-3 text-xl font-bold text-white">
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
            className={INPUT}
          />
        </div>

        {modo === "registro" && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              placeholder="Repite la contraseña"
              required
              className={INPUT}
            />
          </div>
        )}

        {/* Error: credenciales incorrectas */}
        {errorClave === "credenciales" && (
          <div className="rounded-xl bg-red-500/10 px-4 py-3 ring-1 ring-red-500/20">
            <p className="text-sm font-semibold text-red-400">Email o contraseña incorrectos</p>
            <p className="mt-0.5 text-xs text-red-400/70">
              Verifica tus datos o{" "}
              <Link href="/registro" className="underline hover:text-red-300">crea una cuenta nueva</Link>.
            </p>
          </div>
        )}

        {/* Error genérico */}
        {errorClave === "general" && (
          <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-400 ring-1 ring-red-500/20">
            {errorMsg}
          </p>
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
            : "Crear cuenta"}
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
