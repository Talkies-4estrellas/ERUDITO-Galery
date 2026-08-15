import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pago exitoso — ERUDITO Galery" };

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function PagoExito({ searchParams }: Props) {
  const params = await searchParams;
  const paymentId     = params.payment_id ?? params.collection_id;
  const paymentType   = params.payment_type;
  const extRef        = params.external_reference;

  const tipoLabel: Record<string, string> = {
    credit_card: "Tarjeta de crédito",
    debit_card:  "Tarjeta de débito",
    ticket:      "Efectivo (OXXO / 7-Eleven)",
    bank_transfer: "Transferencia bancaria",
    account_money: "Dinero en cuenta MP",
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-emerald-400/15">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-10 text-emerald-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>

      <div className="max-w-sm">
        <h1 className="text-2xl font-bold text-white">¡Pago exitoso!</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Tu compra ha sido procesada. Recibirás un correo con los detalles.
        </p>

        {/* Detalles del pago */}
        {(paymentId || paymentType || extRef) && (
          <div className="mt-5 rounded-2xl bg-zinc-900 px-5 py-4 ring-1 ring-white/10 text-left space-y-2">
            {paymentId && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">ID de pago</span>
                <span className="font-mono text-zinc-300">{paymentId}</span>
              </div>
            )}
            {paymentType && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Método</span>
                <span className="text-zinc-300">{tipoLabel[paymentType] ?? paymentType}</span>
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
