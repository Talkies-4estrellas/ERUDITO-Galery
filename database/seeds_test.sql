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


-- ── accesos_prueba: TODOS los test accounts ────────────────────────────────
-- GoTrue v2.195+ no autentifica usuarios insertados vía SQL puro.
-- La ruta 1 del login lee esta tabla → localStorage (sin JWT).

insert into public.accesos_prueba (email, clave, rol, nombre, bio, especialidad, pais, slug, avatar_url)
values
  -- Cuentas principales
  ('artista@test.com', 'Test1234', 'artista', 'Ana Torres',
   'Pintora expresionista de la Ciudad de México. Especialista en óleos de gran formato y técnicas mixtas.',
   'Pintura al óleo', 'México', 'ana-torres', ''),
  ('empresa@test.com', 'Test1234', 'empresa', 'Galería Norte Arte',
   'Galería dedicada al arte contemporáneo emergente mexicano.',
   'Arte contemporáneo', 'México', 'galeria-norte-arte', ''),
  ('comprador@test.com', 'Test1234', 'comprador', 'Luis Mendoza',
   '', 'Coleccionista', 'México', 'luis-mendoza', ''),
  ('admin@test.com', 'Test1234', 'admin', 'Administrador',
   '', 'Administración', 'México', 'administrador', ''),
  -- Artistas y empresa de catálogo
  ('revolution-canvas@test.com', 'Test1234', 'artista', 'Revolution Canvas',
   'Colectivo de arte digital que reinterpreta obras maestras del arte clásico con estética urbana y de vanguardia.',
   'Arte Digital', 'México', 'revolution-canvas', ''),
  ('ideas-creativas@test.com', 'Test1234', 'artista', 'Ideas Creativas',
   'Estudio de arte digital especializado en ilustraciones hiperrealistas de la naturaleza.',
   'Arte Digital', 'México', 'ideas-creativas', ''),
  ('haucoze@test.com', 'Test1234', 'artista', 'HAUCOZE',
   'Estudio de escultura figurativa especializado en colecciones de resina de alta densidad con acabados metálicos.',
   'Escultura Figurativa', 'México', 'haucoze', ''),
  ('pop-maze@test.com', 'Test1234', 'artista', 'Pop Maze Art',
   'Estudio especializado en el estilo WPAP: retratos fragmentados en planos geométricos de color.',
   'Pop Art / WPAP', 'México', 'pop-maze-art', ''),
  ('galeria-esculturas@test.com', 'Test1234', 'empresa', 'Galería Forma y Materia',
   'Galería especializada en escultura contemporánea y decorativa.',
   'Escultura Contemporánea', 'México', 'galeria-forma-materia', '')
on conflict (email) do nothing;


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


-- Eliminar obras duplicadas de artistas con perfil propio que quedaron
-- asociadas a empresa@test.com — la galería solo representa artistas afiliados ficticios.
delete from public.obras
  where empresa_email = 'empresa@test.com'
    and nombre_artista in ('Revolution Canvas', 'Ideas Creativas', 'Pop Maze Art');


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


-- ============================================================
--  Ampliar constraint de rol en perfiles para incluir 'productor'
-- ============================================================

alter table public.perfiles drop constraint if exists perfiles_rol_check;
alter table public.perfiles add constraint perfiles_rol_check
  check (rol in ('artista', 'comprador', 'empresa', 'admin', 'productor'));

alter table public.accesos_prueba drop constraint if exists accesos_prueba_rol_check;
alter table public.accesos_prueba add constraint accesos_prueba_rol_check
  check (rol in ('artista', 'comprador', 'empresa', 'admin', 'productor'));


-- ============================================================
--  Cuentas productor para los 17 productores de cocina
--  Contraseña de TODOS: Test1234
-- ============================================================

do $$
declare
  uid_p01 uuid := '55555555-0000-0000-0000-000000000001';  -- Monte Xanic
  uid_p02 uuid := '55555555-0000-0000-0000-000000000002';  -- Casa Madero
  uid_p03 uuid := '55555555-0000-0000-0000-000000000003';  -- Dr. Loosen
  uid_p04 uuid := '55555555-0000-0000-0000-000000000004';  -- Castillo de Canena
  uid_p05 uuid := '55555555-0000-0000-0000-000000000005';  -- Amal Coopérative
  uid_p06 uuid := '55555555-0000-0000-0000-000000000006';  -- Chosen Foods
  uid_p07 uuid := '55555555-0000-0000-0000-000000000007';  -- Gaya Vainilla
  uid_p08 uuid := '55555555-0000-0000-0000-000000000008';  -- Cooperativa Coopaman
  uid_p09 uuid := '55555555-0000-0000-0000-000000000009';  -- Casa Maguey
  uid_p10 uuid := '55555555-0000-0000-0000-000000000010';  -- Cacao Bucarela
  uid_p11 uuid := '55555555-0000-0000-0000-000000000011';  -- Valrhona
  uid_p12 uuid := '55555555-0000-0000-0000-000000000012';  -- Conservas Ortiz
  uid_p13 uuid := '55555555-0000-0000-0000-000000000013';  -- Plantin
  uid_p14 uuid := '55555555-0000-0000-0000-000000000014';  -- Caviar de Neuvic
  uid_p15 uuid := '55555555-0000-0000-0000-000000000015';  -- Kab Ik
  uid_p16 uuid := '55555555-0000-0000-0000-000000000016';  -- Comvita
  uid_p17 uuid := '55555555-0000-0000-0000-000000000017';  -- Schwarzwälder Imkerei
begin

  -- ── auth.users ───────────────────────────────────────────────
  insert into auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new
  ) values
    (uid_p01,'00000000-0000-0000-0000-000000000000','monte-xanic@test.com',crypt('Test1234',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}'::jsonb,'{}'::jsonb,false,'authenticated','authenticated',now(),now(),'','',''),
    (uid_p02,'00000000-0000-0000-0000-000000000000','casa-madero@test.com',crypt('Test1234',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}'::jsonb,'{}'::jsonb,false,'authenticated','authenticated',now(),now(),'','',''),
    (uid_p03,'00000000-0000-0000-0000-000000000000','dr-loosen@test.com',crypt('Test1234',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}'::jsonb,'{}'::jsonb,false,'authenticated','authenticated',now(),now(),'','',''),
    (uid_p04,'00000000-0000-0000-0000-000000000000','castillo-canena@test.com',crypt('Test1234',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}'::jsonb,'{}'::jsonb,false,'authenticated','authenticated',now(),now(),'','',''),
    (uid_p05,'00000000-0000-0000-0000-000000000000','amal-cooperativa@test.com',crypt('Test1234',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}'::jsonb,'{}'::jsonb,false,'authenticated','authenticated',now(),now(),'','',''),
    (uid_p06,'00000000-0000-0000-0000-000000000000','chosen-foods@test.com',crypt('Test1234',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}'::jsonb,'{}'::jsonb,false,'authenticated','authenticated',now(),now(),'','',''),
    (uid_p07,'00000000-0000-0000-0000-000000000000','gaya-vainilla@test.com',crypt('Test1234',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}'::jsonb,'{}'::jsonb,false,'authenticated','authenticated',now(),now(),'','',''),
    (uid_p08,'00000000-0000-0000-0000-000000000000','coopaman@test.com',crypt('Test1234',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}'::jsonb,'{}'::jsonb,false,'authenticated','authenticated',now(),now(),'','',''),
    (uid_p09,'00000000-0000-0000-0000-000000000000','casa-maguey@test.com',crypt('Test1234',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}'::jsonb,'{}'::jsonb,false,'authenticated','authenticated',now(),now(),'','',''),
    (uid_p10,'00000000-0000-0000-0000-000000000000','cacao-bucarela@test.com',crypt('Test1234',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}'::jsonb,'{}'::jsonb,false,'authenticated','authenticated',now(),now(),'','',''),
    (uid_p11,'00000000-0000-0000-0000-000000000000','valrhona@test.com',crypt('Test1234',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}'::jsonb,'{}'::jsonb,false,'authenticated','authenticated',now(),now(),'','',''),
    (uid_p12,'00000000-0000-0000-0000-000000000000','conservas-ortiz@test.com',crypt('Test1234',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}'::jsonb,'{}'::jsonb,false,'authenticated','authenticated',now(),now(),'','',''),
    (uid_p13,'00000000-0000-0000-0000-000000000000','plantin@test.com',crypt('Test1234',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}'::jsonb,'{}'::jsonb,false,'authenticated','authenticated',now(),now(),'','',''),
    (uid_p14,'00000000-0000-0000-0000-000000000000','caviar-neuvic@test.com',crypt('Test1234',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}'::jsonb,'{}'::jsonb,false,'authenticated','authenticated',now(),now(),'','',''),
    (uid_p15,'00000000-0000-0000-0000-000000000000','kab-ik@test.com',crypt('Test1234',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}'::jsonb,'{}'::jsonb,false,'authenticated','authenticated',now(),now(),'','',''),
    (uid_p16,'00000000-0000-0000-0000-000000000000','comvita@test.com',crypt('Test1234',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}'::jsonb,'{}'::jsonb,false,'authenticated','authenticated',now(),now(),'','',''),
    (uid_p17,'00000000-0000-0000-0000-000000000000','schwarzwalder-imkerei@test.com',crypt('Test1234',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}'::jsonb,'{}'::jsonb,false,'authenticated','authenticated',now(),now(),'','','')
  on conflict do nothing;

  -- ── auth.identities ──────────────────────────────────────────
  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider,
    created_at, updated_at, last_sign_in_at
  ) values
    (gen_random_uuid(),uid_p01,'monte-xanic@test.com',jsonb_build_object('sub',uid_p01::text,'email','monte-xanic@test.com'),'email',now(),now(),now()),
    (gen_random_uuid(),uid_p02,'casa-madero@test.com',jsonb_build_object('sub',uid_p02::text,'email','casa-madero@test.com'),'email',now(),now(),now()),
    (gen_random_uuid(),uid_p03,'dr-loosen@test.com',jsonb_build_object('sub',uid_p03::text,'email','dr-loosen@test.com'),'email',now(),now(),now()),
    (gen_random_uuid(),uid_p04,'castillo-canena@test.com',jsonb_build_object('sub',uid_p04::text,'email','castillo-canena@test.com'),'email',now(),now(),now()),
    (gen_random_uuid(),uid_p05,'amal-cooperativa@test.com',jsonb_build_object('sub',uid_p05::text,'email','amal-cooperativa@test.com'),'email',now(),now(),now()),
    (gen_random_uuid(),uid_p06,'chosen-foods@test.com',jsonb_build_object('sub',uid_p06::text,'email','chosen-foods@test.com'),'email',now(),now(),now()),
    (gen_random_uuid(),uid_p07,'gaya-vainilla@test.com',jsonb_build_object('sub',uid_p07::text,'email','gaya-vainilla@test.com'),'email',now(),now(),now()),
    (gen_random_uuid(),uid_p08,'coopaman@test.com',jsonb_build_object('sub',uid_p08::text,'email','coopaman@test.com'),'email',now(),now(),now()),
    (gen_random_uuid(),uid_p09,'casa-maguey@test.com',jsonb_build_object('sub',uid_p09::text,'email','casa-maguey@test.com'),'email',now(),now(),now()),
    (gen_random_uuid(),uid_p10,'cacao-bucarela@test.com',jsonb_build_object('sub',uid_p10::text,'email','cacao-bucarela@test.com'),'email',now(),now(),now()),
    (gen_random_uuid(),uid_p11,'valrhona@test.com',jsonb_build_object('sub',uid_p11::text,'email','valrhona@test.com'),'email',now(),now(),now()),
    (gen_random_uuid(),uid_p12,'conservas-ortiz@test.com',jsonb_build_object('sub',uid_p12::text,'email','conservas-ortiz@test.com'),'email',now(),now(),now()),
    (gen_random_uuid(),uid_p13,'plantin@test.com',jsonb_build_object('sub',uid_p13::text,'email','plantin@test.com'),'email',now(),now(),now()),
    (gen_random_uuid(),uid_p14,'caviar-neuvic@test.com',jsonb_build_object('sub',uid_p14::text,'email','caviar-neuvic@test.com'),'email',now(),now(),now()),
    (gen_random_uuid(),uid_p15,'kab-ik@test.com',jsonb_build_object('sub',uid_p15::text,'email','kab-ik@test.com'),'email',now(),now(),now()),
    (gen_random_uuid(),uid_p16,'comvita@test.com',jsonb_build_object('sub',uid_p16::text,'email','comvita@test.com'),'email',now(),now(),now()),
    (gen_random_uuid(),uid_p17,'schwarzwalder-imkerei@test.com',jsonb_build_object('sub',uid_p17::text,'email','schwarzwalder-imkerei@test.com'),'email',now(),now(),now())
  on conflict (provider, provider_id) do nothing;

  -- ── public.perfiles ──────────────────────────────────────────
  insert into public.perfiles (id, rol, nombre, bio, especialidad, pais, slug, avatar_url, banner_url)
  select v.id, v.rol, v.nombre, v.bio, v.especialidad, v.pais, v.slug, ''::text, ''::text
  from (values
    (uid_p01,'productor'::text,'Monte Xanic'::text,'Bodega icónica del Valle de Guadalupe, pionera del vino de autor en México desde 1988.'::text,'Enología'::text,'México'::text,'monte-xanic'::text),
    (uid_p02,'productor'::text,'Casa Madero'::text,'Bodega más antigua de América (1597) en el Valle de Parras, Coahuila.'::text,'Enología'::text,'México'::text,'casa-madero'::text),
    (uid_p03,'productor'::text,'Dr. Loosen'::text,'Bodega familiar con más de 200 años en el Mosela, referente mundial del Riesling.'::text,'Enología'::text,'Alemania'::text,'dr-loosen'::text),
    (uid_p04,'productor'::text,'Castillo de Canena'::text,'Familia Vañó, productores de EVOO premium en Jaén desde el siglo XVIII.'::text,'Aceite de Oliva Virgen Extra'::text,'España'::text,'castillo-de-canena'::text),
    (uid_p05,'productor'::text,'Amal Coopérative'::text,'Cooperativa femenina marroquí productora de aceite de argán gastronómico y cosmético.'::text,'Aceite de Argán'::text,'Marruecos'::text,'amal-cooperative'::text),
    (uid_p06,'productor'::text,'Chosen Foods'::text,'Empresa especializada en aceite de aguacate puro de Michoacán, prensado en frío.'::text,'Aceite de Aguacate'::text,'México'::text,'chosen-foods'::text),
    (uid_p07,'productor'::text,'Gaya Vainilla'::text,'Productora artesanal de vainilla de Papantla curada según el método totonaca tradicional.'::text,'Especias y Vainilla'::text,'México'::text,'gaya-vainilla'::text),
    (uid_p08,'productor'::text,'Cooperativa Coopaman'::text,'Cooperativa de azafraneros de La Mancha con Denominación de Origen protegida.'::text,'Azafrán'::text,'España'::text,'cooperativa-coopaman'::text),
    (uid_p09,'productor'::text,'Casa Maguey'::text,'Selección artesanal de chiles secos oaxaqueños de productores del Valle de Oaxaca.'::text,'Chiles y Especias'::text,'México'::text,'casa-maguey'::text),
    (uid_p10,'productor'::text,'Cacao Bucarela'::text,'Chocolatería bean-to-bar del Soconusco, Chiapas, con cacao criollo y trinitario orgánico.'::text,'Chocolatería'::text,'México'::text,'cacao-bucarela'::text),
    (uid_p11,'productor'::text,'Valrhona'::text,'Maison de chocolat fundada en 1922 en Tain-l''Hermitage, referente mundial de la alta pastelería.'::text,'Chocolatería'::text,'Francia'::text,'valrhona'::text),
    (uid_p12,'productor'::text,'Conservas Ortiz'::text,'Empresa vasca con más de 100 años capturando anchoas del Cantábrico con anzuelo.'::text,'Conservas del Mar'::text,'España'::text,'conservas-ortiz'::text),
    (uid_p13,'productor'::text,'Plantin'::text,'Negociante y conservero de trufas del Périgord, referencia europea desde 1930.'::text,'Trufas y Conservas'::text,'Francia'::text,'plantin'::text),
    (uid_p14,'productor'::text,'Caviar de Neuvic'::text,'Piscifactoría en el río Dordoña criando esturiones en agua pura para caviar de alta gama.'::text,'Caviar y Esturión'::text,'Francia'::text,'caviar-de-neuvic'::text),
    (uid_p15,'productor'::text,'Kab Ik'::text,'Proyecto maya de apicultura con abeja melipona Xunán Kaab en Valladolid, Yucatán.'::text,'Miel Melipona'::text,'México'::text,'kab-ik'::text),
    (uid_p16,'productor'::text,'Comvita'::text,'Empresa neozelandesa líder en miel de manuka certificada MGO, fundada en 1974.'::text,'Miel Manuka'::text,'Nueva Zelanda'::text,'comvita'::text),
    (uid_p17,'productor'::text,'Schwarzwälder Imkerei'::text,'Apicultura familiar en la Selva Negra productora de miel de bosque de temporada.'::text,'Miel de Bosque'::text,'Alemania'::text,'schwarzwalder-imkerei'::text)
  ) as v(id, rol, nombre, bio, especialidad, pais, slug)
  where exists (select 1 from auth.users where id = v.id)
  on conflict (id) do update set
    nombre      = excluded.nombre,
    bio         = excluded.bio,
    especialidad= excluded.especialidad,
    pais        = excluded.pais,
    slug        = coalesce(excluded.slug, public.perfiles.slug);

end $$;


-- ── accesos_prueba: cuentas productor ─────────────────────────────────────────

insert into public.accesos_prueba (email, clave, rol, nombre, bio, especialidad, pais, slug, avatar_url)
values
  ('monte-xanic@test.com','Test1234','productor','Monte Xanic','Bodega icónica del Valle de Guadalupe, pionera del vino de autor en México desde 1988.','Enología','México','monte-xanic',''),
  ('casa-madero@test.com','Test1234','productor','Casa Madero','Bodega más antigua de América (1597) en el Valle de Parras, Coahuila.','Enología','México','casa-madero',''),
  ('dr-loosen@test.com','Test1234','productor','Dr. Loosen','Bodega familiar con más de 200 años en el Mosela, referente mundial del Riesling.','Enología','Alemania','dr-loosen',''),
  ('castillo-canena@test.com','Test1234','productor','Castillo de Canena','Familia Vañó, productores de EVOO premium en Jaén desde el siglo XVIII.','Aceite de Oliva Virgen Extra','España','castillo-de-canena',''),
  ('amal-cooperativa@test.com','Test1234','productor','Amal Coopérative','Cooperativa femenina marroquí productora de aceite de argán gastronómico y cosmético.','Aceite de Argán','Marruecos','amal-cooperative',''),
  ('chosen-foods@test.com','Test1234','productor','Chosen Foods','Empresa especializada en aceite de aguacate puro de Michoacán, prensado en frío.','Aceite de Aguacate','México','chosen-foods',''),
  ('gaya-vainilla@test.com','Test1234','productor','Gaya Vainilla','Productora artesanal de vainilla de Papantla curada según el método totonaca tradicional.','Especias y Vainilla','México','gaya-vainilla',''),
  ('coopaman@test.com','Test1234','productor','Cooperativa Coopaman','Cooperativa de azafraneros de La Mancha con Denominación de Origen protegida.','Azafrán','España','cooperativa-coopaman',''),
  ('casa-maguey@test.com','Test1234','productor','Casa Maguey','Selección artesanal de chiles secos oaxaqueños de productores del Valle de Oaxaca.','Chiles y Especias','México','casa-maguey',''),
  ('cacao-bucarela@test.com','Test1234','productor','Cacao Bucarela','Chocolatería bean-to-bar del Soconusco, Chiapas, con cacao criollo y trinitario orgánico.','Chocolatería','México','cacao-bucarela',''),
  ('valrhona@test.com','Test1234','productor','Valrhona','Maison de chocolat fundada en 1922 en Tain-l''Hermitage, referente mundial de la alta pastelería.','Chocolatería','Francia','valrhona',''),
  ('conservas-ortiz@test.com','Test1234','productor','Conservas Ortiz','Empresa vasca con más de 100 años capturando anchoas del Cantábrico con anzuelo.','Conservas del Mar','España','conservas-ortiz',''),
  ('plantin@test.com','Test1234','productor','Plantin','Negociante y conservero de trufas del Périgord, referencia europea desde 1930.','Trufas y Conservas','Francia','plantin',''),
  ('caviar-neuvic@test.com','Test1234','productor','Caviar de Neuvic','Piscifactoría en el río Dordoña criando esturiones en agua pura para caviar de alta gama.','Caviar y Esturión','Francia','caviar-de-neuvic',''),
  ('kab-ik@test.com','Test1234','productor','Kab Ik','Proyecto maya de apicultura con abeja melipona Xunán Kaab en Valladolid, Yucatán.','Miel Melipona','México','kab-ik',''),
  ('comvita@test.com','Test1234','productor','Comvita','Empresa neozelandesa líder en miel de manuka certificada MGO, fundada en 1974.','Miel Manuka','Nueva Zelanda','comvita',''),
  ('schwarzwalder-imkerei@test.com','Test1234','productor','Schwarzwälder Imkerei','Apicultura familiar en la Selva Negra productora de miel de bosque de temporada.','Miel de Bosque','Alemania','schwarzwalder-imkerei','')
on conflict (email) do update set
  nombre      = excluded.nombre,
  bio         = excluded.bio,
  especialidad= excluded.especialidad,
  pais        = excluded.pais,
  slug        = excluded.slug;


-- ── Linkear productos_cocina a sus cuentas productor ──────────────────────────

alter table public.productos_cocina add column if not exists productor_email text;

update public.productos_cocina set productor_email = 'monte-xanic@test.com'       where productor = 'Monte Xanic';
update public.productos_cocina set productor_email = 'casa-madero@test.com'        where productor = 'Casa Madero';
update public.productos_cocina set productor_email = 'dr-loosen@test.com'          where productor = 'Dr. Loosen';
update public.productos_cocina set productor_email = 'castillo-canena@test.com'    where productor = 'Castillo de Canena';
update public.productos_cocina set productor_email = 'amal-cooperativa@test.com'   where productor = 'Amal Coopérative';
update public.productos_cocina set productor_email = 'chosen-foods@test.com'       where productor = 'Chosen Foods';
update public.productos_cocina set productor_email = 'gaya-vainilla@test.com'      where productor = 'Gaya Vainilla';
update public.productos_cocina set productor_email = 'coopaman@test.com'           where productor = 'Cooperativa Coopaman';
update public.productos_cocina set productor_email = 'casa-maguey@test.com'        where productor = 'Casa Maguey';
update public.productos_cocina set productor_email = 'cacao-bucarela@test.com'     where productor = 'Cacao Bucarela';
update public.productos_cocina set productor_email = 'valrhona@test.com'           where productor = 'Valrhona';
update public.productos_cocina set productor_email = 'conservas-ortiz@test.com'    where productor = 'Conservas Ortiz';
update public.productos_cocina set productor_email = 'plantin@test.com'            where productor = 'Plantin';
update public.productos_cocina set productor_email = 'caviar-neuvic@test.com'      where productor = 'Caviar de Neuvic';
update public.productos_cocina set productor_email = 'kab-ik@test.com'             where productor = 'Kab Ik';
update public.productos_cocina set productor_email = 'comvita@test.com'            where productor = 'Comvita';
update public.productos_cocina set productor_email = 'schwarzwalder-imkerei@test.com' where productor = 'Schwarzwälder Imkerei';
