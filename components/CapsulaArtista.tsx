"use client";

import Image from "next/image";
import Link from "next/link";
import type { Artista } from "@/data/fichas";

export default function CapsulaArtista({
  artista,
  compacta = false,
}: {
  artista: Artista;
  compacta?: boolean;
}) {
  const perfilHref = artista.slug
    ? `/artistas/${artista.slug}`
    : `/artista/${artista.id}`;

  return (
    <div className="flex items-center gap-2 rounded-full bg-gradient-to-b from-zinc-400/30 via-zinc-500/20 to-zinc-600/25 px-3 py-2 ring-1 ring-white/20 backdrop-blur">
      <div className="relative size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-white/30">
        <Image
          src={artista.foto}
          alt={artista.nombre}
          fill
          sizes="32px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold text-white">
          {artista.nombre}
        </p>
        <p className="truncate text-[9px] text-zinc-400">{artista.vida}</p>
      </div>
      <Link
        href={perfilHref}
        aria-label={`Ver perfil de ${artista.nombre}`}
        onClick={(e) => e.stopPropagation()}
        className={`shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[10px] text-zinc-100 transition hover:bg-amber-400 hover:text-zinc-900 ${
          compacta ? "hidden sm:block" : ""
        }`}
      >
        Perfil
      </Link>
    </div>
  );
}
