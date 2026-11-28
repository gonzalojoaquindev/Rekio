// Todos los lugares de una ciudad, por categoría y etiquetas, en lista o en mapa.
// Se usa en Explora (vista de ciudad) y en Viajes → Descubrir (con ❤️ para guardar).
import { feeText } from '../money';
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import PointPhoto from './PointPhoto';
import MapPanel from './MapPanel';
import { StatusChip, useNow } from './ui';
import { C, R } from '../theme';
import { PLACES } from '../data/places';
import { CATEGORIES, TAGS, categoryById, categoriesFor } from '../data/categories';
import { placeStatus } from '../hours';
import { fmtMin } from '../hours';

const PAGE = 25;
const norm = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Lugares que se listan en una ciudad (no las partes de otro lugar, como un salón dentro de un templo)
export const cityPlaces = (city) => PLACES.filter((p) => p.city === city && p.cat && !p.part);

// Chip corto con el estado de hoy
export function hoursChip(id, now) {
  const s = placeStatus(id, now);
  if (!s) return null;
  const soft = s.spec.soft;
  if (s.state === 'closed') return { tone: soft ? 'warn' : 'bad', text: soft ? s.spec.softChip || 'Interior cerrado' : 'Cerrado hoy' };
  if (s.state === 'after') return { tone: soft ? 'warn' : 'bad', text: soft ? s.spec.softChip || 'Ya cerró' : 'Ya cerró por hoy' };
  if (s.state === 'before') return { tone: 'info', text: soft && s.spec.softChip ? s.spec.softChip : `Abre a las ${fmtMin(s.open)}` };
  if (s.state === 'soon') return { tone: 'warn', text: s.close >= 1439 ? 'Abierto' : `Cierra a las ${fmtMin(s.close)}` };
  return { tone: 'ok', text: 'Abierto ahora' };
}

export const priceText = (p) =>
  p.fee ? `${feeText(p.fee)}${p.fee.cash ? ' · efectivo' : ''}` : (p.tags || []).includes('gratis') ? 'Gratis' : null;

export function CatalogRow({ p, now, onPress, right }) {
  const c = categoryById(p.cat, p.city);
  const price = priceText(p);
  const chip = hoursChip(p.id, now);
  return (
    <TouchableOpacity style={st.row} activeOpacity={0.85} onPress={onPress}>
      <PointPhoto point={p} thumb size={72} radius={12} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={st.kicker}>
          {c.icon} {c.label.toUpperCase()}
          {p.mins ? ` · ${p.mins >= 90 ? `${Math.round(p.mins / 30) / 2} h` : `${p.mins} min`}` : ''}
        </Text>
        <Text style={st.name} numberOfLines={2}>{p.name}</Text>
        {!!p.short && <Text style={st.short} numberOfLines={2}>{p.short}</Text>}
        <View style={st.meta}>
          {!!price && <Text style={[st.price, price === 'Gratis' && { color: C.ok }]}>{price === 'Gratis' ? '🆓 Gratis' : `🎫 ${price}`}</Text>}
          {chip && <StatusChip small chip={chip} />}
        </View>
        {!!p.best && <Text style={st.best} numberOfLines={2}>🕘 {p.best}</Text>}
      </View>
      {right}
    </TouchableOpacity>
  );
}

export default function CityCatalog({ city, openPlace, renderRight, mapHeight = 380 }) {
  const now = useNow();
  const [cat, setCat] = useState('all');
  const [tags, setTags] = useState([]);
  const [q, setQ] = useState('');
  const [view, setView] = useState('list');
  const [shown, setShown] = useState(PAGE);

  const all = useMemo(() => cityPlaces(city), [city]);
  const counts = useMemo(() => {
    const m = {};
    all.forEach((p) => (m[p.cat] = (m[p.cat] || 0) + 1));
    return m;
  }, [all]);
  const cats = categoriesFor(city).filter((c) => counts[c.id]);

  const list = useMemo(() => {
    const qq = norm(q);
    const rank = (p) => CATEGORIES.findIndex((c) => c.id === p.cat);
    return all
      .filter(
        (p) =>
          (cat === 'all' || p.cat === cat) &&
          tags.every((t) => (p.tags || []).includes(t)) &&
          (!qq || norm(`${p.name} ${p.jp} ${p.short} ${categoryById(p.cat, p.city).label}`).includes(qq))
      )
      .sort((a, b) => rank(a) - rank(b));
  }, [all, cat, tags, q]);

  const toggleTag = (id) => {
    setShown(PAGE);
    setTags((ts) => (ts.includes(id) ? ts.filter((x) => x !== id) : [...ts, id]));
  };
  const pickCat = (id) => {
    setShown(PAGE);
    setCat(id);
  };

  const points = useMemo(
    () => list.map((p) => ({ id: p.id, lat: p.lat, lng: p.lng, label: categoryById(p.cat, p.city).icon, kind: 'place', state: 'todo' })),
    [list]
  );

  // En la lista con "Todo", un encabezado cada vez que cambia la categoría
  let lastCat = null;
  return (
    <View>
      <TextInput
        style={st.input}
        value={q}
        onChangeText={(v) => {
          setShown(PAGE);
          setQ(v);
        }}
        placeholder="Buscar: torre, ramen, jardín…"
        placeholderTextColor={C.muted}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.chips}>
        <Pill label={`Todo (${all.length})`} on={cat === 'all'} onPress={() => pickCat('all')} />
        {cats.map((c) => (
          <Pill key={c.id} label={`${c.icon} ${c.label} (${counts[c.id]})`} on={cat === c.id} onPress={() => pickCat(c.id)} />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.chips}>
        {TAGS.map((t) => (
          <Pill key={t.id} small label={`${t.icon} ${t.label}`} on={tags.includes(t.id)} onPress={() => toggleTag(t.id)} />
        ))}
      </ScrollView>

      <View style={st.bar}>
        <Text style={st.count}>
          {list.length} {list.length === 1 ? 'lugar' : 'lugares'}
        </Text>
        <View style={st.seg}>
          {[
            ['list', '☰ Lista'],
            ['map', '🗺️ Mapa'],
          ].map(([k, label]) => (
            <TouchableOpacity key={k} onPress={() => setView(k)} style={[st.segBtn, view === k && st.segOn]}>
              <Text style={[st.segTxt, view === k && { color: '#fff' }]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {view === 'map' && (
        <View style={{ borderRadius: R.md, overflow: 'hidden', marginBottom: 12 }}>
          {points.length ? (
            <MapPanel points={points} height={mapHeight} fitKey={`cat:${city}:${cat}:${tags.join()}:${q}`} onTapPoint={(id) => openPlace(id)} />
          ) : null}
          <Text style={st.mapHint}>Toca un punto para ver el lugar. Cada ícono es su categoría.</Text>
        </View>
      )}

      {view === 'list' &&
        list.slice(0, shown).map((p) => {
          const head = cat === 'all' && p.cat !== lastCat ? categoryById(p.cat, p.city) : null;
          lastCat = p.cat;
          return (
            <View key={p.id}>
              {head && (
                <Text style={st.section}>
                  {head.icon} {head.label}
                </Text>
              )}
              <CatalogRow p={p} now={now} onPress={() => openPlace(p.id)} right={renderRight && renderRight(p)} />
            </View>
          );
        })}
      {view === 'list' && list.length > shown && (
        <TouchableOpacity style={st.more} onPress={() => setShown((n) => n + PAGE)}>
          <Text style={st.moreTxt}>Ver más lugares ({list.length - shown})</Text>
        </TouchableOpacity>
      )}
      {!list.length && <Text style={st.empty}>Nada con esos filtros. Prueba quitando alguno.</Text>}
    </View>
  );
}

function Pill({ label, on, onPress, small }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[st.pill, small && st.pillSmall, on && st.pillOn]}>
      <Text style={[st.pillTxt, small && { fontSize: 13 }, on && { color: '#fff' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const st = StyleSheet.create({
  input: { backgroundColor: '#fff', borderRadius: R.md, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, color: C.text, borderWidth: 1, borderColor: C.line },
  chips: { gap: 8, paddingVertical: 6 },
  pill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, backgroundColor: '#fff', borderWidth: 1, borderColor: C.line },
  pillSmall: { paddingHorizontal: 12, paddingVertical: 7 },
  pillOn: { backgroundColor: C.text, borderColor: C.text },
  pillTxt: { fontSize: 14, fontWeight: '700', color: C.text },
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, marginBottom: 10 },
  count: { fontSize: 14, color: C.muted, fontWeight: '700' },
  seg: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 999, borderWidth: 1, borderColor: C.line, padding: 3 },
  segBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  segOn: { backgroundColor: C.brand },
  segTxt: { fontSize: 13, fontWeight: '700', color: C.text },
  section: { fontSize: 17, fontWeight: '800', color: C.text, marginTop: 14, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: R.md, padding: 10, marginBottom: 10 },
  kicker: { fontSize: 11, fontWeight: '800', color: C.muted, letterSpacing: 0.4 },
  name: { fontSize: 16, fontWeight: '800', color: C.text, marginTop: 2 },
  short: { fontSize: 13, color: C.muted, marginTop: 3, lineHeight: 18 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 6 },
  price: { fontSize: 13, fontWeight: '700', color: C.text },
  best: { fontSize: 12, color: C.muted, marginTop: 5, lineHeight: 16 },
  mapHint: { fontSize: 12, color: C.muted, marginTop: 6 },
  more: { padding: 14, alignItems: 'center' },
  moreTxt: { fontSize: 15, fontWeight: '800', color: C.brand },
  empty: { fontSize: 15, color: C.muted, textAlign: 'center', marginTop: 20 },
});
