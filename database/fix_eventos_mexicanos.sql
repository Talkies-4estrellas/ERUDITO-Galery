-- ============================================================
--  ERUDITO Galery — Actualizar eventos con obras de maestros mexicanos
--  Ejecutar en Supabase SQL Editor DESPUÉS de eliminar catalog artistas
-- ============================================================

-- Evento 1 — Subasta: Muralismo Mexicano (Siqueiros, Orozco, Tamayo)
UPDATE eventos SET
  titulo       = 'Grandes Maestros del Muralismo: Siqueiros, Orozco y Tamayo',
  tipo         = 'Subasta',
  modalidad    = 'En línea',
  fecha        = '2026-07-28',
  fecha_corta  = '{"dia":"28","mes":"Jul"}',
  lugar        = 'Subasta en línea — ERUDITO Galery',
  imagen       = (SELECT imagen_principal FROM obras
                  WHERE artista_email = 'davidsiqueiros@gmail.com'
                    AND estado = 'aprobada' LIMIT 1),
  descripcion  = 'Lotes de alto valor del muralismo mexicano: David Alfaro Siqueiros, José Clemente Orozco y Rufino Tamayo. Tres voces que redefinieron el arte del siglo XX en México. Obras con certificación y tasación incluida.',
  href         = '/eventos/1',
  fichas_ids   = (
    SELECT json_agg(id_obra ORDER BY id_obra)
    FROM (
      SELECT id_obra FROM obras
      WHERE artista_email IN ('davidsiqueiros@gmail.com','joseorozco@gmail.com','rufinotamayo@gmail.com')
        AND estado = 'aprobada'
      ORDER BY vistas DESC LIMIT 3
    ) t
  )
WHERE id_evento = 1;

-- Evento 2 — Exposición: Surrealismo Mexicano (Carrington + Remedios Varo)
UPDATE eventos SET
  titulo       = 'Surrealismo en México: Carrington y Remedios Varo',
  tipo         = 'Exposición',
  modalidad    = 'Presencial',
  fecha        = '2026-08-12',
  fecha_corta  = '{"dia":"12","mes":"Ago"}',
  lugar        = 'Galería ERUDITO — Ciudad de México',
  imagen       = (SELECT imagen_principal FROM obras
                  WHERE artista_email = 'leonoracarrington@gmail.com'
                    AND estado = 'aprobada' LIMIT 1),
  descripcion  = 'Muestra del surrealismo femenino más radical de México: Leonora Carrington y Remedios Varo. Mundos oníricos, alquimia visual y una iconografía que sigue siendo inimitable. Exposición presencial con piezas de edición limitada.',
  href         = '/eventos/2',
  fichas_ids   = (
    SELECT json_agg(id_obra ORDER BY id_obra)
    FROM (
      SELECT id_obra FROM obras
      WHERE artista_email IN ('leonoracarrington@gmail.com','remediosvaro@gmail.com')
        AND estado = 'aprobada'
      ORDER BY vistas DESC LIMIT 3
    ) t
  )
WHERE id_evento = 2;

-- Evento 3 — Subasta: Colección Frida Kahlo
UPDATE eventos SET
  titulo       = 'Colección Frida Kahlo — Subasta Exclusiva',
  tipo         = 'Subasta',
  modalidad    = 'Presencial',
  fecha        = '2026-08-22',
  fecha_corta  = '{"dia":"22","mes":"Ago"}',
  lugar        = 'Casa de Subastas ERUDITO — Ciudad de México',
  imagen       = (SELECT imagen_principal FROM obras
                  WHERE artista_email = 'fridakahlo@gmail.com'
                    AND estado = 'aprobada' LIMIT 1),
  descripcion  = 'Subasta de obras icónicas de Frida Kahlo: Las dos Fridas, La columna rota, El venado herido y más. La artista mexicana más reconocida a nivel mundial en una colección de edición limitada certificada por ERUDITO Galery.',
  href         = '/eventos/3',
  fichas_ids   = (
    SELECT json_agg(id_obra ORDER BY id_obra)
    FROM (
      SELECT id_obra FROM obras
      WHERE artista_email = 'fridakahlo@gmail.com'
        AND estado = 'aprobada'
      ORDER BY vistas DESC LIMIT 3
    ) t
  )
WHERE id_evento = 3;

-- Evento 4 — Exposición: Arte Mexicano Contemporáneo
UPDATE eventos SET
  titulo       = 'Arte Mexicano del Siglo XX: Una Visión Completa',
  tipo         = 'Exposición',
  modalidad    = 'En línea',
  fecha        = '2026-07-20',
  fecha_corta  = '{"dia":"20","mes":"Jul"}',
  lugar        = 'Exposición digital — ERUDITO Galery',
  imagen       = (SELECT imagen_principal FROM obras
                  WHERE artista_email = 'gunthergerzso@gmail.com'
                    AND estado = 'aprobada' LIMIT 1),
  descripcion  = 'Recorrido por lo más destacado del arte mexicano del siglo XX: Gunther Gerzso, Juan Soriano, Francisco Toledo y Manuel Álvarez Bravo. Pintura abstracta, cerámica, grabado y fotografía que definen la identidad visual de México.',
  href         = '/eventos/4',
  fichas_ids   = (
    SELECT json_agg(id_obra ORDER BY id_obra)
    FROM (
      SELECT id_obra FROM obras
      WHERE artista_email IN ('gunthergerzso@gmail.com','juansoriano@gmail.com','franciscotoledo@gmail.com','manuelalvarezbravo@gmail.com')
        AND estado = 'aprobada'
      ORDER BY vistas DESC LIMIT 3
    ) t
  )
WHERE id_evento = 4;

-- Verificar resultado
SELECT id_evento, titulo, fecha, fichas_ids FROM eventos ORDER BY id_evento;
