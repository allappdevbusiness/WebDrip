"""WebDrip toolkit — promo audio mixer.

Usage: python3 mix.py mix.json
mix.json: {
  "music": "/tmp/music/track.wav", "out": "/tmp/video/public/mix.wav", "duration": 60.0,
  "voice": [{"file": "/tmp/vo/line00.wav", "start": 0.25}, ...],
  "sfx": [{"t": 5.0, "type": "whoosh"|"impact"|"tick"|"pop"|"rise", "gain_db": -18}, ...],
  "duck_db": -9, "fade_out": 2.0, "lufs": -14.0, "voice_gain_db": 0,
  optional:
  "music_segments": [{"from": 0, "to": 14, "at": 0}, {"from": 20, "to": 42, "at": 14}], "xfade": 0.03,
      -> build the bed from cuts of the (licensed) music file, equal-power crossfades centred on each "at"
  "eq": [{"start": 18, "end": 22, "type": "lowshelf", "freq": 150, "gain_db": -2.5},
         {"start": 26, "end": 30, "type": "band", "lo": 700, "hi": 5000, "gain_db": -4}, ...]
      -> timed EQ moves on the music (zero-phase split, 80 ms ramps) when stems aren't available
  sfx entries may use "file": "/tmp/sfx/x.wav" instead of "type" (sample placed with its onset at "t")
}
Music is ducked smoothly under speech (attack 120 ms, release 450 ms) and swells back between lines.
Sound effects are synthesised here, or placed from a sample file (e.g. a hit lifted from the licensed track). The master is loudness-normalised to the
target LUFS with a soft-knee peak limiter keeping true peaks under -1 dBFS.
"""
import json
import sys

import numpy as np
import soundfile as sf
import pyloudnorm as pyln
from scipy.signal import butter, sosfilt, resample_poly

SR = 48000
rng = np.random.default_rng(7)


def load(path):
    a, sr = sf.read(path, always_2d=True)
    a = a.astype(np.float64)
    if a.shape[1] == 1:
        a = np.repeat(a, 2, axis=1)
    if sr != SR:
        g = np.gcd(sr, SR)
        a = resample_poly(a, SR // g, sr // g, axis=0)
    return a


def db(x):
    return 10 ** (x / 20)


def env(n, attack, release):
    e = np.ones(n)
    a = max(1, int(attack * SR)); r = max(1, int(release * SR))
    e[:a] = np.linspace(0, 1, a) ** 2
    e[-r:] *= np.linspace(1, 0, r) ** 2
    return e


def bandnoise(n, lo, hi):
    sos = butter(4, [lo, hi], btype='band', fs=SR, output='sos')
    return sosfilt(sos, rng.standard_normal(n))


def whoosh(d=0.7):
    n = int(d * SR); t = np.linspace(0, 1, n)
    # sweep a band of noise upward then down, bell-shaped envelope
    out = np.zeros(n); steps = 24
    for i in range(steps):
        s, e = i * n // steps, (i + 1) * n // steps
        f = 300 + 2600 * np.sin(np.pi * (i + .5) / steps) ** 1.5
        out[s:e] = bandnoise(e - s + 2048, f * .6, f * 1.4)[1024:1024 + e - s]
    shape = np.sin(np.pi * t) ** 2.2
    w = out * shape
    return np.stack([w * (0.8 + 0.2 * t), w * (1.0 - 0.2 * t)], 1)  # gentle left-to-right pan


def impact(d=1.6):
    n = int(d * SR); t = np.arange(n) / SR
    f = 55 + 70 * np.exp(-t * 9)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
    thump = bandnoise(n, 60, 400) * np.exp(-t * 22) * .5
    air = bandnoise(n, 2000, 9000) * np.exp(-t * 6) * .08
    x = (body + thump + air) * env(n, .004, .4)
    return np.stack([x, x], 1)


def tick(d=0.06):
    n = int(d * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 120) + bandnoise(n, 3000, 9000) * np.exp(-t * 300) * .3
    return np.stack([x, x], 1)


def pop(d=0.14):
    n = int(d * SR); t = np.arange(n) / SR
    f = 900 * np.exp(-t * 10) + 500
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 32)
    return np.stack([x, x], 1)


def rise(d=1.6):
    n = int(d * SR); t = np.linspace(0, 1, n)
    out = np.zeros(n); steps = 32
    for i in range(steps):
        s, e = i * n // steps, (i + 1) * n // steps
        f = 400 + 5000 * ((i + .5) / steps) ** 2
        out[s:e] = bandnoise(e - s + 2048, f * .7, f * 1.3)[1024:1024 + e - s]
    x = out * t ** 2.4 * env(n, .01, .06)
    return np.stack([x, x], 1)


SFX = {'whoosh': whoosh, 'impact': impact, 'tick': tick, 'pop': pop, 'rise': rise}


def place(dst, src, start, gain=1.0):
    s = int(round(start * SR))
    if s < 0:
        src = src[-s:]; s = 0
    e = min(len(dst), s + len(src))
    if e > s:
        dst[s:e] += src[:e - s] * gain


def smooth(x, attack, release):
    """one-pole follower with separate attack/release (on a control-rate signal)"""
    y = np.zeros_like(x); a = np.exp(-1 / (attack * 1000)); r = np.exp(-1 / (release * 1000))
    v = 0.0
    for i, s in enumerate(x):
        c = a if s > v else r
        v = c * v + (1 - c) * s
        y[i] = v
    return y


def build_music(cfg, N):
    src = load(cfg['music'])
    segs = cfg.get('music_segments')
    if not segs:
        m = src[:N]
        return np.pad(m, ((0, N - len(m)), (0, 0)))
    xf = int(cfg.get('xfade', 0.03) * SR)
    out = np.zeros((N, 2))
    for k, sg in enumerate(segs):
        a = int(sg['from'] * SR) - (xf // 2 if k > 0 else 0)
        b = int(sg['to'] * SR) + (xf // 2 if k < len(segs) - 1 else 0)
        piece = src[max(0, a):b].copy()
        n = len(piece)
        w = np.ones(n)
        if k > 0:
            w[:xf] = np.sin(np.linspace(0, np.pi / 2, xf)) ** 2
        if k < len(segs) - 1:
            w[-xf:] = np.cos(np.linspace(0, np.pi / 2, xf)) ** 2
        place(out, piece * np.sqrt(w)[:, None], sg['at'] - (xf / 2 / SR if k > 0 else 0))
    return out


def apply_eq(music, moves):
    from scipy.signal import sosfiltfilt
    N = len(music); t = np.arange(N) / SR
    for mv in moves:
        if mv['type'] == 'lowshelf':
            part = sosfiltfilt(butter(2, mv['freq'], btype='low', fs=SR, output='sos'), music, axis=0)
        else:
            part = sosfiltfilt(butter(2, [mv['lo'], mv['hi']], btype='band', fs=SR, output='sos'), music, axis=0)
        ramp = mv.get('ramp', 0.08)
        w = np.clip(np.minimum((t - mv['start']) / ramp + 1, (mv['end'] - t) / ramp + 1), 0, 1)
        music = music + (db(mv['gain_db']) - 1) * part * w[:, None]
    return music


def main(cfg):
    N = int(cfg['duration'] * SR)
    music = build_music(cfg, N)
    if cfg.get('eq'):
        music = apply_eq(music, cfg['eq'])
    voice = np.zeros((N, 2))
    for v in cfg.get('voice', []):
        place(voice, load(v['file']), v['start'], db(cfg.get('voice_gain_db', 0) + v.get('gain_db', 0)))
    # gentle presence + de-ess on voice: high-pass 90 Hz, soft cut of 6-9 kHz harshness
    voice = sosfilt(butter(2, 90, btype='high', fs=SR, output='sos'), voice, axis=0)
    ess = sosfilt(butter(2, [5500, 9500], btype='band', fs=SR, output='sos'), voice, axis=0)
    voice = voice - 0.35 * ess

    # ducking: speech activity at 1 kHz control rate
    hop = SR // 1000
    act = np.abs(voice[:, 0])[: (N // hop) * hop].reshape(-1, hop).max(1) > 0.02
    g = smooth(act.astype(float), 0.12, 0.45)
    g = np.repeat(g, hop); g = np.pad(g, (0, N - len(g)), constant_values=g[-1] if len(g) else 0)
    duck = db(cfg.get('duck_db', -9))
    mgain = 1 - (1 - duck) * g
    music = music * mgain[:, None]

    sfx = np.zeros((N, 2))
    for s in cfg.get('sfx', []):
        if s.get('file'):
            place(sfx, load(s['file']), s['t'], db(s.get('gain_db', -18)))
        else:
            place(sfx, SFX[s['type']](), s['t'] - (0.35 if s['type'] == 'whoosh' else 1.45 if s['type'] == 'rise' else 0), db(s.get('gain_db', -18)))

    # level the stems before summing: voice ~ -16 LUFS, music bed ~ -20 LUFS (pre-duck), sfx as authored
    meter = pyln.Meter(SR)
    def norm(x, target):
        l = meter.integrated_loudness(x)
        return x * db(target - l) if np.isfinite(l) else x
    voice_n = norm(voice, -16.0) if np.abs(voice).max() > 0 else voice
    music_raw_l = meter.integrated_loudness(music / np.maximum(mgain[:, None], 1e-3))
    music_n = music * db(cfg.get('music_lufs', -19.0) - music_raw_l)
    mix = voice_n + music_n + sfx * db(-4)

    fo = int(cfg.get('fade_out', 2.0) * SR)
    mix[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5

    l = meter.integrated_loudness(mix)
    mix *= db(cfg.get('lufs', -14.0) - l)
    # soft limiter: keep peaks under -1 dBFS (4x oversampled peak estimate)
    ceiling = db(-1.2)
    for _ in range(3):
        up = resample_poly(mix, 4, 1, axis=0)
        peak = np.abs(up).max()
        if peak <= ceiling:
            break
        knee = ceiling * 0.7
        mag = np.abs(mix)
        over = mag > knee
        mix[over] = np.sign(mix[over]) * (knee + (ceiling - knee) * np.tanh((mag[over] - knee) / (ceiling - knee)))
    sf.write(cfg['out'], mix.astype(np.float32), SR, subtype='PCM_16')
    print(json.dumps({'lufs': round(meter.integrated_loudness(mix), 2),
                      'peak_dbfs': round(20 * np.log10(np.abs(resample_poly(mix, 4, 1, axis=0)).max()), 2),
                      'duration': N / SR}))


if __name__ == '__main__':
    main(json.load(open(sys.argv[1])))
