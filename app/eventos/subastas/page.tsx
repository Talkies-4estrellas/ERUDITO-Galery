import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import PaginaEventos from "@/components/PaginaEventos";
import { getEventos } from "@/lib/db";

export const metadata: Metadata = {
  title: "Subastas — ERUDITO Galery",
  description: "Obras en subasta, en línea y presenciales. Registra tu asistencia.",
};

export default async function SubastasPage() {
  const todos = await getEventos();
  const subastas = todos.filter((e) => e.tipo === "Subasta");

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex-1">
        <Suspense>
          <PaginaEventos
            eventos={subastas}
            titulo="Subastas"
            descripcion="Obras disponibles en subasta, en línea y presenciales. Registra tu asistencia con un clic."
            ocultarFiltroTipo
          />
        </Suspense>
      </main>
    </div>
  );
}
