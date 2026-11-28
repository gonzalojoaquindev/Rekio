// Recorridos de Roma. Mismo formato que TOURS en tours.js.
export const TOURS_ROMA = [
  {
    id: 'roma-antigua',
    city: 'roma',
    category: 'Historia',
    badge: 'Popular',
    description: 'Del Coliseo al Capitolio por la Roma de los césares: arcos de triunfo, foros imperiales y la mejor vista del Foro Romano, sin pagar entrada.',
    cover: 'ro_colosseo',
    stamp: { shape: 'circle', color: '#9C3D24', icon: 'arch' },
    name: 'Roma Antigua: del Coliseo al Capitolio',
    intro:
      'Bienvenido a Roma. Vamos a caminar por el corazón del imperio: empezamos en el Coliseo, seguimos por los foros de los emperadores y subimos al Capitolio, la colina más sagrada, para terminar con el Foro Romano a tus pies. Todo el recorrido se hace por fuera, sin entradas. Te voy guiando.',
    outro:
      'Aquí termina el recorrido por la Roma Antigua. Caminaste del anfiteatro de los gladiadores a la colina de Júpiter, por las mismas piedras que pisaron los césares. Gracias por caminar conmigo.',
    stops: [
      { id: 'ro_colosseo', optional: false, guide: 'Primera parada: el Coliseo. Sal de la estación de metro Colosseo y lo tendrás enfrente. Si no estás ahí, toca Cómo llegar.' },
      { id: 'ro_constantino', optional: false, guide: 'Rodea el Coliseo por el lado del Palatino, el de los pinos. El gran arco de tres puertas, junto a la vía, es el Arco de Constantino.' },
      { id: 'ro_fori', optional: false, guide: 'Vuelve frente al Coliseo y toma la gran avenida recta hacia el noroeste, la Vía de los Foros Imperiales. Camina unos seiscientos metros mirando las ruinas a tu izquierda.' },
      { id: 'ro_traiano', optional: false, guide: 'Sigue por la avenida hasta casi el final. La columna con relieves en espiral, a tu derecha, es la Columna de Trajano.' },
      { id: 'ro_vittoriano', optional: false, guide: 'Cruza hacia el gran monumento blanco de la Plaza Venecia, el Vittoriano.' },
      { id: 'ro_campidoglio', optional: false, guide: 'Rodea el monumento por la derecha y sube la escalinata suave de Miguel Ángel, la Cordonata, hasta la plaza del Capitolio.' },
      { id: 'ro_belvedere_foro', optional: false, guide: 'Para terminar, rodea el palacio del fondo por la derecha, por la calle que baja junto a él. A pocos pasos se abre una terraza sobre el Foro Romano.' },
    ],
  },
  {
    id: 'roma-centro',
    city: 'roma',
    category: 'Plazas y fuentes',
    badge: 'Popular',
    description: 'El centro barroco a pie: Campo de’ Fiori, la Plaza Navona, el Panteón, una cúpula que no existe, la Fontana di Trevi y la Escalinata de España.',
    cover: 'ro_trevi',
    stamp: { shape: 'pill', color: '#2F6E8E', icon: 'fountain' },
    name: 'Del Panteón a la Fontana di Trevi',
    intro:
      'Bienvenido al centro histórico de Roma. Vamos a recorrer plazas, fuentes y cúpulas, desde el mercado de Campo de Fiori hasta la Escalinata de España, pasando por el Panteón y la Fontana di Trevi. Son unos dos kilómetros y medio a pie. Te voy guiando.',
    outro:
      'Aquí termina el recorrido por el centro de Roma. Pasaste del estadio de Domiciano al templo de todos los dioses y a la fuente más famosa del mundo. Si lanzaste una moneda, ya sabes: volverás. Gracias por caminar conmigo.',
    stops: [
      { id: 'ro_campo', optional: false, guide: 'Primera parada: la plaza de Campo de Fiori, con su mercado y la estatua oscura de Giordano Bruno. Si no estás ahí, toca Cómo llegar.' },
      { id: 'ro_navona', optional: false, guide: 'Cruza el Corso Vittorio Emanuele hacia el norte por las callecitas. En unos cinco minutos sales a la Plaza Navona.' },
      { id: 'ro_pantheon', optional: false, guide: 'Sal de la plaza por el lado este, el que da la espalda a la iglesia de Santa Inés, y sigue los letreros al Pantheon. Está a unos trescientos metros.' },
      { id: 'ro_minerva', optional: true, guide: 'Rodea el Panteón por la izquierda. Justo detrás está la plaza del elefante de mármol.' },
      { id: 'ro_ignazio', optional: true, guide: 'Camina unos doscientos metros hacia el este. La plaza que parece un escenario de teatro es la de San Ignacio.' },
      { id: 'ro_colonna', optional: false, guide: 'Sigue hacia el norte hasta la Vía del Corso. La gran columna con relieves está en la Plaza Colonna.' },
      { id: 'ro_trevi', optional: false, guide: 'Cruza la Vía del Corso y sigue las callecitas hacia el este. Cuando escuches el agua, ya llegaste a la Fontana di Trevi.' },
      { id: 'ro_spagna', optional: false, guide: 'Para terminar, camina hacia el norte unos setecientos metros, por la Vía dei Due Macelli, hasta la Plaza de España.' },
    ],
  },
  {
    id: 'roma-vaticano',
    city: 'roma',
    category: 'Basílicas',
    badge: 'Nuevo',
    description: 'De la Plaza de San Pedro al Trastévere: la basílica, el pasadizo secreto de los papas, el castillo del ángel y la Roma de las calles empedradas.',
    cover: 'ro_sanpietro_plaza',
    stamp: { shape: 'hex', color: '#B08A2E', icon: 'dome' },
    name: 'Del Vaticano al Trastévere',
    intro:
      'Bienvenido al Vaticano. Vamos a empezar en la Plaza de San Pedro, seguir el pasadizo por el que huían los papas hasta el Castillo de Sant’Angelo, cruzar el puente de los ángeles y bajar por la Vía Giulia hasta el Trastévere. Son unos tres kilómetros y medio. Te voy guiando.',
    outro:
      'Aquí termina el recorrido. Saliste del país más pequeño del mundo y llegaste al barrio más romano de Roma, justo a la hora de buscar una trattoria. Gracias por caminar conmigo.',
    stops: [
      { id: 'ro_sanpietro_plaza', optional: false, guide: 'Primera parada: la Plaza de San Pedro. Llega por la Vía de la Conciliación y entra a la plaza entre las columnas. Si no estás ahí, toca Cómo llegar.' },
      { id: 'ro_sanpietro', optional: true, guide: 'Si quieres entrar a la basílica, ponte en la fila del control de seguridad, bajo la columnata derecha. Recuerda: hombros y rodillas cubiertos.' },
      { id: 'ro_passetto', optional: false, guide: 'Sal de la plaza hacia el castillo, por el lado izquierdo de la Vía de la Conciliación, y toma la Vía dei Corridori. La muralla a tu izquierda es el pasadizo.' },
      { id: 'ro_santangelo', optional: false, guide: 'Sigue la muralla hasta el final. El gran castillo redondo es el Castillo de Sant’Angelo.' },
      { id: 'ro_ponte_angelo', optional: false, guide: 'Frente al castillo, sube al puente peatonal de las estatuas de ángeles.' },
      { id: 'ro_giulia', optional: false, guide: 'Cruza el puente, dobla a la derecha por la orilla del río y entra a la Vía Giulia, la calle recta paralela al río. Camina hacia el sur.' },
      { id: 'ro_trastevere', optional: false, guide: 'Al final de la Vía Giulia, cruza el río por el Puente Sisto, el peatonal, y sigue derecho unos quinientos metros hasta la plaza de Santa María in Trastevere.' },
    ],
  },
  {
    id: 'roma-idus',
    city: 'roma',
    category: 'Historias inmersivas',
    badge: 'Historia',
    unit: 'capitulo',
    description: '15 de marzo del año 44 a. C.: el asesinato de Julio César, en cuatro capítulos, por los lugares reales donde ocurrió.',
    cover: 'ro_idus_curia',
    stamp: { shape: 'circle', color: '#6B1E1E', icon: 'dagger' },
    name: 'Roma: los idus de marzo',
    intro:
      'Bienvenido a Roma. Esta es una historia real contada en cuatro capítulos, y cada uno empieza cuando llegas a su lugar. Los hechos vienen de los historiadores antiguos, sobre todo Plutarco y Suetonio, que escribieron unos ciento cincuenta años después; donde no coinciden, te lo diré. Las escenas y los sonidos son recreaciones. Ponte los audífonos y viajemos al año 44 antes de Cristo.',
    outro:
      'Así terminan Los idus de marzo. Caminaste del teatro donde esperaban los conspiradores al lugar donde Roma quemó a César, y viste cómo un asesinato para salvar la República terminó por darle a Roma su primer emperador. Cada lugar tiene una historia. El pasado te habla. Gracias por caminar conmigo.',
    stops: [
      { id: 'ro_idus_pompeyo', optional: false, guide: 'Capítulo uno: la calle curva de Via di Grotta Pinta, a un paso de Campo de Fiori. Si no estás ahí, toca Cómo llegar.' },
      { id: 'ro_idus_curia', optional: false, guide: 'Capítulo dos: camina hacia el este, unos trescientos metros, hasta las ruinas hundidas de Largo di Torre Argentina.' },
      { id: 'ro_idus_capitolio', optional: false, guide: 'Capítulo tres: sigue hacia el este por la Vía delle Botteghe Oscure hasta la Plaza Venecia, y sube la escalinata suave de la Cordonata hasta la plaza del Capitolio.' },
      { id: 'ro_idus_foro', optional: false, guide: 'Capítulo cuatro: rodea el palacio del fondo por la derecha. A pocos pasos hay una terraza sobre el Foro Romano.' },
    ],
  },
];
