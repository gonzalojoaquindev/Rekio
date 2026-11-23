// 🎚 Editor de sonido (solo en modo calibración): ánimo, ambiente y efectos frase a frase,
// con vista previa sobre la voz y envío de la partitura para la mezcla final.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, Share, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createAudioPlayer } from 'expo-audio';
import { C, R } from '../theme';
import { useStore } from '../store';
import MANIFEST from '../data/audio-manifest.json';
import { textKey } from '../textkey';
import { sentencesOf } from '../narrationTexts';
import { audioFor } from '../narration';
import { stopSpeaking } from '../speech';
import { stopMusic } from '../music';

export const MOOD_OPTS = [
  ['misterio', '🌑 Misterio'],
  ['tension', '⚡ Tensión'],
  ['melancolia', '🌧 Melancolía'],
  ['esperanza', '🌅 Esperanza'],
  ['victoria', '🏆 Victoria'],
  ['epico', '⚔️ Épico'],
  ['calma', '🍃 Calma'],
  ['silencio', '🔇 Sin música'],
];
export const AMB_OPTS = [
  ['viento', '🌬 Viento'],
  ['mar', '🌊 Mar'],
  ['grillos', '🦗 Noche'],
  ['agua', '💧 Agua'],
  ['fuego', '🔥 Fuego'],
  ['lluvia', '🌧 Lluvia'],
  ['ninguno', '∅ Ninguno'],
];
export const SFX_OPTS = [
  ['puerta', '🚪 Puerta', ''],
  ['campana', '🔔 Campana', ''],
  ['yunque', '🔨 Yunque', ''],
  ['golpe', '💥 Golpe', ''],
  ['subida', '📈 Subida', ':3'],
  ['pasos', '👣 Pasos', ':10'],
  ['redoble', '🥁 Redoble', ':6'],
  ['disparos', '🔫 Disparos', ''],
  ['canon', '💣 Cañón', ''],
  ['olas', '🌊 Olas', ':8'],
  ['piano', '🎹 Golpe de piano', ''],
  ['gritos', '📣 Gritos de multitud', ':8'],
  ['tocar', '✊ Tocan la puerta', ''],
  ['arena', '🏜 Pasos en arena', ':6'],
  ['nieve', '❄ Pasos en nieve', ':8'],
  ['recarga', '🔧 Recargar arma', ''],
  ['galope', '🐎 Galope', ':8'],
  ['caballo', '🐴 Caballo al paso', ':8'],
  ['relincho', '🐴 Relincho', ''],
  ['batalla', '⚔ Batalla', ':12'],
  ['abordaje', '🏴‍☠️ Combate naval', ':10'],
  ['fanfarria', '🎺 Fanfarria', ':10'],
  ['cuerno', '📯 Cuerno de guerra', ':6'],
  ['llamarada', '🔥 Llamarada', ':6'],
];
const label = (opts, id) => (opts.find((o) => o[0] === id) || [id, id])[1];
const bankUri = (kind, name) => `${MANIFEST.base}/banco-${kind}-${name}.mp3`;
const SUBIDA_SEG = 3;

// ── Vista previa: voz + muestras del banco en los momentos de la partitura ──
let players = [];
let timers = [];
let loops = { mood: null, amb: null };
function stopPreview() {
  timers.forEach(clearTimeout);
  timers = [];
  for (const p of players) {
    try {
      p.pause();
      p.remove();
    } catch (e) {}
  }
  players = [];
  loops = { mood: null, amb: null };
}
const mk = (uri, volume, loop) => {
  const p = createAudioPlayer({ uri });
  p.volume = volume;
  p.loop = !!loop;
  players.push(p);
  return p;
};
function setLoop(kind, name) {
  const old = loops[kind];
  if (old) {
    try {
      old.pause();
    } catch (e) {}
  }
  loops[kind] = null;
  if (!name || name === 'silencio' || name === 'ninguno') return;
  const p = mk(bankUri(kind === 'mood' ? 'animo' : 'amb', name), kind === 'mood' ? 0.22 : 0.3, true);
  p.play();
  loops[kind] = p;
}
function playSfx(s) {
  const name = s.split(':')[0];
  mk(bankUri('fx', name), 0.75).play();
}
async function preview(voiceUri, segs, cues, from, onEnd) {
  stopPreview();
  stopSpeaking();
  stopMusic();
  const t0 = segs[from][0];
  const v = mk(voiceUri, 1);
  try {
    await v.seekTo(Math.max(0, t0 - 0.2));
  } catch (e) {}
  v.play();
  // ánimo y ambiente vigentes al empezar
  let mood = null;
  let amb = null;
  for (const c of cues) if (c.at <= from) (mood = c.mood || mood), (amb = c.amb || amb);
  setLoop('mood', mood);
  setLoop('amb', amb);
  for (const c of cues) {
    if (c.at < from) continue;
    const at = (segs[Math.min(c.at, segs.length - 1)][0] - t0) * 1000;
    if (c.at > from) {
      if (c.mood) timers.push(setTimeout(() => setLoop('mood', c.mood), at));
      if (c.amb) timers.push(setTimeout(() => setLoop('amb', c.amb), at));
    }
    for (const s of c.sfx || []) {
      const early = s.startsWith('subida') ? (Number(s.split(':')[1]) || SUBIDA_SEG) * 1000 - 200 : 150;
      timers.push(setTimeout(() => playSfx(s), Math.max(0, at - early)));
    }
  }
  const end = (segs[segs.length - 1][1] - t0 + 2) * 1000;
  timers.push(setTimeout(() => (stopPreview(), onEnd && onEnd()), end));
}

export function scoreText(drafts) {
  return Object.entries(drafts || {})
    .map(([id, cues]) => `  ${/^[a-z_]+$/.test(id) ? id : `'${id}'`}: ${JSON.stringify(cues).replace(/"(\w+)":/g, '$1: ').replace(/"/g, "'")},`)
    .join('\n');
}

export default function ScoreEditor({ place, visible, onClose }) {
  const store = useStore();
  const insets = useSafeAreaInsets();
  const sentences = useMemo(() => sentencesOf(place.story), [place.story]);
  const segs = (MANIFEST.timings || {})[textKey(place.story)];
  const voice = audioFor(place.story, 'Algenib-voz');
  const draft = (store.scoreDrafts || {})[place.id];
  const cues = draft || place.score || [];
  const [sel, setSel] = useState(0);
  const [playing, setPlaying] = useState(false);
  const listRef = useRef(null);
  useEffect(() => () => stopPreview(), []);

  const cueAt = (i) => cues.find((c) => c.at === i) || { at: i };
  const save = (next) => {
    const clean = next
      .map((c) => {
        const o = { at: c.at };
        if (c.mood) o.mood = c.mood;
        if (c.amb) o.amb = c.amb;
        if (c.sfx && c.sfx.length) o.sfx = c.sfx;
        return o;
      })
      .filter((c) => c.mood || c.amb || c.sfx)
      .sort((a, b) => a.at - b.at);
    store.setScoreDraft(place.id, clean);
  };
  const edit = (patch) => {
    const cur = cueAt(sel);
    const others = cues.filter((c) => c.at !== sel);
    save([...others, { ...cur, ...patch }]);
  };
  const toggleSfx = (id, arg) => {
    const cur = cueAt(sel).sfx || [];
    const has = cur.find((s) => s.split(':')[0] === id);
    edit({ sfx: has ? cur.filter((s) => s !== has) : [...cur, id + arg] });
  };
  const play = (from) => {
    if (!segs || !voice) return Alert.alert('Falta grabar', 'Este capítulo aún no tiene tiempos por frase. Vuelve a grabarlo.');
    setPlaying(true);
    preview(voice.uri, segs, cues, from, () => setPlaying(false));
  };
  const stop = () => (stopPreview(), setPlaying(false));
  const close = () => (stop(), onClose());
  const cur = cueAt(sel);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close}>
      <View style={[st.wrap, { paddingTop: insets.top + 6 }]}>
        <View style={st.head}>
          <TouchableOpacity onPress={close} hitSlop={12}>
            <Text style={st.back}>‹ Cerrar</Text>
          </TouchableOpacity>
          <Text style={st.title} numberOfLines={1}>
            🎚 {place.name}
          </Text>
          <Text style={st.state}>{draft ? 'borrador' : 'original'}</Text>
        </View>

        <ScrollView ref={listRef} style={{ flex: 1 }} contentContainerStyle={{ padding: 14, paddingBottom: 20 }}>
          {sentences.map((s, i) => {
            const c = cues.find((x) => x.at === i);
            return (
              <TouchableOpacity key={i} style={[st.row, sel === i && st.rowOn]} onPress={() => setSel(i)} onLongPress={() => (setSel(i), play(i))}>
                <Text style={st.num}>{i}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={st.sent} numberOfLines={sel === i ? 6 : 2}>
                    {s}
                  </Text>
                  {!!c && (
                    <Text style={st.tags}>
                      {[c.mood && label(MOOD_OPTS, c.mood), c.amb && label(AMB_OPTS, c.amb), ...(c.sfx || []).map((x) => label(SFX_OPTS, x.split(':')[0]))]
                        .filter(Boolean)
                        .join('  ·  ')}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={[st.panel, { paddingBottom: insets.bottom + 10 }]}>
          <Text style={st.pTitle}>Frase {sel}: cambia el sonido desde aquí</Text>
          <Text style={st.pLabel}>Ánimo musical</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.chips}>
            <Chip on={!cur.mood} label="— sigue igual" onPress={() => edit({ mood: undefined })} />
            {MOOD_OPTS.map(([id, l]) => (
              <Chip key={id} on={cur.mood === id} label={l} onPress={() => edit({ mood: id })} />
            ))}
          </ScrollView>
          <Text style={st.pLabel}>Ambiente</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.chips}>
            <Chip on={!cur.amb} label="— sigue igual" onPress={() => edit({ amb: undefined })} />
            {AMB_OPTS.map(([id, l]) => (
              <Chip key={id} on={cur.amb === id} label={l} onPress={() => edit({ amb: id })} />
            ))}
          </ScrollView>
          <Text style={st.pLabel}>Efectos (al empezar la frase)</Text>
          <View style={st.wrapChips}>
            {SFX_OPTS.map(([id, l, arg]) => (
              <Chip key={id} on={(cur.sfx || []).some((x) => x.split(':')[0] === id)} label={l} onPress={() => toggleSfx(id, arg)} small />
            ))}
          </View>
          <View style={st.actions}>
            <TouchableOpacity style={[st.btn, { flex: 1 }]} onPress={() => (playing ? stop() : play(sel))}>
              <Text style={st.btnTxt}>{playing ? '■ Parar' : `▶ Escuchar desde la frase ${sel}`}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={st.btn2} onPress={() => (playSfx((cur.sfx || [])[0] || 'golpe'))} disabled={!(cur.sfx || []).length}>
              <Text style={st.btn2Txt}>🔊</Text>
            </TouchableOpacity>
          </View>
          <View style={st.actions}>
            <TouchableOpacity
              onPress={() => Share.share({ message: `Rekio · partitura\n${scoreText({ [place.id]: cues })}` })}
              style={st.link}
            >
              <Text style={st.linkTxt}>📤 Enviar partitura</Text>
            </TouchableOpacity>
            {!!draft && (
              <TouchableOpacity
                onPress={() =>
                  Alert.alert('¿Volver a la partitura original?', 'Se borra tu borrador de este capítulo.', [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Restaurar', style: 'destructive', onPress: () => store.setScoreDraft(place.id, null) },
                  ])
                }
                style={st.link}
              >
                <Text style={[st.linkTxt, { color: C.bad || '#C0392B' }]}>Restaurar original</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={st.note}>Mantén presionada una frase para escucharla. La vista previa es aproximada: la mezcla final se hace al enviar la partitura.</Text>
        </View>
      </View>
    </Modal>
  );
}

function Chip({ on, label, onPress, small }) {
  return (
    <TouchableOpacity onPress={onPress} style={[st.chip, small && st.chipSmall, on && st.chipOn]}>
      <Text style={[st.chipTxt, on && { color: '#fff' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const st = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.bg },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingBottom: 8, borderBottomWidth: 1, borderColor: C.line },
  back: { fontSize: 16, fontWeight: '700', color: C.brand },
  title: { flex: 1, fontSize: 16, fontWeight: '800', color: C.text },
  state: { fontSize: 12, color: C.muted, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 10, padding: 10, borderRadius: 12, marginBottom: 6, backgroundColor: '#fff' },
  rowOn: { borderWidth: 2, borderColor: C.brand },
  num: { width: 22, fontSize: 13, fontWeight: '800', color: C.muted, textAlign: 'right' },
  sent: { fontSize: 14, color: C.text, lineHeight: 19 },
  tags: { fontSize: 12, color: C.brand, fontWeight: '700', marginTop: 4 },
  panel: { backgroundColor: '#fff', borderTopWidth: 1, borderColor: C.line, paddingHorizontal: 14, paddingTop: 10 },
  pTitle: { fontSize: 14, fontWeight: '800', color: C.text },
  pLabel: { fontSize: 12, fontWeight: '700', color: C.muted, marginTop: 8 },
  chips: { gap: 6, paddingVertical: 4 },
  wrapChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingVertical: 4 },
  chip: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff' },
  chipSmall: { paddingHorizontal: 9, paddingVertical: 6 },
  chipOn: { backgroundColor: C.text, borderColor: C.text },
  chipTxt: { fontSize: 13, fontWeight: '700', color: C.text },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10, alignItems: 'center' },
  btn: { backgroundColor: C.brand, borderRadius: 999, paddingVertical: 12, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '800', fontSize: 14 },
  btn2: { borderRadius: 999, borderWidth: 1, borderColor: C.line, paddingVertical: 10, paddingHorizontal: 14 },
  btn2Txt: { fontSize: 16 },
  link: { paddingVertical: 4, paddingRight: 12 },
  linkTxt: { fontSize: 14, fontWeight: '800', color: C.brand },
  note: { fontSize: 11, color: C.muted, marginTop: 8 },
});
