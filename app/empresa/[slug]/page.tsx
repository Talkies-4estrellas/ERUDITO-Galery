import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import PerfilPublicoEmpresa from "@/components/PerfilPublicoEmpresa";

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
  const nombreAprox = slug.replace(/-/g, " ");
  let { data } = await supabaseServer
    .from("usuarios")
    .select("nombre, bio")
    .eq("slug", slug)
    .eq("rol", "empresa")
    .maybeSingle();
  if (!data) {
    const { data: porNombre } = await supabaseServer
      .from("usuarios")
      .select("nombre, bio")
      .ilike("nombre", nombreAprox)
      .eq("rol", "empresa")
      .maybeSingle();
    data = porNombre;
  }
  const nombre = data?.nombre || "Galería";
  return {
    title: `${nombre} — ERUDITO Galery`,
    description: data?.bio || `Perfil público de ${nombre} en ERUDITO Galery`,
  };
}

export default async function PaginaEmpresa({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <PerfilPublicoEmpresa slug={slug} />
      </main>
    </div>
  );
}
