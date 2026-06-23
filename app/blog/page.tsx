import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import BlogGrid from "@/components/BlogGrid";

export const metadata: Metadata = {
  title: "Blog — ERUDITO Galery",
  description: "Artículos sobre movimientos artísticos, coleccionismo, mercado del arte y técnicas.",
};

export default function PaginaBlog() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex-1">
        <BlogGrid />
      </main>
    </div>
  );
}
