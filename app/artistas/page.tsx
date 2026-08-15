import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PaginaArtistas from "@/components/PaginaArtistas";
import { getArtistas, getFichas } from "@/lib/db";

export const metadata: Metadata = {
  title: "Artistas — ERUDITO Galery",
  description: "Conoce a los maestros detrás de cada obra de la colección.",
};

export default async function Artistas() {
  const [artistas, fichas] = await Promise.all([getArtistas(), getFichas()]);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PaginaArtistas artistas={artistas} fichas={fichas} />
      </main>
    </div>
  );
}
