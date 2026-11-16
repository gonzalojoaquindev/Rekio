import { PLACES } from './data/places';
import { CITIES } from './data/tours';

const toRad = (x) => (x * Math.PI) / 180;
const toDeg = (x) => (x * 180) / Math.PI;

export function distanceM(a, b) {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function bearingDeg(a, b) {
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const dLng = toRad(b.lng - a.lng);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

const DIRS = ['norte', 'noreste', 'este', 'sureste', 'sur', 'suroeste', 'oeste', 'noroeste'];
export const dirName = (deg) => DIRS[Math.round(deg / 45) % 8];

export const fmtDist = (m) =>
  m < 1000 ? `${Math.round(m / 5) * 5} m` : `${(m / 1000).toFixed(1).replace('.', ',')} km`;

export const placeById = (id) => PLACES.find((p) => p.id === id);
export const cityById = (id) => CITIES.find((c) => c.id === id);

// Distancia aproximada a pie del recorrido (línea recta × 1,3) y duración estimada
const statsCache = new WeakMap();
export function tourStats(tour) {
  if (statsCache.has(tour)) return statsCache.get(tour);
  const res = computeTourStats(tour);
  statsCache.set(tour, res);
  return res;
}
function computeTourStats(tour) {
  const pts = tour.stops.map((s) => placeById(s.id));
  let m = 0;
  for (let i = 1; i < pts.length; i++) m += distanceM(pts[i - 1], pts[i]);
  m *= 1.3;
  const minutes = Math.round((m / 1000 / 4) * 60 + tour.stops.length * 8);
  const must = tour.stops.filter((s) => !s.optional).length;
  return {
    meters: m,
    km: m / 1000,
    minutes,
    stops: tour.stops.length,
    must,
    optional: tour.stops.length - must,
    durationLabel:
      minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} h ${minutes % 60 ? `${minutes % 60} min` : ''}`.trim(),
  };
}

// Distancia de un punto a un segmento (para saber si te saliste de la ruta)
export function distToSegmentM(p, a, b) {
  const k = 111320;
  const cos = Math.cos(toRad(p.lat));
  const ax = a.lng * k * cos, ay = a.lat * k;
  const bx = b.lng * k * cos, by = b.lat * k;
  const px = p.lng * k * cos, py = p.lat * k;
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  let t = len2 ? ((px - ax) * dx + (py - ay) * dy) / len2 : 0;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx, cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

export function distToPolylineM(p, line) {
  if (!line || line.length < 2) return Infinity;
  let best = Infinity;
  for (let i = 1; i < line.length; i++) {
    const d = distToSegmentM(p, { lat: line[i - 1][0], lng: line[i - 1][1] }, { lat: line[i][0], lng: line[i][1] });
    if (d < best) best = d;
  }
  return best;
}

// Nombre de las paradas: en las historias continuas se llaman capítulos
export const unitOf = (tour) => (tour && tour.unit === 'capitulo' ? { one: 'Capítulo', many: 'capítulos' } : { one: 'Parada', many: 'paradas' });
