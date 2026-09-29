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
  { file: 'perfil.jfif',                            storageName: 'soriano_perfil.webp',         titulo: null },
  { file: 'Retrato de Lupe Marín.jfif',             storageName: 'soriano_lupe_marin.webp',     titulo: 'Retrato de Lupe Marín' },
  { file: 'La niña muerta.jfif',                    storageName: 'soriano_nina_muerta.webp',    titulo: 'La niña muerta' },
  { file: 'Niños mirando peces.jfif',               storageName: 'soriano_ninos_peces.webp',    titulo: 'Niños mirando peces' },
  { file: 'Tauros.jfif',                            storageName: 'soriano_tauros.webp',         titulo: 'Tauros' },
  { file: 'Autorretrato.jfif',                      storageName: 'soriano_autorretrato.webp',   titulo: 'Autorretrato' },
  { file: 'images.jfif',                            storageName: 'soriano_los_amantes.webp',    titulo: 'Los amantes' },
  { file: 'Composición azul.jfif',                  storageName: 'soriano_composicion_azul.webp', titulo: 'Composición azul' },
  { file: 'Mujer con pájaro.jfif',                  storageName: 'soriano_mujer_pajaro.webp',   titulo: 'Mujer con pájaro' },
  { file: 'Retrato de María Asunción Izqu.jfif',   storageName: 'soriano_retrato_maria.webp',  titulo: 'Retrato de María Asunción Izquierdo' },
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
      sqls.push(`UPDATE usuarios SET avatar_url = '${url}', banner_url = '${url}' WHERE email = 'juansoriano@gmail.com';`);
    } else {
      sqls.push(`UPDATE obras SET imagen_principal = '${url}'\nWHERE artista_email = 'juansoriano@gmail.com' AND titulo = '${titulo}';`);
    }
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
  }
}

console.log('\n══════════ SQL ══════════\n');
console.log(sqls.join('\n\n'));
console.log('\n═════════════════════════\n');
