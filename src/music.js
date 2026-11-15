// Música de fondo de los recorridos. Suena bajito en bucle y baja aún más mientras habla la guía.
// Pistas: originales generadas con tools/music.py, salvo Nara y Meiji (grabaciones libres, ver CREDITS).
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

const TRACKS = {
  gion: require('../assets/music/gion.m4a'),
  palacio: require('../assets/music/palacio.m4a'),
  kiyomizu: require('../assets/music/kiyomizu.m4a'),
  arashiyama: require('../assets/music/arashiyama.m4a'),
  kinkaku: require('../assets/music/kinkaku.m4a'),
  asakusa: require('../assets/music/asakusa.m4a'),
  edo: require('../assets/music/edo.m4a'),
  meiji: require('../assets/music/meiji.m4a'),
  nara: require('../assets/music/nara.m4a'),
};

export const CREDITS = [
  { title: 'Shika no Tōne (El llamado lejano del ciervo)', who: 'Araki Kodō III, grabación de c. 1930', license: 'Dominio público', where: 'Nara' },
  { title: 'Shizima2', who: 'PeriTune (peritune.com)', license: 'CC BY 3.0', where: 'Meiji Jingu y Harajuku' },
  { title: 'Resto de las pistas', who: 'Compuestas para Rekio', license: 'Originales', where: 'Kioto, Asakusa y Edo' },
];

const VOL_IDLE = 0.4; // sin narración
const VOL_DUCK = 0.12; // mientras habla la guía

let player = null;
let currentId = null;
let target = VOL_IDLE;
let fadeTimer = null;
let modeSet = false;

export const hasMusic = (tourId) => !!TRACKS[tourId];

function fadeTo(v, ms = 600) {
  target = v;
  clearInterval(fadeTimer);
  if (!player) return;
  const steps = 12;
  let i = 0;
  const from = player.volume ?? v;
  fadeTimer = setInterval(() => {
    i += 1;
    try {
      if (player) player.volume = from + ((v - from) * i) / steps;
    } catch (e) {}
    if (i >= steps) clearInterval(fadeTimer);
  }, ms / steps);
}

export async function playMusic(tourId, speaking = false) {
  if (currentId === tourId && player) return;
  stopMusic();
  const src = TRACKS[tourId];
  if (!src) return;
  try {
    if (!modeSet) {
      // Mezclar con la voz de la guía (no pedir el audio en exclusiva)
      await setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers', shouldPlayInBackground: false });
      modeSet = true;
    }
    player = createAudioPlayer(src);
    player.loop = true;
    player.volume = 0;
    player.play();
    currentId = tourId;
    fadeTo(speaking ? VOL_DUCK : VOL_IDLE, 2000);
  } catch (e) {
    player = null;
    currentId = null;
  }
}

export function stopMusic() {
  clearInterval(fadeTimer);
  try {
    if (player) player.remove();
  } catch (e) {}
  player = null;
  currentId = null;
}

// La guía empezó o terminó de hablar
export function duckMusic(speaking) {
  if (player) fadeTo(speaking ? VOL_DUCK : VOL_IDLE, speaking ? 300 : 1200);
}
