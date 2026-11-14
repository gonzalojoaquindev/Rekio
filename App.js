// Gion Audioguía — MVP
// Pegar este archivo completo como App.js en https://snack.expo.dev
// Dependencias (Snack las detecta solo): expo-location, expo-speech, expo-keep-awake

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  StatusBar,
  Switch,
} from 'react-native';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import { useKeepAwake } from 'expo-keep-awake';

// ─────────────────────────────────────────────────────────────
// 1. CONTENIDO: puntos del recorrido
//    type: 'historia'   → hechos documentados
//          'recreacion' → escena imaginada, basada en hechos y costumbres
//    radius: metros alrededor del punto donde se activa el relato
// ─────────────────────────────────────────────────────────────
const POINTS = [
  {
    id: 'ikedaya',
    name: 'El incidente del Ikedaya',
    jp: '池田屋事件跡',
    lat: 35.00885,
    lng: 135.76995,
    radius: 35,
    type: 'recreacion',
    story:
      'Estás junto al lugar donde estuvo la posada Ikedaya, en la calle Sanjō. Hoy hay un restaurante y una piedra conmemorativa, pero aquí ocurrió uno de los episodios más famosos del fin de los samuráis. Lo que sigue es una recreación basada en los hechos. ' +
      'Noche del 8 de julio de 1864. Es temporada del Gion Matsuri y la ciudad está llena de gente y de faroles. En el segundo piso de la posada, un grupo de samuráis rebeldes, sobre todo de los dominios de Chōshū y Tosa, discute en voz baja. Quieren acabar con el shogunato. Según la confesión de un detenido, incluso hablaban de incendiar la ciudad aprovechando el viento. ' +
      'Abajo, en la calle, se detiene un pequeño grupo de hombres armados. Es el Shinsengumi, la policía del shogunato, liderada por Kondō Isami. Kondō anuncia una inspección oficial y entran. La pelea se libra en pasillos oscuros y escaleras estrechas. Varios rebeldes mueren o son capturados, y el Shinsengumi pasa de ser una banda mal mirada a ser famoso en todo Japón. ' +
      'Pero la victoria les duró poco. La represión enfureció a Chōshū, y apenas cuatro años después, el shogunato que defendían había caído.',
  },
  {
    id: 'okuni',
    name: 'Estatua de Izumo no Okuni',
    jp: '出雲阿国像',
    lat: 35.00395,
    lng: 135.77075,
    radius: 35,
    type: 'historia',
    story:
      'Estás en el extremo este del puente de Shijō, sobre el río Kamo. Mira la estatua de la mujer con abanico y espada: es Izumo no Okuni. ' +
      'Cerca del año 1603, justo cuando Tokugawa Ieyasu se convertía en shōgun, esta mujer, que según la tradición había servido en el gran santuario de Izumo, empezó a bailar aquí abajo, en el lecho seco del río. Vestía ropa de hombre, llevaba una espada, y la gente de Kioto enloquecía con su espectáculo. ' +
      'Lo llamaban kabuki, de la palabra kabuku: inclinarse, salirse de lo normal. Ese fue el nacimiento del teatro kabuki. ' +
      'Pero el éxito duró poco para las mujeres. En 1629 el shogunato les prohibió actuar, y desde entonces todos los papeles, también los femeninos, los interpretan hombres. A esos actores especializados en papeles de mujer se les llama onnagata. ' +
      'Ahora cruza la calle: el gran edificio de enfrente es el heredero de esta historia.',
  },
  {
    id: 'minamiza',
    name: 'Teatro Minamiza',
    jp: '南座',
    lat: 35.00385,
    lng: 135.77195,
    radius: 40,
    type: 'historia',
    story:
      'Este edificio con aire de castillo es el Minamiza. A comienzos del período Edo, el gobierno autorizó varios teatros a lo largo de esta calle, y el Minamiza se considera el último sobreviviente de aquellas licencias. Por eso se presenta como el teatro de kabuki con el linaje más antiguo de Japón. El edificio que ves es más reciente, de 1929. ' +
      'Si pasas por aquí a fines de noviembre o en diciembre, fíjate en la fachada. Cuelgan grandes tablas de madera con los nombres de los actores escritos en una caligrafía gruesa y redonda. Se llaman maneki, y anuncian el kaomise, la función más importante del año, donde se presentan las grandes estrellas. ' +
      'Una curiosidad: esa letra se escribe con trazos gordos y apretados, casi sin espacios en blanco, porque se dice que así se desea un teatro lleno hasta el último asiento.',
  },
  {
    id: 'tatsumi',
    name: 'Puente Tatsumi y canal Shirakawa',
    jp: '巽橋・白川',
    lat: 35.00506,
    lng: 135.77458,
    radius: 35,
    type: 'historia',
    story:
      'Estás en el puentecito Tatsumi, sobre el canal Shirakawa, uno de los rincones más fotografiados de Kioto. Mira las casas de madera con persianas de bambú sobre el agua y los sauces llorones: así lucía buena parte de Gion en sus tiempos de esplendor. ' +
      'Al lado del puente está el pequeño santuario Tatsumi Daimyōjin. Las maiko y geiko vienen a rezarle para mejorar en sus artes: danza, música y canto. ' +
      'Si tienes suerte, verás a alguna pasar al anochecer camino a su cita, con pasos cortos y rápidos. Una nota de respeto: no son una atracción turística, van a trabajar. En Gion se han puesto carteles que prohíben fotografiar en las calles privadas, así que si te cruzas con una, déjala pasar tranquila.',
  },
  {
    id: 'kanikakuni',
    name: 'Monumento Kanikakuni',
    jp: 'かにかくに碑',
    lat: 35.00525,
    lng: 135.77395,
    radius: 30,
    type: 'historia',
    story:
      'A pocos pasos, junto al canal, hay una piedra con un poema grabado. Es el monumento Kanikakuni, dedicado al poeta Yoshii Isamu, que amó Gion a comienzos del siglo veinte. ' +
      'Su poema dice, más o menos, que pase lo que pase, añora Gion, y que incluso al dormir siente el agua correr bajo su almohada. Habla de las casas de té de esa época, construidas justo encima de este canal, con el agua pasando literalmente bajo los cuartos. ' +
      'Cada noviembre se celebra aquí el Kanikakuni-sai: las geiko y maiko vienen a dejar flores frente a la piedra en recuerdo del poeta.',
  },
  {
    id: 'ichiriki',
    name: 'Hanamikoji e Ichiriki Chaya',
    jp: '花見小路・一力亭',
    lat: 35.00367,
    lng: 135.77505,
    radius: 35,
    type: 'recreacion',
    story:
      'Estás en la entrada de Hanamikoji, y esa casa de muros rojo oscuro en la esquina es la Ichiriki, la casa de té más famosa de Gion. Lo que sigue es una recreación, basada en las costumbres y leyendas del lugar. ' +
      'Kioto, primavera de 1865. Faltan tres años para que caiga el shogunato. Un samurái de un dominio del sur camina por esta calle sin linterna, con el sombrero bajo. La ciudad está llena de espías y de patrullas. Se detiene frente a esta puerta. ' +
      'Adentro nadie pregunta nombres: aquí solo entra quien viene presentado por un cliente conocido. Esa regla, ichigen-san okotowari, no se atiende a desconocidos, sigue vigente hoy. Le sirven sake, una geiko toca el shamisen y, entre canciones, los hombres hablan en voz baja de alianzas que cambiarán Japón. La tradición dice que figuras como Saigō Takamori y Ōkubo Toshimichi se reunieron en esta casa. ' +
      'Y hay una leyenda más antigua: aquí, a comienzos del siglo dieciocho, Ōishi Kuranosuke, líder de los famosos 47 rōnin, habría fingido una vida de borracheras para engañar a los espías de su enemigo, mientras planeaba vengar a su señor. ' +
      'Un último secreto. Se cuenta que la casa se llamaba antes Man-ya, escrita con el carácter del número diez mil. Si partes ese carácter en dos, obtienes los de uno y fuerza: ichi y riki. Ichiriki.',
  },
  {
    id: 'kaburenjo',
    name: 'Gion Kōbu Kaburenjō',
    jp: '祇園甲部歌舞練場',
    lat: 35.00135,
    lng: 135.77525,
    radius: 40,
    type: 'historia',
    story:
      'Este teatro de tejas al fondo del jardín es el Gion Kōbu Kaburenjō, el escenario de las geiko y maiko de Gion. Su historia empieza con una crisis. ' +
      'En 1869 el emperador se trasladó a Tokio, y Kioto, que había sido capital durante más de mil años, de pronto se quedó sin corte, sin nobles y con el futuro en duda. La ciudad respondió con orgullo: en 1872 organizó una gran exposición para atraer visitantes, y para ella se creó un espectáculo de danza, el Miyako Odori, las danzas de la capital. ' +
      'Desde entonces, cada abril, las maiko y geiko de Gion bailan aquí en filas perfectas, con kimonos iguales. Y si una tarde escuchas un shamisen a lo lejos, puede que estén ensayando: en Gion la formación en danza y música dura toda la vida.',
  },
  {
    id: 'kenninji',
    name: 'Templo Kennin-ji',
    jp: '建仁寺',
    lat: 35.0008,
    lng: 135.774,
    radius: 60,
    type: 'historia',
    story:
      'Has llegado a Kennin-ji, el templo zen más antiguo de Kioto. Fue fundado en 1202 por el monje Eisai, que había viajado a China a estudiar el zen. ' +
      'Eisai trajo algo más que doctrina: promovió el cultivo y el consumo de té verde en Japón, e incluso escribió un libro sobre sus beneficios para la salud. Así que la cultura del té que hoy asociamos con Kioto tiene una de sus raíces aquí. ' +
      'Si entras, mira el techo del salón del Dharma: dos dragones enormes se enroscan sobre tu cabeza. Parecen antiguos, pero fueron pintados en 2002 por el artista Koizumi Junsaku, para celebrar los 800 años del templo. ' +
      'Busca también el biombo de Fūjin y Raijin, los dioses del viento y del trueno, de Tawaraya Sōtatsu, una de las obras más famosas del arte japonés. El que se exhibe es una reproducción: el original se conserva en el Museo Nacional de Kioto.',
  },
  {
    id: 'yasui',
    name: 'Santuario Yasui Konpiragū',
    jp: '安井金比羅宮',
    lat: 35.00025,
    lng: 135.77655,
    radius: 35,
    type: 'historia',
    story:
      'Este pequeño santuario es Yasui Konpiragū, famoso por algo poco común: aquí se viene a cortar lazos. ' +
      'Mira la gran piedra cubierta de papeles blancos, con un agujero en el centro. La costumbre es escribir tu deseo en un papel y atravesar el agujero arrastrándote: primero de adelante hacia atrás, para cortar lo que te hace daño, una mala relación, un vicio, una enfermedad; y luego de atrás hacia adelante, para atraer buenos lazos. Al final pegas tu papel en la piedra, y por eso parece una criatura peluda de papel. ' +
      'Aunque se asocia sobre todo al amor, la gente viene a cortar de todo: con malos trabajos, con deudas o con el cigarro.',
  },
  {
    id: 'yasakato',
    name: 'Pagoda de Yasaka',
    jp: '八坂の塔（法観寺）',
    lat: 34.99855,
    lng: 135.77925,
    radius: 50,
    type: 'historia',
    story:
      'Esa pagoda de cinco pisos que aparece entre las casas es uno de los símbolos del este de Kioto: la Pagoda de Yasaka, del templo Hōkan-ji. ' +
      'Según la tradición, el templo fue fundado por el príncipe Shōtoku a fines del siglo sexto, mucho antes de que existiera Kioto como capital. La pagoda se quemó varias veces; la que ves fue reconstruida en 1440 por el shōgun Ashikaga Yoshinori, y mide unos 46 metros. ' +
      'Se cuenta que los señores de la guerra que tomaban Kioto izaban su estandarte en lo alto de esta pagoda, para que toda la ciudad supiera quién mandaba.',
  },
  {
    id: 'yasaka',
    name: 'Santuario Yasaka',
    jp: '八坂神社',
    lat: 35.0037,
    lng: 135.7776,
    radius: 45,
    type: 'historia',
    story:
      'Frente a ti, la puerta bermellón que cierra la calle Shijō es la puerta oeste del santuario Yasaka. Todo el barrio de Gion nació alrededor de este santuario: hasta 1868 se llamaba Gion-sha, y de ahí viene el nombre del barrio. ' +
      'Las primeras casas de té eran simples puestos que servían té y dulces a los peregrinos. Con los siglos se convirtieron en los salones elegantes donde trabajan las geiko. ' +
      'En el año 869, cuando una epidemia azotaba la capital, se hizo un ritual para calmar a los espíritus: se levantaron 66 alabardas, una por cada provincia de Japón. Ese ritual es el origen del Gion Matsuri, que hoy dura todo julio y es uno de los festivales más famosos del país. ' +
      'El dios principal de este santuario es Susanoo, el impetuoso dios de las tormentas, hermano de la diosa del sol. Si entras de noche, verás el escenario de danza iluminado por cientos de faroles, cada uno con el nombre de un negocio que hizo una donación.',
  },
  {
    id: 'maruyama',
    name: 'Parque Maruyama',
    jp: '円山公園',
    lat: 35.0037,
    lng: 135.7803,
    radius: 50,
    type: 'historia',
    story:
      'Detrás del santuario se abre el parque Maruyama, el parque público más antiguo de Kioto, inaugurado en 1886. ' +
      'Su gran estrella es un cerezo llorón, conocido como el cerezo nocturno de Gion. En primavera lo iluminan de noche y miles de personas hacen picnic bajo sus ramas. ' +
      'Una curiosidad: el árbol que ves no es el original. El primero murió a mediados del siglo veinte, ya muy viejo, y el actual creció de una semilla del anterior. Es, literalmente, su hijo. ' +
      'En noviembre no hay flores, pero los arces del parque y de las colinas de Higashiyama se ponen rojos: es la otra gran temporada de Kioto, el momiji.',
  },
];

// ─────────────────────────────────────────────────────────────
// 2. UTILIDADES GEO
// ─────────────────────────────────────────────────────────────
const toRad = (x) => (x * Math.PI) / 180;
const toDeg = (x) => (x * 180) / Math.PI;

function distanceM(a, b) {
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function bearingDeg(a, b) {
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const dLng = toRad(b.lng - a.lng);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

const DIRS = ['norte', 'noreste', 'este', 'sureste', 'sur', 'suroeste', 'oeste', 'noroeste'];
const dirName = (deg) => DIRS[Math.round(deg / 45) % 8];

const fmtDist = (m) => (m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`);

// ─────────────────────────────────────────────────────────────
// 3. APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  useKeepAwake(); // mantiene la pantalla encendida mientras la app está abierta

  const [gps, setGps] = useState(null); // { lat, lng, acc }
  const [gpsError, setGpsError] = useState(null);
  const [sim, setSim] = useState(null); // ubicación simulada { lat, lng, label }
  const [auto, setAuto] = useState(true);
  const [speakingId, setSpeakingId] = useState(null);
  const [heard, setHeard] = useState(new Set());
  const [expandedId, setExpandedId] = useState(null);
  const [voice, setVoice] = useState(null);

  // refs para que los callbacks de voz vean siempre el estado actual
  const speakingRef = useRef(null);
  const queueRef = useRef([]);
  const heardRef = useRef(new Set());

  const here = sim || gps;

  // ── Voz en español ──
  useEffect(() => {
    Speech.getAvailableVoicesAsync()
      .then((voices) => {
        const es = voices.filter((v) => v.language && v.language.toLowerCase().startsWith('es'));
        const pick =
          es.find((v) => /es[-_](us|mx|419|cl)/i.test(v.language)) || es[0] || null;
        setVoice(pick);
      })
      .catch(() => {});
    return () => Speech.stop();
  }, []);

  // ── GPS ──
  useEffect(() => {
    let sub = null;
    let cancelled = false;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsError('Sin permiso de ubicación. Actívalo en Ajustes para usar el modo guía.');
        return;
      }
      const s = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 3000,
          distanceInterval: 3,
        },
        (loc) =>
          setGps({
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            acc: loc.coords.accuracy,
          })
      );
      if (cancelled) s.remove();
      else sub = s;
    })().catch((e) => setGpsError(String(e.message || e)));
    return () => {
      cancelled = true;
      if (sub) sub.remove();
    };
  }, []);

  // ── Narración ──
  const markHeard = useCallback((id) => {
    heardRef.current = new Set(heardRef.current).add(id);
    setHeard(heardRef.current);
  }, []);

  const speakPoint = useCallback(
    (p, arrived = false) => {
      Speech.stop();
      speakingRef.current = p.id;
      setSpeakingId(p.id);

      const intro = arrived ? `Has llegado a: ${p.name}. ` : `${p.name}. `;
      const tag = p.type === 'recreacion' ? 'Recreación histórica. ' : '';

      const finish = (completed) => {
        if (speakingRef.current !== p.id) return; // ya empezó otro relato
        speakingRef.current = null;
        setSpeakingId(null);
        if (completed) {
          markHeard(p.id);
          playNext();
        }
      };

      Speech.speak(intro + tag + p.story, {
        language: voice ? voice.language : 'es-US',
        voice: voice ? voice.identifier : undefined,
        rate: 0.95,
        pitch: 1.0,
        onDone: () => finish(true),
        onStopped: () => finish(false),
        onError: () => finish(false),
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [voice, markHeard]
  );

  const playNext = useCallback(() => {
    while (queueRef.current.length) {
      const id = queueRef.current.shift();
      if (!heardRef.current.has(id)) {
        const p = POINTS.find((x) => x.id === id);
        if (p) {
          speakPoint(p, true);
          return;
        }
      }
    }
  }, [speakPoint]);

  const stop = useCallback(() => {
    queueRef.current = [];
    speakingRef.current = null;
    setSpeakingId(null);
    Speech.stop();
  }, []);

  // ── Disparo automático por cercanía ──
  useEffect(() => {
    if (!auto || !here) return;
    const inside = POINTS.map((p) => ({ p, d: distanceM(here, p) }))
      .filter(
        ({ p, d }) =>
          d <= p.radius &&
          !heardRef.current.has(p.id) &&
          speakingRef.current !== p.id &&
          !queueRef.current.includes(p.id)
      )
      .sort((a, b) => a.d - b.d)
      .map(({ p }) => p.id);
    if (!inside.length) return;
    queueRef.current.push(...inside);
    if (!speakingRef.current) playNext();
  }, [here, auto, playNext]);

  // ── Lista ordenada por distancia ──
  const rows = useMemo(() => {
    const list = POINTS.map((p, i) => ({
      p,
      order: i + 1,
      d: here ? distanceM(here, p) : null,
      dir: here ? dirName(bearingDeg(here, p)) : null,
    }));
    if (here) list.sort((a, b) => a.d - b.d);
    return list;
  }, [here]);

  const nearest = here ? rows.find((r) => !heard.has(r.p.id)) : null;
  const speakingPoint = POINTS.find((p) => p.id === speakingId);

  const openMaps = (p) =>
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=walking`
    );

  const simulateAt = (p) => {
    setSim({ lat: p.lat, lng: p.lng, label: p.name });
    setExpandedId(null);
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.ink} />
      <ScrollView contentContainerStyle={s.scroll}>
        {/* Encabezado */}
        <Text style={s.kanji}>祇園</Text>
        <Text style={s.title}>Rekio · Gion</Text>
        <Text style={s.subtitle}>Kioto — camina y escucha</Text>

        {/* Estado de ubicación */}
        <View style={s.card}>
          {sim ? (
            <>
              <Text style={s.cardLabel}>UBICACIÓN SIMULADA</Text>
              <Text style={s.cardText}>{sim.label}</Text>
              <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={() => setSim(null)}>
                <Text style={s.btnGhostText}>Volver al GPS real</Text>
              </TouchableOpacity>
            </>
          ) : gpsError ? (
            <Text style={s.error}>{gpsError}</Text>
          ) : gps ? (
            <>
              <Text style={s.cardLabel}>GPS ACTIVO</Text>
              <Text style={s.cardText}>Precisión ±{Math.round(gps.acc || 0)} m</Text>
            </>
          ) : (
            <Text style={s.cardText}>Buscando señal GPS…</Text>
          )}

          <View style={s.row}>
            <Text style={s.cardText}>Narración automática</Text>
            <Switch
              value={auto}
              onValueChange={setAuto}
              trackColor={{ true: C.vermilion, false: '#555' }}
              thumbColor={C.paper}
            />
          </View>
          <Text style={s.small}>
            Escuchados: {heard.size}/{POINTS.length}
            {voice ? `  ·  Voz: ${voice.language}` : '  ·  Voz: predeterminada'}
          </Text>
        </View>

        {/* Reproduciendo */}
        {speakingPoint && (
          <View style={[s.card, s.playing]}>
            <Text style={s.cardLabel}>▶ ESCUCHANDO</Text>
            <Text style={s.playingTitle}>{speakingPoint.name}</Text>
            <TouchableOpacity style={s.btn} onPress={stop}>
              <Text style={s.btnText}>■ Detener</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Próximo punto */}
        {nearest && !speakingPoint && (
          <View style={s.card}>
            <Text style={s.cardLabel}>PRÓXIMO PUNTO</Text>
            <Text style={s.playingTitle}>{nearest.p.name}</Text>
            <Text style={s.cardText}>
              A {fmtDist(nearest.d)} hacia el {nearest.dir}
            </Text>
          </View>
        )}

        {/* Lista */}
        <Text style={s.section}>Puntos del recorrido</Text>
        {rows.map(({ p, order, d, dir }) => {
          const open = expandedId === p.id;
          const isHeard = heard.has(p.id);
          const isPlaying = speakingId === p.id;
          return (
            <View key={p.id} style={[s.item, isHeard && s.itemHeard]}>
              <TouchableOpacity onPress={() => setExpandedId(open ? null : p.id)}>
                <View style={s.itemHead}>
                  <Text style={s.num}>{isHeard ? '✓' : order}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.itemName}>{p.name}</Text>
                    <Text style={s.itemJp}>{p.jp}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    {d != null && <Text style={s.dist}>{fmtDist(d)}</Text>}
                    {d != null && <Text style={s.small}>{dir}</Text>}
                  </View>
                </View>
                {p.type === 'recreacion' && <Text style={s.badge}>RECREACIÓN</Text>}
              </TouchableOpacity>

              {open && (
                <View style={s.itemBody}>
                  <View style={s.actions}>
                    <TouchableOpacity
                      style={s.btn}
                      onPress={() => (isPlaying ? stop() : speakPoint(p))}
                    >
                      <Text style={s.btnText}>{isPlaying ? '■ Detener' : '▶ Escuchar'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={() => openMaps(p)}>
                      <Text style={s.btnGhostText}>Cómo llegar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.btn, s.btnGhost]} onPress={() => simulateAt(p)}>
                      <Text style={s.btnGhostText}>Simular aquí</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={s.story}>{p.story}</Text>
                </View>
              )}
            </View>
          );
        })}

        <Text style={s.footer}>
          Los relatos marcados como recreación son escenas imaginadas a partir de hechos y
          tradiciones del lugar.
        </Text>
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. ESTILOS
// ─────────────────────────────────────────────────────────────
const C = {
  ink: '#16130F',
  card: '#221D18',
  line: '#3A322A',
  paper: '#F3EADB',
  muted: '#A99C88',
  vermilion: '#C8402E',
  gold: '#C9A45C',
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.ink },
  scroll: { padding: 18, paddingTop: 52, paddingBottom: 60 },
  kanji: { color: C.vermilion, fontSize: 44, fontWeight: '700' },
  title: { color: C.paper, fontSize: 26, fontWeight: '700', marginTop: 2 },
  subtitle: { color: C.muted, fontSize: 14, marginBottom: 18 },
  card: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.line,
  },
  playing: { borderColor: C.vermilion },
  cardLabel: { color: C.gold, fontSize: 11, letterSpacing: 1.5, fontWeight: '700', marginBottom: 4 },
  cardText: { color: C.paper, fontSize: 15 },
  playingTitle: { color: C.paper, fontSize: 19, fontWeight: '700', marginBottom: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  small: { color: C.muted, fontSize: 12, marginTop: 6 },
  error: { color: '#FF8A7A', fontSize: 14 },
  section: { color: C.muted, fontSize: 12, letterSpacing: 1.5, marginTop: 10, marginBottom: 8 },
  item: {
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: C.line,
  },
  itemHeard: { opacity: 0.6 },
  itemHead: { flexDirection: 'row', alignItems: 'center' },
  num: { color: C.vermilion, fontSize: 18, fontWeight: '700', width: 30 },
  itemName: { color: C.paper, fontSize: 16, fontWeight: '600' },
  itemJp: { color: C.muted, fontSize: 13, marginTop: 2 },
  dist: { color: C.paper, fontSize: 15, fontWeight: '600' },
  badge: {
    alignSelf: 'flex-start',
    color: C.gold,
    borderColor: C.gold,
    borderWidth: 1,
    borderRadius: 4,
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 8,
    marginLeft: 30,
    letterSpacing: 1,
  },
  itemBody: { marginTop: 12 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  btn: {
    backgroundColor: C.vermilion,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  btnText: { color: C.paper, fontWeight: '700', fontSize: 14 },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: C.line },
  btnGhostText: { color: C.paper, fontSize: 14 },
  story: { color: C.paper, fontSize: 15, lineHeight: 23, opacity: 0.9 },
  footer: { color: C.muted, fontSize: 12, marginTop: 18, lineHeight: 18 },
});
