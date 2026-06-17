import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PaginaFavoritos from "@/components/PaginaFavoritos";

export const metadata: Metadata = {
  title: "Favoritos — ERUDITO Galery",
  description: "Las obras que has guardado como favoritas.",
};

export default function Favoritos() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PaginaFavoritos />
      </main>
    </div>
  );
}
