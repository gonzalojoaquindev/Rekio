// Los textos exactos que dice la guía en un recorrido, en partes. La app los reproduce y el
// generador de audios graba cada parte: si cambian aquí, se regraban solos.
export const STAMP_LINE = '¡Ganaste una nueva estampilla para tu pasaporte!';

export function storyParts(p, arrived) {
  const tag = p.type === 'recreacion' ? 'Recreación histórica. ' : '';
  return [arrived ? `Has llegado a: ${p.name}.` : `${p.name}.`, tag + p.story];
}

// Todas las partes que se graban para un recorrido (en su orden original)
export function tourTexts(tour, placeById) {
  const out = [tour.intro, tour.outro, STAMP_LINE];
  for (const st of tour.stops) {
    const p = placeById(st.id);
    if (st.guide) out.push(st.guide);
    if (p) out.push(...storyParts(p, true));
  }
  return out.filter(Boolean).map((t) => t.trim());
}

// Frase de muestra de cada voz del narrador (se graba junto con los recorridos)
export const previewText = (label) => `Hola, soy ${label}. Te voy a acompañar con historias en tus recorridos por el mundo.`;

// Frases de navegación giro a giro (sin nombres de calles, para poder grabarlas con voz natural)
export const NAV_DIRS = ['el norte', 'el noreste', 'el este', 'el sureste', 'el sur', 'el suroeste', 'el oeste', 'el noroeste'];
export const NAV_TURNS = [
  'Dobla a la izquierda.',
  'Dobla a la derecha.',
  'Gira levemente a la izquierda.',
  'Gira levemente a la derecha.',
  'Gira bien a la izquierda.',
  'Gira bien a la derecha.',
  'Sigue derecho.',
  'Da la vuelta.',
  'En la bifurcación, mantente a la izquierda.',
  'En la bifurcación, mantente a la derecha.',
];
export const navDistance = (m) => `En ${m} metros,`;
export const navDepart = (dir) => `Camina hacia ${dir}.`;
export const navRoundabout = (exit) => `En la rotonda, toma la salida ${exit}.`;
export const NAV_RECALC = 'Recalculando la ruta.';
export function navPhrases() {
  return [
    ...NAV_TURNS,
    ...[20, 30, 40, 50, 60, 70].map(navDistance),
    ...NAV_DIRS.map(navDepart),
    ...[1, 2, 3, 4, 5, 6].map(navRoundabout),
    NAV_RECALC,
  ];
}

// Frases de un texto (mismo corte que usan la voz y la mezcla)
export const sentencesOf = (text) =>
  (String(text).match(/[^.!?…]+[.!?…]+[»"”)]*\s*|[^.!?…]+$/g) || [text]).map((x) => x.trim()).filter(Boolean);
