import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { evento_id, nombre, email, telefono } = body;

  if (!evento_id || !nombre || !email) {
    return NextResponse.json({ error: "Campos incompletos" }, { status: 400 });
  }

  const db = getServerSupabase();
  if (!db) return NextResponse.json({ error: "Config error" }, { status: 500 });

  const { error } = await db
    .from("registros_eventos")
    .insert({ evento_id, nombre, email, telefono: telefono || null });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
