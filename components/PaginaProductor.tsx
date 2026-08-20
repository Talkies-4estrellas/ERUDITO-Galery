"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";
import { COLOR_COCINA, type ProductoCocina, type CategoriaCocina } from "@/data/cocina";

const ICONO: Record<CategoriaCocina, string> = {
  Vinos:      "🍷",
  Aceites:    "🫒",
  Especias:   "🌶️",
  Chocolates: "🍫",
  Conservas:  "🫙",
  Mieles:     "🍯",
};

export default function PaginaProductor({ nombre, origen, productos }: {
  nombre: string;
  origen: string;
  productos: ProductoCocina[];
}) {
  const categoria = productos[0]?.categoria;

  return (
    <div className="animate-page-in">

      {/* ── HÉROE ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-zinc-950 py-20 sm:py-28">
        {/* Fondo: gradiente radial sutil */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
          <div className="h-[400px] w-[400px] rounded-full bg-amber-400 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-8">
          {/* Botón volver */}
          <Link
            href="/cocina"
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-medium text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
          >
            ← Cocina y Alimento
          </Link>

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            {/* Avatar grande */}
            {categoria && (
              <div className={`flex size-20 shrink-0 items-center justify-center rounded-3xl text-4xl ring-2 ring-white/20 ${COLOR_COCINA[categoria].split(" ").find(c => c.startsWith("bg-")) ?? "bg-zinc-800"}`}>
                {ICONO[categoria]}
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                Productor · Artesano
              </p>
              <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">{nombre}</h1>
              <p className="mt-1.5 text-sm text-zinc-400">{origen}</p>
              <p className="mt-2 text-xs text-zinc-600">
                {productos.length} {productos.length === 1 ? "producto" : "productos"} en ERUDITO Galery
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── PRODUCTOS ───────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-8 sm:py-16">
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-amber-400">
          Productos de {nombre}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {productos.map((p) => (
            <TarjetaProducto key={p.id} producto={p} />
          ))}
        </div>
      </div>
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
        <p className="mt-0.5 text-[11px] text-zinc-500">{producto.origen}</p>
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
