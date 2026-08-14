import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const obraId = req.nextUrl.searchParams.get("obra_id");
  if (!obraId) {
    return NextResponse.json({ error: "obra_id requerido" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("resenas")
    .select("id, nombre, estrellas, comentario, created_at")
    .eq("obra_id", Number(obraId))
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    { resenas: data ?? [] },
    { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=60" } }
  );
}

export async function POST(req: NextRequest) {
  const { obra_id, nombre, estrellas, comentario, email } = await req.json() as {
    obra_id: number; nombre: string; estrellas: number;
    comentario: string; email?: string;
  };

  if (!obra_id || !nombre?.trim() || !comentario?.trim() || !estrellas) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }
  if (estrellas < 1 || estrellas > 5) {
    return NextResponse.json({ error: "Estrellas debe ser 1-5" }, { status: 400 });
  }
  if (comentario.trim().length < 10) {
    return NextResponse.json({ error: "Comentario demasiado corto (mínimo 10 caracteres)" }, { status: 400 });
  }

  // Anti-duplicado por email (si se proporciona)
  if (email) {
    const { data: existe } = await supabase
      .from("resenas")
      .select("id")
      .eq("obra_id", obra_id)
      .eq("email", email)
      .maybeSingle();
    if (existe) {
      return NextResponse.json({ error: "Ya dejaste una reseña para esta obra" }, { status: 409 });
    }
  }

  const { data, error } = await supabase
    .from("resenas")
    .insert({ obra_id, nombre: nombre.trim(), estrellas, comentario: comentario.trim(), email: email ?? null })
    .select("id, nombre, estrellas, comentario, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ resena: data }, { status: 201 });
}
