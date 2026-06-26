import Link from "next/link";
import { servicios } from "@/data/servicios";

const ICONOS_ACENTO: Record<string, string> = {
  amber:   "text-amber-400",
  violet:  "text-violet-400",
  emerald: "text-emerald-400",
  sky:     "text-sky-400",
  rose:    "text-rose-400",
};

export default function PaginaServicios() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-8">
      <h1 className="text-2xl font-semibold tracking-wide text-white">Servicios</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Todo lo que ERUDITO Galery ofrece a artistas, coleccionistas e instituciones.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {servicios.map((s) => (
          <div
            key={s.slug}
            id={s.slug}
            className="group scroll-mt-28 rounded-2xl bg-zinc-900 p-6 ring-1 ring-white/10 transition hover:ring-white/20"
          >
            <div className="flex items-start justify-between">
              <span className="text-2xl">{s.icono}</span>
              <span className={`text-xs font-semibold ${ICONOS_ACENTO[s.acento] ?? "text-amber-400"}`}>
                {s.desde}
              </span>
            </div>
            <h2 className="mt-3 text-base font-bold text-white">{s.titulo}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.descripcion}</p>
            <Link
              href={`/servicios/${s.slug}`}
              className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold transition ${ICONOS_ACENTO[s.acento] ?? "text-amber-400"} opacity-0 group-hover:opacity-100`}
            >
              Ver detalles →
            </Link>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 text-center ring-1 ring-white/10">
        <p className="text-lg font-bold text-white">¿No sabes cuál necesitas?</p>
        <p className="mt-2 text-sm text-zinc-400">
          Cuéntanos tu proyecto y te orientamos sin compromiso.
        </p>
        <Link
          href="/contacto"
          className="mt-5 inline-block rounded-full bg-amber-400 px-8 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300"
        >
          Hablar con un asesor
        </Link>
      </div>
    </section>
  );
}
