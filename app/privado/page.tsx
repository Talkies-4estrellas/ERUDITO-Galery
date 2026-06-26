import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PaginaPrivado from "@/components/PaginaPrivado";

export const metadata: Metadata = {
  title: "Área Privada — ERUDITO Galery",
  description: "Acceso exclusivo para miembros: obras premium, subastas y análisis de mercado.",
  robots: { index: false },
};

export default function Privado() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PaginaPrivado />
      </main>
    </div>
  );
}
