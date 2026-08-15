import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { nombre, email, asunto, mensaje } = body;

  if (!nombre || !email || !asunto || !mensaje) {
    return NextResponse.json({ error: "Campos incompletos" }, { status: 400 });
  }

  const db = getServerSupabase();
  if (!db) return NextResponse.json({ error: "Config error" }, { status: 500 });

  const { error } = await db
    .from("contactos")
    .insert({ nombre, email, asunto, mensaje });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notificar al admin por Resend (fallo silencioso)
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ERUDITO Galery <notificaciones@erudito-galeria.vercel.app>",
        to: ["firestarshyni@gmail.com"],
        subject: `Nuevo contacto: ${asunto}`,
        html: `<p><strong>De:</strong> ${nombre} &lt;${email}&gt;</p>
               <p><strong>Asunto:</strong> ${asunto}</p>
               <p><strong>Mensaje:</strong></p>
               <p style="white-space:pre-wrap">${mensaje}</p>`,
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
