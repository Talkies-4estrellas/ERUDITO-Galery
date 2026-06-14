import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import GaleriaObras from "@/components/GaleriaObras";

export const metadata: Metadata = {
  title: "Obras — ERUDITO Galery",
  description: "Explora el catálogo de obras por tamaño, color, movimiento y técnica.",
};

export default function PaginaObras() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <GaleriaObras />
      </main>
    </div>
  );
}
