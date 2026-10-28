"""Hand-back checks on the delivered MP4 (on top of extreme-motion-design qa.py).

- 1080x1920, 30 fps CFR, H.264 yuv420p, AAC; duration and frame count
- every frame decodes; black frames
- audio sync: cross-correlation of the delivered audio against the untouched source voice (lag in ms)
- voice untouched: delivered audio minus the source voice leaves only the music bed (residual uncorrelated with the voice)
Usage: python tools/verify.py out/final.mp4 public/footage.mp4
"""
import json
import subprocess
import sys

import numpy as np

mp4, src = sys.argv[1], sys.argv[2]
SR = 48000


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True, check=True)


def pcm(path, start=0.0, dur=None):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(start), '-i', path]
    if dur:
        cmd += ['-t', str(dur)]
    cmd += ['-vn', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32)


probe = json.loads(run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', mp4]).stdout)
v = next(s for s in probe['streams'] if s['codec_type'] == 'video')
a = next((s for s in probe['streams'] if s['codec_type'] == 'audio'), None)
frames = int(run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', mp4]).stdout.strip())
dec = subprocess.run(['ffmpeg', '-v', 'error', '-i', mp4, '-f', 'null', '-'], capture_output=True, text=True)
black = subprocess.run(['ffmpeg', '-i', mp4, '-vf', 'blackdetect=d=0.05:pix_th=0.05', '-an', '-f', 'null', '-'], capture_output=True, text=True).stderr
black_spans = [line.split('blackdetect ')[1] for line in black.splitlines() if 'black_start' in line]

out = {
    'size': f"{v['width']}x{v['height']}",
    'fps': v['r_frame_rate'],
    'avg_fps': v['avg_frame_rate'],
    'video_codec': v['codec_name'],
    'pix_fmt': v['pix_fmt'],
    'color': [v.get('color_primaries'), v.get('color_transfer'), v.get('color_space')],
    'audio_codec': a and a['codec_name'],
    'audio_rate': a and a['sample_rate'],
    'duration': float(probe['format']['duration']),
    'video_duration': float(v['duration']),
    'audio_duration': a and float(a['duration']),
    'frames': frames,
    'decode_errors': dec.stderr.strip()[:300] or None,
    'black_spans': black_spans,
}

# sync: lag of the delivered audio against the source voice, in several windows
lags = []
for t0 in (3.0, 15.0, 30.0, 47.0):
    d = pcm(mp4, t0, 4.0)
    s = pcm(src, t0, 4.0)
    n = min(len(d), len(s))
    d, s = d[:n] - d[:n].mean(), s[:n] - s[:n].mean()
    c = np.fft.irfft(np.fft.rfft(d, 2 * n) * np.conj(np.fft.rfft(s, 2 * n)))
    c = np.concatenate([c[-n:], c[:n]])
    lags.append(round((np.argmax(c) - n) / SR * 1000, 2))
out['av_lag_ms_per_window'] = lags

# voice untouched: residual after subtracting the source voice
d = pcm(mp4)
s = pcm(src)
n = min(len(d), len(s))
r = d[:n] - s[:n]
db = lambda x: round(float(20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)), 1)  # noqa: E731
out['voice_rms_db'] = db(s[:n])
out['residual_rms_db'] = db(r)
out['residual_voice_corr'] = round(float(np.corrcoef(r, s[:n])[0, 1]), 4)
print(json.dumps(out, indent=1))
