# Larkmere Flower Studio: 30-second vertical promo

The Remotion project behind the WebDrip promo for the Larkmere concept site (`automation-v1/2026-10-02-larkmere/`).
It renders at 1080 × 1920, 30 fps, exactly 900 frames (30.000 s), with H.264 video, AAC 48 kHz audio and −14 LUFS loudness.

The aim is to leave viewers with two thoughts: *"that was beautiful"* and *"I want WebDrip to build something like this for my business."*

## The edit, frame by frame

Every boundary comes from the measured song (see `music-map.json`). The source is the vocal version of *Rose In The Garden* by Cody Francis, at 95 BPM, so one beat is 18.95 frames.

| Frames | Time | Music | Picture | Idea it sells |
|---|---|---|---|---|
| 0–76 | 0.00–2.53 | Hook audio only | **Hook slot**: *The Great Gatsby* (2013), the flower-filled tea room | Stop the scroll; flowers as extravagance |
| 76–152 | 2.53–5.07 | Bar 28, the vocal-free breath bar (anticipation) | **A FLOWER / SHOP / SHOULD / FEEL / LIKE / THIS.** A justified Abril Fatface stack, one word pair per beat. The site's florist photo fills "THIS.", and the camera dives through the **I** on the vocal pickup | The promise |
| 152–228 | 5.07–7.59 | **Drums enter for the first time** (song 77.612 s) + "so slow" | Inside the photo, the site's glass card blooms the real Larkmere mark. On beat 3 the wordmark flies into the real mobile header while the real hero plays its own "Every stem tells a story." reveal | Brand reveal, then real website proof |
| 228–379 | 7.59–12.65 | Bars 30–31, "hold you in my arms, won't let go" | Field → studio route over the site's own field photo. The headline counts 0 → 14 miles, and the logo flowers bloom where the line passes. The photo then folds into the real "Fourteen miles from field to vase" card (14 / 62 / 0) | Grown close to home |
| 379–455 | 12.65–15.17 | Bar 32, "the world around could pass us by" | **No foam. / No plastic. / No flowers flown halfway round the world.** Hard cuts on the beat over macro petals | The site's own sustainability line |
| 455–607 | 15.17–20.23 | Bars 33–34, "a thunderstorm, a lightning strike… as we hold each other **tight**" | **Build a bouquet** from photographed stems, cut out: one stem, another, foliage, paper (with crinkle lighting), then a cotton cord that **pulls tight on "tight"** | Handmade, stem by stem |
| 607–683 | 20.23–22.75 | Bar 35, the release; the vocal rests | Hard cut to the real Market Posy photo, which settles into the real **$38** card. The Love Letter ($54) and Wild Armful ($72) cards fan out behind it. Caption: "Bouquets from $38" | Real product, real price |
| 683–739 | 22.75–24.64 | Bar 36, instrumental breath | Wedding palette concept: **Blush / Ivory / Lilac / Green** chips re-tone the real bridal photo on half-beats. The photo then settles into the site's real "Bridal bouquets" card | A site can help a couple picture it first |
| 739–758 | 24.64–25.27 | **One-beat drum stop** under "You're the…" | A single red rose, still | Held breath |
| 758–834 | 25.27–27.80 | **"ROSE"**: drums return | The real desktop hero, full-bleed: the florist's roses plus the site's glass "The story so far" card, in its own 3D-tilt scroll. The phone then rises with the real Saturday workshop card and the same-day delivery line | Full website, desktop and mobile |
| 834–900 | 27.80–30.00 | "garden" resolves on the tonic, then the song's **final chord** rings out (instrumental 196.371 s) | **YOUR BUSINESS / SHOULD FEEL / LIKE THIS.** Then WebDrip and getwebdrip.com, plus the concept-site disclosure | The ask |

The intended rhythm alternates fast and still: a fast hook, a typographic sprint, a beautiful hold, flowing movement, fast claims, an accelerating build, a still card, quick taps, silence, a full-site hit, then a clean ending.

## Music: what was measured

These are measured from the licensed WAVs (full mix plus DRUMS/BASS/INSTRUMENTS stems) and the vocal-stem preview, using `tools/analysis/` (librosa, faster-whisper).

- **Form:**
  - 4.4–24.4 s: voice and acoustic guitar only.
  - 24.45 s: bass enters.
  - 75.1–77.6 s: a vocal-free bar with an instrument pull-back at 76.9 s.
  - 77.612 s: drums enter for the first time, the biggest lift in the song.
  - 97.20 s: one beat of no drums under "You're the".
  - 97.83 s: drums return on "rose".
  - 100.36 s: "garden" lands on the B tonic.
  - 196.371 s: the song's final downbeat, which rings out to 201.1 s.
- **Vocal and instrumental versions are sample-aligned** (a 1-sample lag). The edit uses the vocal mix from 75.089 s to 100.33 s, then splices into the instrumental version's final downbeat. The splice is 30 ms before the hit, so the transient stays intact.
- **Measured landings in the final mix:**
  - Drums at 5.045 s (frame 152 = 5.067 s).
  - "ROSE" at 25.267 s (frame 758).
  - Final chord at 27.78 s (frame 834 = 27.80 s).
- **Loudness:** −14.0 LUFS integrated, true peak −3.4 dBTP before AAC.
- **SFX** (Epidemic Sound), only on real on-screen actions and kept under the music:
  - Paper fold as the wrap rises: `e79678b6-6638-4f5a-81e1-d8dfe36a3409`.
  - Paper scrunch as the cord cinches: `4ba0afda-37e0-4543-a00d-72ba5e98f008`.
  - Glassy touch on the four palette taps: `45c94b43-2fb0-4970-98db-cc0fe6ea3678`.

## Honesty rules this edit follows

- Every number and claim on screen is the site's own content: 14 miles, 62 varieties, 0 floral foam, $38 / $54 / $72, "From $160", Saturday workshops, same-day delivery in town, 14 Mill Row.
- There are no invented sales, orders or conversion figures.
- The wedding palette is a concept graphic, never framed as a site feature. The route and the counter visualise the site's real "fourteen miles".
- The end card says Larkmere is a fictional concept site designed by WebDrip.

## Hook status

The official clip could not be fetched from this cloud environment. The network policy denied `www.youtube.com`, `*.googlevideo.com`, `www.warnerbros.com`, `vimeo.com`, `archive.org` and `trailers.apple.com`, so frames 0–76 currently render a **labelled slate**, not a substitute shot.

To finish it, take a ≈2.5 s flower-room moment from an authorised Warner Bros. source. In the 2013 film this is the tea scene at Nick's cottage. Reviews quote the line as *"You think it's too much?"*; *"Perhaps more flowers?"* could not be verified. Then run:

```bash
tools/render.sh <music_dir> <sfx_dir> out/larkmere-promo.mp4 path/to/gatsby-clip.mp4 <start_seconds> [focus_x_percent]
```

The clip's own audio plays under the hook and hard-cuts into the music's first downbeat at frame 76. Nothing else in the timeline moves.

Using film footage in a commercial promo needs the rights holder's licence, so check that before posting.

## Rebuild

```bash
npm install
tools/prepare.sh          # photos, stem cutouts, site recordings, card snaps, fonts -> public/
# music: Epidemic connector -> DownloadRecording WAV, FULL, for f84c2751-2855-35a5-b50c-2556df7033cb (vocal) and
#        4cc61795-56ec-3b8d-be40-ca21e46b6742 (instrumental), saved as full.wav / instrumental.wav
tools/render.sh <music_dir> <sfx_dir> out/larkmere-promo.mp4
node tools/stills.mjs out/stills 152,607,758   # review stills
```

## Credits

- **Music:** "Rose In The Garden", Cody Francis (Epidemic Sound).
- **Photography:** Unsplash. The site's own photos plus the macro and stem photos listed in `photo-credits.json`.
- **Typefaces:** Abril Fatface, Inter and JetBrains Mono (SIL OFL), the same faces the site uses.
