# check vocal vs instrumental versions are sample-aligned, and find exact drum-entry onset + vocal at the switch point
import sys, numpy as np, soundfile as sf
S = sys.argv[1]
def seg(f, a, b):
    with sf.SoundFile(f) as h:
        sr = h.samplerate; h.seek(int(a*sr)); x = h.read(int((b-a)*sr)); return x.mean(1) if x.ndim > 1 else x, sr
v, sr = seg(f'{S}/dl/music/full.wav', 76, 80); i, _ = seg(f'{S}/dl/music/instrumental.wav', 76, 80)
c = np.correlate(v[:sr*2], i[sr//2:sr//2+sr], 'valid'); lag = np.argmax(c) - sr//2
print('lag samples (vocal vs instrumental):', lag)
d, _ = seg(f'{S}/dl/music/drums.wav', 77.0, 78.0)
env = np.abs(d); k = np.argmax(env > 0.2*env.max()); print('drum entry onset s:', 77.0 + k/sr)
for a in [99.6, 99.8, 99.9, 100.0, 100.2, 100.4, 100.6]:
    x, _ = seg(f'{S}/dl/music/full.wav', a, a+0.1); y, _ = seg(f'{S}/dl/music/instrumental.wav', a, a+0.1)
    print(f'{a:6.2f} vocal-residual dB {20*np.log10(np.sqrt(np.mean((x-y)**2))+1e-9):6.1f}  full dB {20*np.log10(np.sqrt(np.mean(x**2))+1e-9):6.1f}')
