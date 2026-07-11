export interface Obra {
  id: number;
  titulo: string;
  autor: string;
  anio: string;
  descripcion: string;
  estrellas: number;
  imagen: string;
}

// Selección aleatoria de fichas para el carrusel del inicio
export const obras: Obra[] = [
  {
    id: 21,
    titulo: "Árbol de la Vida — Hojas de Cristal",
    autor: "BestAlice",
    anio: "2023",
    descripcion:
      "Escultura de mesa con más de cien hojas de acrílico translúcido en un espectro completo de color. La luz que atraviesa las hojas proyecta sombras cromáticas sobre la superficie, convirtiendo el entorno en parte de la obra.",
    estrellas: 5,
    imagen: "/obras/arbol-vida-cristal/principal.jpg",
  },
  {
    id: 18,
    titulo: "El Trío del Silencio",
    autor: "GMMH",
    anio: "2023",
    descripcion:
      "Tres rostros abstractos en resina plata antigüa interpretan la trilogía milenaria: Ver, Oír, Callar. La textura cincelada a mano convierte cada figura en una meditación sobre los sentidos.",
    estrellas: 5,
    imagen: "/obras/silencio-trio/principal.jpg",
  },
  {
    id: 13,
    titulo: "El Ángel — Paseo de la Reforma",
    autor: "Revolution Canvas",
    anio: "2024",
    descripcion:
      "La Columna de la Independencia emerge como eje central de una composición explosiva. Rascacielos de teal y magenta flanquean el Paseo de la Reforma bajo una lluvia de naranjas, rojos y ocres.",
    estrellas: 5,
    imagen: "/obras/angel-reforma/principal.jpg",
  },
  {
    id: 9,
    titulo: "Underground Fantasy",
    autor: "Merck Rathke",
    anio: "c. 1925",
    descripcion:
      "Una escena de misterio urbano: figuras estilizadas deambulan entre columnas y palmeras esquemáticas bajo una atmósfera cargada de tensión social y elegancia expresionista.",
    estrellas: 5,
    imagen: "/obras/merck-rathke/principal.jpg",
  },
];
