// Rekio · servidor de preguntas (Vercel, función Node).
// POST /api/ask  { q, device, tour: {name, city}, chapter: {name, story, sources}, history: [{q, a}] }
// Responde { answer } usando Claude con el contexto del capítulo que el usuario está escuchando.
// Variables de entorno (en Vercel, nunca en el código):
//   ANTHROPIC_API_KEY  clave de la API de Claude (obligatoria)
//   REKIO_APP_KEY      opcional: si existe, la app debe enviarla en el encabezado x-rekio-key
//   REKIO_DAILY_LIMIT  opcional: preguntas por teléfono al día (por defecto 60)

const MODEL = 'claude-haiku-5-5';
const MAX_Q = 400; // caracteres de la pregunta
const MAX_CONTEXT = 12000; // caracteres del capítulo

// Límite simple por teléfono e IP. Vive en la memoria de cada instancia: suficiente para la etapa de pruebas.
const hits = new Map();
function allowed(id, limit) {
  const day = new Date().toISOString().slice(0, 10);
  const k = `${day}:${id}`;
  const n = (hits.get(k) || 0) + 1;
  hits.set(k, n);
  if (hits.size > 5000) for (const key of hits.keys()) if (!key.startsWith(day)) hits.delete(key);
  return n <= limit;
}

const clip = (s, n) => String(s || '').slice(0, n);

function systemPrompt(tour, chapter) {
  return `Eres la voz de Rekio, una audioguía que cuenta historias de lugares reales mientras la persona camina.
La persona está escuchando el recorrido «${clip(tour && tour.name, 120)}» (${clip(tour && tour.city, 60)}) y pausó la narración para hacerte una pregunta.

Capítulo que está escuchando: «${clip(chapter && chapter.name, 160)}»
Texto del capítulo:
"""
${clip(chapter && chapter.story, MAX_CONTEXT)}
"""
Fuentes del capítulo: ${clip(chapter && chapter.sources, 600) || 'no indicadas'}

Reglas:
- Responde en español latinoamericano, cálido y claro, como un buen guía. Tu respuesta se leerá en voz alta: de 2 a 4 frases, sin listas, sin markdown, sin emojis, sin enlaces.
- Usa solo hechos que estén en el capítulo o que sean conocimiento histórico bien establecido. Si no lo sabes o las fuentes no lo dicen, dilo con honestidad ("las fuentes no lo precisan") en vez de inventar.
- No inventes citas, diálogos, cifras ni direcciones exactas. Si algo del relato es una recreación (escenas, sonidos, ambiente), acláralo.
- Si te preguntan algo práctico del lugar (horarios, precios, cómo llegar), da lo que sepas con cautela y sugiere confirmarlo en el lugar.
- Si la pregunta no tiene que ver con el recorrido, respóndela brevemente si puedes y vuelve amablemente a la historia.
- No des tu opinión sobre política actual; sí puedes explicar los hechos históricos y las distintas miradas sobre ellos.`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type, x-rekio-key');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Usa POST' });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'Falta configurar ANTHROPIC_API_KEY en Vercel' });
  if (process.env.REKIO_APP_KEY && req.headers['x-rekio-key'] !== process.env.REKIO_APP_KEY) {
    return res.status(401).json({ error: 'Clave de la app inválida' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const q = clip(body.q, MAX_Q).trim();
  if (!q) return res.status(400).json({ error: 'Falta la pregunta' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'ip?';
  const limit = Number(process.env.REKIO_DAILY_LIMIT || 60);
  if (!allowed(`d:${clip(body.device, 64) || ip}`, limit) || !allowed(`ip:${ip}`, limit * 3)) {
    return res.status(429).json({ error: 'Llegaste al límite de preguntas de hoy. Vuelve a intentarlo mañana.' });
  }

  // Conversación breve: hasta 3 preguntas anteriores del mismo capítulo
  const messages = [];
  for (const h of (Array.isArray(body.history) ? body.history : []).slice(-3)) {
    if (!h || !h.q || !h.a) continue;
    messages.push({ role: 'user', content: clip(h.q, MAX_Q) }, { role: 'assistant', content: clip(h.a, 1500) });
  }
  messages.push({ role: 'user', content: q });

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2000,
        system: systemPrompt(body.tour, body.chapter),
        messages,
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      console.error('Claude API', r.status, JSON.stringify(data).slice(0, 500));
      return res.status(502).json({ error: 'El servicio de respuestas no está disponible ahora.' });
    }
    const answer = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join(' ')
      .trim();
    if (!answer) return res.status(502).json({ error: 'No llegó una respuesta. Intenta de nuevo.' });
    return res.status(200).json({ answer, usage: data.usage });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ error: 'No se pudo conectar con el servicio de respuestas.' });
  }
}
