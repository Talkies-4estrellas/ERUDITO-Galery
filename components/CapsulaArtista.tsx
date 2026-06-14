import Image from "next/image";
import Link from "next/link";
import type { Artista } from "@/data/fichas";

export default function CapsulaArtista({ artista }: { artista: Artista }) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-gradient-to-b from-zinc-400/30 via-zinc-500/20 to-zinc-600/25 px-3 py-2 ring-1 ring-white/20 backdrop-blur">
      <div className="relative size-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/30">
        <Image
          src={artista.foto}
          alt={artista.nombre}
          fill
          sizes="36px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-white">
          {artista.nombre}
        </p>
        <p className="text-[10px] text-zinc-300">{artista.vida}</p>
      </div>
      <Link
        href={`/artista/${artista.id}`}
        aria-label={`Ver perfil de ${artista.nombre}`}
        className="ml-auto rounded-full bg-white/15 px-3 py-1 text-[10px] text-zinc-100 transition hover:bg-amber-400 hover:text-zinc-900"
      >
        Perfil
      </Link>
    </div>
  );
}
