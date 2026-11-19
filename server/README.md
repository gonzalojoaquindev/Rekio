# Servidor de Rekio

Funciones en Vercel para la app:

- `POST /api/ask`: responde preguntas sobre el capítulo que se está escuchando (Claude Haiku 5.5).
- `GET /api/health`: comprueba que el servidor está arriba y si tiene la clave configurada.

## Configuración en Vercel

1. Importa el repositorio `gonzalojoaquindev/Rekio` y elige **Root Directory: `server`**.
2. En **Settings → Environment Variables** agrega:
   - `ANTHROPIC_API_KEY`: la clave de la API de Claude (obligatoria).
   - `REKIO_APP_KEY`: opcional; si la defines, crea el mismo valor como secreto en GitHub.
   - `REKIO_DAILY_LIMIT`: opcional; preguntas por teléfono al día (por defecto 60).
3. Copia la dirección del proyecto (`https://….vercel.app`) y guárdala en GitHub como secreto `REKIO_SERVER_URL`,
   o pégala en la app: Perfil → modo calibración → Servidor de preguntas.

Las claves nunca van en el código ni en el chat.
