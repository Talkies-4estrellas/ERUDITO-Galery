import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

export interface UsuarioAdmin {
  id: string;
  email: string;
  rol: string;
  nombre: string;
  especialidad: string;
  pais: string;
  slug: string | null;
  created_at: string;
}

export async function GET() {
  const db = getServerSupabase();
  if (!db) return NextResponse.json({ usuarios: [] });

  // Consulta ambas fuentes en paralelo
  const [
    { data: perfiles },
    { data: { users: authUsers } = { users: [] } },
    { data: usuariosLocal },
  ] = await Promise.all([
    db.from("perfiles").select("id, rol, nombre, especialidad, pais, slug"),
    db.auth.admin.listUsers({ perPage: 1000 }),
    db.from("usuarios").select("email, rol, nombre, especialidad, pais, slug, created_at"),
  ]);

  const map = new Map<string, UsuarioAdmin>();

  // 1. Usuarios de la tabla "usuarios" (localStorage auth)
  for (const u of usuariosLocal ?? []) {
    map.set(u.email as string, {
      id:           u.email as string,
      email:        u.email as string,
      rol:          (u.rol as string) ?? "—",
      nombre:       (u.nombre as string) ?? "",
      especialidad: (u.especialidad as string) ?? "",
      pais:         (u.pais as string) ?? "",
      slug:         (u.slug as string | null) ?? null,
      created_at:   (u.created_at as string) ?? new Date(0).toISOString(),
    });
  }

  // 2. Usuarios de Supabase Auth (con sus perfiles) — actualiza o añade
  const perfilMap = new Map((perfiles ?? []).map((p) => [p.id as string, p]));
  for (const u of authUsers) {
    const email = u.email ?? "";
    const p = perfilMap.get(u.id);
    // Si ya existe por la tabla usuarios, actualiza con datos de perfil
    const existing = map.get(email);
    map.set(email, {
      id:           u.id,
      email,
      rol:          (p?.rol as string) ?? existing?.rol ?? "—",
      nombre:       (p?.nombre as string) ?? existing?.nombre ?? "",
      especialidad: (p?.especialidad as string) ?? existing?.especialidad ?? "",
      pais:         (p?.pais as string) ?? existing?.pais ?? "",
      slug:         (p?.slug as string | null) ?? existing?.slug ?? null,
      created_at:   u.created_at ?? existing?.created_at ?? new Date(0).toISOString(),
    });
  }

  const usuarios = [...map.values()];

  // Ordenar: admin primero, luego por created_at desc
  usuarios.sort((a, b) => {
    if (a.rol === "admin" && b.rol !== "admin") return -1;
    if (b.rol === "admin" && a.rol !== "admin") return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return NextResponse.json({ usuarios });
}

export async function DELETE(req: Request) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "email requerido" }, { status: 400 });

  const db = getServerSupabase();
  if (!db) return NextResponse.json({ error: "sin db" }, { status: 500 });

  // Eliminar obras del usuario (como artista o empresa)
  await db.from("obras").delete().eq("artista_email", email);
  await db.from("obras").delete().eq("empresa_email", email);

  // Eliminar imágenes del storage (carpeta derivada del email)
  const carpeta = email.replace(/[^a-z0-9@._-]/gi, "_").toLowerCase();
  const { data: archivos } = await db.storage.from("perfiles").list(carpeta);
  if (archivos && archivos.length > 0) {
    const rutas = archivos.map((f) => `${carpeta}/${f.name}`);
    await db.storage.from("perfiles").remove(rutas);
  }

  // Eliminar de la tabla usuarios
  await db.from("usuarios").delete().eq("email", email);

  // Eliminar de Supabase Auth si existe
  const { data: { users: authUsers } } = await db.auth.admin.listUsers({ perPage: 1000 });
  const authUser = authUsers.find((u) => u.email === email);
  if (authUser) {
    await db.auth.admin.deleteUser(authUser.id);
  }

  return NextResponse.json({ ok: true });
}
