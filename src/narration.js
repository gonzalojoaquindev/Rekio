// Narraciones grabadas con voz natural (Google Chirp 3 HD): qué voz usar, dónde está cada audio
// (descargado en el teléfono o en internet) y descarga de recorridos para escuchar sin conexión.
import { File, Directory, Paths } from 'expo-file-system';
import MANIFEST from './data/audio-manifest.json';
import { textKey } from './textkey';

export const NARRATORS = [
  { id: 'Fenrir', label: 'Fenrir', desc: 'Voz masculina' },
  { id: 'Iapetus', label: 'Iapetus', desc: 'Voz masculina' },
  { id: 'Leda', label: 'Leda', desc: 'Voz femenina' },
  { id: 'Kore', label: 'Kore', desc: 'Voz femenina' },
  { id: 'device', label: 'Voz del teléfono', desc: 'Funciona sin internet en todos los recorridos' },
];
export const DEFAULT_NARRATOR = 'Fenrir';

let narrator = DEFAULT_NARRATOR;
export const setNarrator = (id) => (narrator = id || DEFAULT_NARRATOR);
export const getNarrator = () => narrator;

let dir = null;
const audioDir = () => {
  if (!dir) {
    try {
      dir = new Directory(Paths.document, 'narraciones');
      if (!dir.exists) dir.create({ intermediates: true });
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

// Audio para un texto: el archivo descargado si existe, si no la dirección en internet; null si no hay grabación
export function audioFor(text, voice = narrator) {
  if (!text || voice === 'device') return null;
  const name = MANIFEST.voices && MANIFEST.voices[voice] && MANIFEST.voices[voice][textKey(text)];
  if (!name) return null;
  try {
    const f = fileFor(name);
    if (f && f.exists) return { uri: f.uri, local: true };
  } catch (e) {}
  return { uri: `${MANIFEST.base}/${name}`, local: false };
}

// ¿Este recorrido tiene voz natural? ¿Está descargado?
export function tourAudio(tourId, voice = narrator) {
  const t = MANIFEST.tours && MANIFEST.tours[tourId] && MANIFEST.tours[tourId][voice];
  if (!t || voice === 'device') return null;
  let have = 0;
  for (const name of t.files) {
    try {
      const f = fileFor(name);
      if (f && f.exists) have++;
    } catch (e) {}
  }
  return { files: t.files, bytes: t.bytes, have, complete: have === t.files.length };
}

export const hasNaturalVoice = (tourId) => !!(MANIFEST.tours && MANIFEST.tours[tourId]);

export async function downloadTour(tourId, voice = narrator, onProgress) {
  const t = tourAudio(tourId, voice);
  if (!t) throw new Error('Este recorrido aún no tiene voz natural.');
  const d = audioDir();
  if (!d) throw new Error('No se pudo usar el almacenamiento del teléfono.');
  let done = t.have;
  for (const name of t.files) {
    const f = new File(d, name);
    if (f.exists) continue;
    await File.downloadFileAsync(`${MANIFEST.base}/${name}`, f);
    done++;
    if (onProgress) onProgress(done, t.files.length);
  }
  return tourAudio(tourId, voice);
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
