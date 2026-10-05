import numpy as np, soundfile as sf, librosa
y,sr=sf.read('sna_mono.wav'); y=y[:int(70*sr)]
hop=128
oenv=librosa.onset.onset_strength(y=y,sr=sr,hop_length=hop)
on=librosa.onset.onset_detect(onset_envelope=oenv,sr=sr,hop_length=hop,backtrack=True,units='time',delta=0.07)
print('onsets 1-12s:',[round(x,3) for x in on if x<12])
# pitch of notes
f0,vf,vp=librosa.pyin(y[int(1.0*sr):int(9*sr)],fmin=50,fmax=500,sr=sr,hop_length=512)
tt=1.0+np.arange(len(f0))*512/sr
prev=None
for a,b in zip(tt,f0):
    n=librosa.hz_to_note(b) if not np.isnan(b) else '-'
    if n!=prev: print(f'{a:.3f} {n}'); prev=n
tempo,beats=librosa.beat.beat_track(y=y,sr=sr,hop_length=hop,units='time',start_bpm=124)
print('tempo',tempo); print('beats',[round(b,3) for b in beats[:40]])
