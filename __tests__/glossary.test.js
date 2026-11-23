import { linkTerms } from '../src/glossary';
import { GLOSSARY } from '../src/data/glossary';

jest.mock('expo-audio', () => ({ createAudioPlayer: jest.fn(), setAudioModeAsync: jest.fn(async () => {}) }));
jest.mock('expo-file-system', () => ({ File: function () { return { exists: false }; }, Directory: function () { return { exists: true, create() {} }; }, Paths: {} }));
// Voz simulada: guarda lo que se dice y deja terminar cada frase a mano
const calls = [];
jest.mock('expo-speech', () => ({
  speak: jest.fn((text, opts) => calls.push({ text, opts })),
  stop: jest.fn(() => {
    const last = calls[calls.length - 1];
    if (last && !last.ended) { last.ended = true; last.opts.onStopped && last.opts.onStopped(); }
  }),
  getAvailableVoicesAsync: jest.fn(async () => []),
}));
const { say, sayAside, isSpeaking } = require('../src/speech');
const finishLast = () => { const c = calls[calls.length - 1]; c.ended = true; c.opts.onDone(); };

test('detecta términos con tildes, plurales y solo la primera vez', () => {
  const parts = linkTerms('Los samuráis y el shogun; otro samurái. Las geishas del período Edo en Edo.');
  const ids = parts.filter((p) => p.id).map((p) => p.id);
  expect(ids).toEqual(['samurai', 'shogun', 'geiko', 'periodo-edo', 'edo']);
  expect(parts.map((p) => p.text).join('')).toBe('Los samuráis y el shogun; otro samurái. Las geishas del período Edo en Edo.');
  expect(linkTerms('Kamikaze no es kami').filter((p) => p.id).map((p) => p.text)).toEqual(['kami']);
});

test('todos los términos relacionados existen', () => {
  const ids = new Set(GLOSSARY.map((g) => g.id));
  for (const g of GLOSSARY) for (const r of g.related || []) expect(ids.has(r)).toBe(true);
});

test('la definición interrumpe la historia y luego sigue en la misma frase', () => {
  let done = false;
  say('Primera frase. Segunda frase. Tercera frase.', { key: 'historia', onDone: () => (done = true) });
  expect(calls[calls.length - 1].text).toBe('Primera frase.');
  finishLast();
  expect(calls[calls.length - 1].text).toBe('Segunda frase.');
  sayAside('Daimyō. Un gran señor feudal.');
  expect(calls[calls.length - 1].text).toBe('Daimyō.');
  finishLast();
  finishLast(); // termina la definición
  expect(calls[calls.length - 1].text).toBe('Segunda frase.'); // retoma
  finishLast();
  finishLast();
  expect(done).toBe(true);
  expect(isSpeaking()).toBe(false);
});
