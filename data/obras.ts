export interface Obra {
  id: number;
  titulo: string;
  autor: string;
  anio: string;
  descripcion: string;
  estrellas: number;
  imagen: string;
}

// Imágenes de muestra (picsum.photos). Para usar obras reales,
// coloca los archivos en /public/obras y cambia "imagen" a "/obras/archivo.jpg".
export const obras: Obra[] = [
  {
    id: 1,
    titulo: "Ecos de la Memoria",
    autor: "Autor desconocido",
    anio: "1948",
    descripcion:
      "Ecos de la Memoria es una composición visual que explora la relación entre la nostalgia y la vida cotidiana de un pueblo.",
    estrellas: 5,
    imagen: "https://picsum.photos/id/1040/1600/900",
  },
  {
    id: 2,
    titulo: "Luz del Valle",
    autor: "Autor desconocido",
    anio: "1952",
    descripcion:
      "Una mirada serena al paisaje rural, donde la luz del atardecer define los volúmenes de la arquitectura tradicional.",
    estrellas: 4,
    imagen: "https://picsum.photos/id/1043/1600/900",
  },
  {
    id: 3,
    titulo: "Mercado al Alba",
    autor: "Autor desconocido",
    anio: "1936",
    descripcion:
      "El bullicio del mercado matutino capturado en trazos cálidos que celebran el comercio y la comunidad.",
    estrellas: 5,
    imagen: "https://picsum.photos/id/1047/1600/900",
  },
  {
    id: 4,
    titulo: "Campanario en Silencio",
    autor: "Autor desconocido",
    anio: "1960",
    descripcion:
      "El campanario domina la escena como testigo del paso del tiempo sobre las calles empedradas del pueblo.",
    estrellas: 4,
    imagen: "https://picsum.photos/id/1080/1600/900",
  },
];
