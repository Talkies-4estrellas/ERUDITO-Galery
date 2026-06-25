import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 text-center">
        {/* Imagen de fondo desenfocada */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <Image
            src="https://picsum.photos/seed/404-bg/1200/800"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 20%, #09090b 80%)",
          }}
        />

        <div className="relative z-10 space-y-6">
          <p className="text-[6rem] font-bold leading-none text-white/5 sm:text-[10rem]">
            404
          </p>
          <div className="-mt-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              Obra no encontrada
            </p>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Esta página no existe…
            </h1>
            <p className="mx-auto max-w-sm text-sm text-zinc-400">
              O aún no ha sido descubierta. Como las mejores obras, a veces hay que
              saber buscar en el lugar correcto.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/obras"
              className="rounded-full bg-amber-400 px-6 py-2.5 text-sm font-bold text-zinc-900 transition hover:bg-amber-300"
            >
              Ver obras
            </Link>
            <Link
              href="/artistas"
              className="rounded-full bg-white/5 px-6 py-2.5 text-sm text-zinc-300 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              Artistas
            </Link>
            <Link
              href="/blog"
              className="rounded-full bg-white/5 px-6 py-2.5 text-sm text-zinc-300 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              Blog
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
