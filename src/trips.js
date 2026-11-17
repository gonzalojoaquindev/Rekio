// Planificador de viajes: lo guardado (lugares y recorridos) → días con horarios, transporte y avisos.
import { TOURS } from './data/tours';
import { PLACES } from './data/places';
import { tourStatus, japanTime, placeStatus, fmtMin } from './hours';
import { distanceM, tourStats } from './geo';

const tourById = (id) => TOURS.find((t) => t.id === id);
const placeById = (id) => PLACES.find((p) => p.id === id);
const pad = (n) => String(n).padStart(2, '0');
const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const fmt = (min) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
const SLOT_ORDER = { temprano: 0, manana: 1, tarde: 2, noche: 3 };
const SLOT_START = { temprano: 7 * 60, manana: 9 * 60, tarde: 13 * 60 + 30, noche: 17 * 60 + 30 };

// Fechas del viaje
export function tripDates(trip) {
  const out = [];
  const d = new Date(`${trip.start}T12:00:00Z`);
  const end = new Date(`${trip.end}T12:00:00Z`);
  while (d <= end && out.length < 60) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

export const addDays = (ymd, n) => {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

export const isSaved = (trip, kind, id) => (trip.saved || []).some((x) => x.kind === kind && x.id === id);

export function toggleSaved(trip, kind, id) {
  const saved = trip.saved || [];
  if (isSaved(trip, kind, id)) {
    // al quitarlo de guardados, también sale de los días
    const days = Object.fromEntries(Object.entries(trip.days || {}).map(([k, v]) => [k, v.filter((x) => !(x.kind === kind && x.id === id))]));
    return { saved: saved.filter((x) => !(x.kind === kind && x.id === id)), days };
  }
  return { saved: [...saved, { kind, id }] };
}

// Recorridos que contienen lugares guardados: "3 de tus lugares están en el recorrido X"
export function tourSuggestions(trip) {
  const placeIds = (trip.saved || []).filter((x) => x.kind === 'place').map((x) => x.id);
  return TOURS.map((t) => ({ tour: t, hits: t.stops.filter((s) => placeIds.includes(s.id)).map((s) => s.id) }))
    .filter((x) => x.hits.length >= 1 && !isSaved(trip, 'tour', x.tour.id))
    .sort((a, b) => b.hits.length - a.hits.length);
}

// Lugares guardados que ya quedan cubiertos por un recorrido guardado
export function coveredPlaces(trip) {
  const tours = (trip.saved || []).filter((x) => x.kind === 'tour').map((x) => tourById(x.id)).filter(Boolean);
  return new Set(tours.flatMap((t) => t.stops.map((s) => s.id)));
}

const itemCity = (it) => (it.kind === 'tour' ? (tourById(it.id) || {}).city : (placeById(it.id) || {}).city);
const itemStart = (it) => (it.kind === 'tour' ? placeById(tourById(it.id).stops[0].id) : placeById(it.id));
const itemEnd = (it) => (it.kind === 'tour' ? placeById(tourById(it.id).stops[tourById(it.id).stops.length - 1].id) : placeById(it.id));
const itemMinutes = (it) => (it.kind === 'tour' ? Math.max(45, tourStats(tourById(it.id)).minutes) : (placeById(it.id) || {}).mins || 45);
// Mejor horario de un lugar suelto: el que declara, o la noche para bares y vida nocturna
const placeSlot = (p) => (!p ? 'manana' : p.slot || (p.cat === 'noche' ? 'noche' : 'manana'));
const itemSlot = (it) => {
  if (it.kind !== 'tour') return placeSlot(placeById(it.id));
  const w = tourById(it.id).when;
  return w && w.slots && w.slots.length ? w.slots[0] : 'manana';
};

// Cómo moverse entre dos puntos (estimado)
export function transitBetween(a, b) {
  if (!a || !b) return null;
  const d = distanceM(a, b);
  if (d < 1200) return { text: `A pie, unos ${Math.max(3, Math.round((d * 1.3) / 75))} min.`, minutes: Math.max(3, Math.round((d * 1.3) / 75)) };
  const min = Math.round(15 + (d / 1000) * 2.5);
  return { text: `En tren, metro o bus, unos ${min} min (estimado; revisa la ruta exacta en Google Maps).`, minutes: min };
}

// Convierte un día del viaje en un itinerario como los de "Mi día" (con horarios estimados)
export function dayPlan(trip, date) {
  const list = (trip.days || {})[date] || [];
  if (!list.length) return null;
  const items = [];
  // empieza a la hora sugerida del primer elemento
  let cursor = SLOT_START[itemSlot(list[0])] || 9 * 60;
  let prevEnd = null;
  let lunch = false;
  list.forEach((it) => {
    const tr = prevEnd ? transitBetween(prevEnd, itemStart(it)) : null;
    if (tr) cursor += tr.minutes;
    // si es para la noche, no antes de las 17:30
    if (itemSlot(it) === 'noche') cursor = Math.max(cursor, SLOT_START.noche);
    const dur = itemMinutes(it);
    if (!lunch && cursor >= 12 * 60 + 15 && cursor < 15 * 60 && items.length) {
      items.push({ start: fmt(cursor), end: fmt(cursor + 60), kind: 'free', icon: '🍜', label: 'Almuerzo (sugerido)' });
      cursor += 60;
      lunch = true;
    }
    const base = { start: fmt(cursor), end: fmt(Math.min(cursor + dur, 23 * 60 + 59)), transit: tr };
    items.push(it.kind === 'tour' ? { ...base, kind: 'tour', tourId: it.id } : { ...base, kind: 'place', placeId: it.id, at: placeById(it.id), icon: '📍', label: placeById(it.id).name });
    cursor += dur;
    prevEnd = itemEnd(it);
  });
  const city = itemCity(list[0]);
  return { id: `trip:${trip.id}:${date}`, name: trip.name, city, date, items, tripId: trip.id };
}

// Avisos al planificar: lugares cerrados ese día u horario
export function dayWarnings(trip, date) {
  const plan = dayPlan(trip, date);
  if (!plan) return [];
  return plan.items
    .map((it) => {
      const at = new Date(`${date}T${it.start.padStart(5, '0')}:00+09:00`);
      if (it.kind === 'tour') {
        const st = tourStatus(tourById(it.tourId), at);
        return st && st.issues.length ? { tourId: it.tourId, blocking: st.blocking, message: st.message } : null;
      }
      if (it.kind !== 'place') return null;
      const s = placeStatus(it.placeId, at);
      if (!s || s.state === 'open' || s.state === 'soon') return null;
      const name = placeById(it.placeId).name;
      const soft = s.spec.soft;
      let message;
      if (s.state === 'closed') message = `${name}: cerrado ese día (${s.why}).${soft ? ' Igual se puede ver desde fuera.' : ''}`;
      else if (s.state === 'before') message = `${name}: abre a las ${fmtMin(s.open)} y llegarías a las ${it.start}.`;
      else message = `${name}: recibe gente hasta las ${fmtMin(s.last)} y llegarías a las ${it.start}.`;
      return { placeId: it.placeId, blocking: !soft && s.state !== 'before', message };
    })
    .filter(Boolean);
}

// Reparte automáticamente lo guardado en los días: agrupa por ciudad, respeta el mejor horario y evita días de cierre
export function autoPlan(trip) {
  const dates = tripDates(trip);
  const covered = coveredPlaces(trip);
  const pool = (trip.saved || []).filter((x) => x.kind === 'tour' || !covered.has(x.id));
  const byCity = {};
  pool.forEach((it) => (byCity[itemCity(it)] = [...(byCity[itemCity(it)] || []), it]));
  const cityOrder = (trip.cities || []).filter((c) => byCity[c]).concat(Object.keys(byCity).filter((c) => !(trip.cities || []).includes(c)));
  const days = {};
  let di = 0;
  for (const city of cityOrder) {
    let rest = [...byCity[city]].sort((a, b) => SLOT_ORDER[itemSlot(a)] - SLOT_ORDER[itemSlot(b)]);
    while (rest.length && di < dates.length) {
      const date = dates[di];
      const today = [];
      let load = 0;
      for (const it of [...rest]) {
        const w = it.kind === 'tour' ? 1 : 0.5;
        if (load + w > 3) continue;
        // ¿estaría cerrado ese día?
        const probe = new Date(`${date}T${pad(Math.floor(SLOT_START[itemSlot(it)] / 60))}:30:00+09:00`);
        if (it.kind === 'tour') {
          const st = tourStatus(tourById(it.id), probe);
          if (st && st.blocking && st.issues.some((x) => x.st.state === 'closed')) continue;
        } else {
          const s = placeStatus(it.id, probe);
          if (s && s.state === 'closed' && !s.spec.soft) continue;
        }
        today.push(it);
        load += w;
        rest = rest.filter((x) => x !== it);
      }
      if (!today.length) {
        // nada calza ese día: deja el primero igual para no trabarse
        today.push(rest.shift());
      }
      days[date] = today.sort((a, b) => SLOT_ORDER[itemSlot(a)] - SLOT_ORDER[itemSlot(b)]);
      di += 1;
    }
  }
  return days;
}

// Itinerario de hoy si algún viaje lo tiene planificado
export function tripPlanForToday(trips, now = new Date()) {
  const today = japanTime(now).key;
  for (const t of trips || []) {
    if ((t.days || {})[today] && t.days[today].length) return dayPlan(t, today);
  }
  return null;
}

// Texto para compartir por WhatsApp
export function tripShareText(trip) {
  const lines = [`🧳 ${trip.name} (${trip.start} → ${trip.end})`, ''];
  for (const date of tripDates(trip)) {
    const plan = dayPlan(trip, date);
    if (!plan) continue;
    lines.push(`📅 ${date}`);
    plan.items.forEach((it) => {
      const name = it.kind === 'tour' ? tourById(it.tourId).name : it.kind === 'place' ? placeById(it.placeId).name : it.label;
      lines.push(`  ${it.start} ${name}`);
    });
    lines.push('');
  }
  lines.push('Planificado con Rekio');
  return lines.join('\n');
}
