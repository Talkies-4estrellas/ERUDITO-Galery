"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { menus, type MenuNav } from "@/data/navegacion";
import BuscadorModal from "@/components/BuscadorModal";
import BotonTema from "@/components/BotonTema";
import BotonAuth from "@/components/BotonAuth";
import { useFavoritos } from "@/hooks/useFavoritos";
import { useTema } from "@/hooks/useTema";
import { usePerfil } from "@/hooks/usePerfil";

/* ─── Grupos de menú explícitos ─── */
const PRIMARIOS   = ["Catálogo", "Artistas", "Cocina", "Eventos"];
const SECUNDARIOS = ["Servicios", "Blog", "Contacto"];
const menusIzq = menus.filter((m) => PRIMARIOS.includes(m.etiqueta));
const menusDer = menus.filter((m) => SECUNDARIOS.includes(m.etiqueta));

function Flecha({ abierta }: { abierta: boolean }) {
  return (
    <svg
      width="10" height="10" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      className={`shrink-0 transition-transform duration-200 ${abierta ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PanelDesplegable({
  menu,
  alineacion = "izquierda",
}: {
  menu: MenuNav;
  alineacion?: "izquierda" | "derecha";
}) {
  if (!menu.secciones) return null;
  const esMega = menu.secciones.length > 1;
  const posXMega = "inset-x-[-24px]"; // relativo al nav
  const posXSimple = alineacion === "derecha" ? "right-0 w-64" : "left-0 w-64";

  return (
    <div className={`absolute top-full z-50 pt-2 ${esMega ? posXMega : posXSimple}`}>
      <div className={`rounded-2xl bg-zinc-900/95 p-5 shadow-2xl ring-1 ring-white/10 backdrop-blur ${esMega ? "grid gap-6 grid-cols-3" : ""}`}>
        {menu.secciones.map((seccion, i) => (
          <div key={seccion.titulo ?? i}>
            {seccion.titulo && (
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-amber-400">
                {seccion.titulo}
              </p>
            )}
            <ul className="space-y-0.5">
              {seccion.items.map((item) => (
                <li key={item.etiqueta}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-2 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-amber-400"
                  >
                    {item.etiqueta}
                    {item.descripcion && (
                      <span className="mt-0.5 block text-xs text-zinc-500">{item.descripcion}</span>
                    )}
                  </Link>
                  {item.hijos && (
                    <ul className="ml-3 border-l border-white/10 pl-2">
                      {item.hijos.map((hijo) => (
                        <li key={hijo.etiqueta}>
                          <Link href={hijo.href} className="block rounded-lg px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-white/5 hover:text-amber-400">
                            {hijo.etiqueta}
                          </Link>
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

function ItemMenu({
  menu,
  menuAbierto,
  setMenuAbierto,
  alineacion,
}: {
  menu: MenuNav;
  menuAbierto: string | null;
  setMenuAbierto: (v: string | null) => void;
  alineacion: "izquierda" | "derecha";
}) {
  const activo = menuAbierto === menu.etiqueta;

  const esSecundario = !PRIMARIOS.includes(menu.etiqueta);
  const estiloBase = esSecundario
    ? "text-[12px] text-zinc-500 hover:text-zinc-200"
    : "text-[13px] text-zinc-200 hover:text-white";

  if (!menu.secciones) {
    return (
      <Link
        href={menu.href ?? "/"}
        onMouseEnter={() => setMenuAbierto(null)}
        className={`rounded-full px-2.5 py-1.5 transition-colors whitespace-nowrap ${estiloBase}`}
      >
        {menu.etiqueta}
      </Link>
    );
  }

  const esMega = menu.secciones.length > 1;

  return (
    <div className="relative">
      <button
        type="button"
        onMouseEnter={() => setMenuAbierto(menu.etiqueta)}
        onClick={() => setMenuAbierto(activo ? null : menu.etiqueta)}
        aria-expanded={activo}
        className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 transition-colors whitespace-nowrap ${
          activo ? "bg-white/10 text-amber-400" : estiloBase
        }`}
      >
        {menu.etiqueta}
        <Flecha abierta={activo} />
      </button>
      {/* Dropdown de sección única — relativo al <li> */}
      {!esMega && activo && (
        <PanelDesplegable menu={menu} alineacion={alineacion} />
      )}
    </div>
  );
}

function MenuMovil({ alCerrar, onBuscar }: { alCerrar: () => void; onBuscar?: () => void }) {
  const [abierto, setAbierto] = useState<string | null>(null);
  const { tema, alternar } = useTema();
  const { perfil } = usePerfil();

  return (
    <div className="mt-2 rounded-2xl bg-zinc-900/95 p-4 ring-1 ring-white/10 backdrop-blur lg:hidden">
      {onBuscar && (
        <button
          type="button"
          onClick={() => { onBuscar(); alCerrar(); }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-white/5 mb-1"
        >
          <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          Buscar obras, artistas…
        </button>
      )}
      <ul className="space-y-1">
        {menus.map((menu) => (
          <li key={menu.etiqueta}>
            {menu.secciones ? (
              <>
                <button
                  type="button"
                  onClick={() => setAbierto(abierto === menu.etiqueta ? null : menu.etiqueta)}
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
                          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-amber-400">
                            {seccion.titulo}
                          </p>
                        )}
                        <ul>
                          {seccion.items.map((item) => (
                            <li key={item.etiqueta}>
                              <Link href={item.href} onClick={alCerrar}
                                className="block rounded-lg px-2 py-1.5 text-sm text-zinc-400 hover:text-amber-400">
                                {item.etiqueta}
                              </Link>
                              {item.hijos && (
                                <ul className="ml-4 border-l border-white/10 pl-2">
                                  {item.hijos.map((hijo) => (
                                    <li key={hijo.etiqueta}>
                                      <Link href={hijo.href} onClick={alCerrar}
                                        className="block px-2 py-1 text-xs text-zinc-500 hover:text-amber-400">
                                        {hijo.etiqueta}
                                      </Link>
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
              <Link href={menu.href ?? "/"} onClick={alCerrar}
                className="block rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-white/5">
                {menu.etiqueta}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Auth + Tema en móvil */}
      <div className="mt-3 border-t border-white/10 pt-3 flex items-center gap-1">
        {perfil ? (
          <Link
            href="/perfil"
            onClick={alCerrar}
            className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-white/5"
          >
            <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            Mi perfil
          </Link>
        ) : (
          <Link
            href="/login"
            onClick={alCerrar}
            className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm text-amber-400 hover:bg-white/5"
          >
            <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            Iniciar sesión
          </Link>
        )}
        <button
          type="button"
          onClick={alternar}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5"
        >
          {tema === "oscuro" ? (
            <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
          ) : (
            <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
          )}
          {tema === "oscuro" ? "Tema claro" : "Tema oscuro"}
        </button>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [menuAbierto, setMenuAbierto]     = useState<string | null>(null);
  const [movilAbierto, setMovilAbierto]   = useState(false);
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const [queryBusqueda, setQueryBusqueda] = useState("");
  const { favoritos, listo: favoritosListos } = useFavoritos();

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

  return (
    <>
      <header className="relative z-50 px-4 pt-4 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <nav
            className="relative"
            onMouseLeave={() => setMenuAbierto(null)}
          >
            {/* ── Barra principal ── */}
            <div className="relative flex items-center rounded-2xl bg-zinc-900/90 px-5 py-3 ring-1 ring-white/10 backdrop-blur">

              {/* ── Izquierda (flex-1): menús primarios alineados a la izquierda ── */}
              <div className="flex flex-1 items-center">
                <ul className="hidden items-center gap-0.5 lg:flex">
                  {menusIzq.map((menu) => (
                    <li key={menu.etiqueta}>
                      <ItemMenu
                        menu={menu}
                        menuAbierto={menuAbierto}
                        setMenuAbierto={setMenuAbierto}
                        alineacion="izquierda"
                      />
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── Centro: logo absolutamente centrado ── */}
              <Link
                href="/"
                className="absolute left-1/2 -translate-x-1/2 select-none text-center text-base font-bold tracking-[0.2em] text-white transition hover:opacity-80"
                onMouseEnter={() => setMenuAbierto(null)}
              >
                ERUDITO<br />
                <span className="text-amber-400 tracking-[0.3em]">GALERY</span>
              </Link>

              {/* ── Derecha (flex-1): menús secundarios + acciones alineados a la derecha ── */}
              <div className="flex flex-1 items-center justify-end gap-2">

                {/* Links secundarios */}
                <ul className="hidden items-center gap-0.5 lg:flex">
                  {menusDer.map((menu) => (
                    <li key={menu.etiqueta}>
                      <ItemMenu
                        menu={menu}
                        menuAbierto={menuAbierto}
                        setMenuAbierto={setMenuAbierto}
                        alineacion="derecha"
                      />
                    </li>
                  ))}
                </ul>

                {/* Separadores */}
                <div className="hidden h-4 w-px bg-white/10 lg:block" />

                {/* Búsqueda — oculto en móvil, visible desde sm */}
                <button
                  type="button"
                  aria-label="Abrir buscador"
                  onClick={() => { setBuscadorAbierto(true); setQueryBusqueda(""); }}
                  className="hidden sm:flex items-center justify-center rounded-full bg-white/5 p-2 text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-amber-400"
                >
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </button>

                {/* Favoritos */}
                <Link
                  href="/favoritos"
                  aria-label="Favoritos"
                  className="relative hidden items-center justify-center rounded-full bg-white/5 p-2 text-zinc-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-amber-400 sm:flex"
                >
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                  {favoritosListos && favoritos.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold text-zinc-900">
                      {favoritos.length}
                    </span>
                  )}
                </Link>

                {/* Auth — solo visible en sm+ */}
                <div className="hidden sm:block">
                  <BotonAuth />
                </div>

                {/* Tema — solo visible en sm+ */}
                <div className="hidden sm:block">
                  <BotonTema />
                </div>

                {/* Hamburguesa móvil */}
                <button
                  type="button"
                  aria-label="Abrir menú"
                  onClick={() => setMovilAbierto(!movilAbierto)}
                  className="flex flex-col gap-1.5 lg:hidden"
                >
                  <span className="h-0.5 w-5 bg-zinc-400" />
                  <span className="h-0.5 w-5 bg-zinc-400" />
                  <span className="h-0.5 w-5 bg-zinc-400" />
                </button>
              </div>
            </div>

            {/* ── Mega-menús (posicionados relativos al nav) ── */}
            {menus.map(
              (menu) =>
                menu.secciones &&
                menu.secciones.length > 1 &&
                menuAbierto === menu.etiqueta && (
                  <PanelDesplegable key={menu.etiqueta} menu={menu} alineacion="izquierda" />
                )
            )}
          </nav>

          {movilAbierto && (
            <MenuMovil
              alCerrar={() => setMovilAbierto(false)}
              onBuscar={() => { setMovilAbierto(false); setBuscadorAbierto(true); setQueryBusqueda(""); }}
            />
          )}
        </div>
      </header>

      <BuscadorModal
        open={buscadorAbierto}
        onClose={() => { setBuscadorAbierto(false); setQueryBusqueda(""); }}
        query={queryBusqueda}
        setQuery={setQueryBusqueda}
      />
    </>
  );
}
