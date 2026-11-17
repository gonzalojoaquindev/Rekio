// Rekio — audioguía a pie con GPS
import React, { useEffect, useState } from 'react';
import { View, StatusBar, BackHandler } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useKeepAwake } from 'expo-keep-awake';
import { StoreProvider } from './src/store';
import { TourProvider, useTour } from './src/tour';
import { GlossaryProvider } from './src/components/Glossary';
import { TabBar } from './src/components/ui';
import PlaceSheet from './src/components/PlaceSheet';
import ExploreScreen from './src/screens/ExploreScreen';
import MapScreen from './src/screens/MapScreen';
import TourScreen from './src/screens/TourScreen';
import PassportScreen from './src/screens/PassportScreen';
import TripsScreen from './src/screens/TripsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TourDetailScreen from './src/screens/TourDetailScreen';
import CityScreen from './src/screens/CityScreen';
import { C } from './src/theme';

function Main() {
  useKeepAwake(); // pantalla encendida mientras la app está abierta
  const t = useTour();
  const [tab, setTab] = useState('explore');
  const [detailId, setDetailId] = useState(null);
  const [placeId, setPlaceId] = useState(null);
  const [passport, setPassport] = useState(false); // el pasaporte ahora se abre desde Perfil
  const [tripId, setTripId] = useState(null); // viaje abierto en Mis viajes
  const [cityView, setCityView] = useState(null); // ciudad completa abierta desde Explora

  // Botón "atrás" de Android
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (placeId) return setPlaceId(null), true;
      if (detailId) return setDetailId(null), true;
      if (passport) return setPassport(false), true;
      if (cityView && tab === 'explore') return setCityView(null), true;
      if (tab === 'trips' && tripId) return setTripId(null), true;
      if (tab !== 'explore') return setTab('explore'), true;
      return false;
    });
    return () => sub.remove();
  }, [placeId, detailId, tab, passport, tripId, cityView]);

  const nav = {
    openTour: (id) => setDetailId(id),
    openPlace: (id) => setPlaceId(id),
    goTour: () => {
      setDetailId(null);
      setTab('tour');
    },
    openCity: (id) => setCityView(id),
    goTrips: () => {
      setCityView(null);
      setTab('trips');
    },
    goPassport: () => {
      setDetailId(null);
      setPassport(true);
    },
  };

  let screen;
  if (detailId) {
    screen = (
      <TourDetailScreen
        tourId={detailId}
        onBack={() => setDetailId(null)}
        openPlace={nav.openPlace}
        onStart={() => {
          setDetailId(null);
          setTab('tour');
        }}
      />
    );
  } else if (passport) screen = <PassportScreen {...nav} onBack={() => setPassport(false)} />;
  else if (tab === 'explore' && cityView) screen = <CityScreen {...nav} city={cityView} onBack={() => setCityView(null)} />;
  else if (tab === 'explore') screen = <ExploreScreen {...nav} />;
  else if (tab === 'map') screen = <MapScreen {...nav} />;
  else if (tab === 'tour') screen = <TourScreen {...nav} />;
  else if (tab === 'trips') screen = <TripsScreen {...nav} tripId={tripId} setTripId={setTripId} />;
  else screen = <ProfileScreen {...nav} />;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={{ flex: 1 }}>{screen}</View>
      {!detailId && (
        <TabBar
          tab={tab}
          activeTour={!!t.tour}
          onChange={(id) => {
            setPassport(false);
            setTab(id);
          }}
        />
      )}
      {placeId && <PlaceSheet placeId={placeId} onClose={() => setPlaceId(null)} />}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <TourProvider>
          <GlossaryProvider>
            <Main />
          </GlossaryProvider>
        </TourProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
