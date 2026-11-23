// Genera muestras de voz con Google Cloud Text-to-Speech para elegir la voz de Rekio.
// Uso: GOOGLE_TTS_KEY=... node scripts/tts-sample.mjs  → /tmp/voz/*.mp3 y /tmp/voz/informe.txt
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';

const KEY = process.env.GOOGLE_TTS_KEY;
const OUT = '/tmp/voz';
mkdirSync(OUT, { recursive: true });
const log = (s) => (console.log(s), appendFileSync(`${OUT}/informe.txt`, s + '\n'));
if (!KEY) {
  log('Falta el secreto GOOGLE_TTS_KEY en GitHub.');
  process.exit(0);
}

const TEXT =
  'Estás en el corazón de Copiapó, la Plaza Prat, que antes fue la Plaza de Armas. Pero quiero pedirte algo: por un momento, olvida los autos, los semáforos y los edificios. Estamos en 1858. ' +
  'Imagina calles de tierra, carretas cargadas, mulas que llegan del desierto, y el viento seco que baja del valle. ' +
  'Todo empezó en 1832, a unos sesenta kilómetros al sur de aquí. Un hombre humilde, Juan Godoy, encontró en el cerro de Chañarcillo una veta de plata.';

// Voces candidatas en español latino (es-US) y de España (es-ES) para comparar
const VOICES = [
  ['es-US', 'es-US-Chirp3-HD-Charon'],
  ['es-US', 'es-US-Chirp3-HD-Orus'],
  ['es-US', 'es-US-Chirp3-HD-Kore'],
  ['es-US', 'es-US-Chirp3-HD-Aoede'],
  ['es-US', 'es-US-Neural2-B'],
  ['es-US', 'es-US-Neural2-A'],
];

// Lista las voces disponibles en español para el informe
try {
  const r = await fetch(`https://texttospeech.googleapis.com/v1/voices?languageCode=es&key=${KEY}`);
  const d = await r.json();
  if (!r.ok) log(`Lista de voces: error ${r.status} ${JSON.stringify(d.error || d).slice(0, 300)}`);
  else log('Voces en español disponibles:\n' + (d.voices || []).filter((v) => /Chirp3|Neural2|Studio/.test(v.name)).map((v) => `  ${v.name} (${v.ssmlGender})`).join('\n'));
} catch (e) {
  log('Lista de voces: ' + e.message);
}

for (const [lang, name] of VOICES) {
  try {
    const r = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${KEY}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: { text: TEXT }, voice: { languageCode: lang, name }, audioConfig: { audioEncoding: 'MP3' } }),
    });
    const d = await r.json();
    if (!r.ok) {
      log(`${name}: error ${r.status} ${JSON.stringify(d.error || d).slice(0, 300)}`);
      continue;
    }
    writeFileSync(`${OUT}/${name}.mp3`, Buffer.from(d.audioContent, 'base64'));
    log(`${name}: ok`);
  } catch (e) {
    log(`${name}: ${e.message}`);
  }
}
log(`Caracteres por voz: ${TEXT.length}`);
