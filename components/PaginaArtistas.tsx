import Image from "next/image";
import Link from "next/link";
import { artistas } from "@/data/artistas";
import { obrasDeArtista } from "@/data/fichas";

export default function PaginaArtistas() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-8">
      <h1 className="text-2xl font-semibold tracking-wide text-white">
        Artistas
      </h1>
      <p className="mt-1 text-sm text-zinc-400">
        Maestros mexicanos cuya obra forma parte de la colección ERUDITO.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {artistas.map((artista) => {
          const obras = obrasDeArtista(artista.id);
          const promedio =
            obras.length > 0
              ? (
                  obras.reduce((suma, o) => suma + o.estrellas, 0) /
                  obras.length
                ).toFixed(1)
              : "—";

          return (
            <Link
              key={artista.id}
              href={`/artista/${artista.id}`}
              className="group overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10 transition hover:ring-amber-400/40"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={artista.foto}
                  alt={artista.nombre}
                  fill
                  sizes="280px"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h2 className="text-sm font-bold text-white">
                  {artista.nombre}
                </h2>
                <p className="mt-0.5 text-xs text-zinc-400">
                  {artista.vida} · {artista.origen}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">
                    {obras.length} {obras.length === 1 ? "obra" : "obras"}
                  </span>
                  <span className="font-semibold text-amber-400">
                    ★ {promedio}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
