import numpy as np, soundfile as sf, librosa
y,sr=sf.read('sna_mono.wav'); 
# ffmpeg decode already strips encoder delay; wav t=0 == song player position 0
env=np.abs(y)
hop=256
rms=librosa.feature.rms(y=y,frame_length=1024,hop_length=hop)[0]
t=librosa.frames_to_time(np.arange(len(rms)),sr=sr,hop_length=hop)
db=20*np.log10(rms+1e-9)
print('first frames dB:')
for i in range(0,int(3*sr/hop),8): print(f'{t[i]:.3f} {db[i]:.1f}')
# first sample above thresholds
for th in [0.001,0.005,0.01,0.03]:
    idx=np.argmax(env>th); print('thresh',th,idx/sr)
