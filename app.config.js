// Configuración dinámica: claves y direcciones desde variables de entorno (nunca guardadas en el código).
// En GitHub Actions vienen de los secretos GOOGLE_MAPS_API_KEY, REKIO_SERVER_URL y REKIO_APP_KEY.
module.exports = ({ config }) => {
  const key = process.env.GOOGLE_MAPS_API_KEY || '';
  return {
    ...config,
    plugins: [
      ...(config.plugins || []),
      ['react-native-maps', key ? { androidGoogleMapsApiKey: key } : {}],
      [
        'expo-speech-recognition',
        {
          microphonePermission: 'Rekio usa el micrófono para que hagas preguntas por voz durante un recorrido.',
          speechRecognitionPermission: 'Rekio convierte tu pregunta hablada en texto.',
          androidSpeechServicePackages: ['com.google.android.googlequicksearchbox'],
        },
      ],
    ],
    extra: {
      ...(config.extra || {}),
      hasGoogleMaps: !!key,
      serverUrl: process.env.REKIO_SERVER_URL || '',
      appKey: process.env.REKIO_APP_KEY || '',
    },
  };
};
