"""Build the music bed (with tape-stop + re-entry) and trimmed SFX clips, then write mix.json."""
import json, numpy as np, soundfile as sf
from scipy.signal import resample_poly
SR = 48000
def load(p):
    a, sr = sf.read(p, always_2d=True); a = a.astype(np.float64)
    if a.shape[1] == 1: a = np.repeat(a, 2, 1)
    if sr != SR:
        g = np.gcd(sr, SR); a = resample_poly(a, SR // g, sr // g, axis=0)
    return a
def fade(a, fi=0.01, fo=0.08):
    a = a.copy(); i, o = int(fi * SR), int(fo * SR)
    if i: a[:i] *= np.linspace(0, 1, i)[:, None]
    if o: a[-o:] *= np.linspace(1, 0, o)[:, None] ** 2
    return a
def trim(src, out, a, b, fi=0.01, fo=0.08):
    x = load(src)[int(a * SR):int(b * SR)]; sf.write(out, fade(x, fi, fo).astype(np.float32), SR)

# --- music bed: 0-45.5 straight, tape-stop over the last 0.6 s, silence, big hit at 48.0
m = load('music/special_sauce.wav'); N = int(60.0 * SR)
bed = np.zeros((N, 2))
stop_at, stop_len = 45.5, 0.6
a_end = int((stop_at - stop_len) * SR)
bed[:a_end] = m[:a_end]
# tape stop: playback speed ramps 1 -> 0 (quadratic), reading the source with a fractional pointer
n = int(stop_len * SR); speed = (1 - np.linspace(0, 1, n)) ** 1.6
pos = a_end + np.cumsum(speed); idx = np.clip(pos.astype(int), 0, len(m) - 2); fr = (pos - idx)[:, None]
ts = m[idx] * (1 - fr) + m[idx + 1] * fr
ts *= np.linspace(1, 0, n)[:, None] ** 0.7
bed[a_end:a_end + n] = ts
b_src, b_at = 57.84, 48.0
seg = m[int(b_src * SR): int(b_src * SR) + (N - int(b_at * SR))]
seg = fade(seg, 0.004, 0.0)
bed[int(b_at * SR): int(b_at * SR) + len(seg)] = seg
sf.write('music/bed.wav', bed.astype(np.float32), SR)

# --- SFX trims (seconds in source)
trim('sfx/pour.wav', 'sfx/t_pour.wav', 6.2, 8.4, 0.05, 0.4)
trim('sfx/boil.wav', 'sfx/t_boil.wav', 0.0, 4.8, 0.3, 0.6)
trim('sfx/toss.wav', 'sfx/t_toss.wav', 0.6, 6.4, 0.1, 0.5)
trim('sfx/whisk.wav', 'sfx/t_whisk.wav', 0.0, 6.6, 0.1, 0.5)
trim('sfx/whisk.wav', 'sfx/t_whisk2.wav', 4.5, 7.0, 0.05, 0.6)
trim('sfx/nuts.wav', 'sfx/t_nuts.wav', 0.0, 1.0, 0.0, 0.3)
trim('sfx/sizzle.wav', 'sfx/t_crackle.wav', 0.9, 2.6, 0.03, 0.5)
trim('sfx/sizzle.wav', 'sfx/t_hiss.wav', 1.0, 2.8, 0.3, 0.6)

V = {'hookA': 0.15, 'hookB': 1.40, 'hook2': 2.70, 'doubt': 4.25, 'ingr': 8.75, 'sauce': 16.30, 'sauce2': 22.70,
     'noodle': 27.45, 'toss': 32.15, 'garnish': 38.05, 'tease': 43.90, 'verdict': 48.20, 'cta': 55.50}
S = lambda f, t, g: {'file': f'/tmp/claude-0/pbr/sfx/{f}', 't': round(t, 3), 'gain_db': g}
ing = V['ingr']
sfx = [
    S('splat.wav', 1.25 - 0.60, -6), S('boom.wav', 1.25 - 0.20, -10), S('t_hiss.wav', 2.75, -22),
    S('whoosh.wav', 8.45 - 0.85, -12),
    *[S('pop.wav', ing + w, -14) for w in (1.16, 3.04, 4.02, 5.02, 5.60, 6.18)],
    S('t_whisk.wav', 16.25, -14), S('t_pour.wav', 20.05, -12), S('t_whisk2.wav', 22.60, -18),
    S('t_boil.wav', 27.27, -14), S('whoosh.wav', 31.98 - 0.85, -14), S('t_toss.wav', 32.05, -12),
    S('t_crackle.wav', V['garnish'] + 0.42, -14), S('sprinkle.wav', V['garnish'] + 1.30, -12), S('t_nuts.wav', V['garnish'] + 2.05, -12),
    S('slurp.wav', 46.40 - 1.00, -4),
    S('boom.wav', 48.0 - 0.20, -8), S('whoosh.wav', 51.0 - 0.85, -16),
    S('pop.wav', 55.50, -10),
]
cfg = {'music': '/tmp/claude-0/pbr/music/bed.wav', 'out': '/tmp/claude-0/pbr/video/public/mix.wav', 'duration': 60.0,
       'voice': [{'file': f'/tmp/claude-0/pbr/vo/{k}.wav', 'start': v} for k, v in V.items()],
       'sfx': sfx, 'duck_db': -10, 'fade_out': 2.5, 'lufs': -14.0, 'ceiling_db': -4.0, 'music_lufs': -19.0}
json.dump(cfg, open('mix.json', 'w'), indent=1)
json.dump(V, open('video/src/vo_times.json', 'w'))
print('ok')
