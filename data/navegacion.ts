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
          { etiqueta: "Pinturas", href: "/obras" },
          { etiqueta: "Esculturas", href: "/obras" },
          { etiqueta: "Digital", href: "/obras" },
          { etiqueta: "Artesanías", href: "/obras" },
          { etiqueta: "Colecciones", href: "/obras" },
          { etiqueta: "Artículos Coleccionables", href: "/obras" },
          { etiqueta: "Impresiones Oficiales", href: "/obras" },
          { etiqueta: "Merch", href: "/obras" },
          { etiqueta: "Réplicas Decorativas", href: "/obras" },
          { etiqueta: "Drops", href: "/obras" },
        ],
      },
      {
        titulo: "Filtros",
        items: [
          { etiqueta: "Tamaños", href: "/obras" },
          { etiqueta: "Color", href: "/obras" },
          { etiqueta: "Movimiento", href: "/obras" },
          { etiqueta: "Técnica", href: "/obras" },
        ],
      },
      {
        titulo: "Técnica",
        items: [
          { etiqueta: "Abstracto", href: "/obras" },
          { etiqueta: "Escultura", href: "/obras" },
          { etiqueta: "Retrato", href: "/obras" },
          { etiqueta: "Fotografía", href: "/obras" },
          { etiqueta: "Paisajismo", href: "/obras" },
          { etiqueta: "Artistas Famosos", href: "/obras" },
          { etiqueta: "Artesanos", href: "/obras" },
          { etiqueta: "Ofertas Especiales", href: "/obras" },
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
            href: "#",
            descripcion: "Creadores de arte tradicional y artesanal",
          },
          {
            etiqueta: "Artistas en línea",
            href: "#",
            descripcion: "Extranjeros y famosos del mundo digital",
          },
          {
            etiqueta: "Artistas presenciales",
            href: "#",
            descripcion: "Arte físico (off-line)",
          },
          {
            etiqueta: "Filtros",
            href: "#",
            descripcion: "Busca artistas por estilo o región",
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
          { etiqueta: "En Línea", href: "#" },
          { etiqueta: "Historias", href: "#" },
          { etiqueta: "Físicos", href: "#" },
        ],
      },
    ],
  },
  {
    etiqueta: "Servicios",
    secciones: [
      {
        items: [
          { etiqueta: "Registro de Obras", href: "#" },
          { etiqueta: "Grupo de Coleccionistas", href: "#" },
          { etiqueta: "Restauración de Arte", href: "#" },
          { etiqueta: "Museos, Asociaciones y Galerías", href: "#" },
          { etiqueta: "Manager de Ventas", href: "#" },
          { etiqueta: "Exposición", href: "#" },
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
            href: "#",
            hijos: [
              { etiqueta: "Subastas en línea", href: "#" },
              { etiqueta: "Subastas presenciales", href: "#" },
            ],
          },
          { etiqueta: "Exposiciones", href: "#" },
          { etiqueta: "Museos, Asociaciones y Galerías", href: "#" },
          { etiqueta: "Manager de Ventas", href: "#" },
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
            href: "#",
            descripcion: "La comida hoy en día también es un lujo",
          },
        ],
      },
    ],
  },
  { etiqueta: "Blog", href: "#" },
  { etiqueta: "Newsletter", href: "#" },
  { etiqueta: "Privado", href: "#" },
  { etiqueta: "Contacto", href: "#" },
];
