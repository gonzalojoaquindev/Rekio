import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Stamp from '../components/Stamp';
import { ScreenTitle } from '../components/ui';
import { C, R } from '../theme';
import { TOURS, CITIES } from '../data/tours';
import { cityById } from '../geo';
import { useStore, earnedStamps } from '../store';

export default function PassportScreen({ openTour }) {
  const insets = useSafeAreaInsets();
  const store = useStore();
  const earned = earnedStamps(store.completed);
  const count = Object.keys(earned).length;
  const size = (Dimensions.get('window').width - 40 - 16) / 2 - 22;
  const cellW = (Dimensions.get('window').width - 40 - 16) / 2;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 16, paddingBottom: 30 }}
    >
      <ScreenTitle>Pasaporte</ScreenTitle>
      <Text style={st.sub}>
        {count} de {TOURS.length} estampillas · completa recorridos para ganar más
      </Text>

      <View style={st.progress}>
        <View style={[st.bar, { width: `${(count / Math.max(TOURS.length, 1)) * 100}%` }]} />
      </View>

      {CITIES.map((city) => {
        const ct = TOURS.filter((t) => t.city === city.id);
        return (
          <View key={city.id}>
            <Text style={st.city}>
              {city.name}, {city.country}
            </Text>
            <View style={st.grid}>
              {ct.map((t) => {
                const e = earned[t.id];
                const c = cityById(t.city);
                return (
                  <TouchableOpacity key={t.id} style={[st.cell, { width: cellW }]} onPress={() => openTour(t.id)} activeOpacity={0.85}>
                    <View style={{ height: size + 10, justifyContent: 'center' }}>
                      <Stamp
                        stamp={t.stamp}
                        title={c.name}
                        cc={c.cc}
                        locked={!e}
                        size={t.stamp.shape === 'pill' ? size / 1.45 : size}
                      />
                    </View>
                    <Text style={st.name} numberOfLines={2}>
                      {t.name}
                    </Text>
                    <Text style={st.date}>
                      {e
                        ? new Date(e.date).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' }) +
                          (e.simulated ? ' · prueba' : '')
                        : 'Por descubrir'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const st = StyleSheet.create({
  sub: { fontSize: 15, color: C.muted },
  progress: { height: 8, borderRadius: 4, backgroundColor: C.surface, marginTop: 14, overflow: 'hidden' },
  bar: { height: 8, borderRadius: 4, backgroundColor: C.brand },
  city: { fontSize: 20, fontWeight: '800', color: C.text, marginTop: 28, marginBottom: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  cell: { alignItems: 'center', paddingVertical: 14, borderRadius: R.lg },
  name: { fontSize: 14, fontWeight: '700', color: C.text, textAlign: 'center', marginTop: 10 },
  date: { fontSize: 13, color: C.muted, marginTop: 2, textAlign: 'center' },
});
