"use client";

import { useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fichas } from "@/data/fichas";
import { artistas } from "@/data/artistas";

interface Props {
  open: boolean;
  onClose: () => void;
  query: string;
  setQuery: (q: string) => void;
}

export default function BuscadorModal({ open, onClose, query, setQuery }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Auto-focus al abrir
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const q = query.toLowerCase().trim();

  const obrasFiltradas = useMemo(() => {
    if (!q) return [];
    return fichas
      .filter(
        (f) =>
          f.titulo.toLowerCase().includes(q) ||
          f.descripcion.toLowerCase().includes(q) ||
          f.artista.nombre.toLowerCase().includes(q) ||
          f.tecnica.toLowerCase().includes(q) ||
          f.movimiento.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [q]);

  const artistasFiltrados = useMemo(() => {
    if (!q) return [];
    return artistas
      .filter(
        (a) =>
          a.nombre.toLowerCase().includes(q) ||
          a.origen.toLowerCase().includes(q) ||
          a.bio.toLowerCase().includes(q)
      )
      .slice(0, 3);
  }, [q]);

  const hayResultados = obrasFiltradas.length > 0 || artistasFiltrados.length > 0;

  // Enter → navegar al primer resultado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (obrasFiltradas.length > 0) {
        router.push(`/obra/${obrasFiltradas[0].id}`);
        onClose();
      } else if (artistasFiltrados.length > 0) {
        router.push(`/artista/${artistasFiltrados[0].id}`);
        onClose();
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/70 pt-20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-xl overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Campo de búsqueda */}
        <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
          <svg
            className="size-5 shrink-0 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar obras, artistas, técnicas…"
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
          />
          <kbd className="hidden items-center rounded px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 ring-1 ring-white/10 sm:inline-flex">
            ESC
          </kbd>
        </div>

        {/* Resultados */}
        <div className="max-h-96 overflow-y-auto">
          {!q && (
            <p className="px-4 py-10 text-center text-sm text-zinc-500">
              Empieza a escribir para buscar…
            </p>
          )}

          {q && !hayResultados && (
            <p className="px-4 py-10 text-center text-sm text-zinc-500">
              Sin resultados para «{query}»
            </p>
          )}

          {obrasFiltradas.length > 0 && (
            <div>
              <p className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                Obras
              </p>
              {obrasFiltradas.map((f) => (
                <Link
                  key={f.id}
                  href={`/obra/${f.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-white/5"
                >
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={f.imagen}
                      alt={f.titulo}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {f.titulo}
                    </p>
                    <p className="truncate text-xs text-zinc-400">
                      {f.artista.nombre} · {f.tecnica} · {f.anio}
                    </p>
                  </div>
                  <span className="ml-auto shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-zinc-500">
                    Obra
                  </span>
                </Link>
              ))}
            </div>
          )}

          {artistasFiltrados.length > 0 && (
            <div
              className={obrasFiltradas.length > 0 ? "border-t border-zinc-800" : ""}
            >
              <p className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                Artistas
              </p>
              {artistasFiltrados.map((a) => (
                <Link
                  key={a.id}
                  href={`/artista/${a.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-white/5"
                >
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={a.foto}
                      alt={a.nombre}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {a.nombre}
                    </p>
                    <p className="truncate text-xs text-zinc-400">
                      {a.vida} · {a.origen}
                    </p>
                  </div>
                  <span className="ml-auto shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-zinc-500">
                    Artista
                  </span>
                </Link>
              ))}
            </div>
          )}

          {hayResultados && (
            <div className="border-t border-zinc-800 px-4 py-2">
              <p className="text-[10px] text-zinc-600">
                {obrasFiltradas.length + artistasFiltrados.length} resultado
                {obrasFiltradas.length + artistasFiltrados.length !== 1 ? "s" : ""} ·
                Enter para ir al primero
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
