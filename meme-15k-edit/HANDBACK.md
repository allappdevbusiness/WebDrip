# Hand-back: $15K meme-page story, 9:16 edit

Deliverable: `out/final.mp4` (not in git; rebuild with the steps below). 1080x1920, 30 fps CFR, H.264 yuv420p BT.709,
AAC 48 kHz, 55.167 s, 1655 frames, 46.4 MB.

Post caption credit (not burned in): **Music: Kevin MacLeod (incompetech.com)**. Sound effects: Epidemic Sound
(user's subscription; no attribution line required, listed in `public/audio/credits.json`).

## Revision 2 (user feedback: "use Epidemic for SFX", "$15,000 went behind the head", "not smooth")

- 15 Epidemic Sound effects, 20 placements from score cues (whooshes and paper rip on cuts, boom on the slam, zap,
  pop/plop, glitch hits, laser, error beeps, distorted boom, ghost whoosh, record scratch), each >= 13 dB under the
  voice; the mix never peaks above the voice's own -0.77 dBFS (+0.02 dB from the bed). Voice still untouched.
- $15,000: the shot eases back to 80% inside an ink frame, the number rises out from behind his head (cutout in front)
  and lands fully readable above it, then the shot eases back to full size; his face is never covered.
- Smoothing: torn-paper (ink body) wipes over the 7 hard cuts, 14-frame eased punch-ins (were 6-frame snaps), softer
  caption entrances (rise + scale, no 1.25x slam), eased exits for the background shift, payoff slam and soul freeze.
- Flash check after the change: the only >3/s window is still the approved 10-frame zoom flicker (43.97-44.27 s).
- Full renders used: 3 of 4.

## Verification (run on the delivered file)

| Check | Result |
|---|---|
| Size / fps / codecs | 1080x1920, 30/1 CFR, h264 yuv420p bt709, aac 48 kHz |
| Duration | video 55.167 s, audio 55.166 s, 1655 frames, 0 decode errors, 0 black frames |
| Audio sync vs source voice | 0.00 / -0.02 / -0.02 / -0.02 ms in four windows |
| Picture sync vs source | best frame offset 0 at frames 400, 1100, 1600 |
| Voice untouched | delivered audio minus source voice = music bed only (-38 dB, corr -0.04 with the voice) |
| Music under voice | ~22 dB under during speech, ~39 dB under at the payoff duck |
| `qa.py --profile reels` | PASS codec, size, BT.709, fps, audio coverage, contrast vs stills, no long freeze, no black, rhythm per scene. **FAIL** loudness -15.7 LUFS (target -14) and true peak -0.6 dBTP (max -1): the untouched source voice, by user decision. **FAIL** flashes: worst window 6/s, only inside the approved 10-frame zoom flicker (43.97-44.27 s). WARN 1-frame pops at the flicker and deep-fry frames (the effects). |
| `lint.py` | 0 FAIL, 15 WARN (speech rate, voice starts at 0 s, no tail after the last word: all fixed by the footage) |
| `layout.py` | 0 FAIL, 9 WARN (window titles and labels just outside the 80% horizontal text zone, inside the 90% action area) |
| Independent reviewer (`critic.md`) | 2 rounds. Round 2 retold the story correctly from frames alone. Real FIXes applied; the rest answered below. |
| Full renders used | 3 of 4 |

## Effects (all from the brief, each once)

| # | Effect | Where |
|---|---|---|
| 1 | Soul leaving the body | 50.33-51.30 s, freeze on the defeated frame (29.1 s source, eyes closed), ghost copy rises into a torn-open MS Paint sky |
| 2 | Sudden background shift | 46.50-48.20 s "comments were in different languages": cutout over a pop-up wall of comments in 12 languages |
| 3 | Rapid face zoom flicker | 43.93-44.27 s "and they were": single frames wide <-> eyes / mouth |
| 4 | Intrusive thought pop-up | 28.43-31.67 s "I'm gonna go all in": his own live face in a devil bubble |
| 5 | Bad acting teleport | 5.47 s, the repeated "early on in my career": framing jumps + 2-frame white strobe |
| 6 | Dynamic text slam | 26.57-28.17 s: "$15,000" behind his head (cutout on top) |
| 7 | Freeze-frame x-ray glitch | 31.67 s, 5 frames, inverted neon-threshold subject |
| 8 | Eye-flash laser strobe | 45.07 s, 3 frames, both hosts ("Indian names") |
| 9 | Parallel reality flop | 54.27 s "zero", 10 frames, 2-frame alternation smile (53.8 s) / grimace (32.9 s) |
| 10 | Deep fried panic | 48.87 s, 10 frames on "no" |

Also: hook headline "$15,000 ON MEME PAGES" (0-2 s), payoff slam "NO SHOPIFY traffic." (48.87-50.33 s), two Win95
insert windows (inserts whole), word-timed captions, motivated punch-ins on "Bloom" and "went all in".

## Rebuild

```bash
cd meme-15k-edit && npm ci && uv venv .venv --python 3.12
```
Media: copy the source to `public/footage.mp4` and the track to `public/audio/hidden_agenda.mp3`, then
`ffmpeg -i public/footage.mp4 -an -vf fps=30 -c:v libx264 -crf 10 public/footage30.mp4`,
`roto.py` for the five windows in `public/roto/`, `python tools/mix_bed.py public/timeline.json`,
`node .claude/skills/extreme-motion-design/scripts/render.cjs Meme15k`, then mux `public/audio/mix.wav` over the video
stream with plain AAC (no limiter) and `deliver.py`. Skill patches: `SKILL-PATCHES.md`.
