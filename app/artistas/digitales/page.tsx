import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PaginaArtistas from "@/components/PaginaArtistas";
import { getArtistas, getFichas } from "@/lib/db";

export const metadata: Metadata = {
  title: "Artistas Digitales — ERUDITO Galery",
  description: "Colectivos y estudios de arte digital de la colección ERUDITO.",
};

export default async function ArtistasDigitales() {
  const [todos, fichas] = await Promise.all([getArtistas(), getFichas()]);
  const artistas = todos.filter((a) => a.origen.toLowerCase().includes("digital"));
  const ids = new Set(artistas.map((a) => a.id));
  const fichasFiltradas = fichas.filter((f) => ids.has(f.artista.id));

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PaginaArtistas
          artistas={artistas}
          fichas={fichasFiltradas}
          titulo="Artistas Digitales"
          descripcion="Colectivos y estudios especializados en arte digital, impresión y cultura visual."
        />
      </main>
    </div>
  );
}
