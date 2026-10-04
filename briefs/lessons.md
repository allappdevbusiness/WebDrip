# Lessons (keep it to the 15–20 most useful)

What worked, what didn't, what to try next. Merge repeats; newest insight wins.

## Story and edit
1. Sell a story, not a feature tour. One relatable POV scenario with a twist and a payoff (e.g. two tabs, one booking) beats labelled "01 · Hero" walkthroughs, and reads with the sound off.
2. Never reuse a scene sequence. The toolkit holds building blocks only; acts, pacing and transitions come from each brief's `story.ts`.
3. Canvas is light or brand-coloured, never dark. A short desaturated "mood" beat on a light canvas works for a twist.
4. Re-hook every ~3–5 s with a real story turn (zoom into the problem, a dismiss flick, a reveal, a layout change), not just a new label.
5. A code-built "before" (a generic dated site with no name) makes the contrast instant without touching a real business.
6. Next: add true 3D camera depth (a slow orbit or dolly that settles flat). 2D slides alone cap "cinematic" at about 7.

## Craft
7. Hook = tension + visual proof in frame 1, no logo intro. On TikTok, make the opening devices big. Side-by-side phones get small in 9:16, so stack or overlap them.
8. Break multi-line titles into balanced phrases per cut ("Same town. | Same lessons.") so no word sits alone.
9. Devices touching the safe-area edge (split screens) can't take the slow push-in. Give them push 1 and zoom inside the clip instead.
10. Hand-drawn underline: reveal it with a clip-path, not dasharray on a non-scaling stroke (round caps leave stubs).
11. Tilts are short (under 0.6 s) and settle flat before every hold.

## Audio and voice
12. Find the track's own quiet break first and put the key twist line on it, with the reveal on the band's re-entry.
13. Epidemic EditRecording with `forceDuration` time-stretches the track (it came back ~1.4× faster). Use the natural-tempo edit and trim/fade it yourself. Use maxResults 1 and at most two required regions.
14. Keep Kokoro at ≤ 1.03 speed with ≥ 0.35 s gaps; write fewer words rather than speeding up lines.
15. Code-made SFX only on real visual moments; duck the music ~9 dB under speech; master to −14 LUFS.

## Tooling and posting
16. Kokoro: use kokoro-onnx (download.pytorch.org is blocked) and run `pip install -U pip setuptools wheel --ignore-installed` first. Whisper tiny mishears some words; vo.py's alias map handles it.
17. Chromium proxy needs `bypass: '<-loopback>,localhost,127.0.0.1'` or local pages 405.
18. Never `pkill -f` a pattern that also appears in your own command line: it kills the shell running it.
19. Buffer TikTok "large number of posts… wait 24 hours" is a final error; don't retry in the same run.
