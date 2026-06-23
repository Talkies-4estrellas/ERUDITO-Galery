export interface Articulo {
  id: number;
  titulo: string;
  categoria: string;
  fecha: string;
  extracto: string;
  imagen: string;
  autor: string;
  minLectura: number;
}

export const CATEGORIAS = [
  "Movimientos",
  "Coleccionismo",
  "Mercado",
  "Técnicas",
  "Entrevistas",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

export const COLOR_CATEGORIA: Record<string, string> = {
  Movimientos:  "bg-amber-400/15 text-amber-400 ring-amber-400/25",
  Coleccionismo:"bg-cyan-400/15  text-cyan-400  ring-cyan-400/25",
  Mercado:      "bg-emerald-400/15 text-emerald-400 ring-emerald-400/25",
  Técnicas:     "bg-violet-400/15 text-violet-400 ring-violet-400/25",
  Entrevistas:  "bg-rose-400/15  text-rose-400  ring-rose-400/25",
};

export const articulos: Articulo[] = [
  {
    id: 1,
    titulo: "El muralismo mexicano y su influencia en el arte contemporáneo",
    categoria: "Movimientos",
    fecha: "2025-05-12",
    extracto:
      "Diego Rivera, José Clemente Orozco y David Alfaro Siqueiros transformaron los muros de México en manifiestos visuales. Hoy, su legado resuena en los grafitis de São Paulo, las instalaciones de Los Ángeles y las galerías de Madrid.",
    imagen: "https://picsum.photos/seed/blog-1/800/500",
    autor: "Valentina Cruz",
    minLectura: 7,
  },
  {
    id: 2,
    titulo: "Cómo empezar una colección de arte con presupuesto limitado",
    categoria: "Coleccionismo",
    fecha: "2025-04-28",
    extracto:
      "Coleccionar arte no requiere una fortuna. Ferias de arte emergente, impresiones en edición limitada y obras de artistas locales son puertas de entrada accesibles a un mundo que mezcla pasión e inversión.",
    imagen: "https://picsum.photos/seed/blog-2/800/500",
    autor: "Rodrigo Fuentes",
    minLectura: 5,
  },
  {
    id: 3,
    titulo: "El mercado del arte digital: JPGs certificados y el futuro de la propiedad",
    categoria: "Mercado",
    fecha: "2025-04-10",
    extracto:
      "La tokenización de obras abrió un debate que va más allá de la tecnología: ¿qué significa poseer una pieza de arte en la era digital? Analizamos los modelos de certificación que están redefiniendo el mercado.",
    imagen: "https://picsum.photos/seed/blog-3/800/500",
    autor: "Lucía Navarro",
    minLectura: 9,
  },
  {
    id: 4,
    titulo: "Saturnino Herrán: el pintor que México olvidó y el mundo redescubre",
    categoria: "Entrevistas",
    fecha: "2025-03-22",
    extracto:
      "Murió a los 31 años sin ver el reconocimiento que merecía. Hoy sus lienzos de mestizaje, ofrenda y dignidad se cotizan al alza en subastas internacionales. Conversamos con la curadora que recuperó su archivo inédito.",
    imagen: "https://picsum.photos/seed/blog-4/800/500",
    autor: "Andrei Molina",
    minLectura: 11,
  },
  {
    id: 5,
    titulo: "Técnica al óleo: lo que cada coleccionista debería saber antes de comprar",
    categoria: "Técnicas",
    fecha: "2025-03-05",
    extracto:
      "El óleo envejece, respira y evoluciona. Entender sus capas, barnices y soportes no solo protege tu inversión: te hace apreciar cada pincelada de una manera completamente nueva.",
    imagen: "https://picsum.photos/seed/blog-5/800/500",
    autor: "Valentina Cruz",
    minLectura: 6,
  },
  {
    id: 6,
    titulo: "Por qué el arte latinoamericano emergente es la apuesta del mercado en 2025",
    categoria: "Mercado",
    fecha: "2025-02-18",
    extracto:
      "Coleccionistas de Nueva York, Dubái y Tokio dirigen la mirada a Ciudad de México, Bogotá y Buenos Aires. Una generación de artistas menores de 35 años está reconfigurando el mapa del arte global.",
    imagen: "https://picsum.photos/seed/blog-6/800/500",
    autor: "Rodrigo Fuentes",
    minLectura: 8,
  },
  {
    id: 7,
    titulo: "Restauración de obras: arte y ciencia al servicio de la historia",
    categoria: "Técnicas",
    fecha: "2025-01-30",
    extracto:
      "Rayos X, análisis de pigmentos y microscopía de alta resolución: los restauradores modernos usan herramientas de laboratorio para devolver la vida a obras que el tiempo amenazó con borrar para siempre.",
    imagen: "https://picsum.photos/seed/blog-7/800/500",
    autor: "Lucía Navarro",
    minLectura: 10,
  },
];

export function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
