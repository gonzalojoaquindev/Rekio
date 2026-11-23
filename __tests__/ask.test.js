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
jest.mock('../src/ask', () => ({ serverUrlFor: () => 'https://rekio.test', askQuestion: jest.fn(async ({ q, chapter }) => 'Respuesta de prueba sobre ' + chapter.id + ': ' + q) }));
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

test('preguntar durante un capítulo: pausa, responde en voz alta y retoma', async () => {
  jest.useFakeTimers();
  await render(<App />);
  await tick(500);
  await fireEvent.changeText(screen.getByPlaceholderText(/Qué quieres descubrir/), 'rebelión');
  await tick(100);
  await fireEvent.press(screen.getAllByText('Copiapó: la rebelión del desierto')[0]);
  await tick(200);
  await fireEvent.press(screen.getByText('Simular'));
  await tick(300);
  const btn = await screen.findByText(/🎙 Preguntar sobre este capítulo/);
  await fireEvent.press(btn);
  await tick(50);
  expect(screen.getByText('🎙 Pregúntale a Rekio')).toBeTruthy();
  await fireEvent.changeText(screen.getByPlaceholderText(/O escribe/), '¿Quién era Zapata?');
  global.__spoken = [];
  await fireEvent.press(screen.getByText('Enviar'));
  await tick(100);
  expect(screen.getByText(/Respuesta de prueba sobre cp_\w+: ¿Quién era Zapata\?/)).toBeTruthy();
  expect(global.__spoken.some((s) => s.startsWith('Respuesta de prueba'))).toBe(true);
  await fireEvent.press(screen.getByText('▶ Seguir con la historia'));
  await tick(100);
  expect(screen.queryByText('🎙 Pregúntale a Rekio')).toBeNull();
}, 60000);
