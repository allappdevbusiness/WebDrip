# WebDrip run toolkit

Reusable pieces for each daily concept-site + promo run. Copy, then change only content, timing and layout choices.

| File | What it does |
| --- | --- |
| `demo.spec.js` | Playwright smoke tests (Desktop 1280×720 + iPhone 13). Copy to `<slug>/tests/demo.spec.js` and edit `CONFIG`. |
| `react-starter/` | React site plumbing only (no components or design): `package.json` (React 19, Vite 7, Tailwind 4 via `@tailwindcss/vite`), `vite.config.js` (`base: './'`, `outDir: '..'`, `emptyOutDir: false`), `scripts/clean.mjs` (deletes `<site_dir>/assets`), `scripts/prerender.mjs` (SSR bundle → `renderToString` → injected into the built `index.html`, then hashed JS/CSS + latin fonts + image URLs written into `sw.js`), `public/sw.js` (cache-first, versioned by slug), `src/entry-server.jsx` (exports `render` and `precacheUrls`) and `src/motion.js` (one shared rAF loop, timed from rAF timestamps). Copy into `<site_dir>/app/`, replace `SLUG`, then `npm install && npm run build`. |
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
- Before naming a brand, also grep `topics-log.json` and `automation-v1/` for the name, not just the web: older runs live under `automation-v1/<date>-<name>/`.
- `cmd1 && cd dir && curl … &` sends the whole chain to the background, so later lines run in the old cwd. Put downloads in a subshell `( cd dir && … )` or use absolute `-o` paths, and never let audio land in the repo.

- `rec.js` only drives the scroll when a shot's `from` and `to` differ; otherwise the page scrolls itself, so smooth anchor links work in the recording. Each shot writes `<profile>-<shot>.json` with every click/tap/hover target's rect and any `probe` rects. Use them to place the Remotion cursor, tap rings and underlines on the real positions. It also logs late frames.
- `Animation.setPlaybackRate` slows `requestAnimationFrame` timestamps too, while `performance.now()` keeps real time. Page JS that mixes the two stalls during recording, as an anchor scroll did. Drive JS animations from rAF timestamps only.
- Integer scroll rounding makes 1-frame "holds" at the slow ends of an eased scripted scroll. That's expected and not visible.
- `mix.py` takes `music_segments` (bar-aligned cuts with equal-power crossfades), timed `eq` moves (a low-shelf dip, a band dip in place of missing stems) and sample `sfx` (`file`). `vo.py` takes `whisper_model` (base.en hears "your shelf" and "getwebdrip" correctly where tiny.en did not).
- `check.mjs` also fails a footage window (`tile`) that its own `<id>-video` doesn't fill, and checks `data-scene="global"` overlays (notice, titles) against every scene's devices.
- Epidemic (2026-10-04): `DownloadRecording` and `DownloadSoundEffect` are still FORBIDDEN, and two `requiredRegionsAtOffsets` FAILED again. One region (`maxResults: 1`, no `forceDuration`) worked, and the 3-bar cut was then made in `mix.py` on the beat grid.
- Epidemic Pro (later on 2026-10-04): `DownloadRecording` now returns links for FULL, DRUMS, BASS and INSTRUMENTS (the MELODY stem is listed but has no download option), and `DownloadSoundEffect` works. Links expire in about 10 minutes; download each one immediately with `curl -L -o /tmp/... '<url>' --fail -sS` (allowed by `.claude/settings.json`). Files are 48 kHz (music) and 96 kHz (SFX) WAV.
- `mix.py` `stems` + `stem_moves`: the drum stem sums sample-exactly into the full mix, but the bass stem's low end sits about 12 ms off the master's, so a plain stem sum leaves a −17 dB low residual. The mixer therefore splits the full mix into drums / low (non-drum content < 150 Hz) / melody (full − drums − bass − instruments, > 150 Hz) / rest, which sum back exactly, and automates those parts. Music segments (`from`/`to` in track time) apply to every part.
- `mix.py` ducks with a 150 ms look-ahead (`duck_lookahead`), so a line's first consonant isn't masked, and takes `ceiling_db`. Master at −4 dB: the AAC encode overshoots by up to 2 dB, and the delivered file must stay ≤ −1 dBTP.
- `frames.tsx` `useFonts` publishes `window.__wdFontsReady`, and `useBoxLogger` waits for it. Without that, the checker measured titles at fallback-font width while a render ran in parallel.

- React runs (2026-10-05): custom CSS outside a layer beats every Tailwind v4 utility (`.wd-btn { display: inline-flex }` beat `hidden md:inline-flex`). Put custom classes in `@layer components { … }` and keep only the `html.js` reveal states and reduced-motion rules unlayered.
- Chrome's IntersectionObserver never reports a target that is fully hidden by its own `clip-path: inset(0 0 100% 0)`. For mask reveals, clip the children and observe the parent.
- A CSS animation overrides inline transforms while it applies. For intro animations on elements that JS also moves, use `animation-fill-mode: backwards` so the inline transform wins once the animation ends.
- Count-ups: keep the prerendered final number until the element is in view, then reset to 0 and count. Zeroing them early leaves 0 in static screenshots.
- The hero photo's starting transform lives in both `index.css` (no-JS state) and the hero script. Keep the two in sync, or the first frame jumps.

- Multi-page React (2026-10-06, EyeMax): `entry-server.jsx` exports `pages` (`{ 'file.html': () => html }`) and `prerender.mjs` injects every page and precaches all of them. Add each HTML file to `build.rollupOptions.input`. Vite warns that `outDir` is the parent of root; that's expected.
- Mobile overflow: slide-in start states (`translateX(±56px)`) and `<fieldset>`'s default `min-width: min-content` widen the page on phones. Use `main > section { overflow-x: clip }` (sticky still works), `fieldset { min-width: 0 }` and `.grid > * { min-width: 0 }`.
- Headless Chromium skips cross-document view transitions now and then. Record `pagereveal`'s `e.viewTransition` in an inline head script and add a fade-in class when it's null, so a transition always shows.
- Letter-split headings: keep the space between words outside the `inline-block` word span, or it collapses ("Seewell.").
- `@playwright/test` isn't installed globally (only `playwright`): `npm i @playwright/test@1.56.1` in a scratch dir and run with `NODE_PATH=<scratch>/node_modules`.
