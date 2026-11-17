// Una ciudad completa: todos sus lugares por categoría, con ❤️ para guardarlos en un viaje.
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CityCatalog, { cityPlaces } from '../components/CityCatalog';
import { C } from '../theme';
import { cityById } from '../geo';
import { useStore } from '../store';
import { isSaved, toggleSaved } from '../trips';

const todayYmd = () => new Date().toISOString().slice(0, 10);

// El viaje donde se guardan los ❤️ de esta ciudad: el próximo (o en curso) que la incluye
export function tripForCity(trips, city) {
  const today = todayYmd();
  const list = (trips || []).filter((t) => (t.cities || []).includes(city) && t.end >= today);
  list.sort((a, b) => (a.start < b.start ? -1 : 1));
  return list[0] || null;
}

export default function CityScreen({ city, onBack, openPlace, goTrips }) {
  const insets = useSafeAreaInsets();
  const store = useStore();
  const c = cityById(city);
  const trip = tripForCity(store.trips, city);
  const n = cityPlaces(city).length;

  const heart = (p) => {
    const on = !!trip && isSaved(trip, 'place', p.id);
    const press = () => {
      if (!trip) {
        Alert.alert(
          `Guarda lugares en un viaje`,
          `Crea un viaje a ${c.name} en la pestaña Viajes y podrás marcar con ❤️ lo que quieres ver.`,
          [
            { text: 'Ahora no', style: 'cancel' },
            { text: 'Ir a Viajes', onPress: goTrips },
          ]
        );
        return;
      }
      store.updateTrip(trip.id, (t) => toggleSaved(t, 'place', p.id));
    };
    return (
      <TouchableOpacity onPress={press} hitSlop={12} style={{ paddingLeft: 6 }} accessibilityLabel={on ? 'Quitar del viaje' : 'Guardar en el viaje'}>
        <Text style={{ fontSize: 22 }}>{on ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 8, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={st.back}>‹ Explora</Text>
        </TouchableOpacity>
        <Text style={st.title}>Todo {c.name}</Text>
        <Text style={st.sub}>
          {n} lugares para elegir: templos, miradores, barrios, museos, comida y noche. Cada uno con su historia narrada, precio y horario.
        </Text>
        <Text style={st.tripNote}>
          {trip ? `❤️ se guarda en tu viaje «${trip.name}»` : '❤️ Crea un viaje en Viajes para guardar lugares'}
        </Text>
        <CityCatalog city={city} openPlace={openPlace} renderRight={heart} />
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  back: { fontSize: 16, fontWeight: '700', color: C.brand },
  title: { fontSize: 30, fontWeight: '900', color: C.text, marginTop: 10 },
  sub: { fontSize: 15, color: C.muted, marginTop: 6, lineHeight: 21 },
  tripNote: { fontSize: 13, color: C.text, fontWeight: '700', marginTop: 10, marginBottom: 12 },
});
