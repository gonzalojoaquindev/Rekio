// Graba las narraciones de los recorridos con Google Cloud Text-to-Speech (voces Chirp 3 HD).
// Entradas: GOOGLE_TTS_KEY, TOURS="copiapo-1859,laserena-1680", VOICES="Fenrir,Iapetus,Leda,Kore"
// Salida: /tmp/audio/*.mp3 (para la release audio-v1) y /tmp/audio/audio-manifest.json
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const KEY = process.env.GOOGLE_TTS_KEY;
const TOURS = (process.env.TOURS || '').split(',').map((s) => s.trim()).filter(Boolean);
const VOICES = (process.env.VOICES || 'Fenrir').split(',').map((s) => s.trim()).filter(Boolean);
const OUT = '/tmp/audio';
const TMP = '/tmp/rekio-data';
mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });
if (!KEY) throw new Error('Falta GOOGLE_TTS_KEY');

// Copia los datos de la app a .mjs para poder importarlos en Node (sin imágenes)
const conv = (src, dst) =>
  writeFileSync(dst, readFileSync(src, 'utf8').replace(/from '\.\/([\w-]+)'/g, "from './$1.mjs'").replace(/require\([^)]*\)/g, 'null'));
for (const f of readdirSync('src/data')) if (f.endsWith('.js')) conv(join('src/data', f), join(TMP, f.replace(/\.js$/, '.mjs')));
conv('src/textkey.js', join(TMP, 'textkey.mjs'));
conv('src/narrationTexts.js', join(TMP, 'narrationTexts.mjs'));
const { TOURS: ALL } = await import(join(TMP, 'tours.mjs'));
const { PLACES } = await import(join(TMP, 'places.mjs'));
const { textKey } = await import(join(TMP, 'textkey.mjs'));
const { tourTexts } = await import(join(TMP, 'narrationTexts.mjs'));
const placeById = (id) => PLACES.find((p) => p.id === id);

// Manifiesto anterior: se conserva lo ya grabado
const prevPath = 'src/data/audio-manifest.json';
const manifest = existsSync(prevPath) ? JSON.parse(readFileSync(prevPath, 'utf8')) : { voices: {}, tours: {} };
manifest.base = 'https://github.com/gonzalojoaquindev/Rekio/releases/download/audio-v1';
manifest.voices = manifest.voices || {};
manifest.tours = manifest.tours || {};

// Google acepta hasta 5000 bytes por pedido: se parte por frases y se unen los MP3
const sentences = (t) => t.match(/[^.!?…]+[.!?…]+[»"”)]*\s*|[^.!?…]+$/g) || [t];
function chunks(text, max = 3500) {
  const out = [];
  let cur = '';
  for (const s of sentences(text)) {
    if (Buffer.byteLength(cur + s) > max && cur) {
      out.push(cur.trim());
      cur = '';
    }
    cur += s;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

async function synth(text, voice) {
  const parts = [];
  for (const c of chunks(text)) {
    for (let attempt = 1; ; attempt++) {
      const r = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${KEY}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { text: c }, voice: { languageCode: 'es-US', name: `es-US-Chirp3-HD-${voice}` }, audioConfig: { audioEncoding: 'MP3' } }),
      });
      const d = await r.json();
      if (r.ok) {
        parts.push(Buffer.from(d.audioContent, 'base64'));
        break;
      }
      if (attempt >= 3) throw new Error(`${r.status} ${JSON.stringify(d.error || d).slice(0, 200)}`);
      await new Promise((res) => setTimeout(res, 3000 * attempt));
    }
  }
  return Buffer.concat(parts);
}

let chars = 0;
let made = 0;
for (const id of TOURS) {
  const tour = ALL.find((t) => t.id === id);
  if (!tour) {
    console.log(`Recorrido desconocido: ${id}`);
    continue;
  }
  const texts = tourTexts(tour, placeById);
  manifest.tours[id] = manifest.tours[id] || {};
  for (const voice of VOICES) {
    const files = [];
    let bytes = 0;
    manifest.voices[voice] = manifest.voices[voice] || {};
    for (const t of texts) {
      const k = textKey(t);
      const name = `${voice}-${k}.mp3`;
      const buf = await synth(t, voice);
      writeFileSync(join(OUT, name), buf);
      manifest.voices[voice][k] = name;
      files.push(name);
      bytes += buf.length;
      chars += t.length;
      made++;
    }
    manifest.tours[id][voice] = { files, bytes };
    console.log(`${id} · ${voice}: ${files.length} audios, ${(bytes / 1e6).toFixed(1)} MB`);
  }
}
writeFileSync(join(OUT, 'audio-manifest.json'), JSON.stringify(manifest, null, 1));
console.log(`Listo: ${made} audios, ${chars} caracteres`);
