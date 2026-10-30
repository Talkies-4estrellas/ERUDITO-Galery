-- Ejecutar en el SQL Editor de Supabase (rol postgres).
-- Las cuentas creadas por SQL (seeds_test.sql, seed_productores_mexicanos.sql) dejaban en NULL
-- columnas de texto que Supabase Auth espera como '' y la API respondía
-- "Database error loading user / finding users".

UPDATE auth.users SET
  confirmation_token         = COALESCE(confirmation_token, ''),
  recovery_token             = COALESCE(recovery_token, ''),
  email_change               = COALESCE(email_change, ''),
  email_change_token_new     = COALESCE(email_change_token_new, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  phone_change               = COALESCE(phone_change, ''),
  phone_change_token         = COALESCE(phone_change_token, ''),
  reauthentication_token     = COALESCE(reauthentication_token, '')
WHERE confirmation_token IS NULL
   OR recovery_token IS NULL
   OR email_change IS NULL
   OR email_change_token_new IS NULL
   OR email_change_token_current IS NULL
   OR phone_change IS NULL
   OR phone_change_token IS NULL
   OR reauthentication_token IS NULL;

-- Verificación: debe dar 0.
SELECT count(*) AS cuentas_con_null FROM auth.users
WHERE email_change IS NULL OR email_change_token_current IS NULL OR phone_change IS NULL
   OR phone_change_token IS NULL OR reauthentication_token IS NULL;
