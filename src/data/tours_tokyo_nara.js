// Recorridos de Tokio y Nara. Mismo formato que TOURS en tours.js.
export const TOURS_TOKYO_NARA = [
  {
    id: 'asakusa',
    city: 'tokyo',
    category: 'Templos',
    badge: 'Popular',
    description: 'La Puerta del Trueno, la calle de los dulces y el templo nacido de una estatua pescada en el río.',
    cover: 'tk_kaminarimon',
    stamp: { shape: 'pill', color: '#C62828', icon: 'lantern' },
    name: 'Asakusa: el templo más antiguo de Tokio',
    intro:
      'Bienvenido a Asakusa, el barrio donde nació Tokio cuando todavía era una aldea de pescadores. Vamos a cruzar la Puerta del Trueno, recorrer la calle de los dulces y llegar al templo de Sensō-ji, para terminar a orillas del río Sumida. Te voy guiando.',
    outro:
      'Aquí termina el recorrido por Asakusa. Seguiste el camino de los peregrinos desde la Puerta del Trueno hasta el río donde empezó todo, hace casi catorce siglos. Gracias por caminar conmigo.',
    stops: [
      { id: 'tk_kaminarimon', optional: false, guide: 'Primera parada: la Puerta Kaminarimon, con su gran farol rojo. Está a un par de minutos de la salida 1 de la estación de metro Asakusa. Si no estás ahí, toca Cómo llegar.' },
      { id: 'tk_nakamise', optional: false, guide: 'Cruza la puerta y sigue derecho hacia el norte. Ya estás en la calle de tiendas que lleva al templo.' },
      { id: 'tk_hozomon', optional: false, guide: 'Sigue hasta el final de la calle de tiendas. La gran puerta de dos pisos que tienes enfrente es Hōzōmon.' },
      { id: 'tk_gojunoto', optional: true, guide: 'Cruza Hōzōmon y mira a la izquierda: la pagoda de cinco pisos está a pocos pasos.' },
      { id: 'tk_sensoji', optional: false, guide: 'Vuelve al centro de la explanada. El gran salón al fondo, con el incensario humeando enfrente, es el salón principal de Sensō-ji.' },
      { id: 'tk_asakusajinja', optional: true, guide: 'Rodea el salón principal por la derecha. Detrás, a la derecha, está el santuario de Asakusa, más pequeño y tranquilo.' },
      { id: 'tk_azumabashi', optional: true, guide: 'Para terminar, camina hacia el sureste, unos seiscientos metros, hasta el río Sumida y el puente rojo. Desde ahí se ve la Skytree.' },
    ],
  },
  {
    id: 'meiji',
    city: 'tokyo',
    category: 'Templos',
    badge: 'Nuevo',
    description: 'Un bosque plantado a mano, barriles de sake y vino, el santuario del emperador Meiji y el caos kawaii de Harajuku.',
    cover: 'tk_meiji_honden',
    stamp: { shape: 'hex', color: '#5B6B2F', icon: 'gate' },
    name: 'Meiji Jingu y Harajuku: del bosque sagrado al kawaii',
    intro:
      'Bienvenido a Harajuku. Vamos a entrar a un bosque sagrado en el centro de Tokio, conocer al emperador que llevó a Japón a la era moderna y terminar en la calle más colorida de la ciudad. Te voy guiando.',
    outro:
      'Aquí termina el recorrido. Pasaste del silencio del bosque de Meiji al ruido de la calle Takeshita, los dos extremos de Tokio separados por un puente. Gracias por caminar conmigo.',
    stops: [
      { id: 'tk_meiji_torii', optional: false, guide: 'Primera parada: la entrada de Meiji Jingu, junto a la estación de Harajuku. Cruza el puente frente a la estación y verás el primer torii de madera. Si no estás ahí, toca Cómo llegar.' },
      { id: 'tk_sakadaru', optional: false, guide: 'Sigue el sendero de grava por el bosque, unos cuatrocientos metros. Donde el camino gira a la derecha, verás los barriles a ambos lados.' },
      { id: 'tk_meiji_honden', optional: false, guide: 'Pasa bajo el gran torii y sigue derecho. Después de la fuente para lavarte las manos, cruza la puerta hasta el patio del santuario.' },
      { id: 'tk_kiyomasa', optional: true, guide: 'Vuelve hacia el gran torii. Justo antes, a la izquierda, está la entrada al Jardín interior. Es pagado y cierra a las cuatro de la tarde en invierno. El pozo está al fondo del jardín.' },
      { id: 'tk_takeshita', optional: false, guide: 'Regresa por el sendero hasta la estación de Harajuku. Camina a la izquierda por la calle frente a la estación y, a unos cien metros, verás la entrada de la calle Takeshita al otro lado.' },
    ],
  },
  {
    id: 'edo',
    city: 'tokyo',
    category: 'Palacios',
    badge: 'Nuevo',
    description: 'De la estación de ladrillo de 1914 a los muros del castillo más grande del mundo, donde hoy vive el emperador.',
    cover: 'tk_nijubashi',
    stamp: { shape: 'square', color: '#2F4A6B', icon: 'palace' },
    name: 'Del castillo de Edo al Palacio Imperial',
    intro:
      'Bienvenido al centro de Tokio. Vamos a caminar desde la estación de Tokio hasta los restos del castillo de Edo, la fortaleza de los shōgun, donde hoy vive el emperador. Un aviso: los Jardines del Este, donde están las últimas paradas, cierran los lunes y los viernes. Te voy guiando.',
    outro:
      'Aquí termina el recorrido. Caminaste desde la puerta de la capital moderna hasta la base de la torre que nunca se reconstruyó, por el castillo que se rindió sin un disparo. Gracias por caminar conmigo.',
    stops: [
      { id: 'tk_tokyoeki', optional: false, guide: 'Primera parada: la fachada de ladrillo de la estación de Tokio, del lado Marunouchi. Sal por la salida central de Marunouchi y date la vuelta. Si no estás ahí, toca Cómo llegar.' },
      { id: 'tk_kusunoki', optional: true, guide: 'Camina hacia el oeste por la avenida ancha que sale de la estación, unos ochocientos metros. Cruza al parque del palacio y gira a la izquierda: verás la estatua de un samurái a caballo entre los pinos.' },
      { id: 'tk_nijubashi', optional: false, guide: 'Camina hacia el oeste por la gran explanada de grava, entre los pinos, hasta el foso. El puente de piedra con dos arcos es Nijūbashi.' },
      { id: 'tk_otemon', optional: false, guide: 'Ahora camina hacia el norte, siguiendo el foso, aproximadamente un kilómetro. La gran puerta blanca con techo de tejas es Ōtemon, la entrada a los Jardines del Este.' },
      { id: 'tk_hyakunin', optional: true, guide: 'Entra a los jardines y sube por el camino de la derecha. El edificio largo y bajo, junto a los muros de piedra, es la guardia de los cien.' },
      { id: 'tk_tenshudai', optional: false, guide: 'Sigue subiendo hasta el gran prado del Honmaru y crúzalo hacia el norte. Al fondo verás una enorme plataforma de piedra: es la base de la antigua torre.' },
    ],
  },
  {
    id: 'nara',
    city: 'nara',
    category: 'Templos',
    badge: 'Nuevo',
    description: 'El templo de los Fujiwara, los ciervos sagrados, el Gran Buda de 15 metros y un bosque de faroles de piedra.',
    cover: 'nara_daibutsuden',
    stamp: { shape: 'circle', color: '#8B5E3C', icon: 'deer' },
    name: 'Nara: ciervos y el Gran Buda',
    intro:
      'Bienvenido a Nara, la primera capital permanente de Japón, hace más de mil trescientos años. Vamos a caminar desde el templo de los Fujiwara hasta el Gran Buda y terminar en un santuario rodeado de faroles, siempre en compañía de los ciervos. Te voy guiando.',
    outro:
      'Aquí termina el recorrido por Nara. Conociste a los ciervos mensajeros, al Buda que nació para salvar a un país de una epidemia y el bosque que nadie toca desde el año 841. Gracias por caminar conmigo.',
    stops: [
      { id: 'nara_kofukuji', optional: false, guide: 'Primera parada: el templo Kōfuku-ji, a unos cinco minutos a pie de la estación Kintetsu Nara, subiendo hacia el este. Si no estás ahí, toca Cómo llegar.' },
      { id: 'nara_shika', optional: false, guide: 'Sal de Kōfuku-ji hacia el este, cruza la calle y entra al parque. Camina unos quinientos metros, pasando junto al Museo Nacional de Nara. Aquí los ciervos ya te estarán esperando.' },
      { id: 'nara_nandaimon', optional: false, guide: 'Gira hacia el norte por el camino ancho de tiendas. Al final verás una enorme puerta de madera oscura: es la Gran Puerta Sur de Tōdai-ji.' },
      { id: 'nara_daibutsuden', optional: false, guide: 'Cruza la puerta y sigue derecho hacia el norte. Al fondo verás el gigantesco Salón del Gran Buda. La entrada se paga en la taquilla antes de entrar, solo en efectivo.' },
      { id: 'nara_nigatsudo', optional: true, guide: 'Al salir, camina hacia el este y sube la colina, unos quinientos metros. Las escaleras de piedra te llevan al balcón de Nigatsu-dō.' },
      { id: 'nara_kasuga', optional: false, guide: 'Baja de la colina hacia el sur por el camino del bosque, aproximadamente un kilómetro y medio. Vas a ver cada vez más faroles de piedra cubiertos de musgo, hasta llegar al santuario rojo.' },
    ],
  },
  {
    id: 'shibuya',
    city: 'tokyo',
    category: 'Barrios históricos',
    badge: 'Nuevo',
    description: 'El perro más leal de Japón, el cruce más famoso del mundo, un mural perdido en México y los bares de posguerra.',
    cover: 'tk_scramble',
    stamp: { shape: 'pill', color: '#7B3FE4', icon: 'building' },
    name: 'Shibuya: lealtad, multitudes y neón',
    intro:
      'Bienvenido a Shibuya, el barrio que nunca se detiene. Vamos a conocer la historia de un perro que esperó diez años, cruzar el cruce más famoso del mundo, ver un mural que estuvo perdido en México y meternos en los callejones de la posguerra. Te voy guiando.',
    outro:
      'Aquí termina el recorrido por Shibuya. Detrás de las pantallas y las multitudes hay historias de lealtad, de guerra y de gente que se negó a desaparecer. Gracias por caminar conmigo.',
    stops: [
      { id: 'tk_hachiko', optional: false, guide: 'Primera parada: la estatua de Hachikō, frente a la salida Hachikō de la estación de Shibuya. Si no estás ahí, toca Cómo llegar.' },
      { id: 'tk_scramble', optional: false, guide: 'Desde la estatua, camina unos pasos hacia el cruce peatonal gigante. Espera la luz verde y crúzalo.' },
      { id: 'tk_myth', optional: false, guide: 'Vuelve hacia la estación y sube al segundo piso, al pasillo que lleva a la línea Keiō Inokashira. El mural de treinta metros está a lo largo del pasillo, con ventanales que dan al cruce.' },
      { id: 'tk_nonbei', optional: false, guide: 'Sal de la estación hacia el noreste y camina junto a las vías del tren, unos trescientos metros. Los dos callejones angostos con faroles son Nonbei Yokochō.' },
      { id: 'tk_miyashita', optional: true, guide: 'Sigue hacia el norte junto a las vías. El edificio largo con un parque en la azotea es Miyashita Park. Sube por las escaleras o el ascensor.' },
      { id: 'tk_shibuyasky', optional: true, guide: 'Para terminar, vuelve hacia el sur hasta la estación. La torre más alta, sobre la estación, es Shibuya Scramble Square. La entrada a Shibuya Sky está en el piso 14.' },
    ],
  },
  {
    id: 'ueno',
    city: 'tokyo',
    category: 'Templos',
    badge: 'Nuevo',
    description: 'El último samurái, un Kioto copiado en Tokio y el santuario dorado que sobrevivió a todo.',
    cover: 'ue_toshogu',
    stamp: { shape: 'hex', color: '#B8860B', icon: 'pagoda' },
    name: 'Ueno: el santuario dorado del shōgun',
    intro:
      'Bienvenido a Ueno, una colina que fue templo, campo de batalla y finalmente parque. Vamos a conocer al último gran samurái, descubrir un Kioto en miniatura y llegar al santuario dorado del primer shōgun. Te voy guiando.',
    outro:
      'Aquí termina el recorrido por Ueno. Esta colina pasó de proteger el castillo del shōgun a ser el campo de su última batalla. Gracias por caminar conmigo, y buen provecho.',
    stops: [
      { id: 'ue_saigo', optional: false, guide: 'Primera parada: la estatua de Saigō Takamori, en la entrada sur del parque de Ueno. Desde la estación, sube las escaleras del parque junto a la salida de la línea Keisei. Si no estás ahí, toca Cómo llegar.' },
      { id: 'ue_kiyomizu', optional: false, guide: 'Camina hacia el norte por el parque, unos ciento cincuenta metros. A la izquierda verás un salón rojo sobre pilares de madera, asomado al estanque.' },
      { id: 'ue_bentendo', optional: true, guide: 'Baja por las escaleras frente al salón hacia el estanque, y cruza el camino hasta el templo de la isla.' },
      { id: 'ue_toshogu', optional: false, guide: 'Ahora camina hacia el norte, por la orilla del estanque y luego subiendo, unos cuatrocientos metros. Entra por el camino de faroles de piedra hasta el santuario dorado.' },
      { id: 'ue_pagoda', optional: true, guide: 'Sal del santuario hacia el este, junto a la reja del zoológico. Por encima de los árboles verás la pagoda roja.' },
    ],
  },
  {
    id: 'koishikawa',
    city: 'tokyo',
    category: 'Naturaleza',
    badge: 'Nuevo',
    description: 'El jardín del legendario Mito Kōmon: paisajes de Japón y China en miniatura, puentes de piedra y arces rojos.',
    cover: 'kk_engetsukyo',
    stamp: { shape: 'circle', color: '#2E7D32', icon: 'pavilion' },
    name: 'Koishikawa Kōrakuen: un viaje en miniatura',
    intro:
      'Bienvenido a Koishikawa Kōrakuen. Este jardín reproduce en miniatura paisajes famosos de Japón y China, y está lleno de detalles que ya conoces de Kioto. Dentro del jardín, los puntos del mapa son aproximados: guíate también por los carteles. Te voy guiando.',
    outro:
      'Aquí termina el recorrido. Paseaste por el lago Biwa, el río de Arashiyama y un puente de Kioto, todo sin salir de Tokio. Gracias por caminar conmigo.',
    stops: [
      { id: 'kk_seimon', optional: false, guide: 'Primera parada: la puerta oeste del jardín, la única entrada, a unos cinco minutos de la estación Suidōbashi y junto al Tokyo Dome. Si no estás ahí, toca Cómo llegar.' },
      { id: 'kk_osensui', optional: false, guide: 'Después de la entrada, sigue el sendero hasta el gran estanque central, con una isla en el medio.' },
      { id: 'kk_engetsukyo', optional: false, guide: 'Rodea el estanque hacia el norte y sigue los carteles hacia Engetsukyō. Busca un puente de piedra en forma de medio círculo.' },
      { id: 'kk_tsutenkyo', optional: false, guide: 'Sigue hacia el este, por el sendero del bosque, hasta un pequeño valle con un puente rojo entre los arces.' },
    ],
  },
  {
    id: 'shinjuku',
    city: 'tokyo',
    category: 'Barrios históricos',
    badge: 'Nuevo',
    description: 'El gato 3D gigante, la cabeza de Godzilla sobre Kabukichō y un callejón de posguerra lleno de humo de yakitori.',
    cover: 'sj_neko',
    stamp: { shape: 'square', color: '#E91E63', icon: 'building' },
    name: 'Shinjuku: el gato, Godzilla y la posguerra',
    intro:
      'Bienvenido a Shinjuku, junto a la estación más concurrida del mundo. Vamos a ver al gato gigante que se volvió famoso en todo el planeta, saludar a Godzilla y terminar en un callejón que parece detenido en 1946. Te voy guiando.',
    outro:
      'Aquí termina el recorrido por Shinjuku. Del gato digital al mercado negro de la posguerra, en unas pocas cuadras. Gracias por caminar conmigo.',
    stops: [
      { id: 'sj_neko', optional: false, guide: 'Primera parada: la plaza de la salida este de la estación de Shinjuku. Al salir, mira la pantalla curva en la esquina del edificio de enfrente. Si no estás ahí, toca Cómo llegar.' },
      { id: 'sj_godzilla', optional: true, guide: 'Cruza la avenida hacia el norte y entra a Kabukichō por la calle principal, unos cuatrocientos metros. Al fondo, sobre un edificio alto, verás la cabeza de Godzilla.' },
      { id: 'sj_omoide', optional: true, guide: 'Camina hacia el oeste, pasando bajo las vías del tren por el paso peatonal. Junto a la salida oeste de la estación están los callejones de Omoide Yokochō.' },
    ],
  },
  {
    id: 'laserena-1680',
    city: 'laserena',
    category: 'Historias inmersivas',
    badge: 'Historia',
    unit: 'capitulo',
    description: 'Diciembre de 1680: el corsario Bartholomew Sharp toma La Serena. Una historia real en cinco capítulos, caminando por el centro histórico.',
    cover: 'ls_plaza',
    stamp: { shape: 'circle', color: '#8E2C1F', icon: 'ship' },
    name: 'La Serena: la ciudad que sobrevivió a los piratas',
    intro:
      'Bienvenido a La Serena. Esta no es una audioguía común: es una historia real contada en cinco capítulos, y cada uno empieza cuando llegas a su lugar. Los hechos vienen de los archivos y de los diarios de los propios piratas; donde las fuentes no coinciden, te lo diré. Ponte los audífonos y viajemos a 1680.',
    outro:
      'Así termina La ciudad que sobrevivió a los piratas. Caminaste por los lugares donde, en diciembre de 1680, una ciudad sin cañones resistió con astucia, perdió casi todo y se volvió a levantar. Gracias por viajar conmigo.',
    stops: [
      { id: 'ls_plaza', optional: false, guide: 'Capítulo uno: la Plaza de Armas de La Serena. Si no estás ahí, toca Cómo llegar.' },
      { id: 'ls_catedral', optional: false, guide: 'Capítulo dos: camina hasta la Catedral, en la esquina de la plaza.' },
      { id: 'ls_merced', optional: false, guide: 'Capítulo tres: camina unas dos cuadras hacia el noreste, hasta la iglesia de La Merced, en la calle Balmaceda.' },
      { id: 'ls_sanagustin', optional: false, guide: 'Capítulo cuatro: camina unas tres cuadras hacia el este por la calle Prat, hasta la iglesia de San Agustín.' },
      { id: 'ls_sanfrancisco', optional: false, guide: 'Capítulo cinco: camina hacia el suroeste hasta la iglesia de San Francisco, en Balmaceda con De la Barra.' },
    ],
  },
];
