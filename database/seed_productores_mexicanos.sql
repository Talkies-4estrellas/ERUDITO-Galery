-- ============================================================
--  ERUDITO Galery — Productores mexicanos de cocina (10)
--  Cuentas de prueba: <slug>@test.com / Test1234
--  Ejecutar en el SQL Editor de Supabase (rol postgres).
--  Idempotente. Sus productos (ids 18–27) ya están en productos_cocina
--  enlazados por productor_email.
-- ============================================================

do $$
begin

  insert into auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current, phone_change, phone_change_token, reauthentication_token
  )
  select v.id, '00000000-0000-0000-0000-000000000000', v.email, crypt('Test1234', gen_salt('bf')),
         now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
         false, 'authenticated', 'authenticated', now(), now(), '', '', '',
         '', '', '', '', ''
  from (values
    ('55555555-0000-0000-0000-000000000018'::uuid, 'santa-beatriz@test.com'),
    ('55555555-0000-0000-0000-000000000019'::uuid, 'mole-xiqueno@test.com'),
    ('55555555-0000-0000-0000-000000000020'::uuid, 'oaxacanita@test.com'),
    ('55555555-0000-0000-0000-000000000021'::uuid, 'kixocolatl@test.com'),
    ('55555555-0000-0000-0000-000000000022'::uuid, 'cuyusal@test.com'),
    ('55555555-0000-0000-0000-000000000023'::uuid, 'finca-irlanda@test.com'),
    ('55555555-0000-0000-0000-000000000024'::uuid, 'real-minero@test.com'),
    ('55555555-0000-0000-0000-000000000025'::uuid, 'tamoa@test.com'),
    ('55555555-0000-0000-0000-000000000026'::uuid, 'yaxool@test.com'),
    ('55555555-0000-0000-0000-000000000027'::uuid, 'queso-cotija@test.com')
  ) as v(id, email)
  on conflict do nothing;

  insert into auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at, last_sign_in_at)
  select gen_random_uuid(), u.id, u.email, jsonb_build_object('sub', u.id::text, 'email', u.email), 'email', now(), now(), now()
  from auth.users u
  where u.id between '55555555-0000-0000-0000-000000000018' and '55555555-0000-0000-0000-000000000027'
  on conflict (provider, provider_id) do nothing;

  insert into public.perfiles (id, rol, nombre, bio, especialidad, pais, slug, avatar_url, banner_url)
  select v.id, 'productor', v.nombre, v.bio, v.especialidad, 'México', v.slug, '', ''
  from (values
    ('55555555-0000-0000-0000-000000000018'::uuid, 'Rancho y Beneficio Santa Beatriz', 'Negocio familiar de Papantla, Veracruz, con 40 años cultivando y beneficiando vainilla: vainas, extracto, pasta, polvo y semilla.', 'Vainilla de Papantla', 'rancho-y-beneficio-santa-beatriz'),
    ('55555555-0000-0000-0000-000000000019'::uuid, 'Mole Xiqueño', 'Empresa de la familia Galván Suárez en Xico, Veracruz; nació de los pedidos de mole de las fiestas patronales con la receta de Carolina Suárez.', 'Mole de Xico', 'mole-xiqueno'),
    ('55555555-0000-0000-0000-000000000020'::uuid, 'Oaxacanita Chocolate', 'Empresa social de la Mixteca oaxaqueña que trabaja con 30 familias para rescatar el cacao y el chocolate tradicional.', 'Chocolate tradicional', 'oaxacanita-chocolate'),
    ('55555555-0000-0000-0000-000000000021'::uuid, 'Ki''Xocolatl', 'Casa chocolatera de Mérida, Yucatán, dedicada al cacao criollo maya y a replantar cacao en la selva del sureste.', 'Chocolatería', 'kixocolatl'),
    ('55555555-0000-0000-0000-000000000022'::uuid, 'Cuyusal', 'Envasadora de flor de sal y sal de mar de la Laguna de Cuyutlán, Colima, recolectadas a mano por maestros salineros.', 'Flor de sal', 'cuyusal'),
    ('55555555-0000-0000-0000-000000000023'::uuid, 'Finca Irlanda', 'Finca cafetalera de Tapachula, Chiapas, fundada en 1928 y pionera mundial del café orgánico-biodinámico.', 'Café de altura', 'finca-irlanda'),
    ('55555555-0000-0000-0000-000000000024'::uuid, 'Real Minero', 'Familia Ángeles Carreño de Santa Catarina Minas, Oaxaca; destila mezcal en ollas de barro desde finales del siglo XIX.', 'Mezcal en olla de barro', 'real-minero'),
    ('55555555-0000-0000-0000-000000000025'::uuid, 'Tamoa', 'Proyecto de la Ciudad de México que compra a precio justo maíz nativo, frijol y chiles a milperos y los lleva a cocinas de México y el extranjero.', 'Maíz nativo', 'tamoa'),
    ('55555555-0000-0000-0000-000000000026'::uuid, 'Yaxool', 'Meliponario maya de Yucatán que cuida abejas nativas sin aguijón; miel pura, cosmética de miel y visitas con comercio justo.', 'Miel melipona', 'yaxool'),
    ('55555555-0000-0000-0000-000000000027'::uuid, 'Productores de Queso Cotija', 'Unos 100 productores de la Sierra de Jalmich con la marca colectiva "Cotija Región de Origen": queso de leche cruda hecho en temporada de lluvias.', 'Queso Cotija', 'productores-de-queso-cotija')
  ) as v(id, nombre, bio, especialidad, slug)
  where exists (select 1 from auth.users where id = v.id)
  on conflict (id) do update set
    nombre       = excluded.nombre,
    bio          = excluded.bio,
    especialidad = excluded.especialidad,
    slug         = excluded.slug;

end $$;

-- Verificación: debe dar 10 perfiles y 10 productos.
select
  (select count(*) from public.perfiles where id between '55555555-0000-0000-0000-000000000018' and '55555555-0000-0000-0000-000000000027') as perfiles,
  (select count(*) from public.productos_cocina where id between 18 and 27) as productos;
