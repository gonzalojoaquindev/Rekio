// Mis viajes: planificar meses antes. Crear un viaje, marcar lugares y recorridos que te tincan y armar los días.
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Share, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenTitle, Btn, Chip, StatusChip } from '../components/ui';
import PointPhoto from '../components/PointPhoto';
import MyDay from '../components/MyDay';
import { C, R, shadow } from '../theme';
import { CITIES, TOURS } from '../data/tours';
import { PLACES } from '../data/places';
import { cityById, tourStats, unitOf } from '../geo';
import { useStore } from '../store';
import { DAY_NAMES } from '../hours';
import {
  tripDates, addDays, isSaved, toggleSaved, tourSuggestions, coveredPlaces, autoPlan, dayPlan, dayWarnings, tripShareText,
} from '../trips';

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const fmtDate = (ymd) => {
  const d = new Date(`${ymd}T12:00:00Z`);
  return `${DAY_NAMES[d.getUTCDay()].slice(0, 3)} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
};
const todayYmd = () => new Date().toISOString().slice(0, 10);
const tourById = (id) => TOURS.find((t) => t.id === id);
const placeById = (id) => PLACES.find((p) => p.id === id);
const nameOf = (it) => (it.kind === 'tour' ? tourById(it.id).name : placeById(it.id).name);

export default function TripsScreen({ openTour, openPlace, tripId, setTripId }) {
  const insets = useSafeAreaInsets();
  const store = useStore();
  const trips = store.trips || [];
  const [localId, setLocalId] = useState(null);
  // El viaje abierto vive en App para no perderlo al entrar a la ficha de un recorrido
  const openId = setTripId ? tripId : localId;
  const setOpenId = setTripId || setLocalId;
  const [creating, setCreating] = useState(false);
  const trip = trips.find((t) => t.id === openId);

  if (trip) return <TripDetail trip={trip} onBack={() => setOpenId(null)} openTour={openTour} openPlace={openPlace} />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 20, paddingTop: insets.top + 16, paddingBottom: 40 }}>
      <ScreenTitle>Mis viajes</ScreenTitle>
      <Text style={st.sub}>Planifica antes de llegar: marca lo que te tinca y arma tus días.</Text>

      {trips.map((t) => {
        const days = Object.values(t.days || {}).filter((x) => x.length).length;
        return (
          <TouchableOpacity key={t.id} style={st.tripCard} onPress={() => setOpenId(t.id)} activeOpacity={0.85}>
            <Text style={st.tripName}>🧳 {t.name}</Text>
            <Text style={st.tripMeta}>
              {(t.cities || []).map((c) => cityById(c).name).join(' · ')} · {fmtDate(t.start)} → {fmtDate(t.end)}
            </Text>
            <Text style={st.tripMeta}>
              ❤️ {(t.saved || []).length} guardados · 📅 {days} de {tripDates(t).length} días planificados
            </Text>
          </TouchableOpacity>
        );
      })}

      {!trips.length && (
        <View style={st.empty}>
          <Text style={st.emptyIcon}>🗺️</Text>
          <Text style={st.emptyTitle}>¿A dónde viajas?</Text>
          <Text style={st.emptyText}>
            Crea un viaje con sus ciudades y fechas. Después recorre lo que hay en cada ciudad, marca con ❤️ lo que te
            tinca y la app te ayuda a repartirlo en los días, avisándote si algo está cerrado.
          </Text>
        </View>
      )}

      <Btn title="+ Nuevo viaje" onPress={() => setCreating(true)} style={{ marginTop: 16 }} />
      <NewTrip
        visible={creating}
        onClose={() => setCreating(false)}
        onCreate={(t) => {
          const id = store.createTrip(t);
          setCreating(false);
          setOpenId(id);
        }}
      />
    </ScrollView>
  );
}

// ── Crear viaje ──
function NewTrip({ visible, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [cities, setCities] = useState([]);
  const [start, setStart] = useState(addDays(todayYmd(), 30));
  const [nDays, setNDays] = useState(7);
  const toggle = (id) => setCities((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 48 }}>
        <View style={st.headRow}>
          <Text style={st.modalTitle}>Nuevo viaje</Text>
          <TouchableOpacity onPress={onClose} hitSlop={10}>
            <Text style={st.link}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        <Text style={st.label}>Nombre</Text>
        <TextInput style={st.input} value={name} onChangeText={setName} placeholder="Ej: Japón con mi pareja" placeholderTextColor={C.muted} />

        <Text style={st.label}>Ciudades</Text>
        <View style={st.wrapRow}>
          {CITIES.map((c) => (
            <Chip key={c.id} label={`${c.name} · ${c.country}`} on={cities.includes(c.id)} onPress={() => toggle(c.id)} />
          ))}
        </View>
        <Text style={st.hint}>Por ahora Rekio tiene recorridos en estas ciudades. Vamos sumando más.</Text>

        <Text style={st.label}>Llegada</Text>
        <View style={st.stepRow}>
          <TouchableOpacity style={st.stepBtn} onPress={() => setStart(addDays(start, -7))}><Text style={st.stepTxt}>−7</Text></TouchableOpacity>
          <TouchableOpacity style={st.stepBtn} onPress={() => setStart(addDays(start, -1))}><Text style={st.stepTxt}>−1</Text></TouchableOpacity>
          <Text style={st.stepVal}>{fmtDate(start)} {start.slice(0, 4)}</Text>
          <TouchableOpacity style={st.stepBtn} onPress={() => setStart(addDays(start, 1))}><Text style={st.stepTxt}>+1</Text></TouchableOpacity>
          <TouchableOpacity style={st.stepBtn} onPress={() => setStart(addDays(start, 7))}><Text style={st.stepTxt}>+7</Text></TouchableOpacity>
        </View>

        <Text style={st.label}>Días</Text>
        <View style={st.stepRow}>
          <TouchableOpacity style={st.stepBtn} onPress={() => setNDays(Math.max(1, nDays - 1))}><Text style={st.stepTxt}>−</Text></TouchableOpacity>
          <Text style={st.stepVal}>{nDays} {nDays === 1 ? 'día' : 'días'} · hasta el {fmtDate(addDays(start, nDays - 1))}</Text>
          <TouchableOpacity style={st.stepBtn} onPress={() => setNDays(Math.min(45, nDays + 1))}><Text style={st.stepTxt}>+</Text></TouchableOpacity>
        </View>

        <Btn
          title="Crear viaje"
          onPress={() => {
            if (!cities.length) return Alert.alert('Elige al menos una ciudad');
            onCreate({
              name: name.trim() || `Viaje a ${cities.map((c) => cityById(c).name).join(' y ')}`,
              cities,
              start,
              end: addDays(start, nDays - 1),
            });
            setName('');
            setCities([]);
          }}
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </Modal>
  );
}

// ── Detalle de un viaje ──
function TripDetail({ trip, onBack, openTour, openPlace }) {
  const insets = useSafeAreaInsets();
  const store = useStore();
  const [seg, setSeg] = useState('discover');
  const update = (patch) => store.updateTrip(trip.id, patch);
  const toggle = (kind, id) => update((t) => toggleSaved(t, kind, id));

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={[st.detailHead, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={onBack} hitSlop={10}>
          <Text style={st.link}>‹ Mis viajes</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity onPress={() => Share.share({ message: tripShareText(trip) })} hitSlop={10}>
            <Text style={st.link}>Compartir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            hitSlop={10}
            onPress={() =>
              Alert.alert('¿Eliminar este viaje?', 'Se borran sus guardados y días planificados.', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', style: 'destructive', onPress: () => { onBack(); store.deleteTrip(trip.id); } },
              ])
            }
          >
            <Text style={[st.link, { color: '#B3261E' }]}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={st.modalTitle}>{trip.name}</Text>
        <Text style={st.tripMeta}>
          {(trip.cities || []).map((c) => cityById(c).name).join(' · ')} · {fmtDate(trip.start)} → {fmtDate(trip.end)} · {tripDates(trip).length} días
        </Text>
        <View style={st.segRow}>
          {[
            ['discover', 'Descubrir'],
            ['saved', `Guardados (${(trip.saved || []).length})`],
            ['days', 'Días'],
          ].map(([k, label]) => (
            <TouchableOpacity key={k} style={[st.seg, seg === k && st.segOn]} onPress={() => setSeg(k)}>
              <Text style={[st.segTxt, seg === k && st.segTxtOn]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 12, paddingBottom: 60 }}>
        {seg === 'discover' && <Discover trip={trip} toggle={toggle} openTour={openTour} openPlace={openPlace} />}
        {seg === 'saved' && <Saved trip={trip} toggle={toggle} openTour={openTour} openPlace={openPlace} goDays={() => setSeg('days')} />}
        {seg === 'days' && <Days trip={trip} update={update} openTour={openTour} openPlace={openPlace} />}
      </ScrollView>
    </View>
  );
}

const Heart = ({ on, onPress }) => (
  <TouchableOpacity onPress={onPress} hitSlop={12} accessibilityLabel={on ? 'Quitar de guardados' : 'Guardar'} style={st.heart}>
    <Text style={{ fontSize: 22 }}>{on ? '❤️' : '🤍'}</Text>
  </TouchableOpacity>
);

function Row({ kind, id, trip, toggle, openTour, openPlace, note }) {
  const isTour = kind === 'tour';
  const t = isTour ? tourById(id) : null;
  const p = isTour ? placeById(t.cover) : placeById(id);
  const s = isTour ? tourStats(t) : null;
  return (
    <TouchableOpacity style={st.row} activeOpacity={0.85} onPress={() => (isTour ? openTour(id) : openPlace(id))}>
      <PointPhoto point={p} thumb size={64} radius={12} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={st.rowKind}>{isTour ? `🎧 RECORRIDO · ${s.stops} ${unitOf(t).many} · ${s.durationLabel}` : '📍 LUGAR'}</Text>
        <Text style={st.rowName} numberOfLines={2}>{isTour ? t.name : p.name}</Text>
        {!!(isTour ? t.description : p.short) && <Text style={st.rowShort} numberOfLines={2}>{isTour ? t.description : p.short}</Text>}
        {!!note && <Text style={st.rowNote}>{note}</Text>}
      </View>
      <Heart on={isSaved(trip, kind, id)} onPress={() => toggle(kind, id)} />
    </TouchableOpacity>
  );
}

function Discover({ trip, toggle, openTour, openPlace }) {
  const [city, setCity] = useState((trip.cities || [])[0] || CITIES[0].id);
  const [q, setQ] = useState('');
  const norm = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const tours = TOURS.filter((t) => t.city === city && (!q || norm(`${t.name} ${t.description}`).includes(norm(q))));
  const places = PLACES.filter((p) => p.city === city && (!q || norm(`${p.name} ${p.jp} ${p.short}`).includes(norm(q))));
  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {[...(trip.cities || []), ...CITIES.map((c) => c.id).filter((c) => !(trip.cities || []).includes(c))].map((c) => (
          <Chip key={c} label={cityById(c).name} on={city === c} onPress={() => setCity(c)} />
        ))}
      </ScrollView>
      <TextInput style={[st.input, { marginTop: 12 }]} value={q} onChangeText={setQ} placeholder={`Buscar en ${cityById(city).name}…`} placeholderTextColor={C.muted} />
      <Text style={st.section}>Recorridos en {cityById(city).name}</Text>
      {tours.map((t) => <Row key={t.id} kind="tour" id={t.id} trip={trip} toggle={toggle} openTour={openTour} openPlace={openPlace} />)}
      <Text style={st.section}>Lugares en {cityById(city).name}</Text>
      {places.map((p) => <Row key={p.id} kind="place" id={p.id} trip={trip} toggle={toggle} openTour={openTour} openPlace={openPlace} />)}
    </>
  );
}

function Saved({ trip, toggle, openTour, openPlace, goDays }) {
  const sugg = tourSuggestions(trip);
  const covered = coveredPlaces(trip);
  const saved = trip.saved || [];
  if (!saved.length)
    return <Text style={st.emptyText}>Todavía no guardas nada. En «Descubrir», toca el 🤍 de los lugares y recorridos que te tincan.</Text>;
  return (
    <>
      {sugg.slice(0, 3).map(({ tour, hits }) => (
        <View key={tour.id} style={st.sugg}>
          <Text style={st.suggText}>
            💡 {hits.length === 1 ? '1 de tus lugares está' : `${hits.length} de tus lugares están`} en el recorrido «{tour.name}», con {tour.stops.length} {unitOf(tour).many} y su historia narrada.
          </Text>
          <TouchableOpacity onPress={() => toggle('tour', tour.id)}>
            <Text style={st.link}>Agregar el recorrido completo</Text>
          </TouchableOpacity>
        </View>
      ))}
      {saved.map((it) => (
        <Row
          key={`${it.kind}:${it.id}`}
          kind={it.kind}
          id={it.id}
          trip={trip}
          toggle={toggle}
          openTour={openTour}
          openPlace={openPlace}
          note={it.kind === 'place' && covered.has(it.id) ? 'Incluido en un recorrido que guardaste' : null}
        />
      ))}
      <Btn title="Armar mis días →" onPress={goDays} style={{ marginTop: 12 }} />
    </>
  );
}

function Days({ trip, update, openTour, openPlace }) {
  const dates = tripDates(trip);
  const [picker, setPicker] = useState(null); // fecha a la que se agrega
  const [open, setOpen] = useState(null); // día expandido con mapa
  const days = trip.days || {};
  const scheduled = new Set(Object.values(days).flat().map((x) => `${x.kind}:${x.id}`));
  const covered = coveredPlaces(trip);
  const pending = (trip.saved || []).filter((x) => !scheduled.has(`${x.kind}:${x.id}`) && !(x.kind === 'place' && covered.has(x.id)));
  const setDay = (date, list) => update((t) => ({ days: { ...(t.days || {}), [date]: list } }));

  return (
    <>
      <View style={st.autoBox}>
        <Text style={st.autoText}>
          {pending.length ? `Tienes ${pending.length} guardados sin día.` : 'Todo lo guardado ya tiene día.'} La app puede repartirlos por ciudad, en su mejor horario y evitando días de cierre.
        </Text>
        <Btn
          title="✨ Repartir automáticamente"
          small
          onPress={() => {
            const run = () => update((t) => ({ days: autoPlan(t) }));
            if (Object.values(days).some((x) => x.length)) {
              Alert.alert('¿Rehacer los días?', 'Se reemplaza lo que ya armaste.', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Repartir', onPress: run },
              ]);
            } else run();
          }}
          style={{ alignSelf: 'flex-start', marginTop: 10 }}
        />
      </View>

      {dates.map((date, i) => {
        const list = days[date] || [];
        const warns = dayWarnings(trip, date);
        const plan = open === date ? dayPlan(trip, date) : null;
        return (
          <View key={date} style={st.dayCard}>
            <View style={st.headRow}>
              <Text style={st.dayTitle}>Día {i + 1} · {fmtDate(date)}</Text>
              {!!list.length && (
                <TouchableOpacity onPress={() => setOpen(open === date ? null : date)}>
                  <Text style={st.link}>{open === date ? 'Ocultar' : 'Ver mapa y horas'}</Text>
                </TouchableOpacity>
              )}
            </View>
            {warns.map((w) => (
              <View key={w.tourId} style={{ flexDirection: 'row', marginTop: 8 }}>
                <StatusChip chip={{ tone: w.blocking ? 'bad' : 'warn', text: `${tourById(w.tourId).name.split(':')[0]}: ${w.blocking ? 'cerrado ese día' : 'revisa el horario'}` }} small />
              </View>
            ))}
            {warns.map((w) => <Text key={`m${w.tourId}`} style={st.warnText}>{w.message}</Text>)}
            {list.map((it, k) => (
              <View key={`${it.kind}:${it.id}`} style={st.dayItem}>
                <Text style={st.dayItemTxt} numberOfLines={2}>
                  {it.kind === 'tour' ? '🎧' : '📍'} {nameOf(it)}
                </Text>
                <TouchableOpacity hitSlop={8} disabled={k === 0} onPress={() => { const l = [...list]; [l[k - 1], l[k]] = [l[k], l[k - 1]]; setDay(date, l); }}>
                  <Text style={[st.ctrl, k === 0 && { opacity: 0.25 }]}>↑</Text>
                </TouchableOpacity>
                <TouchableOpacity hitSlop={8} disabled={k === list.length - 1} onPress={() => { const l = [...list]; [l[k + 1], l[k]] = [l[k], l[k + 1]]; setDay(date, l); }}>
                  <Text style={[st.ctrl, k === list.length - 1 && { opacity: 0.25 }]}>↓</Text>
                </TouchableOpacity>
                <TouchableOpacity hitSlop={8} onPress={() => setDay(date, list.filter((_, j) => j !== k))}>
                  <Text style={st.ctrl}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={() => setPicker(date)}>
              <Text style={[st.link, { marginTop: 10 }]}>+ Agregar a este día</Text>
            </TouchableOpacity>
            {plan && (
              <View style={{ marginTop: 12 }}>
                <MyDay itin={plan} openTour={openTour} openPlace={openPlace} compact />
              </View>
            )}
          </View>
        );
      })}

      <Modal visible={!!picker} transparent animationType="slide" onRequestClose={() => setPicker(null)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }} onPress={() => setPicker(null)} />
        <View style={st.sheet}>
          <Text style={st.modalTitle}>Agregar al {picker ? fmtDate(picker) : ''}</Text>
          <ScrollView style={{ maxHeight: 420, marginTop: 10 }}>
            {!(trip.saved || []).length && <Text style={st.emptyText}>Primero guarda lugares o recorridos en «Descubrir».</Text>}
            {[...pending, ...(trip.saved || []).filter((x) => !pending.includes(x))].map((it) => (
              <TouchableOpacity
                key={`${it.kind}:${it.id}`}
                style={st.pickRow}
                onPress={() => {
                  setDay(picker, [...(days[picker] || []).filter((x) => !(x.kind === it.kind && x.id === it.id)), it]);
                  setPicker(null);
                }}
              >
                <Text style={st.dayItemTxt}>
                  {it.kind === 'tour' ? '🎧' : '📍'} {nameOf(it)}
                  {pending.includes(it) ? '' : '  · ya tiene día'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Btn title="Cerrar" kind="ghost" onPress={() => setPicker(null)} style={{ marginTop: 12 }} />
        </View>
      </Modal>
    </>
  );
}

const st = StyleSheet.create({
  sub: { fontSize: 15, color: C.muted, marginTop: 4, marginBottom: 16, lineHeight: 21 },
  tripCard: { backgroundColor: '#fff', borderRadius: R.lg, padding: 16, marginBottom: 12, ...shadow },
  tripName: { fontSize: 18, fontWeight: '800', color: C.text },
  tripMeta: { fontSize: 14, color: C.muted, marginTop: 4 },
  empty: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 10 },
  emptyIcon: { fontSize: 44 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: C.text, marginTop: 8 },
  emptyText: { fontSize: 15, color: C.muted, textAlign: 'center', lineHeight: 21, marginTop: 6 },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 26, fontWeight: '800', color: C.text },
  link: { fontSize: 15, fontWeight: '700', color: C.brand },
  label: { fontSize: 14, fontWeight: '800', color: C.text, marginTop: 20, marginBottom: 8 },
  hint: { fontSize: 12, color: C.muted, marginTop: 6 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: C.text, backgroundColor: '#fff' },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff' },
  stepTxt: { fontSize: 15, fontWeight: '700', color: C.text },
  stepVal: { flex: 1, textAlign: 'center', fontSize: 15, fontWeight: '700', color: C.text },
  detailHead: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 8 },
  segRow: { flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: 999, padding: 4, marginTop: 14 },
  seg: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 999 },
  segOn: { backgroundColor: '#fff', ...shadow },
  segTxt: { fontSize: 13, fontWeight: '700', color: C.muted },
  segTxtOn: { color: C.text },
  section: { fontSize: 18, fontWeight: '800', color: C.text, marginTop: 20, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  rowKind: { fontSize: 11, fontWeight: '800', color: C.muted },
  rowName: { fontSize: 15, fontWeight: '700', color: C.text, marginTop: 2 },
  rowShort: { fontSize: 13, color: C.muted, marginTop: 2, lineHeight: 18 },
  rowNote: { fontSize: 12, color: '#1B7A4B', marginTop: 4, fontWeight: '600' },
  heart: { paddingLeft: 10 },
  sugg: { backgroundColor: '#FFF7E8', borderRadius: R.md, padding: 12, marginBottom: 10 },
  suggText: { fontSize: 14, color: C.text, lineHeight: 20, marginBottom: 6 },
  autoBox: { backgroundColor: '#F7F6FF', borderRadius: R.md, padding: 14, marginBottom: 14 },
  autoText: { fontSize: 14, color: C.text, lineHeight: 20 },
  dayCard: { backgroundColor: '#fff', borderRadius: R.lg, padding: 14, marginBottom: 12, ...shadow },
  dayTitle: { fontSize: 16, fontWeight: '800', color: C.text },
  warnText: { fontSize: 12, color: '#9A5B00', marginTop: 4, lineHeight: 17 },
  dayItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F2F2F2' },
  dayItemTxt: { flex: 1, fontSize: 15, color: C.text },
  ctrl: { fontSize: 18, fontWeight: '700', color: C.muted, paddingHorizontal: 2 },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20 },
  pickRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
});
