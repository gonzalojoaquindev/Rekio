// Estado de la app guardado en el teléfono: perfil, estampillas, fotos y ajustes.
// (Fase 2: se sincronizará con una cuenta en el servidor.)
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Directory, Paths } from 'expo-file-system';

const KEY = 'rekio:v1';

const INITIAL = {
  profile: { name: 'Viajero', home: '', bio: '' },
  heard: [], // ids de lugares escuchados
  completed: [], // { tourId, date, simulated, km }
  photos: [], // { id, uri, tourId, placeId, date }
  settings: { auto: true, turnByTurn: true, voiceId: null, mapProvider: 'google' },
};

const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(INITIAL);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) {
          const saved = JSON.parse(raw);
          setState({
            ...INITIAL,
            ...saved,
            profile: { ...INITIAL.profile, ...(saved.profile || {}) },
            settings: { ...INITIAL.settings, ...(saved.settings || {}) },
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  // Guarda con un pequeño retraso para no escribir en cada cambio
  useEffect(() => {
    if (!loaded) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
    }, 400);
  }, [state, loaded]);

  const markHeard = useCallback(
    (id) => setState((s) => (s.heard.includes(id) ? s : { ...s, heard: [...s.heard, id] })),
    []
  );

  const completeTour = useCallback(
    (tourId, { simulated = false, km = 0 } = {}) =>
      setState((s) => ({
        ...s,
        completed: [...s.completed, { tourId, date: new Date().toISOString(), simulated, km }],
      })),
    []
  );

  const addPhoto = useCallback(async (uri, { tourId = null, placeId = null } = {}) => {
    let finalUri = uri;
    try {
      // Copia la foto a la carpeta de la app para que no se borre con el caché
      const dir = new Directory(Paths.document, 'photos');
      if (!dir.exists) dir.create({ idempotent: true });
      const ext = (uri.split('.').pop() || 'jpg').split('?')[0].slice(0, 4);
      const dest = new File(dir, `${Date.now()}.${ext}`);
      await new File(uri).copy(dest);
      finalUri = dest.uri;
    } catch (_) {
      // si falla, usamos la ruta original
    }
    const photo = { id: String(Date.now()), uri: finalUri, tourId, placeId, date: new Date().toISOString() };
    setState((s) => ({ ...s, photos: [photo, ...s.photos] }));
    return photo;
  }, []);

  const removePhoto = useCallback(
    (id) => setState((s) => ({ ...s, photos: s.photos.filter((p) => p.id !== id) })),
    []
  );

  const updateProfile = useCallback(
    (patch) => setState((s) => ({ ...s, profile: { ...s.profile, ...patch } })),
    []
  );
  const updateSettings = useCallback(
    (patch) => setState((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
    []
  );

  const value = useMemo(
    () => ({ ...state, loaded, markHeard, completeTour, addPhoto, removePhoto, updateProfile, updateSettings }),
    [state, loaded, markHeard, completeTour, addPhoto, removePhoto, updateProfile, updateSettings]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);

// Estampillas ganadas: una por recorrido (la primera vez que se completa)
export function earnedStamps(completed) {
  const map = {};
  completed.forEach((c) => {
    if (!map[c.tourId]) map[c.tourId] = c;
  });
  return map;
}
