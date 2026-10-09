import sys, json, numpy as np, librosa
D = sys.argv[1]; OUT = sys.argv[2]
sr = 22050
full, _ = librosa.load(f'{D}/full.wav', sr=sr, mono=True)
drums, _ = librosa.load(f'{D}/drums.wav', sr=sr, mono=True)
bass, _ = librosa.load(f'{D}/bass.wav', sr=sr, mono=True)
inst, _ = librosa.load(f'{D}/instruments.wav', sr=sr, mono=True)
voc, _ = librosa.load(f'{D}/vocals_preview.mp3', sr=sr, mono=True)
n = min(len(full), len(voc)); voc = voc[:n]
hop = 512
# tempo/beat on full mix with drums-informed onset
oenv = librosa.onset.onset_strength(y=full, sr=sr, hop_length=hop)
tempo, beats = librosa.beat.beat_track(onset_envelope=oenv, sr=sr, hop_length=hop, start_bpm=95, tightness=200)
bt = librosa.frames_to_time(beats, sr=sr, hop_length=hop)
print('tempo', tempo, 'nbeats', len(bt), 'first beats', np.round(bt[:8], 3))
# kick strength at each beat: low-passed drums onset
dl = librosa.effects.preemphasis(drums, coef=-0.97)  # crude low emphasis
S = np.abs(librosa.stft(drums, hop_length=hop))
freqs = librosa.fft_frequencies(sr=sr)
low = S[freqs < 150].sum(0); high = S[(freqs > 3000)].sum(0)
lowd = np.maximum(0, np.diff(low, prepend=low[0])); highd = np.maximum(0, np.diff(high, prepend=high[0]))
def at(env, t, w=3):
    f = librosa.time_to_frames(t, sr=sr, hop_length=hop); return env[max(0, f-w):f+w+1].max()
kick = np.array([at(lowd, t) for t in bt]); snare = np.array([at(highd, t) for t in bt])
# downbeat phase: phase with max mean kick
ph = [kick[p::4].mean() for p in range(4)]; sn = [snare[p::4].mean() for p in range(4)]
print('kick by phase', np.round(ph, 1), 'snare by phase', np.round(sn, 1))
p0 = int(np.argmax(ph))
def rms(y, a, b):
    s = y[int(a*sr):int(b*sr)]; return float(np.sqrt(np.mean(s**2))) if len(s) else 0.0
bars = []
for i in range(p0, len(bt)-4, 4):
    a, b = bt[i], bt[i+4]
    bars.append(dict(bar=len(bars), t=round(float(a), 3), full=rms(full, a, b), drums=rms(drums, a, b), bass=rms(bass, a, b), inst=rms(inst, a, b), voc=rms(voc, a, b)))
mx = {k: max(b[k] for b in bars) for k in ['full', 'drums', 'bass', 'inst', 'voc']}
print(f"{'bar':>3} {'t':>7} | full drum bass inst voc  (0-9 scale)")
for b in bars:
    print(f"{b['bar']:>3} {b['t']:>7.2f} | " + '  '.join(str(min(9, int(10*b[k]/mx[k]))) for k in ['full', 'drums', 'bass', 'inst', 'voc']))
# vocal phrase entrances: vocal RMS envelope frames
venv = librosa.feature.rms(y=voc, hop_length=hop)[0]; vt = librosa.frames_to_time(np.arange(len(venv)), sr=sr, hop_length=hop)
thr = 0.12*venv.max(); on = venv > thr
# smooth gaps < 0.35s
starts = []; ends = []; inside = False; last_on = -9
for t, o in zip(vt, on):
    if o:
        if not inside and t - last_on > 0.45: starts.append(round(float(t), 3))
        inside = True; last_on = t
    else:
        if inside and t - last_on > 0.45: ends.append(round(float(last_on), 3)); inside = False
print('vocal phrase starts', starts[:80])
json.dump(dict(tempo=float(np.atleast_1d(tempo)[0]), beats=[round(float(x), 4) for x in bt], downbeat_phase=p0, bars=bars, vocal_starts=starts, vocal_ends=ends), open(OUT, 'w'))
