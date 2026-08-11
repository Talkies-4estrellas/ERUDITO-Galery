import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PaginaComparar from "@/components/PaginaComparar";
import { getFichas } from "@/lib/db";

export const metadata: Metadata = {
  title: "Comparar obras — ERUDITO Galery",
  description: "Compara obras lado a lado por precio, tendencia de valor y atributos.",
};

export default async function Comparar() {
  const fichas = await getFichas();
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PaginaComparar fichas={fichas} />
      </main>
    </div>
  );
}
