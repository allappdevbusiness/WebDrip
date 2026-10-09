import json, sys, numpy as np, librosa
S = sys.argv[1]
L = json.load(open(f'{S}/analysis/lyrics.json'))
for seg in L:
    for w in seg['words']:
        if 60 <= w['s'] <= 122: print(f"{w['s']:7.2f}-{w['e']:6.2f} {w['w']}")
sr = 22050
A = json.load(open(f'{S}/analysis/song.json')) if False else None
full, _ = librosa.load(f'{S}/dl/music/full.wav', sr=sr, mono=True, offset=68, duration=56)
drums, _ = librosa.load(f'{S}/dl/music/drums.wav', sr=sr, mono=True, offset=68, duration=56)
inst, _ = librosa.load(f'{S}/dl/music/instruments.wav', sr=sr, mono=True, offset=68, duration=56)
def r(y, a, b): s = y[int((a-68)*sr):int((b-68)*sr)]; return np.sqrt(np.mean(s**2))
print('t      full   drums  inst  (per half-beat 0.3135s)')
t = 70.0
while t < 122:
    print(f"{t:6.2f} {20*np.log10(r(full,t,t+.3135)+1e-9):6.1f} {20*np.log10(r(drums,t,t+.3135)+1e-9):6.1f} {20*np.log10(r(inst,t,t+.3135)+1e-9):6.1f}")
    t += 0.3135*2
o = librosa.onset.onset_detect(y=drums, sr=sr, units='time', backtrack=False) + 68
print('drum onsets 74-82:', np.round(o[(o > 74) & (o < 82)], 3))
print('drum onsets 112-120:', np.round(o[(o > 112) & (o < 120)], 3))
