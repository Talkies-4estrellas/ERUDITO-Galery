import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import FilaFichas from "@/components/FilaFichas";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Carousel />
        <FilaFichas />
      </main>
    </div>
  );
}
