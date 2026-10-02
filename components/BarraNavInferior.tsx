"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/",          label: "Home",      icon: "ti-home" },
  { href: "/catalogo",  label: "Catálogo",  icon: "ti-layout-grid" },
  { href: "/artistas",  label: "Artistas",  icon: "ti-palette" },
  { href: "/perfil",    label: "Perfil",    icon: "ti-user" },
] as const;

export default function BarraNavInferior() {
  const pathname = usePathname();

  const activo = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Navegación principal"
      className="sm:hidden fixed bottom-4 inset-x-3 z-50"
    >
      <div className="flex justify-around items-center rounded-3xl border border-white/10 bg-zinc-950/80 px-2 py-2.5 backdrop-blur-xl shadow-2xl">
        {ITEMS.map(({ href, label, icon }) => {
          const on = activo(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={on ? "page" : undefined}
              className={`flex flex-col items-center gap-1 rounded-2xl px-4 py-1.5 transition-colors ${
                on
                  ? "bg-amber-400/15 text-amber-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <i className={`ti ${icon} text-xl`} aria-hidden="true" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
