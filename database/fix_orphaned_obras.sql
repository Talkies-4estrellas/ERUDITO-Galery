-- ============================================================
--  ERUDITO Galery — Limpieza de obras huérfanas y ajuste de vistas
--  Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Ver cuántas obras huérfanas hay (sin artista de ningún tipo)
SELECT COUNT(*) AS obras_huerfanas
FROM obras
WHERE id_artista IS NULL
  AND (artista_email IS NULL OR artista_email = '')
  AND (empresa_email IS NULL OR empresa_email = '');

-- 2. Eliminar obras huérfanas (artista del catálogo eliminado, sin artista_email)
DELETE FROM obras
WHERE id_artista IS NULL
  AND (artista_email IS NULL OR artista_email = '')
  AND (empresa_email IS NULL OR empresa_email = '');

-- 3. Poblar nombre_artista con el nombre real del usuario (maestros mexicanos)
UPDATE obras o
SET nombre_artista = u.nombre
FROM usuarios u
WHERE o.artista_email = u.email
  AND (o.nombre_artista IS NULL OR o.nombre_artista = '');

-- 4. Subir vistas en obras de maestros mexicanos para que aparezcan en el carousel
--    (distribuidas para que roten en el carousel: 4 más vistas → top 4)
UPDATE obras SET vistas = 200 WHERE artista_email = 'davidsiqueiros@gmail.com' AND estado = 'aprobada';
UPDATE obras SET vistas = 195 WHERE artista_email = 'rufinotamayo@gmail.com'    AND estado = 'aprobada';
UPDATE obras SET vistas = 190 WHERE artista_email = 'fridakahlo@gmail.com'       AND estado = 'aprobada';
UPDATE obras SET vistas = 185 WHERE artista_email = 'leonoracarrington@gmail.com' AND estado = 'aprobada';
UPDATE obras SET vistas = 180 WHERE artista_email = 'joseorozco@gmail.com'        AND estado = 'aprobada';
UPDATE obras SET vistas = 175 WHERE artista_email = 'remediosvaro@gmail.com'      AND estado = 'aprobada';
UPDATE obras SET vistas = 170 WHERE artista_email = 'juansoriano@gmail.com'       AND estado = 'aprobada';
UPDATE obras SET vistas = 165 WHERE artista_email = 'franciscotoledo@gmail.com'   AND estado = 'aprobada';
UPDATE obras SET vistas = 160 WHERE artista_email = 'manuelalvarezbravo@gmail.com' AND estado = 'aprobada';
UPDATE obras SET vistas = 155 WHERE artista_email = 'gunthergerzso@gmail.com'     AND estado = 'aprobada';

-- 5. Verificar resultado
SELECT u.nombre, COUNT(o.id_obra) AS obras, MAX(o.vistas) AS max_vistas
FROM obras o
JOIN usuarios u ON u.email = o.artista_email
GROUP BY u.nombre
ORDER BY max_vistas DESC;
