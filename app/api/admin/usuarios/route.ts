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

  // Perfiles de la plataforma (Supabase Auth)
  const [{ data: perfiles }, { data: { users: authUsers } = { users: [] } }] =
    await Promise.all([
      db.from("perfiles").select("id, rol, nombre, especialidad, pais, slug"),
      db.auth.admin.listUsers({ perPage: 1000 }),
    ]);

  const perfilMap = new Map(
    (perfiles ?? []).map((p) => [p.id as string, p])
  );

  const usuarios: UsuarioAdmin[] = authUsers.map((u) => {
    const p = perfilMap.get(u.id);
    return {
      id:          u.id,
      email:       u.email ?? "",
      rol:         (p?.rol as string) ?? "—",
      nombre:      (p?.nombre as string) ?? "",
      especialidad:(p?.especialidad as string) ?? "",
      pais:        (p?.pais as string) ?? "",
      slug:        (p?.slug as string | null) ?? null,
      created_at:  u.created_at,
    };
  });

  // Ordenar: admin primero, luego por created_at desc
  usuarios.sort((a, b) => {
    if (a.rol === "admin" && b.rol !== "admin") return -1;
    if (b.rol === "admin" && a.rol !== "admin") return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return NextResponse.json({ usuarios });
}
