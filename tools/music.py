# Compositor de música de fondo para Rekio (pistas originales, sin derechos de terceros).
# Uso: python3 tools/music.py <pista> <salida.wav>    pistas: ver PRESETS
import sys
import numpy as np
from scipy.signal import fftconvolve, butter, lfilter
import scipy.io.wavfile as wavfile

SR = 44100

def hz(semi):  # semitonos desde A4
    return 440 * 2 ** (semi / 12)

# Escalas (semitonos desde A4)
MIYAKO = [-17, -16, -12, -10, -9, -5, -4, 0, 2]      # In (tensa): E F A B C
YO = [-19, -17, -14, -12, -10, -7, -5, -2, 0]        # Yo (luminosa): D E G A B
HIRAJOSHI = [-19, -17, -16, -12, -11, -7, -5, -4, 0] # D E F A Bb


class Track:
    def __init__(self, dur, seed):
        self.N = int(dur * SR); self.dur = dur
        self.rng = np.random.default_rng(seed)
        self.out = np.zeros((self.N, 2))

    def add(self, sig, t, pan=0.0, gain=1.0):
        i = int(t * SR)
        if i >= self.N: return
        j = min(self.N, i + len(sig)); s = sig[: j - i] * gain
        self.out[i:j, 0] += s * (1 - pan) * 0.6
        self.out[i:j, 1] += s * (1 + pan) * 0.6

    # ── Instrumentos ──
    def koto(self, semi, dur=3.5, bend=False):
        f = hz(semi); n = int(dur * SR); p = max(2, int(SR / f))
        buf = self.rng.uniform(-1, 1, p); y = np.zeros(n)
        for k in range(n):
            y[k] = buf[k % p]
            buf[k % p] = 0.996 * 0.5 * (buf[k % p] + buf[(k + 1) % p])
        if bend:
            t = np.arange(n) / SR
            ratio = 1 + (2 ** (1 / 12) - 1) * np.clip((t - 0.35) / 0.4, 0, 1)
            idx = np.cumsum(ratio); idx = idx[idx < n - 1]
            y = np.interp(idx, np.arange(n), y)
        return y * np.hanning(len(y) * 2)[len(y):] ** 0.3

    def flute(self, semi, dur, breath=0.6, vib=0.006):
        n = int(dur * SR); t = np.arange(n) / SR; f = hz(semi)
        v = 1 + vib * np.sin(2 * np.pi * 5 * t) * np.clip(t / dur * 2 - 0.4, 0, 1)
        ph = 2 * np.pi * np.cumsum(f * v) / SR
        tone = np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
        b, a = butter(2, [f * 0.8 / (SR / 2), min(0.99, f * 4 / (SR / 2))], 'band')
        br = lfilter(b, a, self.rng.normal(0, 1, n)) * breath
        env = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5
        env *= 1 + 0.5 * np.clip(1 - t / 0.25, 0, 1)
        return (tone * 0.5 + br) * env

    def taiko(self, dur=1.6, f0=55, rim=False):
        n = int(dur * SR); t = np.arange(n) / SR
        if rim:  # golpe en el borde (ka)
            return self.rng.normal(0, 1, n) * np.exp(-t * 90) * 0.5 + np.sin(2 * np.pi * 900 * t) * np.exp(-t * 60) * 0.3
        f = f0 * (1 + 0.6 * np.exp(-t * 18))
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2) + self.rng.normal(0, 1, n) * np.exp(-t * 60) * 0.3

    def bell(self, semi, dur=9):  # campana de templo: parciales inarmónicos y batido lento
        n = int(dur * SR); t = np.arange(n) / SR; f = hz(semi); y = np.zeros(n)
        for ratio, amp, dec in [(0.5, 0.6, 0.35), (1, 1, 0.5), (1.19, 0.5, 0.8), (1.56, 0.35, 1.1), (2.0, 0.3, 1.4), (2.74, 0.2, 2.2), (3.76, 0.12, 3.0)]:
            y += amp * np.sin(2 * np.pi * f * ratio * t + self.rng.uniform(0, 6)) * np.exp(-t * dec)
        y *= 1 + 0.25 * np.sin(2 * np.pi * 1.3 * t)
        return y * 0.5 * np.clip(t / 0.005, 0, 1)

    def sho(self, semis, dur):  # acorde sostenido tipo shō (órgano de boca de la corte)
        n = int(dur * SR); t = np.arange(n) / SR; y = np.zeros(n)
        for s in semis:
            f = hz(s); ph = 2 * np.pi * f * t
            y += np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.2 * np.sin(3 * ph)
        env = np.clip(t / 3, 0, 1) * np.clip((dur - t) / 3, 0, 1)
        return y / len(semis) * env * (1 + 0.08 * np.sin(2 * np.pi * 0.2 * t))

    def wind(self, level=0.35, cutoff=400, period=23):
        t = np.arange(self.N) / SR
        b, a = butter(2, cutoff / (SR / 2))
        w = lfilter(b, a, self.rng.normal(0, 1, self.N)) * (0.5 + 0.5 * np.sin(2 * np.pi * t / period) ** 2) * level
        self.out[:, 0] += w; self.out[:, 1] += w[::-1] * 0.9

    def rustle(self, level=0.12):  # hojas de bambú: ruido agudo en ráfagas
        t = np.arange(self.N) / SR
        b, a = butter(2, [2500 / (SR / 2), 9000 / (SR / 2)], 'band')
        r = lfilter(b, a, self.rng.normal(0, 1, self.N))
        gust = np.clip(np.sin(2 * np.pi * t / 11) + 0.4 * np.sin(2 * np.pi * t / 4.3), 0, None) ** 2
        self.out[:, 0] += r * gust * level; self.out[:, 1] += np.roll(r, 3000) * gust * level

    def drone(self, semis, level=0.08):
        t = np.arange(self.N) / SR
        d = sum(np.sin(2 * np.pi * hz(s) * t) * (0.3 if i else 1) for i, s in enumerate(semis)) * level
        self.out[:, 0] += d; self.out[:, 1] += d

    # ── Frases ──
    def koto_phrases(self, scale, start, gap=(5, 9), notes=(2, 5), bend=0.3, gain=0.5, steps=(0.3, 0.45, 0.9), pan=0.35):
        tt = start
        while tt < self.dur - 6:
            k = self.rng.integers(*notes); base = self.rng.integers(0, len(scale) - 3)
            for _ in range(k):
                semi = scale[min(len(scale) - 1, max(0, base + self.rng.integers(-1, 3)))]
                self.add(self.koto(semi, bend=self.rng.random() < bend), tt, pan=pan, gain=gain)
                tt += self.rng.choice(steps)
            tt += self.rng.uniform(*gap)

    def finish(self, reverb=0.06, rev_len=2.2):
        t = np.arange(self.N) / SR
        fade = np.clip(t / 3, 0, 1) * np.clip((self.dur - t) / 3, 0, 1)
        self.out *= fade[:, None]
        ir_t = np.arange(int(rev_len * SR)) / SR
        ir = self.rng.normal(0, 1, (len(ir_t), 2)) * np.exp(-ir_t * 2.8)[:, None]; ir[0] = 1
        wet = np.stack([fftconvolve(self.out[:, c], ir[:, c])[: self.N] for c in range(2)], 1)
        mix = self.out * 0.7 + wet * reverb
        return mix / (np.abs(mix).max() / 0.8)


def gion(T):  # tensa: conspiración en la noche
    T.wind(); T.drone([-29, -34])
    tt = 4.0
    while tt < T.dur - 4:
        T.add(T.taiko(), tt, pan=-0.2, gain=0.55)
        if T.rng.random() < 0.35: T.add(T.taiko(), tt + 0.45, pan=-0.2, gain=0.3)
        tt += T.rng.choice([2.4, 2.4, 3.2, 4.8])
    T.koto_phrases(MIYAKO, 7)
    for s, semi, d in [(18, 2, 6), (27, 0, 5), (45, -4, 7), (60, -5, 6), (74, -9, 7)]:
        T.add(T.flute(semi, d), s, pan=-0.4, gain=0.22)

def palacio(T):  # elegante: música de la corte
    for s in range(0, int(T.dur), 16):
        chord = [[-19, -12, -7, 0], [-17, -10, -5, 2], [-14, -7, -2, 5]][(s // 16) % 3]
        T.add(T.sho(chord, 18), s, gain=0.25)
    T.koto_phrases(YO, 5, gap=(3, 6), notes=(3, 6), bend=0.15, gain=0.45, steps=(0.5, 0.75))
    for s in [20, 52, 80]:
        T.add(T.flute(T.rng.choice(YO[4:]) + 12, 5, breath=0.3), s, pan=-0.3, gain=0.12)
    T.wind(level=0.12)

def kiyomizu(T):  # espiritual: campanas y agua
    T.drone([-31, -24], level=0.07); T.wind(level=0.2, cutoff=600)
    for s in range(3, int(T.dur) - 8, 24):
        T.add(T.bell(-33), s, pan=0.1, gain=0.6)
    for s, semi, d in [(12, -5, 7), (36, -10, 6), (60, -4, 7), (82, -12, 6)]:
        T.add(T.flute(semi, d), s, pan=-0.35, gain=0.2)
    T.koto_phrases(MIYAKO, 20, gap=(9, 14), notes=(2, 3), gain=0.35)

def arashiyama(T):  # tranquila: bambú, río y viento
    T.rustle(0.1); T.wind(level=0.18, cutoff=700, period=17)
    T.koto_phrases(YO, 3, gap=(2.5, 5), notes=(4, 7), bend=0.1, gain=0.42, steps=(0.35, 0.5, 0.7))
    for s, semi, d in [(25, 0, 6), (58, -2, 7)]:
        T.add(T.flute(semi, d, breath=0.4), s, pan=-0.3, gain=0.15)

def kinkaku(T):  # contemplativa: el pabellón sobre el estanque
    T.drone([-26, -19], level=0.06); T.wind(level=0.12)
    for s in [6, 50]:
        T.add(T.bell(-29, 10), s, gain=0.35)
    T.koto_phrases(HIRAJOSHI, 10, gap=(6, 10), notes=(3, 5), bend=0.25, gain=0.4, steps=(0.6, 0.9, 1.2))
    for s, semi, d in [(28, -7, 7), (70, -5, 7)]:
        T.add(T.flute(semi, d, breath=0.5), s, pan=-0.35, gain=0.18)

def asakusa(T):  # festival: tambores y flauta de matsuri
    beat = 0.6; tt = 2.0; pattern = ['don', None, 'don', 'ka', 'don', 'ka', None, 'ka']
    i = 0
    while tt < T.dur - 3:
        hit = pattern[i % len(pattern)]
        if hit == 'don': T.add(T.taiko(f0=70), tt, pan=-0.2, gain=0.35)
        elif hit == 'ka': T.add(T.taiko(0.15, rim=True), tt, pan=0.3, gain=0.25)
        tt += beat; i += 1
    tt = 6.0
    while tt < T.dur - 8:  # shinobue: notas agudas con adornos
        for _ in range(T.rng.integers(3, 6)):
            T.add(T.flute(T.rng.choice(YO[3:]) + 12, T.rng.choice([0.5, 0.8, 1.2]), breath=0.25, vib=0.01), tt, pan=0.2, gain=0.13)
            tt += T.rng.choice([0.6, 0.9])
        tt += T.rng.uniform(4, 7)

def edo(T):  # solemne: el castillo de los shōgun
    T.drone([-36, -29], level=0.1); T.wind(level=0.25, cutoff=300)
    tt = 3.0
    while tt < T.dur - 4:
        T.add(T.taiko(2.2, f0=45), tt, pan=0, gain=0.6)
        tt += 4.8
    for s in range(8, int(T.dur) - 10, 20):
        T.add(T.sho([-17, -12, -5], 16), s, gain=0.18)
    for s, semi, d in [(14, -12, 7), (40, -9, 6), (66, -16, 7)]:
        T.add(T.flute(semi, d), s, pan=-0.3, gain=0.22)

PRESETS = {'gion': (gion, 7), 'palacio': (palacio, 11), 'kiyomizu': (kiyomizu, 3), 'arashiyama': (arashiyama, 5),
           'kinkaku': (kinkaku, 9), 'asakusa': (asakusa, 13), 'edo': (edo, 17)}

if __name__ == '__main__':
    name, path = sys.argv[1], sys.argv[2]
    fn, seed = PRESETS[name]
    T = Track(96, seed); fn(T)
    wavfile.write(path, SR, (T.finish() * 32767).astype(np.int16))
