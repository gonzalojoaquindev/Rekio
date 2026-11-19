// Preguntas durante el recorrido: envía la pregunta y el capítulo actual al servidor de Rekio.
import Constants from 'expo-constants';

const extra = (Constants.expoConfig && Constants.expoConfig.extra) || {};

// Dirección del servidor: la del modo calibración (para pruebas) o la que viene en el build
export const serverUrlFor = (settings) => ((settings && settings.serverUrl) || extra.serverUrl || '').replace(/\/+$/, '');

export async function askQuestion({ settings, q, tour, chapter, history }) {
  const base = serverUrlFor(settings);
  if (!base) throw new Error('Las preguntas todavía no están configuradas en esta versión.');
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 25000);
  try {
    const r = await fetch(`${base}/api/ask`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(extra.appKey ? { 'x-rekio-key': extra.appKey } : {}) },
      body: JSON.stringify({
        q,
        device: settings && settings.deviceId,
        tour: tour && { name: tour.name, city: tour.city },
        chapter: chapter && { name: chapter.name, story: chapter.story, sources: chapter.sources || '' },
        history: (history || []).slice(-3),
      }),
      signal: ctrl.signal,
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || `El servidor respondió ${r.status}.`);
    return data.answer;
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('La respuesta tardó demasiado. Revisa tu conexión.');
    if (/Network request failed/i.test(e.message)) throw new Error('Sin conexión a internet.');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
