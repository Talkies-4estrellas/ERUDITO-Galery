import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import PerfilArtista from "@/components/PerfilArtista";
import { getArtistas, getArtista, getFichasPorArtista } from "@/lib/db";

export async function generateStaticParams() {
  const artistas = await getArtistas();
  return artistas.map((a) => ({ id: String(a.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const artista = await getArtista(Number(id));
  if (!artista) return { title: "Artista no encontrado" };
  return {
    title: `${artista.nombre} — ERUDITO Galery`,
    description: artista.bio.slice(0, 160),
    openGraph: {
      title: artista.nombre,
      description: artista.bio.slice(0, 160),
      images: [{ url: artista.foto, alt: artista.nombre }],
    },
  };
}

export default async function PaginaArtista({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [artista, obras] = await Promise.all([
    getArtista(Number(id)),
    getFichasPorArtista(Number(id)),
  ]);
  if (!artista) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PerfilArtista artista={artista} obras={obras} />
      </main>
    </div>
  );
}
