# Carrito Rojo — "Seven Nation Army" TikTok edit (Remotion)

50.000 s · 1080×1920 · 60 fps. Visuals and licensed Epidemic Sound SFX only; the song is added in TikTok.

- `PLAN.md` — choreography (every scene tied to a measured musical event)
- `src/beatmap.json` — beat map measured from the reference MP3 (`analysis/a*.py`, `analysis/mkmap.py`)
- `src/timing.ts` — beat-map helpers (`riff(cycle, note)`, `CYCLE`, `DRUMS_IN`, `RELEASE`, …)
- `src/scenes/*` — one file per section; `src/components/*` — reusable pieces; `src/sfx.tsx` — SFX cues (peak-aligned)

## Rebuild

Media that is not committed:
- `public/video/hero-3d.mp4`, `public/video/taco-3d.mp4` — copy from `allappdevbusiness/resturentbusiness`
- `public/sfx/*.wav` — Epidemic Sound SFX (IDs in `SFX.md`), converted to 48 kHz
- reference MP3 — local only, never committed or uploaded

```
npm install
node analysis/stills.mjs /tmp/stills 0 2.1 8.07      # contact sheet of stills
npx remotion render src/index.ts CarritoRojoSNA out/video.mp4 --browser-executable=<headless_shell>
```

Song alignment: VIDEO 00:00.000 = SONG 00:01.056 of the reference file (first clean riff onset).
