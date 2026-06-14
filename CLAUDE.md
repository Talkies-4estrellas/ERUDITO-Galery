@AGENTS.md

# ERUDITO Galery

Galería / marketplace de arte. Sitio en español, tema oscuro (zinc-950) con acento ámbar (amber-400).

## Stack

- Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, npm.
- Sin base de datos aún; todo el contenido vive en archivos de `data/`.

## Comandos

```
npm run dev     # servidor de desarrollo (puerto 3000)
npm run build   # build de producción (úsalo para verificar tipos y compilación)
```

## Estructura

- `app/page.tsx` — página de inicio: Navbar + Carousel + FilaFichas.
- `app/obra/[id]/page.tsx` — detalle de obra (SSG con `generateStaticParams`): resuelve la ficha y compone `DetalleObra`. NO poner clases de Tailwind nuevas aquí (ver nota abajo).
- `app/obras/page.tsx` — galería con filtros: compone `GaleriaObras`.
- `app/artista/[id]/page.tsx` — perfil de artista (SSG): compone `PerfilArtista`. Misma regla de no poner clases nuevas.
- `components/GaleriaObras.tsx` — galería (client): chips de filtro por Tamaños/Color/Movimiento/Técnica (OR dentro de grupo, AND entre grupos), contador de resultados, "Limpiar filtros" y cuadrícula responsiva de `FichaObra` con prop `fluida`.
- `components/PerfilArtista.tsx` — perfil: foto, bio, datos rápidos (obras, valoración media, nacimiento/fallecimiento), línea de tiempo "Trayectoria" (obras por año, enlazan al detalle) y fila con sus obras.
- `components/DetalleObra.tsx` — página de detalle completa: banner con la obra, visor de perspectivas + panel de información (cápsula del artista, título, descripción completa), estadísticas de valor y "Arte similar".
- `components/VisorPerspectivas.tsx` — visor estilo museo (client): imagen enmarcada sobre fondo claro, flechas y puntos para cambiar entre las vistas de `perspectivas`.
- `components/EstadisticasValor.tsx` — sección "Valor actual de la obra" (client): tarjetas con gráficas (interés mensual, valor por mes — datos de muestra hardcodeados), acordeones (Certificaciones, Activo Financiero, Entregables, FAQs) y columna de compra (precio, TIPO "JPG Certificado", botón COMPRAR, Pago Seguro).
- `components/CapsulaArtista.tsx` — píldora con avatar, nombre, vida y botón Perfil del artista.
- `components/Navbar.tsx` — barra de navegación (client component). Dropdowns con hover/clic en escritorio (visibles desde `lg`); menú hamburguesa con acordeones debajo de `lg`. Los menús con varias secciones se renderizan como mega-menú al ancho del navbar; los de una sección se anclan bajo su botón.
- `components/Carousel.tsx` — carrusel de obras (client component): auto-avance cada 6 s (pausa con hover), flechas, puntos indicadores y tarjeta con título/año/descripción/estrellas.
- `components/FichaObra.tsx` — ficha de obra: tarjeta 3:4 con imagen, título/año, descripción (clamp de 2 líneas, se expande con hover) y estrellas; debajo, cápsula del artista (avatar, nombre, vida, botón Perfil).
- `components/FilaFichas.tsx` — sección "Obras destacadas" (client component): fila horizontal de fichas con scroll-snap, scrollbar oculta y flechas de desplazamiento.
- `data/navegacion.ts` — estructura completa del menú (fuente única; editar aquí para cambiar la navegación, no los componentes).
- `data/obras.ts` — obras del carrusel. Usa placeholders de picsum.photos; para obras reales, poner archivos en `public/obras/` y cambiar `imagen` a `/obras/archivo.jpg`.
- `data/artistas.ts` — artistas (id, nombre, vida, origen, foto, bio). Las fichas referencian estos objetos.
- `data/fichas.ts` — fichas de obras: datos + `perspectivas` (vistas adicionales) + atributos filtrables (`tamano`, `color`, `movimiento`, `tecnica`). Helper `obrasDeArtista(id)`. Placeholders de picsum.

## Navegación (definida por el dueño en mapas mentales)

- **Obras**: categorías (Pinturas, Esculturas, Digital, Artesanías, Colecciones, Artículos Coleccionables, Impresiones Oficiales, Merch, Réplicas Decorativas, Drops) + filtros (Tamaños, Color, Movimiento, Técnica → Abstracto, Escultura, Retrato, Fotografía, Paisajismo, Artistas Famosos, Artesanos, Ofertas Especiales).
- **Artistas**: Artesanos · Artistas en línea (extranjeros y famosos del mundo digital) · Artistas presenciales (arte físico) · Filtros.
- **Catálogo**: En Línea · Historias · Físicos.
- **Servicios**: Registro de Obras · Grupo de Coleccionistas · Restauración de Arte · Museos, Asociaciones y Galerías · Manager de Ventas · Exposición.
- **Eventos**: Subastas (en línea / presenciales) · Exposiciones · Museos, Asociaciones y Galerías · Manager de Ventas.
- **Cocina y Alimento**: Productos — lema "La comida hoy en día también es un lujo".
- **Blog**, **Newsletter**, **Privado** (sección premium), **Contacto**: enlaces directos.

## Pendientes

- Páginas internas: la mayoría de enlaces del menú apuntan a `#` (el menú Obras ya enlaza a `/obras`; falta que las categorías/filtros lleguen pre-seleccionados vía query params).
- Footer, buscador, favoritos, sección de eventos en la home, SEO con `generateMetadata` en detalle de obra.
- Estadísticas de valor reales por obra (hoy son datos de muestra idénticos en `EstadisticasValor.tsx`); conectar precio/tipo a `data/fichas.ts`.
- El carrusel de inicio (`data/obras.ts`) aún no enlaza al detalle; unificar con `data/fichas.ts` o enlazar su botón "Ver más".
- Flujo de compra real (botón COMPRAR es decorativo).
- Reemplazar imágenes placeholder (carrusel y fichas) por obras y fotos de artistas reales.
- Definir qué incluye la sección Privado (¿requiere login?).

## Notas del entorno (Windows)

- **Tailwind no escanea archivos dentro de carpetas con corchetes** (`app/obra/[id]/`): las clases usadas SOLO ahí no se generan en el CSS (quedan sin estilo, p. ej. `h-52` → height 0). Regla: las páginas de rutas dinámicas solo componen componentes de `components/`, todo el markup con clases vive en componentes.

- La ruta del proyecto tiene espacio (`C:\ERUDITO Galery`): para lanzarlo desde fuera usar `npm.cmd run dev --prefix "C:\ERUDITO Galery"`. NO usar la ruta corta 8.3 (`C:\ERUDIT~1`): rompe Turbopack.
- `package.json` debe guardarse en UTF-8 **sin BOM** (PowerShell 5.1 `Set-Content -Encoding utf8` agrega BOM y rompe el build).
- El preview server está configurado en `C:\Users\Migue\.claude\launch.json` (nombre `erudito-dev`, `autoPort: true`).
- `preview_screenshot` se atasca tras navegar con `location.href`; navegar con clics reales (Links de Next, SPA) lo mantiene funcionando. Si se atasca, reiniciar el preview.
