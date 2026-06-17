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
    titulo: "Maestros del Muralismo Mexicano",
    fecha: "2026-06-28",
    fechaCorta: { dia: "28", mes: "Jun" },
    lugar: "Subasta en línea — ERUDITO Galery",
    imagen: "https://picsum.photos/seed/evento-1/700/500",
    descripcion:
      "Obras seleccionadas de Diego Rivera y Jorge González Camarena, con piezas de colección privada inéditas.",
  },
  {
    id: 2,
    tipo: "Exposición",
    modalidad: "Presencial",
    titulo: "Retratos del Alma: Obregón y Herrán",
    fecha: "2026-07-12",
    fechaCorta: { dia: "12", mes: "Jul" },
    lugar: "Galería ERUDITO — Ciudad de México",
    imagen: "https://picsum.photos/seed/evento-2/700/500",
    descripcion:
      "Un recorrido por el retrato académico mexicano del siglo XIX y principios del XX.",
  },
  {
    id: 3,
    tipo: "Subasta",
    modalidad: "Presencial",
    titulo: "Colección Privada: Rivera & Camarena",
    fecha: "2026-08-02",
    fechaCorta: { dia: "02", mes: "Ago" },
    lugar: "Casa de Subastas ERUDITO — Guadalajara",
    imagen: "https://picsum.photos/seed/evento-3/700/500",
    descripcion:
      "Piezas históricas de muralismo mexicano, con certificación y tasación incluida en cada lote.",
  },
  {
    id: 4,
    tipo: "Exposición",
    modalidad: "En línea",
    titulo: "Recorrido Virtual: 100 años de Muralismo",
    fecha: "2026-07-20",
    fechaCorta: { dia: "20", mes: "Jul" },
    lugar: "Exposición digital — ERUDITO Galery",
    imagen: "https://picsum.photos/seed/evento-4/700/500",
    descripcion:
      "Visita guiada en video por las obras murales más representativas de la colección.",
  },
];
