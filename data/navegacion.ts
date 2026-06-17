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
          { etiqueta: "Pinturas", href: "/obras?tecnica=oleo" },
          { etiqueta: "Esculturas", href: "/obras?tecnica=escultura" },
          { etiqueta: "Digital", href: "/obras?tecnica=digital" },
          { etiqueta: "Artesanías", href: "/obras?tecnica=mixta" },
          { etiqueta: "Colecciones", href: "/obras" },
          { etiqueta: "Artículos Coleccionables", href: "/obras" },
          { etiqueta: "Impresiones Oficiales", href: "/obras?tecnica=acuarela" },
          { etiqueta: "Merch", href: "/obras" },
          { etiqueta: "Réplicas Decorativas", href: "/obras" },
          { etiqueta: "Drops", href: "/obras" },
        ],
      },
      {
        titulo: "Por tamaño",
        items: [
          { etiqueta: "Grande", href: "/obras?tamano=grande" },
          { etiqueta: "Mediano", href: "/obras?tamano=mediano" },
          { etiqueta: "Pequeño", href: "/obras?tamano=peque%C3%B1o" },
        ],
      },
      {
        titulo: "Estilo",
        items: [
          { etiqueta: "Muralismo", href: "/obras?movimiento=muralismo" },
          { etiqueta: "Modernismo", href: "/obras?movimiento=modernismo" },
          { etiqueta: "Realismo", href: "/obras?movimiento=realismo" },
          { etiqueta: "Simbolismo", href: "/obras?movimiento=simbolismo" },
          { etiqueta: "Abstracto", href: "/obras?movimiento=abstracto" },
          { etiqueta: "Retrato", href: "/obras?movimiento=retrato" },
          { etiqueta: "Paisajismo", href: "/obras?movimiento=paisajismo" },
          { etiqueta: "Fotografía", href: "/obras?tecnica=fotografia" },
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
          { etiqueta: "En Línea", href: "/catalogo#en-linea" },
          { etiqueta: "Historias", href: "/catalogo#historias" },
          { etiqueta: "Físicos", href: "/catalogo#fisicos" },
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
