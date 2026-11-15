import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { ScreenTitle, SectionTitle, Chip, TourCard, PlaceCard, HScroll, useNow } from '../components/ui';
import { C, R, shadow } from '../theme';
import { TOURS, CITIES } from '../data/tours';
import { PLACES } from '../data/places';
import { distanceM } from '../geo';
import { useTour } from '../tour';
import { useStore, earnedStamps } from '../store';

const norm = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

export default function ExploreScreen({ openTour, openPlace }) {
  const insets = useSafeAreaInsets();
  const { here } = useTour();
  const store = useStore();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('Todo');
  const done = earnedStamps(store.completed);
  const now = useNow();

  const categories = useMemo(() => ['Todo', ...Array.from(new Set(TOURS.map((t) => t.category)))], []);

  const tours = TOURS.filter(
    (t) =>
      (cat === 'Todo' || t.category === cat) &&
      (!q || norm(`${t.name} ${t.description} ${t.category}`).includes(norm(q)))
  );
  const places = PLACES.filter((p) => !q || norm(`${p.name} ${p.jp} ${p.story}`).includes(norm(q)));

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
        return (
          <View key={city.id}>
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
          Rekio está empezando en Kioto. Cada nueva ciudad suma recorridos, lugares y estampillas.
        </Text>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
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
