"""WebDrip toolkit — voiceover lines + word-timed subtitles.

Usage:
  python3 vo.py gen vo.json [line_id ...]   # Kokoro (kokoro-onnx) -> <out>/<id>.wav, trimmed, peak-safe
  python3 vo.py align vo.json               # faster-whisper tiny.en word timings -> <out>/whisper.json
  python3 vo.py captions vo.json            # map timings onto the display text -> captions.json for Remotion
vo.json: {
  "voice": "af_heart", "out": "/tmp/vo", "captions": "/tmp/video/src/captions.json",
  "model": "/tmp/kokoro/kokoro-v1.0.onnx", "voices": "/tmp/kokoro/voices-v1.0.bin",
  "aliases": {"writing": "riding"}, "whisper_model": "base.en" (optional, default tiny.en),
  "lines": [{"id": "hook", "start": 0.25, "speed": 0.95, "say": "spoken text", "show": "subtitle text"}, ...]
}
Model files: github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/{kokoro-v1.0.onnx,voices-v1.0.bin}.
"say" carries pronunciation spellings ("Web Drip", "get web drip dot com"); "show" is what the subtitles print.
Kokoro's float output can exceed 1.0 on plosives, so each line is scaled to a 0.9 peak before writing.
"""
import difflib
import json
import re
import sys

import numpy as np
import soundfile as sf


def gen(cfg, only):
    from kokoro_onnx import Kokoro
    k = Kokoro(cfg['model'], cfg['voices'])
    for l in cfg['lines']:
        if only and l['id'] not in only:
            continue
        s, sr = k.create(l['say'], voice=l.get('voice', cfg['voice']), speed=l.get('speed', 1.0), lang=l.get('lang', cfg.get('lang', 'en-us')))
        idx = np.where(np.abs(s) > 0.01)[0]
        s = s[max(0, idx[0] - int(.06 * sr)): idx[-1] + int(.12 * sr)]
        s = s * (0.9 / max(0.9, float(np.abs(s).max())))
        sf.write(f"{cfg['out']}/{l['id']}.wav", s, sr)
        print(l['id'], round(len(s) / sr, 2), 's', round(len(l['say'].split()) / (len(s) / sr), 2), 'words/s')


def align(cfg):
    from faster_whisper import WhisperModel
    m = WhisperModel(cfg.get('whisper_model', 'tiny.en'), device='cpu', compute_type='int8')
    out = {}
    for l in cfg['lines']:
        f = f"{cfg['out']}/{l['id']}.wav"
        a, sr = sf.read(f)
        segs, _ = m.transcribe(f, word_timestamps=True, language='en', beam_size=5)
        words = [(w.word.strip(), round(w.start, 3), round(w.end, 3)) for s in segs for w in s.words]
        out[l['id']] = {'words': words, 'dur': len(a) / sr, 'peak': float(np.abs(a).max())}
        print(f"{l['id']:8s} {len(a) / sr:5.2f}s | " + ' '.join(w[0] for w in words))
    json.dump(out, open(f"{cfg['out']}/whisper.json", 'w'), indent=1)


def captions(cfg):
    wh = json.load(open(f"{cfg['out']}/whisper.json"))
    aliases = cfg.get('aliases', {})

    def norm(w):
        w = re.sub(r'[^a-z0-9]', '', w.lower().replace('www', '').replace('.com', 'com'))
        return aliases.get(w, w)

    out = []
    for l in cfg['lines']:
        disp = l['show'].split()
        ww = wh[l['id']]['words']
        times = [None] * len(disp)
        sm = difflib.SequenceMatcher(a=[norm(d) for d in disp], b=[norm(w[0]) for w in ww], autojunk=False)
        for a, b, n in sm.get_matching_blocks():
            for k in range(n):
                times[a + k] = (ww[b + k][1], ww[b + k][2])
        # unmatched display words share the gap between their matched neighbours
        i = 0
        while i < len(disp):
            if times[i] is None:
                j = i
                while j < len(disp) and times[j] is None:
                    j += 1
                t0 = times[i - 1][1] if i > 0 else (ww[0][1] if ww else 0.0)
                t1 = times[j][0] if j < len(disp) else (ww[-1][2] if ww else wh[l['id']]['dur'])
                if t1 <= t0:
                    t1 = t0 + 0.25 * (j - i)
                span = (t1 - t0) / (j - i)
                for k in range(i, j):
                    times[k] = (t0 + span * (k - i), t0 + span * (k - i + 1))
                i = j
            else:
                i += 1
        # whisper sometimes returns a zero-length word glued to its neighbour: split the neighbour's span
        for k in range(1, len(times)):
            if times[k][1] - times[k][0] < 0.06 and times[k - 1][1] - times[k - 1][0] > 0.2:
                mid = (times[k - 1][0] + times[k][0]) / 2
                times[k - 1] = (times[k - 1][0], mid)
                times[k] = (mid, max(times[k][1], mid + 0.12))
        s0 = l['start']
        out.append({'id': l['id'], 'start': s0, 'words': [{'text': d, 'start': round(s0 + t[0], 3), 'end': round(s0 + t[1], 3)} for d, t in zip(disp, times)]})
    json.dump(out, open(cfg['captions'], 'w'), indent=1)
    print('wrote', cfg['captions'], sum(len(o['words']) for o in out), 'words')


if __name__ == '__main__':
    cmd, path, *rest = sys.argv[1:]
    cfg = json.load(open(path))
    {'gen': lambda: gen(cfg, rest), 'align': lambda: align(cfg), 'captions': lambda: captions(cfg)}[cmd]()
