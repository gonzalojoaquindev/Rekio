// Ficha de un lugar: foto, historia, escuchar, cómo llegar, foto propia.
import { feeText } from '../money';
import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PointPhoto from './PointPhoto';
import Icon from './Icon';
import { Btn, Badge, pickPhoto } from './ui';
import { C, R } from '../theme';
import { placeById, distanceM, fmtDist } from '../geo';
import { useTour, tourById, stopAt } from '../tour';
import { useStore } from '../store';
import { placeHoursText } from '../hours';
import { LinkedText } from './Glossary';
import { categoryById, tagById } from '../data/categories';
import CalibBox from './CalibBox';

export default function PlaceSheet({ placeId, onClose }) {
  const insets = useSafeAreaInsets();
  const t = useTour();
  const store = useStore();
  const p = placeId ? placeById(placeId) : null;
  if (!p) return null;

  const playing = t.speaking === `place:${p.id}`;
  const tourDef = t.tour ? tourById(t.tour.id) : null;
  const order = tourDef ? t.tour.order || tourDef.stops.map((_, i) => i) : [];
  const stopIdx = tourDef ? order.findIndex((si) => tourDef.stops[si].id === p.id) : -1;
  const stop = stopIdx >= 0 ? stopAt(t.tour, stopIdx) : null;
  const dist = t.here ? distanceM(t.here, p) : null;
  const heard = store.heard.includes(p.id);
  const myPhotos = store.photos.filter((ph) => ph.placeId === p.id);

  const openMaps = () =>
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=walking`);

  const addPhoto = async () => {
    const uri = await pickPhoto();
    if (uri) store.addPhoto(uri, { placeId: p.id, tourId: t.tour ? t.tour.id : null });
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={st.backdrop} onPress={onClose} />
      <View style={[st.sheet, { paddingBottom: insets.bottom + 12 }]}>
        <View style={st.grab} />
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8 }} showsVerticalScrollIndicator={false}>
          <PointPhoto point={p} height={220} radius={R.md} />
          <View style={st.badges}>
            {stop && <Badge label={stop.optional ? 'Opcional' : '⭐ Imperdible'} bg={C.surface} />}
            {p.type === 'recreacion' && <Badge label="Recreación histórica" bg={C.brandSoft} color={C.brand} />}
            {heard && <Badge label="✓ Escuchado" bg="#E8F6EF" color={C.ok} />}
            {!!p.cat && <Badge label={`${categoryById(p.cat, p.city).icon} ${categoryById(p.cat, p.city).label}`} bg={C.surface} />}
            {(p.tags || []).map((tg) => tagById(tg) && <Badge key={tg} label={`${tagById(tg).icon} ${tagById(tg).label}`} bg={C.surface} />)}
          </View>
          <Text style={st.name}>{p.name}</Text>
          <Text style={st.local}>
            {p.jp}
            {dist != null ? `  ·  a ${fmtDist(dist)}` : ''}
          </Text>
          {!!p.short && <Text style={st.short}>{p.short}</Text>}
          {!!p.best && (
            <View style={[st.fee, { backgroundColor: '#F7F6FF' }]}>
              <Text style={st.feeTitle}>✨ Mejor momento: {p.best}</Text>
              {!!p.mins && <Text style={st.feeNote}>Calcula unos {p.mins >= 90 ? `${Math.round(p.mins / 30) / 2} horas` : `${p.mins} minutos`} de visita.</Text>}
            </View>
          )}
          {(() => {
            const h = placeHoursText(p.id);
            if (!h) return null;
            const bg = { ok: '#E8F6EF', warn: '#FFF4E0', bad: '#FDECEC', info: '#EEF3FB' }[h.tone];
            return (
              <View style={[st.fee, { backgroundColor: bg }]}>
                <Text style={st.feeTitle}>🕘 {h.text}</Text>
                <Text style={st.feeNote}>Horario de referencia (hora local).</Text>
              </View>
            );
          })()}
          {p.fee && (
            <View style={st.fee}>
              <Text style={st.feeTitle}>
                🎫 Entrada: {feeText(p.fee)} por persona{p.fee.cash ? ' · lleva efectivo' : ''}
              </Text>
              {!!p.fee.note && <Text style={st.feeNote}>{p.fee.note}</Text>}
              <Text style={st.feeNote}>Precio de referencia (nov. 2026), puede cambiar.</Text>
            </View>
          )}

          <View style={st.actions}>
            <Btn
              title={playing ? 'Detener' : 'Escuchar historia'}
              icon={playing ? 'stop' : 'play'}
              onPress={() => (playing ? t.stop() : t.playPlace(p.id))}
              style={{ flex: 1 }}
            />
          </View>
          <View style={st.actions}>
            <Btn title="Cómo llegar" icon="walk" kind="ghost" small onPress={openMaps} style={{ flex: 1 }} />
            <Btn title="Foto" icon="camera" kind="ghost" small onPress={addPhoto} style={{ flex: 1 }} />
            {stop && (
              <Btn
                title="Ir aquí"
                icon="route"
                kind="ghost"
                small
                onPress={() => {
                  t.goToStop(stopIdx);
                  onClose();
                }}
                style={{ flex: 1 }}
              />
            )}
          </View>

          {myPhotos.length > 0 && (
            <ScrollView horizontal style={{ marginTop: 14 }} contentContainerStyle={{ gap: 8 }}>
              {myPhotos.map((ph) => (
                <PhotoThumb key={ph.id} uri={ph.uri} />
              ))}
            </ScrollView>
          )}

          <Text style={st.storyTitle}>La historia</Text>
          <LinkedText style={st.story}>{p.story}</LinkedText>
          {!!p.sources && (
            <Text style={[st.feeNote, { marginTop: 12 }]}>
              📚 Fuentes: {p.sources} Las escenas y sonidos que se piden imaginar son recreaciones.
            </Text>
          )}
          <Text style={st.glossHint}>Toca las palabras subrayadas para ver su significado.</Text>
          {!!store.settings.devMode && <CalibBox p={p} />}
        </ScrollView>
        <TouchableOpacity style={[st.close, { top: 14 }]} onPress={onClose}>
          <Icon name="close" size={18} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const PhotoThumb = ({ uri }) => <Image source={{ uri }} style={{ width: 84, height: 84, borderRadius: 10 }} />;

const st = StyleSheet.create({
  glossHint: { fontSize: 12, color: '#717171', marginTop: 8 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '88%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  grab: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: C.line, marginTop: 10, marginBottom: 6 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  name: { fontSize: 24, fontWeight: '800', color: C.text, marginTop: 12, letterSpacing: -0.3 },
  local: { fontSize: 14, color: C.muted, marginTop: 4 },
  short: { fontSize: 15, color: C.text, marginTop: 10, lineHeight: 21 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 14 },
  fee: { marginTop: 14, padding: 14, borderRadius: R.md, backgroundColor: '#FFF7E6' },
  feeTitle: { fontSize: 15, fontWeight: '700', color: C.text },
  feeNote: { fontSize: 13, color: C.muted, marginTop: 4, lineHeight: 18 },
  storyTitle: { fontSize: 18, fontWeight: '800', color: C.text, marginTop: 24 },
  story: { fontSize: 16, lineHeight: 25, color: '#333', marginTop: 8 },
  close: {
    position: 'absolute',
    right: 16,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.line,
  },
});
