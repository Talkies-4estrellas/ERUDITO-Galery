// Convierte las imágenes de la carpeta Pruebas a .webp y las sube a Supabase.
// Genera SQL UPDATE para cada obra de Frida Kahlo.
// Uso: node database/upload_pruebas_frida.mjs

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { readFileSync } from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://dtqijxpdavazfovpzjmw.supabase.co';
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0cWlqeHBkYXZhemZvdnB6am13Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTgwODc0MiwiZXhwIjoyMDk3Mzg0NzQyfQ.gy84Yfiy2XFcSI-e0jgGF-bheiw7hW56tacF3OwGwUA';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

// Mapeo: nombre de archivo (sin extensión) → título exacto en DB
const FILES = [
  { file: 'Autorretrato con mono.jfif',          titulo: 'Autorretrato con mono' },
  { file: 'Autorretrato con pelo cortado.jfif',   titulo: 'Autorretrato con pelo cortado' },
  { file: 'Diego y yo.jfif',                      titulo: 'Diego y yo' },
  { file: 'El sueño (La cama).webp',              titulo: 'El sueño (La cama)' },
  { file: 'El venado herido.jfif',                titulo: 'El venado herido' },
  { file: 'La columna rota.jfif',                 titulo: 'La columna rota' },
  { file: 'Lo que el agua me dio.jfif',           titulo: 'Lo que el agua me dio' },
  { file: 'Sin esperanza.jpg',                    titulo: 'Sin esperanza' },
];

const PRUEBAS_DIR = decodeURIComponent(
  new URL('../Pruebas/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
);

const sqls = [];

async function processFile({ file, titulo }) {
  const filePath = path.join(PRUEBAS_DIR, file);
  const baseName = path.basename(file, path.extname(file));
  const storageName = `${baseName}.webp`;
  const storagePath = `artistas-seed/${storageName}`;

  console.log(`\n[${titulo}]`);
  console.log(`  Convirtiendo ${file} → ${storageName}...`);

  const original = readFileSync(filePath);
  const webp = await sharp(original)
    .webp({ quality: 88 })
    .toBuffer();

  console.log(`  ${original.length} → ${webp.length} bytes`);

  const { error } = await supabase.storage
    .from('perfiles')
    .upload(storagePath, webp, { contentType: 'image/webp', upsert: true });

  if (error) throw new Error(`Error al subir: ${error.message}`);

  const newUrl = `${SUPABASE_URL}/storage/v1/object/public/perfiles/${storagePath}`;
  console.log(`  ✓ ${newUrl}`);

  sqls.push(
    `UPDATE obras SET imagen_principal = '${newUrl}'\n` +
    `WHERE artista_email = 'fridakahlo@gmail.com' AND titulo = '${titulo}';`
  );
}

async function main() {
  for (const entry of FILES) {
    try {
      await processFile(entry);
    } catch (err) {
      console.error(`  ✗ ${entry.file}: ${err.message}`);
    }
  }

  console.log('\n\n══════════ SQL para ejecutar en Supabase ══════════\n');
  console.log(sqls.join('\n\n'));
  console.log('\n═══════════════════════════════════════════════════\n');
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
