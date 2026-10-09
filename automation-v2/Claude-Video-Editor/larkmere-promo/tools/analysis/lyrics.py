import sys, json
from faster_whisper import WhisperModel
m = WhisperModel('small.en', device='cpu', compute_type='int8')
import soundfile as sf; a, _ = sf.read(sys.argv[1], dtype='float32')
segs, info = m.transcribe(a, word_timestamps=True, vad_filter=False, beam_size=5, condition_on_previous_text=False)
out = []
for s in segs:
    print(f"{s.start:7.2f}-{s.end:7.2f} {s.text}")
    out.append(dict(start=s.start, end=s.end, text=s.text, words=[dict(w=w.word, s=round(w.start, 3), e=round(w.end, 3)) for w in s.words]))
json.dump(out, open(sys.argv[2], 'w'), indent=1)
