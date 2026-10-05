import numpy as np, json
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
d=np.load('bands.npz'); t=d['t']; r=json.load(open('raw.json'))
m=(t>42)&(t<52.5)
fig,ax=plt.subplots(4,1,figsize=(30,10),sharex=True)
for a,n in zip(ax,['kick','snare','cym','low']):
    a.plot(t[m],d[n][m],lw=.7); a.set_ylabel(n)
    for b in r['beats']:
        if 42<b<52.5: a.axvline(b,color='r',lw=.5)
    for h in r['hon']:
        if 42<h<52.5: a.axvline(h,color='g',lw=.5,ls='--')
    a.set_xticks(np.arange(42,52.5,0.25)); a.grid(alpha=.3)
plt.tight_layout(); plt.savefig('zoom47.png',dpi=45)
