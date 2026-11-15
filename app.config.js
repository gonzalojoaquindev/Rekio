// Configuración dinámica: agrega la clave de Google Maps desde una variable de entorno.
// En GitHub Actions viene del secreto GOOGLE_MAPS_API_KEY (nunca se guarda en el código).
module.exports = ({ config }) => {
  const key = process.env.GOOGLE_MAPS_API_KEY || '';
  return {
    ...config,
    plugins: [...(config.plugins || []), ['react-native-maps', key ? { androidGoogleMapsApiKey: key } : {}]],
    extra: { ...(config.extra || {}), hasGoogleMaps: !!key },
  };
};
