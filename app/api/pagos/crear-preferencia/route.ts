import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { getServerSupabase } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json({ error: "MP_ACCESS_TOKEN no configurado" }, { status: 500 });
  }

  const db = getServerSupabase();
  if (!db) {
    return NextResponse.json({ error: "DB no disponible" }, { status: 500 });
  }

  const { obra_id, titulo, precio, tipo, nombre, email, telefono, mensaje } =
    await req.json() as {
      obra_id: number; titulo: string; precio: number; tipo: string;
      nombre: string; email: string; telefono?: string; mensaje?: string;
    };

  if (!obra_id || !titulo || !precio || !nombre || !email) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  // 1. Crear registro de venta en Supabase
  const { data: venta, error: ventaErr } = await db
    .from("ventas")
    .insert({ obra_id, titulo, precio, tipo, comprador_nombre: nombre, comprador_email: email, comprador_telefono: telefono ?? null, mensaje: mensaje ?? null })
    .select("id")
    .single();

  if (ventaErr || !venta) {
    return NextResponse.json({ error: ventaErr?.message ?? "Error al crear venta" }, { status: 500 });
  }

  // 2. Crear preferencia en Mercado Pago
  const baseUrl = process.env.NEXT_PUBLIC_URL ?? "https://erudito-galeria.vercel.app";
  const client = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(client);

  try {
    const result = await preference.create({
      body: {
        items: [{ id: String(obra_id), title: titulo, quantity: 1, unit_price: precio, currency_id: "MXN" }],
        payer: { email, name: nombre },
        back_urls: {
          success: `${baseUrl}/pago/exito`,
          failure: `${baseUrl}/pago/fallido`,
          pending: `${baseUrl}/pago/pendiente`,
        },
        auto_return: "approved",
        notification_url: `${baseUrl}/api/pagos/webhook`,
        external_reference: String(venta.id),
        statement_descriptor: "ERUDITO GALERY",
      },
    });

    // 3. Guardar el preference_id en la venta
    await db.from("ventas").update({ mp_preference_id: result.id }).eq("id", venta.id);

    return NextResponse.json({ init_point: result.init_point, venta_id: venta.id });
  } catch (err) {
    console.error("MP error:", err);
    // Limpiar la venta si MP falla
    await db.from("ventas").delete().eq("id", venta.id);
    return NextResponse.json({ error: "Error al crear preferencia de pago" }, { status: 500 });
  }
}
