// Descarga la imagen correcta de "Cuauhtémoc contra el mito" de Wikimedia
// y la sube a Supabase Storage para reemplazar la imagen duplicada del avatar.
// Uso: node database/fix_duplicate_image_siqueiros.mjs

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dtqijxpdavazfovpzjmw.supabase.co';
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0cWlqeHBkYXZhemZvdnB6am13Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTgwODc0MiwiZXhwIjoyMDk3Mzg0NzQyfQ.gy84Yfiy2XFcSI-e0jgGF-bheiw7hW56tacF3OwGwUA';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const WIKIMEDIA_URL = 'https://upload.wikimedia.org/wikipedia/commons/9/94/Mural_David_Alfaro_Siqueiros_en_el_Tecpan_Tlatelolco.jpg';
const FILENAME      = 'Mural_David_Alfaro_Siqueiros_en_el_Tecpan_Tlatelolco.jpg';
const STORAGE_PATH  = `artistas-seed/${FILENAME}`;

async function main() {
  console.log('Descargando imagen de Wikimedia...');
  const res = await fetch(WIKIMEDIA_URL, {
    headers: {
      'User-Agent': 'ERUDITOGalery/1.0 (educational art gallery; firestarshyni@gmail.com)',
      'Accept': 'image/*, */*',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} al descargar`);
  const data = new Uint8Array(await res.arrayBuffer());
  console.log(`  Descargada: ${data.length} bytes`);

  console.log('Subiendo a Supabase Storage...');
  const { error } = await supabase.storage
    .from('perfiles')
    .upload(STORAGE_PATH, data, { contentType: 'image/jpeg', upsert: true });
  if (error) throw new Error(`Error al subir: ${error.message}`);

  const newUrl = `${SUPABASE_URL}/storage/v1/object/public/perfiles/${STORAGE_PATH}`;
  console.log(`  ✓ Subida correctamente`);
  console.log(`\nNueva URL: ${newUrl}`);
  console.log('\nEjecuta este SQL en Supabase para corregir la obra:');
  console.log(`
UPDATE obras
SET imagen_principal = '${newUrl}'
WHERE artista_email = 'davidsiqueiros@gmail.com'
  AND titulo = 'Cuauhtémoc contra el mito';
`);
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
