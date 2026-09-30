"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
}

export default function LightboxHero({ src, alt }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [montado, setMontado] = useState(false);

  useEffect(() => { setMontado(true); }, []);

  const cerrar = useCallback(() => setAbierto(false), []);

  useEffect(() => {
    if (!abierto) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") cerrar(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [abierto, cerrar]);

  const modal = abierto ? (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/92 backdrop-blur-sm"
      onClick={cerrar}
    >
      {/* Botón cerrar */}
      <button
        type="button"
        onClick={cerrar}
        className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/25"
        aria-label="Cerrar"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Pista ESC */}
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-[11px] text-white/50">
        ESC para cerrar
      </span>

      {/* Imagen grande — stopPropagation para no cerrar al clickear la imagen */}
      <div
        className="relative h-[90vh] w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="90vw"
          className="object-contain"
        />
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Imagen clickeable en el hero */}
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="group absolute inset-0 z-0 cursor-zoom-in"
        aria-label="Ver imagen en grande"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {/* Icono de expansión al hover */}
        <span className="absolute bottom-36 right-4 flex size-9 items-center justify-center rounded-full bg-black/50 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 sm:bottom-40">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        </span>
      </button>

      {/* Portal al body — escapa overflow:hidden del section hero */}
      {montado && createPortal(modal, document.body)}
    </>
  );
}
