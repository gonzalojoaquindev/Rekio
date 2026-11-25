// Prueba de historia inmersiva: graba frase por frase (voz épica Algenib) la historia de un lugar,
// para mezclarla aparte con tools/score.py. Entrada: GOOGLE_TTS_KEY y scripts/prueba.txt (id del lugar).
// Salida: /tmp/prueba/<i>.wav + textos.json
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const KEY = process.env.GOOGLE_TTS_KEY;
if (!KEY) throw new Error('Falta GOOGLE_TTS_KEY');
const OUT = '/tmp/prueba', TMP = '/tmp/rekio-data';
mkdirSync(OUT, { recursive: true }); mkdirSync(TMP, { recursive: true });
const conv = (src, dst) =>
  writeFileSync(dst, readFileSync(src, 'utf8').replace(/from '\.\/([\w-]+)'/g, "from './$1.mjs'").replace(/require\([^)]*\)/g, 'null'));
for (const f of readdirSync('src/data')) if (f.endsWith('.js')) conv(join('src/data', f), join(TMP, f.replace(/\.js$/, '.mjs')));
const { PLACES } = await import(join(TMP, 'places.mjs'));
const id = readFileSync('scripts/prueba.txt', 'utf8').trim();
const p = PLACES.find((x) => x.id === id);
const texts = (p.story.match(/[^.!?…]+[.!?…]+[»"”)]*\s*|[^.!?…]+$/g) || []).map((x) => x.trim()).filter(Boolean);
for (let i = 0; i < texts.length; i++) {
  const r = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${KEY}`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ input: { text: texts[i] }, voice: { languageCode: 'es-US', name: 'es-US-Chirp3-HD-Algenib' }, audioConfig: { audioEncoding: 'LINEAR16', sampleRateHertz: 24000, speakingRate: 0.9 } }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(JSON.stringify(d).slice(0, 200));
  writeFileSync(join(OUT, `${i}.wav`), Buffer.from(d.audioContent, 'base64'));
}
writeFileSync(join(OUT, 'textos.json'), JSON.stringify({ id, texts }, null, 1));
console.log(id, texts.length, 'frases');
