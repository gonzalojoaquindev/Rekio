// Panel de calibración dentro de la ficha de un lugar (solo con el modo calibración activo).
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import * as Location from 'expo-location';
import MapPanel from './MapPanel';
import { C, R } from '../theme';
import { distanceM } from '../geo';
import { useStore } from '../store';
import { originalOf } from '../calib';

export default function CalibBox({ p }) {
  const store = useStore();
  const c = (store.calib || {})[p.id];
  const [me, setMe] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [note, setNote] = useState(c && c.note ? c.note : '');

  const locate = async (accuracy) => {
    const perm = await Location.requestForegroundPermissionsAsync();
    if (perm.status !== 'granted') throw new Error('sin permiso de ubicación');
    const pos = await Location.getCurrentPositionAsync({ accuracy });
    const m = { lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy };
    setMe(m);
    return m;
  };

  useEffect(() => {
    locate(Location.Accuracy.Balanced).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.id]);

  const markHere = async () => {
    setBusy(true);
    setMsg('');
    try {
      const m = await locate(Location.Accuracy.BestForNavigation);
      store.setCalib(p.id, { lat: m.lat, lng: m.lng, acc: m.acc, how: 'marcado en el lugar' });
      setMsg(`Punto movido a tu ubicación (GPS ±${Math.round(m.acc)} m).`);
    } catch (e) {
      setMsg(`No se pudo leer el GPS: ${e.message}`);
    }
    setBusy(false);
  };

  const radius = (delta) => {
    const r = Math.max(10, Math.min(200, p.radius + delta));
    store.setCalib(p.id, { radius: r });
  };

  const o = originalOf(p);
  const d = me ? Math.round(distanceM(me, p)) : null;
  return (
    <View style={st.box}>
      <Text style={st.title}>🛠 Calibración {c ? '· corregido' : ''}</Text>
      <Text style={st.sub}>
        {d == null ? 'Buscando tu ubicación…' : `Estás a ${d} m del punto${me.acc ? ` (GPS ±${Math.round(me.acc)} m)` : ''}. `}
        Empieza a hablar a {p.radius} m.
      </Text>
      <View style={st.map}>
        <MapPanel
          points={[{ id: p.id, lat: p.lat, lng: p.lng, label: '●', kind: 'must', state: 'now' }]}
          me={me}
          height={230}
          fitKey={`calib:${p.id}:${p.lat}:${p.lng}`}
          focus={{ lat: p.lat, lng: p.lng }}
          circles={[{ lat: p.lat, lng: p.lng, radius: p.radius }]}
          onLongPressMap={(ll) => {
            store.setCalib(p.id, { lat: ll.latitude, lng: ll.longitude, acc: null, how: 'ajustado en el mapa' });
            setMsg('Punto movido en el mapa.');
          }}
        />
      </View>
      <Text style={st.hint}>Mantén presionado el mapa para mover el punto (solo con Google Maps).</Text>
      <TouchableOpacity style={st.main} onPress={markHere} disabled={busy}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={st.mainTxt}>📍 Marcar aquí (estoy en el lugar)</Text>}
      </TouchableOpacity>
      <View style={st.row}>
        <TouchableOpacity style={st.small} onPress={() => radius(-10)}>
          <Text style={st.smallTxt}>Radio −10 m</Text>
        </TouchableOpacity>
        <TouchableOpacity style={st.small} onPress={() => radius(10)}>
          <Text style={st.smallTxt}>Radio +10 m</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={st.note}
        value={note}
        onChangeText={setNote}
        onEndEditing={() => note.trim() && store.setCalib(p.id, { note: note.trim() })}
        placeholder="Nota (ej.: el relato debería empezar en la puerta)"
        placeholderTextColor={C.muted}
      />
      {c && (
        <TouchableOpacity onPress={() => (store.setCalib(p.id, null), setNote(''), setMsg('Punto original restaurado.'))}>
          <Text style={st.reset}>Restaurar punto original ({o.radius} m)</Text>
        </TouchableOpacity>
      )}
      {!!msg && <Text style={st.msg}>{msg}</Text>}
    </View>
  );
}

const st = StyleSheet.create({
  box: { marginTop: 16, padding: 14, borderRadius: R.md, backgroundColor: '#FFF8E6', borderWidth: 1, borderColor: '#F2D48A' },
  title: { fontSize: 16, fontWeight: '800', color: C.text },
  sub: { fontSize: 13, color: C.muted, marginTop: 4, lineHeight: 18 },
  map: { borderRadius: 12, overflow: 'hidden', marginTop: 10 },
  hint: { fontSize: 12, color: C.muted, marginTop: 6 },
  main: { backgroundColor: C.brand, borderRadius: 999, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  mainTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },
  row: { flexDirection: 'row', gap: 10, marginTop: 10 },
  small: { flex: 1, borderRadius: 999, borderWidth: 1, borderColor: C.text, paddingVertical: 9, alignItems: 'center' },
  smallTxt: { fontWeight: '700', color: C.text },
  note: { marginTop: 10, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, color: C.text },
  reset: { color: C.bad || '#C0392B', fontWeight: '700', marginTop: 12 },
  msg: { fontSize: 13, color: C.text, marginTop: 8 },
});
