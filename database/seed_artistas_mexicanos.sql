-- ============================================================
--  ERUDITO Galery — Semilla: Artistas mexicanos como usuarios
--  Ejecutar en: Supabase SQL Editor
--  Contraseña uniforme: Test1234 (texto plano — pendiente bcrypt)
-- ============================================================

INSERT INTO usuarios (email, clave, rol, nombre, bio, especialidad, pais, slug, avatar_url, banner_url)
VALUES

(
  'fridakahlo@gmail.com',
  'Test1234',
  'artista',
  'Frida Kahlo',
  'Pintora mexicana de fama mundial, reconocida por sus autorretratos que exploran el dolor físico, la identidad y la femineidad con una intensidad sin igual. Su obra fusiona el realismo mágico con la cultura popular mexicana, el simbolismo prehispánico y una profunda autobiografía visual. Ícono del arte latinoamericano y del movimiento feminista internacional.',
  'Pintura al óleo, Surrealismo, Arte popular mexicano',
  'México',
  'frida-kahlo',
  '',
  ''
),

(
  'joseorozco@gmail.com',
  'Test1234',
  'artista',
  'José Clemente Orozco',
  'Uno de los grandes maestros del muralismo mexicano, Orozco plasmó en paredes y bóvedas la tragedia de la condición humana con un estilo expresionista brutal y visceral. Sus murales en Guadalajara, Ciudad de México y Dartmouth College son considerados obras capitales del arte del siglo XX en América.',
  'Muralismo, Pintura al fresco, Litografía',
  'México',
  'jose-clemente-orozco',
  '',
  ''
),

(
  'davidsiqueiros@gmail.com',
  'Test1234',
  'artista',
  'David Alfaro Siqueiros',
  'Muralista, activista y experimentador técnico incansable, Siqueiros revolucionó el arte monumental con el uso de la piroxilina, el aerógrafo y perspectivas cinematográficas. Sus obras en la Ciudad de México y Los Ángeles son manifiestos visuales que combinan el dinamismo político con una plástica de poder arrollador.',
  'Muralismo, Piroxilina, Pintura experimental',
  'México',
  'david-alfaro-siqueiros',
  '',
  ''
),

(
  'rufinotamayo@gmail.com',
  'Test1234',
  'artista',
  'Rufino Tamayo',
  'Pintor oaxaqueño que tejió un puente entre las raíces prehispánicas de México y las vanguardias europeas sin pertenecer del todo a ninguna. Su paleta de ocres, rosas y azules profundos y sus figuras cósmicas y telúricas lo sitúan como una de las voces más originales del arte moderno latinoamericano.',
  'Pintura, Arte moderno, Muralismo',
  'México',
  'rufino-tamayo',
  '',
  ''
),

(
  'leonoracarrington@gmail.com',
  'Test1234',
  'artista',
  'Leonora Carrington',
  'Pintora y escritora británica-mexicana, figura central del surrealismo internacional que encontró en México su hogar definitivo. Sus lienzos mezclan alquimia, mitología celta, tradición esotérica y humor negro en mundos oníricos donde mujeres, bestias y criaturas fantásticas comparten un espacio de poder femenino y transformación.',
  'Surrealismo, Pintura al óleo, Escultura',
  'México',
  'leonora-carrington',
  '',
  ''
),

(
  'remediosvaro@gmail.com',
  'Test1234',
  'artista',
  'Remedios Varo',
  'Pintora surrealista española-mexicana de visión singular, Remedios Varo construyó universos herméticos donde la ciencia, la magia y la espiritualidad se funden en composiciones de minuciosa precisión técnica. Sus figuras elongadas transitan espacios imposibles en busca de conocimiento y trascendencia, haciendo de cada obra un poema visual.',
  'Surrealismo, Pintura al óleo, Arte fantástico',
  'México',
  'remedios-varo',
  '',
  ''
),

(
  'juansoriano@gmail.com',
  'Test1234',
  'artista',
  'Juan Soriano',
  'Artista jalisciense de sensibilidad extraordinaria, Juan Soriano exploró la pintura, la escultura y la cerámica con una libertad plástica que desafió toda etiqueta. Niño prodigio convertido en referente del arte mexicano moderno, sus obras abarcan desde retratos intimistas hasta grandes esculturas de bronce que habitan espacios públicos de México y Europa.',
  'Pintura, Escultura, Cerámica',
  'México',
  'juan-soriano',
  '',
  ''
),

(
  'franciscotoledo@gmail.com',
  'Test1234',
  'artista',
  'Francisco Toledo',
  'Maestro oaxaqueño de obra vasta y profunda, Toledo integró el universo zapoteca, la fauna del istmo y la sexualidad en un lenguaje plástico que abarca grabado, pintura, cerámica y escultura. Activista cultural comprometido, fue también el guardián del patrimonio artístico de Oaxaca y fundador de instituciones culturales que transformaron su estado.',
  'Grabado, Pintura, Cerámica, Escultura',
  'México',
  'francisco-toledo',
  '',
  ''
),

(
  'manuelalvarezbravo@gmail.com',
  'Test1234',
  'artista',
  'Manuel Álvarez Bravo',
  'El gran maestro de la fotografía latinoamericana del siglo XX, Álvarez Bravo documentó el México popular y cotidiano con una poética que va del realismo mágico al surrealismo fotográfico. Sus imágenes de trabajadores, vendedores, cuerpos y rituales son al mismo tiempo testimonios sociales y obras de arte atemporales reconocidas en todo el mundo.',
  'Fotografía, Foto-documentalismo, Surrealismo fotográfico',
  'México',
  'manuel-alvarez-bravo',
  '',
  ''
),

(
  'gunthergerzso@gmail.com',
  'Test1234',
  'artista',
  'Gunther Gerzso',
  'Precursor silencioso del arte abstracto en México, Gerzso construyó un universo pictórico de planos geométricos, texturas líticas y colores mesoamericanos que dialogan con el pensamiento prehispánico y las vanguardias europeas. Su obra, mucho tiempo subestimada, es hoy reconocida como una de las propuestas más originales y rigurosas del arte moderno latinoamericano.',
  'Pintura abstracta, Arte geométrico, Diseño escénico',
  'México',
  'gunther-gerzso',
  '',
  ''
)

ON CONFLICT (email) DO NOTHING;
