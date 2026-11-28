// Vocabulario: texto con palabras subrayadas, tarjeta con el significado y lista completa con buscador.
import React, { createContext, useContext, useMemo, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, StyleSheet, Pressable } from 'react-native';
import { GLOSSARY, termById } from '../data/glossary';
import { linkTerms } from '../glossary';
import { sayAside, stopSpeaking, speakingKey } from '../speech';
import { PLACES } from '../data/places';
import { TOURS } from '../data/tours';
import { termsIn, regionOf } from '../glossary';
import { C, R } from '../theme';

const Ctx = createContext({ openTerm: () => {}, openList: () => {} });
export const useGlossary = () => useContext(Ctx);

// Recorridos donde aparece cada término (se calcula una vez)
let whereCache = null;
function whereUsed(id) {
  if (!whereCache) {
    whereCache = {};
    for (const t of TOURS) {
      const ids = new Set(t.stops.flatMap((s) => termsIn((PLACES.find((p) => p.id === s.id) || {}).story || '', 40, regionOf(t.city))));
      ids.forEach((x) => (whereCache[x] = [...(whereCache[x] || []), t.name.split(':')[0]]));
    }
  }
  return whereCache[id] || [];
}

export function GlossaryProvider({ children }) {
  const [termId, setTermId] = useState(null);
  const [history, setHistory] = useState([]);
  const [listOpen, setListOpen] = useState(false);
  const api = useMemo(
    () => ({
      openTerm: (id) => {
        setHistory([]);
        setTermId(id);
      },
      openList: () => setListOpen(true),
    }),
    []
  );
  return (
    <Ctx.Provider value={api}>
      {children}
      <TermCard
        id={termId}
        canGoBack={history.length > 0}
        onBack={() => {
          setTermId(history[history.length - 1]);
          setHistory(history.slice(0, -1));
        }}
        onRelated={(id) => {
          setHistory([...history, termId]);
          setTermId(id);
        }}
        onClose={() => {
          if (speakingKey() === 'aside') stopSpeaking();
          setTermId(null);
        }}
      />
      <GlossaryList visible={listOpen} onClose={() => setListOpen(false)} onPick={(id) => setTermId(id)} />
    </Ctx.Provider>
  );
}

// Texto con las palabras del vocabulario subrayadas (solo su primera aparición)
export function LinkedText({ children, style, city, region }) {
  const { openTerm } = useGlossary();
  const rg = region || (city ? regionOf(city) : undefined);
  const parts = useMemo(() => linkTerms(String(children || ''), { region: rg }), [children, rg]);
  return (
    <Text style={style}>
      {parts.map((p, i) =>
        p.id ? (
          <Text key={i} style={st.link} onPress={() => openTerm(p.id)} accessibilityRole="link">
            {p.text}
          </Text>
        ) : (
          p.text
        )
      )}
    </Text>
  );
}

// Fila de chips con los términos de un texto (para el reproductor)
export function TermChips({ text, label = 'Palabras clave', city }) {
  const { openTerm } = useGlossary();
  const ids = useMemo(() => termsIn(text || '', 6, city ? regionOf(city) : undefined), [text, city]);
  if (!ids.length) return null;
  return (
    <View style={st.chipsBox}>
      <Text style={st.chipsLabel}>📖 {label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {ids.map((id) => (
          <TouchableOpacity key={id} style={st.chip} onPress={() => openTerm(id)}>
            <Text style={st.chipText}>{termById(id).term}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function TermCard({ id, onClose, onRelated, canGoBack, onBack }) {
  const g = id ? termById(id) : null;
  const where = g ? whereUsed(g.id) : [];
  return (
    <Modal visible={!!g} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={st.backdrop} onPress={onClose} />
      {g && (
        <View style={st.sheet}>
          <View style={st.grabber} />
          <ScrollView style={{ maxHeight: 460 }} contentContainerStyle={{ paddingBottom: 8 }}>
            {canGoBack && (
              <TouchableOpacity onPress={onBack}>
                <Text style={st.back}>‹ Volver</Text>
              </TouchableOpacity>
            )}
            <Text style={st.kicker}>VOCABULARIO</Text>
            <Text style={st.term}>{g.term}</Text>
            {!!g.jp && <Text style={st.jp}>{g.jp}</Text>}
            <Text style={st.short}>{g.short}</Text>
            {!!g.long && <LinkedText style={st.long} region={g.region}>{g.long}</LinkedText>}
            {!!(g.related && g.related.length) && (
              <>
                <Text style={st.section}>Relacionado</Text>
                <View style={st.relRow}>
                  {g.related.map(termById).filter(Boolean).map((r) => (
                    <TouchableOpacity key={r.id} style={st.chip} onPress={() => onRelated(r.id)}>
                      <Text style={st.chipText}>{r.term}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
            {!!where.length && (
              <Text style={st.where}>Aparece en: {where.slice(0, 5).join(' · ')}</Text>
            )}
          </ScrollView>
          <View style={st.actions}>
            <TouchableOpacity style={st.listen} onPress={() => sayAside(`${g.term}. ${g.short} ${g.long || ''}`)}>
              <Text style={st.listenText}>🔊 Escuchar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={st.close} onPress={onClose}>
              <Text style={st.closeText}>Entendido</Text>
            </TouchableOpacity>
          </View>
          <Text style={st.hint}>Si estabas escuchando una historia, sigue donde iba después de la definición.</Text>
        </View>
      )}
    </Modal>
  );
}

const normalize = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function GlossaryList({ visible, onClose, onPick }) {
  const [q, setQ] = useState('');
  const items = useMemo(() => {
    const nq = normalize(q.trim());
    return [...GLOSSARY]
      .filter((g) => !nq || normalize(`${g.term} ${(g.aliases || []).join(' ')} ${g.short}`).includes(nq))
      .sort((a, b) => normalize(a.term).localeCompare(normalize(b.term)));
  }, [q]);
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={st.listWrap}>
        <View style={st.listHead}>
          <Text style={st.listTitle}>Vocabulario</Text>
          <TouchableOpacity onPress={onClose} hitSlop={10}>
            <Text style={st.listClose}>Cerrar</Text>
          </TouchableOpacity>
        </View>
        <Text style={st.listSub}>{GLOSSARY.length} palabras para entender mejor las historias</Text>
        <TextInput style={st.search} placeholder="Buscar: daimyō, geiko, corsario…" placeholderTextColor={C.muted} value={q} onChangeText={setQ} />
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {items.map((g) => (
            <TouchableOpacity key={g.id} style={st.row} onPress={() => onPick(g.id)}>
              <Text style={st.rowTerm}>
                {g.term}
                {g.jp ? <Text style={st.rowJp}>  {g.jp}</Text> : null}
              </Text>
              <Text style={st.rowShort} numberOfLines={2}>
                {g.short}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const st = StyleSheet.create({
  link: { textDecorationLine: 'underline', textDecorationColor: C.brand, color: C.text, fontWeight: '600' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20, paddingTop: 10 },
  grabber: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: '#DDD', marginBottom: 12 },
  back: { fontSize: 15, fontWeight: '700', color: C.brand, marginBottom: 6 },
  kicker: { fontSize: 12, fontWeight: '800', color: C.brand, letterSpacing: 0.6 },
  term: { fontSize: 26, fontWeight: '800', color: C.text, marginTop: 4 },
  jp: { fontSize: 16, color: C.muted, marginTop: 2 },
  short: { fontSize: 17, lineHeight: 24, color: C.text, marginTop: 12, fontWeight: '600' },
  long: { fontSize: 15, lineHeight: 22, color: C.text, marginTop: 10 },
  section: { fontSize: 13, fontWeight: '800', color: C.muted, marginTop: 16, marginBottom: 8 },
  relRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  where: { fontSize: 13, color: C.muted, marginTop: 14, lineHeight: 18 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  listen: { flex: 1, borderWidth: 1, borderColor: C.text, borderRadius: R.md, paddingVertical: 12, alignItems: 'center' },
  listenText: { fontSize: 15, fontWeight: '700', color: C.text },
  close: { flex: 1, backgroundColor: C.brand, borderRadius: R.md, paddingVertical: 12, alignItems: 'center' },
  closeText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  hint: { fontSize: 12, color: C.muted, marginTop: 8, textAlign: 'center' },
  chipsBox: { marginTop: 10 },
  chipsLabel: { fontSize: 13, fontWeight: '700', color: C.muted, marginBottom: 6 },
  chip: { borderWidth: 1, borderColor: '#DDD', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#fff' },
  chipText: { fontSize: 14, fontWeight: '600', color: C.text },
  listWrap: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 48 },
  listHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listTitle: { fontSize: 28, fontWeight: '800', color: C.text },
  listClose: { fontSize: 16, fontWeight: '700', color: C.brand },
  listSub: { fontSize: 14, color: C.muted, marginTop: 4 },
  search: { borderWidth: 1, borderColor: '#DDD', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, marginVertical: 14, color: C.text },
  row: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  rowTerm: { fontSize: 17, fontWeight: '700', color: C.text },
  rowJp: { fontSize: 14, fontWeight: '400', color: C.muted },
  rowShort: { fontSize: 14, color: C.muted, marginTop: 3, lineHeight: 19 },
});
