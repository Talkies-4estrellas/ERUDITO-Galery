import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import type { TamanoObra, ColorObra, TipoObra } from "@/hooks/useObrasEmpresa";

function mapObra(row: any) {
  return {
    id: String(row.id_obra),
    nombreArtista: row.nombre_artista ?? "",
    titulo: row.titulo ?? "",
    anio: row.anio ?? "",
    descripcion: row.descripcion ?? "",
    imagen: row.imagen_principal ?? "",
    tecnica: row.tecnica ?? "",
    tamano: (row.tamano ?? "Mediano") as TamanoObra,
    color: (row.color ?? "Multicolor") as ColorObra,
    movimiento: row.movimiento ?? "",
    precio: Number(row.precio ?? 0),
    tipo: (row.tipo ?? "Físico") as TipoObra,
  };
}

// GET ?email=X — devuelve obras de la empresa
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email") ?? "";
  if (!email) return NextResponse.json({ obras: [] });

  const db = getServerSupabase();
  if (!db) return NextResponse.json({ obras: [] });

  const { data } = await db
    .from("obras")
    .select("id_obra, nombre_artista, titulo, anio, descripcion, imagen_principal, tecnica, tamano, color, movimiento, precio, tipo")
    .eq("empresa_email", email)
    .order("id_obra", { ascending: false });

  return NextResponse.json({ obras: (data ?? []).map(mapObra) });
}

// POST — insertar nueva obra
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { email, nombreArtista, titulo, anio, descripcion, imagen, tecnica, tamano, color, movimiento, precio, tipo } = body;

  if (!email || !titulo || !nombreArtista) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const db = getServerSupabase();
  if (!db) return NextResponse.json({ error: "Config error" }, { status: 500 });

  const { data: usuario } = await db
    .from("usuarios")
    .select("email")
    .eq("email", email)
    .eq("rol", "empresa")
    .single();

  if (!usuario) {
    return NextResponse.json({ error: "Empresa no encontrada" }, { status: 403 });
  }

  const { data, error } = await db
    .from("obras")
    .insert({
      empresa_email: email,
      nombre_artista: nombreArtista,
      titulo,
      anio: anio || new Date().getFullYear().toString(),
      descripcion: descripcion || "",
      imagen_principal: imagen || "",
      tecnica: tecnica || "",
      tamano: tamano || "Mediano",
      color: color || "Multicolor",
      movimiento: movimiento || "",
      precio: Number(precio) || 0,
      tipo: tipo || "Físico",
      estrellas: 5,
      vistas: 0,
    })
    .select("id_obra, nombre_artista, titulo, anio, descripcion, imagen_principal, tecnica, tamano, color, movimiento, precio, tipo")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ obra: mapObra(data) });
}

// PUT — actualizar obra
export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { id, email, nombreArtista, titulo, anio, descripcion, imagen, tecnica, tamano, color, movimiento, precio, tipo } = body;

  if (!id || !email) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const db = getServerSupabase();
  if (!db) return NextResponse.json({ error: "Config error" }, { status: 500 });

  const { error } = await db
    .from("obras")
    .update({ nombre_artista: nombreArtista, titulo, anio, descripcion, imagen_principal: imagen, tecnica, tamano, color, movimiento, precio: Number(precio) || 0, tipo })
    .eq("id_obra", Number(id))
    .eq("empresa_email", email);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE — eliminar obra
export async function DELETE(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { id, email } = body;

  if (!id || !email) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const db = getServerSupabase();
  if (!db) return NextResponse.json({ error: "Config error" }, { status: 500 });

  const { error } = await db
    .from("obras")
    .delete()
    .eq("id_obra", Number(id))
    .eq("empresa_email", email);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
