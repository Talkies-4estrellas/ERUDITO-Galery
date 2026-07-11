"use client";

import { useState } from "react";
import type { FichaArte } from "@/data/fichas";
import BotonFavorito from "@/components/BotonFavorito";
import BotonComparar from "@/components/BotonComparar";

const TIPO_ICON: Record<FichaArte["tipo"], React.ReactNode> = {
  "Físico": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-4 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
    </svg>
  ),
  "JPG Certificado": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-4 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
    </svg>
  ),
  "Impresión Oficial": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-4 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
    </svg>
  ),
};

const ENTREGABLE: Record<FichaArte["tipo"], string[]> = {
  "Físico":            ["Obra original embalada", "Certificado de autenticidad", "Seguro de transporte incluido"],
  "JPG Certificado":   ["Archivo JPG en alta resolución", "Certificado de autenticidad digital", "Ficha técnica completa"],
  "Impresión Oficial": ["Impresión de alta calidad", "Certificado de edición limitada", "Ficha técnica completa"],
};

type Fase = "idle" | "form" | "resumen" | "enviado";

function generarNumOrden() {
  return "ER-" + Math.floor(10000 + Math.random() * 90000);
}

export default function PanelCompra({ ficha }: { ficha: FichaArte }) {
  const [fase, setFase] = useState<Fase>("idle");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [numOrden, setNumOrden] = useState("");

  function irAResumen(e: React.FormEvent) {
    e.preventDefault();
    setFase("resumen");
  }

  function confirmar() {
    const orden = generarNumOrden();
    setNumOrden(orden);
    const pedidos = JSON.parse(localStorage.getItem("erudito-pedidos") || "[]");
    pedidos.push({
      id: orden,
      obraId: ficha.id,
      titulo: ficha.titulo,
      precio: ficha.precio,
      tipo: ficha.tipo,
      nombre, email, telefono, mensaje,
      fecha: new Date().toISOString(),
    });
    localStorage.setItem("erudito-pedidos", JSON.stringify(pedidos));
    setFase("enviado");
  }

  const INPUT = "w-full rounded-xl bg-zinc-800 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50";

  return (
    <div className="rounded-2xl bg-zinc-900/80 p-6 ring-1 ring-white/10">

      {/* Precio */}
      <p className="text-center font-serif text-4xl font-bold text-white">
        ${ficha.precio.toLocaleString("es-MX")}
        <span className="ml-1 text-base font-normal text-zinc-500">MXN</span>
      </p>

      {/* Tipo */}
      <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-zinc-300">
        {TIPO_ICON[ficha.tipo]}
        <span className="text-sm">{ficha.tipo}</span>
      </div>

      {/* ── Fases ─────────────────────────────────────────────── */}
      <div className="mt-4">

        {/* IDLE */}
        {fase === "idle" && (
          <button type="button" onClick={() => setFase("form")}
            className="w-full rounded-full bg-amber-400 py-3.5 text-sm font-bold text-zinc-900 transition hover:bg-amber-300 active:scale-95">
            Consultar / Comprar
          </button>
        )}

        {/* FORM */}
        {fase === "form" && (
          <form onSubmit={irAResumen} className="space-y-3">
            <p className="text-xs font-semibold text-zinc-400">Tus datos de contacto</p>
            <input required value={nombre} onChange={e => setNombre(e.target.value)}
              placeholder="Nombre completo" className={INPUT} />
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Correo electrónico" className={INPUT} />
            <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)}
              placeholder="Teléfono (opcional)" className={INPUT} />
            <textarea rows={2} value={mensaje} onChange={e => setMensaje(e.target.value)}
              placeholder="Mensaje o preguntas (opcional)" className={`${INPUT} resize-none`} />
            <div className="flex gap-2">
              <button type="submit"
                className="flex-1 rounded-full bg-amber-400 py-2.5 text-sm font-bold text-zinc-900 hover:bg-amber-300">
                Revisar pedido →
              </button>
              <button type="button" onClick={() => setFase("idle")}
                className="rounded-full bg-white/5 px-4 text-sm text-zinc-400 ring-1 ring-white/10 hover:bg-white/10">
                ✕
              </button>
            </div>
          </form>
        )}

        {/* RESUMEN */}
        {fase === "resumen" && (
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Resumen del pedido</p>

            {/* Obra */}
            <div className="rounded-xl bg-zinc-800/60 p-4 ring-1 ring-white/10">
              <p className="text-xs text-zinc-500">Obra</p>
              <p className="mt-0.5 text-sm font-bold text-white">{ficha.titulo}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                  {TIPO_ICON[ficha.tipo]} {ficha.tipo}
                </span>
                <span className="font-serif text-base font-bold text-amber-400">
                  ${ficha.precio.toLocaleString("es-MX")} MXN
                </span>
              </div>
            </div>

            {/* Comprador */}
            <div className="rounded-xl bg-zinc-800/60 p-4 ring-1 ring-white/10 space-y-1">
              <p className="text-xs text-zinc-500">Contacto</p>
              <p className="text-sm text-white">{nombre}</p>
              <p className="text-xs text-zinc-400">{email}</p>
              {telefono && <p className="text-xs text-zinc-400">{telefono}</p>}
              {mensaje && <p className="mt-1 text-xs italic text-zinc-500">"{mensaje}"</p>}
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={confirmar}
                className="flex-1 rounded-full bg-amber-400 py-3 text-sm font-bold text-zinc-900 hover:bg-amber-300 active:scale-95">
                Confirmar consulta
              </button>
              <button type="button" onClick={() => setFase("form")}
                className="rounded-full bg-white/5 px-4 text-xs text-zinc-400 ring-1 ring-white/10 hover:bg-white/10">
                Editar
              </button>
            </div>
          </div>
        )}

        {/* ENVIADO */}
        {fase === "enviado" && (
          <div className="rounded-2xl bg-emerald-400/8 p-5 ring-1 ring-emerald-400/20 text-center space-y-2">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-400/15">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-6 text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <p className="text-sm font-bold text-emerald-400">Consulta enviada</p>
            <p className="text-xs text-zinc-400">Nos pondremos en contacto contigo en menos de 24 h.</p>
            <p className="rounded-lg bg-zinc-800/60 px-3 py-1.5 text-[11px] font-mono text-zinc-300">
              Ref. {numOrden}
            </p>
          </div>
        )}
      </div>

      {/* Favorito + Comparar */}
      <div className="mt-3 flex gap-2">
        <div className="flex flex-1 items-center justify-center rounded-full bg-white/5 py-2.5 ring-1 ring-white/10">
          <BotonFavorito id={ficha.id} tamano="sm" />
          <span className="ml-1.5 text-xs text-zinc-400">Favorito</span>
        </div>
        <div className="flex flex-1 items-center justify-center rounded-full bg-white/5 py-2.5 ring-1 ring-white/10">
          <BotonComparar id={ficha.id} />
        </div>
      </div>

      {/* Entregables */}
      <div className="mt-4 rounded-xl bg-white/5 px-4 py-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Incluye</p>
        <ul className="space-y-1.5">
          {ENTREGABLE[ficha.tipo].map((item) => (
            <li key={item} className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="size-1.5 shrink-0 rounded-full bg-amber-400/60" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Métodos de pago */}
      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="mb-2.5 text-center text-[11px] uppercase tracking-widest text-zinc-600">Pago seguro</p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-bold text-zinc-500">
          <span className="italic">PayPal</span>
          <span className="tracking-tight">stripe</span>
          <span className="italic">VISA</span>
          <span className="flex items-center" aria-label="Mastercard">
            <span className="size-4 rounded-full bg-zinc-600" />
            <span className="-ml-2 size-4 rounded-full bg-zinc-500" />
          </span>
        </div>
      </div>
    </div>
  );
}
