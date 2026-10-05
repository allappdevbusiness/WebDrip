# Marlowick: show the price, then show the next step

Create and render two finished WebDrip promotional videos for the fictional Marlowick menswear website in automation-v2/websites/marlowick/. Use Remotion, real Playwright recordings, and the exact production plan below. Work independently through capture, edit, audio, render, and inspection.

The creative idea is simple: a customer should be able to find suit hire prices and understand how to request a fitting. Open with that practical question, prove the answer through the actual website, then show the design and the working demo form. Sell WebDrip's ability to make a clear, attractive website; do not portray Marlowick as a real shop, a client, or a completed booking.

## 1. Deliverables and source

- TikTok: video-tiktok.mp4, 1080 × 1920, 60 fps, exactly 1,920 video frames.
- Facebook: video.mp4, 1080 × 1350, 60 fps, exactly 1,920 video frames.
- Runtime: 32.000 seconds for each. This gives the input's price question, design proof, and form interaction room to read, with only a three-second ending. It is a creative duration choice, not a prediction of views.
- H.264, yuv420p, AAC stereo at 48 kHz, fast-start. Check the video stream's frame count; AAC padding may make container duration slightly longer.
- Build the editable Remotion project, captures, audio, and diagnostic notes in a separate local working/output directory. Deliver those with the MP4s as local artifacts. Do not commit additional files, modify website source, publish the videos, deploy the site, or change this brief.
- Source repository: https://github.com/allappdevbusiness/WebDrip
- Reviewed source revision: 19bc58c1ed8a603a8a86126aeccf16c44b70babf, merged by PR #1.
- Website: automation-v2/websites/marlowick/index.html and assets/.
- Readable source: automation-v2/websites/marlowick/app/src/, especially data.js, components/, index.css, and motion.js.
- Serve a local source snapshot from the repository root with npx http-server -p 8080 -s. Open http://localhost:8080/automation-v2/websites/marlowick/.
- There is no verified hosted Marlowick URL. Never invent one. getwebdrip.com is the WebDrip ending link, not Marlowick's website address.
- Read _toolkit/README.md and reuse _toolkit/rec.js, _toolkit/mix.py, and _toolkit/remotion/ as helpers. Copy helpers into the local working directory if changes are needed. Do not overwrite shared helpers.
- Check installed Remotion package versions and the applicable Remotion skills before selecting rendering APIs.

This brief supersedes the earlier Larkmere creative treatment. Do not include its AI collaboration scene, logos, slogan, paper-turn sequence, flower assets, seven-second end-card treatment, or DM promise. Use no voiceover: the readable story and selected instrumental carry this edit.

## 2. Verified visual and honesty rules

Use ivory #FAF7F0, white #FFFFFF, sky #E9F0FF, sand #F4E9DA, cobalt #2747D6, and camel #C08A4E. Ink #121826 is for text, never a scene background. No black frames, dark interstitials, terminal scenes, or dark device surrounds. A small photographic shade may improve text contrast; keep the actual photographs natural.

Use local Inter and JetBrains Mono files:
- assets/inter-latin-wght-normal-Dx4kXJAl.woff2
- assets/jetbrains-mono-latin-500-normal-BWZEU5yA.woff2

Copy them into the local Remotion assets directory and wait for fonts before measuring. Use Inter for editorial sentences and JetBrains Mono for restrained labels. Keep the source type in recorded footage intact.

Marlowick's own fictional name and M mark can appear as part of the site. WebDrip is the only real company identity featured. No Claude, ChatGPT, Codex, Apple, browser-vendor, or other external brand logos; keep browser frames generic. Do not add recognizable clothing-brand graphics.

Always distinguish the sample from real business results:
- Keep "Demo website by WebDrip" readable in the dedicated notice lane throughout.
- Prices are fictional website content, not an offer from WebDrip.
- No invented cart, checkout, payment, reviews, testimonials, visitors, conversions, follower counts, address, phone number, or live business claim.
- Product cards are not links. Hover them; do not fabricate product clicks.
- The form is client-side only. Its success message explicitly says nothing was sent. Preserve that disclaimer, and add the scene's separate plain-language demo caption.
- Do not isolate the site's "Most booked" badge as a popularity claim. Keep it contextual to the labeled demo, and preferentially crop to the plan name, amount, unit, and actual button.

On-screen editorial copy must match the timeline exactly. Use natural complete sentences, without slang, puns, hype, profanity, corporate filler, cryptic fragments, or implied sales results. Source headings, field labels, prices, the WebDrip name, and its URL are interface/brand text and may retain their original form.

## 3. Music: specific selection, excerpt, and verification

Primary: "Domino" — Peachwood
- Epidemic track ID: 2bf4be37-0d26-4ca1-a767-c80c23597c1d
- https://www.epidemicsound.com/music/tracks/2bf4be37-0d26-4ca1-a767-c80c23597c1d/
- Catalogue: 120 BPM, Future Funk / Synthwave, Eccentric / Happy, 3:44; the public page metadata marks it instrumental and not explicit.
- Creative use: a clean, rhythmic fashion treatment with readable product proof. Do not turn it into a nightclub edit.
- Source excerpt: 00:28.030 through 01:00.030, exactly 32.000 seconds, at natural speed.
- The public preview was analyzed for amplitude and timing when this brief was prepared. Its mean short-window RMS rises from about 0.186 in 28–32 seconds to about 0.250 in 32–36 seconds, with a strong local transient near source 32.037. This supports the main price reveal at video 4.000 seconds. It is an observed energy change, not a claim that a verified chorus or formal drop starts there.
- The 28.030 offset is the preview-based timing reference. Audition and verify the licensed full-quality download before locking picture. A different encoder delay may move this reference. Align the matching musical passage, update the source in/out by the same offset, and preserve the 32-second output and picture frame map.
- Do not use the public low-quality preview as the final music asset. Obtain the full-quality recording through the authorized Epidemic connector.

Verified backups, in this order:
1. "Nu Clear" — Lukas Got Lucky, 120 BPM, Future Funk, Eccentric / Happy.
   ID: 2d079e22-90c8-43ce-b3b3-e6ae6417b952
   https://www.epidemicsound.com/music/tracks/2d079e22-90c8-43ce-b3b3-e6ae6417b952/
2. "Chromatic" — Lukas Got Lucky, 120 BPM, Future Funk, Eccentric / Laid Back.
   ID: 9d3065a9-8fb4-46ea-bcdb-d2b04b27d688
   https://www.epidemicsound.com/music/tracks/9d3065a9-8fb4-46ea-bcdb-d2b04b27d688/

The primary and backup identities were verified against Epidemic's public catalogue on October 5, 2026. Backup excerpt timings were not measured. Only use a backup if the primary cannot be obtained or the actual audio fails the intended treatment. For a backup, find the first strong full-arrangement entry after its intro, use four seconds before that entry as the in point, and take 32 seconds continuously. Confirm that the in point is nonnegative and the excerpt stays within the file; otherwise choose the next suitable entry. Measure its beat phase, align the entry to video 4.000, and document the actual source times. Never reuse Domino's timestamps for another recording.

Music acquisition:
1. Resolve the UUID; if it fails, search the exact title plus artist and verify the identity.
2. Use DownloadRecording for the full mix. Download returned URLs immediately. Obtain DRUMS if available; other stems are optional.
3. If downloads are forbidden but the connector permits edits, use EditRecording with one required region, maxResults 1, no forced duration, then DownloadRecordingEdit. Check whether the returned edit contains the required passage and map it back to the source. Do not assume edit time equals original-track time.
4. Preserve natural tempo and pitch. Do not stretch a song to make a scene fit.
5. If all three tracks are unavailable, finish a clearly labeled picture-only review locally and report the music blocker. Do not call silent previews finished deliverables.

Beat map:
- 120 BPM gives 0.500 seconds per beat and 30 frames per beat at 60 fps. A half-beat is 15 frames. Confirm meter and phrase boundaries from the actual recording; BPM alone does not prove a downbeat.
- Use video 4.000 / frame 240 as the main musical and visual lift: the hire amount and its unit become fully legible together.
- Nominal beat index is video time × 2. Main scene boundaries are at beats 0, 4, 8, 14, 20, 24, 29, 34, 38, 43, 50, 58, and 64.
- Settle moments, accents, and taps may use half-beats. Do not force every cut to a bar boundary. Keep the first eight beats lighter; bring the full arrangement into focus at frame 240.
- Public-preview peaks around source 32.037, 36.048, 40.049, 48.021, and 56.033 correspond approximately to video 4, 8, 12, 20, and 28. These are waveform anchors, not a complete musicological analysis.
- Use a short, gentle drum reduction under the first error message and return the groove as the corrected fields appear. If no stem is available, use a subtle full-mix gain dip, not silence.
- Fade the music only within the final 0.5–0.75 second and preserve a natural ending. The visual remains fully present through the last frame.
- Save exact source in/out, measured offset, markers, and any edit mapping in local music-map.json.

Use a maximum of six distinct quiet SFX assets; reuse taps only for real actions. Search terms: "soft UI tap", "short fabric swish", "soft airy whoosh", "subtle mechanical tick", "soft button click", and "gentle confirmation chime". They are search terms, not claimed catalogue titles. Retrieve through SearchSoundEffects/DownloadSoundEffect. If an effect is unavailable, omit it rather than add a harsh substitute. Keep effects below the music and do not add an impact on every cut.

## 4. Layout and camera system

Both compositions are independently laid out. Do not crop the finished 9:16 video to make the 4:5 version.

TikTok essential safe area: x 120–960, y 150–1520. Use an even more conservative working right edge of x 920:
- Editorial headline lane: x 140–920, y 180–380.
- Main recorded-UI stage: x 140–920, y 420–1400.
- Demo notice: x 140–920, y 1450–1500.
- Decorative photo edges may bleed outside; every meaningful price, unit, label, cursor landing, logo, and CTA remains inside.
- No lower-stage phone positioned under the platform's right-side controls. Keep lower content at or below 780 px wide.

Facebook working area: x 120–960, y 100–1230:
- Headline lane: x 140–920, y 130–310.
- Main UI stage: x 140–920, y 350–1110.
- Demo notice: x 140–920, y 1170–1220.

For each scene, adapt these lanes and the specific directions below. They are container bounds, not a reason to shrink unreadable content. Crop more tightly or show fewer interface elements when needed.

- Editorial headline: normally 76–88 px, 1.08–1.12 line height; use at most three balanced lines. The opening uses three lines at 76 px.
- Key secondary text and demo notice: at least 40 px. Main CTA: 48–54 px. URL: 54–60 px.
- Any source UI text needed to understand the action must have an effective rendered height of at least 40 px on the 1080-wide output. Enlarge the captured region rather than replacing the real label with fabricated UI.
- Show only the field/button/price region necessary at that moment. A whole form at unreadable scale is not proof.
- Use sharp crops from DPR 3 mobile recordings. Desktop captures may use DPR 2 for tight source crops. Rect logs remain in CSS pixels; account for the actual encoded dimensions.
- Use mostly front-facing UI. One source hero perspective move provides depth; do not spin devices.
- Editorial sentences settle in 10–14 frames with an 18–28 px baseline reveal and remain readable while footage moves. Do not bounce or constantly animate letters.
- A cobalt line with a small camel endpoint connects selected crops. It is an editorial guide, never a fake website control.
- Use one 12-frame rectangular mask wipe and occasional clean match cuts. Keep labels sharp throughout. No whole-frame directional blur, smeared page transitions, repeated flash frames, or fake glitches.
- Every 1–1.5 seconds, change the useful visual information or framing where appropriate. Reading holds may keep text steady while a small camera move or genuine site animation continues. Do not manufacture purposeless motion to satisfy a timer.

## 5. Exact 32-second timeline

Frames below use [start, end) ranges: start included, end excluded. The final visible frame is 1919. Transition overlaps occur inside these ranges and must not change runtime. "Text" is the exact editorial sentence; do not add unlisted slogans. The persistent demo notice is additional to the listed text.

### Scene 1 — the question
0.000–2.000 seconds | frames 0–119
Text: "Does your website show hire prices?"
Break as: "Does your website" / "show hire" / "prices?"

- 9:16: begin with a crisp crop of the real Marlowick hero, logo, and recognizable suit rail in the UI stage; the question is already readable by frame 12. Do not start with a logo-only screen.
- 4:5: use a wide desktop hero crop with the headline and rail arranged beneath the three-line question; give the website its own clear region.
- Camera: 4% push toward the real hero buttons, without obscuring the question.
- Source: #top, #heroTitle, #heroImg. No clicks.
- Animation/transition: a 12-frame bottom-up headline reveal; at 1.000 seconds a thin cobalt underline settles under "prices?". End with a clean cut into the mobile navigation.
- Sound: music from the beginning; one quiet fabric swish as the rail comes into view. No invented dramatic drop.

### Scene 2 — find the hire section
2.000–4.000 seconds | frames 120–239
Text: "Make the answer easy to find."

- 9:16: enlarged real mobile header and menu; show the Marlowick mark, hamburger, and Hire link. Track down with the genuine anchor navigation toward the hire section.
- 4:5: wider close-up of the same mobile menu and destination; reposition the headline upward and give the action more horizontal room. Do not substitute a fake desktop hamburger.
- At 2.250 / frame 135 tap #burger. Show aria-expanded changing to true and the source menu opening.
- At 2.750 / frame 165 tap #mobileMenu a[href="#hire"]. Record the real close and navigation. The interaction must land in the visible link, not where it used to be before the menu animation.
- Preserve the click and at least 0.25 seconds of the navigation response. You may cut past uneventful travel to the already-recorded destination; never imply instant navigation if it did not occur.
- By 3.750, start tightening toward the first hire price card. Allow its count-up to complete in the recorded source, using a later captured segment if necessary.
- Sound: two soft taps, only at the actual action frames. A quiet short whoosh bridges the scroll.

### Scene 3 — the answer
4.000–7.000 seconds | frames 240–419
Text: "Show the price before they ask."

- The strongest early reveal lands at 4.000 / frame 240, matched to the measured energy lift.
- 9:16: show one source card at a time. At 4.000 reveal Single hire, $95, per weekend. At 5.500 / frame 330 match-cut to Black tie, $120, per weekend. Keep the plan name, amount, and unit together.
- 4:5: use a wider card crop with its button and descriptive context; change emphasis from Single hire to Black tie at the same time. Do not put two cards side by side if that makes the units smaller than 40 px.
- Source: #hire .wd-plan; the first card and .wd-plan-featured. No card clicks. These are price presentations, not a checkout.
- Animation: short vertical crop reveal; 3% slow push after settling. A small editorial line points to the amount without covering it.
- Use final source values. No large, readable partial count-up numbers presented as prices.
- Sound: one quiet tick at the settled $95 reveal. Let the music carry the second reveal.

### Scene 4 — design proof
7.000–10.000 seconds | frames 420–599
Text: "Make the first impression count."

- 9:16: return intentionally to the real mobile hero for its signature transformation. Start with its tilted rail frame, then record the actual scroll-driven expansion. Keep the image inside the editorial stage; the source frame may fill its stage without darkening the entire composition.
- 4:5: use the separate 1280 × 720 desktop capture, whose source framing begins smaller. Show more of the rail horizontally; do not crop the vertical render.
- Source: #top, .wd-hero-frame, #heroImg. Scroll source progress from 0.15 to 0.90 using the measured hero scroll span. No clicks.
- Camera: no additional perspective warp. Follow the site's own straightening and expansion; add only a restrained center adjustment.
- Transition: one 12-frame cobalt-edged rectangular mask into the suit cards, with ivory on both sides and no motion blur.
- Sound: one short fabric swish at the expansion; music accents near video 8.000 support the final straightening.

### Scene 5 — what the customer gets
10.000–12.000 seconds | frames 600–719
Text: "Show what the price includes."

- 9:16: show the source section sentence "Each suit price includes a fitting and simple alterations." as an enlarged recorded crop, then shift to The Navy Two-Piece and "from $420". Keep the editorial caption separate.
- 4:5: use a desktop crop containing the first suit image, its title/price, and the relevant section copy, with a small pan rather than shrinking the entire grid.
- Source: #suits; use #suits .wd-suit:first-child and verify its h3 reads "The Navy Two-Piece". Hover that real card at 10.750 / frame 645 in the desktop recording; use the genuine source lift/zoom/sheen.
- The vertical version can show the desktop hover crop here. Do not show a finger tap or suggest a mobile hover happened.
- Transition: match the suit lapel's diagonal edge to the fitting photograph.
- Sound: music only.

### Scene 6 — the fitting detail
12.000–14.500 seconds | frames 720–869
Text: "Explain how the fitting works."

- 9:16: close-up of #spotlight's real photograph, enough rotating ring to register its motion, and the source Pause button. Reframe toward the actual fitting link for the final action.
- 4:5: use the desktop split section, then enlarge its media/control area; keep the editorial sentence above it.
- At 12.500 / frame 750 click #spotlight .wd-spot-toggle. The label becomes Play and the source animation pauses.
- At 13.000 / frame 780 click the same button again. The label becomes Pause and motion resumes. Keep this demonstration short and legible.
- At 14.000 / frame 840 click #spotlight a[href="#fittings"]. Retain the real navigation response into the next scene.
- Track each measured target. The toggle has dynamic accessible names; use its stable class and verify its current state.
- Sound: quiet button clicks for the two toggle actions; no added freeze/glitch effect.

### Scene 7 — time expectations
14.500–17.000 seconds | frames 870–1019
Text: "Show how long the fitting takes."

- 9:16: move from the actual "About 45 minutes, start to finish." heading into the timeline's "Pin and chalk" step, then the "3–5 days" collection/alterations information. Use sequential enlarged crops, not the entire timeline at tiny scale.
- 4:5: show the real heading and first relevant timeline region in a wider crop; pan down to the collection detail.
- Source: #fittings and its real heading/timeline/stat elements, resolved from the DOM. No clicks.
- Make the distinction visible: 45 min is the fitting duration; 3–5 days is the simple alteration/collection interval. Never imply the finished suit is available after 45 minutes.
- Animation: source dots and count-ups plus a small camera track. Cut only to settled final values for the stats.
- Sound: one subtle tick at the completed 45 min value, then music only.

### Scene 8 — the next step
17.000–19.000 seconds | frames 1020–1139
Text: "Give them a clear next step."

- 9:16: a clear return to the Black tie hire card, enlarged around $120 per weekend and its real Book this hire link. Land the ring on the button, then follow navigation toward #visit.
- 4:5: use a separate desktop hire crop showing the complete Black tie card before tightening on its link.
- At 17.750 / frame 1065 click #hire .wd-plan-featured a[href="#visit"].
- Keep at least 0.25 seconds of the response. At 18.500, use a clean cut to the later recorded form arrival if the page travel is too long. Do not fake a reservation confirmation.
- No form values are prefilled by the hire link. The actual default occasion is A wedding; preserve that until the later selection.
- Sound: one soft tap and a restrained short whoosh during navigation.

### Scene 9 — an honest error state
19.000–21.500 seconds | frames 1140–1289
Text: "Help them fix missing details."

- 9:16: close-up of the real empty form button, followed by a track to the name field and actual error.
- 4:5: frame the submit control first, then reframe independently to the larger field/error region. Never squeeze the whole form into the stage.
- At 19.250 / frame 1155 click #bookForm button[type="submit"] with empty name/email.
- Record the actual .wd-shake motion, focus movement, #nameErr text "Please enter your name.", and #emailErr text "Please enter your email."
- Prioritize the name error for reading. If both messages cannot fit at the required scale, use sequential camera crops; do not duplicate or rewrite them.
- Do not add an alarm, red full-screen flash, or mock error toast.
- Sound: soft submit click, then a slight drum dip that makes the real error moment feel deliberate rather than broken.

### Scene 10 — complete the real fields
21.500–25.000 seconds | frames 1290–1499
Text: "Choose the occasion and request a fitting."

- 9:16: follow one enlarged field at a time. Show the actual label and entered value; keep a little neighboring UI so the crop stays identifiable.
- 4:5: show the desktop name/email row with independent crops and then center the real occasion control. Never shrink labels below the readability target.
- At 21.500 / frame 1290 click #name. Type "Alex Reed" with real keyboard events; finish by 22.100.
- At 22.250 / frame 1335 click #email. Type "alex@example.com"; finish by 23.350. This reserved example address is demonstration data.
- At 23.500 / frame 1410 click #occasion. Its initial selected value is A wedding. Use the actual native selection interaction to choose Black tie: focus, ArrowDown, Enter, and verify its selected value.
- Show Black tie clearly by 24.250 / frame 1455. The preferred day is optional; leave #date empty.
- Native popup menus may not appear in headless screenshots. If the popup is not captured, show the focused native select before the key action and the genuine changed value afterward. Do not draw a fabricated dropdown or invent native-menu footage.
- Ensure the form's actual React state changes through genuine input/select events. Do not paint values onto screenshots or change DOM text to simulate input.
- The source may keep its previous error text until resubmission. Preserve that real behavior; do not erase it in editing.
- Sound: two soft field clicks and a quiet selection tick. The groove returns naturally; no loud typing effect.

### Scene 11 — prove the demo response
25.000–29.000 seconds | frames 1500–1739
Text: "Demo only. Nothing was sent."

- At 25.250 / frame 1515 click #bookForm button[type="submit"] with the valid demonstration values.
- 9:16: track from the actual submit button to the real #formOk box, then give the full box an enlarged, readable crop. Keep its green check and full disclaimer intact.
- 4:5: use a separately measured crop/reflow from the real desktop layout. If its long single line does not fit, record the same real form at the mobile viewport for this scene and frame that source crop independently; do not rewrite or relayout the page in post.
- Actual success text: "Thanks, Alex. This is a demo site, so nothing was sent, but on the real site we’d email you to confirm."
- Show it from the actual recording. Do not replace it with "Booking confirmed", confetti, a calendar reservation, a sent-email indicator, or a sales claim.
- Use a very small 2% camera move while the text remains stable and readable. Do not cut away from the disclaimer for decorative shots.
- Sound: one soft submit click and one quiet confirmation chime. No cash-register or payment sound.

### Scene 12 — WebDrip ending
29.000–32.000 seconds | frames 1740–1919
Exact text:
"WebDrip"
"Follow WebDrip for more website ideas."
"getwebdrip.com"
"Demo website by WebDrip"

- Use the genuine WebDrip mark from the toolkit, or its plain wordmark if the asset cannot be verified. Do not generate a new logo.
- 9:16: centered wordmark around y 600; follow sentence in two balanced lines around y 780; URL around y 1020. The persistent demo notice remains in its normal lane.
- 4:5: centered wordmark around y 380; follow sentence around y 540; URL around y 760; demo notice remains in its normal lane.
- Ivory background. Small sky/camel panels made from real Marlowick crops may drift at the edges, but they must not compete with the CTA.
- Set all text by 29.200. Keep it fully readable to the final frame. A slow 8–12 px accent-line drift provides motion; the CTA text itself stays steady.
- No Comment PROMPT, DM promise, guaranteed results, additional slogan, or unverified live-site address.
- Sound: musical ending and gentle fade inside the duration; no separate outro sting.

## 6. Recording plan and click accuracy

Record both desktop 1280 × 720 and mobile iPhone 13 logical viewport 390 × 844. Use mobile touch semantics for the menu and the relevant mobile actions; use desktop pointer semantics for hover. Capture at 60 fps with the toolkit's slowed real-site animation timing. Start with rate 1/6 and lower it if the recorder logs late frames. Do not speed CSS while leaving JavaScript animation at a different rate.

Preflight:
- Block service workers for capture; wait for fonts and all images, including lazy-loaded images.
- Resolve the downloaded source's photographs locally where needed; never invent replacement stock or AI imagery.
- Verify all selectors exist, are unique where expected, are visible, and respond correctly.
- The source hero span is max(1, #top.offsetHeight - viewportHeight); its scroll target is progress × span.
- For any other element, derive the scroll position from its actual bounding rectangle plus window.scrollY, minus #nav's measured height and 24 CSS px. Clamp to the document's valid scroll range. Record separate positions per viewport.
- Do not hard-code guessed page Y positions. The file path and selectors are fixed; dimensions must come from the running page.
- For action shots set recorder from and to to the same measured start Y, allowing actual anchor navigation and browser focus scrolling to occur. Do not fight a clicked anchor with a scripted scroll.
- When the toolkit only accepts IDs in scroll specifications, compute complex-selector positions first and pass numeric Y values.

Capture takes:
A. Hero identity and signature move: fresh load at y=0; wait for intro; record initial identity plus progress 0.15→0.90 and a 1-second endpoint handle.
B. Mobile hire route: fresh hero, #burger then #mobileMenu a[href="#hire"]; record enough post-navigation/count-up handle to obtain settled prices.
C. Hire proof: both viewports, final Single hire and Black tie values; hold and pan source regions independently.
D. Suits: source section copy, Navy Two-Piece card, genuine desktop hover.
E. Spotlight→fittings: stable toggle region; Pause, Play, How a fitting works; capture the real destination and final timeline/stat states.
F. Black tie→visit: actual featured card link, navigation, blank form, and empty submit.
G. Corrected form: continue the same blank-submit take's state where possible; type values, select Black tie, valid submit, and record at least five seconds of #formOk afterward. Use two viewport-specific takes if needed.

Each take should include 0.5–1 second of handles beyond its used range. Recording time need not equal edit time. You may remove travel/idle time, but retain a clear action, its immediate response, and settled proof. Do not accelerate typing or clicks into unreadable streaks. Longer typing takes may be cut on the beat between real intermediate and final states.

Cursor/tap placement:
- Log each action frame, selector, current CSS bounding rect, scrollY, viewport, and capture dimensions.
- Scroll the target into view and settle BEFORE the logged click. Re-probe after scroll/animation; the toolkit's pre-action rectangle must not describe an off-screen target that Playwright later auto-scrolls.
- Check elementFromPoint at the target's visible center. A force:true helper is not permission to click an obscured or nonexistent element.
- Put cursor and tap ring in the same transformed footage layer, so they follow every crop, scale, and pan.
- For a simple crop, outputX = stageX + (targetCssX - cropCssX) × scale and similarly for Y. If footage pixels are at DPR 3, convert CSS coordinates to encoded pixel coordinates first, exactly once.
- For perspective, either use the same parent transform on footage and overlay or apply its actual transform matrix. Never eyeball landing coordinates.
- Ring diameter 44–60 output px, 3–4 px cobalt stroke, center on the real target, 10–14 frame expansion/fade. Cursor 32–40 px. Keep the entire important target and ring within the safe stage.
- An action's visual cue occurs at the action frame; settle the camera before it and retain at least 0.25 seconds afterward.
- For a field too tall or far away, make a new real recorded crop. Never connect an unrelated tap to a later response.

Keep recordings and logs local. Do not touch the source website to make an interaction more convenient.

## 7. Remotion assembly and sound

Create two explicit compositions, MarlowickTikTok32 and MarlowickFacebook32, sharing the 1,920-frame timing map but using independent source selections, rectangles, crops, and type layouts. Reuse the toolkit only for technical components, not its placeholder story.

Drive all editorial motion from frame-based deterministic values. Recorded source animation lives in the captured media; do not rely on browser timers, random values, or live webpage interaction during final rendering. Define every scene and transition in one timing map; keep all overlaps within the listed frame ranges.

Use local media and local fonts. Keep source UI sharp; avoid fake depth-of-field over text. Provide a diagnostic mode with safe-area guides and target centers, disabled in final exports. Render rest states and transitions from both compositions before the full render.

Mix with _toolkit/mix.py or an equivalent reproducible local ffmpeg chain:
- Music first, low-level SFX second; no voiceover and no subtitles.
- Do not blindly sum stems onto the full mix, which doubles content and can introduce phase issues. Use the toolkit's verified reconstruction path if using stems, or automate the full mix gently.
- Target about -14 LUFS integrated. Measure true peak on the final AAC-encoded MP4, not only the pre-encode WAV, and keep it below -1 dBTP.
- The toolkit notes AAC overshoot; start with extra mix headroom, then measure and adjust. A sample-peak ceiling is not a true-peak guarantee.
- Keep fades inside 32 seconds. Listen on headphones and a phone speaker; inspect on mute as well.
- Use only the user's authorized music access. Preserve track IDs/download provenance locally. This task does not authorize posting.

## 8. Delivery gate

Before calling the edit complete:
- [ ] Both files have 1,920 video frames at 60 fps and the exact requested dimensions; each plays from beginning to end.
- [ ] The opening question reads by frame 12; the $95 price proof is fully legible at frame 240.
- [ ] Every scene has meaningful footage/camera motion; the ending lasts exactly three seconds and remains readable.
- [ ] All critical content stays in the specified safe area in both cuts, including during transitions and pushes.
- [ ] Key UI labels, prices with units, form feedback, CTA, and URL are readable at phone size.
- [ ] Every displayed interaction matches a real recorded action and measured target; nothing is clicked on a noninteractive product card.
- [ ] The complete demo success disclaimer is visible; no email, booking, sale, customer, or performance result is implied.
- [ ] Light backgrounds throughout; no dark interstitials, broken assets, black frames, smeared UI, or external company logos.
- [ ] Correct primary or verified backup audio, natural tempo, audible music, about -14 LUFS, and measured final true peak below -1 dBTP.
- [ ] Facebook is independently framed, with no chopped text or recycled vertical crop.
- [ ] No changes committed to the website or shared toolkit; no publication performed.

Run the toolkit layout checker after configuring its story/rect registration for this project; a blank or unregistered layout is not a pass. Inspect frames immediately before, on, and after each click, the hero expansion, each transition, the success message, and the CTA in both formats. Watch the final exports at normal speed with sound and on mute. Fix concrete defects, re-render affected output, and recheck.

Deliver the two MP4s, the local editable project, and a brief factual note with the selected music/excerpt, measured loudness/peak, dimensions/frame counts, and any remaining limitation. Do not claim higher views or retention without audience data.

## 9. Scorecard — editorial review, not on-screen content

Use these scores as a transparent craft assessment, not an engagement claim. The prior prompt was read in full. The previous 35-second file was inspected for format and sampled visually at 0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, and 33 seconds. Claude's supplied viewing notes supplement those samples. Audio fit is assessed from the prior brief and notes, not a claimed new listening review.

Previous Larkmere prompt / available video evidence:

| Criterion | Score / 10 | Reason |
|---|---:|---|
| Clarity | 7 | Detailed production rules, but abstract AI-making scenes distract from the business benefit. |
| Hook | 4 | A pleasant slogan introduces mood rather than a recognizable customer question. |
| Engagement design | 5 | The supplied notes and sample frames show lengthy low-information stretches and an extended CTA. |
| Motion and animation ideas | 7 | Cohesive masks and editorial depth, weakened in execution by a visibly smeared transition and small UI. |
| Music fit | 7 | The romantic track fits flowers; the prior brief/notes provide limited rhythmic drive for cuts. |
| How the video turned out | 5 | Sampled frames preserve the light brand look, but the tiny form/AI scene and long ending weaken phone viewing; this is a limited sampled assessment. |
| Total | 35 / 60 | Baseline for this brief's subjective craft comparison. |

New Marlowick prompt — pre-render assessment:

| Criterion | Score / 10 | Reason |
|---|---:|---|
| Clarity | 9 | One practical question, named source controls, explicit demo boundaries, and independently specified outputs. |
| Hook | 9 | A plain hire-price question immediately sets up real, early price evidence. |
| Engagement design | 8 | A 32-second proof sequence, varied purposeful crops, and a three-second CTA remove the documented idle sections. |
| Motion and animation ideas | 9 | Genuine hero depth, measured clicks, source-state transitions, and distinct responsive compositions replace the old abstract scene. |
| Music fit | 8 | Verified 120 BPM instrumental and measured preview energy change give a concrete cut map; final listening/mix review remains necessary. |
| How the video turned out | Not yet rendered; target 8 | Claude must score the actual export after inspection; a prompt cannot establish the quality of an unmade video. |

The five currently comparable prompt categories improve from 30/50 to 43/50: (43 - 30) / 30 = 43.3%, exceeding the requested 20% prompt-improvement target on this stated subjective rubric. With an achieved rendered-outcome score of 8, the six-category target would be 51/60 versus 35/60, or 45.7% higher. The full six-category result is pending; do not describe it as already achieved.

After rendering, independently rescore using the actual deliverables. Do not inflate scores to hit a threshold. If the full score is below 42/60 (20% above 35), revise the weakest concrete defect and inspect again. If a genuine limit remains, report it. These percentages describe a subjective review scale, never guaranteed views, retention, or customer conversions.

Reference links for catalogue checks:
- Primary track: https://www.epidemicsound.com/music/tracks/2bf4be37-0d26-4ca1-a767-c80c23597c1d/
- Backup 1: https://www.epidemicsound.com/music/tracks/2d079e22-90c8-43ce-b3b3-e6ae6417b952/
- Backup 2: https://www.epidemicsound.com/music/tracks/9d3065a9-8fb4-46ea-bcdb-d2b04b27d688/
- Catalogue BPM/mood listings: https://www.epidemicsound.com/music/genres/future-funk/
