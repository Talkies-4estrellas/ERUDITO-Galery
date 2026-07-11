export type TipoEvento = "Subasta" | "Exposición";
export type Modalidad = "En línea" | "Presencial";

export interface Evento {
  id: number;
  tipo: TipoEvento;
  modalidad: Modalidad;
  titulo: string;
  fecha: string; // ISO yyyy-mm-dd
  fechaCorta: { dia: string; mes: string };
  lugar: string;
  imagen: string;
  descripcion: string;
}

export const eventos: Evento[] = [
  {
    id: 1,
    tipo: "Subasta",
    modalidad: "En línea",
    titulo: "Grandes Maestros: Expresionismo y Arte Digital",
    fecha: "2026-07-28",
    fechaCorta: { dia: "28", mes: "Jul" },
    lugar: "Subasta en línea — ERUDITO Galery",
    imagen: "/obras/merck-rathke/principal.jpg",
    descripcion:
      "Lotes de alto valor: Underground Fantasy (Merck Rathke, $54,500 MXN) y Colibrí en Flor (Ideas Creativas, $37,500 MXN). Piezas con certificación y tasación incluida.",
  },
  {
    id: 2,
    tipo: "Exposición",
    modalidad: "Presencial",
    titulo: "Revolution Canvas: La Ciudad Reimaginada",
    fecha: "2026-08-12",
    fechaCorta: { dia: "12", mes: "Ago" },
    lugar: "Galería ERUDITO — Ciudad de México",
    imagen: "/obras/bellas-artes-noche/principal.jpg",
    descripcion:
      "Muestra completa del colectivo Revolution Canvas: Noche Estrellada sobre Bellas Artes, El Ángel y La Creación — Pop Art. Un recorrido por los íconos de la Ciudad de México reinterpretados en arte digital.",
  },
  {
    id: 3,
    tipo: "Subasta",
    modalidad: "Presencial",
    titulo: "Colección Escultórica: Resina y Movimiento",
    fecha: "2026-08-22",
    fechaCorta: { dia: "22", mes: "Ago" },
    lugar: "Casa de Subastas ERUDITO — Guadalajara",
    imagen: "/obras/banda-rock-haucoze/principal.jpg",
    descripcion:
      "Tres colecciones en un solo evento: La Banda de Rock (HAUCOZE), El Lector (UTTCMK) y El Trío del Silencio (GMMH). Escultura figurativa y expresionista en resina de alta densidad.",
  },
  {
    id: 4,
    tipo: "Exposición",
    modalidad: "En línea",
    titulo: "Cultura Pop & Cartografía: Dos Mundos",
    fecha: "2026-07-20",
    fechaCorta: { dia: "20", mes: "Jul" },
    lugar: "Exposición digital — ERUDITO Galery",
    imagen: "/obras/sombrero-paja-wpap/principal.jpg",
    descripcion:
      "Diálogo entre lo contemporáneo y lo histórico: El Sombrero de Paja WPAP (Pop Maze Art) frente a la Mappa Mundi de John Senex (Carta Mundi). Arte que cruza siglos y géneros.",
  },
];
