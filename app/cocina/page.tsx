import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PaginaCocina from "@/components/PaginaCocina";

export const metadata: Metadata = {
  title: "Cocina y Alimento — ERUDITO Galery",
  description: "Productos gastronómicos de lujo seleccionados con el mismo criterio con el que elegimos una obra de arte.",
};

export default function CocinaPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex-1">
        <PaginaCocina />
      </main>
    </div>
  );
}
