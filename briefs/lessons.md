# Lessons (keep it to the 15–20 most useful)

What worked, what didn't, what to try next. Merge repeats; newest insight wins.

## Story and edit
1. Sell a story, not a feature tour. Earlier runs labelled scenes "01 · Hero / 02 · Navigation…", which reads as a product demo. Build the edit around one relatable scenario with a twist and a payoff.
2. Never reuse a scene sequence from run to run. The toolkit holds building blocks only (layout system, frames, loaders, checker); scenes and pacing come from each brief.
3. Canvas is light or brand-coloured, never dark: earlier promos sat on a near-black pine canvas.
4. Re-hook roughly every 5 s with a real turn in the story (a question, a reveal, a cut to a new layout), not just a new label.

## Craft
5. Hook = tension + visual proof in frame 1. No logo or brand intro first.
6. Keep video titles at or under ~24 characters for wide display fonts so they stay on one line.
7. Count-ups can start late in recordings: give any number that must read final a long hold after its section enters.
8. Tilts are short (under 0.6 s) and settle flat before every hold, or the alignment check flags them.

## Audio
9. Epidemic EditRecording: use maxResults 1 and at most two requiredRegionsAtOffsets, or the job can come back COMPLETED with edit: null. Measure the hits in the result with librosa and snap cuts to them.
10. Pick tracks with low 1–4 kHz density so the voice sits on top. Duck the music about 9 dB under speech.
11. Generate code-made SFX and use fewer of them: only mark real visual moments.

## Tooling and posting
12. Kokoro: use kokoro-onnx (download.pytorch.org is blocked); `pip install -U pip setuptools wheel --ignore-installed` first.
13. Whisper tiny mishears some words and can return zero-length words; vo.py's alias map and span split handle it.
14. Buffer TikTok can return "TikTok has detected a large number of posts published through the API… wait 24 hours". It's a final error, so don't retry in the same run.
15. Chromium proxy needs `bypass: '<-loopback>,localhost,127.0.0.1'` or local pages 405.
