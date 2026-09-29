-- Elimina obras duplicadas de los 10 artistas mexicanos
-- que aún tienen URLs de Wikimedia o picsum (quedando solo las de Supabase).
-- Ejecutar en: Supabase SQL Editor

DELETE FROM obras
WHERE artista_email IN (
  'fridakahlo@gmail.com',
  'joseorozco@gmail.com',
  'davidsiqueiros@gmail.com',
  'rufinotamayo@gmail.com',
  'leonoracarrington@gmail.com',
  'remediosvaro@gmail.com',
  'juansoriano@gmail.com',
  'franciscotoledo@gmail.com',
  'manuelalvarezbravo@gmail.com',
  'gunthergerzso@gmail.com'
)
AND (
  imagen_principal LIKE 'https://upload.wikimedia.org%'
  OR imagen_principal LIKE 'https://picsum.photos%'
);
