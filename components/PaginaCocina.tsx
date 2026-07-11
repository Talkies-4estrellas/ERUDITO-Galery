"use client";

import { useState } from "react";
import Image from "next/image";
import { useToast } from "@/components/ToastProvider";
import {
  productosCocina,
  CATEGORIAS_COCINA,
  COLOR_COCINA,
  type ProductoCocina,
  type CategoriaCocina,
} from "@/data/cocina";

function TarjetaProducto({ producto }: { producto: ProductoCocina }) {
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
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10 transition hover:ring-amber-400/20">
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {producto.destacado && (
          <div className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-zinc-900">
            Destacado
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] backdrop-blur-md"
          style={{
            WebkitMaskImage: "linear-gradient(to top, black 35%, transparent 90%)",
            maskImage: "linear-gradient(to top, black 35%, transparent 90%)",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-zinc-950/80 to-transparent" />

        {/* Precio superpuesto */}
        <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
          ${producto.precio.toLocaleString("es-MX")} MXN
        </div>
        <span className={`absolute bottom-3 left-3 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ring-1 ${color}`}>
          {producto.categoria}
        </span>
      </div>

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

export default function PaginaCocina() {
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaCocina | null>(null);

  const destacados = productosCocina.filter((p) => p.destacado);
  const filtrados = categoriaActiva
    ? productosCocina.filter((p) => p.categoria === categoriaActiva)
    : productosCocina;
  const enGrid = categoriaActiva ? filtrados : filtrados.filter((p) => !p.destacado);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
      {/* Encabezado */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
          Gastronomía
        </p>
        <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
          Cocina y Alimento
        </h1>
        <p className="mt-2 max-w-lg text-sm text-zinc-400">
          La comida hoy en día también es un lujo. Productos seleccionados con el mismo criterio
          con el que elegimos una obra de arte.
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoriaActiva(null)}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
            !categoriaActiva ? "bg-white text-zinc-900" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
          }`}
        >
          Todo
        </button>
        {CATEGORIAS_COCINA.map((cat) => {
          const color = COLOR_COCINA[cat];
          const activo = categoriaActiva === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoriaActiva(activo ? null : cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium ring-1 transition ${
                activo ? color : "bg-zinc-800 text-zinc-400 ring-white/10 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="space-y-10">
        {/* Destacados (solo sin filtro activo) */}
        {!categoriaActiva && destacados.length > 0 && (
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
            <p className="text-sm text-zinc-500">Sin productos en esta categoría.</p>
            <button type="button" onClick={() => setCategoriaActiva(null)}
              className="rounded-full bg-white/5 px-4 py-1.5 text-xs text-zinc-400 ring-1 ring-white/10 hover:bg-white/10">
              Ver todo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
