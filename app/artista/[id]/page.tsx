import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import PerfilArtista from "@/components/PerfilArtista";
import { artistas } from "@/data/artistas";
import { obrasDeArtista } from "@/data/fichas";

export function generateStaticParams() {
  return artistas.map((artista) => ({ id: String(artista.id) }));
}

export default async function PaginaArtista({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artista = artistas.find((a) => String(a.id) === id);
  if (!artista) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PerfilArtista artista={artista} obras={obrasDeArtista(artista.id)} />
      </main>
    </div>
  );
}
