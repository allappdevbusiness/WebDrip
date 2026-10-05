"""Mixes the music bed with the Epidemic SFX cues listed in src/timeline.json and masters the result.
Writes public/audio/mix.wav (48 kHz stereo, exactly 40.000 s). Usage: python3 scripts/mix.py"""
import json
import numpy as np, soundfile as sf, pyloudnorm as pyln
from scipy.signal import resample_poly

TL = json.load(open('src/timeline.json'))
FPS, N_FRAMES = TL['fps'], TL['durationInFrames']
SR = 48000
N = int(round(N_FRAMES / FPS * SR))
TARGET_LUFS = -14.0
CEILING_DBTP = -1.5  # leaves room for AAC overshoot so the delivered file stays under -1 dBTP

bed, sr = sf.read('public/audio/music-bed.wav', always_2d=True)
assert sr == SR
bed = np.pad(bed, ((0, max(0, N - len(bed))), (0, 0)))[:N]

def load(path):
    x, r = sf.read(path, always_2d=True)
    if x.shape[1] == 1: x = np.repeat(x, 2, 1)
    if r != SR: x = resample_poly(x, SR, r, axis=0)
    return x

def env(x, win=0.003):
    m = np.abs(x).max(1)
    k = max(1, int(win * SR)); return np.convolve(m, np.ones(k) / k, 'same')

sfx_bus = np.zeros_like(bed)
report = []
for cue in TL['sfx']:
    x = load('public/audio/' + cue['file'])
    e = env(x)
    if cue['align'] == 'peak':
        anchor = int(np.argmax(e))
    else:  # first transient: first sample above 20 % of the peak
        anchor = int(np.argmax(e > 0.2 * e.max()))
    if cue.get('trim_s'):
        end = anchor + int(cue['trim_s'] * SR)
        x = x[:end].copy(); fl = int(0.06 * SR); x[-fl:] *= np.linspace(1, 0, fl)[:, None]
    x *= 10 ** (cue['gain_db'] / 20)
    at = int(round(cue['frame'] / FPS * SR)) - anchor
    a, b = max(0, at), min(N, at + len(x))
    sfx_bus[a:b] += x[a - at:b - at]
    report.append({**cue, 'start_s': round(at / SR, 4), 'anchor_offset_s': round(anchor / SR, 4), 'len_s': round(len(x) / SR, 3)})

mix = bed + sfx_bus
meter = pyln.Meter(SR)
gain = TARGET_LUFS - meter.integrated_loudness(mix)
mix *= 10 ** (gain / 20)

# true-peak safe limiter: 4x oversampled peak detection, short look-ahead gain smoothing
def limit(x, ceil_db):
    ceil = 10 ** (ceil_db / 20)
    up = resample_poly(x, 4, 1, axis=0)
    pk = np.abs(up).max(1).reshape(-1, 4).max(1)[:len(x)]
    pk = np.pad(pk, (0, len(x) - len(pk)), constant_values=0)
    g = np.minimum(1, ceil / np.maximum(pk, 1e-9))
    la = int(0.003 * SR)
    g = np.minimum.reduce([np.roll(g, -i) for i in range(la)])
    rel = np.exp(-1 / (0.06 * SR)); out = np.empty_like(g); cur = 1.0
    for i, v in enumerate(g):
        cur = v if v < cur else cur * rel + v * (1 - rel)
        out[i] = cur
    return x * out[:, None]
mix = limit(mix, CEILING_DBTP)
gain2 = TARGET_LUFS - meter.integrated_loudness(mix)
mix = limit(mix * 10 ** (gain2 / 20), CEILING_DBTP)
sf.write('public/audio/mix.wav', mix.astype(np.float32), SR, subtype='PCM_24')
tp = 20 * np.log10(np.abs(resample_poly(mix, 4, 1, axis=0)).max())
stats = {'integrated_lufs': round(meter.integrated_loudness(mix), 2), 'true_peak_dbtp_4x': round(tp, 2), 'duration_s': len(mix) / SR, 'cues': report}
json.dump(stats, open('scripts/mix-report.json', 'w'), indent=1)
print(json.dumps({k: v for k, v in stats.items() if k != 'cues'}))
