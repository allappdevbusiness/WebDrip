import sys, numpy as np, librosa
S = sys.argv[1]
v, sr = librosa.load(f'{S}/dl/music/vocals_preview.mp3', sr=22050, mono=True, offset=75, duration=27)
o = librosa.onset.onset_detect(y=v, sr=sr, units='time', hop_length=256, backtrack=True, delta=0.12) + 75
r = librosa.feature.rms(y=v, hop_length=256)[0]; t = librosa.times_like(r, sr=sr, hop_length=256) + 75
off = 72.5553
for x in o:
    i = np.searchsorted(t, x); lvl = 20*np.log10(r[min(len(r)-1, i+4)]+1e-9)
    print(f'song {x:7.3f}  video {x-off:6.3f}  frame {round((x-off)*30):4d}  level {lvl:6.1f}')
# silent gaps
q = r < 0.08*r.max(); edges = np.diff(q.astype(int)); 
print('vocal silence starts:', np.round(t[1:][edges == 1], 2)); print('vocal silence ends:', np.round(t[1:][edges == -1], 2))
