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
  // ── VINOS ──────────────────────────────────────────────────────────
  {
    id: 1,
    nombre: "Monte Xanic Gran Ricardo 2019",
    productor: "Monte Xanic",
    origen: "Valle de Guadalupe, Baja California",
    descripcion:
      "Ensamble de Cabernet Sauvignon, Merlot y Petit Verdot de los mejores lotes de la bodega. Crianza de 18 meses en barricas nuevas de roble francés. Aromas de ciruela madura, grafito y tabaco, con un tanino sedoso y una larga persistencia. La referencia del vino de autor mexicano.",
    imagen: "/images/cocina/vino-monte-xanic.jpg",
    precio: 890,
    unidad: "750 ml",
    categoria: "Vinos",
    destacado: true,
  },
  {
    id: 2,
    nombre: "Casa Madero 3V Gran Reserva 2020",
    productor: "Casa Madero",
    origen: "Valle de Parras, Coahuila",
    descripcion:
      "Ensamble de Cabernet Sauvignon, Merlot y Shiraz proveniente de la bodega más antigua de América (1597). Crianza de 14 meses en roble francés. Intenso, con notas de mora, pimienta negra y vainilla. Emblema del vino del norte de México.",
    imagen: "/images/cocina/vino-casa-madero.jfif",
    precio: 620,
    unidad: "750 ml",
    categoria: "Vinos",
  },
  {
    id: 3,
    nombre: "Riesling Spätlese Mosel 2021",
    productor: "Dr. Loosen",
    origen: "Mosela, Alemania",
    descripcion:
      "Riesling de viñedos de pizarra azul con más de 60 años de edad. Cosecha tardía que equilibra una acidez eléctrica con una dulzura natural delicada. Notas de melocotón blanco, flores y mineralidad pétrea. Imprescindible para entender el Riesling en su máxima expresión.",
    imagen: "/images/cocina/vino-dr-loosen.jfif",
    precio: 780,
    unidad: "750 ml",
    categoria: "Vinos",
  },

  // ── ACEITES ────────────────────────────────────────────────────────
  {
    id: 4,
    nombre: "Aceite de Oliva Hojiblanca EVOO",
    productor: "Castillo de Canena",
    origen: "Jaén, España",
    descripcion:
      "Aceite de primera prensada en frío, cosecha temprana de aceitunas Hojiblanca. Índice de acidez inferior a 0.15%. Aroma fresco a hierba cortada y tomate verde, con un amargor elegante y picante limpio que evidencia un alto contenido de polifenoles.",
    imagen: "/images/cocina/aceite-castillo-canena.jfif",
    precio: 420,
    unidad: "500 ml",
    categoria: "Aceites",
    destacado: true,
  },
  {
    id: 5,
    nombre: "Aceite de Argán Gastronómico",
    productor: "Amal Coopérative",
    origen: "Souss-Massa, Marruecos",
    descripcion:
      "Producido por la cooperativa femenina Amal mediante tostado artesanal y prensado en frío de las almendras del argán. Aroma intenso a fruto seco tostado, sabor profundo y persistente. Ideal para aderezar cuscús, ensaladas y postres tradicionales.",
    imagen: "/images/cocina/aceite-argan-amal.jfif",
    precio: 580,
    unidad: "250 ml",
    categoria: "Aceites",
  },
  {
    id: 6,
    nombre: "Aceite de Aguacate Puro",
    productor: "Chosen Foods",
    origen: "Michoacán, México",
    descripcion:
      "Prensado en frío de aguacates Hass de Michoacán en su punto óptimo de madurez. Punto de humo de 270 °C, ideal para altas temperaturas. Perfil suave con notas de mantequilla y hierba fresca. Certificado non-GMO y sin refinar.",
    imagen: "/images/cocina/aceite-aguacate.webp",
    precio: 310,
    unidad: "500 ml",
    categoria: "Aceites",
  },

  // ── ESPECIAS ───────────────────────────────────────────────────────
  {
    id: 7,
    nombre: "Vainilla de Papantla Entera",
    productor: "Gaya Vainilla",
    origen: "Papantla, Veracruz, México",
    descripcion:
      "Vainas de Vanilla planifolia curadas durante 6 meses según el método tradicional totonaca. Contenido de vainillina superior al 2%. Aroma floral intenso con notas de higo, caramelo y madera húmeda. La vainilla de Veracruz es reconocida como la mejor del mundo por su perfume complejo.",
    imagen: "/images/cocina/especia-vainilla-papantla.webp",
    precio: 180,
    unidad: "3 vainas (15 g)",
    categoria: "Especias",
    destacado: true,
  },
  {
    id: 8,
    nombre: "Azafrán de La Mancha D.O. Categoría 1",
    productor: "Cooperativa Coopaman",
    origen: "La Mancha, España",
    descripcion:
      "Hebras seleccionadas manualmente del Crocus sativus durante la cosecha de otoño. Categoría 1 según ISO 3632, la más alta posible. Intensidad colorante superior a 250 unidades. Un gramo equivale al trabajo de 150-200 flores. El azafrán con mayor valor por peso del mundo.",
    imagen: "/images/cocina/especia-azafran.jfif",
    precio: 950,
    unidad: "2 g",
    categoria: "Especias",
  },
  {
    id: 9,
    nombre: "Mezcla de Chiles Oaxaqueños Premium",
    productor: "Casa Maguey",
    origen: "Oaxaca, México",
    descripcion:
      "Selección artesanal de chiles secos: ancho, mulato, pasilla negro y chile negro oaxaqueño. Secado al sol y seleccionado a mano en comunidades del Valle de Oaxaca. Base imprescindible para moles, adobos y marinadas. Sin conservadores ni aditivos.",
    imagen: "/images/cocina/especia-chiles-oaxaca.jfif",
    precio: 145,
    unidad: "200 g surtido",
    categoria: "Especias",
  },

  // ── CHOCOLATES ─────────────────────────────────────────────────────
  {
    id: 10,
    nombre: "Chocolate de Origen Chiapas 70%",
    productor: "Cacao Bucarela",
    origen: "Soconusco, Chiapas, México",
    descripcion:
      "Bean-to-bar elaborado con cacao criollo y trinitario del Soconusco, una de las regiones cacaoteras más antiguas de Mesoamérica. 70% cacao, tostado medio para conservar notas frutales. Rojo de frutos silvestres, cereza y un final largo y floral. Certificado orgánico.",
    imagen: "/images/cocina/chocolate-chiapas.jfif",
    precio: 195,
    unidad: "80 g",
    categoria: "Chocolates",
    destacado: true,
  },
  {
    id: 11,
    nombre: "Valrhona Guanaja Noir 70%",
    productor: "Valrhona",
    origen: "Tain-l'Hermitage, Francia",
    descripcion:
      "Couverture icónica de Valrhona creada en 1986. Ensamble de cacaos de Trinidad, Jamaica y Santo Tomé. 70% de cacao mínimo, sin lecitina de soja. Intenso y amargo, con notas de café, regaliz y una acidez vibrante que lo convierte en favorito de pasteleros profesionales.",
    imagen: "/images/cocina/chocolate-valrhona.jfif",
    precio: 320,
    unidad: "250 g",
    categoria: "Chocolates",
  },

  // ── CONSERVAS ──────────────────────────────────────────────────────
  {
    id: 12,
    nombre: "Anchoas del Cantábrico en AOVE",
    productor: "Conservas Ortiz",
    origen: "País Vasco, España",
    descripcion:
      "Anchoas de la especie Engraulis encrasicolus capturadas en el Mar Cantábrico con anzuelo, maduradas 18 meses en sal gruesa. Fileteadas a mano y conservadas en aceite de oliva virgen extra. Umami puro, textura sedosa y salinidad equilibrada. Las mejores anchoas de España.",
    imagen: "/images/cocina/conserva-anchoas-ortiz.jfif",
    precio: 280,
    unidad: "47 g (16 filetes)",
    categoria: "Conservas",
  },
  {
    id: 13,
    nombre: "Trufa Negra Melanosporum Entera",
    productor: "Plantin",
    origen: "Périgord, Francia",
    descripcion:
      "Tuber melanosporum entera, primera cocción. Cosecha invernal en los bosques de roble del Périgord Negro. Aroma penetrante e inconfundible con notas de tierra mojada, musgo y cacao. Eleva cualquier preparación: pastas, risottos, huevos y salsas. La trufa más cotizada del mundo.",
    imagen: "/images/cocina/conserva-trufa-negra.jfif",
    precio: 1_150,
    unidad: "25 g",
    categoria: "Conservas",
  },
  {
    id: 14,
    nombre: "Caviar Osetra Imperial",
    productor: "Caviar de Neuvic",
    origen: "Dordoña, Francia",
    descripcion:
      "Hueva de esturión Acipenser gueldenstaedtii criado en las aguas puras del río Dordoña. Granos medianos dorados con reflejos verdes. Sabor a avellana tostada y mantequilla con una cremosidad prolongada. Certificado por el Consejo Internacional de Pesca. El lujo gastronómico definitivo.",
    imagen: "/images/cocina/conserva-caviar-osetra.jpg",
    precio: 3_800,
    unidad: "30 g",
    categoria: "Conservas",
  },

  // ── MIELES ─────────────────────────────────────────────────────────
  {
    id: 15,
    nombre: "Miel de Abeja Melipona Yucatán",
    productor: "Kab Ik",
    origen: "Valladolid, Yucatán, México",
    descripcion:
      "Producida por la abeja nativa maya Melipona beecheii, sin aguijón y en peligro de extinción. La miel más escasa de México: cada colmena produce apenas 1-2 litros al año. Textura líquida, color ámbar claro y sabor complejo con acidez natural, notas florales y un ligero retrogusto ahumado.",
    imagen: "/images/cocina/miel-melipona-yucatan.jfif",
    precio: 690,
    unidad: "250 ml",
    categoria: "Mieles",
    destacado: true,
  },
  {
    id: 16,
    nombre: "Miel de Manuka MGO 400+",
    productor: "Comvita",
    origen: "Isla Sur, Nueva Zelanda",
    descripcion:
      "Producida por abejas que polinizan el arbusto Leptospermum scoparium en la remota isla sur de Nueva Zelanda. Certificado MGO 400+ por laboratorio independiente. Textura cremosa, sabor robusto con notas de tierra y caramelo oscuro. Reconocida mundialmente por sus propiedades naturales.",
    imagen: "/images/cocina/miel-manuka.jfif",
    precio: 820,
    unidad: "250 g",
    categoria: "Mieles",
  },
  {
    id: 17,
    nombre: "Miel de Bosque Negro",
    productor: "Schwarzwälder Imkerei",
    origen: "Selva Negra, Alemania",
    descripcion:
      "Melada de bosque recolectada en los abetos y hayas de la Schwarzwald. Color caoba oscuro y sabor intenso con notas de pino, madera y regaliz. Rica en minerales y enzimas. Se produce únicamente cuando los pulgones del abeto generan abundante melada, lo que la hace muy escasa.",
    imagen: "/images/cocina/miel-bosque-negro.jfif",
    precio: 445,
    unidad: "350 g",
    categoria: "Mieles",
  },
];
