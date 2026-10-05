import numpy as np, librosa, soundfile as sf, scipy.signal as ss, json
d=np.load('bands.npz'); t=d['t']; dt=t[1]-t[0]
perc=d['cym']/d['cym'].max()+d['snare']/d['snare'].max()+0.5*d['kick']/d['kick'].max()
pk,_=ss.find_peaks(perc,height=0.15,distance=int(0.2/dt)); pt=t[pk]
# beat tracking by prediction+snap
beats=[9.125]; per=0.49
while beats[-1]<52:
    pred=beats[-1]+per
    c=pt[(pt>pred-0.06)&(pt<pred+0.06)]
    b=float(c[np.argmin(abs(c-pred))]) if len(c) else pred
    beats.append(b)
    if len(beats)>4: per=np.median(np.diff(beats[-6:]))
beats=np.round(beats,3)
print('ioi',np.round(np.diff(beats),3).tolist())
# smooth via local linear fit (9-beat window) to remove jitter >25ms
sm=[]
for i in range(len(beats)):
    lo=max(0,i-4);hi=min(len(beats),i+5); idx=np.arange(lo,hi)
    p=np.polyfit(idx,beats[lo:hi],1); fit=np.polyval(p,i)
    sm.append(beats[i] if abs(beats[i]-fit)<0.03 else fit)
beats=np.round(sm,3)
# harmonic onsets for riff notes
y,sr=sf.read('sna_mono.wav'); y=y[:int(56*sr)]
H,P=librosa.effects.hpss(y,margin=2.0)
oe=librosa.onset.onset_strength(y=H,sr=sr,hop_length=128,fmax=600)
hon=librosa.onset.onset_detect(onset_envelope=oe,sr=sr,hop_length=128,units='time',backtrack=True,delta=0.05)
# vocal phrase onsets
v=d['voc']; v=np.convolve(v,np.ones(9)/9,'same'); th=22
act=v>th; ph=[]; last=-9
for i in range(1,len(act)):
    if act[i] and not act[i-1] and t[i]>15 and t[i]-last>1.2: ph.append(round(float(t[i]),3)); last=t[i]
print('vocal phrase starts',ph)
json.dump(dict(beats=beats.tolist(),hon=[round(float(x),3) for x in hon],voc=ph),open('raw.json','w'))
print('beats',beats.tolist())
