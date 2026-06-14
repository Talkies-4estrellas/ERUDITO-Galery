import Image from "next/image";
import type { FichaArte } from "@/data/fichas";
import VisorPerspectivas from "@/components/VisorPerspectivas";
import CapsulaArtista from "@/components/CapsulaArtista";
import EstadisticasValor from "@/components/EstadisticasValor";
import FilaFichas from "@/components/FilaFichas";

interface Props {
  ficha: FichaArte;
  similares: FichaArte[];
}

export default function DetalleObra({ ficha, similares }: Props) {
  return (
    <>
      {/* Banner superior con la obra */}
      <section className="px-4 pt-6 sm:px-8">
        <div className="relative mx-auto h-52 max-w-6xl overflow-hidden rounded-2xl ring-1 ring-white/10 sm:h-72">
          <Image
            src={ficha.imagen}
            alt={ficha.titulo}
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover"
          />
          <div className="absolute bottom-4 right-4 rounded-xl bg-black/60 px-4 py-2.5 text-right backdrop-blur-md">
            <div className="flex items-baseline gap-3">
              <h1 className="text-sm font-bold uppercase tracking-wider text-white sm:text-base">
                {ficha.titulo}
              </h1>
              <span className="text-xs text-zinc-400">{ficha.anio}</span>
            </div>
            <div
              aria-label={`${ficha.estrellas} de 5 estrellas`}
              className="mt-0.5 text-xs"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={
                    i < ficha.estrellas ? "text-amber-400" : "text-zinc-600"
                  }
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visor de perspectivas + información de la obra */}
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <VisorPerspectivas
            titulo={ficha.titulo}
            imagenes={ficha.perspectivas}
          />

          <div className="rounded-2xl bg-gradient-to-b from-zinc-400/25 via-zinc-500/15 to-zinc-600/20 p-5 ring-1 ring-white/15 backdrop-blur sm:p-6">
            <CapsulaArtista artista={ficha.artista} />

            <div className="mt-5 flex items-baseline justify-between gap-3">
              <h2 className="text-base font-bold uppercase tracking-wider text-white">
                {ficha.titulo}
              </h2>
              <span className="text-xs text-zinc-400">{ficha.anio}</span>
            </div>

            <p className="mt-3 text-xs font-semibold text-zinc-200">
              Descripción:
            </p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-300">
              {ficha.descripcion}
            </p>
          </div>
        </div>
      </section>

      {/* Estadísticas del valor actual y compra */}
      <EstadisticasValor />

      {/* Recomendaciones de arte similar */}
      <FilaFichas titulo="Arte similar" lista={similares} />
    </>
  );
}
