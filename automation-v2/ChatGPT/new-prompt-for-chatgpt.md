# New prompt for ChatGPT — Marlowick promo video (2026-10-05)

## What you need to do

Write one complete video-editing prompt for Claude and save it as **`automation-v2/Claude-Video-Editor/editing.md`** in the repository `allappdevbusiness/WebDrip` (branch `main`). That is the only file you write. Don't change any other file.

**Your goal is to come up with an amazing video-editing prompt, so that when Claude makes the video from it, the video comes out great: it engages more of the audience and gets more views on Sourav's TikTok.**

Claude will follow editing.md on its own, with no chance to ask you questions. So editing.md must be complete: every scene, every timing, every piece of on-screen text, the music choice and every real element to click or tap, written so Claude never has to guess.

---

## 1. The project

- **Brand:** Marlowick
- **Business type:** a men's formalwear shop. It sells suits, dinner suits (tuxedos), dress shirts and ties, rents out suits for weddings and events, and fits every piece on the customer in the shop.
- **Tagline:** "Sharp suits, fitted properly."
- **What it is:** a fictional concept website designed and built by WebDrip (https://getwebdrip.com). Marlowick is not a real business and not a WebDrip client. Call it a demo or sample website. Never present it as a real client.
- **Folder:** `automation-v2/websites/marlowick/`
- **GitHub:** https://github.com/allappdevbusiness/WebDrip/tree/main/automation-v2/websites/marlowick
- **Source code (React + Vite + Tailwind):** `automation-v2/websites/marlowick/app/src/` (`data.js` has all copy and prices, `components/` has one file per section, `index.css` has the styles and animations). The built site is `automation-v2/websites/marlowick/index.html` plus `assets/`.
- **How to run it locally:** from the repository root, run `npx http-server -p 8080 -s` and open `http://localhost:8080/automation-v2/websites/marlowick/`. The site is not hosted anywhere. Never use or invent a live link.

### Sections in page order (real headings, read from the code)

1. **Sticky nav** `#nav`: logo (a cobalt "M" square + the word "Marlowick"); links "Suits" → `#suits`, "Hire" → `#hire`, "Fittings" → `#fittings`, "Visit" → `#visit`; a cobalt button "Book a fitting" → `#visit` (desktop). On mobile: hamburger button `#burger` (three lines that animate into an X, `aria-expanded`), opening the slide-down menu `#mobileMenu` with the same four links and a "Book a fitting" button. A thin cobalt-to-camel scroll-progress bar runs along the bottom edge of the nav. The nav shrinks slightly and gets a frosted ivory background after scrolling 40px.
2. **Hero** `#top` (about 2.3 screens tall):
   - kicker "MENSWEAR · SUITS · FORMAL HIRE"
   - headline `#heroTitle`: "Sharp suits," (ink) / "fitted properly." (cobalt)
   - text: "Suits, dinner suits, shirts and ties to buy or hire. Every piece is fitted on you in the shop before it goes home."
   - buttons: "Book a fitting" (cobalt, → `#visit`) and "See the suits" (outline, → `#suits`)
   - floating tags: "Navy two-piece · from $420", "Dinner suit hire · $120 a weekend", "Fitting included · with every suit" (the third is hidden on mobile)
   - **Signature effect:** the hero photo `#heroImg` (a rail of suit jackets in cobalt, camel, sky blue, grey and cream) starts as a tilted, rounded frame below the headline. As you scroll, a 3D camera pushes in: the frame straightens (rotateX 16° → 0), grows until it fills the whole screen, the headline and tags drift up at different speeds and fade, and a caption fades in at the bottom-left: "ON THE RAIL THIS WEEK / Cobalt, camel, sky and cream, all in your size." Scrolling back up reverses it.
3. **Suits** `#suits`: kicker "01 — The rail", heading "A suit for every day you need one.", text "Six things most men come in for. Each suit price includes a fitting and simple alterations." Six cards (photo, title, price):
   - The Navy Two-Piece, from $420
   - The Grey Three-Piece, from $560
   - The Check Suit, from $480
   - The Dinner Suit, from $640
   - Dress Shirts, $75 each
   - Ties & Pocket Squares, from $45

   On hover a card lifts, its photo zooms slightly and a light sheen sweeps across it.
4. **Spotlight** `#spotlight` (sky-blue background): kicker "The fitting", heading "Every suit is fitted before it leaves the shop.", text about a fitter pinning the sleeves, waist and trouser length, with simple changes ready in 3 to 5 days. The photo (a fitter's hands adjusting a grey lapel) slowly zooms in a loop, with a rotating dashed cobalt ring. A real "Pause" / "Play" toggle button sits on the photo. A button "How a fitting works" → `#fittings`.
5. **Hire** `#hire` (white background): kicker "02 — Wedding & event hire", heading "Hire the suit. Skip the scramble.", text "Pick it up on Thursday, wear it all weekend, bring it back on Monday. Shirt and tie are part of the price." Photo of a groom in a blue suit. Three price cards whose prices count up from 0 when they scroll into view:
   - Single hire, $95 per weekend
   - Black tie, $120 per weekend (the featured card, with a camel "MOST BOOKED" badge and a cobalt outline)
   - Groom's party, $85 per person ("The groom's suit is free with six or more")

   Each card has a "Book this hire" button → `#visit`.
6. **Fittings** `#fittings` (warm sand background): kicker "03 — How a fitting works", heading "About 45 minutes, start to finish." A vertical cobalt-to-camel timeline with five steps:
   - 0 min, Tell us the occasion
   - 5 min, Try on two or three sizes
   - 20 min, Pin and chalk
   - 35 min, Pick the shirt and tie
   - 3–5 days, Collect it ready to wear

   The dots pop in as each step appears. Three stat cards count up: "45 min" (for a full fitting), "3–5 days" (for simple alterations), "14–18" (collar sizes in stock).
7. **Visit** `#visit`: kicker "04 — Visit", heading "Book a fitting.", text "Tell us when you'd like to come in and what it's for. We'll reply by email to confirm the time." Four round portrait photos float around the form on wide screens (in a row above it on mobile). The form `#bookForm` has:
   - "Your name" `#name`
   - "Email" `#email`
   - "What's it for?" `#occasion` (a native select: A wedding / Black tie / Work or interview / Something else)
   - "Preferred day (optional)" `#date`
   - buttons "Book my fitting" (submit) and "See hire prices" (→ `#hire`)

   Validation is real and client-side. Submitting empty shakes the form and shows "Please enter your name." in `#nameErr` and "Please enter your email." in `#emailErr`. A bad email shows "That email looks incomplete. Check it and try again." A valid submit shows the green box `#formOk` with an animated check mark: "Thanks, <first name>. This is a demo site, so nothing was sent, but on the real site we'd email you to confirm." Opening hours are listed below the form.
8. **Footer:** logo, tagline, links, Unsplash photo credits, and "Concept design by WebDrip — fictional brand" linking to getwebdrip.com.

### Design

- **Style:** the "premium" design skill from `bergside/awesome-design-skills`: precise, Apple-like modern minimalism, recoloured for menswear. Generous whitespace, 8px radii, soft card shadows, thin warm borders.
- **Palette (hex):**
  - ivory #FAF7F0 (main background), white #FFFFFF, sky #E9F0FF, sand #F4E9DA
  - cobalt #2747D6 (primary), cobalt-deep #1B32A3
  - camel #C08A4E (accent), camel-deep #85561F
  - ink #121826 (text), soft #4B5468 (secondary text)
- **Fonts:** Inter (variable, 600–750 for headlines, tight negative letter-spacing) and JetBrains Mono 500 (small uppercase labels and prices).
- **Standout animations:** the hero's 3D camera push-in from a tilted frame to full-bleed; the intro (nav drops in, the logo "M" spins in, the headline lines unmask upward one after the other, the tags rise in); headings unmask from the bottom as you scroll; cards rise, slide or flip in with a stagger; price and stat count-ups; parallax on photos and soft background glows; the hamburger turning into an X; the form shake and the drawn check mark.

### What does NOT exist (never fake these)

- No shop, cart, checkout, payment or "add to cart". Cards are not clickable products.
- No form backend. Nothing is sent, and the success message says so.
- No reviews, testimonials, ratings, customer counts, phone number, street address, map, team or staff pages.
- No live website link. The site only runs locally.

Any interaction in the video must be one the site really has: nav links, the hamburger menu, hero buttons, the spotlight Pause/Play toggle, "Book this hire", the form fields, the occasion select and the "Book my fitting" submit, including the real error and success states.

---

## 2. The previous work (read it, then beat it)

- Previous prompt: `automation-v2/ChatGPT/last-prompt.md` (Larkmere Flower Studio, a 35-second romantic Remotion film)
- Previous video: `automation-v2/ChatGPT/last-video.mp4` (1080×1920, 60 fps, 35 s, with music)

Claude's notes after watching the previous video:

- **What worked:** a clean, light editorial look true to the site's palette; real site UI rather than stock footage; a real interaction (opening the order form and choosing "A wedding" in the select); a calm, readable end card with WebDrip, a follow request and getwebdrip.com.
- **What was weak:**
  - **The hook.** The first three seconds are a soft slogan ("A website worth falling for.") over a bouquet, with no problem the viewer recognises and nothing to make a thumb stop.
  - **Pacing.** Several shots barely change for 2–3 seconds (the "Made to mean something" card, the "Big days, small details" section, the Codex sketch), and the end card holds unchanged for about 7 seconds. That's dead time on TikTok.
  - **Readability.** Mobile UI captures are shrunk to about a third of the frame width, so body text and form labels can't be read on a phone.
  - **Clarity.** The Codex/Claude "creative direction" scene is abstract: grey wireframe bars with no clear payoff for a business owner watching.
  - **Motion.** One transition shows a smeared, motion-blurred frame of the mobile page that reads as a glitch.
  - **Clicks.** The cursor and tap are small and lack a clear landing cue, so the cause and effect is easy to miss.
  - **Music.** A gentle folk vocal suited the florist, but it gave the edit little energy to cut on.

**Make editing.md at least 20% better than the previous prompt.** Before you write it:

1. Score the previous prompt from 1 to 10 on each of: clarity, the hook, how engaging it is, motion and animation ideas, music fit, and how its video turned out.
2. Write your new prompt, then score it the same way.
3. The new total must be at least 20% higher than the old total.
4. Fix every weak point above and keep what worked.
5. Put both score tables, with one line of reasoning per score, in a short "Scorecard" section at the end of editing.md.

---

## 3. Music (Epidemic Sound)

Choose good, engaging music from Epidemic Sound that fits a confident, modern menswear brand and a fast, polished TikTok edit. Think sharp, stylish and upbeat, not romantic folk. Give:

- the **title**, **artist** and **Epidemic Sound track ID** (the UUID from the track's URL, `https://www.epidemicsound.com/music/tracks/<id>/`)
- the **BPM** and mood
- **which part of the song to use**: start and end time in the original track, and where the strongest moment (drop, chorus or hit) should land in the video
- one or two backup tracks with their IDs, in case the first can't be used

Map the key cuts and reveals to the beat. Also list a small number of sound effects (whooshes, a soft click or tap, a fabric swish, a subtle tick for count-ups) as search terms, kept quiet under the music.

Claude gets music through the Epidemic Sound connector. Notes from earlier runs:
- `DownloadRecording` gives the full mix and DRUMS, BASS and INSTRUMENTS stems.
- `EditRecording` can cut a track to length, and works best with one required region and no forced duration.
- Sound effects come from `SearchSoundEffects` and `DownloadSoundEffect`.

Use a real track ID that you have checked exists in the Epidemic Sound catalogue. Claude will search by title and artist if the ID doesn't resolve.

---

## 4. Video requirements

- **Two cuts:**
  - TikTok: **1080×1920** (9:16) → `video-tiktok.mp4`
  - Facebook: **1080×1350** (4:5) → `video.mp4`

  Describe how each scene is framed in both. The 4:5 cut is not just a crop of the 9:16 one: re-frame so nothing important is cut off.
- **Length:** your call, aiming at what keeps TikTok viewers to the end (roughly 20–35 seconds). Explain the choice.
- **Safe area (9:16):** all important content (text, the UI being demonstrated, the logo, the call to action) stays inside **x 120–960, y 150–1520**. TikTok's buttons sit on the right and the caption sits at the bottom.
- **Lots of motion design and animation:** camera moves on real recorded site footage (push-ins, pans, tracking), layered UI cards, kinetic type, masked reveals, transitions on the beat. No static slides held longer than about 1.5 seconds, except one short readable end card.
- **Real clicks and taps** that land exactly on real elements: for example "Book a fitting" in the hero, a "Book this hire" button, the `#burger` menu, the spotlight Pause/Play toggle, typing into `#name` and `#email`, choosing in `#occasion`, and pressing "Book my fitting" to show the real error shake and then the real success state.
  - Claude records the site with Playwright and gets each clicked element's exact position, so name the exact element or ID for every click.
  - The camera must track and zoom toward each click so it's readable on a phone.
  - Show a clear cursor or tap ring that lands on the target and a visible cause and effect.
- **Readable on a phone:** UI text shown large enough to read (zoom into the real site rather than shrinking it). Headline text around 70–110 px, secondary text at least 40 px on the 1080-wide canvas.
- **Light or colorful backgrounds only, never dark:** use the site's ivory, white, sky, sand and cobalt. Photo overlays may darken a photo slightly for legibility, but no black or dark scenes.
- **On-screen text follows the writing rules in section 5.**
- **Honesty:**
  - no fake numbers, results, reviews, testimonials, follower counts or "clients"
  - no real brand names or logos except WebDrip (no Claude, ChatGPT, Codex, Apple or other logos in this video)
  - prices and times shown must be the site's own
- **The hook (first 1–2 seconds)** must come from a real, specific problem a men's formalwear shop owner or a man who needs a suit recognises. For example, a shop's site that shows no prices, so customers walk past to a shop that does. Or a man with a wedding in two weeks who can't tell whether a shop does hire or fittings. Say it plainly, then show Marlowick's site solving it.
- **Ending:** end on WebDrip and **getwebdrip.com**, with a follow call to action (for example "Follow WebDrip for more website ideas"). The end card is readable for about 2–3 seconds; keep subtle motion so it never looks frozen. Include a small readable label "Demo website by WebDrip".
- **Voiceover is optional.** If you want one, write the exact lines; Claude can generate a natural English voice locally with Kokoro. If it's used, subtitles must match the words exactly and stay inside the safe area.

---

## 5. Writing style for every line shown on screen (and any voiceover)

Talk like a real person telling a friend who owns a business something useful: warm, confident, direct and clear.

- Use plain everyday words in complete, natural sentences, the way you'd say it out loud, not the way an ad is written.
- Clarity beats cleverness. If someone scrolling past wouldn't understand a line instantly, with no context, rewrite it.
- No slang at all. Never "ngl", "not gonna lie", "for real", "fr", "lowkey", "highkey", "real talk", "no cap", "bro", "vibe", "here's the thing", "yeah, no", "let's go". No hype chants or repeated catchphrases.
- No jokes, puns, riddles, punchlines, cute phrases or cryptic fragments (nothing like "Two shops. Ten seconds. One thumb.").
- No corporate politeness ("we're delighted", "elevate your brand", "seamless experience", "don't hesitate to").
- Every line moves the story forward; if it doesn't, cut it.
- Platform-safe: no swearing, nothing insulting about real people or groups, no fake numbers.

---

## 6. Claude's tools

Claude's tools are the same as listed in `automation-v2/ChatGPT/last-prompt.md`:

- **Remotion:** React video, rendered with a local headless Chromium. Fonts load from local `.woff2` files, not Google Fonts.
- **Epidemic Sound connector:** music, stems, track editing and sound effects.
- **Playwright and Chromium** to record the real site frame by frame (`_toolkit/rec.js`). It can scroll, click, tap, type and hover, slows the CSS animations so they play at real speed in the footage, and logs every clicked element's exact rectangle.
- **ffmpeg** and **Python** for audio mixing and loudness (`_toolkit/mix.py`).
- **Kokoro** for an optional local voice, with Whisper for subtitle timing (`_toolkit/vo.py`).

Reusable Remotion building blocks are in `_toolkit/remotion/`: safe-area layout maths, browser and phone frames, subtitles and a layout checker. Claude cannot use stock video, AI image generators or anything that needs a login.

---

## 7. What to write in editing.md

Write `automation-v2/Claude-Video-Editor/editing.md` as one complete prompt Claude can follow without asking questions. It must say clearly, near the top, that it is for the **Marlowick** site in `automation-v2/websites/marlowick/`, and include:

1. The goal and the creative idea in two or three sentences.
2. The music choice (section 3), with the exact part of the song and the beat map.
3. A scene-by-scene timeline with exact start and end times (seconds and frames at 30 or 60 fps). For each scene, give:
   - what's on screen in both cuts, and the camera move
   - the exact on-screen text
   - the exact real element to scroll to, click or tap (selector or ID)
   - the animation and transition
   - the sound cue
4. The recording plan: which viewport (desktop 1280×720 or iPhone 13), which scroll positions and which interactions to record.
5. The end card.
6. A short checklist Claude runs before delivering:
   - safe areas
   - readable text
   - every click on a real element
   - no dark scenes
   - no fake claims
   - audio present and mastered to about −14 LUFS with peaks under −1 dBTP
   - both files render from start to end
7. The Scorecard (section 2).

Don't write anything else to the repository. Thank you!
