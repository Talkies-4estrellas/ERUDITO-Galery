import Image from "next/image";
import { eventos } from "@/data/eventos";

export default function SeccionEventos() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold tracking-wide text-white">
          Próximos eventos
        </h2>
        <p className="text-xs text-zinc-500">
          Subastas y exposiciones de la galería
        </p>
      </div>

      <div className="mt-5 flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {eventos.map((evento) => (
          <article
            key={evento.id}
            className="w-72 shrink-0 overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10 transition hover:ring-amber-400/30 sm:w-80"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={evento.imagen}
                alt={evento.titulo}
                fill
                sizes="320px"
                className="object-cover"
              />
              {/* Badge de fecha */}
              <div className="absolute left-3 top-3 flex flex-col items-center rounded-lg bg-zinc-950/90 px-2.5 py-1.5 text-center leading-none backdrop-blur">
                <span className="text-base font-bold text-amber-400">
                  {evento.fechaCorta.dia}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-400">
                  {evento.fechaCorta.mes}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex gap-2">
                <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-400 ring-1 ring-amber-400/20">
                  {evento.tipo}
                </span>
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-zinc-400 ring-1 ring-white/10">
                  {evento.modalidad}
                </span>
              </div>

              <h3 className="mt-2.5 text-sm font-bold uppercase tracking-wide text-white">
                {evento.titulo}
              </h3>
              <p className="mt-1 text-xs text-zinc-500">{evento.lugar}</p>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                {evento.descripcion}
              </p>

              <button
                type="button"
                className="mt-4 w-full rounded-full bg-white/5 py-2 text-xs font-semibold text-zinc-200 ring-1 ring-white/10 transition hover:bg-amber-400 hover:text-zinc-900"
              >
                Más información
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
