export type CategoriaCocina =
  | "Vinos"
  | "Aceites"
  | "Especias"
  | "Chocolates"
  | "Conservas"
  | "Mieles";

export interface ProductoCocina {
  id: number;
  nombre: string;
  productor: string;
  origen: string;
  descripcion: string;
  imagen: string;
  precio: number;
  unidad: string;
  categoria: CategoriaCocina;
  destacado?: boolean;
}

export const CATEGORIAS_COCINA: CategoriaCocina[] = [
  "Vinos",
  "Aceites",
  "Especias",
  "Chocolates",
  "Conservas",
  "Mieles",
];

export const COLOR_COCINA: Record<CategoriaCocina, string> = {
  Vinos:      "bg-rose-400/15 text-rose-400 ring-rose-400/25",
  Aceites:    "bg-amber-400/15 text-amber-400 ring-amber-400/25",
  Especias:   "bg-orange-400/15 text-orange-400 ring-orange-400/25",
  Chocolates: "bg-yellow-900/30 text-yellow-700 ring-yellow-700/25",
  Conservas:  "bg-emerald-400/15 text-emerald-400 ring-emerald-400/25",
  Mieles:     "bg-amber-300/15 text-amber-300 ring-amber-300/25",
};

export const productosCocina: ProductoCocina[] = [
  {
    id: 1,
    nombre: "Vino Tinto Gran Reserva",
    productor: "Bodega Marqués de Riscal",
    origen: "Rioja, España",
    descripcion:
      "Elaborado con uva Tempranillo de viñedos centenarios. Crianza de 24 meses en barrica de roble americano y francés. Notas de cereza negra, vainilla y tabaco. Expresión máxima del terruño riojano.",
    imagen: "https://picsum.photos/seed/cocina-1/600/800",
    precio: 120,
    unidad: "750 ml",
    categoria: "Vinos",
    destacado: true,
  },
  {
    id: 2,
    nombre: "Aceite de Oliva Virgen Extra",
    productor: "Hacienda Guzmán",
    origen: "Sevilla, España",
    descripcion:
      "Extracción en frío de aceitunas Picual cosechadas al alba. Índice de acidez inferior al 0.1%. Aromas herbáceos y frutados con un picante final característico que evidencia su polifenoles intactos.",
    imagen: "https://picsum.photos/seed/cocina-2/600/800",
    precio: 48,
    unidad: "500 ml",
    categoria: "Aceites",
  },
  {
    id: 3,
    nombre: "Azafrán de La Mancha D.O.",
    productor: "Cooperativa Coopaman",
    origen: "La Mancha, España",
    descripcion:
      "Hebras seleccionadas manualmente del Crocus sativus durante la cosecha de otoño. Categoría 1 (la más alta según ISO 3632). Intensidad colorante superior a 250 unidades. Un gramo equivale a 150-200 flores.",
    imagen: "https://picsum.photos/seed/cocina-3/600/800",
    precio: 90,
    unidad: "2 g",
    categoria: "Especias",
  },
  {
    id: 4,
    nombre: "Chocolate Noir 72%",
    productor: "Valrhona",
    origen: "Tain-l'Hermitage, Francia",
    descripcion:
      "Couverture de cacao de origen único Gran Cru de Trinidad. 72% de cacao mínimo, sin lecitina de soja añadida. Notas de frutas rojas, tabaco rubio y toques florales que se despliegan en una larga persistencia.",
    imagen: "https://picsum.photos/seed/cocina-4/600/800",
    precio: 42,
    unidad: "250 g",
    categoria: "Chocolates",
  },
  {
    id: 5,
    nombre: "Trufa Negra en Conserva",
    productor: "Plantin",
    origen: "Périgord, Francia",
    descripcion:
      "Tuber melanosporum entera, primera cocción. Cosecha de la temporada invernal en los bosques de Périgord. Su aroma penetrante e inconfundible eleva cualquier preparación: pastas, risottos, huevos y salsas.",
    imagen: "https://picsum.photos/seed/cocina-5/600/800",
    precio: 110,
    unidad: "25 g",
    categoria: "Conservas",
    destacado: true,
  },
  {
    id: 6,
    nombre: "Miel de Manuka MGO 400+",
    productor: "Comvita",
    origen: "Nueva Zelanda",
    descripcion:
      "Producida por abejas que polinizan el arbusto Leptospermum scoparium en la isla sur. Certificado MGO 400+ por laboratorio independiente. Textura cremosa, sabor robusto con notas de tierra y caramelo oscuro.",
    imagen: "https://picsum.photos/seed/cocina-6/600/800",
    precio: 82,
    unidad: "250 g",
    categoria: "Mieles",
  },
  {
    id: 7,
    nombre: "Flor de Sal Gris de Bretaña",
    productor: "Le Guérandais",
    origen: "Guérande, Francia",
    descripcion:
      "Recolectada a mano con un outil de madera por los «paludiers» en las marismas salinas de Guérande. Cristales irregulares con humedad natural, ricos en magnesio y potasio. La sal de acabado por excelencia.",
    imagen: "https://picsum.photos/seed/cocina-7/600/800",
    precio: 32,
    unidad: "150 g",
    categoria: "Especias",
  },
  {
    id: 8,
    nombre: "Vino Blanco Riesling Grand Cru",
    productor: "Domaine Zind-Humbrecht",
    origen: "Alsacia, Francia",
    descripcion:
      "Riesling de parcela Grand Cru Rangen de Thann, el más meridional de Alsacia. Elaboración biodinámica desde 1997. Acidez vibrante, mineral y petrolífera, con una tensión entre dulzor residual y frescura única en el mundo.",
    imagen: "https://picsum.photos/seed/cocina-8/600/800",
    precio: 98,
    unidad: "750 ml",
    categoria: "Vinos",
  },
  {
    id: 9,
    nombre: "Caviar Osetra Imperial",
    productor: "Caviar de Neuvic",
    origen: "Dordoña, Francia",
    descripcion:
      "Hueva de esturión Acipenser gueldenstaedtii criado en aguas puras de la Dordoña. Granos medianos de color dorado con reflejos verdes. Sabor a avellana tostada y mantequilla, con una cremosidad prolongada en boca.",
    imagen: "https://picsum.photos/seed/cocina-9/600/800",
    precio: 380,
    unidad: "30 g",
    categoria: "Conservas",
    destacado: true,
  },
  {
    id: 10,
    nombre: "Aceite de Argán Gastronómico",
    productor: "Amal Coopérative",
    origen: "Souss-Massa, Marruecos",
    descripcion:
      "Elaborado por la cooperativa femenina Amal mediante tostado artesanal y prensado en frío de las almendras del argán. Aroma intenso a fruto seco tostado. Para aderezar cuscús, ensaladas y postres.",
    imagen: "https://picsum.photos/seed/cocina-10/600/800",
    precio: 55,
    unidad: "250 ml",
    categoria: "Aceites",
  },
];
