import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ obras: [], artistas: [] });
  }

  const pattern = `%${q}%`;

  const [obrasRes, artistasRes] = await Promise.all([
    supabase
      .from("obras")
      .select("id_obra, titulo, anio, tecnica, imagen_principal, artistas(nombre)")
      .or(`titulo.ilike.${pattern},descripcion.ilike.${pattern},tecnica.ilike.${pattern},movimiento.ilike.${pattern}`)
      .limit(5),
    supabase
      .from("artistas")
      .select("id_artista, nombre, vida, origen, foto_perfil")
      .or(`nombre.ilike.${pattern},origen.ilike.${pattern},biografia.ilike.${pattern}`)
      .limit(3),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obras = (obrasRes.data ?? []).map((r: any) => ({
    id: r.id_obra,
    titulo: r.titulo,
    anio: r.anio ?? "",
    tecnica: r.tecnica ?? "",
    imagen: r.imagen_principal ?? "",
    artista: r.artistas?.nombre ?? "",
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const artistas = (artistasRes.data ?? []).map((r: any) => ({
    id: r.id_artista,
    nombre: r.nombre,
    vida: r.vida ?? "",
    origen: r.origen ?? "",
    foto: r.foto_perfil ?? `https://picsum.photos/seed/artista-${r.id_artista}/80/80`,
  }));

  return NextResponse.json(
    { obras, artistas },
    { headers: { "Cache-Control": "public, max-age=15, stale-while-revalidate=60" } }
  );
}
