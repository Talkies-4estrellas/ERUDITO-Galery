import Image from "next/image";
import Link from "next/link";
import type { FichaArte } from "@/data/fichas";
import CapsulaArtista from "@/components/CapsulaArtista";
import BotonFavorito from "@/components/BotonFavorito";
import BotonComparar from "@/components/BotonComparar";

interface Props {
  ficha: FichaArte;
  /** Ancho fluido para usar en cuadrículas (por defecto, ancho fijo para filas con scroll) */
  fluida?: boolean;
  /** Muestra el botón "Comparar" (solo en la galería /obras) */
  comparable?: boolean;
}

export default function FichaObra({ ficha, fluida = false, comparable = false }: Props) {
  return (
    <article
      className={`group ${
        fluida ? "w-full" : "w-60 shrink-0 snap-start sm:w-64"
      }`}
    >
      {/* Tarjeta de la obra (enlaza a la página de detalle) */}
      <Link
        href={`/obra/${ficha.id}`}
        className="relative block aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-800 ring-1 ring-white/15 transition-transform duration-300 group-hover:-translate-y-1"
      >
        <Image
          src={ficha.imagen}
          alt={ficha.titulo}
          fill
          sizes="256px"
          className="object-cover"
        />

        {/* Botón de favorito */}
        <div className="absolute right-2.5 top-2.5 z-10">
          <BotonFavorito id={ficha.id} />
        </div>

        {/* Botón de comparar (solo en la galería) */}
        {comparable && (
          <div className="absolute left-2.5 top-2.5 z-10">
            <BotonComparar id={ficha.id} />
          </div>
        )}

        {/* Panel inferior con la información */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950/95 via-zinc-900/85 to-transparent p-3.5 pt-12">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">
              {ficha.titulo}
            </h3>
            <span className="text-[10px] text-zinc-400">{ficha.anio}</span>
          </div>
          <p className="mt-1 text-[11px] font-semibold text-zinc-200">
            Descripción:
          </p>
          {/* Se expande al pasar el cursor para leer la descripción completa */}
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-zinc-300 transition-all group-hover:line-clamp-none">
            {ficha.descripcion}
          </p>
          <div
            aria-label={`${ficha.estrellas} de 5 estrellas`}
            className="mt-2 text-center text-xs"
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
      </Link>

      {/* Cápsula del artista */}
      <div className="mt-3">
        <CapsulaArtista artista={ficha.artista} />
      </div>
    </article>
  );
}
