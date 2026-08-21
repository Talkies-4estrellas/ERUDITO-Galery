import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import PaginaEventos from "@/components/PaginaEventos";
import { getEventos } from "@/lib/db";

export const metadata: Metadata = {
  title: "Exposiciones — ERUDITO Galery",
  description: "Muestras y exhibiciones de arte, presenciales y en formato digital.",
};

export default async function ExposicionesPage() {
  const todos = await getEventos();
  const exposiciones = todos.filter((e) => e.tipo === "Exposición");

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex-1">
        <Suspense>
          <PaginaEventos
            eventos={exposiciones}
            titulo="Exposiciones"
            descripcion="Muestras y exhibiciones de arte de la galería, presenciales y en formato digital."
            ocultarFiltroTipo
          />
        </Suspense>
      </main>
    </div>
  );
}
