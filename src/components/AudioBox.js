// Voz natural de un recorrido: avisa si la tiene y permite descargarla para escuchar sin internet.
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { C, R } from '../theme';
import { useStore } from '../store';
import { tourAudio, downloadTour, deleteTourAudio } from '../narration';

export default function AudioBox({ tourId }) {
  const store = useStore();
  const voice = store.settings.narrator || 'Fenrir';
  const [, bump] = useState(0);
  const [prog, setProg] = useState(null);
  const a = tourAudio(tourId, voice);
  if (!a) return null;
  const mb = (a.bytes / 1e6).toFixed(1);
  const download = async () => {
    setProg([a.have, a.files.length]);
    try {
      await downloadTour(tourId, voice, (d, n) => setProg([d, n]));
    } catch (e) {
      Alert.alert('No se pudo descargar', `${e.message || e}. Revisa tu conexión e inténtalo de nuevo.`);
    }
    setProg(null);
    bump((n) => n + 1);
  };
  return (
    <View style={st.box}>
      <Text style={st.title}>🎧 Narrado con voz natural · {a.voice}</Text>
      {a.complete ? (
        <>
          <Text style={st.sub}>✓ Descargado: funciona sin internet.</Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert('¿Borrar la descarga?', `Liberas ${mb} MB. Con internet se seguirá escuchando igual.`, [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Borrar', style: 'destructive', onPress: () => (deleteTourAudio(tourId, voice), bump((n) => n + 1)) },
              ])
            }
          >
            <Text style={st.link}>Borrar descarga ({mb} MB)</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={st.sub}>Con internet se escucha directo. Descárgalo antes de salir para escucharlo sin conexión.</Text>
          <TouchableOpacity style={st.btn} onPress={download} disabled={!!prog}>
            {prog ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator color="#fff" />
                <Text style={st.btnTxt}>
                  Descargando {prog[0]} de {prog[1]}…
                </Text>
              </View>
            ) : (
              <Text style={st.btnTxt}>⬇️ Descargar para escuchar sin internet ({mb} MB)</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  box: { marginTop: 14, padding: 14, borderRadius: R.md, backgroundColor: '#F3F1FF', gap: 6 },
  title: { fontSize: 15, fontWeight: '800', color: C.text },
  sub: { fontSize: 13, color: C.muted, lineHeight: 18 },
  btn: { marginTop: 4, backgroundColor: C.brand, borderRadius: 999, paddingVertical: 11, alignItems: 'center' },
  btnTxt: { color: '#fff', fontWeight: '800', fontSize: 14 },
  link: { color: C.brand, fontWeight: '700', marginTop: 4 },
});
