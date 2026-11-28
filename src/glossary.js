// Detecta palabras del vocabulario en un texto (sin importar tildes, mayúsculas ni plurales).
import { GLOSSARY } from './data/glossary';
import { CITIES } from './data/tours';

const normChar = (c) => {
  const n = c.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  return n.length === 1 ? n : c.toLowerCase().charAt(0);
};
// Normaliza conservando la misma longitud, para poder volver a las posiciones del texto original
const normKeep = (s) => Array.from(s).map(normChar).join('');
const isWordChar = (c) => !!c && /[a-z0-9ñ]/.test(c);

// Lista de (alias normalizado → id), las formas largas primero para que "período Edo" gane a "Edo"
const ENTRIES = GLOSSARY.flatMap((g) => [g.term, ...(g.aliases || [])].map((a) => ({ a: normKeep(a), id: g.id, region: g.region })))
  .filter((x, i, arr) => x.a.length > 1 && arr.findIndex((y) => y.a === x.a && y.region === x.region) === i)
  .sort((x, y) => y.a.length - x.a.length);

// Divide un texto en trozos: { text } normales y { text, id } enlazados (solo la primera aparición de cada término)
export function linkTerms(text, { seen = new Set(), max = 12, region } = {}) {
  if (!text) return [];
  const chars = Array.from(text);
  const n = chars.map(normChar).join('');
  const out = [];
  let i = 0;
  let last = 0;
  let count = 0;
  while (i < n.length) {
    let hit = null;
    if (!isWordChar(n[i - 1]) && count < max) {
      for (const e of ENTRIES) {
        if (seen.has(e.id) || (region && e.region !== region) || !n.startsWith(e.a, i)) continue;
        let end = i + e.a.length;
        // plurales: samurai → samurais, geisha → geishas, corsario → corsarios
        if (n[end] === 's') end += 1;
        else if (n.startsWith('es', end) && !isWordChar(n[end + 2])) end += 2;
        if (isWordChar(n[end])) {
          if (isWordChar(n[i + e.a.length])) continue;
          end = i + e.a.length;
        }
        hit = { id: e.id, end };
        break;
      }
    }
    if (hit) {
      if (i > last) out.push({ text: chars.slice(last, i).join('') });
      out.push({ text: chars.slice(i, hit.end).join(''), id: hit.id });
      seen.add(hit.id);
      count += 1;
      i = last = hit.end;
    } else i += 1;
  }
  if (last < chars.length) out.push({ text: chars.slice(last).join('') });
  return out;
}

// Términos que aparecen en un texto, en orden de aparición
export const termsIn = (text, max = 8, region) => linkTerms(text, { max, region }).filter((x) => x.id).map((x) => x.id);
// País de una ciudad (para elegir el vocabulario que corresponde)
export const regionOf = (city) => ((CITIES.find((c) => c.id === city) || {}).cc || undefined);
