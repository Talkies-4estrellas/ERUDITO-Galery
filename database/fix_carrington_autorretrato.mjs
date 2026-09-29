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

const original = readFileSync(path.join(PRUEBAS_DIR, 'Leonora Carrington.jfif'));
const webp = await sharp(original).webp({ quality: 88 }).toBuffer();
const storagePath = 'artistas-seed/carrington_autorretrato_hiena.webp';

const { error } = await supabase.storage.from('perfiles').upload(storagePath, webp, { contentType: 'image/webp', upsert: true });
if (error) { console.error('✗', error.message); process.exit(1); }

const url = `${SUPABASE_URL}/storage/v1/object/public/perfiles/${storagePath}`;
console.log('✓ Subida:', url);

// Avatar original del seed (crocodile photo)
const AVATAR_ORIGINAL = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_How_doth_the_little_crocodile__Leonora_Carrington__18814480958_.jpg';

console.log('\n══════════ SQL ══════════\n');
console.log(`-- Restaurar avatar original
UPDATE usuarios SET avatar_url = '${AVATAR_ORIGINAL}' WHERE email = 'leonoracarrington@gmail.com';

-- Aplicar imagen correcta a Autorretrato con hiena
UPDATE obras SET imagen_principal = '${url}'
WHERE artista_email = 'leonoracarrington@gmail.com' AND titulo = 'Autorretrato con hiena';`);
console.log('\n═════════════════════════\n');
