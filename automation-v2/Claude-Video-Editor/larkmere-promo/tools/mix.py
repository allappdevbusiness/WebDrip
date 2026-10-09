"""Larkmere promo audio: music edit + optional hook audio + three quiet SFX, mastered to -14 LUFS.

usage: python mix.py <music_dir> <sfx_dir> <out.wav> [hook_clip.mp4 hook_in_seconds]
music_dir holds full.wav (vocal mix) and instrumental.wav (Epidemic 'Rose In The Garden', Cody Francis).
All times come from music-map.json (measured on the licensed WAVs).
"""
import json, subprocess, sys, os
import numpy as np, soundfile as sf
from scipy.signal import resample_poly

SR = 48000
DUR = 30.0
FPS = 30
HERE = os.path.dirname(os.path.abspath(__file__))
MAP = json.load(open(os.path.join(HERE, '..', 'music-map.json')))

def read(path, a=None, b=None):
    with sf.SoundFile(path) as f:
        sr = f.samplerate
        if a is not None: f.seek(int(round(a * sr)))
        x = f.read(int(round((b - a) * sr)) if b is not None else -1, always_2d=True)
    if x.shape[1] == 1: x = np.repeat(x, 2, 1)
    if sr != SR: x = resample_poly(x, SR, sr, axis=0)
    return x.astype(np.float64)

def place(bus, x, t, gain=1.0):
    i = int(round(t * SR)); n = min(len(x), len(bus) - i)
    if n > 0: bus[i:i + n] += x[:n] * gain

def fade(x, fin=0.0, fout=0.0):
    x = x.copy()
    if fin: n = int(fin * SR); x[:n] *= np.sin(np.linspace(0, np.pi / 2, n))[:, None] ** 2
    if fout: n = int(fout * SR); x[-n:] *= np.cos(np.linspace(0, np.pi / 2, n))[:, None] ** 2
    return x

def main():
    music_dir, sfx_dir, out = sys.argv[1:4]
    hook = sys.argv[4:6]
    bus = np.zeros((int(DUR * SR), 2))
    A, B = MAP['edit']
    xf = 0.03
    # vocal mix: bar 28 (breath bar) -> just before the bar-38 downbeat ("garden" on the tonic)
    a_out = A['song_out'] - 0.03                       # leave the final downbeat's transient to segment B
    va = read(f'{music_dir}/full.wav', A['song_in'], a_out + xf / 2)
    place(bus, fade(va, fin=0.008, fout=xf), A['video_in'])
    # instrumental: the song's final downbeat + ring-out, landing exactly on frame 834
    b_in = B['song_in'] - 0.03 - xf / 2
    vb = read(f'{music_dir}/instrumental.wav', b_in, B['song_out'])
    vb = fade(vb, fin=xf, fout=B['tail_fade_s'])
    place(bus, vb, B['video_in'] - 0.03 - xf / 2)
    music = bus.copy()

    # SFX on real on-screen actions only (frame -> seconds)
    sfx = np.zeros_like(bus)
    fold = fade(read(f'{sfx_dir}/paper-fold.wav')[: int(1.7 * SR)], fin=0.01, fout=0.4)
    place(sfx, fold, 547 / FPS - 0.05, 0.9)                 # paper sheets rise (frames 547-571)
    scrunch = fade(read(f'{sfx_dir}/paper-scrunch.wav'), fout=0.12)
    place(sfx, scrunch, 607 / FPS - 0.10, 0.75)             # cord pulls the paper tight on "tight"
    touch = read(f'{sfx_dir}/ui-touch.wav')
    for fr in (683, 691, 699, 707):                         # palette chip taps
        place(sfx, touch, fr / FPS, 0.42)
    mix = music + sfx

    if hook:
        clip, t_in = hook[0], float(hook[1])
        wav = out + '.hook.wav'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t_in), '-t', str(A['video_in'] + 0.05), '-i', clip, '-vn', '-ac', '2', '-ar', str(SR), wav], check=True)
        h = read(wav)[: int(A['video_in'] * SR)]
        place(mix, fade(h, fin=0.01, fout=0.05), 0.0, 1.0)  # hard audio cut into the music's first downbeat
        os.remove(wav)

    # master: -14 LUFS integrated, true peak <= -2 dBTP before AAC (encode adds up to ~1 dB)
    import pyloudnorm as pyln
    meter = pyln.Meter(SR)
    lufs = meter.integrated_loudness(mix)
    mix *= 10 ** ((-14.0 - lufs) / 20)
    mix = limit(mix, 10 ** (-2.0 / 20))
    print(f'loudness in {lufs:.1f} LUFS -> {meter.integrated_loudness(mix):.1f} LUFS, true peak {20*np.log10(true_peak(mix)):.2f} dBTP')
    sf.write(out, mix.astype(np.float32), SR, subtype='PCM_24')

def true_peak(x):
    return np.max(np.abs(resample_poly(x, 4, 1, axis=0)))

def limit(x, ceil, look=0.005, rel=0.08):
    # look-ahead peak limiter on the 4x-oversampled envelope (no clipping, no pumping on this material)
    env = np.max(np.abs(resample_poly(x, 4, 1, axis=0)).reshape(-1, 4, 2), axis=(1, 2))
    need = np.minimum(1.0, ceil / np.maximum(env, 1e-9))
    la = int(look * SR)
    need = np.minimum.reduce([np.roll(need, -k) for k in range(la)])
    g = np.empty_like(need); cur = 1.0; r = np.exp(-1 / (rel * SR))
    for i, v in enumerate(need):
        cur = v if v < cur else v + (cur - v) * r
        g[i] = cur
    return x * g[:, None]

if __name__ == '__main__':
    main()
