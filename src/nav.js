// Navegación a pie: pide la ruta a un servicio gratuito (OSRM de FOSSGIS sobre OpenStreetMap)
// y traduce cada maniobra a una indicación en español.

const UA = 'Rekio/1.0 (https://github.com/gonzalojoaquindev/Rekio)';
const BASE = 'https://routing.openstreetmap.de/routed-foot/route/v1/driving/';

const MOD = {
  left: { t: 'dobla a la izquierda', a: '←' },
  right: { t: 'dobla a la derecha', a: '→' },
  'slight left': { t: 'gira levemente a la izquierda', a: '↖' },
  'slight right': { t: 'gira levemente a la derecha', a: '↗' },
  'sharp left': { t: 'gira bien a la izquierda', a: '↙' },
  'sharp right': { t: 'gira bien a la derecha', a: '↘' },
  straight: { t: 'sigue derecho', a: '↑' },
  uturn: { t: 'da la vuelta', a: '↩' },
};

const DIRS = ['el norte', 'el noreste', 'el este', 'el sureste', 'el sur', 'el suroeste', 'el oeste', 'el noroeste'];
const latinName = (n) => (n && /^[A-Za-z0-9áéíóúüñÁÉÍÓÚÜÑ .,'’-]+$/.test(n) ? n : '');

function stepToInstruction(step) {
  const m = step.maneuver || {};
  const mod = MOD[m.modifier] || MOD.straight;
  const name = latinName(step.name);
  const onto = name ? ` hacia ${name}` : '';
  switch (m.type) {
    case 'depart':
      return { text: `Camina hacia ${DIRS[Math.round((m.bearing_after || 0) / 45) % 8]}${onto}`, arrow: '↑', skip: false };
    case 'arrive':
      return { text: 'Llegas a la parada', arrow: '◎', skip: true };
    case 'roundabout':
    case 'rotary':
      return { text: `En la rotonda, toma la salida ${m.exit || 1}${onto}`, arrow: '⟳', skip: false };
    case 'fork':
      return {
        text: `En la bifurcación, mantente a la ${/left/.test(m.modifier || '') ? 'izquierda' : 'derecha'}${onto}`,
        arrow: mod.a,
        skip: false,
      };
    case 'new name':
    case 'continue':
      if (!m.modifier || m.modifier === 'straight') return { text: `Sigue derecho${onto}`, arrow: '↑', skip: true };
      return { text: `${cap(mod.t)}${onto}`, arrow: mod.a, skip: false };
    default:
      // turn, end of road, merge, etc.
      if (m.modifier === 'straight') return { text: `Sigue derecho${onto}`, arrow: '↑', skip: true };
      return { text: `${cap(mod.t)}${onto}`, arrow: mod.a, skip: false };
  }
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Ruta a pie de `from` a `to` ({lat,lng}). Devuelve { line, steps, meters } o null.
export async function fetchWalkingRoute(from, to) {
  const url = `${BASE}${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson&steps=true`;
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) return null;
  const d = await r.json();
  const route = d.routes && d.routes[0];
  if (!route) return null;
  const steps = [];
  (route.legs || []).forEach((leg) =>
    (leg.steps || []).forEach((s) => {
      const ins = stepToInstruction(s);
      steps.push({
        lat: s.maneuver.location[1],
        lng: s.maneuver.location[0],
        type: s.maneuver.type,
        distance: s.distance, // metros del tramo que sigue a esta maniobra
        ...ins,
        saidFar: false,
        saidNear: false,
      });
    })
  );
  return {
    line: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    steps,
    meters: route.distance,
  };
}

// Ruta completa de un recorrido (para dibujarla en el mapa)
export async function fetchTourRoute(points) {
  const coords = points.map((p) => `${p.lng},${p.lat}`).join(';');
  const r = await fetch(`${BASE}${coords}?overview=full&geometries=geojson`, { headers: { 'User-Agent': UA } });
  if (!r.ok) return null;
  const d = await r.json();
  const line = d.routes && d.routes[0] && d.routes[0].geometry.coordinates;
  return line && line.length > 1 ? line.map(([lng, lat]) => [lat, lng]) : null;
}
