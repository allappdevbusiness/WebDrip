import numpy as np, soundfile as sf, librosa
y,sr=sf.read('sna_mono.wav')
seg=y[int(1.04*sr):int(1.10*sr)]
# envelope in 1ms bins
for i in range(0,len(seg),int(sr*0.002)):
    w=seg[i:i+int(sr*0.002)]; print(f'{1.04+i/sr:.4f} peak={np.max(np.abs(w)):.4f}')
