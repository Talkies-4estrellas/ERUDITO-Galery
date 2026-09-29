import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { readFileSync } from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://dtqijxpdavazfovpzjmw.supabase.co';
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0cWlqeHBkYXZhemZvdnB6am13Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTgwODc0MiwiZXhwIjoyMDk3Mzg0NzQyfQ.gy84Yfiy2XFcSI-e0jgGF-bheiw7hW56tacF3OwGwUA';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const PRUEBAS_DIR = decodeURIComponent(
  new URL('../Pruebas/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
);

// file: nombre en disco | storageName: nombre seguro para Supabase | titulo: exacto en DB
const FILES = [
  { file: 'perfil.jfif',                          storageName: 'siqueiros_perfil.webp',                  titulo: null },
  { file: 'Echo of a Scream.jfif',                storageName: 'siqueiros_echo_of_a_scream.webp',        titulo: 'Echo of a Scream' },
  { file: 'Madre proletaria.jfif',                storageName: 'siqueiros_madre_proletaria.webp',        titulo: 'Madre proletaria' },
  { file: 'Cuauhtémoc contra el mito.jfif',       storageName: 'siqueiros_cuauhtemoc.webp',              titulo: 'Cuauhtémoc contra el mito' },
  { file: 'Nuestra imagen actual.jfif',           storageName: 'siqueiros_nuestra_imagen.webp',          titulo: 'Nuestra imagen actual' },
  { file: 'Víctimas de la guerra.jfif',           storageName: 'siqueiros_victimas.webp',                titulo: 'Víctimas de la guerra' },
  { file: 'La marcha de la humanidad.jfif',       storageName: 'siqueiros_marcha_humanidad.webp',        titulo: 'La marcha de la humanidad (estudio)' },
  { file: 'El entierro del obrero sacrific.jfif', storageName: 'siqueiros_entierro_obrero.webp',         titulo: 'El entierro del obrero sacrificado' },
  { file: 'Cabeza de mujer indígena.jfif',        storageName: 'siqueiros_cabeza_mujer.webp',            titulo: 'Cabeza de mujer indígena' },
  { file: 'Autorretrato El Coronelazo.jfif',      storageName: 'siqueiros_autorretrato_coronelazo.webp', titulo: 'Autorretrato "El Coronelazo"' },
  { file: 'Nueva democracia.jfif',                storageName: 'siqueiros_nueva_democracia.webp',        titulo: 'Nueva democracia' },
];

const sqls = [];

for (const { file, storageName, titulo } of FILES) {
  try {
    const original = readFileSync(path.join(PRUEBAS_DIR, file));
    const webp = await sharp(original).webp({ quality: 88 }).toBuffer();
    const storagePath = `artistas-seed/${storageName}`;
    const { error } = await supabase.storage.from('perfiles').upload(storagePath, webp, { contentType: 'image/webp', upsert: true });
    if (error) throw new Error(error.message);
    const url = `${SUPABASE_URL}/storage/v1/object/public/perfiles/${storagePath}`;
    console.log(`✓ ${titulo ?? 'perfil'}`);

    if (titulo === null) {
      sqls.push(`UPDATE usuarios SET avatar_url = '${url}' WHERE email = 'davidsiqueiros@gmail.com';`);
    } else {
      sqls.push(`UPDATE obras SET imagen_principal = '${url}'\nWHERE artista_email = 'davidsiqueiros@gmail.com' AND titulo = '${titulo}';`);
    }
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
  }
}

console.log('\n══════════ SQL ══════════\n');
console.log(sqls.join('\n\n'));
console.log('\n═════════════════════════\n');
