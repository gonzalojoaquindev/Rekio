// Gion Audioguía — MVP
// Pegar este archivo completo como App.js en https://snack.expo.dev
// Dependencias (Snack las detecta solo): expo-location, expo-speech, expo-keep-awake

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  StatusBar,
  Switch,
} from 'react-native';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import { useKeepAwake } from 'expo-keep-awake';
import MapPanel from './MapPanel';
import PointPhoto from './PointPhoto';

// ─────────────────────────────────────────────────────────────
// 1. CONTENIDO: puntos del recorrido
//    type: 'historia'   → hechos documentados
//          'recreacion' → escena imaginada, basada en hechos y costumbres
//    radius: metros alrededor del punto donde se activa el relato
// ─────────────────────────────────────────────────────────────
const POINTS = [
  {
    id: 'ikedaya',
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
    photo: ["ja:巽橋", "search:ja:祇園白川 巽橋"],
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
    photo: ["ja:清水寺", "en:Kiyomizu-dera"],
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
    photo: ["search:ja:清水寺 三重塔"],
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
    photo: ["search:ja:清水の舞台", "en:Kiyomizu-dera"],
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
    photo: ["search:ja:清水寺 奥の院"],
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
    photo: ["search:ja:音羽の滝 清水寺"],
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
    photo: ["ja:建礼門", "en:Kyoto_Imperial_Palace"],
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
];


// ─────────────────────────────────────────────────────────────
// 1b. RECORRIDOS GUIADOS
//     guide: indicación para llegar a esa parada desde la anterior
// ─────────────────────────────────────────────────────────────
const TOURS = [
  {
    id: 'palacio',
    name: 'Palacio Imperial de Kioto',
    jp: '京都御所',
    summary: '5 paradas · unos 2 km a pie · 1 hora y media aprox.',
    intro:
      'Bienvenido al recorrido del Palacio Imperial de Kioto. Durante más de quinientos años, los emperadores de Japón vivieron detrás de estos muros. Te voy a ir guiando parada por parada. Cuando llegues a cada punto, te contaré su historia.',
    stops: [
      {
        id: 'sakaimachi',
        guide:
          'Primera parada: la puerta Sakaimachi, la entrada sur del parque Kyoto Gyoen, sobre la calle Marutamachi. Si no estás ahí, toca el botón Cómo llegar y Google Maps te lleva.',
      },
      {
        id: 'kenreimon',
        guide:
          'Ahora camina derecho hacia el norte por el gran camino de gravilla, unos seiscientos metros. Al fondo verás un muro largo color crema, con cinco líneas blancas horizontales: esas líneas indican el rango más alto, el de la casa imperial. La puerta del centro de ese muro es Kenreimon. Ahí te espero.',
      },
      {
        id: 'hamaguri',
        guide:
          'Ahora gira a la izquierda, hacia el oeste. Camina unos doscientos cincuenta metros, dejando atrás la esquina del muro, hasta la puerta del parque que da a la avenida Karasuma. Es una puerta grande de madera oscura, con refuerzos de hierro.',
      },
      {
        id: 'seishomon',
        guide:
          'Vuelve hacia el muro del palacio y camina hacia el norte, siguiéndolo por su lado oeste, unos cuatrocientos metros. Busca la fila de visitantes y el control de seguridad: esa es la puerta Seishomon, la entrada al palacio.',
      },
      {
        id: 'shishinden',
        guide:
          'Entra, pasa el control y sigue la ruta señalizada. Pasarás por el pórtico de carruajes y las salas de espera de los nobles. Avanza hasta ver un gran patio de arena blanca con un salón enorme al fondo y dos árboles frente a su escalera. Ese es el Shishinden.',
      },
    ],
    outro:
      'Aquí termina el recorrido del Palacio Imperial. Desde estos muros se gobernó, al menos en nombre, Japón durante siglos, y aquí se vivieron los últimos días del Japón de los samuráis. Gracias por caminar conmigo. Si te queda energía, el resto del palacio y sus jardines siguen por la ruta señalizada.',
  },
  {
    id: 'kiyomizu',
    name: 'Kiyomizu-dera y Higashiyama',
    jp: '清水寺・産寧坂',
    summary: '8 paradas · unos 2 km a pie, cuesta abajo al final · 2 horas aprox.',
    intro:
      'Bienvenido a Kiyomizu-dera, el templo del agua pura, uno de los lugares más queridos de Japón y Patrimonio de la Humanidad. Vamos a recorrer el templo desde su gran puerta roja y luego bajar por las calles de piedra hasta la pagoda de Yasaka. Te voy guiando.',
    stops: [
      {
        id: 'kiyo_niomon',
        guide:
          'Primera parada: la gran puerta roja de Kiyomizu-dera, al final de la cuesta Kiyomizu-zaka, la calle de tiendas que sube al templo. Si no estás ahí, toca Cómo llegar.',
      },
      {
        id: 'kiyo_pagoda',
        guide:
          'Sube las escaleras de la puerta y sigue hacia la derecha. A pocos pasos verás la pagoda bermellón de tres pisos.',
      },
      {
        id: 'kiyo_hondo',
        guide:
          'Sigue el camino principal hacia el este. Pasarás la boletería: la entrada al salón principal es pagada. Continúa hasta salir a la gran terraza de madera.',
      },
      {
        id: 'kiyo_okunoin',
        guide:
          'Sal del salón principal y sigue el camino que bordea la ladera hacia el sureste. A unos cien metros está el Okunoin. Cuando llegues, date vuelta para ver el escenario.',
      },
      {
        id: 'kiyo_otowa',
        guide:
          'Baja por las escaleras de piedra que salen cerca del Okunoin. Al pie del escenario verás una fila de gente frente a tres chorros de agua: es la cascada Otowa.',
      },
      {
        id: 'sannenzaka',
        guide:
          'Ahora sal del templo de vuelta por la puerta roja y baja por la calle de tiendas. A unos doscientos metros, a mano derecha, verás unas escaleras de piedra que bajan: ese es Sannenzaka. Cuidado con los escalones.',
      },
      {
        id: 'ninenzaka',
        guide:
          'Baja por Sannenzaka hasta el final de la cuesta y sigue por la calle de piedra hacia la izquierda. En unos cien metros entras a Ninenzaka.',
      },
      {
        id: 'yasakato',
        guide:
          'Al final de Ninenzaka sigue las calles de piedra hacia el sur, unos doscientos metros. La pagoda de cinco pisos te va a aparecer de frente, entre las casas.',
      },
    ],
    outro:
      'Aquí termina el recorrido de Kiyomizu. Recorriste un templo fundado hace más de mil doscientos años, bebiste del agua que le dio su nombre y bajaste por calles donde, dicen, no conviene tropezar. Si te quedan energías, desde aquí puedes seguir hacia Gion caminando hacia el norte.',
  },
];

// ─────────────────────────────────────────────────────────────
// 2. UTILIDADES GEO
// ─────────────────────────────────────────────────────────────
const toRad = (x) => (x * Math.PI) / 180;
const toDeg = (x) => (x * 180) / Math.PI;

function distanceM(a, b) {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function bearingDeg(a, b) {
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const dLng = toRad(b.lng - a.lng);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

const DIRS = ['norte', 'noreste', 'este', 'sureste', 'sur', 'suroeste', 'oeste', 'noroeste'];
const dirName = (deg) => DIRS[Math.round(deg / 45) % 8];

const RATE = 0.88; // velocidad de lectura (1 = normal)

const voiceLabel = (v) => {
  if (!v) return 'predeterminada';
  const kind = /network/i.test(v.identifier || '')
    ? 'natural, usa internet'
    : v.quality === 'Enhanced'
    ? 'alta calidad'
    : 'estándar';
  return `${v.language} · ${kind}`;
};

const fmtDist = (m) => (m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`);

// ─────────────────────────────────────────────────────────────
// 3. APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  useKeepAwake(); // mantiene la pantalla encendida mientras la app está abierta

  const [gps, setGps] = useState(null); // { lat, lng, acc }
  const [gpsError, setGpsError] = useState(null);
  const [sim, setSim] = useState(null); // ubicación simulada { lat, lng, label }
  const [auto, setAuto] = useState(true);
  const [speakingId, setSpeakingId] = useState(null);
  const [heard, setHeard] = useState(new Set());
  const [expandedId, setExpandedId] = useState(null);
  const [voice, setVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  const [tour, setTour] = useState(null);

  // refs para que los callbacks de voz vean siempre el estado actual
  const speakingRef = useRef(null);
  const queueRef = useRef([]);
  const heardRef = useRef(new Set());

  const here = sim || gps;

  // ── Voz en español: ordena las voces de mejor a peor calidad ──
  useEffect(() => {
    const score = (v) => {
      let s = 0;
      if (v.quality === 'Enhanced') s += 4; // voces de alta calidad
      if (/network/i.test(v.identifier || '')) s += 3; // voces neuronales de Google (usan internet)
      if (/es[-_](us|mx|419|cl)/i.test(v.language)) s += 2; // español latino primero
      return s;
    };
    const load = () =>
      Speech.getAvailableVoicesAsync()
        .then((all) => {
          const es = all
            .filter((v) => v.language && v.language.toLowerCase().startsWith('es'))
            .sort((a, b) => score(b) - score(a));
          if (es.length) {
            setVoices(es);
            setVoice((cur) => cur || es[0]);
          }
        })
        .catch(() => {});
    load();
    const retry = setTimeout(load, 2000); // en Android las voces a veces cargan tarde
    return () => {
      clearTimeout(retry);
      Speech.stop();
    };
  }, []);

  const nextVoice = () => {
    if (!voices.length) return;
    const i = voices.findIndex((v) => voice && v.identifier === voice.identifier);
    const v = voices[(i + 1) % voices.length];
    setVoice(v);
    Speech.stop();
    Speech.speak('Hola, esta es la voz que te va a acompañar por Kioto.', {
      language: v.language,
      voice: v.identifier,
      rate: RATE,
    });
  };

  // ── GPS ──
  useEffect(() => {
    let sub = null;
    let cancelled = false;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsError('Sin permiso de ubicación. Actívalo en Ajustes para usar el modo guía.');
        return;
      }
      const s = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 3000,
          distanceInterval: 3,
        },
        (loc) =>
          setGps({
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            acc: loc.coords.accuracy,
          })
      );
      if (cancelled) s.remove();
      else sub = s;
    })().catch((e) => setGpsError(String(e.message || e)));
    return () => {
      cancelled = true;
      if (sub) sub.remove();
    };
  }, []);

  // ── Narración ──
  const markHeard = useCallback((id) => {
    heardRef.current = new Set(heardRef.current).add(id);
    setHeard(heardRef.current);
  }, []);

  const speakPoint = useCallback(
    (p, arrived = false, onComplete = null) => {
      Speech.stop();
      speakingRef.current = p.id;
      setSpeakingId(p.id);

      const intro = arrived ? `Has llegado a: ${p.name}. ` : `${p.name}. `;
      const tag = p.type === 'recreacion' ? 'Recreación histórica. ' : '';

      const finish = (completed) => {
        if (speakingRef.current !== p.id) return; // ya empezó otro relato
        speakingRef.current = null;
        setSpeakingId(null);
        if (completed) {
          markHeard(p.id);
          if (onComplete) onComplete();
          else playNext();
        }
      };

      Speech.speak(intro + tag + p.story, {
        language: voice ? voice.language : 'es-US',
        voice: voice ? voice.identifier : undefined,
        rate: RATE,
        pitch: 1.0,
        onDone: () => finish(true),
        onStopped: () => finish(false),
        onError: () => finish(false),
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [voice, markHeard]
  );

  // Habla un texto de guía (indicaciones del recorrido)
  const say = useCallback(
    (text, onDone = null) => {
      Speech.stop();
      const tok = `__guide${Date.now()}`;
      speakingRef.current = tok;
      setSpeakingId(null);
      const finish = (completed) => {
        if (speakingRef.current !== tok) return;
        speakingRef.current = null;
        if (completed && onDone) onDone();
      };
      Speech.speak(text, {
        language: voice ? voice.language : 'es-US',
        voice: voice ? voice.identifier : undefined,
        rate: RATE,
        pitch: 1.0,
        onDone: () => finish(true),
        onStopped: () => finish(false),
        onError: () => finish(false),
      });
    },
    [voice]
  );

  const playNext = useCallback(() => {
    while (queueRef.current.length) {
      const id = queueRef.current.shift();
      if (!heardRef.current.has(id)) {
        const p = POINTS.find((x) => x.id === id);
        if (p) {
          speakPoint(p, true);
          return;
        }
      }
    }
  }, [speakPoint]);

  const stop = useCallback(() => {
    queueRef.current = [];
    speakingRef.current = null;
    setSpeakingId(null);
    Speech.stop();
  }, []);

  // ── Disparo automático por cercanía ──
  useEffect(() => {
    if (!auto || !here || tour) return; // en recorrido guiado manda el recorrido
    const inside = POINTS.map((p) => ({ p, d: distanceM(here, p) }))
      .filter(
        ({ p, d }) =>
          d <= p.radius &&
          !heardRef.current.has(p.id) &&
          speakingRef.current !== p.id &&
          !queueRef.current.includes(p.id)
      )
      .sort((a, b) => a.d - b.d)
      .map(({ p }) => p.id);
    if (!inside.length) return;
    queueRef.current.push(...inside);
    if (!speakingRef.current) playNext();
  }, [here, auto, tour, playNext]);

  // ─────────────────────────────────────────────
  // RECORRIDO GUIADO
  // tour = { id, idx, phase, simulate }
  //   phase: 'guiding' (dando indicaciones) → 'going' (caminando)
  //          → 'story' (relato) → siguiente parada … → 'done'
  // ─────────────────────────────────────────────
  const tourRef = useRef(null);
  const simTimer = useRef(null);
  const latest = useRef({});
  latest.current = { say, speakPoint };

  const setTourState = (t) => {
    tourRef.current = t;
    setTour(t);
  };

  const tourDef = (t) => TOURS.find((x) => x.id === t.id);
  const stopPoint = (t, idx) => POINTS.find((p) => p.id === tourDef(t).stops[idx].id);

  const teleport = (idx) => {
    const t = tourRef.current;
    if (!t || !t.simulate) return;
    const p = stopPoint(t, idx);
    setSim({ lat: p.lat, lng: p.lng, label: p.name });
  };

  const giveDirections = (t, idx, prefix = '') => {
    setTourState({ ...t, idx, phase: 'guiding' });
    const guide = tourDef(t).stops[idx].guide;
    latest.current.say(prefix + guide, () => {
      const cur = tourRef.current;
      if (!cur || cur.idx !== idx) return;
      setTourState({ ...cur, phase: 'going' });
      if (cur.simulate) {
        clearTimeout(simTimer.current);
        simTimer.current = setTimeout(() => teleport(idx), 1500);
      }
    });
  };

  const tellStory = (t) => {
    const p = stopPoint(t, t.idx);
    setTourState({ ...t, phase: 'story' });
    latest.current.speakPoint(p, true, () => advance());
  };

  const advance = () => {
    const t = tourRef.current;
    if (!t) return;
    const def = tourDef(t);
    const next = t.idx + 1;
    if (next < def.stops.length) {
      giveDirections(t, next);
    } else {
      setTourState({ ...t, phase: 'done' });
      latest.current.say(def.outro);
    }
  };

  const startTour = (def, simulate) => {
    stop();
    clearTimeout(simTimer.current);
    setExpandedId(null);
    if (!simulate) setSim(null);
    const t = { id: def.id, idx: 0, phase: 'guiding', simulate };
    tourRef.current = t;
    giveDirections(t, 0, def.intro + ' ');
  };

  const endTour = () => {
    clearTimeout(simTimer.current);
    const t = tourRef.current;
    setTourState(null);
    stop();
    if (t && t.simulate) setSim(null);
  };

  const skipStep = () => {
    const t = tourRef.current;
    if (!t) return;
    clearTimeout(simTimer.current);
    if (t.phase === 'guiding' || t.phase === 'going') {
      if (t.simulate) teleport(t.idx);
      tellStory(t);
    } else if (t.phase === 'story') {
      Speech.stop();
      advance();
    }
  };

  const repeatStep = () => {
    const t = tourRef.current;
    if (!t) return;
    clearTimeout(simTimer.current);
    if (t.phase === 'story') tellStory(t);
    else if (t.phase === 'done') latest.current.say(tourDef(t).outro);
    else giveDirections(t, t.idx);
  };

  // Llegada a la parada actual
  useEffect(() => {
    const t = tourRef.current;
    if (!t || t.phase !== 'going' || !here) return;
    const p = stopPoint(t, t.idx);
    if (distanceM(here, p) <= p.radius) tellStory(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [here, tour]);

  useEffect(() => () => clearTimeout(simTimer.current), []);

  // ── Lista ordenada por distancia ──
  const rows = useMemo(() => {
    const list = POINTS.map((p, i) => ({
      p,
      order: i + 1,
      d: here ? distanceM(here, p) : null,
      dir: here ? dirName(bearingDeg(here, p)) : null,
    }));
    if (here) list.sort((a, b) => a.d - b.d);
    return list;
  }, [here]);

  // ── Ruta a pie por calles reales para el recorrido activo ──
  const [walkRoutes, setWalkRoutes] = useState({}); // tourId → [[lat,lng],...]
  const [openTourId, setOpenTourId] = useState(null); // tarjeta con paradas desplegadas
  useEffect(() => {
    const id = tour ? tour.id : openTourId;
    if (!id || walkRoutes[id]) return;
    const def = TOURS.find((x) => x.id === id);
    const coords = def.stops
      .map((st) => POINTS.find((p) => p.id === st.id))
      .map((p) => `${p.lng},${p.lat}`)
      .join(';');
    fetch(
      `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${coords}?overview=full&geometries=geojson`,
      { headers: { 'User-Agent': 'Rekio/1.0 (https://github.com/gonzalojoaquindev/Rekio)' } }
    )
      .then((r) => r.json())
      .then((d) => {
        const line = d.routes && d.routes[0] && d.routes[0].geometry.coordinates;
        if (line && line.length > 1) {
          setWalkRoutes((w) => ({ ...w, [id]: line.map(([lng, lat]) => [lat, lng]) }));
        }
      })
      .catch(() => {}); // sin ruta: se dibuja en línea recta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour && tour.id, openTourId]);

  // ── Datos del mapa ──
  const mapData = useMemo(() => {
    if (!tour && openTourId) {
      // vista previa del recorrido desplegado
      const def = TOURS.find((x) => x.id === openTourId);
      const stops = def.stops.map((st) => POINTS.find((p) => p.id === st.id));
      return {
        points: stops.map((p, i) => ({
          id: p.id, name: p.name, lat: p.lat, lng: p.lng, label: String(i + 1), state: 'todo',
        })),
        route: walkRoutes[def.id] || stops.map((p) => [p.lat, p.lng]),
        focus: null,
        fitKey: def.id,
      };
    }
    if (tour) {
      const def = TOURS.find((x) => x.id === tour.id);
      const stops = def.stops.map((st) => POINTS.find((p) => p.id === st.id));
      return {
        points: stops.map((p, i) => ({
          id: p.id,
          name: p.name,
          lat: p.lat,
          lng: p.lng,
          label: String(i + 1),
          state:
            tour.phase === 'done' || i < tour.idx ? 'done' : i === tour.idx ? 'now' : 'todo',
        })),
        route: walkRoutes[tour.id] || stops.map((p) => [p.lat, p.lng]),
        focus: tour.phase === 'done' ? null : stops[tour.idx],
      };
    }
    return {
      points: POINTS.map((p, i) => ({
        id: p.id,
        name: p.name,
        lat: p.lat,
        lng: p.lng,
        label: heard.has(p.id) ? '✓' : String(i + 1),
        state: heard.has(p.id) ? 'done' : 'todo',
      })),
      route: [],
      focus: null,
    };
  }, [tour, heard, walkRoutes, openTourId]);

  const nearest = here ? rows.find((r) => !heard.has(r.p.id)) : null;
  const speakingPoint = POINTS.find((p) => p.id === speakingId);

  const openMaps = (p) =>
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=walking`
    );

  const simulateAt = (p) => {
    setSim({ lat: p.lat, lng: p.lng, label: p.name });
    setExpandedId(null);
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.ink} />
      <ScrollView contentContainerStyle={s.scroll}>
        {/* Encabezado */}
        <Text style={s.kanji}>京都</Text>
        <Text style={s.title}>Rekio</Text>
        <Text style={s.subtitle}>Kioto — camina y escucha su historia</Text>


        {/* Mapa */}
        <MapPanel
          points={mapData.points}
          route={mapData.route}
          focus={mapData.focus}
          fitKey={mapData.fitKey || (tour ? tour.id : 'all')}
          me={here}
          onTapPoint={(id) => !tour && setExpandedId(id)}
        />

        {/* Recorridos guiados */}
        {!tour &&
          TOURS.map((def) => (
            <View key={def.id} style={[s.card, s.tourCard]}>
              <Text style={s.cardLabel}>RECORRIDO GUIADO</Text>
              <Text style={s.playingTitle}>{def.name}</Text>
              <Text style={s.itemJp}>{def.jp}</Text>
              <Text style={s.small}>{def.summary}</Text>
              <TouchableOpacity onPress={() => setOpenTourId(openTourId === def.id ? null : def.id)}>
                <Text style={s.toggle}>
                  {openTourId === def.id ? '▾' : '▸'} Lo que no te puedes perder ({def.stops.length})
                </Text>
              </TouchableOpacity>
              {openTourId === def.id &&
                def.stops.map((st, i) => {
                  const sp = POINTS.find((x) => x.id === st.id);
                  return (
                    <View key={st.id} style={s.hl}>
                      <PointPhoto point={sp} thumb />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={s.hlName}>
                          {i + 1}. {sp.name}
                        </Text>
                        {!!sp.short && <Text style={s.hlShort}>{sp.short}</Text>}
                      </View>
                    </View>
                  );
                })}
              <View style={s.actions}>
                <TouchableOpacity style={s.btn} onPress={() => startTour(def, false)}>
                  <Text style={s.btnText}>▶ Iniciar recorrido</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={() => startTour(def, true)}>
                  <Text style={s.btnGhostText}>Simular recorrido</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

        {tour &&
          (() => {
            const def = TOURS.find((x) => x.id === tour.id);
            const p = POINTS.find((x) => x.id === def.stops[tour.idx].id);
            const d = here ? distanceM(here, p) : null;
            const status =
              tour.phase === 'guiding'
                ? 'Escucha las indicaciones…'
                : tour.phase === 'going'
                ? d != null
                  ? `Camina ${fmtDist(d)} hacia el ${dirName(bearingDeg(here, p))}`
                  : 'Buscando tu ubicación…'
                : tour.phase === 'story'
                ? 'Escuchando la historia'
                : 'Recorrido terminado';
            return (
              <View style={[s.card, s.tourActive]}>
                <Text style={s.cardLabel}>
                  {tour.simulate ? 'SIMULACIÓN · ' : ''}
                  {def.name.toUpperCase()}
                </Text>
                <View style={s.dots}>
                  {def.stops.map((st, i) => (
                    <View
                      key={st.id}
                      style={[
                        s.dot,
                        i < tour.idx || tour.phase === 'done' ? s.dotDone : null,
                        i === tour.idx && tour.phase !== 'done' ? s.dotNow : null,
                      ]}
                    />
                  ))}
                </View>
                {tour.phase !== 'done' && (
                  <Text style={s.small}>
                    Parada {tour.idx + 1} de {def.stops.length}
                  </Text>
                )}
                <Text style={s.tourTitle}>{tour.phase === 'done' ? '¡Listo!' : p.name}</Text>
                <Text style={s.tourStatus}>{status}</Text>
                {tour.phase !== 'done' && <PointPhoto point={p} />}
                {tour.phase !== 'done' && (
                  <Text style={s.guideText}>{def.stops[tour.idx].guide}</Text>
                )}
                <View style={s.actions}>
                  {tour.phase !== 'done' && tour.phase !== 'story' && (
                    <TouchableOpacity style={s.btn} onPress={() => openMaps(p)}>
                      <Text style={s.btnText}>Cómo llegar</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={repeatStep}>
                    <Text style={s.btnGhostText}>↺ Repetir</Text>
                  </TouchableOpacity>
                  {tour.phase !== 'done' && (
                    <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={skipStep}>
                      <Text style={s.btnGhostText}>
                        {tour.phase === 'story' ? 'Siguiente ›' : 'Ya llegué ›'}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={endTour}>
                    <Text style={s.btnGhostText}>Terminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })()}

        {/* Estado de ubicación */}
        <View style={s.card}>
          {sim ? (
            <>
              <Text style={s.cardLabel}>UBICACIÓN SIMULADA</Text>
              <Text style={s.cardText}>{sim.label}</Text>
              <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={() => setSim(null)}>
                <Text style={s.btnGhostText}>Volver al GPS real</Text>
              </TouchableOpacity>
            </>
          ) : gpsError ? (
            <Text style={s.error}>{gpsError}</Text>
          ) : gps ? (
            <>
              <Text style={s.cardLabel}>GPS ACTIVO</Text>
              <Text style={s.cardText}>Precisión ±{Math.round(gps.acc || 0)} m</Text>
            </>
          ) : (
            <Text style={s.cardText}>Buscando señal GPS…</Text>
          )}

          <View style={s.row}>
            <Text style={s.cardText}>Narración automática</Text>
            <Switch
              value={auto}
              onValueChange={setAuto}
              trackColor={{ true: C.vermilion, false: '#555' }}
              thumbColor={C.paper}
            />
          </View>
          <Text style={s.small}>
            Escuchados: {heard.size}/{POINTS.length}
          </Text>
          <View style={s.row}>
            <Text style={[s.small, { flex: 1, marginTop: 0 }]}>Voz: {voiceLabel(voice)}</Text>
            {voices.length > 1 && (
              <TouchableOpacity style={[s.btn, s.btnGhost, { marginTop: 0 }]} onPress={nextVoice}>
                <Text style={s.btnGhostText}>Cambiar voz ({voices.length})</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Reproduciendo */}
        {speakingPoint && !tour && (
          <View style={[s.card, s.playing]}>
            <Text style={s.cardLabel}>▶ ESCUCHANDO</Text>
            <Text style={s.playingTitle}>{speakingPoint.name}</Text>
            <TouchableOpacity style={s.btn} onPress={stop}>
              <Text style={s.btnText}>■ Detener</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Próximo punto */}
        {nearest && !speakingPoint && !tour && (
          <View style={s.card}>
            <Text style={s.cardLabel}>PRÓXIMO PUNTO</Text>
            <Text style={s.playingTitle}>{nearest.p.name}</Text>
            <Text style={s.cardText}>
              A {fmtDist(nearest.d)} hacia el {nearest.dir}
            </Text>
          </View>
        )}

        {/* Lista */}
        <Text style={s.section}>Puntos del recorrido</Text>
        {rows.map(({ p, order, d, dir }) => {
          const open = expandedId === p.id;
          const isHeard = heard.has(p.id);
          const isPlaying = speakingId === p.id;
          return (
            <View key={p.id} style={[s.item, isHeard && s.itemHeard]}>
              <TouchableOpacity onPress={() => setExpandedId(open ? null : p.id)}>
                <View style={s.itemHead}>
                  <Text style={s.num}>{isHeard ? '✓' : order}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.itemName}>{p.name}</Text>
                    <Text style={s.itemJp}>{p.jp}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    {d != null && <Text style={s.dist}>{fmtDist(d)}</Text>}
                    {d != null && <Text style={s.small}>{dir}</Text>}
                  </View>
                </View>
                {p.type === 'recreacion' && <Text style={s.badge}>RECREACIÓN</Text>}
              </TouchableOpacity>

              {open && (
                <View style={s.itemBody}>
                  <PointPhoto point={p} />
                  <View style={s.actions}>
                    <TouchableOpacity
                      style={s.btn}
                      onPress={() => (isPlaying ? stop() : speakPoint(p))}
                    >
                      <Text style={s.btnText}>{isPlaying ? '■ Detener' : '▶ Escuchar'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={() => openMaps(p)}>
                      <Text style={s.btnGhostText}>Cómo llegar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={() => simulateAt(p)}>
                      <Text style={s.btnGhostText}>Simular aquí</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={s.story}>{p.story}</Text>
                </View>
              )}
            </View>
          );
        })}

        <Text style={s.footer}>
          Los relatos marcados como recreación son escenas imaginadas a partir de hechos y
          tradiciones del lugar.
        </Text>
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. ESTILOS
// ─────────────────────────────────────────────────────────────
const C = {
  ink: '#16130F',
  card: '#221D18',
  line: '#3A322A',
  paper: '#F3EADB',
  muted: '#A99C88',
  vermilion: '#C8402E',
  gold: '#C9A45C',
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.ink },
  scroll: { padding: 18, paddingTop: 52, paddingBottom: 60 },
  kanji: { color: C.vermilion, fontSize: 44, fontWeight: '700' },
  title: { color: C.paper, fontSize: 26, fontWeight: '700', marginTop: 2 },
  subtitle: { color: C.muted, fontSize: 14, marginBottom: 18 },
  card: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.line,
  },
  playing: { borderColor: C.vermilion },
  cardLabel: { color: C.gold, fontSize: 11, letterSpacing: 1.5, fontWeight: '700', marginBottom: 4 },
  cardText: { color: C.paper, fontSize: 15 },
  playingTitle: { color: C.paper, fontSize: 19, fontWeight: '700', marginBottom: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  small: { color: C.muted, fontSize: 12, marginTop: 6 },
  error: { color: '#FF8A7A', fontSize: 14 },
  section: { color: C.muted, fontSize: 12, letterSpacing: 1.5, marginTop: 10, marginBottom: 8 },
  item: {
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: C.line,
  },
  itemHeard: { opacity: 0.6 },
  itemHead: { flexDirection: 'row', alignItems: 'center' },
  num: { color: C.vermilion, fontSize: 18, fontWeight: '700', width: 30 },
  itemName: { color: C.paper, fontSize: 16, fontWeight: '600' },
  itemJp: { color: C.muted, fontSize: 13, marginTop: 2 },
  dist: { color: C.paper, fontSize: 15, fontWeight: '600' },
  badge: {
    alignSelf: 'flex-start',
    color: C.gold,
    borderColor: C.gold,
    borderWidth: 1,
    borderRadius: 4,
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 8,
    marginLeft: 30,
    letterSpacing: 1,
  },
  itemBody: { marginTop: 12 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  btn: {
    backgroundColor: C.vermilion,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  btnText: { color: C.paper, fontWeight: '700', fontSize: 14 },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: C.line },
  btnGhostText: { color: C.paper, fontSize: 14 },
  story: { color: C.paper, fontSize: 15, lineHeight: 23, opacity: 0.9 },
  tourCard: { borderColor: C.gold },
  toggle: { color: C.gold, fontSize: 14, fontWeight: '600', marginTop: 10, marginBottom: 4 },
  hl: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  hlName: { color: C.paper, fontSize: 15, fontWeight: '700' },
  hlShort: { color: C.paper, opacity: 0.8, fontSize: 13, lineHeight: 19, marginTop: 2 },
  tourActive: { borderColor: C.vermilion, borderWidth: 2 },
  tourTitle: { color: C.paper, fontSize: 22, fontWeight: '700', marginTop: 4 },
  tourStatus: { color: C.gold, fontSize: 17, fontWeight: '600', marginTop: 6 },
  guideText: { color: C.paper, fontSize: 14, lineHeight: 21, opacity: 0.8, marginTop: 8 },
  dots: { flexDirection: 'row', gap: 6, marginTop: 4 },
  dot: { width: 22, height: 6, borderRadius: 3, backgroundColor: C.line },
  dotDone: { backgroundColor: C.gold },
  dotNow: { backgroundColor: C.vermilion },
  footer: { color: C.muted, fontSize: 12, marginTop: 18, lineHeight: 18 },
});
