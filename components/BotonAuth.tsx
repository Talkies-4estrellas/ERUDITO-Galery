"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ToastProvider";

export default function BotonAuth() {
  const { user, cargando, salir } = useAuth();
  const { toast } = useToast();
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function click(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAbierto(false);
    }
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, []);

  async function cerrar() {
    await salir();
    toast("Sesión cerrada", { icono: "👋" });
    setAbierto(false);
  }

  if (cargando) return null;

  if (!user) {
    return (
      <Link
        href="/login"
        aria-label="Iniciar sesión"
        className="flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-400 ring-1 ring-amber-400/20 transition hover:bg-amber-400/20"
      >
        <svg className="size-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
        </svg>
        <span className="hidden sm:block">Entrar</span>
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setAbierto((v) => !v)}
        aria-label="Cuenta"
        className="flex size-8 items-center justify-center rounded-full bg-amber-400/20 text-amber-400 ring-1 ring-amber-400/30 transition hover:bg-amber-400/30"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      </button>

      {abierto && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl bg-zinc-900 p-2 shadow-xl ring-1 ring-white/10">
          <p className="truncate px-3 py-2 text-[11px] text-zinc-500">{user.email}</p>
          <div className="border-t border-white/5 pt-1">
            <Link href="/perfil" onClick={() => setAbierto(false)}
              className="block rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white">
              Mi perfil
            </Link>
            <Link href="/privado" onClick={() => setAbierto(false)}
              className="block rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white">
              🔒 Área privada
            </Link>
            <Link href="/admin" onClick={() => setAbierto(false)}
              className="block rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white">
              ⚙️ Administración
            </Link>
            <div className="border-t border-white/5 pt-1">
              <button onClick={cerrar}
                className="w-full rounded-xl px-3 py-2 text-left text-sm text-rose-400 transition hover:bg-rose-500/10">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
