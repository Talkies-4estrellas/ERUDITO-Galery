import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import DetalleObra from "@/components/DetalleObra";
import { getFichas, getFicha } from "@/lib/db";

export async function generateStaticParams() {
  const fichas = await getFichas();
  return fichas.map((f) => ({ id: String(f.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const ficha = await getFicha(Number(id));
  if (!ficha) return { title: "Obra no encontrada" };
  return {
    title: `${ficha.titulo} (${ficha.anio}) — ERUDITO Galery`,
    description: ficha.descripcion.slice(0, 160),
    openGraph: {
      title: `${ficha.titulo} · ${ficha.artista.nombre}`,
      description: ficha.descripcion.slice(0, 160),
      images: [{ url: ficha.imagen, width: 600, height: 800, alt: ficha.titulo }],
      type: "article",
    },
  };
}

export default async function PaginaObra({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [ficha, todasFichas] = await Promise.all([
    getFicha(Number(id)),
    getFichas(),
  ]);
  if (!ficha) notFound();

  const similares = todasFichas.filter((f) => f.id !== ficha.id);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <DetalleObra ficha={ficha} similares={similares} />
      </main>
    </div>
  );
}
