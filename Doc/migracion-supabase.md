# Migrar de una cuenta de Supabase a otra — ERUDITO Galery

Tiempo estimado: 30-45 minutos.

> El proyecto viejo **no se toca en ningún paso**. Si algo falla, basta con
> apuntar las variables de entorno al viejo y todo sigue funcionando.

---

## PARTE 1 — Sacar los datos del proyecto viejo

### Paso 1. Conseguir la contraseña de la base

1. Entra al proyecto **viejo** en el dashboard de Supabase
2. **Settings** → **Database** → busca **Database password**
3. Si no la recuerdas: **Reset database password** (no afecta la app — ella usa la anon key, no esta contraseña)

### Paso 2. Copiar la cadena de conexión

1. Botón verde **Connect** (barra superior) → **Connection string** → **URI**
2. Cópiala. Tiene esta forma:
   ```
   postgresql://postgres:[PASSWORD]@db.XXXXXX.supabase.co:5432/postgres
   ```
3. Reemplaza `[PASSWORD]` por la contraseña del paso anterior

### Paso 3. Instalar pg_dump (una sola vez)

```powershell
winget install -e --id PostgreSQL.PostgreSQL.17
```

Elige **solo "Command Line Tools"** (desmarca Server, pgAdmin y Stack Builder).
Cierra y vuelve a abrir la terminal después.

### Paso 4. Ejecutar el script de exportación

```powershell
cd "C:\ERUDITO Galery"
.\scripts\exportar-datos.ps1
```

Pide la cadena de conexión. Al terminar verás:

```
LISTO
  Esquema: ...\respaldo\esquema-YYYY-MM-DD.sql
  Datos:   ...\respaldo\datos-YYYY-MM-DD.sql
```

### Paso 5. Verificar que salió bien

```powershell
Get-ChildItem respaldo\
```

Ambos archivos deben pesar más de 0 KB.

---

## PARTE 2 — Crear la estructura en el proyecto nuevo

### Paso 6. Ejecutar el schema

1. Entra al proyecto **nuevo** → **SQL Editor** → **New query**
2. Abre `database/schema.sql`, copia todo el contenido
3. Pégalo y presiona **Run**

Resultado esperado: `Success. No rows returned`

### Paso 7. Verificar las tablas

Ve a **Table Editor**. Las tablas principales que deben aparecer:

`artistas`, `obras`, `usuarios`, `perfiles`, `solicitudes`, `eventos`,
`resenas`, `ventas`, `suscriptores`, `contactos`, `registros_eventos`,
`productos_cocina`

---

## PARTE 3 — Cargar los datos

### Paso 8. Limpiar filas del seed que genera el schema

Antes de cargar los datos, limpia las tablas que `schema.sql` deja
pre-sembradas (si las hay). Si el schema no inserta filas iniciales,
este paso no aplica. Si al cargar los datos aparece error de
`duplicate key value`, ejecuta primero:

```sql
-- Solo si el schema sembró artistas o filas de configuración:
TRUNCATE TABLE artistas RESTART IDENTITY CASCADE;
```

### Paso 9. Cargar los datos

1. **SQL Editor** → **New query**
2. Abre `respaldo/datos-YYYY-MM-DD.sql` en un editor de texto, copia todo
3. Pégalo en el SQL Editor y presiona **Run**

> El archivo empieza con `SET session_replication_role = replica;`.
> Esa línea desactiva los triggers durante la carga. No la elimines.

> Si el Run falla, Postgres revierte todo — nada queda a medio cargar.
> Corrige el error y repite.

**Si el archivo es muy grande y el editor se traba:** pégalo por partes
respetando el orden de dependencias: `artistas` → `usuarios` → `perfiles`
→ `obras` → `eventos` → `resenas` → `ventas` → resto.

### Paso 10. Verificar los datos

```sql
select 'artistas'   t, count(*) from artistas
union all select 'obras',    count(*) from obras    where estado = 'aprobada'
union all select 'usuarios', count(*) from usuarios
union all select 'eventos',  count(*) from eventos
union all select 'productos_cocina', count(*) from productos_cocina;
```

Los números deben coincidir con los del proyecto viejo.

---

## PARTE 4 — Usuarios de autenticación

Los registros de `auth.users` **no van en el dump** de `public`.
El dump sí los contiene vía el schema de `auth`, pero Supabase los bloquea
por seguridad.

### Paso 11. Re-ejecutar el seed de usuarios de prueba

1. **SQL Editor** → **New query**
2. Abre `database/seeds_test.sql`, copia todo y pega
3. **Run**

Esto recrea las cuentas de prueba (`fridakahlo@gmail.com`, `admin@test.com`, etc.)
en `auth.users` con la misma contraseña (`Test1234`).

> El seed usa `ON CONFLICT DO NOTHING` — es seguro re-ejecutarlo varias veces.

### Paso 12. Verificar el login de admin

- Navega a `/login` → entra con `admin@test.com` / `Test1234`
- Debe redirigir a `/perfil` y el panel `/admin` debe funcionar

---

## PARTE 5 — Imágenes de los buckets

⚠️ Las imágenes **no van en ningún dump SQL**. Sin este paso los productos
y perfiles aparecerán sin foto.

### Paso 13. Crear los buckets en el proyecto nuevo

`database/schema.sql` ya los crea. Verifica en **Storage** que existen:

- `obras` — público
- `perfiles` — público

Si no existen, créalos manualmente en **Storage** → **New bucket** (marcar Public).

### Paso 14. Copiar los archivos

```powershell
cd "C:\ERUDITO Galery"
node scripts/copiar-imagenes.mjs
```

Pide 4 datos:
1. URL del proyecto **viejo** (ej. `https://dtqijxpdavazfovpzjmw.supabase.co`)
2. `service_role` key del proyecto **viejo** — Settings → API → service_role
3. URL del proyecto **nuevo**
4. `service_role` key del proyecto **nuevo**

El script copia ambos buckets (`obras` y `perfiles`) manteniendo las rutas.
Al final imprime cuántos se copiaron y cuáles fallaron.

---

## PARTE 6 — Apuntar la app al proyecto nuevo

### Paso 15. Sacar las llaves del proyecto nuevo

**Settings** → **API**:
- **Project URL** — `https://XXXXXX.supabase.co` (sin `/rest/v1/`)
- **anon public** — llave pública
- **service_role** — llave secreta

### Paso 16. Actualizar `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://XXXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Prueba en local:

```powershell
npm run dev
```

Verifica: home carga obras, `/artistas` muestra artistas, `/login` funciona.

### Paso 17. Actualizar Vercel

1. Vercel → proyecto → **Settings** → **Environment Variables**
2. Editar las tres variables (marcar *Production* y *Preview*)
3. El valor va **sin comillas y sin el `NOMBRE=`**
4. **Deployments** → último deploy → **⋯** → **Redeploy**

> Las variables `NEXT_PUBLIC_*` se incrustan al hacer el build.
> Guardarlas sin redesplegar no cambia nada.

---

## Checklist final

- [ ] Tablas creadas en proyecto nuevo
- [ ] Conteos de datos coinciden con el viejo
- [ ] Seeds ejecutados (`auth.users` con cuentas de prueba)
- [ ] Login `admin@test.com` / `Test1234` funciona
- [ ] Buckets `obras` y `perfiles` existen y son públicos
- [ ] Imágenes copiadas (`copiar-imagenes.mjs`)
- [ ] `.env.local` actualizado y probado en local
- [ ] Vercel: variables actualizadas **y redesplegado**
- [ ] Home carga el carousel y la sección de eventos
- [ ] `/catalogo/fisicos` muestra obras con imágenes
- [ ] `/artistas` muestra artistas

---

## Si algo sale mal

| Síntoma | Causa probable |
|---|---|
| "duplicate key" al cargar datos | El schema sembró filas; truncar esa tabla primero |
| Obras sin imagen | Falta copiar buckets (Parte 5) |
| Login falla con 500 | `auth.users` no recreada; re-ejecutar `seeds_test.sql` |
| Login falla con "credenciales incorrectas" | El seed corrió pero con otra contraseña; recrear usuario desde Supabase Auth dashboard |
| `Invalid supabaseUrl` en el build | El valor incluye comillas o el `NOMBRE=` |
| La app sigue apuntando al viejo | Falta redesplegar en Vercel |
| Realtime no funciona | Habilitar tablas en Supabase Dashboard → Database → Publications → `supabase_realtime` |

---

*Generado: 20-10-2026 — basado en el proceso de Order Express (`C:\nube\Doc\migracion-supabase.md`)*
