// Elige el mapa: Google Maps si la app se compiló con clave y el usuario no prefiere el mapa abierto;
// si no, el mapa de OpenStreetMap (Leaflet).
import React from 'react';
import Constants from 'expo-constants';
import GoogleMap from './GoogleMap';
import LeafletMap from './LeafletMap';
import { useStore } from '../store';

export const hasGoogleMaps = !!(Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra.hasGoogleMaps);

export default function MapPanel(props) {
  const store = useStore();
  const useGoogle = hasGoogleMaps && store.settings.mapProvider !== 'osm';
  return useGoogle ? <GoogleMap {...props} /> : <LeafletMap {...props} />;
}
