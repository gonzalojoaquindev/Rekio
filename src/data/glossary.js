// Vocabulario estilo wiki: se reutiliza en todas las historias, recorridos y lugares.
//   id:      identificador
//   term:    cómo se muestra
//   jp:      escritura japonesa (opcional)
//   aliases: otras formas que se detectan en los textos (sin importar tildes ni mayúsculas; los plurales en -s/-es se detectan solos)
//   short:   definición para la tarjeta (1-2 frases)
//   long:    explicación más larga (opcional)
//   related: ids de términos relacionados
export const GLOSSARY = [
  // ── Poder y sociedad en Japón ──
  {
    id: 'shogun', term: 'Shōgun', jp: '将軍', aliases: ['shogun', 'shōgun', 'shogunes'],
    short: 'El jefe militar supremo de Japón. En teoría servía al emperador; en la práctica, gobernaba el país.',
    long: 'Su título completo era sei-i taishōgun, «gran general que somete a los bárbaros». Hubo tres grandes dinastías de shōgun: Kamakura (1185-1333), Ashikaga (1336-1573) y Tokugawa (1603-1868). Mientras tanto, el emperador seguía en Kioto con un papel sobre todo ceremonial.',
    related: ['shogunato', 'tokugawa', 'emperador', 'daimyo'],
  },
  {
    id: 'shogunato', term: 'Shogunato', jp: '幕府 (bakufu)', aliases: ['shogunato', 'bakufu'],
    short: 'El gobierno militar encabezado por el shōgun.',
    long: 'En japonés se llama bakufu, «gobierno de la tienda de campaña», porque nació como el cuartel de un general en guerra. El último, el de los Tokugawa, gobernó desde Edo (Tokio) entre 1603 y 1868.',
    related: ['shogun', 'tokugawa', 'restauracion-meiji'],
  },
  {
    id: 'tokugawa', term: 'Tokugawa', jp: '徳川', aliases: ['tokugawa', 'clan tokugawa', 'tokugawa ieyasu', 'ieyasu'],
    short: 'La familia de shōgun que gobernó Japón entre 1603 y 1868, desde Edo.',
    long: 'Tokugawa Ieyasu ganó la batalla de Sekigahara en 1600 y fue nombrado shōgun en 1603. Sus descendientes gobernaron más de 260 años de paz casi ininterrumpida, el período Edo, en los que Japón limitó al mínimo el contacto con el extranjero.',
    related: ['shogun', 'periodo-edo', 'edo', 'daimyo'],
  },
  {
    id: 'daimyo', term: 'Daimyō', jp: '大名', aliases: ['daimyo', 'daimyō', 'daimio', 'daimios', 'señor feudal', 'señores feudales'],
    short: 'Un gran señor feudal: gobernaba un territorio propio y tenía su propio ejército de samuráis.',
    long: 'En el período Edo, un daimyō era un señor con tierras que producían al menos 10.000 koku de arroz al año. Juraban lealtad al shōgun y estaban obligados a vivir un año sí y otro no en Edo, dejando allí a su familia como garantía: el sistema sankin-kōtai.',
    related: ['shogun', 'samurai', 'koku', 'sankin-kotai'],
  },
  {
    id: 'samurai', term: 'Samurái', jp: '侍', aliases: ['samurai', 'samurái', 'samuráis', 'samurais'],
    short: 'Miembro de la clase guerrera de Japón, al servicio de un señor.',
    long: 'Durante siglos fueron guerreros. En la larga paz del período Edo, la mayoría se convirtió en funcionarios y administradores que conservaban sus dos espadas como símbolo. La era Meiji abolió sus privilegios: en 1876 se les prohibió portar espadas en público.',
    related: ['daimyo', 'ronin', 'restauracion-meiji'],
  },
  {
    id: 'ronin', term: 'Rōnin', jp: '浪人', aliases: ['ronin', 'rōnin'],
    short: 'Un samurái sin señor, ya sea porque su amo murió o porque cayó en desgracia.',
    related: ['samurai', 'daimyo'],
  },
  {
    id: 'ninja', term: 'Ninja', jp: '忍者', aliases: ['ninja', 'shinobi'],
    short: 'Agentes especializados en espionaje, infiltración y sabotaje. Los más famosos venían de las regiones montañosas de Iga y Kōga.',
    long: 'La imagen del ninja vestido de negro viene del teatro y del cine. Los históricos eran sobre todo espías y exploradores. En el período Edo, descendientes de las familias de Iga y Kōga trabajaron como guardias en el castillo del shōgun.',
    related: ['samurai', 'tokugawa'],
  },
  {
    id: 'emperador', term: 'Emperador de Japón', jp: '天皇 (tennō)', aliases: ['emperador', 'tenno', 'tennō'],
    short: 'El soberano de Japón. Según la tradición, su familia reina desde hace más de 2.600 años.',
    long: 'Durante casi siete siglos, el poder real lo tuvieron los shōgun, y el emperador vivía en Kioto con un papel sobre todo religioso y ceremonial. Con la Restauración Meiji de 1868 volvió al centro del gobierno y se trasladó a Tokio. Hoy es el símbolo del Estado, sin poder político.',
    related: ['shogun', 'restauracion-meiji', 'kioto-capital'],
  },
  {
    id: 'restauracion-meiji', term: 'Restauración Meiji', aliases: ['restauracion meiji', 'restauración meiji', 'era meiji', 'gobierno meiji'],
    short: 'El cambio de 1868 que terminó con el gobierno de los shōgun y devolvió el poder al emperador.',
    long: 'Llevó el nombre del emperador Meiji. En pocas décadas, Japón abolió los feudos y la clase samurái, adoptó una constitución, construyó ferrocarriles y fábricas y se convirtió en una potencia moderna. La capital pasó de Kioto a Edo, que se renombró Tokio.',
    related: ['emperador', 'shogunato', 'samurai', 'edo'],
  },
  {
    id: 'koku', term: 'Koku', jp: '石', aliases: ['koku'],
    short: 'Medida de arroz, cerca de 150 kilos: lo que comía una persona en un año. Se usaba para medir la riqueza de un feudo.',
    related: ['daimyo'],
  },
  {
    id: 'sankin-kotai', term: 'Sankin-kōtai', jp: '参勤交代', aliases: ['sankin kotai', 'sankin-kotai', 'sankin-kōtai'],
    short: 'La regla que obligaba a cada daimyō a vivir un año sí y otro no en Edo, junto al shōgun.',
    long: 'Las familias de los señores se quedaban en Edo de forma permanente. Los viajes con cientos de acompañantes eran carísimos, y así el shōgun mantenía a los daimyō ocupados, vigilados y sin dinero para rebelarse.',
    related: ['daimyo', 'tokugawa', 'edo'],
  },
  {
    id: 'fujiwara', term: 'Clan Fujiwara', jp: '藤原', aliases: ['fujiwara'],
    short: 'La familia noble más poderosa de la corte japonesa entre los siglos IX y XII.',
    long: 'No gobernaban como emperadores, sino casando a sus hijas con ellos y ocupando el cargo de regente. Fundaron el templo Kōfuku-ji y el santuario Kasuga Taisha en Nara.',
    related: ['emperador', 'periodo-heian', 'periodo-nara'],
  },
  {
    id: 'yakuza', term: 'Yakuza', jp: 'ヤクザ', aliases: ['yakuza'],
    short: 'El crimen organizado japonés, con una larga historia en barrios de entretenimiento.',
  },

  // ── Épocas y lugares ──
  {
    id: 'periodo-nara', term: 'Período Nara', aliases: ['periodo nara', 'período nara'],
    short: 'La época (710-794) en que Nara fue la capital de Japón y el budismo se volvió religión de Estado.',
    related: ['fujiwara', 'budismo', 'periodo-heian'],
  },
  {
    id: 'periodo-heian', term: 'Período Heian', aliases: ['periodo heian', 'período heian', 'heian', 'heian-kyo', 'heian-kyō'],
    short: 'La época (794-1185) en que la corte imperial vivió en Heian-kyō, la actual Kioto. Fue una edad de oro de la poesía y la vida cortesana.',
    related: ['kioto-capital', 'fujiwara', 'emperador'],
  },
  {
    id: 'kioto-capital', term: 'Kioto, la capital', aliases: ['antigua capital'],
    short: 'Kioto fue la capital imperial de Japón durante más de mil años, del 794 a 1868.',
    related: ['periodo-heian', 'restauracion-meiji'],
  },
  {
    id: 'periodo-edo', term: 'Período Edo', aliases: ['periodo edo', 'período edo', 'epoca edo', 'época edo'],
    short: 'La época (1603-1868) de los shōgun Tokugawa: más de 260 años de paz y de aislamiento casi total del exterior.',
    related: ['tokugawa', 'edo', 'shogunato'],
  },
  {
    id: 'edo', term: 'Edo', jp: '江戸', aliases: ['edo'],
    short: 'El antiguo nombre de Tokio. En 1868 pasó a llamarse Tokio, «capital del este».',
    long: 'Era la sede del shōgun y, hacia el siglo XVIII, una de las ciudades más grandes del mundo, con cerca de un millón de habitantes.',
    related: ['periodo-edo', 'tokugawa', 'restauracion-meiji'],
  },

  // ── Geiko y Gion ──
  {
    id: 'geiko', term: 'Geiko / Geisha', jp: '芸妓 · 芸者', aliases: ['geiko', 'geisha', 'geishas', 'geikos'],
    short: 'Artistas profesionales de la danza, la música y la conversación, que entretienen en banquetes. En Kioto se las llama geiko.',
    long: 'Su nombre significa «persona de las artes». Se forman durante años en danza tradicional, shamisen y ceremonia del té. No son prostitutas: esa confusión viene en parte de la posguerra.',
    related: ['maiko', 'ochaya', 'okiya', 'hanamachi'],
  },
  {
    id: 'maiko', term: 'Maiko', jp: '舞妓', aliases: ['maiko', 'maikos'],
    short: 'Aprendiz de geiko. Se reconoce por su kimono muy colorido, de mangas largas, y por los adornos de su peinado.',
    long: 'Suelen empezar entre los 15 y los 20 años y se forman durante unos cinco años antes de convertirse en geiko. Llevan peinados hechos con su propio pelo; las geiko, en cambio, usan pelucas.',
    related: ['geiko', 'okiya', 'hanamachi'],
  },
  {
    id: 'ochaya', term: 'Ochaya', jp: 'お茶屋', aliases: ['ochaya', 'casa de te', 'casa de té', 'casas de te', 'casas de té'],
    short: 'Casa de té donde las geiko y maiko entretienen a los clientes. Normalmente solo se entra por recomendación de un cliente conocido.',
    related: ['geiko', 'maiko', 'hanamachi'],
  },
  {
    id: 'okiya', term: 'Okiya', jp: '置屋', aliases: ['okiya'],
    short: 'La casa donde viven y se forman las maiko, a cargo de una «madre» que las mantiene durante su aprendizaje.',
    related: ['maiko', 'geiko'],
  },
  {
    id: 'hanamachi', term: 'Hanamachi', jp: '花街', aliases: ['hanamachi', 'barrio de geishas'],
    short: '«Ciudad de las flores»: los barrios de geiko, con sus casas de té. Gion Kōbu es el más famoso de Kioto.',
    related: ['geiko', 'ochaya'],
  },
  {
    id: 'kabuki', term: 'Kabuki', jp: '歌舞伎', aliases: ['kabuki'],
    short: 'Teatro tradicional japonés de vestuarios espectaculares y maquillaje intenso. Nació en Kioto a comienzos del siglo XVII.',
    long: 'Lo inició hacia 1603 una mujer, Izumo no Okuni, con danzas a orillas del río Kamo. Más tarde se prohibió que actuaran mujeres, y desde entonces todos los papeles los hacen hombres.',
    related: ['periodo-edo'],
  },
  {
    id: 'kimono', term: 'Kimono', jp: '着物', aliases: ['kimono', 'kimonos', 'yukata'],
    short: 'La vestimenta tradicional japonesa, cruzada al frente y atada con un cinturón ancho llamado obi.',
  },

  // ── Religión: sintoísmo ──
  {
    id: 'sintoismo', term: 'Sintoísmo', jp: '神道', aliases: ['sintoismo', 'sintoísmo', 'sintoista', 'sintoísta', 'sintoistas', 'shinto'],
    short: 'La religión original de Japón: venera a los kami, los espíritus presentes en la naturaleza, los antepasados y algunas personas.',
    long: 'Durante más de mil años convivió mezclado con el budismo. En 1868, el gobierno Meiji los separó por ley. Hoy muchos japoneses visitan santuarios y templos sin sentir contradicción.',
    related: ['kami', 'santuario', 'torii', 'budismo'],
  },
  {
    id: 'kami', term: 'Kami', jp: '神', aliases: ['kami'],
    short: 'En el sintoísmo, los espíritus o divinidades: pueden habitar una montaña, un árbol, un río, o ser antepasados y personas veneradas.',
    related: ['sintoismo', 'santuario'],
  },
  {
    id: 'santuario', term: 'Santuario y templo', aliases: ['santuario', 'santuario sintoista', 'santuario sintoísta', 'jinja', 'templo', 'templo budista'],
    short: 'En Japón, el santuario es sintoísta y el templo es budista. El santuario tiene una puerta torii; el templo suele tener una gran puerta de madera y a veces una pagoda.',
    long: 'Pistas en el nombre: los santuarios terminan en -jinja, -gū o -taisha (Meiji Jingū, Kasuga Taisha); los templos en -ji o -dera (Kinkaku-ji, Kiyomizu-dera). En el santuario se reza con dos reverencias, dos aplausos y una reverencia; en el templo, en silencio y sin aplaudir.',
    related: ['torii', 'sintoismo', 'budismo', 'pagoda'],
  },
  {
    id: 'torii', term: 'Torii', jp: '鳥居', aliases: ['torii'],
    short: 'La puerta de los santuarios sintoístas. Marca el paso del mundo cotidiano al espacio sagrado.',
    long: 'Se acostumbra hacer una pequeña reverencia antes de cruzarlo y caminar por un costado, porque el centro está reservado para los kami.',
    related: ['santuario', 'kami'],
  },
  {
    id: 'temizuya', term: 'Temizuya', jp: '手水舎', aliases: ['temizuya', 'fuente para lavarte las manos'],
    short: 'La fuente para purificarse a la entrada de santuarios y templos.',
    long: 'Con el cucharón: lava la mano izquierda, luego la derecha, vierte un poco de agua en la mano y enjuágate la boca (sin tocar el cucharón con los labios), y al final deja correr el agua por el mango.',
    related: ['santuario'],
  },
  {
    id: 'shimenawa', term: 'Shimenawa', jp: '注連縄', aliases: ['shimenawa', 'cuerda sagrada'],
    short: 'Cuerda de paja de arroz que marca algo sagrado: un árbol, una roca o la entrada de un santuario.',
    related: ['kami', 'santuario'],
  },
  {
    id: 'ema', term: 'Ema', jp: '絵馬', aliases: ['ema'],
    short: 'Tablillas de madera donde se escriben deseos y se dejan colgadas en santuarios y templos.',
    related: ['omikuji', 'santuario'],
  },
  {
    id: 'omikuji', term: 'Omikuji', jp: 'おみくじ', aliases: ['omikuji'],
    short: 'Papelitos de la suerte que se sacan al azar en santuarios y templos. Si te toca mala suerte, se ata en el lugar para dejarla ahí.',
    related: ['ema'],
  },
  {
    id: 'matsuri', term: 'Matsuri', jp: '祭り', aliases: ['matsuri', 'festival'],
    short: 'Festival tradicional, casi siempre ligado a un santuario, con desfiles, música y comida callejera.',
    related: ['mikoshi', 'santuario'],
  },
  {
    id: 'mikoshi', term: 'Mikoshi', jp: '神輿', aliases: ['mikoshi', 'santuario portatil', 'santuario portátil', 'santuarios portatiles', 'santuarios portátiles'],
    short: 'Santuario portátil que los vecinos cargan en hombros durante los festivales, llevando al kami a recorrer el barrio.',
    related: ['matsuri', 'kami'],
  },
  {
    id: 'hatsumode', term: 'Hatsumōde', jp: '初詣', aliases: ['hatsumode', 'hatsumōde'],
    short: 'La primera visita del año a un santuario o templo, en los primeros días de enero.',
    related: ['santuario'],
  },

  // ── Religión: budismo ──
  {
    id: 'budismo', term: 'Budismo', aliases: ['budismo', 'budista', 'budistas'],
    short: 'Religión nacida en la India que llegó a Japón en el siglo VI, desde Corea y China.',
    long: 'En Japón se desarrollaron muchas escuelas, como el zen o la Tierra Pura. Durante siglos los templos budistas fueron centros de poder, de estudio y de arte.',
    related: ['buda', 'zen', 'santuario', 'sintoismo'],
  },
  {
    id: 'buda', term: 'Buda', aliases: ['buda', 'gran buda', 'daibutsu', 'vairocana'],
    short: '«El despierto»: quien alcanzó la iluminación. El budismo japonés venera a varios budas, como Vairocana, el gran Buda de Nara.',
    related: ['budismo', 'kannon', 'bodhisattva'],
  },
  {
    id: 'bodhisattva', term: 'Bodhisattva', aliases: ['bodhisattva', 'bodhisattvas'],
    short: 'Un ser que podría alcanzar la iluminación, pero se queda para ayudar a los demás a lograrla.',
    related: ['kannon', 'buda'],
  },
  {
    id: 'kannon', term: 'Kannon', jp: '観音', aliases: ['kannon'],
    short: 'La bodhisattva de la compasión, que escucha los ruegos del mundo. Es una de las figuras más veneradas de Japón.',
    related: ['bodhisattva', 'budismo'],
  },
  {
    id: 'hibutsu', term: 'Hibutsu', jp: '秘仏', aliases: ['hibutsu', 'imagen secreta'],
    short: 'Una imagen sagrada secreta, que se guarda oculta y no se muestra al público, o solo en ocasiones muy especiales.',
    related: ['budismo', 'kannon'],
  },
  {
    id: 'nio', term: 'Niō', jp: '仁王', aliases: ['nio', 'niō'],
    short: 'Los dos guardianes musculosos de las puertas de los templos. Uno tiene la boca abierta («a») y el otro cerrada («un»): el principio y el fin de todo.',
    related: ['budismo'],
  },
  {
    id: 'pagoda', term: 'Pagoda', jp: '塔', aliases: ['pagoda', 'pagodas'],
    short: 'Torre de varios pisos de los templos budistas. Originalmente servía para guardar reliquias de Buda.',
    long: 'Viene de la estupa india. Muchas pagodas japonesas han resistido siglos de terremotos gracias a un pilar central de madera que se balancea y amortigua el movimiento.',
    related: ['budismo', 'buda'],
  },
  {
    id: 'zen', term: 'Zen', jp: '禅', aliases: ['zen'],
    short: 'Escuela budista centrada en la meditación. Influyó en la ceremonia del té, la caligrafía y los jardines japoneses.',
    related: ['karesansui', 'budismo'],
  },
  {
    id: 'karesansui', term: 'Jardín seco (karesansui)', jp: '枯山水', aliases: ['karesansui', 'jardin seco', 'jardín seco', 'jardin de rocas', 'jardín de rocas'],
    short: 'Jardín zen hecho de rocas y grava rastrillada, sin agua: la grava representa el agua y las rocas, montañas o islas.',
    related: ['zen'],
  },

  // ── Ciudad moderna ──
  {
    id: 'yokocho', term: 'Yokochō', jp: '横丁', aliases: ['yokocho', 'yokochō'],
    short: 'Callejón angosto lleno de bares y restaurantes diminutos. Muchos nacieron de los mercados de la posguerra.',
    related: ['yami-ichi'],
  },
  {
    id: 'yami-ichi', term: 'Mercado negro de posguerra', jp: '闇市 (yami-ichi)', aliases: ['mercado negro', 'yami-ichi'],
    short: 'Los mercados informales que surgieron en Japón tras 1945, cuando faltaba comida y casi todo estaba racionado.',
    related: ['yokocho'],
  },

  // ── La Serena 1680 y la Colonia ──
  {
    id: 'pirata', term: 'Pirata', aliases: ['pirata', 'piratas'],
    short: 'Quien roba y ataca en el mar o en la costa por cuenta propia, sin permiso de ningún gobierno.',
    related: ['corsario', 'bucanero', 'filibustero'],
  },
  {
    id: 'corsario', term: 'Corsario', aliases: ['corsario', 'corsarios', 'patente de corso'],
    short: 'Un pirata «con permiso»: atacaba barcos y ciudades enemigas con una autorización de su gobierno, la patente de corso.',
    long: 'Para el país que lo autorizaba era casi un militar; para sus víctimas, un pirata. En la práctica la línea era muy difusa, y hombres como Sharp a veces actuaban sin permiso válido.',
    related: ['pirata', 'bucanero', 'filibustero'],
  },
  {
    id: 'bucanero', term: 'Bucanero', aliases: ['bucanero', 'bucaneros'],
    short: 'Pirata del Caribe del siglo XVII. El nombre viene de los cazadores de la isla La Española, que ahumaban carne en un «boucan».',
    related: ['pirata', 'filibustero', 'corsario'],
  },
  {
    id: 'filibustero', term: 'Filibustero', aliases: ['filibustero', 'filibusteros'],
    short: 'Otro nombre para los piratas del Caribe del siglo XVII. Viene del holandés vrijbuiter, «el que hace botín libre».',
    related: ['bucanero', 'pirata', 'corsario'],
  },
  {
    id: 'cabildo', term: 'Cabildo', aliases: ['cabildo'],
    short: 'El concejo que gobernaba una ciudad en la época colonial, formado por vecinos principales: algo así como el municipio de hoy.',
    related: ['corregidor'],
  },
  {
    id: 'corregidor', term: 'Corregidor', aliases: ['corregidor'],
    short: 'La autoridad nombrada por el gobierno colonial para administrar justicia y gobierno en una ciudad y su territorio.',
    related: ['cabildo'],
  },
  {
    id: 'acequia', term: 'Acequia', aliases: ['acequia', 'acequias', 'canales de riego'],
    short: 'Canal que lleva agua de un río para regar huertos y campos. En La Serena, muchas venían de canales que ya usaban los diaguitas.',
    related: ['diaguitas'],
  },
  {
    id: 'diaguitas', term: 'Diaguitas', aliases: ['diaguita', 'diaguitas'],
    short: 'Pueblo indígena de los valles del norte chico, como el Elqui. Eran agricultores con canales de riego y famosos por su cerámica decorada.',
    related: ['acequia', 'changos'],
  },
  {
    id: 'changos', term: 'Changos', aliases: ['chango', 'changos'],
    short: 'Pueblo pescador de la costa norte de Chile. Navegaban en balsas hechas con cueros de lobo marino inflados.',
    related: ['diaguitas'],
  },
  {
    id: 'calendario', term: 'Calendario juliano y gregoriano', aliases: ['calendario juliano', 'calendario gregoriano'],
    short: 'En 1582 el papa reformó el calendario, que iba atrasado. España lo adoptó de inmediato, pero Inglaterra recién en 1752. Por eso en 1680 las fechas inglesas iban 10 días atrás.',
  },
  {
    id: 'charqui', term: 'Charqui', aliases: ['charqui'],
    short: 'Carne salada y secada al sol, alimento clave para viajes largos. La palabra viene del quechua ch’arki.',
  },
  {
    id: 'ordenes', term: 'Órdenes religiosas', aliases: ['franciscanos', 'mercedarios', 'jesuitas', 'agustinos'],
    short: 'Comunidades de religiosos católicos con sus propias reglas, como franciscanos, mercedarios o jesuitas. En las ciudades coloniales cada una tenía su iglesia y convento.',
  },
  // ── Chile: Copiapó y la Revolución Constituyente ──
  {
    id: 'revolucion-constituyente', term: 'Revolución Constituyente', aliases: ['revolucion constituyente', 'guerra civil de 1859', 'revolucion de 1859', 'ejercito constituyente'],
    short: 'El levantamiento de Copiapó contra el gobierno de Manuel Montt (enero-abril de 1859), encabezado por Pedro León Gallo.',
    long: 'Pedía una asamblea que cambiara la Constitución de 1833 y menos centralismo. Ganó en Los Loros (14 de marzo) y fue derrotado en Cerro Grande (29 de abril de 1859). Algunos historiadores, como Joaquín Fernández Abara, prefieren llamarla guerra civil.',
    related: ['constitucion-1833', 'intendente', 'peso-constituyente', 'partido-radical'],
  },
  {
    id: 'constitucion-1833', term: 'Constitución de 1833', aliases: ['constitucion de 1833'],
    short: 'La Constitución que rigió Chile casi un siglo, hasta 1925. Daba enorme poder al presidente y al gobierno central.',
    related: ['revolucion-constituyente', 'centralismo'],
  },
  {
    id: 'centralismo', term: 'Centralismo', aliases: ['centralismo', 'centralista'],
    short: 'Forma de gobierno en que las decisiones se concentran en la capital y las provincias tienen poca autonomía.',
    related: ['constitucion-1833', 'intendente'],
  },
  {
    id: 'intendente', term: 'Intendente', aliases: ['intendente', 'intendentes'],
    short: 'La autoridad que gobernaba cada provincia de Chile, nombrada por el presidente desde Santiago.',
    related: ['centralismo'],
  },
  {
    id: 'chanarcillo', term: 'Chañarcillo', aliases: ['chanarcillo', 'chañarcillo'],
    short: 'Mineral de plata al sur de Copiapó, descubierto por Juan Godoy en 1832. Fue uno de los más ricos de América y financió el auge de Atacama.',
    related: ['peso-constituyente'],
  },
  {
    id: 'peso-constituyente', term: 'Peso Constituyente', aliases: ['peso constituyente'],
    short: 'La moneda de plata que acuñaron los rebeldes de Copiapó en 1859, con plata donada en parte por Pedro León Gallo y su madre.',
    related: ['revolucion-constituyente', 'chanarcillo'],
  },
  {
    id: 'maestranza', term: 'Maestranza', aliases: ['maestranza', 'maestranzas'],
    short: 'Taller grande para fabricar y reparar máquinas, sobre todo de ferrocarriles y minería.',
  },
  {
    id: 'partido-radical', term: 'Partido Radical', aliases: ['partido radical'],
    short: 'Partido político chileno nacido en la década de 1860 de las ideas liberales de 1859; entre sus fundadores estuvieron Pedro León Gallo y los hermanos Matta.',
    related: ['revolucion-constituyente'],
  },
  // ── Roma antigua ──
  {
    id: 'idus', term: 'Idus', jp: 'Idus Martiae', aliases: ['idus', 'idus de marzo'],
    short: 'En el calendario romano, el día de mitad de mes: el 15 en marzo, mayo, julio y octubre, y el 13 en los demás meses.',
    long: 'Los idus de marzo, el 15 de marzo, eran un día de fiestas religiosas y de pago de deudas. Desde el asesinato de Julio César en el año 44 a. C., la expresión quedó como sinónimo de un peligro anunciado.',
    related: ['curia', 'dictador'],
  },
  {
    id: 'curia', term: 'Curia', jp: 'Curia', aliases: ['curia'],
    short: 'El edificio donde se reunía el Senado romano.',
    long: 'La Curia del Foro Romano se incendió en el año 52 a. C., y mientras se construía la nueva, el Senado se reunía en otros lugares, como la sala del pórtico de Pompeyo, donde murió César.',
    related: ['idus'],
  },
  {
    id: 'dictador', term: 'Dictador', jp: 'Dictator', aliases: ['dictador', 'dictador perpetuo'],
    short: 'En la República romana, un magistrado con poder absoluto, nombrado en emergencias y por un máximo de seis meses.',
    long: 'Julio César se hizo nombrar dictador varias veces, y a comienzos del año 44 a. C., dictador perpetuo, es decir, de por vida. Para muchos senadores, eso era convertirse en rey, y fue uno de los motivos de su asesinato.',
    related: ['idus'],
  },
  {
    id: 'triunfo', term: 'Triunfo', jp: 'Triumphus', aliases: ['triunfo', 'triunfos'],
    short: 'El gran desfile con que Roma celebraba a un general victorioso: atravesaba la ciudad por la Vía Sacra hasta el templo de Júpiter en el Capitolio.',
    long: 'El general iba en un carro, con la cara pintada de rojo, seguido de su ejército, el botín y los prisioneros encadenados. La tradición dice que un esclavo le susurraba al oído que recordara que era mortal.',
  },
  {
    id: 'vestales', term: 'Vestales', jp: 'Virgines Vestales', aliases: ['vestales', 'vírgenes vestales'],
    short: 'Las sacerdotisas de Vesta, la diosa del hogar. Cuidaban el fuego sagrado de Roma, que nunca debía apagarse.',
    long: 'Eran seis, elegidas de niñas entre familias nobles, y servían treinta años. Tenían privilegios únicos para una mujer romana, pero si rompían su voto de castidad las enterraban vivas.',
  },
  {
    id: 'toga', term: 'Toga', jp: 'Toga', aliases: ['toga'],
    short: 'La prenda de lana blanca, enrollada al cuerpo, que solo podían usar los ciudadanos romanos.',
    long: 'Los senadores la llevaban con una franja púrpura. Era pesada e incómoda, y se usaba sobre todo en actos públicos, como las sesiones del Senado.',
  },
];

export const termById = (id) => GLOSSARY.find((g) => g.id === id);
