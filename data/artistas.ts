export interface Artista {
  id: number;
  nombre: string;
  vida: string;
  origen: string;
  foto: string;
  bio: string;
}

// artistas[0] = Revolution Canvas (id 7)
// artistas[1] = Ideas Creativas    (id 6)
// artistas[2] = Atelier Geométrico (id 8)
// artistas[3] = Merck Rathke       (id 5)
// artistas[4] = Arte & Memorias    (id 9)
// artistas[5] = HAUCOZE            (id 10)
// artistas[6] = UTTCMK             (id 11)
// artistas[7] = GMMH               (id 12)
// artistas[8] = Pop Maze Art       (id 13)
// artistas[9] = Carta Mundi        (id 14)
// artistas[10] = BestAlice         (id 15)
// artistas[11] = Yihui Arts        (id 16)
// artistas[12] = Suruim            (id 17)
export const artistas: Artista[] = [
  {
    id: 7,
    nombre: "Revolution Canvas",
    vida: "2018 – presente",
    origen: "Arte Digital",
    foto: "https://picsum.photos/seed/artista-7/400/400",
    bio: "Colectivo de arte digital que reinterpreta obras maestras del arte clásico con una estética urbana y de vanguardia. Sus piezas fusionan la monumentalidad de los grandes maestros con salpicaduras de color, grafiti y abstracción cromática, creando un diálogo vibrante entre el pasado y el presente.",
  },
  {
    id: 6,
    nombre: "Ideas Creativas",
    vida: "2020 – presente",
    origen: "Arte Digital",
    foto: "https://picsum.photos/seed/artista-6/400/400",
    bio: "Estudio de arte digital especializado en ilustraciones hiperrealistas de la naturaleza. Sus obras combinan fotografía de alta precisión con técnicas de pintura digital para capturar la vitalidad y el color de la fauna silvestre, creando piezas decorativas de gran impacto visual.",
  },
  {
    id: 8,
    nombre: "Atelier Geométrico",
    vida: "2015 – presente",
    origen: "Diseño Contemporáneo",
    foto: "https://picsum.photos/seed/artista-8/400/400",
    bio: "Estudio de diseño especializado en esculturas decorativas de geometría low-poly. Sus piezas traducen la elegancia de la naturaleza — fauna, flora, figuras humanas — en formas facetadas de alta precisión, trabajadas en resina de alta densidad con acabados metálicos lujosos. Cada colección es una edición limitada pensada para espacios de diseño de autor.",
  },
  {
    id: 5,
    nombre: "Merck Rathke",
    vida: "1890 – 1960",
    origen: "Alemania",
    foto: "https://picsum.photos/seed/artista-5/400/400",
    bio: "Pintor expresionista de origen alemán reconocido por su tratamiento singular de la figura humana: siluetas alargadas y estilizadas que capturan la tensión social y el misterio de la vida urbana. Su paleta cálida de ocres, rosas y negros profundos define un universo visual inconfundible en el que personajes enigmáticos coexisten entre lo real y lo onírico.",
  },
  {
    id: 9,
    nombre: "Arte & Memorias",
    vida: "2018 – presente",
    origen: "Arte Relacional",
    foto: "https://picsum.photos/seed/artista-9/400/400",
    bio: "Estudio dedicado al arte participativo y de memoria colectiva. Sus piezas — árboles de huellas, mapas de firmas, lienzos de votos — se conciben vacías y se completan con la presencia de cada invitado, convirtiendo cada evento en una obra única e irrepetible. El resultado es un objeto que contiene la huella literal de quienes estuvieron ahí.",
  },
  {
    id: 10,
    nombre: "HAUCOZE",
    vida: "2016 – presente",
    origen: "Escultura Contemporánea",
    foto: "https://picsum.photos/seed/artista-10/400/400",
    bio: "Estudio de escultura figurativa especializado en colecciones de resina de alta densidad con acabados metálicos. Sus series capturan la energía del movimiento humano — músicos, deportistas, figuras urbanas — en piezas de detalle milimétrico pensadas para espacios de diseño contemporáneo. Cada figura es un instante congelado en actitud máxima.",
  },
  {
    id: 11,
    nombre: "UTTCMK",
    vida: "2019 – presente",
    origen: "Escultura Abstracta",
    foto: "https://picsum.photos/seed/artista-11/400/400",
    bio: "Estudio de escultura abstracta especializado en figuras humanas de línea fluida con acabados en arenisca y resina natural. Sus piezas capturan estados contemplativos — el pensamiento, la lectura, la meditación — en formas orgánicas depuradas de todo detalle superfluo, pensadas para enriquecer espacios de trabajo, biblioteca y diseño nórdico.",
  },
  {
    id: 12,
    nombre: "GMMH",
    vida: "2017 – presente",
    origen: "Escultura Expresionista",
    foto: "https://picsum.photos/seed/artista-12/400/400",
    bio: "Estudio especializado en esculturas de rostros abstractos con acabados en resina patinada. Sus colecciones exploran las emociones humanas fundamentales — el silencio, la introspección, la escucha — a través de formas expresionistas que fusionan textura orgánica con plata antigüa. Cada pieza es un estudio del gesto y la presencia, pensada para espacios de diseño intelectual.",
  },
  {
    id: 13,
    nombre: "Pop Maze Art",
    vida: "2019 – presente",
    origen: "Arte Digital",
    foto: "https://picsum.photos/seed/artista-13/400/400",
    bio: "Estudio de impresión artística especializado en el estilo WPAP (Wedha's Pop Art Portrait): retratos fragmentados en planos de color plano y bordes nítidos que transforman figuras icónicas de la cultura pop en composiciones geométricas de alta energía. Sus prints en canvas de alta resolución están pensados para espacios jóvenes, estudios creativos y colecciones de cultura pop contemporánea.",
  },
  {
    id: 14,
    nombre: "Carta Mundi",
    vida: "2016 – presente",
    origen: "Cartografía Histórica",
    foto: "https://picsum.photos/seed/artista-14/400/400",
    bio: "Estudio editorial especializado en la reproducción de cartografía histórica de alta fidelidad. Sus prints recuperan mapas originales de los siglos XVII al XIX — John Senex, Mercator, Blaeu — e imprimen sus detalles caligráficos y notaciones geográficas sobre canvas con pátina de pergamino envejecido. Cada pieza es un documento visual de cómo la humanidad imaginó el mundo antes de los satélites.",
  },
  {
    id: 15,
    nombre: "BestAlice",
    vida: "2020 – presente",
    origen: "Arte Decorativo",
    foto: "https://picsum.photos/seed/artista-15/400/400",
    bio: "Estudio de escultura decorativa especializado en árboles de la vida con hojas de acrílico translúcido. Cada pieza entrelaza ramas de alambre pintado a mano con hojas individuales en vidrio acrílico de color — un espectro que va del amarillo y naranja al rojo, violeta, azul y verde esmeralda. Sus esculturas capturan la abundancia cromática de la naturaleza en objetos de mesa pensados para escritorios, consolas y espacios de meditación.",
  },
  {
    id: 16,
    nombre: "Yihui Arts",
    vida: "2010 – presente",
    origen: "Pintura Decorativa",
    foto: "https://picsum.photos/seed/artista-16/400/400",
    bio: "Estudio especializado en pintura sobre canvas pintada a mano con textura en relieve. Sus obras combinan fondos abstractos de capas superpuestas —azules, grises y verdes al óleo— con motivos centrales de gran impacto visual: árboles desnudos, paisajes serenos y composiciones contemplativos que aportan calma y profundidad a cualquier espacio. Cada pieza incorpora acentos de pigmento dorado o ámbar que añaden calidez al conjunto.",
  },
  {
    id: 17,
    nombre: "Suruim",
    vida: "2018 – presente",
    origen: "Escultura Decorativa",
    foto: "https://picsum.photos/seed/artista-17/400/400",
    bio: "Estudio de escultura decorativa especializado en figuras de animales con personalidad urbana. Sus piezas transforman arquetipos de la fauna — bulldogs, osos, conejos — en personajes dandis vestidos con trajes, pajaritas doradas y accesorios removibles. La resina de alta densidad con acabados mate y detalles en metal dorado convierte cada figura en un objeto de colección funcional: charola de escritorio, hucha o elemento escultórico de diseño.",
  },
];
