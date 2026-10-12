# Meta Muse Wonder: 60 s AI news short (2026-10-12)

Vertical 1080×1920, 30 fps, 1,800 frames (60.0 s), built and rendered with Remotion. The brief is in `brief.txt`.
The MP4, WAVs and photos are build outputs and are not committed (see "Rebuild").

## Story check (before writing a frame)
The brief's facts were checked against same-day coverage of Meta's announcement: Yahoo Tech, Investing.com, Android Headlines and Engadget, Oct 12 2026. Meta's own post (research.meta.ai/blog/muse-wonder) was listed in the search results, but it could not be opened from the build environment.
Muse Wonder is available through the Meta Model API and Muse Code; Muse Wonder Full is for Muse Code subscribers. Active Memory and Active Focus are worded as Meta describes them.
Every performance claim is attributed on screen and in the VO ("Meta says", "according to Meta", "Source: Meta", "INTERNAL TESTING").
No benchmark numbers appear anywhere. The two chart graphics are labelled as illustrations: one has equal bars and is crossed out, the other has blurred bars.
The race graphic keeps all three lanes level and puts a "?" at the finish line.
The agent web carries "Concept illustration · not a list of current features".

## Timeline (seconds; every major cut sits on the 122 BPM grid, beat = 0.4918 s)
| Time | Section | What happens |
|---|---|---|
| 0.00 | Hook | Real hand-held phone (Unsplash photo, our chat UI mapped onto the screen with a homography) scrolling yesterday's long plan |
| 2.46 | | Hard cut on "Today?": same phone, empty chat. 3.20 STARTING FROM ZERO. on yellow tape |
| 3.93 | | Facepalm reaction punch-in (punch-in 1 of 3) |
| 4.67 | | Meta photo card slams in with a camera flash. 5.90 NEVER FORGETS. 6.39 0.3 s near-black flash + bass drop |
| 6.69 | What happened | Camera push into two model cards (Wonder Full larger and darker), availability chips, "Meta says". 9.34 zoom to MOST CAPABLE YET (according to Meta). 10.33 pull back, chips light up |
| 11.80 | Real hook | Benchmark chart grows, freezes on "aren't", is crossed out on "actually", then pushed back in 3D as the music drops out. 14.75 THIS IS. then near-silence |
| 15.74 | Active Memory | Drop: ACTIVE MEMORY. on yellow. Then avatar → four memory chips → stored into a Memory panel → real flip calendar DAY 1 → 7 → 30 (speed-ramped) → same phone on Day 30 reconnecting memories → sports-replay freeze, red telestrator arrow "remembered!" → IT REMEMBERS CONTEXT. |
| 23.62 | → Active Focus | The remembered dot grows into the first workflow node |
| 24.59 | Active Focus | GOAL: Build landing page → Step 1 → Step 2 → ERROR → path physically reroutes → Try again → New approach → weaves through obstacles → SUCCESS. 29.80 celebrating person (punch-in 2). AI THAT DOESN'T JUST GIVE UP., camera pushes through the SUCCESS card |
| 31.48 | Why Meta cares | Normal chatbot window → shrinks to CHATBOT / Old AI "Answer my question." (punch-in 3 on "chatbot") → AI AGENT with Email, Calendar, Code, Documents, Tasks, a context ring, New AI "Handle this goal." |
| 39.34 | Competition | Links collapse into three lanes: FRONTIER AI RACE. Four beat cuts: CODING / AGENTS / MEMORY / REASONING, then the wide shot |
| 44.35 | Reality check | Skeptical face push-in on "catch" → META BENCHMARKS (source: Meta) → INTERNAL TESTING stamp → camera pulls back → WAITING FOR INDEPENDENT TESTS. Music drums pulled back and darker |
| 51.90 | Question | AI node with orbiting memories → everything fades → WOULD YOU USE IT? → YES / NO? → "Follow for daily AI updates." |

## Audio
- **Voice:** Kokoro `af_heart` ("Heart"), 17 lines at speed 1.0–1.2, long comma pauses trimmed (`tools/tighten.py`), each line levelled to the same loudness. Lines are placed on the beat grid (`config/vo.json`). Whisper base.en transcribes the final mix word for word.
- **Music:** Epidemic Sound "Come 2gether (House Remix)" by Ooyy (`3f673a65-8d7d-4c57-b883-5a201f8adc6c`): tech house, happy, no vocals, 122.0 BPM measured.
  Full mix plus drum, bass and instrument stems.
  Cut map in `config/music-map.json`: source bars 0–5 under the hook, then bars 62–63 (bass pulls back, then about 2.7 s of near-silence), then the drop at source 127.883 s.
  That drop lands on ACTIVE MEMORY at video 15.738 s; the measured kick is at 15.737 s.
  The reality check pulls the drums back 14 dB and dips 2.5–9 kHz by 6 dB. Music is ducked 7 dB under the voice with a 150 ms look-ahead.
- **SFX (Epidemic Sound):** 18 placements:
  - one opening impact `2f0a40ab…`
  - one subtle riser `3a4a76b6…`
  - one digital hit `27532213…`
  - one bass drop `8df9a95d…`
  - one low hit on the reveal `6d82b75c…`
  - three whooshes `073cf199…` ×2 and `c52cf22f…`
  - six mechanical clicks `6475a6c0…` (first click only)
  - one error `1f675370…`
  - one success `aaa20ea0…`
  - one stamp `93d9ea3c…`
  - one end pop `9da883ac…` (first pop only)

  Times and gains are in `config/mix.json`.
- Mixed with `_toolkit/mix.py` (stems mode).

## Pictures
Real photographs from Unsplash (credits and IDs in `config/photos.json`). There are no AI-generated images, robots, neural gradients or code rain. Every chart, phone UI, calendar page, node and lane is code-built.
The hand-held phone, flip calendar and Meta-sign photos are composited: the screen corners are fitted from the photo and the calendar digits are inpainted out (`tools/prep_assets.py`).

## Rebuild
```bash
cd video && npm install
python3 -I ../tools/prep_assets.py .          # photos, phone mask/shading, blank calendar, fonts -> public/
# config/*.json use ${WORK} for a scratch dir: replace it with a real path first (the scripts don't expand it)
# voice: Kokoro model files go in ${WORK}/kokoro
python3 -I ../tools/vo.py gen ../config/vo.json && python3 -I ../tools/tighten.py ${WORK}/vo/*.wav
python3 -I ../tools/vo.py align ../config/vo.json && python3 -I ../tools/vo.py captions ../config/vo.json
# music + SFX: download the Epidemic files above into ${WORK}/music and ${WORK}/sfx (click1/pop1 = first 0.40/0.30 s of the click/pop), then
python3 -I ../../../../_toolkit/mix.py ../config/mix.json   # -> public/mix.wav
node stills.mjs /tmp/stills 1 0.1,3.5,15.9              # stills with safe-area guides
npx remotion render src/index.ts MuseWonder out.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p --color-space=bt709 --image-format=png \
  --audio-codec=aac --audio-bitrate=320k \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```
`tools/vo.py` is the toolkit copy with one change: whisper gets a 16 kHz array instead of a file path, because PyAV ≥ 15 rejects the keyword argument faster-whisper passes when opening files.

## QC
Final file `meta-muse-wonder-60s.mp4` (18.5 MB, not committed), measured with `tools/qc.py`:
- H.264 1080×1920, 30 fps, **1,800 video frames**, yuv420p tagged BT.709 limited range, AAC 48 kHz stereo 320 kb/s, fast-start.
- **−14.1 LUFS** integrated, **−1.7 dBTP** true peak on the encoded AAC, 2.1 LU loudness range.
- No freezes over 1.2 s (`freezedetect`), 175 hard visual changes, and motion on 62% of frames.
  The longest stretch without a hard cut is 4.7 s (51.9–56.6, the orbit outro); it keeps continuous orbit motion and a beat-locked camera lean.
- Whisper base.en transcribes the final mix word for word, so nothing is masked. The drop's kick measures at 15.737 s for a 15.738 s target.
- There is about 15 dB of near-silence before ACTIVE MEMORY (−30 vs −15 dB RMS).
- The safe area was checked on stills with guides at every section: important text stays in x 120–960, y 150–1520; below y 900 it clears x 940.
- Brief checklist:
  - The hook opens on movement and a human hand: a real phone, not a logo.
  - Active Memory and Active Focus are each explained by a concrete story (remembered chips, then a rerouted path).
  - Every Meta claim is attributed.
  - The voice sits about 9 dB over the ducked bed.
  - SFX are limited to the 18 placements listed above.
  - The ending is the question.

Known gaps:
- **B-roll**: footage is real photographs moved in camera, not stock video. Coverr's media host `cdn.coverr.co` is blocked by this environment's network policy, and no other stock-video host is allowed.
- **Wording**: the hook's "never forgets" is stronger than Meta's own wording ("carry important context across conversations"); the body of the video uses Meta's wording.
- **Brief vs. script**: the brief asks to emphasise "head-to-head", which is not in the script. It also asks to return to "the three-company motif from the hook", but the rewritten hook has none, so the race introduces the three names fresh.
