import { dayProgress, planWarning, nextTourInDay, currentItinerary } from '../src/day';
import { itineraryById } from '../src/data/itineraries';
const itin = itineraryById('tokio-ultimo-dia');
const at = (hhmm) => new Date(`2026-11-16T${hhmm}:00+09:00`);

test('estado del día según la hora real', () => {
  expect(dayProgress(itin, at('11:20'), { completed: [] }).text).toBe('Ahora toca: Ueno');
  expect(dayProgress(itin, at('11:20'), { activeTourId: 'ueno' }).text).toBe('Vas a tiempo · Ueno hasta las 12:00');
  const late = dayProgress(itin, at('15:25'), { activeTourId: 'koishikawa' });
  expect(late.text).toMatch(/^Vas 25 min atrasado · Shinjuku era a las 15:30/);
  expect(dayProgress(itin, at('13:30'), {}).text).toBe('Lo siguiente: a las 13:45');
  expect(dayProgress(itin, new Date('2026-11-20T10:00:00+09:00'), {}).text).toMatch(/^Plan del lunes 16 de nov/);
});

test('el plan de hoy no choca con horarios de cierre', () => {
  for (const it of itin.items) expect(planWarning(itin, it)).toBe(null);
});

test('siguiente recorrido del día', () => {
  expect(nextTourInDay('ueno', itin.id).tour.id).toBe('koishikawa');
  expect(nextTourInDay('shibuya', itin.id)).toBe(null);
  expect(currentItinerary(at('10:00')).id).toBe(itin.id);
});
