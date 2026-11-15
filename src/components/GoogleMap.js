// Mapa nativo de Google (Maps SDK for Android). Mismas props que LeafletMap.
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { C, shadow } from '../theme';

const TYPES = [
  { id: 'standard', label: 'Mapa' },
  { id: 'hybrid', label: 'Satélite' },
];

const toLL = ([lat, lng]) => ({ latitude: lat, longitude: lng });

function Pin({ p }) {
  const now = p.state === 'now';
  const done = p.state === 'done';
  const size = now ? 40 : p.kind === 'must' ? 30 : 22;
  const bg = now ? C.brand : done ? C.ok : p.kind === 'must' ? C.text : p.kind === 'place' ? C.brand : '#9A9A9A';
  return (
    <View style={[st.pinWrap, now && st.pinHalo]}>
      <View style={[st.pin, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
        <Text style={[st.pinText, { fontSize: now ? 16 : size < 26 ? 10 : 12 }]}>{done ? '✓' : p.label}</Text>
      </View>
      {p.kind === 'must' && !now && <Text style={st.star}>⭐</Text>}
    </View>
  );
}

export default function GoogleMap({
  points = [],
  route,
  leg,
  me,
  focus,
  fitKey,
  onTapPoint,
  height = 280,
  flex = false,
  rounded = true,
  controlsTop = 10,
}) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const [typeIdx, setTypeIdx] = useState(0);
  const [track, setTrack] = useState(true); // redibuja los marcadores personalizados al cambiar
  const pointsKey = JSON.stringify(points.map((p) => [p.id, p.state, p.label]));

  useEffect(() => {
    setTrack(true);
    const t = setTimeout(() => setTrack(false), 1200);
    return () => clearTimeout(t);
  }, [pointsKey]);

  const fitAll = () => {
    if (!ref.current || !points.length) return;
    const coords = points.map((p) => ({ latitude: p.lat, longitude: p.lng }));
    if (me) coords.push({ latitude: me.lat, longitude: me.lng });
    if (coords.length === 1) {
      ref.current.animateCamera({ center: coords[0], zoom: 16 }, { duration: 500 });
      return;
    }
    ref.current.fitToCoordinates(coords, {
      edgePadding: { top: 90, right: 70, bottom: 90, left: 70 },
      animated: true,
    });
  };

  const centerMe = () => {
    if (ref.current && me) ref.current.animateCamera({ center: { latitude: me.lat, longitude: me.lng }, zoom: 18 }, { duration: 500 });
  };

  useEffect(() => {
    if (ready) setTimeout(fitAll, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, fitKey]);

  useEffect(() => {
    if (ready && focus && ref.current)
      ref.current.animateCamera({ center: { latitude: focus.lat, longitude: focus.lng }, zoom: 17 }, { duration: 600 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, focus && focus.lat, focus && focus.lng]);

  const first = points[0];
  const initialRegion = {
    latitude: first ? first.lat : 35.0116,
    longitude: first ? first.lng : 135.7681,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  };

  return (
    <View style={[st.wrap, flex ? { flex: 1 } : { height }, rounded && st.rounded]}>
      <MapView
        ref={ref}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        mapType={TYPES[typeIdx].id}
        onMapReady={() => setReady(true)}
        toolbarEnabled={false}
        showsCompass
        showsBuildings
        showsMyLocationButton={false}
        showsUserLocation={false}
      >
        {route && route.length > 1 && (
          <>
            <Polyline coordinates={route.map(toLL)} strokeColor="#FFFFFF" strokeWidth={8} zIndex={1} />
            <Polyline coordinates={route.map(toLL)} strokeColor="rgba(255,90,60,0.7)" strokeWidth={4} zIndex={2} />
          </>
        )}
        {leg && leg.length > 1 && (
          <>
            <Polyline coordinates={leg.map(toLL)} strokeColor="#FFFFFF" strokeWidth={10} zIndex={3} />
            <Polyline coordinates={leg.map(toLL)} strokeColor="#1A73E8" strokeWidth={6} zIndex={4} />
          </>
        )}
        {points.map((p) => (
          <Marker
            key={`${p.id}:${p.state}:${p.label}`}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={track}
            zIndex={p.state === 'now' ? 1000 : p.kind === 'must' ? 500 : 10}
            onPress={() => onTapPoint && onTapPoint(p.id)}
          >
            <Pin p={p} />
          </Marker>
        ))}
        {me && (
          <>
            <Circle
              center={{ latitude: me.lat, longitude: me.lng }}
              radius={Math.max(me.acc || 10, 5)}
              strokeColor="rgba(26,115,232,0.4)"
              fillColor="rgba(26,115,232,0.12)"
            />
            <Marker
              coordinate={{ latitude: me.lat, longitude: me.lng }}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
              zIndex={2000}
            >
              <View style={st.me} />
            </Marker>
          </>
        )}
      </MapView>

      <View style={[st.btns, { top: controlsTop }]}>
        <TouchableOpacity style={st.btn} onPress={centerMe}>
          <Text style={st.btnText}>◎</Text>
        </TouchableOpacity>
        <TouchableOpacity style={st.btn} onPress={fitAll}>
          <Text style={st.btnText}>⤢</Text>
        </TouchableOpacity>
        <TouchableOpacity style={st.btn} onPress={() => setTypeIdx((i) => (i + 1) % TYPES.length)}>
          <Text style={st.btnSmall}>{TYPES[(typeIdx + 1) % TYPES.length].label}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  wrap: { overflow: 'hidden', backgroundColor: '#E8EAED' },
  rounded: { borderRadius: 18 },
  pinWrap: { alignItems: 'center', justifyContent: 'center', padding: 6 },
  pinHalo: { backgroundColor: 'rgba(255,90,60,0.22)', borderRadius: 30 },
  pin: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#fff',
  },
  pinText: { color: '#fff', fontWeight: '800' },
  star: { position: 'absolute', top: 0, right: 0, fontSize: 12 },
  me: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1A73E8',
    borderWidth: 3,
    borderColor: '#fff',
    ...shadow,
  },
  btns: { position: 'absolute', right: 10, gap: 8, alignItems: 'flex-end' },
  btn: {
    backgroundColor: '#fff',
    borderRadius: 20,
    minWidth: 40,
    height: 40,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  btnText: { color: C.text, fontSize: 18, fontWeight: '700' },
  btnSmall: { color: C.text, fontSize: 12, fontWeight: '700' },
});
