import numpy as np, json, soundfile as sf, librosa
r=json.load(open('raw.json')); b=np.array(r['beats'])
for i in range(0,len(b),8): print('cycle',i//8,'beat',i,b[i], ' riff notes:',[h for h in r['hon'] if b[i]-0.1<h<b[i]+3.9][:9])
# broadband energy jump around 47
d=np.load('bands.npz'); t=d['t']
hi=d['cym']+d['voc']
for s in np.arange(46.5,47.6,0.05):
    m=(t>=s)&(t<s+0.05); print(round(s,2), round(float(hi[m].mean()),1), round(float(d['voc'][m].mean()),1))
