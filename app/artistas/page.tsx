import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PaginaArtistas from "@/components/PaginaArtistas";

export const metadata: Metadata = {
  title: "Artistas — ERUDITO Galery",
  description: "Conoce a los maestros detrás de cada obra de la colección.",
};

export default function Artistas() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PaginaArtistas />
      </main>
    </div>
  );
}
