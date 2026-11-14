// Foto de cada lugar, obtenida de Wikipedia cuando hay internet.
// Prueba primero los artículos indicados en `photo` y, si no hay foto,
// busca el nombre japonés del lugar en la Wikipedia en japonés.

import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, ActivityIndicator, StyleSheet } from 'react-native';

const cache = {}; // id → { src, fallback, page } | null
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

async function findPhoto(point) {
  if (point.id in cache) return cache[point.id];
  const tries = [...(point.photo || [])];
  const jp = (point.jp || '').split(/[・（(]/)[0].trim();
  if (jp) tries.push(`search:ja:${jp}`);
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
        cache[point.id] = res;
        return res;
      }
    } catch (e) {
      lastError = String((e && e.message) || e); // sin internet u otro error
    }
  }
  return null; // no se guarda en caché: se reintenta cuando vuelva internet
}

export default function PointPhoto({ point, height = 190, thumb = false }) {
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

  const uri = photo ? (useFallback ? photo.fallback : photo.src) : null;
  const imgSource = uri ? { uri, headers: { 'User-Agent': UA } } : null;

  if (thumb) {
    return (
      <View style={st.thumb}>
        {imgSource ? (
          <Image
            source={imgSource}
            style={st.thumbImg}
            resizeMode="cover"
            onError={() => !useFallback && setUseFallback(true)}
          />
        ) : loading ? (
          <ActivityIndicator color="#C9A45C" />
        ) : (
          <Text style={st.thumbNone}>🏯</Text>
        )}
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[st.box, st.center, { height }]}>
        <ActivityIndicator color="#C9A45C" />
      </View>
    );
  }
  if (!photo) {
    return err ? <Text style={st.credit}>Foto no disponible ({err})</Text> : null;
  }

  return (
    <View style={st.wrap}>
      <Image
        source={imgSource}
        style={[st.box, { height }]}
        resizeMode="cover"
        onError={() => !useFallback && setUseFallback(true)}
      />
      <TouchableOpacity disabled={!photo.page} onPress={() => photo.page && Linking.openURL(photo.page)}>
        <Text style={st.credit}>Foto: Wikipedia{photo.page ? ' · ver artículo y créditos' : ''}</Text>
      </TouchableOpacity>
    </View>
  );
}

const st = StyleSheet.create({
  wrap: { marginTop: 10, marginBottom: 4 },
  box: { width: '100%', borderRadius: 10, backgroundColor: '#2A241E' },
  center: { alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  credit: { color: '#A99C88', fontSize: 11, marginTop: 4 },
  thumb: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: '#2A241E',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImg: { width: '100%', height: '100%' },
  thumbNone: { fontSize: 26 },
});
