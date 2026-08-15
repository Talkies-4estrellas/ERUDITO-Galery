import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pago pendiente — ERUDITO Galery" };

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function PagoPendiente({ searchParams }: Props) {
  const params = await searchParams;
  const extRef    = params.external_reference;
  const paymentId = params.payment_id ?? params.collection_id;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-amber-400/15">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-10 text-amber-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>

      <div className="max-w-sm">
        <h1 className="text-2xl font-bold text-white">Pago en proceso</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Tu pago está siendo verificado. Te notificaremos por correo cuando se confirme.
        </p>

        {(paymentId || extRef) && (
          <div className="mt-5 rounded-2xl bg-zinc-900 px-5 py-4 ring-1 ring-white/10 text-left space-y-2">
            {paymentId && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">ID de pago</span>
                <span className="font-mono text-zinc-300">{paymentId}</span>
              </div>
            )}
            {extRef && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Orden</span>
                <span className="font-mono text-zinc-300">{extRef}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <Link href="/" className="rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-amber-300 transition">
        Volver al inicio
      </Link>
    </div>
  );
}
