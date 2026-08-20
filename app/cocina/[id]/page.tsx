import { notFound } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase-server";
import type { ProductoCocina } from "@/data/cocina";
import PaginaProductoCocina from "@/components/PaginaProductoCocina";

export const revalidate = 60;

async function getProducto(id: number): Promise<ProductoCocina | null> {
  const db = getServerSupabase();
  if (!db) return null;
  const { data } = await db
    .from("productos_cocina")
    .select("*")
    .eq("id", id)
    .eq("activo", true)
    .single();
  return (data as ProductoCocina) ?? null;
}

async function getRelacionados(id: number, categoria: string): Promise<ProductoCocina[]> {
  const db = getServerSupabase();
  if (!db) return [];
  const { data } = await db
    .from("productos_cocina")
    .select("*")
    .eq("categoria", categoria)
    .eq("activo", true)
    .neq("id", id)
    .limit(3);
  return (data ?? []) as ProductoCocina[];
}

export default async function ProductoCocinaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idNum = parseInt(id);
  if (isNaN(idNum)) notFound();

  const producto = await getProducto(idNum);
  if (!producto) notFound();

  const relacionados = await getRelacionados(idNum, producto.categoria);

  return <PaginaProductoCocina producto={producto} relacionados={relacionados} />;
}
