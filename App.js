// Rekio — audioguía a pie con GPS
import React, { useEffect, useState } from 'react';
import { View, StatusBar, BackHandler } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useKeepAwake } from 'expo-keep-awake';
import { StoreProvider } from './src/store';
import { TourProvider, useTour } from './src/tour';
import { TabBar } from './src/components/ui';
import PlaceSheet from './src/components/PlaceSheet';
import ExploreScreen from './src/screens/ExploreScreen';
import MapScreen from './src/screens/MapScreen';
import TourScreen from './src/screens/TourScreen';
import PassportScreen from './src/screens/PassportScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TourDetailScreen from './src/screens/TourDetailScreen';
import { C } from './src/theme';

function Main() {
  useKeepAwake(); // pantalla encendida mientras la app está abierta
  const t = useTour();
  const [tab, setTab] = useState('explore');
  const [detailId, setDetailId] = useState(null);
  const [placeId, setPlaceId] = useState(null);

  // Botón "atrás" de Android
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (placeId) return setPlaceId(null), true;
      if (detailId) return setDetailId(null), true;
      if (tab !== 'explore') return setTab('explore'), true;
      return false;
    });
    return () => sub.remove();
  }, [placeId, detailId, tab]);

  const nav = {
    openTour: (id) => setDetailId(id),
    openPlace: (id) => setPlaceId(id),
    goPassport: () => {
      setDetailId(null);
      setTab('passport');
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
  } else if (tab === 'explore') screen = <ExploreScreen {...nav} />;
  else if (tab === 'map') screen = <MapScreen {...nav} />;
  else if (tab === 'tour') screen = <TourScreen {...nav} />;
  else if (tab === 'passport') screen = <PassportScreen {...nav} />;
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
          <Main />
        </TourProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
