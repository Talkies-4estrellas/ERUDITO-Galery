import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PaginaPerfil from "@/components/PaginaPerfil";

export const metadata: Metadata = {
  title: "Mi perfil — ERUDITO Galery",
  description: "Gestiona tu perfil de artista o coleccionista.",
};

export default function Perfil() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PaginaPerfil />
      </main>
    </div>
  );
}
