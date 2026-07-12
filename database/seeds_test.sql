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
  alter table public.perfiles add column if not exists avatar_url text default '';

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
  ) on conflict (id) do nothing;

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
  ) on conflict (id) do nothing;

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
  ) on conflict (id) do nothing;

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
  ) on conflict (id) do nothing;

  -- ── Perfiles ─────────────────────────────────────────────
  insert into public.perfiles (id, rol, nombre, bio, especialidad, pais, slug, avatar_url)
  values
    (uid_artista,
     'artista',
     'Ana Torres',
     'Pintora expresionista de la Ciudad de México. Especialista en óleos de gran formato y técnicas mixtas.',
     'Pintura al óleo',
     'México',
     null,
     ''),
    (uid_comprador,
     'comprador',
     'Luis Mendoza',
     '',
     'Coleccionista',
     'México',
     null,
     ''),
    (uid_empresa,
     'empresa',
     'Galería Norte Arte',
     'Galería dedicada al arte contemporáneo emergente mexicano.',
     'Arte contemporáneo',
     'México',
     'galeria-norte-arte',
     ''),
    (uid_admin,
     'admin',
     'Administrador',
     '',
     'Administración',
     'México',
     null,
     '')
  on conflict (id) do nothing;

end $$;


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
