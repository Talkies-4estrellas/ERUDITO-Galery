import { notFound } from "next/navigation";
import { eventos, getEvento } from "@/data/eventos";
import DetalleEvento from "@/components/DetalleEvento";

export function generateStaticParams() {
  return eventos.map((e) => ({ id: String(e.id) }));
}

export default async function PaginaEvento({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const evento = getEvento(Number(id));
  if (!evento) notFound();
  return <DetalleEvento evento={evento} />;
}
