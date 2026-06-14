export interface Artista {
  id: number;
  nombre: string;
  vida: string;
  origen: string;
  foto: string;
  bio: string;
}

// Fotos de muestra (picsum.photos). Para fotos reales,
// coloca los archivos en /public/artistas y actualiza "foto".
export const artistas: Artista[] = [
  {
    id: 1,
    nombre: "José María Obregón",
    vida: "1832 – 1902",
    origen: "Ciudad de México, México",
    foto: "https://picsum.photos/seed/artista-1/400/400",
    bio: "Pintor academicista mexicano formado en la Academia de San Carlos, donde más tarde fue profesor. Su obra combina el rigor del dibujo académico con temas históricos y alegóricos que marcaron a toda una generación de artistas mexicanos del siglo XIX.",
  },
  {
    id: 2,
    nombre: "Saturnino Herrán",
    vida: "1887 – 1918",
    origen: "Aguascalientes, México",
    foto: "https://picsum.photos/seed/artista-2/400/400",
    bio: "Uno de los grandes pintores del modernismo mexicano. En apenas una década de carrera construyó un lenguaje propio que dignifica los oficios, las fiestas y los rostros del pueblo, anticipando los temas que el muralismo haría suyos años después.",
  },
  {
    id: 3,
    nombre: "Diego Rivera",
    vida: "1886 – 1957",
    origen: "Guanajuato, México",
    foto: "https://picsum.photos/seed/artista-3/400/400",
    bio: "Figura central del muralismo mexicano. Sus murales narran la historia, el trabajo y las luchas del pueblo con una monumentalidad que le dio proyección mundial; su obra de caballete es igualmente celebrada por su color y su ternura hacia lo cotidiano.",
  },
  {
    id: 4,
    nombre: "Jorge González Camarena",
    vida: "1908 – 1980",
    origen: "Guadalajara, México",
    foto: "https://picsum.photos/seed/artista-4/400/400",
    bio: "Muralista, pintor y escultor. Heredero de la segunda generación del muralismo, desarrolló un estilo geométrico y alegórico propio; su obra aborda la fusión cultural, la constitución y la identidad nacional con figuras monumentales y colores intensos.",
  },
];
