import Link from "next/link";
import { fichas, type TipoObra } from "@/data/fichas";
import FichaObra from "@/components/FichaObra";

const grupos: { id: string; titulo: string; descripcion: string; tipos: TipoObra[] }[] = [
  {
    id: "en-linea",
    titulo: "En Línea",
    descripcion:
      "Obras disponibles como entrega digital certificada: JPG Certificado e Impresiones Oficiales.",
    tipos: ["JPG Certificado", "Impresión Oficial"],
  },
  {
    id: "fisicos",
    titulo: "Físicos",
    descripcion:
      "Piezas originales que se entregan físicamente, con certificado de autenticidad y embalaje especializado.",
    tipos: ["Físico"],
  },
];

export default function PaginaCatalogo() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-8">
      <h1 className="text-2xl font-semibold tracking-wide text-white">
        Catálogo
      </h1>
      <p className="mt-1 text-sm text-zinc-400">
        Explora la colección por tipo de entrega o conoce la historia detrás
        de cada pieza.
      </p>

      {grupos.map((grupo) => {
        const obras = fichas.filter((f) => grupo.tipos.includes(f.tipo));
        return (
          <div key={grupo.id} id={grupo.id} className="mt-10 scroll-mt-28">
            <h2 className="text-lg font-semibold text-white">
              {grupo.titulo}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">{grupo.descripcion}</p>

            {obras.length > 0 ? (
              <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
                {obras.map((ficha) => (
                  <FichaObra key={ficha.id} ficha={ficha} fluida />
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-zinc-500">
                Aún no hay obras en esta categoría.
              </p>
            )}
          </div>
        );
      })}

      {/* Historias */}
      <div id="historias" className="mt-14 scroll-mt-28">
        <h2 className="text-lg font-semibold text-white">Historias</h2>
        <p className="mt-1 text-sm text-zinc-400">
          El contexto y el relato detrás de cada obra.
        </p>
        <div className="mt-5 space-y-4">
          {fichas.map((ficha) => (
            <Link
              key={ficha.id}
              href={`/obra/${ficha.id}`}
              className="block rounded-2xl bg-zinc-900 p-5 ring-1 ring-white/10 transition hover:ring-amber-400/30"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                  {ficha.titulo}
                </h3>
                <span className="text-xs text-zinc-500">{ficha.anio}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                {ficha.descripcion}
              </p>
              <p className="mt-2 text-xs font-medium text-amber-400">
                Leer más →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
