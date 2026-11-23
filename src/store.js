// Estado de la app guardado en el teléfono: perfil, estampillas, fotos y ajustes.
// (Fase 2: se sincronizará con una cuenta en el servidor.)
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Directory, Paths } from 'expo-file-system';
import { applyCalibration } from './calib';
import { setNarrator, setEffects, DEFAULT_NARRATOR } from './narration';

const KEY = 'rekio:v1';

const INITIAL = {
  profile: { name: 'Viajero', home: '', bio: '' },
  heard: [], // ids de lugares escuchados
  completed: [], // { tourId, date, simulated, km }
  photos: [], // { id, uri, tourId, placeId, date }
  reviews: {}, // { [tourId]: { stars: 0-5, text, date } } — por ahora solo en este teléfono
  progress: {}, // { [tourId]: { pos, order, date } } — dónde quedó un recorrido sin terminar
  trips: [], // Mis viajes: { id, name, cities, start, end, saved: [{kind,id}], days: { 'YYYY-MM-DD': [{kind,id}] } }
  calib: {}, // modo calibración: { [placeId]: { lat, lng, acc, how, radius, note, date } }
  settings: { auto: true, turnByTurn: true, voiceId: null, mapProvider: 'google', music: true, devMode: false, narrator: DEFAULT_NARRATOR, effects: true },
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
      .finally(() => {
        // Identificador anónimo del teléfono (solo para el límite diario de preguntas)
        setState((s) => (s.settings.deviceId ? s : { ...s, settings: { ...s.settings, deviceId: `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}` } }));
        setLoaded(true);
      });
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
  const setReview = useCallback(
    (tourId, patch) =>
      setState((s) => {
        const prev = (s.reviews || {})[tourId] || { stars: 0, text: '' };
        return { ...s, reviews: { ...(s.reviews || {}), [tourId]: { ...prev, ...patch, date: new Date().toISOString() } } };
      }),
    []
  );
  const setProgress = useCallback(
    (tourId, val) =>
      setState((s) => {
        const progress = { ...(s.progress || {}) };
        if (val) progress[tourId] = { ...val, date: new Date().toISOString() };
        else delete progress[tourId];
        return { ...s, progress };
      }),
    []
  );
  // ── Mis viajes ──
  const createTrip = useCallback((trip) => {
    const id = `trip-${Date.now()}`;
    setState((s) => ({ ...s, trips: [...(s.trips || []), { saved: [], days: {}, ...trip, id }] }));
    return id;
  }, []);
  const updateTrip = useCallback(
    (id, fn) => setState((s) => ({ ...s, trips: (s.trips || []).map((t) => (t.id === id ? { ...t, ...(typeof fn === 'function' ? fn(t) : fn) } : t)) })),
    []
  );
  const deleteTrip = useCallback((id) => setState((s) => ({ ...s, trips: (s.trips || []).filter((t) => t.id !== id) })), []);
  // Calibración: aplica las correcciones de puntos sobre los datos en cuanto cambian
  useMemo(() => applyCalibration(state.calib), [state.calib]);
  useMemo(() => setNarrator(state.settings.narrator), [state.settings.narrator]);
  useMemo(() => setEffects(state.settings.effects), [state.settings.effects]);
  const setCalib = useCallback(
    (id, patch) =>
      setState((s) => {
        const all = { ...(s.calib || {}) };
        if (patch === null) delete all[id];
        else all[id] = { ...(all[id] || {}), ...patch, date: new Date().toISOString() };
        return { ...s, calib: all };
      }),
    []
  );
  const clearCalib = useCallback(() => setState((s) => ({ ...s, calib: {} })), []);

  const updateSettings = useCallback(
    (patch) => setState((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
    []
  );

  const value = useMemo(
    () => ({ ...state, loaded, markHeard, completeTour, addPhoto, removePhoto, updateProfile, updateSettings, setReview, setProgress, createTrip, updateTrip, deleteTrip, setCalib, clearCalib }),
    [state, loaded, markHeard, completeTour, addPhoto, removePhoto, updateProfile, updateSettings, setReview, setProgress, createTrip, updateTrip, deleteTrip, setCalib, clearCalib]
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
