import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { getServerSupabase } from "@/lib/supabase-server";

export const runtime = "nodejs";

// MP envía GET para validar el endpoint
export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) return NextResponse.json({ ok: false }, { status: 200 });

  const db = getServerSupabase();
  if (!db) return NextResponse.json({ ok: false }, { status: 200 });

  try {
    // Soporta tanto webhook nuevo (body JSON) como IPN antiguo (query params)
    const body   = await req.json().catch(() => ({}));
    const params = req.nextUrl.searchParams;

    const paymentId: string | undefined =
      body?.data?.id ??
      params.get("data.id") ??
      (body?.type === "payment" ? body?.data?.id : undefined);

    if (!paymentId) return NextResponse.json({ ok: true }, { status: 200 });

    // Re-consultar el pago en MP (nunca confiar en el cuerpo del webhook)
    const client  = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);
    const pago    = await payment.get({ id: String(paymentId) });

    if (!pago?.external_reference) return NextResponse.json({ ok: true }, { status: 200 });

    const ventaId = Number(pago.external_reference);
    const estado =
      pago.status === "approved"             ? "pagado"     :
      pago.status === "rejected"             ? "cancelado"  :
      pago.status === "cancelled"            ? "cancelado"  :
      /* pending / in_process / authorized */  "en_proceso";

    await db
      .from("ventas")
      .update({
        estado,
        mp_payment_id: String(paymentId),
      })
      .eq("id", ventaId)
      .neq("estado", "pagado"); // idempotente: no sobreescribir si ya está pagado

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook MP error:", err);
    // Siempre 200 para que MP no reintente en bucle
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
