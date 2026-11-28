// Foto de cada lugar, obtenida de Wikipedia cuando hay internet.
// Prueba primero los artículos indicados en `photo` y, si no hay foto,
// busca el nombre japonés del lugar en la Wikipedia en japonés.

import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, ActivityIndicator, StyleSheet } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const cache = {}; // id → { src, fallback, page } | null
// Las fotos encontradas se guardan en el teléfono para no buscarlas en Wikipedia cada vez que abres la app
const CACHE_KEY = 'rekio:photos:v1';
let saveTimer = null;
const ready = AsyncStorage.getItem(CACHE_KEY)
  .then((raw) => {
    if (raw) Object.assign(cache, JSON.parse(raw));
  })
  .catch(() => {});
function remember(id, res) {
  cache[id] = res;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache)).catch(() => {}), 1500);
}
// Miniatura: pedir la imagen chica en vez de la de 960 px
const small = (uri) => (uri ? uri.replace(/width=\d+/, 'width=320').replace(/\/(\d{3,4})px-/, '/320px-') : uri);
// Wikimedia exige identificar la app: sin esto puede bloquear las peticiones
const UA = 'Rekio/1.0 (https://github.com/gonzalojoaquindev/Rekio)';
const HEADERS = { 'User-Agent': UA, 'Api-User-Agent': UA };
let lastError = '';

async function fromSummary(lang, title) {
  const r = await fetch(
    `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    { headers: HEADERS }
  );
  if (!r.ok) {
    lastError = `HTTP ${r.status}`;
    return null;
  }
  const d = await r.json();
  if (!d.thumbnail || !d.thumbnail.source) return null;
  const small = d.thumbnail.source;
  return {
    src: small.replace(/\/\d+px-/, '/960px-'), // versión más grande si existe
    fallback: small,
    page: d.content_urls && d.content_urls.mobile ? d.content_urls.mobile.page : null,
  };
}

async function fromSearch(lang, query) {
  const url =
    `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&origin=*` +
    `&generator=search&gsrlimit=1&gsrsearch=${encodeURIComponent(query)}` +
    `&prop=pageimages|info&inprop=url&piprop=thumbnail&pithumbsize=960`;
  const r = await fetch(url, { headers: HEADERS });
  if (!r.ok) {
    lastError = `HTTP ${r.status}`;
    return null;
  }
  const d = await r.json();
  const pages = d.query && d.query.pages ? Object.values(d.query.pages) : [];
  const p = pages.find((x) => x.thumbnail && x.thumbnail.source);
  return p ? { src: p.thumbnail.source, fallback: p.thumbnail.source, page: p.fullurl } : null;
}

function fromCommonsFile(name) {
  const enc = encodeURIComponent(name.replace(/ /g, '_'));
  return {
    src: `https://commons.wikimedia.org/wiki/Special:FilePath/${enc}?width=960`,
    fallback: `https://commons.wikimedia.org/wiki/Special:FilePath/${enc}?width=640`,
    page: `https://commons.wikimedia.org/wiki/File:${enc}`,
  };
}

async function findPhoto(point) {
  await ready;
  if (point.id in cache) return cache[point.id];
  // Foto elegida a mano: no necesita buscar nada
  const fixed = (point.photo || []).find((t) => t.startsWith('file:'));
  if (fixed) {
    cache[point.id] = fromCommonsFile(fixed.slice(5));
    return cache[point.id];
  }
  if (point.noAutoPhoto && !(point.photo || []).length) return null;
  const tries = [...(point.photo || [])];
  const jp = (point.jp || '').split(/[・（(]/)[0].trim();
  if (jp && !point.noAutoPhoto) tries.push(`search:${point.nameLang || 'ja'}:${jp}`);
  for (const t of tries) {
    try {
      let res = null;
      if (t.startsWith('search:')) {
        const [, lang, ...q] = t.split(':');
        res = await fromSearch(lang, q.join(':'));
      } else {
        const [lang, ...title] = t.split(':');
        res = await fromSummary(lang, title.join(':'));
      }
      if (res) {
        remember(point.id, res);
        return res;
      }
    } catch (e) {
      lastError = String((e && e.message) || e); // sin internet u otro error
    }
  }
  return null; // no se guarda en caché: se reintenta cuando vuelva internet
}

// Si el lugar tiene una ilustración propia (recreación histórica), se muestra esa en vez de buscar en Wikipedia
export default function PointPhoto(props) {
  return props.point.art ? <ArtPhoto {...props} /> : <WebPhoto {...props} />;
}

function ArtPhoto({ point, height = 190, thumb = false, size = 76, radius = 12, credit = true }) {
  if (thumb) {
    return (
      <View style={[st.thumb, { width: size, height: size, borderRadius: radius }]}>
        <Image source={point.art} style={st.thumbImg} resizeMode="cover" resizeMethod="resize" />
      </View>
    );
  }
  return (
    <View style={st.wrap}>
      <Image source={point.art} style={[st.box, { height, borderRadius: radius }]} resizeMode="cover" resizeMethod="resize" />
      {credit ? (
        <Text style={st.credit}>Recreación artística generada con IA · algunos detalles no son de la época</Text>
      ) : (
        <View style={st.artBadge}>
          <Text style={st.artBadgeText}>Recreación con IA</Text>
        </View>
      )}
    </View>
  );
}

function WebPhoto({ point, height = 190, thumb = false, size = 76, radius = 12, credit = true }) {
  const [photo, setPhoto] = useState(cache[point.id] || null);
  const [loading, setLoading] = useState(!cache[point.id]);
  const [useFallback, setUseFallback] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    setUseFallback(false);
    if (cache[point.id]) {
      setPhoto(cache[point.id]);
      setLoading(false);
      return;
    }
    setLoading(true);
    findPhoto(point).then((res) => {
      if (!alive) return;
      setPhoto(res);
      setErr(res ? '' : lastError);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [point.id]);

  const full = photo ? (useFallback ? photo.fallback : photo.src) : null;
  const uri = thumb ? small(full) : full;
  const imgSource = uri ? { uri, headers: { 'User-Agent': UA } } : null;

  if (thumb) {
    return (
      <View style={[st.thumb, { width: size, height: size, borderRadius: radius }]}>
        {imgSource ? (
          <Image
            source={imgSource}
            style={st.thumbImg}
            resizeMode="cover"
            resizeMethod="resize"
            onError={() => !useFallback && setUseFallback(true)}
          />
        ) : loading ? (
          <ActivityIndicator color="#FF5A3C" />
        ) : (
          <Text style={st.thumbNone}>📍</Text>
        )}
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[st.box, st.center, { height, borderRadius: radius }]}>
        <ActivityIndicator color="#FF5A3C" />
      </View>
    );
  }
  if (!photo) {
    if (!credit) return <View style={[st.box, st.center, { height, borderRadius: radius }]}><Text style={st.thumbNone}>📍</Text></View>;
    return err ? <Text style={st.credit}>Foto no disponible ({err})</Text> : null;
  }

  return (
    <View style={st.wrap}>
      <Image
        source={imgSource}
        style={[st.box, { height, borderRadius: radius }]}
        resizeMode="cover"
        resizeMethod="resize"
        onError={() => !useFallback && setUseFallback(true)}
      />
      {credit && (
      <TouchableOpacity disabled={!photo.page} onPress={() => photo.page && Linking.openURL(photo.page)}>
        <Text style={st.credit}>Foto: Wikimedia{photo.page ? ' · ver créditos' : ''}</Text>
      </TouchableOpacity>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  wrap: {},
  artBadge: { position: 'absolute', left: 12, bottom: 12, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  artBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  box: { width: '100%', backgroundColor: '#EEEEEE' },
  center: { alignItems: 'center', justifyContent: 'center' },
  credit: { color: '#717171', fontSize: 11, marginTop: 4 },
  thumb: {
    backgroundColor: '#EEEEEE',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImg: { width: '100%', height: '100%' },
  thumbNone: { fontSize: 26 },
});
