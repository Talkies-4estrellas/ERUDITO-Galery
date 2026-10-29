-- Ejecutar en el SQL Editor del proyecto Supabase NUEVO (ehpvkbazeblmprubkcqh).
-- 1) Permisos que faltaron en la migración para la service_role (Route Handlers).
-- 2) Reemplaza el dominio del Supabase viejo por el nuevo en todas las URLs de imágenes.

GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES    IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES    TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES    TO authenticated;

BEGIN;

UPDATE public.obras SET
  imagen_principal = replace(imagen_principal, 'dtqijxpdavazfovpzjmw.supabase.co', 'ehpvkbazeblmprubkcqh.supabase.co'),
  avatar_artista   = replace(avatar_artista,   'dtqijxpdavazfovpzjmw.supabase.co', 'ehpvkbazeblmprubkcqh.supabase.co'),
  imagenes         = replace(imagenes::text,   'dtqijxpdavazfovpzjmw.supabase.co', 'ehpvkbazeblmprubkcqh.supabase.co')::jsonb
WHERE imagen_principal LIKE '%dtqijxpdavazfovpzjmw%'
   OR avatar_artista   LIKE '%dtqijxpdavazfovpzjmw%'
   OR imagenes::text   LIKE '%dtqijxpdavazfovpzjmw%';

UPDATE public.usuarios SET
  avatar_url = replace(avatar_url, 'dtqijxpdavazfovpzjmw.supabase.co', 'ehpvkbazeblmprubkcqh.supabase.co'),
  banner_url = replace(banner_url, 'dtqijxpdavazfovpzjmw.supabase.co', 'ehpvkbazeblmprubkcqh.supabase.co')
WHERE avatar_url LIKE '%dtqijxpdavazfovpzjmw%' OR banner_url LIKE '%dtqijxpdavazfovpzjmw%';

UPDATE public.perfiles SET
  avatar_url = replace(avatar_url, 'dtqijxpdavazfovpzjmw.supabase.co', 'ehpvkbazeblmprubkcqh.supabase.co'),
  banner_url = replace(banner_url, 'dtqijxpdavazfovpzjmw.supabase.co', 'ehpvkbazeblmprubkcqh.supabase.co')
WHERE avatar_url LIKE '%dtqijxpdavazfovpzjmw%' OR banner_url LIKE '%dtqijxpdavazfovpzjmw%';

UPDATE public.productos_cocina
SET imagen = replace(imagen, 'dtqijxpdavazfovpzjmw.supabase.co', 'ehpvkbazeblmprubkcqh.supabase.co')
WHERE imagen LIKE '%dtqijxpdavazfovpzjmw%';

UPDATE public.eventos
SET imagen = replace(imagen, 'dtqijxpdavazfovpzjmw.supabase.co', 'ehpvkbazeblmprubkcqh.supabase.co')
WHERE imagen LIKE '%dtqijxpdavazfovpzjmw%';

COMMIT;

-- Verificación: debe dar 0 en todas las filas.
SELECT 'obras' AS tabla, count(*) FROM public.obras
  WHERE imagen_principal LIKE '%dtqijxpdavazfovpzjmw%' OR avatar_artista LIKE '%dtqijxpdavazfovpzjmw%' OR imagenes::text LIKE '%dtqijxpdavazfovpzjmw%'
UNION ALL SELECT 'usuarios', count(*) FROM public.usuarios
  WHERE avatar_url LIKE '%dtqijxpdavazfovpzjmw%' OR banner_url LIKE '%dtqijxpdavazfovpzjmw%'
UNION ALL SELECT 'perfiles', count(*) FROM public.perfiles
  WHERE avatar_url LIKE '%dtqijxpdavazfovpzjmw%' OR banner_url LIKE '%dtqijxpdavazfovpzjmw%'
UNION ALL SELECT 'productos_cocina', count(*) FROM public.productos_cocina WHERE imagen LIKE '%dtqijxpdavazfovpzjmw%'
UNION ALL SELECT 'eventos', count(*) FROM public.eventos WHERE imagen LIKE '%dtqijxpdavazfovpzjmw%';
