import { artistas, type Artista } from "@/data/artistas";

export type { Artista };

export type Tamano = "Pequeño" | "Mediano" | "Grande";
export type Color = "Cálido" | "Frío" | "Neutro";
export type TipoObra = "Físico" | "JPG Certificado" | "Impresión Oficial";

export interface PuntoGrafica {
  mes: string;
  valor: number; // precio real en USD ese mes
}

export interface FichaArte {
  id: number;
  titulo: string;
  anio: string;
  descripcion: string;
  estrellas: number;
  imagen: string;
  artista: Artista;
  perspectivas: string[];
  // Filtros de galería
  tamano: Tamano;
  color: Color;
  movimiento: string;
  tecnica: string;
  // Datos de mercado / compra
  precio: number;
  tipo: TipoObra;
  /** 12 puntos — uno por mes (Ene → Dic). El mes actual (Jun = índice 5) se resalta. */
  graficaValor: PuntoGrafica[];
  /** 7 puntos de interés mensual (visitas + favoritos + pujas). Escala 0-100. */
  graficaInteres: number[];
  certificaciones: string[];
}

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const v = (vals: number[]): PuntoGrafica[] => vals.map((valor, i) => ({ mes: MESES[i], valor }));

const base: Omit<FichaArte, "perspectivas">[] = [
  /* ── 1 · Dos Mujeres · Obregón · Academicismo estable ─────────────── */
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
    precio: 2400,
    tipo: "JPG Certificado",
    graficaValor: v([1820, 1850, 1790, 1880, 1960, 2050, 2020, 2120, 2200, 2280, 2350, 2400]),
    graficaInteres: [35, 50, 28, 62, 48, 57, 52],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Certificado de Autenticidad Digital",
      "Registro en catálogo histórico del siglo XIX",
    ],
  },

  /* ── 2 · El Pulque · Herrán · Modernismo moderado ──────────────────── */
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
    precio: 1850,
    tipo: "JPG Certificado",
    graficaValor: v([1580, 1610, 1590, 1640, 1690, 1740, 1720, 1760, 1790, 1810, 1835, 1850]),
    graficaInteres: [40, 55, 32, 68, 52, 60, 55],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Certificado de Autenticidad Digital",
    ],
  },

  /* ── 3 · La Ofrenda · Herrán · Modernismo simbólico ────────────────── */
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
    precio: 3200,
    tipo: "Físico",
    graficaValor: v([2380, 2440, 2390, 2520, 2680, 2840, 2790, 2920, 3010, 3070, 3140, 3200]),
    graficaInteres: [55, 70, 45, 80, 65, 75, 72],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Certificado de Autenticidad",
      "Tasación profesional 2025",
      "Activo Financiero Clase B",
    ],
  },

  /* ── 4 · Mural campesino · Diego Rivera · alcista ───────────────────── */
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
    precio: 8500,
    tipo: "Físico",
    graficaValor: v([5800, 6100, 5900, 6400, 6950, 7500, 7300, 7750, 8050, 8150, 8350, 8500]),
    graficaInteres: [65, 80, 55, 92, 75, 88, 82],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Autenticada por especialistas INBA",
      "Registro Patrimonio Nacional",
      "Activo Financiero Clase A",
      "Tasación internacional 2025",
    ],
  },

  /* ── 5 · Obra temprana · Diego Rivera · alcista fuerte ─────────────── */
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
    precio: 6800,
    tipo: "JPG Certificado",
    graficaValor: v([4200, 4520, 4350, 4850, 5300, 5820, 5640, 6050, 6250, 6430, 6620, 6800]),
    graficaInteres: [60, 75, 50, 88, 70, 82, 78],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Registro catálogo Rivera (obra juvenil)",
      "Activo Financiero Clase A",
    ],
  },

  /* ── 6 · Vendedora de Alcatraces · Rivera · icónica / AAA ──────────── */
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
    precio: 12500,
    tipo: "Físico",
    graficaValor: v([7800, 8400, 8100, 9250, 10150, 11050, 10700, 11550, 11850, 12050, 12250, 12500]),
    graficaInteres: [78, 90, 65, 99, 85, 95, 92],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Autenticada internacionalmente",
      "Subastada en Christie's 2024",
      "Activo Financiero Clase AAA",
      "Registro UNESCO — Arte Moderno Mexicano",
      "Certificado Heritage Premium",
    ],
  },

  /* ── 7 · La Constitución 1917 · González Camarena · estable ──────── */
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
    precio: 5500,
    tipo: "Impresión Oficial",
    graficaValor: v([4200, 4300, 4250, 4420, 4600, 4780, 4720, 4880, 5020, 5130, 5320, 5500]),
    graficaInteres: [58, 68, 45, 80, 62, 72, 68],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Autorizada por el Estado Mexicano",
      "Impresión Oficial con sello de autenticidad",
      "Activo Financiero Clase B",
    ],
  },

  /* ── 8 · Jinete · González Camarena · apreciación moderada ─────────── */
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
    precio: 4200,
    tipo: "JPG Certificado",
    graficaValor: v([3000, 3100, 3050, 3200, 3360, 3520, 3460, 3620, 3760, 3870, 4020, 4200]),
    graficaInteres: [45, 60, 38, 72, 55, 65, 60],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Certificado de Autenticidad Digital",
      "Activo Financiero Clase B",
    ],
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

export const obrasDeArtista = (artistaId: number): FichaArte[] =>
  fichas.filter((f) => f.artista.id === artistaId);
