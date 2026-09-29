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

const FILES = [
  { file: 'perfil.jfif',                       storageName: 'tamayo_perfil.webp',          titulo: null },
  { file: 'Animales.jfif',                      storageName: 'tamayo_animales.webp',        titulo: 'Animales' },
  { file: 'Sandías.jfif',                       storageName: 'tamayo_sandias.webp',         titulo: 'Sandías' },
  { file: 'Hombre en gris.jfif',               storageName: 'tamayo_hombre_gris.webp',     titulo: 'Hombre en gris' },
  { file: 'Sol y luna.jfif',                   storageName: 'tamayo_sol_luna.webp',         titulo: 'Sol y luna' },
  { file: 'El día y la noche.jfif',            storageName: 'tamayo_dia_noche.webp',        titulo: 'El día y la noche' },
  { file: 'Perros ladrando a la luna.jfif',    storageName: 'tamayo_perros_luna.webp',      titulo: 'Perros ladrando a la luna' },
  { file: 'Mujer en gris.jfif',                storageName: 'tamayo_mujer_gris.webp',       titulo: 'Mujer en gris' },
  { file: 'Dos figuras.jfif',                  storageName: 'tamayo_dos_figuras.webp',      titulo: 'Dos figuras' },
  { file: 'El trovador.jfif',                  storageName: 'tamayo_trovador.webp',         titulo: 'El trovador' },
  { file: 'Naturaleza muerta con frutas.jfif', storageName: 'tamayo_naturaleza_muerta.webp', titulo: 'Naturaleza muerta con frutas' },
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
      sqls.push(`UPDATE usuarios SET avatar_url = '${url}' WHERE email = 'rufinotamayo@gmail.com';`);
    } else {
      sqls.push(`UPDATE obras SET imagen_principal = '${url}'\nWHERE artista_email = 'rufinotamayo@gmail.com' AND titulo = '${titulo}';`);
    }
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
  }
}

console.log('\n══════════ SQL ══════════\n');
console.log(sqls.join('\n\n'));
console.log('\n═════════════════════════\n');
