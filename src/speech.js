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

// Divide en frases: así se puede interrumpir la narración y retomarla en la misma frase
const splitSentences = (text) =>
  (text.match(/[^.!?…]+[.!?…]+[»"”)]*\s*|[^.!?…]+$/g) || [text]).map((x) => x.trim()).filter(Boolean);

let suspended = null; // narración pausada por un comentario (p. ej. la definición de una palabra)

function speakFrom(state) {
  if (!current || current.token !== state.token) return;
  if (state.i >= state.chunks.length) {
    current = null;
    notify();
    if (state.onDone) state.onDone();
    return;
  }
  Speech.speak(state.chunks[state.i], {
    language: voice ? voice.language : 'es-US',
    voice: voice ? voice.identifier : undefined,
    rate: RATE,
    pitch: 1.0,
    onDone: () => {
      if (!current || current.token !== state.token) return;
      state.i += 1;
      speakFrom(state);
    },
    onStopped: () => {
      if (!current || current.token !== state.token) return;
      current = null;
      notify();
    },
    onError: () => {
      if (!current || current.token !== state.token) return;
      state.i += 1; // si una frase falla, sigue con la siguiente
      speakFrom(state);
    },
  });
}

// Dice un texto. key identifica qué se está narrando (p. ej. el id de un lugar).
// onDone solo se llama si terminó de hablar sin ser interrumpido.
export function say(text, { key = 'guide', onDone } = {}) {
  suspended = null;
  Speech.stop();
  const state = { token: `${key}:${Date.now()}:${Math.random()}`, key, chunks: splitSentences(text), i: 0, onDone };
  current = state;
  notify();
  speakFrom(state);
}

// Dice un comentario breve interrumpiendo la narración, y luego la retoma desde la frase en que iba
export function sayAside(text) {
  const prev = current && current.key !== 'aside' ? current : suspended;
  Speech.stop();
  const state = {
    token: `aside:${Date.now()}`,
    key: 'aside',
    chunks: splitSentences(text),
    i: 0,
    onDone: () => {
      const back = suspended;
      suspended = null;
      if (!back) return;
      const resumed = { ...back, token: `${back.key}:${Date.now()}` };
      current = resumed;
      notify();
      speakFrom(resumed);
    },
  };
  suspended = prev;
  current = state;
  notify();
  speakFrom(state);
}

// Pausa la narración para una pregunta (se retoma desde la misma frase con releaseNarration o con la respuesta en sayAside)
export function holdNarration() {
  if (current && current.key !== 'aside') suspended = current;
  current = null;
  notify();
  Speech.stop();
}

export function releaseNarration() {
  const back = suspended;
  suspended = null;
  if (!back || current) return;
  const resumed = { ...back, token: `${back.key}:${Date.now()}` };
  current = resumed;
  notify();
  speakFrom(resumed);
}

export function stopSpeaking() {
  current = null;
  suspended = null;
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
