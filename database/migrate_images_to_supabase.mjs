// Descarga imágenes de Wikimedia y las sube a Supabase Storage.
// Genera database/seed_obras_mexicanos_supabase.sql con URLs actualizadas.
// Uso: node database/migrate_images_to_supabase.mjs

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';

const SUPABASE_URL = 'https://dtqijxpdavazfovpzjmw.supabase.co';
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0cWlqeHBkYXZhemZvdnB6am13Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTgwODc0MiwiZXhwIjoyMDk3Mzg0NzQyfQ.gy84Yfiy2XFcSI-e0jgGF-bheiw7hW56tacF3OwGwUA';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const BUCKET = 'perfiles';
const FOLDER = 'artistas-seed';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function getContentType(url) {
  const u = url.toLowerCase();
  if (u.endsWith('.png'))  return 'image/png';
  if (u.endsWith('.webp')) return 'image/webp';
  if (u.endsWith('.gif'))  return 'image/gif';
  return 'image/jpeg';
}

function sanitizeFilename(url) {
  const decoded = decodeURIComponent(url);
  const base    = decoded.split('/').pop();
  // Reemplaza todo lo que no sea alfanumérico, punto o guión
  return base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
}

async function downloadImage(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'ERUDITOGalery/1.0 (educational art gallery; firestarshyni@gmail.com)',
      'Accept':     'image/*, */*',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
}

async function uploadToStorage(data, filename, contentType) {
  const storagePath = `${FOLDER}/${filename}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, data, { contentType, upsert: true });
  if (error) throw new Error(error.message);
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return publicUrl;
}

async function main() {
  const sqlPath    = decodeURIComponent(new URL('./seed_obras_mexicanos.sql', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
  const outputPath = decodeURIComponent(new URL('./seed_obras_mexicanos_supabase.sql', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));

  const sql = readFileSync(sqlPath, 'utf-8');

  // Extrae todas las URLs de Wikimedia únicas
  const urlRegex  = /https:\/\/upload\.wikimedia\.org\/[^\s'")\]]+/g;
  const allUrls   = [...new Set((sql.match(urlRegex) ?? []))];

  console.log(`\nURLs únicas de Wikimedia encontradas: ${allUrls.length}\n`);

  const urlMap = {};
  let ok = 0;
  let fail = 0;

  for (const url of allUrls) {
    const filename    = sanitizeFilename(url);
    const contentType = getContentType(url);

    process.stdout.write(`[${ok + fail + 1}/${allUrls.length}] ${filename.slice(0, 60)}... `);

    try {
      const data   = await downloadImage(url);
      const newUrl = await uploadToStorage(data, filename, contentType);
      urlMap[url]  = newUrl;
      ok++;
      console.log('✓');
    } catch (err) {
      urlMap[url] = url; // mantiene la URL original si falla
      fail++;
      console.log(`✗ (${err.message})`);
    }

    await sleep(600); // pausa entre peticiones a Wikimedia
  }

  // Reemplaza las URLs en el SQL
  let newSql = sql;
  for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
    if (oldUrl !== newUrl) {
      newSql = newSql.split(oldUrl).join(newUrl);
    }
  }

  writeFileSync(outputPath, newSql, 'utf-8');

  console.log(`\n─────────────────────────────────────────`);
  console.log(`Subidas exitosas : ${ok}`);
  console.log(`Fallidas         : ${fail}`);
  console.log(`SQL generado     : database/seed_obras_mexicanos_supabase.sql`);
  console.log(`─────────────────────────────────────────`);
  console.log('\nPróximo paso: ejecuta el nuevo SQL en Supabase SQL Editor.\n');
}

main().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
