"use client";

import { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setEnviado(true);
    setEmail("");
  }

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Columna 1 — Marca */}
          <div>
            <p className="text-lg font-bold tracking-widest text-white">
              ERUDITO <span className="text-amber-400">GALERY</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              El arte y el lujo comparten una misma raíz: la búsqueda de lo
              extraordinario en la experiencia humana.
            </p>
            <div className="mt-5 flex gap-3">
              {["IG", "FB", "TW"].map((red) => (
                <a
                  key={red}
                  href="#"
                  className="flex size-8 items-center justify-center rounded-full bg-white/5 text-xs font-medium text-zinc-400 ring-1 ring-white/10 transition hover:bg-amber-400/10 hover:text-amber-400 hover:ring-amber-400/30"
                >
                  {red}
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2 — Explorar */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              Explorar
            </h3>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: "Obras", href: "/obras" },
                { label: "Artistas", href: "#" },
                { label: "Catálogo", href: "#" },
                { label: "Cocina y Alimento", href: "#" },
                { label: "Eventos", href: "#" },
                { label: "Blog", href: "#" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-zinc-400 transition hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3 — Servicios */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              Servicios
            </h3>
            <ul className="mt-4 space-y-2.5">
              {[
                "Registro de Obras",
                "Restauración de Arte",
                "Manager de Ventas",
                "Grupo de Coleccionistas",
                "Exposición",
                "Museos y Galerías",
              ].map((s) => (
                <li key={s}>
                  <Link
                    href="#"
                    className="text-sm text-zinc-400 transition hover:text-white"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4 — Newsletter */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              Newsletter
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Novedades de la galería, subastas y próximos eventos — directo a
              tu correo.
            </p>

            {enviado ? (
              <p className="mt-4 rounded-xl bg-amber-400/10 px-4 py-3 text-sm text-amber-400 ring-1 ring-amber-400/20">
                ¡Gracias! Te avisaremos pronto.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full rounded-xl bg-zinc-900 px-4 py-2.5 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-zinc-500 focus:ring-amber-400/40"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-amber-400 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-amber-300 active:scale-95"
                >
                  Suscribirse
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Línea inferior */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-zinc-800 pt-6 sm:flex-row">
          <p className="text-xs text-zinc-600">
            © 2026 ERUDITO Galery. Todos los derechos reservados.
          </p>
          <div className="flex gap-5">
            {["Privacidad", "Términos", "Contacto"].map((l) => (
              <Link
                key={l}
                href="#"
                className="text-xs text-zinc-600 transition hover:text-zinc-400"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
