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
