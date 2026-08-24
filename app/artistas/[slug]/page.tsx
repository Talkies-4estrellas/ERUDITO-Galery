import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import PerfilPublicoArtista from "@/components/PerfilPublicoArtista";

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabaseServer
    .from("usuarios")
    .select("nombre, bio")
    .eq("slug", slug)
    .eq("rol", "artista")
    .single();
  const nombre = data?.nombre || "Artista";
  return {
    title: `${nombre} — ERUDITO Galery`,
    description: data?.bio || `Obras y perfil de ${nombre} en ERUDITO Galery`,
  };
}

export default async function PaginaArtista({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PerfilPublicoArtista slug={slug} />
      </main>
    </div>
  );
}
