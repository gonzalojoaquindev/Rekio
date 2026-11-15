// Horarios de referencia (verificados en nov. 2026) y días de cierre de los lugares que cierran.
// Los lugares que no aparecen aquí se pueden visitar a cualquier hora (calles, puentes, exteriores).
//
//   area:           nombre del recinto que cierra, para los avisos
//   seasons:        [{ from: 'MM-DD', to: 'MM-DD', open, close, last }]  (last = última entrada)
//   closedWeekdays: 0 = domingo … 6 = sábado
//   holidayOpens:   si el día de cierre semanal es feriado, abre igual
//   shiftAfter:     días de la semana cuyo cierre pasa al día siguiente cuando son feriado
//   exceptHolidays: feriados en que NO se aplica holidayOpens ('MM-DD')
//   closedRanges:   [['MM-DD', 'MM-DD']] cierres anuales (pueden cruzar el año)
//   closedDates:    ['MM-DD'] cierres puntuales cada año
//   soft:           solo cierra el interior; el lugar se puede ver desde fuera
//   plural:         el nombre del recinto va en plural (para la redacción de los avisos)

const ALL_YEAR = (open, close, last) => [{ from: '01-01', to: '12-31', open, close, last }];

const KYOTO_GOSHO = {
  area: 'el Palacio Imperial de Kioto',
  seasons: [
    { from: '04-01', to: '08-31', open: '09:00', close: '17:00', last: '16:20' },
    { from: '09-01', to: '09-30', open: '09:00', close: '16:30', last: '15:50' },
    { from: '03-01', to: '03-31', open: '09:00', close: '16:30', last: '15:50' },
    { from: '10-01', to: '02-29', open: '09:00', close: '16:00', last: '15:20' },
  ],
  closedWeekdays: [1],
  holidayOpens: true,
  shiftAfter: [1],
  closedRanges: [['12-28', '01-04']],
};

const KIYOMIZU = {
  area: 'el templo Kiyomizu-dera',
  seasons: [
    { from: '07-01', to: '08-31', open: '06:00', close: '18:30' },
    { from: '11-21', to: '11-30', open: '06:00', close: '21:30', last: '21:00' }, // iluminación de otoño 2026
    { from: '01-01', to: '12-31', open: '06:00', close: '18:00' },
  ],
};

const KINKAKU = { area: 'el templo Kinkaku-ji', seasons: ALL_YEAR('09:00', '17:00') };

const EAST_GARDENS = {
  area: 'los Jardines del Este',
  plural: true,
  seasons: [
    { from: '03-01', to: '04-14', open: '09:00', close: '17:00', last: '16:30' },
    { from: '04-15', to: '08-31', open: '09:00', close: '18:00', last: '17:30' },
    { from: '09-01', to: '09-30', open: '09:00', close: '17:00', last: '16:30' },
    { from: '10-01', to: '10-31', open: '09:00', close: '16:30', last: '16:00' },
    { from: '11-01', to: '02-29', open: '09:00', close: '16:00', last: '15:30' },
  ],
  closedWeekdays: [1, 5],
  holidayOpens: true,
  shiftAfter: [1],
  exceptHolidays: ['02-23'],
  closedRanges: [['12-28', '01-03']],
};

// Meiji Jingu abre al amanecer y cierra al atardecer (tabla oficial por mes)
const MEIJI_MONTHS = [
  ['06:40', '16:20'], ['06:20', '16:50'], ['05:40', '17:20'], ['05:10', '17:50'], ['05:00', '18:10'], ['05:00', '18:30'],
  ['05:00', '18:20'], ['05:00', '18:00'], ['05:20', '17:20'], ['05:40', '16:40'], ['06:10', '16:10'], ['06:40', '16:00'],
];
const MEIJI = {
  area: 'el santuario Meiji Jingu',
  seasons: MEIJI_MONTHS.map(([open, close], i) => {
    const mm = String(i + 1).padStart(2, '0');
    return { from: `${mm}-01`, to: `${mm}-31`, open, close };
  }),
};

export const HOURS = {
  // Kioto
  seishomon: KYOTO_GOSHO,
  shishinden: KYOTO_GOSHO,
  kiyo_hondo: KIYOMIZU,
  kiyo_okunoin: KIYOMIZU,
  kiyo_otowa: KIYOMIZU,
  tenryuji: { area: 'el jardín de Tenryū-ji', seasons: ALL_YEAR('08:30', '17:00', '16:50') },
  okochi: { area: 'la villa Ōkōchi Sansō', seasons: ALL_YEAR('09:00', '17:00') },
  kinkaku_view: KINKAKU,
  kinkaku_pine: KINKAKU,
  anmintaku: KINKAKU,
  sekkatei: KINKAKU,
  ryoanji: {
    area: 'el templo Ryōan-ji',
    seasons: [
      { from: '03-01', to: '11-30', open: '08:00', close: '17:00' },
      { from: '12-01', to: '02-29', open: '08:30', close: '16:30' },
    ],
  },
  kenninji: {
    area: 'el templo Kennin-ji',
    seasons: [
      { from: '03-01', to: '10-31', open: '10:00', close: '17:00', last: '16:30' },
      { from: '11-01', to: '02-29', open: '10:00', close: '16:30', last: '16:00' },
    ],
    closedDates: ['04-20', '06-04', '06-05'],
    closedRanges: [['12-28', '12-31']],
  },
  // Tokio
  tk_sensoji: {
    area: 'el salón principal de Sensō-ji',
    soft: true,
    seasons: [
      { from: '04-01', to: '09-30', open: '06:00', close: '17:00' },
      { from: '10-01', to: '03-31', open: '06:30', close: '17:00' },
    ],
  },
  tk_meiji_torii: MEIJI,
  tk_sakadaru: MEIJI,
  tk_meiji_honden: MEIJI,
  tk_kiyomasa: {
    area: 'el Jardín interior de Meiji Jingu',
    seasons: [
      { from: '03-01', to: '10-31', open: '09:00', close: '16:30', last: '16:00' },
      { from: '11-01', to: '02-29', open: '09:00', close: '16:00', last: '15:30' },
    ],
  },
  tk_hyakunin: EAST_GARDENS,
  tk_tenshudai: EAST_GARDENS,
  // Nara
  nara_daibutsuden: {
    area: 'el Salón del Gran Buda',
    seasons: [
      { from: '04-01', to: '10-31', open: '07:30', close: '17:30' },
      { from: '11-01', to: '03-31', open: '08:00', close: '17:00' },
    ],
  },
  nara_kasuga: {
    area: 'el santuario Kasuga Taisha',
    seasons: [
      { from: '03-01', to: '10-31', open: '06:30', close: '17:30' },
      { from: '11-01', to: '02-29', open: '07:00', close: '17:00' },
    ],
  },
};

// Feriados nacionales de Japón (incluye feriados de reemplazo)
export const JP_HOLIDAYS = new Set([
  // 2026
  '2026-01-01', '2026-01-12', '2026-02-11', '2026-02-23', '2026-03-20', '2026-04-29', '2026-05-03', '2026-05-04',
  '2026-05-05', '2026-05-06', '2026-07-20', '2026-08-11', '2026-09-21', '2026-09-22', '2026-09-23', '2026-10-12',
  '2026-11-03', '2026-11-23',
  // 2027
  '2027-01-01', '2027-01-11', '2027-02-11', '2027-02-23', '2027-03-21', '2027-03-22', '2027-04-29', '2027-05-03',
  '2027-05-04', '2027-05-05', '2027-07-19', '2027-08-11', '2027-09-20', '2027-09-23', '2027-10-11', '2027-11-03',
  '2027-11-23',
]);
