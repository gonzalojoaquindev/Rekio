// La Serena, 1680: «La ciudad que sobrevivió a los piratas». Cinco capítulos de una historia continua.
// Fuentes: Memoria Chilena (Biblioteca Nacional); P. Lacoste, «Ataque pirata a La Serena de 1680»,
// Si Somos Americanos 22(2), 2022 (crónicas de Dick, Anónimo, Ringrose y Sharp); D. Amunátegui Solar,
// actas del Cabildo de La Serena (1928); La Tercera (2022) y BioBioChile (2025).
// Las fechas siguen el calendario gregoriano que usaba España; los diarios ingleses (juliano) marcan 10 días menos.

export const LASERENA = [
  {
    id: 'ls_plaza',
    city: 'laserena',
    art: require('../../assets/art/laserena-1.jpg'),
    photo: ['es:Plaza de Armas de La Serena'],
    name: 'Capítulo 1 · La ciudad antes de la tormenta',
    jp: 'Plaza de Armas',
    lat: -29.90271,
    lng: -71.25198,
    radius: 45,
    type: 'historia',
    short: 'Diciembre de 1680: una pequeña ciudad colonial que no sabe lo que se acerca.',
    story:
      'Estás en el corazón de La Serena. Pero quiero pedirte algo: por un momento, olvida los autos, el asfalto y los edificios modernos. Estamos en diciembre de 1680. ' +
      'Chile es parte del Imperio español, y La Serena es una de sus ciudades más antiguas. La fundó Juan Bohón en 1544, junto a la desembocadura del río Elqui. En 1549 fue destruida en un levantamiento indígena, y ese mismo año Francisco de Aguirre la volvió a levantar con el nombre de San Bartolomé de La Serena. ' +
      'Ciento treinta años más tarde sigue siendo una ciudad pequeña. Casas bajas de adobe con techos de teja, calles de tierra, huertos detrás de los muros. Por las acequias corre el agua del río, canales de riego que los diaguitas ya usaban mucho antes de que llegaran los españoles. ' +
      'Mira a tu alrededor e imagina las torres de las iglesias. Uno de los piratas que pronto llegará contará nueve templos en esta ciudad. Hay viñas y bodegas de vino, olivos, trigo, molinos, y el cobre de los cerros cercanos, que se trabaja aquí mismo. ' +
      'Es una ciudad tranquila, quizás demasiado tranquila. No tiene murallas, ni cañones, ni un cuartel con soldados profesionales. Si algo pasa, se defenderán los vecinos, montados en sus caballos y con las pocas armas que tengan. ' +
      'Y el mar está cerca. La bahía de Coquimbo, a pocas leguas al sur, es un buen fondeadero. Por ahí llegan los barcos que traen noticias del Perú. ' +
      'En estos días, las noticias son inquietantes. Se dice que unos corsarios ingleses cruzaron el istmo de Panamá a pie, se apoderaron de barcos españoles en el Pacífico y llevan meses atacando la costa. ' +
      'En La Serena, todavía nadie cree que vengan para acá. ' +
      'Camina hacia la Catedral, en la esquina de la plaza. Allí descubriremos cómo llegó la amenaza.',
  },
  {
    id: 'ls_catedral',
    city: 'laserena',
    art: require('../../assets/art/laserena-2.jpg'),
    photo: ['es:Catedral de La Serena'],
    name: 'Capítulo 2 · Una amenaza desde el Pacífico',
    jp: 'Catedral de La Serena',
    lat: -29.903,
    lng: -71.25098,
    radius: 40,
    type: 'historia',
    short: 'Santiago protege sus puertos, pero nadie piensa en La Serena.',
    story:
      'Frente a ti está la Catedral. La que ves es de piedra y se construyó en el siglo diecinueve. Pero en este mismo lugar estaba la iglesia principal de 1680, y una placa en sus muros recuerda que fue destruida por el corsario inglés Bartolomé Sharp. ' +
      'Volvamos a esos días. En Santiago, el gobernador Juan Henríquez recibe el aviso: los corsarios navegan por la costa de Chile. Ordena reforzar los puertos importantes: Valparaíso, Concepción y Valdivia. Pero nadie imagina que el blanco será La Serena, una ciudad sin defensas. ' +
      '¿Quién es el enemigo? Bartholomew Sharp, un inglés de unos treinta años. Junto a cientos de bucaneros cruzó a pie la selva de Panamá, capturó un barco español, el Santísima Trinidad, y lo convirtió en su nave. De los cientos que partieron, quedan con él unos cien hombres. Están hambrientos, cansados y necesitan comida, agua y botín. ' +
      'La mañana del 13 de diciembre de 1680, el Trinidad fondea en la bahía de Coquimbo. Los piratas desembarcan y avanzan hacia la ciudad. ' +
      'Un dato curioso: en los diarios de los propios piratas, esa fecha aparece como el 3 de diciembre. No es un error. Inglaterra todavía usaba el viejo calendario juliano, que iba diez días atrasado respecto del calendario que ya usaban España y sus colonias. ' +
      'Los vecinos reaccionan como pueden. Francisco de Aguirre, bisnieto del fundador de la ciudad, reúne a más de cien jinetes y sale al encuentro de los invasores. Sharp, en su diario, dirá que eran doscientos cincuenta. Da igual el número: son vecinos, no soldados, y tienen pocas armas. Al primer choque con los bucaneros, los jinetes se dispersan por los campos. ' +
      'La ciudad queda abierta. Muchas familias toman lo que pueden cargar y huyen hacia los valles. Hacia las ocho de la mañana, los corsarios entran en La Serena. ' +
      'Camina unas dos cuadras hacia el noreste, hasta la iglesia de La Merced, en la calle Balmaceda. Allí veremos qué hicieron los piratas con la ciudad en sus manos.',
  },
  {
    id: 'ls_merced',
    city: 'laserena',
    art: require('../../assets/art/laserena-3.jpg'),
    photo: ['file:Iglesia de La Merced desde calle Balmaceda.JPG'],
    name: 'Capítulo 3 · La llegada de los corsarios',
    jp: 'Iglesia de La Merced',
    lat: -29.90182,
    lng: -71.2496,
    radius: 40,
    type: 'historia',
    short: 'Una ciudad ocupada, un rescate imposible y una negociación con vino.',
    story:
      'Estás frente a la iglesia de La Merced. La primera iglesia y convento de los mercedarios estaban aquí en 1680. ' +
      'Imagina la escena: calles casi vacías, puertas cerradas, y unos cien hombres armados, sucios después de meses en el mar, recorriendo las casas. Sharp se sorprende con lo que encuentra. Escribirá sobre el trigo, el vino, el aceite de oliva y los huertos, con frutas que le parecieron deliciosas. Otro pirata anota que el cobre es la principal manufactura del lugar. ' +
      'Pero los piratas no vinieron por fruta. Quieren dinero. Y para conseguirlo tienen un arma muy simple: amenazar con quemar la ciudad. ' +
      'Entonces empieza una negociación extraña. El corregidor, José Collarte, se reúne con Sharp en un punto a medio camino de la salida de la ciudad. Cada uno llega acompañado de apenas dos hombres. El precio para no incendiar La Serena es enorme. Las crónicas de los piratas hablan de noventa y cinco mil pesos, y el propio Sharp dirá que se acordaron cien mil. Es una suma imposible para una ciudad pobre. ' +
      'Los serenenses no tienen cañones, pero tienen astucia. Mientras dicen que reúnen el rescate, ganan tiempo. Envían vino y gallinas al campamento de los piratas. Según una de las crónicas, españoles e ingleses llegaron a beber juntos en un cerro cercano. Los historiadores lo llaman diplomacia del vino: atender al enemigo, calmarlo y esperar el momento. ' +
      'Porque mientras se brinda, se prepara otra cosa. ' +
      'Esta parte la cuentan los propios piratas, y no todos de la misma manera, pero coinciden en lo esencial: en algún momento, los ingleses encerraron a los vecinos que se habían refugiado en las iglesias. Uno de ellos, William Dick, escribió que dejaron un barril de pólvora con una mecha en cada puerta. Era una amenaza para obligar a pagar. ' +
      'La tensión crece. El rescate no llega. Y en la bahía, de noche, alguien se acerca nadando al barco de Sharp. ' +
      'Camina unas tres cuadras hacia el este por la calle Prat, hasta la iglesia de San Agustín. Ahí sabremos qué pasó esa noche.',
  },
  {
    id: 'ls_sanagustin',
    city: 'laserena',
    art: require('../../assets/art/laserena-4.jpg'),
    photo: ['es:Iglesia de San Agustín (La Serena)'],
    name: 'Capítulo 4 · El saqueo y el incendio',
    jp: 'Iglesia de San Agustín',
    lat: -29.90196,
    lng: -71.24661,
    radius: 40,
    type: 'historia',
    short: 'Una balsa de cuero de lobo marino, calles inundadas y la ciudad en llamas.',
    story:
      'Esta iglesia de San Agustín ocupa el lugar del templo de los jesuitas, construido en 1672. Ocho años después, en diciembre de 1680, ardió. Pero antes de eso, los serenenses intentaron dos golpes desesperados. ' +
      'El primero fue en el mar. Una noche, mientras el Trinidad estaba fondeado en la bahía de Coquimbo, un hombre se acercó en silencio hasta la popa del barco. Llevaba materiales para incendiarlo. Las crónicas de los piratas no coinciden en los detalles: una habla de un cuero de caballo inflado; otra, de un hombre que nadó con una vejiga. El relato más preciso dice que flotaba sobre dos pieles de lobo marino infladas, la balsa tradicional de los changos, los pescadores indígenas de esta costa. Logró prender fuego al barco. Los piratas lo apagaron a tiempo, pero el susto fue enorme. El propio Sharp lo llamó una estratagema inusual. ' +
      'El segundo golpe fue en la ciudad. Al amanecer, los vecinos abrieron las compuertas de las acequias, esos mismos canales de riego que ya conoces. En una hora, según un pirata, las calles quedaron con agua casi hasta los tobillos. Querían asustar a los invasores, o quizás echar a perder su pólvora. ' +
      'Los piratas entienden el mensaje: el rescate nunca llegará y los españoles están reuniendo gente. Además, se acercan tropas. Es hora de irse. ' +
      'Antes, recorren las casas y las iglesias y se llevan todo lo que tenga valor. Y la mañana del 16 de diciembre le prenden fuego a la ciudad. ' +
      'Arden la iglesia principal, las casas del Cabildo con su archivo, la iglesia y el convento de La Merced, el colegio de los jesuitas y su capilla, aquí donde estás, y la ermita de Santa Lucía. Con el archivo del Cabildo se pierde casi toda la memoria escrita de la ciudad: de sus actas solo se salvaron unas pocas, que guardaba el escribano. ' +
      'Sharp escribirá que dejó la ciudad reducida a cenizas. Los historiadores creen que exageró. Y su botín fue pobre: unas quinientas libras de plata, una pequeña parte de lo que habían exigido. Al repartirlo, a cada pirata le tocaron apenas unas decenas de pesos. ' +
      'Desde los cerros, las familias que huyeron ven subir el humo. ' +
      'Camina ahora hacia el suroeste, hasta la iglesia de San Francisco, en la esquina de Balmaceda con De la Barra. Ahí termina nuestra historia.',
  },
  {
    id: 'ls_sanfrancisco',
    city: 'laserena',
    photo: ['es:Iglesia de San Francisco (La Serena)', 'file:Frontis Iglesia de San Francisco de la Serena.jpg'],
    name: 'Capítulo 5 · La ciudad que volvió a levantarse',
    jp: 'Iglesia de San Francisco',
    lat: -29.90453,
    lng: -71.24976,
    radius: 40,
    type: 'historia',
    short: 'La única iglesia que no ardió, y una ciudad que se reconstruyó en piedra.',
    story:
      'Acércate a la iglesia de San Francisco y toca sus muros. Esta piedra caliza vio el incendio de 1680. Los franciscanos la construyeron a partir del siglo dieciséis, con piedra de las canteras cercanas y madera del bosque de Fray Jorge, y la inauguraron la Navidad de 1627. Cuando los piratas incendiaron La Serena, fue la única iglesia que no ardió. Hoy es una de las construcciones más antiguas de la ciudad. ' +
      'Unas horas después de que los corsarios se fueran, los vecinos volvieron. Encontraron techos derrumbados, vigas humeantes y templos sin altar. Muchas familias lo habían perdido todo. Las autoridades organizaron una procesión pública, como se hacía en la época para pedir protección y reconstruir el ánimo de la gente. ' +
      'Y empezaron a levantar la ciudad de nuevo. Pero muchos vecinos pensaron en irse para siempre a otro lugar. El Cabildo llegó a prohibir que la gente se marchara, y muchos terminaron instalándose en los valles del interior, como el valle del Elqui. ' +
      'Seis años más tarde, en 1686, llegaron otros piratas: Edward Davis y sus hombres. Esta vez la ciudad se defendió, los atacantes tuvieron que atrincherarse en una iglesia y el ataque fracasó. ' +
      '¿Y qué pasó con Sharp? Pocas semanas después de dejar La Serena, en la isla Juan Fernández, su propia tripulación lo destituyó. Más tarde volvió a tomar el mando, atacó otros puertos del Pacífico y capturó un barco español con cartas de navegación secretas de toda la costa. De vuelta en Inglaterra fue juzgado por piratería, pero lo perdonaron: esas cartas valían más que su condena. ' +
      'En La Serena, en cambio, quedó un dicho que todavía se escucha: «llegó charqui a Coquimbo», para hablar de una visita inesperada y poco bienvenida. ' +
      'Y quedó algo más. Los serenenses reconstruyeron sus templos, muchos de ellos en piedra, una y otra vez. Por eso hoy a La Serena se la conoce como la ciudad de las iglesias. ' +
      'Mira a tu alrededor: esta es la ciudad que sobrevivió a los piratas. Gracias por viajar conmigo a 1680.',
  },
];
