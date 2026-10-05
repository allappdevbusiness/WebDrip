# Marlowick — rebuild edit (TikTok, 40 s)

Deliverable: `out/webdrip-marlowick-rebuild-tiktok-40s.mp4` (not in git: `*.mp4` is ignored repo-wide; force-add on request).
Composition: `MarlowickRebuild40` (1080 × 1920, 60 fps, 2,400 frames). `MarlowickRebuild40Guides` is the private safe-zone review copy.
This is a separate edit; the approved `videos/marlowick-that-way-tiktok-40s/` edit is unchanged.

## Song and alignment

- **Song:** "That Way" — Nbhd Nick (vocal version), Epidemic Sound `58bb6bb2-d6b6-41e1-a09f-ef99b215e39b`, licensed through the connected Epidemic account. Mixed into the master.
- **Section used:** 01:21.088 → 02:01.088, continuous (no edits).
- **Video 00:00.000 = song 01:21.088.**
- **Measured grid:** 137.00 BPM, first beat at 0.012 s. Kick on beat 1 and a half-time snare on beat 3, from the drum stem. The drop's first kick onset is song 01:24.088 (frame 180).

| Video | Song | Event | Picture |
| --- | --- | --- | --- |
| 00:00.000 | 01:21.088 | drumless breakdown, vocal "…proud of me" | "A CLIENT" over a macro of the real headline |
| 00:00.372 | 01:21.460 | breakdown beat | "PAID ME" |
| 00:00.810 → 00:01.248 | 01:21.898 → 01:22.336 | breakdown beats | "$300" counter rolls in and lands |
| 00:02.124 / 00:02.562 | 01:23.212 / 01:23.650 | breakdown beats | "FOR" / "THIS." |
| 00:03.000 | 01:24.088 | **DROP** (kick + bass) | hero pieces converge, flash, shake |
| 00:05.190 | 01:26.278 | kick | page explodes in Z, camera orbits |
| 00:06.504 | 01:27.592 | kick | "NOT A TEMPLATE." |
| 00:07.380 | 01:28.468 | snare | camera dollies through the layers |
| 00:09.569 | 01:30.657 | kick + snare | layers snap back together |
| 00:10.007 | 01:31.095 | kick (bar) | push through "See the suits" into the corridor of product cards |
| 00:11.759 | 01:32.847 | bar | macro cut: Navy Two-Piece $420 (then $560 / $480 / $640 / $45 on the kicks) |
| 00:13.511 | 01:34.599 | kick (bar) | six cards land in a grid, "FITTING INCLUDED." |
| 00:15.701 | 01:36.789 | low-energy beat | one beat of stillness |
| 00:16.139 → 00:16.796 | 01:37.227 → 01:37.884 | fill into chorus | cards fall away |
| 00:17.015 | 01:38.103 | **chorus downbeat** | phone slams in, "IN THEIR POCKET." |
| 00:19.214 | 01:40.302 | kick | real tap on "Book a fitting", "ONE TAP." |
| 00:20.528 | 01:41.616 | kick | lands on the real fitting form, "STRAIGHT TO THE FORM." |
| 00:22.280 / 00:22.499 | 01:43.368 / 01:43.587 | beat / half-beat | finger on the occasion field / "Black tie" selected |
| 00:23.594 | 01:44.682 | kick + snare | phone whips out |
| 00:24.022 | 01:45.110 | kick (bar) | Black tie hire plan slams in, the others fan in, "PRICES UP FRONT." |
| 00:26.221 | 01:47.309 | kick | desktop + phone, "SAME SITE. EVERY SCREEN." |
| 00:27.526 | 01:48.614 | kick (bar) | montage: cuts every half beat |
| 00:30.372 | 01:51.460 | kick | quarter-beat cuts |
| 00:31.029 | 01:52.117 | **drums drop out** | freeze frame, drains to monochrome (no text) |
| 00:32.781 | 01:53.869 | **bass returns** | real desktop homepage lands as a giant billboard |
| 00:33.657 | 01:54.745 | snare | light sweep across the headline |
| 00:34.533 | 01:55.621 | verse | CTA builds: WEBDRIP |
| 00:34.971 / 00:35.409 | 01:56.059 / 01:56.497 | beat / snare | "COMMENT" / "PROMPT" |
| 00:35.847 / 00:36.285 | 01:56.935 / 01:57.373 | beats | "We'll DM you the prompt." / Follow WebDrip · getwebdrip.com |
| 00:40.000 | 02:01.088 | end | CTA fixed to the last frame; the ink background loops into the ink hook |

To check alignment by ear, the drop at 00:03.000 and the drum cut-out at 00:31.029 are the two unmistakable points.

## Structure (Remotion 4.0.533, following the remotion-dev/remotion agent skills)

- `src/beats.ts` holds the beat map: `beat(n)` uses the song's absolute beat index (no rounding accumulates), plus the scene bounds and named events.
- `src/Video.tsx` holds the nine scenes as named `<TransitionSeries.Sequence>` nodes (hard cuts; the transitions are built inside the scenes so landings stay frame-exact), the music `<Audio>` and `<SoundDesign>`.
- `src/scenes/*` has one file per scene, each also registered as its own composition (Root → Scenes folder).
- `src/components/kit.tsx` holds the shared pieces:
  - `UILayer` (real UI element PNGs)
  - `Stage3D` / `Node3D` (CSS 3D camera rig)
  - `KineticText` (`Interactive.withSchema`, so text, colour and size are editable in Studio)
  - `Touch`
  - `Sfx` (places a cue so its measured onset or peak lands on a frame)
  - `WebDripMark`
- `src/components/HeroAssembly.tsx` rebuilds the hero from its real pieces. It is shared by the hook (the pieces converge on the drop) and the explode scene.
- `src/SoundDesign.tsx` has every sound effect as its own editable `<Audio>` node.
- Motion blur: `@remotion/motion-blur` `CameraMotionBlur` (6 samples) on the explode, dolly, button push-through and corridor moves.

## Source material (all real Marlowick output)

- `public/layers/*.png`: 30 individual site elements, captured with `scripts/layers.js`.
  - The live site's own CSS and fonts, desktop layout at DPR 3, everything else hidden, transparent background.
  - Elements: headline lines, kicker, lead, both hero buttons, price tags, logo, six suit cards, three hire plans, stats, visit title and the form.
- `public/cap/*.png`: desktop and mobile screenshots (from the first Marlowick edit).
- `public/rec/*.mp4`: real recorded mobile interactions. The menu, the tap on "Book a fitting" and the anchor travel, and `selectOption("Black tie")` on `#occasion`. The form is never submitted, and "Demo preview" is labelled while the form is shown.
- Photos: the site's Unsplash images, cached locally.

## Sound effects (Epidemic Sound)

| File | Title (Epidemic ID) | Used for |
| --- | --- | --- |
| impact-heavy-percussive | Designed, Impact, Sudden, Heavy, Percussive Hit (`13b7690c-9911-408b-ac38-ae607151a75b`) | drop, rebuild, phone slam |
| impact-fast-scifi-02 | Designed, Impact, Hit, Fast, Short, Scifi 02 (`27532213-ea63-475e-b186-c674ca4c7023`) | $300 lands, NOT A TEMPLATE, grid lands, plan slam, PROMPT |
| boom-low-hit | Designed, Boom, Low Hit (`6d82b75c-2d2f-40b3-9e1b-4d822c1173d5`) | drop, phone slam, hero |
| stinger-whoosh-to-impact | Designed, Stinger, Whoosh To Impact, Cinematic, Heavy 01 (`f36bb87b-ca7c-4faf-b83d-59b1dd51b03c`) | billboard lands |
| whoosh-deep-reversed | Swooshes, Whoosh, Short, Deep Reversed, Dry (`14f0f3a4-cc2b-4d8b-b453-49fd070c591d`) | suck into the drop, through the button, into the hero |
| riser-short-fast | Designed, Riser, Short, Fast, Build Up, Suspenseful (`f49e5a72-8c82-441c-86ae-a53a85c4dfc9`) | into the chorus |
| swish-air-fast-01 / -03 | Swooshes, Swish, Stick, Bendy, Whoosh, Air, Fast 01 / 03 (`b7c25d77-694e-4b55-b99b-539c940a9b33`, `f48a88f1-d92f-4875-b751-50eb4cb3d5b7`) | explode, card passes, page travel, split, CTA |
| swipe-through-air-01 | Swooshes, Swish, Stick, Fast Swipe Through Air 01 (`0777d9b6-0728-4c50-ba5f-a2eb8028a9ae`) | card passes, phone exit, into montage |
| flyby-bright-fast | Swooshes, Swish, Short, Bright, Fast, Flyby (`93505bfe-e95d-4b5f-96aa-508d405b7013`) | dolly through layers |
| camera-shutter-panasonic | Communications, Camera, Panasonic DMC G2 Digital Camera, Shutter (`97c68af6-5273-4cec-add4-423626d97c84`) | macro cut, montage |
| ui-click-hard-short | User Interface, Click, Hard, Short (`db6b8aed-e2b5-4597-af29-088f0a3bd988`) | counter ticks, macro ticks |
| pop-low-zap | User Interface, Alert, Pops, Low, Zap, Pops (`6ef71795-1680-4e82-b0b3-d4100d55ec22`) | word pops, tags, plans, CTA lines |
| touchscreen-tap-hard-02 | Touchscreen, Tap Hard 02 (`ac866ce9-6cd9-4a94-97da-1dbeadcf47d1`) | real taps |
| ui-click-onoff-small-03 | User Interface, Click, On & Off, Small, Short 03 (`40bcd59b-5284-4e55-a93d-4fc5eeace895`) | Black tie selected |
| glitch-short-circuit-04 | User Interface, Glitch, Short Circuit 04 (`25b32b41-079a-4e06-837a-3642f4678425`) | quarter-beat montage run |

Exact frames are in `src/SoundDesign.tsx`. Measured onset and peak offsets are in `src/sfx-anchors.json`.

## Mix

- Music at −6 dB in the composition. SFX levels per cue, plus a +5 dB bus trim (`SFX_TRIM`), set after comparing an SFX-only render with the music under each hit.
- `scripts/finish.sh` applies a two-pass `loudnorm` in linear mode (one static gain, no pumping) to −14 LUFS with a −1.5 dBTP ceiling, re-encodes to limited-range yuv420p and writes the fast-start file.

## Review passes

1. **First render (pass 1).** Fixed:
   - a near-blank flash at 13.3 s (grid cards started invisible)
   - corridor cards too small and over-blurred
   - payoff plans too small
   - three-line title colliding with the desktop card
   - a dead gap just before the drop
2. **Second pass ("where would I swipe?").** Fixed:
   - the static hero hold after the drop (now beat punches and an orbit)
   - the static 2 s card grid (now a 3D sweep plus the site's real hover-lift travelling across the cards on the hats)
   - sound effects measured 5–15 dB under the music (bus raised; drop and hero hits held back)
3. **Your change.** Removed "WORTH $300?" from the break. The break is now a silent freeze frame that drains to monochrome and gets sucked into the bass return.

## Licensing / posting

- The music and SFX were downloaded through the connected Epidemic account. Confirm the plan covers promotional use on the WebDrip TikTok account, safelist the channel if your plan requires it, and complete Epidemic's usage-confirmation step after posting.
- Nothing can guarantee zero copyright claims. Nothing was posted.
- Licensed WAVs are not in git (public repo). Rebuild steps:
  - Download the full mix to `audio-src/`.
  - `ffmpeg -ss 81.088 -t 40 -i audio-src/that-way-full.wav -c:a pcm_s24le public/audio/that-way-81.088-121.088.wav`
  - Download the SFX above into `public/audio/sfx/` with the listed file names.
  - Run `bash scripts/extract-rec.sh` to rebuild the recording frames.
- Render: `npm ci && npm run render`.
