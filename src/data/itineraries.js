// Itinerarios de un día: recorridos de la app + bloques libres, con cómo moverse entre ellos.
// Más adelante una IA podrá generar objetos con este mismo formato.
//
//   date:   'YYYY-MM-DD' (hora de Japón)
//   items:  { start, end, kind: 'tour' | 'free', tourId | (label, icon, note), at?: { lat, lng }, transit? }
//   transit: cómo llegar a este ítem desde el anterior { text, minutes }

export const ITINERARIES = [
  {
    id: 'tokio-ultimo-dia',
    name: 'Último día en Tokio',
    city: 'tokyo',
    date: '2026-11-16',
    items: [
      { start: '11:00', end: '12:00', kind: 'tour', tourId: 'ueno' },
      {
        start: '12:15',
        end: '13:15',
        kind: 'free',
        icon: '🍜',
        label: 'Almuerzo por Ueno',
        note: 'La calle Ameyoko, junto a la estación, tiene puestos y restaurantes baratos.',
        at: { lat: 35.7105, lng: 139.7745 },
        transit: { text: 'Baja del parque hacia la estación de Ueno. Ameyoko está bajo las vías del tren.', minutes: 8 },
      },
      {
        start: '13:45',
        end: '15:00',
        kind: 'tour',
        tourId: 'koishikawa',
        transit: {
          text: 'Metro línea Ōedo (magenta) desde Ueno-Okachimachi hasta Iidabashi, 3 estaciones. Luego unos 8 min a pie hasta la puerta oeste del jardín.',
          minutes: 25,
        },
      },
      {
        start: '15:30',
        end: '16:15',
        kind: 'tour',
        tourId: 'shinjuku',
        transit: {
          text: 'Desde Iidabashi, tren JR Chūō-Sōbu local (amarillo) hasta Shinjuku, unos 15 min. Sal por la salida Este.',
          minutes: 25,
        },
      },
      {
        start: '16:45',
        end: '17:45',
        kind: 'tour',
        tourId: 'shibuya',
        transit: { text: 'Desde Shinjuku, tren JR Yamanote (verde) hasta Shibuya, unos 7 min. Sal por la salida Hachikō.', minutes: 20 },
      },
      {
        start: '18:00',
        end: '19:00',
        kind: 'free',
        icon: '🍽️',
        label: 'Cena por Shibuya',
        note: 'Shibuya Yokochō, bajo Miyashita Park, reúne comida de todo Japón y abre hasta tarde.',
        at: { lat: 35.6614, lng: 139.7015 },
      },
      { start: '19:00', end: '21:00', kind: 'free', icon: '🧳', label: 'Regreso al hotel, maletas y preparativos' },
    ],
  },
];

export const itineraryById = (id) => ITINERARIES.find((x) => x.id === id);
