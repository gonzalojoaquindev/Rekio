# 🎧 Rekio

Audioguía turística que te cuenta la historia de cada lugar mientras caminas. Usa el GPS para saber dónde estás y narra relatos inmersivos con la voz del teléfono, sin internet.

Recorridos en **Kioto** (24 lugares, 3 recorridos guiados):
- **Gion**: del Ikedaya al parque Maruyama (12 paradas, recorrido guiado)
- **Palacio Imperial**: Kyoto Gyoen, puerta Hamaguri, Kenreimon, Seishomon y Shishinden (5 puntos, recorrido guiado)
- **Kiyomizu-dera y Higashiyama**: Niōmon, pagoda, escenario, Okunoin, cascada Otowa, Sannenzaka, Ninenzaka y pagoda de Yasaka (8 paradas, recorrido guiado)

## Funciones
- **Barra inferior** con Explora, Mapa, Recorrido, Pasaporte y Perfil
- **Estampillas** por cada recorrido completado y **perfil** con estadísticas, fotos y ajustes
- **Indicaciones por voz giro a giro** entre paradas (OSRM sobre OpenStreetMap)
- Paradas **imperdibles** y **opcionales**, ficha de cada lugar para volver a escucharla, parada anterior y siguiente
- **Mapa** con tu ubicación, las paradas numeradas y la ruta (OpenStreetMap/CARTO, sin clave de API)
- **Recorrido guiado** del Palacio Imperial: indicaciones habladas entre paradas, progreso, "Cómo llegar" y modo simulación
- Narración automática al entrar al radio de cada punto
- Distancia y dirección al próximo punto
- Relatos históricos y recreaciones marcadas como tales
- Modo simulación para probar sin estar en el lugar
- Navegación a pie con Google Maps
- Selector de voz: elige la voz en español de mejor calidad del teléfono

## Stack
React Native · Expo SDK 58 · expo-location · expo-speech · Leaflet en WebView

## Descargar
El APK se compila automáticamente con GitHub Actions en cada push a `main`. Descárgalo desde **Releases**.
