import Link from "next/link";
import type { Servicio } from "@/data/servicios";

const ACENTO: Record<string, string> = {
  amber:   "text-amber-400 bg-amber-400/10 ring-amber-400/20",
  violet:  "text-violet-400 bg-violet-400/10 ring-violet-400/20",
  emerald: "text-emerald-400 bg-emerald-400/10 ring-emerald-400/20",
  sky:     "text-sky-400 bg-sky-400/10 ring-sky-400/20",
  rose:    "text-rose-400 bg-rose-400/10 ring-rose-400/20",
};

const BTN: Record<string, string> = {
  amber:   "bg-amber-400 hover:bg-amber-300 text-zinc-900",
  violet:  "bg-violet-500 hover:bg-violet-400 text-white",
  emerald: "bg-emerald-500 hover:bg-emerald-400 text-white",
  sky:     "bg-sky-500 hover:bg-sky-400 text-white",
  rose:    "bg-rose-500 hover:bg-rose-400 text-white",
};

const PASO_COLOR: Record<string, string> = {
  amber:   "bg-amber-400/10 text-amber-400 ring-amber-400/20",
  violet:  "bg-violet-400/10 text-violet-400 ring-violet-400/20",
  emerald: "bg-emerald-400/10 text-emerald-400 ring-emerald-400/20",
  sky:     "bg-sky-400/10 text-sky-400 ring-sky-400/20",
  rose:    "bg-rose-400/10 text-rose-400 ring-rose-400/20",
};

export default function DetalleServicio({ s }: { s: Servicio }) {
  const a = s.acento in ACENTO ? s.acento : "amber";

  return (
    <article className="mx-auto w-full max-w-4xl px-4 pb-20 pt-8 sm:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/servicios" className="transition hover:text-amber-400">Servicios</Link>
        <span>/</span>
        <span className="text-zinc-300">{s.titulo}</span>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={s.imagen}
          alt={s.titulo}
          className="h-56 w-full object-cover sm:h-72"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 sm:p-8">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${ACENTO[a]}`}>
            {s.icono} {s.titulo}
          </span>
          <h1 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl">
            {s.subtitulo}
          </h1>
        </div>
      </div>

      {/* Descripción y precio */}
      <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_200px]">
        <div>
          <p className="text-sm leading-relaxed text-zinc-300">{s.descripcion}</p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">{s.detalle}</p>
        </div>
        <div className="rounded-2xl bg-zinc-900 p-5 ring-1 ring-white/10 self-start">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Desde</p>
          <p className={`mt-1 text-2xl font-bold ${ACENTO[a].split(" ")[0]}`}>{s.desde}</p>
          <Link
            href="/contacto"
            className={`mt-4 block rounded-full py-2.5 text-center text-sm font-semibold transition ${BTN[a]}`}
          >
            Solicitar información
          </Link>
        </div>
      </div>

      {/* Beneficios */}
      <section className="mt-12">
        <h2 className="text-lg font-bold text-white">¿Qué incluye?</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {s.beneficios.map((b) => (
            <li key={b} className="flex items-start gap-3 rounded-xl bg-zinc-900 p-4 ring-1 ring-white/5">
              <span className={`mt-0.5 text-base ${ACENTO[a].split(" ")[0]}`}>✓</span>
              <span className="text-sm text-zinc-300">{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Proceso */}
      <section className="mt-12">
        <h2 className="text-lg font-bold text-white">Cómo funciona</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {s.proceso.map((paso) => (
            <div key={paso.numero} className="rounded-2xl bg-zinc-900 p-5 ring-1 ring-white/10">
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${PASO_COLOR[a]}`}>
                {paso.numero}
              </span>
              <h3 className="mt-3 text-sm font-bold text-white">{paso.titulo}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{paso.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <div className="mt-12 rounded-3xl bg-zinc-900 p-8 text-center ring-1 ring-white/10">
        <p className="text-base font-semibold text-white">¿Listo para comenzar?</p>
        <p className="mt-2 text-sm text-zinc-400">
          Contáctanos y un asesor responderá en menos de 24 horas.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/contacto"
            className={`rounded-full px-8 py-2.5 text-sm font-semibold transition ${BTN[a]}`}
          >
            Contactar ahora
          </Link>
          <Link
            href="/servicios"
            className="rounded-full bg-white/5 px-8 py-2.5 text-sm text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10"
          >
            Ver todos los servicios
          </Link>
        </div>
      </div>
    </article>
  );
}
