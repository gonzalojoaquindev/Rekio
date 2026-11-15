// Motor de la guía: ubicación, narración automática, recorrido guiado y navegación por voz.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { PLACES } from './data/places';
import { TOURS } from './data/tours';
import { distanceM, distToPolylineM, fmtDist, placeById, tourStats, bearingDeg, dirName } from './geo';
import { say, stopSpeaking, onSpeakingChange, speakingKey, isSpeaking, placeNarration, loadVoices } from './speech';
import { fetchWalkingRoute } from './nav';
import { useStore } from './store';
import { playMusic, stopMusic, duckMusic } from './music';

const Ctx = createContext(null);
export const tourById = (id) => TOURS.find((t) => t.id === id);

// Orden de las paradas: original, al revés o empezando por la más cercana
export function buildOrder(def, mode, from) {
  const n = def.stops.length;
  const idx = [...Array(n).keys()];
  if (mode === 'reverse') return idx.reverse();
  if (mode !== 'nearest' || !from) return idx;
  // vecino más cercano: siempre camina a la parada pendiente más próxima
  const left = new Set(idx);
  const order = [];
  let cur = from;
  while (left.size) {
    let best = null;
    let bestD = Infinity;
    left.forEach((i) => {
      const d = distanceM(cur, placeById(def.stops[i].id));
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    order.push(best);
    left.delete(best);
    cur = placeById(def.stops[best].id);
  }
  return order;
}

// Parada en la posición pos del recorrido activo
export const stopAt = (t, pos) => tourById(t.id).stops[t.order ? t.order[pos] : pos];
const isOriginal = (t) => !t.order || t.order.every((v, i) => v === i);

const words = (m) => (m < 1000 ? `${Math.round(m / 10) * 10} metros` : `${(m / 1000).toFixed(1).replace('.', ',')} kilómetros`);

export function TourProvider({ children }) {
  const store = useStore();
  const [gps, setGps] = useState(null);
  const [gpsError, setGpsError] = useState(null);
  const [sim, setSim] = useState(null);
  const [tour, setTour] = useState(null); // { id, idx, phase, simulate }
  const [speaking, setSpeaking] = useState(null); // key de lo que se narra
  const [leg, setLeg] = useState(null); // { idx, line, steps, meters }
  const [navMsg, setNavMsg] = useState(null); // { arrow, text, dist }

  const here = sim || gps;
  const tourRef = useRef(null);
  const legRef = useRef(null);
  const hereRef = useRef(null);
  const storeRef = useRef(store);
  const simTimer = useRef(null);
  const lastRouteAt = useRef(0);
  hereRef.current = here;
  storeRef.current = store;

  // ── Voz ──
  useEffect(() => onSpeakingChange(setSpeaking), []);
  useEffect(() => {
    if (store.loaded) loadVoices(store.settings.voiceId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.loaded]);

  // Música de fondo: suena durante el recorrido y baja cuando habla la guía
  const musicOn = !!tour && store.settings.music !== false;
  useEffect(() => {
    if (musicOn) playMusic(tour.id, isSpeaking());
    else stopMusic();
  }, [musicOn, tour && tour.id]);
  useEffect(() => {
    const off = onSpeakingChange((k) => duckMusic(!!k));
    return () => {
      off();
      stopMusic();
    };
  }, []);

  // ── GPS ──
  useEffect(() => {
    let sub = null;
    let cancelled = false;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsError('Sin permiso de ubicación');
        return;
      }
      const s = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 2000, distanceInterval: 2 },
        (loc) => setGps({ lat: loc.coords.latitude, lng: loc.coords.longitude, acc: loc.coords.accuracy })
      );
      if (cancelled) s.remove();
      else sub = s;
    })().catch((e) => setGpsError(String(e.message || e)));
    return () => {
      cancelled = true;
      if (sub) sub.remove();
      clearTimeout(simTimer.current);
      stopSpeaking();
    };
  }, []);

  const setTourState = (t) => {
    tourRef.current = t;
    setTour(t);
  };
  const setLegState = (l) => {
    legRef.current = l;
    setLeg(l);
  };

  const def = (t) => tourById(t.id);
  const stopPlace = (t, idx) => placeById(stopAt(t, idx).id);

  // ── Narrar un lugar cualquiera (desde una ficha o el mapa) ──
  const playPlace = useCallback((id) => {
    const p = placeById(id);
    if (!p) return;
    say(placeNarration(p, false), { key: `place:${p.id}`, onDone: () => storeRef.current.markHeard(p.id) });
  }, []);

  // ── Recorrido guiado ──
  const stopSimWalk = () => clearTimeout(simTimer.current);

  // En simulación: camina sola por la ruta (o salta al punto si no hay ruta)
  const simulateWalk = (idx) => {
    stopSimWalk();
    const t = tourRef.current;
    if (!t || !t.simulate) return;
    const target = stopPlace(t, idx);
    const l = legRef.current;
    const line = l && l.idx === idx && l.line && l.line.length > 1 ? l.line : null;
    if (!line) {
      simTimer.current = setTimeout(() => setSim({ lat: target.lat, lng: target.lng }), 1500);
      return;
    }
    let i = 0;
    const tick = () => {
      const cur = tourRef.current;
      if (!cur || cur.idx !== idx || cur.phase !== 'going') return;
      i = Math.min(i + 1, line.length - 1);
      setSim({ lat: line[i][0], lng: line[i][1] });
      if (i < line.length - 1) simTimer.current = setTimeout(tick, 450);
      else setSim({ lat: target.lat, lng: target.lng });
    };
    simTimer.current = setTimeout(tick, 800);
  };

  const requestLeg = async (idx) => {
    const t = tourRef.current;
    const from = hereRef.current;
    if (!t || !from) return;
    const target = stopPlace(t, idx);
    lastRouteAt.current = Date.now();
    try {
      const r = await fetchWalkingRoute(from, target);
      const cur = tourRef.current;
      if (r && cur && cur.idx === idx) setLegState({ idx, ...r });
    } catch (_) {
      // sin ruta: queda la guía por distancia y dirección
    }
  };

  const giveDirections = (idx, prefix = '') => {
    const t = { ...tourRef.current, idx, phase: 'guiding' };
    setTourState(t);
    setLegState(null);
    setNavMsg(null);
    requestLeg(idx);
    const st = stopAt(t, idx);
    let guide = st.guide;
    if (!isOriginal(t)) {
      // con otro orden, las indicaciones originales ("desde el puente…") no sirven
      const p = placeById(st.id);
      const from = hereRef.current;
      const where = from ? ` Está a unos ${words(distanceM(from, p))} hacia el ${dirName(bearingDeg(from, p))}.` : '';
      guide = `${idx === 0 ? 'Empezamos por' : 'Siguiente parada'}: ${p.name}.${where}${st.optional ? ' Es una parada opcional.' : ''} Sigue la ruta azul del mapa y las indicaciones de voz.`;
    }
    say(prefix + guide, {
      key: 'guide',
      onDone: () => {
        const cur = tourRef.current;
        if (!cur || cur.idx !== idx) return;
        setTourState({ ...cur, phase: 'going' });
        if (cur.simulate) simulateWalk(idx);
      },
    });
  };

  const tellStory = (idx) => {
    stopSimWalk();
    const t = tourRef.current;
    const p = stopPlace(t, idx);
    setTourState({ ...t, idx, phase: 'story' });
    setLegState(null);
    setNavMsg(null);
    say(placeNarration(p, true), {
      key: `place:${p.id}`,
      onDone: () => {
        storeRef.current.markHeard(p.id);
        const cur = tourRef.current;
        if (cur && cur.idx === idx && cur.phase === 'story') advance();
      },
    });
  };

  const advance = () => {
    const t = tourRef.current;
    if (!t) return;
    const d = def(t);
    const next = t.idx + 1;
    if (next < d.stops.length) {
      giveDirections(next);
    } else {
      setTourState({ ...t, phase: 'done' });
      storeRef.current.completeTour(t.id, { simulated: t.simulate, km: tourStats(d).km });
      say(d.outro + ' ¡Ganaste una nueva estampilla para tu pasaporte!', { key: 'guide' });
    }
  };

  const startTour = (id, simulate = false, mode = 'original') => {
    stopSimWalk();
    stopSpeaking();
    if (!simulate) setSim(null);
    const d = tourById(id);
    const order = buildOrder(d, mode, simulate ? null : hereRef.current);
    tourRef.current = { id, idx: 0, phase: 'guiding', simulate, order };
    giveDirections(0, d.intro + ' ');
  };

  const endTour = () => {
    stopSimWalk();
    const t = tourRef.current;
    setTourState(null);
    setLegState(null);
    setNavMsg(null);
    stopSpeaking();
    if (t && t.simulate) setSim(null);
  };

  // Ir a una parada concreta (anterior, siguiente o tocando el mapa)
  const goToStop = (idx) => {
    const t = tourRef.current;
    if (!t) return;
    const d = def(t);
    if (idx < 0 || idx >= d.stops.length) return;
    stopSimWalk();
    stopSpeaking();
    giveDirections(idx);
  };

  // "Ya llegué" / "Siguiente"
  const skipStep = () => {
    const t = tourRef.current;
    if (!t) return;
    stopSimWalk();
    if (t.phase === 'guiding' || t.phase === 'going') {
      if (t.simulate) {
        const p = stopPlace(t, t.idx);
        setSim({ lat: p.lat, lng: p.lng });
      }
      tellStory(t.idx);
    } else if (t.phase === 'story') {
      stopSpeaking();
      advance();
    }
  };

  const repeatStep = () => {
    const t = tourRef.current;
    if (!t) return;
    stopSimWalk();
    if (t.phase === 'story') tellStory(t.idx);
    else if (t.phase === 'done') say(def(t).outro, { key: 'guide' });
    else giveDirections(t.idx);
  };

  // ── Reacciones a cada cambio de ubicación ──
  useEffect(() => {
    if (!here) return;
    const t = tourRef.current;
    const st = storeRef.current;

    // 1) Sin recorrido: narración automática de lugares cercanos no escuchados
    if (!t) {
      if (!st.settings.auto || speakingKey()) return;
      const near = PLACES.map((p) => ({ p, d: distanceM(here, p) }))
        .filter(({ p, d }) => d <= p.radius && !st.heard.includes(p.id))
        .sort((a, b) => a.d - b.d)[0];
      if (near) {
        say(placeNarration(near.p, true), {
          key: `place:${near.p.id}`,
          onDone: () => storeRef.current.markHeard(near.p.id),
        });
      }
      return;
    }

    if (t.phase !== 'going' && t.phase !== 'guiding') return;
    const target = stopPlace(t, t.idx);
    const dist = distanceM(here, target);

    // 2) Llegada a la parada (sin cortar la indicación que se está diciendo)
    if (t.phase === 'going' && dist <= target.radius) {
      const k = speakingKey();
      if (!k || k === 'nav') tellStory(t.idx);
      return;
    }

    // 3) Indicaciones giro a giro
    const l = legRef.current;
    if (!l || l.idx !== t.idx) {
      setNavMsg({ arrow: '↑', text: 'Camina hacia la parada', dist });
      return;
    }
    // Recalcular si te saliste de la ruta (no en simulación)
    if (!t.simulate && distToPolylineM(here, l.line) > 40 && Date.now() - lastRouteAt.current > 20000) {
      requestLeg(t.idx);
      if (st.settings.turnByTurn && !speakingKey()) say('Recalculando la ruta.', { key: 'nav' });
    }
    // Próxima maniobra pendiente (se salta la salida y las que ya pasaste)
    const steps = l.steps;
    let next = null;
    for (let i = 1; i < steps.length; i++) {
      const s = steps[i];
      if (s.passed) continue;
      const d = distanceM(here, s);
      if (d < 12) {
        s.passed = true;
        continue;
      }
      next = { s, d };
      break;
    }
    if (!next || next.s.type === 'arrive') {
      setNavMsg({ arrow: '◎', text: `La parada está a ${fmtDist(dist)}`, dist });
      return;
    }
    const { s, d } = next;
    setNavMsg({ arrow: s.arrow, text: s.skip ? 'Sigue derecho' : s.text, dist: d, total: dist });
    if (!st.settings.turnByTurn || s.skip || t.phase !== 'going') return;
    const busy = speakingKey() && speakingKey() !== 'nav';
    if (busy) return;
    if (d <= 70 && d > 30 && !s.saidFar) {
      s.saidFar = true;
      say(`En ${Math.round(d / 10) * 10} metros, ${s.text.charAt(0).toLowerCase() + s.text.slice(1)}.`, { key: 'nav' });
    } else if (d <= 25 && !s.saidNear) {
      s.saidNear = s.saidFar = true;
      say(`${s.text}.`, { key: 'nav' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [here && here.lat, here && here.lng, tour && tour.phase, tour && tour.idx, leg]);

  const value = useMemo(
    () => ({
      gps,
      gpsError,
      sim,
      here,
      tour,
      leg,
      navMsg,
      speaking,
      setSim,
      startTour,
      endTour,
      goToStop,
      skipStep,
      repeatStep,
      playPlace,
      stop: stopSpeaking,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gps, gpsError, sim, tour, leg, navMsg, speaking]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useTour = () => useContext(Ctx);
