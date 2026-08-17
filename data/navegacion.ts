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
    etiqueta: "Obras",
    secciones: [
      {
        titulo: "Categorías",
        items: [
          { etiqueta: "Pinturas",              href: "/catalogo/fisicos"   },
          { etiqueta: "Esculturas",            href: "/catalogo/fisicos"   },
          { etiqueta: "Digital",               href: "/catalogo/digitales" },
          { etiqueta: "Artesanías",            href: "/catalogo/fisicos"   },
          { etiqueta: "Colecciones",           href: "/catalogo"           },
          { etiqueta: "Artículos Coleccionables", href: "/catalogo/fisicos" },
          { etiqueta: "Impresiones Oficiales", href: "/catalogo/digitales" },
          { etiqueta: "Merch",                 href: "/catalogo"           },
          { etiqueta: "Réplicas Decorativas",  href: "/catalogo/fisicos"   },
          { etiqueta: "Drops",                 href: "/catalogo"           },
        ],
      },
      {
        titulo: "Por tamaño",
        items: [
          { etiqueta: "Grande",  href: "/catalogo/fisicos" },
          { etiqueta: "Mediano", href: "/catalogo/fisicos" },
          { etiqueta: "Pequeño", href: "/catalogo/fisicos" },
        ],
      },
      {
        titulo: "Estilo",
        items: [
          { etiqueta: "Muralismo",  href: "/catalogo/fisicos"   },
          { etiqueta: "Modernismo", href: "/catalogo/fisicos"   },
          { etiqueta: "Realismo",   href: "/catalogo/fisicos"   },
          { etiqueta: "Simbolismo", href: "/catalogo/fisicos"   },
          { etiqueta: "Abstracto",  href: "/catalogo/fisicos"   },
          { etiqueta: "Retrato",    href: "/catalogo/fisicos"   },
          { etiqueta: "Paisajismo", href: "/catalogo/fisicos"   },
          { etiqueta: "Fotografía", href: "/catalogo/digitales" },
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
            href: "/artistas",
            descripcion: "Creadores de arte tradicional y artesanal",
          },
          {
            etiqueta: "Artistas en línea",
            href: "/artistas",
            descripcion: "Extranjeros y famosos del mundo digital",
          },
          {
            etiqueta: "Artistas presenciales",
            href: "/artistas",
            descripcion: "Arte físico (off-line)",
          },
          {
            etiqueta: "Ver todos",
            href: "/artistas",
            descripcion: "Catálogo completo de artistas de la galería",
          },
        ],
      },
    ],
  },
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
    etiqueta: "Servicios",
    secciones: [
      {
        items: [
          { etiqueta: "Registro de Obras", href: "/servicios#registro-de-obras" },
          { etiqueta: "Grupo de Coleccionistas", href: "/servicios#grupo-de-coleccionistas" },
          { etiqueta: "Restauración de Arte", href: "/servicios#restauracion-de-arte" },
          { etiqueta: "Museos, Asociaciones y Galerías", href: "/servicios#museos-asociaciones-y-galerias" },
          { etiqueta: "Manager de Ventas", href: "/servicios#manager-de-ventas" },
          { etiqueta: "Exposición", href: "/servicios#exposicion" },
        ],
      },
    ],
  },
  {
    etiqueta: "Eventos",
    secciones: [
      {
        items: [
          {
            etiqueta: "Subastas",
            href: "/eventos",
            hijos: [
              { etiqueta: "Subastas en línea", href: "/eventos" },
              { etiqueta: "Subastas presenciales", href: "/eventos" },
            ],
          },
          { etiqueta: "Exposiciones", href: "/eventos" },
          { etiqueta: "Museos, Asociaciones y Galerías", href: "/servicios#museos-asociaciones-y-galerias" },
          { etiqueta: "Manager de Ventas", href: "/servicios#manager-de-ventas" },
        ],
      },
    ],
  },
  {
    etiqueta: "Cocina y Alimento",
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
  { etiqueta: "Newsletter", href: "/#newsletter" },
  { etiqueta: "Privado", href: "/privado" },
  { etiqueta: "Contacto", href: "/contacto" },
];
