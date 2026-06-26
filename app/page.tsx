import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import SeccionEventos from "@/components/SeccionEventos";
import FilaFichas from "@/components/FilaFichas";

export const metadata: Metadata = {
  title: "ERUDITO Galery — Arte con historia y valor",
  description:
    "Galería de arte en línea: descubre, compara y adquiere obras de maestros latinoamericanos. Certificación, restauración y asesoría de colecciones.",
  openGraph: {
    title: "ERUDITO Galery",
    description: "Arte con historia y valor. Obras certificadas, coleccionistas y servicios de galería.",
    type: "website",
    locale: "es_MX",
  },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Carousel />
        <SeccionEventos />
        <FilaFichas />
      </main>
    </div>
  );
}
