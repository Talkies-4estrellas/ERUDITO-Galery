-- ============================================================
--  ERUDITO Galery — Esquema de base de datos
--  Plataforma destino: Supabase (PostgreSQL)
--
--  Tablas originales del diseño:
--    artistas, obras, clientes, pedidos,
--    detalle_pedidos, servicios, contrataciones
--
--  Adaptaciones aplicadas para alinear con el proyecto Next.js:
--    · artistas   → +especialidad, +vida, +origen  (campos del tipo Artista en data/artistas.ts)
--    · obras      → +anio, +movimiento, +tamano, +color, +tipo,
--                   +estrellas, +grafica_valor, +grafica_interes,
--                   +certificaciones, +perspectivas
--                   (campos del tipo FichaArte en data/fichas.ts)
--    · clientes   → rol 'artista'|'comprador' (distingue perfiles de usePerfil.ts)
--    · servicios  → categoría alineada con /servicios page
-- ============================================================


-- ── Artistas ────────────────────────────────────────────────
create table artistas (
  id_artista      bigint primary key generated always as identity,
  nombre          text not null,
  biografia       text,
  email           text unique not null,
  telefono        text,
  redes_sociales  jsonb,                        -- { ig, fb, tw, web }
  foto_perfil     text,
  -- Campos del modelo Artista (data/artistas.ts)
  vida            text,                         -- ej. "1886 – 1957"
  origen          text,                         -- ciudad, país
  especialidad    text,                         -- ej. "Muralismo"
  fecha_registro  timestamp default current_timestamp
);


-- ── Obras ────────────────────────────────────────────────────
create table obras (
  id_obra           bigint primary key generated always as identity,
  id_artista        bigint references artistas (id_artista) on delete cascade,
  titulo            text not null,
  descripcion       text,
  precio            numeric(10, 2) not null,
  stock             int default 1,
  categoria         text,
  tecnica           text,
  dimensiones       text,
  imagen_principal  text,
  imagenes          jsonb,                      -- URLs adicionales / perspectivas
  -- Campos del modelo FichaArte (data/fichas.ts)
  anio              text,                       -- año de creación
  movimiento        text,                       -- ej. "Muralismo", "Academicismo"
  tamano            text check (tamano in ('Pequeño','Mediano','Grande')),
  color             text check (color  in ('Cálido','Frío','Neutro')),
  tipo              text check (tipo   in ('Físico','JPG Certificado','Impresión Oficial')),
  estrellas         int  check (estrellas between 1 and 5) default 5,
  grafica_valor     jsonb,                      -- [{ mes, valor }] × 12 meses
  grafica_interes   jsonb,                      -- [0-100] × 7 puntos
  certificaciones   jsonb,                      -- ["Christie's","UNESCO", ...]
  perspectivas      jsonb,                      -- URLs de vistas adicionales
  fecha_creacion    timestamp default current_timestamp
);


-- ── Clientes (compradores y artistas registrados) ────────────
create table clientes (
  id_cliente      bigint primary key generated always as identity,
  nombre          text not null,
  email           text unique not null,
  telefono        text,
  direccion       text,
  -- Rol del perfil (usePerfil.ts: 'artista' | 'comprador')
  rol             text check (rol in ('artista','comprador')) default 'comprador',
  -- Referencia opcional al artista si rol = 'artista'
  id_artista      bigint references artistas (id_artista) on delete set null,
  fecha_registro  timestamp default current_timestamp
);


-- ── Pedidos ──────────────────────────────────────────────────
create table pedidos (
  id_pedido     bigint primary key generated always as identity,
  id_cliente    bigint references clientes (id_cliente) on delete cascade,
  fecha_pedido  timestamp default current_timestamp,
  estado        text default 'Pendiente'
                  check (estado in ('Pendiente','Confirmado','Enviado','Entregado','Cancelado')),
  total         numeric(10, 2) not null
);


-- ── Detalle de pedidos ───────────────────────────────────────
create table detalle_pedidos (
  id_detalle      bigint primary key generated always as identity,
  id_pedido       bigint references pedidos     (id_pedido) on delete cascade,
  id_obra         bigint references obras       (id_obra)   on delete cascade,
  cantidad        int not null,
  precio_unitario numeric(10, 2) not null
);


-- ── Servicios ────────────────────────────────────────────────
-- Alineado con /servicios page (PaginaServicios.tsx)
create table servicios (
  id_servicio  bigint primary key generated always as identity,
  nombre       text not null,
  descripcion  text,
  precio       numeric(10, 2),
  categoria    text check (categoria in (
    'Registro de Obras',
    'Restauración de Arte',
    'Manager de Ventas',
    'Grupo de Coleccionistas',
    'Exposición',
    'Museos y Galerías'
  ))
);


-- ── Contrataciones de servicios ──────────────────────────────
create table contrataciones (
  id_contratacion   bigint primary key generated always as identity,
  id_artista        bigint references artistas  (id_artista)  on delete cascade,
  id_servicio       bigint references servicios (id_servicio) on delete cascade,
  fecha_contratacion timestamp default current_timestamp,
  estado            text default 'Activo'
                      check (estado in ('Activo','Pausado','Finalizado'))
);


-- ── Favoritos (wishlist — hook useFavoritos.ts) ──────────────
create table favoritos (
  id_favorito  bigint primary key generated always as identity,
  id_cliente   bigint references clientes (id_cliente) on delete cascade,
  id_obra      bigint references obras    (id_obra)    on delete cascade,
  fecha        timestamp default current_timestamp,
  unique (id_cliente, id_obra)
);


-- ── Eventos (data/eventos.ts) ────────────────────────────────
create table eventos (
  id_evento    bigint primary key generated always as identity,
  tipo         text check (tipo in ('Subasta','Exposición')),
  modalidad    text check (modalidad in ('Presencial','Virtual','Híbrido')),
  titulo       text not null,
  fecha        timestamp not null,
  lugar        text,
  imagen       text,
  descripcion  text
);


-- ============================================================
--  ÍNDICES sugeridos
-- ============================================================
create index on obras       (id_artista);
create index on obras       (movimiento);
create index on obras       (tamano);
create index on obras       (color);
create index on obras       (tipo);
create index on pedidos     (id_cliente);
create index on favoritos   (id_cliente);
create index on contrataciones (id_artista);

