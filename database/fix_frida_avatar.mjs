// Sube la foto real de Frida Kahlo (por Guillermo Kahlo) a Supabase
// y genera el SQL para actualizar su avatar_url.
// Uso: node database/fix_frida_avatar.mjs

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dtqijxpdavazfovpzjmw.supabase.co';
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0cWlqeHBkYXZhemZvdnB6am13Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTgwODc0MiwiZXhwIjoyMDk3Mzg0NzQyfQ.gy84Yfiy2XFcSI-e0jgGF-bheiw7hW56tacF3OwGwUA';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const WIKIMEDIA_URL = 'https://upload.wikimedia.org/wikipedia/commons/0/09/Frida_Kahlo%2C_by_Guillermo_Kahlo_%28cropped%29.jpg';
const FILENAME      = 'Frida_Kahlo__by_Guillermo_Kahlo__cropped_.jpg';
const STORAGE_PATH  = `artistas-seed/${FILENAME}`;

async function main() {
  console.log('Descargando foto de Frida Kahlo...');
  const res = await fetch(WIKIMEDIA_URL, {
    headers: {
      'User-Agent': 'ERUDITOGalery/1.0 (educational art gallery; firestarshyni@gmail.com)',
      'Accept': 'image/*, */*',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = new Uint8Array(await res.arrayBuffer());
  console.log(`  ${data.length} bytes descargados`);

  const { error } = await supabase.storage
    .from('perfiles')
    .upload(STORAGE_PATH, data, { contentType: 'image/jpeg', upsert: true });
  if (error) throw new Error(error.message);

  const newUrl = `${SUPABASE_URL}/storage/v1/object/public/perfiles/${STORAGE_PATH}`;
  console.log(`  ✓ Subida: ${newUrl}`);
  console.log('\nSQL para actualizar el avatar de Frida:');
  console.log(`
UPDATE usuarios
SET avatar_url = '${newUrl}'
WHERE email = 'fridakahlo@gmail.com';
`);
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
