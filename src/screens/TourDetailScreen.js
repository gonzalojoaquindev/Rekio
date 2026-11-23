import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PointPhoto from '../components/PointPhoto';
import MapPanel from '../components/MapPanel';
import Stamp from '../components/Stamp';
import Icon from '../components/Icon';
import AudioBox from '../components/AudioBox';
import { Btn, SectionTitle, pickPhoto, WhenChips, Stars, StatusChip, useNow } from '../components/ui';
import { tourStatus } from '../hours';
import { LinkedText } from '../components/Glossary';
import { C, R, shadow } from '../theme';
import { placeById, tourStats, cityById, distanceM, fmtDist, unitOf } from '../geo';
import { fetchTourRoute } from '../nav';
import { tourById, useTour, buildOrder } from '../tour';
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
  const now = useNow();
  const status = tourStatus(tour, now, { from: t.here });

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

  const go = (simulate, mode) => {
    t.startTour(tour.id, simulate, mode);
    onStart();
  };

  // Antes de comenzar: avisa si algo está cerrado hoy o si no alcanzarías a llegar
  const start = (simulate) => {
    // ¿Quedó a medias? Ofrecer continuar donde quedaste
    const prog = !simulate && (store.progress || {})[tour.id];
    if (prog && prog.pos > 0) {
      const u = unitOf(tour);
      const nextStop = placeById(tour.stops[prog.order ? prog.order[prog.pos] : prog.pos].id);
      Alert.alert(
        '¿Continuar donde quedaste?',
        `Te quedaste en ${u.one.toLowerCase()} ${prog.pos + 1} de ${tour.stops.length}: ${nextStop.name}.`,
        [
          { text: 'Desde el inicio', onPress: () => { store.setProgress(tour.id, null); checkAndStart(false); } },
          { text: 'Continuar', onPress: () => { t.startTour(tour.id, false, 'original', { resume: prog }); onStart(); } },
        ],
        { cancelable: true }
      );
      return;
    }
    checkAndStart(simulate);
  };

  const checkAndStart = (simulate) => {
    const st0 = simulate ? null : tourStatus(tour, new Date(), { from: t.here });
    if (!st0 || !st0.issues.length) return chooseOrder(simulate);
    Alert.alert(
      st0.blocking ? 'No te recomiendo ir ahora' : 'Un aviso antes de empezar',
      `${st0.message}\n\nHorarios de referencia: pueden cambiar por ceremonias o eventos.`,
      st0.blocking
        ? [
            { text: 'Ver otros recorridos', onPress: onBack, style: 'cancel' },
            { text: 'Ir igual', onPress: () => chooseOrder(false) },
          ]
        : [{ text: 'Comenzar', onPress: () => chooseOrder(false) }],
      { cancelable: true }
    );
  };

  // Si estás lejos de la primera parada, pregunta por dónde empezar
  const chooseOrder = (simulate) => {
    if (simulate || !t.here) return go(simulate, 'original');
    const first = stops[0].p;
    const d0 = distanceM(t.here, first);
    const near = buildOrder(tour, 'nearest', t.here);
    const nearP = placeById(tour.stops[near[0]].id);
    if (d0 < 400 || near[0] === 0) return go(false, 'original');
    Alert.alert(
      '¿Por dónde empiezas?',
      `Estás a ${fmtDist(d0)} de la primera parada (${first.name}). Puedo ordenar el recorrido para que camines menos.`,
      [
        { text: 'Al revés', onPress: () => go(false, 'reverse') },
        { text: 'Orden original', onPress: () => go(false, 'original') },
        { text: `Desde aquí (${nearP.name})`, onPress: () => go(false, 'nearest') },
      ],
      { cancelable: true }
    );
  };

  // Solo las entradas que se pagan en efectivo cuentan para "lleva efectivo"
  const cashOf = (list) => list.reduce((a, x) => a + ((x.p.fee && x.p.fee.cash && x.p.fee.yen) || 0), 0);
  const feeMust = cashOf(must);
  const feeOpt = cashOf(optional);
  const cardFees = stops.filter((x) => x.p.fee && !x.p.fee.cash);
  const yen = (n) => `¥${n.toLocaleString('es-CL')}`;

  const StopRow = ({ x }) => (
    <TouchableOpacity style={st.stopRow} onPress={() => openPlace(x.p.id)} activeOpacity={0.8}>
      <PointPhoto point={x.p} thumb size={72} radius={12} />
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={st.stopName}>
          {x.i + 1}. {x.p.name}
        </Text>
        {!!x.p.short && <Text style={st.stopShort}>{x.p.short}</Text>}
        {!!x.p.fee && (
          <Text style={st.stopFee}>
            🎫 {yen(x.p.fee.yen)}
            {x.p.fee.cash ? ' · efectivo' : ''}
          </Text>
        )}
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
            <Stat icon="pin" value={String(s.stops)} label={unitOf(tour).many} />
            <Stat icon="star" value={String(s.must)} label="imperdibles" />
          </View>

          <View style={[st.cash, feeMust + feeOpt === 0 && { backgroundColor: '#E8F6EF' }]}>
            <Text style={st.cashTitle}>
              {feeMust + feeOpt === 0
                ? cardFees.length
                  ? '💳 Sin entradas en efectivo'
                  : '🆓 Sin entradas pagadas'
                : `💴 Lleva efectivo: unos ${yen(feeMust + feeOpt)} por persona`}
            </Text>
            {feeMust + feeOpt > 0 && (
              <Text style={st.cashText}>
                {yen(feeMust)} en paradas imperdibles{feeOpt ? ` + ${yen(feeOpt)} en opcionales` : ''}. Muchos templos
                solo aceptan efectivo. Precios de referencia (nov. 2026).
              </Text>
            )}
            {cardFees.map((x) => (
              <Text key={x.p.id} style={st.cashText}>
                {x.optional ? 'Opcional: ' : ''}
                {x.p.name} desde {yen(x.p.fee.yen)}, con tarjeta.
              </Text>
            ))}
          </View>

          <AudioBox tourId={tour.id} />

          {!!status && (
            <View style={st.statusBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={st.whenTitle}>Hoy</Text>
                <StatusChip chip={status.chip} />
              </View>
              {!!status.message && <Text style={st.cashText}>{status.message}</Text>}
            </View>
          )}

          {!!tour.when && (
            <View style={st.whenBox}>
              <Text style={st.whenTitle}>Mejor momento para ir</Text>
              <WhenChips when={tour.when} />
              <Text style={st.cashText}>{tour.when.note}</Text>
            </View>
          )}

          <LinkedText style={st.desc}>{tour.description}</LinkedText>

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

          <SectionTitle sub="Por ahora se guarda solo en tu teléfono">Tu opinión</SectionTitle>
          <ReviewBox tourId={tour.id} />

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

// Calificación con estrellas y un tip para otros viajeros
function ReviewBox({ tourId }) {
  const store = useStore();
  const saved = (store.reviews || {})[tourId] || { stars: 0, text: '' };
  const [text, setText] = useState(saved.text || '');
  const [editing, setEditing] = useState(!saved.text);
  const LABELS = ['Toca para calificar', 'No me gustó', 'Regular', 'Bueno', 'Muy bueno', '¡Imperdible!'];
  return (
    <View style={st.review}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Stars value={saved.stars} size={30} onChange={(n) => store.setReview(tourId, { stars: n })} />
        <Text style={st.reviewLabel}>{LABELS[saved.stars]}</Text>
      </View>
      {editing ? (
        <>
          <TextInput
            style={st.reviewInput}
            value={text}
            onChangeText={setText}
            placeholder="Tu opinión o un tip, por ejemplo: «Ve lo más temprano posible, después se llena»"
            placeholderTextColor={C.muted}
            multiline
            maxLength={500}
          />
          <Btn
            title="Guardar"
            small
            onPress={() => {
              store.setReview(tourId, { text: text.trim() });
              setEditing(!text.trim());
            }}
            style={{ alignSelf: 'flex-start', marginTop: 10 }}
          />
        </>
      ) : (
        <TouchableOpacity onPress={() => setEditing(true)} activeOpacity={0.7}>
          <Text style={st.reviewText}>💡 {saved.text}</Text>
          <Text style={st.reviewEdit}>Editar</Text>
        </TouchableOpacity>
      )}
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
  statusBox: { marginTop: 14, padding: 14, borderRadius: R.md, borderWidth: 1, borderColor: C.line, gap: 8 },
  whenBox: { marginTop: 14, padding: 14, borderRadius: R.md, backgroundColor: '#F7F6FF', gap: 8 },
  whenTitle: { fontSize: 15, fontWeight: '800', color: C.text },
  review: { padding: 16, borderRadius: R.md, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff' },
  reviewLabel: { fontSize: 15, fontWeight: '700', color: C.text },
  reviewInput: { marginTop: 12, minHeight: 80, borderWidth: 1, borderColor: '#DDDDDD', borderRadius: 12, padding: 12, fontSize: 15, color: C.text, textAlignVertical: 'top' },
  reviewText: { marginTop: 12, fontSize: 15, lineHeight: 21, color: C.text },
  reviewEdit: { marginTop: 6, fontSize: 14, fontWeight: '700', color: C.brand, textDecorationLine: 'underline' },
  cash: { marginTop: 18, padding: 14, borderRadius: R.md, backgroundColor: '#FFF7E6' },
  cashTitle: { fontSize: 15, fontWeight: '800', color: C.text },
  cashText: { fontSize: 13, color: C.muted, marginTop: 4, lineHeight: 18 },
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
  stopFee: { fontSize: 13, color: '#B7791F', fontWeight: '700', marginTop: 3 },
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
