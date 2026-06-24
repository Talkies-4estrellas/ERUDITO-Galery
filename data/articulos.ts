export interface Articulo {
  id: number;
  titulo: string;
  categoria: string;
  fecha: string;
  extracto: string;
  imagen: string;
  autor: string;
  minLectura: number;
  contenido: string[];
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
    contenido: [
      "El muralismo mexicano nació de una convicción radical: el arte debía salir de los museos y hablar directamente al pueblo. Tras la Revolución de 1910, el gobierno de José Vasconcelos encargó a Rivera, Orozco y Siqueiros pintar las paredes de edificios públicos con historias que narraran la lucha de clases, la identidad indígena y el proyecto nacional. El resultado fue un movimiento sin precedentes en escala y ambición política.",
      "Diego Rivera construyó frescos de proporciones épicas en la Secretaría de Educación Pública y el Palacio Nacional. Orozco eligió un lenguaje más oscuro y expresionista, cargado de angustia y crítica moral, visible en los murales del Hospicio Cabañas de Guadalajara, declarados Patrimonio de la Humanidad. Siqueiros, el más militante de los tres, experimentó con pistolas de aire comprimido y materiales sintéticos, anticipando el action painting décadas antes que Pollock.",
      "La influencia del muralismo se percibe hoy en múltiples corrientes. El arte callejero latinoamericano cita explícitamente a Orozco en su paleta y a Rivera en su narrativa colectiva. Artistas chicanos como Judy Baca retomaron la tradición mural para documentar la historia de los barrios de Los Ángeles. En Europa, la instalación monumental de figuras como Thomas Hirschhorn tiene deudas evidentes con la idea de arte como espacio político total.",
      "Para los coleccionistas, las obras de caballete de los tres maestros —bocetos, óleos, acuarelas— representan piezas con altísima demanda en subastas internacionales. Christie's y Sotheby's los incluyen regularmente en sus grandes remates de arte latinoamericano, donde los precios han escalado de forma consistente en la última década. Entender el muralismo no es solo historia del arte: es entender cómo el mercado valora la carga simbólica de una imagen.",
    ],
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
    contenido: [
      "El primer error de quienes se acercan al coleccionismo es creer que se necesita capital de galería para empezar. La realidad es que las colecciones más interesantes del mundo comenzaron con compras de bajo costo a artistas desconocidos. Charles Saatchi adquirió obras de Damien Hirst cuando este era estudiante; el precio era una fracción de lo que valen hoy.",
      "Las ferias de arte emergente —MACO, Zona Maco Foto, material art fair en Ciudad de México, o arteBA en Buenos Aires— son el mejor laboratorio para el coleccionista novato. Los precios suelen oscilar entre 200 y 3,000 dólares, el acceso directo al artista permite una conversación genuina, y la experiencia de caminar entre obras recién creadas es irreemplazable. Lleva efectivo, ve el primer día y no compres nada en los primeros 45 minutos: da tiempo al ojo de calibrar.",
      "Las impresiones en edición limitada son otro punto de entrada inteligente. Un grabado numerado y firmado de un artista establecido puede costar entre 300 y 1,500 dólares y mantiene o aumenta su valor si la edición es pequeña y el artista continúa creciendo. Plataformas como Printed Matter o editoriales locales de arte gráfico publican lotes asequibles con regularidad.",
      "La regla de oro: compra lo que genuinamente te mueve, no lo que crees que subirá de precio. Las colecciones construidas con criterio estético personal son más coherentes, más fáciles de curar y, paradójicamente, suelen resultar mejores inversiones que las ensambladas con lógica puramente especulativa.",
    ],
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
    contenido: [
      "En marzo de 2021, Beeple vendió «Everydays: The First 5000 Days» en Christie's por 69 millones de dólares. El archivo era un JPG. Desde ese momento, la pregunta dejó de ser «¿puede el arte digital tener valor?» y pasó a ser «¿cómo se certifica, custodia y transfiere ese valor?». La respuesta que el mercado ha ensayado con mayor consistencia es la tokenización mediante blockchain.",
      "Un NFT (token no fungible) no es la obra en sí: es un certificado de propiedad inscrito en una cadena de bloques pública que vincula al propietario con un archivo digital específico. La obra puede copiarse infinitamente, pero el registro de quién posee el «original» es inmutable. Esta separación entre copia y propiedad es el mismo principio que opera en el arte físico: cualquiera puede imprimir una reproducción de La Gioconda, pero la propiedad legal de la tabla del Louvre es irrepetible.",
      "El modelo adoptado por galerías como ERUDITO va un paso más allá del NFT especulativo: el JPG Certificado combina un archivo de alta resolución con un certificado físico firmado por el artista, una ficha técnica completa y un registro en cadena que puede transferirse en futuras ventas. Esto resuelve el problema de la permanencia: si una blockchain se depreca, el certificado físico sigue siendo válido.",
      "El mercado de arte digital ha madurado notablemente desde el pico especulativo de 2021-2022. Los coleccionistas más sofisticados ahora distinguen entre proyectos PFP (profile picture) puramente especulativos y obras de artistas con trayectoria documentada. En este segundo segmento, los precios son más estables y la demanda más consistente. Para quien quiere iniciarse en el coleccionismo digital, este es el punto de entrada más sensato.",
    ],
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
    contenido: [
      "Saturnino Herrán nació en Aguascalientes en 1887 y murió en Ciudad de México en 1918, a los 31 años, sin haber visto impreso su proyecto más ambicioso: «Nuestros Dioses», un tríptico monumental donde la Coatlicue azteca y el Cristo cristiano se funden en una síntesis que anticipó todo lo que el muralismo haría suyo una década después. La obra quedó inconclusa. El autor, olvidado.",
      "«Cuando llegué al archivo de su familia, encontré más de doscientos dibujos que nadie había catalogado», cuenta la curadora Mariana Ruiz, quien pasó tres años reconstruyendo la trayectoria completa de Herrán. «Era un artista que observaba al pueblo con una ternura que ningún pintor de su época se permitía. Sus vendedores de flores, sus arrieros, sus mujeres con trajes de tehuana no son tipos folklóricos: son personas con dignidad interior.»",
      "Las obras de Herrán comenzaron a aparecer en subastas internacionales a partir de 2019, cuando Morton Subastas presentó «La Tehuana» con una estimación de 800,000 pesos y la remató en 2.4 millones. Desde entonces, cada aparición de una pieza documentada de su autoría genera una guerra de pujas. «El mercado tardó cien años en ponerse al día con su genio», dice Ruiz. «Pero cuando lo hace, lo hace de golpe.»",
      "Para los coleccionistas interesados en Herrán, el consejo de Ruiz es claro: exigir documentación completa. «Hay muchas obras atribuidas que no aguantan el escrutinio técnico. El archivo que hemos construido permite comparar paleta, trazo y soporte con precisión. Una obra sin cadena de custodia documentada no vale lo que el vendedor pide, por bella que sea.»",
    ],
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
    contenido: [
      "Una pintura al óleo no está terminada cuando el artista deja el pincel: sigue cambiando durante décadas. Los pigmentos se oxidan, los barnices amarillean y las capas de pintura contraen y expanden con la humedad y la temperatura. Este proceso vivo es lo que da a los óleos antiguos esa profundidad que las reproducciones nunca capturan del todo, pero también lo que convierte al coleccionista en custodio activo de una obra.",
      "La estructura de una pintura al óleo es estratigráfica. Debajo de lo visible hay una imprimación (gesso o bolo armenio), luego el dibujo preparatorio (a veces visible con luz ultravioleta), las veladuras intermedias y finalmente los empastes de superficie. Cada capa debe secarse adecuadamente antes de recibir la siguiente, o se producen craquelados prematuros. Un restaurador experimentado puede leer esta estratigrafía como un geólogo lee una sección de roca.",
      "Al examinar una obra antes de comprar, busca tres cosas: la uniformidad del craquelado (patrón regular sugiere envejecimiento natural; grietas irregulares pueden indicar daño o restauración chapuza), la cohesión del barniz (un barniz oxidado da tonos amarillentos uniformes que se pueden limpiar; manchas o zonas mate pueden señalar intervenciones anteriores), y el estado de los bordes (la pintura que se extiende sobre los filos del bastidor confirma que la obra no ha sido recortada).",
      "La conservación preventiva es la inversión más barata que puede hacer un coleccionista: temperatura constante entre 18 y 22 °C, humedad relativa entre 45 y 55%, luz indirecta sin componente UV y un barniz de protección renovado cada diez o quince años. Estas condiciones pueden duplicar la vida útil de una obra sin ningún costo de restauración.",
    ],
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
    contenido: [
      "El informe Art Basel & UBS 2024 señaló a Latinoamérica como la región con mayor crecimiento en volumen de ventas de arte primario —es decir, obras vendidas por primera vez— durante tres años consecutivos. Detrás de esta cifra hay algo más que moda: hay una generación de artistas que formó su visión en la tensión entre tradición indígena y cultura digital, entre memoria histórica y violencia presente, y que habla un lenguaje genuinamente nuevo.",
      "Ciudad de México es el epicentro. El ecosistema local —con ferias como material art fair, una red densa de espacios independientes y la presencia de coleccionistas institucionales formados en el extranjero que regresan— ha creado condiciones excepcionalmente fértiles. Nombres como Daniela Edburg, Tercerunquinto o Fernando Palma Rodríguez son ya referencias internacionales; la generación que está en los treinta apenas se está instalando en el mercado.",
      "El factor precio todavía trabaja a favor del comprador. Un óleo de formato mediano de un artista mexicano emergente con presencia en ferias internacionales puede costar entre 3,000 y 12,000 dólares. Comparado con equivalentes del mercado neoyorquino o londinense —donde el mismo perfil de artista arranca en 20,000— el diferencial es suficiente para justificar el riesgo de apostar a largo plazo.",
      "La estrategia de los coleccionistas más perspicaces combina tres palancas: seguir las becas y residencias (artistas seleccionados por el FONCA o la Fundación Jumex tienen curación previa), comprar en ediciones de obra gráfica antes de que el artista escale a pintura —es más barato y permite probar el ojo—, y mantener conversación directa con galerías pequeñas que representan a los artistas. El coleccionismo latinoamericano es todavía un deporte de contacto.",
    ],
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
    contenido: [
      "La restauración de arte es, ante todo, una disciplina de la prudencia. El principio rector que guía a todo conservador-restaurador serio es la reversibilidad: cualquier intervención que se haga sobre una obra debe poder deshacerse sin dejar huella. Esta regla, que parece evidente, ha sido violada sistemáticamente a lo largo de la historia, con consecuencias a veces irreparables.",
      "Las herramientas de diagnóstico moderno permiten leer una obra antes de tocarla. La radiografía revela el dibujo preparatorio y las correcciones del artista —los llamados pentimenti— que la pintura de superficie oculta. La reflectografía infrarroja distingue tipos de pigmento y puede identificar adiciones posteriores de manos diferentes. La fluorescencia de rayos X mapea la distribución de elementos químicos capa por capa, permitiendo saber si el azul que vemos es lapislázuli del siglo XVII o azul de Prusia del XIX.",
      "El reto mayor del restaurador moderno no es técnico sino ético: ¿hasta dónde completar? La filosofía predominante hoy prefiere la «reintegración perceptiva» —rellenar lagunas con tonos neutros que no compitan visualmente con el original— sobre la «restauración total» que implicaba inventar lo que el artista no pintó. El espectador moderno ha aprendido a leer estas marcas de honestidad como parte de la historia de la obra.",
      "Para un coleccionista, el historial de restauración es un documento tan importante como el certificado de autoría. Una ficha de condición detallada, con fotografías antes y después de cada intervención y los materiales utilizados, puede duplicar el valor de una obra en el mercado secundario. Las obras sin historial documentado viajan al mercado con una incertidumbre que los compradores más sofisticados descuentan del precio.",
    ],
  },
];

export function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
