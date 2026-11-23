// Voz de la guía: elige la mejor voz en español y controla qué se está diciendo.
import * as Speech from 'expo-speech';
import { createAudioPlayer } from 'expo-audio';
import { audioFor } from './narration';
import { storyParts } from './narrationTexts';

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

// Partes de una narración: audio grabado con voz natural cuando existe; si no, frases para la voz del teléfono
function buildItems(text) {
  const parts = (Array.isArray(text) ? text : [text]).map((t) => (t || '').trim()).filter(Boolean);
  const items = [];
  for (const part of parts) {
    const a = audioFor(part);
    if (a) items.push({ audio: a.uri, local: a.local, text: part, pos: 0 });
    else for (const c of splitSentences(part)) items.push({ text: c });
  }
  return items;
}

// ── Audio grabado ──
let np = null; // reproductor de la narración
let npSub = null;
let npTimer = null;

function releaseAudio() {
  clearTimeout(npTimer);
  npTimer = null;
  if (npSub) {
    try {
      npSub.remove();
    } catch (e) {}
    npSub = null;
  }
  if (np) {
    try {
      np.pause();
      np.remove();
    } catch (e) {}
    np = null;
  }
}

// Guarda en qué segundo iba el audio de una narración antes de pausarla
function captureAudio(state) {
  const item = state && state.items[state.i];
  if (item && item.audio && np) {
    try {
      item.pos = Math.max(0, (np.currentTime || 0) - 0.4);
    } catch (e) {}
  }
}

function fallbackToTts(state) {
  const item = state.items[state.i];
  releaseAudio();
  state.items.splice(state.i, 1, ...splitSentences(item.text).map((text) => ({ text })));
  speakFrom(state);
}

function playAudio(state, item) {
  releaseAudio();
  const token = state.token;
  let loaded = false;
  try {
    np = createAudioPlayer({ uri: item.audio }, { updateInterval: 300 });
  } catch (e) {
    return fallbackToTts(state);
  }
  npSub = np.addListener('playbackStatusUpdate', (st) => {
    if (!current || current.token !== token) return;
    if (!loaded && (st.isLoaded || st.duration > 0)) loaded = true;
    if (st.didJustFinish) {
      releaseAudio();
      state.i += 1;
      speakFrom(state);
    }
  });
  const go = async () => {
    try {
      if (item.pos) await np.seekTo(item.pos);
      if (current && current.token === token && np) np.play();
    } catch (e) {}
  };
  go();
  // Sin conexión o archivo dañado: sigue con la voz del teléfono
  npTimer = setTimeout(() => {
    if (!loaded && current && current.token === token) fallbackToTts(state);
  }, item.local ? 5000 : 12000);
}

function speakFrom(state) {
  if (!current || current.token !== state.token) return;
  if (state.i >= state.items.length) {
    current = null;
    notify();
    if (state.onDone) state.onDone();
    return;
  }
  const item = state.items[state.i];
  if (item.audio) return playAudio(state, item);
  Speech.speak(item.text, {
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

function silence() {
  Speech.stop();
  releaseAudio();
}

// Dice un texto (o una lista de partes). key identifica qué se está narrando (p. ej. el id de un lugar).
// onDone solo se llama si terminó de hablar sin ser interrumpido.
export function say(text, { key = 'guide', onDone } = {}) {
  suspended = null;
  silence();
  const state = { token: `${key}:${Date.now()}:${Math.random()}`, key, items: buildItems(text), i: 0, onDone };
  current = state;
  notify();
  speakFrom(state);
}

const resume = (back) => {
  const resumed = { ...back, token: `${back.key}:${Date.now()}` };
  current = resumed;
  notify();
  speakFrom(resumed);
};

// Dice un comentario breve interrumpiendo la narración, y luego la retoma donde iba
export function sayAside(text) {
  const prev = current && current.key !== 'aside' ? current : suspended;
  if (current && current.key !== 'aside') captureAudio(current);
  silence();
  const state = {
    token: `aside:${Date.now()}`,
    key: 'aside',
    items: splitSentences(text).map((t) => ({ text: t })),
    i: 0,
    onDone: () => {
      const back = suspended;
      suspended = null;
      if (back) resume(back);
    },
  };
  suspended = prev;
  current = state;
  notify();
  speakFrom(state);
}

// Pausa la narración para una pregunta (se retoma donde iba con releaseNarration o con la respuesta en sayAside)
export function holdNarration() {
  if (current && current.key !== 'aside') {
    captureAudio(current);
    suspended = current;
  }
  current = null;
  notify();
  silence();
}

export function releaseNarration() {
  const back = suspended;
  suspended = null;
  if (!back || current) return;
  resume(back);
}

export function stopSpeaking() {
  current = null;
  suspended = null;
  notify();
  silence();
}

export const isSpeaking = () => !!current;
export const speakingKey = () => (current ? current.key : null);

// La narración de un lugar en partes (cada parte puede tener su audio grabado)
export const placeNarration = (p, arrived) => storyParts(p, arrived);
