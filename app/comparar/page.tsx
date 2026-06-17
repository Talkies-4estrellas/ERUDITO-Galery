import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PaginaComparar from "@/components/PaginaComparar";

export const metadata: Metadata = {
  title: "Comparar obras — ERUDITO Galery",
  description: "Compara obras lado a lado por precio, tendencia de valor y atributos.",
};

export default function Comparar() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PaginaComparar />
      </main>
    </div>
  );
}
