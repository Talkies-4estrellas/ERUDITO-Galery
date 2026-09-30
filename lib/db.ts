import { supabase } from "@/lib/supabase";
import type { Artista } from "@/data/artistas";
import type { FichaArte } from "@/data/fichas";
import type { Evento } from "@/data/eventos";
import type { Obra } from "@/data/obras";

// ── Mappers DB → tipos TypeScript ─────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapArtista(row: any): Artista {
  return {
    id: row.id_artista,
    nombre: row.nombre,
    vida: row.vida ?? "",
    origen: row.origen ?? "",
    pais: row.pais ?? undefined,
    foto:
      row.foto_perfil ??
      `https://picsum.photos/seed/artista-${row.id_artista}/400/400`,
    bio: row.biografia ?? "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFicha(row: any): FichaArte {
  return {
    id: row.id_obra,
    titulo: row.titulo,
    anio: row.anio ?? "",
    descripcion: row.descripcion ?? "",
    estrellas: row.estrellas ?? 5,
    imagen: row.imagen_principal ?? "",
    artista: row.artistas
      ? { ...mapArtista(row.artistas), foto: row.avatar_artista || mapArtista(row.artistas).foto }
      : { id: emailToId(row.artista_email ?? ""), nombre: row.nombre_artista || row.artista_email?.split("@")[0] || "Artista", vida: "", origen: "", foto: row.avatar_artista || `https://picsum.photos/seed/${row.artista_email ?? row.id_obra}/400/400`, bio: "" },
    perspectivas: (row.perspectivas as string[]) ?? [],
    tamano: row.tamano,
    color: row.color,
    movimiento: row.movimiento ?? "",
    tecnica: row.tecnica ?? "",
    precio: Number(row.precio),
    tipo: row.tipo,
    graficaValor: row.grafica_valor ?? [],
    graficaInteres: row.grafica_interes ?? [],
    certificaciones: (row.certificaciones as string[]) ?? [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEvento(row: any): Evento {
  return {
    id: row.id_evento,
    tipo: row.tipo,
    modalidad: row.modalidad,
    titulo: row.titulo,
    fecha: row.fecha,
    fechaCorta: row.fecha_corta ?? { dia: "", mes: "" },
    lugar: row.lugar ?? "",
    imagen: row.imagen ?? "",
    descripcion: row.descripcion ?? "",
    href: row.href ?? `/eventos/${row.id_evento}`,
    fichasIds: (row.fichas_ids as number[]) ?? [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapObra(row: any): Obra {
  return {
    id: row.id_obra,
    titulo: row.titulo,
    autor: row.artistas?.nombre ?? row.nombre_artista ?? "",
    anio: row.anio ?? "",
    descripcion: row.descripcion ?? "",
    estrellas: row.estrellas ?? 5,
    imagen: row.imagen_principal ?? "",
  };
}

// ── Artistas ───────────────────────────────────────────────────

// Hash estable del email → ID negativo único (mismo valor en artista y en sus obras)
function emailToId(email: string): number {
  let h = 5381;
  for (let i = 0; i < email.length; i++) h = ((h << 5) + h + email.charCodeAt(i)) | 0;
  return h >= 0 ? -(h + 1) : h;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUsuarioArtista(row: any): Artista {
  return {
    id: emailToId(row.email),
    nombre: row.nombre,
    vida: "",
    origen: row.especialidad ?? "",
    pais: row.pais || undefined,
    foto: row.avatar_url || row.banner_url || `https://picsum.photos/seed/${row.slug}/400/400`,
    bio: row.bio ?? "",
    slug: row.slug,
  };
}

export async function getArtistas(): Promise<Artista[]> {
  const [
    { data: dataArtistas, error: errArtistas },
    { data: dataUsuarios, error: errUsuarios },
    { data: dataObrasEmails },
  ] = await Promise.all([
    supabase.from("artistas").select("*").order("id_artista"),
    supabase.from("usuarios").select("nombre,bio,especialidad,pais,slug,avatar_url,banner_url,email").eq("rol", "artista").order("nombre"),
    supabase.from("obras").select("artista_email").eq("estado", "aprobada").not("artista_email", "is", null),
  ]);
  if (errArtistas) throw new Error(errArtistas.message);
  if (errUsuarios) throw new Error(errUsuarios.message);
  const emailsConObras = new Set((dataObrasEmails ?? []).map((r) => r.artista_email));
  const artistasTabla = (dataArtistas ?? []).map(mapArtista);
  const artistasPlataforma = (dataUsuarios ?? [])
    .filter((row) => emailsConObras.has(row.email))
    .map(mapUsuarioArtista);
  return [...artistasTabla, ...artistasPlataforma];
}

export async function getArtista(id: number): Promise<Artista | null> {
  const { data, error } = await supabase
    .from("artistas")
    .select("*")
    .eq("id_artista", id)
    .single();
  if (error || !data) return null;
  return mapArtista(data);
}

// ── Slugs de artistas de plataforma (obras por email) ──────────

async function slugsPorEmail(rows: unknown[]): Promise<Map<string, string>> {
  const emails = (rows as { artistas: unknown; artista_email?: string }[])
    .filter((r) => !r.artistas && r.artista_email)
    .map((r) => r.artista_email as string);
  if (emails.length === 0) return new Map();
  const { data } = await supabase
    .from("usuarios")
    .select("email, slug")
    .in("email", emails)
    .eq("rol", "artista");
  return new Map((data ?? []).map((u) => [u.email as string, u.slug as string]));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFichaConSlug(row: any, slugMap: Map<string, string>): FichaArte {
  const ficha = mapFicha(row);
  if (!row.artistas && row.artista_email) {
    const slug = slugMap.get(row.artista_email);
    if (slug) ficha.artista = { ...ficha.artista, slug };
  }
  return ficha;
}

// ── Obras / Fichas ─────────────────────────────────────────────

export async function getFichasNuevas(limite = 8): Promise<FichaArte[]> {
  const { data, error } = await supabase
    .from("obras")
    .select("*, artistas(*)")
    .eq("estado", "aprobada")
    .or("id_artista.not.is.null,artista_email.not.is.null")
    .order("id_obra", { ascending: false })
    .limit(limite);
  if (error) throw new Error(error.message);
  const slugMap = await slugsPorEmail(data ?? []);
  return (data ?? []).map((r) => mapFichaConSlug(r, slugMap));
}

export async function getFichas(): Promise<FichaArte[]> {
  const { data, error } = await supabase
    .from("obras")
    .select("*, artistas(*)")
    .eq("estado", "aprobada")
    .or("id_artista.not.is.null,artista_email.not.is.null")
    .order("id_obra");
  if (error) throw new Error(error.message);
  const slugMap = await slugsPorEmail(data ?? []);
  return (data ?? []).map((r) => mapFichaConSlug(r, slugMap));
}

export async function getFicha(id: number): Promise<FichaArte | null> {
  const { data, error } = await supabase
    .from("obras")
    .select("*, artistas(*)")
    .eq("id_obra", id)
    .single();
  if (error) { console.error("[getFicha] supabase error:", error); return null; }
  if (!data) { console.error("[getFicha] no data for id:", id); return null; }
  try {
    const slugMap = await slugsPorEmail([data]);
    return mapFichaConSlug(data, slugMap);
  } catch (e) {
    console.error("[getFicha] mapFicha threw:", e);
    return null;
  }
}

export async function getFichasPorArtista(
  artistaId: number
): Promise<FichaArte[]> {
  const { data, error } = await supabase
    .from("obras")
    .select("*, artistas(*)")
    .eq("id_artista", artistaId)
    .order("id_obra");
  if (error) throw new Error(error.message);
  const slugMap = await slugsPorEmail(data ?? []);
  return (data ?? []).map((r) => mapFichaConSlug(r, slugMap));
}

// ── Carousel ───────────────────────────────────────────────────

export async function getCarousel(): Promise<Obra[]> {
  const { data, error } = await supabase
    .from("obras")
    .select("id_obra, titulo, anio, descripcion, estrellas, imagen_principal, nombre_artista, artistas(nombre)")
    .eq("estado", "aprobada")
    .or("id_artista.not.is.null,artista_email.not.is.null")
    .order("vistas", { ascending: false })
    .limit(4);
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapObra);
}

export async function incrementarVistas(id: number): Promise<void> {
  await supabase.rpc("incrementar_vistas", { obra_id: id });
}

// ── Eventos ────────────────────────────────────────────────────

export async function getEventos(): Promise<Evento[]> {
  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .order("fecha");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapEvento);
}

export async function getEvento(id: number): Promise<Evento | null> {
  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .eq("id_evento", id)
    .single();
  if (error || !data) return null;
  return mapEvento(data);
}
