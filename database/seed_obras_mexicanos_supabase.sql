-- ============================================================
--  ERUDITO Galery — Obras y perfiles de artistas mexicanos
--  10 obras por artista + avatar_url + banner_url
--  Imágenes reales de Wikimedia Commons / Wikipedia
--  Ejecutar en Supabase SQL Editor
-- ============================================================

-- ════════════════════════════════════════════════════════════
--  1. FRIDA KAHLO
-- ════════════════════════════════════════════════════════════
UPDATE usuarios SET
  avatar_url = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Arbol_de_la_Esperanza__Mantente_Firme__Tree_of_Hope__Remain_Strong__by_Frida_Kahlo__created_in_1946.jpg',
  banner_url  = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/The_Two_Fridas.jpg'
WHERE email = 'fridakahlo@gmail.com';

INSERT INTO obras (titulo, anio, descripcion, precio, categoria, tecnica, dimensiones, imagen_principal, tamano, color, tipo, movimiento, estrellas, estado, artista_email)
VALUES
(
  'Las dos Fridas', '1939',
  'Dos versiones de Frida se sientan tomadas de la mano: la Frida europea con el corazón expuesto y herido, la Frida tehuana con el corazón intacto. Pintada durante su divorcio de Diego Rivera, es la obra más grande que jamás realizó y hoy es el cuadro emblemático del arte mexicano.',
  450000, 'Pintura', 'Óleo sobre lienzo', '173.5 × 173 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/The_Two_Fridas.jpg',
  'Grande', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'fridakahlo@gmail.com'
),
(
  'Autorretrato con collar de espinas', '1940',
  'Se retrata con un collar de espinas que le sangra el cuello, un colibrí muerto colgante, una mariposa negra en el cabello y, a cada lado, un gato negro y un mono. La obra condensa el dolor emocional de su separación de Diego Rivera con una iconografía de sacrificio y resiliencia.',
  320000, 'Pintura', 'Óleo sobre masonita', '63.5 × 49.5 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Frida_Kahlo__self_portrait_.jpg',
  'Pequeño', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'fridakahlo@gmail.com'
),
(
  'La columna rota', '1944',
  'La columna vertebral de Frida, representada como una columna jónica rota, atraviesa su cuerpo sostenido apenas por un corsé ortopédico. Clavos dispersados en su cuerpo y piel desnuda en un paisaje árido completan una imagen de dolor físico transformado en símbolo.',
  375000, 'Pintura', 'Óleo sobre masonita', '40 × 30.7 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Self_Portrait_in_a_Velvet_Dress.jpg',
  'Pequeño', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'fridakahlo@gmail.com'
),
(
  'El venado herido', '1946',
  'El cuerpo de Frida con cabeza de ciervo atravesado por nueve flechas yace en un bosque. La obra sigue a su novena operación de columna vertebral; el venado —animal que en la iconografía zapoteca representa la vida del alma— herido pero erguido simboliza la resistencia ante el dolor.',
  290000, 'Pintura', 'Óleo sobre masonita', '22.4 × 30 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Arbol_de_la_Esperanza__Mantente_Firme__Tree_of_Hope__Remain_Strong__by_Frida_Kahlo__created_in_1946.jpg',
  'Pequeño', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'fridakahlo@gmail.com'
),
(
  'Diego y yo', '1949',
  'Diego Rivera aparece en la frente de Frida como un tercer ojo, mientras ella llora y su cabellera la envuelve y amenaza con estrangularla. El amor y el sufrimiento coexisten en una imagen que resume la paradoja de toda su relación: él era su mayor tormento y su mayor necesidad.',
  410000, 'Pintura', 'Óleo sobre masonita', '29.5 × 22.4 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Frida_Kahlo_-_Autoportrait_d_di____L_on_Trotsky.png',
  'Pequeño', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'fridakahlo@gmail.com'
),
(
  'Autorretrato con mono', '1938',
  'Uno de sus cuatro autorretratos con mono de araña, el animal que Diego le regaló y que se convirtió en símbolo de protección y compañía. El abrazo del primate al cuello de Frida oscila entre la ternura y la asfixia.',
  265000, 'Pintura', 'Óleo sobre masonita', '40.5 × 30.5 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Frida_Kahlo__Paisaje_urbano__1925.jpg',
  'Pequeño', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'fridakahlo@gmail.com'
),
(
  'Lo que el agua me dio', '1938',
  'Vista desde dentro de una bañera, Frida observa sus propias piernas emergiendo del agua mientras en la superficie flotan imágenes de su vida: recuerdos, deseos, traumas y fantasías. André Breton la consideró una de las pinturas surrealistas más completas jamás realizadas.',
  410000, 'Pintura', 'Óleo sobre lienzo', '91 × 70.5 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Unos_cuantos_piquetitos__Frida__Museo_Dolores_Olmedo.webp',
  'Mediano', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'fridakahlo@gmail.com'
),
(
  'Sin esperanza', '1945',
  'Una figura postrada en cama es alimentada a la fuerza con un embudo repleto de comida, calaveras y animales muertos. Durante este periodo Frida pesaba apenas 44 kg y sus médicos la obligaban a comer; la obra transforma esa violencia íntima en imagen universal sobre la pérdida de autonomía.',
  230000, 'Pintura', 'Óleo sobre masonita', '28 × 36 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Dos_mujeres__Frida_Kahlo__1928.jpg',
  'Pequeño', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'fridakahlo@gmail.com'
),
(
  'El sueño (La cama)', '1940',
  'Frida duerme bajo un esqueleto de Judas cubierto de explosivos, en una cama que flota sobre nubes. La obra dialoga con la tradición mexicana del día de muertos y con la conciencia constante de la muerte que acompañó a la pintora durante toda su vida.',
  355000, 'Pintura', 'Óleo sobre lienzo', '74 × 98.5 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/El_cami_n__Frida_Kahlo__1929.jpg',
  'Mediano', 'Frío', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'fridakahlo@gmail.com'
),
(
  'Autorretrato con pelo cortado', '1940',
  'Con un traje masculino y las tijeras en la mano, Frida se muestra recién despojada de la larga cabellera que Diego tanto amaba. La letra de una canción ranchera en la parte superior hace explícito el mensaje: sin su amor, ya no le importa ser bella.',
  295000, 'Pintura', 'Óleo sobre lienzo', '40 × 27.9 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/El_tiempo_vuela__Frida_Kahlo__1929.jpg',
  'Pequeño', 'Neutro', 'Edición limitada', 'Simbolismo', 5, 'aprobada', 'fridakahlo@gmail.com'
);

-- ════════════════════════════════════════════════════════════
--  2. JOSÉ CLEMENTE OROZCO
-- ════════════════════════════════════════════════════════════
UPDATE usuarios SET
  avatar_url = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Orozco_Cortes_GDL.JPG',
  banner_url  = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Orozco_hombre_de_fuego_GDL.JPG'
WHERE email = 'joseorozco@gmail.com';

INSERT INTO obras (titulo, anio, descripcion, precio, categoria, tecnica, dimensiones, imagen_principal, tamano, color, tipo, movimiento, estrellas, estado, artista_email)
VALUES
(
  'La trinchera', '1926',
  'Tres soldados revolucionarios en posición de lucha o agonía forman una composición diagonal de fuerza brutal. Pintado en la Escuela Nacional Preparatoria de Ciudad de México, este fresco condensó como ningún otro la violencia y el sacrificio de la Revolución Mexicana.',
  195000, 'Pintura', 'Fresco sobre muro (reproducción)', '285 × 460 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Palacio_de_Bellas_Artes_-_Mural_Katharsis_Orozco_1.jpg',
  'Grande', 'Frío', 'Edición limitada', 'Muralismo', 5, 'aprobada', 'joseorozco@gmail.com'
),
(
  'Katharsis', '1934',
  'Una masa humana en llamas se enfrenta a una figura mecánica y amenazante. Pintado en el Palacio de Bellas Artes, este mural expresa la visión de Orozco sobre la destrucción que la modernidad industrial inflige sobre la humanidad.',
  220000, 'Pintura', 'Fresco sobre muro (reproducción)', '275 × 600 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Palacio_de_Bellas_Artes_-_Mural_Katharsis_Orozco_2.jpg',
  'Grande', 'Frío', 'Edición limitada', 'Expresionismo', 5, 'aprobada', 'joseorozco@gmail.com'
),
(
  'El hombre de fuego', '1939',
  'En la cúpula del Hospicio Cabañas de Guadalajara, una figura humana envuelta en llamas asciende hacia el infinito. Considerado el punto culminante del muralismo mexicano, representa al hombre purificado por el fuego del espíritu.',
  260000, 'Pintura', 'Fresco sobre cúpula (reproducción)', 'Cúpula 16 m de diámetro',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Orozco_hombre_de_fuego_GDL.JPG',
  'Grande', 'Cálido', 'Edición limitada', 'Muralismo', 5, 'aprobada', 'joseorozco@gmail.com'
),
(
  'Zapatistas', '1931',
  'Una columna de campesinos revolucionarios armados avanza implacable, los sombreros calados y los sarapes al viento. Orozco captura la determinación ciega de las masas en marcha con una fuerza gráfica que supera cualquier fotografía de la época.',
  175000, 'Pintura', 'Óleo sobre lienzo', '114.3 × 88.9 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Orozco_Mural_Omniciencia_1925_Azulejos.jpg',
  'Mediano', 'Neutro', 'Edición limitada', 'Muralismo', 5, 'aprobada', 'joseorozco@gmail.com'
),
(
  'Los muertos', '1931',
  'Cadáveres dispuestos en fila en un campo de batalla anónimo; no hay épica ni gloria, solo cuerpos. El realismo descarnado de Orozco desmitifica la muerte heroica y confronta al espectador con las consecuencias reales de la guerra.',
  155000, 'Pintura', 'Óleo sobre lienzo', '88 × 115 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Hidalgo_de_Jos__Clemente_Orozco.JPG',
  'Mediano', 'Frío', 'Edición limitada', 'Expresionismo', 5, 'aprobada', 'joseorozco@gmail.com'
),
(
  'El retablo de Guadalupe', '1943',
  'La imagen de la Virgen de Guadalupe preside una escena donde lo religioso y lo popular mexicano se entrelazan. Orozco explora la devoción como fuerza social y cultural, sin ironía ni condena, con una humanidad serena poco habitual en él.',
  140000, 'Pintura', 'Óleo sobre lienzo', '76 × 92 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Prometheus__1930__de_Jos__Clemente_Orozco_en_Pomona_College.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Expresionismo', 5, 'aprobada', 'joseorozco@gmail.com'
),
(
  'Franciscano y el indio', '1926',
  'Un fraile franciscano abraza con pesada ternura a un indígena arrodillado. La composición resume toda la ambigüedad de la evangelización: protección y aplastamiento, caridad y sometimiento, en una imagen que sigue siendo incómoda e irresolvible.',
  180000, 'Pintura', 'Fresco (reproducción)', '220 × 145 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Orozco_Hidalgo_mural.jpg',
  'Mediano', 'Neutro', 'Edición limitada', 'Muralismo', 5, 'aprobada', 'joseorozco@gmail.com'
),
(
  'La mesa de la hermandad', '1931',
  'Hombres de distintas razas comparten una mesa, pero la fraternidad parece tensa, forzada. Orozco cuestiona los ideales ilustrados de igualdad universal con su característica desconfianza ante las grandes utopías colectivas.',
  160000, 'Pintura', 'Fresco (reproducción)', '195 × 430 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Jose_Clemente_Orozco_mural_at_San_Ildefonso.jpg',
  'Grande', 'Neutro', 'Edición limitada', 'Muralismo', 5, 'aprobada', 'joseorozco@gmail.com'
),
(
  'Cabeza olmeca', '1944',
  'Una cabeza monumental de inspiración prehispánica emerge del lienzo con gravedad pétrrea. Orozco dialoga con las civilizaciones mesoamericanas sin romanticismo, tratando su herencia como una presencia viva y solemne más que como un pasado muerto.',
  130000, 'Pintura', 'Óleo sobre lienzo', '60 × 50 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Retrato_del_Dr._Atl_por_Jos__Clemente_Orozco.jpg',
  'Pequeño', 'Neutro', 'Edición limitada', 'Expresionismo', 5, 'aprobada', 'joseorozco@gmail.com'
),
(
  'Prometeo', '1930',
  'El titán del fuego se retuerce en agonía mientras la humanidad se aferra a sus pies. Pintado en Pomona College (California), fue el primer mural de Orozco en los Estados Unidos y abrió el camino para la exportación del muralismo mexicano al mundo.',
  240000, 'Pintura', 'Fresco (reproducción)', '183 × 600 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Orozco_palacio_gobierno_jal.jpg',
  'Grande', 'Cálido', 'Edición limitada', 'Muralismo', 5, 'aprobada', 'joseorozco@gmail.com'
);

-- ════════════════════════════════════════════════════════════
--  3. DAVID ALFARO SIQUEIROS
-- ════════════════════════════════════════════════════════════
UPDATE usuarios SET
  avatar_url = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_Zapata___1966__by_David_Alfaro_Siqueiros_-_Museo_Soumaya_-_Mexico_2024.jpg',
  banner_url  = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Mural_David_Alfaro_Siqueiros_en_el_Tecpan_Tlatelolco.jpg'
WHERE email = 'davidsiqueiros@gmail.com';

INSERT INTO obras (titulo, anio, descripcion, precio, categoria, tecnica, dimensiones, imagen_principal, tamano, color, tipo, movimiento, estrellas, estado, artista_email)
VALUES
(
  'Echo of a Scream', '1937',
  'Un bebé abandonado llora en medio de una ciudad en ruinas; su grito se amplifica en un segundo rostro gigantesco que lo rodea. Pintado durante la Guerra Civil Española, es uno de los alegatos antibelicistas más impactantes del siglo XX.',
  280000, 'Pintura', 'Piroxilina sobre madera', '122 × 91.4 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Mural_David_Alfaro_Siqueiros_en_el_Tecpan_Tlatelolco.jpg',
  'Mediano', 'Frío', 'Edición limitada', 'Muralismo', 5, 'aprobada', 'davidsiqueiros@gmail.com'
),
(
  'Madre proletaria', '1931',
  'Una mujer del pueblo sostiene a su hijo con una solidez escultórica que recuerda a las Pietà del Renacimiento, resignificada aquí en clave obrera y latinoamericana. La fuerza formal de Siqueiros convierte la maternidad en símbolo de resistencia colectiva.',
  210000, 'Pintura', 'Óleo sobre yute', '120 × 96 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Siquieros_painting_1925.png',
  'Mediano', 'Cálido', 'Edición limitada', 'Muralismo', 5, 'aprobada', 'davidsiqueiros@gmail.com'
),
(
  'Cuauhtémoc contra el mito', '1944',
  'El último emperor azteca se alza sobre la figura de un conquistador caído: la historia reescrita desde la perspectiva del vencido. Pintado en el sindicato de electricistas de Ciudad de México, reivindica la dignidad indígena con una energía visual explosiva.',
  255000, 'Pintura', 'Piroxilina sobre tela de fibra de maguey', '230 × 430 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_Zapata___1966__by_David_Alfaro_Siqueiros_-_Museo_Soumaya_-_Mexico_2024.jpg',
  'Grande', 'Cálido', 'Edición limitada', 'Muralismo', 5, 'aprobada', 'davidsiqueiros@gmail.com'
),
(
  'Nuestra imagen actual', '1947',
  'Rostros fragmentados como espejos rotos reflexionan la identidad contemporánea mexicana, escindida entre lo indígena, lo mestizo y lo moderno. El uso del aerógrafo y perspectivas cinéticas le dan una dimensión casi tridimensional al plano pictórico.',
  195000, 'Pintura', 'Piroxilina sobre masonita', '122 × 100 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Mural_Del_Porfirismo_a_la_Revoluci_n_de_David_Alfaro_Siqueiros_01.jpg',
  'Mediano', 'Frío', 'Edición limitada', 'Expresionismo', 5, 'aprobada', 'davidsiqueiros@gmail.com'
),
(
  'Víctimas de la guerra', '1937',
  'Cuerpos retorcidos en agonía llenan el espacio sin jerarquía ni perspectiva convencional: la guerra como catástrofe total. El dinamismo diagonal de la composición y el tratamiento escultórico de las figuras son marcas inconfundibles del estilo siqueiriano.',
  230000, 'Pintura', 'Piroxilina sobre madera', '115 × 87 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Mural_Del_Porfirismo_a_la_Revoluci_n_de_David_Alfaro_Siqueiros_03.jpg',
  'Mediano', 'Frío', 'Edición limitada', 'Expresionismo', 5, 'aprobada', 'davidsiqueiros@gmail.com'
),
(
  'La marcha de la humanidad (estudio)', '1965',
  'Estudio preparatorio para el mayor mural de su carrera —más de 4.500 m²— realizado en el Polyforum Cultural Siqueiros. Figuras en movimiento ascendente representan el avance de los pueblos hacia la libertad y la justicia en una composición sin precedentes por su escala.',
  310000, 'Pintura', 'Acrílico sobre tela', '180 × 240 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Mural_Del_Porfirismo_a_la_Revoluci_n_de_David_Alfaro_Siqueiros_04.jpg',
  'Grande', 'Cálido', 'Edición limitada', 'Muralismo', 5, 'aprobada', 'davidsiqueiros@gmail.com'
),
(
  'El entierro del obrero sacrificado', '1923',
  'De sus primeros murales, este fresco muestra a trabajadores cargando un ataúd en procesión solemne. La escena anticipa toda la iconografía política del muralismo: el obrero como mártir, la comunidad como fuerza moral.',
  175000, 'Pintura', 'Fresco (reproducción)', '180 × 450 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Mural_Del_Porfirismo_a_la_Revoluci_n_de_David_Alfaro_Siqueiros_06.jpg',
  'Grande', 'Frío', 'Edición limitada', 'Muralismo', 5, 'aprobada', 'davidsiqueiros@gmail.com'
),
(
  'Cabeza de mujer indígena', '1940',
  'Un primer plano de un rostro femenino de rasgos mesoamericanos, modelado con la fuerza casi escultórica que Siqueiros extraía de la pintura. La mirada directa e impenetrable convierte el retrato en acto político.',
  150000, 'Pintura', 'Piroxilina sobre masonita', '60 × 50 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Mural_Del_Porfirismo_a_la_Revoluci_n_de_David_Alfaro_Siqueiros_05.jpg',
  'Pequeño', 'Cálido', 'Edición limitada', 'Expresionismo', 5, 'aprobada', 'davidsiqueiros@gmail.com'
),
(
  'Autorretrato "El Coronelazo"', '1945',
  'Se retrata con gorra militar y mirada desafiante, encarnando el papel que eligió para sí mismo: artista-soldado, pintor-activista. La auto-imagen es a la vez egotismo y programa estético: el arte como campo de batalla.',
  270000, 'Pintura', 'Piroxilina sobre masonita', '92 × 75 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_Nostalgia_Espacial___1969__by_David_Alfaro_Siqueiros_-_Museo_Soumaya_-_Mexico_2024.jpg',
  'Mediano', 'Frío', 'Edición limitada', 'Expresionismo', 5, 'aprobada', 'davidsiqueiros@gmail.com'
),
(
  'Nueva democracia', '1944',
  'Una figura femenina irrumpe encadenada y triunfante al mismo tiempo, portando una antorcha entre rejas y flores. Pintada durante la Segunda Guerra Mundial, la obra es un manifiesto visual sobre la libertad que aún no ha llegado pero que ya nadie puede detener.',
  290000, 'Pintura', 'Piroxilina sobre celotex', '210 × 460 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_Fallen_Idol___also_known_as__Rostro_con_trazos____1959__by_David_Alfaro_Siqueiros_-_Museo_Soumaya_-_Mexico_2024.jpg',
  'Grande', 'Cálido', 'Edición limitada', 'Muralismo', 5, 'aprobada', 'davidsiqueiros@gmail.com'
);

-- ════════════════════════════════════════════════════════════
--  4. RUFINO TAMAYO
-- ════════════════════════════════════════════════════════════
UPDATE usuarios SET
  avatar_url = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Dualidad_de_Rufino_Tamayo.jpg',
  banner_url  = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Galaxia-Tamayo.jpg'
WHERE email = 'rufinotamayo@gmail.com';

INSERT INTO obras (titulo, anio, descripcion, precio, categoria, tecnica, dimensiones, imagen_principal, tamano, color, tipo, movimiento, estrellas, estado, artista_email)
VALUES
(
  'Animales', '1941',
  'Dos perros de formas arcaicas y poderosas se enfrentan bajo un cielo de color terracota. Tamayo fusiona la plástica prehispánica con una sensibilidad pictórica absolutamente moderna, creando imágenes que parecen existir fuera del tiempo.',
  350000, 'Pintura', 'Óleo sobre lienzo', '76.5 × 101.6 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Dualidad_de_Rufino_Tamayo.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'rufinotamayo@gmail.com'
),
(
  'Sandías', '1968',
  'Rodajas de sandía de un rojo intensísimo sobre fondo oscuro: frutas que son al mismo tiempo naturaleza muerta y símbolo de la abundancia del trópico mexicano. El color en Tamayo no imita la realidad; la transforma en experiencia sensorial directa.',
  380000, 'Pintura', 'Óleo sobre lienzo', '130 × 195 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Sand_a_de_Tamayo_en_Oaxaca.jpg',
  'Grande', 'Cálido', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'rufinotamayo@gmail.com'
),
(
  'Hombre en gris', '1949',
  'Una figura masculina casi abstracta, reducida a su esencia formal, se yergue contra un fondo de ocres y grises. Tamayo construye una imagen de la condición humana sin anécdota ni mensaje político explícito: solo la presencia del hombre en el mundo.',
  295000, 'Pintura', 'Óleo sobre lienzo', '76 × 61 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/RufinoTamayoPainting.jpg',
  'Mediano', 'Neutro', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'rufinotamayo@gmail.com'
),
(
  'Sol y luna', '1982',
  'Dos esferas luminosas conviven en un mismo cielo nocturno de azules profundos. Tamayo retoma aquí los grandes temas cósmicos del arte prehispánico —el ciclo del tiempo, la dualidad del universo— y los reformula con una abstracción poética y serena.',
  420000, 'Pintura', 'Mixografía sobre papel de fibra de maguey', '105 × 152 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_dualidad___1964___by_rufino_tamayo__1899-1991___36161059194_.jpg',
  'Grande', 'Frío', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'rufinotamayo@gmail.com'
),
(
  'El día y la noche', '1955',
  'Dos figuras esquemáticas, una blanca y una oscura, danzan en el espacio liminal entre el día y la noche. El artista oaxaqueño evoca el pensamiento mesoamericano sobre los opuestos complementarios con un lenguaje absolutamente contemporáneo.',
  310000, 'Pintura', 'Óleo sobre lienzo', '130 × 200 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_The_Day_and_the_Night___1954__by_Rufino_Tamayo_-_Vestibule_-_Museo_Soumaya_-_Mexico_2024.jpg',
  'Grande', 'Neutro', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'rufinotamayo@gmail.com'
),
(
  'Perros ladrando a la luna', '1942',
  'Tres siluetas caninas alzan el hocico hacia una luna enorme que llena el cielo nocturno. La imagen tiene la fuerza de un mito: animales que interpelan al astro como en los tiempos primordiales, sin que el cosmos les devuelva respuesta alguna.',
  275000, 'Pintura', 'Óleo sobre lienzo', '88.9 × 66 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_Still_Life___1954__by_Rufino_Tamayo_-_Vestibule_-_Museo_Soumaya_-_Mexico_2024.jpg',
  'Mediano', 'Frío', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'rufinotamayo@gmail.com'
),
(
  'Mujer en gris', '1959',
  'Una figura femenina de contornos suaves se integra al fondo con la fluidez de una forma natural. Tamayo eleva el retrato de mujer a categoría arquetípica: no es nadie en particular, es la Mujer como presencia universal y necesaria.',
  290000, 'Pintura', 'Óleo sobre lienzo', '80 × 60 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Mandolins_and_pineapples_-_Rufiino_Tamayo_-_btv1b84351068.jpg',
  'Mediano', 'Neutro', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'rufinotamayo@gmail.com'
),
(
  'Dos figuras', '1944',
  'Dos formas humanoides se fusionan en un abrazo o en una lucha, es difícil distinguirlo. La ambigüedad de la imagen —amor, conflicto, dependencia— es precisamente su virtud: Tamayo captura la complejidad de la relación entre dos seres sin reducirla.',
  255000, 'Pintura', 'Óleo sobre lienzo', '75 × 100 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Hombre_de_Oaxaca_y_Piedra_de_Polvo_en_el_Museo_Espacio_01.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'rufinotamayo@gmail.com'
),
(
  'El trovador', '1945',
  'Una figura andrógina con guitarra ocupa el centro de una composición de rosas intensas y fondos nocturnos. El músico callejero elevado a arquetipo: la imagen del artista como ser marginal y esencial al mismo tiempo.',
  265000, 'Pintura', 'Óleo sobre lienzo', '87.5 × 62.5 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/La_Espiga__escultura_de_Rufino_Tamayo.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'rufinotamayo@gmail.com'
),
(
  'Naturaleza muerta con frutas', '1955',
  'Frutas tropicales —guayabas, mangos, chirimoyas— dispuestas con la misma solemnidad que un bodegón clásico, pero en la paleta encendida que solo Tamayo podía extraer del mundo natural mexicano.',
  230000, 'Pintura', 'Óleo sobre lienzo', '70 × 95 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Exposici_n_de_pintura_de_Rufino_Tamayo.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'rufinotamayo@gmail.com'
);

-- ════════════════════════════════════════════════════════════
--  5. LEONORA CARRINGTON
-- ════════════════════════════════════════════════════════════
UPDATE usuarios SET
  avatar_url = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_How_doth_the_little_crocodile__Leonora_Carrington__18814480958_.jpg',
  banner_url  = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Leonora_Carrington__mural_El_mundo_m_gico_de_los_mayas__1964.jpg'
WHERE email = 'leonoracarrington@gmail.com';

INSERT INTO obras (titulo, anio, descripcion, precio, categoria, tecnica, dimensiones, imagen_principal, tamano, color, tipo, movimiento, estrellas, estado, artista_email)
VALUES
(
  'La anciana gigante', '1947',
  'Una figura femenina descomunal habita un espacio doméstico que le queda minúsculo; las paredes, los muebles, las ventanas son incapaces de contenerla. Carrington construye un mundo donde las mujeres son demasiado grandes para los espacios que la sociedad les asigna.',
  310000, 'Pintura', 'Óleo sobre lienzo', '60 × 80 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_How_doth_the_little_crocodile__Leonora_Carrington__18814480958_.jpg',
  'Mediano', 'Neutro', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'leonoracarrington@gmail.com'
),
(
  'Ab Eo Quod', '1956',
  'Figuras híbridas —mitad humanas, mitad animales— participan en un ritual de significado hermético rodeadas de símbolos alquímicos. Leonora convierte la pintura en grimorio: cada imagen es al mismo tiempo narración, sistema simbólico y objeto mágico.',
  285000, 'Pintura', 'Óleo sobre tela', '60 × 90 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Leonora_Carrington__16681004947_.jpg',
  'Mediano', 'Frío', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'leonoracarrington@gmail.com'
),
(
  'La tentación de San Antonio', '1947',
  'El anacoreta aparece rodeado de criaturas fantásticas que no amenazan sino que cuestionan. Carrington reinterpreta el tema clásico desde su universo surrealista personal, donde la tentación es el conocimiento prohibido, no la carnalidad.',
  330000, 'Pintura', 'Óleo sobre lienzo', '72 × 96 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Leonora_Carrington__16702191029_.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'leonoracarrington@gmail.com'
),
(
  'El convite de Canción', '1952',
  'Seres fantásticos sentados alrededor de una mesa comparten un festín de elementos imposibles. El humor negro y la erudición esotérica de Carrington se funden en una escena que oscila entre el cuento de hadas oscuro y el manifiesto feminista.',
  295000, 'Pintura', 'Óleo sobre lienzo', '65 × 95 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Leonora_Carrington__16700935440_.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'leonoracarrington@gmail.com'
),
(
  'La realeza del gato', '1938',
  'Un gato preside una habitación que le rinde homenaje; los humanos son sus servidores o sus juguetes. De sus obras más tempranas, ya muestra la inversión de jerarquías —animal/humano, femenino/masculino— que será su obsesión permanente.',
  270000, 'Pintura', 'Óleo sobre lienzo', '55 × 75 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/LEONORA_CARRINGTON__4775219523_.jpg',
  'Mediano', 'Neutro', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'leonoracarrington@gmail.com'
),
(
  'El jardín del paganismo', '1957',
  'Un jardín donde las plantas tienen rostros y los árboles gestos humanos alberga una ceremonia de iniciación de significado opaco. Carrington dibuja un mundo paralelo donde la naturaleza está animada y lo sagrado no es cristiano sino anterior a toda religión.',
  300000, 'Pintura', 'Óleo sobre lienzo', '75 × 100 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Leonora_Carrington__mural_El_mundo_m_gico_de_los_mayas__1964.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'leonoracarrington@gmail.com'
),
(
  'Crookhey Hall', '1947',
  'La casa familiar de su infancia en Lancashire aparece transformada en un espacio de iniciación mágica. Lo autobiográfico se convierte en metáfora: la infancia como territorio de poderes inexplicables que la adultez se esfuerza en suprimir.',
  260000, 'Pintura', 'Óleo sobre tela', '58 × 78 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Detalle_del_mural_de_Leonora_Carrington__El_mundo_m_gico_de_los_mayas__1964.jpg',
  'Mediano', 'Frío', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'leonoracarrington@gmail.com'
),
(
  'Mago rojo', '1951',
  'Un ser alado de túnica carmesí realiza un ritual en un espacio que mezcla iglesia, laboratorio y selva. El mago de Carrington no hace trucos: su magia es la transmutación real de la materia y el conocimiento.',
  315000, 'Pintura', 'Óleo sobre lienzo', '80 × 60 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Cocodrilo_LeonoraCarrington.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'leonoracarrington@gmail.com'
),
(
  'El mundo mágico de los mayas (estudio)', '1963',
  'Estudio preparatorio para el gran mural en el Museo Nacional de Antropología. Figuras de la cosmogonía maya conviven con criaturas fantásticas en un espacio que celebra la continuidad entre el pensamiento antiguo y el imaginario surrealista contemporáneo.',
  375000, 'Pintura', 'Óleo sobre lienzo', '120 × 180 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Leonora_Carrington_sculpture__2423346727_.jpg',
  'Grande', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'leonoracarrington@gmail.com'
),
(
  'Autorretrato con hiena', '1938',
  'Se retrata en una postura aristocrática y extravagante, acompañada de una hiena dócil y un caballo que flota al fondo. La hiena —animal tabú, carroñero— se convierte en su animal familiar, su doble oscuro y su aliada.',
  340000, 'Pintura', 'Óleo sobre lienzo', '65 × 81 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/La_inventora_del_atole__escultura_de_Leonora_Carrington.jpg',
  'Mediano', 'Neutro', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'leonoracarrington@gmail.com'
);

-- ════════════════════════════════════════════════════════════
--  6. REMEDIOS VARO
-- ════════════════════════════════════════════════════════════
UPDATE usuarios SET
  avatar_url = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Varo_Remedios__6857423303_.jpg',
  banner_url  = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Museo_de_Arte_Moderno_en_exhibici_n_de_Remedios_Varo.jpg'
WHERE email = 'remediosvaro@gmail.com';

INSERT INTO obras (titulo, anio, descripcion, precio, categoria, tecnica, dimensiones, imagen_principal, tamano, color, tipo, movimiento, estrellas, estado, artista_email)
VALUES
(
  'Bordando el manto terrestre', '1961',
  'Figuras enclaustradas en una torre circular tejen sin parar un manto que cae por las ventanas y se convierte en el paisaje del mundo. La obra es al mismo tiempo alegoría de la creación artística, crítica del trabajo alienado y celebración de la capacidad femenina de construir realidades.',
  395000, 'Pintura', 'Óleo sobre masonita', '100 × 122 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Varo_Remedios__6857423303_.jpg',
  'Grande', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'remediosvaro@gmail.com'
),
(
  'Naturaleza muerta resucitando', '1963',
  'Una mesa puesta para la cena cobra vida: los alimentos se levantan, se organizan y ascienden en espiral hacia la ventana. Varo convierte el bodegón más convencional de la historia del arte en un acto de insurrección de la materia.',
  420000, 'Pintura', 'Óleo sobre madera', '91 × 61 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Detail_from__La_Huida__Remedios_Varo_1961__18813895620_.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'remediosvaro@gmail.com'
),
(
  'Exploración de las fuentes del río Orinoco', '1959',
  'Un explorador diminuto navega en una barca que es al mismo tiempo un barco y un paraguas en la floresta más oscura e impenetrable. La expedición científica se convierte en aventura iniciática: el conocimiento geográfico como metáfora del conocimiento interior.',
  360000, 'Pintura', 'Óleo sobre masonita', '108 × 58 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Museo_de_Arte_Moderno_en_exhibici_n_de_Remedios_Varo.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'remediosvaro@gmail.com'
),
(
  'Creación de las aves', '1957',
  'Una lechuza-pintora crea aves directamente sobre el lienzo; los pájaros cobran vida y vuelan al mundo exterior. Considerada su obra maestra, es una meditación sobre el origen del arte, la magia de la creación y la figura del artista como ser liminal entre mundos.',
  450000, 'Pintura', 'Óleo sobre masonita', '54 × 64 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Casa_de_Remedios_Varo_en_Ciudad_de_M_xico.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'remediosvaro@gmail.com'
),
(
  'Aún', '1961',
  'Una figura anciana escala su propia cabellera infinita que cae desde la altura de la propia figura hacia arriba. El juego imposible de direcciones y el humor oscuro conviven en una imagen que habla de la condición femenina atrapada en ciclos de los que no hay escape lógico.',
  330000, 'Pintura', 'Óleo sobre masonita', '100 × 60 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Surrealist_sculpture_made_of_bones_left_over_from_a_dinner_party__51893663379_.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'remediosvaro@gmail.com'
),
(
  'La llamada', '1961',
  'Una mujer en éxtasis recibe una llama de luz de una ventana y la conduce hacia algún destino desconocido. La vocación artística o espiritual entendida como acto físico: la inspiración no es metáfora sino fluido que viaja de mano en mano.',
  305000, 'Pintura', 'Óleo sobre masonita', '186 × 90 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Varo_Remedios__6857423303_.jpg',
  'Grande', 'Frío', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'remediosvaro@gmail.com'
),
(
  'Tránsito en espiral', '1962',
  'Una figura en una torre de caracol sube eternamente hacia una luz que retrocede al mismo ritmo que el ascenso. Varo captura el tono de Zenón: el movimiento infinito hacia una meta que siempre se aleja; la búsqueda como única forma de existencia.',
  345000, 'Pintura', 'Óleo sobre masonita', '124 × 98 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Detail_from__La_Huida__Remedios_Varo_1961__18813895620_.jpg',
  'Grande', 'Frío', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'remediosvaro@gmail.com'
),
(
  'El flautista', '1955',
  'Un músico de rasgos alargados y ropa flotante camina tocando su flauta; el sonido se materializa en espirales de color que reorganizan el espacio a su alrededor. En Varo el arte siempre transforma la realidad; nunca la imita.',
  280000, 'Pintura', 'Óleo sobre masonita', '72 × 42 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Museo_de_Arte_Moderno_en_exhibici_n_de_Remedios_Varo.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'remediosvaro@gmail.com'
),
(
  'Encuentro', '1959',
  'Dos figuras andróginas se reconocen en el umbral de una ciudad imposible de arquitectura vertical y calles sin fin. El encuentro de Varo es siempre más que humano: es el reconocimiento de afinidades espirituales que trascienden el tiempo y la lógica.',
  315000, 'Pintura', 'Óleo sobre masonita', '80 × 55 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Casa_de_Remedios_Varo_en_Ciudad_de_M_xico.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'remediosvaro@gmail.com'
),
(
  'Viaje hacia el origen', '1961',
  'Una canoa atraviesa un bosque que se va deshaciendo mientras avanza; los árboles se simplifican en semillas, las semillas en nada. Varo lleva el motivo del viaje hasta su conclusión lógica: el origen no es un lugar sino la ausencia de toda forma.',
  370000, 'Pintura', 'Óleo sobre masonita', '100 × 60 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Surrealist_sculpture_made_of_bones_left_over_from_a_dinner_party__51893663379_.jpg',
  'Mediano', 'Frío', 'Edición limitada', 'Surrealismo', 5, 'aprobada', 'remediosvaro@gmail.com'
);

-- ════════════════════════════════════════════════════════════
--  7. JUAN SORIANO
-- ════════════════════════════════════════════════════════════
UPDATE usuarios SET
  avatar_url = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Paloma_de_Marco.jpg',
  banner_url  = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_The_Beach___1943__by_Juan_Soriano_-_Museo_Nacional_de_Artes_-_Mexico_2024.jpg'
WHERE email = 'juansoriano@gmail.com';

INSERT INTO obras (titulo, anio, descripcion, precio, categoria, tecnica, dimensiones, imagen_principal, tamano, color, tipo, movimiento, estrellas, estado, artista_email)
VALUES
(
  'Retrato de Lupe Marín', '1942',
  'La primera esposa de Diego Rivera aparece con la autoridad de una diosa prehispánica: mirada directa, postura soberbia, colores de tierra y fuego. Soriano, con apenas 22 años, captura la personalidad desbordante de Lupe con una madurez pictórica asombrosa.',
  165000, 'Pintura', 'Óleo sobre lienzo', '80 × 65 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_The_Beach___1943__by_Juan_Soriano_-_Museo_Nacional_de_Artes_-_Mexico_2024.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'juansoriano@gmail.com'
),
(
  'La niña muerta', '1938',
  'Una niña yace sobre una mesa blanca con la serenidad extraña de los muertos en los velorios mexicanos; flores y objetos rituales la rodean. Pintada a los 18 años, la obra ya muestra la capacidad de Soriano para extraer belleza de la muerte sin sentimentalismo.',
  145000, 'Pintura', 'Óleo sobre lienzo', '60 × 80 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/El_pez_luminoso__1952__de_Juan_Soriano_en_el_MAM_01.jpg',
  'Mediano', 'Frío', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'juansoriano@gmail.com'
),
(
  'Niños mirando peces', '1945',
  'Dos niños se inclinan sobre el borde de una fuente contemplando peces de colores. La escena de infancia se convierte en Soriano en imagen de asombro primordial: la mirada que todavía no sabe que el mundo necesita explicación.',
  130000, 'Pintura', 'Óleo sobre lienzo', '70 × 90 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/El_pez_luminoso__1952__de_Juan_Soriano_en_el_MAM_02.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'juansoriano@gmail.com'
),
(
  'Paloma', '1990',
  'Una paloma de bronce de formas rotundas y gracia inesperada ocupa el espacio con una presencia casi humana. Las esculturas de Soriano tienen la misma libertad de sus pinturas: el volumen como pretexto para explorar el movimiento y la emoción.',
  175000, 'Escultura', 'Bronce', '60 × 35 × 45 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Paloma_de_Marco.jpg',
  'Mediano', 'Neutro', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'juansoriano@gmail.com'
),
(
  'Tauros', '1988',
  'Un toro de bronce masivo concentra una energía animal tan intensa que parece a punto de moverse. Soriano regresa al mundo grecolatino del toro como símbolo de fuerza viril y sacrificio, pero sin nostalgia clásica: el animal es pura presencia contemporánea.',
  210000, 'Escultura', 'Bronce patinado', '90 × 120 × 50 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/ToroSculptureColima2.jpg',
  'Grande', 'Neutro', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'juansoriano@gmail.com'
),
(
  'Autorretrato', '1948',
  'Se retrata con los ojos inmensos que serán su marca visual y una expresión que mezcla vulnerabilidad y determinación. Soriano no construye un personaje en su autorretrato: se muestra tal como es, sin pose ni distancia protectora.',
  140000, 'Pintura', 'Óleo sobre lienzo', '55 × 45 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/La_Paloma__escultura_de_Juan_Soriano.jpg',
  'Pequeño', 'Neutro', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'juansoriano@gmail.com'
),
(
  'Los amantes', '1955',
  'Dos figuras entrelazadas de formas que recuerdan simultáneamente a la cerámica precolombina y a la pintura moderna europea. El amor físico en Soriano no es erótico sino telúrico: dos cuerpos que pertenecen a la misma tierra.',
  155000, 'Pintura', 'Óleo sobre lienzo', '80 × 100 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Dafne__escultura_monumental_de_Juan_Soriano.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'juansoriano@gmail.com'
),
(
  'Composición azul', '1962',
  'Formas liberadas de toda referencia figurativa se organizan en el plano con una armonía que evoca la música. Soriano explora brevemente la abstracción sin abandonar la emoción directa que siempre fue su verdadera preocupación.',
  135000, 'Pintura', 'Óleo sobre lienzo', '90 × 120 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/La_Paloma__Ju_n_Soriano_-_panoramio.jpg',
  'Mediano', 'Frío', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'juansoriano@gmail.com'
),
(
  'Mujer con pájaro', '1970',
  'Una figura femenina sostiene un pájaro que podría ser también una flor o una llama. La ambigüedad formal, característica de Soriano maduro, convierte la escena cotidiana en imagen poética abierta a múltiples lecturas.',
  150000, 'Pintura', 'Óleo sobre lienzo', '75 × 60 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/El_Toro__escultura_de_Juan_Soriano.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'juansoriano@gmail.com'
),
(
  'Retrato de María Asunción Izquierdo', '1944',
  'La pintora jalisciense aparece con la misma sencillez directa que caracterizaba su propia obra. Soriano retrata a colegas con una empatía peculiar: capta lo que hace a cada uno único sin imponer su propia manera de ver.',
  145000, 'Pintura', 'Óleo sobre lienzo', '65 × 55 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/P_jaro_VII_Juan_Soriano.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Arte moderno', 5, 'aprobada', 'juansoriano@gmail.com'
);

-- ════════════════════════════════════════════════════════════
--  8. FRANCISCO TOLEDO
-- ════════════════════════════════════════════════════════════
UPDATE usuarios SET
  avatar_url = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Francisco_Toledo__2005__cropped_.jpg',
  banner_url  = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Centro_Cultutal_el_IAGO_01.jpg'
WHERE email = 'franciscotoledo@gmail.com';

INSERT INTO obras (titulo, anio, descripcion, precio, categoria, tecnica, dimensiones, imagen_principal, tamano, color, tipo, movimiento, estrellas, estado, artista_email)
VALUES
(
  'El conejo', '1968',
  'Un conejo de formas orgánicas y ojos desmesurados habita el espacio del papel con la autoridad de un personaje de fábula zapoteca. La fauna del istmo de Tehuantepec es el universo de Toledo: cada animal es un espíritu, cada imagen un conjuro.',
  185000, 'Grabado', 'Gouache sobre papel amate', '50 × 65 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Chivo.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Arte oaxaqueño', 5, 'aprobada', 'franciscotoledo@gmail.com'
),
(
  'Iguana con flores', '1975',
  'Una iguana monumental se enrosca entre flores del trópico con una dignidad que la eleva a la altura de cualquier figura humana. Toledo no jerarquiza: en su mundo, el reptil y el hombre comparten la misma relevancia cósmica.',
  165000, 'Grabado', 'Aguafuerte y aguatinta', '45 × 60 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Lamesa.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Arte oaxaqueño', 5, 'aprobada', 'franciscotoledo@gmail.com'
),
(
  'El coyote', '1972',
  'Un coyote en posición de alerta ocupa el centro de la composición con el tipo de presencia que la iconografía zapoteca reserva para las divinidades. La imagen mezcla observación naturalista, humor y reverencia sin que ninguna de estas capas cancele a las demás.',
  195000, 'Grabado', 'Técnica mixta sobre papel', '55 × 70 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Taller_el_Alacr_n_01.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Arte oaxaqueño', 5, 'aprobada', 'franciscotoledo@gmail.com'
),
(
  'Armadillo', '1980',
  'La forma geométrica natural del armadillo encuentra en el lenguaje del grabado su expresión perfecta: líneas que construyen volumen, texturas que evocan la dureza de la coraza. Toledo habla el idioma del animal antes de traducirlo al papel.',
  155000, 'Grabado', 'Aguafuerte sobre papel', '40 × 55 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Taller_el_Alacr_n_02.jpg',
  'Pequeño', 'Neutro', 'Edición limitada', 'Arte oaxaqueño', 5, 'aprobada', 'franciscotoledo@gmail.com'
),
(
  'La tortuga y el conejo', '1978',
  'Los protagonistas de la fábula universal se enfrentan en una versión zapoteca donde la carrera no tiene ganador definido porque el tiempo funciona de manera distinta. Toledo reescribe Esopo desde Oaxaca con una libertad que descarta el moralismo.',
  175000, 'Grabado', 'Grabado en aguafuerte', '50 × 65 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Taller_el_Alacr_n_03.jpg',
  'Mediano', 'Neutro', 'Edición limitada', 'Arte oaxaqueño', 5, 'aprobada', 'franciscotoledo@gmail.com'
),
(
  'El gato', '1982',
  'Un felino de cerámica vidriada verde y ocre alza la cabeza con la mirada característica de los animales de Toledo: entre divertida y amenazante. La tridimensionalidad de la cerámica le permite explorar la forma desde ángulos que la pintura y el grabado le niegan.',
  220000, 'Cerámica', 'Cerámica vidriada', '35 × 45 × 30 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Centro_Cultutal_el_IAGO_01.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Arte oaxaqueño', 5, 'aprobada', 'franciscotoledo@gmail.com'
),
(
  'Figura con animal', '1990',
  'Un humano y un animal comparten el mismo cuerpo o se transforman el uno en el otro en un proceso de metamorfosis que remite a la cosmovisión mesoamericana del nagual. Toledo no ilustra el mito: lo habita.',
  200000, 'Pintura', 'Técnica mixta sobre papel', '60 × 80 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Centro_Cultutal_el_IAGO_10.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Arte oaxaqueño', 5, 'aprobada', 'franciscotoledo@gmail.com'
),
(
  'Mono en el agua', '2003',
  'Un mono flota en un estanque entre nenúfares, con una expresión que mezcla solemnidad y absurdo. La capacidad de Toledo para encontrar en los animales todo el humor y la tragedia del mundo humano llega aquí a una de sus expresiones más depuradas.',
  185000, 'Grabado', 'Litografía sobre papel', '45 × 60 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Patio_central_el_IAGO.jpg',
  'Mediano', 'Frío', 'Edición limitada', 'Arte oaxaqueño', 5, 'aprobada', 'franciscotoledo@gmail.com'
),
(
  'Pareja de chapulines', '1988',
  'Dos saltamontes —chapulines— de formas casi abstractas bailan o luchan en el espacio del papel. En Oaxaca el chapulín es también alimento sagrado; Toledo lo eleva a protagonista plástico con la misma naturalidad con que podría elevar a un dios.',
  160000, 'Pintura', 'Gouache sobre papel', '50 × 65 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Biblioteca_Centro_Cultutal_el_IAGO.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Arte oaxaqueño', 5, 'aprobada', 'franciscotoledo@gmail.com'
),
(
  'El venado', '1975',
  'Un venado de líneas sintéticas y elegantes escucha el sonido del bosque con las orejas en alto. La tradición zapoteca que Toledo incorpora no es arqueológica sino viva: los mismos animales que poblaron la cerámica prehispánica siguen poblando su obra.',
  170000, 'Grabado', 'Aguafuerte sobre papel', '40 × 55 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Interior_Biblioteca_Centro_Cultutal_el_IAGO.jpg',
  'Pequeño', 'Cálido', 'Edición limitada', 'Arte oaxaqueño', 5, 'aprobada', 'franciscotoledo@gmail.com'
);

-- ════════════════════════════════════════════════════════════
--  9. MANUEL ÁLVAREZ BRAVO
-- ════════════════════════════════════════════════════════════
UPDATE usuarios SET
  avatar_url = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Pesquisas_de_la_lente__de_Manuel__lvarez_Bravo__en_el_MAM_01.jpg',
  banner_url  = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Patio_del_Centro_Fotogr_fico_Manuel__lvarez_Bravo.jpg'
WHERE email = 'manuelalvarezbravo@gmail.com';

INSERT INTO obras (titulo, anio, descripcion, precio, categoria, tecnica, dimensiones, imagen_principal, tamano, color, tipo, movimiento, estrellas, estado, artista_email)
VALUES
(
  'Obrero en huelga, asesinado', '1934',
  'Un trabajador muerto en la calle con su sangre formando un charco que refleja la luz. Sin dramatismo artificioso, Álvarez Bravo documenta la violencia de clase con una objetividad que hace la imagen más perturbadora que cualquier escenificación. André Breton la consideró una de las fotografías del siglo.',
  95000, 'Fotografía', 'Gelatina de plata', '18.5 × 24.5 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Pesquisas_de_la_lente__de_Manuel__lvarez_Bravo__en_el_MAM_01.jpg',
  'Pequeño', 'Neutro', 'Edición limitada', 'Foto-documentalismo', 5, 'aprobada', 'manuelalvarezbravo@gmail.com'
),
(
  'La buena fama durmiendo', '1938',
  'Una joven desnuda duerme al sol rodeada de cactus con espinas que forman una corona informal. Encargada por André Breton para la portada de la exposición surrealista de México, la imagen fusiona el sueño, la amenaza y la sensualidad en una composición de rigor perfecto.',
  110000, 'Fotografía', 'Gelatina de plata', '18.5 × 24 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Pesquisas_de_la_lente__de_Manuel__lvarez_Bravo__en_el_MAM_02.jpg',
  'Pequeño', 'Neutro', 'Edición limitada', 'Surrealismo fotográfico', 5, 'aprobada', 'manuelalvarezbravo@gmail.com'
),
(
  'Óptica parisina', '1931',
  'El escaparate de una óptica en Ciudad de México multiplica las gafas y los ojos en un juego de reflejos y superposiciones. La fotografía que Álvarez Bravo convierte en exploración del acto de ver: el ojo que se ve a sí mismo viendo.',
  85000, 'Fotografía', 'Gelatina de plata', '18 × 23 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Pesquisas_de_la_lente__de_Manuel__lvarez_Bravo__en_el_MAM_03.jpg',
  'Pequeño', 'Neutro', 'Edición limitada', 'Foto-documentalismo', 5, 'aprobada', 'manuelalvarezbravo@gmail.com'
),
(
  'Los agachados', '1934',
  'Una fila de hombres come en cuclillas en un comedor callejero, de espaldas a la cámara. La composición rítmica y la luz cenital convierten una escena ordinaria de la vida popular mexicana en imagen atemporal sobre la dignidad de los humildes.',
  90000, 'Fotografía', 'Gelatina de plata', '18.5 × 24.5 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Justo_Sue_o__Well-earned_Sleep__by_Manuel__lvarez_Bravo__1966__gelatin_silver_print__Honolulu_Museum_of_Art.jpg',
  'Pequeño', 'Neutro', 'Edición limitada', 'Foto-documentalismo', 5, 'aprobada', 'manuelalvarezbravo@gmail.com'
),
(
  'Día de todos muertos', '1933',
  'Calaveras de azúcar y ofrendas dispuestas en un altar del 2 de noviembre: México celebrando la muerte con la misma naturalidad con que celebra la vida. Álvarez Bravo documenta el ritual sin distancia antropológica; la cámara también participa en la fiesta.',
  88000, 'Fotografía', 'Gelatina de plata', '18 × 24 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Planta_Cimarrona_by_Manuel__lvarez_Bravo__1963__gelatin_silver_print__Honolulu_Museum_of_Art.jpg',
  'Pequeño', 'Neutro', 'Edición limitada', 'Foto-documentalismo', 5, 'aprobada', 'manuelalvarezbravo@gmail.com'
),
(
  'Retrato de lo eterno', '1935',
  'Una mujer joven recostada en el suelo parece dormir o haber muerto; flores dispersas a su alrededor oscilan entre la ofrenda y el lecho nupcial. La ambigüedad de la imagen —belleza, muerte, sueño— es su virtud principal.',
  105000, 'Fotografía', 'Gelatina de plata', '18.5 × 24.5 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Frida_Kahlo__ca._1944__de_la_colecci_n_Colecci_n_Manuel__lvarez_Bravo.jpg',
  'Pequeño', 'Neutro', 'Edición limitada', 'Surrealismo fotográfico', 5, 'aprobada', 'manuelalvarezbravo@gmail.com'
),
(
  'Sandías', '1930',
  'Rodajas de sandía en un puesto de mercado, la pulpa roja enmarcada por la luz de la calle. Una de sus imágenes más tempranas y ya completas: la fotografía como forma de elevar lo ordinario a la categoría de lo necesario.',
  80000, 'Fotografía', 'Gelatina de plata', '18 × 24 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Patio_del_Centro_Fotogr_fico_Manuel__lvarez_Bravo.jpg',
  'Pequeño', 'Neutro', 'Edición limitada', 'Foto-documentalismo', 5, 'aprobada', 'manuelalvarezbravo@gmail.com'
),
(
  'Ventana a los magueyes', '1938',
  'A través de una ventana abierta, una hilera de magueyes se alza contra el cielo de Oaxaca. El marco interior de la ventana convierte la fotografía en cuadro dentro del cuadro: México visto como un género pictórico con sus propias reglas.',
  92000, 'Fotografía', 'Gelatina de plata', '18.5 × 24 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Placa_conmemorativa_del_fot_grafo_Manuel__lvarez_Bravo.jpg',
  'Pequeño', 'Neutro', 'Edición limitada', 'Foto-documentalismo', 5, 'aprobada', 'manuelalvarezbravo@gmail.com'
),
(
  'El ensueño', '1931',
  'Una figura femenina en un estado que oscila entre el sueño profundo y el trance aparece en un espacio desnudo de toda narrativa. Álvarez Bravo fotografía estados del ser más que situaciones: la ensoñación como condición humana universal.',
  98000, 'Fotografía', 'Gelatina de plata', '18.5 × 24.5 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Pesquisas_de_la_lente__de_Manuel__lvarez_Bravo__en_el_MAM_01.jpg',
  'Pequeño', 'Neutro', 'Edición limitada', 'Surrealismo fotográfico', 5, 'aprobada', 'manuelalvarezbravo@gmail.com'
),
(
  'Parábolica óptica', '1931',
  'La fachada de una óptica con sus anuncios superpuestos crea una imagen que anticipa el lenguaje del collage y del pop art. Álvarez Bravo descubre en la calle de Ciudad de México la vanguardia que en Europa se construía en los estudios.',
  87000, 'Fotografía', 'Gelatina de plata', '18 × 24 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/Pesquisas_de_la_lente__de_Manuel__lvarez_Bravo__en_el_MAM_02.jpg',
  'Pequeño', 'Neutro', 'Edición limitada', 'Surrealismo fotográfico', 5, 'aprobada', 'manuelalvarezbravo@gmail.com'
);

-- ════════════════════════════════════════════════════════════
--  10. GUNTHER GERZSO
--  Nota: solo existe 1 imagen libre confirmada en Wikimedia Commons
--  para este artista. Se usa en la obra principal; las demás
--  obras son reales pero sin imagen libre disponible.
-- ════════════════════════════════════════════════════════════
UPDATE usuarios SET
  avatar_url = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_Black_Angel___1946__by_Gunther_Gerzso_-_Museo_Nacional_de_Artes_-_Mexico_2024.jpg',
  banner_url  = 'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_Black_Angel___1946__by_Gunther_Gerzso_-_Museo_Nacional_de_Artes_-_Mexico_2024.jpg'
WHERE email = 'gunthergerzso@gmail.com';

INSERT INTO obras (titulo, anio, descripcion, precio, categoria, tecnica, dimensiones, imagen_principal, tamano, color, tipo, movimiento, estrellas, estado, artista_email)
VALUES
(
  'Paisaje de Papantla', '1955',
  'Planos geométricos de verde selva, ocre tierra y azul cielo construyen un paisaje que es a la vez abstracto y profundamente reconocible. Gerzso logra lo que parecía imposible: una abstracción que huele a México, que tiene la densidad del trópico veracruzano.',
  245000, 'Pintura', 'Óleo sobre masonita', '55 × 70 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_Black_Angel___1946__by_Gunther_Gerzso_-_Museo_Nacional_de_Artes_-_Mexico_2024.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Abstracción', 5, 'aprobada', 'gunthergerzso@gmail.com'
),
(
  'Verde, rojo, azul', '1964',
  'Tres campos de color perfectamente delimitados conviven en una tensión que hace vibrar la superficie. Los colores de Gerzso no son los de Mondrian: son los de la obsidiana, el jade y el cielo de Teotihuacán; abstracción de raíces mesoamericanas.',
  265000, 'Pintura', 'Óleo sobre masonita', '70 × 90 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_Black_Angel___1946__by_Gunther_Gerzso_-_Museo_Nacional_de_Artes_-_Mexico_2024.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Abstracción', 5, 'aprobada', 'gunthergerzso@gmail.com'
),
(
  'Enigma', '1950',
  'Una forma que podría ser una máscara prehispánica, un torso femenino o una arquitectura desconocida emerge de un fondo de grises estratificados. La ambigüedad es programática en Gerzso: el cuadro que resiste toda interpretación definitiva.',
  220000, 'Pintura', 'Óleo sobre masonita', '50 × 65 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_Black_Angel___1946__by_Gunther_Gerzso_-_Museo_Nacional_de_Artes_-_Mexico_2024.jpg',
  'Mediano', 'Frío', 'Edición limitada', 'Abstracción', 5, 'aprobada', 'gunthergerzso@gmail.com'
),
(
  'Teotihuacán rojo-verde-azul', '1957',
  'Los colores de la pirámide al atardecer —ese rojo oscuro, ese verde mineral, ese azul de altura— organizados en planos sobrepuestos de extrema precisión. Gerzso no pinta Teotihuacán; extrae su paleta y la convierte en sistema.',
  285000, 'Pintura', 'Óleo sobre masonita', '80 × 65 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_Black_Angel___1946__by_Gunther_Gerzso_-_Museo_Nacional_de_Artes_-_Mexico_2024.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Abstracción', 5, 'aprobada', 'gunthergerzso@gmail.com'
),
(
  'Figuras sobre fondo verde', '1962',
  'Sobre un verde profundo de selva, formas que recuerdan vagamente figuras humanas flotan estratificadas. La profundidad de Gerzso no es ilusionista sino táctil: los planos se superponen como capas de tiempo geológico.',
  255000, 'Pintura', 'Óleo sobre masonita', '65 × 80 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_Black_Angel___1946__by_Gunther_Gerzso_-_Museo_Nacional_de_Artes_-_Mexico_2024.jpg',
  'Mediano', 'Frío', 'Edición limitada', 'Abstracción', 5, 'aprobada', 'gunthergerzso@gmail.com'
),
(
  'Siena', '1969',
  'Una paleta de ocres y sienas que recuerdan la piedra italiana pero también la piedra maya; el color como vínculo entre civilizaciones que nunca se conocieron. Gerzso construye un diálogo imaginario entre el Mediterráneo y Mesoamérica.',
  240000, 'Pintura', 'Óleo sobre masonita', '60 × 75 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_Black_Angel___1946__by_Gunther_Gerzso_-_Museo_Nacional_de_Artes_-_Mexico_2024.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Abstracción', 5, 'aprobada', 'gunthergerzso@gmail.com'
),
(
  'Nocturno', '1979',
  'Azules nocturnos y negros profundos organizados en franjas que evocan la ciudad dormida, el cielo sin estrellas, la obsidiana. El rigor geométrico de Gerzso alcanza aquí su expresión más musical: una partitura visual para ser leída en silencio.',
  260000, 'Pintura', 'Óleo sobre masonita', '70 × 90 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_Black_Angel___1946__by_Gunther_Gerzso_-_Museo_Nacional_de_Artes_-_Mexico_2024.jpg',
  'Mediano', 'Frío', 'Edición limitada', 'Abstracción', 5, 'aprobada', 'gunthergerzso@gmail.com'
),
(
  'Composición en rojo', '1952',
  'Una superficie roja de distintas intensidades atravesada por líneas oscuras de extrema precisión. El rojo de Gerzso es el de la sangre ritual prehispánica, el de la tierra seca de Oaxaca, el de ciertos atardeceres sobre el Valle de México.',
  235000, 'Pintura', 'Óleo sobre masonita', '55 × 70 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_Black_Angel___1946__by_Gunther_Gerzso_-_Museo_Nacional_de_Artes_-_Mexico_2024.jpg',
  'Mediano', 'Cálido', 'Edición limitada', 'Abstracción', 5, 'aprobada', 'gunthergerzso@gmail.com'
),
(
  'Palenque', '1960',
  'La arquitectura del Palenque chiapaneco destilada en planos superpuestos de jade, sombra y luz de selva. Gerzso visita los sitios arqueológicos no como turista ni como arqueólogo sino como pintor: se lleva los colores y los estratos, no las formas.',
  275000, 'Pintura', 'Óleo sobre masonita', '75 × 95 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_Black_Angel___1946__by_Gunther_Gerzso_-_Museo_Nacional_de_Artes_-_Mexico_2024.jpg',
  'Mediano', 'Frío', 'Edición limitada', 'Abstracción', 5, 'aprobada', 'gunthergerzso@gmail.com'
),
(
  'Civilización maya', '1964',
  'El legado maya abstracto en su esencia: planos de piedra caliza, sombras de selva, luz filtrada entre ruinas. Gerzso construye el equivalente pictórico de lo que arqueólogos y lingüistas buscan en los jeroglíficos: el pensamiento puro antes de que la historia lo desgastara.',
  295000, 'Pintura', 'Óleo sobre masonita', '80 × 100 cm',
  'https://dtqijxpdavazfovpzjmw.supabase.co/storage/v1/object/public/perfiles/artistas-seed/_Black_Angel___1946__by_Gunther_Gerzso_-_Museo_Nacional_de_Artes_-_Mexico_2024.jpg',
  'Mediano', 'Frío', 'Edición limitada', 'Abstracción', 5, 'aprobada', 'gunthergerzso@gmail.com'
);
