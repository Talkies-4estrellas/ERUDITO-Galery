"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12L3 12L12 3L21 12L19 12" />
      <path d="M5 12V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V12" />
      <path d="M9 21V15a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6" />
    </svg>
  );
}

function IconGrid({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  );
}

function IconPalette({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21a9 9 0 0 1 0-18c4.97 0 9 3.582 9 8 0 1.06-.474 2.078-1.318 2.828C18.838 14.578 17.693 15 16.5 15H14a2 2 0 0 0-1 3.75A1.3 1.3 0 0 1 12 21" />
      <circle cx="8.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="10.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    </svg>
  );
}

const ITEMS = [
  { href: "/",         label: "Home",     Icon: IconHome    },
  { href: "/catalogo", label: "Catálogo", Icon: IconGrid    },
  { href: "/artistas", label: "Artistas", Icon: IconPalette },
  { href: "/perfil",   label: "Perfil",   Icon: IconUser    },
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
        {ITEMS.map(({ href, label, Icon }) => {
          const on = activo(href);
          return (
            <Link
              key={href}
              href={href}
              prefetch={true}
              aria-current={on ? "page" : undefined}
              className={`flex flex-col items-center gap-1 rounded-2xl px-4 py-1.5 transition-colors ${
                on
                  ? "bg-amber-400/15 text-amber-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
