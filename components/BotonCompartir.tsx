"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastProvider";

interface Props {
  titulo: string;
  className?: string;
}

export default function BotonCompartir({ titulo, className = "" }: Props) {
  const { toast } = useToast();
  const [copiado, setCopiado] = useState(false);

  async function compartir() {
    const url = window.location.href;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: titulo, url });
      } catch {
        // usuario canceló
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      toast("Enlace copiado al portapapeles", { icono: "🔗" });
      setTimeout(() => setCopiado(false), 2500);
    }
  }

  return (
    <button
      type="button"
      onClick={compartir}
      title="Compartir obra"
      className={`flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white ${className}`}
    >
      {copiado ? (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5 text-emerald-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
          <span className="text-emerald-400">Copiado</span>
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
          </svg>
          Compartir
        </>
      )}
    </button>
  );
}
