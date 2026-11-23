# Rekio · banda sonora de las historias inmersivas.
# Paleta reutilizable de ánimos musicales, ambientes y efectos (sintetizados o grabaciones reales
# de tools/moods y tools/sfx), y un mezclador
# que los coloca frase a frase debajo de la voz.
#
# Uso: python3 tools/score.py trabajo.json
#   trabajo.json = { "voice": "voz.wav", "out": "mezcla.wav",
#                    "segments": [[inicio, fin], ...]   # segundos de cada frase en voz.wav
#                    "cues": [{"at": 0, "mood": "misterio", "amb": "viento", "sfx": ["pasos:12", "golpe"]}, ...] }
import sys, json, importlib.util, os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve, resample_poly

HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('music', os.path.join(HERE, 'music.py'))
M = importlib.util.module_from_spec(spec); spec.loader.exec_module(M)
SR = M.SR
rng = np.random.default_rng(1859)

def lp(x, f): return sosfilt(butter(2, f / (SR / 2), output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band', output='sos'), x)
def slow_curve(n, rate):
    k = max(2, int(n / SR * rate)); return np.interp(np.arange(n), np.linspace(0, n, k), rng.uniform(0, 1, k))

class Buf:
    def __init__(self, dur):
        self.N = int(dur * SR); self.out = np.zeros((self.N, 2))
    def add(self, sig, t, gain=1.0, pan=0.0):
        i = int(t * SR)
        if i >= self.N or i < 0 and len(sig) + i <= 0: return
        if i < 0: sig = sig[-i:]; i = 0
        j = min(self.N, i + len(sig))
        if sig.ndim == 2: self.out[i:j] += sig[: j - i] * gain
        else:
            self.out[i:j, 0] += sig[: j - i] * gain * (1 - pan) * 0.6
            self.out[i:j, 1] += sig[: j - i] * gain * (1 + pan) * 0.6

# ── Instrumentos (de tools/music.py, con caché para que sea rápido) ──
T0 = M.Track(1, 7)
_cache = {}
def guitar(semi):
    if semi not in _cache: _cache[semi] = T0.guitar(semi)
    return _cache[semi]
def strings(semis, dur, attack=1.8): return T0.strings(semis, dur, attack)
def taiko(dur, f0): return T0.taiko(dur, f0=f0)
def bell(semi): return T0.church_bell(semi, 6)
def snare(d=0.35): return T0.snare(d)

DM, BB, FM, A7, GM = M.DM, M.BB, M.FM, M.A7, [-14, -11, -7, -2]
CM = [-21, -17, -14, -9]
low = lambda ch, k=3: [c - 12 for c in ch[:k]]

# ── Ánimos musicales: cada uno llena un tramo de `dur` segundos ──
def mood_misterio(dur):
    b = Buf(dur); t = 0
    while t < dur:
        b.add(strings(low(DM) + [-31], 10, 3), t, 0.55); t += 8
    for s in np.arange(4, dur - 2, 9): b.add(strings([5], 4, 1.5), s, 0.12, pan=0.5)  # armónico agudo lejano
    return b.out
def mood_tension(dur, period=0.5):
    b = Buf(dur); t = 0; chords = [DM, A7, DM, BB]; k = 0
    while t < dur:
        b.add(strings(low(chords[k % 4]) + [chords[k % 4][3]], 6.5), t, 0.6); t += 5; k += 1
    t = 0.3
    while t < dur:
        g = 0.35 + 0.65 * min(1, t / max(1, dur))
        b.add(taiko(0.9, 52), t, 0.55 * g); b.add(taiko(0.5, 48), t + period * 0.42, 0.3 * g); t += period
    return b.out
def mood_melancolia(dur):
    b = Buf(dur); t = 0; chords = [DM, BB, GM, A7]; k = 0
    while t < dur:
        ch = chords[k % 4]; b.add(strings(ch[:3], 8.5, 2.5), t, 0.5)
        for i, n in enumerate([0, 1, 2, 1, 3, 1, 2, 1]):
            if t + i < dur: b.add(guitar(ch[n % len(ch)]), t + i * 1.0, 0.22, pan=0.3)
        t += 8; k += 1
    return b.out
def mood_esperanza(dur):
    b = Buf(dur); t = 0; chords = [FM, CM, DM, BB]; k = 0
    while t < dur:
        ch = chords[k % 4]; b.add(strings(ch + [ch[0] + 12], 6.5, 1.5), t, 0.5)
        for i, n in enumerate([0, 2, 1, 3, 2, 1]):
            if t + i * 0.9 < dur: b.add(guitar(ch[n % len(ch)] + 12), t + i * 0.9, 0.2, pan=-0.3)
        t += 5.4; k += 1
    return b.out
def mood_victoria(dur):
    b = Buf(dur); t = 0; chords = [FM, BB, CM, FM]; k = 0
    while t < dur:
        ch = chords[k % 4]; b.add(strings(ch + [ch[0] + 12], 5, 1.0), t, 0.65); t += 4.1; k += 1
    t = 0.2
    while t < dur:
        b.add(taiko(0.9, 55), t, 0.45); b.add(snare(), t + 0.255, 0.12, pan=-0.3); t += 0.51
    return b.out
def mood_epico(dur):
    b = Buf(dur); t = 0; chords = [DM, BB, CM, A7]; k = 0
    while t < dur:
        ch = chords[k % 4]; b.add(strings(low(ch) + ch[:3], 4.6, 0.8), t, 0.7)
        b.add(taiko(1.6, 45), t, 0.7)  # timbal en cada compás
        t += 4; k += 1
    t = 0.1
    while t < dur:
        b.add(taiko(0.6, 60), t, 0.35); b.add(taiko(0.4, 70), t + 0.2, 0.2); t += 0.4
    return b.out
def mood_calma(dur):
    b = Buf(dur); t = 0; chords = [FM, DM]; k = 0
    while t < dur:
        b.add(strings(chords[k % 2][:3], 11, 3.5), t, 0.4); t += 9; k += 1
    return b.out
# ── Música real (tools/moods/<ánimo>.mp3): si existe, reemplaza al ánimo sintetizado ──
MOOD_DIR = os.path.join(HERE, 'moods')
_tracks = {}
_pos = {}
TRACK_FILE = {'esperanza': 'victoria'}  # ánimos que comparten tema
def _file(name): return TRACK_FILE.get(name, name)
def _load_track(name):
    name = _file(name)
    if name not in _tracks:
        import subprocess
        wav = f'/tmp/mood-{name}.wav'
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', os.path.join(MOOD_DIR, name + '.mp3'), '-ac', '2', '-ar', str(SR), wav], check=True)
        _, x = wavfile.read(wav); x = x.astype(float) / 32767
        # deja espacio a la voz: baja un poco la zona de 1–3,5 kHz
        x = x - 0.4 * np.stack([bp(x[:, c], 1000, 3500) for c in range(2)], 1)
        # compresión suave: empareja las partes fuertes y las suaves del tema
        env = np.sqrt(np.clip(lp((x ** 2).mean(1), 1.5), 1e-9, None))
        target = np.median(env)
        x = x * np.clip((target / env) ** 0.5, 0.5, 2.0)[:, None]
        _tracks[name] = x / (np.sqrt((x ** 2).mean()) + 1e-9) * 0.1
    return _tracks[name]
def track_mood(name):
    def f(dur):
        x = _load_track(name); n = int(dur * SR); out = np.zeros((n, 2)); i = 0
        pos = _pos.get(name)
        if pos is None:  # cada capítulo empieza el tema en un punto distinto (pero siempre igual para el mismo texto)
            pos = int(rng.uniform(0, 0.5) * len(x))
        while i < n:
            take = min(n - i, len(x) - pos); out[i:i + take] = x[pos:pos + take]; i += take; pos += take
            if pos >= len(x): pos = 0
        _pos[name] = pos  # la próxima vez sigue donde quedó
        return out
    return f

MOODS = {'misterio': mood_misterio, 'tension': mood_tension, 'melancolia': mood_melancolia, 'esperanza': mood_esperanza,
         'victoria': mood_victoria, 'epico': mood_epico, 'calma': mood_calma, 'silencio': lambda d: np.zeros((int(d * SR), 2))}
for _m in list(MOODS):
    if os.path.exists(os.path.join(MOOD_DIR, _file(_m) + '.mp3')): MOODS[_m] = track_mood(_m)

# ── Ambientes continuos ──
def amb_viento(dur):
    n = int(dur * SR); gust = lp(0.25 + 0.75 * slow_curve(n, 0.35) ** 1.6, 1.5)
    base = lp(rng.normal(0, 1, n), 350) * 1.2; hiss = bp(rng.normal(0, 1, n), 2500, 7500) * 0.18
    L = base * gust + hiss * gust ** 2; R = np.roll(base, 3000) * np.roll(gust, 9000) + np.roll(hiss, 5000) * np.roll(gust, 9000) ** 2
    return np.stack([L, R], 1) * 0.5
def amb_mar(dur):
    n = int(dur * SR); t = np.arange(n) / SR; surf = lp(rng.normal(0, 1, n), 700)
    sw = 0.35 + 0.65 * np.clip(np.sin(2 * np.pi * t / 7.5), 0, None) ** 2
    return np.stack([surf * sw, np.roll(surf, 9000) * np.roll(sw, 9000)], 1) * 0.45
def amb_grillos(dur):
    b = Buf(dur); t = 0.5
    while t < dur:
        m = int(0.06 * SR); tt = np.arange(m) / SR
        c = np.sin(2 * np.pi * 4300 * tt) * (np.sin(2 * np.pi * 45 * tt) > 0) * np.hanning(m)
        p = rng.uniform(-0.7, 0.7)
        for k in range(3): b.add(c, t + k * 0.09, 0.05, pan=p)
        t += rng.uniform(0.7, 1.3)
    return b.out + amb_viento(dur) * 0.35
def amb_agua(dur):  # agua que corre por las acequias
    n = int(dur * SR); x = bp(rng.normal(0, 1, n), 400, 3500) * (0.6 + 0.4 * slow_curve(n, 3))
    bub = np.zeros(n)
    for _ in range(int(dur * 12)):
        i = rng.integers(0, n - 2000); m = int(SR * rng.uniform(0.01, 0.03)); f = rng.uniform(500, 1400)
        tt = np.arange(m) / SR; bub[i:i + m] += np.sin(2 * np.pi * f * (1 + 2 * tt) * tt) * np.hanning(m) * 0.25
    return np.stack([x * 0.3 + bub, np.roll(x, 4000) * 0.3 + np.roll(bub, 7000)], 1) * 0.6
def amb_fuego(dur):  # incendio: rugido grave y chasquidos
    n = int(dur * SR); roar = lp(rng.normal(0, 1, n), 250) * (0.7 + 0.3 * slow_curve(n, 1)) * 1.4
    cr = np.zeros(n)
    for _ in range(int(dur * 25)):
        i = rng.integers(0, n - 600); m = rng.integers(60, 500)
        cr[i:i + m] += bp(rng.normal(0, 1, m), 1500, 8000)[:m] * rng.uniform(0.1, 0.6) * np.hanning(m)
    return np.stack([roar + cr, np.roll(roar, 5000) + np.roll(cr, 3000)], 1) * 0.5
AMBS = {'viento': amb_viento, 'mar': amb_mar, 'grillos': amb_grillos, 'agua': amb_agua, 'fuego': amb_fuego,
        'ninguno': lambda d: np.zeros((int(d * SR), 2))}

# ── Efectos puntuales ──
def sfx_golpe(arg=None):
    n = int(4 * SR); t = np.arange(n) / SR; f = 34 + 70 * np.exp(-t * 9)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6) * 1.4 + lp(rng.normal(0, 1, n), 1800) * np.exp(-t * 14) * 0.7
def sfx_subida(arg=None):
    d = float(arg or 3); n = int(d * SR); t = np.arange(n) / SR; x = rng.normal(0, 1, n); y = np.zeros(n)
    for a in range(0, n, 2048): y[a:a + 2048] = lp(x[a:a + 2048], 300 + 5000 * (a / n) ** 2)
    return y * (t / d) ** 2 * 0.6
def sfx_puerta(arg=None):
    n = int(2.5 * SR); t = np.arange(n) / SR; out = np.zeros(n); m = int(0.9 * SR)
    f = 180 + 90 * np.sin(np.linspace(0, 3, m)) + rng.normal(0, 8, m)
    out[:m] = bp((np.cumsum(f) / SR) % 1 * 2 - 1, 300, 2500) * np.hanning(m) * 0.35
    i = int(0.95 * SR); tt = t[: n - i]
    out[i:] += lp(rng.normal(0, 1, n - i), 300) * np.exp(-tt * 12) * 2 + np.sin(2 * np.pi * 95 * tt) * np.exp(-tt * 10)
    return out
def _step(heavy):
    n = int(0.42 * SR); t = np.arange(n) / SR
    out = lp(rng.normal(0, 1, n), 260) * np.exp(-t * 38) * 2.2 + np.sin(2 * np.pi * 70 * t) * np.exp(-t * 30) * 0.9
    for _ in range(rng.integers(25, 45)):
        i = int(rng.uniform(0.005, 0.25) * SR); m = int(SR * rng.uniform(0.002, 0.006))
        if i + m < n: out[i:i + m] += bp(rng.normal(0, 1, m), 1800, 6000)[:m] * rng.uniform(0.15, 0.5) * np.hanning(m)
    return out * heavy
def sfx_pasos(arg=None):  # varios hombres avanzando que se acercan
    d = float(arg or 8); b = Buf(d + 1); t = 0.2; k = 0
    while t < d:
        pos = t / d; pan = -0.6 + 1.1 * pos
        for who, off in [(1.0, 0), (0.6, 0.17), (0.45, 0.31)]:
            b.add(_step(who * (1 if k % 2 == 0 else 0.85)), t + off + rng.uniform(0, 0.03), 0.6 * (0.35 + 0.65 * pos), pan=pan)
        t += 0.5 * rng.uniform(0.95, 1.05); k += 1
    return b.out
def sfx_campana(arg=None):
    b = Buf(12)
    for k in range(4): b.add(bell(-12), k * 2.0, 0.5, pan=0.4)
    return b.out
def sfx_yunque(arg=None):
    b = Buf(6)
    for k in range(5): b.add(T0.church_bell(5, 0.8) * 0.6, k * 0.9 + rng.uniform(0, 0.05), 0.5, pan=-0.4)
    return b.out
def sfx_redoble(arg=None):
    d = float(arg or 5); b = Buf(d + 1); t = 0; k = 0
    while t < d:
        b.add(snare(), t, 0.35 * (1.25 if k % 4 == 0 else 1), pan=-0.3)
        if k % 2: b.add(snare(0.2), t + 0.225, 0.2, pan=-0.3)
        t += 0.45; k += 1
    return b.out
def sfx_disparos(arg=None):  # descargas de fusiles lejanas
    b = Buf(6)
    for _ in range(int(arg or 7)):
        n = int(0.8 * SR); t = np.arange(n) / SR
        shot = lp(rng.normal(0, 1, n), 2500) * np.exp(-t * 25) + lp(rng.normal(0, 1, n), 400) * np.exp(-t * 6) * 0.6
        b.add(shot, rng.uniform(0, 3), rng.uniform(0.25, 0.5), pan=rng.uniform(-0.8, 0.8))
    return b.out
def sfx_canon(arg=None):
    x = sfx_golpe() * 0.8; n = len(x); t = np.arange(n) / SR
    return x + lp(rng.normal(0, 1, n), 900) * np.exp(-t * 3) * 0.8
def sfx_olas(arg=None): return amb_mar(float(arg or 8)) * 1.6
# ── Grabaciones reales (tools/sfx/<nombre>.mp3, Pixabay: uso comercial libre, sin atribución) ──
SFX_DIR = os.path.join(HERE, 'sfx')
_samples = {}
def sample(name):
    if name not in _samples:
        import subprocess
        wav = f'/tmp/sfx-{name}.wav'
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', os.path.join(SFX_DIR, name + '.mp3'), '-ac', '2', '-ar', str(SR), wav], check=True)
        _, x = wavfile.read(wav); _samples[name] = x.astype(float) / 32767
    return _samples[name]
def _active_rms(x):
    e = (x ** 2).mean(1); k = int(0.05 * SR); fr = e[: len(e) // k * k].reshape(-1, k).mean(1)
    loud = fr[fr > fr.max() * 1e-3]; return np.sqrt(loud.mean()) if len(loud) else 1e-9
def _fit(x, dur, start=0):  # recorta o repite (con fundido cruzado) hasta dur segundos
    n = int(dur * SR); out = np.zeros((n + len(x), 2)); xf = min(int(0.8 * SR), len(x) // 4)
    seg = x[start:].copy(); i = 0
    while i < n:
        seg = seg.copy()
        if i > 0: seg[:xf] *= np.linspace(0, 1, xf)[:, None]
        seg[-xf:] *= np.linspace(1, 0, xf)[:, None]
        out[i:i + len(seg)] += seg; i += len(seg) - xf; seg = x
    out = out[:n]; f = min(int(0.4 * SR), n); out[-f:] *= np.linspace(1, 0, f)[:, None]
    return out
def shot(name, peak=0.75):  # efecto puntual, normalizado por su pico
    x = sample(name); return x / (np.abs(x).max() + 1e-9) * peak
def loop(name, dur, level=0.09, ramp=False):  # efecto continuo, normalizado por su volumen medio
    x = sample(name); x = x / _active_rms(x) * level
    y = _fit(x, dur, int(rng.uniform(0, 0.5) * len(x)) if len(x) / SR > dur * 1.5 else 0)
    if ramp: y *= np.linspace(0.35, 1, len(y))[:, None]  # se acerca
    return y * min(1.0, 0.9 / (np.abs(y).max() + 1e-9))
def amb_sample(name):
    return lambda dur: _fit(sample(name) / _active_rms(sample(name)) * 0.05, dur, int(rng.uniform(0, 0.5) * len(sample(name))))
for _a in ['fuego', 'mar', 'lluvia']:
    if os.path.exists(os.path.join(SFX_DIR, _a + '.mp3')): AMBS[_a] = amb_sample(_a)

def sfx_disparos_real(arg=None):  # descarga de varios fusiles
    b = Buf(5)
    for _ in range(int(arg or 6)):
        b.add(shot('disparo', rng.uniform(0.3, 0.75)), rng.uniform(0, 2.5), 1.0, pan=rng.uniform(-0.6, 0.6))
    return b.out * min(1.0, 0.9 / (np.abs(b.out).max() + 1e-9))
def sfx_golpe_real(arg=None):  # impacto de cine: uno de los tres, al azar
    return shot(['hit1', 'hit2', 'hit3'][rng.integers(0, 3)], 1.0)
def sfx_yunque_real(arg=None):  # herrero forjando: varios martillazos
    b = Buf(6)
    for k in range(int(arg or 4)): b.add(shot('yunque', rng.uniform(0.45, 0.6)), k * 1.0 + rng.uniform(0, 0.08), 1.0, pan=-0.3)
    return b.out
REAL_SFX = {
    'golpe': sfx_golpe_real,
    'yunque': sfx_yunque_real,
    'piano': lambda a=None: shot('piano', 0.8),
    'gritos': lambda a=None: loop('gritos', float(a or 8), 0.09),
    'puerta': lambda a=None: shot('portazo'),
    'tocar': lambda a=None: shot('tocar', 0.6),
    'campana': lambda a=None: shot('campana', 0.55),
    'pasos': lambda a=None: loop('marcha', float(a or 10), 0.09, ramp=True),
    'arena': lambda a=None: loop('pasos_arena', float(a or 6), 0.08),
    'nieve': lambda a=None: loop('pasos_nieve', float(a or 8), 0.08),
    'disparos': sfx_disparos_real,
    'recarga': lambda a=None: shot('recarga', 0.5),
    'canon': lambda a=None: shot('explosion', 0.85),
    'olas': lambda a=None: loop('mar', float(a or 8), 0.1),
    'galope': lambda a=None: loop('galope', float(a or 8), 0.1, ramp=True),
    'caballo': lambda a=None: loop('caballo', float(a or 8), 0.08),
    'relincho': lambda a=None: shot('relincho', 0.5),
    'batalla': lambda a=None: loop('batalla', float(a or 12), 0.1),
    'abordaje': lambda a=None: loop('abordaje', float(a or 10), 0.09),
    'fanfarria': lambda a=None: loop('fanfarria', float(a or 10), 0.08),
    'cuerno': lambda a=None: loop('cuerno', float(a or 6), 0.09),
    'llamarada': lambda a=None: loop('llamarada', float(a or 6), 0.1),
}

SFX = {'golpe': sfx_golpe, 'subida': sfx_subida, 'puerta': sfx_puerta, 'pasos': sfx_pasos, 'campana': sfx_campana,
       'yunque': sfx_yunque, 'redoble': sfx_redoble, 'disparos': sfx_disparos, 'canon': sfx_canon, 'olas': sfx_olas}
SFX_GAIN = {'golpe': 0.9, 'subida': 0.5, 'puerta': 0.85, 'pasos': 0.8, 'campana': 0.45, 'yunque': 0.5, 'redoble': 0.5,
            'disparos': 0.6, 'canon': 0.8, 'olas': 0.5}
for _k, _f in REAL_SFX.items():
    SFX[_k] = _f
    SFX_GAIN[_k] = 1.0

def reverb(x, amt=0.08):
    n = int(1.8 * SR); t = np.arange(n) / SR
    ir = rng.normal(0, 1, (n, 2)) * np.exp(-t * 2.8)[:, None]; ir[0] = 1
    return x * 0.75 + np.stack([fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], 1) * amt

VOICE_FX = 'asetrate=24000*0.944,aresample=24000,atempo=1.059,bass=g=4:f=110:w=0.7,aecho=0.8:0.5:55|95:0.12|0.07'

def build_voice(job):
    # Une las frases grabadas por separado con pausas naturales y aplica el tratamiento épico a la voz
    import subprocess
    parts = []; segs = []; t = 0.35; sr0 = None
    parts.append(np.zeros(int(0.35 * 24000)))
    for path, text in zip(job['sentences'], job['texts']):
        sr, x = wavfile.read(path); x = x.astype(float) / 32767
        if x.ndim == 2: x = x.mean(1)
        if sr != 24000: x = resample_poly(x, 24000, sr)
        segs.append([t, t + len(x) / 24000]); parts.append(x); t += len(x) / 24000
        gap = 0.75 if text.rstrip().endswith(('?', ':')) else 0.5
        parts.append(np.zeros(int(gap * 24000))); t += gap
    raw = job['voice'] + '.raw.wav'
    wavfile.write(raw, 24000, (np.concatenate(parts) * 32767).astype(np.int16))
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af', job.get('voice_fx', VOICE_FX), '-ac', '1', job['voice']], check=True)
    job['segments'] = segs

def render(job):
    global rng
    import zlib
    rng = np.random.default_rng(job.get('seed', zlib.crc32(job.get('out', '').encode())))
    if 'sentences' in job:
        build_voice(job)
        json.dump([[round(a, 2), round(b, 2)] for a, b in job['segments']], open(job['out'] + '.frases.json', 'w'))
    sr, v = wavfile.read(job['voice']); v = v.astype(float) / 32767
    if v.ndim == 2: v = v.mean(1)
    if sr != SR: v = resample_poly(v, SR, sr);
    segs = job['segments']; cues = sorted(job.get('cues', []), key=lambda c: c['at'])
    tail = 3.0; dur = len(v) / SR + tail
    start_of = lambda i: 0.0 if i <= 0 else segs[min(i, len(segs) - 1)][0]

    # Tramos de música y de ambiente (cada uno dura hasta el siguiente cambio), con fundidos de 2,5 s
    music = Buf(dur); amb = Buf(dur); fx = Buf(dur); XF = 2.5
    def layer(kind, lib, dest, gain):
        changes = [(start_of(c['at']), c[kind]) for c in cues if kind in c]
        if not changes: return
        if changes[0][0] > 0: changes.insert(0, (0.0, 'silencio' if kind == 'mood' else 'ninguno'))
        for k, (t0, name) in enumerate(changes):
            t1 = changes[k + 1][0] if k + 1 < len(changes) else dur
            seg = lib[name](t1 - t0 + XF)
            n = len(seg); env = np.ones(n); f = int(XF * SR)
            if k > 0: env[:f] = np.linspace(0, 1, f)
            env[-f:] *= np.linspace(1, 0, f) if k + 1 < len(changes) else 1
            dest.add(seg * env[:, None], t0 - (XF / 2 if k > 0 else 0), gain)
    layer('mood', MOODS, music, 1.0)
    layer('amb', AMBS, amb, 1.0)
    for c in cues:
        for s in c.get('sfx', []):
            name, _, arg = s.partition(':')
            sig = SFX[name](arg or None)
            # la subida termina justo cuando empieza la frase; lo demás empieza con la frase
            at = start_of(c['at']) - (len(sig) / SR - 0.2 if name == 'subida' else 0.15)
            fx.add(sig, at, SFX_GAIN.get(name, 0.6))

    def norm(x, target):
        r = np.sqrt((x ** 2).mean()); return x * (target / r) if r > 1e-6 else x
    vrms = np.sqrt((v[np.abs(v) > 0.01] ** 2).mean())
    bed = reverb(norm(music.out, vrms * 10 ** (-16 / 20)) + norm(amb.out, vrms * 10 ** (-20 / 20)), 0.07)
    effects = fx.out * (vrms / 0.25)
    # La música baja un poco mientras habla la voz y vuelve en las pausas (sidechain suave)
    vv = np.zeros(music.N); vv[: len(v)] = v
    env = np.sqrt(np.clip(lp(vv ** 2, 4), 0, None)); env /= env.max() + 1e-9
    duck = 1 - 0.4 * np.clip(env * 4, 0, 1)
    mix = bed * duck[:, None] + effects + vv[:, None]
    fade = np.ones(music.N); fade[-int(tail * SR):] = np.linspace(1, 0, int(tail * SR))
    mix *= fade[:, None]
    mix /= np.abs(mix).max() / 0.95
    wavfile.write(job['out'], SR, (mix * 32767).astype(np.int16))

if __name__ == '__main__':
    render(json.load(open(sys.argv[1])))
