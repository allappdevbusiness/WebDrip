import numpy as np, soundfile as sf, librosa, librosa.display
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
y,sr=sf.read('sna_mono.wav'); y=y[:int(56*sr)]
H,P=librosa.effects.hpss(y,margin=2.0)
hop=256
def band(sig,lo,hi):
    S=np.abs(librosa.stft(sig,n_fft=2048,hop_length=hop))
    f=librosa.fft_frequencies(sr=sr,n_fft=2048)
    return S[(f>=lo)&(f<hi)].sum(0)
t=librosa.frames_to_time(np.arange(len(band(P,0,10))),sr=sr,hop_length=hop)
kick=band(P,30,120); snare=band(P,1500,5000); cym=band(P,6000,16000)
voc=band(H,300,3000); low=band(H,40,250)
np.savez('bands.npz',t=t,kick=kick,snare=snare,cym=cym,voc=voc,low=low)
fig,ax=plt.subplots(6,1,figsize=(40,16),sharex=True)
for a,(n,v) in zip(ax,[('kick',kick),('snare',snare),('cym',cym),('voc 300-3k harm',voc),('low harm',low)]):
    a.plot(t,v,lw=.6); a.set_ylabel(n); a.grid(True,which='both')
S=librosa.amplitude_to_db(np.abs(librosa.stft(y,hop_length=512)),ref=np.max)
librosa.display.specshow(S,sr=sr,hop_length=512,x_axis='time',y_axis='log',ax=ax[5])
for a in ax: a.set_xticks(np.arange(0,56,1))
plt.tight_layout(); plt.savefig('bands.png',dpi=50)
