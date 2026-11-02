import type { Metadata } from "next";
import PaginaBienvenida, { type DatosBienvenida } from "@/components/bienvenida/PaginaBienvenida";
import { getArtistas, getCarousel, getEventos, getFichas, getGalerias } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Bienvenido — ERUDITO Galery",
  description:
    "Conoce ERUDITO Galery: obras de maestros mexicanos y nuevas voces con su historia, su certificado y su valor de mercado a la vista; artistas, agenda, servicios y Cocina y Alimento.",
};

/** Presentación para quien llega por primera vez (ver proxy.ts). */
export default async function Bienvenida() {
  const [fichas, artistas, galerias, eventos, masVistas, cocinaRes] = await Promise.all([
    getFichas(),
    getArtistas(),
    getGalerias(),
    getEventos(),
    getCarousel(),
    supabase
      .from("productos_cocina")
      .select("id,nombre,productor,origen,imagen,precio,unidad,destacado", { count: "exact" })
      .eq("activo", true)
      .order("destacado", { ascending: false })
      .order("id", { ascending: false }),
  ]);

  const ficha = fichas.find((f) => f.id === masVistas[0]?.id) ?? fichas[0];
  const { count: resenas } = ficha
    ? await supabase.from("resenas").select("id", { count: "exact", head: true }).eq("obra_id", ficha.id)
    : { count: 0 };

  const hoy = new Date().toISOString().slice(0, 10);
  const proximos = eventos.filter((e) => e.fecha.slice(0, 10) >= hoy);

  // Primero los productores mexicanos (ids 18+), los que tienen foto propia de su producto
  const cocina = (cocinaRes.data ?? []).filter((p) => p.id >= 18).slice(0, 3);

  const datos: DatosBienvenida = {
    obras: fichas.filter((f) => f.imagen).slice(0, 24).map((f) => ({ id: f.id, titulo: f.titulo, imagen: f.imagen })),
    cifras: { obras: fichas.length, artistas: artistas.length, galerias: galerias.length, cocina: cocinaRes.count ?? 0 },
    destacada: ficha ? { ficha, resenas: resenas ?? 0 } : null,
    artistas: artistas.map((a) => ({ nombre: a.nombre, foto: a.foto, origen: a.origen, href: a.slug ? `/artistas/${a.slug}` : `/artista/${a.id}` })),
    eventos: (proximos.length ? proximos : eventos).slice(0, 2),
    cocina: cocina.map((p) => ({ ...p, precio: Number(p.precio) })),
  };

  return <PaginaBienvenida datos={datos} />;
}
