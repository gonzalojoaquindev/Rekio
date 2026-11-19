// GET /api/health: para comprobar que el servidor está arriba y configurado (no muestra la clave).
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ ok: true, app: 'rekio', claveClaude: !!process.env.ANTHROPIC_API_KEY, claveApp: !!process.env.REKIO_APP_KEY });
}
