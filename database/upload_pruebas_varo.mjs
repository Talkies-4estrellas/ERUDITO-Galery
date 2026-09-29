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
  { file: 'perfil.jfif',                           storageName: 'varo_perfil.webp',            titulo: null },
  { file: 'Bordando el manto terrestre.jfif',       storageName: 'varo_bordando.webp',          titulo: 'Bordando el manto terrestre' },
  { file: 'Naturaleza muerta resucitando.jfif',     storageName: 'varo_naturaleza_muerta.webp', titulo: 'Naturaleza muerta resucitando' },
  { file: 'Exploración de las fuentes del.jfif',   storageName: 'varo_exploracion_orinoco.webp', titulo: 'Exploración de las fuentes del río Orinoco' },
  { file: 'Creación de las aves.jfif',             storageName: 'varo_creacion_aves.webp',     titulo: 'Creación de las aves' },
  { file: 'Aún.jfif',                              storageName: 'varo_aun.webp',               titulo: 'Aún' },
  { file: 'La llamada.jfif',                        storageName: 'varo_llamada.webp',           titulo: 'La llamada' },
  { file: 'Tránsito en espiral.jfif',              storageName: 'varo_transito.webp',          titulo: 'Tránsito en espiral' },
  { file: 'El flautista.jfif',                      storageName: 'varo_flautista.webp',         titulo: 'El flautista' },
  { file: 'Encuentro.jfif',                         storageName: 'varo_encuentro.webp',         titulo: 'Encuentro' },
  { file: 'Viaje hacia el origen.jfif',             storageName: 'varo_viaje_origen.webp',      titulo: 'Viaje hacia el origen' },
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
      sqls.push(`UPDATE usuarios SET avatar_url = '${url}' WHERE email = 'remediosvaro@gmail.com';`);
    } else {
      sqls.push(`UPDATE obras SET imagen_principal = '${url}'\nWHERE artista_email = 'remediosvaro@gmail.com' AND titulo = '${titulo}';`);
    }
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
  }
}

console.log('\n══════════ SQL ══════════\n');
console.log(sqls.join('\n\n'));
console.log('\n═════════════════════════\n');
