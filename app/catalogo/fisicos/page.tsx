import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PaginaCatalogoSeccion from "@/components/PaginaCatalogoSeccion";
import { getFichas } from "@/lib/db";

export const metadata: Metadata = {
  title: "Físicos — ERUDITO Galery",
  description: "Obras originales y coleccionables físicos de la galería.",
};

export default async function CatalogoFisicos() {
  const todas = await getFichas();
  const fichas = todas.filter((f) => f.tipo === "Físico");

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PaginaCatalogoSeccion
          fichas={fichas}
          titulo="Físicos"
          descripcion="Obras originales, esculturas y coleccionables físicos."
          otroHref="/catalogo/digitales"
          otroLabel="Ver Digitales"
          vacio="No hay obras físicas con esos filtros."
        />
      </main>
    </div>
  );
}
