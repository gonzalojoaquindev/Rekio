// Íconos de línea simples (24×24)
import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export default function Icon({ name, size = 24, color = '#222', stroke = 2 }) {
  const p = { stroke: color, strokeWidth: stroke, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'search' && (
        <>
          <Circle cx="10.5" cy="10.5" r="6.5" {...p} />
          <Path d="M15.5 15.5 L21 21" {...p} />
        </>
      )}
      {name === 'map' && <Path d="M3 6 L9 3 L15 6 L21 3 L21 18 L15 21 L9 18 L3 21 Z M9 3 L9 18 M15 6 L15 21" {...p} />}
      {name === 'headphones' && (
        <>
          <Path d="M4 15 V12 a8 8 0 0 1 16 0 V15" {...p} />
          <Rect x="3" y="14" width="4.5" height="7" rx="1.8" {...p} />
          <Rect x="16.5" y="14" width="4.5" height="7" rx="1.8" {...p} />
        </>
      )}
      {name === 'suitcase' && (
        <>
          <Rect x="3" y="7" width="18" height="13" rx="2.5" {...p} />
          <Path d="M9 7 V5 a1.5 1.5 0 0 1 1.5 -1.5 h3 a1.5 1.5 0 0 1 1.5 1.5 V7 M3 12.5 H21 M8 7 V20 M16 7 V20" {...p} />
        </>
      )}
      {name === 'passport' && (
        <>
          <Rect x="5" y="2.5" width="14" height="19" rx="2" {...p} />
          <Circle cx="12" cy="10" r="3.2" {...p} />
          <Path d="M9 16.5 L15 16.5" {...p} />
        </>
      )}
      {name === 'user' && (
        <>
          <Circle cx="12" cy="8" r="4" {...p} />
          <Path d="M4 21 C4 16.5 8 15 12 15 C16 15 20 16.5 20 21" {...p} />
        </>
      )}
      {name === 'back' && <Path d="M15 5 L8 12 L15 19" {...p} />}
      {name === 'close' && <Path d="M6 6 L18 18 M18 6 L6 18" {...p} />}
      {name === 'play' && <Path d="M7 4.5 L19 12 L7 19.5 Z" {...p} fill={color} />}
      {name === 'stop' && <Rect x="6" y="6" width="12" height="12" rx="2" {...p} fill={color} />}
      {name === 'prev' && <Path d="M18 5 L9 12 L18 19 Z M6 5 L6 19" {...p} />}
      {name === 'next' && <Path d="M6 5 L15 12 L6 19 Z M18 5 L18 19" {...p} />}
      {name === 'replay' && <Path d="M4 12 a8 8 0 1 0 2.5 -5.8 M4 4 L4 8.5 L8.5 8.5" {...p} />}
      {name === 'camera' && (
        <>
          <Path d="M3 8 a2 2 0 0 1 2 -2 h2.5 l1.5 -2 h6 l1.5 2 H19 a2 2 0 0 1 2 2 v10 a2 2 0 0 1 -2 2 H5 a2 2 0 0 1 -2 -2 Z" {...p} />
          <Circle cx="12" cy="13" r="3.5" {...p} />
        </>
      )}
      {name === 'route' && (
        <>
          <Circle cx="6" cy="18" r="2.5" {...p} />
          <Circle cx="18" cy="6" r="2.5" {...p} />
          <Path d="M8.5 18 H15 a3 3 0 0 0 0 -6 H9 a3 3 0 0 1 0 -6 H15.5" {...p} />
        </>
      )}
      {name === 'clock' && (
        <>
          <Circle cx="12" cy="12" r="8.5" {...p} />
          <Path d="M12 7.5 V12 L15 14" {...p} />
        </>
      )}
      {name === 'pin' && (
        <>
          <Path d="M12 21 C12 21 5 14.5 5 9.5 a7 7 0 0 1 14 0 C19 14.5 12 21 12 21 Z" {...p} />
          <Circle cx="12" cy="9.5" r="2.5" {...p} />
        </>
      )}
      {name === 'star' && (
        <Path d="M12 3 L14.6 8.6 L20.7 9.3 L16.2 13.4 L17.4 19.5 L12 16.5 L6.6 19.5 L7.8 13.4 L3.3 9.3 L9.4 8.6 Z" {...p} />
      )}
      {name === 'check' && <Path d="M5 12.5 L10 17.5 L19 7" {...p} />}
      {name === 'plus' && <Path d="M12 5 V19 M5 12 H19" {...p} />}
      {name === 'walk' && (
        <>
          <Circle cx="13" cy="4.5" r="1.8" {...p} />
          <Path d="M10 21 L12 15 L14.5 17 L15.5 21 M12 15 L13 9.5 L9.5 11 L8.5 14 M13 9.5 L16 12.5 L18.5 13" {...p} />
        </>
      )}
    </Svg>
  );
}
