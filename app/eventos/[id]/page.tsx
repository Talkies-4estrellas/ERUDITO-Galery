import { notFound } from "next/navigation";
import { getEventos, getEvento, getFichas } from "@/lib/db";
import DetalleEvento from "@/components/DetalleEvento";

export async function generateStaticParams() {
  const eventos = await getEventos();
  return eventos.map((e) => ({ id: String(e.id) }));
}

export default async function PaginaEvento({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const evento = await getEvento(Number(id));
  if (!evento) notFound();

  const todasFichas = await getFichas();
  const obras = todasFichas.filter((f) => evento.fichasIds.includes(f.id));

  return <DetalleEvento evento={evento} obras={obras} />;
}
