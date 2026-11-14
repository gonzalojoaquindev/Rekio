// Voz de la guía: elige la mejor voz en español y controla qué se está diciendo.
import * as Speech from 'expo-speech';

export const RATE = 0.9;

let voice = null;
let voices = [];
let current = null; // { token, key }
const listeners = new Set();

const notify = () => listeners.forEach((fn) => fn(current ? current.key : null));
export const onSpeakingChange = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

const score = (v) => {
  let s = 0;
  if (v.quality === 'Enhanced') s += 4;
  if (/network/i.test(v.identifier || '')) s += 3;
  if (/es[-_](us|mx|419|cl)/i.test(v.language)) s += 2;
  return s;
};

export async function loadVoices(preferredId) {
  try {
    const all = await Speech.getAvailableVoicesAsync();
    voices = all
      .filter((v) => v.language && v.language.toLowerCase().startsWith('es'))
      .sort((a, b) => score(b) - score(a));
    voice = voices.find((v) => v.identifier === preferredId) || voices[0] || null;
  } catch (_) {}
  return { voices, voice };
}

export const getVoice = () => voice;
export const getVoices = () => voices;
export function setVoice(v) {
  voice = v;
}

export const voiceLabel = (v) => {
  if (!v) return 'Predeterminada';
  const kind = /network/i.test(v.identifier || '')
    ? 'natural (usa internet)'
    : v.quality === 'Enhanced'
    ? 'alta calidad'
    : 'estándar';
  return `${v.language} · ${kind}`;
};

// Dice un texto. key identifica qué se está narrando (p. ej. el id de un lugar).
// onDone solo se llama si terminó de hablar sin ser interrumpido.
export function say(text, { key = 'guide', onDone } = {}) {
  Speech.stop();
  const token = `${key}:${Date.now()}:${Math.random()}`;
  current = { token, key };
  notify();
  const finish = (completed) => {
    if (!current || current.token !== token) return;
    current = null;
    notify();
    if (completed && onDone) onDone();
  };
  Speech.speak(text, {
    language: voice ? voice.language : 'es-US',
    voice: voice ? voice.identifier : undefined,
    rate: RATE,
    pitch: 1.0,
    onDone: () => finish(true),
    onStopped: () => finish(false),
    onError: () => finish(false),
  });
}

export function stopSpeaking() {
  current = null;
  notify();
  Speech.stop();
}

export const isSpeaking = () => !!current;
export const speakingKey = () => (current ? current.key : null);

export function placeNarration(p, arrived) {
  const intro = arrived ? `Has llegado a: ${p.name}. ` : `${p.name}. `;
  const tag = p.type === 'recreacion' ? 'Recreación histórica. ' : '';
  return intro + tag + p.story;
}
