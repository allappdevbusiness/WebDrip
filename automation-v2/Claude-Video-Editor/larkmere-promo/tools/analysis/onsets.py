import sys, numpy as np, librosa
S = sys.argv[1]
d, sr = librosa.load(f'{S}/dl/music/drums.wav', sr=44100, mono=True, offset=74, duration=30)
o = librosa.onset.onset_detect(y=d, sr=sr, units='time', hop_length=256, backtrack=True) + 74
print('drum onsets 95.5-98.5:', np.round(o[(o > 95.5) & (o < 98.6)], 3))
oe = librosa.onset.onset_strength(y=d, sr=sr, hop_length=256)
ot = librosa.times_like(oe, sr=sr, hop_length=256) + 74
pk = librosa.util.peak_pick(oe, pre_max=3, post_max=3, pre_avg=5, post_avg=5, delta=oe.max()*0.25, wait=4)
strong = ot[pk]; print('strong drum hits 77-103:', np.round(strong[(strong > 77) & (strong < 103)], 3))
v, _ = librosa.load(f'{S}/dl/music/vocals_preview.mp3', sr=22050, mono=True, offset=95, duration=6)
r = librosa.feature.rms(y=v, hop_length=220)[0]; t = librosa.times_like(r, sr=22050, hop_length=220) + 95
on = t[np.where((r[1:] > 0.25*r.max()) & (r[:-1] <= 0.25*r.max()))[0]+1]; print('vocal rises 95-101:', np.round(on, 3))
