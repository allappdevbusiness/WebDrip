import numpy as np, soundfile as sf, librosa
y,sr=sf.read('sna_mono.wav')
for (a,b) in [(12.9,17.2),(43.6,52.2)]:
    seg=y[int(a*sr):int(b*sr)]; seg=librosa.effects.harmonic(seg,margin=3)
    f0,_,_=librosa.pyin(seg,fmin=40,fmax=200,sr=sr,hop_length=512,frame_length=4096)
    tt=a+np.arange(len(f0))*512/sr; prev=None; out=[]
    for x,f in zip(tt,f0):
        n=librosa.hz_to_note(f,octave=False) if not np.isnan(f) else '-'
        if n!=prev: out.append(f'{x:.2f}:{n}'); prev=n
    print(' '.join(o for o in out if not o.endswith('-')))
