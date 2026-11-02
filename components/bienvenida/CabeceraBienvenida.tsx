"use client";

import Link from "next/link";
import BotonTema from "@/components/BotonTema";
import { useTema } from "@/hooks/useTema";

const ANCLAS = [
  ["#obra", "Una obra por dentro"],
  ["#herramientas", "Herramientas"],
  ["#artistas", "Artistas"],
  ["#cocina", "Cocina"],
  ["#unete", "Únete"],
];

export default function CabeceraBienvenida() {
  const { tema } = useTema();
  const sufijo = tema === "claro" ? "-amarillo" : "";

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl bg-zinc-900/90 px-5 py-3 ring-1 ring-white/10 backdrop-blur">
        <Link href="/bienvenida" aria-label="ERUDITO Galery" className="shrink-0">
          <img src={`/logo-pc${sufijo}.svg`} alt="ERUDITO Galery" className="hidden h-7 w-auto sm:block" />
          <img src={`/logo-movil${sufijo}.svg`} alt="ERUDITO Galery" className="h-8 w-auto sm:hidden" />
        </Link>
        <nav aria-label="Secciones" className="hidden items-center gap-6 text-[13px] text-zinc-400 lg:flex">
          {ANCLAS.map(([href, texto]) => (
            <a key={href} href={href} className="transition-colors hover:text-amber-400">{texto}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <BotonTema />
          <Link href="/" className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300">
            Entrar<span className="hidden sm:inline"> a la galería</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
