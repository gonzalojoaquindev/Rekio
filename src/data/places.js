// Lugares con historia. Cada lugar pertenece a una ciudad (ver tours.js → CITIES).
// type: 'historia' (hechos documentados) | 'recreacion' (escena imaginada a partir de hechos)
// radius: metros alrededor del punto donde se activa el relato
// photo: artículos de Wikipedia donde buscar la foto ('ja:Título', 'en:Título' o 'search:ja:texto')

import { TOKYO } from './places_tokyo';
import { NARA } from './places_nara';
import { TOKYO2 } from './places_tokyo2';

export const PLACES = [
  {
    id: 'ikedaya',
    city: 'kyoto',
    photo: ["en:Ikedaya_incident", "ja:池田屋事件"],
    name: 'El incidente del Ikedaya',
    jp: '池田屋事件跡',
    lat: 35.00885,
    lng: 135.76995,
    radius: 35,
    type: 'recreacion',
    story:
      'Estás junto al lugar donde estuvo la posada Ikedaya, en la calle Sanjō. Hoy hay un restaurante y una piedra conmemorativa, pero aquí ocurrió uno de los episodios más famosos del fin de los samuráis. Lo que sigue es una recreación basada en los hechos. ' +
      'Noche del 8 de julio de 1864. Es temporada del Gion Matsuri y la ciudad está llena de gente y de faroles. En el segundo piso de la posada, un grupo de samuráis rebeldes, sobre todo de los dominios de Chōshū y Tosa, discute en voz baja. Quieren acabar con el shogunato. Según la confesión de un detenido, incluso hablaban de incendiar la ciudad aprovechando el viento. ' +
      'Abajo, en la calle, se detiene un pequeño grupo de hombres armados. Es el Shinsengumi, la policía del shogunato, liderada por Kondō Isami. Kondō anuncia una inspección oficial y entran. La pelea se libra en pasillos oscuros y escaleras estrechas. Varios rebeldes mueren o son capturados, y el Shinsengumi pasa de ser una banda mal mirada a ser famoso en todo Japón. ' +
      'Pero la victoria les duró poco. La represión enfureció a Chōshū, y apenas cuatro años después, el shogunato que defendían había caído.',
  },
  {
    id: 'okuni',
    city: 'kyoto',
    photo: ["ja:出雲阿国", "en:Izumo_no_Okuni"],
    name: 'Estatua de Izumo no Okuni',
    jp: '出雲阿国像',
    lat: 35.00395,
    lng: 135.77075,
    radius: 35,
    type: 'historia',
    story:
      'Estás en el extremo este del puente de Shijō, sobre el río Kamo. Mira la estatua de la mujer con abanico y espada: es Izumo no Okuni. ' +
      'Cerca del año 1603, justo cuando Tokugawa Ieyasu se convertía en shōgun, esta mujer, que según la tradición había servido en el gran santuario de Izumo, empezó a bailar aquí abajo, en el lecho seco del río. Vestía ropa de hombre, llevaba una espada, y la gente de Kioto enloquecía con su espectáculo. ' +
      'Lo llamaban kabuki, de la palabra kabuku: inclinarse, salirse de lo normal. Ese fue el nacimiento del teatro kabuki. ' +
      'Pero el éxito duró poco para las mujeres. En 1629 el shogunato les prohibió actuar, y desde entonces todos los papeles, también los femeninos, los interpretan hombres. A esos actores especializados en papeles de mujer se les llama onnagata. ' +
      'Ahora cruza la calle: el gran edificio de enfrente es el heredero de esta historia.',
  },
  {
    id: 'minamiza',
    city: 'kyoto',
    photo: ["en:Minami-za", "ja:南座"],
    name: 'Teatro Minamiza',
    jp: '南座',
    lat: 35.00385,
    lng: 135.77195,
    radius: 40,
    type: 'historia',
    story:
      'Este edificio con aire de castillo es el Minamiza. A comienzos del período Edo, el gobierno autorizó varios teatros a lo largo de esta calle, y el Minamiza se considera el último sobreviviente de aquellas licencias. Por eso se presenta como el teatro de kabuki con el linaje más antiguo de Japón. El edificio que ves es más reciente, de 1929. ' +
      'Si pasas por aquí a fines de noviembre o en diciembre, fíjate en la fachada. Cuelgan grandes tablas de madera con los nombres de los actores escritos en una caligrafía gruesa y redonda. Se llaman maneki, y anuncian el kaomise, la función más importante del año, donde se presentan las grandes estrellas. ' +
      'Una curiosidad: esa letra se escribe con trazos gordos y apretados, casi sin espacios en blanco, porque se dice que así se desea un teatro lleno hasta el último asiento.',
  },
  {
    id: 'tatsumi',
    city: 'kyoto',
    photo: ["file:Next to the Gion Tatsumi Bridge (44600422074).jpg"],
    name: 'Puente Tatsumi y canal Shirakawa',
    jp: '巽橋・白川',
    lat: 35.00506,
    lng: 135.77458,
    radius: 35,
    type: 'historia',
    story:
      'Estás en el puentecito Tatsumi, sobre el canal Shirakawa, uno de los rincones más fotografiados de Kioto. Mira las casas de madera con persianas de bambú sobre el agua y los sauces llorones: así lucía buena parte de Gion en sus tiempos de esplendor. ' +
      'Al lado del puente está el pequeño santuario Tatsumi Daimyōjin. Las maiko y geiko vienen a rezarle para mejorar en sus artes: danza, música y canto. ' +
      'Si tienes suerte, verás a alguna pasar al anochecer camino a su cita, con pasos cortos y rápidos. Una nota de respeto: no son una atracción turística, van a trabajar. En Gion se han puesto carteles que prohíben fotografiar en las calles privadas, así que si te cruzas con una, déjala pasar tranquila.',
  },
  {
    id: 'kanikakuni',
    city: 'kyoto',
    photo: ["search:ja:祇園白川"],
    name: 'Monumento Kanikakuni',
    jp: 'かにかくに碑',
    lat: 35.00525,
    lng: 135.77395,
    radius: 30,
    type: 'historia',
    story:
      'A pocos pasos, junto al canal, hay una piedra con un poema grabado. Es el monumento Kanikakuni, dedicado al poeta Yoshii Isamu, que amó Gion a comienzos del siglo veinte. ' +
      'Su poema dice, más o menos, que pase lo que pase, añora Gion, y que incluso al dormir siente el agua correr bajo su almohada. Habla de las casas de té de esa época, construidas justo encima de este canal, con el agua pasando literalmente bajo los cuartos. ' +
      'Cada noviembre se celebra aquí el Kanikakuni-sai: las geiko y maiko vienen a dejar flores frente a la piedra en recuerdo del poeta.',
  },
  {
    id: 'ichiriki',
    city: 'kyoto',
    photo: ["ja:一力亭", "en:Ichiriki_Chaya"],
    name: 'Hanamikoji e Ichiriki Chaya',
    jp: '花見小路・一力亭',
    lat: 35.00367,
    lng: 135.77505,
    radius: 35,
    type: 'recreacion',
    story:
      'Estás en la entrada de Hanamikoji, y esa casa de muros rojo oscuro en la esquina es la Ichiriki, la casa de té más famosa de Gion. Lo que sigue es una recreación, basada en las costumbres y leyendas del lugar. ' +
      'Kioto, primavera de 1865. Faltan tres años para que caiga el shogunato. Un samurái de un dominio del sur camina por esta calle sin linterna, con el sombrero bajo. La ciudad está llena de espías y de patrullas. Se detiene frente a esta puerta. ' +
      'Adentro nadie pregunta nombres: aquí solo entra quien viene presentado por un cliente conocido. Esa regla, ichigen-san okotowari, no se atiende a desconocidos, sigue vigente hoy. Le sirven sake, una geiko toca el shamisen y, entre canciones, los hombres hablan en voz baja de alianzas que cambiarán Japón. La tradición dice que figuras como Saigō Takamori y Ōkubo Toshimichi se reunieron en esta casa. ' +
      'Y hay una leyenda más antigua: aquí, a comienzos del siglo dieciocho, Ōishi Kuranosuke, líder de los famosos 47 rōnin, habría fingido una vida de borracheras para engañar a los espías de su enemigo, mientras planeaba vengar a su señor. ' +
      'Un último secreto. Se cuenta que la casa se llamaba antes Man-ya, escrita con el carácter del número diez mil. Si partes ese carácter en dos, obtienes los de uno y fuerza: ichi y riki. Ichiriki.',
  },
  {
    id: 'kaburenjo',
    city: 'kyoto',
    photo: ["ja:祇園甲部歌舞練場", "en:Miyako_Odori"],
    name: 'Gion Kōbu Kaburenjō',
    jp: '祇園甲部歌舞練場',
    lat: 35.00135,
    lng: 135.77525,
    radius: 40,
    type: 'historia',
    story:
      'Este teatro de tejas al fondo del jardín es el Gion Kōbu Kaburenjō, el escenario de las geiko y maiko de Gion. Su historia empieza con una crisis. ' +
      'En 1869 el emperador se trasladó a Tokio, y Kioto, que había sido capital durante más de mil años, de pronto se quedó sin corte, sin nobles y con el futuro en duda. La ciudad respondió con orgullo: en 1872 organizó una gran exposición para atraer visitantes, y para ella se creó un espectáculo de danza, el Miyako Odori, las danzas de la capital. ' +
      'Desde entonces, cada abril, las maiko y geiko de Gion bailan aquí en filas perfectas, con kimonos iguales. Y si una tarde escuchas un shamisen a lo lejos, puede que estén ensayando: en Gion la formación en danza y música dura toda la vida.',
  },
  {
    id: 'kenninji',
    city: 'kyoto',
    photo: ["en:Kennin-ji", "ja:建仁寺"],
    name: 'Templo Kennin-ji',
    jp: '建仁寺',
    lat: 35.0008,
    lng: 135.774,
    radius: 60,
    type: 'historia',
    story:
      'Has llegado a Kennin-ji, el templo zen más antiguo de Kioto. Fue fundado en 1202 por el monje Eisai, que había viajado a China a estudiar el zen. ' +
      'Eisai trajo algo más que doctrina: promovió el cultivo y el consumo de té verde en Japón, e incluso escribió un libro sobre sus beneficios para la salud. Así que la cultura del té que hoy asociamos con Kioto tiene una de sus raíces aquí. ' +
      'Si entras, mira el techo del salón del Dharma: dos dragones enormes se enroscan sobre tu cabeza. Parecen antiguos, pero fueron pintados en 2002 por el artista Koizumi Junsaku, para celebrar los 800 años del templo. ' +
      'Busca también el biombo de Fūjin y Raijin, los dioses del viento y del trueno, de Tawaraya Sōtatsu, una de las obras más famosas del arte japonés. El que se exhibe es una reproducción: el original se conserva en el Museo Nacional de Kioto.',
  },
  {
    id: 'yasui',
    city: 'kyoto',
    photo: ["ja:安井金比羅宮"],
    name: 'Santuario Yasui Konpiragū',
    jp: '安井金比羅宮',
    lat: 35.00025,
    lng: 135.77655,
    radius: 35,
    type: 'historia',
    story:
      'Este pequeño santuario es Yasui Konpiragū, famoso por algo poco común: aquí se viene a cortar lazos. ' +
      'Mira la gran piedra cubierta de papeles blancos, con un agujero en el centro. La costumbre es escribir tu deseo en un papel y atravesar el agujero arrastrándote: primero de adelante hacia atrás, para cortar lo que te hace daño, una mala relación, un vicio, una enfermedad; y luego de atrás hacia adelante, para atraer buenos lazos. Al final pegas tu papel en la piedra, y por eso parece una criatura peluda de papel. ' +
      'Aunque se asocia sobre todo al amor, la gente viene a cortar de todo: con malos trabajos, con deudas o con el cigarro.',
  },
  {
    id: 'yasakato',
    city: 'kyoto',
    photo: ["en:Hōkan-ji", "ja:法観寺"],
    short: 'La pagoda de cinco pisos, símbolo del este de Kioto.',
    name: 'Pagoda de Yasaka',
    jp: '八坂の塔（法観寺）',
    lat: 34.99855,
    lng: 135.77925,
    radius: 50,
    type: 'historia',
    story:
      'Esa pagoda de cinco pisos que aparece entre las casas es uno de los símbolos del este de Kioto: la Pagoda de Yasaka, del templo Hōkan-ji. ' +
      'Según la tradición, el templo fue fundado por el príncipe Shōtoku a fines del siglo sexto, mucho antes de que existiera Kioto como capital. La pagoda se quemó varias veces; la que ves fue reconstruida en 1440 por el shōgun Ashikaga Yoshinori, y mide unos 46 metros. ' +
      'Se cuenta que los señores de la guerra que tomaban Kioto izaban su estandarte en lo alto de esta pagoda, para que toda la ciudad supiera quién mandaba.',
  },
  {
    id: 'yasaka',
    city: 'kyoto',
    photo: ["en:Yasaka_Shrine", "ja:八坂神社"],
    name: 'Santuario Yasaka',
    jp: '八坂神社',
    lat: 35.0037,
    lng: 135.7776,
    radius: 45,
    type: 'historia',
    story:
      'Frente a ti, la puerta bermellón que cierra la calle Shijō es la puerta oeste del santuario Yasaka. Todo el barrio de Gion nació alrededor de este santuario: hasta 1868 se llamaba Gion-sha, y de ahí viene el nombre del barrio. ' +
      'Las primeras casas de té eran simples puestos que servían té y dulces a los peregrinos. Con los siglos se convirtieron en los salones elegantes donde trabajan las geiko. ' +
      'En el año 869, cuando una epidemia azotaba la capital, se hizo un ritual para calmar a los espíritus: se levantaron 66 alabardas, una por cada provincia de Japón. Ese ritual es el origen del Gion Matsuri, que hoy dura todo julio y es uno de los festivales más famosos del país. ' +
      'El dios principal de este santuario es Susanoo, el impetuoso dios de las tormentas, hermano de la diosa del sol. Si entras de noche, verás el escenario de danza iluminado por cientos de faroles, cada uno con el nombre de un negocio que hizo una donación.',
  },
  {
    id: 'maruyama',
    city: 'kyoto',
    photo: ["en:Maruyama_Park", "ja:円山公園"],
    name: 'Parque Maruyama',
    jp: '円山公園',
    lat: 35.0037,
    lng: 135.7803,
    radius: 50,
    type: 'historia',
    story:
      'Detrás del santuario se abre el parque Maruyama, el parque público más antiguo de Kioto, inaugurado en 1886. ' +
      'Su gran estrella es un cerezo llorón, conocido como el cerezo nocturno de Gion. En primavera lo iluminan de noche y miles de personas hacen picnic bajo sus ramas. ' +
      'Una curiosidad: el árbol que ves no es el original. El primero murió a mediados del siglo veinte, ya muy viejo, y el actual creció de una semilla del anterior. Es, literalmente, su hijo. ' +
      'En noviembre no hay flores, pero los arces del parque y de las colinas de Higashiyama se ponen rojos: es la otra gran temporada de Kioto, el momiji.',
  },

  // ── Kiyomizu-dera y sus calles ──
  {
    id: 'kiyo_niomon',
    city: 'kyoto',
    photo: ["file:Nio-mon, Kiyomizu-dera Temple, Kyoto, West view 20190416 1.jpg"],
    name: 'Puerta Niōmon de Kiyomizu-dera',
    jp: '清水寺・仁王門',
    lat: 34.99547,
    lng: 135.78323,
    radius: 40,
    type: 'historia',
    short: 'La gran puerta roja, custodiada por dos guardianes feroces.',
    story:
      'Estás frente a la Niōmon, la gran puerta roja de Kiyomizu-dera. La gente de Kioto la llama también Akamon, la puerta roja. Ardió durante la guerra de Ōnin, en 1469, se reconstruyó hacia el año 1500 y fue restaurada por completo en 2003, por eso su bermellón brilla así. ' +
      'Mira a los lados: dos guardianes musculosos, los Niō, protegen la entrada. Uno tiene la boca abierta y el otro cerrada. Representan el primer y el último sonido, el comienzo y el fin de todas las cosas. ' +
      'Y ahora, el origen del templo. Según la leyenda, en el año 778 un monje de Nara llamado Enchin soñó que debía buscar una fuente de agua pura en estas colinas. La encontró en la cascada que hoy se llama Otowa. Dos años después, un guerrero llamado Sakanoue no Tamuramaro subió a cazar ciervos, conoció al monje, se arrepintió de matar y le ayudó a levantar un templo. Kiyomizu significa eso: agua pura.',
  },
  {
    id: 'kiyo_pagoda',
    city: 'kyoto',
    photo: ["file:Kiyomizu-dera - Pagode Sanjuno-to et hall Kyo-do.jpg"],
    name: 'Pagoda de tres pisos',
    jp: '清水寺・三重塔',
    lat: 34.9954,
    lng: 135.784,
    radius: 30,
    type: 'historia',
    short: 'La pagoda bermellón que se ve desde todo el este de Kioto.',
    story:
      'Esta pagoda de tres pisos, pintada de bermellón brillante, es la silueta de Kiyomizu que se ve desde buena parte de la ciudad. Es una de las pagodas de tres pisos más altas de Japón. La que ves fue reconstruida en 1632. ' +
      'Una pagoda no es un edificio para entrar: es un relicario. Guarda en su centro reliquias o escrituras sagradas, y sus pisos representan los niveles del universo budista. ' +
      'Fíjate en las esquinas de los techos: en las puntas hay pequeños demonios y dragones que vigilan las cuatro direcciones. Y en la cima, el remate de metal con anillos apunta al cielo como una antena entre este mundo y el otro. ' +
      'Desde aquí, si miras hacia atrás, tienes una de las mejores vistas de los tejados de Kioto.',
  },
  {
    id: 'kiyo_hondo',
    city: 'kyoto',
    photo: ["file:Kiyomizu-dera.jpg"],
    name: 'El escenario de Kiyomizu',
    jp: '清水寺・本堂（清水の舞台）',
    lat: 34.99496,
    lng: 135.78505,
    radius: 35,
    type: 'historia',
    short: 'La terraza de madera a 13 metros de altura, sin un solo clavo.',
    story:
      'Estás en el famoso escenario de Kiyomizu, la gran terraza del salón principal. El edificio que te rodea se reconstruyó en 1633 por orden del shōgun Tokugawa Iemitsu, después de que el templo se quemara varias veces. ' +
      'Asómate con cuidado: estás a unos trece metros sobre la ladera, más o menos un edificio de cuatro pisos. Toda la estructura descansa sobre un bosque de enormes pilares de madera ensamblados sin usar clavos. ' +
      'En japonés existe un dicho: saltar desde el escenario de Kiyomizu. Significa tomar una decisión muy arriesgada, lanzarse sin red. Y no es solo un dicho. En la época Edo se creía que si saltabas y sobrevivías, tu deseo se cumpliría. Los registros cuentan 234 saltos, y la gran mayoría sobrevivió, gracias a los árboles y a la pendiente. El gobierno Meiji lo prohibió en 1872. ' +
      'Dentro del salón se venera a Kannon, la diosa de la compasión, con once cabezas y mil brazos. Es una imagen secreta: solo se muestra al público una vez cada treinta y tres años. ' +
      'Detrás del salón está el santuario Jishu, el del amor, con sus dos piedras para caminar con los ojos cerrados. Ahora mismo está cerrado por obras de restauración.',
  },
  {
    id: 'kiyo_okunoin',
    city: 'kyoto',
    photo: ["file:Kiyomizu-dera, Kyoto, November 2016 -01.jpg"],
    name: 'Mirador del Okunoin',
    jp: '清水寺・奥の院',
    lat: 34.99455,
    lng: 135.7858,
    radius: 30,
    type: 'historia',
    short: 'La mejor vista del escenario, con Kioto de fondo.',
    story:
      'Date vuelta. Desde aquí tienes la foto más famosa de Kiyomizu: el gran escenario de madera suspendido sobre el bosque, con Kioto extendiéndose detrás. ' +
      'Este pequeño salón es el Okunoin, el santuario interior. Fue reconstruido al mismo tiempo que el salón principal, en 1633, y también tiene su propio escenario de madera. Está construido justo encima de la cascada Otowa, el lugar donde, según la leyenda, todo comenzó. ' +
      'Ahora, a mediados de noviembre, los arces de esta ladera empiezan a ponerse rojos. Los japoneses tienen una palabra para salir a contemplarlos: momijigari, literalmente, cazar hojas rojas. ' +
      'Tómate un momento. Este es un buen lugar para la foto.',
  },
  {
    id: 'kiyo_otowa',
    city: 'kyoto',
    photo: ["file:Otowa waterfall, Kiyomizu-dera.jpg"],
    name: 'Cascada Otowa',
    jp: '音羽の滝',
    lat: 34.9944,
    lng: 135.78525,
    radius: 30,
    type: 'historia',
    short: 'Tres chorros de agua sagrada: elige solo uno.',
    story:
      'Llegaste a la cascada Otowa, el corazón de Kiyomizu. De aquí viene el nombre del templo: kiyoi mizu, agua pura. Según la leyenda, este es el lugar donde el monje Enchin encontró la fuente que vio en su sueño, y donde el guerrero Tamuramaro calmó su sed. ' +
      'El agua cae en tres chorros. La tradición popular dice que cada uno da una bendición distinta: larga vida, éxito en los estudios y suerte en el amor. ' +
      'Pero ojo con la regla: se toma de uno solo. Beber de los tres se considera codicia, y dicen que trae mala suerte. ' +
      'Toma uno de los cucharones de mango largo, recoge un poco de agua y bebe. Los cucharones se esterilizan con luz ultravioleta en esas cajas. Y mientras haces la fila, mira hacia arriba: estás justo debajo de los pilares del gran escenario.',
  },
  {
    id: 'sannenzaka',
    city: 'kyoto',
    photo: ["ja:産寧坂", "search:ja:三年坂 京都"],
    name: 'Sannenzaka',
    jp: '三年坂（産寧坂）',
    lat: 34.9976,
    lng: 135.7812,
    radius: 40,
    type: 'historia',
    short: 'La calle de piedra donde no te puedes caer.',
    story:
      'Estás en Sannenzaka, la cuesta de los tres años, con sus escalones de piedra y sus casas de madera. Camina con cuidado, y no lo digo solo por los escalones. ' +
      'Dice la leyenda que quien se cae en esta cuesta morirá en tres años. Por eso, en las tiendas de la zona vas a ver calabazas secas, las hyōtan: se dice que protegen contra esa mala suerte. ' +
      'El nombre tiene otra explicación más amable. También se escribe Sannei-zaka, la cuesta del parto tranquilo, porque por aquí subían las mujeres embarazadas a rezar a la Kannon de Kiyomizu por un buen parto. ' +
      'Hoy está llena de tiendas de cerámica, dulces y té. Si tienes hambre, es buen momento para probar un yatsuhashi, el dulce típico de Kioto, de masa de arroz con canela.',
  },
  {
    id: 'ninenzaka',
    city: 'kyoto',
    photo: ["ja:二寧坂", "search:ja:二年坂 京都"],
    name: 'Ninenzaka',
    jp: '二年坂（二寧坂）',
    lat: 34.9986,
    lng: 135.7807,
    radius: 40,
    type: 'historia',
    short: 'La hermana menor de Sannenzaka, con un Starbucks de tatami.',
    story:
      'Esta es Ninenzaka, la cuesta de los dos años, la hermana menor de Sannenzaka. Y sí, tiene su propia versión de la leyenda: aquí, si te caes, te quedarían dos años. ' +
      'Estas calles conservan el aspecto de un barrio de comerciantes de los siglos pasados, y están protegidas para que las casas mantengan su estilo tradicional. Fíjate en las rejas de madera de las fachadas, las celosías: dejan ver hacia afuera sin que los de afuera vean hacia adentro. ' +
      'Una curiosidad moderna: en esta calle hay un Starbucks dentro de una casa tradicional de más de cien años, sin letrero luminoso, donde puedes tomar tu café sentado en tatami. ' +
      'Sigue bajando: al final te espera la pagoda de Yasaka, la última parada.',
  },

  // ── Palacio Imperial de Kioto (Kyoto Gyoen) ──
  {
    id: 'sakaimachi',
    city: 'kyoto',
    photo: ["en:Kyoto_Gyoen", "ja:京都御苑"],
    short: 'El antiguo barrio de nobles convertido en parque.',
    name: 'Parque Kyoto Gyoen',
    jp: '京都御苑・堺町御門',
    lat: 35.0172,
    lng: 135.7623,
    radius: 60,
    type: 'historia',
    story:
      'Estás entrando al Kyoto Gyoen, el gran parque que rodea el Palacio Imperial. Mira el ancho camino de gravilla blanca, los pinos y el silencio. Cuesta imaginarlo, pero hace ciento cincuenta años esto no era un parque: era un barrio apretado, con cerca de doscientas mansiones de nobles de la corte, los kuge, todas alrededor del palacio del emperador. ' +
      'En 1869 el emperador Meiji se trasladó a Tokio, y la corte entera lo siguió. Las mansiones quedaron vacías y empezaron a caerse a pedazos. Se cuenta que cuando el emperador volvió de visita en 1877 y vio el abandono, se entristeció y ordenó preservar el palacio y su entorno. Las casas de los nobles se demolieron y el terreno se transformó en este parque. ' +
      'Las puertas que ves en el contorno, como esta, eran las entradas a aquel antiguo barrio de nobles. Hoy, por esta misma puerta salen los desfiles de dos de los grandes festivales de Kioto, el Aoi Matsuri en mayo y el Jidai Matsuri en octubre.',
  },
  {
    id: 'hamaguri',
    city: 'kyoto',
    photo: ["ja:蛤御門", "en:Kinmon_incident"],
    short: 'La puerta con agujeros de bala de la batalla de 1864.',
    name: 'Puerta Hamaguri',
    jp: '蛤御門',
    lat: 35.0227,
    lng: 135.7596,
    radius: 50,
    type: 'recreacion',
    story:
      'Esta es la puerta Hamaguri, la puerta de la almeja. Su nombre viene de una historia curiosa: era una puerta que casi nunca se abría, hasta que en el gran incendio de 1788 por fin la abrieron, como una almeja que se abre con el fuego. Lo que sigue es una recreación basada en los hechos. ' +
      'Agosto de 1864. ¿Recuerdas el Ikedaya, el ataque del Shinsengumi a los rebeldes de Chōshū? Pocas semanas después, Chōshū responde. Miles de sus soldados marchan sobre Kioto para recuperar su influencia ante el emperador. ' +
      'Al amanecer, aquí mismo, estallan los disparos. Defienden el palacio los samuráis de Aizu y, llegando como refuerzo, los de Satsuma, al mando de un hombre corpulento llamado Saigō Takamori. El mismo que, según la tradición, se reunía en secreto en la casa de té Ichiriki de Gion. ' +
      'Chōshū es derrotado. Pero la guerra se escapa de los muros: el fuego se extiende por la ciudad y arde durante días, destruyendo decenas de miles de casas. ' +
      'Acércate a las vigas de la puerta y busca las marcas: se dice que son agujeros de bala de esa mañana. Y un giro final: apenas dos años después, Satsuma y Chōshū, enemigos aquí, firmaron una alianza secreta. Juntos derribaron al shogunato en 1868.',
  },
  {
    id: 'kenreimon',
    city: 'kyoto',
    photo: ["file:Kyoto-gosho Kenreimon (open).JPG"],
    short: 'La puerta reservada solo para el emperador.',
    name: 'Puerta Kenreimon',
    jp: '建礼門',
    lat: 35.0226,
    lng: 135.7622,
    radius: 45,
    type: 'historia',
    story:
      'Frente a ti está la puerta Kenreimon, la puerta principal del sur del Palacio Imperial. Fíjate en su techo de corteza de ciprés, sin una sola teja, y en su sencillez casi severa: así es la elegancia de la corte, sin dorados ni excesos. ' +
      'Esta puerta tradicionalmente estaba reservada al emperador. Ni los nobles más poderosos pasaban por aquí; ellos usaban otras puertas laterales, según su rango. Hasta hoy permanece cerrada casi todo el año y solo se abre en ocasiones muy especiales. ' +
      'Detrás de estos muros está el corazón del palacio, el gran salón de ceremonias. Los visitantes entran por la puerta Seishomon, en el lado oeste, siguiendo el muro hacia la izquierda.',
  },
  {
    id: 'seishomon',
    city: 'kyoto',
    photo: ["ja:京都御所", "en:Kyoto_Imperial_Palace"],
    short: 'La entrada gratuita al Palacio Imperial.',
    name: 'Entrada al Palacio (Seishomon)',
    jp: '京都御所・清所門',
    lat: 35.0262,
    lng: 135.7607,
    radius: 45,
    type: 'historia',
    story:
      'Esta es la puerta Seishomon, la entrada de los visitantes al Palacio Imperial de Kioto. Hace siglos era una puerta de servicio, por donde entraban los cocineros y las provisiones de la cocina imperial. Hoy entras gratis, pasando un control de seguridad. ' +
      'Un dato que sorprende a muchos: este no es el palacio original de Kioto. El primer gran palacio, de cuando se fundó la ciudad en el año 794, estaba más al oeste y desapareció hace muchos siglos entre incendios y abandono. Los emperadores pasaron entonces a vivir en residencias temporales, y una de ellas, en este lugar, terminó convirtiéndose en el palacio definitivo desde el siglo catorce. ' +
      'Los edificios que vas a ver se quemaron y reconstruyeron varias veces. Los actuales son de 1855, construidos imitando con cuidado el estilo de la época Heian. Trece años después, el emperador se iría a Tokio para siempre.',
  },
  {
    id: 'shishinden',
    city: 'kyoto',
    photo: ["ja:紫宸殿", "en:Kyoto_Imperial_Palace"],
    short: 'El salón donde se coronaban los emperadores.',
    name: 'Salón Shishinden',
    jp: '紫宸殿',
    lat: 35.0245,
    lng: 135.7622,
    radius: 40,
    type: 'historia',
    story:
      'Este es el Shishinden, el salón de las ceremonias de Estado, el edificio más importante del palacio. Mira el gran patio cubierto de arena blanca: aquí se alineaban los nobles en las grandes ocasiones, cada uno en su puesto según su rango. ' +
      'Delante de la escalera hay dos árboles. Si miras el salón de frente, a tu derecha está un cerezo y a tu izquierda un naranjo tachibana. Representan a las guardias imperiales de la izquierda y de la derecha, vistas desde el trono, y esa disposición se ha mantenido durante siglos. ' +
      'En este salón se coronaron los emperadores Taishō, en 1915, y Shōwa, en 1928. Adentro se guarda el Takamikura, el trono imperial. Para las entronizaciones más recientes, celebradas en Tokio, este trono fue desmontado y llevado hasta allá, como un hilo que une al Japón moderno con esta antigua capital.',
  },

  // ── Arashiyama y Kinkaku-ji ──
  {
    "id": "togetsukyo",
    "city": "kyoto",
    "photo": [
      "ja:渡月橋",
      "en:Togetsukyō"
    ],
    "name": "Puente Togetsukyō",
    "jp": "渡月橋",
    "lat": 35.0129,
    "lng": 135.6777,
    "radius": 60,
    "type": "historia",
    "short": "El puente por donde cruza la luna, símbolo de Arashiyama.",
    "story": "Estás en el puente Togetsukyō, el símbolo de Arashiyama. Su nombre significa el puente por donde cruza la luna. Cuenta la tradición que en el siglo trece el emperador Kameyama paseaba en bote una noche de luna llena, y le pareció que la luna atravesaba el puente de un lado a otro. De ahí el nombre. Mira a tu alrededor: el río, las montañas cubiertas de bosque. Desde la época Heian, los nobles de la capital venían hasta aquí a pasear en bote, recitar poemas y contemplar la luna. En otoño, como ahora, las laderas se tiñen de rojo y amarillo. El puente que pisas es de 1934. Por dentro tiene una estructura moderna, pero sus barandas de madera mantienen el aspecto antiguo, y por eso aparece tanto en películas de época. Un detalle curioso: aquí el río cambia de nombre. Río arriba se le conoce como Hozu y, río abajo, como Katsura."
  },
  {
    "id": "tenryuji",
    "city": "kyoto",
    "photo": [
      "en:Tenryū-ji",
      "ja:天龍寺"
    ],
    "name": "Templo Tenryū-ji",
    "jp": "天龍寺",
    "lat": 35.01596,
    "lng": 135.67377,
    "radius": 70,
    "type": "historia",
    "short": "El templo del dragón celestial y un jardín de 700 años.",
    "story": "Estás en Tenryū-ji, el templo del dragón celestial, el más importante de Arashiyama y Patrimonio de la Humanidad. Su historia nace de una culpa. En 1339 murió el emperador Go-Daigo, enemigo del hombre más poderoso de Japón, el shōgun Ashikaga Takauji, que primero había luchado a su lado y luego se volvió contra él. Tras la muerte del emperador, el shōgun, aconsejado por el monje zen Musō Soseki, levantó este templo para honrar su memoria y calmar su espíritu. Lo hizo justo aquí, donde Go-Daigo había crecido, en el antiguo palacio de su abuelo, el emperador Kameyama, el mismo que bautizó el puente. ¿Y el dragón? Se cuenta que el hermano del shōgun soñó con un dragón dorado que se elevaba desde el río. Para pagar la construcción enviaron incluso un barco comercial a China, al que llamaron el barco de Tenryū-ji. No te pierdas el jardín Sōgenchi, diseñado por Musō Soseki hace unos setecientos años y que aún conserva su forma original. Fíjate cómo las montañas de detrás parecen parte del jardín: es la técnica del paisaje prestado. Y si entras al salón del Dharma, mira el techo: un dragón entre nubes pintado en 1997 por el artista Kayama Matazō."
  },
  {
    "id": "nonomiya",
    "city": "kyoto",
    "photo": [
      "ja:野宮神社",
      "en:Nonomiya_Shrine"
    ],
    "name": "Santuario Nonomiya",
    "jp": "野宮神社",
    "lat": 35.01778,
    "lng": 135.67417,
    "radius": 35,
    "type": "historia",
    "short": "El santuario del torii negro, donde se purificaban las princesas.",
    "story": "Este pequeño santuario rodeado de bambú es Nonomiya. Fíjate en su torii: no es rojo, sino oscuro, hecho con troncos sin descortezar. Es un kuroki torii, una de las formas más antiguas de torii en Japón. En la época Heian, aquí vivían durante un año o más las princesas imperiales elegidas para servir en el gran santuario de Ise. Se purificaban en este lugar antes del viaje. Este santuario aparece en La historia de Genji, la gran novela del siglo once, en una despedida melancólica entre el protagonista y una dama que se preparaba para partir. Hoy la gente viene a pedir por el amor y los buenos encuentros. Busca una piedra lisa llamada okame-ishi: dicen que trae suerte acariciarla mientras pides un deseo."
  },
  {
    "id": "chikurin",
    "city": "kyoto",
    "photo": ["file:2021 Sagano Bamboo forest in Arashiyama, Kyoto, Japan.jpg"],
    "name": "Bosque de bambú de Sagano",
    "jp": "竹林の小径",
    "lat": 35.0172,
    "lng": 135.671,
    "radius": 60,
    "type": "historia",
    "short": "El camino entre bambúes gigantes que suena como el mar.",
    "story": "Bienvenido al bosque de bambú de Sagano. Cierra los ojos un momento y escucha. Ese crujido de los tallos, ese susurro de las hojas allá arriba. En 1996, el Ministerio del Medio Ambiente de Japón eligió este sonido como uno de los cien paisajes sonoros del país, una lista creada para proteger los sonidos que la gente quiere conservar, en una época de cada vez más ruido. El bambú que te rodea es moso, una especie gigante que puede superar los veinte metros de altura. Y crece a una velocidad asombrosa: un brote joven puede alargarse cerca de un metro en un solo día. Fíjate en las cercas bajas a los lados del camino: están hechas de ramas secas atadas a mano. Una petición de respeto: hubo visitantes que grabaron sus nombres en los tallos, y esas heridas se vuelven negras y no se borran. Míralo, escúchalo, pero no lo toques. Y si algún día quieres el bosque casi para ti solo, ven muy temprano en la mañana."
  },
  {
    "id": "okochi",
    "city": "kyoto",
    "photo": [
      "ja:大河内山荘",
      "en:Ōkōchi_Sansō"
    ],
    "name": "Villa Ōkōchi Sansō",
    "jp": "大河内山荘",
    "lat": 35.01727,
    "lng": 135.66935,
    "radius": 45,
    "type": "historia",
    "short": "El jardín de una estrella del cine de samuráis, con té matcha.",
    "story": "Al final del bosque de bambú está la entrada a Ōkōchi Sansō, la villa de un actor de cine. Ōkōchi Denjirō fue una de las grandes estrellas de las películas de samuráis de antes de la Segunda Guerra Mundial. Se dice que, a los treinta y cuatro años, quiso crear una belleza que durara más que sus películas. Durante unos treinta años invirtió aquí gran parte de lo que ganaba, diseñando él mismo un jardín de dos hectáreas en la ladera del monte Ogura. Murió en 1962, y después la villa se abrió al público. La entrada es pagada, pero incluye un té matcha con un dulce tradicional. Desde lo alto hay una vista amplia de Kioto, y en otoño, como ahora, es uno de los rincones más bonitos de Arashiyama."
  },
  {
    "id": "kinkaku_view",
    "city": "kyoto",
    "photo": ["file:Kinkaku-ji (Golden Pavillon).jpg"],
    "name": "Pabellón Dorado",
    "jp": "金閣寺（鹿苑寺）",
    "lat": 35.0388,
    "lng": 135.7293,
    "radius": 40,
    "type": "historia",
    "short": "El pabellón cubierto de oro reflejado en el estanque espejo.",
    "story": "Ahí está: el Pabellón Dorado, reflejado en el estanque Kyōkochi, el estanque espejo. Este lugar fue primero la villa de un noble, Saionji Kintsune. En 1397, el shōgun Ashikaga Yoshimitsu, que había dejado el cargo pero seguía siendo el hombre más poderoso de Japón, la adquirió y construyó aquí su residencia de retiro. Desde aquí recibía a embajadores y organizaba encuentros de arte, teatro y poesía. Cuando murió, según su voluntad, la villa se convirtió en templo zen. Su nombre oficial es Rokuon-ji. Fíjate en los tres pisos: cada uno tiene un estilo distinto. El primero, de madera natural, recuerda los palacios de la nobleza. El segundo sigue el estilo de las casas de los samuráis, y el tercero, el de un templo zen. Los dos pisos superiores están cubiertos de pan de oro. En la cima, un fénix dorado mira hacia el sur. Un consejo: el recorrido dentro del templo es en un solo sentido, así que saca tus fotos aquí antes de seguir."
  },
  {
    "id": "kinkaku_pine",
    "city": "kyoto",
    "photo": ["file:Rikushu-no-matsu pine tree in Rokuonji Temple.JPG"],
    "name": "El incendio y el pino barco",
    "jp": "陸舟の松",
    "lat": 35.0395,
    "lng": 135.7299,
    "radius": 25,
    "type": "historia",
    "short": "Un incendio en 1950 y un bonsái de 600 años con forma de barco.",
    "story": "Ahora que estás más cerca, un secreto: este pabellón no es el original. En julio de 1950, un joven monje novicio le prendió fuego. El edificio, que había sobrevivido más de quinientos años, ardió por completo, junto con una antigua estatua de Yoshimitsu. El caso conmocionó a Japón e inspiró una novela famosa de Yukio Mishima, El pabellón de oro, publicada en 1956. El pabellón se reconstruyó en 1955 copiando el original. En 1987 se volvió a cubrir con una lámina de oro nueva, varias veces más gruesa que la anterior. Por eso brilla tanto. Algo sí se salvó: el fénix original del techo, que en ese momento estaba guardado para su restauración. Y ahora mira este pino con forma de barco: el Rikushū no matsu, el pino barco en tierra. Según la tradición, fue un bonsái del propio Yoshimitsu que luego se plantó en la tierra y se fue moldeando como una embarcación. Tiene más de seiscientos años, y su proa apunta al oeste, hacia la Tierra Pura del budismo."
  },
  {
    "id": "anmintaku",
    "city": "kyoto",
    "photo": [],
    "noAutoPhoto": true,
    "name": "Estanque Anmintaku",
    "jp": "安民沢",
    "lat": 35.04,
    "lng": 135.7293,
    "radius": 25,
    "type": "historia",
    "short": "El estanque que nunca se seca y el manantial del té del shōgun.",
    "story": "Detrás del pabellón, el camino sube entre árboles y musgo. Cerca de aquí está el Gingasen, un manantial de donde, según la tradición, Yoshimitsu sacaba agua para preparar su té. Un poco más arriba está el estanque Anmintaku. Dicen que nunca se ha secado, ni siquiera en las peores sequías. En su pequeña isla hay una pagoda de piedra dedicada a la deidad protectora de la familia Saionji, los antiguos dueños de este lugar; según la tradición, una serpiente blanca. Verás también estatuillas de piedra rodeadas de monedas: la gente las lanza y, si acierta, dicen que trae buena suerte. Y desde la parte alta tienes una vista del pabellón por detrás, que casi nadie fotografía."
  },
  {
    "id": "sekkatei",
    "city": "kyoto",
    "photo": [],
    "noAutoPhoto": true,
    "name": "Casa de té Sekkatei",
    "jp": "夕佳亭・不動堂",
    "lat": 35.0401,
    "lng": 135.7302,
    "radius": 25,
    "type": "historia",
    "short": "Una casita de té de paja para ver el oro al atardecer.",
    "story": "Esta casita de té con techo de paja es el Sekkatei. Se construyó en la época Edo, y su nombre alude a la belleza del atardecer: desde aquí, el pabellón se veía especialmente hermoso con la última luz de la tarde. No se puede entrar, pero puedes asomarte a su interior pequeño y sencillo, de apenas unos tatamis. Es lo opuesto al oro del pabellón, y esa es la estética del té: la belleza de lo humilde. Antes de la salida verás el Fudō-dō, un pequeño salón que guarda imágenes de Fudō Myōō, el protector de rostro feroz que, con su espada, corta los malos pensamientos. Y junto a la salida hay un puesto donde puedes tomar matcha con un dulce, si quieres descansar antes de seguir."
  },
  {
    "id": "ryoanji",
    "city": "kyoto",
    "photo": [
      "en:Ryōan-ji",
      "ja:龍安寺"
    ],
    "name": "Jardín de piedras de Ryōan-ji",
    "jp": "龍安寺",
    "lat": 35.03444,
    "lng": 135.71833,
    "radius": 60,
    "type": "historia",
    "short": "Quince piedras en grava blanca: nunca las verás todas a la vez.",
    "story": "Has llegado a Ryōan-ji, el templo del dragón en paz. Lo fundó en 1450 Hosokawa Katsumoto, un poderoso señor de la guerra, en lo que antes había sido una finca de nobles. Pocos años después estalló la guerra de Ōnin, en la que Katsumoto encabezaba uno de los bandos, y el templo ardió. Su hijo lo reconstruyó en 1488. Lo que vienes a ver es su jardín seco: un rectángulo de grava blanca rastrillada con quince piedras, sin un solo árbol. Siéntate en la terraza y cuéntalas. Desde cualquier lugar donde te sientes, siempre habrá una piedra escondida: nunca verás las quince a la vez. Hay quien dice que solo alguien iluminado podría verlas todas. Nadie sabe con certeza quién diseñó el jardín ni qué representa. Hay quien ve islas en el mar, o una tigresa cruzando un río con sus cachorros. Esa incertidumbre es parte de su gracia. Antes de irte, busca detrás del edificio la fuente de piedra, la tsukubai. Alrededor del agujero central hay cuatro caracteres que, leídos junto con el cuadrado del centro, forman una frase zen: yo solo sé estar satisfecho. Y date un paseo por el estanque Kyōyōchi, también llamado el estanque de los patos mandarines."
  },
];

// ── Entradas ──
// Precio adulto en yenes, verificado en noviembre de 2026. cash: llevar efectivo.
// Los precios cambian: se muestran como referencia.
// Lugares de otras ciudades (cada ciudad en su propio archivo)
PLACES.push(...TOKYO, ...TOKYO2, ...NARA);

export const FEES = {
  kiyo_hondo: { yen: 500, cash: true, note: 'Salón principal y escenario de Kiyomizu-dera.' },
  tenryuji: {
    yen: 500,
    cash: true,
    note: 'Solo jardín. Salones +¥300. Dragón del techo +¥500 (fines de semana, feriados y temporadas especiales).',
  },
  okochi: { yen: 1000, cash: true, note: 'Incluye té matcha con un dulce.' },
  kinkaku_view: { yen: 500, cash: true, note: 'La entrada es un amuleto de papel: guárdala.' },
  ryoanji: { yen: 600, cash: true },
  kenninji: { yen: 800, cash: true },
  nara_daibutsuden: { yen: 800, cash: true, note: 'Salón del Gran Buda. Con el museo de Tōdai-ji: ¥1200.' },
  nara_kasuga: { yen: 700, cash: true, note: 'Solo el corredor interior junto al santuario principal. El resto es gratis.' },
  tk_shibuyasky: { yen: 2700, cash: false, note: 'Entrada con hora fija. Por internet: ¥2.700 antes de las 15:00 y ¥3.400 desde las 15:00. En la ventanilla, ¥300 más. Se paga con tarjeta.' },
  ue_toshogu: { yen: 500, cash: true, note: 'Para pasar la puerta dorada (Karamon) y ver el salón de cerca. El resto del santuario es gratis.' },
  kk_seimon: { yen: 300, cash: true, note: 'Entrada al jardín. Se entra solo por la puerta oeste.' },
  tk_kiyomasa: { yen: 500, cash: true, note: 'Jardín interior (Gyoen). En invierno abre de 9:00 a 16:00.' },
};
PLACES.forEach((p) => {
  if (FEES[p.id]) p.fee = FEES[p.id];
});
