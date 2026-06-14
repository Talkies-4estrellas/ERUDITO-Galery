import { artistas, type Artista } from "@/data/artistas";

export type { Artista };

export type Tamano = "Pequeño" | "Mediano" | "Grande";
export type Color = "Cálido" | "Frío" | "Neutro";

export interface FichaArte {
  id: number;
  titulo: string;
  anio: string;
  descripcion: string;
  estrellas: number;
  imagen: string;
  artista: Artista;
  /** Vistas adicionales de la misma obra (detalle, marco, montaje…) */
  perspectivas: string[];
  // Atributos para los filtros de la galería
  tamano: Tamano;
  color: Color;
  movimiento: string;
  tecnica: string;
}

// Datos de muestra (imágenes de picsum.photos). Para obras reales,
// coloca los archivos en /public/obras y actualiza "imagen".
const base: Omit<FichaArte, "perspectivas">[] = [
  {
    id: 1,
    titulo: "Dos Mujeres",
    anio: "1865",
    descripcion:
      "Composición visual que explora la relación entre la nostalgia y la identidad a través de la superposición de rostros fragmentados y paisajes etéreos. La obra presenta una figura central cuya silueta se disuelve en una serie de capas translúcidas, como si el tiempo erosionara lentamente la percepción de su propia existencia.",
    estrellas: 5,
    imagen: "https://picsum.photos/seed/obra-1/600/800",
    artista: artistas[0],
    tamano: "Mediano",
    color: "Neutro",
    movimiento: "Academicismo",
    tecnica: "Retrato",
  },
  {
    id: 2,
    titulo: "El Pulque",
    anio: "1909",
    descripcion:
      "Escena costumbrista que celebra los oficios y rituales cotidianos del México de principios de siglo, con una paleta cálida y un dibujo de gran precisión académica.",
    estrellas: 4,
    imagen: "https://picsum.photos/seed/obra-2/600/800",
    artista: artistas[1],
    tamano: "Grande",
    color: "Cálido",
    movimiento: "Modernismo",
    tecnica: "Costumbrista",
  },
  {
    id: 3,
    titulo: "La Ofrenda",
    anio: "1913",
    descripcion:
      "Una barca cargada de cempasúchil avanza por el canal mientras las figuras inclinan el cuerpo en señal de duelo; luz dorada y simbolismo del ciclo de la vida.",
    estrellas: 5,
    imagen: "https://picsum.photos/seed/obra-3/600/800",
    artista: artistas[1],
    tamano: "Grande",
    color: "Cálido",
    movimiento: "Modernismo",
    tecnica: "Costumbrista",
  },
  {
    id: 4,
    titulo: "Obra Artística",
    anio: "1926",
    descripcion:
      "Estudio mural de la vida campesina: volúmenes macizos, sombreros de ala ancha y un ritmo compositivo que dignifica el trabajo colectivo de la tierra.",
    estrellas: 5,
    imagen: "https://picsum.photos/seed/obra-4/600/800",
    artista: artistas[2],
    tamano: "Grande",
    color: "Cálido",
    movimiento: "Muralismo",
    tecnica: "Mural",
  },
  {
    id: 5,
    titulo: "Obra Artística",
    anio: "1894",
    descripcion:
      "Girasoles y rostros se funden en una sola masa luminosa; el color actúa como memoria emocional más que como descripción literal del mundo.",
    estrellas: 4,
    imagen: "https://picsum.photos/seed/obra-5/600/800",
    artista: artistas[2],
    tamano: "Pequeño",
    color: "Cálido",
    movimiento: "Modernismo",
    tecnica: "Abstracto",
  },
  {
    id: 6,
    titulo: "Vendedora de Alcatraces",
    anio: "1942",
    descripcion:
      "La figura arrodillada sostiene un ramo monumental de alcatraces; la geometría del rebozo y las flores construye una arquitectura de ternura y trabajo.",
    estrellas: 5,
    imagen: "https://picsum.photos/seed/obra-6/600/800",
    artista: artistas[2],
    tamano: "Mediano",
    color: "Frío",
    movimiento: "Muralismo",
    tecnica: "Retrato",
  },
  {
    id: 7,
    titulo: "La Constitución 1917",
    anio: "1967",
    descripcion:
      "Alegoría monumental del pacto constitucional: figuras pétreas emergen del muro entre estandartes, fuego y acero, narrando la fundación del estado moderno.",
    estrellas: 4,
    imagen: "https://picsum.photos/seed/obra-7/600/800",
    artista: artistas[3],
    tamano: "Grande",
    color: "Frío",
    movimiento: "Muralismo",
    tecnica: "Mural",
  },
  {
    id: 8,
    titulo: "Obra Artística",
    anio: "1959",
    descripcion:
      "Un jinete de bronce cabalga sobre un fondo incendiado; la pincelada enérgica convierte el movimiento en el verdadero protagonista de la escena.",
    estrellas: 4,
    imagen: "https://picsum.photos/seed/obra-8/600/800",
    artista: artistas[3],
    tamano: "Mediano",
    color: "Cálido",
    movimiento: "Muralismo",
    tecnica: "Abstracto",
  },
];

export const fichas: FichaArte[] = base.map((ficha) => ({
  ...ficha,
  perspectivas: [
    ficha.imagen,
    `https://picsum.photos/seed/obra-${ficha.id}-vista-2/900/700`,
    `https://picsum.photos/seed/obra-${ficha.id}-vista-3/900/700`,
    `https://picsum.photos/seed/obra-${ficha.id}-vista-4/900/700`,
  ],
}));

/** Obras de un artista dado */
export const obrasDeArtista = (artistaId: number): FichaArte[] =>
  fichas.filter((ficha) => ficha.artista.id === artistaId);
