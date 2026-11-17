// Modo calibración (solo para pruebas): correcciones de ubicación y radio de los puntos,
// guardadas en el teléfono y aplicadas sobre los datos para probarlas al tiro.
import { PLACES } from './data/places';

const ORIG = {};
const remember = (p) => {
  if (!ORIG[p.id]) ORIG[p.id] = { lat: p.lat, lng: p.lng, radius: p.radius };
  return ORIG[p.id];
};

export function applyCalibration(calib = {}) {
  for (const p of PLACES) {
    const o = remember(p);
    const c = calib[p.id];
    p.lat = c && c.lat != null ? c.lat : o.lat;
    p.lng = c && c.lng != null ? c.lng : o.lng;
    p.radius = c && c.radius != null ? c.radius : o.radius;
  }
}

export const originalOf = (p) => remember(p);

const r5 = (x) => Math.round(x * 1e5) / 1e5;

// Texto para enviar las correcciones (se pegan en el chat para dejarlas fijas en el código)
export function calibrationText(calib = {}) {
  const ids = Object.keys(calib);
  if (!ids.length) return 'Rekio · calibración: sin correcciones.';
  const lines = ids.map((id) => {
    const p = PLACES.find((x) => x.id === id);
    const o = p ? remember(p) : {};
    const c = calib[id];
    const parts = [];
    if (c.lat != null) parts.push(`lat ${r5(c.lat)}, lng ${r5(c.lng)} (antes ${r5(o.lat)}, ${r5(o.lng)}${c.acc ? `; GPS ±${Math.round(c.acc)} m` : ''}${c.how ? `; ${c.how}` : ''})`);
    if (c.radius != null) parts.push(`radio ${c.radius} m (antes ${o.radius} m)`);
    if (c.note) parts.push(`nota: ${c.note}`);
    return `- ${id} · ${p ? p.name : '?'}: ${parts.join(' · ')}`;
  });
  return `Rekio · calibración (${ids.length} puntos)\n${lines.join('\n')}`;
}
