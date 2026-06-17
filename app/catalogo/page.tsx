import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PaginaCatalogo from "@/components/PaginaCatalogo";

export const metadata: Metadata = {
  title: "Catálogo — ERUDITO Galery",
  description: "Obras en línea, físicas y las historias detrás de cada pieza.",
};

export default function Catalogo() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PaginaCatalogo />
      </main>
    </div>
  );
}
