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
