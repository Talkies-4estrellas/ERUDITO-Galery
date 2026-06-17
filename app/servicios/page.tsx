import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PaginaServicios from "@/components/PaginaServicios";

export const metadata: Metadata = {
  title: "Servicios — ERUDITO Galery",
  description: "Registro de obras, restauración, manager de ventas y más.",
};

export default function Servicios() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PaginaServicios />
      </main>
    </div>
  );
}
