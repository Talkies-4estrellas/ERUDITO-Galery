"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { FichaArte } from "@/data/fichas";
import FichaObra from "@/components/FichaObra";

type Orden = "precio-asc" | "precio-desc" | "anio-asc" | "anio-desc" | "relevancia";

const CATEGORIAS_OPCIONES = [
  "Pinturas", "Esculturas", "Digital", "Artesanías", "Colecciones",
  "Artículos Coleccionables", "Impresiones Oficiales", "Merch",
  "Réplicas Decorativas", "Drops",
];
const ESTILOS_OPCIONES = [
  "Muralismo", "Modernismo", "Realismo", "Simbolismo",
  "Abstracto", "Retrato", "Paisajismo", "Fotografía",
];
const TAMANOS_OPCIONES = ["Grande", "Mediano", "Pequeño"];

function Chips({ opciones, activo, setActivo }: {
  opciones: string[];
  activo: string;
  setActivo: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {opciones.map((op) => (
        <button
          key={op}
          type="button"
          onClick={() => setActivo(activo === op ? "" : op)}
          className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
            activo === op
              ? "bg-amber-400 text-zinc-900"
              : "bg-zinc-800 text-zinc-400 ring-1 ring-white/10 hover:bg-zinc-700 hover:text-white"
          }`}
        >
          {op}
        </button>
      ))}
    </div>
  );
}

interface Props {
  fichas: FichaArte[];
  titulo: string;
  descripcion: string;
  otroHref: string;
  otroLabel: string;
  vacio?: string;
}

export default function PaginaCatalogoSeccion({
  fichas,
  titulo,
  descripcion,
  otroHref,
  otroLabel,
  vacio = "No hay obras disponibles con esos filtros.",
}: Props) {
  const PRECIO_MAX = useMemo(() => fichas.length ? Math.max(...fichas.map((f) => f.precio)) : 100000, [fichas]);

  const [categoria,       setCategoria]       = useState("");
  const [estilo,          setEstilo]          = useState("");
  const [tamano,          setTamano]          = useState("");
  const [precioMax,       setPrecioMax]       = useState(() =>
    fichas.length ? Math.max(...fichas.map((f) => f.precio)) : 100000
  );
  const [orden,           setOrden]           = useState<Orden>("relevancia");
  const [busqueda,        setBusqueda]        = useState("");
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  const resultado = useMemo(() => {
    let lista = [...fichas];
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      lista = lista.filter((f) =>
        f.titulo.toLowerCase().includes(q) ||
        f.artista.nombre.toLowerCase().includes(q) ||
        f.movimiento.toLowerCase().includes(q) ||
        f.tecnica.toLowerCase().includes(q)
      );
    }
    if (categoria) lista = lista.filter((f) => f.tecnica.toLowerCase().includes(categoria.toLowerCase()));
    if (estilo)    lista = lista.filter((f) => f.movimiento.toLowerCase().includes(estilo.toLowerCase()));
    if (tamano)    lista = lista.filter((f) => f.tamano.toLowerCase().includes(tamano.toLowerCase()));
    lista = lista.filter((f) => f.precio <= precioMax);
    switch (orden) {
      case "precio-asc":  lista.sort((a, b) => a.precio - b.precio); break;
      case "precio-desc": lista.sort((a, b) => b.precio - a.precio); break;
      case "anio-asc":    lista.sort((a, b) => Number(a.anio) - Number(b.anio)); break;
      case "anio-desc":   lista.sort((a, b) => Number(b.anio) - Number(a.anio)); break;
    }
    return lista;
  }, [fichas, categoria, estilo, tamano, precioMax, orden, busqueda]);

  const hayFiltros = categoria || estilo || tamano || precioMax < PRECIO_MAX || !!busqueda.trim();

  function limpiar() {
    setCategoria("");
    setEstilo("");
    setTamano("");
    setPrecioMax(PRECIO_MAX);
    setBusqueda("");
    setOrden("relevancia");
  }

  const SELECT = "rounded-xl bg-zinc-800 px-3 py-2 text-xs text-zinc-300 ring-1 ring-white/10 outline-none focus:ring-amber-400/40 cursor-pointer w-full";

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-8">

      {/* Encabezado */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-wide text-white">{titulo}</h1>
          <p className="mt-1 text-sm text-zinc-400">{descripcion}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-500">
            {resultado.length} obra{resultado.length !== 1 ? "s" : ""}
            {hayFiltros ? " encontradas" : " en total"}
          </span>
          <Link
            href={otroHref}
            className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 transition hover:bg-amber-400/10 hover:text-amber-400 hover:ring-amber-400/20"
          >
            {otroLabel} →
          </Link>
        </div>
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

      {/* Filtros avanzados */}
      <div className="mt-4">
        <button
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
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Categorías</label>
              <Chips opciones={CATEGORIAS_OPCIONES} activo={categoria} setActivo={setCategoria} />
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Estilo</label>
              <Chips opciones={ESTILOS_OPCIONES} activo={estilo} setActivo={setEstilo} />
            </div>
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Por tamaño</label>
              <Chips opciones={TAMANOS_OPCIONES} activo={tamano} setActivo={setTamano} />
            </div>
            <div className="grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                  <span>Precio máximo</span>
                  <span className="text-amber-400 normal-case">${precioMax.toLocaleString("es-MX")}</span>
                </label>
                <input
                  type="range" min={0} max={PRECIO_MAX} step={100}
                  value={precioMax} onChange={(e) => setPrecioMax(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
                <div className="mt-1 flex justify-between text-[10px] text-zinc-600">
                  <span>$0</span><span>${PRECIO_MAX.toLocaleString("es-MX")}</span>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Ordenar por</label>
                <select value={orden} onChange={(e) => setOrden(e.target.value as Orden)} className={SELECT}>
                  <option value="relevancia">Relevancia</option>
                  <option value="precio-asc">Precio: menor a mayor</option>
                  <option value="precio-desc">Precio: mayor a menor</option>
                  <option value="anio-asc">Año: más antiguo</option>
                  <option value="anio-desc">Año: más reciente</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {hayFiltros && (
          <button onClick={limpiar} className="mt-2 text-[11px] text-zinc-500 transition hover:text-rose-400">
            ✕ Limpiar todos los filtros
          </button>
        )}
      </div>

      {/* Grid */}
      {resultado.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
          {resultado.map((ficha) => (
            <FichaObra key={ficha.id} ficha={ficha} fluida />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-2xl bg-zinc-900/60 py-12 text-center ring-1 ring-white/10">
          <p className="text-sm text-zinc-500">{vacio}</p>
          {hayFiltros && (
            <button onClick={limpiar} className="mt-3 text-sm text-amber-400 hover:text-amber-300">
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </section>
  );
}
