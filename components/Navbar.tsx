"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menus, type MenuNav } from "@/data/navegacion";
import BuscadorModal from "@/components/BuscadorModal";
import BotonTema from "@/components/BotonTema";
import BotonAuth from "@/components/BotonAuth";
import { useFavoritos } from "@/hooks/useFavoritos";
import { usePerfil } from "@/hooks/usePerfil";
import { useTema } from "@/hooks/useTema";
import { useBajandoScroll } from "@/hooks/useBajandoScroll";
import { useAparecer, entradaCascada } from "@/hooks/useAparecer";

/* ─── Grupos de menú explícitos ─── */
const PRIMARIOS   = ["Catálogo", "Artistas", "Cocina", "Eventos"];
const SECUNDARIOS = ["Servicios", "Blog", "Contacto"];
const menusIzq = menus.filter((m) => PRIMARIOS.includes(m.etiqueta));
const menusDer = menus.filter((m) => SECUNDARIOS.includes(m.etiqueta));

/* Rutas que pertenecen a cada sección del menú (para el subrayado activo en PC) */
const RUTAS_EXTRA: Record<string, string[]> = {
  "Catálogo": ["/catalogo", "/obra"],
  "Artistas": ["/artista", "/empresa"],
};
const RUTAS_MENU = menus
  .filter((m) => m.href !== "/")
  .map((m) => ({
    etiqueta: m.etiqueta,
    rutas: [
      ...(m.href ? [m.href] : []),
      ...(m.secciones ?? []).flatMap((s) => s.items.flatMap((it) => [it.href, ...(it.hijos ?? []).map((h) => h.href)])),
      ...(RUTAS_EXTRA[m.etiqueta] ?? []),
    ],
  }));

function seccionActiva(pathname: string) {
  return RUTAS_MENU.find(({ rutas }) =>
    rutas.some((r) => pathname === r || pathname.startsWith(r + "/"))
  )?.etiqueta ?? null;
}

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
  const visible = useAparecer();
  if (!menu.secciones) return null;
  const esMega = menu.secciones.length > 1;
  const posXMega = "inset-x-[-24px]"; // relativo al nav
  const posXSimple = alineacion === "derecha" ? "right-0 w-64" : "left-0 w-64";
  let orden = 0;

  return (
    <div className={`absolute top-full z-50 pt-2 ${esMega ? posXMega : posXSimple}`}>
      <div
        className={`rounded-2xl bg-zinc-900/95 p-5 shadow-2xl ring-1 ring-white/10 backdrop-blur transition duration-200 ease-out motion-reduce:transition-none ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        } ${esMega ? "grid gap-6 grid-cols-3" : ""}`}
      >
        {menu.secciones.map((seccion, i) => (
          <div key={seccion.titulo ?? i}>
            {seccion.titulo && (
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-amber-400">
                {seccion.titulo}
              </p>
            )}
            <ul className="space-y-0.5">
              {seccion.items.map((item) => (
                <li key={item.etiqueta} {...entradaCascada(visible, orden++)}>
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
  const visible = useAparecer();
  const { perfil } = usePerfil();
  const aparece = (i: number) => entradaCascada(visible, i);

  return (
    <div
      className={`absolute inset-x-0 top-full mt-2 max-h-[calc(100dvh-13rem)] overflow-y-auto overscroll-contain rounded-2xl bg-zinc-900/95 p-4 ring-1 ring-white/10 backdrop-blur transition duration-200 ease-out motion-reduce:transition-none lg:hidden ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      {onBuscar && (
        <div {...aparece(0)}>
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
        </div>
      )}
      <ul className="space-y-1">
        {menus.map((menu, i) => (
          <li key={menu.etiqueta} {...aparece(i + 1)}>
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
      <div
        className={`mt-3 flex items-center gap-1 border-t border-white/10 pt-3 ${aparece(menus.length + 1).className}`}
        style={aparece(menus.length + 1).style}
      >
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
  const { tema } = useTema();
  const logoSufijo = tema === "claro" ? "-amarillo" : "";
  // Al bajar: en celular la barra se esconde; en PC se compacta
  const bajando = useBajandoScroll(movilAbierto);
  const headerRef = useRef<HTMLElement>(null);
  const barraRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const activa = seccionActiva(pathname);
  const [subrayado, setSubrayado] = useState<{ x: number; ancho: number } | null>(null);

  // Mide la sección activa para colocar el subrayado deslizante (solo visible en PC)
  useLayoutEffect(() => {
    const barra = barraRef.current;
    if (!barra) return;
    const medir = () => {
      const item = activa ? barra.querySelector<HTMLElement>(`[data-menu="${activa}"] > *`) : null;
      if (!item || item.offsetParent === null) return setSubrayado(null);
      const rb = barra.getBoundingClientRect();
      const ri = item.getBoundingClientRect();
      setSubrayado({ x: ri.left - rb.left + 10, ancho: ri.width - 20 });
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(barra);
    return () => ro.disconnect();
  }, [activa]);

  // El menú móvil se cierra con cualquier gesto fuera de la barra (tocar, deslizar o rueda).
  // No se usa el evento scroll: el navegador mueve la página solo al crecer el menú (scroll anchoring).
  useEffect(() => {
    if (!movilAbierto) return;
    const fuera = (e: Event) => {
      if (!headerRef.current?.contains(e.target as Node)) setMovilAbierto(false);
    };
    const eventos = ["pointerdown", "touchmove", "wheel"] as const;
    eventos.forEach((ev) => document.addEventListener(ev, fuera, { passive: true }));
    return () => eventos.forEach((ev) => document.removeEventListener(ev, fuera));
  }, [movilAbierto]);

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
      <header
        ref={headerRef}
        // En PC el alto del header queda fijo (lg:h-18): si cambiara al compactarse, el contenido
        // se movería, el navegador corregiría el scroll y la barra oscilaría entre compacta y normal.
        className={`relative z-50 px-4 pt-4 sm:px-8 lg:sticky lg:top-0 lg:h-18 max-sm:sticky max-sm:top-0 max-sm:transition-transform max-sm:duration-300 max-sm:ease-out lg:transition-[padding] lg:duration-300 motion-reduce:transition-none ${
          bajando ? "max-sm:-translate-y-[110%] lg:pt-2" : ""
        }`}
      >
        <div className="relative mx-auto max-w-7xl">
          <nav
            className="relative"
            onMouseLeave={() => setMenuAbierto(null)}
          >
            {/* ── Barra principal ── */}
            <div
              ref={barraRef}
              className={`relative flex items-center rounded-2xl px-5 py-3 ring-1 ring-white/10 backdrop-blur lg:transition-[padding,background-color] lg:duration-300 motion-reduce:transition-none ${
                bajando ? "bg-zinc-900/90 lg:bg-zinc-900/95 lg:py-1.5" : "bg-zinc-900/90"
              }`}
            >
              {/* Subrayado deslizante bajo la sección activa (PC) */}
              <span
                aria-hidden
                className={`pointer-events-none absolute bottom-1 left-0 hidden h-0.5 rounded-full bg-amber-400 transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.34,1.2,0.64,1)] motion-reduce:transition-none lg:block ${
                  subrayado ? "opacity-100" : "opacity-0"
                }`}
                style={subrayado ? { transform: `translateX(${subrayado.x}px)`, width: subrayado.ancho } : undefined}
              />

              {/* ── Izquierda (flex-1): menús primarios alineados a la izquierda ── */}
              <div className="flex flex-1 items-center">
                {/* Tema junto al logo en móvil */}
                <div className="lg:hidden">
                  <BotonTema />
                </div>
                <ul className="hidden items-center gap-0.5 lg:flex">
                  {menusIzq.map((menu) => (
                    <li key={menu.etiqueta} data-menu={menu.etiqueta}>
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
                className="absolute left-1/2 -translate-x-1/2 select-none transition hover:opacity-80"
                onMouseEnter={() => setMenuAbierto(null)}
              >
                <img
                  src={`/logo-pc${logoSufijo}.svg`}
                  alt="ERUDITO Galery"
                  className={`hidden w-auto transition-[height] duration-300 motion-reduce:transition-none lg:block ${bajando ? "h-6" : "h-8"}`}
                />
                <img src={`/logo-movil${logoSufijo}.svg`} alt="ERUDITO Galery" className="block  h-9 w-auto lg:hidden" />
              </Link>

              {/* ── Derecha (flex-1): menús secundarios + acciones alineados a la derecha ── */}
              <div className="flex flex-1 items-center justify-end gap-2">

                {/* Links secundarios */}
                <ul className="hidden items-center gap-0.5 lg:flex">
                  {menusDer.map((menu) => (
                    <li key={menu.etiqueta} data-menu={menu.etiqueta}>
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
                  aria-label={movilAbierto ? "Cerrar menú" : "Abrir menú"}
                  aria-expanded={movilAbierto}
                  onClick={() => setMovilAbierto(!movilAbierto)}
                  className="flex flex-col gap-1.5 lg:hidden [&>span]:transition [&>span]:duration-200 motion-reduce:[&>span]:transition-none"
                >
                  <span className={`h-0.5 w-5 bg-zinc-400 ${movilAbierto ? "translate-y-2 rotate-45" : ""}`} />
                  <span className={`h-0.5 w-5 bg-zinc-400 ${movilAbierto ? "opacity-0" : ""}`} />
                  <span className={`h-0.5 w-5 bg-zinc-400 ${movilAbierto ? "-translate-y-2 -rotate-45" : ""}`} />
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
