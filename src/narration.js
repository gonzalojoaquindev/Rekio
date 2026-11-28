// Narraciones grabadas con voz natural (Google Chirp 3 HD): qué voz usar, dónde está cada audio
// (descargado en el teléfono o en internet) y descarga de recorridos para escuchar sin conexión.
import { File, Directory, Paths } from 'expo-file-system';
import MANIFEST from './data/audio-manifest.json';
import { textKey } from './textkey';
import { navPhrases } from './narrationTexts';

export const NARRATORS = [
  { id: 'Algenib', label: 'Algenib', desc: 'Voz grave, la de las historias inmersivas' },
  { id: 'Fenrir', label: 'Fenrir', desc: 'Voz masculina' },
  { id: 'Iapetus', label: 'Iapetus', desc: 'Voz masculina' },
  { id: 'Leda', label: 'Leda', desc: 'Voz femenina' },
  { id: 'Kore', label: 'Kore', desc: 'Voz femenina' },
  { id: 'device', label: 'Voz del teléfono', desc: 'Funciona sin internet en todos los recorridos' },
];
export const DEFAULT_NARRATOR = 'Algenib';

let narrator = DEFAULT_NARRATOR;
let effects = true; // música y efectos en las historias inmersivas (si no, solo voz)
export const setNarrator = (id) => (narrator = id || DEFAULT_NARRATOR);
export const setEffects = (on) => (effects = on !== false);
export const getNarrator = () => narrator;

let dir = null;
const audioDir = () => {
  if (!dir) {
    try {
      // «narraciones2»: la carpeta anterior podía tener archivos a medio bajar (build-43); se borra
      dir = new Directory(Paths.document, 'narraciones2');
      if (!dir.exists) dir.create({ intermediates: true });
      try {
        const old = new Directory(Paths.document, 'narraciones');
        if (old.exists) old.delete();
      } catch (e) {}
    } catch (e) {
      dir = null;
    }
  }
  return dir;
};

const fileFor = (name) => {
  const d = audioDir();
  return d ? new File(d, name) : null;
};

// Voces en orden de preferencia: la elegida y luego las demás grabadas (las historias inmersivas solo tienen la épica)
// Las variantes «-voz» son las historias sin música: van primero si se desactivan los efectos, y al final si no
const voiceOrder = (voice) => {
  const all = Object.keys(MANIFEST.voices || {});
  const plain = all.filter((v) => v.endsWith('-voz'));
  const rest = [voice, ...all.filter((v) => v !== voice && !v.endsWith('-voz'))];
  return effects ? [...rest, ...plain] : [...plain, ...rest];
};

// ¿Este recorrido suena con su banda sonora mezclada? (entonces no hace falta la música de fondo)
export const hasScoredAudio = (tourId) =>
  effects && narrator !== 'device' && !!(MANIFEST.tours && MANIFEST.tours[tourId] && Object.keys(MANIFEST.tours[tourId]).some((v) => v.endsWith('-voz')));

// Audio para un texto: el archivo descargado si existe, si no la dirección en internet; null si no hay grabación
export function audioFor(text, voice = narrator) {
  if (!text || voice === 'device') return null;
  const k = textKey(text);
  const v = voiceOrder(voice).find((x) => MANIFEST.voices[x] && MANIFEST.voices[x][k]);
  const name = v && MANIFEST.voices[v][k];
  if (!name) return null;
  try {
    const f = fileFor(name);
    if (f && f.exists) return { uri: f.uri, local: true };
  } catch (e) {}
  return { uri: `${MANIFEST.base}/${name}`, local: false };
}

// ¿Este recorrido tiene voz natural? ¿Está descargado?
export function tourAudio(tourId, voice = narrator) {
  const all = (MANIFEST.tours && MANIFEST.tours[tourId]) || {};
  const v = voice === 'device' ? null : voiceOrder(voice).find((x) => all[x]);
  const t0 = v && all[v];
  if (!t0) return null;
  // También las indicaciones de navegación en la voz elegida, para que funcionen sin internet
  const nav = MANIFEST.voices[voice] ? navPhrases().map((p) => MANIFEST.voices[voice][textKey(p)]).filter(Boolean) : [];
  const t = { files: [...new Set([...t0.files, ...nav])], bytes: t0.bytes + nav.length * 15000 };
  let have = 0;
  for (const name of t.files) {
    try {
      const f = fileFor(name);
      if (f && f.exists) have++;
    } catch (e) {}
  }
  return { voice: v, files: t.files, bytes: t.bytes, have, complete: have === t.files.length };
}

export const hasNaturalVoice = (tourId) => !!(MANIFEST.tours && MANIFEST.tours[tourId]);

export async function downloadTour(tourId, voice = narrator, onProgress) {
  const t = tourAudio(tourId, voice);
  if (!t) throw new Error('Este recorrido aún no tiene voz natural.');
  const d = audioDir();
  if (!d) throw new Error('No se pudo usar el almacenamiento del teléfono.');
  // Se baja primero a una carpeta aparte y solo al terminar se mueve a su lugar: así nunca se
  // reproduce un archivo a medio bajar (sonaría la voz del teléfono en su lugar)
  const tmp = new Directory(Paths.cache, 'narraciones-parcial');
  if (!tmp.exists) tmp.create({ intermediates: true });
  let done = t.have;
  for (const name of t.files) {
    const f = new File(d, name);
    if (f.exists) continue;
    const part = new File(tmp, name);
    if (part.exists) part.delete();
    await File.downloadFileAsync(`${MANIFEST.base}/${name}`, part);
    part.move(d);
    done++;
    if (onProgress) onProgress(done, t.files.length);
  }
  return tourAudio(tourId, voice);
}

// Descarga en segundo plano al empezar un recorrido, para que cada parada suene sin esperar a internet
let prefetching = null;
export function prefetchTour(tourId, voice = narrator) {
  const t = tourAudio(tourId, voice);
  if (!t || t.complete || prefetching === tourId) return;
  prefetching = tourId;
  downloadTour(tourId, voice)
    .catch(() => {})
    .finally(() => {
      if (prefetching === tourId) prefetching = null;
    });
}

export function deleteTourAudio(tourId, voice = narrator) {
  const t = tourAudio(tourId, voice);
  if (!t) return;
  for (const name of t.files) {
    try {
      const f = fileFor(name);
      if (f && f.exists) f.delete();
    } catch (e) {}
  }
}
