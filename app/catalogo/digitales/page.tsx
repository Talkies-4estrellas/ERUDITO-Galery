import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PaginaCatalogoSeccion from "@/components/PaginaCatalogoSeccion";
import { getFichas } from "@/lib/db";

export const metadata: Metadata = {
  title: "Digitales — ERUDITO Galery",
  description: "JPG certificados e impresiones oficiales de la galería.",
};

export default async function CatalogoDigitales() {
  const todas = await getFichas();
  const fichas = todas.filter((f) => f.tipo === "JPG Certificado" || f.tipo === "Impresión Oficial");

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PaginaCatalogoSeccion
          fichas={fichas}
          titulo="Digitales"
          descripcion="JPG certificados e impresiones oficiales con respaldo de autoría."
          otroHref="/catalogo/fisicos"
          otroLabel="Ver Físicos"
          vacio="Próximamente — obras digitales disponibles pronto."
        />
      </main>
    </div>
  );
}
