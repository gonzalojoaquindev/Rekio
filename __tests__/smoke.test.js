import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);
jest.mock('react-native-webview', () => {
  const React = require('react');
  const { View } = require('react-native');
  const WebView = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({ injectJavaScript: (c) => { global.__injected = (global.__injected || 0) + 1; } }));
    React.useEffect(() => { props.onMessage && props.onMessage({ nativeEvent: { data: JSON.stringify({ type: 'ready' }) } }); }, []);
    return <View testID="webview" />;
  });
  return { WebView };
});
jest.mock('expo-constants', () => ({ __esModule: true, default: { expoConfig: { extra: { hasGoogleMaps: true } } } }));
jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');
  const MapView = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({ fitToCoordinates: () => {}, animateCamera: () => {} }));
    React.useEffect(() => { props.onMapReady && props.onMapReady(); }, []);
    return <View testID="gmap">{props.children}</View>;
  });
  const C = (p) => <View>{p.children}</View>;
  return { __esModule: true, default: MapView, Marker: C, Polyline: C, Circle: C, PROVIDER_GOOGLE: 'google' };
});
global.__music = [];
jest.mock('expo-audio', () => ({
  setAudioModeAsync: jest.fn(async () => {}),
  createAudioPlayer: jest.fn((src) => {
    const subs = [];
    const isNarr = src && src.uri;
    const p = {
      loop: false, volume: 1, currentTime: 0,
      addListener: (ev, cb) => (subs.push(cb), { remove: () => {} }),
      seekTo: jest.fn(async () => {}),
      pause: jest.fn(),
      play: jest.fn(() => {
        if (!isNarr) return global.__music.push('play');
        (global.__narr = global.__narr || []).push(src.uri.split('/').pop());
        setTimeout(() => subs.forEach((cb) => cb({ isLoaded: true, duration: 5 })), 5);
        setTimeout(() => subs.forEach((cb) => cb({ isLoaded: true, didJustFinish: true })), 20);
      }),
      remove: jest.fn(() => !isNarr && global.__music.push('stop')),
    };
    return p;
  }),
}));
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  const C = (p) => <View>{p.children}</View>;
  return { __esModule: true, default: C, Svg: C, Rect: C, Circle: C, Path: C, Polygon: C, Ellipse: C };
});
jest.mock('expo-location', () => ({
  Accuracy: { BestForNavigation: 6 },
  requestForegroundPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  watchPositionAsync: jest.fn(async (opts, cb) => { cb({ coords: { latitude: 35.0, longitude: 135.77, accuracy: 8 } }); return { remove: () => {} }; }),
}));
global.__spoken = [];
jest.mock('expo-speech', () => ({
  speak: jest.fn((text, o) => { global.__spoken.push(text.slice(0, 60)); setTimeout(() => o && o.onDone && o.onDone(), 10); }),
  stop: jest.fn(),
  getAvailableVoicesAsync: jest.fn(async () => [{ identifier: 'es-us-x-esd-network', language: 'es-US', quality: 'Enhanced' }]),
}));
jest.mock('expo-speech-recognition', () => ({ ExpoSpeechRecognitionModule: { requestPermissionsAsync: jest.fn(async () => ({ granted: true })), start: jest.fn(), stop: jest.fn(), abort: jest.fn() }, useSpeechRecognitionEvent: () => {} }));
jest.mock('expo-keep-awake', () => ({ useKeepAwake: () => {} }));
jest.mock('expo-image-picker', () => ({}));
jest.mock('expo-file-system', () => ({ File: function () {}, Directory: function () {}, Paths: {} }));

global.fetch = jest.fn(async (url) => ({
  ok: true,
  json: async () => {
    if (url.includes('routing.openstreetmap.de')) {
      const m = url.match(/driving\/([^?]+)/)[1].split(';').map((c) => c.split(',').map(Number));
      const line = m.map(([lng, lat]) => [lng, lat]);
      return { routes: [{ distance: 500, geometry: { coordinates: line.length > 1 ? line : [line[0], line[0]] },
        legs: [{ steps: [
          { distance: 100, name: '', maneuver: { type: 'depart', bearing_after: 90, location: line[0] } },
          { distance: 100, name: 'Hanamikoji', maneuver: { type: 'turn', modifier: 'left', location: line[line.length - 1] } },
          { distance: 0, name: '', maneuver: { type: 'arrive', location: line[line.length - 1] } },
        ] }] }] };
    }
    if (url.includes('wikipedia')) return { thumbnail: { source: 'https://upload.wikimedia.org/x/320px-a.jpg' }, content_urls: { mobile: { page: 'https://w' } } };
    return {};
  },
}));

import App from '../App';
import { Alert } from 'react-native';
jest.spyOn(Alert, 'alert').mockImplementation((title, msg, buttons) => {
  global.__alerts = (global.__alerts || []).concat(title);
  const b = buttons && buttons[buttons.length - 1];
  if (b && b.onPress) b.onPress();
});
const tick = async (ms) => { await act(async () => { jest.advanceTimersByTime(ms); }); };

test('app renders all tabs and completes a simulated tour', async () => {
  jest.useFakeTimers();
  await render(<App />);
  await tick((500));
  expect(screen.getByText(/Recorridos en Kioto/)).toBeTruthy();

  for (const tab of ['Mapa', 'Viajes', 'Perfil', 'Recorrido', 'Explora']) {
    await fireEvent.press(screen.getAllByText(tab)[0]);
    await tick((200));
  }
  // Abrir detalle de Kiyomizu y simular
  await fireEvent.press(screen.getByText('Kiyomizu-dera y Higashiyama'));
  await tick((200));
  expect(screen.getByText('Lo que no te puedes perder')).toBeTruthy();
  expect(screen.getByText('Si tienes tiempo')).toBeTruthy();
  await fireEvent.press(screen.getByText('Simular'));
  for (let i = 0; i < 400; i++) {
    await tick((500));
    if (screen.queryByText('¡Ganaste una estampilla!')) { console.log('DONE at iter', i); break; }
    if (i % 40 === 0) { const sub = screen.queryAllByText(/Parada \d+ de/); console.log('iter', i, sub.length ? sub[0].props.children : '-', global.__spoken.slice(-1)); }
  }
  expect(screen.getByText('¡Ganaste una estampilla!')).toBeTruthy();
  // Calificar al terminar y escribir un tip en la ficha del recorrido
  await fireEvent.press(screen.getAllByLabelText('4 estrellas')[0]);
  expect(screen.getByText('Escribir un tip para otros viajeros')).toBeTruthy();
  expect(global.__music).toContain('play');
  console.log('SPOKEN', global.__spoken.length, global.__spoken.filter((s) => /metros|Dobla|dobla/.test(s)).slice(0, 4));
  await fireEvent.press(screen.getByText('Ver pasaporte'));
  await tick((300));
  expect(screen.getByText(/1 de 15 estampillas/)).toBeTruthy();
  await fireEvent.press(screen.getAllByText('Perfil')[0]);
  await tick((300));
  expect(screen.getByText('Mis estampillas')).toBeTruthy();
  // La nota aparece en Explora y en la ficha se puede dejar un tip
  await fireEvent.press(screen.getAllByText('Explora')[0]);
  expect(screen.getAllByText(/★ 4 · tu nota/).length).toBe(1);
  await fireEvent.press(screen.getByText('Kiyomizu-dera y Higashiyama'));
  expect(screen.getByText('Muy bueno')).toBeTruthy();
  expect(screen.getByText('Mejor momento para ir')).toBeTruthy();
  await fireEvent.changeText(screen.getByPlaceholderText(/Tu opinión o un tip/), 'Ir antes de las 8');
  await fireEvent.press(screen.getByText('Guardar'));
  expect(screen.getByText('💡 Ir antes de las 8')).toBeTruthy();
}, 120000);

test('tour controls: previous, skip, place sheet', async () => {
  jest.useFakeTimers();
  await render(<App />);
  await tick((500));
  await fireEvent.press(screen.getByText('Gion: geishas, samuráis y kabuki'));
  await tick((100));
  await fireEvent.press(screen.getByText('Comenzar recorrido'));
  await tick((100));
  await fireEvent.press(screen.getByText('Ya llegué'));
  await tick((5));
  await fireEvent.press(screen.getByText('Anterior'));
  await tick((5));
  await fireEvent.press(screen.getByText('Ficha ›'));
  await tick((100));
  expect(screen.getByText('La historia')).toBeTruthy();
  console.log('ALERTS', global.__alerts, 'SPOKEN-ORDER', global.__spoken.filter((x) => /Empezamos|Siguiente parada/.test(x)).slice(0, 3));
  await fireEvent.press(screen.getByText('Escuchar historia'));
  await tick((100));
});

test('Mi día: muestra el plan y simula el día encadenando recorridos', async () => {
  jest.useFakeTimers();
  await render(<App />);
  await tick(500);
  await fireEvent.press(screen.getAllByText('Recorrido')[0]);
  expect(screen.getByText('Último día en Tokio')).toBeTruthy();
  expect(screen.getAllByText(/Metro línea Ōedo/).length).toBe(1);
  await fireEvent.press(screen.getByText('Simular el día completo'));
  // Termina el primer recorrido (Ueno) saltando paradas hasta el final
  for (let i = 0; i < 600 && !screen.queryByText('¡Ganaste una estampilla!'); i++) await tick(500);
  expect(screen.getByText(/Siguiente: Koishikawa Kōrakuen \(13:45\)/)).toBeTruthy();
  await fireEvent.press(screen.getByText(/Siguiente: Koishikawa/));
  await tick(500);
  expect(screen.queryByText('¡Ganaste una estampilla!')).toBe(null);
}, 120000);

test('La Serena 1680: capítulos, ilustraciones y continuar donde quedaste', async () => {
  jest.useFakeTimers();
  await render(<App />);
  await tick(500);
  expect(screen.getAllByText('La Serena: la ciudad que sobrevivió a los piratas').length).toBeGreaterThan(0);
  await fireEvent.press(screen.getAllByText('La Serena: la ciudad que sobrevivió a los piratas')[0]);
  await tick(300);
  expect(screen.getAllByText('capítulos').length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Recreación con IA/).length).toBeGreaterThan(0);
  // Empieza de verdad (no simulado), avanza dos capítulos y cierra
  global.__alerts = [];
  await fireEvent.press(screen.getByText('Comenzar recorrido'));
  await tick(500);
  expect(screen.getByText(/Capítulo 1 de 5/)).toBeTruthy();
  // En el emulador de pruebas la narración termina al instante: 'Ya llegué' pasa al capítulo siguiente
  await fireEvent.press(screen.getAllByText('Ya llegué')[0]);
  await tick(500);
  expect(screen.getByText(/Capítulo 2 de 5/)).toBeTruthy();
  await fireEvent.press(screen.getByText('Terminar'));
  await tick(300);
  // Al volver a comenzar, ofrece continuar en el capítulo 2
  await fireEvent.press(screen.getAllByText('Explora')[0]);
  await fireEvent.press(screen.getAllByText('La Serena: la ciudad que sobrevivió a los piratas')[0]);
  await fireEvent.press(screen.getByText('Comenzar recorrido'));
  await tick(500);
  expect(global.__alerts).toContain('¿Continuar donde quedaste?');
  expect(screen.getByText(/Capítulo 2 de 5/)).toBeTruthy();
}, 120000);

test('Vocabulario: lista, búsqueda y tarjeta con relacionados', async () => {
  jest.useFakeTimers();
  await render(<App />);
  await tick(500);
  await fireEvent.press(screen.getByText('Vocabulario'));
  await fireEvent.changeText(screen.getByPlaceholderText(/Buscar: daimyō/), 'daimio');
  await fireEvent.press(screen.getByText(/^Daimyō\s+大名/));
  expect(screen.getAllByText(/Un gran señor feudal/).length).toBeGreaterThan(0);
  await fireEvent.press(screen.getAllByText('Shōgun')[0]);
  expect(screen.getAllByText(/El jefe militar supremo/).length).toBeGreaterThan(0);
  await fireEvent.press(screen.getByText('‹ Volver'));
  expect(screen.getAllByText(/Un gran señor feudal/).length).toBeGreaterThan(0);
}, 60000);

test('Mis viajes: crear, guardar, repartir y ver el día', async () => {
  jest.useFakeTimers();
  await render(<App />);
  await tick(500);
  await fireEvent.press(screen.getAllByText('Viajes')[0]);
  expect(screen.getByText('¿A dónde viajas?')).toBeTruthy();
  await fireEvent.press(screen.getByText('+ Nuevo viaje'));
  await fireEvent.changeText(screen.getByPlaceholderText(/Japón con mi pareja/), 'Japón 2027');
  await fireEvent.press(screen.getByText('Kioto · Japón'));
  await fireEvent.press(screen.getByText('Crear viaje'));
  await tick(200);
  expect(screen.getByText('Japón 2027')).toBeTruthy();
  // Descubrir: guardar dos lugares de Kinkaku-ji
  await fireEvent.press(screen.getAllByLabelText('Guardar')[0]);
  await fireEvent.changeText(screen.getByPlaceholderText(/Buscar: torre/), 'ryoan');
  await fireEvent.press(screen.getAllByLabelText('Guardar').slice(-1)[0]);
  await fireEvent.press(screen.getByText(/^Guardados \(2\)/));
  await fireEvent.press(screen.getByText('Armar mis días →'));
  await fireEvent.press(screen.getByText('✨ Repartir automáticamente'));
  await tick(200);
  expect(screen.getAllByText(/Día 1 ·/).length).toBe(1);
  await fireEvent.press(screen.getAllByText('Ver mapa y horas')[0]);
  expect(screen.getAllByText(/Ver (recorrido y comenzar|lugar y escuchar su historia)/).length).toBeGreaterThan(0);
  // Empezar el día: pasa a ser "Mi día" en Recorrido
  await fireEvent.press(screen.getAllByText('▶ Empezar este día')[0]);
  await tick(300);
  expect(screen.getByText('Dejar de seguir este día')).toBeTruthy();
  expect(screen.getAllByText(/Ver lugar y escuchar su historia/).length).toBeGreaterThan(0);
  await fireEvent.press(screen.getByText('Dejar de seguir este día'));
  // El pasaporte ahora se abre desde Perfil
  await fireEvent.press(screen.getAllByText('Perfil')[0]);
  await fireEvent.press(screen.getByText('Ver todas'));
  expect(screen.getByText('‹ Perfil')).toBeTruthy();
}, 60000);
