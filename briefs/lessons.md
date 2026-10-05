# Lessons (keep it to the 15–20 most useful)

What worked, what didn't, what to try next. Merge repeats; newest insight wins. The voice and tone rules in the run prompt always beat anything here.

## Story and words
1. Sell one story, not a feature tour, and make it read with the sound off. A real interaction can be the story: choose → matching result (with honest counts) → details → same flow on the phone → owner CTA (LEGO, 2026-10-04).
2. Every on-screen line is a plain, complete sentence a stranger understands instantly. No slang, puns, riddles or punchy fragments. Cold-read every beat before rendering.
3. For fictional businesses, a code-built "before" site (generic, no name) shows the problem instantly. For real brands, skip the "bad before" and show only the respectful alternative.
4. A visible device that carries the story (a clock chip, a live count "8 → 2 sets") makes re-hooks feel like plot, not decoration.

## Edit and craft
5. Never reuse a scene sequence. The toolkit holds building blocks only; acts, pacing and transitions come from each brief.
6. Use a light or brand-coloured canvas, never dark. Keep footage windows in the brand's own module language (12 px radius, 1 px dark outline).
7. Real depth = crane (rotateX), orbit (rotateY) and dolly that settle flat. Keep tilts ≤ 8–10° on feed and ≤ 5–6° on TikTok, and never ask anyone to read during a tilt.
8. Any hold over ~1 s needs a slow drift (≤ 3% push) or a visible change. Run `freezedetect` on the render; end-card holds are the only allowed freezes.
9. Readability: desktop crops at ≥ 1.0× wherever text matters (0.7× overviews are too small on a phone). Put window edges in white space between rows, never through a line of text or a button.
10. Check device sizes against subtitle lanes before building. A phone that grows 2–3% from drifts or a dolly must still clear the caption panel. One-line phrase captions (complete short phrases) keep panels small.

## Music and sound
11. Epidemic Pro (since 2026-10-04): `DownloadRecording` works for FULL, DRUMS, BASS and INSTRUMENTS (no MELODY option), and `DownloadSoundEffect` works. Signed links expire after about 10 minutes, so request a link, then download it straight away, one file per command, as `curl -L -o /tmp/<dir>/<name>.wav '<url>' --fail -sS` (the form `.claude/settings.json` allows). Stop and report on any permission block. If the approval system times out, retry the same command up to 3 times, a minute apart (Sourav's rule).
12. Place the song's sections on the story: find where the bass enters, where phrases start and where the breakdown is (low/mid/high band energy per bar), and set the request offset so they land on the brief's anchors. With stems, automate parts (`mix.py` `stem_moves`); without them, use timed EQ moves (`mix.py` `eq`).
13. Stems: the drum stem is sample-aligned with the full mix; the bass stem isn't (its low end is about 12 ms off the master's). So `mix.py` splits the full mix into drums, low (non-drum content under 150 Hz), melody (full minus all three stems, above 150 Hz) and rest, which sum back exactly, and `stem_moves` automate those parts in video time. Set SFX levels by 10 ms RMS against the bed (main clicks about +3 dB, subtle ticks −3 dB, no-VO taps +5 dB); a click under a spoken word sits under it. Pitch tonal SFX to the chord they land on (varispeed).
14. Speech clarity: duck with a 150 ms look-ahead (first consonants were masked otherwise) and transcribe the final mix with whisper base.en (tiny.en mishears). Sourav prefers Kokoro `af_heart` over `af_nicole` (too whispery). At speed 1.0 af_heart runs about 3–3.8 words/s, so the brief's windows leave natural breaths.
15. Master the WAV with a −4 dB ceiling: the AAC encode overshoots by up to 2 dB, and true peak must stay ≤ −1 dBTP in the delivered file.

## Tooling and posting
16. `Animation.setPlaybackRate` also slows `requestAnimationFrame` timestamps, while `performance.now()` keeps real time. Page JS must drive animations from rAF timestamps only, or smooth scrolls stall in recordings. `rec.js` only drives the scroll itself when a shot's `from` ≠ `to`.
17. Page-load animations play 12× slower inside the recorder (it sets the CDP playback rate before settleMs), so a "finished" take can still be assembling. Hold load animations behind a URL flag (`?hold` → `window.__wdBuild()`) and start them on a chosen frame; use the assembled end of that take as the finished view. Chromium proxy needs `bypass: '<-loopback>,localhost,127.0.0.1'` or local pages return 405. Never `pkill -f` a pattern that also appears in your own command line.
18. Background chains (`a && cd x && curl … &`) lose the `cd`. Use absolute output paths so audio never lands in the repo. Don't name a Python script after a stdlib module (`struct.py`).
19. The alignment checker must measure after web fonts load (the box logger now waits for the font promise), or titles measure at fallback width and fail.
20. Buffer TikTok "large number of posts… wait 24 hours" is a final error; don't retry in the same run. Check brand names against `topics-log.json` and `sites/` too.
