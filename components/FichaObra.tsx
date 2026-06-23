import Image from "next/image";
import Link from "next/link";
import type { FichaArte } from "@/data/fichas";
import CapsulaArtista from "@/components/CapsulaArtista";
import BotonFavorito from "@/components/BotonFavorito";
import BotonComparar from "@/components/BotonComparar";

interface Props {
  ficha: FichaArte;
  fluida?: boolean;
  comparable?: boolean;
}

const TIPO_LABEL: Record<FichaArte["tipo"], string> = {
  "Físico":           "Original",
  "JPG Certificado":  "Digital",
  "Impresión Oficial":"Ed. limitada",
};

export default function FichaObra({ ficha, fluida = false, comparable = false }: Props) {
  return (
    <article className={`group ${fluida ? "w-full" : "w-60 shrink-0 snap-start sm:w-64"}`}>
      <Link
        href={`/obra/${ficha.id}`}
        className="relative block aspect-[3/4] overflow-hidden rounded-3xl bg-zinc-800 ring-1 ring-white/10"
      >
        {/* Imagen de fondo */}
        <Image
          src={ficha.imagen}
          alt={ficha.titulo}
          fill
          sizes="256px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge tipo — top right */}
        <div className="absolute right-3 top-3 z-10 rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-md">
          {TIPO_LABEL[ficha.tipo]}
        </div>

        {/* Favorito — top left */}
        <div className="absolute left-3 top-3 z-10">
          <BotonFavorito id={ficha.id} />
        </div>

        {/* Comparar — debajo del favorito */}
        {comparable && (
          <div className="absolute left-3 top-12 z-10">
            <BotonComparar id={ficha.id} />
          </div>
        )}

        {/* ── Desenfoque progresivo sobre la imagen ────────────
            backdrop-blur borra la imagen detrás; la máscara
            gradiente controla dónde aplica el blur:
            totalmente borroso abajo → nítido arriba.           */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[82%] backdrop-blur-2xl"
          style={{
            WebkitMaskImage: "linear-gradient(to top, black 48%, transparent 88%)",
            maskImage:        "linear-gradient(to top, black 48%, transparent 88%)",
          }}
        />

        {/* Oscurecimiento suave encima del blur para legibilidad */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* ── Contenido superpuesto ────────────────────────────── */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4">

          {/* Estrellas */}
          <div aria-label={`${ficha.estrellas} de 5 estrellas`} className="flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={`text-xs ${i < ficha.estrellas ? "text-amber-400" : "text-white/20"}`}>
                ★
              </span>
            ))}
          </div>

          {/* Título */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white leading-tight">
              {ficha.titulo}
            </h3>
            <p className="mt-0.5 text-[10px] text-white/50">{ficha.anio}</p>
          </div>

          {/* Descripción — se expande al hover */}
          <p className="line-clamp-2 text-[11px] leading-relaxed text-white/70 transition-all duration-300 group-hover:line-clamp-none">
            {ficha.descripcion}
          </p>

          {/* Tags + precio */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {ficha.movimiento && (
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] text-white/80 backdrop-blur-sm ring-1 ring-white/10">
                  {ficha.movimiento}
                </span>
              )}
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] text-white/60 backdrop-blur-sm ring-1 ring-white/10">
                {ficha.tamano}
              </span>
            </div>
            {ficha.precio > 0 && (
              <span className="shrink-0 rounded-full bg-black/50 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                ${ficha.precio.toLocaleString("en-US")}
              </span>
            )}
          </div>

          {/* Botón "Ver obra" — pill blanco, como "Add to cart" en la referencia */}
          <div className="mt-1 w-full rounded-full bg-white py-2.5 text-center text-xs font-bold text-zinc-900 transition-colors duration-200 group-hover:bg-amber-300">
            Ver obra
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
