import { NextRequest, NextResponse } from "next/server";

const RESEND_URL = "https://api.resend.com/emails";
const FROM = "ERUDITO Galery <notificaciones@erudito-galeria.vercel.app>";

function htmlAprobado(nombre: string, rol: string) {
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#18181b;border-radius:16px;color:#fff">
      <h1 style="color:#fbbf24;font-size:22px;margin:0 0 12px">¡Solicitud aprobada!</h1>
      <p style="color:#a1a1aa;margin:0 0 20px">Hola <strong style="color:#fff">${nombre}</strong>,</p>
      <p style="color:#a1a1aa;margin:0 0 20px">
        Tu solicitud como <strong style="color:#fff">${rol}</strong> en <strong style="color:#fbbf24">ERUDITO Galery</strong>
        ha sido <strong style="color:#34d399">aprobada</strong>.
        Ya puedes iniciar sesión con tus credenciales.
      </p>
      <a href="https://erudito-galeria.vercel.app/login"
        style="display:inline-block;background:#fbbf24;color:#18181b;font-weight:700;padding:12px 28px;border-radius:999px;text-decoration:none;font-size:14px">
        Iniciar sesión
      </a>
      <p style="color:#52525b;font-size:12px;margin:24px 0 0">ERUDITO Galery — Arte con historia y valor</p>
    </div>`;
}

function htmlRechazado(nombre: string, rol: string) {
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#18181b;border-radius:16px;color:#fff">
      <h1 style="color:#f87171;font-size:22px;margin:0 0 12px">Solicitud no aprobada</h1>
      <p style="color:#a1a1aa;margin:0 0 20px">Hola <strong style="color:#fff">${nombre}</strong>,</p>
      <p style="color:#a1a1aa;margin:0 0 20px">
        Lamentamos informarte que tu solicitud como <strong style="color:#fff">${rol}</strong>
        en <strong style="color:#fbbf24">ERUDITO Galery</strong> no fue aprobada en esta ocasión.
        Si tienes dudas, contáctanos respondiendo este correo.
      </p>
      <p style="color:#52525b;font-size:12px;margin:24px 0 0">ERUDITO Galery — Arte con historia y valor</p>
    </div>`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY no configurada" }, { status: 500 });
  }

  const { email, nombre, rol, estado } = await req.json() as {
    email: string; nombre: string; rol: string; estado: "aprobado" | "rechazado";
  };

  if (!email || !nombre || !estado) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const asunto = estado === "aprobado"
    ? "¡Tu solicitud fue aprobada! — ERUDITO Galery"
    : "Actualización de tu solicitud — ERUDITO Galery";

  const html = estado === "aprobado"
    ? htmlAprobado(nombre, rol)
    : htmlRechazado(nombre, rol);

  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [email], subject: asunto, html }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Resend error:", body);
    return NextResponse.json({ error: "Error al enviar email" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
