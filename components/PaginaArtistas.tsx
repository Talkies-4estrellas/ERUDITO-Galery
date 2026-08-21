"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Artista } from "@/data/artistas";
import type { FichaArte } from "@/data/fichas";

// Fallback hasta que se agregue la columna pais a Supabase
const PAISES_FALLBACK: Record<number, string> = {
  5: "Alemania",
  6: "México",
  7: "México",
  8: "México",
  9: "México",
  10: "China",
  11: "China",
  12: "China",
  13: "Estados Unidos",
  14: "Bélgica",
  15: "China",
  16: "China",
  17: "China",
};

interface Props {
  artistas: Artista[];
  fichas: FichaArte[];
  titulo?: string;
  descripcion?: string;
}

function GrupoChips({
  label,
  opciones,
  activo,
  setActivo,
}: {
  label: string;
  opciones: string[];
  activo: string;
  setActivo: (v: string) => void;
}) {
  if (opciones.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {opciones.map((op) => (
          <button
            key={op}
            type="button"
            onClick={() => setActivo(activo === op ? "" : op)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ring-1 ${
              activo === op
                ? "bg-amber-400 text-zinc-900 ring-amber-400"
                : "bg-zinc-900 text-zinc-400 ring-white/10 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            {op}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PaginaArtistas({
  artistas,
  fichas,
  titulo = "Artistas",
  descripcion = "Maestros cuya obra forma parte de la colección ERUDITO.",
}: Props) {
  const [busqueda,         setBusqueda]         = useState("");
  const [filtroOrigen,     setFiltroOrigen]     = useState("");
  const [filtroTecnica,    setFiltroTecnica]    = useState("");
  const [filtroMovimiento, setFiltroMovimiento] = useState("");
  const [filtrosAbiertos,  setFiltrosAbiertos]  = useState(false);

  // Pre-computar obras por artista (evita recalcular dentro del useMemo de filtrado)
  const obrasPorArtista = useMemo(() => {
    const mapa = new Map<number, FichaArte[]>();
    artistas.forEach((a) => mapa.set(a.id, []));
    fichas.forEach((f) => {
      const lista = mapa.get(f.artista.id);
      if (lista) lista.push(f);
    });
    return mapa;
  }, [artistas, fichas]);

  // País real de cada artista (Supabase pais si existe, sino fallback)
  const getPais = (a: Artista) => a.pais ?? PAISES_FALLBACK[a.id] ?? "";

  const paises = useMemo(() =>
    Array.from(new Set(artistas.map(getPais).filter(Boolean))).sort()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  , [artistas]);

  // Técnica: disciplina del artista (origen, excluyendo países) + técnica de sus obras
  const tecnicas = useMemo(() => {
    const listaPaises = new Set(Object.values(PAISES_FALLBACK));
    const set = new Set<string>();
    artistas.forEach((a) => { if (a.origen && !listaPaises.has(a.origen)) set.add(a.origen); });
    fichas.forEach((f) => { if (f.tecnica) set.add(f.tecnica); });
    return Array.from(set).sort();
  }, [artistas, fichas]);

  const movimientos = useMemo(() =>
    Array.from(new Set(fichas.map((f) => f.movimiento).filter(Boolean))).sort()
  , [fichas]);

  // Filtrado
  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return artistas.filter((a) => {
      if (q && !a.nombre.toLowerCase().includes(q) && !a.origen.toLowerCase().includes(q)) return false;
      if (filtroOrigen && getPais(a) !== filtroOrigen) return false;
      const obras = obrasPorArtista.get(a.id) ?? [];
      if (filtroTecnica && a.origen !== filtroTecnica && !obras.some((o) => o.tecnica === filtroTecnica)) return false;
      if (filtroMovimiento && !obras.some((o) => o.movimiento === filtroMovimiento)) return false;
      return true;
    });
  }, [artistas, busqueda, filtroOrigen, filtroTecnica, filtroMovimiento, obrasPorArtista]);

  const hayFiltros = !!busqueda || !!filtroOrigen || !!filtroTecnica || !!filtroMovimiento;

  function limpiar() {
    setBusqueda("");
    setFiltroOrigen("");
    setFiltroTecnica("");
    setFiltroMovimiento("");
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-8">
      <h1 className="text-2xl font-semibold tracking-wide text-white">{titulo}</h1>
      <p className="mt-1 text-sm text-zinc-400">{descripcion}</p>

      {/* Buscador */}
      <div className="relative mt-6">
        <svg className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
          fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre u origen…"
          className="w-full rounded-xl bg-zinc-900 py-2.5 pl-9 pr-4 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 outline-none focus:ring-amber-400/50"
        />
      </div>

      {/* Filtros avanzados */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setFiltrosAbiertos((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-zinc-400 transition hover:text-zinc-200"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5">
            <path strokeLinecap="round" d="M3 6h18M7 12h10M11 18h2" />
          </svg>
          {filtrosAbiertos ? "Ocultar filtros" : "Filtros avanzados"}
          {hayFiltros && (
            <span className="rounded-full bg-amber-400/20 px-1.5 py-0.5 text-[10px] text-amber-400">activos</span>
          )}
        </button>

        {filtrosAbiertos && (
          <div className="mt-3 space-y-5 rounded-2xl bg-zinc-900 p-5 ring-1 ring-white/10">
            <GrupoChips
              label="De dónde es"
              opciones={paises}
              activo={filtroOrigen}
              setActivo={setFiltroOrigen}
            />
            <GrupoChips
              label="Técnica de arte"
              opciones={tecnicas}
              activo={filtroTecnica}
              setActivo={setFiltroTecnica}
            />
            <GrupoChips
              label="Corriente artística"
              opciones={movimientos}
              activo={filtroMovimiento}
              setActivo={setFiltroMovimiento}
            />
          </div>
        )}

        {hayFiltros && (
          <button
            type="button"
            onClick={limpiar}
            className="mt-2 text-[11px] text-zinc-500 transition hover:text-rose-400"
          >
            ✕ Limpiar todos los filtros
          </button>
        )}
      </div>

      {/* Contador */}
      <div className="mt-4">
        <p className="text-xs text-zinc-500">
          {filtrados.length} {filtrados.length === 1 ? "artista" : "artistas"}
          {hayFiltros && " encontrados"}
        </p>
      </div>

      {/* Grid */}
      {filtrados.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/10 py-20 text-center">
          <p className="text-sm text-zinc-500">Sin artistas con esos filtros</p>
          <button
            type="button"
            onClick={limpiar}
            className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 hover:bg-white/10"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtrados.map((artista) => {
            const obras = obrasPorArtista.get(artista.id) ?? [];
            const promedio = obras.length > 0
              ? (obras.reduce((s, o) => s + o.estrellas, 0) / obras.length).toFixed(1)
              : "—";
            const tecnicasArtista = Array.from(new Set(obras.map((o) => o.tecnica))).slice(0, 2);
            const movimientosArtista = Array.from(new Set(obras.map((o) => o.movimiento))).slice(0, 1);

            return (
              <Link
                key={artista.id}
                href={`/artista/${artista.id}`}
                className="group overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10 transition hover:ring-amber-400/40"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={artista.foto}
                    alt={artista.nombre}
                    fill
                    sizes="280px"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-sm font-bold text-white">{artista.nombre}</h2>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    {artista.vida} · {artista.origen}
                  </p>
                  {/* Tags de técnica y corriente */}
                  {(tecnicasArtista.length > 0 || movimientosArtista.length > 0) && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {movimientosArtista.map((m) => (
                        <span key={m} className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] text-amber-400 ring-1 ring-amber-400/20">
                          {m}
                        </span>
                      ))}
                      {tecnicasArtista.map((t) => (
                        <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400 ring-1 ring-white/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-zinc-500">
                      {obras.length} {obras.length === 1 ? "obra" : "obras"}
                    </span>
                    <span className="font-semibold text-amber-400">★ {promedio}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
