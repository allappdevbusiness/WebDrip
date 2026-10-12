import numpy as np, soundfile as sf, json, sys
from scipy.signal import butter, sosfiltfilt
S=sys.argv[1]
def mono(p):
    a,sr=sf.read(p); return a.mean(1),sr
dr,sr=mono(f'{S}/music/drums.wav'); full,_=mono(f'{S}/music/full.wav'); bass,_=mono(f'{S}/music/bass.wav'); ins,_=mono(f'{S}/music/instruments.wav')
lp=butter(4,150,'low',fs=sr,output='sos')
kick=np.abs(sosfiltfilt(lp,dr)); hop=int(sr*0.005)
env=kick[:len(kick)//hop*hop].reshape(-1,hop).max(1)
# onset = rising edge peaks
d=np.diff(env,prepend=0); thr=np.percentile(env,90)*0.5
on=[i for i in range(1,len(env)-1) if env[i]>thr and env[i-1]<=thr]
ont=np.array(on)*hop/sr
print('kick onsets', len(ont), 'first', ont[:8].round(3))
# fit grid: period from median IOI among ~0.49
ioi=np.diff(ont); per=np.median(ioi[(ioi>0.4)&(ioi<0.6)])
print('period', per, 'bpm', 60/per)
# least squares fit of onsets to k*per+phase
k=np.round((ont-ont[0])/per); A=np.vstack([k,np.ones_like(k)]).T; (P,ph),*_=np.linalg.lstsq(A,ont,rcond=None)
print('fit period', P, 'bpm', 60/P, 'phase', ph, 'resid ms', np.abs(A@[P,ph]-ont).mean()*1000)
# per-bar band energy (bars of 4 beats starting at phase) on stems
def rms(x,a,b): s=x[int(a*sr):int(b*sr)]; return 20*np.log10(np.sqrt((s**2).mean())+1e-9)
nb=int((len(full)/sr-ph)/(4*P))
rows=[]
for i in range(nb):
    a=ph+i*4*P; b=a+4*P
    rows.append((i,round(a,3),rms(full,a,b),rms(dr,a,b),rms(bass,a,b),rms(ins,a,b)))
for r in rows[55:75]+rows[:30]:
    print(f"bar{r[0]:3d} {r[1]:8.3f}  full {r[2]:6.1f} drums {r[3]:6.1f} bass {r[4]:6.1f} ins {r[5]:6.1f}")
json.dump({'period':P,'phase':ph,'bars':rows},open(f'{S}/music/grid.json','w'))
