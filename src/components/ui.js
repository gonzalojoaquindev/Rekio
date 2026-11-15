// Piezas de interfaz reutilizables
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import Icon from './Icon';
import PointPhoto from './PointPhoto';
import { C, R, shadow } from '../theme';
import { placeById, tourStats, cityById, fmtDist } from '../geo';
import { tourStatus } from '../hours';

// ── Barra inferior ──
export const TABS = [
  { id: 'explore', label: 'Explora', icon: 'search' },
  { id: 'map', label: 'Mapa', icon: 'map' },
  { id: 'tour', label: 'Recorrido', icon: 'headphones' },
  { id: 'passport', label: 'Pasaporte', icon: 'passport' },
  { id: 'profile', label: 'Perfil', icon: 'user' },
];

export function TabBar({ tab, onChange, activeTour }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[st.tabbar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map((t) => {
        const on = tab === t.id;
        const color = on ? C.brand : C.muted;
        return (
          <TouchableOpacity key={t.id} style={st.tab} onPress={() => onChange(t.id)} activeOpacity={0.7}>
            <View>
              <Icon name={t.icon} color={color} size={25} stroke={on ? 2.3 : 1.8} />
              {t.id === 'tour' && activeTour && <View style={st.dot} />}
            </View>
            <Text style={[st.tabLabel, { color, fontWeight: on ? '700' : '500' }]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Título de pantalla ──
export function ScreenTitle({ children, right }) {
  return (
    <View style={st.titleRow}>
      <Text style={st.screenTitle}>{children}</Text>
      {right}
    </View>
  );
}

export function SectionTitle({ children, sub }) {
  return (
    <View style={{ marginTop: 26, marginBottom: 12 }}>
      <Text style={st.section}>{children}</Text>
      {!!sub && <Text style={st.sectionSub}>{sub}</Text>}
    </View>
  );
}

// ── Botones ──
export function Btn({ title, onPress, kind = 'primary', icon, style, small }) {
  const primary = kind === 'primary';
  const dark = kind === 'dark';
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        st.btn,
        small && st.btnSmall,
        primary && { backgroundColor: C.brand },
        dark && { backgroundColor: C.text },
        kind === 'ghost' && st.btnGhost,
        style,
      ]}
    >
      {icon && <Icon name={icon} size={small ? 16 : 18} color={primary || dark ? '#fff' : C.text} stroke={2.2} />}
      <Text style={[st.btnText, small && { fontSize: 14 }, { color: primary || dark ? '#fff' : C.text }]}>{title}</Text>
    </TouchableOpacity>
  );
}

export function RoundBtn({ icon, onPress, size = 52, primary, label }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={{ alignItems: 'center' }}>
      <View
        style={[
          st.round,
          { width: size, height: size, borderRadius: size / 2 },
          primary ? { backgroundColor: C.brand, borderColor: C.brand } : null,
        ]}
      >
        <Icon name={icon} size={size * 0.42} color={primary ? '#fff' : C.text} stroke={2.2} />
      </View>
      {!!label && <Text style={st.roundLabel}>{label}</Text>}
    </TouchableOpacity>
  );
}

export function Chip({ label, on, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[st.chip, on && st.chipOn]}>
      <Text style={[st.chipText, on && { color: '#fff' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Badge({ label, color = C.text, bg = '#fff' }) {
  return (
    <View style={[st.badge, { backgroundColor: bg }]}>
      <Text style={[st.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

// ── Tarjeta de recorrido (estilo Airbnb) ──
export function TourCard({ tour, onPress, width = 280, done, myStars, now }) {
  const s = tourStats(tour);
  const status = tourStatus(tour, now || new Date());
  const city = cityById(tour.city);
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{ width }}>
      <View>
        <PointPhoto point={placeById(tour.cover)} height={width * 0.95} radius={R.lg} credit={false} />
        <View style={st.cardBadges}>
          {!!tour.badge && <Badge label={tour.badge} />}
          {done && <Badge label="✓ Completado" color="#fff" bg={C.ok} />}
        </View>
      </View>
      <Text style={st.cardTitle} numberOfLines={2}>
        {tour.name}
      </Text>
      <Text style={st.cardMeta}>
        {city.name}, {city.country}
      </Text>
      <Text style={st.cardMeta}>
        {s.stops} paradas · {s.km.toFixed(1).replace('.', ',')} km · {s.durationLabel}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        {status && <View style={{ marginTop: 6 }}><StatusChip chip={status.chip} small /></View>}
        <WhenChips when={tour.when} small />
        {!!myStars && <Text style={[st.cardMeta, { marginTop: 6, color: C.text }]}>★ {myStars} · tu nota</Text>}
      </View>
    </TouchableOpacity>
  );
}

// ── Hora actual que se refresca cada minuto (para los estados abierto/cerrado) ──
export function useNow(ms = 60000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}

const TONES = {
  ok: { bg: '#E8F6EF', fg: '#1B7A4B', dot: '🟢' },
  warn: { bg: '#FFF4E0', fg: '#9A5B00', dot: '🟠' },
  bad: { bg: '#FDECEC', fg: '#B3261E', dot: '🔴' },
  info: { bg: '#EEF3FB', fg: '#2F5597', dot: '🕘' },
};
export function StatusChip({ chip, small }) {
  if (!chip) return null;
  const t = TONES[chip.tone] || TONES.info;
  return (
    <View style={[st.when, small && st.whenSmall, { backgroundColor: t.bg }]}>
      <Text style={[st.whenText, small && { fontSize: 12 }, { color: t.fg }]}>
        {t.dot} {chip.text}
      </Text>
    </View>
  );
}

// ── Mejor momento para ir ──
export const TIME_SLOTS = {
  temprano: { icon: '🌅', label: 'Muy temprano' },
  manana: { icon: '☀️', label: 'Mañana' },
  tarde: { icon: '🌇', label: 'Tarde' },
  noche: { icon: '🌙', label: 'Noche' },
};
export function WhenChips({ when, small }) {
  if (!when) return null;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: small ? 6 : 0 }}>
      {when.slots.map((k) => (
        <View key={k} style={[st.when, small && st.whenSmall]}>
          <Text style={[st.whenText, small && { fontSize: 12 }]}>
            {TIME_SLOTS[k].icon} {small ? 'Mejor: ' : ''}
            {TIME_SLOTS[k].label}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ── Estrellas (0 a 5). Con onChange se pueden tocar ──
export function Stars({ value = 0, size = 18, onChange }) {
  return (
    <View style={{ flexDirection: 'row', gap: size * 0.25 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = (
          <Text style={{ fontSize: size, lineHeight: size * 1.25, color: n <= value ? '#F5A623' : '#D5D5D5' }}>★</Text>
        );
        return onChange ? (
          <TouchableOpacity key={n} hitSlop={6} onPress={() => onChange(n === value ? 0 : n)} accessibilityLabel={`${n} estrellas`}>
            {star}
          </TouchableOpacity>
        ) : (
          <View key={n}>{star}</View>
        );
      })}
    </View>
  );
}

// ── Tarjeta pequeña de lugar ──
export function PlaceCard({ place, onPress, dist, heard }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{ width: 150 }}>
      <PointPhoto point={place} thumb size={150} radius={R.md} />
      <Text style={st.placeName} numberOfLines={2}>
        {heard ? '✓ ' : ''}
        {place.name}
      </Text>
      {dist != null && <Text style={st.cardMeta}>a {fmtDist(dist)}</Text>}
    </TouchableOpacity>
  );
}

export function HScroll({ children }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 16, paddingHorizontal: 20 }}
      style={{ marginHorizontal: -20 }}
    >
      {children}
    </ScrollView>
  );
}

// ── Fotos: cámara o galería ──
export async function pickPhoto() {
  return new Promise((resolve) => {
    Alert.alert('Agregar foto', '¿De dónde quieres tomarla?', [
      {
        text: 'Cámara',
        onPress: async () => {
          const p = await ImagePicker.requestCameraPermissionsAsync();
          if (!p.granted) return resolve(null);
          const r = await ImagePicker.launchCameraAsync({ quality: 0.7 });
          resolve(r.canceled ? null : r.assets[0].uri);
        },
      },
      {
        text: 'Galería',
        onPress: async () => {
          const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
          resolve(r.canceled ? null : r.assets[0].uri);
        },
      },
      { text: 'Cancelar', style: 'cancel', onPress: () => resolve(null) },
    ]);
  });
}

const st = StyleSheet.create({
  tabbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
    paddingTop: 8,
  },
  tab: { flex: 1, alignItems: 'center', gap: 3 },
  tabLabel: { fontSize: 11 },
  dot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: C.brand,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  screenTitle: { fontSize: 32, fontWeight: '800', color: C.text, letterSpacing: -0.5 },
  section: { fontSize: 21, fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  sectionSub: { fontSize: 14, color: C.muted, marginTop: 3 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  btnSmall: { paddingVertical: 9, paddingHorizontal: 13, borderRadius: 10 },
  btnGhost: { backgroundColor: '#fff', borderWidth: 1, borderColor: C.text },
  btnText: { fontSize: 16, fontWeight: '700' },
  round: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
    shadowOpacity: 0.08,
  },
  roundLabel: { fontSize: 11, color: C.muted, marginTop: 5, fontWeight: '600' },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: R.pill,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: '#fff',
  },
  chipOn: { backgroundColor: C.text, borderColor: C.text },
  chipText: { fontSize: 14, fontWeight: '600', color: C.text },
  badge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: R.pill, ...shadow, shadowOpacity: 0.1 },
  badgeText: { fontSize: 13, fontWeight: '700' },
  cardBadges: { position: 'absolute', top: 12, left: 12, gap: 6, alignItems: 'flex-start' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: C.text, marginTop: 10 },
  cardMeta: { fontSize: 14, color: C.muted, marginTop: 2 },
  when: { backgroundColor: '#F2F0FF', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  whenSmall: { paddingHorizontal: 9, paddingVertical: 3 },
  whenText: { fontSize: 14, fontWeight: '700', color: '#4B3FA8' },
  placeName: { fontSize: 14, fontWeight: '600', color: C.text, marginTop: 8 },
});
