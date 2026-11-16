// "Mi día": itinerario con mapa, línea de tiempo, estado según la hora real y simulación del día completo.
import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapPanel from './MapPanel';
import { Btn, StatusChip, useNow } from './ui';
import { C, R, shadow } from '../theme';
import { placeById } from '../geo';
import { useTour, tourById } from '../tour';
import { useStore } from '../store';
import { currentItinerary, dayProgress, dayLabel, planWarning } from '../day';

export default function MyDay({ openTour, openPlace, onStarted, itin: itinProp, compact }) {
  const t = useTour();
  const store = useStore();
  const now = useNow();
  const itin = itinProp || currentItinerary(now);
  const prog = itin ? dayProgress(itin, now, { activeTourId: t.tour && t.tour.id, completed: store.completed }) : null;

  // Puntos del mapa: inicio de cada recorrido y los bloques libres con ubicación
  const { points, line } = useMemo(() => {
    if (!itin) return { points: [], line: [] };
    const pts = [];
    itin.items.forEach((it, i) => {
      const ll = it.kind === 'tour' ? placeById(tourById(it.tourId).stops[0].id) : it.at;
      if (!ll) return;
      pts.push({
        id: `day-${i}`,
        name: it.kind === 'tour' ? tourById(it.tourId).name : it.label,
        lat: ll.lat,
        lng: ll.lng,
        label: String(pts.length + 1),
        kind: it.kind === 'tour' ? 'must' : 'optional',
        state: prog && prog.items[i].done ? 'done' : 'todo',
      });
    });
    return { points: pts, line: pts.map((p) => [p.lat, p.lng]) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itin && itin.id, prog && prog.items.map((x) => x.done).join()]);

  if (!itin) return null;
  const firstTour = itin.items.find((x) => x.kind === 'tour');

  const simulateDay = () => {
    t.startTour(firstTour.tourId, true, 'original', { dayId: itin.id });
    onStarted && onStarted();
  };

  return (
    <View style={[st.box, compact && st.boxCompact]}>
      {!compact && <Text style={st.kicker}>MI DÍA · {dayLabel(itin).toUpperCase()}</Text>}
      {!compact && <Text style={st.title}>{itin.name}</Text>}
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <StatusChip chip={{ tone: prog.tone, text: prog.text }} />
      </View>

      <View style={{ marginTop: 14, borderRadius: R.md, overflow: 'hidden' }}>
        <MapPanel points={points} route={line} height={240} fitKey={`day:${itin.id}`} onTapPoint={() => {}} />
      </View>

      <View style={{ marginTop: 16 }}>
        {prog.items.map((it) => {
          const warn = planWarning(itin, it);
          const isCur = prog.curIdx === it.i;
          return (
            <View key={it.i}>
              {!!it.transit && (
                <View style={st.transit}>
                  <Text style={st.transitIcon}>🚆</Text>
                  <Text style={st.transitText}>
                    {it.transit.text}
                    {it.transit.minutes ? ` · unos ${it.transit.minutes} min` : ''}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                activeOpacity={it.kind === 'free' ? 1 : 0.8}
                onPress={() => (it.kind === 'tour' ? openTour(it.tourId) : it.kind === 'place' && openPlace ? openPlace(it.placeId) : null)}
                style={[st.item, isCur && st.itemCur]}
              >
                <View style={st.timeCol}>
                  <Text style={st.time}>{it.start}</Text>
                  <Text style={st.timeEnd}>{it.end}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={st.itemTitle}>
                    {it.kind === 'tour' ? '🎧 ' : `${it.icon || '•'} `}
                    {it.kind === 'tour' ? it.tour.name : it.label}
                    {it.done ? '  ✓' : ''}
                  </Text>
                  {!!it.note && <Text style={st.itemNote}>{it.note}</Text>}
                  {it.kind === 'tour' && (
                    <Text style={st.itemLink}>{it.done ? 'Completado · ver recorrido' : 'Ver recorrido y comenzar'}</Text>
                  )}
                  {it.kind === 'place' && <Text style={st.itemLink}>Ver lugar y escuchar su historia</Text>}
                  {!!warn && <Text style={[st.warn, warn.blocking && { color: '#B3261E' }]}>⚠️ {warn.message}</Text>}
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {!!firstTour && <Btn title="Simular el día completo" kind="ghost" onPress={simulateDay} style={{ marginTop: 14 }} />}
      <Text style={st.small}>
        La simulación recorre cada recorrido seguido del siguiente. Las indicaciones de transporte son aproximadas.
      </Text>
    </View>
  );
}

const st = StyleSheet.create({
  box: { backgroundColor: '#fff', borderRadius: R.lg, padding: 16, marginBottom: 24, ...shadow },
  boxCompact: { padding: 0, marginBottom: 8, shadowOpacity: 0, elevation: 0 },
  kicker: { fontSize: 12, fontWeight: '800', color: C.brand, letterSpacing: 0.6 },
  title: { fontSize: 22, fontWeight: '800', color: C.text, marginTop: 4 },
  transit: { flexDirection: 'row', gap: 8, paddingVertical: 8, paddingLeft: 18, borderLeftWidth: 2, borderLeftColor: '#D9D9D9', borderStyle: 'dashed', marginLeft: 22 },
  transitIcon: { fontSize: 14 },
  transitText: { flex: 1, fontSize: 13, lineHeight: 18, color: C.muted },
  item: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: R.md, backgroundColor: '#FAFAFA' },
  itemCur: { backgroundColor: '#FFF1EC', borderWidth: 1, borderColor: C.brand },
  timeCol: { width: 48, alignItems: 'flex-start' },
  time: { fontSize: 15, fontWeight: '800', color: C.text },
  timeEnd: { fontSize: 12, color: C.muted, marginTop: 2 },
  itemTitle: { fontSize: 15, fontWeight: '700', color: C.text, lineHeight: 20 },
  itemNote: { fontSize: 13, color: C.muted, marginTop: 4, lineHeight: 18 },
  itemLink: { fontSize: 13, fontWeight: '700', color: C.brand, marginTop: 6 },
  warn: { fontSize: 13, color: '#9A5B00', marginTop: 6, lineHeight: 18 },
  small: { fontSize: 12, color: C.muted, marginTop: 8, lineHeight: 17 },
});
