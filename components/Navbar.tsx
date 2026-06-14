"use client";

import { useState } from "react";
import { menus, type MenuNav } from "@/data/navegacion";

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

  return (
    <header className="relative z-50 px-4 pt-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <nav
          className="relative"
          onMouseLeave={() => setMenuAbierto(null)}
        >
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
                  {/* Dropdown simple anclado a su botón */}
                  {menu.secciones &&
                    menu.secciones.length === 1 &&
                    menuAbierto === menu.etiqueta && (
                      <PanelDesplegable menu={menu} />
                    )}
                </li>
              ))}
            </ul>

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

          {/* Mega-menús anclados al ancho del navbar (escritorio) */}
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
  );
}
