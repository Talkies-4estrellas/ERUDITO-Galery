# ERUDITO Galery — Índice de archivos

## Raíz del proyecto
| Archivo | Descripción |
|---|---|
| `next.config.ts` | Config de Next.js (imágenes, redirects, etc.) |
| `tsconfig.json` | Configuración TypeScript |
| `postcss.config.mjs` | Plugin Tailwind para PostCSS |
| `eslint.config.mjs` | Reglas ESLint |
| `.env.local` | Variables de entorno (Supabase URL + ANON KEY) — NO commitear |
| `vercel.json` | Config de deploy en Vercel |
| `CLAUDE.md` | Instrucciones para el asistente IA |

---

## `app/` — Rutas (App Router de Next.js)
| Ruta | Archivo | Notas |
|---|---|---|
| `/` | `app/page.tsx` | Página de inicio con hero, carousel, eventos, reseñas |
| `/obras` | `app/obras/page.tsx` | Catálogo completo con filtros |
| `/obra/[id]` | `app/obra/[id]/page.tsx` | Detalle de una obra |
| `/artistas` | `app/artistas/page.tsx` | Directorio de artistas |
| `/artista/[id]` | `app/artista/[id]/page.tsx` | Perfil público del artista |
| `/empresa/[slug]` | `app/empresa/[slug]/page.tsx` | Perfil público de galería/empresa |
| `/eventos` | `app/eventos/page.tsx` | Agenda de eventos |
| `/eventos/[id]` | `app/eventos/[id]/page.tsx` | Detalle de evento |
| `/blog` | `app/blog/page.tsx` | Lista de artículos |
| `/blog/[id]` | `app/blog/[id]/page.tsx` | Artículo individual |
| `/servicios` | `app/servicios/page.tsx` | Catálogo de servicios |
| `/servicios/[slug]` | `app/servicios/[slug]/page.tsx` | Detalle de servicio |
| `/catalogo` | `app/catalogo/page.tsx` | Catálogo alternativo |
| `/comparar` | `app/comparar/page.tsx` | Comparador de obras |
| `/favoritos` | `app/favoritos/page.tsx` | Obras guardadas (localStorage) |
| `/cocina` | `app/cocina/page.tsx` | Área interna / laboratorio |
| `/privado` | `app/privado/page.tsx` | Área privada con guard |
| `/contacto` | `app/contacto/page.tsx` | Formulario de contacto |
| `/login` | `app/login/page.tsx` | Inicio de sesión / registro |
| `/registro` | `app/registro/page.tsx` | Flujo de creación de cuenta |
| `/perfil` | `app/perfil/page.tsx` | Panel de perfil del usuario (AuthGuard) |
| `/admin` | `app/admin/page.tsx` | Dashboard admin (solo rol `admin`) |
| `app/layout.tsx` | — | Layout raíz: fuentes, providers, Navbar, Footer |
| `app/globals.css` | — | Estilos globales + utilidades Tailwind |
| `app/not-found.tsx` | — | Página 404 |
| `app/robots.ts` | — | Configuración SEO robots.txt |
| `app/sitemap.ts` | — | Sitemap dinámico |
| `app/api/upload/route.ts` | — | API Route para subir imágenes a Supabase Storage (WebP) |

---

## `components/` — Componentes reutilizables
### Layout y navegación
| Componente | Descripción |
|---|---|
| `Navbar.tsx` | Barra de navegación global |
| `Footer.tsx` | Pie de página |
| `PageFade.tsx` | Wrapper con animación fade-in |
| `AuthGuard.tsx` | Redirige a `/login` si no hay sesión activa |

### Autenticación y perfil
| Componente | Descripción |
|---|---|
| `FormAuth.tsx` | Formulario login/signup con Supabase Auth |
| `BotonAuth.tsx` | Botón "Entrar" / avatar en Navbar |
| `SelectorRol.tsx` | Selector de rol al crear cuenta (artista/comprador/empresa) |
| `PaginaPerfil.tsx` | Contenedor del perfil; decide qué componente mostrar por rol |
| `MiPerfilArtista.tsx` | Formulario de perfil + avatar upload (rol artista) |
| `MiPerfilEmpresa.tsx` | Formulario de perfil + logo upload (rol empresa) |
| `PerfilComprador.tsx` | Vista de perfil para rol comprador |

### Catálogo de obras
| Componente | Descripción |
|---|---|
| `FichaObra.tsx` | Tarjeta de obra en el catálogo |
| `FilaFichas.tsx` | Fila horizontal de fichas (scroll) |
| `GaleriaObras.tsx` | Grid de obras con filtros |
| `DetalleObra.tsx` | Vista completa de una obra |
| `PaginaCatalogo.tsx` | Página catálogo con filtros avanzados |
| `Carousel.tsx` | Carrusel de obras destacadas en home |
| `PanelCompra.tsx` | Panel de compra / contacto en detalle de obra |
| `BotonFavorito.tsx` | Toggle guardar/quitar favorito |
| `BotonComparar.tsx` | Toggle agregar/quitar de comparación |
| `BotonCompartir.tsx` | Compartir obra por link |
| `EstadisticasValor.tsx` | Gráfica de valor histórico de la obra |
| `VisorPerspectivas.tsx` | Visualizador de la obra en diferentes ambientes |
| `SkeletonCard.tsx` | Placeholder de carga para tarjetas |

### Artistas
| Componente | Descripción |
|---|---|
| `PaginaArtistas.tsx` | Directorio de artistas con búsqueda |
| `CapsulaArtista.tsx` | Tarjeta compacta de artista |
| `PerfilArtista.tsx` | Perfil público de artista |
| `PerfilPublicoEmpresa.tsx` | Perfil público de galería/empresa |
| `FormObraArtista.tsx` | Formulario para que el artista suba obras |
| `FormObraEmpresa.tsx` | Formulario para que la empresa suba obras |

### Eventos y blog
| Componente | Descripción |
|---|---|
| `SeccionEventos.tsx` | Sección de eventos en home (datos de Supabase) |
| `PaginaEventos.tsx` | Página de eventos con grid |
| `DetalleEvento.tsx` | Vista completa de un evento |
| `BlogGrid.tsx` | Grid de artículos del blog |
| `DetalleArticulo.tsx` | Vista completa de un artículo |

### Servicios
| Componente | Descripción |
|---|---|
| `PaginaServicios.tsx` | Catálogo de servicios |
| `DetalleServicio.tsx` | Vista de un servicio |

### Utilidades
| Componente | Descripción |
|---|---|
| `BuscadorModal.tsx` | Modal de búsqueda global |
| `BotonTema.tsx` | Toggle dark/light mode |
| `ToastProvider.tsx` | Sistema de notificaciones toast |
| `InputImagen.tsx` | Input de imagen con preview |
| `SeccionResenas.tsx` | Sección de reseñas en home |
| `PaginaComparar.tsx` | Vista de comparación de obras |
| `PaginaFavoritos.tsx` | Vista de obras guardadas |
| `PaginaContacto.tsx` | Vista de contacto |
| `PaginaCocina.tsx` | Área de cocina / lab |
| `PaginaPrivado.tsx` | Área privada |

### Admin
| Componente | Descripción |
|---|---|
| `PanelAdmin.tsx` | Dashboard completo del administrador (rol `admin`) |

---

## `hooks/` — React Hooks personalizados
| Hook | Descripción |
|---|---|
| `useAuth.ts` | Suscripción a `supabase.auth.onAuthStateChange` → `{ user, cargando, salir }` |
| `usePerfil.ts` | CRUD del perfil en tabla `perfiles` → `{ perfil, listo, elegirRol, guardar, cerrarSesion }` |
| `useFavoritos.ts` | Favoritos en localStorage |
| `useComparacion.ts` | Comparación de obras en localStorage |
| `useObrasArtista.ts` | Obras del artista logueado (Supabase) |
| `useObrasEmpresa.ts` | Obras de la empresa logueada (Supabase) |
| `useResenas.ts` | Reseñas de obras (Supabase) |
| `useTema.ts` | Dark / light mode con localStorage |

---

## `lib/` — Utilidades y clientes
| Archivo | Descripción |
|---|---|
| `supabase.ts` | Cliente Supabase browser (`createBrowserClient`) |
| `db.ts` | Helpers de consulta a Supabase |
| `uploadWebp.ts` | Convierte imagen a WebP (Canvas API) y sube vía `/api/upload` |

---

## `data/` — Datos estáticos (arrays TypeScript)
| Archivo | Descripción |
|---|---|
| `fichas.ts` | Array de obras para la sección hero / carousel |
| `artistas.ts` | Artistas estáticos (pendiente migrar a Supabase) |
| `articulos.ts` | Artículos del blog |
| `eventos.ts` | Eventos estáticos (la BD ya tiene datos reales) |
| `obras.ts` | Obras para el carousel de home |
| `servicios.ts` | Catálogo de servicios |
| `cocina.ts` | Datos del área cocina |
| `navegacion.ts` | Links del menú de navegación |

---

## `database/` — Scripts SQL
| Archivo | Descripción |
|---|---|
| `schema.sql` | Estructura completa de tablas (ejecutar una vez) |
| `seeds.sql` | Datos iniciales + migraciones idempotentes |
| `seeds_test.sql` | Usuarios de prueba para cada rol (contraseña: `Test1234`) |
| `Perfiles de pruebas.txt` | Correos y contraseñas de usuarios de prueba |

---

## `public/obras/` — Imágenes locales de obras
Cada carpeta tiene `principal.jpg` + variantes de ambiente (`sala-*.jpg`, `comedor.jpg`, etc.)

Obras: `angel-reforma`, `arbol-blanco-yihui`, `arbol-huellas`, `arbol-vida-cristal`,
`banda-rock-haucoze`, `bellas-artes-noche`, `bulldog-dandy`, `colibri-digital`,
`el-lector-uttcmk`, `mappa-mundi`, `merck-rathke`, `revolution-canvas`,
`silencio-trio`, `sombrero-paja-wpap`, `venado-dorado`

---

## `Doc/` — Documentación interna
| Archivo | Descripción |
|---|---|
| `Doc/indice.md` | Este archivo — mapa de todos los archivos |
| `Doc/documentacion/documento.md` | Referencia técnica completa |
| `Doc/memoria.md` | Convención de sesiones de trabajo |
| `Doc/sesiones/sesion-DD-MM-YYYY.md` | Historial por día de trabajo |
