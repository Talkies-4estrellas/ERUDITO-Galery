"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";
import CapsulaProductor from "@/components/CapsulaProductor";
import { COLOR_COCINA, type ProductoCocina } from "@/data/cocina";

export default function PaginaProductoCocina({ producto, relacionados }: {
  producto: ProductoCocina;
  relacionados: ProductoCocina[];
}) {
  const { toast } = useToast();
  const color = COLOR_COCINA[producto.categoria];

  function agregar() {
    const carrito = JSON.parse(localStorage.getItem("erudito-carrito-cocina") || "[]");
    const idx = carrito.findIndex((i: { id: number }) => i.id === producto.id);
    if (idx >= 0) carrito[idx].cantidad += 1;
    else carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
    localStorage.setItem("erudito-carrito-cocina", JSON.stringify(carrito));
    toast(`${producto.nombre} añadido al pedido`, { icono: "🛒" });
  }

  return (
    <div className="animate-page-in">

      {/* ── HÉROE ───────────────────────────────────────────── */}
      <div className="relative h-[55vh] min-h-[320px] w-full overflow-hidden">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Gradiente bottom-up para el texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

        {/* Botón volver */}
        <Link
          href="/cocina"
          className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition hover:bg-black/60 sm:left-8 sm:top-6"
        >
          ← Cocina y Alimento
        </Link>
      </div>

      {/* ── CONTENIDO PRINCIPAL ─────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-8">

        {/* Nombre + info rápida */}
        <div className="-mt-16 relative z-10 mb-8">
          <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ring-1 ${color}`}>
            {producto.categoria}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            {producto.nombre}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-400">
            {producto.productor}
            <span className="mx-2 text-zinc-700">·</span>
            {producto.origen}
          </p>
        </div>

        {/* Grid de detalle */}
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">

          {/* Columna izquierda: descripción */}
          <div className="space-y-8">
            <section>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-400">
                Sobre el producto
              </h2>
              <p className="text-sm leading-relaxed text-zinc-300">
                {producto.descripcion}
              </p>
            </section>

            {/* Cápsula del productor */}
            <CapsulaProductor
              nombre={producto.productor}
              origen={producto.origen}
              categoria={producto.categoria}
            />

            <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Dato label="Categoría" valor={producto.categoria} />
              <Dato label="Origen" valor={producto.origen} />
              <Dato label="Presentación" valor={producto.unidad} />
              <Dato label="Productor" valor={producto.productor} />
              {producto.destacado && (
                <Dato label="Selección" valor="Especial ERUDITO" highlight />
              )}
            </section>
          </div>

          {/* Columna derecha: compra */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-3xl bg-zinc-900 p-6 ring-1 ring-white/10">
              <p className="mb-1 text-xs text-zinc-500">Precio</p>
              <p className="font-serif text-3xl font-bold text-white">
                ${producto.precio.toLocaleString("es-MX")}
                <span className="ml-1.5 text-base font-normal text-zinc-500">MXN</span>
              </p>
              <p className="mt-1 text-xs text-zinc-600">{producto.unidad}</p>

              <button
                type="button"
                onClick={agregar}
                className="mt-6 w-full rounded-full bg-amber-400 py-3 text-sm font-bold text-zinc-900 transition hover:bg-amber-300 active:scale-95"
              >
                Añadir al pedido →
              </button>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
                <FilaDato label="Categoría" valor={producto.categoria} />
                <FilaDato label="Productor" valor={producto.productor} />
                <FilaDato label="Origen" valor={producto.origen} />
                <FilaDato label="Presentación" valor={producto.unidad} />
                {producto.destacado && (
                  <FilaDato label="Selección" valor="Especial ERUDITO" amber />
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* ── RELACIONADOS ───────────────────────────────────── */}
        {relacionados.length > 0 && (
          <section className="mt-16 border-t border-white/10 pt-12 pb-20">
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-amber-400">
              Más en {producto.categoria}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relacionados.map((p) => (
                <TarjetaRelacionada key={p.id} producto={p} onAgregar={agregar} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ── Subcomponentes ─────────────────────────────────────────── */

function Dato({ label, valor, highlight }: { label: string; valor: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl bg-zinc-900 p-4 ring-1 ring-white/10">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{label}</p>
      <p className={`mt-1 text-sm font-medium ${highlight ? "text-amber-400" : "text-white"}`}>{valor}</p>
    </div>
  );
}

function FilaDato({ label, valor, amber }: { label: string; valor: string; amber?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`text-right text-xs font-medium ${amber ? "text-amber-400" : "text-zinc-300"}`}>{valor}</p>
    </div>
  );
}

function TarjetaRelacionada({ producto, onAgregar }: { producto: ProductoCocina; onAgregar: () => void }) {
  const [hov, setHov] = useState(false);
  const color = COLOR_COCINA[producto.categoria];
  return (
    <article
      className="flex overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10 transition hover:ring-amber-400/20"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <Link href={`/cocina/${producto.id}`} className="relative w-28 shrink-0 overflow-hidden">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          sizes="112px"
          className={`object-cover transition-transform duration-500 ${hov ? "scale-105" : ""}`}
        />
      </Link>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ring-1 ${color}`}>
            {producto.categoria}
          </span>
          <Link href={`/cocina/${producto.id}`}>
            <h3 className="mt-1.5 text-xs font-bold text-white leading-snug hover:text-amber-400 transition">
              {producto.nombre}
            </h3>
          </Link>
          <p className="mt-0.5 text-[10px] text-zinc-500">{producto.productor}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs font-semibold text-amber-400">${producto.precio.toLocaleString("es-MX")}</p>
          <button
            type="button"
            onClick={onAgregar}
            className="rounded-full bg-zinc-800 px-3 py-1 text-[10px] font-bold text-zinc-300 transition hover:bg-amber-400 hover:text-zinc-900"
          >
            Añadir
          </button>
        </div>
      </div>
    </article>
  );
}
