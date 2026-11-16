// Lógica de "Mi día": en qué parte del plan vas, atrasos y avisos de horarios en la hora planificada.
import { ITINERARIES, itineraryById } from './data/itineraries';
import { japanTime, tourStatus, DAY_NAMES } from './hours';
import { TOURS } from './data/tours';

const tourById = (id) => TOURS.find((x) => x.id === id);

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
// Fecha real de un horario del plan (hora de Japón)
export const planDate = (itin, hhmm) => new Date(`${itin.date}T${hhmm}:00+09:00`);

export function dayLabel(itin) {
  const jt = japanTime(planDate(itin, '12:00'));
  return `${DAY_NAMES[jt.wd]} ${jt.d} de ${MONTHS[jt.m - 1]}`;
}

// Itinerario para hoy (o el próximo), para mostrarlo primero
export function currentItinerary(now = new Date()) {
  const today = japanTime(now).key;
  const sorted = [...ITINERARIES].sort((a, b) => a.date.localeCompare(b.date));
  return sorted.find((x) => x.date === today) || sorted.find((x) => x.date > today) || sorted[sorted.length - 1] || null;
}

const doneToday = (completed, tourId, itin) =>
  completed.some((c) => c.tourId === tourId && japanTime(new Date(c.date)).key === itin.date);

// Estado del día respecto a la hora real
export function dayProgress(itin, now, { activeTourId, completed = [] } = {}) {
  const jt = japanTime(now);
  const items = itin.items.map((it, i) => ({
    ...it,
    i,
    done: it.kind === 'tour' && doneToday(completed, it.tourId, itin),
    tour: it.kind === 'tour' ? tourById(it.tourId) : null,
  }));
  if (jt.key !== itin.date) {
    return { items, tone: 'info', text: jt.key < itin.date ? `Plan para el ${dayLabel(itin)}` : `Plan del ${dayLabel(itin)}` };
  }
  const min = jt.min;
  const cur = items.find((x) => toMin(x.start) <= min && min < toMin(x.end));
  const next = items.find((x) => toMin(x.start) > min);
  // Atraso: sigues en un recorrido cuya hora de término ya pasó
  const activeItem = activeTourId && items.find((x) => x.tourId === activeTourId);
  if (activeItem && min > toMin(activeItem.end) + 5) {
    const late = min - toMin(activeItem.end);
    const nxt = items.find((x) => x.i > activeItem.i && x.kind === 'tour');
    return {
      items,
      curIdx: activeItem.i,
      tone: late > 30 ? 'bad' : 'warn',
      text: `Vas ${late} min atrasado${nxt ? ` · ${nxt.tour.name.split(':')[0]} era a las ${nxt.start}` : ''}`,
    };
  }
  if (cur) {
    const name = cur.kind === 'tour' ? cur.tour.name.split(':')[0] : cur.label;
    const pending = cur.kind === 'tour' && !cur.done && activeTourId !== cur.tourId;
    return { items, curIdx: cur.i, tone: pending ? 'warn' : 'ok', text: pending ? `Ahora toca: ${name}` : `Vas a tiempo · ${name} hasta las ${cur.end}` };
  }
  if (next) return { items, curIdx: next.i, tone: 'info', text: `Lo siguiente: a las ${next.start}` };
  return { items, tone: 'ok', text: 'Día terminado' };
}

// ¿Algún lugar del recorrido estará cerrado o cerrando a la hora planificada?
export function planWarning(itin, item) {
  if (item.kind !== 'tour') return null;
  const st = tourStatus(tourById(item.tourId), planDate(itin, item.start));
  return st && st.issues.length ? { blocking: st.blocking, message: st.message } : null;
}

// Siguiente recorrido del plan después de uno dado
export function nextTourInDay(tourId, dayId, now = new Date()) {
  const itin = (dayId && itineraryById(dayId)) || ITINERARIES.find((x) => x.date === japanTime(now).key);
  if (!itin) return null;
  const i = itin.items.findIndex((x) => x.tourId === tourId);
  if (i < 0) return null;
  const nxt = itin.items.slice(i + 1).find((x) => x.kind === 'tour');
  return nxt ? { itin, item: nxt, tour: tourById(nxt.tourId) } : null;
}
