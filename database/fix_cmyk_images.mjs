// Convierte imágenes problemáticas (CMYK u otro perfil) a JPEG sRGB
// y las re-sube a Supabase Storage para que el optimizador de Next.js las acepte.
// Uso: node database/fix_cmyk_images.mjs

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const SUPABASE_URL = 'https://dtqijxpdavazfovpzjmw.supabase.co';
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0cWlqeHBkYXZhemZvdnB6am13Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTgwODc0MiwiZXhwIjoyMDk3Mzg0NzQyfQ.gy84Yfiy2XFcSI-e0jgGF-bheiw7hW56tacF3OwGwUA';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const BUCKET = 'perfiles';
const FOLDER = 'artistas-seed';

// Archivos que dan 500 en el optimizador de Next.js
const PROBLEMATIC = [
  'Pesquisas_de_la_lente__de_Manuel__lvarez_Bravo__en_el_MAM_01.jpg',
  'Patio_del_Centro_Fotogr_fico_Manuel__lvarez_Bravo.jpg',
];

async function fixImage(filename) {
  const storagePath = `${FOLDER}/${filename}`;
  const publicUrl   = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;

  console.log(`\nDescargando: ${filename}`);
  const res = await fetch(publicUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status} al descargar de Supabase`);
  const original = Buffer.from(await res.arrayBuffer());

  // Obtener metadata para diagnóstico
  const meta = await sharp(original).metadata();
  console.log(`  Formato: ${meta.format}, espacio de color: ${meta.space}, tamaño: ${meta.width}×${meta.height}`);

  // Convertir a sRGB JPEG (sharp maneja CMYK, ICC profiles, etc.)
  const converted = await sharp(original)
    .toColorspace('srgb')
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();

  console.log(`  Convertido: ${original.length} → ${converted.length} bytes`);

  // Re-subir con upsert
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, converted, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (error) throw new Error(`Error al subir: ${error.message}`);
  console.log(`  ✓ Re-subido correctamente`);
}

async function main() {
  for (const filename of PROBLEMATIC) {
    try {
      await fixImage(filename);
    } catch (err) {
      console.error(`  ✗ ${filename}: ${err.message}`);
    }
  }
  console.log('\nListo. Reinicia el servidor Next.js para limpiar el caché del optimizador.\n');
}

main().catch(console.error);
