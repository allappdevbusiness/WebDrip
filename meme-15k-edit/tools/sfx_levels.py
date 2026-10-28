"""Pull each score SFX down until it sits >= 13 dB under the voice around it (editing-videos: 12-24 dB under).

Measures the SFX alone against the untouched voice in the SFX's first 0.5 s and lowers gain_db in roteiro.json.
Usage: python tools/sfx_levels.py   (then re-run score.py and mix_bed.py)
"""
import json
import subprocess

import numpy as np

SR = 48000
UNDER = 13.0


def load(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32)


rms = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)  # noqa: E731
voice = load('public/audio/fala.wav')
tl = json.load(open('public/timeline.json'))
r = json.load(open('roteiro.json'))
for s in r['scenes']:
    for e in s.get('sfx', []):
        at = next(x['at'] for x in tl['sfx'] if x['file'] == e['file'] and abs(x['gain_db'] - e['gain_db']) < 1e-6 and x.get('_done') is None and not x.update(_done=1))
        clip = load('public/' + e['file'])[: int(0.5 * SR)] * 10 ** (e['gain_db'] / 20)
        a = int(at * SR)
        under = rms(voice[a:a + len(clip)]) - rms(clip)
        if under < UNDER:
            e['gain_db'] = round(float(e['gain_db'] - (UNDER - under)), 1)
        print(f"{at:6.2f} {e['file']:24s} under {under:5.1f} -> gain {e['gain_db']}")
json.dump(r, open('roteiro.json', 'w'), indent=1)
