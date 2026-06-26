export interface PasoServicio {
  numero: string;
  titulo: string;
  descripcion: string;
}

export interface Servicio {
  slug: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  detalle: string;
  beneficios: string[];
  proceso: PasoServicio[];
  desde: string;
  icono: string;
  imagen: string;
  acento: string;
}

export const servicios: Servicio[] = [
  {
    slug: "registro-de-obras",
    titulo: "Registro de Obras",
    subtitulo: "Certificación y documentación con respaldo legal y técnico",
    descripcion:
      "Documentamos y certificamos tu obra para incluirla en nuestro catálogo oficial, con respaldo legal y técnico que incrementa su valor de mercado.",
    detalle:
      "El registro de una obra en ERUDITO Galery no es solo un trámite administrativo: es el primer paso para que tu creación entre al mercado del arte con todas las garantías. Trabajamos con expertos en derecho de autor, historiadores del arte y tasadores certificados para construir un expediente completo que acompaña a la pieza durante toda su vida comercial.",
    beneficios: [
      "Certificado digital de autenticidad con firma criptográfica",
      "Registro en el catálogo histórico de ERUDITO Galery",
      "Tasación inicial incluida en el proceso",
      "Ficha técnica redactada por curadores especializados",
      "Presencia permanente en nuestro buscador público",
      "Protección ante plagios y reproducciones no autorizadas",
    ],
    proceso: [
      { numero: "01", titulo: "Recepción de solicitud", descripcion: "Envías las imágenes de alta resolución y la documentación básica de la obra." },
      { numero: "02", titulo: "Revisión curatorial", descripcion: "Nuestro equipo analiza la autenticidad, técnica y estado de conservación." },
      { numero: "03", titulo: "Tasación y ficha técnica", descripcion: "Un tasador certificado establece el valor inicial y redactamos la ficha completa." },
      { numero: "04", titulo: "Emisión del certificado", descripcion: "Recibes el certificado digital firmado y la obra queda publicada en el catálogo." },
    ],
    desde: "$200 USD",
    icono: "📋",
    imagen: "https://picsum.photos/seed/serv-registro/1200/500",
    acento: "amber",
  },
  {
    slug: "grupo-de-coleccionistas",
    titulo: "Grupo de Coleccionistas",
    subtitulo: "Comunidad privada con acceso preferente a piezas exclusivas",
    descripcion:
      "Únete a una comunidad privada de coleccionistas con acceso preferente a piezas exclusivas, subastas cerradas y asesoría personalizada de inversión.",
    detalle:
      "El Grupo de Coleccionistas de ERUDITO Galery reúne a los perfiles más activos del mercado del arte en Latinoamérica. Sus miembros acceden a oportunidades de adquisición antes de que las obras lleguen al mercado abierto, participan en subastas privadas y reciben reportes periódicos sobre tendencias y valoraciones.",
    beneficios: [
      "Acceso a subastas privadas mensuales",
      "Vista previa exclusiva de nuevas incorporaciones",
      "Asesor de colección asignado",
      "Reportes trimestrales de valoración de tu cartera",
      "Invitaciones a inauguraciones y eventos VIP",
      "Red de networking con artistas y galeristas",
    ],
    proceso: [
      { numero: "01", titulo: "Solicitud de membresía", descripcion: "Completas el formulario y un asesor evalúa el perfil de tu colección actual." },
      { numero: "02", titulo: "Entrevista de ingreso", descripcion: "Reunión con el coordinador del grupo para conocer tus intereses y objetivos." },
      { numero: "03", titulo: "Activación de cuenta", descripcion: "Accedes a la plataforma privada con el catálogo exclusivo y calendario de subastas." },
      { numero: "04", titulo: "Asesoría continua", descripcion: "Tu asesor te contacta mensualmente con oportunidades alineadas a tu perfil." },
    ],
    desde: "$500 USD / año",
    icono: "🏛️",
    imagen: "https://picsum.photos/seed/serv-coleccionistas/1200/500",
    acento: "violet",
  },
  {
    slug: "restauracion-de-arte",
    titulo: "Restauración de Arte",
    subtitulo: "Conservación y restauración de obras históricas y contemporáneas",
    descripcion:
      "Especialistas en conservación preventiva y restauración activa de obras históricas y contemporáneas, con documentación fotográfica de todo el proceso.",
    detalle:
      "La restauración de una obra de arte es una intervención delicada que requiere conocimiento científico, sensibilidad estética y respeto por la intención original del artista. En ERUDITO Galery trabajamos con restauradores certificados por el ICOM que aplican metodologías reconocidas internacionalmente.",
    beneficios: [
      "Diagnóstico fotográfico y análisis de materiales sin costo",
      "Plan de intervención documentado y aprobado por el propietario",
      "Certificado de restauración para archivo y reventa",
      "Reporte fotográfico antes/durante/después",
      "Almacenamiento temporal en condiciones controladas",
      "Garantía de 5 años sobre la intervención realizada",
    ],
    proceso: [
      { numero: "01", titulo: "Diagnóstico inicial", descripcion: "Examinamos la obra con luz ultravioleta, rayos X y fotografía multiespectral." },
      { numero: "02", titulo: "Propuesta de intervención", descripcion: "Presentamos un plan detallado con materiales, tiempo y presupuesto." },
      { numero: "03", titulo: "Restauración", descripcion: "El equipo interviene la obra en nuestro taller climatizado, documentando cada paso." },
      { numero: "04", titulo: "Entrega y certificación", descripcion: "Recibes la obra con su certificado de restauración y el archivo fotográfico completo." },
    ],
    desde: "$300 USD",
    icono: "🖌️",
    imagen: "https://picsum.photos/seed/serv-restauracion/1200/500",
    acento: "emerald",
  },
  {
    slug: "museos-asociaciones-y-galerias",
    titulo: "Museos, Asociaciones y Galerías",
    subtitulo: "Alianzas institucionales para exhibiciones y programas educativos",
    descripcion:
      "Desarrollamos alianzas con museos, asociaciones culturales y galerías para préstamos, exhibiciones conjuntas y programas educativos de largo plazo.",
    detalle:
      "ERUDITO Galery actúa como nexo entre el mercado privado y las instituciones culturales. Facilitamos préstamos de colecciones, coproducimos exposiciones temáticas y diseñamos programas de extensión educativa que vinculan a los artistas con sus audiencias más amplias.",
    beneficios: [
      "Gestión completa de contratos de préstamo y seguro",
      "Producción de material curatorial y didáctico",
      "Logística de traslado con embalaje especializado",
      "Cobertura de seguro internacionall todo riesgo",
      "Difusión en redes propias y medios especializados",
      "Evaluación de impacto y reporte de público",
    ],
    proceso: [
      { numero: "01", titulo: "Propuesta institucional", descripcion: "La institución presenta su proyecto y colecciones de interés." },
      { numero: "02", titulo: "Negociación y contratos", descripcion: "Coordinamos los términos de préstamo, seguros y derechos de imagen." },
      { numero: "03", titulo: "Producción y montaje", descripcion: "Apoyamos la curaduría, el diseño del espacio y el material gráfico." },
      { numero: "04", titulo: "Inauguración y seguimiento", descripcion: "Presencia de ERUDITO Galery en el evento y monitoreo de la exposición." },
    ],
    desde: "Consultar",
    icono: "🏗️",
    imagen: "https://picsum.photos/seed/serv-museos/1200/500",
    acento: "sky",
  },
  {
    slug: "manager-de-ventas",
    titulo: "Manager de Ventas",
    subtitulo: "Un agente dedicado que gestiona tu colección con estrategia",
    descripcion:
      "Un agente dedicado que gestiona la venta de tu colección con estrategia, discreción y acceso directo a compradores calificados en todo el mundo.",
    detalle:
      "Vender una obra de arte no es como vender cualquier bien. Requiere timing, red de contactos, negociación discreta y posicionamiento estratégico. Nuestros managers de ventas tienen años de experiencia en el mercado primario y secundario, y trabajan exclusivamente con un número limitado de colecciones para garantizar atención personalizada.",
    beneficios: [
      "Agente exclusivo asignado a tu colección",
      "Acceso a compradores calificados en más de 15 países",
      "Estrategia de precio y posicionamiento personalizada",
      "Negociación confidencial sin exposición pública",
      "Comisión solo en caso de venta exitosa",
      "Informe mensual de actividad y prospectos",
    ],
    proceso: [
      { numero: "01", titulo: "Evaluación de colección", descripcion: "Revisamos las piezas disponibles, su historial y potencial de mercado." },
      { numero: "02", titulo: "Estrategia de venta", descripcion: "Definimos precio objetivo, canales y perfil del comprador ideal." },
      { numero: "03", titulo: "Presentación activa", descripcion: "El manager presenta las obras a su red de compradores y fondos de inversión." },
      { numero: "04", titulo: "Cierre y transferencia", descripcion: "Gestionamos el contrato, el pago y la entrega con total discreción." },
    ],
    desde: "15% sobre venta",
    icono: "💼",
    imagen: "https://picsum.photos/seed/serv-manager/1200/500",
    acento: "rose",
  },
  {
    slug: "exposicion",
    titulo: "Exposición",
    subtitulo: "Exposiciones temáticas presenciales o digitales para tu obra",
    descripcion:
      "Organizamos exposiciones temáticas, presenciales o en formato digital, para dar máxima visibilidad a tu obra ante compradores, críticos y medios.",
    detalle:
      "Una exposición bien producida puede transformar la carrera de un artista o el valor de una colección. En ERUDITO Galery nos encargamos de todo: desde la curaduría conceptual hasta el montaje físico, la difusión en medios y la recepción de ofertas. También desarrollamos exposiciones virtuales de alta fidelidad para colecciones que no pueden moverse físicamente.",
    beneficios: [
      "Curaduría conceptual y diseño narrativo de la exposición",
      "Producción del espacio físico o entorno digital 3D",
      "Campaña de prensa y relaciones públicas",
      "Catálogo impreso o digital de la muestra",
      "Gestión de ventas durante el período de exposición",
      "Archivo fotográfico y documental profesional",
    ],
    proceso: [
      { numero: "01", titulo: "Concepto curatorial", descripcion: "Definimos el hilo narrativo, las obras participantes y el público objetivo." },
      { numero: "02", titulo: "Producción", descripcion: "Diseñamos el espacio, producimos el material gráfico y confirmamos la logística." },
      { numero: "03", titulo: "Difusión", descripcion: "Campaña de prensa, redes sociales e invitaciones a compradores y críticos." },
      { numero: "04", titulo: "Inauguración y cierre", descripcion: "Apertura con evento privado, venta durante la muestra y catálogo final." },
    ],
    desde: "$1,500 USD",
    icono: "🎨",
    imagen: "https://picsum.photos/seed/serv-exposicion/1200/500",
    acento: "amber",
  },
];

export function getServicio(slug: string): Servicio | undefined {
  return servicios.find((s) => s.slug === slug);
}
