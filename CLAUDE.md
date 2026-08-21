@AGENTS.md

# ERUDITO Galery

Galería / marketplace de arte. Sitio en español, tema oscuro (zinc-950) con acento ámbar (amber-400).

## Stack

- Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, npm.
- Supabase (Auth + PostgreSQL + Storage + Realtime).
- Mercado Pago SDK v3 (`mercadopago`) — checkout Preference + webhook.
- Resend — email transaccional vía `fetch` (no SDK) desde Route Handlers.
- Variables de entorno necesarias (`.env.local` y Vercel):
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — cliente público
  - `SUPABASE_SERVICE_ROLE_KEY` — solo Route Handlers (nunca cliente)
  - `RESEND_API_KEY` — notificaciones email
  - `MP_ACCESS_TOKEN` — Mercado Pago
  - `NEXT_PUBLIC_URL` — URL base de producción (para webhook MP y emails)

## Comandos

```
npm run dev     # servidor de desarrollo (puerto 3002)
npm run build   # build de producción (úsalo para verificar tipos y compilación)
```

## Estructura de páginas

- `app/page.tsx` — inicio: Navbar + Carousel + SeccionEventos + FilaFichas + Footer.
- `app/obra/[id]/page.tsx` — detalle de obra (SSG): resuelve la ficha y compone `DetalleObra`. NO poner clases de Tailwind aquí (ver nota).
- `app/obras/page.tsx` — redirect a `/catalogo` (eliminada la galería con filtros, consolidada en catálogo).
- `app/artista/[id]/page.tsx` — perfil de artista (SSG): compone `PerfilArtista`. Misma regla.
- `app/layout.tsx` — raíz: importa `Footer` y `AuroraFondo` (fondo global de aurora naranja).
- `app/artistas/page.tsx` — server; fetcha `getArtistas()` + `getFichas()`, pasa a `PaginaArtistas`.
- `app/artistas/artesanos/page.tsx` — server; filtra artistas donde `origen` no incluye "digital", filtra fichas por esos ids.
- `app/artistas/digitales/page.tsx` — server; filtra artistas donde `origen` incluye "digital", filtra fichas por esos ids.
- `app/eventos/subastas/page.tsx` — server; filtra eventos `tipo="Subasta"`, pasa a `PaginaEventos` con `ocultarFiltroTipo`.
- `app/eventos/exposiciones/page.tsx` — server; filtra eventos `tipo="Exposición"`, pasa a `PaginaEventos` con `ocultarFiltroTipo`.
- `app/catalogo/page.tsx` — redirect a `/catalogo/fisicos`.
- `app/catalogo/fisicos/page.tsx` — async server; fetcha `getFichas()`, filtra `tipo="Físico"`, pasa a `PaginaCatalogoSeccion`.
- `app/catalogo/digitales/page.tsx` — async server; fetcha `getFichas()`, filtra digitales (`JPG Certificado` + `Impresión Oficial`), pasa a `PaginaCatalogoSeccion`.
- `app/favoritos/page.tsx` — async server; fetcha `getFichas()` y pasa como prop a `PaginaFavoritos` (client, lee de `useFavoritos`).
- `app/comparar/page.tsx` — async server; fetcha `getFichas()` y pasa como prop a `PaginaComparar`.
- `app/privado/page.tsx` — async server; fetcha `getFichas()` y pasa como prop a `PaginaPrivado` (requiere sesión).
- `app/servicios/page.tsx` — compone `PaginaServicios` (anclas por servicio, enlaza a `/servicios/[slug]`).
- `app/servicios/[slug]/page.tsx` — detalle de servicio (SSG): compone `DetalleServicio`.
- `app/login/page.tsx` — compone `FormAuth` en modo `"login"`.
- `app/registro/page.tsx` — compone `FormAuth` en modo `"registro"` (flujo 3 pasos).
- `app/privado/page.tsx` — compone `PaginaPrivado` (requiere sesión).
- `app/admin/page.tsx` — compone `PanelAdmin` (solo emails en `ADMIN_EMAILS`).
- `app/perfil/page.tsx` — edición de perfil del usuario autenticado.
- `app/pago/exito/page.tsx` — retorno MP aprobado. Lee `searchParams` (payment_id, payment_type, external_reference) y muestra tarjeta con ID, método y orden. Dinámico (`ƒ`).
- `app/pago/fallido/page.tsx` — retorno MP rechazado. Muestra referencia de orden. Link a `/contacto`. Dinámico.
- `app/pago/pendiente/page.tsx` — retorno MP pendiente. Muestra ID y orden. Dinámico.
- `app/error.tsx` — error boundary global (client). Botón "Reintentar" (`reset()`) + link a inicio.
- `app/loading.tsx` — loading global. Spinner ámbar centrado en pantalla completa.
- `app/sitemap.ts` — sitemap dinámico con todas las rutas estáticas y dinámicas. URL base desde `process.env.NEXT_PUBLIC_URL`.
- `app/robots.ts` — bloquea /admin, /privado, /perfil, /api.

## Auth y perfiles

- `lib/supabase.ts` — cliente Supabase con inicialización lazy (Proxy). `getSupabase()` solo se llama en runtime, nunca en build, para evitar crash en Vercel.
- `hooks/useAuth.ts` — sesión Supabase (`user`, `cargando`, `entrar`, `registrar`, `salir`). El `useEffect` está envuelto en try/catch para no romper páginas si faltan las vars de entorno.
- `hooks/usePerfil.ts` — perfil del usuario (`rol`, `nombre`, `bio`, `especialidad`, `pais`, `email`, `slug`, `avatar_url`, `banner_url`). Lee/escribe en tabla `perfiles` de Supabase si hay sesión activa; cae a `localStorage` si no. Expone `elegirRol(rol, email?)`, `guardar(datos)`, `cerrarSesion()`.
- `components/PerfilComprador.tsx` — perfil del coleccionista (client). Sidebar izquierdo con navegación interna: botones que cambian el panel central (`type Vista = "coleccion" | "favoritos" | "artistas" | "comparar" | "ajustes"`). Vista "coleccion": obras adquiridas (placeholder vacío hasta sistema de compras). Vista "favoritos": grilla de favoritos con badge "Adquirida" en obras compradas. Vista "artistas": artistas únicos derivados de favoritos + adquiridas con conteo de obras. Vista "comparar": cola de comparación con CTA a `/comparar`. Vista "ajustes": formulario de perfil + upload de avatar y banner a `.webp` vía Canvas API → Supabase Storage bucket `perfiles` (`{userId}/avatar.webp`, `{userId}/banner.webp`). La portada y el avatar del header se actualizan con `banner_url` y `avatar_url` del perfil. Requiere `ALTER TABLE perfiles ADD COLUMN banner_url text;` y bucket `perfiles` público en Storage.
- `components/FormAuth.tsx` — registro multi-rol sin confirmación de email:
  - **comprador** → guarda directo en tabla `usuarios` → redirige a `/perfil`
  - **artista / empresa** → formulario de evaluación (nombre, especialidad, país, bio, motivación) → guarda en `solicitudes` → pantalla "Solicitud enviada"
  - **login**: verifica en orden `accesos_prueba` (localStorage) → `usuarios` → `solicitudes` → Supabase Auth
  - Incluye botón ojito (toggle mostrar/ocultar contraseña)
- `components/BotonAuth.tsx` — en Navbar: muestra "Entrar" si no hay sesión, o avatar amber con dropdown (Mi perfil / Área privada / Administración / Cerrar sesión) si hay sesión.
- `components/AuthGuard.tsx` — acepta dos tipos de sesión: Supabase Auth (`user` del hook) O sesión de prueba en `localStorage` (clave `erudito-perfil`). Redirige a `/login` solo si ninguna de las dos existe.
- `components/PaginaPrivado.tsx` — vista bloqueada si no autenticado; contenido premium si autenticado.
- `components/PanelAdmin.tsx` — panel de administración. `ADMIN_EMAILS = ["firestarshyni@gmail.com"]`. Incluye sección "Solicitudes pendientes" con badge numérico, tarjetas por solicitante y botones Aprobar/Rechazar. **Rechazar abre `ModalRechazo`**: textarea opcional de motivo → guarda `motivo` en `solicitudes` + lo incluye en el email de rechazo. Tras aprobar/rechazar llama a `/api/notificar-solicitud`. **Realtime activo**: suscripción `postgres_changes` en tabla `solicitudes` (INSERT) — nuevas solicitudes aparecen en vivo con toast.

## Componentes

- `components/Navbar.tsx` — barra (client). Layout `relative flex` con logo `absolute left-1/2 -translate-x-1/2` (centrado matemáticamente) y dos lados `flex-1`. Grupos de menú explícitos: `PRIMARIOS` = `["Catálogo", "Artistas", "Cocina", "Eventos"]` a la izquierda; `SECUNDARIOS` = `["Servicios", "Blog", "Contacto"]` + acciones a la derecha. "Privado" y "Newsletter" eliminados del navbar. Buscador: solo ícono de lupa (sin texto ⌘K) — abre modal vía `onClick` y `Ctrl+K`. Jerarquía visual: primarios `text-[13px] text-zinc-200`, secundarios `text-[12px] text-zinc-500`. Dropdowns en escritorio (`lg`); hamburguesa en móvil. Favoritos con badge, `BotonAuth` y `BotonTema`. **Todos los links usan `<Link>` de Next.js** — sin hard reload.
- `components/BuscadorModal.tsx` — modal de búsqueda (client). Props: `open`, `onClose`, `query`, `setQuery`. Debounce 300ms + AbortController — llama a `/api/buscar?q=X` solo al escribir ≥2 chars. Spinner en ícono mientras fetcha. Enter → primera obra/artista o `/obras?q=` si no hay resultados. Link "Ver todos en catálogo →" en pie cuando hay resultados. No recibe artistas/fichas como props.
- `components/Footer.tsx` — footer (client): 4 columnas (Marca, Explorar, Servicios, Newsletter). El formulario de newsletter muestra confirmación amber al suscribirse. Todos los hrefs de Explorar/Servicios/Contacto apuntan a rutas reales (`/artistas`, `/catalogo`, `/favoritos`, `/cocina`, `/eventos`, `/blog`, `/contacto`, `/servicios#...`). Redes sociales y Privacidad/Términos aún en `"#"` (sin URLs reales).
- `components/BotonFavorito.tsx` — botón corazón (client, prop `id`, `tamano: "sm" | "lg"`). Usa `useFavoritos`; `e.preventDefault()`/`stopPropagation()` para no disparar el `Link` padre.
- `components/PaginaArtistas.tsx` — client component. Recibe `artistas`, `fichas`, `titulo` y `descripcion` como props. Barra de búsqueda + botón "Filtros avanzados" colapsable (chips: De dónde es / Técnica de arte / Corriente artística). Badge ámbar "activos" cuando hay filtros. `GrupoChips` definido fuera del componente para evitar remount. Usado por `/artistas`, `/artistas/artesanos` y `/artistas/digitales` — cada sub-página pre-filtra `artistas` y `fichas` server-side antes de pasar como props.
- `components/PaginaCatalogoSeccion.tsx` — client component reutilizable para `/catalogo/fisicos` y `/catalogo/digitales`. Recibe `fichas` (pre-filtradas por tipo en el server), `titulo`, `descripcion`, `otroHref`/`otroLabel` (link al otro tipo), y `vacio`. Incluye buscador, filtros avanzados (movimiento, técnica, precio, orden) y grid de `FichaObra fluida`. Muestra botón "Ver Digitales/Físicos →" en el encabezado.
- `components/PaginaCatalogo.tsx` — obsoleto; reemplazado por `PaginaCatalogoSeccion`. Mantener solo como referencia si se necesita la vista combinada en el futuro.
- `components/PaginaCocina.tsx` — client component. Recibe `productos: ProductoCocina[]` como prop desde `app/cocina/page.tsx` (server, `revalidate=60`). Buscador (nombre/productor/origen) + botón "Filtros avanzados" colapsable (chips de categoría + slider precio máximo + select orden). Destacados en formato hero solo sin filtros activos; con filtros van al grid normal. Carrito local en `localStorage`.
- `components/PaginaServicios.tsx` / `PaginaFavoritos.tsx` — contenido de esas páginas (ver arriba).
- `components/SeccionEventos.tsx` — fila horizontal (client, scroll con JS) de `data/eventos.ts`: badge de fecha, tipo (Subasta/Exposición), modalidad, lugar, descripción. Botón **"Ver subastas"** (ámbar pill) → `/eventos`. Flechas de scroll izq/der.
- `components/PaginaEventos.tsx` — client component. Props: `eventos`, `titulo?` (default "Eventos"), `descripcion?`, `ocultarFiltroTipo?` (oculta chip tipo cuando la página ya filtra server-side). Usa `useSearchParams` para pre-activar filtro de tipo desde `?tipo=Subasta|Exposición`. Separa en secciones "Próximos" y "Anteriores". Modal de registro con POST a `/api/registros-eventos`.
- `components/Carousel.tsx` — carrusel (client): auto-avance 6 s, pausa con hover, flechas, puntos. Recibe `obras: Obra[]` como prop (top 4 por `vistas` desde Supabase). Botón "Ver más" → `<Link href="/obra/[id]">`. Retorna `null` si el array está vacío (guard contra crash).
- `components/RegistrarVisita.tsx` — client component invisible. Dispara `incrementarVistas(id)` en `useEffect` al entrar a `/obra/[id]`. No renderiza nada.
- `components/SeccionResenas.tsx` — sección de comentarios/estrellas bajo cada obra. `agregar()` es async (POST a `/api/resenas`). Muestra "Publicando…" y bloquea el botón durante el envío. Muestra error de la API (ej. reseña duplicada por email).
- `components/FichaObra.tsx` — tarjeta de obra (rediseñada). **Idle**: imagen 3:4 con gradiente mínimo + pill oscuro (`bg-black/60 backdrop-blur-sm rounded-2xl`) mostrando estrellas + título (`text-amber-400`) + año; CapsulaArtista debajo. **Hover**: overlay desaparece → imagen limpia; botón ámbar "Ver obra" aparece en la imagen; CapsulaArtista se reemplaza por panel info completo (título, estrellas, descripción hasta 3 líneas, tags, precio ámbar, artista). Artículo tiene `hover:z-30` para no quedar tapado. Todo CSS puro con `group`/`group-hover:`. Prop `fluida` (true = `w-full`, false = ancho fijo). Prop `comparable` muestra `BotonComparar` bajo el favorito.
- `components/AuroraFondo.tsx` — fondo de aurora naranja (client). Fixed, `z-0`, `mix-blend-mode: screen` (el negro predomina). 4 líneas angostas (5–8% ancho) con gradiente naranja/ámbar/blanco-cálido vertical, `filter: blur(22–32px)`. Reacciona a: scroll con parallax distinto por línea (6–14% scrollY), velocidad de scroll (boost de brillo con decay), ratón (parallax horizontal suave). Flicker individual por línea (9–16s). Montado en `app/layout.tsx` antes del `ToastProvider`.
- `components/FilaFichas.tsx` — fila horizontal scroll-snap (client). Recibe `titulo` y `lista: FichaArte[]`. Incluye botón **"Ver más"** (ámbar pill) → `/catalogo/fisicos` y flechas de scroll izq/der.
- `components/GaleriaObras.tsx` — galería (client + Suspense interno). Ya no se usa directamente (`/obras` redirige). Filtros OR/AND con `useSearchParams`. Conservar por si se reactiva.
- `components/DetalleObra.tsx` — detalle completo: banner, `VisorPerspectivas`, panel info, `EstadisticasValor`, "Arte similar".
- `components/VisorPerspectivas.tsx` — visor museo (client): imagen enmarcada, flechas y puntos entre perspectivas. Retorna `null` si `imagenes` está vacío (guard contra crash).
- `components/EstadisticasValor.tsx` — sección de valor (client). Recibe `ficha: FichaArte`. Gráfica de interés (barras purple, escala dinámica), gráfica de valor 12 meses (mes actual dinámico resaltado cyan, normalizada 15-100%), precio real, tipo de entrega, % de cambio vs mes anterior, acordeones con certificaciones únicas por obra, columna de compra.
- `components/CapsulaArtista.tsx` — píldora: avatar, nombre, vida, botón Perfil → `/artista/[id]`.
- `components/PerfilArtista.tsx` — perfil: foto, bio, datos rápidos, timeline "Trayectoria", fila de obras.
- `components/PanelCompra.tsx` — panel de compra en `/obra/[id]`. Fases: `idle → form → resumen → procesando`. Formulario de datos de contacto → resumen con precio → botón "Pagar con Mercado Pago" (llama `/api/pagos/crear-preferencia` y redirige a `init_point`). Muestra spinner en fase `procesando` y error si falla la conexión con MP.

## Favoritos

- `hooks/useFavoritos.ts` — lista de ids favoritos persistida en `localStorage` (clave `erudito-favoritos`). Expone `favoritos`, `alternar(id)`, `esFavorito(id)`, `listo`.
- **Importante**: el cálculo de `nuevos` y el side-effect (`localStorage.setItem` + `dispatchEvent`) ocurren en el cuerpo de `alternar`, NUNCA dentro del callback de `setFavoritos`. Hacerlo dentro del updater causaba `"Cannot update a component while rendering a different component"`, porque React puede invocar updaters durante el render y el `dispatchEvent` actualiza otras instancias (Navbar) de forma cruzada.
- Sincronización entre componentes: evento custom `"erudito-favoritos-cambio"` en `window` + `"storage"` para multi-pestaña.

## Base de datos (Supabase)

- Esquema completo en `database/schema.sql`.
- Tabla `perfiles` — vinculada a `auth.users` (FK uuid). Campos: `rol`, `nombre`, `bio`, `especialidad`, `pais`, `slug`, `avatar_url`, `banner_url`. RLS activo. SQL para `banner_url`: `ALTER TABLE perfiles ADD COLUMN IF NOT EXISTS banner_url text;`
- Tabla `artistas` — 13 artistas (ids 5–17). Columnas: `id_artista`, `nombre`, `vida`, `origen`, `foto_perfil`, `biografia`. RLS: select público.
- Tabla `obras` — 15 obras (ids 9–23) + obras de artistas/empresas de plataforma. `id_artista` **nullable**. Col `artista_email` (text, nullable) para obras de artistas registrados vía plataforma. Col `empresa_email` (text, nullable) para obras publicadas por galerías/empresas. Col `nombre_artista` (text, nullable) para el nombre del artista representado por la empresa. Col `vistas` (integer default 0). RLS: select público.
- Tabla `usuarios` — usuarios sin Supabase Auth. PK: `email`. Col `slug` (texto único por empresa). RLS: select+insert público.
- Tabla `solicitudes` — solicitudes artistas/empresas. Col `motivo TEXT` (nullable) para el motivo de rechazo escrito por el admin. Realtime habilitado.
- Tabla `resenas` — comentarios por obra, anti-duplicado por email en API.
- Tabla `ventas` — órdenes Mercado Pago.
- Tabla `suscriptores` — emails de newsletter. PK: `email` unique.
- Tabla `contactos` — mensajes del formulario de contacto.
- Tabla `registros_eventos` — asistentes registrados a eventos (evento_id, nombre, email, telefono).
- RPC SQL `incrementar_vistas(obra_id int)` — incremento atómico con `security definer`.
- Bucket Storage `obras` — público, acepta INSERT/SELECT anon+authenticated. Estructura: `obras/[id]/*.webp` (imágenes de obras), `obras/cocina/[id].webp` (productos gastronómicos). Todas las imágenes convertidas a WebP calidad 82 con `sharp` antes de subir.
- Bucket Storage `perfiles` — público, acepta INSERT/SELECT authenticated. Estructura: `{userId}/avatar.webp`, `{userId}/banner.webp`. Imágenes subidas desde el cliente vía Canvas API (quality 0.85) — **sin `sharp`**, conversión en browser. Usado por `PerfilComprador` en la vista Ajustes.
- Tabla `productos_cocina` — 17 productos gastronómicos. Cols: `id`, `nombre`, `productor`, `origen`, `descripcion`, `imagen` (URL Storage), `precio`, `unidad`, `categoria`, `destacado`, `activo`, `created_at`. RLS: select público con `activo=true`.
- Confirmación de email **desactivada** (Authentication → Providers → Email).
- `lib/db.ts` — mappers `mapArtista`, `mapObra`. Funciones: `getArtistas()`, `getFichas()`, `getCarousel()` (top 4 por vistas), `incrementarVistas(id)`.
- `lib/supabase-server.ts` — `getServerSupabase()`: cliente con service role key. Solo para Route Handlers. **Nunca importar en componentes cliente.**

## Datos

- `data/navegacion.ts` — fuente única del menú.
- `data/eventos.ts` — 4 eventos de muestra.
- `data/obras.ts` — **SOLO fuente de tipos** (`interface Obra`). El carousel ahora usa `getCarousel()` desde Supabase (top 4 por `vistas`). No usar para datos en runtime.
- `data/artistas.ts` — **SOLO fuente de tipos** (`interface Artista`). No usar para datos en runtime.
- `data/fichas.ts` — **SOLO fuente de tipos** (`interface FichaArte`, `PuntoGrafica`, etc.) y fuente de la ruta de migración `api/migrar-obras`. No usar para datos en runtime — las páginas leen de Supabase.
- `data/cocina.ts` — **SOLO fuente de tipos** (`interface ProductoCocina`, `CategoriaCocina`, `COLOR_COCINA`) y fuente de `api/migrar-cocina`. No usar para datos en runtime — `/cocina` lee de tabla `productos_cocina` en Supabase.
- **Moneda**: todos los precios y gráficas en MXN (pesos mexicanos). Formato `toLocaleString("es-MX")`.
- `data/servicios.ts` — 6 servicios con slug, titulo, descripcion, detalle, beneficios, proceso (4 pasos), desde, icono, imagen, acento. Helper `getServicio(slug)`. Cada una tiene: `id`, `titulo`, `anio`, `descripcion`, `estrellas`, `imagen`, `artista`, `perspectivas` (4 vistas derivadas), `tamano`, `color`, `movimiento`, `tecnica`, `precio` (USD real), `tipo` ("Físico" | "JPG Certificado" | "Impresión Oficial"), `graficaValor` (12 puntos mensuales en USD reales), `graficaInteres` (7 puntos 0-100), `certificaciones` (lista única por obra). Helper `obrasDeArtista(id)`.

## Filtros y URL params (`/obras`)

- Params soportados: `tamano`, `color`, `movimiento`, `tecnica`. Valores normalizados (sin tildes, minúsculas).
- Lógica: OR dentro de cada grupo, AND entre grupos.
- Normalización: `"Cálido"` ↔ `?color=calido`; `"Pequeño"` ↔ `?tamano=peque%C3%B1o`.
- `GaleriaObras` envuelve su inner en `<Suspense>` propio; `app/obras/page.tsx` no necesita cambios.

## Estadísticas de valor — cómo funciona

- `graficaValor` tiene precios reales en **MXN** (no porcentajes). El componente los normaliza a 15-100% para las barras; el mes actual (`new Date().getMonth()`, clampado a `length - 1`) se pinta en cyan.
- `graficaInteres` tiene valores 0-100. Las barras se escalan al máximo del array.
- El % de cambio se calcula entre el mes anterior y el mes actual (dinámico, con clamp a índice 0 para Enero).
- Las certificaciones del acordeón son únicas: Rivera icónico → "Clase AAA / Christie's / UNESCO"; obras modestas → solo "Verificada por ERUDITO".

## Navegación (definida por el dueño en mapas mentales)

- **Obras**: Categorías (Pinturas→`?tecnica=oleo`, Esculturas, Digital, Artesanías→`?tecnica=mixta`, …) · Por tamaño (Grande/Mediano/Pequeño con params) · Estilo (Muralismo, Modernismo, Realismo, Simbolismo, Abstracto, Retrato, Paisajismo, Fotografía).
- **Artistas**: Artesanos (`/artistas/artesanos`) · Artistas (`/artistas`) · Artistas Digitales (`/artistas/digitales`). Cada sub-página filtra artistas y fichas server-side antes de pasar a `PaginaArtistas`.
- **Catálogo**: Físicos (`/catalogo/fisicos`) · Digitales (`/catalogo/digitales`). `/catalogo` redirige a Físicos.
- **Servicios**: 6 ítems → cada uno apunta a `/servicios/[slug]` directo (no `#anchor`). CTA "¿No sabes cuál necesitas?" en página principal Y en cada detalle.
- **Eventos**: Eventos (`/eventos`) · Subastas (`/eventos/subastas`) · Exposiciones (`/eventos/exposiciones`). Subastas y Exposiciones tienen página propia con `ocultarFiltroTipo=true`. Página general acepta `?tipo=` para pre-filtrar.
- **Cocina y Alimento**: Productos (`/cocina`) — lema "La comida hoy en día también es un lujo".
- **Blog**, **Newsletter** (`/#newsletter`, pendiente), **Contacto**: enlaces directos. **Privado** eliminado del navbar — acceso por botón "Entrar".

## Despliegue en Vercel

- Repositorio: `Talkies-4estrellas/ERUDITO-Galeria` en GitHub, conectado al proyecto `erudito-galeria` en Vercel.
- URL de producción: `erudito-galeria.vercel.app` (con "ia", no "y").
- `package.json` tiene `"engines": {"node": ">=20.0.0"}` — necesario por Next.js 16 + React 19 (local: Node 24).
- Flujo: push a `master` desde GitKraken → Vercel detecta → build ~30-60 s → producción actualizada.

## API Routes

- `app/api/upload/route.ts` — sube imagen al bucket Supabase Storage. Recibe `FormData` + query `?carpeta=X`. Devuelve `{ url }`.
- `app/api/buscar/route.ts` — búsqueda server-side. GET `?q=X` (mín 2 chars). ILIKE en `obras` y `artistas`. Cache 15s. Devuelve `{ obras, artistas }`.
- `app/api/resenas/route.ts` — GET `?obra_id=X` (cache 30s) / POST (insert con anti-duplicado por email, 409 si ya reseñó). Usa cliente anon.
- `app/api/notificar-solicitud/route.ts` — POST `{ email, nombre, rol, estado, motivo? }`. Llama Resend API. FROM: `notificaciones@erudito-galeria.vercel.app`. Email de rechazo incluye bloque con `motivo` si se proporcionó.
- `app/api/pagos/crear-preferencia/route.ts` — POST `{ obra_id, titulo, precio, tipo, nombre, email, telefono?, mensaje? }`. Crea venta + Preference MP. Devuelve `{ init_point, venta_id }`. Usa service role.
- `app/api/pagos/webhook/route.ts` — GET (validación MP) / POST (actualiza venta). Idempotente. Siempre 200. Usa service role.
- `app/api/newsletter/route.ts` — POST `{ email }`. Upsert en tabla `suscriptores`. Usa service role.
- `app/api/contacto/route.ts` — POST `{ nombre, email, asunto, mensaje }`. Inserta en `contactos` + email al admin vía Resend. Usa service role.
- `app/api/registros-eventos/route.ts` — POST `{ evento_id, nombre, email, telefono? }`. Inserta en `registros_eventos`. Usa service role.
- `app/api/artista/obras/route.ts` — CRUD de obras para artistas de plataforma. GET `?email=X` / POST / PUT / DELETE (body JSON). Verifica que email exista en `usuarios`. Usa service role. Retorna `ObraPropia` mapeada desde `obras`.
- `app/api/empresa/obras/route.ts` — CRUD de obras para galerías/empresas. Idéntico patrón que artista/obras. GET `?email=X` / POST / PUT / DELETE (body JSON). Verifica que email exista en `usuarios` con `rol = "empresa"`. Usa `empresa_email` y `nombre_artista` en tabla `obras`. Retorna `ObraEmpresa` mapeada.
- `app/api/cocina/route.ts` — GET público, `revalidate=60`. Devuelve `{ productos }` desde tabla `productos_cocina` filtrado por `activo=true`. Usado por `app/cocina/page.tsx` (server component).
- `app/api/migrar-cocina/route.ts` — POST one-shot. Lee productos de `data/cocina.ts`, convierte imágenes de `public/images/cocina/` a WebP con `sharp`, sube al bucket `obras/cocina/[id].webp` y hace upsert en `productos_cocina`. Idempotente (nombres fijos sin timestamp).
- `app/api/migrar-obras/route.ts` — POST one-shot. Lee fichas de `data/fichas.ts`, convierte todas las imágenes de `public/obras/` a WebP con `sharp`, sube a `obras/[id]/[nombre].webp` y actualiza `imagen_principal` + `perspectivas` en la tabla `obras`. Idempotente.

## Lib

- `lib/supabase.ts` — cliente público (anon key), patrón Proxy lazy.
- `lib/supabase-server.ts` — `getServerSupabase()`: service role key, sin sesión, solo Route Handlers.
- `lib/db.ts` — mappers y funciones: `getArtistas()`, `getFichas()`, `getCarousel()`, `incrementarVistas(id)`.
- `lib/uploadWebp.ts` — `"use client"`. `convertToWebp()` (Canvas API), `uploadImagenWebp(file, carpeta)`, `uploadWebp(file, urlOrCarpeta)` (alias de compatibilidad).

## Hooks

- `hooks/useResenas.ts` — `cargar()` → GET `/api/resenas?obra_id=X`; `agregar()` → POST async, devuelve `{ ok, error? }`. Usa `usePerfil()` para email del usuario.
- `hooks/useObrasArtista.ts` — migrado de localStorage a Supabase. Internamente usa `usePerfil()` para obtener el email. Llama a `/api/artista/obras` (GET/POST/PUT/DELETE). Retorna `{ obras, listo, agregar, actualizar, eliminar }` — misma interfaz que antes.
- `hooks/useObrasEmpresa.ts` — migrado de localStorage a Supabase. Usa `usePerfil()` para email. Llama a `/api/empresa/obras` (GET/POST/PUT/DELETE). Tipo `ObraEmpresa` incluye `nombreArtista` (artista representado por la galería). Retorna `{ obras, listo, agregar, actualizar, eliminar }`.

## Despliegue en Vercel — variables de entorno

| Variable | `.env.local` | Vercel |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ✅ |
| `RESEND_API_KEY` | ✅ | ✅ |
| `NEXT_PUBLIC_URL` | ✅ | ✅ |
| `MP_ACCESS_TOKEN` | ⏳ pendiente | ⏳ pendiente |

Sin `MP_ACCESS_TOKEN`, `/api/pagos/*` no funciona. El resto ya está operativo.

## Pendientes

### Crítico
- `MP_ACCESS_TOKEN` — Mercado Pago → Developers → Panel → Credenciales → Access Token (sandbox: `TEST-...`, producción: `APP_USR-...`). Agregar en `.env.local` y Vercel.

### Rotos conocidos (por atacar)
_(todos resueltos — ver mejoras futuras para próximos pasos)_

### Mejoras futuras (posibles)
- Fotos reales de artistas (reemplazar picsum.photos).
- Bottom nav móvil, CSV export admin, búsqueda con IA (Groq).
- Autenticación con hash de contraseña real (bcrypt) — actualmente texto plano en `usuarios.clave`.

## Notas del entorno (Windows)

- **Tailwind no escanea archivos dentro de carpetas con corchetes** (`app/obra/[id]/`): las clases usadas SOLO ahí no se generan. Regla: las páginas de rutas dinámicas solo componen componentes de `components/`; todo el markup con clases vive en componentes.
- La ruta del proyecto tiene espacio (`C:\ERUDITO Galery`): para lanzarlo desde fuera usar `npm.cmd run dev --prefix "C:\ERUDITO Galery"`. NO usar ruta corta 8.3: rompe Turbopack.
- `package.json` debe guardarse en UTF-8 **sin BOM** (PowerShell 5.1 `Set-Content -Encoding utf8` agrega BOM y rompe el build).
- El preview server está configurado en `C:\Users\Migue\.claude\launch.json` (nombre `erudito-dev`, `autoPort: true`).
- `preview_screenshot` se atasca tras navegar con `location.href`; usar clics reales (SPA). Si se atasca, reiniciar el preview con `preview_stop` + `preview_start`.
