import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

export const revalidate = 60;

export async function GET() {
  const db = getServerSupabase();
  if (!db) return NextResponse.json({ productos: [] });

  const { data, error } = await db
    .from("productos_cocina")
    .select("*")
    .eq("activo", true)
    .order("id", { ascending: true });

  if (error) return NextResponse.json({ productos: [] });
  return NextResponse.json({ productos: data ?? [] });
}
