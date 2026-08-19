import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { fichas } from "@/data/fichas";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const BUCKET = "obras";

/** Convierte ruta local "/obras/foo/bar.jpg" → nombre en storage "obras/[id]/bar.webp" */
function storageKey(obraId: number, localPath: string): string {
  const base = path.basename(localPath, path.extname(localPath));
  return `obras/${obraId}/${base}.webp`;
}

async function subirImagen(
  db: ReturnType<typeof import("@/lib/supabase-server").getServerSupabase>,
  localPath: string,
  key: string
): Promise<string | null> {
  const absPath = path.join(process.cwd(), "public", localPath);
  if (!fs.existsSync(absPath)) return null;

  const webpBuffer = await sharp(absPath).webp({ quality: 82 }).toBuffer();

  const { error } = await db!.storage
    .from(BUCKET)
    .upload(key, webpBuffer, { contentType: "image/webp", upsert: true });

  if (error) return null;

  const { data } = db!.storage.from(BUCKET).getPublicUrl(key);
  return data.publicUrl;
}

export async function POST() {
  const db = getServerSupabase();
  if (!db) return NextResponse.json({ error: "Config error" }, { status: 500 });

  const resultados: Array<{
    id: number;
    titulo: string;
    ok: boolean;
    imagenesSubidas?: number;
    error?: string;
  }> = [];

  for (const ficha of fichas) {
    try {
      // Recopilar todas las rutas únicas de esta obra
      const todasLasRutas = Array.from(
        new Set([ficha.imagen, ...ficha.perspectivas])
      );

      // Subir cada imagen y construir el mapa localPath → url
      const urlMap: Record<string, string> = {};
      let subidas = 0;

      for (const localPath of todasLasRutas) {
        const key = storageKey(ficha.id, localPath);
        const url = await subirImagen(db, localPath, key);
        if (url) {
          urlMap[localPath] = url;
          subidas++;
        }
      }

      const nuevaImagen      = urlMap[ficha.imagen] ?? ficha.imagen;
      const nuevasPerspectivas = ficha.perspectivas.map((p) => urlMap[p] ?? p);

      // Actualizar la fila en la tabla obras
      const { error: dbError } = await db
        .from("obras")
        .update({
          imagen_principal: nuevaImagen,
          perspectivas:     nuevasPerspectivas,
        })
        .eq("id_obra", ficha.id);

      if (dbError) {
        resultados.push({ id: ficha.id, titulo: ficha.titulo, ok: false, error: dbError.message });
      } else {
        resultados.push({ id: ficha.id, titulo: ficha.titulo, ok: true, imagenesSubidas: subidas });
      }
    } catch (err) {
      resultados.push({ id: ficha.id, titulo: ficha.titulo, ok: false, error: String(err) });
    }
  }

  const ok    = resultados.filter((r) => r.ok).length;
  const error = resultados.filter((r) => !r.ok).length;
  const totalImagenes = resultados.reduce((acc, r) => acc + (r.imagenesSubidas ?? 0), 0);

  return NextResponse.json({ obras: ok, errores: error, totalImagenes, resultados });
}
