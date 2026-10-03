# WebDrip run toolkit

Reusable pieces for each daily concept-site + promo run. Copy, then change only content, timing and layout choices.

| File | What it does |
| --- | --- |
| `demo.spec.js` | Playwright smoke tests (Desktop 1280×720 + iPhone 13). Copy to `<slug>/tests/demo.spec.js` and edit `CONFIG`. |
| `pw.config.js` | Minimal Playwright config: `TEST_DIR=<repo>/<slug>/tests NODE_PATH=<video>/node_modules npx playwright test -c pw.config.js` |
| `rec.js` | Frame-by-frame recorder. Takes a JSON plan of shots (scroll from/to, holds, clicks/taps/fills), slows CSS animations with `Animation.setPlaybackRate`, sets `window.__wdTimeScale` for JS timing, retries flaky proxy image loads and encodes each shot to `<out>/<profile>-<shot>.mp4`. |
| `mix.py` | Music + voice mix: places voice lines, ducks music ~9 dB under speech, synthesises whoosh / impact / tick / pop / rise in code, masters to −14 LUFS with peaks under −1 dBFS. |
| `vo.py` | Voiceover + subtitles: `gen` makes each line with Kokoro (kokoro-onnx, trimmed, scaled to a 0.9 peak), `align` gets word timings with faster-whisper tiny.en, `captions` maps them onto the display text (difflib + gap fill + alias map) and writes the Remotion `captions.json`. |
| `remotion/` | Promo project template. `src/layout.ts` holds the shared layout system (canvas, safe areas, subtitle lanes, TikTok UI mock, spacing scale, scene boundaries, motion); `src/Promo.tsx` renders the Feed (4:5) and TikTok (9:16) cuts with centred frames, a split screen (type column + tall tile), a bento (one wide tile over two halves), a TikTok desktop-tile + overlapping phone, an "explode" card lift, zoom highlights with `Chip` labels, and `CropTile` windows onto desktop *or* mobile clips; `check.mjs` renders stills at the start/middle/end of every scene and every transition midpoint for both cuts, logs DOM bounding boxes from the composition and fails on safe-area, centring, clip-fill, overlap, TikTok-UI and tilt violations. Pieces tagged `data-offset` (split screen, bento halves) are checked as one centred group. |

Notes that saved time:
- Launch Chromium with `proxy: { server: $HTTPS_PROXY, bypass: '<-loopback>,localhost,127.0.0.1' }` — without `<-loopback>` the local site request goes to the proxy (405).
- Remotion renders need `--browser-executable=/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell` and local `.woff2` fonts in `public/`.
- `node --experimental-strip-types check.mjs` runs the checker directly on the TypeScript layout module.
- A form field named `style` shadows `form.style` — never use it as a field name.
- Buffer `createPost`: `assets` is a list of one-key objects — `[{ video: { url, metadata: { title } } }]` (not `{ videos: [...] }`). Facebook also needs `metadata: { facebook: { type: post | reel | story } }`; TikTok takes `metadata: { tiktok: { title, isAiGenerated } }`. Poll with `post(input: { id }) { status externalLink error { message } }`.
- Give `id="top"` to the hero section, not `<main>`: the spec's visibility test skips everything inside `#top`.
- Full-width tiles grow past the safe area during the 1.03 push-in: size them to `CONTENT.w / PUSH` (feed bento 932 px). On TikTok anything below y 900 must also clear the button column (x > 940), so keep lower pieces ≤ 760 px wide and centred.
- A split screen (type column + tile) can't use the group push (the text doesn't scale); `sceneMotion` sets its push to 1 and the tile zooms inside instead.
- Epidemic `EditRecording`: three required regions or `maxResults` > 1 came back `COMPLETED` with `edit: null` (the poll tool only exposes the deprecated `edit` field). Use `maxResults: 1` and at most two `requiredRegionsAtOffsets`, then measure the hits in the result with librosa and snap scene boundaries to them.
- Kokoro: `pip install -U pip setuptools wheel` fails on Debian's own pip/wheel — add `--ignore-installed`. download.pytorch.org is blocked, so use kokoro-onnx (model files from the GitHub release); Hugging Face works for faster-whisper.
- Whisper tiny hears an American "riding" as "writing" and can return zero-length words — `vo.py captions` handles both (alias map + span split).
- Count-ups started late in some recordings; if a number must read final in the video, give the shot a longer hold after the section enters.

