# Banco de muestras para el editor de sonido de la app (vista previa): cada ánimo, ambiente y efecto
# de tools/score.py en un archivo corto. Uso: python3 tools/bank.py carpeta_salida
import sys, os, subprocess, importlib.util
import numpy as np
from scipy.io import wavfile
HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('score', os.path.join(HERE, 'score.py'))
S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
OUT = sys.argv[1] if len(sys.argv) > 1 else '/tmp/banco'
os.makedirs(OUT, exist_ok=True)

def save(name, x, seconds_fade=0.0):
    if x.ndim == 1: x = np.stack([x, x], 1)
    if seconds_fade:
        f = int(seconds_fade * S.SR); x[:f] *= np.linspace(0, 1, f)[:, None]; x[-f:] *= np.linspace(1, 0, f)[:, None]
    x = x / (np.abs(x).max() + 1e-9) * 0.9
    wav = f'/tmp/{name}.wav'
    wavfile.write(wav, S.SR, (x * 32767).astype(np.int16))
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-c:a', 'libmp3lame', '-b:a', '80k', f'{OUT}/banco-{name}.mp3'], check=True)

for m in S.MOODS:
    if m != 'silencio': save(f'animo-{m}', S.MOODS[m](32), 1.0)
for a in S.AMBS:
    if a != 'ninguno': save(f'amb-{a}', S.AMBS[a](24), 1.0)
for e in S.SFX: save(f'fx-{e}', S.SFX[e](None))
print('listo', len(os.listdir(OUT)))
