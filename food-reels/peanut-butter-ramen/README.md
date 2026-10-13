# Peanut Butter Ramen — 60 s TikTok edit

Motion-design recipe reel: Higgsfield stills (Nano Banana Pro 2K, 16 generations / 32 credits), Heart voiceover
(Kokoro `af_heart`), Epidemic Sound music ("Special Sauce", Daniel Fridell) and SFX, edited in Remotion 4.0.535.

- `shotlist.md` — timed shot list
- `scripts/vo.json` — voiceover lines (run `_toolkit/vo.py gen`; `scripts/align.py` wraps `vo.py align` for newer PyAV)
- `scripts/prep_audio.py` — music bed (tape-stop + re-entry) and SFX trims, writes `mix.json` for `_toolkit/mix.py`
- `src/` — Remotion composition (`Main.tsx` scenes, `lib.tsx` camera/steam/cuts, `Captions.tsx` word-timed captions)

Assets are not committed: put the stills in `public/img/s1..s13.jpg`, fonts in `public/fonts/` (from `@fontsource/anton`,
`@fontsource/montserrat`) and the mix at `public/mix.wav`, then
`npx remotion render src/index.ts PeanutButterRamen out.mp4 --browser-executable=<headless_shell>`.
