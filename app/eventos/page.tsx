import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PaginaEventos from "@/components/PaginaEventos";
import { getEventos } from "@/lib/db";

export const metadata: Metadata = {
  title: "Eventos — ERUDITO Galery",
  description: "Subastas y exposiciones de arte en ERUDITO Galery, en línea y presenciales.",
};

export default async function EventosPage() {
  const eventos = await getEventos();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex-1">
        <PaginaEventos eventos={eventos} />
      </main>
    </div>
  );
}
