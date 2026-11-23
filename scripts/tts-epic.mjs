// Muestras de voz "épica" para las historias inmersivas: voces graves de Chirp 3 HD, más lentas y con
// un leve procesado (tono más grave, cuerpo en los bajos y un poco de sala), y Gemini-TTS con indicación de estilo.
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const KEY = process.env.GOOGLE_TTS_KEY;
const OUT = '/tmp/voz';
mkdirSync(OUT, { recursive: true });
const log = (s) => (console.log(s), appendFileSync(`${OUT}/informe.txt`, s + '\n'));

const TEXT =
  'Copiapó. Cinco de enero de 1859. Cae la noche. Mientras la ciudad se va a dormir, un grupo de hombres se reúne en secreto. ' +
  'No los dirige un general, ni un político. Los encabeza un artesano: Pedro Pablo Zapata. ' +
  'Esa noche, Zapata y unos veinte hombres avanzan hacia el cuartel de policía. Y lo que ocurrirá en las próximas horas cambiará la historia de Atacama.';
const STYLE =
  'Narra como el narrador de una película épica e histórica: voz grave, profunda y pausada, con tensión contenida y pausas dramáticas, en español latinoamericano neutro.';

// Procesado "cinematográfico": baja el tono ~1 semitono sin cambiar la velocidad, refuerza graves y agrega sala
const FX = 'asetrate=24000*0.944,aresample=24000,atempo=1.059,bass=g=4:f=110:w=0.7,aecho=0.8:0.5:55|95:0.12|0.07,loudnorm=I=-18:TP=-1.5';

const SAMPLES = [
  { file: '1-Charon-epico', voice: 'es-US-Chirp3-HD-Charon', rate: 0.9, fx: true },
  { file: '2-Algenib-epico', voice: 'es-US-Chirp3-HD-Algenib', rate: 0.9, fx: true },
  { file: '3-Alnilam-epico', voice: 'es-US-Chirp3-HD-Alnilam', rate: 0.9, fx: true },
  { file: '4-Iapetus-epico', voice: 'es-US-Chirp3-HD-Iapetus', rate: 0.9, fx: true },
  { file: '5-Fenrir-epico', voice: 'es-US-Chirp3-HD-Fenrir', rate: 0.9, fx: true },
  { file: '6-Gemini-Charon-estilo', voice: 'Charon', model: 'gemini-2.5-pro-tts', prompt: STYLE },
  { file: '7-Gemini-Algenib-estilo', voice: 'Algenib', model: 'gemini-2.5-pro-tts', prompt: STYLE },
  { file: '8-Gemini-Orus-estilo', voice: 'Orus', model: 'gemini-2.5-pro-tts', prompt: STYLE },
];

for (const s of SAMPLES) {
  const body = {
    input: s.prompt ? { text: TEXT, prompt: s.prompt } : { text: TEXT },
    voice: { languageCode: 'es-US', name: s.voice, ...(s.model ? { modelName: s.model } : {}) },
    audioConfig: { audioEncoding: 'MP3', ...(s.rate ? { speakingRate: s.rate } : {}) },
  };
  try {
    let r = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${KEY}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    let d = await r.json();
    if (!r.ok && s.model) {
      // algunos idiomas de Gemini-TTS usan es-419 o es-ES
      for (const lang of ['es-419', 'es-ES']) {
        body.voice.languageCode = lang;
        r = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${KEY}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
        d = await r.json();
        if (r.ok) break;
      }
    }
    if (!r.ok) {
      log(`${s.file}: error ${r.status} ${JSON.stringify(d.error || d).slice(0, 300)}`);
      continue;
    }
    const raw = `${OUT}/${s.file}-raw.mp3`;
    writeFileSync(raw, Buffer.from(d.audioContent, 'base64'));
    if (s.fx) {
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-af', FX, '-c:a', 'libmp3lame', '-b:a', '96k', `${OUT}/${s.file}.mp3`]);
      execFileSync('rm', [raw]);
    } else execFileSync('mv', [raw, `${OUT}/${s.file}.mp3`]);
    log(`${s.file}: ok (${body.voice.languageCode})`);
  } catch (e) {
    log(`${s.file}: ${e.message}`);
  }
}
