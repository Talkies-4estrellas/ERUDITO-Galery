import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PaginaContacto from "@/components/PaginaContacto";

export const metadata: Metadata = {
  title: "Contacto — ERUDITO Galery",
  description: "Ponte en contacto con ERUDITO Galery para consultas, adquisiciones o servicios.",
};

export default function ContactoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex-1">
        <PaginaContacto />
      </main>
    </div>
  );
}
