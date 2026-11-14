import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapPanel from '../components/MapPanel';
import { C, shadow } from '../theme';
import { PLACES } from '../data/places';
import { useTour } from '../tour';
import { useStore } from '../store';

export default function MapScreen({ openPlace }) {
  const insets = useSafeAreaInsets();
  const t = useTour();
  const store = useStore();

  const points = useMemo(
    () =>
      PLACES.map((p) => ({
        id: p.id,
        name: p.name,
        lat: p.lat,
        lng: p.lng,
        label: '',
        kind: 'place',
        state: store.heard.includes(p.id) ? 'done' : 'todo',
      })),
    [store.heard]
  );

  const heard = PLACES.filter((p) => store.heard.includes(p.id)).length;

  return (
    <View style={{ flex: 1 }}>
      <MapPanel flex rounded={false} points={points} me={t.here} fitKey="all" onTapPoint={openPlace} controlsTop={insets.top + 70} />
      <View style={[st.top, { top: insets.top + 10 }]}>
        <Text style={st.title}>Lugares con historia</Text>
        <Text style={st.sub}>
          {PLACES.length} lugares · {heard} escuchados · toca un punto para ver su ficha
        </Text>
      </View>
      {t.sim && (
        <View style={st.sim}>
          <Text style={st.simText}>Ubicación simulada</Text>
          <Text style={st.simLink} onPress={() => t.setSim(null)}>
            Volver al GPS
          </Text>
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  top: { position: 'absolute', left: 12, right: 12, backgroundColor: '#fff', borderRadius: 16, padding: 14, ...shadow },
  title: { fontSize: 17, fontWeight: '800', color: C.text },
  sub: { fontSize: 13, color: C.muted, marginTop: 2 },
  sim: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 12,
    backgroundColor: C.text,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  simText: { color: '#fff', fontWeight: '600' },
  simLink: { color: C.brand, fontWeight: '800' },
});
