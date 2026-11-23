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
const { tourTexts, previewText, navPhrases } = await import(join(TMP, 'narrationTexts.mjs'));
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

// Historias inmersivas: Algenib, más lenta y con tratamiento épico (más grave, cuerpo y sala)
const EPIC = { voice: 'Algenib', rate: 0.9 };
const FX = 'asetrate=24000*0.944,aresample=24000,atempo=1.059,bass=g=4:f=110:w=0.7,aecho=0.8:0.5:55|95:0.12|0.07,loudnorm=I=-18:TP=-1.5';
import { execFileSync } from 'node:child_process';
function epicFx(buf) {
  writeFileSync('/tmp/fx-in.mp3', buf);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', '/tmp/fx-in.mp3', '-af', FX, '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '64k', '/tmp/fx-out.mp3']);
  return readFileSync('/tmp/fx-out.mp3');
}

async function synth(text, voice, rate) {
  const parts = [];
  for (const c of chunks(text)) {
    for (let attempt = 1; ; attempt++) {
      const r = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${KEY}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ input: { text: c }, voice: { languageCode: 'es-US', name: `es-US-Chirp3-HD-${voice}` }, audioConfig: { audioEncoding: 'MP3', ...(rate ? { speakingRate: rate } : {}) } }),
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
  const epic = tour.unit === 'capitulo';
  for (const voice of epic ? [EPIC.voice] : VOICES) {
    const files = [];
    let bytes = 0;
    manifest.voices[voice] = manifest.voices[voice] || {};
    for (const t of texts) {
      const k = textKey(t);
      const name = `${voice}-${k}.mp3`;
      const buf = epic ? epicFx(await synth(t, voice, EPIC.rate)) : await synth(t, voice);
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
// Frase de muestra de cada voz (para elegirla en Perfil)
for (const voice of process.env.PREVIEWS ? process.env.PREVIEWS.split(',') : []) {
  manifest.voices[voice] = manifest.voices[voice] || {};
  for (const t of [previewText(voice), ...(process.env.NAV ? navPhrases() : [])]) {
    const k = textKey(t);
    if (manifest.voices[voice][k]) continue; // ya grabada
    const name = `${voice}-${k}.mp3`;
    writeFileSync(join(OUT, name), await synth(t, voice));
    manifest.voices[voice][k] = name;
    chars += t.length;
  }
}
writeFileSync(join(OUT, 'audio-manifest.json'), JSON.stringify(manifest, null, 1));
console.log(`Listo: ${made} audios, ${chars} caracteres`);
