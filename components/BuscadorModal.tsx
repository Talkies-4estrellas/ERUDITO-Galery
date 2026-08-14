"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface ObraResult  { id: number; titulo: string; anio: string; tecnica: string; imagen: string; artista: string; }
interface ArtistaResult { id: number; nombre: string; vida: string; origen: string; foto: string; }

interface Props {
  open: boolean;
  onClose: () => void;
  query: string;
  setQuery: (q: string) => void;
}

export default function BuscadorModal({ open, onClose, query, setQuery }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router   = useRouter();

  const [obras,    setObras]    = useState<ObraResult[]>([]);
  const [artistas, setArtistas] = useState<ArtistaResult[]>([]);
  const [buscando, setBuscando] = useState(false);

  // Auto-focus al abrir
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Búsqueda server-side con debounce 300 ms
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) { setObras([]); setArtistas([]); return; }

    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setBuscando(true);
      try {
        const res = await fetch(`/api/buscar?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        if (!res.ok) return;
        const data = await res.json();
        setObras(data.obras ?? []);
        setArtistas(data.artistas ?? []);
      } catch {
        // AbortError ignorado
      } finally {
        setBuscando(false);
      }
    }, 300);

    return () => { clearTimeout(timer); ctrl.abort(); };
  }, [query]);

  const hayResultados = obras.length > 0 || artistas.length > 0;
  const q = query.trim();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (obras.length > 0)    { router.push(`/obra/${obras[0].id}`);       onClose(); }
      else if (artistas.length > 0) { router.push(`/artista/${artistas[0].id}`); onClose(); }
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
          {buscando ? (
            <svg className="size-5 shrink-0 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          ) : (
            <svg className="size-5 shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          )}
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

          {q && q.length < 2 && (
            <p className="px-4 py-10 text-center text-sm text-zinc-500">
              Escribe al menos 2 caracteres…
            </p>
          )}

          {q.length >= 2 && !buscando && !hayResultados && (
            <p className="px-4 py-10 text-center text-sm text-zinc-500">
              Sin resultados para «{query}»
            </p>
          )}

          {obras.length > 0 && (
            <div>
              <p className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Obras</p>
              {obras.map((f) => (
                <Link
                  key={f.id}
                  href={`/obra/${f.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-white/5"
                >
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
                    <Image src={f.imagen} alt={f.titulo} fill sizes="40px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{f.titulo}</p>
                    <p className="truncate text-xs text-zinc-400">{f.artista} · {f.tecnica} · {f.anio}</p>
                  </div>
                  <span className="ml-auto shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-zinc-500">Obra</span>
                </Link>
              ))}
            </div>
          )}

          {artistas.length > 0 && (
            <div className={obras.length > 0 ? "border-t border-zinc-800" : ""}>
              <p className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Artistas</p>
              {artistas.map((a) => (
                <Link
                  key={a.id}
                  href={`/artista/${a.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-white/5"
                >
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-full">
                    <Image src={a.foto} alt={a.nombre} fill sizes="40px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{a.nombre}</p>
                    <p className="truncate text-xs text-zinc-400">{a.vida} · {a.origen}</p>
                  </div>
                  <span className="ml-auto shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-zinc-500">Artista</span>
                </Link>
              ))}
            </div>
          )}

          {hayResultados && (
            <div className="border-t border-zinc-800 px-4 py-2">
              <p className="text-[10px] text-zinc-600">
                {obras.length + artistas.length} resultado
                {obras.length + artistas.length !== 1 ? "s" : ""} · Enter para ir al primero
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
