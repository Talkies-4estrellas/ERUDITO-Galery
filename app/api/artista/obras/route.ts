import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import type { TamanoObra, ColorObra, TipoObra } from "@/hooks/useObrasArtista";

function mapObra(row: any) {
  return {
    id: String(row.id_obra),
    titulo: row.titulo ?? "",
    anio: row.anio ?? "",
    descripcion: row.descripcion ?? "",
    imagen: row.imagen_principal ?? "",
    tecnica: row.tecnica ?? "",
    tamano: (row.tamano ?? "Mediano") as TamanoObra,
    color: (row.color ?? "Cálido") as ColorObra,
    movimiento: row.movimiento ?? "",
    precio: Number(row.precio ?? 0),
    tipo: (row.tipo ?? "Físico") as TipoObra,
    estado: (row.estado ?? "pendiente") as "pendiente" | "aprobada" | "rechazada",
  };
}

// GET ?email=X — devuelve obras del artista
// GET ?id_artista=N — devuelve obras de artista seeded (tabla artistas)
export async function GET(req: NextRequest) {
  const email     = req.nextUrl.searchParams.get("email") ?? "";
  const idArtista = req.nextUrl.searchParams.get("id_artista") ?? "";

  if (!email && !idArtista) return NextResponse.json({ obras: [] });

  const db = getServerSupabase();
  if (!db) return NextResponse.json({ obras: [] });

  const base = db
    .from("obras")
    .select("id_obra, titulo, anio, descripcion, imagen_principal, tecnica, tamano, color, movimiento, precio, tipo, estado")
    .order("id_obra", { ascending: false });

  const { data } = idArtista
    ? await base.eq("id_artista", Number(idArtista))
    : await base.eq("artista_email", email);

  return NextResponse.json({ obras: (data ?? []).map(mapObra) });
}

// POST — insertar nueva obra
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { email, titulo, anio, descripcion, imagen, tecnica, tamano, color, movimiento, precio, tipo } = body;

  if (!email || !titulo) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const db = getServerSupabase();
  if (!db) return NextResponse.json({ error: "Config error" }, { status: 500 });

  // Verificar que el email existe en usuarios y obtener su nombre
  const { data: usuario } = await db
    .from("usuarios")
    .select("email, nombre, avatar_url")
    .eq("email", email)
    .single();

  if (!usuario) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 403 });
  }

  const { data, error } = await db
    .from("obras")
    .insert({
      artista_email: email,
      nombre_artista: usuario.nombre || email.split("@")[0],
      avatar_artista: usuario.avatar_url || "",
      titulo,
      anio: anio || new Date().getFullYear().toString(),
      descripcion: descripcion || "",
      imagen_principal: imagen || "",
      tecnica: tecnica || "",
      tamano: tamano || "Mediano",
      color: color || "Cálido",
      movimiento: movimiento || "",
      precio: Number(precio) || 0,
      tipo: tipo || "Físico",
      estado: "pendiente",
      estrellas: 5,
      vistas: 0,
    })
    .select("id_obra, titulo, anio, descripcion, imagen_principal, tecnica, tamano, color, movimiento, precio, tipo, estado")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ obra: mapObra(data) });
}

// PUT — actualizar obra
export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { id, email, titulo, anio, descripcion, imagen, tecnica, tamano, color, movimiento, precio, tipo } = body;

  if (!id || !email) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const db = getServerSupabase();
  if (!db) return NextResponse.json({ error: "Config error" }, { status: 500 });

  const { error } = await db
    .from("obras")
    .update({ titulo, anio, descripcion, imagen_principal: imagen, tecnica, tamano, color, movimiento, precio: Number(precio) || 0, tipo })
    .eq("id_obra", Number(id))
    .eq("artista_email", email); // solo puede editar sus propias obras

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
    .eq("artista_email", email); // solo puede borrar sus propias obras

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
