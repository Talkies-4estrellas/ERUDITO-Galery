import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import DetalleServicio from "@/components/DetalleServicio";
import { servicios, getServicio } from "@/data/servicios";

export function generateStaticParams() {
  return servicios.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getServicio(slug);
  if (!s) return { title: "Servicio no encontrado" };
  return {
    title: `${s.titulo} — ERUDITO Galery`,
    description: s.descripcion,
  };
}

export default async function PaginaDetalleServicio({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = getServicio(slug);
  if (!s) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <DetalleServicio s={s} />
      </main>
    </div>
  );
}
