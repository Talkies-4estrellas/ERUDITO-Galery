export interface ItemNav {
  etiqueta: string;
  href: string;
  descripcion?: string;
  hijos?: ItemNav[];
}

export interface SeccionMenu {
  titulo?: string;
  items: ItemNav[];
}

export interface MenuNav {
  etiqueta: string;
  href?: string;
  secciones?: SeccionMenu[];
}

export const menus: MenuNav[] = [
  { etiqueta: "Inicio", href: "/" },
  {
    etiqueta: "Catálogo",
    secciones: [
      {
        items: [
          { etiqueta: "Físicos",   href: "/catalogo/fisicos"   },
          { etiqueta: "Digitales", href: "/catalogo/digitales" },
        ],
      },
    ],
  },
  {
    etiqueta: "Artistas",
    secciones: [
      {
        items: [
          {
            etiqueta: "Artesanos",
            href: "/artistas/artesanos",
            descripcion: "Creadores de arte tradicional y artesanal",
          },
          {
            etiqueta: "Artistas",
            href: "/artistas",
            descripcion: "Catálogo completo de artistas de la galería",
          },
          {
            etiqueta: "Artistas Digitales",
            href: "/artistas/digitales",
            descripcion: "Arte digital, prints y colecciones virtuales",
          },
        ],
      },
    ],
  },
  {
    etiqueta: "Servicios",
    secciones: [
      {
        items: [
          { etiqueta: "Registro de Obras", href: "/servicios/registro-de-obras" },
          { etiqueta: "Grupo de Coleccionistas", href: "/servicios/grupo-de-coleccionistas" },
          { etiqueta: "Restauración de Arte", href: "/servicios/restauracion-de-arte" },
          { etiqueta: "Museos, Asociaciones y Galerías", href: "/servicios/museos-asociaciones-y-galerias" },
          { etiqueta: "Manager de Ventas", href: "/servicios/manager-de-ventas" },
          { etiqueta: "Exposición", href: "/servicios/exposicion" },
        ],
      },
    ],
  },
  {
    etiqueta: "Eventos",
    secciones: [
      {
        items: [
          { etiqueta: "Eventos", href: "/eventos", descripcion: "Toda la agenda de la galería" },
          { etiqueta: "Subastas", href: "/eventos/subastas", descripcion: "Obras en subasta, en línea y presenciales" },
          { etiqueta: "Exposiciones", href: "/eventos/exposiciones", descripcion: "Muestras y exhibiciones de la galería" },
        ],
      },
    ],
  },
  {
    etiqueta: "Cocina",
    secciones: [
      {
        items: [
          {
            etiqueta: "Productos",
            href: "/cocina",
            descripcion: "La comida hoy en día también es un lujo",
          },
        ],
      },
    ],
  },
  { etiqueta: "Blog", href: "/blog" },
  { etiqueta: "Contacto", href: "/contacto" },
];
