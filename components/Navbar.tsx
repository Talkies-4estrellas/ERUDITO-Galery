"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { menus, type MenuNav } from "@/data/navegacion";
import BuscadorModal from "@/components/BuscadorModal";
import BotonTema from "@/components/BotonTema";
import BotonAuth from "@/components/BotonAuth";
import { useFavoritos } from "@/hooks/useFavoritos";

function Flecha({ abierta }: { abierta: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={`transition-transform duration-200 ${abierta ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PanelDesplegable({ menu }: { menu: MenuNav }) {
  if (!menu.secciones) return null;
  const esMega = menu.secciones.length > 1;

  return (
    <div
      className={`absolute top-full z-50 pt-2 ${
        esMega ? "inset-x-0" : "right-0 w-72"
      }`}
    >
      <div
        className={`rounded-2xl bg-zinc-900/95 p-6 shadow-2xl ring-1 ring-white/10 backdrop-blur ${
          esMega ? "grid grid-cols-3 gap-8" : ""
        }`}
      >
        {menu.secciones.map((seccion, i) => (
          <div key={seccion.titulo ?? i}>
            {seccion.titulo && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-400">
                {seccion.titulo}
              </p>
            )}
            <ul className="space-y-1">
              {seccion.items.map((item) => (
                <li key={item.etiqueta}>
                  <a
                    href={item.href}
                    className="block rounded-lg px-2 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-amber-400"
                  >
                    {item.etiqueta}
                    {item.descripcion && (
                      <span className="mt-0.5 block text-xs text-zinc-500">
                        {item.descripcion}
                      </span>
                    )}
                  </a>
                  {item.hijos && (
                    <ul className="ml-4 border-l border-white/10 pl-2">
                      {item.hijos.map((hijo) => (
                        <li key={hijo.etiqueta}>
                          <a
                            href={hijo.href}
                            className="block rounded-lg px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-white/5 hover:text-amber-400"
                          >
                            {hijo.etiqueta}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuMovil({ alCerrar }: { alCerrar: () => void }) {
  const [abierto, setAbierto] = useState<string | null>(null);

  return (
    <div className="mt-2 rounded-2xl bg-zinc-900/95 p-4 ring-1 ring-white/10 backdrop-blur lg:hidden">
      <ul className="space-y-1">
        {menus.map((menu) => (
          <li key={menu.etiqueta}>
            {menu.secciones ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setAbierto(abierto === menu.etiqueta ? null : menu.etiqueta)
                  }
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
                >
                  {menu.etiqueta}
                  <Flecha abierta={abierto === menu.etiqueta} />
                </button>
                {abierto === menu.etiqueta && (
                  <div className="space-y-3 px-3 pb-2 pt-1">
                    {menu.secciones.map((seccion, i) => (
                      <div key={seccion.titulo ?? i}>
                        {seccion.titulo && (
                          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
                            {seccion.titulo}
                          </p>
                        )}
                        <ul>
                          {seccion.items.map((item) => (
                            <li key={item.etiqueta}>
                              <a
                                href={item.href}
                                onClick={alCerrar}
                                className="block rounded-lg px-2 py-1.5 text-sm text-zinc-400 hover:text-amber-400"
                              >
                                {item.etiqueta}
                              </a>
                              {item.hijos && (
                                <ul className="ml-4 border-l border-white/10 pl-2">
                                  {item.hijos.map((hijo) => (
                                    <li key={hijo.etiqueta}>
                                      <a
                                        href={hijo.href}
                                        onClick={alCerrar}
                                        className="block px-2 py-1 text-xs text-zinc-500 hover:text-amber-400"
                                      >
                                        {hijo.etiqueta}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <a
                href={menu.href}
                onClick={alCerrar}
                className="block rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
              >
                {menu.etiqueta}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);
  const [movilAbierto, setMovilAbierto] = useState(false);
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const [queryBusqueda, setQueryBusqueda] = useState("");
  const { favoritos, listo: favoritosListos } = useFavoritos();

  // Atajo de teclado global: Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setBuscadorAbierto(true);
        setQueryBusqueda("");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  function abrirBuscador() {
    setQueryBusqueda("");
    setBuscadorAbierto(true);
  }

  function cerrarBuscador() {
    setBuscadorAbierto(false);
    setQueryBusqueda("");
  }

  return (
    <>
      <header className="relative z-50 px-4 pt-4 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <nav className="relative" onMouseLeave={() => setMenuAbierto(null)}>
            <div className="flex items-center justify-between rounded-2xl bg-zinc-900/90 px-6 py-4 ring-1 ring-white/10 backdrop-blur">
              <a href="/" className="text-lg font-semibold tracking-widest text-white">
                ERUDITO <span className="text-amber-400">GALERY</span>
              </a>

              <ul className="hidden flex-wrap items-center justify-end gap-x-0.5 gap-y-1 lg:flex">
                {menus.map((menu) => (
                  <li key={menu.etiqueta} className="relative">
                    {menu.secciones ? (
                      <button
                        type="button"
                        onMouseEnter={() => setMenuAbierto(menu.etiqueta)}
                        onClick={() => setMenuAbierto(menu.etiqueta)}
                        aria-expanded={menuAbierto === menu.etiqueta}
                        className={`flex items-center gap-1 rounded-full px-2 py-1.5 text-[13px] transition-colors ${
                          menuAbierto === menu.etiqueta
                            ? "bg-white/10 text-amber-400"
                            : "text-zinc-300 hover:text-amber-400"
                        }`}
                      >
                        {menu.etiqueta}
                        <Flecha abierta={menuAbierto === menu.etiqueta} />
                      </button>
                    ) : (
                      <a
                        href={menu.href}
                        onMouseEnter={() => setMenuAbierto(null)}
                        className="rounded-full px-2 py-1.5 text-[13px] text-zinc-300 transition-colors hover:text-amber-400"
                      >
                        {menu.etiqueta}
                      </a>
                    )}
                    {menu.secciones &&
                      menu.secciones.length === 1 &&
                      menuAbierto === menu.etiqueta && (
                        <PanelDesplegable menu={menu} />
                      )}
                  </li>
                ))}
              </ul>

              {/* Botón lupa + hamburguesa */}
              <div className="flex items-center gap-3">
                {/* Botón de búsqueda */}
                <button
                  type="button"
                  aria-label="Abrir buscador"
                  onClick={abrirBuscador}
                  className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-amber-400"
                >
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                  <kbd className="hidden text-[10px] font-medium text-zinc-500 sm:block">
                    ⌘K
                  </kbd>
                </button>

                {/* Favoritos */}
                <Link
                  href="/favoritos"
                  aria-label="Ver favoritos"
                  className="relative flex items-center justify-center rounded-full bg-white/5 p-2 text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-amber-400"
                >
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                  {favoritosListos && favoritos.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold text-zinc-900">
                      {favoritos.length}
                    </span>
                  )}
                </Link>

                {/* Perfil */}
                <Link
                  href="/perfil"
                  aria-label="Mi perfil"
                  className="flex items-center justify-center rounded-full bg-white/5 p-2 text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-amber-400"
                >
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </Link>

                {/* Auth */}
                <BotonAuth />

                {/* Toggle de tema */}
                <BotonTema />

                {/* Hamburguesa */}
                <button
                  type="button"
                  aria-label="Abrir menú"
                  onClick={() => setMovilAbierto(!movilAbierto)}
                  className="flex flex-col gap-1.5 lg:hidden"
                >
                  <span className="h-0.5 w-6 bg-zinc-300" />
                  <span className="h-0.5 w-6 bg-zinc-300" />
                  <span className="h-0.5 w-6 bg-zinc-300" />
                </button>
              </div>
            </div>

            {/* Mega-menús de escritorio */}
            {menus.map(
              (menu) =>
                menu.secciones &&
                menu.secciones.length > 1 &&
                menuAbierto === menu.etiqueta && (
                  <PanelDesplegable key={menu.etiqueta} menu={menu} />
                )
            )}
          </nav>

          {movilAbierto && <MenuMovil alCerrar={() => setMovilAbierto(false)} />}
        </div>
      </header>

      {/* Modal de búsqueda */}
      <BuscadorModal
        open={buscadorAbierto}
        onClose={cerrarBuscador}
        query={queryBusqueda}
        setQuery={setQueryBusqueda}
      />
    </>
  );
}
