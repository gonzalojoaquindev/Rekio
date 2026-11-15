// Mapa: Leaflet dentro de un WebView, con mapas gratuitos (Esri, OpenStreetMap); CARTO ahora exige clave.
// No necesita clave de API. Las teselas del mapa sí necesitan internet.
//
// points: [{ id, name, lat, lng, label, kind: 'must'|'optional'|'place', state: 'todo'|'now'|'done' }]
// route:  [[lat,lng], ...]  ruta completa del recorrido (línea suave)
// leg:    [[lat,lng], ...]  tramo actual hacia la próxima parada (línea fuerte)

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { LEAFLET_JS, LEAFLET_CSS } from './leafletAssets';
import { C, shadow } from '../theme';

const buildHtml = () => `<!doctype html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<style>${LEAFLET_CSS}
html,body,#map{margin:0;padding:0;height:100%;background:#F2EFE9}
.pin{display:flex;align-items:center;justify-content:center;font:800 12px -apple-system,Roboto,sans-serif;color:#fff;
  border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)}
.must{width:30px;height:30px;border-radius:15px;background:#222}
.optional{width:20px;height:20px;border-radius:10px;background:#9A9A9A;font-size:10px}
.place{width:22px;height:22px;border-radius:11px;background:#FF5A3C;font-size:10px}
.done{background:#1F9D6B}
.now{background:#FF5A3C;width:40px;height:40px;border-radius:20px;font-size:16px;margin:-5px 0 0 -5px;
  box-shadow:0 0 0 6px rgba(255,90,60,.25),0 2px 8px rgba(0,0,0,.4)}
.star{position:absolute;top:-7px;right:-7px;font-size:13px;text-shadow:0 0 2px #fff}
.leaflet-tooltip{font:700 12px -apple-system,Roboto,sans-serif;border-radius:8px}
</style></head>
<body><div id="map"></div>
<script>${LEAFLET_JS}</script>
<script>
  function send(o) { if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(o)); }
  var map = L.map('map', { zoomControl: false, attributionControl: true });
  map.attributionControl.setPrefix('');

  var PROVIDERS = [
    { name: 'Calles', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      opt: { maxZoom: 19, attribution: '© Esri, © OpenStreetMap' } },
    { name: 'OSM', url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      opt: { maxZoom: 19, attribution: '© OpenStreetMap' } },
    { name: 'Satélite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      opt: { maxZoom: 19, attribution: '© Esri, Maxar' } }
  ];
  var current = -1, tiles = null, errors = 0, autoSwitches = 0;
  function useProvider(i) {
    current = i % PROVIDERS.length; errors = 0;
    if (tiles) map.removeLayer(tiles);
    var pr = PROVIDERS[current];
    tiles = L.tileLayer(pr.url, pr.opt).addTo(map);
    tiles.on('tileerror', function () {
      errors++;
      if (errors === 6 && autoSwitches < PROVIDERS.length - 1) { autoSwitches++; useProvider(current + 1); }
    });
    send({ type: 'provider', name: pr.name });
  }
  window.nextProvider = function () { useProvider(current + 1); };
  useProvider(0);
  map.setView([35.0116, 135.7681], 14);

  var routeLayer = L.layerGroup().addTo(map);
  var legLayer = L.layerGroup().addTo(map);
  var pinLayer = L.layerGroup().addTo(map);
  var me = null, meAcc = null, data = null;

  function fit() {
    if (!data || !data.points.length) return;
    var b = L.latLngBounds(data.points.map(function (p) { return [p.lat, p.lng]; }));
    if (me) b.extend(me.getLatLng());
    map.fitBounds(b, { padding: [40, 40], maxZoom: 17 });
  }

  window.setData = function (d) {
    data = d;
    routeLayer.clearLayers(); pinLayer.clearLayers();
    if (d.route && d.route.length > 1) {
      L.polyline(d.route, { color: '#ffffff', weight: 7, opacity: 0.9 }).addTo(routeLayer);
      L.polyline(d.route, { color: '#FF5A3C', weight: 4, opacity: 0.55 }).addTo(routeLayer);
    }
    d.points.forEach(function (p) {
      var cls = 'pin ' + (p.kind || 'place') + ' ' + (p.state || '');
      var size = p.state === 'now' ? 40 : p.kind === 'must' ? 30 : 22;
      var inner = (p.state === 'done' ? '✓' : (p.label || '')) + (p.kind === 'must' && p.state !== 'now' ? '<span class="star">⭐</span>' : '');
      var icon = L.divIcon({ className: '', html: '<div class="' + cls + '" style="position:relative">' + inner + '</div>',
        iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
      var m = L.marker([p.lat, p.lng], { icon: icon, zIndexOffset: p.state === 'now' ? 1000 : p.kind === 'must' ? 500 : 0 }).addTo(pinLayer);
      m.bindTooltip(p.name, { direction: 'top', offset: [0, -size / 2] });
      m.on('click', function () { send({ type: 'tap', id: p.id }); });
    });
  };

  window.setLeg = function (line) {
    legLayer.clearLayers();
    if (line && line.length > 1) {
      L.polyline(line, { color: '#ffffff', weight: 9, opacity: 0.95 }).addTo(legLayer);
      L.polyline(line, { color: '#2F80ED', weight: 5, opacity: 1 }).addTo(legLayer);
    }
  };

  window.setMe = function (lat, lng, acc) {
    var ll = [lat, lng];
    if (!me) {
      meAcc = L.circle(ll, { radius: acc || 10, color: '#2F80ED', weight: 1, fillOpacity: 0.12 }).addTo(map);
      me = L.circleMarker(ll, { radius: 8, color: '#fff', weight: 3, fillColor: '#2F80ED', fillOpacity: 1 }).addTo(map);
    } else { me.setLatLng(ll); meAcc.setLatLng(ll); meAcc.setRadius(acc || 10); }
  };

  window.centerMe = function () { if (me) map.setView(me.getLatLng(), 18); };
  window.fitAll = fit;
  window.focusOn = function (lat, lng, z) { map.setView([lat, lng], z || 17); };
  send({ type: 'ready' });
</script>
</body></html>`;

export default function LeafletMap({
  points,
  route,
  leg,
  me,
  focus,
  fitKey,
  onTapPoint,
  height = 280,
  flex = false,
  rounded = true,
  controlsTop = 10,
}) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const [provider, setProvider] = useState('');
  const html = useMemo(buildHtml, []);

  const run = (code) => ref.current && ref.current.injectJavaScript(`${code};true;`);

  useEffect(() => {
    if (ready) run(`window.setData(${JSON.stringify({ points, route: route || [] })})`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, JSON.stringify(points), JSON.stringify(route)]);

  useEffect(() => {
    if (ready) run(`window.setLeg(${JSON.stringify(leg || [])})`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, JSON.stringify(leg)]);

  useEffect(() => {
    if (ready) run('window.fitAll()');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, fitKey]);

  useEffect(() => {
    if (ready && me) run(`window.setMe(${me.lat},${me.lng},${me.acc || 10})`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, me && me.lat, me && me.lng, me && me.acc]);

  useEffect(() => {
    if (ready && focus) run(`window.focusOn(${focus.lat},${focus.lng})`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, focus && focus.lat, focus && focus.lng]);

  return (
    <View style={[st.wrap, flex ? { flex: 1 } : { height }, rounded && st.rounded]}>
      <WebView
        ref={ref}
        originWhitelist={['*']}
        source={{ html, baseUrl: 'https://rekio.app/' }}
        javaScriptEnabled
        domStorageEnabled
        nestedScrollEnabled
        setSupportMultipleWindows={false}
        style={st.web}
        onMessage={(e) => {
          try {
            const msg = JSON.parse(e.nativeEvent.data);
            if (msg.type === 'ready') setReady(true);
            if (msg.type === 'provider') setProvider(msg.name);
            if (msg.type === 'tap' && onTapPoint) onTapPoint(msg.id);
          } catch (_) {}
        }}
      />
      <View style={[st.btns, { top: controlsTop }]}>
        <TouchableOpacity style={st.btn} onPress={() => run('window.centerMe()')}>
          <Text style={st.btnText}>◎</Text>
        </TouchableOpacity>
        <TouchableOpacity style={st.btn} onPress={() => run('window.fitAll()')}>
          <Text style={st.btnText}>⤢</Text>
        </TouchableOpacity>
        <TouchableOpacity style={st.btn} onPress={() => run('window.nextProvider()')}>
          <Text style={st.btnSmall}>{provider || 'Mapa'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  wrap: { overflow: 'hidden', backgroundColor: '#F2EFE9' },
  rounded: { borderRadius: 18 },
  web: { flex: 1, backgroundColor: '#F2EFE9' },
  btns: { position: 'absolute', right: 10, gap: 8, alignItems: 'flex-end' },
  btn: {
    backgroundColor: '#fff',
    borderRadius: 20,
    minWidth: 40,
    height: 40,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  btnText: { color: C.text, fontSize: 18, fontWeight: '700' },
  btnSmall: { color: C.text, fontSize: 12, fontWeight: '700' },
});
