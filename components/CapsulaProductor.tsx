import Link from "next/link";
import { COLOR_COCINA, type CategoriaCocina } from "@/data/cocina";

const ICONO: Record<CategoriaCocina, string> = {
  Vinos:      "🍷",
  Aceites:    "🫒",
  Especias:   "🌶️",
  Chocolates: "🍫",
  Conservas:  "🫙",
  Mieles:     "🍯",
};

interface Props {
  nombre: string;
  origen: string;
  categoria: CategoriaCocina;
}

export default function CapsulaProductor({ nombre, origen, categoria }: Props) {
  const color = COLOR_COCINA[categoria];
  const slug = encodeURIComponent(nombre);

  return (
    <div className="flex items-center gap-3 rounded-full bg-gradient-to-b from-zinc-400/30 via-zinc-500/20 to-zinc-600/25 px-3 py-2 ring-1 ring-white/20 backdrop-blur">
      {/* Avatar con icono de categoría */}
      <div className={`flex size-9 shrink-0 items-center justify-center rounded-full ring-1 ring-white/20 text-base ${color.split(" ").find(c => c.startsWith("bg-")) ?? "bg-zinc-800"}`}>
        {ICONO[categoria]}
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-white">{nombre}</p>
        <p className="text-[10px] text-zinc-400">{origen}</p>
      </div>

      <Link
        href={`/cocina/productor/${slug}`}
        aria-label={`Ver perfil de ${nombre}`}
        className="ml-auto rounded-full bg-white/15 px-3 py-1 text-[10px] text-zinc-100 transition hover:bg-amber-400 hover:text-zinc-900 whitespace-nowrap"
      >
        Perfil
      </Link>
    </div>
  );
}
