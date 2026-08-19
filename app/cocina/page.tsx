import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PaginaCocina from "@/components/PaginaCocina";
import { getServerSupabase } from "@/lib/supabase-server";
import type { ProductoCocina } from "@/data/cocina";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Cocina y Alimento — ERUDITO Galery",
  description: "Productos gastronómicos de lujo seleccionados con el mismo criterio con el que elegimos una obra de arte.",
};

async function getProductos(): Promise<ProductoCocina[]> {
  const db = getServerSupabase();
  if (!db) return [];
  const { data } = await db
    .from("productos_cocina")
    .select("*")
    .eq("activo", true)
    .order("id", { ascending: true });
  return (data ?? []) as ProductoCocina[];
}

export default async function CocinaPage() {
  const productos = await getProductos();
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex-1">
        <PaginaCocina productos={productos} />
      </main>
    </div>
  );
}
