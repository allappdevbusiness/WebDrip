# Marlowick — "Here's what $300 bought." (TikTok, 40 s)

Deliverable: `out/webdrip-marlowick-that-way-tiktok-40s.mp4`
Composition: `MarlowickThatWayTikTok40` (1080 × 1920, 60 fps, 2,400 frames). `MarlowickThatWayTikTok40Guides` is the same edit with the private safe-zone overlay. It is only for review and is not exported.

## Verified export (ffprobe / ffmpeg)

| Check | Result |
| --- | --- |
| Video | H.264 High, 1080 × 1920, yuv420p (limited/tv range, BT.709), 60/1 fps |
| Video frames / duration | 2,400 frames (counted), 40.000 s |
| Audio | AAC-LC, 48 kHz, stereo, 320 kb/s, 40.000 s |
| Container duration | 40.000 s, `moov` before `mdat` (fast-start) |
| Loudness | −14.0 LUFS integrated, LRA 4.2 LU, true peak −1.9 dBTP (ebur128), sample peak −1.96 dBFS |
| Black frames | none (`blackdetect d=0.02 pix_th=0.06`) |

Remotion writes full-range `yuvj420p`, so `scripts/finish.sh` re-encodes the video to limited-range `yuv420p` (CRF 16, slow) and copies the AAC track unchanged.

## Render

```bash
cd videos/marlowick-that-way-tiktok-40s
npm ci
bash scripts/extract-rec.sh                       # per-frame JPEGs from public/rec/*.mp4
# licensed audio (not in git, see "Audio rebuild" below) must be at public/audio/mix.wav
npm run render                                    # Remotion -> out/render-raw.mp4 -> scripts/finish.sh
```

The render uses Remotion 4.0.532, with `@remotion/cli`, `@remotion/renderer` and `@remotion/bundler` pinned to the same version, and the pre-installed headless Chromium (`/opt/pw-browsers/chromium_headless_shell-1194`). `node scripts/review.mjs [--guides] 0,180,...` writes review stills to `out/review/`.

## Project layout

- `src/timeline.json` is the single frame map. It holds the scene ranges, event frames and SFX cue frames, and both the scenes and `scripts/mix.py` read it.
- `src/Video.tsx` has one named `<Sequence>` per story section, plus the lapel transition, the lapel wipe and the audio layer.
- `src/scenes.tsx` holds the eight sections. `src/kit.tsx` holds the shared layers: `Screen` crops, titles, the touch indicator, the tape measure, lapel planes, guides and fonts.
- Every animation is computed from the frame (`interpolate`/`Easing`). There are no CSS animations, timers or randomness.
- Captures are real and local:
  - `public/cap/*.png` are stills, with element rects in CSS px in the matching `.json` files.
  - `public/rec/*.mp4` are recorded interactions, with tap/probe rects in the matching `.json` files.
- Source photos are in `public/img/` and fonts in `public/fonts/` (the site's own Inter variable and JetBrains Mono 500).

## Captures

- **Site source.** The built `automation-v2/websites/marlowick/index.html` and `assets/`, built from `app/src` at commit 677f8d5 and served locally with `python3 -m http.server 8080` from the repo root. The website itself was not modified.
- **Photos.** Unsplash URLs resolved from `app/src/photos.js` and cached in `public/img/`. Every capture serves these cached files through a Playwright route (`scripts/img-cache.json`), so the video and the captures use the same image bytes.
- **Desktop stills** (`scripts/stills.js`). 1440 × 900 CSS at DPR 2:
  - hero at top
  - hero after its own scroll push-in (`desk-hero-p100`)
  - suits rows
  - hire plans
  - visit form
- **Mobile stills.** 390 × 844 CSS at DPR 3, iPhone UA, touch:
  - hero
  - menu open
  - suits
  - hire
  - form
  - form with Black tie selected
- **Mobile interactions** (`scripts/rec.js` with `scripts/rec-plan.json`, frame-by-frame at 60 fps with page animations slowed to match):
  - `mob-menu`: a real tap on `#burger`; `aria-expanded` goes to true and the menu opens.
  - `mob-book`: a real tap on the hero's "Book a fitting" (`a[href="#visit"]`). The scroll to `#visit` follows the browser's anchor target (`#visit` minus the site's 76 px `scroll-padding-top`). The recorder drives it as an eased scroll because screenshot capture can't follow native smooth-scroll timing. In the edit, the travel segment plays at 2×.
  - `mob-occasion`: the page settles on the form, then `#occasion` is focused and set to "Black tie" with Playwright `selectOption`. That fires React's `onChange`, so the select really shows the new value. The browser's native option picker is not drawn, because headless screenshots don't render it and no fake list was added.
- **The form is never submitted.** No success message appears. A "Demo preview" label is on screen throughout the form demonstration (22.3–27.1 s) and on the Enquire beat.

## Music

- **Track.** "That Way" — Nbhd Nick, the vocal recording (full mix). Epidemic ID `58bb6bb2-d6b6-41e1-a09f-ef99b215e39b`. Downloaded as WAV (48 kHz / 24-bit) through the connected Epidemic account. The DRUMS, BASS and INSTRUMENTS stems were downloaded for analysis only.
- **Measured grid.** 137.00 BPM; first beat at 0.012 s. Fitted to drum-stem onsets: the kick lands on beats ≡ 0 mod 4, with a half-time snare on beat 3.
- **Hook accent.** The strongest early accent is the chorus downbeat at source 28.03 s, after a pre-drop gap from 27.88 to 28.01 s. It lands at video 3.000 s (frame 180), where the lapel planes open.
- **Lyrics.** Transcribed from the vocal-stem preview with faster-whisper and checked by section. The chosen excerpt avoids the breakdown (70–84 s) and its slang lines.
- **Excerpts compared.**
  - **Excerpt A (chosen):** "Put my bros on the payroll" → chorus ×4 → verse 2 to "I can make ten in a day" → song outro.
  - **Excerpt B (rejected):** hook 2 at 84.09 s. Its 3-second pre-roll would start inside "Take care of my mommy", and its 40 s exit point falls mid-line.
- **Edits.** Full details are in `music-map.json`.
  1. Video 2.528 s: a one-beat drop (source 27.120 → 27.558, beat 3 of the pre-hook bar). The cut sits inside a held vowel, just before two matching snare hits, with a 15 ms equal-power crossfade. This keeps "Put" whole and still lands the hook on 3.000 s.
  2. Video 34.470 s: after "…ten in a day", in a vocal gap, a jump to the song's own outro (source 168.113 s). 40 ms crossfade; the outro is eased up +5 dB over one bar.
  3. A 0.75 s fade at the very end. The outro has no vocal before 180.9 s, so no syllable is cut.
- **Tempo.** Natural tempo and pitch throughout. No time-stretching.
- **Rebuild.** `scripts/music.py` rebuilds the bed and `music-map.json`, with source in/out points, bar and beat markers, scene frames and SFX frames.

## Sound effects (Epidemic Sound)

Each cue is placed by the frame number in `src/timeline.json`. Alignment uses the file's first transient ("onset") or its loudest point ("peak"). Tails are trimmed where noted.

| Cue | Title (Epidemic ID) | Frame / time | Gain | Picture |
| --- | --- | --- | --- | --- |
| tick-1 | User Interface, Click, Hard, Short (`db6b8aed-e2b5-4597-af29-088f0a3bd988`) | 6 / 0.10 s | −9 dB | "Payout: $300" snaps in |
| tick-2 | same file | 18 / 0.30 s | −9 dB | "Opus + Astra cost: $24" snaps in |
| lapel-swish | Cloth, Flap, Whoosh 02 (`baad24a5-121e-4c06-9ebf-22b6ae8b40b6`) | peak at 180 / 3.00 s, trimmed 1.6 s after peak | −11 dB | lapel planes open; the music carries the impact |
| shutter-1 | Communications, Camera, Panasonic DMC G2 Digital Camera, Shutter (`97c68af6-5273-4cec-add4-423626d97c84`) | 443 / 7.38 s | −12 dB | photo match cut → The Navy Two-Piece card |
| shutter-2 | same file | 600 / 10.00 s (bar) | −12 dB | photo match cut → The Dinner Suit card |
| typing | Computers, Keyboard & Mouse, Keyboard, Small, Bluetooth, Typing, Short, Key Presses 01 (`0a6c168c-0bf2-4fe0-9bd2-ff7afd0b74af`) | 880 / 14.67 s, trimmed to 0.95 s | −16 dB | Opus types the Hero.jsx excerpt |
| cloth-guide | Cloth, Movement, Jacket, Polyester, Foley, Movement (`4f75839e-d3eb-4650-b8be-b7060dc280d0`) | peak at 1050 / 17.50 s | −15 dB | measuring guide swaps desktop → mobile |
| tap-burger | Touchscreen, Tap Hard 02 (`ac866ce9-6cd9-4a94-97da-1dbeadcf47d1`) | 1178 / 19.63 s | −14 dB | real tap on the menu button |
| tap-book | same file | 1389 / 23.15 s (beat) | −11 dB | real tap on "Book a fitting" |
| select-tick | User Interface, Click, On & Off, Small, Short 03 (`40bcd59b-5284-4e55-a93d-4fc5eeace895`) | 1573 / 26.22 s, trimmed 0.35 s | −13 dB | "Black tie" selected |

That is 10 cues. There are no chimes, extra bass hits, cash-register sounds or booms. Exact start times are in `scripts/mix-report.json`.

## Mix

`scripts/mix.py` sums the bed and the SFX bus, then:

1. Normalizes to −14.0 LUFS integrated (pyloudnorm, BS.1770).
2. Applies a 4× oversampled true-peak limiter at −1.5 dBTP, with 3 ms look-ahead and 60 ms release, so the AAC encode stays under −1 dBTP. The delivered file measures −1.9 dBTP.
3. Uses no ducking or pumping. Vocals are never under a cue longer than a click.

**Not done:** listening checks on headphones and a phone speaker. This environment has no audio playback, so those checks still need a human. The mix was verified with meters, onset analysis at the splice points and a transcription of the finished bed, which reads "Put my …" at 0 s and a clean chorus from 3.0 s.

## Story and frame map (60 fps)

| Section | Frames | Seconds | Notes |
| --- | --- | --- | --- |
| Money hook | 0–179 | 0–3.0 | Headline on frame 0; both figures complete by frame 24 (0.40 s); cropped real rail photo behind a dark scrim |
| Reveal | 180–442 | 3.0–7.4 | Lapel planes open on the hook downbeat; push-out from the real hero headline; overlay clears at 5.0 s; clean hero hold 5.0–7.4 s (2.4 s) |
| Design detail | 443–705 | 7.4–11.8 | Navy photo → exact rect in its real card (title + price legible); Dinner Suit match on bar 4; pull back to the row |
| Astra + Opus | 706–1020 | 11.8–17.0 | Tape measure → 12-column grid aligned to real headline and button edges; Astra notes point at real buttons; real Hero.jsx excerpt types; the real "Book a fitting" button lifts out; grid resolves into the full hero |
| Mobile payoff | 1021–1335 | 17.0–22.3 | Measuring guide wipes desktop → mobile; headline centre matched at canvas (540, 877) across the cut; real menu tap; 2 s menu hold |
| Interaction | 1336–1625 | 22.3–27.1 | Tap → anchor travel → #visit hold → Black tie selected; "Demo preview" label on screen |
| Value payoff | 1626–2019 | 27.1–33.7 | Browse (suits), Compare (hire plans pan), Enquire (form); 1.3 s beauty hold on the site's own rail photo |
| WebDrip close | 2020–2399 | 33.7–40.0 | Lead-in, then the complete CTA fixed from 35.0 s (frame 2100) to the last frame; background drifts back to the opening crop for the replay |

- **Shot count.** About 21 purposeful shots or reframings.
- **Website on screen.** Recognizable Marlowick UI or site imagery is on screen for about 30 s between 3.0 and 34.5 s. That excludes the full-bleed photo moments in the match cuts, the scrimmed hook background and the CTA background.
- **Clean holds of 1.5 s or longer:**
  - hero: 5.0–7.4 s
  - mobile menu: 20.0–22.0 s
  - Near miss: the #visit arrival hold (23.75–25.2 s) runs about 1.47 s.

**Review passes run here.**
- Story and timing: the hook accent at frame 180, the splices and the lyric continuity were checked with analysis.
- Phone readability and craft, checked with stills:
  - safe zone checked with the guides composition
  - every essential text and touch target inside x 90–870 / y 220–1480
  - touch rings on the recorded target rects
  - CTA readable from 35.0 s to the end
  - `freezedetect` holds removed with a gentle drift
- No previous-video baseline was measured. The comparison with `automation-v2/ChatGPT/last-video.mp4` (Larkmere) is qualitative only:
  - Larkmere's opening line was small over imagery; this one is 96 px with a scrim.
  - Larkmere gave "Comment PROMPT" secondary weight; here it is the dominant line.
  - Larkmere ends on a black tail; this export has none.

## Content and honesty notes

- **User claims.** "Payout: $300" and "Opus + Astra cost: $24" are user-supplied figures, shown as editorial text only. The video has no receipts, notifications, invoices, client messages, net-profit claim or total-cost relabel.
- **Fictional brand.** Marlowick is a fictional concept brand. Prices and the "Most booked" badge are its own demo-site content.
- **Brand marks.** Astra and Opus appear only as plain product wordmarks ("OpenAI", "Claude") with the brief's role labels. No logos were invented or redrawn. WebDrip uses its mark from the getwebdrip.com header (`_toolkit/remotion/src/frames.tsx`).
- **Code excerpt.** The JSX lines are genuine `Hero.jsx` source text, with the attributes wrapped onto two lines to fit. It is a stylized workflow visualization, not a recording of a chat or coding session.

## Audio rebuild (licensed files are not in git)

The repository is public, so no Epidemic WAV files are committed. To rebuild:

1. Download "That Way" full mix (WAV) through the Epidemic account to `audio-src/that-way-full.wav`.
2. `python3 scripts/music.py audio-src/that-way-full.wav` writes `public/audio/music-bed.wav` and `music-map.json`.
3. Download the 7 SFX above as WAV into `public/audio/sfx/`, using the file names referenced in `src/timeline.json`.
4. `python3 scripts/mix.py` writes `public/audio/mix.wav` and `scripts/mix-report.json`.

The Python dependencies are `numpy`, `scipy`, `soundfile` and `pyloudnorm`. `librosa` was used for the analysis.

## Licensing handoff (nothing was posted)

- The account downloaded the track and SFX through the connected Epidemic Sound integration. Confirm that the account's plan covers commercial promotional use on the WebDrip TikTok account.
- Before posting, safelist the WebDrip TikTok channel in the Epidemic account's connected-channels settings, if that is required for the plan.
- After posting, complete Epidemic's Music Usage Confirmation (or the equivalent claim-clearing step) for the post when the account requires it.
- Safelisting reduces claims but cannot guarantee zero copyright flags or claims on TikTok. If a claim arrives, clear it from the Epidemic account.

## Known limitations

- The audio was not checked by ear on headphones or a phone speaker. Check that before posting.
- The TikTok overlay check used an approximate UI mock (top bar, right button column, caption area), not a live TikTok preview.
- Native-picker limitation: the occasion change shows the real select value updating, but not the iOS/Android option list (see Captures).
- The Astra + Opus code excerpt is set at 27 px. It is readable at phone size but is the smallest essential text in the edit.
- The rec frame JPEGs are rebuilt from the committed MP4 clips (CRF 16), so a re-render can differ from this export by invisible compression noise.
