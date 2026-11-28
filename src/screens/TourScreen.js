import { feeText } from '../money';
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapPanel from '../components/MapPanel';
import PointPhoto from '../components/PointPhoto';
import Stamp from '../components/Stamp';
import Icon from '../components/Icon';
import { Btn, RoundBtn, ScreenTitle, TourCard, pickPhoto, Stars } from '../components/ui';
import { C, R, shadow } from '../theme';
import { TOURS } from '../data/tours';
import { placeById, fmtDist, cityById, distanceM, unitOf } from '../geo';
import { fetchTourRoute } from '../nav';
import { tourById, useTour, stopAt } from '../tour';
import { useStore } from '../store';
import MyDay from '../components/MyDay';
import { TermChips } from '../components/Glossary';
import AskSheet from '../components/AskSheet';
import { serverUrlFor } from '../ask';
import { nextInDay, resolveDay, dayLabel } from '../day';
import { tripPlanForToday } from '../trips';

const routeCache = {};

export default function TourScreen({ openPlace, openTour, goPassport }) {
  const insets = useSafeAreaInsets();
  const t = useTour();
  const store = useStore();
  const [route, setRoute] = useState(null);
  const [asking, setAsking] = useState(false);
  const tour = t.tour;
  const def = tour ? tourById(tour.id) : null;

  const orderKey = tour && tour.order ? tour.order.join(',') : '';
  const routeKey = def ? `${def.id}:${orderKey}` : '';
  useEffect(() => {
    if (!def) return;
    if (routeCache[routeKey]) return setRoute(routeCache[routeKey]);
    setRoute(null);
    const ordered = (tour.order || def.stops.map((_, i) => i)).map((i) => placeById(def.stops[i].id));
    fetchTourRoute(ordered)
      .then((line) => {
        if (line) {
          routeCache[routeKey] = line;
          setRoute(line);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  const points = useMemo(() => {
    if (!def) return [];
    const order = tour.order || def.stops.map((_, i) => i);
    return order.map((si, pos) => {
      const st = def.stops[si];
      const p = placeById(st.id);
      return {
        id: p.id,
        name: p.name,
        lat: p.lat,
        lng: p.lng,
        label: String(pos + 1),
        kind: st.optional ? 'optional' : 'must',
        state: tour.phase === 'done' || pos < tour.idx ? 'done' : pos === tour.idx ? 'now' : 'todo',
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [def, orderKey, tour && tour.idx, tour && tour.phase]);

  // ── Sin recorrido activo ──
  if (!tour) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: C.bg }}
        contentContainerStyle={{ padding: 20, paddingTop: insets.top + 16, paddingBottom: 30 }}
      >
        <ScreenTitle>Recorrido</ScreenTitle>
        {(() => {
          const ad = store.settings.activeDay;
          const active = ad ? resolveDay(`trip:${ad.tripId}:${ad.date}`, store.trips) : null;
          return (
            <>
              <MyDay openTour={openTour} openPlace={openPlace} itin={active || tripPlanForToday(store.trips) || undefined} />
              {!!active && (
                <TouchableOpacity onPress={() => store.updateSettings({ activeDay: null })} style={{ marginTop: -12, marginBottom: 20 }}>
                  <Text style={st.tipLink}>Dejar de seguir este día</Text>
                </TouchableOpacity>
              )}
            </>
          );
        })()}
        <View style={st.emptyBox}>
          <Icon name="headphones" size={40} color={C.brand} />
          <Text style={st.emptyTitle}>No tienes un recorrido activo</Text>
          <Text style={st.emptyText}>
            Elige un recorrido, ponte los audífonos y camina: te guío parada por parada y te cuento la historia de
            cada lugar.
          </Text>
        </View>
        <Text style={st.pickTitle}>Elige uno para empezar</Text>
        <View style={{ gap: 26 }}>
          {TOURS.map((tt) => (
            <TourCard key={tt.id} tour={tt} width={Dimensions.get('window').width - 40} onPress={() => openTour(tt.id)} />
          ))}
        </View>
      </ScrollView>
    );
  }

  const stop = stopAt(tour, tour.idx);
  const p = placeById(stop.id);
  const city = cityById(def.city);
  const done = tour.phase === 'done';
  const storyPlaying = t.speaking === `place:${p.id}`;
  const dist = t.here ? distanceM(t.here, p) : null;
  const legLine = t.leg && t.leg.idx === tour.idx ? t.leg.line : null;

  const status = done
    ? '¡Recorrido completado!'
    : tour.phase === 'guiding'
    ? 'Escucha las indicaciones…'
    : tour.phase === 'going'
    ? dist != null
      ? `A ${fmtDist(dist)} de la parada`
      : 'Buscando tu ubicación…'
    : storyPlaying
    ? 'Escuchando la historia'
    : 'Historia en pausa';

  const openMaps = () =>
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=walking`);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flex: 1 }}>
        <MapPanel
          flex
          rounded={false}
          points={points}
          route={route}
          leg={legLine}
          me={t.here}
          focus={done ? null : p}
          fitKey={def.id}
          onTapPoint={openPlace}
          controlsTop={insets.top + 70}
        />
        {/* Barra superior */}
        <View style={[st.top, { top: insets.top + 10 }]}>
          <View style={st.topPill}>
            <Text style={st.topTitle} numberOfLines={1}>
              {def.name}
            </Text>
            <Text style={st.topSub}>
              {tour.simulate ? 'Simulación · ' : ''}
              {done ? 'Completado' : `${unitOf(def).one} ${tour.idx + 1} de ${def.stops.length}`}
            </Text>
          </View>
          <TouchableOpacity style={st.endBtn} onPress={t.endTour}>
            <Text style={st.endText}>Terminar</Text>
          </TouchableOpacity>
        </View>
        {/* Indicación giro a giro */}
        {!done && tour.phase === 'going' && t.navMsg && (
          <View style={[st.nav, { top: insets.top + 74 }]}>
            <Text style={st.navArrow}>{t.navMsg.arrow}</Text>
            <View style={{ flex: 1 }}>
              <Text style={st.navDist}>{fmtDist(t.navMsg.dist)}</Text>
              <Text style={st.navText} numberOfLines={2}>
                {t.navMsg.text}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Tarjeta inferior */}
      <View style={st.panel}>
        {done ? (
          <View style={{ alignItems: 'center', paddingVertical: 6 }}>
            <Stamp stamp={def.stamp} title={city.name} cc={city.cc} size={110} />
            <Text style={st.doneTitle}>¡Ganaste una estampilla!</Text>
            <Text style={st.doneText}>Ya está en tu pasaporte. ¿Qué te pareció?</Text>
            <View style={{ marginTop: 10 }}>
              <Stars value={((store.reviews || {})[def.id] || {}).stars || 0} size={30} onChange={(n) => store.setReview(def.id, { stars: n })} />
            </View>
            <TouchableOpacity onPress={() => openTour(def.id)}>
              <Text style={st.tipLink}>Escribir un tip para otros viajeros</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 14 }}>
              {(() => {
                const nx = nextInDay(def.id, tour.dayId, { trips: store.trips, toursOnly: tour.simulate });
                if (!nx) return null;
                if (nx.nextDay) {
                  const dl = dayLabel({ date: nx.nextDay.date });
                  return (
                    <Btn
                      title={`Siguiente día: día ${nx.nextDay.number} (${dl})`}
                      small
                      onPress={() => {
                        store.updateSettings({ activeDay: { tripId: nx.nextDay.tripId, date: nx.nextDay.date } });
                        t.endTour();
                      }}
                    />
                  );
                }
                return (
                  <Btn
                    title={`Siguiente: ${nx.label} (${nx.item.start})`}
                    small
                    onPress={() =>
                      nx.placeId
                        ? (t.endTour(), openPlace(nx.placeId))
                        : tour.simulate
                        ? t.startTour(nx.tour.id, true, 'original', { dayId: nx.itin.id })
                        : (t.endTour(), openTour(nx.tour.id))
                    }
                  />
                );
              })()}
              <Btn title="Ver pasaporte" onPress={goPassport} small />
              <Btn title="Cerrar recorrido" kind="ghost" onPress={t.endTour} small />
            </View>
          </View>
        ) : (
          <>
            <TouchableOpacity style={st.stopRow} onPress={() => openPlace(p.id)} activeOpacity={0.8}>
              <PointPhoto point={p} thumb size={64} radius={12} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={st.kind}>{stop.optional ? 'PARADA OPCIONAL' : '⭐ IMPERDIBLE'}</Text>
                <Text style={st.stopName} numberOfLines={1}>
                  {p.name}
                </Text>
                <Text style={st.status}>
                  {status}
                  {p.fee ? `  ·  🎫 ${feeText(p.fee)}${p.fee.cash ? ' efectivo' : ''}` : ''}
                </Text>
              </View>
              <Text style={st.more}>Ficha ›</Text>
            </TouchableOpacity>

            <TermChips text={p.story} city={p.city} label={`En ${def.unit === 'capitulo' ? 'este capítulo' : 'esta parada'}`} />

            {!!serverUrlFor(store.settings) && (
              <TouchableOpacity style={st.askBtn} onPress={() => setAsking(true)} accessibilityLabel="Hacer una pregunta">
                <Text style={st.askTxt}>🎙 Preguntar sobre {def.unit === 'capitulo' ? 'este capítulo' : 'esta parada'}</Text>
              </TouchableOpacity>
            )}
            <AskSheet visible={asking} onClose={() => setAsking(false)} tour={{ name: def.name, city: cityById(def.city).name }} chapter={p} />

            <View style={st.controls}>
              <RoundBtn icon="prev" label="Anterior" onPress={() => t.goToStop(tour.idx - 1)} />
              <RoundBtn icon="replay" label="Repetir" onPress={t.repeatStep} />
              <RoundBtn
                icon={t.speaking ? 'stop' : 'play'}
                primary
                size={64}
                label={t.speaking ? 'Pausar' : 'Escuchar'}
                onPress={() => (t.speaking ? t.stop() : tour.phase === 'story' ? t.repeatStep() : t.playPlace(p.id))}
              />
              <RoundBtn
                icon="next"
                label={tour.phase === 'story' ? 'Siguiente' : 'Ya llegué'}
                onPress={t.skipStep}
              />
              <RoundBtn
                icon="camera"
                label="Foto"
                onPress={async () => {
                  const uri = await pickPhoto();
                  if (uri) store.addPhoto(uri, { tourId: def.id, placeId: p.id });
                }}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
              {tour.phase !== 'story' && (
                <Btn title="Cómo llegar" icon="walk" kind="ghost" small onPress={openMaps} style={{ flex: 1 }} />
              )}
              {stop.optional && tour.phase !== 'story' && (
                <Btn
                  title="Saltar parada"
                  kind="ghost"
                  small
                  onPress={() => t.goToStop(tour.idx + 1)}
                  style={{ flex: 1 }}
                />
              )}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  askBtn: { marginTop: 12, borderRadius: 999, borderWidth: 1.5, borderColor: C.brand, paddingVertical: 11, alignItems: 'center' },
  askTxt: { color: C.brand, fontWeight: '800', fontSize: 15 },
  emptyBox: { alignItems: 'center', padding: 26, borderRadius: R.lg, backgroundColor: C.surface, marginTop: 14 },
  emptyTitle: { fontSize: 19, fontWeight: '800', color: C.text, marginTop: 12 },
  emptyText: { fontSize: 15, color: C.muted, textAlign: 'center', marginTop: 8, lineHeight: 22 },
  pickTitle: { fontSize: 21, fontWeight: '800', color: C.text, marginTop: 28, marginBottom: 14 },
  top: { position: 'absolute', left: 12, right: 12, flexDirection: 'row', gap: 8, alignItems: 'center' },
  topPill: { flex: 1, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 9, paddingHorizontal: 14, ...shadow },
  topTitle: { fontSize: 15, fontWeight: '800', color: C.text },
  topSub: { fontSize: 12, color: C.muted, marginTop: 1 },
  endBtn: { backgroundColor: '#fff', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 14, ...shadow },
  endText: { fontSize: 13, fontWeight: '800', color: C.brand },
  nav: {
    position: 'absolute',
    left: 12,
    right: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1A73E8',
    borderRadius: 16,
    padding: 12,
    ...shadow,
  },
  navArrow: { fontSize: 34, color: '#fff', fontWeight: '800', width: 40, textAlign: 'center' },
  navDist: { fontSize: 20, color: '#fff', fontWeight: '800' },
  navText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  panel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
    ...shadow,
  },
  stopRow: { flexDirection: 'row', alignItems: 'center' },
  kind: { fontSize: 11, fontWeight: '800', color: C.brand, letterSpacing: 0.6 },
  stopName: { fontSize: 18, fontWeight: '800', color: C.text, marginTop: 2 },
  status: { fontSize: 14, color: C.muted, marginTop: 2 },
  more: { fontSize: 14, fontWeight: '700', color: C.text },
  controls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 18, marginBottom: 10 },
  doneTitle: { fontSize: 20, fontWeight: '800', color: C.text, marginTop: 14 },
  doneText: { fontSize: 14, color: C.muted, marginTop: 4 },
  tipLink: { marginTop: 8, fontSize: 14, fontWeight: '700', color: C.brand, textDecorationLine: 'underline' },
});
