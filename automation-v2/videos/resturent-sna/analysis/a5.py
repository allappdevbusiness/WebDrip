import numpy as np, librosa, soundfile as sf, scipy.signal as ss, json
d=np.load('bands.npz'); t=d['t']; cym=d['cym']; kick=d['kick']; snare=d['snare']
# beats from cymbal 9-47 (clear), snare peaks too
x=cym/np.max(cym)
pk,_=ss.find_peaks(x,height=0.12,distance=int(0.33/(t[1]-t[0])))
bt=[round(float(t[p]),3) for p in pk if 8.9<t[p]<52.5]
print(len(bt)); print(bt)
print('ioi',np.round(np.diff(bt),3).tolist())
