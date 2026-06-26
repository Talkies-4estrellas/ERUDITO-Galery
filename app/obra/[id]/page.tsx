import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import DetalleObra from "@/components/DetalleObra";
import { fichas } from "@/data/fichas";

export function generateStaticParams() {
  return fichas.map((ficha) => ({ id: String(ficha.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const ficha = fichas.find((f) => String(f.id) === id);
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
  const ficha = fichas.find((f) => String(f.id) === id);
  if (!ficha) notFound();

  const similares = fichas.filter((f) => f.id !== ficha.id);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <DetalleObra ficha={ficha} similares={similares} />
      </main>
    </div>
  );
}
