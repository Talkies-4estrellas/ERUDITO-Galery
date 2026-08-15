import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pago no completado — ERUDITO Galery" };

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function PagoFallido({ searchParams }: Props) {
  const params = await searchParams;
  const extRef = params.external_reference;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-rose-400/15">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-10 text-rose-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </div>

      <div className="max-w-sm">
        <h1 className="text-2xl font-bold text-white">Pago no completado</h1>
        <p className="mt-2 text-sm text-zinc-400">
          El pago no pudo procesarse. Puedes intentarlo de nuevo o contactarnos.
        </p>
        {extRef && (
          <p className="mt-2 text-xs text-zinc-600">
            Referencia: <span className="font-mono">{extRef}</span>
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Link href="/obras" className="rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-amber-300 transition">
          Volver al catálogo
        </Link>
        <Link href="/contacto" className="rounded-full bg-white/5 px-6 py-2.5 text-sm text-zinc-400 ring-1 ring-white/10 hover:bg-white/10 transition">
          Contactar
        </Link>
      </div>
    </div>
  );
}
