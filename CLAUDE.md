@AGENTS.md

# ERUDITO Galery

Galería / marketplace de arte. Sitio en español, tema oscuro (zinc-950) con acento ámbar (amber-400).

## Stack

- Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, npm.
- Supabase (Auth + PostgreSQL + Storage). Variables de entorno: `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en Vercel y `.env.local`.
- Contenido estático en `data/`; perfiles de usuario en tabla `perfiles` de Supabase.

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
- `app/catalogo/page.tsx` — compone `PaginaCatalogo` (client, filtros: búsqueda/tipo/movimiento/técnica/precio/orden).
- `app/servicios/page.tsx` — compone `PaginaServicios` (anclas por servicio, enlaza a `/servicios/[slug]`).
- `app/servicios/[slug]/page.tsx` — detalle de servicio (SSG): compone `DetalleServicio`.
- `app/favoritos/page.tsx` — compone `PaginaFavoritos` (client, lee de `useFavoritos`).
- `app/login/page.tsx` — compone `FormAuth` en modo `"login"`.
- `app/registro/page.tsx` — compone `FormAuth` en modo `"registro"` (flujo 3 pasos).
- `app/privado/page.tsx` — compone `PaginaPrivado` (requiere sesión).
- `app/admin/page.tsx` — compone `PanelAdmin` (solo emails en `ADMIN_EMAILS`).
- `app/perfil/page.tsx` — edición de perfil del usuario autenticado.
- `app/sitemap.ts` — sitemap dinámico con todas las rutas estáticas y dinámicas.
- `app/robots.ts` — bloquea /admin, /privado, /perfil, /api.

## Auth y perfiles

- `lib/supabase.ts` — cliente Supabase con inicialización lazy (Proxy). `getSupabase()` solo se llama en runtime, nunca en build, para evitar crash en Vercel.
- `hooks/useAuth.ts` — sesión Supabase (`user`, `cargando`, `entrar`, `registrar`, `salir`). El `useEffect` está envuelto en try/catch para no romper páginas si faltan las vars de entorno.
- `hooks/usePerfil.ts` — perfil del usuario (`rol`, `nombre`, `bio`, `especialidad`, `pais`, `email`, `slug`). Lee/escribe en tabla `perfiles` de Supabase si hay sesión activa; cae a `localStorage` si no. Expone `elegirRol(rol, email?)`, `guardar(datos)`, `cerrarSesion()`.
- `components/FormAuth.tsx` — formulario auth de 3 pasos: (1) email+contraseña, (2) selección de rol (artista/coleccionista/empresa), (3) instrucciones de confirmación de email con reenvío. Modo `"login"` va directo tras autenticar.
- `components/BotonAuth.tsx` — en Navbar: muestra "Entrar" si no hay sesión, o avatar amber con dropdown (Mi perfil / Área privada / Administración / Cerrar sesión) si hay sesión.
- `components/AuthGuard.tsx` — redirige a `/login` si `!user && !cargando`; muestra spinner mientras carga.
- `components/PaginaPrivado.tsx` — vista bloqueada si no autenticado; contenido premium si autenticado.
- `components/PanelAdmin.tsx` — panel de administración. `ADMIN_EMAILS = ["firestarshyni@gmail.com"]`.

## Componentes

- `components/Navbar.tsx` — barra (client). Layout 3 columnas (`grid-cols-[1fr_auto_1fr]`): menús izquierda / logo centrado / menús derecha + acciones. Dropdowns en escritorio (`lg`); hamburguesa en móvil. Incluye buscador (`Ctrl+K`), favoritos con badge, `BotonAuth` y `BotonTema`.
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

## Base de datos (Supabase)

- Esquema completo en `database/schema.sql`.
- Tabla `perfiles` — vinculada a `auth.users` (FK uuid). Campos: `rol`, `nombre`, `bio`, `especialidad`, `pais`, `slug`. RLS activo: cada usuario solo ve/edita su fila.
- Bucket Storage `obras` — público, acepta INSERT/SELECT anon+authenticated. Usado para subir imágenes WebP de obras.
- Confirmación de email **desactivada** en Supabase (Authentication → Providers → Email).
- El resto de tablas (artistas, obras, clientes, pedidos, etc.) están definidas en `schema.sql` pero aún no conectadas; los datos viven en `data/fichas.ts` y archivos afines.

## Datos

- `data/navegacion.ts` — fuente única del menú. Los items de Obras ya usan query params reales (`?tecnica=oleo`, `?movimiento=muralismo`, `?tamano=grande`, etc.). Artistas/Catálogo/Servicios ya enlazan a `/artistas`, `/catalogo#...`, `/servicios#...` en vez de `#`.
- `data/eventos.ts` — 4 eventos de muestra (Subasta/Exposición × En línea/Presencial) con fechas relativas a 2026. Cada uno: `fechaCorta` (día+mes para el badge), `lugar`, `imagen`, `descripcion`.
- `data/obras.ts` — obras del carrusel (4 entradas, independientes de fichas).
- `data/artistas.ts` — 4 artistas: José María Obregón (id 1), Saturnino Herrán (id 2), Diego Rivera (id 3), Jorge González Camarena (id 4).
- `data/fichas.ts` — 8 fichas de obras.
- `data/servicios.ts` — 6 servicios con slug, titulo, descripcion, detalle, beneficios, proceso (4 pasos), desde, icono, imagen, acento. Helper `getServicio(slug)`. Cada una tiene: `id`, `titulo`, `anio`, `descripcion`, `estrellas`, `imagen`, `artista`, `perspectivas` (4 vistas derivadas), `tamano`, `color`, `movimiento`, `tecnica`, `precio` (USD real), `tipo` ("Físico" | "JPG Certificado" | "Impresión Oficial"), `graficaValor` (12 puntos mensuales en USD reales), `graficaInteres` (7 puntos 0-100), `certificaciones` (lista única por obra). Helper `obrasDeArtista(id)`.

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
- Flujo de compra real (botón COMPRAR es decorativo). Integrar Stripe.
- Reemplazar imágenes placeholder (picsum.photos) por obras y fotos de artistas reales.
- El botón "Más información" de `SeccionEventos` es decorativo (no hay páginas `/eventos/[id]` todavía).
- Quedan en `#`: Eventos, Cocina y Alimento, Blog, Newsletter, Contacto — sin página propia todavía.
- Filtros de `/artistas` (Artesanos / En línea / Presenciales) son decorativos: `data/artistas.ts` no tiene campo de categoría aún.
- Migrar obras y artistas de `data/fichas.ts` / `data/artistas.ts` a tablas Supabase.
- Notificaciones por email (Resend o SendGrid).
- Página `/perfil` — formulario de edición de nombre, bio, especialidad, país (ya existe `guardar()` en `usePerfil`).

## Notas del entorno (Windows)

- **Tailwind no escanea archivos dentro de carpetas con corchetes** (`app/obra/[id]/`): las clases usadas SOLO ahí no se generan. Regla: las páginas de rutas dinámicas solo componen componentes de `components/`; todo el markup con clases vive en componentes.
- La ruta del proyecto tiene espacio (`C:\ERUDITO Galery`): para lanzarlo desde fuera usar `npm.cmd run dev --prefix "C:\ERUDITO Galery"`. NO usar ruta corta 8.3: rompe Turbopack.
- `package.json` debe guardarse en UTF-8 **sin BOM** (PowerShell 5.1 `Set-Content -Encoding utf8` agrega BOM y rompe el build).
- El preview server está configurado en `C:\Users\Migue\.claude\launch.json` (nombre `erudito-dev`, `autoPort: true`).
- `preview_screenshot` se atasca tras navegar con `location.href`; usar clics reales (SPA). Si se atasca, reiniciar el preview con `preview_stop` + `preview_start`.
