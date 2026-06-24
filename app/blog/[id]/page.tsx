import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import DetalleArticulo from "@/components/DetalleArticulo";
import { articulos } from "@/data/articulos";

export function generateStaticParams() {
  return articulos.map((a) => ({ id: String(a.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const articulo = articulos.find((a) => String(a.id) === id);
  if (!articulo) return {};
  return {
    title: `${articulo.titulo} — ERUDITO Blog`,
    description: articulo.extracto,
  };
}

export default async function PaginaArticulo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articulo = articulos.find((a) => String(a.id) === id);
  if (!articulo) notFound();

  const relacionados = articulos
    .filter((a) => a.id !== articulo.id && a.categoria === articulo.categoria)
    .slice(0, 3);

  const otros = relacionados.length < 3
    ? [
        ...relacionados,
        ...articulos
          .filter((a) => a.id !== articulo.id && a.categoria !== articulo.categoria)
          .slice(0, 3 - relacionados.length),
      ]
    : relacionados;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex-1">
        <DetalleArticulo articulo={articulo} relacionados={otros} />
      </main>
    </div>
  );
}
