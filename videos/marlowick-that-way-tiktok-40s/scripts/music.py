"""Builds the 40 s music bed from the licensed full mix of "That Way" (Nbhd Nick).
Edits are listed in SEGMENTS (source in/out seconds) and written to music-map.json.
Usage: python3 scripts/music.py <path-to-full-mix.wav>"""
import json, sys
import numpy as np, soundfile as sf

SRC = sys.argv[1] if len(sys.argv) > 1 else 'audio-src/that-way-full.wav'
DUR = 40.0
FPS = 60
BPM = 137.0
BEAT = 60 / BPM
GRID0 = 0.012  # first beat in the source (fit to the drum stem onsets, kick on beats 0 mod 4)
# video time -> source time. Seg 1 to 2 drops one beat (beat 3 of the bar before the hook), so the
# opening line "Put my bros on the payroll" starts whole and the hook still lands at 3.000 s.
# Seg 2 to 3 leaves the verse after "...ten in a day" and goes to the song's own outro.
SEGMENTS = [
    {'src_in': 24.592, 'src_out': 27.120, 'xfade_in': 0.030},
    {'src_in': 27.558, 'src_out': 59.500, 'xfade_in': 0.015},
    {'src_in': 168.113, 'src_out': None, 'xfade_in': 0.040, 'gain_db': 5.0},
]
ACCENT_SRC = 28.030  # measured onset of the hook's downbeat hit (pre-drop gap 27.88-28.01)
FADE_OUT = 0.75

x, sr = sf.read(SRC, always_2d=True)
n_total = int(round(DUR * sr))
out = np.zeros((n_total, x.shape[1]))
v = 0.0
segmap = []
for i, s in enumerate(SEGMENTS):
    length = (s['src_out'] - s['src_in']) if s['src_out'] else DUR - v
    xf = s['xfade_in']
    a = int(round((s['src_in'] - (xf if i else 0)) * sr))
    n = int(round((length + (xf if i else 0)) * sr))
    chunk = x[a:a + n].copy() * (10 ** (s.get('gain_db', 0) / 20))
    if i == len(SEGMENTS) - 1 and s.get('gain_db'):
        # ease the outro gain in over its first bar so the lift is not a step
        ramp = np.clip(np.arange(len(chunk)) / (BEAT * 4 * sr), 0, 1)
        g = 10 ** (s['gain_db'] * ramp / 20) / 10 ** (s['gain_db'] / 20)
        chunk *= g[:, None]
    start = int(round((v - (xf if i else 0)) * sr))
    k = int(round(xf * sr))
    if i == 0:
        chunk[:k] *= np.linspace(0, 1, k)[:, None]
    else:  # equal-power crossfade with the previous segment
        t = np.linspace(0, 1, k)
        out[start:start + k] *= np.cos(t * np.pi / 2)[:, None]
        chunk[:k] *= np.sin(t * np.pi / 2)[:, None]
    end = min(n_total, start + len(chunk))
    if i == 0:
        out[start:end] = chunk[:end - start]
    else:
        out[start + k:end] = chunk[k:end - start]
        out[start:start + k] += chunk[:k]
    segmap.append({'video_in': round(v, 4), 'video_out': round(v + length, 4), 'src_in': s['src_in'],
                   'src_out': round(s['src_in'] + length, 4), 'crossfade_in_s': xf, 'gain_db': s.get('gain_db', 0)})
    v += length
fo = int(FADE_OUT * sr)
out[-fo:] *= (np.cos(np.linspace(0, np.pi / 2, fo)) ** 2)[:, None]
sf.write('public/audio/music-bed.wav', out.astype(np.float32), sr, subtype='FLOAT')

# video-time beat grid (segment 2 carries the hook and verse)
off = SEGMENTS[1]['src_in'] - segmap[1]['video_in']
lead = (GRID0 + 64 * BEAT) - ACCENT_SRC  # onsets sit this far ahead of the fitted grid
def vbeat(n):
    return GRID0 + n * BEAT - off - lead
beats = []
for n in range(56, 140):
    t = vbeat(n)
    if segmap[1]['video_in'] <= t < segmap[1]['video_out']:
        beats.append({'beat': n, 'bar_beat': n % 4 + 1, 'video_s': round(t, 4), 'frame': int(round(t * FPS))})
bars = [b for b in beats if b['bar_beat'] == 1]
json.dump({
    'track': {'title': 'That Way', 'artist': 'Nbhd Nick', 'version': 'Full mix (vocal)', 'epidemic_id': '58bb6bb2-d6b6-41e1-a09f-ef99b215e39b',
              'url': 'https://www.epidemicsound.com/music/tracks/58bb6bb2-d6b6-41e1-a09f-ef99b215e39b/', 'source_duration_s': 182.334,
              'sample_rate': sr, 'catalog_bpm': 137},
    'measured': {'bpm': BPM, 'beat_s': BEAT, 'grid_first_beat_src_s': GRID0, 'meter': '4/4, half-time trap feel: kick on beat 1, snare/clap on beat 3',
                 'downbeats': 'beat index % 4 == 0', 'hook_accent_src_s': ACCENT_SRC,
                 'sections_src_s': {'intro_no_drums': [0, 14.03], 'verse1_hook_lines': [14.03, 28.04], 'chorus1': [28.04, 42.05],
                                    'verse2': [42.05, 70.24], 'breakdown': [70.24, 84.09], 'outro_no_drums': [168.19, 182.33]}},
    'excerpt_choice': {
        'chosen': 'A: "Put my bros on the payroll" -> chorus 1 ("Out of sight, out of mind, I\'m away" x4) -> verse 2 up to "I can make ten in a day" -> song outro',
        'rejected': 'B: breakdown -> hook 2 at 84.09 -> chorus 2 -> bridge "Anything I do, I do it". Heavier drums, but video 0 would start inside "Take care of my mommy" and its 40 s out point falls inside "Bought a whole house"; it also needed an off-grid exit edit.',
        'lyric_check': 'Lyrics transcribed from the vocal stem preview (faster-whisper small.en) and checked by section. The excerpt avoids the breakdown (70-84 s) and its "robbery" / slang lines.'},
    'segments': segmap,
    'edits': [
        {'video_s': segmap[1]['video_in'], 'type': 'one-beat drop', 'detail': 'removed source 27.120-27.558 (beat 3 of the bar before the hook) inside a held vowel; splice points sit just before two matching snare hits; 15 ms equal-power crossfade'},
        {'video_s': segmap[2]['video_in'], 'type': 'jump to outro', 'detail': 'after "...ten in a day" (vocal gap 59.30-59.50) to the outro start at 168.113 (end of the final chorus\'s reverb tail); 40 ms crossfade; outro lifted +5 dB over one bar'},
        {'video_s': DUR - FADE_OUT, 'type': 'fade', 'detail': f'{FADE_OUT} s cosine fade to the last sample; no syllable is cut (outro has no vocal before 180.9 s)'},
    ],
    'markers': {
        'hook_accent': {'video_s': 3.0, 'frame': 180, 'note': 'lapel planes open on this frame (website reveal)'},
        'scenes_frames': json.load(open('src/timeline.json'))['scenes'],
        'events_frames': json.load(open('src/timeline.json'))['beats'],
        'sfx_frames': {c['id']: c['frame'] for c in json.load(open('src/timeline.json'))['sfx']},
        'lyric_holds': [
            {'video_s': [0.35, 2.75], 'lyric': 'Put my bros on the payroll'},
            {'video_s': [3.0, 17.0], 'lyric': "Out of sight, out of mind, I'm away (x4) - chorus under reveal, design detail and Astra + Opus"},
            {'video_s': [16.4, 34.4], 'lyric': 'verse 2, ending "...I can make ten in a day" before the CTA'},
            {'video_s': [34.47, 40.0], 'lyric': 'instrumental outro under the CTA'}],
        'bars': bars,
        'beats': beats,
    },
}, open('music-map.json', 'w'), indent=1)
print('segments', segmap)
print('accent video', ACCENT_SRC - off, 'bars', [(b['frame']) for b in bars])
