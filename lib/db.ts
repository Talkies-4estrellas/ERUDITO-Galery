import { supabase } from "@/lib/supabase";
import type { Artista } from "@/data/artistas";
import type { FichaArte } from "@/data/fichas";
import type { Evento } from "@/data/eventos";

// ── Mappers DB → tipos TypeScript ─────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapArtista(row: any): Artista {
  return {
    id: row.id_artista,
    nombre: row.nombre,
    vida: row.vida ?? "",
    origen: row.origen ?? "",
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
    artista: mapArtista(row.artistas),       // join obras → artistas
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

// ── Artistas ───────────────────────────────────────────────────

export async function getArtistas(): Promise<Artista[]> {
  const { data, error } = await supabase
    .from("artistas")
    .select("*")
    .order("id_artista");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapArtista);
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

// ── Obras / Fichas ─────────────────────────────────────────────

export async function getFichas(): Promise<FichaArte[]> {
  const { data, error } = await supabase
    .from("obras")
    .select("*, artistas(*)")
    .order("id_obra");
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapFicha);
}

export async function getFicha(id: number): Promise<FichaArte | null> {
  const { data, error } = await supabase
    .from("obras")
    .select("*, artistas(*)")
    .eq("id_obra", id)
    .single();
  if (error || !data) return null;
  return mapFicha(data);
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
  return (data ?? []).map(mapFicha);
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
