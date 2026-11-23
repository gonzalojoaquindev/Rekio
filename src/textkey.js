// Huella corta de un texto (FNV-1a de 32 bits + largo): identifica cada narración grabada.
// La usan la app y el generador de audios (scripts/tts-tours.mjs), así que no debe cambiar.
export function textKey(text) {
  const s = String(text).trim();
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `${s.length.toString(36)}-${h.toString(16).padStart(8, '0')}`;
}
