import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

// GET — obras pendientes de aprobación
export async function GET() {
  const db = getServerSupabase();
  if (!db) return NextResponse.json({ obras: [] });

  const { data } = await db
    .from("obras")
    .select("id_obra, titulo, anio, imagen_principal, tecnica, movimiento, precio, tipo, estado, artista_email, empresa_email, nombre_artista")
    .eq("estado", "pendiente")
    .order("id_obra", { ascending: false });

  return NextResponse.json({ obras: data ?? [] });
}

// PATCH — aprobar o rechazar una obra
export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { id, estado } = body as { id: number; estado: "aprobada" | "rechazada" };

  if (!id || !["aprobada", "rechazada"].includes(estado)) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const db = getServerSupabase();
  if (!db) return NextResponse.json({ error: "Config error" }, { status: 500 });

  const { error } = await db
    .from("obras")
    .update({ estado })
    .eq("id_obra", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
