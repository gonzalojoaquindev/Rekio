// Ciudades y recorridos guiados. Para agregar una ciudad nueva: súmala a CITIES,
// agrega sus lugares en places.js y crea sus recorridos aquí.
//   stops[].optional: parada opcional (se muestra con otro ícono y se puede saltar)
//   stamp: estampilla que se gana al completar el recorrido

export const CITIES = [
  { id: 'kyoto', name: 'Kioto', country: 'Japón', cc: 'JP', lat: 35.0116, lng: 135.7681 },
];

export const TOURS = [
  {
    "id": "gion",
    "city": "kyoto",
    "category": "Barrios históricos",
    "description": "El barrio de las geiko, las casas de té y el nacimiento del kabuki, con historias de samuráis del fin de una era.",
    "cover": "tatsumi",
    "badge": "Popular",
    "stamp": {
      "shape": "pill",
      "color": "#D9485F",
      "icon": "lantern"
    },
    "name": "Gion: geishas, samuráis y kabuki",
    "intro": "Bienvenido a Gion, el barrio de las geiko y las casas de té de Kioto. Vamos a caminar desde el río Kamo hasta el parque Maruyama, siguiendo el rastro del kabuki, de las maiko y de los últimos samuráis. Te voy guiando.",
    "outro": "Aquí termina el recorrido por Gion. Caminaste por las calles donde nació el kabuki, donde las geiko siguen trabajando y donde se tramó el fin de los samuráis. Gracias por caminar conmigo.",
    "stops": [
      {
        "id": "ikedaya",
        "optional": true,
        "guide": "Primera parada: el lugar del antiguo Ikedaya, en la calle Sanjō, cerca del río Kamo. Si no estás ahí, toca Cómo llegar."
      },
      {
        "id": "okuni",
        "guide": "Camina hacia el sur por la orilla del río Kamo hasta el puente de Shijō y crúzalo hacia el este. La estatua de la bailarina está al terminar el puente.",
        "optional": false
      },
      {
        "id": "minamiza",
        "optional": true,
        "guide": "Cruza la calle: el gran edificio con aire de castillo, justo enfrente, es el teatro Minamiza."
      },
      {
        "id": "tatsumi",
        "guide": "Ahora camina hacia el noreste unos trescientos metros, hasta el canal Shirakawa y su pequeño puente de piedra rodeado de sauces.",
        "optional": false
      },
      {
        "id": "kanikakuni",
        "optional": true,
        "guide": "Camina por la orilla del canal hacia el oeste, unos cincuenta metros. Busca una piedra grande con un poema grabado."
      },
      {
        "id": "ichiriki",
        "guide": "Vuelve a la avenida Shijō y camina hacia el este hasta una casa de muros rojo oscuro en una esquina. Ahí empieza la calle Hanamikoji.",
        "optional": false
      },
      {
        "id": "kaburenjo",
        "optional": true,
        "guide": "Baja por Hanamikoji hacia el sur, unos trescientos metros. El teatro de las geiko está a la izquierda, detrás de un jardín."
      },
      {
        "id": "kenninji",
        "guide": "Sigue hasta el final de Hanamikoji y entra al recinto del templo Kennin-ji por su puerta norte.",
        "optional": false
      },
      {
        "id": "yasui",
        "optional": true,
        "guide": "Sal de Kennin-ji por el lado este y camina unos doscientos metros hacia el sureste, hasta un pequeño santuario lleno de papeles blancos."
      },
      {
        "id": "yasakato",
        "guide": "Sube hacia el este por las calles de piedra, unos trescientos metros. La pagoda de cinco pisos te va a aparecer entre las casas.",
        "optional": false
      },
      {
        "id": "yasaka",
        "guide": "Desde la pagoda camina hacia el norte por las calles de piedra, unos seiscientos metros, hasta el santuario Yasaka.",
        "optional": false
      },
      {
        "id": "maruyama",
        "guide": "Atraviesa el santuario hacia el este y sal al parque Maruyama. El gran cerezo llorón está en el centro.",
        "optional": false
      }
    ]
  },
  {
    "id": "palacio",
    "city": "kyoto",
    "category": "Palacios y castillos",
    "description": "Durante más de quinientos años los emperadores vivieron detrás de estos muros. Puertas, batallas y el salón de las coronaciones.",
    "cover": "shishinden",
    "stamp": {
      "shape": "square",
      "color": "#6B5BD2",
      "icon": "palace"
    },
    "name": "Palacio Imperial de Kioto",
    "intro": "Bienvenido al recorrido del Palacio Imperial de Kioto. Durante más de quinientos años, los emperadores de Japón vivieron detrás de estos muros. Te voy a ir guiando parada por parada. Cuando llegues a cada punto, te contaré su historia.",
    "stops": [
      {
        "id": "sakaimachi",
        "guide": "Primera parada: la puerta Sakaimachi, la entrada sur del parque Kyoto Gyoen, sobre la calle Marutamachi. Si no estás ahí, toca el botón Cómo llegar y Google Maps te lleva.",
        "optional": false
      },
      {
        "id": "kenreimon",
        "guide": "Ahora camina derecho hacia el norte por el gran camino de gravilla, unos seiscientos metros. Al fondo verás un muro largo color crema, con cinco líneas blancas horizontales: esas líneas indican el rango más alto, el de la casa imperial. La puerta del centro de ese muro es Kenreimon. Ahí te espero.",
        "optional": true
      },
      {
        "id": "hamaguri",
        "guide": "Ahora gira a la izquierda, hacia el oeste. Camina unos doscientos cincuenta metros, dejando atrás la esquina del muro, hasta la puerta del parque que da a la avenida Karasuma. Es una puerta grande de madera oscura, con refuerzos de hierro.",
        "optional": false
      },
      {
        "id": "seishomon",
        "guide": "Vuelve hacia el muro del palacio y camina hacia el norte, siguiéndolo por su lado oeste, unos cuatrocientos metros. Busca la fila de visitantes y el control de seguridad: esa es la puerta Seishomon, la entrada al palacio.",
        "optional": false
      },
      {
        "id": "shishinden",
        "guide": "Entra, pasa el control y sigue la ruta señalizada. Pasarás por el pórtico de carruajes y las salas de espera de los nobles. Avanza hasta ver un gran patio de arena blanca con un salón enorme al fondo y dos árboles frente a su escalera. Ese es el Shishinden.",
        "optional": false
      }
    ],
    "outro": "Aquí termina el recorrido del Palacio Imperial. Desde estos muros se gobernó, al menos en nombre, Japón durante siglos, y aquí se vivieron los últimos días del Japón de los samuráis. Gracias por caminar conmigo. Si te queda energía, el resto del palacio y sus jardines siguen por la ruta señalizada."
  },
  {
    "id": "kiyomizu",
    "city": "kyoto",
    "category": "Templos",
    "description": "El templo del agua pura, su escenario de madera a 13 metros y las calles de piedra de Higashiyama.",
    "cover": "kiyo_hondo",
    "badge": "Imperdible",
    "stamp": {
      "shape": "circle",
      "color": "#2E9E6A",
      "icon": "pagoda"
    },
    "name": "Kiyomizu-dera y Higashiyama",
    "intro": "Bienvenido a Kiyomizu-dera, el templo del agua pura, uno de los lugares más queridos de Japón y Patrimonio de la Humanidad. Vamos a recorrer el templo desde su gran puerta roja y luego bajar por las calles de piedra hasta la pagoda de Yasaka. Te voy guiando.",
    "stops": [
      {
        "id": "kiyo_niomon",
        "guide": "Primera parada: la gran puerta roja de Kiyomizu-dera, al final de la cuesta Kiyomizu-zaka, la calle de tiendas que sube al templo. Si no estás ahí, toca Cómo llegar.",
        "optional": false
      },
      {
        "id": "kiyo_pagoda",
        "guide": "Sube las escaleras de la puerta y sigue hacia la derecha. A pocos pasos verás la pagoda bermellón de tres pisos.",
        "optional": true
      },
      {
        "id": "kiyo_hondo",
        "guide": "Sigue el camino principal hacia el este. Pasarás la boletería: la entrada al salón principal es pagada. Continúa hasta salir a la gran terraza de madera.",
        "optional": false
      },
      {
        "id": "kiyo_okunoin",
        "guide": "Sal del salón principal y sigue el camino que bordea la ladera hacia el sureste. A unos cien metros está el Okunoin. Cuando llegues, date vuelta para ver el escenario.",
        "optional": false
      },
      {
        "id": "kiyo_otowa",
        "guide": "Baja por las escaleras de piedra que salen cerca del Okunoin. Al pie del escenario verás una fila de gente frente a tres chorros de agua: es la cascada Otowa.",
        "optional": false
      },
      {
        "id": "sannenzaka",
        "guide": "Ahora sal del templo de vuelta por la puerta roja y baja por la calle de tiendas. A unos doscientos metros, a mano derecha, verás unas escaleras de piedra que bajan: ese es Sannenzaka. Cuidado con los escalones.",
        "optional": false
      },
      {
        "id": "ninenzaka",
        "guide": "Baja por Sannenzaka hasta el final de la cuesta y sigue por la calle de piedra hacia la izquierda. En unos cien metros entras a Ninenzaka.",
        "optional": true
      },
      {
        "id": "yasakato",
        "guide": "Al final de Ninenzaka sigue las calles de piedra hacia el sur, unos doscientos metros. La pagoda de cinco pisos te va a aparecer de frente, entre las casas.",
        "optional": false
      }
    ],
    "outro": "Aquí termina el recorrido de Kiyomizu. Recorriste un templo fundado hace más de mil doscientos años, bebiste del agua que le dio su nombre y bajaste por calles donde, dicen, no conviene tropezar. Si te quedan energías, desde aquí puedes seguir hacia Gion caminando hacia el norte."
  }
];
