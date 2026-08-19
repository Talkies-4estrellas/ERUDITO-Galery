import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { productosCocina } from "@/data/cocina";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const BUCKET = "obras";

export async function POST() {
  const db = getServerSupabase();
  if (!db) return NextResponse.json({ error: "Config error" }, { status: 500 });

  const resultados: Array<{ id: number; nombre: string; ok: boolean; url?: string; error?: string }> = [];

  for (const p of productosCocina) {
    const localPath = path.join(process.cwd(), "public", p.imagen);

    if (!fs.existsSync(localPath)) {
      resultados.push({ id: p.id, nombre: p.nombre, ok: false, error: `Imagen no encontrada: ${p.imagen}` });
      continue;
    }

    // Convertir a WebP con sharp (calidad 82, igual que el pipeline del navegador)
    let webpBuffer: Buffer;
    try {
      webpBuffer = await sharp(localPath).webp({ quality: 82 }).toBuffer();
    } catch (err) {
      resultados.push({ id: p.id, nombre: p.nombre, ok: false, error: `Error al convertir: ${err}` });
      continue;
    }

    // Nombre fijo — sin timestamp para que upsert sea idempotente
    const storageName = `cocina/${p.id}.webp`;

    const { error: uploadError } = await db.storage
      .from(BUCKET)
      .upload(storageName, webpBuffer, { contentType: "image/webp", upsert: true });

    if (uploadError) {
      resultados.push({ id: p.id, nombre: p.nombre, ok: false, error: uploadError.message });
      continue;
    }

    const { data: urlData } = db.storage.from(BUCKET).getPublicUrl(storageName);

    const { error: dbError } = await db.from("productos_cocina").upsert({
      id:          p.id,
      nombre:      p.nombre,
      productor:   p.productor,
      origen:      p.origen,
      descripcion: p.descripcion,
      imagen:      urlData.publicUrl,
      precio:      p.precio,
      unidad:      p.unidad,
      categoria:   p.categoria,
      destacado:   p.destacado ?? false,
    }, { onConflict: "id" });

    if (dbError) {
      resultados.push({ id: p.id, nombre: p.nombre, ok: false, error: dbError.message });
    } else {
      resultados.push({ id: p.id, nombre: p.nombre, ok: true, url: urlData.publicUrl });
    }
  }

  const ok    = resultados.filter((r) => r.ok).length;
  const error = resultados.filter((r) => !r.ok).length;
  return NextResponse.json({ ok, error, resultados });
}
