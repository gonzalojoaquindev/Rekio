// Copiapó, 1859: «La rebelión del desierto». Cinco capítulos de una historia continua.
// Fuentes: Memoria Chilena (Biblioteca Nacional), «Revolución de 1859» y «Capital minera de Chile»;
// J. Fernández Abara, «Regionalismo, liberalismo y rebelión. Copiapó en la Guerra Civil de 1859» (RIL, 2016);
// G. Cortés Lutz, «Las etapas de la Revolución Constituyente» y Cuadernos de Historia del Museo Regional de Atacama;
// La Tercera (2020), «La batalla por la Constitución en el norte de Chile».
// Las escenas sensoriales son recreaciones; nombres, fechas y cifras vienen de las fuentes.
const SRC_GENERAL = 'Memoria Chilena; J. Fernández Abara (2016); G. Cortés Lutz, Museo Regional de Atacama; La Tercera (2020).';

export const COPIAPO = [
  {
    id: 'cp_plaza',
    city: 'copiapo',
    photo: ['es:Plaza de Armas de Copiapó', 'file:Plaza Prat - panoramio.jpg'],
    name: 'Capítulo 1 · La ciudad de la plata',
    jp: 'Plaza Prat',
    lat: -27.3665,
    lng: -70.33195,
    radius: 55,
    type: 'historia',
    cat: 'historia',
    tags: ['gratis'],
    short: '1858: Copiapó es la ciudad más rica del norte, y está a punto de rebelarse.',
    sources: 'Memoria Chilena, «Capital minera de Chile» y «Copiapó»; Fundación Futuro; ' + SRC_GENERAL,
    story:
      'Estás en el corazón de Copiapó, la Plaza Prat, que antes fue la Plaza de Armas. Pero quiero pedirte algo: por un momento, olvida los autos, los semáforos y los edificios. Estamos en 1858. ' +
      'Imagina calles de tierra, carretas cargadas, mulas que llegan del desierto, y el viento seco que baja del valle. Esto es una recreación, pero lo que viene ahora es historia. ' +
      'Todo empezó en 1832, a unos sesenta kilómetros al sur de aquí. Un hombre humilde, Juan Godoy, encontró en el cerro de Chañarcillo una veta de plata. Fue uno de los yacimientos de plata más grandes de América, y cambió para siempre el destino de Atacama. ' +
      'Llegaron mineros, comerciantes, ingenieros y aventureros. Se hicieron fortunas enormes. Una de las familias que se enriqueció con la plata de Chañarcillo fue la de los Gallo. ' +
      'Con esa riqueza, Copiapó hizo algo que muy pocas ciudades del continente habían hecho: construyó un ferrocarril. Impulsado por el empresario estadounidense William Wheelwright, en 1851 empezó a unir Copiapó con el puerto de Caldera, ochenta y un kilómetros de vía. Fue uno de los primeros ferrocarriles de Sudamérica. ' +
      'Copiapó tiene dinero, tiene minas y tiene tren. Pero no tiene poder. ' +
      'En esta época, Chile se gobierna con la Constitución de 1833, que concentra casi todo en Santiago y en el presidente. Gobierna Manuel Montt, con mano dura. Las autoridades de las provincias, los intendentes, son funcionarios enviados desde la capital. ' +
      'Aquí, muchos sienten que la riqueza sale del desierto y las decisiones se toman lejos. ' +
      'En noviembre de 1858 se funda en Copiapó un Club Constituyente, que pide una asamblea para cambiar la Constitución. Su presidente es un empresario minero de apenas veintiocho años, hijo de la familia de la plata: Pedro León Gallo. ' +
      'Todavía nadie en Chile conoce su nombre. Pero en pocas semanas, esta ciudad va a desafiar al gobierno. ' +
      'Quédate en la plaza y camina hacia su lado norte, sobre la calle Atacama. Allí comienza la noche en que Copiapó se rebeló.',
  },
  {
    id: 'cp_noche',
    city: 'copiapo',
    photo: ['file:Calle Colipí hacia la Plaza Prat - panoramio.jpg', 'es:Plaza de Armas de Copiapó'],
    name: 'Capítulo 2 · La noche en que Copiapó se rebeló',
    jp: 'Calle Atacama, frente a la plaza',
    lat: -27.36588,
    lng: -70.33205,
    radius: 40,
    type: 'historia',
    cat: 'historia',
    tags: ['gratis', 'corto'],
    short: '5 de enero de 1859: un artesano y veinte hombres toman el cuartel de policía.',
    sources: 'La Tercera (2020), con J. Fernández Abara y G. Cortés Lutz.',
    story:
      'Copiapó. Cinco de enero de 1859. Cae la noche. ' +
      'Imagina las puertas de madera cerrándose, los faroles, el silencio de las calles del centro. Mientras la ciudad se va a dormir, un grupo de hombres se reúne en secreto. ' +
      'No los dirige un general, ni un político. Los encabeza un artesano: Pedro Pablo Zapata. Zapata había fundado un Club de Artesanos con más de cien socios, y la revolución no sería solo de los ricos mineros: también la empujaron los trabajadores de la ciudad. ' +
      'Esa noche, Zapata y unos veinte hombres avanzan hacia el cuartel de policía. Las fuentes no dicen exactamente en qué calle estaba, pero sí que quedaba en este centro, a pocas cuadras de donde estás. ' +
      'Llegan al cuartel. Y la resistencia es mínima. Uno de los oficiales, Salvador Urrutia, simpatiza con los rebeldes y les facilita la entrada. ' +
      'Después toman la cárcel y los juzgados. El intendente nombrado desde Santiago, José María Silva Chávez, huye de la ciudad. Recuerda ese nombre, porque lo volveremos a encontrar. ' +
      'A las siete de la mañana del seis de enero, después de una noche larga, Copiapó ya es de los rebeldes. ' +
      'Ese día, Pedro León Gallo es proclamado intendente de Atacama. No hubo elecciones: lo aclamaron sus partidarios. Pero por primera vez, la autoridad de la provincia no venía de Santiago, sino de la propia ciudad. ' +
      'Hoy, a un costado de esta plaza, el edificio del Gobierno Regional de Atacama lleva su nombre: Pedro León Gallo. ' +
      'Tomar una ciudad en una noche fue sorprendentemente fácil. Defenderla será otra cosa. Ahora camina hacia el oeste por la calle Atacama, unas diez cuadras, hasta la gran casona de la esquina con la Alameda. Es la casa de la familia Matta.',
  },
  {
    id: 'cp_matta',
    city: 'copiapo',
    photo: ['es:Museo Regional de Atacama', 'file:Museo regional atacama.JPG'],
    name: 'Capítulo 3 · Una bandera, un himno y una moneda',
    jp: 'Casa Matta · Museo Regional de Atacama',
    lat: -27.36241,
    lng: -70.34219,
    radius: 50,
    type: 'historia',
    cat: 'museos',
    tags: ['lluvia'],
    short: 'Los Matta, la bandera azul de la estrella dorada y el Peso Constituyente.',
    sources: 'Memoria Chilena, «Revolución de 1859»; La Tercera (2020); Museo Regional de Atacama.',
    story:
      'Frente a ti está la casa de la familia Matta, una de las grandes fortunas de la plata. Hoy es el Museo Regional de Atacama. ' +
      'Pedro León Gallo no estaba solo. A su lado estaban los hermanos Guillermo y Manuel Antonio Matta, de esta familia. Manuel Antonio era uno de los grandes oradores liberales de su tiempo; Guillermo, poeta. Por eso la gran avenida que tienes al lado se llama Alameda Manuel Antonio Matta. ' +
      'Después de tomar la ciudad, los rebeldes saben que Santiago va a responder. Necesitan algo más que valentía. Necesitan que la gente sienta que esto es una causa. ' +
      'Primero, una bandera: azul, con una estrella dorada en el centro. ' +
      'Segundo, un himno. Guillermo Matta escribe la Canción Popular Constituyente. ' +
      'Y tercero, algo que muy pocos movimientos rebeldes se atreven a hacer: su propia moneda. Se llama el Peso Constituyente. Para acuñarla se usaron más de mil marcos de plata, una parte donada por el propio Gallo y por su madre, Candelaria Goyenechea. En unos diez días fabricaron más de mil monedas de un peso y diez mil de cuarenta centavos. ' +
      'Piénsalo: la plata que salía de Chañarcillo ahora se convertía en el dinero de una revolución. ' +
      'Imagina la bandera azul ondeando sobre esta calle, los voluntarios inscribiéndose, mineros y artesanos que nunca habían sido soldados. No todos querían lo mismo. Unos pedían una nueva Constitución. Otros, que las provincias decidieran su destino. Otros, simplemente, seguían a Gallo. Pero por unos meses, todos marcharon bajo la misma estrella. ' +
      'Si el museo está abierto, entra: guarda la historia de Atacama, de los pueblos originarios a la minería, y un busto de mármol de Manuel Antonio Matta. ' +
      'Ahora camina unas cuatro cuadras hacia el norte por la Alameda, hasta la antigua estación del ferrocarril. Allí la revolución se preparó para la guerra.',
  },
  {
    id: 'cp_estacion',
    city: 'copiapo',
    photo: ['es:Estación Copiapó'],
    name: 'Capítulo 4 · Los Loros, la victoria imposible',
    jp: 'Antigua estación de ferrocarril',
    lat: -27.3592,
    lng: -70.3442,
    radius: 55,
    type: 'historia',
    cat: 'historia',
    tags: ['foto', 'gratis'],
    short: 'Cañones hechos en Copiapó, vagones blindados y una victoria al norte de La Serena.',
    sources: 'Memoria Chilena, «Capital minera de Chile»; La Tercera (2020); J. Fernández Abara (2016).',
    story:
      'Esta estación de madera se construyó en 1854. Cuando estalló la revolución, ya estaba aquí, y el ferrocarril se convirtió en parte de la guerra. ' +
      'Copiapó no tenía fábricas de armas. Pero tenía algo que pocos lugares de Chile tenían: maestranzas, los talleres donde se reparaban locomotoras y maquinaria minera. En ellas, los rebeldes fabricaron armas y cañones. Y para el ferrocarril de Caldera construyeron vagones blindados. ' +
      'Imagina el martilleo del hierro, el humo de las fraguas, y a los mineros aprendiendo a marchar. Hacia fines de abril, el Ejército Constituyente llegó a reunir unos mil seiscientos cuarenta y cinco hombres, cerca del cuatro por ciento de los hombres de toda la provincia. Su núcleo eran dos batallones de infantería y dos escuadrones de caballería. ' +
      'Con ese ejército, Gallo marcha hacia el sur. Ocupan Carrizal, Freirina y Vallenar, y el diez de marzo llegan a La Higuera. ' +
      'Ahora, viaja conmigo con la imaginación, porque la batalla no fue aquí. Es el catorce de marzo de 1859, al pie del cerro Brillador, al norte de La Serena, en el lugar llamado Los Loros. No lo confundas con el pueblo de Los Loros que está en este mismo valle de Copiapó: la batalla fue mucho más al sur. ' +
      'Frente a los rebeldes, las tropas del gobierno. ¿Y quién las manda? El coronel José María Silva Chávez. El mismo intendente que huyó de Copiapó la noche del cinco de enero. ' +
      'Se escuchan las descargas de fusiles, el humo cubre la quebrada. Y ocurre lo que nadie esperaba: los mineros vencen al ejército del gobierno. Silva Chávez escapa hasta Valparaíso a bordo de la corbeta Esmeralda. ' +
      'Al día siguiente, a las tres y media de la tarde, Pedro León Gallo entra triunfante en La Serena. Sus fuerzas ocupan también Illapel y Ovalle. Por unas semanas, todo el Norte Chico está en manos de la revolución, y parece que el movimiento podría llegar hasta Santiago. ' +
      'Pero en la capital, el gobierno prepara una respuesta mucho mayor. ' +
      'Vuelve hacia el sur por la Alameda, unas cinco cuadras, hasta la estatua de Juan Godoy. Ahí termina esta historia.',
  },
  {
    id: 'cp_godoy',
    city: 'copiapo',
    photo: ['file:Monumento a Juan Godoy - panoramio.jpg', 'file:Juan godoy.jpg'],
    name: 'Capítulo 5 · Una derrota y una idea que sobrevivió',
    jp: 'Monumento a Juan Godoy · Alameda',
    lat: -27.3639,
    lng: -70.34267,
    radius: 45,
    type: 'historia',
    cat: 'historia',
    tags: ['gratis', 'foto'],
    short: 'Cerro Grande, el exilio de Gallo y el nacimiento del Partido Radical.',
    sources: 'La Tercera (2020); Memoria Chilena, «Copiapó»; Fundación Futuro; Radio Riquelme (Cerro Grande).',
    story:
      'Este hombre de bronce es Juan Godoy, el que encontró la plata de Chañarcillo en 1832. Con él empezó todo. Ahora escucha cómo terminó. ' +
      'Veintinueve de abril de 1859. Amanece cerca de La Serena, junto al Cerro Grande. El Ejército Constituyente forma frente a las tropas del gobierno: el Regimiento de Copiapó, los Zuavos de Chañarcillo, la Legión Huasquina. ' +
      'Del otro lado está el general Juan Vidaurre Leal, con cerca de tres mil soldados profesionales. ' +
      'Al principio, parece que los revolucionarios pueden ganar. Pero esta vez no. Según relatos de la época, agentes del gobierno sobornaron a dos jefes rebeldes, Urrutia y Vallejos, para sabotear las municiones, cambiando la pólvora por otras cosas, incluso granos de café. La derrota es total. ' +
      'Pedro León Gallo, herido, cruza la cordillera y se refugia en San Juan, en Argentina. Algunos rebeldes son condenados a muerte; la mayoría, como Manuel Antonio Matta y el joven Benjamín Vicuña Mackenna, parten al exilio. La Revolución Constituyente ha terminado. ' +
      'O eso parece. ' +
      'A comienzos de la década de 1860, el nuevo presidente, José Joaquín Pérez, dicta una amnistía y los exiliados vuelven. Gallo regresa a Copiapó, y en 1866 incluso se presenta como candidato a presidente. ' +
      'Y las ideas no se rindieron. Menos centralismo, más libertades políticas, una Constitución que no concentrara todo el poder en un solo hombre. Gallo y los hermanos Matta fueron fundadores de un nuevo partido que defendería esas ideas por más de un siglo: el Partido Radical. ' +
      'Hoy, Gallo descansa en el cementerio de esta ciudad, y la Alameda donde estás lleva el nombre de Matta. ' +
      'Mira a tu alrededor: las calles, los árboles, la gente que pasa. Quizás nunca imaginaste que esta ciudad del desierto desafió al gobierno de todo Chile. Pero ahora lo sabes. Aquí no solo se sacó plata. Aquí también se luchó por cambiar el país.',
  },
];
