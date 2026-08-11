import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PaginaCatalogo from "@/components/PaginaCatalogo";
import { getFichas } from "@/lib/db";

export const metadata: Metadata = {
  title: "Catálogo — ERUDITO Galery",
  description: "Obras en línea, físicas y las historias detrás de cada pieza.",
};

export default async function Catalogo() {
  const fichas = await getFichas();
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PaginaCatalogo fichas={fichas} />
      </main>
    </div>
  );
}
