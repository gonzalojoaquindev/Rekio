import { autoPlan, dayPlan, dayWarnings, tourSuggestions, toggleSaved, tripDates, tripShareText, coveredPlaces } from '../src/trips';

const base = { id: 't1', name: 'Japón', cities: ['tokyo', 'kyoto'], start: '2027-03-01', end: '2027-03-04', saved: [], days: {} };
const add = (trip, kind, id) => ({ ...trip, ...toggleSaved(trip, kind, id) });

test('fechas del viaje', () => {
  expect(tripDates(base)).toEqual(['2027-03-01', '2027-03-02', '2027-03-03', '2027-03-04']);
});

test('sugiere el recorrido que contiene lugares guardados', () => {
  let t = add(base, 'place', 'kinkaku_view');
  t = add(t, 'place', 'ryoanji');
  const s = tourSuggestions(t);
  expect(s[0].tour.id).toBe('kinkaku');
  expect(s[0].hits.length).toBe(2);
  t = add(t, 'tour', 'kinkaku');
  expect(coveredPlaces(t).has('ryoanji')).toBe(true);
  expect(tourSuggestions(t).find((x) => x.tour.id === 'kinkaku')).toBeUndefined();
});

test('reparte por ciudad y evita el lunes para el castillo de Edo', () => {
  // 2027-03-01 es lunes: los Jardines del Este cierran
  let t = add(base, 'tour', 'edo');
  t = add(t, 'tour', 'asakusa');
  t = add(t, 'tour', 'kinkaku');
  const days = autoPlan(t);
  const dayOf = (id) => Object.keys(days).find((d) => days[d].some((x) => x.id === id));
  expect(dayOf('edo')).not.toBe('2027-03-01');
  expect(dayOf('asakusa')).toBe('2027-03-01');
  // Kioto va en otro día que Tokio
  expect(dayOf('kinkaku')).not.toBe(dayOf('asakusa'));
});

test('arma horarios, transporte y avisa si algo cierra', () => {
  let t = add(base, 'tour', 'edo');
  t = add(t, 'tour', 'meiji');
  t = { ...t, days: { '2027-03-01': [{ kind: 'tour', id: 'meiji' }, { kind: 'tour', id: 'edo' }] } };
  const plan = dayPlan(t, '2027-03-01');
  expect(plan.items[0].start).toBe('07:00');
  const edo = plan.items.find((x) => x.tourId === 'edo');
  expect(edo.transit.text).toMatch(/En tren, metro o bus/);
  const w = dayWarnings(t, '2027-03-01');
  expect(w.find((x) => x.tourId === 'edo').blocking).toBe(true);
  expect(tripShareText(t)).toMatch(/2027-03-01\n  07:00 Meiji Jingu/);
});

test('encadena los recorridos y lugares de un día del viaje, y propone el día siguiente', () => {
  const { nextInDay } = require('../src/day');
  const t = {
    ...base,
    days: {
      '2027-03-02': [{ kind: 'tour', id: 'asakusa' }, { kind: 'place', id: 'tk_hachiko' }, { kind: 'tour', id: 'shibuya' }],
      '2027-03-04': [{ kind: 'tour', id: 'kinkaku' }],
    },
  };
  const trips = [t];
  const id = 'trip:t1:2027-03-02';
  expect(nextInDay('asakusa', id, { trips }).placeId).toBe('tk_hachiko');
  expect(nextInDay('asakusa', id, { trips, toursOnly: true }).tour.id).toBe('shibuya');
  const end = nextInDay('shibuya', id, { trips });
  expect(end.nextDay).toEqual({ tripId: 't1', date: '2027-03-04', number: 4 });
});

test('lugares sueltos del catálogo: horario propio, noche y avisos', () => {
  // 2027-03-01 lunes, 2027-03-07 domingo
  let t = { ...base, start: '2027-03-01', end: '2027-03-07' };
  t = add(t, 'place', 'tt_goldengai');
  t = add(t, 'place', 'tt_tower');
  t = add(t, 'place', 'tt_tnm'); // cierra lunes
  const days = autoPlan(t);
  const dayOf = (id) => Object.keys(days).find((d) => days[d].some((x) => x.id === id));
  expect(dayOf('tt_tnm')).not.toBe('2027-03-01');
  const d = { ...t, days: { '2027-03-07': [{ kind: 'place', id: 'tt_tsukiji' }, { kind: 'place', id: 'tt_goldengai' }] } };
  const plan = dayPlan(d, '2027-03-07');
  expect(plan.items[0].start).toBe('07:00');
  expect(plan.items.find((x) => x.placeId === 'tt_goldengai').start >= '17:30').toBe(true);
  const w = dayWarnings(d, '2027-03-07');
  expect(w.some((x) => x.placeId === 'tt_tsukiji' && /cerrado ese día \(domingo\)/.test(x.message))).toBe(true);
});
