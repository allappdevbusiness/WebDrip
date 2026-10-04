# Redesign Day — LEGO: choose your next build

Date: 2026-10-04 (America/New_York) · Status: **brief_ready** · Industry: toys / creative building · Slug: **lego-redesign**

**One-line idea:** Turn the LEGO homepage into a playful, interest-led shop window where Gaming, Display and Seasonal choices snap a small selection of real sets into place.

**Deliverable for Claude:** build one homepage and produce a **36.000-second, 30fps, 1,080-frame** video in **1080×1350 Facebook** and **1080×1920 TikTok**. This file is the production brief; no site or video has been built in this planning run. The only site source assets are in `lego-redesign/assets/`; use `assets.json` and `content.md` together.

## 1. Creative decision and evidence

The story is **recognition → playful choice → useful result → mobile proof → business invitation**. It addresses adult hobbyists and business owners, with friendly, plain language. It is neither a critique of LEGO's team nor a claim that its current site fails. The source already offers interest navigation; our proposal makes a small in-page interest choice more prominent.

- [TikTok Next 2026](https://ads.tiktok.com/business/en-US/next) emphasizes showing process and making the reason to buy visible. Apply that through an actual filter change and a clear name/price relationship, rather than a photo-only montage. This is our creative interpretation of platform guidance, not proof of this video's future performance.
- [Meta's March 2026 originality guidance](https://about.fb.com/news/2026/03/rewarding-original-creators-on-facebook/) favors original work and meaningful transformation. The core footage must be our newly built interface, with our own explanation and motion; don't re-edit LEGO's advertising videos or other creators' redesigns. This does not guarantee recommendation or monetization.
- [Metricool's 2026 TikTok study](https://metricool.com/press-release-tiktok-study-2026/) reports an association between questions and more comments in its broad sample. Ask one genuine choice question in the caption. Its January–February cross-account observations are not October niche benchmarks or causal proof.
- [TikTok creative best practices](https://ads.tiktok.com/business/en/blog/creative-best-practices-top-performing-ads?redirected=1) support an early hook, clear structure, sound and legible text. Use a recognizable set in frame 1, a short spoken question, meaningful click sounds, and readable action labels. The advice concerns ads; our organic implementation is a test.
- [LEGO Adults Welcome](https://www.lego.com/en-us/categories/adults-welcome) presents building as creativity, personal interests and display. That informs the calm, tactile tone and “your hobby” language. It is brand positioning, not a sampled set of audience comments.

**Research limits:** public searches did not establish a reliable, recent leaderboard of TikTok/Facebook website-redesign views, shares or saves. One niche performance article failed to open; it is not used as evidence. Searches also surfaced an existing LEGO redesign with a custom 3D engine: do not borrow its look, sequence, implementation or “anti-AI” positioning. We choose a simple interest-to-product story independently. No verified evidence here proves voiceover beats music-only for this niche, that 36 seconds is universally optimal, or that this soundtrack style is currently viral. These are testable editorial choices. Brand screening surfaced a dispute involving a separate resale retailer, not evidence of a current LEGO Group corporate scandal; no major current LEGO Group scandal/tragedy was identified in this bounded check.

**Why 36 seconds, voice, and this music:** the last two briefs used 45 seconds; the latest was type-led with male-vocal soul. A shorter demonstration with sparse, calm female narration makes the design reasoning accessible to owners while leaving room for satisfying sounds. Choose instrumental broken-beat electronic music with a bright mallet motif, 120 BPM, so speech never competes with lyrics. Do not claim this is a trending track. The actual licensed catalog selection belongs to Claude.

## 2. What we learned from previous work

Read both available briefs in full: `chainwrencycles-demo.md` (latest) and `bobblefinswim-demo.md`, including their Self-review sections; read `lessons.md` and existing research notes. Only two prior briefs exist, not ten. The last ten entries in `topics-log.json` provide additional industry/music/style context. `campaign-log.json` was missing and has been initialized; this is its first entry.

Apply the latest self-review in concrete ways:

1. **Avoid slow holds:** every shot longer than 2.5 seconds has a specified click, content swap, scroll or camera change. Keep copy still while viewers read; motion belongs primarily to the site.
2. **Readable mobile proof:** use actual 390×844 footage at a large scale; never place two miniature phones side by side. Any desktop crop follows one feature, not a full unreadable screen.
3. **One real depth move:** 26–28.5s includes a slow 5° to −5° to 0° phone orbit. It does not carry essential fine print and finishes flat.
4. **Respectful source treatment:** replace the previous fictional bad-site/booking-loss story with positive exploration of an unofficial alternative. Do not portray a broken LEGO page, abandoned purchase or invented sales outcome.
5. **Natural VO:** no forced speech speedups; regenerate a short line if it overruns. `af_nicole`, speed 1.0, is different from the recent af_heart and male-vocal formats.

Current user production capabilities override older lesson limitations: request real Epidemic SFX if available. A previous account denial is not a permanent capability assumption. If an authorized download fails now, record the failure; use the music's own percussion or omit that SFX, without bypassing the denial.

## 3. Single-page design specification

### Foundation

- One homepage route under `lego-redesign/`. No other routes, product pages, checkout, account, membership or payment flows.
- Visual language: bright product editorial, rectangular modules with softly rounded 12px corners, thin 1px borders, an 8px spacing grid and restrained block-like snap motion. No cloned LEGO logo, fake endorsements, fake reviews, generated images, stock footage or AI video.
- **Fonts:** [Barlow Condensed](https://fonts.google.com/specimen/Barlow+Condensed), weight 700, headings; [DM Sans](https://fonts.google.com/specimen/DM+Sans), weights 400/500/700, body/navigation. Load locally for recording if permitted; wait for `document.fonts.ready`. Use sentence case.
- Palette from `content.md`: #FFD502 primary, #006DB7 secondary, #F47D20 accent, #FFFFFF background, #141414 text, #F2F2F2 panels. Buttons on orange/yellow use dark text. Link blue on white. Never put white body text on yellow.
- Desktop 1440×900: centered max-width 1280px, 64px minimum side gutter, 24px card gaps, heading 80/84px, body 20/30px. Mobile 390×844: 20px gutters, heading 48/48px, body 17/25px, minimum 44px targets, no horizontal page overflow.
- Sticky notice, **“Unofficial concept redesign. Not affiliated with LEGO.”**, 14px minimum on the site. Header wordmark is plain text “LEGO,” accompanied by “WebDrip concept”; don't create a red-square logo imitation.
- Motion: entrance modules translateY 24→0px and opacity 0→1 over 12 frames, stagger 3 frames; spring settles once, no wobbling. Hover lift 4px, 160ms. Filters swap with 240ms fade/position transition; reduced-motion uses instant state changes. Do not add scroll hijacking or compulsory animation before buttons work.

### Page order and asset placement

All paths below are relative to `lego-redesign/assets/`.

| Section / ID | Layout and exact content | Images and crop |
|---|---|---|
| Header / `#top` | Plain LEGO text, notice; navigation **Sets**, **Gifts**, **Discover**, **About this concept**. Mobile has **Menu**. Header height 76px desktop / 64px mobile plus notice. | Text only; no logo asset. |
| Hero | New editorial headline **“What will you build next?”**; source-derived subline **“Discover new arrivals and find a set for your interests.”** Primary **“Find my next build”**; secondary **“Explore gifts”**. Yellow headline panel at left, real campaign image at right. | Desktop `hero-playstation-desktop.webp`: image panel ~680×430px, `object-fit:cover; object-position:78% 50%` to emphasize the console while retaining its controller. Inspect crop; avoid cutting recognizable parts. Mobile `hero-playstation-mobile.webp`: 350×350px, contain. Keep the photo's baked artwork intact. |
| Selector / `#sets` | Heading from source **“Find the perfect set”**. Intro **“Choose an interest to explore this concept selection.”** Four buttons: **All**, **Gaming**, **Display**, **Seasonal**. Results count updates in an `aria-live=polite` line; cards follow immediately. Desktop four columns for All, two centered for Gaming/Seasonal; mobile one column. | Eight assigned products in the following table. Isolated product PNG-derived WebPs use `contain` on #F2F2F2; lifestyle photos use square `cover`. No stretched images. |
| Inspiration / `#inspiration` | Source heading **“See what everyone's building”** and its source subline. Two large image tiles with plain product captions; no statistics or invented testimonials. | `lifestyle-downton-abbey.webp`, `lifestyle-bikini-bottom.webp`; desktop two equal squares, mobile stacked 350px squares. |
| Gifting / `#gifts` | Source heading **“Gifts that awaken their joy”**; source supporting sentence from content.md. Button **“Explore the selection”**. | Responsive `lifestyle-adult-gifting-desktop.webp` / `lifestyle-adult-gifting-mobile.webp`. Contain the collage in a neutral frame so all people remain visible; put copy outside the picture, not on the black baked margin. |
| Discovery / `#discover` | Source heading **“Discover more”**. Two cards: **“Get gifting”** with **“Browse gift ideas”**; **“Read all about it!”** with **“See the inspiration”**. Supporting copy: “Explore the sets in this concept.” and “See sets displayed in real spaces.” These are concept adaptations, not verbatim LEGO claims. | `campaign-gifting.webp`, `campaign-articles.webp`, 1.446:1 landscape, contain. |
| Concept information / `#about-concept` | Heading **“About this concept”**; text **“A homepage design exploration by WebDrip. Unofficial concept redesign. Not affiliated with LEGO. Product names, images and prices are a snapshot from LEGO’s US homepage on October 4, 2026. This demo does not sell products.”** Then **“Want a website for your business?”** and **“Book a meeting at getwebdrip.com”**. | No asset. Link opens https://getwebdrip.com in a new tab with safe rel attributes. Do not invent a calendar URL. |

### Exact product data and filter mapping

Order in **All** is the table order. These groupings are editorial to this concept, not official taxonomy or personalized recommendations.

| Name | Price (USD) | Interest | Image |
|---|---:|---|---|
| Game Boy™ | $59.99 | Gaming | `product-game-boy.webp` |
| Mario Kart™ – Mario & Standard Kart | $169.99 | Gaming | `product-mario-kart.webp` |
| Bookstore: Book Nook | $149.99 | Display | `product-book-nook.webp` |
| Hanging Golden Pothos | $59.99 | Display | `lifestyle-golden-pothos.webp` |
| Downton Abbey | $349.99 | Display | `lifestyle-downton-abbey.webp` |
| SpongeBob SquarePants: Bikini Bottom | $219.99 | Display | `lifestyle-bikini-bottom.webp` |
| Holiday House | $119.99 | Seasonal | `product-holiday-house.webp` |
| LEGO® Ideas Home Alone | $299.99 | Seasonal | `lifestyle-home-alone.webp` |

Each card: image, full name, USD price and a **“Quick view”** button. No cart or “Add to Bag” action in the concept. Preserve all source prices; do not put a price on the PlayStation hero.

### Interaction contract: implement before recording

1. **Sets** and **Find my next build** scroll to `#sets` (500ms, header offset), keep the current filter; initial filter is All. **Gifts** and **Explore gifts** scroll to `#gifts`. **Discover** scrolls to `#discover`; **About this concept** scrolls to its section. Wordmark returns to top. No navigation goes to an unbuilt page.
2. **All / Gaming / Display / Seasonal** immediately set the result list to 8 / 2 / 4 / 2 items in table order. Update count to “8 sets in this concept,” etc.; preserve selector position during the swap. Active button is yellow with a dark border and programmatic pressed state. Filters work by keyboard as well as pointer. No spinner, network request or fabricated AI recommendation.
3. **Quick view** opens a centered accessible dialog on desktop and a bottom sheet on mobile: same image, full product name, captured price, interest label, and text “Concept preview only. No purchase is made here.” Controls **“Back to sets”** and a labeled **Close** button both dismiss it. Escape closes it; focus is trapped, restored to trigger, and page scroll is locked while open. Do not invent descriptions/specifications/reviews. Mobile sheet fits viewport and can internally scroll.
4. **Menu** opens an in-page sheet with exactly the four header anchors. It closes after a link tap; Close/Escape also dismiss. Restore focus; 44px tap targets. Recording needs Menu → Sets, then Gaming → Game Boy Quick view.
5. **Explore the selection** and **Browse gift ideas** set All then scroll to `#sets`. **See the inspiration** scrolls to `#inspiration`.
6. The footer meeting link is real, but do not click away during the recording. No forms, typing, bookings, fake confirmations, accounts or purchases are part of this story.
7. On ordinary reload use All, menu closed, dialog closed; don't persist previous capture state. Pointer hover must not be the only way to access a button.

## 4. Exact video plan

**30fps throughout.** Time intervals are start-inclusive/end-exclusive; frame intervals follow the same rule. Keep total exactly 1,080 frames. Record actual working homepage actions at desktop **1440×900** and mobile **390×844**, frame by frame. Record clean action plates with 15-frame handles; assemble them in Remotion. Any opening assembly is an editorial animation of crops of our real page footage, not a claim that this was live coding.

### Shared screen rules

- Persistent two-line overlay in every frame, including the end card: **“Unofficial concept redesign.” / “Not affiliated with LEGO.”** Set at 28px minimum, dark on a solid white panel. It must not be covered by subtitles or platform UI.
- Persistent small **“Redesign Day · WebDrip”** tag above that notice. No claimed episode number; this is the first campaign-log entry.
- **Facebook:** critical safe rectangle x=84–996, y=90–1190; series/notice y=90–176; narrative title y=205–335; action footage y=360–1000; spoken subtitle lane y=1030–1160. Desktop browser presentation x=84,w=912; magnify the active region when text matters.
- **TikTok:** critical safe rectangle x=84–900, y=180–1580 (reserve the right button column and lower caption area). Series/notice y=180–266; title y=300–455; active footage generally y=480–1360; subtitle lane y=1410–1560. Use a cropped 780px-wide desktop detail, not a shrunken full desktop page. Mobile footage fits at x=280,y=470,w=400,h≈866 with a 12px code-built frame; enlarge/crop the active control for close-ups.
- Main titles 60px Facebook / 64px TikTok, max two balanced lines; manually break at phrase boundaries. Subtitles 44px, max two lines, words highlighted blue in a white caption panel. Show the complete short phrase while highlighting words; do not pop one isolated word at a time. Use real word timestamps from the generated VO, not evenly divided word estimates.
- Do not add different facts or extra narrative text. Interface labels specified above may remain visible. Every title below is exact. The title can temporarily disappear during dense subtitles if they repeat the same wording; it must never cover the interaction.

### Shot-by-shot timeline

| Seconds / frames | Visual and movement, exact action | Title and transition | 4:5 / 9:16 adaptation |
|---|---|---|---|
| **0–4 / 0–120** | Frame 0 already shows a large crop of our Game Boy card, LEGO plain-text wordmark and the four selector buttons. This is the finished **All** concept view. At 0.4s two rectangular page fragments slide 32px inward and lock flush; one click-like snap. From 1–2.5s pull back just enough to reveal the title above and part of Mario's card. At 2.5s the cursor moves toward Gaming but does not click yet. Keep a 2% drift through 4s. | **“What if LEGO started / with your hobby?”** visible on frame 0. No logo introduction or black fade. At 4s, match the selector's yellow rectangle to the full concept header. | FB shows both first cards; TT emphasizes Game Boy plus readable Gaming button, with the second card partially visible as context. No tiny device open. |
| **4–6 / 120–180** | Full hero composition: three crops of the actual recorded hero (headline, image, buttons) align over 12 frames with 3-frame stagger; remainder becomes the seamless browser recording. Cursor selects **Find my next build** at 5.2s; scroll begins and lands at selector by 6s. | **“Start with what you love.”** Use a straight cut into the settled selector at 6s; no blur wipe. | FB holds whole browser for 0.8s then crop push; TT vertically stacks the headline and square photo and follows the button. Reframe, do not crop off the CTA. |
| **6–10 / 180–300** | Selector is centered. At **7.0s** click **Gaming**; the eight-item All grid becomes the two gaming sets by 7.24s, with names/prices readable. Counter becomes “2 sets in this concept.” From 8–10s move 48px toward Game Boy and push 1.00→1.03. | **“Pick gaming. See matching sets.”** At 10s cut on the stable Game Boy card edges. | FB shows both gaming cards. TT crops into Gaming → the first card; show Mario via a short horizontal editorial pan after the filter settles. Never imply a horizontal swipe is a site feature. |
| **10–14 / 300–420** | Hover Game Boy at 10.2s; its card lifts 4px. At **11.0s** click **Quick view**. Dialog opens over 240ms; the name and **$59.99** stay visible from 11.3–13.4s. At **13.5s** click **Back to sets**. | **“Keep the set and price together.”** One brief code underline below the captured price at 12s; it adds emphasis only, not substituted text. Cut at 14s when dialog is closed. | Both cuts use a flat tight dialog view. Do not tilt prices. TT uses the desktop dialog crop here; mobile gets its own later proof. |
| **14–18 / 420–540** | Click **Display** at **14.4s**; four matching cards settle by 14.64s. At 15.3s move focus toward Hanging Golden Pothos. At 16s make a rectangular match cut from that card's image to a larger crop of the same in-page image. Slow 3% push through 18s; no asset warping. | **“Find something for your shelf.”** Transition at 18s is a hard cut on a percussion hit, from this image to the real mobile hero. | FB begins with the four-card grid then photograph; TT pans from the Display button to Pothos. The isolated photo close-up lasts 2s maximum. |
| **18–22 / 540–660** | Actual mobile hero at 18s, fresh All state. Tap **Menu** at **18.7s**, sheet opens; tap **Sets** at **19.5s**, sheet closes and scroll lands at 20.1s. Hold readable selector with slow 2% camera drift until 22s. | **“The same idea works on your phone.”** Phone enters by hard cut, already large, not flying in from off-canvas. | FB phone at x=370,y=340,w=340,h≈736 with title above. TT phone at x=280,y=470,w=400,h≈866. No second device. |
| **22–26 / 660–780** | Tap **Gaming** at **22.5s**; tap Game Boy **Quick view** at **23.6s**. Mobile sheet settles by 23.84s. At 24.5s editorial push to name, price and Back to sets button; sheet and button remain legible. No purchase occurs. | **“The details stay one tap away.”** Keep music/SFX foreground here; **no VO**. At 26s pull back to full phone within 10 frames. | FB may enlarge the sheet region to 800px wide; TT may enlarge to 720px wide. Reframe real recorded pixels, don't retype or fake a different interface. |
| **26–30 / 780–900** | Close sheet at 26.2s. From **26–28.5s** phone rotates Y **5° → −5° → 0°**, perspective 1800px; 3% dolly. Return flat by 28.5s. At 28.6s a blue rectangular WebDrip panel enters from below; phone moves up 60px. No essential content is read during the tilt. | **“Give customers a clear next step.”** From 29.5–30s the blue panel fills the content area with a stepped rectangular edge. This is the only end-card wipe. | Both cuts keep the phone inside safe bounds throughout; TT tilt capped at 5°. No night-to-day grading or clock. |
| **30–32 / 900–960** | White end card; blue panel becomes a centered underline. Plain text **WebDrip** appears at 30s; headline appears immediately. At 31s the meeting button moves up 16px and settles over 8 frames. | **“Want this for your business?”** Then **“Book a meeting”** and **“getwebdrip.com”**. Notice remains visible above. | FB headline centered x=120,w=840,y=380; button y=670, URL y=760. TT headline x=100,w=780,y=630; button y=965, URL y=1060. |
| **32–36 / 960–1080** | Hold complete end card. At 33.0s a single 0.25s accent stroke finishes under the URL; at 34.2s a small 2% push settles. URL and meeting button remain still/readable after 34.5s. Fade music only at 35.3–36s. No fade to black; final frame is CTA. | Keep **WebDrip**, **“Want this for your business?”**, **“Book a meeting”**, **“getwebdrip.com”** and the full disclaimer. No follow/share/comment request on this card. | Both aspect ratios have at least four full seconds with complete CTA. Subtitles sit beneath the URL without overlapping it. |

The video demonstrates the redesigned page only. The fair evaluation of the original stays in the brief/content snapshot; there is no “bad before” scene.

## 5. Music direction and edit map

**Search direction:** bright instrumental broken-beat / playful electronic, **120 BPM preferred (118–122 acceptable)**, warm mallet or plucked-synth motif, syncopated soft drums, round bass, small dynamic lift; clean, curious and satisfying. No vocals, nursery-song sound, dramatic trailer boom, soul, acoustic indie-pop or recognizable copyrighted song recreation. Use an actual Epidemic Sound track; don't invent a title or use an unlicensed social trending sound.

At 120 BPM one beat = 15 frames, one 4/4 bar = 60 frames. The film is 18 bars. Keep the visual timeline locked; move/cut the audio to it, not the other way around. If chosen track is 118–122, align phrase starts at the designated anchors using natural-tempo cuts/stems and short crossfades, without globally time-stretching narration or changing the film length.

- 0–4: drums/mallet stem, immediate pulse, no long intro.
- **4.0s**: bass/full groove enters on the completed homepage reveal.
- 6–14: stable groove under filtering; clicks audible but small.
- **14.0s**: a new mallet phrase supports the Display switch; do not repeat a giant drop.
- 18–22: reduce bass 2–3dB during mobile navigation narration.
- **22–26**: full instrumental and clear syncopated percussion, no VO; the taps become the satisfying center of the edit.
- 26–30: remove busy melodic stem under the owner-facing line.
- **30.0s**: warm resolving chord on WebDrip; sustain rhythmic movement through 35.3s, then 0.7s fade. End cleanly at 36s.

If stems aren't available, select a naturally sparse track and automate modest volume ducks; no vocal isolation needed. Claude logs track title, artist, ID, BPM, source/edit offsets, stems used and licensed delivery method in Self-review. Never use a downloaded asset if its access is forbidden. Target final integrated loudness around −14 LUFS, true peak ≤−1dBTP, and intelligible speech on phone speakers; use listening judgment, not gain numbers alone.

## 6. Voiceover and captions

Use Epidemic's voice tool only if actually available with a suitable natural, soft American female voice. Otherwise **Kokoro `af_nicole`**, English, speed **1.0**; warm and conversational. No celebrity impersonation, exaggerated hype or hurried syllables. Synthesize lines separately and leave natural breaths. No VO during 4–6 or 22–26; music carries the interactions. End the spoken domain as “get web drip dot com,” while all written URLs stay `getwebdrip.com`.

| Window | Exact spoken line |
|---|---|
| 0.15–3.75 | What if LEGO started with your hobby? |
| 6.15–9.60 | Pick gaming. See matching sets, right here. |
| 10.15–13.50 | Keep the set and its price together. |
| 14.15–17.50 | Or find something for your shelf. |
| 18.15–21.45 | Same idea, ready for your phone. |
| 26.15–29.55 | Your customers deserve a clear next step. |
| 30.15–35.65 | Want that for your business? Book a meeting at get web drip dot com. |

Timings are allotted windows; align actual word timestamps within them. If the final line overruns, use this pre-approved shorter line in the same window: **“For your business, book a meeting at get web drip dot com.”** Do not accelerate above 1.03×. Captions transcribe the actual chosen spoken script word for word, with the written URL normalized only in the end-card graphic. Do not leave a subtitle on screen into the next spoken line.

## 7. Sound-effect cue sheet

Source from Epidemic SFX; clean, small tactile sounds. No copyrighted console boot sounds or branded game audio. No continuous whoosh bed. These cues sit below voice and only mark visible actions.

| Time / frame | SFX | Visible cause |
|---|---|---|
| 0.4 / 12 | One short plastic-like snap | Two page fragments meet |
| 4.0 / 120 | Soft three-part assembly clack, under 250ms | Hero modules align |
| 5.2 / 156 | Dry UI click | Find my next build |
| 7.0 / 210 | Light click + quiet settling tap | Gaming selection |
| 11.0 / 330 | Soft click | Quick view opens |
| 13.5 / 405 | Muted tick | Back to sets |
| 14.4 / 432 | Same selection click | Display selection |
| 18.7 / 561 | Tiny tap | Mobile Menu |
| 19.5 / 585 | Tiny tap | Sets menu choice |
| 22.5 / 675 | Tactile tap | Mobile Gaming |
| 23.6 / 708 | Tactile tap + short air movement | Mobile Quick view |
| 26.2 / 786 | Muted tick | Sheet closes |
| 30.0 / 900 | Soft low pluck / resolve | WebDrip card lands |

13 cues total, some subtle; omit any that muddy the voice. Music's real percussion may replace an unavailable library effect, logged honestly. Don't synthesize fake “licensed” SFX or claim access that failed.

## 8. Final platform captions

### Facebook

What would you choose first: gaming, a display piece, or a seasonal build? 🧱

For Redesign Day, we imagined a LEGO homepage that starts with your interests, then puts matching sets and prices within easy reach. A playful design with a clear next step, on desktop and mobile.

Unofficial concept redesign. Not affiliated with LEGO.

#RedesignDay #WebDesign #SmallBusiness #WebDrip

Want a website designed around your customers? Book a meeting at www.getwebdrip.com

### TikTok

Gaming, display, or seasonal: which would you tap first? 🧱 Watch our LEGO homepage concept respond to the choice.

Unofficial concept redesign. Not affiliated with LEGO.

#RedesignDay #LEGO #WebsiteRedesign #WebDesign #WebDrip

Want this kind of thinking for your business? Book a meeting at www.getwebdrip.com

These are final drafts for Claude's Buffer handoff; this planning run does not post them. Captions explicitly attribute an unofficial concept and end with the WebDrip booking CTA. Don't append generic viral hashtags or a second CTA after the URL.

## 9. Uniqueness check

| Dimension | This video | Recent comparison / decision |
|---|---|---|
| Brand / industry | Recognizable LEGO, toys and adult creative building | Campaign history is empty; none of last ten topics is this industry. Check `lego-redesign/` existed only after this run created it. |
| Story | Interest choice → matching sets → quick view → mobile proof | Chainwren was after-hours booking/loss/payoff; Bobblefin a two-school race. Neither is reused. |
| Hook | Product-first “What if LEGO started with your hobby?” | No type-only owner callout, ticking clock, split-screen duel, generic bad site or “picture this” opener. |
| Edit | Tactile rectangular assembly + cursor-led causal demonstration, sparse VO | Distinct from clock-driven cinematic soul and the school-gate POV. No chapter-numbered feature tour; each shown action answers the opening hobby question. |
| Transition | Rectangular crop assembly, hard cuts and image match cut | No round iris, divider duel wipe, swipe-away or browser-to-phone morph. |
| Music | Instrumental broken-beat electronic with mallet motif, ~120 BPM | Last ten include nu-disco, trap, future bass, afro-house, dance-pop, moody indie-electronic, cinematic, acoustic indie-pop and male-vocal soul. Keep it light, rhythmic and percussive rather than those prior moods. |
| Voice / format | Sparse calm af_nicole VO with a four-second music-only interaction passage | Latest was text + male-vocal song; prior was continuous af_heart story. |
| Duration / CTA | 36 seconds; owner-facing payoff, six-second CTA segment | Last two briefs 45 seconds with fictional booking outcomes. This shows no lead/revenue outcome. |

**Evidence boundary:** only two prior briefs are available. Do not claim we reviewed ten nonexistent briefs. Supplemental comparison with last ten topic-log entries is explicit; not every older transition/format is documented, so uniqueness on those dimensions is checked against the two known briefs only.

## 10. Claude handoff and acceptance

Before production, verify this brief, manifest and source content; confirm all 14 images load locally. Build only this homepage in its own folder. Do not edit unrelated project folders or root showcase files. Use no AI-generated images or video. Do not fetch new visuals from outside the homepage asset pack.

Record desktop and mobile independently. Confirm each click in the timeline is a working DOM interaction; demonstrate the actual filter counts, names and captured prices. Capture from a settled page with loaded fonts/assets, no consent banners, no broken-image placeholders and no unintended outbound navigation. Do not insert fake UI confirmations.

Review both final cuts at phone size, at every shot boundary and motion extreme, with sound on and muted. Check total 1,080 frames, the final card, word alignment, crop safety, contrast, all disclaimer frames and domain spelling. Verify actual voice duration before final render. No statistic, booking result, brand relationship or audience-performance claim may be invented. Don't change `brief_ready` to published merely because a file rendered; posting status requires actual Buffer confirmation.

When available after posting, compare early retention, average watch time, completion, meaningful comments, profile/site clicks and qualified meeting inquiries with WebDrip's own prior posts. Report platform metrics separately and do not infer causation from one upload. Distinguish design-fan comments from actual business inquiries. Add Claude's **Self-review** here with: what held attention, where viewers dropped, what was unclear, actual music/VO/SFX choices, any deviations and one concrete next experiment. If analytics aren't available, say so; do not score imagined audience performance.

## Self-review (Claude, after the final render)

**Remake, 2026-10-04 (Sourav's request):** the first cut couldn't follow the brief's music, SFX and voice instructions, because the Epidemic plan then refused full-track, stem and sound-effect downloads. Sourav upgraded to Epidemic Pro and asked for the soundtrack to be rebuilt exactly as briefed, with Kokoro `af_heart` instead of `af_nicole`. The picture is unchanged. Only the soundtrack, the voice and the subtitle timings (which follow the new voice) were redone, and both cuts were re-rendered and re-checked.

Reviewed both cuts at phone size: exact frames every 2 s and at every shot boundary, ffprobe, `freezedetect`/`blackdetect`, EBU R128 loudness, and a faster-whisper (base.en) transcript of the final mix. No analytics exist yet, so no audience performance is scored. What held attention and where viewers dropped can only be answered after posting.

**Delivered:** `video.mp4` 1080×1350 and `video-tiktok.mp4` 1080×1920, 36.000 s, 1,080 frames, 30 fps, H.264 + AAC, faststart. Loudness is −14.3 LUFS integrated with a −3.0 dBFS true peak. No black frames. The only still stretches are the end-card holds the brief asks for. The alignment check covered 52 frames per cut: safe area, centring, footage filling every window, text and subtitle collisions, a mock TikTok UI layer and flat holds, plus the midpoint of every subtitle phrase. (Rerun on the remade cuts in progress; result recorded here when it completes.)

| Criterion | Score | Notes |
|---|---|---|
| Hook strength | 7 | Frame 0 is our real selector with the Game Boy card, the LEGO wordmark and the spoken question; the fragments lock at 0.4 s on a plastic-brick snap. It is calm UI rather than a striking image. |
| Matches the brief | 9 | Shot timings, titles, VO windows and lines, click/tap timings, layouts, the music edit map and all 13 SFX cues follow the brief; remaining deviations below. |
| Story clarity | 8 | Choice → matching sets (8 → 2 → 4 with real counts) → quick view with name and price → same flow on the phone → owner-facing CTA. |
| Readability on a phone | 7 | Desktop shots sit at 1.08–1.6×, and the dialog and mobile sheet are pushed in. The 14.0–15.2 s four-card overview at 0.71× is small. af_heart is quicker, so some subtitle phrases are on screen for only about half a second. |
| Smoothness | 8 | Frame-by-frame recordings (0–4 slightly late frames per take, none visible), eased camera moves, no stutter or blank frames. |
| Music fit and beat sync | 9 | Built from the full track and its stems to the brief's map: drums and mallet only until 4.0 s, bass on the hero reveal, a new mallet phrase at 14.0 s, bass down 2.5 dB at 18–22 s, drums up at 22–26 s, melody out at 26–30 s, and the E♭ minor breakdown chord on the WebDrip card at 30.0 s. |
| Sound effect placement | 8 | 13 Epidemic sound effects on the 13 cues, set relative to the bed: crisp on the clicks, quieter for ticks and taps, and the satisfying centre at 22–26 s. Clicks under a spoken word sit under the voice. |
| Voiceover naturalness | 8 | af_heart at speed 1.0 is warm and clear, and every line, including the brief's main CTA, fits its window with room to breathe. The final-mix transcript matches the script word for word. |
| End card clarity | 9 | WebDrip, the headline, "Book a meeting" and getwebdrip.com are held for six seconds, with the notice visible throughout. |
| Sells WebDrip | 7 | The owner-facing line and CTA are clear, but most of the runtime is about the LEGO interface itself. |

**Music:** "Outliers" by Gridded (Epidemic Sound ID `6b678218-e4cd-3a2e-a1e2-439b55d020a5`), 120 BPM, B♭ minor, instrumental, mallet-featured, tagged hopeful.
- **Delivery:** `DownloadRecording` WAV of the full track plus the DRUMS, BASS and INSTRUMENTS stems (48 kHz). The connector lists a MELODY stem but offers no download for it.
- **Cut:** original 28.25–42.25 s at 0 s, then 48.25–70.25 s at 14.0 s, with a 30 ms equal-power crossfade on the downbeat. All parts are cut together.
- **Parts:**
  - The drum stem sums sample-exactly into the full mix.
  - The bass stem's low end is about 12 ms off the master's, so a plain stem sum would leave a −17 dB low residual.
  - So the full mix is split into parts that sum back exactly: drums, low (non-drum content under 150 Hz: bass and sub), melody (full minus the three stems, above 150 Hz) and the rest (instruments).
- **Map, against the brief:**
  - 0–4 s: drums, mallet and pads only, with an immediate pulse.
  - 4.0 s: the bass enters (original 32.25 s).
  - 14.0 s: a new mallet phrase (original 48.25 s).
  - 18–22 s: low part −2.5 dB.
  - 22–26 s: full instrumental, drums +1.5 dB, no VO.
  - 26–30 s: melody part removed (−30 dB, 60 ms ramps).
  - 30.0 s: breakdown on an E♭ minor chord, with soft drums sustaining the movement.
  - 35.3–36 s: 0.7 s fade.
- **Ducking:** music drops 9 dB under speech with a 150 ms look-ahead. No EQ dips were needed: whisper hears "get web drip dot com" in the final mix.

**Voice:** Kokoro (kokoro-onnx v1.0) `af_heart`, en-us, speed 1.0, each line synthesized separately. The Epidemic connector has no voice tool.

| Line | Window (s) | Speech (s) |
|---|---|---|
| What if LEGO started with your hobby? | 0.15–3.75 | 0.15–1.82 |
| Pick gaming. See matching sets, right here. | 6.15–9.60 | 6.15–8.38 |
| Keep the set and its price together. | 10.15–13.50 | 10.15–11.92 |
| Or find something for your shelf. | 14.15–17.50 | 14.15–15.71 |
| Same idea, ready for your phone. | 18.15–21.45 | 18.15–19.97 |
| Your customers deserve a clear next step. | 26.15–29.55 | 26.15–28.26 |
| Want that for your business? Book a meeting at get web drip dot com. | 30.15–35.65 | 30.15–33.82 |

The brief's main CTA line is used; the backup line wasn't needed. No VO runs at 4–6 or 22–26 s. The final-mix transcript matches the script.

**Sound effects:** 13 cues, all Epidemic `DownloadSoundEffect` WAVs. Each is trimmed so its transient lands on the cue frame and set by 10 ms RMS against the bed.

| Time | Cue | Epidemic sound effect (ID) |
|---|---|---|
| 0.4 | Plastic snap | Toys, Misc, Lego, Two Pieces, Stuck Together Or Broken Apart (`e10a74e1`) — a foley recording of two plastic bricks, not branded audio |
| 4.0 / 4.1 / 4.2 | Three-part assembly clack, 0.25 s | Rummy O, Brick, Single, Down On Plastic Rack 02 (`6679cb55`), the brick snap above, Rummy O, Brick, Single, Down On Plastic Rack (`e7ff87b3`) |
| 5.2 | Dry UI click | User Interface, Click, UI Buttons, Simple, Select (`d637e4e8`) |
| 7.0 + 7.24 | Light click + settling tap | Mechanical, Click, LED Light, Plastic, Button Press, Single (`ab33e364`, press only) + Rummy O … Rack 02 |
| 11.0 | Soft click | User Interface, Click, UI Buttons, Confirm, Dull (`46216b97`) |
| 13.5 | Muted tick | User Interface, Click, UI Buttons, Dull, Menu (`8c530605`) |
| 14.4 | Same selection click | as 7.0 |
| 18.7, 19.5 | Tiny taps | Communications, Cellphone, Touchscreen, Tap Hard (`31365f66`), quiet |
| 22.5 | Tactile tap | Touchscreen Tap Hard + User Interface, Click, UI Buttons, Bubbly, Select (`7cce069c`) |
| 23.6 | Tactile tap + short air | as 22.5 + Swooshes, Whoosh, Designed, Generic, Air (`c406a00b`), peaking as the sheet settles |
| 26.2 | Muted tick | as 13.5 |
| 30.0 | Soft low pluck / resolve | Mallet, Synth, Warm, Soft, Positive 02 (`6b0a5cd7`), varispeed −2 semitones (F → E♭) to sit on the breakdown chord |

**Deviations from the brief, with reasons:**
1. The voice is `af_heart`, not `af_nicole`, on Sourav's instruction in this run (Sourav found af_nicole too whispery).
2. The melody "stem" is derived (full minus the downloadable stems, above 150 Hz), and the bass move acts on all non-drum content under 150 Hz. The MELODY stem has no download option, and the bass stem doesn't phase-match the mastered low end.
3. The 30.0 s pluck is pitched down two semitones to match the breakdown chord, and the 4.0 s three-part clack is assembled from three single brick hits, 0.1 s apart.
4. Hero image uses `object-position: 97% 50%` on a 680×416 panel (brief: 78%, ~680×430). At 78% the photo's baked PlayStation badge was cut off, and the brief also asks to keep baked artwork intact and avoid cutting recognizable parts.
5. The Facebook phone footage is 330 px wide (brief: 340). With the brief's x=370, y=340, w=340, the phone frame plus the 2–3% drift and dolly would run into the subtitle lane.
6. Each spoken line is captioned as one or two complete short phrases on a single line (for example "Keep the set" / "and its price together."). This keeps the panel above the Facebook phone and above TikTok's bottom caption zone. The panel's bottom edge sits at y 1160 (Facebook) and 1508 (TikTok); the brief's TikTok lane ran to 1560.
7. The 26–30 s title fades at 28.6 s, when the phone rises 60 px. The brief lets a title step aside when the subtitle repeats its wording.
8. At 6–10 s the "48 px toward Game Boy" move happens after the filter settles, as a pan to the centred gaming cards with the 3% push. The edge of the recorded viewport limited a straight downward move.
9. In TikTok's 4 s match cut, the selector's yellow rectangle lands on the yellow hero panel, because the vertical layout has no browser header.
10. The WebDrip panel and underline use WebDrip blue (#0075DE).

**What worked:** real interactions carry the story, with honest counts, names and prices. One continuous desktop take and one mobile take, with logged click and tap positions, put the drawn cursor and tap rings exactly on the real controls. With stems, every music instruction in the brief could be followed literally, and real tactile sounds on each click make the interface feel physical.

**Top 3 for the next brief:**
1. Give device sizes and subtitle lanes that already clear each other and TikTok's bottom caption zone (from y 1520), so production doesn't have to shrink devices or split captions.
2. Size VO windows for `af_heart` at 1.0 (about 3–3.8 words/s), Sourav's preferred voice, and say whether a longer line should fill the extra time.
3. Avoid wide desktop overviews below about 0.9× scale. Ask for one readable framing per beat, or larger card type, if the grid must read on a phone.

**One next experiment:** compare this sparse-VO, interface-led format against a music-only cut of the same footage, once both have real retention data.
