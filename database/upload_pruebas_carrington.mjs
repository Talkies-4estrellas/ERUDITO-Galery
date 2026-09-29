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
  { file: 'Leonora Carrington.jfif',          storageName: 'carrington_perfil.webp',          titulo: null },
  { file: 'La anciana gigante.jfif',           storageName: 'carrington_anciana_gigante.webp', titulo: 'La anciana gigante' },
  { file: 'Ab Eo Quod.jfif',                  storageName: 'carrington_ab_eo_quod.webp',      titulo: 'Ab Eo Quod' },
  { file: 'La tentación de San Antonio.jfif',  storageName: 'carrington_tentacion.webp',       titulo: 'La tentación de San Antonio' },
  { file: 'El convite de Canción.jfif',        storageName: 'carrington_convite.webp',         titulo: 'El convite de Canción' },
  { file: 'La realeza del gato.jfif',          storageName: 'carrington_realeza_gato.webp',    titulo: 'La realeza del gato' },
  { file: 'El jardín del paganismo.jfif',      storageName: 'carrington_jardin.webp',          titulo: 'El jardín del paganismo' },
  { file: 'Crookhey Hall.jfif',               storageName: 'carrington_crookhey.webp',        titulo: 'Crookhey Hall' },
  { file: 'Mago rojo.jfif',                   storageName: 'carrington_mago_rojo.webp',       titulo: 'Mago rojo' },
  { file: 'El mundo mágico de los mayas.jfif', storageName: 'carrington_mundo_magico.webp',    titulo: 'El mundo mágico de los mayas (estudio)' },
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
      sqls.push(`UPDATE usuarios SET avatar_url = '${url}' WHERE email = 'leonoracarrington@gmail.com';`);
    } else {
      sqls.push(`UPDATE obras SET imagen_principal = '${url}'\nWHERE artista_email = 'leonoracarrington@gmail.com' AND titulo = '${titulo}';`);
    }
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
  }
}

console.log('\n══════════ SQL ══════════\n');
console.log(sqls.join('\n\n'));
console.log('\n═════════════════════════\n');
