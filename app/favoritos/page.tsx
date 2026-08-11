import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PaginaFavoritos from "@/components/PaginaFavoritos";
import { getFichas } from "@/lib/db";

export const metadata: Metadata = {
  title: "Favoritos — ERUDITO Galery",
  description: "Las obras que has guardado como favoritas.",
};

export default async function Favoritos() {
  const fichas = await getFichas();
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PaginaFavoritos fichas={fichas} />
      </main>
    </div>
  );
}
