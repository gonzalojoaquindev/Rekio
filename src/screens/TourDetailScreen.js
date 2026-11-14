import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PointPhoto from '../components/PointPhoto';
import MapPanel from '../components/MapPanel';
import Stamp from '../components/Stamp';
import Icon from '../components/Icon';
import { Btn, SectionTitle, pickPhoto } from '../components/ui';
import { C, R, shadow } from '../theme';
import { placeById, tourStats, cityById } from '../geo';
import { fetchTourRoute } from '../nav';
import { tourById, useTour } from '../tour';
import { useStore, earnedStamps } from '../store';

const routeCache = {};

export default function TourDetailScreen({ tourId, onBack, openPlace, onStart }) {
  const insets = useSafeAreaInsets();
  const t = useTour();
  const store = useStore();
  const tour = tourById(tourId);
  const s = tourStats(tour);
  const city = cityById(tour.city);
  const stops = tour.stops.map((st, i) => ({ ...st, i, p: placeById(st.id) }));
  const must = stops.filter((x) => !x.optional);
  const optional = stops.filter((x) => x.optional);
  const earned = earnedStamps(store.completed)[tour.id];
  const photos = store.photos.filter((ph) => ph.tourId === tour.id);
  const [route, setRoute] = useState(routeCache[tour.id] || null);

  useEffect(() => {
    if (routeCache[tour.id]) return;
    fetchTourRoute(stops.map((x) => x.p))
      .then((line) => {
        if (line) {
          routeCache[tour.id] = line;
          setRoute(line);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour.id]);

  const points = stops.map((x) => ({
    id: x.p.id,
    name: x.p.name,
    lat: x.p.lat,
    lng: x.p.lng,
    label: String(x.i + 1),
    kind: x.optional ? 'optional' : 'must',
    state: store.heard.includes(x.p.id) ? 'done' : 'todo',
  }));

  const start = (simulate) => {
    t.startTour(tour.id, simulate);
    onStart();
  };

  const StopRow = ({ x }) => (
    <TouchableOpacity style={st.stopRow} onPress={() => openPlace(x.p.id)} activeOpacity={0.8}>
      <PointPhoto point={x.p} thumb size={72} radius={12} />
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={st.stopName}>
          {x.i + 1}. {x.p.name}
        </Text>
        {!!x.p.short && <Text style={st.stopShort}>{x.p.short}</Text>}
      </View>
      {store.heard.includes(x.p.id) && <Icon name="check" size={18} color={C.ok} stroke={2.6} />}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View>
          <PointPhoto point={placeById(tour.cover)} height={300} radius={0} credit={false} />
          <TouchableOpacity style={[st.back, { top: insets.top + 10 }]} onPress={onBack}>
            <Icon name="back" size={20} />
          </TouchableOpacity>
        </View>

        <View style={st.body}>
          <Text style={st.title}>{tour.name}</Text>
          <Text style={st.city}>
            {city.name}, {city.country} · {tour.category}
          </Text>

          <View style={st.stats}>
            <Stat icon="clock" value={s.durationLabel} label="duración" />
            <Stat icon="walk" value={`${s.km.toFixed(1).replace('.', ',')} km`} label="a pie" />
            <Stat icon="pin" value={String(s.stops)} label="paradas" />
            <Stat icon="star" value={String(s.must)} label="imperdibles" />
          </View>

          <Text style={st.desc}>{tour.description}</Text>

          <View style={st.stampBox}>
            <Stamp stamp={tour.stamp} title={city.name} cc={city.cc} size={86} locked={!earned} />
            <View style={{ flex: 1, marginLeft: 18 }}>
              <Text style={st.stampTitle}>{earned ? '¡Estampilla ganada!' : 'Gana esta estampilla'}</Text>
              <Text style={st.stampText}>
                {earned
                  ? `La conseguiste el ${new Date(earned.date).toLocaleDateString('es-CL')}.`
                  : 'Completa el recorrido y súmala a tu pasaporte.'}
              </Text>
            </View>
          </View>

          <SectionTitle sub="⭐ imperdibles  ·  ● opcionales">El recorrido</SectionTitle>
          <MapPanel points={points} route={route} height={260} fitKey={tour.id} onTapPoint={openPlace} />

          <SectionTitle sub="Los lugares que hacen especial este recorrido">Lo que no te puedes perder</SectionTitle>
          {must.map((x) => (
            <StopRow key={x.id} x={x} />
          ))}

          {optional.length > 0 && (
            <>
              <SectionTitle sub="Paradas opcionales: puedes saltarlas">Si tienes tiempo</SectionTitle>
              {optional.map((x) => (
                <StopRow key={x.id} x={x} />
              ))}
            </>
          )}

          <SectionTitle sub="Se guardan en tu teléfono">Tus fotos de este recorrido</SectionTitle>
          <View style={st.photos}>
            {photos.map((ph) => (
              <Image key={ph.id} source={{ uri: ph.uri }} style={st.photo} />
            ))}
            <TouchableOpacity
              style={[st.photo, st.addPhoto]}
              onPress={async () => {
                const uri = await pickPhoto();
                if (uri) store.addPhoto(uri, { tourId: tour.id });
              }}
            >
              <Icon name="camera" color={C.muted} />
              <Text style={st.addText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={[st.bottom, { paddingBottom: insets.bottom + 12 }]}>
        <Btn title="Simular" kind="ghost" onPress={() => start(true)} style={{ flex: 1 }} />
        <Btn title="Comenzar recorrido" icon="headphones" onPress={() => start(false)} style={{ flex: 2 }} />
      </View>
    </View>
  );
}

const Stat = ({ icon, value, label }) => (
  <View style={st.stat}>
    <Icon name={icon} size={20} color={C.text} />
    <Text style={st.statValue}>{value}</Text>
    <Text style={st.statLabel}>{label}</Text>
  </View>
);

const st = StyleSheet.create({
  back: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  body: { padding: 20, marginTop: -24, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  title: { fontSize: 26, fontWeight: '800', color: C.text, letterSpacing: -0.4 },
  city: { fontSize: 15, color: C.muted, marginTop: 6 },
  stats: {
    flexDirection: 'row',
    marginTop: 20,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
  },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 15, fontWeight: '800', color: C.text },
  statLabel: { fontSize: 12, color: C.muted },
  desc: { fontSize: 16, lineHeight: 24, color: '#333', marginTop: 18 },
  stampBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    padding: 18,
    borderRadius: R.lg,
    backgroundColor: C.surface,
  },
  stampTitle: { fontSize: 16, fontWeight: '800', color: C.text },
  stampText: { fontSize: 14, color: C.muted, marginTop: 4, lineHeight: 20 },
  stopRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  stopName: { fontSize: 16, fontWeight: '700', color: C.text },
  stopShort: { fontSize: 14, color: C.muted, marginTop: 3, lineHeight: 19 },
  photos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photo: { width: 100, height: 100, borderRadius: 12 },
  addPhoto: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: C.faint,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addText: { fontSize: 12, color: C.muted, fontWeight: '600' },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
  },
});
