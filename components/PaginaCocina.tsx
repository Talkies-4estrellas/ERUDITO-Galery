"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";
import {
  CATEGORIAS_COCINA,
  COLOR_COCINA,
  type ProductoCocina,
  type CategoriaCocina,
} from "@/data/cocina";

type Orden = "relevancia" | "precio-asc" | "precio-desc";

function Chips({
  opciones,
  activo,
  setActivo,
}: {
  opciones: readonly string[];
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

function TarjetaProducto({ producto }: { producto: ProductoCocina }) {
  const { toast } = useToast();
  const color = COLOR_COCINA[producto.categoria];
  const [hovered, setHovered] = useState(false);

  function agregar() {
    const carrito = JSON.parse(localStorage.getItem("erudito-carrito-cocina") || "[]");
    const idx = carrito.findIndex((i: { id: number }) => i.id === producto.id);
    if (idx >= 0) carrito[idx].cantidad += 1;
    else carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
    localStorage.setItem("erudito-carrito-cocina", JSON.stringify(carrito));
    toast(`${producto.nombre} añadido`, { icono: "🛒" });
  }

  return (
    <article
      className="flex flex-col overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10 transition hover:ring-amber-400/20"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/cocina/${producto.id}`} className="relative block aspect-[3/4] overflow-hidden bg-zinc-800">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 ${hovered ? "scale-105" : ""}`}
        />
        {producto.destacado && (
          <div className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-zinc-900">
            Destacado
          </div>
        )}

        {/* Blur + gradiente — desaparecen en hover */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 transition-opacity duration-300"
          style={{ opacity: hovered ? 0 : 1 }}
        >
          <div
            className="absolute inset-x-0 bottom-0 h-[55%] backdrop-blur-md"
            style={{
              WebkitMaskImage: "linear-gradient(to top, black 35%, transparent 90%)",
              maskImage: "linear-gradient(to top, black 35%, transparent 90%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-zinc-950/80 to-transparent" />
          <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
            ${producto.precio.toLocaleString("es-MX")} MXN
          </div>
          <span className={`absolute bottom-3 left-3 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ring-1 ${color}`}>
            {producto.categoria}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-bold text-white leading-snug">{producto.nombre}</h3>
        <p className="mt-0.5 text-[11px] text-zinc-500">
          {producto.productor} · {producto.origen}
        </p>
        <p className="mt-2 flex-1 text-xs leading-relaxed text-zinc-400 line-clamp-3">
          {producto.descripcion}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[11px] text-zinc-600">{producto.unidad}</span>
          <button
            type="button"
            onClick={agregar}
            className="rounded-full bg-amber-400 px-4 py-1.5 text-xs font-bold text-zinc-900 transition hover:bg-amber-300 active:scale-95"
          >
            Añadir →
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductoDestacado({ producto }: { producto: ProductoCocina }) {
  const { toast } = useToast();
  const color = COLOR_COCINA[producto.categoria];

  function agregar() {
    const carrito = JSON.parse(localStorage.getItem("erudito-carrito-cocina") || "[]");
    const idx = carrito.findIndex((i: { id: number }) => i.id === producto.id);
    if (idx >= 0) carrito[idx].cantidad += 1;
    else carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
    localStorage.setItem("erudito-carrito-cocina", JSON.stringify(carrito));
    toast(`${producto.nombre} añadido`, { icono: "🛒" });
  }

  return (
    <article className="group overflow-hidden rounded-3xl bg-zinc-900 ring-1 ring-white/10 lg:grid lg:grid-cols-[1fr_420px]">
      <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[360px] overflow-hidden">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          sizes="(max-width:1024px) 100vw, 55vw"
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-transparent via-transparent to-zinc-900/80 lg:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent lg:hidden" />
      </div>
      <div className="flex flex-col justify-center gap-4 p-6 lg:p-8">
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ring-1 ${color}`}>
            {producto.categoria}
          </span>
          <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-amber-400 ring-1 ring-amber-400/20">
            Selección especial
          </span>
        </div>
        <h2 className="text-xl font-bold text-white lg:text-2xl">{producto.nombre}</h2>
        <p className="text-xs text-zinc-500">{producto.productor} · {producto.origen} · {producto.unidad}</p>
        <p className="text-sm leading-relaxed text-zinc-400">{producto.descripcion}</p>
        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
          <p className="font-serif text-2xl font-bold text-white">
            ${producto.precio.toLocaleString("es-MX")}
            <span className="ml-1 text-sm font-normal text-zinc-500">MXN</span>
          </p>
          <button
            type="button"
            onClick={agregar}
            className="rounded-full bg-amber-400 px-6 py-2 text-sm font-bold text-zinc-900 transition hover:bg-amber-300 active:scale-95"
          >
            Añadir al pedido →
          </button>
        </div>
      </div>
    </article>
  );
}

export default function PaginaCocina({ productos }: { productos: ProductoCocina[] }) {
  const PRECIO_MAX = useMemo(
    () => (productos.length ? Math.max(...productos.map((p) => p.precio)) : 10000),
    [productos]
  );

  const [busqueda,        setBusqueda]        = useState("");
  const [categoria,       setCategoria]       = useState("");
  const [precioMax,       setPrecioMax]       = useState(PRECIO_MAX);
  const [orden,           setOrden]           = useState<Orden>("relevancia");
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  const hayFiltros = !!busqueda.trim() || !!categoria || precioMax < PRECIO_MAX || orden !== "relevancia";

  const filtrados = useMemo(() => {
    let lista = [...productos];
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      lista = lista.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.productor.toLowerCase().includes(q) ||
          p.origen.toLowerCase().includes(q)
      );
    }
    if (categoria) lista = lista.filter((p) => p.categoria === (categoria as CategoriaCocina));
    lista = lista.filter((p) => p.precio <= precioMax);
    if (orden === "precio-asc")  lista.sort((a, b) => a.precio - b.precio);
    if (orden === "precio-desc") lista.sort((a, b) => b.precio - a.precio);
    return lista;
  }, [productos, busqueda, categoria, precioMax, orden]);

  const destacados = filtrados.filter((p) => p.destacado);
  const enGrid = hayFiltros ? filtrados : filtrados.filter((p) => !p.destacado);

  function limpiar() {
    setBusqueda("");
    setCategoria("");
    setPrecioMax(PRECIO_MAX);
    setOrden("relevancia");
  }

  const SELECT = "rounded-xl bg-zinc-800 px-3 py-2 text-xs text-zinc-300 ring-1 ring-white/10 outline-none focus:ring-amber-400/40 cursor-pointer w-full";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
      {/* Encabezado */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">Gastronomía</p>
        <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">Cocina y Alimento</h1>
        <p className="mt-2 max-w-lg text-sm text-zinc-400">
          La comida hoy en día también es un lujo. Productos seleccionados con el mismo criterio
          con el que elegimos una obra de arte.
        </p>
      </div>

      {/* Buscador */}
      <div className="relative">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500">
          <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.3-4.3" />
        </svg>
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, productor u origen…"
          className="w-full rounded-xl bg-zinc-800 py-2.5 pl-9 pr-4 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-amber-400/40"
        />
      </div>

      {/* Filtros avanzados */}
      <div className="mt-4 mb-8">
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
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Categoría</label>
              <Chips opciones={CATEGORIAS_COCINA} activo={categoria} setActivo={setCategoria} />
            </div>
            <div className="grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                  <span>Precio máximo</span>
                  <span className="text-amber-400 normal-case">${precioMax.toLocaleString("es-MX")} MXN</span>
                </label>
                <input
                  type="range" min={0} max={PRECIO_MAX} step={50}
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

      {/* Contador */}
      <p className="mb-6 text-xs text-zinc-500">
        {filtrados.length} producto{filtrados.length !== 1 ? "s" : ""}
        {hayFiltros ? " encontrados" : " en total"}
      </p>

      <div className="space-y-10">
        {/* Destacados (solo sin filtros activos) */}
        {!hayFiltros && destacados.length > 0 && (
          <div className="space-y-5">
            {destacados.map((p) => (
              <ProductoDestacado key={p.id} producto={p} />
            ))}
          </div>
        )}

        {/* Grid */}
        {enGrid.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {enGrid.map((p) => (
              <TarjetaProducto key={p.id} producto={p} />
            ))}
          </div>
        )}

        {filtrados.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/10 py-20 text-center">
            <p className="text-sm text-zinc-500">Sin productos con esos filtros.</p>
            <button type="button" onClick={limpiar}
              className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 hover:bg-white/10">
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
