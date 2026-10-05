# python3 analysis/synccheck.py video.mp4 — cut/SFX timing vs the beat map
import json, subprocess, sys, numpy as np, soundfile as sf, librosa, os, tempfile
v = sys.argv[1]
bm = json.load(open(os.path.join(os.path.dirname(__file__), '..', 'src', 'beatmap.json')))
events = sorted(set([n['t'] for n in bm['riffNotes']] + bm['beats'] + [s['t'] for s in bm['sections']]))
ev = np.array(events)
# video: mean abs frame difference at 60 fps on a 90x160 proxy
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', v, '-vf', 'scale=90:160,format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, 160, 90).astype(np.int16)
d = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))
cuts = [(i + 1) / 60 for i in range(1, len(d) - 1) if d[i] > 28 and d[i] > 2.5 * np.median(d[max(0, i - 6):i + 6])]
off = [min(ev - c, key=abs) for c in cuts]
print(f'frames={len(fr)} duration={len(fr)/60:.3f}s  hard cuts={len(cuts)}')
print('cut offsets vs nearest beat-map event (ms): median %.0f, 90%% within %.0f' % (np.median(np.abs(off)) * 1000, np.percentile(np.abs(off), 90) * 1000))
for c, o in zip(cuts, off):
    if abs(o) > 0.05: print(f'  off-grid cut at {c:.3f}s ({o*1000:+.0f} ms)')
# audio
tmp = tempfile.mktemp(suffix='.wav'); subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', v, '-ac', '1', '-ar', '48000', tmp])
y, sr = sf.read(tmp)
on = librosa.onset.onset_detect(y=y, sr=sr, units='time', backtrack=False, delta=0.2)
print(f'audio duration={len(y)/sr:.3f}s, sfx onsets={len(on)}, peak={20*np.log10(np.abs(y).max()+1e-9):.1f} dBFS')
