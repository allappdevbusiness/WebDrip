"""Music bed under the untouched footage voice -> public/audio/mix.wav.

Same placement and voice-envelope ducking as extreme-motion-design mix.py, minus its final loudnorm:
the user ruled the voice stays sample-for-sample at its original level (no gain, no limiter).
Adds the brief's extra duck at the payoff ("and then there was no Shopify traffic").
Usage: python tools/mix_bed.py public/timeline.json
"""
import json
import pathlib
import sys

import numpy as np
import soundfile as sf

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / '.claude/skills/extreme-motion-design/scripts'))
import mix  # noqa: E402  (load, place, envelope, db, SR)

tl_path = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'public/timeline.json')
base = tl_path.parent
tl = json.loads(tl_path.read_text(encoding='utf-8'))
cues = json.loads((base / 'cues.json').read_text(encoding='utf-8'))
SR = mix.SR
n = int(tl['duration'] * SR)

voice = np.zeros((n, 2), np.float32)
nar = tl['narration']
mix.place(voice, mix.load(base / nar['file']), nar.get('start', 0), 1.0)  # unity: the voice is not processed

mus = tl['music']
m = mix.load(base / mus['file'])[int(mus.get('offset', 0) * SR):][:n].copy()
fi, fo = int(mus.get('fade_in', 0.4) * SR), int(mus.get('fade_out', 1.2) * SR)
m[:fi] *= np.linspace(0, 1, fi)[:, None]
m[-fo:] *= np.linspace(1, 0, fo)[:, None]
music = np.zeros((n, 2), np.float32)
mix.place(music, m, 0, mix.db(mus.get('gain_db', -10)))

env = mix.envelope(voice)
active = np.clip((20 * np.log10(env + 1e-9) + 45) / 15, 0, 1)  # same activity curve as mix.py
duck = mus.get('duck_db', -6) * active

# payoff duck: from the cue to the cue's end, with short ramps
m0, m1 = cues['ev']['payoff_duck'], cues['ev']['payoff_duck_end']
t = np.arange(n) / SR
ramp = 0.15
pay = np.clip(np.minimum((t - (m0 - ramp)) / ramp, ((m1 + ramp) - t) / ramp), 0, 1)
duck = duck + mus.get('payoff_duck_db', -12) * pay
music *= mix.db(duck)[:, None]

# Epidemic Sound effects from the score (timeline.json sfx: at, file, gain_db), placed like mix.py does
fx = np.zeros((n, 2), np.float32)
for ev in tl.get('sfx', []):
    mix.place(fx, mix.load(base / ev['file']), ev['at'], mix.db(ev.get('gain_db', -12)))

out = base / tl.get('audio', 'audio/mix.wav')
bed = music + fx
sf.write(out, voice + bed, SR, subtype='FLOAT')
peak = 20 * np.log10(np.abs(voice + bed).max() + 1e-12)
print(json.dumps({'out': str(out), 'duration': tl['duration'], 'sample_peak_dbfs': round(float(peak), 2),
                  'payoff_duck': [m0, m1], 'sfx': len(tl.get('sfx', []))}))
