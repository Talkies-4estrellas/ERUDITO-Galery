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

## Estructura de páginas

- `app/page.tsx` — inicio: Navbar + Carousel + SeccionEventos + FilaFichas + Footer.
- `app/obra/[id]/page.tsx` — detalle de obra (SSG): resuelve la ficha y compone `DetalleObra`. NO poner clases de Tailwind aquí (ver nota).
- `app/obras/page.tsx` — galería con filtros: compone `GaleriaObras` dentro de `<Suspense>`.
- `app/artista/[id]/page.tsx` — perfil de artista (SSG): compone `PerfilArtista`. Misma regla.
- `app/layout.tsx` — raíz: importa `Footer` para que aparezca en todas las páginas.
- `app/artistas/page.tsx` — compone `PaginaArtistas` (server, sin filtros aún).
- `app/catalogo/page.tsx` — compone `PaginaCatalogo` (secciones con anclas `#en-linea`, `#fisicos`, `#historias`).
- `app/servicios/page.tsx` — compone `PaginaServicios` (anclas por servicio, p. ej. `#registro-de-obras`).
- `app/favoritos/page.tsx` — compone `PaginaFavoritos` (client, lee de `useFavoritos`).

## Componentes

- `components/Navbar.tsx` — barra (client). Dropdowns en escritorio (`lg`); hamburguesa en móvil. Incluye botón lupa que abre `BuscadorModal`, escucha `Ctrl+K` / `⌘K` globalmente, y un ícono de corazón con badge (cuenta de `useFavoritos`) que enlaza a `/favoritos`.
- `components/BuscadorModal.tsx` — modal de búsqueda (client). Recibe `open`, `onClose`, `query`, `setQuery` del Navbar. Busca en `fichas` y `artistas` al instante; Enter navega al primer resultado.
- `components/Footer.tsx` — footer (client): 4 columnas (Marca, Explorar, Servicios, Newsletter). El formulario de newsletter muestra confirmación amber al suscribirse. Enlaces de Explorar/Servicios apuntan a las páginas reales (`/artistas`, `/catalogo`, `/favoritos`, `/servicios#...`).
- `components/BotonFavorito.tsx` — botón corazón (client, prop `id`, `tamano: "sm" | "lg"`). Usa `useFavoritos`; `e.preventDefault()`/`stopPropagation()` para no disparar el `Link` padre.
- `components/PaginaArtistas.tsx` / `PaginaCatalogo.tsx` / `PaginaServicios.tsx` / `PaginaFavoritos.tsx` — contenido de esas páginas (ver arriba).
- `components/SeccionEventos.tsx` — fila horizontal (server, scroll nativo sin JS) de `data/eventos.ts`: badge de fecha, tipo (Subasta/Exposición), modalidad, lugar, descripción y botón "Más información" (decorativo).
- `components/Carousel.tsx` — carrusel (client): auto-avance 6 s, pausa con hover, flechas, puntos.
- `components/FichaObra.tsx` — tarjeta de obra: imagen 3:4, título/año, descripción (hover expande), estrellas, cápsula del artista. Prop `fluida` (true = `w-full` para cuadrícula, false = ancho fijo para fila).
- `components/FilaFichas.tsx` — fila horizontal scroll-snap (client). Recibe `titulo` y `lista: FichaArte[]`.
- `components/GaleriaObras.tsx` — galería (client + Suspense interno). Filtros OR/AND con `useSearchParams` como fuente de verdad: URL `?tamano=grande&movimiento=muralismo` activa chips. `router.replace` sincroniza URL al toglear.
- `components/DetalleObra.tsx` — detalle completo: banner, `VisorPerspectivas`, panel info, `EstadisticasValor`, "Arte similar".
- `components/VisorPerspectivas.tsx` — visor museo (client): imagen enmarcada, flechas y puntos entre 4 perspectivas.
- `components/EstadisticasValor.tsx` — sección de valor (client). Recibe `ficha: FichaArte`. Gráfica de interés (barras purple, escala dinámica), gráfica de valor 12 meses (Jun resaltado cyan, normalizada 15-100%), precio real, tipo de entrega, % de cambio vs mes anterior, acordeones con certificaciones únicas por obra, columna de compra.
- `components/CapsulaArtista.tsx` — píldora: avatar, nombre, vida, botón Perfil → `/artista/[id]`.
- `components/PerfilArtista.tsx` — perfil: foto, bio, datos rápidos, timeline "Trayectoria", fila de obras.

## Favoritos

- `hooks/useFavoritos.ts` — lista de ids favoritos persistida en `localStorage` (clave `erudito-favoritos`). Expone `favoritos`, `alternar(id)`, `esFavorito(id)`, `listo`.
- **Importante**: el cálculo de `nuevos` y el side-effect (`localStorage.setItem` + `dispatchEvent`) ocurren en el cuerpo de `alternar`, NUNCA dentro del callback de `setFavoritos`. Hacerlo dentro del updater causaba `"Cannot update a component while rendering a different component"`, porque React puede invocar updaters durante el render y el `dispatchEvent` actualiza otras instancias (Navbar) de forma cruzada.
- Sincronización entre componentes: evento custom `"erudito-favoritos-cambio"` en `window` + `"storage"` para multi-pestaña.

## Datos

- `data/navegacion.ts` — fuente única del menú. Los items de Obras ya usan query params reales (`?tecnica=oleo`, `?movimiento=muralismo`, `?tamano=grande`, etc.). Artistas/Catálogo/Servicios ya enlazan a `/artistas`, `/catalogo#...`, `/servicios#...` en vez de `#`.
- `data/eventos.ts` — 4 eventos de muestra (Subasta/Exposición × En línea/Presencial) con fechas relativas a 2026. Cada uno: `fechaCorta` (día+mes para el badge), `lugar`, `imagen`, `descripcion`.
- `data/obras.ts` — obras del carrusel (4 entradas, independientes de fichas).
- `data/artistas.ts` — 4 artistas: José María Obregón (id 1), Saturnino Herrán (id 2), Diego Rivera (id 3), Jorge González Camarena (id 4).
- `data/fichas.ts` — 8 fichas de obras. Cada una tiene: `id`, `titulo`, `anio`, `descripcion`, `estrellas`, `imagen`, `artista`, `perspectivas` (4 vistas derivadas), `tamano`, `color`, `movimiento`, `tecnica`, `precio` (USD real), `tipo` ("Físico" | "JPG Certificado" | "Impresión Oficial"), `graficaValor` (12 puntos mensuales en USD reales), `graficaInteres` (7 puntos 0-100), `certificaciones` (lista única por obra). Helper `obrasDeArtista(id)`.

## Filtros y URL params (`/obras`)

- Params soportados: `tamano`, `color`, `movimiento`, `tecnica`. Valores normalizados (sin tildes, minúsculas).
- Lógica: OR dentro de cada grupo, AND entre grupos.
- Normalización: `"Cálido"` ↔ `?color=calido`; `"Pequeño"` ↔ `?tamano=peque%C3%B1o`.
- `GaleriaObras` envuelve su inner en `<Suspense>` propio; `app/obras/page.tsx` no necesita cambios.

## Estadísticas de valor — cómo funciona

- `graficaValor` tiene precios reales en USD (no porcentajes). El componente los normaliza a 15-100% para las barras; el mes actual (Jun = índice 5) se pinta en cyan.
- `graficaInteres` tiene valores 0-100. Las barras se escalan al máximo del array.
- El % de cambio se calcula entre índices 4 y 5 (May → Jun).
- Las certificaciones del acordeón son únicas: Rivera icónico → "Clase AAA / Christie's / UNESCO"; obras modestas → solo "Verificada por ERUDITO".

## Navegación (definida por el dueño en mapas mentales)

- **Obras**: Categorías (Pinturas→`?tecnica=oleo`, Esculturas, Digital, Artesanías→`?tecnica=mixta`, …) · Por tamaño (Grande/Mediano/Pequeño con params) · Estilo (Muralismo, Modernismo, Realismo, Simbolismo, Abstracto, Retrato, Paisajismo, Fotografía).
- **Artistas**: Artesanos · Artistas en línea · Artistas presenciales · Filtros.
- **Catálogo**: En Línea · Historias · Físicos.
- **Servicios**: Registro de Obras · Grupo de Coleccionistas · Restauración de Arte · Museos, Asociaciones y Galerías · Manager de Ventas · Exposición.
- **Eventos**: Subastas (en línea / presenciales) · Exposiciones · Museos, Asociaciones y Galerías · Manager de Ventas.
- **Cocina y Alimento**: Productos — lema "La comida hoy en día también es un lujo".
- **Blog**, **Newsletter**, **Privado** (sección premium), **Contacto**: enlaces directos.

## Despliegue en Vercel

- Repositorio: `Talkies-4estrellas/ERUDITO-Galeria` en GitHub, conectado al proyecto `erudito-galeria` en Vercel.
- URL de producción: `erudito-galeria.vercel.app` (con "ia", no "y").
- `vercel.json` especifica `framework: "nextjs"`, `buildCommand` y `outputDirectory` explícitamente.
- `package.json` tiene `"engines": {"node": ">=20.0.0"}` — necesario por Next.js 16 + React 19 (local: Node 24).
- **Problema resuelto**: había un git submodule fantasma `ERUDITO Galery` (modo 160000); eliminado con `git rm --cached`.
- Flujo: push a `master` desde GitKraken → Vercel detecta → build ~30-60 s → producción actualizada.

## Pendientes

- El carrusel de inicio (`data/obras.ts`) no enlaza al detalle; unificar con `data/fichas.ts` o enlazar su botón "Ver más" a `/obra/[id]`.
- Flujo de compra real (botón COMPRAR es decorativo).
- Reemplazar imágenes placeholder (picsum.photos) por obras y fotos de artistas reales.
- SEO: `generateMetadata` en páginas de obra y artista.
- Sección Privado / login flow.
- El botón "Más información" de `SeccionEventos` es decorativo (no hay páginas `/eventos/[id]` todavía).
- Modo comparación de obras lado a lado.
- Modo claro / alternancia de tema.
- Quedan en `#`: Eventos, Cocina y Alimento, Blog, Newsletter, Privado, Contacto — sin página propia todavía.
- Filtros de `/artistas` (Artesanos / En línea / Presenciales) son decorativos: `data/artistas.ts` no tiene campo de categoría aún.

## Notas del entorno (Windows)

- **Tailwind no escanea archivos dentro de carpetas con corchetes** (`app/obra/[id]/`): las clases usadas SOLO ahí no se generan. Regla: las páginas de rutas dinámicas solo componen componentes de `components/`; todo el markup con clases vive en componentes.
- La ruta del proyecto tiene espacio (`C:\ERUDITO Galery`): para lanzarlo desde fuera usar `npm.cmd run dev --prefix "C:\ERUDITO Galery"`. NO usar ruta corta 8.3: rompe Turbopack.
- `package.json` debe guardarse en UTF-8 **sin BOM** (PowerShell 5.1 `Set-Content -Encoding utf8` agrega BOM y rompe el build).
- El preview server está configurado en `C:\Users\Migue\.claude\launch.json` (nombre `erudito-dev`, `autoPort: true`).
- `preview_screenshot` se atasca tras navegar con `location.href`; usar clics reales (SPA). Si se atasca, reiniciar el preview con `preview_stop` + `preview_start`.
