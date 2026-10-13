import sys, runpy, numpy as np, librosa
import faster_whisper.transcribe as T
_orig = T.WhisperModel.transcribe
def tr(self, audio, *a, **k):
    if isinstance(audio, str):
        audio, _ = librosa.load(audio, sr=16000, mono=True); audio = audio.astype(np.float32)
    return _orig(self, audio, *a, **k)
T.WhisperModel.transcribe = tr
sys.argv = ['vo.py'] + sys.argv[1:]
runpy.run_path('/home/user/WebDrip/_toolkit/vo.py', run_name='__main__')
