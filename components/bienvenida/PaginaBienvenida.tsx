import Link from "next/link";
import type { ReactNode } from "react";
import ImagenCarga from "@/components/ImagenCarga";
import Revelar from "@/components/Revelar";
import ContadorAnimado from "@/components/bienvenida/ContadorAnimado";
import GraficaValorMini from "@/components/bienvenida/GraficaValorMini";
import CabeceraBienvenida from "@/components/bienvenida/CabeceraBienvenida";
import type { FichaArte } from "@/data/fichas";
import type { Evento } from "@/data/eventos";
import { servicios } from "@/data/servicios";

export interface DatosBienvenida {
  obras: { id: number; titulo: string; imagen: string }[];
  cifras: { obras: number; artistas: number; galerias: number; cocina: number };
  destacada: { ficha: FichaArte; resenas: number } | null;
  artistas: { nombre: string; foto: string; href: string; origen: string }[];
  eventos: Evento[];
  cocina: { id: number; nombre: string; productor: string; origen: string; imagen: string; precio: number; unidad: string }[];
}

const PUERTAS = [
  {
    titulo: "Coleccionista",
    texto: "Crea tu cuenta al momento: guarda favoritas, compara obras y arma tu perfil de coleccionista.",
    nota: "Acceso inmediato",
  },
  {
    titulo: "Artista",
    texto: "Envía tu solicitud con tu especialidad. Si se aprueba, publicas tus obras y cada una pasa por revisión curatorial.",
    nota: "Con evaluación",
  },
  {
    titulo: "Galería o empresa",
    texto: "Representa a tus artistas y publica sus obras bajo el nombre de tu galería, con perfil público propio.",
    nota: "Con evaluación",
  },
];

const PREGUNTAS = [
  ["¿Necesito una cuenta para ver las obras?", "No. El catálogo, las fichas, los perfiles de artistas y la agenda se ven sin cuenta. La cuenta sirve para tener tu perfil de coleccionista, artista o galería."],
  ["¿Qué es el valor estimado de cada obra?", "Es una referencia mensual del valor de mercado que acompaña cada ficha, junto con el interés que despierta la obra. Sirve para orientarte; no sustituye una tasación formal."],
  ["¿Cómo publico mis obras?", "Regístrate como artista o como galería. Tu solicitud se revisa y, al aprobarse, puedes subir obras; cada una pasa por revisión antes de aparecer en el catálogo."],
  ["¿Qué es Cocina y Alimento?", "Una selección de productos de productores que elaboran de forma tradicional —vainilla, mole, chocolate, café, mezcal, miel—, elegidos con el mismo criterio que una obra."],
  ["¿Puedo usarla desde el celular?", "Sí. Todo el sitio se adapta a la pantalla, con barra de navegación inferior en el celular y modo claro u oscuro."],
];

const CHIPS_FILTRO = ["Óleo", "Muralismo", "Hasta $50,000", "Grande", "Cálido"];

function Marca({ numero, texto }: { numero: string; texto: string }) {
  return (
    <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
      <span className="text-zinc-500">{numero}</span>
      <span className="h-px w-8 bg-amber-400/60" />
      {texto}
    </p>
  );
}

function Icono({ d, className = "size-5" }: { d: string; className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

const ICONOS = {
  lupa: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z",
  corazon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z",
  comparar: "M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5",
  estrella: "M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z",
  luna: "M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z",
  flecha: "M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3",
};

function Baldosa({ className = "", icono, titulo, texto, children }: { className?: string; icono: string; titulo: string; texto: string; children?: ReactNode }) {
  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-3xl bg-zinc-900/80 p-6 ring-1 ring-white/10 transition hover:ring-amber-400/30 ${className}`}>
      <span className="grid size-10 place-items-center rounded-xl bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/20">
        <Icono d={icono} />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-white">{titulo}</h3>
      <p className="mt-1 text-sm leading-relaxed text-zinc-400">{texto}</p>
      {children && <div className="mt-5 flex-1">{children}</div>}
    </div>
  );
}

/** Columna de obras que se desplaza sin fin (la lista va duplicada para que el bucle no se note). */
function ColumnaObras({ obras, clase }: { obras: DatosBienvenida["obras"]; clase: string }) {
  return (
    <div className={`eb-columna flex flex-col gap-4 ${clase}`}>
      {[...obras, ...obras].map((o, i) => (
        <Link key={`${o.id}-${i}`} href={`/obra/${o.id}`} tabIndex={i >= obras.length ? -1 : undefined} className="relative block aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-white/10">
          <ImagenCarga src={o.imagen} alt={i >= obras.length ? "" : o.titulo} fill sizes="200px" className="object-cover transition-transform duration-500 hover:scale-105" />
        </Link>
      ))}
    </div>
  );
}

export default function PaginaBienvenida({ datos }: { datos: DatosBienvenida }) {
  const { obras, cifras, destacada, artistas, eventos, cocina } = datos;
  const tercio = Math.ceil(obras.length / 3);
  const columnas = [obras.slice(0, tercio), obras.slice(tercio, tercio * 2), obras.slice(tercio * 2)];
  const ficha = destacada?.ficha;
  const interes = ficha?.graficaInteres ?? [];
  const totalInteres = interes.reduce((a, b) => a + b, 0);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      {/* Animaciones propias de esta página (no dependen de globals.css) */}
      <style>{`
        @keyframes eb-subir { from { transform: translateY(0) } to { transform: translateY(-50%) } }
        @keyframes eb-bajar { from { transform: translateY(-50%) } to { transform: translateY(0) } }
        @keyframes eb-izquierda { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .eb-sube { animation: eb-subir 70s linear infinite }
        .eb-baja { animation: eb-bajar 80s linear infinite }
        .eb-fila { animation: eb-izquierda 60s linear infinite }
        .eb-marquesina:hover .eb-columna, .eb-marquesina:hover .eb-fila { animation-play-state: paused }
        @media (prefers-reduced-motion: reduce) { .eb-sube, .eb-baja, .eb-fila { animation: none } }
      `}</style>

      <CabeceraBienvenida />

      <main className="flex-1">
        {/* ── Portada: texto a la izquierda, obras en movimiento a la derecha ── */}
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-12 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-400 ring-1 ring-amber-400/20">
              <span className="size-1.5 rounded-full bg-amber-400" /> Bienvenido a ERUDITO Galery
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl xl:text-7xl">
              Arte que se mira,
              <span className="block font-serif font-normal italic text-amber-400">se entiende y se conserva.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
              Una galería en línea de maestros mexicanos y nuevas voces. Cada obra trae su historia, su certificado y su valor
              de mercado a la vista, para que coleccionar sea una decisión informada.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-zinc-900 transition hover:bg-amber-300">
                Entrar a la galería <Icono d={ICONOS.flecha} className="size-4" />
              </Link>
              {ficha && (
                <a href="#obra" className="rounded-full px-6 py-3 font-semibold text-zinc-200 ring-1 ring-white/20 transition hover:bg-white/5">
                  Ver una obra por dentro
                </a>
              )}
            </div>
            <p className="mt-6 text-xs text-zinc-500">Sin cuenta para explorar · Fichas con valor e interés · Desde cualquier pantalla</p>
          </div>

          {/* PC: tres columnas que suben y bajan */}
          <div className="eb-marquesina relative hidden h-[34rem] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] lg:block">
            <div className="grid h-full grid-cols-3 gap-4">
              <ColumnaObras obras={columnas[0]} clase="eb-sube" />
              <ColumnaObras obras={columnas[1]} clase="eb-baja -mt-24" />
              <ColumnaObras obras={columnas[2]} clase="eb-sube [animation-duration:90s]" />
            </div>
          </div>

          {/* Celular: una fila que avanza */}
          <div className="eb-marquesina -mx-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] lg:hidden">
            <div className="eb-fila flex w-max gap-3">
              {[...obras.slice(0, 10), ...obras.slice(0, 10)].map((o, i) => (
                <Link key={`${o.id}-${i}`} href={`/obra/${o.id}`} tabIndex={i >= 10 ? -1 : undefined} className="relative block aspect-[3/4] w-32 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10">
                  <ImagenCarga src={o.imagen} alt={i >= 10 ? "" : o.titulo} fill sizes="128px" className="object-cover" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cifras reales ── */}
        <section className="border-y border-white/10 bg-zinc-900/40">
          <dl className="mx-auto flex max-w-7xl flex-wrap justify-center gap-y-8 px-4 py-10 sm:px-8 [&>div]:w-1/2 sm:[&>div]:w-auto sm:[&>div]:flex-1">
            {[
              [cifras.obras, "obras en el catálogo"],
              [cifras.artistas, "artistas"],
              [cifras.galerias, "galerías y empresas"],
              [cifras.cocina, "productos de Cocina"],
            ].filter(([n]) => (n as number) > 0).map(([n, t]) => (
              <div key={t as string} className="text-center sm:border-r sm:border-white/10 sm:last:border-r-0">
                <dd className="text-4xl font-bold text-white sm:text-5xl"><ContadorAnimado valor={n as number} /></dd>
                <dt className="mt-1 text-xs uppercase tracking-widest text-zinc-500">{t as string}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Una obra, por dentro ── */}
        {ficha && destacada && (
          <section id="obra" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-20 sm:px-8 lg:py-28">
            <Marca numero="01" texto="Una obra, por dentro" />
            <h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Cada ficha cuenta su historia <span className="font-serif font-normal italic text-amber-400">y su valor</span>
            </h2>
            <Revelar className="mt-12 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <Link href={`/obra/${ficha.id}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem] ring-1 ring-white/10">
                <ImagenCarga src={ficha.imagen} alt={ficha.titulo} fill sizes="(max-width:1024px) 100vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-zinc-950/80 px-3 py-1 text-xs font-medium text-amber-400 ring-1 ring-amber-400/30 backdrop-blur">
                  La más vista del catálogo
                </span>
                <span className="dark-overlay absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-zinc-950/80 px-4 py-3 backdrop-blur">
                  <span className="text-sm font-semibold text-white">{ficha.titulo}</span>
                  <span className="text-sm text-amber-400">{"★".repeat(ficha.estrellas)}<span className="text-zinc-600">{"★".repeat(5 - ficha.estrellas)}</span></span>
                </span>
              </Link>

              <div>
                <div className="flex items-center gap-3">
                  <span className="relative size-11 overflow-hidden rounded-full ring-2 ring-amber-400/40">
                    <ImagenCarga src={ficha.artista.foto} alt={ficha.artista.nombre} fill sizes="44px" className="object-cover" />
                  </span>
                  <div>
                    <p className="font-semibold text-white">{ficha.artista.nombre}</p>
                    <p className="text-xs text-zinc-500">{ficha.tecnica}{ficha.anio ? ` · ${ficha.anio}` : ""}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-zinc-900/80 p-6 ring-1 ring-white/10">
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-zinc-500">Valor estimado</p>
                      <p className="text-3xl font-bold text-white">${ficha.precio.toLocaleString("es-MX")} <span className="text-sm font-normal text-zinc-500">MXN</span></p>
                    </div>
                    {totalInteres > 0 && (
                      <p className="text-right text-xs text-zinc-500">
                        Interés de los últimos meses<br />
                        <span className="text-lg font-semibold text-purple-300">{totalInteres}</span>
                      </p>
                    )}
                  </div>
                  <div className="mt-6"><GraficaValorMini puntos={ficha.graficaValor} /></div>
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-zinc-900/60 p-4 ring-1 ring-white/10">
                    <dt className="text-xs text-zinc-500">Reseñas de coleccionistas</dt>
                    <dd className="mt-1 text-xl font-semibold text-white">{destacada.resenas} <span className="text-amber-400">★ {ficha.estrellas}</span></dd>
                  </div>
                  <div className="rounded-2xl bg-zinc-900/60 p-4 ring-1 ring-white/10">
                    <dt className="text-xs text-zinc-500">Tipo de obra</dt>
                    <dd className="mt-1 text-xl font-semibold text-white">{ficha.tipo}</dd>
                  </div>
                </dl>

                {ficha.certificaciones.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {ficha.certificaciones.map((c) => (
                      <li key={c} className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-400 ring-1 ring-emerald-400/20">✓ {c}</li>
                    ))}
                  </ul>
                )}

                <Link href={`/obra/${ficha.id}`} className="mt-8 inline-flex items-center gap-2 font-semibold text-amber-400 hover:text-amber-300">
                  Ver la ficha completa <Icono d={ICONOS.flecha} className="size-4" />
                </Link>
              </div>
            </Revelar>
          </section>
        )}

        {/* ── Herramientas del coleccionista (cuadrícula asimétrica) ── */}
        <section id="herramientas" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-20 sm:px-8">
          <Marca numero="02" texto="Herramientas del coleccionista" />
          <h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Explorar, comparar <span className="font-serif font-normal italic text-amber-400">y decidir con calma</span>
          </h2>
          <Revelar className="mt-12 grid gap-4 md:grid-cols-6">
            <Baldosa className="md:col-span-4" icono={ICONOS.lupa} titulo="Búsqueda y filtros" texto="Encuentra por técnica, movimiento, tamaño, color o rango de precio. Desde cualquier página, el buscador se abre con Ctrl + K.">
              <div className="rounded-2xl bg-zinc-800/50 p-4 ring-1 ring-white/10">
                <div className="flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2.5 text-sm text-zinc-400 ring-1 ring-white/10">
                  <Icono d={ICONOS.lupa} className="size-4" /> Frida, Rivera, muralismo…
                  <kbd className="ml-auto rounded-md bg-zinc-800 px-1.5 py-0.5 text-[11px] text-zinc-400">Ctrl K</kbd>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CHIPS_FILTRO.map((c, i) => (
                    <span key={c} className={`rounded-full px-3 py-1 text-xs ring-1 ${i < 2 ? "bg-amber-400/15 text-amber-400 ring-amber-400/30" : "text-zinc-400 ring-white/10"}`}>{c}</span>
                  ))}
                </div>
              </div>
            </Baldosa>
            <Baldosa className="md:col-span-2" icono={ICONOS.corazon} titulo="Favoritas" texto="Marca con un corazón las obras que te gustan y vuelve a ellas cuando quieras, sin crear cuenta.">
              <div className="grid grid-cols-3 gap-2">
                {obras.slice(6, 9).map((o, i) => (
                  <span key={o.id} className="relative aspect-[3/4] overflow-hidden rounded-xl ring-1 ring-white/10">
                    <ImagenCarga src={o.imagen} alt="" fill sizes="96px" className="object-cover" />
                    <span className={`absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-zinc-950/80 ${i !== 1 ? "text-amber-400" : "text-zinc-500"}`}>
                      <Icono d={ICONOS.corazon} className="size-3.5" />
                    </span>
                  </span>
                ))}
              </div>
            </Baldosa>
            <Baldosa className="md:col-span-2" icono={ICONOS.comparar} titulo="Compara hasta 3 obras" texto="Ponlas lado a lado: precio, técnica, tamaño y la evolución de su valor.">
              <div className="flex -space-x-6">
                {obras.slice(3, 6).map((o, i) => (
                  <span key={o.id} className="relative aspect-[3/4] w-20 overflow-hidden rounded-xl ring-2 ring-zinc-900" style={{ transform: `rotate(${(i - 1) * 6}deg)` }}>
                    <ImagenCarga src={o.imagen} alt="" fill sizes="80px" className="object-cover" />
                  </span>
                ))}
              </div>
            </Baldosa>
            <Baldosa className="md:col-span-2" icono={ICONOS.estrella} titulo="Reseñas" texto="Lee lo que opinan otros coleccionistas de cada obra y deja la tuya.">
              <div className="rounded-2xl bg-zinc-800/50 p-4 ring-1 ring-white/10">
                <p className="text-lg tracking-widest text-amber-400">★★★★★</p>
                <p className="mt-1 text-sm italic text-zinc-400">«Es todavía mejor en persona que en las fotos.»</p>
              </div>
            </Baldosa>
            <Baldosa className="md:col-span-2" icono={ICONOS.luna} titulo="Claro u oscuro" texto="La galería se adapta a tu gusto y a la hora del día con un solo botón.">
              <div className="flex h-12 overflow-hidden rounded-xl ring-1 ring-white/10">
                <span className="flex-1 bg-zinc-950" />
                <span className="flex-1 bg-[#fafaf9]" />
              </div>
            </Baldosa>
          </Revelar>
        </section>

        {/* ── Artistas ── */}
        {artistas.length > 0 && (
          <section id="artistas" className="scroll-mt-28 border-y border-white/10 bg-zinc-900/40">
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <Marca numero="03" texto="Artistas" />
                  <h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    Maestros que hicieron escuela <span className="font-serif font-normal italic text-amber-400">y voces nuevas</span>
                  </h2>
                </div>
                <Link href="/artistas" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-zinc-200 ring-1 ring-white/20 transition hover:bg-white/5">
                  Ver todos los artistas <Icono d={ICONOS.flecha} className="size-4" />
                </Link>
              </div>
              <Revelar className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
                {artistas.slice(0, 6).map((a) => (
                  <Link key={a.href} href={a.href} className="group text-center">
                    <span className="relative mx-auto block aspect-square w-full max-w-[9rem] overflow-hidden rounded-full ring-2 ring-white/10 transition group-hover:ring-amber-400/60">
                      <ImagenCarga src={a.foto} alt={a.nombre} fill sizes="144px" className="object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
                    </span>
                    <span className="mt-3 block font-semibold text-white">{a.nombre}</span>
                    {a.origen && <span className="block text-xs text-zinc-500">{a.origen}</span>}
                  </Link>
                ))}
              </Revelar>
            </div>
          </section>
        )}

        {/* ── Agenda ── */}
        {eventos.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
            <Marca numero="04" texto="Agenda" />
            <h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Subastas y exposiciones <span className="font-serif font-normal italic text-amber-400">para no perderse</span>
            </h2>
            <Revelar className="mt-12 grid gap-6 md:grid-cols-2">
              {eventos.map((e) => (
                <Link key={e.id} href={e.href} className="group overflow-hidden rounded-3xl bg-zinc-900/80 ring-1 ring-white/10 transition hover:ring-amber-400/30">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <ImagenCarga src={e.imagen} alt={e.titulo} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute left-4 top-4 flex flex-col items-center rounded-xl bg-zinc-950/90 px-3 py-2 leading-none backdrop-blur">
                      <span className="text-xl font-bold text-amber-400">{e.fechaCorta.dia}</span>
                      <span className="mt-1 text-[10px] uppercase tracking-widest text-zinc-400">{e.fechaCorta.mes}</span>
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-widest text-amber-400">{e.tipo} · {e.modalidad}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{e.titulo}</h3>
                    <p className="mt-1 text-sm text-zinc-500">{e.lugar}</p>
                  </div>
                </Link>
              ))}
            </Revelar>
          </section>
        )}

        {/* ── Cocina y Alimento ── */}
        {cocina.length > 0 && (
          <section id="cocina" className="scroll-mt-28 border-y border-white/10 bg-zinc-900/40">
            <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <Marca numero="05" texto="Cocina y Alimento" />
                <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  El mismo criterio, <span className="font-serif font-normal italic text-amber-400">ahora en la mesa</span>
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-zinc-400">
                  Vainilla de Papantla, mole de Xico, chocolate de la Mixteca, mezcal en olla de barro: productores mexicanos que elaboran
                  como se ha hecho siempre, elegidos como se elige una obra.
                </p>
                <Link href="/cocina" className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-zinc-900 transition hover:bg-amber-300">
                  Conocer la selección <Icono d={ICONOS.flecha} className="size-4" />
                </Link>
              </div>
              <Revelar className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {cocina.map((p, i) => (
                  <Link key={p.id} href={`/cocina/${p.id}`} className={`group overflow-hidden rounded-3xl bg-zinc-900/80 ring-1 ring-white/10 transition hover:ring-amber-400/30 ${i === 2 ? "col-span-2 sm:col-span-1" : ""}`}>
                    <div className="relative aspect-square overflow-hidden bg-white">
                      <ImagenCarga src={p.imagen} alt={p.nombre} fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="p-4">
                      <p className="text-[11px] uppercase tracking-widest text-amber-400">{p.productor}</p>
                      <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-white">{p.nombre}</h3>
                      <p className="mt-1 text-xs text-zinc-500">{p.origen}</p>
                    </div>
                  </Link>
                ))}
              </Revelar>
            </div>
          </section>
        )}

        {/* ── Tres puertas ── */}
        <section id="unete" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-20 sm:px-8">
          <Marca numero="06" texto="Únete" />
          <h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Tres puertas <span className="font-serif font-normal italic text-amber-400">para entrar</span>
          </h2>
          <Revelar className="mt-12 grid gap-6 md:grid-cols-3">
            {PUERTAS.map((p, i) => (
              <div key={p.titulo} className={`relative flex flex-col rounded-3xl p-7 ring-1 ${i === 1 ? "bg-amber-400/5 ring-amber-400/40" : "bg-zinc-900/80 ring-white/10"}`}>
                <span aria-hidden className="absolute right-6 top-4 text-6xl font-bold text-white/5">0{i + 1}</span>
                <p className="text-xs uppercase tracking-widest text-zinc-500">{p.nota}</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{p.titulo}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{p.texto}</p>
                <Link href="/registro" className={`mt-6 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${i === 1 ? "bg-amber-400 text-zinc-900 hover:bg-amber-300" : "text-zinc-200 ring-1 ring-white/20 hover:bg-white/5"}`}>
                  {i === 0 ? "Crear mi cuenta" : "Enviar solicitud"} <Icono d={ICONOS.flecha} className="size-4" />
                </Link>
              </div>
            ))}
          </Revelar>

          <div className="mt-16 rounded-3xl bg-zinc-900/60 p-6 ring-1 ring-white/10 sm:p-8">
            <p className="text-sm font-semibold text-white">Y si ya tienes obra, también te acompañamos</p>
            <ul className="mt-5 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {servicios.map((s) => (
                <li key={s.slug}>
                  <Link href={`/servicios/${s.slug}`} className="group flex items-center justify-between gap-3 border-b border-white/5 py-3 text-sm text-zinc-300 transition hover:text-amber-400">
                    {s.titulo}
                    <Icono d={ICONOS.flecha} className="size-4 shrink-0 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-amber-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Preguntas ── */}
        <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <Marca numero="07" texto="Preguntas" />
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Antes de <span className="font-serif font-normal italic text-amber-400">entrar</span>
            </h2>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {PREGUNTAS.map(([p, r], i) => (
              <details key={p} open={i === 0} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-white [&::-webkit-details-marker]:hidden">
                  {p}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full ring-1 ring-white/15 text-amber-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-zinc-400">{r}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Cierre ── */}
        <section className="px-4 pb-20 sm:px-8">
          <div className="dark-overlay relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] ring-1 ring-white/10">
            {ficha && <ImagenCarga src={ficha.imagen} alt="" fill sizes="100vw" className="object-cover" />}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/40" />
            <div className="relative px-6 py-16 sm:px-12 sm:py-20 lg:max-w-2xl">
              <h2 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
                Tu próxima obra <span className="block font-serif font-normal italic text-amber-400">ya está en el catálogo.</span>
              </h2>
              <p className="mt-5 text-lg text-zinc-300">La próxima vez que vengas te llevamos directo a la galería. Esta presentación siempre queda a un clic en el pie de página.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-zinc-900 transition hover:bg-amber-300">
                  Entrar a la galería <Icono d={ICONOS.flecha} className="size-4" />
                </Link>
                <Link href="/registro" className="rounded-full px-6 py-3 font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10">
                  Crear cuenta
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
