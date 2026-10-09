import sys, numpy as np, librosa
S = sys.argv[1]
y, sr = librosa.load(f'{S}/dl/music/instrumental.wav', sr=22050, mono=True)
d, _ = librosa.load(f'{S}/dl/music/drums.wav', sr=22050, mono=True)
def db(x): return 20*np.log10(np.sqrt(np.mean(x**2))+1e-9)
print('tail RMS (instrumental) per 0.316s from 190:')
for t in np.arange(190, 201.1, 0.3158): print(f'{t:7.2f} inst {db(y[int(t*sr):int((t+.3158)*sr)]):6.1f} drums {db(d[int(t*sr):int((t+.3158)*sr)]):6.1f}')
oe = librosa.onset.onset_strength(y=d, sr=sr, hop_length=256); ot = librosa.times_like(oe, sr=sr, hop_length=256)
pk = librosa.util.peak_pick(oe, pre_max=3, post_max=3, pre_avg=5, post_avg=5, delta=oe.max()*0.25, wait=4)
s = ot[pk]; print('strong drum hits 185-201:', np.round(s[s > 185], 3))
C = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=512)
ct = librosa.times_like(C, sr=sr, hop_length=512)
def chroma(a, b): m = (ct >= a) & (ct < b); v = C[:, m].mean(1); return v/np.linalg.norm(v)
names = 'C C# D D# E F F# G G# A A# B'.split()
for a in [97.83, 100.36, 102.886, 95.307, 92.78]:
    v = chroma(a, a+1.2); print(f'chroma {a:7.2f}:', ' '.join(f'{names[i]}{v[i]:.2f}' for i in np.argsort(-v)[:4]))
for a in np.arange(192, 200, 0.6316):
    v = chroma(a, a+1.2); print(f'chroma {a:7.2f}:', ' '.join(f'{names[i]}{v[i]:.2f}' for i in np.argsort(-v)[:4]), f' sim-to-100.36 {v @ chroma(100.36, 101.56):.3f}')
