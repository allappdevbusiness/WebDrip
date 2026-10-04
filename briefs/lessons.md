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
11. Epidemic on this plan: `DownloadRecording` (full and stems) and `DownloadSoundEffect` are FORBIDDEN, and two `requiredRegionsAtOffsets` FAILED twice. Request one required region (`maxResults: 1`, no `forceDuration`), map it back to the original with chroma + MFCC cross-correlation, then make extra cuts yourself on the beat grid (`mix.py` `music_segments`).
12. Place the song's sections on the story: find where the bass enters, where phrases start and where the breakdown is (low/mid/high band energy per bar), and set the request offset so they land on the brief's anchors. Without stems, use timed EQ moves (`mix.py` `eq`).
13. Without library SFX, use the brief's fallback. Short hits lifted from the licensed track's percussive layer (HPSS) placed quietly on visible actions, plus the music's own downbeats on big moments, beat synthesized "effects".
14. Speech clarity: duck with a 150 ms look-ahead (first consonants were masked otherwise) and dip the music's 1.5–6 kHz under the CTA URL. Transcribe the final mix with whisper base.en (tiny.en mishears).
15. Master the WAV with a −4 dB ceiling: the AAC encode overshoots by up to 2 dB, and true peak must stay ≤ −1 dBTP in the delivered file.

## Tooling and posting
16. `Animation.setPlaybackRate` also slows `requestAnimationFrame` timestamps, while `performance.now()` keeps real time. Page JS must drive animations from rAF timestamps only, or smooth scrolls stall in recordings. `rec.js` only drives the scroll itself when a shot's `from` ≠ `to`.
17. Chromium proxy needs `bypass: '<-loopback>,localhost,127.0.0.1'` or local pages return 405. Never `pkill -f` a pattern that also appears in your own command line.
18. Background chains (`a && cd x && curl … &`) lose the `cd`. Use absolute output paths so audio never lands in the repo. Don't name a Python script after a stdlib module (`struct.py`).
19. The alignment checker must measure after web fonts load (the box logger now waits for the font promise), or titles measure at fallback width and fail.
20. Buffer TikTok "large number of posts… wait 24 hours" is a final error; don't retry in the same run. Check brand names against `topics-log.json` and `sites/` too.
