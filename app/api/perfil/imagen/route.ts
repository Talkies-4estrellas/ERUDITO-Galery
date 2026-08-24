import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file  = form.get("file") as File | null;
  const tipo  = form.get("tipo") as string | null;   // "avatar" | "banner"
  const clave = form.get("clave") as string | null;  // email o slug (ruta única)

  if (!file || !tipo || !clave) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  // Carpeta basada en clave (email o slug) normalizada
  const carpeta = clave.replace(/[^a-z0-9@._-]/gi, "_").toLowerCase();
  const path = `${carpeta}/${tipo}.webp`;

  const { error } = await supabaseAdmin.storage
    .from("perfiles")
    .upload(path, buffer, { upsert: true, contentType: "image/webp" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from("perfiles").getPublicUrl(path);
  const url = `${data.publicUrl}?t=${Date.now()}`;

  return NextResponse.json({ url });
}
