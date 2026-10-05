"use client";

import { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    }).catch(() => {});
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
              <a href="#" aria-label="Instagram"
                className="flex size-8 items-center justify-center rounded-full bg-white/5 text-zinc-400 ring-1 ring-white/10 transition hover:bg-amber-400/10 hover:text-amber-400 hover:ring-amber-400/30">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" aria-label="Facebook"
                className="flex size-8 items-center justify-center rounded-full bg-white/5 text-zinc-400 ring-1 ring-white/10 transition hover:bg-amber-400/10 hover:text-amber-400 hover:ring-amber-400/30">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" aria-label="X / Twitter"
                className="flex size-8 items-center justify-center rounded-full bg-white/5 text-zinc-400 ring-1 ring-white/10 transition hover:bg-amber-400/10 hover:text-amber-400 hover:ring-amber-400/30">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2 — Explorar */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              Explorar
            </h3>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: "Obras", href: "/catalogo" },
                { label: "Artistas", href: "/artistas" },
                { label: "Galerías", href: "/galerias" },
                { label: "Catálogo", href: "/catalogo" },
                { label: "Favoritos", href: "/favoritos" },
                { label: "Cocina y Alimento", href: "/cocina" },
                { label: "Eventos", href: "/eventos" },
                { label: "Blog", href: "/blog" },
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
                { label: "Registro de Obras", href: "/servicios#registro-de-obras" },
                { label: "Restauración de Arte", href: "/servicios#restauracion-de-arte" },
                { label: "Manager de Ventas", href: "/servicios#manager-de-ventas" },
                { label: "Grupo de Coleccionistas", href: "/servicios#grupo-de-coleccionistas" },
                { label: "Exposición", href: "/servicios#exposicion" },
                { label: "Museos y Galerías", href: "/servicios#museos-asociaciones-y-galerias" },
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
            {[
              { label: "Privacidad", href: "#" },
              { label: "Términos", href: "#" },
              { label: "Contacto", href: "/contacto" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs text-zinc-600 transition hover:text-zinc-400"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
