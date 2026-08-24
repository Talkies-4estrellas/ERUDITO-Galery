-- ============================================================
--  ERUDITO Galery — Usuarios de prueba
--  Contraseña de TODOS: Test1234
--  Ejecutar en Supabase SQL Editor (rol postgres)
--  Idempotente: ON CONFLICT DO NOTHING
-- ============================================================

do $$
declare
  uid_artista   uuid := '11111111-0000-0000-0000-000000000001';
  uid_comprador uuid := '11111111-0000-0000-0000-000000000002';
  uid_empresa   uuid := '11111111-0000-0000-0000-000000000003';
  uid_admin     uuid := '11111111-0000-0000-0000-000000000004';
begin

  -- ── Migraciones de esquema ────────────────────────────────
  alter table public.perfiles add column if not exists avatar_url  text default '';
  alter table public.perfiles add column if not exists banner_url  text default '';

  -- Ampliar constraint de rol para incluir 'admin'
  alter table public.perfiles drop constraint if exists perfiles_rol_check;
  alter table public.perfiles add constraint perfiles_rol_check
    check (rol in ('artista', 'comprador', 'empresa', 'admin'));

  -- ── Artista ──────────────────────────────────────────────
  insert into auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new
  ) values (
    uid_artista,
    '00000000-0000-0000-0000-000000000000',
    'artista@test.com',
    crypt('Test1234', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    false, 'authenticated', 'authenticated', now(), now(),
    '', '', ''
  ) on conflict do nothing;

  -- ── Comprador / Coleccionista ─────────────────────────────
  insert into auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new
  ) values (
    uid_comprador,
    '00000000-0000-0000-0000-000000000000',
    'comprador@test.com',
    crypt('Test1234', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    false, 'authenticated', 'authenticated', now(), now(),
    '', '', ''
  ) on conflict do nothing;

  -- ── Empresa / Galería ─────────────────────────────────────
  insert into auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new
  ) values (
    uid_empresa,
    '00000000-0000-0000-0000-000000000000',
    'empresa@test.com',
    crypt('Test1234', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    false, 'authenticated', 'authenticated', now(), now(),
    '', '', ''
  ) on conflict do nothing;

  -- ── Administrador ─────────────────────────────────────────
  insert into auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new
  ) values (
    uid_admin,
    '00000000-0000-0000-0000-000000000000',
    'admin@test.com',
    crypt('Test1234', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    false, 'authenticated', 'authenticated', now(), now(),
    '', '', ''
  ) on conflict do nothing;

  -- ── Identidades (requerido para login email/password) ────
  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider,
    created_at, updated_at, last_sign_in_at
  ) values
    (gen_random_uuid(), uid_artista,   'artista@test.com',
     jsonb_build_object('sub', uid_artista::text,   'email', 'artista@test.com'),
     'email', now(), now(), now()),
    (gen_random_uuid(), uid_comprador, 'comprador@test.com',
     jsonb_build_object('sub', uid_comprador::text, 'email', 'comprador@test.com'),
     'email', now(), now(), now()),
    (gen_random_uuid(), uid_empresa,   'empresa@test.com',
     jsonb_build_object('sub', uid_empresa::text,   'email', 'empresa@test.com'),
     'email', now(), now(), now()),
    (gen_random_uuid(), uid_admin,     'admin@test.com',
     jsonb_build_object('sub', uid_admin::text,     'email', 'admin@test.com'),
     'email', now(), now(), now())
  on conflict (provider, provider_id) do nothing;

  -- ── Perfiles ─────────────────────────────────────────────
  -- WHERE EXISTS: salta cualquier UUID que no esté en auth.users
  -- (ocurre cuando un usuario ya existía con otro UUID y on conflict do nothing lo saltó)
  insert into public.perfiles (id, rol, nombre, bio, especialidad, pais, slug, avatar_url, banner_url)
  select v.id, v.rol, v.nombre, v.bio, v.especialidad, v.pais, v.slug, v.avatar_url, v.banner_url
  from (values
    (uid_artista,   'artista'::text,   'Ana Torres'::text,
     'Pintora expresionista de la Ciudad de México. Especialista en óleos de gran formato y técnicas mixtas.'::text,
     'Pintura al óleo'::text,    'México'::text, 'ana-torres'::text,        ''::text, ''::text),
    (uid_comprador, 'comprador'::text, 'Luis Mendoza'::text,
     ''::text,
     'Coleccionista'::text,      'México'::text, 'luis-mendoza'::text,      ''::text, ''::text),
    (uid_empresa,   'empresa'::text,   'Galería Norte Arte'::text,
     'Galería dedicada al arte contemporáneo emergente mexicano.'::text,
     'Arte contemporáneo'::text, 'México'::text, 'galeria-norte-arte'::text,''::text, ''::text),
    (uid_admin,     'admin'::text,     'Administrador'::text,
     ''::text,
     'Administración'::text,     'México'::text, 'administrador'::text,     ''::text, ''::text)
  ) as v(id, rol, nombre, bio, especialidad, pais, slug, avatar_url, banner_url)
  where exists (select 1 from auth.users where id = v.id)
  on conflict (id) do update set
    rol         = excluded.rol,
    nombre      = excluded.nombre,
    bio         = excluded.bio,
    especialidad= excluded.especialidad,
    pais        = excluded.pais,
    slug        = coalesce(excluded.slug, public.perfiles.slug),
    avatar_url  = coalesce(nullif(public.perfiles.avatar_url,''), ''),
    banner_url  = coalesce(nullif(public.perfiles.banner_url,''), '');

end $$;


-- ============================================================
--  Usuarios de prueba en tabla usuarios (para perfiles públicos)
--  artista y empresa necesitan fila en usuarios para ser visibles en /artistas/[slug]
-- ============================================================

insert into public.usuarios (email, clave, nombre, rol, bio, especialidad, pais, slug)
values
  ('artista@test.com', 'supabase-auth', 'Ana Torres', 'artista',
   'Pintora expresionista de la Ciudad de México. Especialista en óleos de gran formato y técnicas mixtas.',
   'Pintura al óleo', 'México', 'ana-torres'),
  ('empresa@test.com', 'supabase-auth', 'Galería Norte Arte', 'empresa',
   'Galería dedicada al arte contemporáneo emergente mexicano.',
   'Arte contemporáneo', 'México', 'galeria-norte-arte')
on conflict (email) do update set
  nombre      = excluded.nombre,
  bio         = excluded.bio,
  especialidad= excluded.especialidad,
  pais        = excluded.pais,
  slug        = excluded.slug;


-- ============================================================
--  Política RLS: admin puede ver todos los perfiles
--  Ejecutar por separado (fuera del bloque DO) para que el
--  recuento de usuarios en el panel admin sea correcto.
-- ============================================================

-- Función SECURITY DEFINER para verificar si el usuario es admin
-- (bypass de RLS para evitar recursión circular)
create or replace function public.es_admin()
returns boolean
language sql security definer stable as $$
  select coalesce(
    (select true from public.perfiles where id = auth.uid() and rol = 'admin'),
    false
  );
$$;

-- Política: cada usuario ve su propio perfil O el admin ve todos
drop policy if exists "Admin ve todos los perfiles" on public.perfiles;
create policy "Admin ve todos los perfiles" on public.perfiles
  for select using (auth.uid() = id or public.es_admin());


-- ============================================================
--  Migraciones de columnas en tabla obras
--  Necesarias para el flujo artista/empresa en la plataforma
-- ============================================================

alter table public.obras add column if not exists artista_email  text;
alter table public.obras add column if not exists empresa_email  text;
alter table public.obras add column if not exists nombre_artista text;
alter table public.obras add column if not exists estado         text
  not null default 'aprobada'
  check (estado in ('pendiente', 'aprobada', 'rechazada'));
alter table public.obras add column if not exists vistas         int default 0;

-- Columnas banner_url en usuarios y perfiles
alter table public.usuarios add column if not exists banner_url text;
alter table public.perfiles add column if not exists banner_url text default '';


-- ============================================================
--  Obras de prueba del artista (Ana Torres / artista@test.com)
--  estado = 'aprobada' para que sean visibles en el perfil público
-- ============================================================

insert into public.obras (
  artista_email, titulo, anio, descripcion,
  imagen_principal, tecnica, tamano, color, movimiento, precio, tipo,
  estado, estrellas, vistas
)
values
  ('artista@test.com',
   'Memoria del Barrio', '2022',
   'Óleo de gran formato sobre lienzo crudo que evoca la textura de los muros de una vecindad chilanga. Capas superpuestas de ocre, terracota y blanco revelan la huella del tiempo en la arquitectura popular.',
   '', 'Óleo sobre lienzo', 'Grande', 'Cálido', 'Expresionismo',
   42000, 'Físico', 'aprobada', 5, 0),

  ('artista@test.com',
   'Dualidad Roja', '2023',
   'Díptico expresionista que confronta dos figuras femeninas en rojo cadmio y negro. La pincelada gestual y el fondo neutro refuerzan la tensión entre identidad y reflejo.',
   '', 'Óleo sobre lienzo', 'Grande', 'Cálido', 'Expresionismo',
   38500, 'Físico', 'aprobada', 5, 0),

  ('artista@test.com',
   'Ciudad Fragmentada', '2024',
   'Técnica mixta sobre papel de gran gramaje. Superposición de carboncillo, gouache y collage de periódico que construye la silueta de la Ciudad de México como palimpsesto visual.',
   '', 'Técnica mixta', 'Mediano', 'Neutro', 'Arte Contemporáneo',
   21000, 'Físico', 'aprobada', 4, 0),

  ('artista@test.com',
   'Sueño Lacustre', '2021',
   'Impresión giclée de alta resolución sobre lienzo, basada en pintura digital que retoma la iconografía del lago de Texcoco en clave surrealista. Edición de 10 ejemplares numerados.',
   '', 'Digital / Impresión giclée', 'Grande', 'Frío', 'Surrealismo',
   12500, 'Impresión Oficial', 'pendiente', 5, 0)

on conflict do nothing;


-- ============================================================
--  Obras de prueba de la empresa (Galería Norte Arte / empresa@test.com)
--  Representan a dos artistas afiliados a la galería
-- ============================================================

insert into public.obras (
  empresa_email, nombre_artista, titulo, anio, descripcion,
  imagen_principal, tecnica, tamano, color, movimiento, precio, tipo,
  estado, estrellas, vistas
)
values
  ('empresa@test.com', 'Ana Torres',
   'Raíces', '2023',
   'Óleo expresionista de Ana Torres que explora el arraigo territorial a través de líneas verticales que descienden desde figuras humanas hacia una tierra fértil.',
   '', 'Óleo sobre lienzo', 'Grande', 'Cálido', 'Expresionismo',
   45000, 'Físico', 'aprobada', 5, 0),

  ('empresa@test.com', 'Ana Torres',
   'Flujo Urbano', '2022',
   'Serie de impresiones que captura el movimiento de la ciudad: trazos diagonales en azul prusia y siena sobre fondo gris.',
   '', 'Óleo sobre lienzo', 'Mediano', 'Frío', 'Expresionismo',
   29000, 'Físico', 'aprobada', 5, 0),

  ('empresa@test.com', 'Carlos Vega',
   'Geometría Tropical', '2024',
   'Composición geométrica que fusiona la abstracción constructivista con la paleta vibrante del trópico. Acrílico sobre tablero de aluminio dibond.',
   '', 'Acrílico sobre dibond', 'Grande', 'Cálido', 'Arte Abstracto',
   33000, 'Físico', 'aprobada', 4, 0),

  ('empresa@test.com', 'Carlos Vega',
   'Intervalo', '2023',
   'Escultura en resina de poliuretano y pigmento metálico. La forma suspendida evoca un instante de pausa en el movimiento continuo.',
   '', 'Escultura en resina', 'Pequeño', 'Neutro', 'Minimalismo',
   18500, 'Físico', 'aprobada', 5, 0),

  ('empresa@test.com', 'Lucía Montiel',
   'Codex Digital', '2024',
   'Serie de impresiones sobre papel de algodón inspiradas en la escritura de los códices prehispánicos reinterpretados con tipografía contemporánea.',
   '', 'Impresión sobre papel de algodón', 'Mediano', 'Neutro', 'Arte Conceptual',
   9500, 'Impresión Oficial', 'aprobada', 5, 0)

on conflict do nothing;


-- ============================================================
--  Cuentas artista para los creadores del catálogo existente
--  revolution-canvas@test.com  → Revolution Canvas  (3 obras del catálogo)
--  ideas-creativas@test.com    → Ideas Creativas     (1 obra del catálogo)
--  haucoze@test.com            → HAUCOZE             (1 obra del catálogo)
--  pop-maze@test.com           → Pop Maze Art        (1 obra del catálogo)
--  + empresa galeria-esculturas@test.com → escultores del catálogo
--  Contraseña de TODOS: Test1234
-- ============================================================

do $$
declare
  uid_rc   uuid := '33333333-0000-0000-0000-000000000001';
  uid_ic   uuid := '33333333-0000-0000-0000-000000000002';
  uid_hz   uuid := '33333333-0000-0000-0000-000000000003';
  uid_pm   uuid := '33333333-0000-0000-0000-000000000004';
  uid_ge   uuid := '33333333-0000-0000-0000-000000000005';
begin

  -- ── Revolution Canvas ────────────────────────────────────────
  insert into auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new
  ) values (
    uid_rc, '00000000-0000-0000-0000-000000000000',
    'revolution-canvas@test.com',
    crypt('Test1234', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    false, 'authenticated', 'authenticated', now(), now(), '', '', ''
  ) on conflict do nothing;

  -- ── Ideas Creativas ──────────────────────────────────────────
  insert into auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new
  ) values (
    uid_ic, '00000000-0000-0000-0000-000000000000',
    'ideas-creativas@test.com',
    crypt('Test1234', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    false, 'authenticated', 'authenticated', now(), now(), '', '', ''
  ) on conflict do nothing;

  -- ── HAUCOZE ──────────────────────────────────────────────────
  insert into auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new
  ) values (
    uid_hz, '00000000-0000-0000-0000-000000000000',
    'haucoze@test.com',
    crypt('Test1234', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    false, 'authenticated', 'authenticated', now(), now(), '', '', ''
  ) on conflict do nothing;

  -- ── Pop Maze Art ─────────────────────────────────────────────
  insert into auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new
  ) values (
    uid_pm, '00000000-0000-0000-0000-000000000000',
    'pop-maze@test.com',
    crypt('Test1234', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    false, 'authenticated', 'authenticated', now(), now(), '', '', ''
  ) on conflict do nothing;

  -- ── Galería Forma y Materia (empresa) ────────────────────────
  insert into auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new
  ) values (
    uid_ge, '00000000-0000-0000-0000-000000000000',
    'galeria-esculturas@test.com',
    crypt('Test1234', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    false, 'authenticated', 'authenticated', now(), now(), '', '', ''
  ) on conflict do nothing;

  -- ── Identidades ──────────────────────────────────────────────
  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider,
    created_at, updated_at, last_sign_in_at
  ) values
    (gen_random_uuid(), uid_rc, 'revolution-canvas@test.com',
     jsonb_build_object('sub', uid_rc::text, 'email', 'revolution-canvas@test.com'),
     'email', now(), now(), now()),
    (gen_random_uuid(), uid_ic, 'ideas-creativas@test.com',
     jsonb_build_object('sub', uid_ic::text, 'email', 'ideas-creativas@test.com'),
     'email', now(), now(), now()),
    (gen_random_uuid(), uid_hz, 'haucoze@test.com',
     jsonb_build_object('sub', uid_hz::text, 'email', 'haucoze@test.com'),
     'email', now(), now(), now()),
    (gen_random_uuid(), uid_pm, 'pop-maze@test.com',
     jsonb_build_object('sub', uid_pm::text, 'email', 'pop-maze@test.com'),
     'email', now(), now(), now()),
    (gen_random_uuid(), uid_ge, 'galeria-esculturas@test.com',
     jsonb_build_object('sub', uid_ge::text, 'email', 'galeria-esculturas@test.com'),
     'email', now(), now(), now())
  on conflict (provider, provider_id) do nothing;

  -- ── Perfiles ─────────────────────────────────────────────────
  -- WHERE EXISTS: salta filas cuyo UUID no llegó a crearse en auth.users
  insert into public.perfiles (id, rol, nombre, bio, especialidad, pais, slug, avatar_url, banner_url)
  select v.id, v.rol, v.nombre, v.bio, v.especialidad, v.pais, v.slug, v.av, v.bn
  from (values
    (uid_rc, 'artista'::text,  'Revolution Canvas'::text,
     'Colectivo de arte digital que reinterpreta obras maestras del arte clásico con estética urbana y de vanguardia.'::text,
     'Arte Digital'::text,           'México'::text, 'revolution-canvas'::text,    ''::text, ''::text),
    (uid_ic, 'artista'::text,  'Ideas Creativas'::text,
     'Estudio de arte digital especializado en ilustraciones hiperrealistas de la naturaleza.'::text,
     'Arte Digital'::text,           'México'::text, 'ideas-creativas'::text,      ''::text, ''::text),
    (uid_hz, 'artista'::text,  'HAUCOZE'::text,
     'Estudio de escultura figurativa especializado en colecciones de resina de alta densidad con acabados metálicos.'::text,
     'Escultura Figurativa'::text,   'México'::text, 'haucoze'::text,              ''::text, ''::text),
    (uid_pm, 'artista'::text,  'Pop Maze Art'::text,
     'Estudio especializado en el estilo WPAP: retratos fragmentados en planos de color que transforman íconos pop en composiciones geométricas.'::text,
     'Pop Art / WPAP'::text,         'México'::text, 'pop-maze-art'::text,         ''::text, ''::text),
    (uid_ge, 'empresa'::text,  'Galería Forma y Materia'::text,
     'Galería especializada en escultura contemporánea y decorativa. Representamos a los principales estudios de escultura en resina, low-poly y arte relacional de México.'::text,
     'Escultura Contemporánea'::text,'México'::text, 'galeria-forma-materia'::text,''::text, ''::text)
  ) as v(id, rol, nombre, bio, especialidad, pais, slug, av, bn)
  where exists (select 1 from auth.users where id = v.id)
  on conflict (id) do update set
    nombre      = excluded.nombre,
    bio         = excluded.bio,
    especialidad= excluded.especialidad,
    pais        = excluded.pais,
    slug        = coalesce(excluded.slug, public.perfiles.slug);

end $$;


-- ── Usuarios públicos (nuevos artistas + empresa esculturas) ──

insert into public.usuarios (email, clave, nombre, rol, bio, especialidad, pais, slug)
values
  ('revolution-canvas@test.com', 'supabase-auth', 'Revolution Canvas', 'artista',
   'Colectivo de arte digital que reinterpreta obras maestras del arte clásico con estética urbana y de vanguardia. Sus piezas fusionan la monumentalidad de los grandes maestros con salpicaduras de color y abstracción cromática.',
   'Arte Digital', 'México', 'revolution-canvas'),
  ('ideas-creativas@test.com', 'supabase-auth', 'Ideas Creativas', 'artista',
   'Estudio de arte digital especializado en ilustraciones hiperrealistas de la naturaleza. Sus obras combinan fotografía de alta precisión con pintura digital para capturar la vitalidad de la fauna silvestre.',
   'Arte Digital', 'México', 'ideas-creativas'),
  ('haucoze@test.com', 'supabase-auth', 'HAUCOZE', 'artista',
   'Estudio de escultura figurativa especializado en colecciones de resina de alta densidad con acabados metálicos. Sus series capturan la energía del movimiento humano en piezas de detalle milimétrico.',
   'Escultura Figurativa', 'México', 'haucoze'),
  ('pop-maze@test.com', 'supabase-auth', 'Pop Maze Art', 'artista',
   'Estudio especializado en el estilo WPAP (Wedha''s Pop Art Portrait): retratos fragmentados en planos geométricos de color que transforman íconos de la cultura pop en arte de coleccionista.',
   'Pop Art / WPAP', 'México', 'pop-maze-art'),
  ('galeria-esculturas@test.com', 'supabase-auth', 'Galería Forma y Materia', 'empresa',
   'Galería especializada en escultura contemporánea y decorativa. Representamos a los principales estudios de escultura en resina, low-poly y arte relacional de México.',
   'Escultura Contemporánea', 'México', 'galeria-forma-materia')
on conflict (email) do update set
  nombre       = excluded.nombre,
  bio          = excluded.bio,
  especialidad = excluded.especialidad,
  pais         = excluded.pais,
  slug         = excluded.slug;


-- ── Linkear obras del catálogo existente a los artistas con cuenta ──
-- Las obras 10-13, 16, 19 pasan a ser "propias" de esos artistas

update public.obras set artista_email = 'revolution-canvas@test.com'
  where id_obra in (11, 12, 13);   -- La Creación, Noche Estrellada, El Ángel

update public.obras set artista_email = 'ideas-creativas@test.com'
  where id_obra = 10;              -- Colibrí en Flor

update public.obras set artista_email = 'haucoze@test.com'
  where id_obra = 16;              -- La Banda de Rock

update public.obras set artista_email = 'pop-maze@test.com'
  where id_obra = 19;              -- El Sombrero de Paja WPAP


-- ── Obras de Galería Norte Arte ampliando catálogo digital ────

insert into public.obras (
  empresa_email, nombre_artista, titulo, anio, descripcion,
  imagen_principal, tecnica, tamano, color, movimiento, precio, tipo,
  estado, estrellas, vistas
)
values
  ('empresa@test.com', 'Revolution Canvas',
   'La Creación — Pop Art', '2022',
   'Reinterpretación contemporánea de La Creación de Adán de Miguel Ángel. Las manos icónicas emergen de un estallido de pigmentos en arte urbano y vanguardia cromática.',
   '/obras/revolution-canvas/principal.jpg', 'Arte Digital', 'Grande', 'Frío', 'Arte Digital',
   28000, 'Impresión Oficial', 'aprobada', 5, 0),

  ('empresa@test.com', 'Revolution Canvas',
   'Noche Estrellada sobre Bellas Artes', '2024',
   'Fusión entre la pincelada giratoria de Van Gogh y la majestuosidad del Palacio de Bellas Artes de la Ciudad de México.',
   '/obras/bellas-artes-noche/principal.jpg', 'Arte Digital', 'Grande', 'Frío', 'Arte Digital',
   31500, 'Impresión Oficial', 'aprobada', 5, 0),

  ('empresa@test.com', 'Ideas Creativas',
   'Colibrí en Flor', '2024',
   'Colibrí de plumaje turquesa suspendido en pleno vuelo ante una explosión de flores tropicales. Técnica digital hiperrealista.',
   '/obras/colibri-digital/principal.jpg', 'Arte Digital', 'Grande', 'Frío', 'Arte Digital',
   37500, 'Impresión Oficial', 'aprobada', 5, 0),

  ('empresa@test.com', 'Pop Maze Art',
   'El Sombrero de Paja — WPAP', '2022',
   'Retrato en técnica WPAP del icónico personaje de anime. Composición fragmentada en planos de color saturado sobre fondo azul marino.',
   '/obras/sombrero-paja-wpap/principal.jpg', 'Arte Digital', 'Grande', 'Frío', 'Pop Art',
   2800, 'Impresión Oficial', 'aprobada', 5, 0)

on conflict do nothing;


-- ── Obras de Galería Forma y Materia (escultores del catálogo) ──

insert into public.obras (
  empresa_email, nombre_artista, titulo, anio, descripcion,
  imagen_principal, tecnica, tamano, color, movimiento, precio, tipo,
  estado, estrellas, vistas
)
values
  ('galeria-esculturas@test.com', 'HAUCOZE',
   'La Banda de Rock', '2021',
   'Colección de cuatro figuras en resina: guitarrista, baterista, vocalista y tecladista. Acabado grafito mate con detalles en plata.',
   '/obras/banda-rock-haucoze/principal.jpg', 'Escultura', 'Pequeño', 'Neutro', 'Figurativismo',
   18500, 'Físico', 'aprobada', 5, 0),

  ('galeria-esculturas@test.com', 'UTTCMK',
   'El Lector', '2022',
   'Figura humana sin rostro en posición de loto con libro abierto. Superficie en arenisca beige mate de resina.',
   '/obras/el-lector-uttcmk/principal.jpg', 'Escultura', 'Pequeño', 'Neutro', 'Abstracto',
   9500, 'Físico', 'aprobada', 5, 0),

  ('galeria-esculturas@test.com', 'GMMH',
   'El Trío del Silencio', '2023',
   'Tres rostros abstractos en resina plata antigüa: Ver, Oír, Callar. Textura cincelada a mano con bases en madera negra.',
   '/obras/silencio-trio/principal.jpg', 'Escultura', 'Pequeño', 'Neutro', 'Expresionismo',
   8900, 'Físico', 'aprobada', 5, 0),

  ('galeria-esculturas@test.com', 'Atelier Geométrico',
   'Dúo Venado Dorado', '2021',
   'Par de ciervos en geometría low-poly con acabado en resina dorada mate. Edición de coleccionista.',
   '/obras/venado-dorado/principal.jpg', 'Escultura', 'Pequeño', 'Cálido', 'Minimalismo',
   12500, 'Físico', 'aprobada', 4, 0),

  ('galeria-esculturas@test.com', 'BestAlice',
   'Árbol de la Vida — Hojas de Cristal', '2023',
   'Escultura de mesa con ramas de alambre de cobre y más de cien hojas de acrílico translúcido en espectro completo de color.',
   '/obras/arbol-vida-cristal/principal.jpg', 'Mixta', 'Pequeño', 'Cálido', 'Arte Decorativo',
   4800, 'Físico', 'aprobada', 5, 0),

  ('galeria-esculturas@test.com', 'Suruim',
   'El Bulldog Dandy', '2022',
   'Bulldog francés en resina mate con traje de etiqueta, pajarita dorada y charola en metal. Piezas removibles.',
   '/obras/bulldog-dandy/principal.jpg', 'Escultura', 'Pequeño', 'Neutro', 'Figurativismo',
   3800, 'Físico', 'aprobada', 4, 0),

  ('galeria-esculturas@test.com', 'Arte & Memorias',
   'Árbol de Huellas — Amor y Unión', '2023',
   'Lienzo participativo que se completa con la huella dactilar de los invitados. Obra única e irrepetible.',
   '/obras/arbol-huellas/principal.jpg', 'Mixta', 'Mediano', 'Neutro', 'Arte Relacional',
   7500, 'Físico', 'aprobada', 5, 0)

on conflict do nothing;


-- ============================================================
--  Arreglar imágenes y tipos de obras de test
--  Idempotente: siempre sobrescribe con el valor correcto
-- ============================================================

-- Ampliar constraint de tipo para incluir 'Edición limitada'
alter table public.obras drop constraint if exists obras_tipo_check;
alter table public.obras add constraint obras_tipo_check
  check (tipo in ('Físico', 'JPG Certificado', 'Edición limitada', 'Impresión Oficial'));

-- Obras de artista@test.com
update public.obras set imagen_principal = 'https://picsum.photos/seed/barrio-mex/800/1000'
  where titulo = 'Memoria del Barrio' and artista_email = 'artista@test.com';

update public.obras set imagen_principal = 'https://picsum.photos/seed/dualidad-roja/800/1000'
  where titulo = 'Dualidad Roja' and artista_email = 'artista@test.com';

update public.obras set imagen_principal = 'https://picsum.photos/seed/ciudad-frag/800/1000'
  where titulo = 'Ciudad Fragmentada' and artista_email = 'artista@test.com';

update public.obras set
  imagen_principal = 'https://picsum.photos/seed/sueno-lac/800/1000',
  tipo = 'Edición limitada'
  where titulo = 'Sueño Lacustre' and artista_email = 'artista@test.com';

-- Obras de empresa@test.com (Ana Torres / Carlos Vega)
update public.obras set imagen_principal = 'https://picsum.photos/seed/raices-torres/800/1000'
  where titulo = 'Raíces' and empresa_email = 'empresa@test.com';

update public.obras set imagen_principal = 'https://picsum.photos/seed/flujo-urbano/800/1000'
  where titulo = 'Flujo Urbano' and empresa_email = 'empresa@test.com';

update public.obras set imagen_principal = 'https://picsum.photos/seed/geo-tropical/800/1000'
  where titulo = 'Geometría Tropical' and empresa_email = 'empresa@test.com';

update public.obras set imagen_principal = 'https://picsum.photos/seed/intervalo-vega/600/600'
  where titulo = 'Intervalo' and empresa_email = 'empresa@test.com';

update public.obras set
  imagen_principal = 'https://picsum.photos/seed/codex-digital/800/600',
  tipo = 'Edición limitada'
  where titulo = 'Codex Digital' and empresa_email = 'empresa@test.com';

-- Obras de empresa@test.com (extensión catálogo digital)
update public.obras set
  imagen_principal = 'https://picsum.photos/seed/creacion-pop/800/1000',
  tipo = 'Edición limitada'
  where titulo = 'La Creación — Pop Art' and empresa_email = 'empresa@test.com';

update public.obras set
  imagen_principal = 'https://picsum.photos/seed/bellas-artes-noche/800/1000',
  tipo = 'Edición limitada'
  where titulo = 'Noche Estrellada sobre Bellas Artes' and empresa_email = 'empresa@test.com';

update public.obras set
  imagen_principal = 'https://picsum.photos/seed/colibri-digital/800/1000',
  tipo = 'Edición limitada'
  where titulo = 'Colibrí en Flor' and empresa_email = 'empresa@test.com';

update public.obras set
  imagen_principal = 'https://picsum.photos/seed/sombrero-wpap/800/1000',
  tipo = 'Edición limitada'
  where titulo = 'El Sombrero de Paja — WPAP' and empresa_email = 'empresa@test.com';

-- Obras de galeria-esculturas@test.com
update public.obras set imagen_principal = 'https://picsum.photos/seed/banda-rock/600/600'
  where titulo = 'La Banda de Rock' and empresa_email = 'galeria-esculturas@test.com';

update public.obras set imagen_principal = 'https://picsum.photos/seed/el-lector/600/600'
  where titulo = 'El Lector' and empresa_email = 'galeria-esculturas@test.com';

update public.obras set imagen_principal = 'https://picsum.photos/seed/trio-silencio/600/600'
  where titulo = 'El Trío del Silencio' and empresa_email = 'galeria-esculturas@test.com';

update public.obras set imagen_principal = 'https://picsum.photos/seed/venado-dorado/600/600'
  where titulo = 'Dúo Venado Dorado' and empresa_email = 'galeria-esculturas@test.com';

update public.obras set imagen_principal = 'https://picsum.photos/seed/arbol-cristal/600/600'
  where titulo = 'Árbol de la Vida — Hojas de Cristal' and empresa_email = 'galeria-esculturas@test.com';

update public.obras set imagen_principal = 'https://picsum.photos/seed/bulldog-dandy/600/600'
  where titulo = 'El Bulldog Dandy' and empresa_email = 'galeria-esculturas@test.com';

update public.obras set imagen_principal = 'https://picsum.photos/seed/arbol-huellas/600/600'
  where titulo = 'Árbol de Huellas — Amor y Unión' and empresa_email = 'galeria-esculturas@test.com';
