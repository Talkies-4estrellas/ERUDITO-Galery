import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PaginaGalerias from "@/components/PaginaGalerias";
import { getGalerias } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galerías — ERUDITO Galery",
  description: "Instituciones y espacios de arte que forman parte de la plataforma ERUDITO.",
};

export default async function Galerias() {
  const galerias = await getGalerias();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PaginaGalerias galerias={galerias} />
      </main>
    </div>
  );
}
