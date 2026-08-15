"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Artista } from "@/data/artistas";
import type { FichaArte } from "@/data/fichas";

interface Props {
  artistas: Artista[];
  fichas: FichaArte[];
}

export default function PaginaArtistas({ artistas, fichas }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroOrigen, setFiltroOrigen] = useState("");

  const origenes = useMemo(() => {
    const set = new Set(artistas.map((a) => a.origen).filter(Boolean));
    return Array.from(set).sort();
  }, [artistas]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return artistas.filter((a) => {
      const matchQ = !q || a.nombre.toLowerCase().includes(q) || a.origen.toLowerCase().includes(q);
      const matchOrigen = !filtroOrigen || a.origen === filtroOrigen;
      return matchQ && matchOrigen;
    });
  }, [artistas, busqueda, filtroOrigen]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-8">
      <h1 className="text-2xl font-semibold tracking-wide text-white">Artistas</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Maestros mexicanos cuya obra forma parte de la colección ERUDITO.
      </p>

      {/* Barra de búsqueda + filtros */}
      <div className="mt-6 flex flex-wrap gap-3">
        {/* Búsqueda */}
        <div className="relative flex-1 min-w-[200px]">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
            fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre u origen…"
            className="w-full rounded-xl bg-zinc-900 py-2.5 pl-9 pr-4 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 outline-none focus:ring-amber-400/50"
          />
        </div>

        {/* Filtro por origen */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <button
            type="button"
            onClick={() => setFiltroOrigen("")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ring-1 ${
              !filtroOrigen ? "bg-amber-400 text-zinc-900 ring-amber-400" : "bg-zinc-900 text-zinc-400 ring-white/10 hover:text-white"
            }`}
          >
            Todos
          </button>
          {origenes.map((origen) => (
            <button
              key={origen}
              type="button"
              onClick={() => setFiltroOrigen(origen === filtroOrigen ? "" : origen)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ring-1 ${
                filtroOrigen === origen ? "bg-amber-400 text-zinc-900 ring-amber-400" : "bg-zinc-900 text-zinc-400 ring-white/10 hover:text-white"
              }`}
            >
              {origen}
            </button>
          ))}
        </div>
      </div>

      {/* Contador */}
      <p className="mt-4 text-xs text-zinc-500">
        {filtrados.length} {filtrados.length === 1 ? "artista" : "artistas"}
        {(busqueda || filtroOrigen) && " encontrados"}
      </p>

      {filtrados.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/10 py-20 text-center">
          <p className="text-sm text-zinc-500">Sin artistas para «{busqueda}»</p>
          <button
            type="button"
            onClick={() => { setBusqueda(""); setFiltroOrigen(""); }}
            className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 hover:bg-white/10"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtrados.map((artista) => {
            const obras = fichas.filter((f) => f.artista.id === artista.id);
            const promedio =
              obras.length > 0
                ? (obras.reduce((suma, o) => suma + o.estrellas, 0) / obras.length).toFixed(1)
                : "—";

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
