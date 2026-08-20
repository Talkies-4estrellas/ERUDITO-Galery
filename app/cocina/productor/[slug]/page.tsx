import { notFound } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase-server";
import type { ProductoCocina } from "@/data/cocina";
import PaginaProductor from "@/components/PaginaProductor";

export const revalidate = 60;

export default async function ProductorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const nombre = decodeURIComponent(slug);

  const db = getServerSupabase();
  if (!db) notFound();

  const { data } = await db
    .from("productos_cocina")
    .select("*")
    .eq("productor", nombre)
    .eq("activo", true)
    .order("id", { ascending: true });

  const productos = (data ?? []) as ProductoCocina[];
  if (productos.length === 0) notFound();

  const origen = productos[0].origen;

  return <PaginaProductor nombre={nombre} origen={origen} productos={productos} />;
}
