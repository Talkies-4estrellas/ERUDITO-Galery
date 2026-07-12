import { artistas, type Artista } from "@/data/artistas";

export type { Artista };

export type Tamano = "Pequeño" | "Mediano" | "Grande";
export type Color = "Cálido" | "Frío" | "Neutro";
export type TipoObra = "Físico" | "JPG Certificado" | "Impresión Oficial";

export interface PuntoGrafica {
  mes: string;
  valor: number; // precio real en MXN ese mes
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

export const fichas: FichaArte[] = [
  /* ── 23 · El Bulldog Dandy · Suruim [12] · Escultura Decorativa ─────────── */
  {
    id: 23,
    titulo: "El Bulldog Dandy",
    anio: "2022",
    descripcion:
      "Bulldog francés de resina mate vestido con traje de etiqueta, pajarita dorada y gafas de sol con lentes iridiscentes teal. La figura sostiene una charola circular en metal dorado diseñada para llaves, joyas, tarjetas o dulces — convirtiendo al personaje en un mayordomo de escritorio con actitud. Incluye ranura interior para monedas y gafas removibles. Disponible en gris topo y negro profundo, ambos con los mismos accesorios dorados que unifican el conjunto.",
    estrellas: 4,
    imagen: "/obras/bulldog-dandy/principal.jpg",
    artista: artistas[12],
    perspectivas: [
      "/obras/bulldog-dandy/principal.jpg",
      "/obras/bulldog-dandy/ambientes.jpg",
      "/obras/bulldog-dandy/detalle.jpg",
    ],
    tamano: "Pequeño",
    color: "Neutro",
    movimiento: "Figurativismo",
    tecnica: "Escultura",
    precio: 3800,
    tipo: "Físico",
    graficaValor: v([2400, 2500, 2450, 2700, 2900, 3100, 3050, 3200, 3400, 3500, 3650, 3800]),
    graficaInteres: [74, 88, 65, 96, 80, 92, 89],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Colección oficial Suruim",
      "Resina de alta densidad con acabado mate",
      "Accesorios en metal dorado — gafas removibles",
    ],
  },

  /* ── 22 · El Árbol Blanco — Calma Invernal · Yihui Arts [11] ───────────── */
  {
    id: 22,
    titulo: "El Árbol Blanco — Calma Invernal",
    anio: "2023",
    descripcion:
      "Pintura sobre canvas pintada a mano que representa un árbol desnudo de blanco puro sobre un fondo abstracto de capas al óleo en azul profundo, teal y gris perla. La ausencia de hojas no evoca pérdida sino quietud: el árbol en reposo antes del florecimiento. Detalles en pigmento dorado y ámbar en las raíces anclan la composición con un acento cálido que contrasta con la serenidad fría del cielo. Una obra de gran formato concebida para crear presencia en salones, habitaciones y espacios de diseño contemporáneo.",
    estrellas: 5,
    imagen: "/obras/arbol-blanco-yihui/principal.jpg",
    artista: artistas[11],
    perspectivas: [
      "/obras/arbol-blanco-yihui/principal.jpg",
      "/obras/arbol-blanco-yihui/detalle.jpg",
      "/obras/arbol-blanco-yihui/sala-azul.jpg",
      "/obras/arbol-blanco-yihui/sala-turquesa.jpg",
      "/obras/arbol-blanco-yihui/sala-gris.jpg",
    ],
    tamano: "Grande",
    color: "Frío",
    movimiento: "Arte Decorativo",
    tecnica: "Óleo",
    precio: 3500,
    tipo: "Físico",
    graficaValor: v([2200, 2300, 2250, 2500, 2700, 2900, 2850, 3000, 3150, 3250, 3400, 3500]),
    graficaInteres: [68, 82, 60, 94, 78, 90, 86],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Pintura original al óleo sobre canvas",
      "Colección oficial Yihui Arts",
      "Acentos en pigmento dorado aplicados a mano",
    ],
  },

  /* ── 21 · Árbol de la Vida — Hojas de Cristal · BestAlice [10] ─────────── */
  {
    id: 21,
    titulo: "Árbol de la Vida — Hojas de Cristal",
    anio: "2023",
    descripcion:
      "Escultura de mesa que reinterpreta el arquetipo universal del árbol de la vida: ramas de alambre de cobre pintado sostienen más de cien hojas individuales de acrílico translúcido en un espectro completo de color — del amarillo solar al naranja otoñal, el rojo intenso, el magenta, el azul zafiro y el verde esmeralda. La luz que atraviesa las hojas proyecta sombras cromáticas sobre la superficie, convirtiendo el entorno en parte de la obra.",
    estrellas: 5,
    imagen: "/obras/arbol-vida-cristal/principal.jpg",
    artista: artistas[10],
    perspectivas: [
      "/obras/arbol-vida-cristal/principal.jpg",
      "/obras/arbol-vida-cristal/mesa-madera.jpg",
      "/obras/arbol-vida-cristal/consola.jpg",
      "/obras/arbol-vida-cristal/fondo-blanco.jpg",
    ],
    tamano: "Pequeño",
    color: "Cálido",
    movimiento: "Arte Decorativo",
    tecnica: "Mixta",
    precio: 4800,
    tipo: "Físico",
    graficaValor: v([3000, 3200, 3100, 3400, 3700, 4000, 3900, 4200, 4400, 4500, 4700, 4800]),
    graficaInteres: [72, 86, 64, 96, 80, 92, 88],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Colección oficial BestAlice",
      "Hojas en acrílico translúcido de color",
      "Estructura de alambre pintado a mano",
    ],
  },

  /* ── 20 · Mappa Mundi — Carta de los Dos Hemisferios · Carta Mundi [9] ─── */
  {
    id: 20,
    titulo: "Mappa Mundi — Carta de los Dos Hemisferios",
    anio: "c. 1721 (reproducción)",
    descripcion:
      "Reproducción en alta fidelidad del mapa mundial de John Senex, cartógrafo real inglés, corregido a partir de las observaciones comunicadas a las Sociedades Reales de Londres y París. Los dos hemisferios en proyección esférica, la caligrafía tipográfica del siglo XVIII y las manchas de envejecimiento del pergamino recrean el asombro geográfico de una época en que el mundo aún guardaba bordes inciertos.",
    estrellas: 5,
    imagen: "/obras/mappa-mundi/principal.jpg",
    artista: artistas[9],
    perspectivas: [
      "/obras/mappa-mundi/principal.jpg",
      "/obras/mappa-mundi/comedor.jpg",
      "/obras/mappa-mundi/sala.jpg",
    ],
    tamano: "Grande",
    color: "Cálido",
    movimiento: "Cartografía Histórica",
    tecnica: "Digital",
    precio: 2500,
    tipo: "Impresión Oficial",
    graficaValor: v([1600, 1700, 1650, 1800, 2000, 2100, 2050, 2200, 2300, 2350, 2450, 2500]),
    graficaInteres: [70, 84, 62, 94, 78, 90, 86],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Reproducción de alta fidelidad sobre canvas",
      "Basada en cartografía original John Senex (c. 1721)",
      "Impresión con tinta resistente a los rayos UV",
    ],
  },

  /* ── 19 · El Sombrero de Paja — WPAP · Pop Maze Art [8] · Pop Art ──────── */
  {
    id: 19,
    titulo: "El Sombrero de Paja — WPAP",
    anio: "2022",
    descripcion:
      "Retrato en técnica WPAP (Wedha's Pop Art Portrait) de uno de los personajes más icónicos del anime contemporáneo: el joven capitán de sombrero de paja. La composición fragmenta el rostro en planos geométricos de colores saturados — amarillos, naranjas, verdes, magenta — sobre un fondo azul marino profundo. Una declaración de cultura pop que transforma la animación en arte de coleccionista.",
    estrellas: 5,
    imagen: "/obras/sombrero-paja-wpap/principal.jpg",
    artista: artistas[8],
    perspectivas: [
      "/obras/sombrero-paja-wpap/principal.jpg",
      "/obras/sombrero-paja-wpap/estudio-rustico.jpg",
      "/obras/sombrero-paja-wpap/sala-libros.jpg",
    ],
    tamano: "Grande",
    color: "Frío",
    movimiento: "Pop Art",
    tecnica: "Digital",
    precio: 2800,
    tipo: "Impresión Oficial",
    graficaValor: v([1800, 1900, 1850, 2000, 2200, 2400, 2350, 2500, 2600, 2650, 2750, 2800]),
    graficaInteres: [75, 90, 68, 98, 85, 96, 92],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Impresión en canvas de alta resolución",
      "Edición limitada numerada",
    ],
  },

  /* ── 18 · El Trío del Silencio · GMMH [7] · Escultura Expresionista ───── */
  {
    id: 18,
    titulo: "El Trío del Silencio",
    anio: "2023",
    descripcion:
      "Tres rostros abstractos en resina plata antigüa interpretan la trilogía milenaria: Ver, Oír, Callar. La textura cincelada a mano y el acabado plateado envejecido convierten cada figura en una meditación sobre los sentidos. Bases en madera negra que anclan la composición con sobriedad. Un ensemble filosófico para biblioteca, escritorio o consola de diseño.",
    estrellas: 5,
    imagen: "/obras/silencio-trio/principal.jpg",
    artista: artistas[7],
    perspectivas: [
      "/obras/silencio-trio/principal.jpg",
      "/obras/silencio-trio/fondo-blanco.jpg",
      "/obras/silencio-trio/mesa-rustica.jpg",
      "/obras/silencio-trio/repisa.jpg",
    ],
    tamano: "Pequeño",
    color: "Neutro",
    movimiento: "Expresionismo",
    tecnica: "Escultura",
    precio: 8900,
    tipo: "Físico",
    graficaValor: v([5500, 5800, 5700, 6200, 6800, 7400, 7200, 7700, 8000, 8300, 8600, 8900]),
    graficaInteres: [60, 76, 52, 90, 74, 86, 82],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Colección oficial GMMH",
      "Resina con acabado plata antigüa patinada",
      "Edición limitada de coleccionista",
    ],
  },

  /* ── 9 · Underground Fantasy · Merck Rathke [3] · Expresionismo ───────── */
  {
    id: 9,
    titulo: "Underground Fantasy",
    anio: "c. 1925",
    descripcion:
      "Una escena de misterio urbano: figuras estilizadas deambulan entre columnas y palmeras esquemáticas bajo una atmósfera cargada de tensión social. El hombre de negro que despliega un objeto ante las miradas inexpresivas de las mujeres crea una coreografía silenciosa entre lo mundano y lo fantástico.",
    estrellas: 5,
    imagen: "/obras/merck-rathke/principal.jpg",
    artista: artistas[3],
    perspectivas: [
      "/obras/merck-rathke/principal.jpg",
      "/obras/merck-rathke/sala-oscura.jpg",
      "/obras/merck-rathke/sala-clara.jpg",
      "/obras/merck-rathke/dormitorio.jpg",
    ],
    tamano: "Grande",
    color: "Cálido",
    movimiento: "Expresionismo",
    tecnica: "Óleo",
    precio: 54500,
    tipo: "Impresión Oficial",
    graficaValor: v([36000, 37500, 37000, 40000, 43000, 47000, 46000, 49000, 51000, 52500, 54000, 54500]),
    graficaInteres: [42, 58, 35, 75, 60, 70, 65],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Impresión Oficial con sello de autenticidad",
      "Activo Financiero Clase B",
    ],
  },

  /* ── 10 · Colibrí en Flor · Ideas Creativas [1] · Arte Digital ─────────── */
  {
    id: 10,
    titulo: "Colibrí en Flor",
    anio: "2024",
    descripcion:
      "Un colibrí de plumaje turquesa suspendido en pleno vuelo ante una explosión de flores tropicales rojas y naranjas. La técnica digital hiperrealista captura cada detalle del ave — la iridiscencia de sus plumas, el movimiento congelado de sus alas — sobre un fondo oscuro que intensifica la luminosidad del conjunto.",
    estrellas: 5,
    imagen: "/obras/colibri-digital/principal.jpg",
    artista: artistas[1],
    perspectivas: [
      "/obras/colibri-digital/principal.jpg",
      "/obras/colibri-digital/sala-moderna.jpg",
      "/obras/colibri-digital/comedor.jpg",
      "/obras/colibri-digital/oficina.jpg",
    ],
    tamano: "Grande",
    color: "Frío",
    movimiento: "Arte Digital",
    tecnica: "Digital",
    precio: 37500,
    tipo: "Impresión Oficial",
    graficaValor: v([24000, 25000, 26500, 27500, 30000, 32500, 32000, 34000, 35000, 36000, 37000, 37500]),
    graficaInteres: [55, 72, 48, 88, 70, 82, 78],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Impresión Oficial con sello de autenticidad",
      "Certificado de edición limitada",
    ],
  },

  /* ── 11 · La Creación — Pop Art · Revolution Canvas [0] ────────────────── */
  {
    id: 11,
    titulo: "La Creación — Pop Art",
    anio: "2022",
    descripcion:
      "Reinterpretación contemporánea de 'La Creación de Adán' de Miguel Ángel. Las manos icónicas que casi se tocan emergen en blanco y negro de un estallido de pigmentos: amarillos, azules, violetas y rojos que transforman la escena sagrada en una declaración de arte urbano y vanguardia cromática.",
    estrellas: 5,
    imagen: "/obras/revolution-canvas/principal.jpg",
    artista: artistas[0],
    perspectivas: [
      "/obras/revolution-canvas/principal.jpg",
      "/obras/revolution-canvas/sala-gris.jpg",
      "/obras/revolution-canvas/loft.jpg",
    ],
    tamano: "Grande",
    color: "Frío",
    movimiento: "Arte Digital",
    tecnica: "Digital",
    precio: 28000,
    tipo: "Impresión Oficial",
    graficaValor: v([18000, 19000, 18500, 20000, 22000, 24000, 23500, 25000, 26000, 26500, 27000, 28000]),
    graficaInteres: [62, 78, 55, 90, 74, 85, 80],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Impresión Oficial con sello de autenticidad",
      "Edición limitada numerada",
    ],
  },

  /* ── 12 · Noche Estrellada sobre Bellas Artes · Revolution Canvas [0] ──── */
  {
    id: 12,
    titulo: "Noche Estrellada sobre Bellas Artes",
    anio: "2024",
    descripcion:
      "Fusión magistral entre la pincelada giratoria de Van Gogh y la majestuosidad neoclásica del Palacio de Bellas Artes de la Ciudad de México. El cielo azul turquesa con sus remolinos y astros dorados envuelve la cúpula iluminada del palacio, creando un diálogo poético entre el expresionismo europeo y el patrimonio cultural mexicano.",
    estrellas: 5,
    imagen: "/obras/bellas-artes-noche/principal.jpg",
    artista: artistas[0],
    perspectivas: [
      "/obras/bellas-artes-noche/principal.jpg",
      "/obras/bellas-artes-noche/sala-moderna.jpg",
      "/obras/bellas-artes-noche/comedor.jpg",
    ],
    tamano: "Grande",
    color: "Frío",
    movimiento: "Arte Digital",
    tecnica: "Digital",
    precio: 31500,
    tipo: "Impresión Oficial",
    graficaValor: v([20000, 21000, 20500, 22500, 24500, 26500, 26000, 27500, 28500, 29500, 30500, 31500]),
    graficaInteres: [68, 82, 58, 95, 78, 90, 86],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Impresión Oficial con sello de autenticidad",
      "Edición limitada numerada",
      "Homenaje al Patrimonio Cultural Mexicano",
    ],
  },

  /* ── 13 · El Ángel — Paseo de la Reforma · Revolution Canvas [0] ────────── */
  {
    id: 13,
    titulo: "El Ángel — Paseo de la Reforma",
    anio: "2024",
    descripcion:
      "La Columna de la Independencia emerge como eje central de una composición explosiva: rascacielos de teal y magenta flanquean el Paseo de la Reforma mientras la calzada se convierte en un espejo de naranjas, rojos y ocres bajo la lluvia. La pincelada de cuchillo imprime volumen y urgencia a uno de los iconos más reconocibles de la Ciudad de México.",
    estrellas: 5,
    imagen: "/obras/angel-reforma/principal.jpg",
    artista: artistas[0],
    perspectivas: [
      "/obras/angel-reforma/principal.jpg",
      "/obras/angel-reforma/sala-calida.jpg",
      "/obras/angel-reforma/sala-moderna.jpg",
    ],
    tamano: "Grande",
    color: "Cálido",
    movimiento: "Arte Digital",
    tecnica: "Digital",
    precio: 29500,
    tipo: "Impresión Oficial",
    graficaValor: v([18500, 19500, 19000, 21000, 23000, 25000, 24500, 26000, 27000, 27500, 28500, 29500]),
    graficaInteres: [70, 85, 60, 97, 80, 92, 88],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Impresión Oficial con sello de autenticidad",
      "Edición limitada numerada",
      "Homenaje al Patrimonio Cultural Mexicano",
    ],
  },

  /* ── 14 · Dúo Venado Dorado · Atelier Geométrico [2] · Escultura ────────── */
  {
    id: 14,
    titulo: "Dúo Venado Dorado",
    anio: "2021",
    descripcion:
      "Par de ciervos en geometría low-poly: uno recostado en actitud contemplativa, el otro erguido con la cornamenta alzada. El acabado en resina dorada mate convierte cada faceta en un plano de luz distinto según el ángulo de visión. Dos piezas que dialogan entre el reposo y la vigilancia, pensadas para repisas, consolas y mesas de diseño de autor.",
    estrellas: 4,
    imagen: "/obras/venado-dorado/principal.jpg",
    artista: artistas[2],
    perspectivas: [
      "/obras/venado-dorado/principal.jpg",
      "/obras/venado-dorado/fondo-blanco.jpg",
      "/obras/venado-dorado/mesa-sala.jpg",
      "/obras/venado-dorado/detalle.jpg",
    ],
    tamano: "Pequeño",
    color: "Cálido",
    movimiento: "Minimalismo",
    tecnica: "Escultura",
    precio: 12500,
    tipo: "Físico",
    graficaValor: v([8500, 8800, 8700, 9200, 10000, 10800, 10500, 11200, 11500, 11800, 12200, 12500]),
    graficaInteres: [48, 65, 40, 82, 65, 76, 72],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Edición limitada de coleccionista",
      "Resina de alta densidad con acabado dorado",
    ],
  },

  /* ── 15 · Árbol de Huellas — Amor y Unión · Arte & Memorias [4] ─────────── */
  {
    id: 15,
    titulo: "Árbol de Huellas — Amor y Unión",
    anio: "2023",
    descripcion:
      "Lienzo participativo en forma de árbol con corazón entrelazado y dos pájaros. Las ramas llegan vacías al evento — son los invitados quienes, con su huella dactilar entintada, crean cada hoja de color. Al final de la celebración la obra es única e irrepetible: un retrato literal de todos los que estuvieron presentes.",
    estrellas: 5,
    imagen: "/obras/arbol-huellas/principal.jpg",
    artista: artistas[4],
    perspectivas: [
      "/obras/arbol-huellas/principal.jpg",
      "/obras/arbol-huellas/sala-nordica.jpg",
      "/obras/arbol-huellas/sala-cojines.jpg",
      "/obras/arbol-huellas/plantilla.jpg",
    ],
    tamano: "Mediano",
    color: "Neutro",
    movimiento: "Arte Relacional",
    tecnica: "Mixta",
    precio: 7500,
    tipo: "Físico",
    graficaValor: v([5000, 5200, 5100, 5500, 6000, 6500, 6300, 6700, 7000, 7100, 7300, 7500]),
    graficaInteres: [72, 88, 65, 98, 82, 94, 90],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Pieza única — completada por los invitados",
      "Incluye almohadillas de tinta de colores",
      "Certificado de evento con fecha y lugar",
    ],
  },

  /* ── 16 · La Banda de Rock · HAUCOZE [5] · Escultura figurativa ─────────── */
  {
    id: 16,
    titulo: "La Banda de Rock",
    anio: "2021",
    descripcion:
      "Colección de cuatro figuras en resina: guitarrista inclinado en riff extremo, baterista con el brazo en alto, vocalista con el micrófono al límite y tecladista en plena entrega. El acabado grafito mate con detalles en plata captura la energía en vivo de una banda en su momento culmen. Piezas de colección para amantes de la música y el diseño de interiores.",
    estrellas: 5,
    imagen: "/obras/banda-rock-haucoze/principal.jpg",
    artista: artistas[5],
    perspectivas: [
      "/obras/banda-rock-haucoze/principal.jpg",
      "/obras/banda-rock-haucoze/marmol.jpg",
      "/obras/banda-rock-haucoze/detalle.jpg",
      "/obras/banda-rock-haucoze/multivista.jpg",
    ],
    tamano: "Pequeño",
    color: "Neutro",
    movimiento: "Figurativismo",
    tecnica: "Escultura",
    precio: 18500,
    tipo: "Físico",
    graficaValor: v([12000, 12500, 12200, 13500, 14800, 16000, 15500, 16800, 17200, 17500, 18000, 18500]),
    graficaInteres: [65, 80, 55, 92, 75, 88, 84],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Colección oficial HAUCOZE",
      "Resina de alta densidad con acabado metálico",
      "Edición limitada de coleccionista",
    ],
  },

  /* ── 17 · El Lector · UTTCMK [6] · Escultura abstracta ─────────────────── */
  {
    id: 17,
    titulo: "El Lector",
    anio: "2022",
    descripcion:
      "Figura humana sin rostro sentada en posición de loto con un libro abierto entre las manos y la palma apoyada en la sien. La superficie en arenisca beige mate de resina elimina todo detalle anatómico para concentrar la atención en la postura: la curvatura de la espalda, la tensión de los dedos y la inclinación de la cabeza narran la inmersión total en la lectura.",
    estrellas: 5,
    imagen: "/obras/el-lector-uttcmk/principal.jpg",
    artista: artistas[6],
    perspectivas: [
      "/obras/el-lector-uttcmk/principal.jpg",
      "/obras/el-lector-uttcmk/biblioteca.jpg",
      "/obras/el-lector-uttcmk/escritorio.jpg",
      "/obras/el-lector-uttcmk/producto.jpg",
    ],
    tamano: "Pequeño",
    color: "Neutro",
    movimiento: "Abstracto",
    tecnica: "Escultura",
    precio: 9500,
    tipo: "Físico",
    graficaValor: v([6000, 6300, 6200, 6800, 7400, 8000, 7800, 8300, 8600, 8800, 9200, 9500]),
    graficaInteres: [58, 74, 50, 88, 72, 84, 80],
    certificaciones: [
      "Verificada por ERUDITO Galery",
      "Colección oficial UTTCMK",
      "Resina con acabado arenisca natural",
      "Edición limitada de coleccionista",
    ],
  },
];

export const obrasDeArtista = (artistaId: number): FichaArte[] =>
  fichas.filter((f) => f.artista.id === artistaId);
