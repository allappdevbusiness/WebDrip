import sys, numpy as np, librosa, warnings
warnings.filterwarnings('ignore')
for f in sys.argv[1:]:
    y, sr = librosa.load(f, sr=22050, mono=True)
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr, units='time')
    S = np.abs(librosa.stft(y, n_fft=2048, hop_length=512))
    freqs = librosa.fft_frequencies(sr=sr, n_fft=2048)
    t = librosa.frames_to_time(np.arange(S.shape[1]), sr=sr, hop_length=512)
    def band(lo, hi): return (S[(freqs>=lo)&(freqs<hi)]**2).sum(0)
    low, mid, high = band(20,150), band(150,2000), band(2000,10000)
    # bars from beats (assume 4/4, phase from first beat)
    bt = np.array(beats); bars = bt[::4]
    rows=[]
    for i in range(len(bars)-1):
        m=(t>=bars[i])&(t<bars[i+1])
        rows.append((bars[i], 10*np.log10(low[m].mean()+1e-9), 10*np.log10(mid[m].mean()+1e-9), 10*np.log10(high[m].mean()+1e-9)))
    rows=np.array(rows)
    print(f"== {f} tempo {float(np.atleast_1d(tempo)[0]):.1f} dur {len(y)/sr:.1f}s bars {len(rows)}")
    ref = rows[:,1:].max(0)
    line=[]
    for r in rows:
        line.append(f"{r[0]:5.1f}:{r[1]-ref[0]:+4.0f}/{r[2]-ref[1]:+3.0f}/{r[3]-ref[2]:+3.0f}")
    for k in range(0,len(line),6): print('  '.join(line[k:k+6]))
    # drops: low jumps >= 8 dB vs mean of previous 2 bars
    d=[(round(rows[i,0],2), round(rows[i,1]-rows[i-2:i,1].mean(),1)) for i in range(2,len(rows)) if rows[i,1]-rows[i-2:i,1].mean()>8]
    print('drops', d)
