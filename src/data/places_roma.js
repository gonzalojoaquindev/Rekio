// Lugares de Roma: el catálogo «Todo Roma», las paradas de los recorridos y los capítulos de la historia
// inmersiva «Los idus de marzo». Precios y horarios revisados en nov. 2026 (sitios oficiales: colosseo.it,
// museivaticani.va, cultura.gov.it, museiincomuneroma.it, turismoroma.it).
// Los capítulos (ro_idus_*) no tienen categoría: solo se escuchan dentro de su historia.
const R = (o) => ({ city: 'roma', nameLang: 'it', type: 'historia', radius: 50, ...o });

export const ROMA = [
  // ── Roma antigua ──
  R({
    id: 'ro_colosseo',
    photo: ['it:Colosseo', 'en:Colosseum'],
    name: 'Coliseo',
    jp: 'Colosseo',
    lat: 41.89021, lng: 12.49223, radius: 90,
    cat: 'historia', tags: ['foto', 'nocturno'],
    mins: 90,
    best: 'A primera hora, al abrir, o de noche para verlo iluminado desde fuera',
    short: 'El anfiteatro más grande del mundo romano: 50.000 espectadores, gladiadores y fieras durante cuatro siglos.',
    fee: { eur: 18, cash: false, note: 'Entrada de 24 horas para el Coliseo, el Foro Romano y el Palatino, comprada online en ticketing.colosseo.it con hora fija. Gratis el primer domingo de cada mes.' },
    story:
      'Estás frente al Coliseo, el anfiteatro más grande que construyeron los romanos. Su nombre real era Anfiteatro Flavio, por la familia de emperadores que lo levantó: lo empezó Vespasiano hacia el año 70 y lo inauguró su hijo Tito en el 80, con cien días de juegos. Se construyó sobre el lago privado del palacio de Nerón, el emperador más odiado, como un regalo al pueblo. ' +
      'Cabían unas cincuenta mil personas, y podían entrar y salir en minutos gracias a sus ochenta arcos de entrada, casi todos numerados: el número de tu puerta estaba en tu boleto. Arriba, marineros de la flota manejaban un enorme toldo para dar sombra. ' +
      'Y fíjate en los agujeros que salpican la piedra: no son de balas. En la Edad Media se arrancaron las grapas de hierro que unían los bloques, y buena parte de su mármol terminó en iglesias y palacios de Roma.',
  }),
  R({
    id: 'ro_constantino',
    photo: ['it:Arco di Costantino', 'en:Arch of Constantine'],
    name: 'Arco de Constantino',
    jp: 'Arco di Costantino',
    lat: 41.88975, lng: 12.49065, radius: 40,
    cat: 'historia', tags: ['gratis', 'corto', 'foto'],
    mins: 10,
    best: 'Cualquier hora; de noche se ilumina',
    short: 'El arco de triunfo más grande que se conserva en Roma, hecho en parte con piezas de monumentos más antiguos.',
    story:
      'Este es el Arco de Constantino, el arco de triunfo más grande que queda en pie en Roma. Lo dedicó el Senado en el año 315 para celebrar la victoria de Constantino sobre su rival Majencio en el puente Milvio. Según la tradición cristiana, antes de esa batalla Constantino vio una señal en el cielo, y años después sería el primer emperador en abrazar el cristianismo. ' +
      'Pero el arco esconde un secreto: buena parte de sus relieves fueron arrancados de monumentos de emperadores anteriores, como Trajano, Adriano y Marco Aurelio. A los rostros de esos emperadores les retallaron la cara para que se parecieran a Constantino. Mira los relieves redondos de arriba: son de la época de Adriano, doscientos años más antiguos que el arco.',
  }),
  R({
    id: 'ro_foro',
    photo: ['it:Foro Romano', 'en:Roman Forum'],
    name: 'Foro Romano',
    jp: 'Foro Romano',
    lat: 41.89247, lng: 12.4853, radius: 90,
    cat: 'historia', tags: ['foto'],
    mins: 90,
    best: 'Por la mañana temprano o a última hora, con luz suave y menos calor',
    short: 'El corazón de la Roma antigua: templos, tribunales, el Senado y la Vía Sacra, donde desfilaban los triunfos.',
    fee: { eur: 18, cash: false, note: 'Misma entrada que el Coliseo (24 horas para Coliseo, Foro y Palatino). El Foro abre a las 9:00.' },
    story:
      'Estás en el Foro Romano, el centro de la vida pública de Roma durante más de mil años. Al principio era un valle pantanoso entre colinas, que los romanos secaron con una gran cloaca, la Cloaca Máxima, que todavía funciona. ' +
      'Aquí estaba todo: los templos más antiguos, los tribunales, los mercados y la Curia, el edificio de ladrillo donde se reunía el Senado, que sigue en pie. Por la Vía Sacra, el camino de piedra que cruza el Foro, desfilaban los generales victoriosos rumbo al Capitolio. ' +
      'Busca el templo redondo de Vesta: ahí las vírgenes vestales cuidaban un fuego sagrado que nunca debía apagarse. Y en un extremo verás los restos del templo de Julio César, levantado donde la multitud quemó su cuerpo en el año 44 antes de Cristo.',
  }),
  R({
    id: 'ro_palatino',
    photo: ['it:Palatino', 'en:Palatine Hill'],
    name: 'Colina del Palatino',
    jp: 'Palatino',
    lat: 41.88924, lng: 12.48746, radius: 110,
    cat: 'historia', tags: ['foto'],
    mins: 75,
    best: 'Después del Foro, por la tarde; tiene sombra de pinos y vistas al Circo Máximo',
    short: 'La colina donde, según la leyenda, nació Roma, y donde los emperadores tuvieron sus palacios.',
    fee: { eur: 18, cash: false, note: 'Misma entrada que el Coliseo y el Foro Romano.' },
    story:
      'Estás en el Palatino, la colina donde, según la leyenda, Rómulo fundó Roma en el año 753 antes de Cristo, después de matar a su hermano Remo. Lo curioso es que la arqueología encontró aquí restos de cabañas de esa misma época, del siglo octavo antes de Cristo. ' +
      'Siglos después, esta fue la colina de los poderosos. Augusto, el primer emperador, vivió aquí en una casa sorprendentemente modesta, y sus sucesores construyeron palacios cada vez más grandes, hasta cubrir casi toda la colina. De hecho, la palabra palacio viene de Palatino. ' +
      'Asómate al borde sur: abajo se ve el Circo Máximo, y desde el palacio el emperador podía mirar las carreras de carros sin salir de casa.',
  }),
  R({
    id: 'ro_circo',
    photo: ['it:Circo Massimo', 'en:Circus Maximus'],
    name: 'Circo Máximo',
    jp: 'Circo Massimo',
    lat: 41.88608, lng: 12.48514, radius: 130,
    cat: 'parques', tags: ['gratis'],
    mins: 20,
    best: 'Al atardecer, con el Palatino iluminado al fondo',
    short: 'La pista de carreras de carros más grande de la Antigüedad; hoy es un gran prado donde se puede caminar libremente.',
    story:
      'Este gran prado alargado es lo que queda del Circo Máximo, el estadio más grande del mundo antiguo. Medía unos seiscientos metros de largo, y en su mejor época pudo recibir a unas ciento cincuenta mil personas, quizás más. ' +
      'Aquí se corrían las carreras de carros, el deporte más popular de Roma. Había cuatro equipos, los blancos, los rojos, los verdes y los azules, y los fanáticos los seguían con una pasión parecida a la del fútbol de hoy. Los aurigas más famosos se hacían millonarios. ' +
      'Los carros daban siete vueltas alrededor de una barrera central adornada con obeliscos egipcios. Dos de esos obeliscos siguen en Roma: uno está en la Plaza del Popolo y el otro en San Juan de Letrán.',
  }),
  R({
    id: 'ro_fori',
    photo: ['it:Fori Imperiali', 'en:Imperial fora'],
    name: 'Foros Imperiales',
    jp: 'Fori Imperiali',
    lat: 41.89374, lng: 12.48551, radius: 70,
    cat: 'historia', tags: ['gratis', 'foto', 'nocturno'],
    mins: 20,
    best: 'Caminando por la avenida, de día o de noche con las ruinas iluminadas',
    short: 'Las plazas monumentales que construyeron César y los emperadores, a la vista desde la avenida, sin entrada.',
    story:
      'A tu lado, bajo el nivel de la calle, están los Foros Imperiales. Cuando el viejo Foro Romano quedó chico para una ciudad de un millón de habitantes, Julio César construyó una plaza nueva, y después Augusto, Vespasiano, Nerva y Trajano hicieron las suyas, cada una más grandiosa. ' +
      'La avenida por la que caminas, la Vía de los Foros Imperiales, la abrió Mussolini en 1932 para ver el Coliseo desde su balcón de la Plaza Venecia. Para hacerla demolió un barrio entero y enterró parte de las ruinas bajo el asfalto. ' +
      'Desde aquí se ven las columnas del templo de Venus Genetrix, en el foro de César. Venus era la diosa de la que la familia de César decía descender.',
  }),
  R({
    id: 'ro_traiano',
    photo: ['it:Colonna Traiana', "en:Trajan's Column"],
    name: 'Columna de Trajano',
    jp: 'Colonna Traiana',
    lat: 41.89577, lng: 12.48434, radius: 40,
    cat: 'historia', tags: ['gratis', 'corto'],
    mins: 10,
    best: 'Con luz de mañana, para ver los relieves',
    short: 'Una columna de 30 metros con 2.500 figuras talladas en espiral: la guerra de Trajano contra los dacios, como un cómic de piedra.',
    story:
      'Esta columna de mármol se levantó en el año 113 para celebrar las victorias del emperador Trajano sobre los dacios, un pueblo de la actual Rumania. Mira cómo sube una franja tallada en espiral: tiene unos doscientos metros de largo y más de dos mil quinientas figuras. Soldados que construyen puentes, cruzan ríos, levantan campamentos y combaten, contado como una historieta de piedra. ' +
      'Adentro hay una escalera de caracol de 185 escalones, y en su base se guardaron las cenizas de Trajano. ' +
      'La estatua de arriba no es él. La original de Trajano desapareció en la Edad Media, y en 1587 el papa Sixto V puso en su lugar una de San Pedro.',
  }),
  R({
    id: 'ro_vittoriano',
    photo: ['it:Vittoriano', 'en:Victor Emmanuel II Monument'],
    name: 'Altar de la Patria (Vittoriano)',
    jp: 'Vittoriano',
    lat: 41.8956, lng: 12.4828, radius: 70,
    cat: 'historia', tags: ['gratis', 'foto'],
    mins: 20,
    best: 'Al atardecer; desde sus escalinatas se ve la Plaza Venecia',
    short: 'El enorme monumento de mármol blanco a la unificación de Italia, con la tumba del soldado desconocido.',
    story:
      'Este monumento de mármol blanco tan imponente es el Vittoriano, dedicado a Víctor Manuel Segundo, el primer rey de la Italia unificada. Se inauguró en 1911, cincuenta años después de la unificación, y se terminó en 1935. ' +
      'Los romanos tienen una relación complicada con él: le dicen la máquina de escribir o el pastel de bodas, porque su blanco brillante no se parece a nada de la ciudad. Para construirlo se demolió parte de la colina del Capitolio y un barrio medieval. ' +
      'En el centro arde la llama de la tumba del soldado desconocido, siempre custodiada por dos soldados. Y desde la terraza superior, a la que se sube en ascensor pagando entrada, hay una de las mejores vistas de Roma.',
  }),
  R({
    id: 'ro_campidoglio',
    photo: ['it:Piazza del Campidoglio', 'en:Piazza del Campidoglio'],
    name: 'Plaza del Capitolio',
    jp: 'Piazza del Campidoglio',
    lat: 41.89335, lng: 12.48268, radius: 50,
    cat: 'historia', tags: ['gratis', 'foto', 'nocturno'],
    mins: 20,
    best: 'Subiendo la escalinata al atardecer',
    short: 'La plaza diseñada por Miguel Ángel en la colina más sagrada de Roma, con la estatua de Marco Aurelio.',
    story:
      'Subiste al Capitolio, la colina más sagrada de la Roma antigua. Aquí estaba el gran templo de Júpiter, el centro religioso del imperio, adonde llegaban los desfiles de triunfo. ' +
      'La plaza que ves la diseñó Miguel Ángel hacia 1536, por encargo del papa. Fíjate en el dibujo del suelo, una estrella dentro de un óvalo, y en que la plaza no mira hacia el Foro antiguo sino hacia San Pedro: hacia la Roma de los papas. ' +
      'En el centro está Marco Aurelio a caballo. Es una copia; la original, de bronce, está en el museo de al lado. Se salvó de ser fundida en la Edad Media porque la gente creyó que representaba a Constantino, el emperador cristiano. Es la única estatua ecuestre de bronce de un emperador que sobrevivió completa.',
  }),
  R({
    id: 'ro_belvedere_foro',
    photo: ['en:Roman Forum'],
    name: 'Mirador del Foro desde el Capitolio',
    jp: 'Terrazza sul Foro Romano',
    lat: 41.89288, lng: 12.48389, radius: 35,
    cat: 'miradores', tags: ['gratis', 'foto', 'nocturno'],
    mins: 15,
    best: 'Al atardecer y de noche, con el Foro iluminado',
    short: 'Una terraza gratuita detrás del Capitolio con la mejor vista panorámica del Foro Romano.',
    story:
      'Desde esta terraza tienes a tus pies todo el Foro Romano, y no necesitas entrada para verlo. Justo debajo están las ocho columnas del templo de Saturno, donde se guardaba el tesoro del Estado, y el arco de Septimio Severo. Más allá, la Vía Sacra corre hacia el Coliseo, que asoma al fondo. ' +
      'El edificio de ladrillo a la izquierda es la Curia, donde se reunía el Senado. Sigue en pie porque en el siglo séptimo la convirtieron en iglesia. ' +
      'Y la colina de la derecha, con pinos, es el Palatino. Imagina todo esto cubierto de mármol, bronce dorado y estatuas pintadas: así lo veían los romanos.',
  }),
  R({
    id: 'ro_capitolini',
    photo: ['it:Musei Capitolini', 'en:Capitoline Museums'],
    name: 'Museos Capitolinos',
    jp: 'Musei Capitolini',
    lat: 41.8931, lng: 12.4823, radius: 40,
    cat: 'museos', tags: ['lluvia'],
    mins: 120,
    best: 'Por la tarde; desde su cafetería hay vistas a los tejados de Roma',
    short: 'El museo público más antiguo del mundo: la loba capitolina, el Marco Aurelio de bronce y vistas al Foro.',
    fee: { eur: 16.5, cash: false, note: 'Precio para no residentes con la exposición temporal del momento; puede variar según la exposición.' },
    story:
      'Estos palacios de la plaza guardan los Museos Capitolinos, considerados el museo público más antiguo del mundo. Nacieron en 1471, cuando el papa Sixto Cuarto donó al pueblo de Roma un grupo de bronces antiguos. ' +
      'Adentro está la Loba Capitolina, la loba que amamanta a Rómulo y Remo, el gran símbolo de la ciudad. Por siglos se creyó etrusca, aunque algunos estudios recientes la fechan en la Edad Media, y los gemelos se agregaron en el Renacimiento. ' +
      'También verás el Marco Aurelio de bronce original y los restos de una estatua gigante de Constantino: solo su cabeza mide más de dos metros. Y un túnel bajo la plaza te lleva a un balcón sobre el Foro.',
  }),
  R({
    id: 'ro_mamertino',
    photo: ['it:Carcere Mamertino', 'en:Mamertine Prison'],
    name: 'Cárcel Mamertina',
    jp: 'Carcer Tullianum',
    lat: 41.89338, lng: 12.48448, radius: 25,
    cat: 'historia', tags: ['lluvia', 'corto'],
    mins: 30,
    best: 'Cualquier hora; es subterránea',
    short: 'La prisión más antigua de Roma, una celda bajo tierra donde, según la tradición, estuvo preso San Pedro.',
    fee: { eur: 10, cash: false, note: 'Entrada sola. Hay entradas combinadas con el Coliseo y el Foro.' },
    story:
      'Bajo esta pequeña iglesia está la cárcel más antigua de Roma, el Tullianum. No era un lugar para cumplir condena, sino para esperar la ejecución. Los enemigos vencidos que desfilaban en los triunfos terminaban aquí. ' +
      'Uno de ellos fue Vercingétorix, el jefe galo que se rindió ante Julio César: pasó años encerrado y fue ejecutado después del triunfo de César, en el año 46 antes de Cristo. ' +
      'La tradición cristiana cuenta que aquí estuvo preso San Pedro, y que hizo brotar un manantial para bautizar a sus carceleros. Abajo todavía se ve el agua de esa fuente.',
  }),
  R({
    id: 'ro_marcello',
    photo: ['it:Teatro di Marcello', 'en:Theatre of Marcellus'],
    name: 'Teatro de Marcelo',
    jp: 'Teatro di Marcello',
    lat: 41.89181, lng: 12.47977, radius: 50,
    cat: 'historia', tags: ['gratis', 'corto', 'nocturno'],
    mins: 15,
    best: 'En verano hay conciertos al aire libre entre las ruinas',
    short: 'Un teatro romano que parece un pequeño Coliseo, con un palacio renacentista construido encima.',
    story:
      'Si este edificio te recuerda al Coliseo, no es casualidad: el Teatro de Marcelo es casi cien años más antiguo y sirvió de modelo. Lo inauguró Augusto hacia el año 13 antes de Cristo, y lo dedicó a su sobrino Marcelo, su heredero, que había muerto joven. Cabían unas quince mil personas. ' +
      'Mira hacia arriba: sobre los arcos romanos hay ventanas de un palacio. En la Edad Media el teatro se convirtió en fortaleza de una familia noble, y en el siglo dieciséis se construyó un palacio encima, que todavía tiene departamentos habitados. Vivir sobre un teatro de dos mil años: así es Roma.',
  }),
  R({
    id: 'ro_bocca',
    photo: ['it:Bocca della Verità', 'en:Mouth of Truth'],
    name: 'Boca de la Verdad',
    jp: 'Bocca della Verità',
    lat: 41.88814, lng: 12.4816, radius: 30,
    cat: 'atracciones', tags: ['foto', 'corto'],
    mins: 20,
    best: 'Temprano, antes de que se forme la fila',
    short: 'La máscara de mármol que, según la leyenda, muerde la mano de los mentirosos. Se deja un pequeño donativo.',
    story:
      'En el pórtico de la iglesia de Santa María in Cosmedin está la Boca de la Verdad, un gran disco de mármol con la cara de un dios del río o del mar. Tiene unos dos mil años, y probablemente era una tapa de alcantarilla o una fuente. ' +
      'La leyenda medieval dice que, si dices una mentira con la mano dentro de la boca, te la muerde. Se cuenta que servía para probar la fidelidad de las esposas. ' +
      'Se hizo famosa en todo el mundo con la película Vacaciones en Roma, de 1953: Gregory Peck esconde la mano en la manga y finge que la boca se la arrancó, y el grito de Audrey Hepburn fue real, porque ella no sabía que lo iba a hacer.',
  }),
  R({
    id: 'ro_isola',
    photo: ['it:Isola Tiberina', 'en:Tiber Island'],
    name: 'Isla Tiberina',
    jp: 'Isola Tiberina',
    lat: 41.89055, lng: 12.47778, radius: 70,
    cat: 'barrios', tags: ['gratis', 'foto'],
    mins: 20,
    best: 'Al atardecer, bajando a la orilla del río',
    short: 'La única isla de Roma, en forma de barco, con el puente romano más antiguo que se sigue usando.',
    story:
      'Estás en la Isla Tiberina, la única isla del río Tíber en Roma. Desde hace más de dos mil años es un lugar de curación. En el año 291 antes de Cristo, durante una epidemia, los romanos trajeron de Grecia el culto a Esculapio, el dios de la medicina. La leyenda cuenta que una serpiente sagrada saltó del barco y nadó hasta aquí, y en ese lugar construyeron su templo. ' +
      'Hoy en la isla hay un hospital, el Fatebenefratelli, que sigue esa tradición. Para que pareciera un barco, los romanos revistieron una punta de la isla con piedra en forma de proa. ' +
      'El puente por el que llegaste desde el lado del gueto es el Puente Fabricio, del año 62 antes de Cristo: el puente romano más antiguo de la ciudad que se sigue usando.',
  }),
  R({
    id: 'ro_argentina',
    photo: ['it:Largo di Torre Argentina', 'en:Largo di Torre Argentina'],
    name: 'Largo di Torre Argentina',
    jp: 'Largo di Torre Argentina',
    lat: 41.89576, lng: 12.4771, radius: 50,
    cat: 'historia', tags: ['gratis', 'corto'],
    mins: 15,
    best: 'Cualquier hora; desde la baranda de la calle se ve todo',
    short: 'Cuatro templos de la República romana, el lugar donde mataron a Julio César y una colonia de gatos.',
    story:
      'Bajo el nivel de la calle hay cuatro templos de la época de la República, de entre trescientos y cien años antes de Cristo. Se descubrieron en los años veinte, cuando se demolía el barrio para construir. ' +
      'Detrás de ellos estaba la Curia de Pompeyo, la sala donde se reunía el Senado el 15 de marzo del año 44 antes de Cristo. Ahí, a los pies de la estatua de Pompeyo, un grupo de senadores mató a Julio César. ' +
      'Hoy las ruinas son también el hogar de decenas de gatos, cuidados por voluntarios de un refugio que funciona en un rincón de la plaza. Y si quieres bajar a caminar entre los templos, hay pasarelas, con una entrada de unos cinco euros.',
  }),
  // ── Centro histórico ──
  R({
    id: 'ro_campo',
    photo: ["it:Campo de' Fiori", "en:Campo de' Fiori"],
    name: "Campo de' Fiori",
    jp: "Campo de' Fiori",
    lat: 41.89566, lng: 12.4722, radius: 50,
    cat: 'compras', tags: ['gratis', 'nocturno'],
    mins: 25,
    best: 'Por la mañana para el mercado; de noche se llena de bares',
    short: 'Una plaza con mercado por la mañana y ambiente de bares por la noche, vigilada por la estatua de Giordano Bruno.',
    story:
      'Campo de Fiori significa campo de flores, porque en la Edad Media aquí había un prado. Hoy cada mañana, salvo los domingos, hay un mercado de frutas, verduras y especias, y de noche la plaza se llena de bares. ' +
      'La estatua oscura del centro, con capucha, es Giordano Bruno, un filósofo y fraile que se atrevió a decir que el universo era infinito y que las estrellas eran otros soles. La Inquisición lo condenó por herejía y lo quemaron vivo en esta misma plaza en el año 1600. ' +
      'Su estatua se levantó en 1889, mirando de frente hacia el Vaticano, como un desafío.',
  }),
  R({
    id: 'ro_navona',
    photo: ['it:Piazza Navona', 'en:Piazza Navona'],
    name: 'Plaza Navona',
    jp: 'Piazza Navona',
    lat: 41.89897, lng: 12.47309, radius: 75,
    cat: 'barrios', tags: ['gratis', 'foto', 'nocturno'],
    mins: 25,
    best: 'Temprano por la mañana, vacía, o de noche con artistas callejeros',
    short: 'La plaza barroca más bella de Roma, con la forma exacta del estadio romano que había debajo.',
    story:
      'Fíjate en la forma de la plaza Navona: alargada y con un extremo redondeado. Es la forma del estadio que construyó el emperador Domiciano hacia el año 86, para competencias atléticas al estilo griego. Las casas se levantaron sobre las gradas, y la plaza ocupa la antigua pista. ' +
      'En el centro está la Fuente de los Cuatro Ríos, de Bernini, terminada en 1651. Cada gigante representa un río de un continente: el Danubio, el Nilo, el Ganges y el Río de la Plata, con una moneda a su lado por la riqueza de América. ' +
      'Frente a la fuente está la iglesia de Santa Inés, de Borromini, el gran rival de Bernini. Se cuenta que una estatua de la fuente se cubre la cara para no ver la iglesia de su rival. Es una leyenda: la fuente se terminó antes que la fachada.',
  }),
  R({
    id: 'ro_pantheon',
    photo: ['it:Pantheon (Roma)', 'en:Pantheon, Rome'],
    name: 'Panteón',
    jp: 'Pantheon',
    lat: 41.89861, lng: 12.47687, radius: 45,
    cat: 'historia', tags: ['foto', 'lluvia'],
    mins: 30,
    best: 'Cerca del mediodía, cuando el rayo de sol entra por el óculo',
    short: 'El edificio romano mejor conservado, con la cúpula de hormigón sin armar más grande del mundo, después de casi dos mil años.',
    fee: { eur: 7, cash: false, note: 'Desde julio de 2026. Gratis para menores de 18. Se recomienda reservar hora online.' },
    story:
      'Estás frente al Panteón, el edificio de la Roma antigua mejor conservado. La inscripción de la fachada dice que lo hizo Marco Agripa, el yerno de Augusto, pero ese era un templo anterior que se quemó. El que ves lo construyó el emperador Adriano hacia el año 125, y por humildad, o por estrategia, dejó el nombre del original. ' +
      'Adentro te espera la cúpula: mide más de 43 metros de diámetro, exactamente lo mismo que su altura, así que dentro cabría una esfera perfecta. Sigue siendo la cúpula de hormigón sin armar más grande del mundo. El secreto es que el hormigón se hace más liviano a medida que sube, mezclado con piedra volcánica. ' +
      'Arriba, el óculo, un agujero de casi nueve metros, es la única fuente de luz. Cuando llueve, el agua entra y se va por pequeños agujeros del suelo. Aquí está enterrado el pintor Rafael.',
  }),
  R({
    id: 'ro_minerva',
    photo: ['it:Santa Maria sopra Minerva', 'en:Santa Maria sopra Minerva'],
    name: 'Santa María sopra Minerva y el elefante',
    jp: 'Santa Maria sopra Minerva',
    lat: 41.89806, lng: 12.47787, radius: 30,
    cat: 'templos', tags: ['gratis', 'corto', 'lluvia'],
    mins: 15,
    best: 'Cualquier hora; la iglesia cierra a mediodía algunos días',
    short: 'La única iglesia gótica de Roma, con su techo azul estrellado, y un elefantito de Bernini en la plaza.',
    story:
      'En esta pequeña plaza hay un elefante de mármol con un obelisco egipcio en el lomo. Lo diseñó Bernini en 1667, y los romanos le dicen el pulcino, el pollito. Fíjate en su trasero: está girado hacia el convento de los dominicos, con quienes Bernini tuvo diferencias. Así lo cuenta la tradición. ' +
      'La iglesia detrás se llama Santa María sobre Minerva, porque se creía construida sobre un templo de esa diosa. Es la única iglesia gótica de Roma: entra y mira el techo azul lleno de estrellas. ' +
      'Adentro hay una estatua de Cristo de Miguel Ángel, y aquí está la tumba de Santa Catalina de Siena. En el convento de al lado, en 1633, Galileo Galilei fue obligado a renegar de que la Tierra gira alrededor del Sol.',
  }),
  R({
    id: 'ro_ignazio',
    photo: ["it:Chiesa di Sant'Ignazio di Loyola in Campo Marzio", "en:Sant'Ignazio, Rome"],
    name: 'San Ignacio y su cúpula falsa',
    jp: "Sant'Ignazio di Loyola",
    lat: 41.89915, lng: 12.47977, radius: 35,
    cat: 'templos', tags: ['gratis', 'corto', 'lluvia'],
    mins: 15,
    best: 'Con buena luz, por la mañana',
    short: 'Una iglesia barroca con una cúpula que no existe: es una pintura plana que engaña al ojo.',
    story:
      'Esta iglesia de los jesuitas está dedicada a San Ignacio de Loyola, el fundador de la orden. La plaza de enfrente parece un escenario de teatro, con fachadas curvas, y es justamente eso: un decorado del siglo dieciocho. ' +
      'Adentro hay un truco. Busca un disco en el suelo, en el centro de la nave, y mira hacia arriba: el techo parece abrirse al cielo, con arquitectura que sube y santos que vuelan. Es una pintura plana del jesuita Andrea Pozzo, terminada hacia 1694. ' +
      'Y camina hacia el altar para ver la cúpula. No existe: el dinero no alcanzó para construirla, y Pozzo la pintó sobre un lienzo plano. Desde el punto justo parece real; si te mueves, el engaño se deshace.',
  }),
  R({
    id: 'ro_colonna',
    photo: ['it:Colonna di Marco Aurelio', 'en:Column of Marcus Aurelius'],
    name: 'Plaza Colonna',
    jp: 'Piazza Colonna',
    lat: 41.90081, lng: 12.47999, radius: 40,
    cat: 'historia', tags: ['gratis', 'corto'],
    mins: 10,
    best: 'De paso, camino a la Fontana di Trevi',
    short: 'La columna de Marco Aurelio y el palacio del gobierno italiano, en la calle más elegante del centro.',
    story:
      'La columna de esta plaza celebra las guerras de Marco Aurelio, el emperador filósofo, contra pueblos germánicos del Danubio. Se terminó hacia el año 193, imitando a la de Trajano, pero sus relieves son más dramáticos: aldeas incendiadas, prisioneros y una famosa escena en la que una lluvia milagrosa salva al ejército romano de morir de sed. ' +
      'Arriba hay una estatua de San Pablo, puesta por el papa Sixto Quinto en 1589. ' +
      'El palacio de la plaza, el Palazzo Chigi, es la sede del gobierno de Italia: aquí trabaja el primer ministro.',
  }),
  R({
    id: 'ro_trevi',
    photo: ['it:Fontana di Trevi', 'en:Trevi Fountain'],
    name: 'Fontana di Trevi',
    jp: 'Fontana di Trevi',
    lat: 41.90093, lng: 12.48331, radius: 40,
    cat: 'atracciones', tags: ['foto', 'nocturno'],
    mins: 20,
    best: 'Antes de las 9:00 o después de las 22:00: casi vacía y sin pagar',
    short: 'La fuente más famosa del mundo. Para bajar hasta el borde del agua se paga un boleto desde 2026.',
    fee: { eur: 2, cash: false, note: 'Solo para bajar al borde de la fuente, de 9:00 a 22:00 (lunes y viernes desde las 11:30). Fuera de ese horario, y desde la plaza, se ve gratis.' },
    story:
      'Esta es la Fontana di Trevi, terminada en 1762 sobre la fachada de un palacio. Su agua llega por el Acueducto de la Virgen, el Aqua Virgo, que el general Agripa construyó en el año 19 antes de Cristo y que, restaurado, sigue funcionando. La leyenda cuenta que una muchacha les mostró el manantial a unos soldados sedientos, y por eso se llama de la Virgen. ' +
      'En el centro está Océano en su carro, tirado por caballos marinos: uno tranquilo y otro agitado, como el mar. ' +
      'La tradición dice que si lanzas una moneda de espaldas, con la mano derecha sobre el hombro izquierdo, volverás a Roma. Cada año se recogen más de un millón de euros, que se donan a la caridad.',
  }),
  R({
    id: 'ro_spagna',
    photo: ['it:Scalinata di Trinità dei Monti', 'en:Spanish Steps'],
    name: 'Plaza de España y la Escalinata',
    jp: 'Piazza di Spagna',
    lat: 41.90576, lng: 12.48216, radius: 60,
    cat: 'barrios', tags: ['gratis', 'foto'],
    mins: 20,
    best: 'Temprano por la mañana; en primavera la escalinata se llena de azaleas',
    short: 'La famosa escalinata de 135 peldaños, la fuente de la Barcaza y las calles de las grandes marcas.',
    story:
      'Esta plaza se llama de España porque aquí está, desde el siglo diecisiete, la embajada de España ante el Vaticano. La escalinata, de 135 peldaños, se construyó entre 1723 y 1726 para unir la plaza con la iglesia francesa de Trinità dei Monti, que está arriba. La pagó un diplomático francés. ' +
      'Abajo está la fuente de la Barcaza, una barca que se hunde, obra de Pietro Bernini y de su hijo, el famoso Gian Lorenzo. Se cuenta que recuerda una barca que la gran inundación de 1598 dejó varada aquí. ' +
      'Un dato importante: está prohibido sentarse en la escalinata, y hay multas. En la casa rosada de la derecha murió el poeta inglés John Keats en 1821.',
  }),
  R({
    id: 'ro_popolo',
    photo: ['it:Piazza del Popolo', 'en:Piazza del Popolo'],
    name: 'Plaza del Popolo',
    jp: 'Piazza del Popolo',
    lat: 41.91056, lng: 12.47634, radius: 80,
    cat: 'historia', tags: ['gratis', 'foto'],
    mins: 25,
    best: 'Por la tarde, antes de subir al Pincio para el atardecer',
    short: 'La gran puerta norte de Roma, con un obelisco de Ramsés II, iglesias gemelas y dos Caravaggios gratis.',
    story:
      'Por esta plaza entraba a Roma quien llegaba del norte, por la Vía Flaminia. Durante siglos fue la primera impresión de la ciudad para peregrinos, reyes y artistas. ' +
      'El obelisco del centro tiene más de tres mil años: lo mandó tallar el faraón Seti Primero y lo terminó su hijo Ramsés Segundo. Augusto lo trajo de Egipto y lo puso en el Circo Máximo, y en 1589 lo trasladaron aquí. ' +
      'Las dos iglesias que parecen gemelas no lo son: una tiene la cúpula ovalada y la otra redonda, pero el truco engaña al ojo. Y entra a Santa María del Popolo, junto a la puerta: en una capilla hay dos cuadros de Caravaggio, la Conversión de San Pablo y la Crucifixión de San Pedro, y se ven gratis.',
  }),
  R({
    id: 'ro_pincio',
    photo: ['it:Pincio', 'en:Pincian Hill'],
    name: 'Terraza del Pincio',
    jp: 'Terrazza del Pincio',
    lat: 41.91126, lng: 12.47975, radius: 50,
    cat: 'miradores', tags: ['gratis', 'foto'],
    slot: 'tarde',
    mins: 20,
    best: 'Al atardecer, con la cúpula de San Pedro recortada contra el sol',
    short: 'El mirador clásico del atardecer romano, sobre la Plaza del Popolo, a la entrada de Villa Borghese.',
    story:
      'Desde la terraza del Pincio tienes una de las vistas más famosas de Roma: la Plaza del Popolo a tus pies y, al fondo, la cúpula de San Pedro. Al atardecer, el sol se pone justo detrás. ' +
      'En la Roma antigua esta colina estaba cubierta de jardines de familias ricas. El más famoso fue el de Lúculo, un general tan amante del lujo que su nombre quedó como sinónimo de banquete. Se dice que aquí murió Mesalina, la esposa del emperador Claudio, ejecutada en el jardín que había deseado. ' +
      'Los paseos que ves los diseñó el arquitecto Giuseppe Valadier a comienzos del siglo diecinueve. Detrás empieza Villa Borghese, el gran parque de Roma.',
  }),
  R({
    id: 'ro_borghese',
    photo: ['it:Galleria Borghese', 'en:Galleria Borghese'],
    name: 'Galería Borghese',
    jp: 'Galleria Borghese',
    lat: 41.9142, lng: 12.49218, radius: 60,
    cat: 'museos', tags: ['lluvia'],
    mins: 120,
    best: 'El primer turno de la mañana; las entradas se agotan con semanas de anticipación',
    short: 'Las esculturas de Bernini y seis Caravaggios en una villa del siglo XVII. Solo con reserva y en turnos de dos horas.',
    fee: { eur: 18, cash: false, note: 'Aproximado, incluye la reserva obligatoria. Turnos de 2 horas; las entradas no se venden en el lugar.' },
    story:
      'Esta villa la construyó a comienzos del siglo diecisiete el cardenal Escipión Borghese, sobrino del papa Paulo Quinto y uno de los coleccionistas más ambiciosos de la historia. Para conseguir obras hacía casi cualquier cosa: llegó a hacer encarcelar a un pintor para quedarse con sus cuadros. ' +
      'Fue el gran mecenas del joven Bernini, que tenía poco más de veinte años cuando talló aquí sus obras maestras. Mira el Rapto de Proserpina: los dedos de Plutón se hunden en el muslo de la joven como si el mármol fuera carne. Y en Apolo y Dafne, la ninfa se convierte en laurel ante tus ojos. ' +
      'También hay seis Caravaggios. En su David con la cabeza de Goliat, la cabeza cortada del gigante es un autorretrato del pintor.',
  }),
  R({
    id: 'ro_ara_pacis',
    photo: ['it:Ara Pacis', 'en:Ara Pacis'],
    name: 'Ara Pacis y Mausoleo de Augusto',
    jp: 'Ara Pacis Augustae',
    lat: 41.90608, lng: 12.47546, radius: 50,
    cat: 'museos', tags: ['lluvia', 'corto'],
    mins: 45,
    best: 'Por la mañana; se ve parte del altar a través del vidrio',
    short: 'El altar de la paz de Augusto, en un pabellón de vidrio moderno, junto a la tumba del primer emperador.',
    story:
      'Dentro de este edificio de vidrio y travertino está el Ara Pacis, el altar de la Paz de Augusto, consagrado en el año 9 antes de Cristo para celebrar la paz después de décadas de guerras civiles. ' +
      'En sus relieves desfila la familia del emperador, con niños que se agarran de la ropa de los adultos, algo muy poco común en el arte oficial romano. Originalmente estaba pintado en colores vivos. ' +
      'El altar se reconstruyó en los años treinta con fragmentos hallados durante siglos, algunos en museos de otros países. El edificio que lo protege, del arquitecto Richard Meier, se inauguró en 2006 entre mucha polémica. ' +
      'Al lado está el gran círculo del Mausoleo de Augusto, la tumba del primer emperador y de su familia.',
  }),
  // ── Vaticano ──
  R({
    id: 'ro_sanpietro_plaza',
    photo: ["it:Piazza San Pietro", "en:St. Peter's Square"],
    name: 'Plaza de San Pedro',
    jp: 'Piazza San Pietro',
    lat: 41.90222, lng: 12.4573, radius: 120,
    cat: 'templos', tags: ['gratis', 'foto'],
    mins: 25,
    best: 'Temprano por la mañana, o el domingo a mediodía para el Ángelus del papa',
    short: 'La plaza de Bernini, abrazada por 284 columnas, frente a la basílica más grande del mundo.',
    story:
      'Ya no estás en Italia: esta plaza pertenece a la Ciudad del Vaticano, el país más pequeño del mundo. Bernini la diseñó entre 1656 y 1667 como un par de brazos gigantes, la Iglesia abrazando a los fieles. Las columnatas tienen 284 columnas, en filas de cuatro. ' +
      'Busca en el suelo, entre el obelisco y cada fuente, un disco de piedra que dice centro del colonnato. Párate encima y mira las columnas: las cuatro filas se alinean y parecen una sola. ' +
      'El obelisco del centro vino de Egipto en tiempos de Calígula y adornaba el circo de Nerón, donde según la tradición fue crucificado San Pedro. En 1586, moverlo hasta aquí tomó meses y casi novecientos hombres.',
  }),
  R({
    id: 'ro_sanpietro',
    photo: ["it:Basilica di San Pietro in Vaticano", "en:St. Peter's Basilica"],
    name: 'Basílica de San Pedro',
    jp: 'Basilica di San Pietro',
    lat: 41.9022, lng: 12.45392, radius: 60,
    cat: 'templos', tags: ['gratis', 'lluvia', 'foto'],
    mins: 90,
    best: 'A las 7:00, al abrir; a media mañana la fila del control de seguridad es larga',
    short: 'La iglesia más grande del mundo, con la Piedad de Miguel Ángel y su cúpula. La entrada es gratis; subir a la cúpula se paga aparte.',
    story:
      'Esta es la Basílica de San Pedro, levantada sobre la tumba del apóstol. La primera basílica la construyó Constantino en el siglo cuarto, y la actual tardó más de cien años, de 1506 a 1626. En ella trabajaron Bramante, Rafael, Miguel Ángel, que diseñó la cúpula, y Bernini. ' +
      'Apenas entras, a la derecha, está la Piedad, la escultura de la Virgen con Cristo muerto. Miguel Ángel la talló con unos veinticuatro años, y es la única obra que firmó: su nombre está en la cinta que cruza el pecho de María. ' +
      'Bajo la cúpula está el baldaquino de bronce de Bernini, de casi treinta metros, sobre el altar del papa y la tumba de Pedro. Para subir a la cúpula se paga aparte, y desde arriba se ve toda Roma. Recuerda que hay que entrar con hombros y rodillas cubiertos.',
  }),
  R({
    id: 'ro_vaticani',
    photo: ['it:Musei Vaticani', 'en:Vatican Museums'],
    name: 'Museos Vaticanos y Capilla Sixtina',
    jp: 'Musei Vaticani',
    lat: 41.90652, lng: 12.45363, radius: 60,
    cat: 'museos', tags: ['lluvia'],
    mins: 180,
    best: 'A primera hora o desde las 15:00, reservando online con semanas de anticipación',
    short: 'Siete kilómetros de salas: las Estancias de Rafael, esculturas antiguas y la Capilla Sixtina de Miguel Ángel.',
    fee: { eur: 25, cash: false, note: '€20 de entrada más €5 de reserva online (muy recomendable para no hacer horas de fila). Gratis el último domingo de cada mes, con filas enormes.' },
    story:
      'Los Museos Vaticanos reúnen la colección de los papas, que empezó en 1506 cuando el papa Julio Segundo compró una estatua recién desenterrada en una viña de Roma: el Laocoonte, un sacerdote troyano que lucha con sus hijos contra dos serpientes. Miguel Ángel fue uno de los primeros en verla salir de la tierra. ' +
      'El recorrido termina en la Capilla Sixtina, donde los cardenales eligen al papa. Miguel Ángel pintó su bóveda entre 1508 y 1512, casi solo, de pie sobre andamios y con la cabeza hacia atrás, aunque él se consideraba escultor, no pintor. Al centro está la Creación de Adán, con los dedos que casi se tocan. Veinte años después volvió para pintar el Juicio Final en la pared del altar. ' +
      'En la Capilla se pide silencio y no se pueden tomar fotos.',
  }),
  R({
    id: 'ro_passetto',
    photo: ['it:Passetto di Borgo', 'en:Passetto di Borgo'],
    name: 'Passetto di Borgo',
    jp: 'Passetto di Borgo',
    lat: 41.9028, lng: 12.462, radius: 50,
    cat: 'historia', tags: ['gratis', 'corto'],
    mins: 10,
    best: 'De camino entre San Pedro y Castel Sant’Angelo',
    short: 'El corredor secreto sobre la muralla por el que los papas huían del Vaticano al castillo.',
    story:
      'Mira la muralla que corre junto a la calle: arriba tiene un corredor elevado de casi ochocientos metros, el Passetto di Borgo, que une el Vaticano con el Castillo de Sant’Angelo. Era la vía de escape de los papas. ' +
      'La usó el papa Clemente Séptimo el 6 de mayo de 1527, durante el Saqueo de Roma, cuando las tropas del emperador Carlos Quinto, entre ellos lansquenetes alemanes y soldados españoles, asaltaron la ciudad. Mientras el papa corría por el pasadizo, la Guardia Suiza resistió en la escalinata de San Pedro para darle tiempo. Murieron 147 de sus 189 guardias. ' +
      'Por eso, cada 6 de mayo, los nuevos guardias suizos hacen su juramento.',
  }),
  R({
    id: 'ro_santangelo',
    photo: ["it:Castel Sant'Angelo", "en:Castel Sant'Angelo"],
    name: 'Castillo de Sant’Angelo',
    jp: "Castel Sant'Angelo",
    lat: 41.90309, lng: 12.46629, radius: 70,
    cat: 'historia', tags: ['foto'],
    mins: 90,
    best: 'Por la tarde, para ver el atardecer desde la terraza del ángel',
    short: 'La tumba de un emperador convertida en fortaleza de los papas, con terraza panorámica sobre el Tíber.',
    fee: { eur: 18, cash: false, note: 'Desde julio de 2026. Cerrado los lunes (salvo algunas tardes del primer lunes del mes).' },
    story:
      'Este castillo redondo empezó siendo una tumba: la del emperador Adriano, terminada hacia el año 139. Después se convirtió en fortaleza, en prisión y en refugio de los papas. ' +
      'Su nombre viene de una leyenda. En el año 590 una peste azotaba Roma, y el papa Gregorio Magno encabezó una procesión. Al llegar aquí vio sobre la tumba al arcángel Miguel guardando su espada en la vaina: la señal de que la peste terminaba. Por eso arriba hay un ángel de bronce envainando la espada. ' +
      'Desde la terraza, junto al ángel, la ópera Tosca, de Puccini, termina con la protagonista lanzándose al vacío. Y la vista sobre el Tíber y San Pedro es de las mejores de Roma.',
  }),
  R({
    id: 'ro_ponte_angelo',
    photo: ["it:Ponte Sant'Angelo", "en:Ponte Sant'Angelo"],
    name: 'Puente de Sant’Angelo',
    jp: "Ponte Sant'Angelo",
    lat: 41.90161, lng: 12.46637, radius: 40,
    cat: 'historia', tags: ['gratis', 'foto', 'nocturno'],
    mins: 10,
    best: 'De noche, con el castillo iluminado',
    short: 'El puente de los ángeles: diez estatuas del taller de Bernini sobre un puente romano de Adriano.',
    story:
      'Este puente lo construyó Adriano para llegar a su tumba, y los tres arcos centrales son todavía romanos, de hace casi diecinueve siglos. ' +
      'Las diez estatuas de ángeles se agregaron entre 1667 y 1669, diseñadas por Bernini. Cada ángel lleva un objeto de la Pasión de Cristo: la corona de espinas, los clavos, la lanza, la cruz. Al papa le gustaron tanto los dos ángeles que talló el propio Bernini que no quiso dejarlos a la intemperie, y hoy están en una iglesia. Los del puente son copias. ' +
      'Durante siglos, este fue el único camino hacia San Pedro. Y aquí se exponía a los ejecutados: en 1599 aquí decapitaron a Beatrice Cenci, una joven noble condenada por la muerte de su padre, que la había maltratado.',
  }),
  R({
    id: 'ro_giulia',
    photo: ['it:Via Giulia', 'en:Via Giulia'],
    name: 'Vía Giulia',
    jp: 'Via Giulia',
    lat: 41.89631, lng: 12.46807, radius: 70,
    cat: 'barrios', tags: ['gratis', 'foto'],
    mins: 20,
    best: 'Por la tarde, cuando la calle está tranquila',
    short: 'Una calle recta del Renacimiento, llena de palacios y anticuarios, con un arco cubierto de hiedra.',
    story:
      'La Vía Giulia fue la primera gran calle recta de la Roma moderna, abierta hacia 1508 por el papa Julio Segundo, el mismo que encargó la Capilla Sixtina. Quería una calle elegante que llevara al Vaticano, y durante un tiempo fue la dirección más exclusiva de Roma. ' +
      'Al fondo verás un arco cubierto de hiedra: es parte de un puente que Miguel Ángel imaginó para unir el palacio Farnese con los jardines al otro lado del río. Nunca se terminó. ' +
      'Busca también la fuente del Mascarone, una enorme cara de piedra que escupe agua. Se cuenta que en fiestas de la familia Farnese, por ella corría vino en lugar de agua.',
  }),
  R({
    id: 'ro_trastevere',
    photo: ['it:Santa Maria in Trastevere', 'en:Trastevere'],
    name: 'Trastévere y Santa María in Trastevere',
    jp: 'Trastevere',
    lat: 41.88954, lng: 12.47003, radius: 70,
    cat: 'barrios', tags: ['gratis', 'foto', 'nocturno'],
    slot: 'noche',
    mins: 60,
    best: 'Al anochecer, para cenar en sus calles empedradas',
    short: 'El barrio bohemio de calles empedradas y hiedra, con una de las iglesias más antiguas de Roma.',
    story:
      'Trastévere significa al otro lado del Tíber. En la Roma antigua aquí vivían marineros, comerciantes y extranjeros, entre ellos una de las primeras comunidades judías de la ciudad. Sus habitantes, los trasteverinos, se consideran los romanos más auténticos. ' +
      'Esta es la iglesia de Santa María in Trastevere, una de las más antiguas de Roma dedicadas a la Virgen. Según la tradición la fundó un papa en el siglo tercero, cuando el cristianismo todavía era perseguido. El edificio actual es del siglo doce: entra a ver los mosaicos dorados del ábside. ' +
      'De noche, sus calles con ropa colgada y hiedra en las fachadas se llenan de trattorias. Pide cacio e pepe o carbonara, dos platos nacidos en Roma.',
  }),
  R({
    id: 'ro_gianicolo',
    photo: ['it:Gianicolo', 'en:Janiculum'],
    name: 'Mirador del Janículo',
    jp: 'Gianicolo',
    lat: 41.89136, lng: 12.46142, radius: 60,
    cat: 'miradores', tags: ['gratis', 'foto'],
    mins: 25,
    best: 'Al mediodía, para el cañonazo de las 12:00, o al atardecer',
    short: 'La colina con la vista más amplia sobre Roma, y un cañón que dispara cada día al mediodía.',
    story:
      'Desde el Janículo tienes Roma entera a tus pies: las cúpulas, los tejados color terracota y, en días claros, los montes del horizonte. No es una de las siete colinas clásicas, porque está al otro lado del río. ' +
      'Aquí se peleó una de las batallas de la unificación de Italia. En 1849, Giuseppe Garibaldi defendió la breve República Romana contra el ejército francés que venía a devolverle Roma al papa. Perdieron, pero la estatua ecuestre de Garibaldi domina hoy la plaza. ' +
      'Garibaldi había pasado años en Sudamérica, y luchó en Uruguay y en el sur de Brasil. Y si estás aquí al mediodía, espera: cada día, a las doce en punto, un cañón dispara una salva para marcar la hora, como desde 1904.',
  }),
  // ── Aventino, Caracalla y más ──
  R({
    id: 'ro_aventino',
    photo: ['it:Piazza dei Cavalieri di Malta', 'en:Piazza dei Cavalieri di Malta'],
    name: 'El ojo de la cerradura del Aventino',
    jp: 'Buco della serratura',
    lat: 41.88297, lng: 12.47865, radius: 30,
    cat: 'atracciones', tags: ['gratis', 'corto', 'foto'],
    mins: 15,
    best: 'Temprano por la mañana, antes de que se forme la fila',
    short: 'Una cerradura en un portón por la que se ve, perfectamente enmarcada, la cúpula de San Pedro.',
    story:
      'Este portón verde es la entrada a la villa de la Orden de Malta, una antigua orden de caballeros nacida en tiempos de las Cruzadas. Acércate y mira por el ojo de la cerradura. ' +
      'Al fondo de un pasillo de setos aparece, perfectamente enmarcada, la cúpula de San Pedro. ¿Es a propósito? Nadie lo sabe con certeza, pero el conjunto lo diseñó en 1765 Giovanni Battista Piranesi, un artista obsesionado con las perspectivas. ' +
      'Y hay un detalle curioso: la Orden de Malta tiene un estatus especial, casi como un Estado soberano. Así que se dice que desde esta cerradura ves tres territorios a la vez: la villa de la Orden, Italia y el Vaticano.',
  }),
  R({
    id: 'ro_aranci',
    photo: ['it:Giardino degli Aranci', 'en:Giardino degli Aranci'],
    name: 'Jardín de los Naranjos',
    jp: 'Giardino degli Aranci',
    lat: 41.88504, lng: 12.4796, radius: 60,
    cat: 'parques', tags: ['gratis', 'foto'],
    slot: 'tarde',
    mins: 20,
    best: 'Al atardecer',
    short: 'Un jardín de naranjos en la colina del Aventino, con una terraza sobre el Tíber y San Pedro.',
    story:
      'Este pequeño parque de naranjos está en la colina del Aventino, uno de los barrios más tranquilos y elegantes de Roma. Desde la terraza ves el Tíber, el Trastévere y la cúpula de San Pedro. ' +
      'Los naranjos recuerdan una tradición: se cuenta que Santo Domingo de Guzmán, el fundador de los dominicos, trajo desde España el primer naranjo de Roma y lo plantó en el convento de Santa Sabina, la iglesia de al lado. ' +
      'Entra a Santa Sabina si está abierta: es del siglo quinto y conserva su puerta de madera original, tallada con escenas de la Biblia, con una de las representaciones más antiguas que se conocen de la crucifixión.',
  }),
  R({
    id: 'ro_caracalla',
    photo: ['it:Terme di Caracalla', 'en:Baths of Caracalla'],
    name: 'Termas de Caracalla',
    jp: 'Terme di Caracalla',
    lat: 41.87931, lng: 12.49253, radius: 120,
    cat: 'historia', tags: ['foto'],
    mins: 75,
    best: 'Por la mañana, con menos gente; en verano hay ópera al aire libre por la noche',
    short: 'Las gigantescas termas públicas de la Roma imperial: muros de 30 metros, mosaicos y túneles subterráneos.',
    fee: { eur: 8, cash: false, note: 'Se compra en el portal Musei Italiani. Cerrado los lunes.' },
    story:
      'Estas ruinas enormes son las Termas de Caracalla, inauguradas hacia el año 216. No eran solo baños: eran un centro de ocio para miles de personas al día, con piscinas fría, tibia y caliente, gimnasios, jardines y hasta bibliotecas. Y la entrada era casi gratis. ' +
      'Fíjate en la altura de los muros: más de treinta metros. Estaban cubiertos de mármol y llenos de estatuas colosales. ' +
      'Bajo tus pies hay kilómetros de túneles por donde los esclavos acarreaban leña para los hornos que calentaban el agua y el suelo. Funcionaron hasta el año 537, cuando los godos que sitiaban Roma cortaron los acueductos.',
  }),
  R({
    id: 'ro_maggiore',
    photo: ['it:Basilica di Santa Maria Maggiore', 'en:Santa Maria Maggiore'],
    name: 'Santa María la Mayor',
    jp: 'Santa Maria Maggiore',
    lat: 41.89757, lng: 12.49837, radius: 60,
    cat: 'templos', tags: ['gratis', 'lluvia'],
    mins: 30,
    best: 'Por la mañana; está a pasos de la estación Termini',
    short: 'Una de las cuatro basílicas mayores, con mosaicos del siglo V y un techo dorado con oro de América.',
    story:
      'Santa María la Mayor es una de las cuatro basílicas mayores de Roma. Una leyenda cuenta que en el siglo cuarto la Virgen se le apareció a un papa en sueños y le pidió una iglesia donde cayera nieve. Era agosto, y a la mañana siguiente nevó en esta colina. Cada 5 de agosto se recuerda dejando caer pétalos blancos desde el techo. ' +
      'Adentro, los mosaicos de la nave son del siglo quinto, de los más antiguos de Roma. ' +
      'Y mira el techo de madera: se dice que se doró con el primer oro traído de América, regalado por los Reyes Católicos de España. Aquí está enterrado Bernini, en una tumba muy sencilla, y también el papa Francisco, fallecido en 2025.',
  }),
  R({
    id: 'ro_laterano',
    photo: ['it:Basilica di San Giovanni in Laterano', 'en:Archbasilica of Saint John Lateran'],
    name: 'San Juan de Letrán',
    jp: 'San Giovanni in Laterano',
    lat: 41.88588, lng: 12.50567, radius: 70,
    cat: 'templos', tags: ['gratis', 'lluvia'],
    mins: 30,
    best: 'Por la mañana; enfrente está la Escalera Santa',
    short: 'La catedral de Roma, más antigua que San Pedro: la madre de todas las iglesias del mundo.',
    story:
      'Aunque mucha gente lo cree, la catedral de Roma no es San Pedro: es esta basílica de San Juan de Letrán. Aquí está la cátedra, la sede del papa como obispo de Roma, y en la fachada dice que es la madre y cabeza de todas las iglesias de la ciudad y del mundo. ' +
      'La fundó Constantino en el siglo cuarto, en terrenos de una familia noble, los Laterani, y durante mil años los papas vivieron en el palacio de al lado. ' +
      'Frente a la basílica está la Escalera Santa: según la tradición, son los escalones del palacio de Poncio Pilato en Jerusalén, que Cristo subió antes de ser juzgado, traídos a Roma por Santa Elena. Los peregrinos los suben de rodillas.',
  }),
  R({
    id: 'ro_clemente',
    photo: ['it:Basilica di San Clemente', 'en:Basilica of San Clemente'],
    name: 'San Clemente: tres iglesias en una',
    jp: 'San Clemente al Laterano',
    lat: 41.88936, lng: 12.49757, radius: 30,
    cat: 'templos', tags: ['lluvia'],
    mins: 45,
    best: 'Cualquier día; ideal si hace calor, porque abajo está fresco',
    short: 'Una basílica medieval sobre una iglesia del siglo IV, sobre un templo romano del dios Mitra. Se bajan dos mil años.',
    fee: { eur: 10, cash: false, note: 'Aproximado, solo para bajar a los niveles subterráneos. La basílica de arriba es gratis.' },
    story:
      'San Clemente es como una máquina del tiempo. La iglesia que ves arriba es del siglo doce, con un mosaico dorado de una cruz que se convierte en árbol de la vida. ' +
      'Si bajas una escalera, llegas a una iglesia anterior, del siglo cuarto, que quedó enterrada. Y si bajas más, llegas a casas romanas del siglo primero y a un mitreo: un templo secreto del dios Mitra, cuyos seguidores, casi todos hombres y muchos soldados, se reunían en una sala oscura imitando una cueva. ' +
      'En el nivel más profundo escucharás agua correr: es un canal romano que todavía lleva agua hacia la Cloaca Máxima.',
  }),
  R({
    id: 'ro_monti',
    photo: ['it:Rione Monti', 'en:Monti (rione of Rome)'],
    name: 'Barrio de Monti',
    jp: 'Rione Monti',
    lat: 41.8952, lng: 12.4928, radius: 70,
    cat: 'barrios', tags: ['gratis', 'nocturno'],
    slot: 'noche',
    mins: 60,
    best: 'Al anochecer, para un aperitivo en la plaza',
    short: 'El barrio más antiguo de Roma: tiendas vintage, bares y plazas de vecinos, a pasos del Coliseo.',
    story:
      'Estás en Monti, el barrio habitado más antiguo de Roma. En tiempos del imperio se llamaba la Suburra, un barrio popular, ruidoso y peligroso, lleno de edificios de varios pisos, tabernas y burdeles. Ahí nació Julio César, en una familia noble pero no rica. ' +
      'Augusto mandó levantar un muro altísimo entre la Suburra y su foro, en parte para protegerlo de los incendios que arrasaban estas calles. El muro sigue en pie. ' +
      'Hoy Monti es un barrio de tiendas vintage, artesanos y bares. Al anochecer, la Plaza de la Virgen de los Montes, con su fuente, se llena de vecinos que toman algo sentados en sus escalones.',
  }),
  R({
    id: 'ro_testaccio',
    photo: ['it:Mercato di Testaccio', 'en:Testaccio'],
    name: 'Mercado de Testaccio',
    jp: 'Mercato di Testaccio',
    lat: 41.87701, lng: 12.47379, radius: 50,
    cat: 'comida', tags: ['lluvia'],
    mins: 45,
    best: 'Al mediodía, de lunes a sábado',
    short: 'El mercado de barrio donde comen los romanos: puestos de comida callejera, pasta y supplì.',
    story:
      'Testaccio es el barrio de la cocina romana auténtica, y este mercado es su corazón. Cerca de aquí funcionó durante casi cien años el gran matadero de Roma, y los trabajadores recibían como parte del pago las partes del animal que nadie quería. De ahí nacieron platos como la coda alla vaccinara, la cola de buey guisada. ' +
      'El barrio tiene una colina hecha por el hombre, el Monte Testaccio: está formada por millones de fragmentos de ánforas romanas que llegaban con aceite de oliva, muchas desde Hispania, y que se tiraban aquí. ' +
      'Prueba un supplì: una croqueta de arroz con salsa de tomate y mozzarella en el centro, que al partirla se estira como un cable de teléfono.',
  }),

  // ── Historia inmersiva: Los idus de marzo (sin categoría: solo dentro de la historia) ──
  R({
    id: 'ro_idus_pompeyo',
    photo: ['it:Teatro di Pompeo', 'en:Theatre of Pompey'],
    name: 'Capítulo 1: El teatro de Pompeyo',
    jp: 'Via di Grotta Pinta',
    lat: 41.89474, lng: 12.47285, radius: 40,
    story:
      'Mira la curva de los edificios de esta calle. No es un capricho: las casas siguen la forma de las gradas de un teatro enterrado bajo tus pies, el teatro de Pompeyo, el primero de piedra que tuvo Roma, inaugurado en el año 55 antes de Cristo. ' +
      'Roma, 15 de marzo del año 44 antes de Cristo. Los idus de marzo. Amanece. ' +
      'Detrás del teatro se extiende un gran pórtico con jardines, y al fondo, una sala donde hoy se reunirá el Senado. Entre los senadores que llegan hay unos sesenta que esconden un puñal bajo la toga. Los encabezan Marco Bruto, a quien César quiere como a un hijo, y Cayo Casio. ' +
      'Julio César es dictador perpetuo. Ha ganado todas sus guerras, y muchos temen que quiera ser rey. Para los conspiradores, matarlo es salvar la República. ' +
      'Pero las horas pasan y César no llega. Esa noche, su esposa Calpurnia soñó que lo tenía muerto en sus brazos, y le rogó que no saliera. Además, un adivino llamado Espurina le había advertido que se cuidara de un peligro que no pasaría de los idus de marzo. ' +
      'En el pórtico, los conspiradores esperan. Si alguien los delató, están perdidos. Uno de ellos, Décimo Bruto, en quien César confía, sale hacia su casa para convencerlo de venir. ' +
      'Por fin se oye el murmullo de una multitud. César viene en una litera. Por el camino, un hombre llamado Artemidoro le pone en la mano un papel que revela el complot. César lo guarda sin leerlo. ' +
      'Y al pasar junto al adivino, se burla: los idus de marzo ya llegaron. Sí, responde Espurina, han llegado, pero no han pasado. ' +
      'Camina hacia el este, unos trescientos metros. Vamos a donde estaba esa sala.',
  }),
  R({
    id: 'ro_idus_curia',
    photo: ['it:Largo di Torre Argentina'],
    name: 'Capítulo 2: La Curia de Pompeyo',
    jp: 'Area Sacra di Largo Argentina',
    lat: 41.89567, lng: 12.4769, radius: 50,
    story:
      'Asómate a la baranda. Bajo la calle están los templos que rodeaban el pórtico de Pompeyo, y en un extremo de las ruinas estaba la Curia, la sala donde el Senado se reunía ese día. ' +
      'Antes de entrar, un conspirador, Trebonio, se lleva aparte a Marco Antonio, el leal amigo de César, y lo entretiene conversando afuera. César entra solo. Los senadores se ponen de pie. Se sienta en su silla dorada, bajo una gran estatua de Pompeyo, su antiguo rival, muerto cuatro años antes. ' +
      'Un senador, Tilio Cimbro, se acerca a pedirle el perdón de su hermano desterrado. Los demás lo rodean como si apoyaran el pedido. César se niega. Entonces Cimbro le agarra la toga y se la baja de los hombros. Es la señal. ' +
      'Casca ataca primero, por la espalda, y lo hiere cerca del cuello. César le agarra el brazo. Pero llegan los demás, por todos lados. Cuando ve a Bruto entre ellos, deja de defenderse y se cubre la cabeza con la toga. ' +
      'El historiador Suetonio cuenta que solo dejó escapar un gemido. Otros dicen que le habló a Bruto en griego: kai su, teknon. ¿Tú también, hijo? La frase en latín que todos conocen la inventaron siglos después. ' +
      'Recibe veintitrés puñaladas. Su médico dirá que solo una fue mortal. Cae a los pies de la estatua de Pompeyo, que queda manchada de sangre. ' +
      'Los senadores que no estaban en el complot huyen. La sala queda vacía. Y el hombre más poderoso del mundo queda tendido en el suelo, solo. ' +
      'Siglos después, el emperador Augusto, hijo adoptivo de César, mandó cerrar esta sala para siempre. En 2012, unos arqueólogos españoles hallaron aquí una estructura de hormigón que podría marcar el lugar exacto donde cayó. ' +
      'Ahora camina hacia el este y sube a la colina del Capitolio. Es lo que hicieron los asesinos.',
  }),
  R({
    id: 'ro_idus_capitolio',
    photo: ['it:Piazza del Campidoglio'],
    name: 'Capítulo 3: La huida al Capitolio',
    jp: 'Campidoglio',
    lat: 41.89335, lng: 12.48268, radius: 50,
    story:
      'Estás en la cima del Capitolio. Aquí arriba, en el año 44 antes de Cristo, se alzaba el templo de Júpiter, el más sagrado de Roma. ' +
      'Esa tarde, los conspiradores salen de la sala y cruzan la ciudad con los puñales todavía en la mano. Gritan libertad. Esperan que el pueblo los aclame como a los salvadores de la República. ' +
      'Pero las calles se vacían. Los comerciantes cierran sus tiendas. Nadie sale a celebrar. ' +
      'Asustados, los asesinos suben a esta colina y se atrincheran en el templo, protegidos por gladiadores contratados. Desde aquí se ve el Foro. Bruto baja a hablarle a la gente y lo escuchan en silencio, sin aplaudir. ' +
      'Mientras tanto, abajo, el cuerpo de César sigue tirado en la sala vacía. Más tarde, tres esclavos lo levantan y lo llevan a su casa en una litera, con un brazo colgando hacia afuera. ' +
      'Marco Antonio, que había escapado disfrazado, se reúne con los conspiradores y se llega a un acuerdo: habrá perdón para los asesinos, pero las leyes de César seguirán vigentes, y tendrá un funeral público. ' +
      'Los conspiradores creen que ganaron. No saben que ese funeral será su perdición. ' +
      'Rodea el palacio del centro por la derecha, por la calle que baja junto a él. A pocos pasos hay una terraza sobre el Foro.',
  }),
  R({
    id: 'ro_idus_foro',
    photo: ['it:Tempio del Divo Giulio', 'en:Temple of Caesar'],
    name: 'Capítulo 4: El funeral en el Foro',
    jp: 'Foro Romano',
    lat: 41.89288, lng: 12.48389, radius: 35,
    story:
      'Desde esta terraza ves el Foro Romano. Busca al fondo de la plaza, un poco a la izquierda, una construcción baja con un techo moderno: ese es el templo de Julio César. ' +
      'Unos días después del asesinato, el cuerpo de César es llevado al Foro para su funeral. Una multitud llena la plaza. Marco Antonio sube a la tribuna de los oradores. ' +
      'No necesita atacar a nadie. Primero lee el testamento de César: deja sus jardines al otro lado del Tíber al pueblo de Roma, y una suma de dinero a cada ciudadano. La gente empieza a murmurar. Entre los herederos aparece Décimo Bruto, uno de sus asesinos. ' +
      'Entonces Antonio levanta la toga de César, desgarrada por las puñaladas y manchada de sangre, y la muestra a la multitud. ' +
      'Estalla la furia. La gente arranca bancos, mesas y tablas de las tiendas, los amontona ahí abajo, en el Foro, y prende fuego al cuerpo de César. Actores y músicos arrojan sus ropas a las llamas. Veteranos de sus legiones lanzan sus armas. Con antorchas en la mano, la multitud corre a quemar las casas de los asesinos. ' +
      'Bruto y Casio huyen de Roma. Dos años después, derrotados en la batalla de Filipos, en Grecia, se quitan la vida. Ninguno de los conspiradores sobrevivió muchos años a César. ' +
      'Y la República que querían salvar tampoco. Octavio, el sobrino nieto de César, se convertirá en Augusto, el primer emperador. En el lugar de la hoguera, levantó el templo que estás mirando, dedicado al divino Julio. ' +
      'Más de dos mil años después, todavía hay quien deja flores en ese altar.',
  }),
];
