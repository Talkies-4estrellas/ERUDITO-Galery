import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pago exitoso — ERUDITO Galery" };

export default function PagoExito() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-emerald-400/15">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-10 text-emerald-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">¡Pago exitoso!</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Tu compra ha sido procesada. Recibirás un correo con los detalles.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/obras" className="rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-amber-300 transition">
          Seguir explorando
        </Link>
        <Link href="/" className="rounded-full bg-white/5 px-6 py-2.5 text-sm text-zinc-400 ring-1 ring-white/10 hover:bg-white/10 transition">
          Inicio
        </Link>
      </div>
    </div>
  );
}
