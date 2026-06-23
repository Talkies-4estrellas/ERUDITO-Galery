import Image from "next/image";
import Link from "next/link";
import type { FichaArte } from "@/data/fichas";
import VisorPerspectivas from "@/components/VisorPerspectivas";
import CapsulaArtista from "@/components/CapsulaArtista";
import EstadisticasValor from "@/components/EstadisticasValor";
import PanelCompra from "@/components/PanelCompra";
import FilaFichas from "@/components/FilaFichas";
import SeccionResenas from "@/components/SeccionResenas";

const TIPO_ESTILO: Record<FichaArte["tipo"], string> = {
  "Físico":           "bg-amber-400/15 text-amber-400 ring-amber-400/30",
  "JPG Certificado":  "bg-cyan-400/15 text-cyan-400 ring-cyan-400/30",
  "Impresión Oficial":"bg-violet-400/15 text-violet-400 ring-violet-400/30",
};

interface Props {
  ficha: FichaArte;
  similares: FichaArte[];
}

export default function DetalleObra({ ficha, similares }: Props) {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative h-[68vh] min-h-[460px] w-full overflow-hidden">
        <Image
          src={ficha.imagen}
          alt={ficha.titulo}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Desenfoque progresivo sobre la imagen */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[78%] backdrop-blur-xl"
          style={{
            WebkitMaskImage: "linear-gradient(to top, black 40%, transparent 88%)",
            maskImage:        "linear-gradient(to top, black 40%, transparent 88%)",
          }}
        />
        {/* Capa de oscurecimiento para legibilidad */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-zinc-950/90 via-zinc-950/50 to-transparent" />

        {/* Volver */}
        <Link
          href="/obras"
          className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-1.5 text-xs text-white backdrop-blur-md transition hover:bg-black/60"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Galería
        </Link>

        {/* Contenido superpuesto */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-8 sm:px-8">
          <div className="mx-auto max-w-6xl space-y-3">

            {/* Artista */}
            <div className="w-fit">
              <CapsulaArtista artista={ficha.artista} />
            </div>

            {/* Título + precio */}
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold uppercase tracking-wider text-white drop-shadow sm:text-4xl">
                  {ficha.titulo}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2.5">
                  <span className="text-sm text-white/60">{ficha.anio}</span>
                  <span className="h-3 w-px bg-white/20" />
                  <div aria-label={`${ficha.estrellas} de 5 estrellas`} className="flex gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={`text-sm ${i < ficha.estrellas ? "text-amber-400" : "text-white/20"}`}>★</span>
                    ))}
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${TIPO_ESTILO[ficha.tipo]}`}>
                    {ficha.tipo}
                  </span>
                </div>
              </div>

              <p className="font-serif text-3xl font-bold text-white sm:text-4xl">
                ${ficha.precio.toLocaleString("en-US")}
                <span className="ml-1.5 text-base font-normal text-white/50">USD</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CUERPO ───────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">

          {/* ── Columna principal ─────────────────────────────── */}
          <div className="min-w-0 space-y-8">

            {/* Descripción + ficha técnica */}
            <div className="rounded-2xl bg-zinc-900/70 p-6 ring-1 ring-white/10">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Sobre la obra</p>
              <p className="mt-3 leading-relaxed text-zinc-300">{ficha.descripcion}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {([
                  { label: "Movimiento", valor: ficha.movimiento },
                  { label: "Técnica",    valor: ficha.tecnica    },
                  { label: "Tamaño",     valor: ficha.tamano     },
                  { label: "Color",      valor: ficha.color      },
                ] as const).map(({ label, valor }) => (
                  <div key={label} className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</span>
                    <span className="text-xs font-semibold text-white">{valor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visor de perspectivas */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">Perspectivas</p>
              <VisorPerspectivas titulo={ficha.titulo} imagenes={ficha.perspectivas} />
            </div>

            {/* Certificaciones */}
            {ficha.certificaciones.length > 0 && (
              <div className="rounded-2xl bg-zinc-900/70 p-6 ring-1 ring-white/10">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">Certificaciones</p>
                <ul className="space-y-3">
                  {ficha.certificaciones.map((cert) => (
                    <li key={cert} className="flex items-center gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/15">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="size-3.5 text-emerald-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </span>
                      <span className="text-sm text-zinc-300">{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gráficas de valor */}
            <EstadisticasValor ficha={ficha} />

            {/* Reseñas */}
            <SeccionResenas obraId={String(ficha.id)} />
          </div>

          {/* ── Panel de compra (sticky) ───────────────────── */}
          <aside className="h-fit lg:sticky lg:top-24">
            <PanelCompra ficha={ficha} />
          </aside>
        </div>
      </div>

      {/* ── Arte similar ─────────────────────────────────────────── */}
      <FilaFichas titulo="Arte similar" lista={similares} />
    </>
  );
}
