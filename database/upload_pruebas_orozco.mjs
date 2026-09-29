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
  { file: 'El hombre de fuego.jfif',      titulo: 'El hombre de fuego' },
  { file: 'El retablo de Guadalupe.jfif',  titulo: 'El retablo de Guadalupe' },
  { file: 'Franciscano y el indio.jfif',   titulo: 'Franciscano y el indio' },
  { file: 'Katharsis.jfif',                titulo: 'Katharsis' },
  { file: 'La mesa de la hermandad.jfif',  titulo: 'La mesa de la hermandad' },
  { file: 'La trinchera.jfif',             titulo: 'La trinchera' },
  { file: 'Los muertos.jfif',              titulo: 'Los muertos' },
  { file: 'Prometeo.jfif',                 titulo: 'Prometeo' },
  { file: 'Zapatistas.jfif',               titulo: 'Zapatistas' },
];

const sqls = [];

for (const { file, titulo } of FILES) {
  try {
    const original = readFileSync(path.join(PRUEBAS_DIR, file));
    const webp = await sharp(original).webp({ quality: 88 }).toBuffer();
    const storageName = file.replace(/\.[^.]+$/, '.webp');
    const storagePath = `artistas-seed/${storageName}`;
    const { error } = await supabase.storage.from('perfiles').upload(storagePath, webp, { contentType: 'image/webp', upsert: true });
    if (error) throw new Error(error.message);
    const url = `${SUPABASE_URL}/storage/v1/object/public/perfiles/${storagePath}`;
    console.log(`✓ ${titulo}`);
    sqls.push(`UPDATE obras SET imagen_principal = '${url}'\nWHERE artista_email = 'joseorozco@gmail.com' AND titulo = '${titulo}';`);
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
  }
}

console.log('\n══════════ SQL ══════════\n');
console.log(sqls.join('\n\n'));
console.log('\n═════════════════════════\n');
