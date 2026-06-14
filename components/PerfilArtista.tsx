import Image from "next/image";
import Link from "next/link";
import type { Artista } from "@/data/artistas";
import type { FichaArte } from "@/data/fichas";
import FilaFichas from "@/components/FilaFichas";

interface Props {
  artista: Artista;
  obras: FichaArte[];
}

export default function PerfilArtista({ artista, obras }: Props) {
  const [nacimiento, fallecimiento] = artista.vida.split(" – ");
  const cronologia = [...obras].sort((a, b) => Number(a.anio) - Number(b.anio));
  const promedio =
    obras.length > 0
      ? (
          obras.reduce((suma, obra) => suma + obra.estrellas, 0) / obras.length
        ).toFixed(1)
      : "—";

  return (
    <>
      {/* Encabezado del artista */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-8">
        <div className="grid gap-6 rounded-2xl bg-gradient-to-b from-zinc-400/25 via-zinc-500/15 to-zinc-600/20 p-5 ring-1 ring-white/15 backdrop-blur sm:p-8 lg:grid-cols-[260px_1fr]">
          <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-2xl ring-2 ring-white/25 sm:w-56 lg:w-full">
            <Image
              src={artista.foto}
              alt={artista.nombre}
              fill
              priority
              sizes="260px"
              className="object-cover"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-wide text-white sm:text-3xl">
              {artista.nombre}
            </h1>
            <p className="mt-1 text-sm text-zinc-300">
              {artista.vida} · {artista.origen}
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-200">
              {artista.bio}
            </p>

            {/* Datos rápidos */}
            <dl className="mt-6 flex flex-wrap gap-3">
              {[
                { etiqueta: "Obras en la galería", valor: String(obras.length) },
                { etiqueta: "Valoración media", valor: `★ ${promedio}` },
                { etiqueta: "Nacimiento", valor: nacimiento },
                { etiqueta: "Fallecimiento", valor: fallecimiento ?? "—" },
              ].map(({ etiqueta, valor }) => (
                <div
                  key={etiqueta}
                  className="rounded-xl bg-black/30 px-4 py-2.5 ring-1 ring-white/10"
                >
                  <dt className="text-[10px] uppercase tracking-widest text-zinc-400">
                    {etiqueta}
                  </dt>
                  <dd className="mt-0.5 text-sm font-semibold text-white">
                    {valor}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Trayectoria */}
      {cronologia.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8">
          <h2 className="mb-5 text-lg font-semibold tracking-wide text-white">
            Trayectoria
          </h2>
          <ol className="relative ml-3 space-y-5 border-l border-white/15 pl-6">
            {cronologia.map((obra) => (
              <li key={obra.id} className="relative">
                <span className="absolute -left-[31px] top-1.5 size-2.5 rounded-full bg-amber-400 ring-4 ring-zinc-950" />
                <p className="text-xs text-zinc-400">{obra.anio}</p>
                <Link
                  href={`/obra/${obra.id}`}
                  className="text-sm font-semibold text-white transition hover:text-amber-400"
                >
                  {obra.titulo}
                </Link>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {obra.tecnica} · {obra.movimiento} · {obra.tamano}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Obras del artista */}
      <FilaFichas titulo={`Obras de ${artista.nombre}`} lista={obras} />
    </>
  );
}
