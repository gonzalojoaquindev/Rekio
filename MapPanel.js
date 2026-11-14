// Mapa del recorrido: Leaflet dentro de un WebView, con mapas de OpenStreetMap/CARTO.
// No necesita clave de API. Las teselas del mapa sí necesitan internet.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { LEAFLET_JS, LEAFLET_CSS } from './leafletAssets';

const buildHtml = () => `<!doctype html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<style>${LEAFLET_CSS}
html,body,#map{margin:0;padding:0;height:100%;background:#e8e2d6}
.pin{width:26px;height:26px;border-radius:13px;display:flex;align-items:center;justify-content:center;
  font:700 13px sans-serif;color:#fff;background:#7a6e5f;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.45)}
.pin.done{background:#C9A45C}
.pin.now{background:#C8402E;width:34px;height:34px;border-radius:17px;font-size:16px;margin:-4px 0 0 -4px}
.leaflet-tooltip{font:600 12px sans-serif}
</style></head>
<body><div id="map"></div>
<script>${LEAFLET_JS}</script>
<script>
  function send(o) { if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(o)); }
  var map = L.map('map', { zoomControl: false });
  // Proveedores de mapas gratuitos, sin clave. Si uno falla, se pasa al siguiente.
  var PROVIDERS = [
    { name: 'Esri', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      opt: { maxZoom: 19, attribution: '© Esri, HERE, Garmin, © OpenStreetMap' } },
    { name: 'OSM', url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      opt: { maxZoom: 19, attribution: '© OpenStreetMap' } },
    { name: 'CARTO', url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      opt: { subdomains: 'abcd', maxZoom: 20, attribution: '© OpenStreetMap © CARTO' } },
    { name: 'Satélite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      opt: { maxZoom: 19, attribution: '© Esri, Maxar, Earthstar Geographics' } }
  ];
  var current = -1, tiles = null, errors = 0, autoSwitches = 0;
  function useProvider(i) {
    current = i % PROVIDERS.length;
    errors = 0;
    if (tiles) map.removeLayer(tiles);
    var pr = PROVIDERS[current];
    tiles = L.tileLayer(pr.url, pr.opt).addTo(map);
    tiles.on('tileerror', function () {
      errors++;
      // falla automática al siguiente (solo una vuelta, por si no hay internet)
      if (errors === 6 && autoSwitches < PROVIDERS.length - 1) { autoSwitches++; useProvider(current + 1); }
    });
    send({ type: 'provider', name: pr.name });
  }
  window.nextProvider = function () { useProvider(current + 1); };
  useProvider(0);
  map.setView([35.0116, 135.7681], 14);

  var layer = L.layerGroup().addTo(map);
  var me = null, meAcc = null, data = null, fitted = false;


  function fit() {
    if (!data || !data.points.length) return;
    var b = L.latLngBounds(data.points.map(function (p) { return [p.lat, p.lng]; }));
    if (me) b.extend(me.getLatLng());
    map.fitBounds(b, { padding: [36, 36], maxZoom: 17 });
  }

  window.setData = function (d) {
    data = d;
    layer.clearLayers();
    if (d.route && d.route.length > 1) {
      L.polyline(d.route, { color: '#C8402E', weight: 4, opacity: 0.85, dashArray: '8 8' }).addTo(layer);
    }
    d.points.forEach(function (p) {
      var icon = L.divIcon({ className: '', html: '<div class="pin ' + p.state + '">' + p.label + '</div>',
        iconSize: [26, 26], iconAnchor: [13, 13] });
      var m = L.marker([p.lat, p.lng], { icon: icon, zIndexOffset: p.state === 'now' ? 1000 : 0 }).addTo(layer);
      m.bindTooltip(p.name, { direction: 'top', offset: [0, -14] });
      m.on('click', function () { send({ type: 'tap', id: p.id }); });
    });
    if (!fitted) { fit(); fitted = true; }
  };

  window.setMe = function (lat, lng, acc) {
    var ll = [lat, lng];
    if (!me) {
      meAcc = L.circle(ll, { radius: acc || 10, color: '#2F80ED', weight: 1, fillOpacity: 0.12 }).addTo(map);
      me = L.circleMarker(ll, { radius: 8, color: '#fff', weight: 3, fillColor: '#2F80ED', fillOpacity: 1 }).addTo(map);
    } else {
      me.setLatLng(ll); meAcc.setLatLng(ll); meAcc.setRadius(acc || 10);
    }
  };

  window.centerMe = function () { if (me) map.setView(me.getLatLng(), 17); };
  window.fitAll = fit;
  window.focusOn = function (lat, lng) { map.setView([lat, lng], 17); };
  send({ type: 'ready' });
</script>
</body></html>`;

export default function MapPanel({ points, route, me, focus, fitKey, onTapPoint, height = 280 }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const [provider, setProvider] = useState('');
  const html = useMemo(buildHtml, []);

  const run = (code) => ref.current && ref.current.injectJavaScript(`${code};true;`);

  // Paradas y ruta
  useEffect(() => {
    if (ready) run(`window.setData(${JSON.stringify({ points, route: route || [] })})`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, JSON.stringify(points), JSON.stringify(route)]);

  // Reencuadrar cuando cambia lo que se muestra (otro recorrido, etc.)
  useEffect(() => {
    if (ready) run('window.fitAll()');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, fitKey]);

  // Mi ubicación
  useEffect(() => {
    if (ready && me) run(`window.setMe(${me.lat},${me.lng},${me.acc || 10})`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, me && me.lat, me && me.lng, me && me.acc]);

  // Centrar en la parada actual cuando cambia
  useEffect(() => {
    if (ready && focus) run(`window.focusOn(${focus.lat},${focus.lng})`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, focus && focus.lat, focus && focus.lng]);

  return (
    <View style={[st.wrap, { height }]}>
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
      <View style={st.btns}>
        <TouchableOpacity style={st.btn} onPress={() => run('window.centerMe()')}>
          <Text style={st.btnText}>◎ Yo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={st.btn} onPress={() => run('window.fitAll()')}>
          <Text style={st.btnText}>⤢ Todo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={st.btn} onPress={() => run('window.nextProvider()')}>
          <Text style={st.btnText}>🗺 {provider || 'Mapa'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  wrap: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3A322A',
    backgroundColor: '#e8e2d6',
  },
  web: { flex: 1, backgroundColor: '#e8e2d6' },
  btns: { position: 'absolute', right: 8, top: 8, gap: 6 },
  btn: {
    backgroundColor: 'rgba(22,19,15,0.85)',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  btnText: { color: '#F3EADB', fontSize: 13, fontWeight: '700' },
});
