// Estampilla de un recorrido completado (estilo sello de pasaporte).
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Path, Polygon, Ellipse } from 'react-native-svg';
import { C } from '../theme';

const ICONS = {
  pagoda:
    'M24 3 L24 9 M12 16 Q24 8 36 16 M16 16 L16 22 M32 16 L32 22 M10 28 Q24 19 38 28 M14 28 L14 34 M34 28 L34 34 M8 40 Q24 31 40 40 M12 40 L12 45 M36 40 L36 45 M8 45 L40 45',
  lantern: 'M18 7 L30 7 M24 3 L24 7 M14 18 L34 18 M13 24 L35 24 M14 30 L34 30 M18 41 L30 41 M24 41 L24 45',
  palace: 'M4 20 Q24 6 44 20 M8 20 L40 20 M12 20 L12 40 M24 20 L24 40 M36 20 L36 40 M6 40 L42 40 M4 44 L44 44',
  gate: 'M4 10 Q24 4 44 10 M8 16 L40 16 M14 10 L14 44 M34 10 L34 44',
  mountain: 'M4 40 L18 14 L26 26 L32 18 L44 40 Z',
  bamboo:
    'M17 45 L17 4 M14 13 L20 13 M14 24 L20 24 M14 35 L20 35 M31 45 L31 9 M28 19 L34 19 M28 30 L34 30 M17 19 Q9 16 5 9 M17 30 Q10 29 6 24 M31 14 Q38 10 43 4 M31 25 Q39 23 43 18',
  pavilion:
    'M24 3 L24 7 M13 12 Q24 6 35 12 M16 12 L16 19 M32 12 L32 19 M24 12 L24 19 M10 22 Q24 15 38 22 M13 22 L13 31 M35 22 L35 31 M24 22 L24 31 M7 34 Q24 26 41 34 M10 34 L10 44 M38 34 L38 44 M24 34 L24 44 M5 44 L43 44',
  // Barco de vela (La Serena 1680)
  ship: 'M8 32 L40 32 L35 40 L13 40 Z M24 32 L24 8 M24 10 L36 28 L24 28 M24 12 L14 28 L24 28',
  // Ciervo de Nara: cabeza y astas
  deer: 'M18 22 L24 40 L30 22 Z M18 22 L12 20 M30 22 L36 20 M20 22 L16 12 M16 12 L11 7 M16 12 L18 5 M28 22 L32 12 M32 12 L37 7 M32 12 L30 5 M22 38 L26 38',
  building: 'M10 44 L10 14 L26 14 L26 44 M26 22 L38 22 L38 44 M6 44 L42 44 M15 20 L15 22 M21 20 L21 22 M15 28 L15 30 M21 28 L21 30 M15 36 L15 38 M21 36 L21 38 M32 30 L32 32',
};

function Icon({ name, color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {name === 'lantern' && <Ellipse cx="24" cy="24" rx="11" ry="16" stroke={color} strokeWidth="3" fill="none" />}
      <Path
        d={ICONS[name] || ICONS.building}
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Outline({ shape, w, h, color, dashed }) {
  const sw = 3.5;
  const dash = dashed ? '7 6' : undefined;
  const common = { stroke: color, strokeWidth: sw, fill: '#FFFFFF', strokeDasharray: dash };
  return (
    <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
      {shape === 'pill' && <Rect x={sw} y={sw} width={w - sw * 2} height={h - sw * 2} rx={(h - sw * 2) / 2} {...common} />}
      {shape === 'square' && <Rect x={sw} y={sw} width={w - sw * 2} height={h - sw * 2} rx={14} {...common} />}
      {shape === 'circle' && <Circle cx={w / 2} cy={h / 2} r={Math.min(w, h) / 2 - sw} {...common} />}
      {shape === 'hex' && (
        <Polygon
          points={`${w * 0.25},${sw} ${w * 0.75},${sw} ${w - sw},${h / 2} ${w * 0.75},${h - sw} ${w * 0.25},${h - sw} ${sw},${h / 2}`}
          {...common}
        />
      )}
    </Svg>
  );
}

const ROT = { pill: '-2deg', square: '3deg', circle: '-4deg', hex: '2deg' };

export default function Stamp({ stamp, title, cc, locked = false, size = 150 }) {
  const shape = stamp.shape || 'square';
  const color = locked ? C.faint : stamp.color;
  const w = shape === 'pill' ? size * 1.45 : size;
  const h = size;
  const pad = shape === 'circle' ? size * 0.2 : size * 0.12;
  return (
    <View style={{ width: w, height: h, transform: [{ rotate: locked ? '0deg' : ROT[shape] }] }}>
      <Outline shape={shape} w={w} h={h} color={color} dashed={locked} />
      <View style={[st.inner, { padding: pad }]}>
        <Text numberOfLines={1} style={[st.title, { color, fontSize: size * 0.15 }]}>
          {title}
        </Text>
        <View style={{ opacity: locked ? 0.5 : 1 }}>
          {locked ? (
            <Text style={[st.q, { color, fontSize: size * 0.3 }]}>?</Text>
          ) : (
            <Icon name={stamp.icon} color={color} size={size * 0.36} />
          )}
        </View>
        <View style={st.foot}>
          <Text style={[st.cc, { color, fontSize: size * 0.1 }]}>{cc}</Text>
          <Text style={[st.mark, { color, fontSize: size * 0.1 }]}>R</Text>
        </View>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  inner: { flex: 1, alignItems: 'center', justifyContent: 'space-between' },
  title: { fontWeight: '800', letterSpacing: 0.3 },
  q: { fontWeight: '800' },
  foot: { flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch', paddingHorizontal: '8%' },
  cc: { fontWeight: '800' },
  mark: { fontWeight: '900' },
});
