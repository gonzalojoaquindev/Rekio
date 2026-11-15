import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Image,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Stamp from '../components/Stamp';
import Icon from '../components/Icon';
import { ScreenTitle, SectionTitle, Btn, HScroll, pickPhoto } from '../components/ui';
import { C, R, shadow } from '../theme';
import { TOURS } from '../data/tours';
import { PLACES } from '../data/places';
import { cityById } from '../geo';
import { useStore, earnedStamps } from '../store';
import { getVoice, getVoices, setVoice, voiceLabel, say } from '../speech';
import { hasGoogleMaps } from '../components/MapPanel';

export default function ProfileScreen({ goPassport, openTour }) {
  const insets = useSafeAreaInsets();
  const store = useStore();
  const [editing, setEditing] = useState(false);
  const [voice, setV] = useState(getVoice());
  const earned = earnedStamps(store.completed);
  const stampCount = Object.keys(earned).length;
  const km = store.completed.reduce((a, c) => a + (c.km || 0), 0);
  const countries = new Set(Object.keys(earned).map((id) => cityById(TOURS.find((t) => t.id === id).city).country)).size;
  const photoW = (Dimensions.get('window').width - 40 - 12) / 3;

  const nextVoice = () => {
    const vs = getVoices();
    if (!vs.length) return Alert.alert('Voz', 'No encontré voces en español. Descárgalas en Ajustes → Texto a voz.');
    const i = vs.findIndex((v) => voice && v.identifier === voice.identifier);
    const v = vs[(i + 1) % vs.length];
    setVoice(v);
    setV(v);
    store.updateSettings({ voiceId: v.identifier });
    say('Hola, esta es la voz que te va a acompañar en tus recorridos.', { key: 'test' });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 16, paddingBottom: 40 }}
    >
      <ScreenTitle>Perfil</ScreenTitle>

      {/* Tarjeta de perfil */}
      <View style={st.card}>
        <TouchableOpacity style={st.left} onPress={() => setEditing(true)} activeOpacity={0.8}>
          <View style={st.avatar}>
            <Text style={st.avatarText}>{(store.profile.name || 'V').charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={st.name} numberOfLines={1}>
            {store.profile.name}
          </Text>
          <Text style={st.home}>{store.profile.home || 'Toca para editar'}</Text>
        </TouchableOpacity>
        <View style={st.right}>
          <StatRow value={store.completed.length ? new Set(store.completed.map((c) => c.tourId)).size : 0} label="Recorridos" />
          <StatRow value={stampCount} label="Estampillas" />
          <StatRow value={km.toFixed(1).replace('.', ',')} label="Km caminados" />
          <StatRow value={store.heard.length} label="Historias escuchadas" last />
        </View>
      </View>

      {!!store.profile.bio && <Text style={st.bio}>{store.profile.bio}</Text>}

      {/* Estampillas */}
      <View style={st.rowHead}>
        <SectionTitle sub={`${stampCount} de ${TOURS.length} · ${countries} ${countries === 1 ? 'país' : 'países'}`}>
          Mis estampillas
        </SectionTitle>
        <TouchableOpacity onPress={goPassport}>
          <Text style={st.link}>Ver todas</Text>
        </TouchableOpacity>
      </View>
      <HScroll>
        {TOURS.map((t) => {
          const c = cityById(t.city);
          return (
            <TouchableOpacity key={t.id} onPress={() => openTour(t.id)} style={{ alignItems: 'center' }}>
              <Stamp stamp={t.stamp} title={c.name} cc={c.cc} locked={!earned[t.id]} size={100} />
              <Text style={st.stampName} numberOfLines={1}>
                {earned[t.id] ? new Date(earned[t.id].date).toLocaleDateString('es-CL', { month: 'short', year: 'numeric' }) : 'Por descubrir'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </HScroll>

      {/* Fotos */}
      <SectionTitle sub="Tus recuerdos de cada recorrido">Mis fotos</SectionTitle>
      <View style={st.photos}>
        <TouchableOpacity
          style={[st.photo, st.addPhoto, { width: photoW, height: photoW }]}
          onPress={async () => {
            const uri = await pickPhoto();
            if (uri) store.addPhoto(uri);
          }}
        >
          <Icon name="plus" color={C.muted} />
          <Text style={st.addText}>Agregar</Text>
        </TouchableOpacity>
        {store.photos.map((ph) => (
          <TouchableOpacity
            key={ph.id}
            onLongPress={() =>
              Alert.alert('Foto', '¿Eliminar esta foto de Rekio?', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => store.removePhoto(ph.id) },
              ])
            }
          >
            <Image source={{ uri: ph.uri }} style={[st.photo, { width: photoW, height: photoW }]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Ajustes */}
      <SectionTitle>Ajustes</SectionTitle>
      <Setting
        title="Narración automática"
        sub="Cuenta la historia al pasar cerca de un lugar, aunque no estés en un recorrido"
        value={store.settings.auto}
        onChange={(v) => store.updateSettings({ auto: v })}
      />
      <Setting
        title="Indicaciones por voz"
        sub="Te avisa cuándo doblar mientras caminas entre paradas"
        value={store.settings.turnByTurn}
        onChange={(v) => store.updateSettings({ turnByTurn: v })}
      />
      {hasGoogleMaps && (
        <Setting
          title="Mapa de Google"
          sub="Desactívalo para usar el mapa abierto (OpenStreetMap)"
          value={store.settings.mapProvider !== 'osm'}
          onChange={(v) => store.updateSettings({ mapProvider: v ? 'google' : 'osm' })}
        />
      )}
      <TouchableOpacity style={st.setting} onPress={nextVoice}>
        <View style={{ flex: 1 }}>
          <Text style={st.setTitle}>Voz de la guía</Text>
          <Text style={st.setSub}>{voiceLabel(voice)} · toca para probar otra</Text>
        </View>
        <Text style={st.link}>Cambiar</Text>
      </TouchableOpacity>

      <Text style={st.version}>Rekio · versión de prueba · datos guardados en este teléfono</Text>

      <EditProfile visible={editing} onClose={() => setEditing(false)} />
    </ScrollView>
  );
}

const StatRow = ({ value, label, last }) => (
  <View style={[st.statRow, !last && st.statBorder]}>
    <Text style={st.statValue}>{value}</Text>
    <Text style={st.statLabel}>{label}</Text>
  </View>
);

const Setting = ({ title, sub, value, onChange }) => (
  <View style={st.setting}>
    <View style={{ flex: 1, paddingRight: 12 }}>
      <Text style={st.setTitle}>{title}</Text>
      <Text style={st.setSub}>{sub}</Text>
    </View>
    <Switch value={value} onValueChange={onChange} trackColor={{ true: C.brand }} thumbColor="#fff" />
  </View>
);

function EditProfile({ visible, onClose }) {
  const store = useStore();
  const [name, setName] = useState(store.profile.name);
  const [home, setHome] = useState(store.profile.home);
  const [bio, setBio] = useState(store.profile.bio);
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} onShow={() => {
      setName(store.profile.name);
      setHome(store.profile.home);
      setBio(store.profile.bio);
    }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 50 }} keyboardShouldPersistTaps="handled">
        <ScreenTitle>Editar perfil</ScreenTitle>
        <Text style={st.label}>Nombre</Text>
        <TextInput style={st.input} value={name} onChangeText={setName} placeholder="Tu nombre" />
        <Text style={st.label}>¿De dónde eres?</Text>
        <TextInput style={st.input} value={home} onChangeText={setHome} placeholder="Ciudad, país" />
        <Text style={st.label}>Sobre ti</Text>
        <TextInput
          style={[st.input, { height: 110, textAlignVertical: 'top' }]}
          value={bio}
          onChangeText={setBio}
          multiline
          placeholder="Amante de los viajes, la historia…"
        />
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 24 }}>
          <Btn title="Cancelar" kind="ghost" onPress={onClose} style={{ flex: 1 }} />
          <Btn
            title="Guardar"
            onPress={() => {
              store.updateProfile({ name: name.trim() || 'Viajero', home: home.trim(), bio: bio.trim() });
              onClose();
            }}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </Modal>
  );
}

const st = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginTop: 14,
    ...shadow,
  },
  left: { flex: 1.1, alignItems: 'center', justifyContent: 'center', paddingRight: 10 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: C.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 40, fontWeight: '800' },
  name: { fontSize: 24, fontWeight: '800', color: C.text, marginTop: 10 },
  home: { fontSize: 13, color: C.muted, marginTop: 2, textAlign: 'center' },
  right: { flex: 1, justifyContent: 'center' },
  statRow: { paddingVertical: 8 },
  statBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  statValue: { fontSize: 20, fontWeight: '800', color: C.text },
  statLabel: { fontSize: 12, color: C.muted },
  bio: { fontSize: 15, color: '#333', lineHeight: 22, marginTop: 16 },
  rowHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  link: { fontSize: 15, fontWeight: '700', color: C.text, textDecorationLine: 'underline' },
  stampName: { fontSize: 12, color: C.muted, marginTop: 8 },
  photos: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  photo: { borderRadius: 10 },
  addPhoto: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: C.faint,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addText: { fontSize: 12, color: C.muted, fontWeight: '600' },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.line,
  },
  setTitle: { fontSize: 16, fontWeight: '600', color: C.text },
  setSub: { fontSize: 13, color: C.muted, marginTop: 2, lineHeight: 18 },
  version: { fontSize: 12, color: C.faint, textAlign: 'center', marginTop: 30 },
  label: { fontSize: 14, fontWeight: '700', color: C.text, marginTop: 18, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: C.text,
  },
});
