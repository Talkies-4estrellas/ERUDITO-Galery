import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import DetalleObra from "@/components/DetalleObra";
import { fichas } from "@/data/fichas";

export function generateStaticParams() {
  return fichas.map((ficha) => ({ id: String(ficha.id) }));
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
