# WebDrip run toolkit

Reusable pieces for each daily concept-site + promo run. Copy, then change only content, timing and layout choices.

| File | What it does |
| --- | --- |
| `demo.spec.js` | Playwright smoke tests (Desktop 1280×720 + iPhone 13). Copy to `<slug>/tests/demo.spec.js` and edit `CONFIG`. |
| `pw.config.js` | Minimal Playwright config: `TEST_DIR=<repo>/<slug>/tests NODE_PATH=<video>/node_modules npx playwright test -c pw.config.js` |
| `rec.js` | Frame-by-frame recorder. Takes a JSON plan of shots (scroll from/to, holds, clicks/taps/fills), slows CSS animations with `Animation.setPlaybackRate`, sets `window.__wdTimeScale` for JS timing, retries flaky proxy image loads and encodes each shot to `<out>/<profile>-<shot>.mp4`. |
| `mix.py` | Music + voice mix: places voice lines, ducks music ~9 dB under speech, synthesises whoosh / impact / tick / pop / rise in code, masters to −14 LUFS with peaks under −1 dBFS. |
| `vo.py` | Voiceover + subtitles: `gen` makes each line with Kokoro (kokoro-onnx, trimmed, scaled to a 0.9 peak; set `"lang": "en-gb"` in vo.json for bf_emma), `align` gets word timings with faster-whisper tiny.en, `captions` maps them onto the display text (difflib + gap fill + alias map) and writes the Remotion `captions.json`. |
| `remotion/` | Promo project **building blocks only** (no scene order, pacing or edit style: each run designs those from its brief). `src/kit.ts` is the layout system (canvas, safe areas, subtitle lanes, TikTok UI mock and low-zone width, spacing scale, `browser()`/`phone()` frame maths, easing incl. a no-overshoot spring); `src/frames.tsx` holds the font loader, `BrowserFrame` / `PhoneFrame` / `CropTile` (clip fills the screen edge to edge), `useBoxLogger`, word-highlight `Subtitles`, the WebDrip mark and debug `Guides`; `src/story.ts` is a blank contract to replace each run (`ACTS`, `checkFrames()`, `tiltAt()`); `src/Promo.tsx` is an empty skeleton. `check.mjs` compiles the run's story with esbuild, renders stills at every rest/transition frame it lists for both cuts and fails on safe-area, centring (offset groups centred as one), clip-fill, text/device overlap, subtitle collisions, TikTok-UI and tilt violations. |

Notes that saved time:
- Launch Chromium with `proxy: { server: $HTTPS_PROXY, bypass: '<-loopback>,localhost,127.0.0.1' }` — without `<-loopback>` the local site request goes to the proxy (405).
- Remotion renders need `--browser-executable=/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell` and local `.woff2` fonts in `public/`.
- `node check.mjs [feed|tiktok] [--frames 40,120]` runs the checker; stills (with guides) land in /tmp/stills/check.
- A form field named `style` shadows `form.style` — never use it as a field name.
- Buffer `createPost`: `assets` is a list of one-key objects — `[{ video: { url, metadata: { title } } }]` (not `{ videos: [...] }`). Facebook also needs `metadata: { facebook: { type: post | reel | story } }`; TikTok takes `metadata: { tiktok: { title, isAiGenerated } }`. Poll with `post(input: { id }) { status externalLink error { message } }`.
- Give `id="top"` to the hero section, not `<main>`: the spec's visibility test skips everything inside `#top`.
- Devices that touch the safe-area edge (split screens) can't take the slow push-in: give them push 1 and zoom inside the clip instead. On TikTok anything below y 900 must clear the button column: keep lower pieces ≤ 780 px wide and centred when pushing 1.025.
- Epidemic `EditRecording`: three required regions or `maxResults` > 1 came back `COMPLETED` with `edit: null` (the poll tool only exposes the deprecated `edit` field). Use `maxResults: 1` and at most two `requiredRegionsAtOffsets`, then measure the hits in the result with librosa and snap scene boundaries to them.
- Kokoro: `pip install -U pip setuptools wheel` fails on Debian's own pip/wheel — add `--ignore-installed`. download.pytorch.org is blocked, so use kokoro-onnx (model files from the GitHub release); Hugging Face works for faster-whisper.
- Whisper tiny hears an American "riding" as "writing" and can return zero-length words — `vo.py captions` handles both (alias map + span split).
- Count-ups started late in some recordings; if a number must read final in the video, give the shot a longer hold after the section enters.

- Buffer TikTok can fail with "TikTok has detected a large number of posts published through the API for this channel. Wait 24 hours" — it's a final error on the post; don't retry the same run.
- Poppins is much wider than Oswald: keep video label titles ≤ ~24 characters (56 px feed / 54 px TikTok) so they stay on one line.
- Epidemic `EditRecording` with `forceDuration: true` *time-stretches* the track to fit (a 63 s edit came back ~1.4× faster). Request without it, take the natural-tempo edit (required regions land where asked) and trim/fade it to 45 s yourself.
- Long display titles: break them into balanced phrases per cut ("Same town. | Same lessons.") instead of letting the last word wrap alone.
- Epidemic `DownloadRecording` returns FORBIDDEN ("You don't have permission to download this asset") on this plan, like the sound-effect downloads. Music must come from `EditRecording` → `DownloadRecordingEdit`. Two required regions came back `FAILED` once; **one** required region (the pre-chorus → chorus span at the offset you need) with `maxResults: 1` and no `forceDuration` gave a clean 45.5 s edit with a natural fade.
- Map an edit back to the original song with chroma + MFCC cross-correlation (not raw waveforms; the preview MP3 and the WAV don't line up sample for sample). It gives a constant offset, so the original's whisper word times carry over to the edit.
- Tailwind's preflight sets `img { max-width: 100% }`: an oversized hero image (`width: 112%`) needs `max-width: none`, or the image stops short on the right.
- Tailwind `flex` on a `[hidden]` element wins over the attribute, so the mobile menu stays visible. Add `#mobileMenu[hidden] { display: none !important }`.
- Before naming a brand, also grep `topics-log.json` and `sites/` for the name, not just the web: older runs live under `sites/<date>-<name>/`.
- `cmd1 && cd dir && curl … &` sends the whole chain to the background, so later lines run in the old cwd. Put downloads in a subshell `( cd dir && … )` or use absolute `-o` paths, and never let audio land in the repo.

- `rec.js` only drives the scroll when a shot's `from` and `to` differ; otherwise the page scrolls itself, so smooth anchor links work in the recording. Each shot writes `<profile>-<shot>.json` with every click/tap/hover target's rect and any `probe` rects. Use them to place the Remotion cursor, tap rings and underlines on the real positions. It also logs late frames.
- `Animation.setPlaybackRate` slows `requestAnimationFrame` timestamps too, while `performance.now()` keeps real time. Page JS that mixes the two stalls during recording, as an anchor scroll did. Drive JS animations from rAF timestamps only.
- Integer scroll rounding makes 1-frame "holds" at the slow ends of an eased scripted scroll. That's expected and not visible.
- `mix.py` takes `music_segments` (bar-aligned cuts with equal-power crossfades), timed `eq` moves (a low-shelf dip, a band dip in place of missing stems) and sample `sfx` (`file`). `vo.py` takes `whisper_model` (base.en hears "your shelf" and "getwebdrip" correctly where tiny.en did not).
- `check.mjs` also fails a footage window (`tile`) that its own `<id>-video` doesn't fill, and checks `data-scene="global"` overlays (notice, titles) against every scene's devices.
- Epidemic (2026-10-04): `DownloadRecording` and `DownloadSoundEffect` are still FORBIDDEN, and two `requiredRegionsAtOffsets` FAILED again. One region (`maxResults: 1`, no `forceDuration`) worked, and the 3-bar cut was then made in `mix.py` on the beat grid.
- `mix.py` ducks with a 150 ms look-ahead (`duck_lookahead`), so a line's first consonant isn't masked, and takes `ceiling_db`. Master at −4 dB: the AAC encode overshoots by up to 2 dB, and the delivered file must stay ≤ −1 dBTP.
- `frames.tsx` `useFonts` publishes `window.__wdFontsReady`, and `useBoxLogger` waits for it. Without that, the checker measured titles at fallback-font width while a render ran in parallel.
