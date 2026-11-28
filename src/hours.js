// Horarios: ¿está abierto hoy?, ¿cierra pronto?, ¿llegas a tiempo?
// Todo se calcula en la hora local de la ciudad del lugar (Japón UTC+9; Italia UTC+1/+2 con horario
// de verano europeo; Chile UTC-4/-3), aunque el teléfono esté en otra zona.
import { HOURS, JP_HOLIDAYS, IT_HOLIDAYS } from './data/hours';
import { placeById, distanceM } from './geo';
import { CITIES } from './data/tours';

export const DAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const pad = (n) => String(n).padStart(2, '0');
const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
export const fmtMin = (min) => `${Math.floor(min / 60)}:${pad(min % 60)}`;

// Zona horaria por país
const countryOf = (city) => ((CITIES.find((c) => c.id === city) || {}).cc || 'JP');
// Domingo número n (1 = primero, -1 = último) de un mes, en UTC (ms)
function nthSunday(y, m, n, hourUtc) {
  if (n > 0) {
    const first = new Date(Date.UTC(y, m - 1, 1, hourUtc));
    return first.getTime() + ((7 - first.getUTCDay()) % 7) * 86400000 + (n - 1) * 7 * 86400000;
  }
  const last = new Date(Date.UTC(y, m, 0, hourUtc));
  return last.getTime() - last.getUTCDay() * 86400000;
}
export function utcOffset(city, date = new Date()) {
  const cc = countryOf(city);
  const ms = date.getTime(), y = date.getUTCFullYear();
  if (cc === 'IT' || cc === 'ES' || cc === 'FR' || cc === 'VA') {
    // Horario de verano europeo: del último domingo de marzo al último de octubre (01:00 UTC)
    return ms >= nthSunday(y, 3, -1, 1) && ms < nthSunday(y, 10, -1, 1) ? 2 : 1;
  }
  if (cc === 'CL') {
    // Chile continental: verano (UTC-3) del primer domingo de septiembre al primer domingo de abril
    return ms >= nthSunday(y, 4, 1, 3) && ms < nthSunday(y, 9, 1, 4) ? -4 : -3;
  }
  return 9;
}
// Fecha y hora locales de una ciudad (por defecto, Japón)
export function cityTime(date = new Date(), city = 'kyoto') {
  const t = new Date(date.getTime() + utcOffset(city, date) * 3600 * 1000);
  const y = t.getUTCFullYear(), m = t.getUTCMonth() + 1, d = t.getUTCDate();
  return { y, m, d, wd: t.getUTCDay(), min: t.getUTCHours() * 60 + t.getUTCMinutes(), md: `${pad(m)}-${pad(d)}`, key: `${y}-${pad(m)}-${pad(d)}`, ms: date.getTime(), city };
}
export const japanTime = (date = new Date()) => cityTime(date, 'kyoto');
// Instante real de una fecha y hora locales ('AAAA-MM-DD', 'HH:MM') en una ciudad
export function cityDate(key, hhmm, city = 'kyoto') {
  const guess = new Date(`${key}T${hhmm.padStart(5, '0')}:00Z`);
  return new Date(guess.getTime() - utcOffset(city, guess) * 3600 * 1000);
}
const shiftDays = (jt, n) => cityTime(new Date(jt.ms + n * 86400000), jt.city);
const inRange = (md, from, to) => (from <= to ? md >= from && md <= to : md >= from || md <= to);
const isHoliday = (jt) => (countryOf(jt.city) === 'IT' || countryOf(jt.city) === 'VA' ? IT_HOLIDAYS : JP_HOLIDAYS).has(jt.key);
// Último domingo del mes (para los Museos Vaticanos, que abren gratis ese día)
const isLastSunday = (jt) => jt.wd === 0 && jt.d + 7 > new Date(Date.UTC(jt.y, jt.m, 0)).getUTCDate();

export const hoursFor = (placeId) => HOURS[placeId] || null;

// ¿Por qué está cerrado ese día? null si abre.
export function closedReason(spec, jt) {
  const period = (spec.closedPeriods || []).find(([a, b]) => jt.key >= a && jt.key <= b);
  if (period) return spec.closedPeriodsReason || 'renovación';
  if ((spec.closedRanges || []).some(([a, b]) => inRange(jt.md, a, b))) return 'fin de año';
  if ((spec.closedDates || []).includes(jt.md)) return spec.closedDatesReason || 'ceremonias del templo';
  if (spec.closedOnHolidays && isHoliday(jt)) return 'feriado';
  const weekly = spec.closedWeekdays || [];
  if (weekly.includes(jt.wd)) {
    const exempt =
      (spec.holidayOpens && isHoliday(jt) && !(spec.exceptHolidays || []).includes(jt.md)) || (spec.lastSunday && isLastSunday(jt));
    if (!exempt) return DAY_NAMES[jt.wd];
  }
  // El cierre de un lunes feriado pasa al martes
  const prev = shiftDays(jt, -1);
  if ((spec.shiftAfter || []).includes(prev.wd) && weekly.includes(prev.wd) && isHoliday(prev) && !weekly.includes(jt.wd))
    return `${DAY_NAMES[jt.wd]}, porque el ${DAY_NAMES[prev.wd]} fue feriado`;
  return null;
}

export function seasonFor(spec, jt) {
  if (spec.lastSunday && isLastSunday(jt)) {
    const l = spec.lastSunday;
    return { open: toMin(l.open), close: toMin(l.close), last: toMin(l.last || l.close) };
  }
  const s = spec.seasons.find((x) => inRange(jt.md, x.from, x.to));
  if (!s) return null;
  const open = toMin(s.open), close = toMin(s.close);
  return { open, close, last: s.last ? toMin(s.last) : close };
}

// Estado de un lugar en un momento (por defecto, ahora)
//   state: 'open' | 'soon' (cierra en ≤ 60 min) | 'before' | 'after' | 'closed'
export function placeStatus(placeId, date = new Date()) {
  const spec = hoursFor(placeId);
  if (!spec) return null;
  const jt = cityTime(date, (placeById(placeId) || {}).city);
  const why = closedReason(spec, jt);
  const sea = seasonFor(spec, jt);
  if (why || !sea) return { state: 'closed', why: why || 'cerrado', spec, jt };
  if (jt.min < sea.open) return { state: 'before', ...sea, spec, jt };
  if (jt.min >= sea.last) return { state: 'after', ...sea, spec, jt };
  return { state: sea.last - jt.min <= 60 ? 'soon' : 'open', ...sea, spec, jt };
}

// Texto corto para la ficha de un lugar
export function placeHoursText(placeId, date = new Date()) {
  const s = placeStatus(placeId, date);
  if (!s) return null;
  const lastTxt = s.last !== s.close ? ` · última entrada ${fmtMin(s.last)}` : '';
  if (s.state === 'closed')
    return { tone: 'bad', text: `Hoy cerrado (${s.why})${s.spec.soft ? s.spec.softClosed || ' · se puede ver desde fuera' : ''}` };
  const closeTxt = s.close >= 1439 ? 'tarde' : fmtMin(s.close);
  const hours = `Hoy ${fmtMin(s.open)}–${closeTxt}${lastTxt}`;
  if (s.state === 'before') return { tone: 'info', text: `${hours} · abre a las ${fmtMin(s.open)}` };
  if (s.state === 'after') return { tone: 'bad', text: `${hours} · ya cerró por hoy` };
  if (s.state === 'soon') return { tone: 'warn', text: `${hours} · cierra pronto` };
  return { tone: 'ok', text: `${hours} · abierto ahora` };
}

// Próximos días en que abre (para recomendar otro día)
export function nextOpenDays(spec, date = new Date(), count = 3, city) {
  const out = [];
  for (let i = 1; i <= 10 && out.length < count; i++) {
    const jt = shiftDays(cityTime(date, city), i);
    if (!closedReason(spec, jt)) out.push(i === 1 ? 'mañana' : `el ${DAY_NAMES[jt.wd]} ${jt.d}`);
  }
  return out;
}

// Llegada estimada a cada parada desde ahora (caminando a 4 km/h + ~12 min por parada anterior)
export function arrivalMinutes(tour, order, from) {
  const idx = order || tour.stops.map((_, i) => i);
  const out = {};
  let t = 0;
  let prev = from || placeById(tour.stops[idx[0]].id);
  idx.forEach((i, pos) => {
    const p = placeById(tour.stops[i].id);
    t += ((distanceM(prev, p) * 1.3) / 4000) * 60 + (pos > 0 ? 12 : 0);
    out[tour.stops[i].id] = Math.round(t);
    prev = p;
  });
  return out;
}

const listJoin = (a) => (a.length <= 1 ? a.join('') : `${a.slice(0, -1).join(', ')} o ${a[a.length - 1]}`);

// Estado de un recorrido: chip para las tarjetas y avisos para antes de comenzar
export function tourStatus(tour, date = new Date(), { order, from } = {}) {
  const stops = tour.stops.map((s) => ({ ...s, st: placeStatus(s.id, date), p: placeById(s.id) })).filter((s) => s.st);
  if (!stops.length) return null;
  const jt = cityTime(date, tour.city);
  const arr = arrivalMinutes(tour, order, from);
  // Un aviso por recinto; si tiene paradas imperdibles, cuenta como imperdible
  const byArea = new Map();
  for (const s of stops) {
    const late = s.st.state !== 'closed' && !s.st.spec.soft && jt.min + (arr[s.id] || 0) > s.st.last;
    if (!(s.st.state === 'closed' || s.st.state === 'after' || late)) continue;
    const prev = byArea.get(s.st.spec.area);
    const item = { ...s, late: late && s.st.state !== 'after', eta: jt.min + (arr[s.id] || 0) };
    if (!prev) byArea.set(s.st.spec.area, item);
    else if (prev.optional && !s.optional) byArea.set(s.st.spec.area, { ...item, eta: Math.min(prev.eta, item.eta) });
  }
  const issues = [...byArea.values()].sort((a, b) => Number(a.optional) - Number(b.optional));
  const mustIssues = issues.filter((x) => !x.optional && !x.st.spec.soft);
  const mustClosedToday = mustIssues.find((x) => x.st.state === 'closed');

  // Chip
  let chip;
  const main = stops.find((s) => !s.optional && !s.st.spec.soft) || stops[0];
  if (mustClosedToday) chip = { tone: 'bad', text: `Hoy cerrado (${mustClosedToday.st.why.split(',')[0]})` };
  else if (mustIssues.some((x) => x.st.state === 'after')) chip = { tone: 'bad', text: 'Ya cerró por hoy' };
  else if (main.st.spec.soft && main.st.state !== 'open' && main.st.state !== 'soon')
    chip = { tone: 'info', text: main.st.spec.softChip || 'Salón cerrado · exterior abierto' };
  else if (main.st.state === 'before') chip = { tone: 'info', text: `Abre a las ${fmtMin(main.st.open)}` };
  else if (mustIssues.length) chip = { tone: 'warn', text: `Cierra a las ${fmtMin(mustIssues[0].st.close)}` };
  else if (main.st.state === 'soon') chip = { tone: 'warn', text: `Cierra a las ${fmtMin(main.st.close)}` };
  else chip = { tone: 'ok', text: 'Abierto ahora' };

  // Mensaje de aviso
  const lines = [];
  for (const x of issues) {
    const area = x.st.spec.area;
    const cap = area.charAt(0).toUpperCase() + area.slice(1);
    const pl = !!x.st.spec.plural;
    const esta = pl ? 'están cerrados' : 'está cerrado';
    const recibe = pl ? 'reciben' : 'recibe';
    const cerro = pl ? 'cerraron' : 'cerró';
    if (x.st.state === 'closed') {
      const days = nextOpenDays(x.st.spec, date, 3, tour.city);
      lines.push(
        `${x.optional ? '• Parada opcional: hoy ' : '• Hoy '}${area} ${esta} (${x.st.why}).` +
          (x.st.spec.soft ? ' Igual puedes recorrer el exterior.' : x.optional ? ' Puedes saltarla.' : days.length ? ` Te recomiendo ir ${listJoin(days)}.` : '')
      );
    } else if (x.st.state === 'after') {
      const tail = x.st.spec.soft ? ' Igual puedes recorrer el exterior.' : x.optional ? ' Puedes saltarla.' : ` Vuelve mañana desde las ${fmtMin(x.st.open)}.`;
      lines.push(`${x.optional ? '• Parada opcional: ' : '• '}${cap} ya ${cerro} por hoy (cierra a las ${fmtMin(x.st.close)}).${tail}`);
    } else if (x.late) {
      lines.push(
        `${x.optional ? '• Parada opcional: ' : '• '}${cap} ${recibe} gente hasta las ${fmtMin(x.st.last)} y a pie llegarías cerca de las ${fmtMin(Math.min(x.eta, 1439))}.` +
          (x.optional ? ' Puedes saltarla.' : ' Conviene ir directo o empezar más temprano.')
      );
    }
  }
  const blocking = mustIssues.length > 0;
  return { chip, issues, blocking, message: lines.join('\n') };
}
