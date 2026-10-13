# Builds the music bed (two licensed tracks, cut and automated in video time), ambience beds and trimmed SFX,
# then writes mix.json for the toolkit mixer. Times come from the edit's timeline.ts.
import json, re, numpy as np, soundfile as sf
from scipy.signal import resample_poly
SR = 48000; AU = '/tmp/claude-0/sv/au'; OUT = '/tmp/claude-0/sv/mixwork'
DUR = 75.0; N = int(DUR * SR)
def load(p):
    a, sr = sf.read(p, always_2d=True); a = a.astype(np.float64)
    if a.shape[1] == 1: a = np.repeat(a, 2, 1)
    if sr != SR: g = np.gcd(sr, SR); a = resample_poly(a, SR // g, sr // g, axis=0)
    return a[:, :2]
def db(x): return 10 ** (x / 20)
def put(dst, src, at, g=1.0):
    s = int(at * SR); e = min(len(dst), s + len(src)); dst[s:e] += src[:e - s] * g
def fades(x, fi, fo):
    x = x.copy(); a = int(fi * SR); b = int(fo * SR)
    if a: x[:a] *= np.linspace(0, 1, a)[:, None] ** 2
    if b: x[-b:] *= np.linspace(1, 0, b)[:, None] ** 2
    return x
def seg(src, frm, length): return src[int(frm * SR): int((frm + length) * SR)]

# ---- music bed ----
en = load(f'{AU}/enigma.wav'); fu = load(f'{AU}/fugacious.wav')
bed = np.zeros((N, 2))
put(bed, fades(seg(en, 10.0, 20.4), 0.02, 0.04), 0.0)                 # A: hook -> board, hard STOP at 20.4
put(bed, fades(seg(en, 30.6, 3.2), 0.5, 0.6), 22.6, db(-7))           # B: thin return under the fingerprint, gone by 25.8
put(bed, fades(seg(en, 40.0, 19.4), 1.2, 0.3), 27.6)                  # C: after the DNA hit, through the four cases
put(bed, fades(seg(fu, 9.8, DUR - 49.4), 0.6, 1.5), 49.4)            # D: piano — the second story
sf.write(f'{OUT}/bed.wav', bed.astype(np.float32), SR)

# ---- ambience beds ----
city = load(f'{AU}/city.wav'); pt = load(f'{AU}/prison_tone.wav'); fl = load(f'{AU}/fluor.wav'); clk = load(f'{AU}/clock.wav'); dr = load(f'{AU}/drone.wav')
sf.write(f'{OUT}/amb_city.wav', fades(seg(city, 5, 4.4), 0.8, 0.5).astype(np.float32), SR)        # 2.2 -> 6.6
sf.write(f'{OUT}/amb_prison.wav', fades(seg(pt, 10, 17.0), 0.4, 1.2).astype(np.float32), SR)       # 49.3 -> 66.3
sf.write(f'{OUT}/amb_fluor.wav', fades(seg(fl, 3, 13.5), 0.3, 1.0).astype(np.float32), SR)        # 49.3 -> 62.8
sf.write(f'{OUT}/amb_clock.wav', fades(seg(clk, 2, 3.8), 0.2, 0.4).astype(np.float32), SR)        # 10.7 -> 14.5
sf.write(f'{OUT}/amb_drone.wav', fades(seg(dr, 6, 3.4), 0.4, 0.8).astype(np.float32), SR)        # 22.6 -> 26.0

# ---- one-shots: trim to onset, normalise peak; risers/reverse cut so their peak is the sample's end ----
def onset(a, thr=0.02):
    m = np.abs(a).max(1); idx = np.where(m > thr * m.max())[0]; return a[max(0, idx[0] - int(0.004 * SR)):]
def norm(a): return a * (0.9 / max(1e-9, np.abs(a).max()))
info = {}
PL = load(f'{AU}/prison_lock.wav'); sf.write(f'{AU}/prison_lock_cut.wav', fades(PL[:int(4.4 * SR)], 0, 0.5).astype(np.float32), SR)
for n in ['hit_dna', 'boom_deep', 'boom_low', 'whoosh_fast', 'whoosh_low', 'paper_table', 'paper_drop', 'door_slam', 'prison_lock_cut', 'click_digital', 'click_small', 'shutter']:
    a = norm(onset(load(f'{AU}/{n}.wav'))); sf.write(f'{OUT}/{n}.wav', a.astype(np.float32), SR)
    m = np.abs(a).max(1); info[n] = round(float(np.argmax(m)) / SR, 3)
for n in ['riser', 'reverse']:
    a = load(f'{AU}/{n}.wav'); m = np.convolve(np.abs(a).max(1), np.ones(480) / 480, 'same'); pk = int(np.argmax(m))
    a = norm(fades(a[:pk + int(0.03 * SR)], 0.05, 0.03)); sf.write(f'{OUT}/{n}.wav', a.astype(np.float32), SR); info[n] = round(len(a) / SR, 3)
print('peak offsets / lengths', info)

# single tick lifted from the clock bed
m = np.abs(clk[: 3 * SR]).max(1); k = int(np.argmax(m)); tick = norm(fades(clk[k - 200: k + int(0.12 * SR)], 0.002, 0.06))
sf.write(f'{OUT}/tick.wav', tick.astype(np.float32), SR)

# ---- timeline numbers from the edit ----
src = open('/tmp/claude-0/sv/rm/src/timeline.ts').read()
VO = {k: float(v) for k, v in re.findall(r"(l\d\d): ([\d.]+)", src)}
w = json.load(open('/tmp/claude-0/sv/vo/whisper.json'))
def word(line, i): return VO[line] + w[line]['words'][i][1]
slam = [word('l03', i) for i in (0, 3, 5, 8)]
dates = [word('l04', i) for i in range(3)]
pins = [word('l06', i) for i in range(3)]
X = lambda n: f'{OUT}/{n}.wav'
S = []
def sfx(t, n, g, peak=False):
    S.append({'t': round(t - (info[n] if peak else 0), 3), 'file': X(n), 'gain_db': g})
# MAP DIVE: sub impact + directional whoosh, city ambience arrives with Richmond, 1987 lands on a low hit
sfx(0.0, 'boom_deep', -5); sfx(1.45, 'whoosh_fast', -7, peak=True); S.append({'t': 2.2, 'file': f'{OUT}/amb_city.wav', 'gain_db': -9})
sfx(word('l01', 2), 'boom_low', -10)
# FILES LANDING: slam, slam, slightly faster, stronger + small riser into the timeline
sfx(slam[0], 'paper_table', -3); sfx(slam[1], 'paper_table', -3); sfx(slam[2], 'paper_drop', -4)
sfx(slam[3], 'paper_drop', -2); sfx(slam[3], 'boom_low', -11)
S.append({'t': round(10.7 - info['riser'], 3), 'file': X('riser'), 'gain_db': -11})
# TIMELINE: mechanical ticks under the dates, one hit on SAME PATTERN
S.append({'t': 10.7, 'file': f'{OUT}/amb_clock.wav', 'gain_db': -16})
for t in dates: sfx(t, 'tick', -6)
sfx(word('l05', 3), 'boom_low', -7)
# EVIDENCE BOARD: pin clicks, shutter when detectives connect them, STOP (music cuts) + single low hit for the ?
for t in pins: sfx(t, 'click_small', -5)
sfx(word('l06', 3), 'shutter', -11)
sfx(20.45, 'boom_low', -9)
# FINGERPRINT: low mechanical texture, reverse suction that cuts to near-silence
S.append({'t': 22.6, 'file': f'{OUT}/amb_drone.wav', 'gain_db': -8})
S.append({'t': round(25.75 - info['reverse'], 3), 'file': X('reverse'), 'gain_db': -7})
# DNA: one extremely strong low hit, a tight click on MATCH, low whoosh into the court
dna = word('l10', 2)
sfx(dna, 'hit_dna', 0, peak=True)
sfx(word('l11', 5), 'click_digital', -4)
sfx(32.25, 'whoosh_low', -5)
# FOUR CASES: four restrained impacts, then the 4
for t in [41.4, 42.3, 43.2, 44.1]: sfx(t, 'boom_low', -17)
sfx(45.0, 'boom_deep', -6)
# VASQUEZ: low whoosh as the language changes, paper pass, prison ambience + hum, real metal
sfx(47.0, 'whoosh_low', -6); sfx(49.2, 'whoosh_fast', -11, peak=True)
S.append({'t': 49.3, 'file': f'{OUT}/amb_prison.wav', 'gain_db': -8})
S.append({'t': 49.3, 'file': f'{OUT}/amb_fluor.wav', 'gain_db': -20})
sfx(word('l15', 9) - 0.3, 'paper_drop', -6)
sfx(word('l16', 4), 'door_slam', -4)
sfx(word('l17', 1), 'shutter', -10)
sfx(word('l17', 3) + 1.32, 'boom_low', -12); sfx(word('l17', 3) + 1.32, 'paper_table', -6)
# PARDON: lock mechanism and the door, soft hit on PARDONED
# the lock's final clunk (3.5 s into the sample) lands on "pardoned"
sfx(word('l18', 4) - 3.5, 'prison_lock_cut', -6)
# FINAL SPLIT: riser, two separate impacts, low final resolve
S.append({'t': round(word('l19', 4) - info['riser'], 3), 'file': X('riser'), 'gain_db': -10})
sfx(word('l19', 4), 'boom_deep', -9)
sfx(word('l19', 8), 'boom_low', -7)
sfx(word('l20', 2), 'boom_deep', -5)
S = [x for x in S if x]
mix = {'music': f'{OUT}/bed.wav', 'out': '/tmp/claude-0/sv/rm/public/mix.wav', 'duration': DUR,
       'voice': [{'file': f'/tmp/claude-0/sv/vo/{k}.wav', 'start': v} for k, v in VO.items()],
       'sfx': S, 'duck_db': -10, 'fade_out': 1.2, 'lufs': -14.0, 'ceiling_db': -4.0, 'duck_lookahead': 0.15, 'music_lufs': -21.0}
json.dump(mix, open(f'{OUT}/mix.json', 'w'), indent=1)
print(len(S), 'sfx; DNA hit at', dna)
