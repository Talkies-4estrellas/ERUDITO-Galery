"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ToastProvider";

interface Props {
  modo: "login" | "registro";
}

const ERRORES: Record<string, string> = {
  "Invalid login credentials": "Email o contraseña incorrectos.",
  "Email not confirmed": "Confirma tu email antes de iniciar sesión.",
  "User already registered": "Ya existe una cuenta con ese email.",
  "Password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres.",
};

function traducir(msg: string): string {
  return ERRORES[msg] ?? msg;
}

export default function FormAuth({ modo }: Props) {
  const { entrar, registrar } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [enviando, setEnviando]   = useState(false);
  const [error, setError]         = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (modo === "registro" && password !== confirmar) {
      setError("Las contraseñas no coinciden.");
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
        toast("Cuenta creada. Revisa tu email para confirmarla.", { icono: "✉️" });
        router.push("/login");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      setError(traducir(msg));
    } finally {
      setEnviando(false);
    }
  }

  const INPUT =
    "w-full rounded-xl bg-zinc-800 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-amber-400/50 transition";

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

        {error && (
          <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-400 ring-1 ring-red-500/20">
            {error}
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
