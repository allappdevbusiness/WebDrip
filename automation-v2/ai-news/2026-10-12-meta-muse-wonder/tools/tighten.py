import sys, numpy as np, soundfile as sf
for f in sys.argv[1:]:
    a, sr = sf.read(f); hop = int(.01*sr)
    rms = np.sqrt(np.convolve(a**2, np.ones(hop)/hop, 'same'))
    quiet = rms < 10**(-38/20)
    out=[]; i=0; n=len(a); cut=0
    while i < n:
        if quiet[i]:
            j=i
            while j<n and quiet[j]: j+=1
            L=j-i
            if L>int(.30*sr) and i>0 and j<n:
                keep=int(.24*sr); h=keep//2; xf=int(.01*sr)
                seg=np.concatenate([a[i:i+h], a[j-h:j]])
                out.append(seg); cut+=L-keep
            else:
                out.append(a[i:j])
            i=j
        else:
            j=i
            while j<n and not quiet[j]: j+=1
            out.append(a[i:j]); i=j
    b=np.concatenate(out); sf.write(f,b,sr)
    print(f.split('/')[-1], round(n/sr,2),'->',round(len(b)/sr,2))
