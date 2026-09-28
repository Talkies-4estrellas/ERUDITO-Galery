import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

const BUCKET = "obras";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "El archivo debe ser una imagen" }, { status: 422 });
  }

  const db = getServerSupabase();
  if (!db) return NextResponse.json({ error: "Config error" }, { status: 500 });

  const carpeta = req.nextUrl.searchParams.get("carpeta") ?? "";
  const nombre = carpeta
    ? `${carpeta}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.webp`
    : `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.webp`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await db.storage
    .from(BUCKET)
    .upload(nombre, buffer, {
      contentType: "image/webp",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = db.storage.from(BUCKET).getPublicUrl(nombre);
  return NextResponse.json({ url: data.publicUrl });
}
