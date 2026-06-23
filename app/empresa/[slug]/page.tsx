import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PerfilPublicoEmpresa from "@/components/PerfilPublicoEmpresa";

export const metadata: Metadata = {
  title: "Galería — ERUDITO Galery",
  description: "Perfil público de galería en ERUDITO Galery",
};

export default async function PaginaEmpresa({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PerfilPublicoEmpresa slug={slug} />
      </main>
    </div>
  );
}
