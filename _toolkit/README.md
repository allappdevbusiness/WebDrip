# WebDrip run toolkit

Reusable pieces for each daily concept-site + promo run. Copy, then change only content, timing and layout choices.

| File | What it does |
| --- | --- |
| `demo.spec.js` | Playwright smoke tests (Desktop 1280×720 + iPhone 13). Copy to `<slug>/tests/demo.spec.js` and edit `CONFIG`. |
| `pw.config.js` | Minimal Playwright config: `TEST_DIR=<repo>/<slug>/tests NODE_PATH=<video>/node_modules npx playwright test -c pw.config.js` |
| `rec.js` | Frame-by-frame recorder. Takes a JSON plan of shots (scroll from/to, holds, clicks/taps/fills), slows CSS animations with `Animation.setPlaybackRate`, sets `window.__wdTimeScale` for JS timing, retries flaky proxy image loads and encodes each shot to `<out>/<profile>-<shot>.mp4`. |
| `mix.py` | Music + voice mix: places voice lines, ducks music ~9 dB under speech, synthesises whoosh / impact / tick / pop / rise in code, masters to −14 LUFS with peaks under −1 dBFS. |
| `remotion/` | Promo project template. `src/layout.ts` holds the shared layout system (canvas, safe areas, subtitle lanes, TikTok UI mock, spacing scale, scene boundaries, motion); `src/Promo.tsx` renders the Feed (4:5) and TikTok (9:16) cuts; `check.mjs` renders stills at the start/middle/end of every scene and every transition midpoint for both cuts, logs DOM bounding boxes from the composition and fails on safe-area, centring, clip-fill, overlap, TikTok-UI and tilt violations. |

Notes that saved time:
- Launch Chromium with `proxy: { server: $HTTPS_PROXY, bypass: '<-loopback>,localhost,127.0.0.1' }` — without `<-loopback>` the local site request goes to the proxy (405).
- Remotion renders need `--browser-executable=/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell` and local `.woff2` fonts in `public/`.
- `node --experimental-strip-types check.mjs` runs the checker directly on the TypeScript layout module.
- A form field named `style` shadows `form.style` — never use it as a field name.
