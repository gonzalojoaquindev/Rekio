import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { ScreenTitle, SectionTitle, Chip, TourCard, PlaceCard, HScroll, useNow } from '../components/ui';
import { useGlossary } from '../components/Glossary';
import { C, R, shadow } from '../theme';
import { TOURS, CITIES } from '../data/tours';
import { PLACES } from '../data/places';
import { distanceM } from '../geo';
import { useTour } from '../tour';
import { useStore, earnedStamps } from '../store';
import { cityPlaces } from '../components/CityCatalog';
import { categoriesFor } from '../data/categories';

const norm = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

export default function ExploreScreen({ openTour, openPlace, openCity }) {
  const insets = useSafeAreaInsets();
  const { here: rawHere } = useTour();
  // Posición redondeada a ~100 m: la lista no se recalcula con cada pequeño movimiento
  const hk = rawHere ? `${rawHere.lat.toFixed(3)},${rawHere.lng.toFixed(3)}` : '';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const here = useMemo(() => rawHere, [hk]);
  const store = useStore();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('Todo');
  const done = earnedStamps(store.completed);
  const now = useNow();
  const { openList } = useGlossary();

  const categories = useMemo(() => ['Todo', ...Array.from(new Set(TOURS.map((t) => t.category)))], []);

  const tours = TOURS.filter(
    (t) =>
      (cat === 'Todo' || t.category === cat) &&
      (!q || norm(`${t.name} ${t.description} ${t.category}`).includes(norm(q)))
  );
  // Sin búsqueda: los lugares de los recorridos (los del catálogo completo están en «Todo <ciudad>»)
  const stopIds = useMemo(() => new Set(TOURS.flatMap((t) => t.stops.map((s) => s.id))), []);
  const places = PLACES.filter((p) =>
    q ? norm(`${p.name} ${p.jp} ${p.story}`).includes(norm(q)) : !p.id.startsWith('tt_') && (p.city !== 'roma' || stopIds.has(p.id))
  );

  const nearby = here
    ? PLACES.map((p) => ({ p, d: distanceM(here, p) }))
        .filter(({ d }) => d < 3000)
        .sort((a, b) => a.d - b.d)
        .slice(0, 8)
    : [];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 12, paddingBottom: 30 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={st.search}>
        <Icon name="search" size={20} color={C.text} />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="¿Qué quieres descubrir?"
          placeholderTextColor={C.muted}
          style={st.input}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, marginTop: 14 }}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
        {categories.map((c) => (
          <Chip key={c} label={c} on={cat === c} onPress={() => setCat(c)} />
        ))}
      </ScrollView>

      {!q && (
        <TouchableOpacity style={st.vocab} onPress={openList} activeOpacity={0.85}>
          <Text style={st.vocabIcon}>📖</Text>
          <View style={{ flex: 1 }}>
            <Text style={st.vocabTitle}>Vocabulario</Text>
            <Text style={st.vocabSub}>Daimyō, geiko, shōgun, corsario… lo que necesitas para entender las historias</Text>
          </View>
          <Text style={st.vocabArrow}>›</Text>
        </TouchableOpacity>
      )}

      {!q && nearby.length > 0 && (
        <>
          <SectionTitle sub="Lugares con historia a pocos pasos">Cerca de ti</SectionTitle>
          <HScroll>
            {nearby.map(({ p, d }) => (
              <PlaceCard key={p.id} place={p} dist={d} heard={store.heard.includes(p.id)} onPress={() => openPlace(p.id)} />
            ))}
          </HScroll>
        </>
      )}

      {(here ? [...CITIES].sort((a, b) => distanceM(here, a) - distanceM(here, b)) : CITIES).map((city) => {
        const ct = tours.filter((t) => t.city === city.id);
        const cp = places.filter((p) => p.city === city.id);
        if (!ct.length && !cp.length) return null;
        const all = cityPlaces(city.id);
        const icons = categoriesFor(city.id).filter((c) => all.some((p) => p.cat === c.id)).map((c) => c.icon).join(' ');
        return (
          <View key={city.id}>
            {!q && all.length >= 8 && openCity && (
              <TouchableOpacity style={st.cityAll} activeOpacity={0.85} onPress={() => openCity(city.id)}>
                <View style={{ flex: 1 }}>
                  <Text style={st.cityAllTitle}>Todo {city.name}</Text>
                  <Text style={st.cityAllSub}>{all.length} lugares para elegir, con filtros y mapa</Text>
                  <Text style={st.cityAllIcons}>{icons}</Text>
                </View>
                <Text style={st.vocabArrow}>›</Text>
              </TouchableOpacity>
            )}
            {ct.length > 0 && (
              <>
                <SectionTitle sub={`${city.country} · audioguías a pie con GPS`}>Recorridos en {city.name}</SectionTitle>
                <HScroll>
                  {ct.map((t) => (
                    <TourCard key={t.id} tour={t} done={!!done[t.id]} myStars={(store.reviews || {})[t.id]?.stars} now={now} onPress={() => openTour(t.id)} />
                  ))}
                </HScroll>
              </>
            )}
            {cp.length > 0 && (
              <>
                <SectionTitle sub="Toca un lugar para escuchar su historia">Lugares en {city.name}</SectionTitle>
                <HScroll>
                  {cp.map((p) => (
                    <PlaceCard key={p.id} place={p} heard={store.heard.includes(p.id)} onPress={() => openPlace(p.id)} />
                  ))}
                </HScroll>
              </>
            )}
          </View>
        );
      })}

      {tours.length === 0 && places.length === 0 && (
        <Text style={st.empty}>No encontramos nada con "{q}". Prueba con otra palabra.</Text>
      )}

      <View style={st.soon}>
        <Text style={st.soonTitle}>Pronto, más ciudades</Text>
        <Text style={st.soonText}>
          Rekio ya recorre Roma, Kioto, Tokio, Nara, La Serena y Copiapó. Cada nueva ciudad suma recorridos, lugares y estampillas.
        </Text>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  cityAll: { flexDirection: 'row', alignItems: 'center', marginTop: 24, padding: 16, borderRadius: 16, backgroundColor: C.text },
  cityAllTitle: { fontSize: 20, fontWeight: '900', color: '#fff' },
  cityAllSub: { fontSize: 14, color: '#E6E6E6', marginTop: 3 },
  cityAllIcons: { fontSize: 18, marginTop: 8, letterSpacing: 2 },
  vocab: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 18, padding: 14, borderRadius: 16, backgroundColor: '#F7F6FF' },
  vocabIcon: { fontSize: 26 },
  vocabTitle: { fontSize: 16, fontWeight: '800', color: C.text },
  vocabSub: { fontSize: 13, color: C.muted, marginTop: 2, lineHeight: 18 },
  vocabArrow: { fontSize: 26, color: C.muted },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: R.pill,
    paddingHorizontal: 20,
    paddingVertical: 4,
    ...shadow,
    shadowOpacity: 0.14,
  },
  input: { flex: 1, fontSize: 16, color: C.text, paddingVertical: 12 },
  empty: { color: C.muted, fontSize: 15, marginTop: 30, textAlign: 'center' },
  soon: { marginTop: 34, padding: 20, borderRadius: R.lg, backgroundColor: C.surface },
  soonTitle: { fontSize: 17, fontWeight: '800', color: C.text },
  soonText: { fontSize: 14, color: C.muted, marginTop: 6, lineHeight: 20 },
});
