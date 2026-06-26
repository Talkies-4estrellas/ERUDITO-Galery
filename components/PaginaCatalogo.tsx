"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { fichas, type TipoObra } from "@/data/fichas";
import FichaObra from "@/components/FichaObra";

type Orden = "precio-asc" | "precio-desc" | "anio-asc" | "anio-desc" | "relevancia";

const TIPOS: { id: TipoObra | "todas"; label: string }[] = [
  { id: "todas",           label: "Todas" },
  { id: "JPG Certificado", label: "JPG Certificado" },
  { id: "Impresión Oficial", label: "Impresión Oficial" },
  { id: "Físico",          label: "Físico" },
];

const MOVIMIENTOS = Array.from(new Set(fichas.map((f) => f.movimiento))).sort();
const TECNICAS    = Array.from(new Set(fichas.map((f) => f.tecnica))).sort();
const PRECIO_MAX  = Math.max(...fichas.map((f) => f.precio));

export default function PaginaCatalogo() {
  const [tipo,       setTipo]       = useState<TipoObra | "todas">("todas");
  const [movimiento, setMovimiento] = useState("");
  const [tecnica,    setTecnica]    = useState("");
  const [precioMax,  setPrecioMax]  = useState(PRECIO_MAX);
  const [orden,      setOrden]      = useState<Orden>("relevancia");
  const [busqueda,   setBusqueda]   = useState("");
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  const resultado = useMemo(() => {
    let lista = [...fichas];

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      lista = lista.filter(
        (f) =>
          f.titulo.toLowerCase().includes(q) ||
          f.artista.nombre.toLowerCase().includes(q) ||
          f.movimiento.toLowerCase().includes(q) ||
          f.tecnica.toLowerCase().includes(q)
      );
    }
    if (tipo !== "todas")  lista = lista.filter((f) => f.tipo === tipo);
    if (movimiento)        lista = lista.filter((f) => f.movimiento === movimiento);
    if (tecnica)           lista = lista.filter((f) => f.tecnica === tecnica);
    lista = lista.filter((f) => f.precio <= precioMax);

    switch (orden) {
      case "precio-asc":  lista.sort((a, b) => a.precio - b.precio); break;
      case "precio-desc": lista.sort((a, b) => b.precio - a.precio); break;
      case "anio-asc":    lista.sort((a, b) => Number(a.anio) - Number(b.anio)); break;
      case "anio-desc":   lista.sort((a, b) => Number(b.anio) - Number(a.anio)); break;
    }

    return lista;
  }, [tipo, movimiento, tecnica, precioMax, orden, busqueda]);

  const hayFiltros = tipo !== "todas" || movimiento || tecnica || precioMax < PRECIO_MAX || busqueda;

  function limpiar() {
    setTipo("todas");
    setMovimiento("");
    setTecnica("");
    setPrecioMax(PRECIO_MAX);
    setBusqueda("");
    setOrden("relevancia");
  }

  const PILL = (activo: boolean) =>
    `rounded-full px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
      activo
        ? "bg-amber-400 text-zinc-900"
        : "bg-zinc-800 text-zinc-400 ring-1 ring-white/10 hover:bg-zinc-700 hover:text-zinc-200"
    }`;

  const SELECT =
    "rounded-xl bg-zinc-800 px-3 py-2 text-xs text-zinc-300 ring-1 ring-white/10 outline-none focus:ring-amber-400/40 cursor-pointer";

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-wide text-white">Catálogo</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Explora la colección por tipo, técnica, movimiento y precio.
          </p>
        </div>
        <p className="text-xs text-zinc-500">
          {resultado.length} obra{resultado.length !== 1 ? "s" : ""}
          {hayFiltros ? " encontradas" : " en total"}
        </p>
      </div>

      {/* Buscador */}
      <div className="relative mt-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500">
          <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.3-4.3" />
        </svg>
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por título, artista, técnica, movimiento…"
          className="w-full rounded-xl bg-zinc-800 py-2.5 pl-9 pr-4 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-amber-400/40"
        />
      </div>

      {/* Filtros rápidos — tipo */}
      <div className="mt-4 flex flex-wrap gap-2">
        {TIPOS.map((t) => (
          <button key={t.id} onClick={() => setTipo(t.id)} className={PILL(tipo === t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel de filtros avanzados */}
      <div className="mt-4">
        <button
          onClick={() => setFiltrosAbiertos((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-zinc-400 transition hover:text-zinc-200"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5">
            <path strokeLinecap="round" d="M3 6h18M7 12h10M11 18h2" />
          </svg>
          {filtrosAbiertos ? "Ocultar filtros avanzados" : "Filtros avanzados"}
          {hayFiltros && (
            <span className="rounded-full bg-amber-400/20 px-1.5 py-0.5 text-[10px] text-amber-400">
              activos
            </span>
          )}
        </button>

        {filtrosAbiertos && (
          <div className="mt-3 grid gap-4 rounded-2xl bg-zinc-900 p-5 ring-1 ring-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Movimiento */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                Movimiento
              </label>
              <select value={movimiento} onChange={(e) => setMovimiento(e.target.value)} className={SELECT + " w-full"}>
                <option value="">Todos</option>
                {MOVIMIENTOS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Técnica */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                Técnica
              </label>
              <select value={tecnica} onChange={(e) => setTecnica(e.target.value)} className={SELECT + " w-full"}>
                <option value="">Todas</option>
                {TECNICAS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Precio máximo */}
            <div>
              <label className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                <span>Precio máximo</span>
                <span className="text-amber-400 normal-case">${precioMax.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min={0}
                max={PRECIO_MAX}
                step={100}
                value={precioMax}
                onChange={(e) => setPrecioMax(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
              <div className="mt-1 flex justify-between text-[10px] text-zinc-600">
                <span>$0</span>
                <span>${PRECIO_MAX.toLocaleString()}</span>
              </div>
            </div>

            {/* Ordenar */}
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                Ordenar por
              </label>
              <select value={orden} onChange={(e) => setOrden(e.target.value as Orden)} className={SELECT + " w-full"}>
                <option value="relevancia">Relevancia</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="anio-asc">Año: más antiguo</option>
                <option value="anio-desc">Año: más reciente</option>
              </select>
            </div>
          </div>
        )}

        {hayFiltros && (
          <button onClick={limpiar} className="mt-2 text-[11px] text-zinc-500 transition hover:text-rose-400">
            ✕ Limpiar todos los filtros
          </button>
        )}
      </div>

      {/* Resultados */}
      {resultado.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
          {resultado.map((ficha) => (
            <FichaObra key={ficha.id} ficha={ficha} fluida />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-sm text-zinc-500">No se encontraron obras con esos filtros.</p>
          <button onClick={limpiar} className="mt-3 text-sm text-amber-400 hover:text-amber-300">
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Historias */}
      <div id="historias" className="mt-14 scroll-mt-28">
        <h2 className="text-lg font-semibold text-white">Historias</h2>
        <p className="mt-1 text-sm text-zinc-400">El contexto y el relato detrás de cada obra.</p>
        <div className="mt-5 space-y-4">
          {fichas.map((ficha) => (
            <Link
              key={ficha.id}
              href={`/obra/${ficha.id}`}
              className="block rounded-2xl bg-zinc-900 p-5 ring-1 ring-white/10 transition hover:ring-amber-400/30"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-sm font-bold uppercase tracking-wide text-white">{ficha.titulo}</h3>
                <span className="text-xs text-zinc-500">{ficha.anio}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{ficha.descripcion}</p>
              <p className="mt-2 text-xs font-medium text-amber-400">Leer más →</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
