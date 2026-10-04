# Creative brief — Bobblefin Swim School (bobblefinswim-demo)

Run date: 2026-10-04 · Business: kids' swim school · Site style: TypeUI "doodle" (cream, pool blue, sun yellow, coral, hand-drawn borders)

## 0. Learning from the last runs

There were no earlier briefs (this is the first run with a `briefs/` folder), so the review is based on topics-log.json, the toolkit README and the Remotion template the last runs shared. Three biggest weaknesses of the last run (Tallowmere Law) and the runs before it:

1. **A feature tour, not a story.** Scenes were labelled "01 · Hero / 02 · Navigation / 03 · Lessons…", so the video read like a product demo. Nothing made an owner feel the cost of a weak site.
2. **The same skeleton every run.** Macro pull-back hook, then a labelled walkthrough, then the end card. Only the colours changed.
3. **A dark canvas** (near-black pine). It was moody, but it went against the light-canvas rule and looked heavier than a small-business brand should.

Research focus this run: **hooks and story-led retention** (see research-notes.md).

## 1. Story angle — "The school-gate scroll"

POV: you're a parent at the school gate at 8:40am, one hand on a scooter and one thumb free. Ten seconds to find swim lessons before the bell. Two tabs. Tab one is a swim school whose site looks like 2009: tiny text, "download timetable (PDF)", a blurry photo. You bail. The twist: *their lessons might actually be great, and nobody will ever find out.* Tab two is Bobblefin. Photos move, prices sit right there, it's just as good on the laptop later, and booking is two boxes. You book before the bell. Payoff: **same town, same lessons, only one got the booking.** That's what a great website does, and that's what WebDrip builds.

It's framed as a "POV / imagine" scenario. The "old site" is a generic mock with no name, logo or real business.

## 2. Hook plan

| t | Hook / re-hook | Device |
|---|---|---|
| 0.0 | "Two swim schools. Ten seconds. One thumb." Split screen opens **mid-action**: two phones already side by side, a timer chip counting 10→0, a thumb dot on the left phone. | Tension + visual proof in frame 1 |
| ~4 | Left phone is a sad grey PDF-timetable site. "yeah, no", and the phone gets swiped off-screen. | Pattern break (the swipe-away) |
| ~7 | "Here's the thing… their lessons might be amazing." | Twist |
| ~10 | "Nobody's ever gonna know." Hard beat of near-silence (music ducks out for ~0.6 s), then "Now this one." The right phone slides to centre and grows. | Silence before the reveal |
| ~14 | Real mobile scroll: photos move, prices right there. | Visual payoff |
| ~19 | The phone shrinks into the corner as a laptop frame glides in behind it ("Lowkey just as gorgeous on a laptop"). | Layout change |
| ~23 | Explode moment: the three class cards lift out of the page in 3D and fan out. | Visual punch |
| ~28 | Spotlight: the underwater thumbs-up kid, bubbles rising. "That first brave little dunk." | Emotion |
| ~32 | Booking: the phone fills the form, the check lands on the beat, a "Booked ✓" stamp. | Payoff |
| ~36 | Split screen returns: the left phone is dim and empty, the right one says booked. "Same town, same lessons. Only one got the booking." | Callback |
| ~39 | Logo lands on the strongest late hit. "Want one like this?" | CTA |

## 3. Edit style

**Split-screen duel → POV phone browse**: a head-to-head comparison that collapses into a single-device POV session, then expands to a phone + laptop duo, then returns to the split for the callback. Kinetic, type-led captions (direct address) carry the story for muted viewers.

## 4. Shot list (45 s, 30 fps; boundaries snap to the track's beats after analysis)

1. **0.0–4.0 Duel open.** Two phones side by side, centred as one group. Left: the code-built "old site" (grey, Times-style text, a PDF link, a 10 s timer chip). Right: Bobblefin's real mobile hero (recorded). Big type above: "Two swim schools." / "One thumb."
2. **4.0–7.0 The bail.** Push in on the left phone: tiny text, the thumb dot hovers over "timetable.pdf", a "yeah, no" chip pops, and the phone swipes off left with a whoosh.
3. **7.0–10.0 The twist.** The left phone slides back dimmed. A big centred line, "Their lessons might be amazing." A beat later: "Nobody will ever know."
4. **10.0–10.6 Silence beat**, then a divider wipe: the right phone slides to centre and scales up (shared-element move).
5. **10.6–19.0 POV browse.** Large centred phone with the real mobile recording: hero, polaroids, class cards with prices. Callout chips: "Photos that move as you scroll", "Prices right there".
6. **19.0–23.0 Laptop duo.** A desktop browser frame (real desktop recording of the hero's 3D scroll) rises behind; the phone overlaps its lower right. Callout: "Just as good on a laptop".
7. **23.0–28.0 Explode.** Desktop classes section; three class cards lift out of the page in 3D layers, fan out, then settle. Callout: "Every class, one tap away".
8. **28.0–32.0 Spotlight.** Split screen: hand-drawn type on one side ("That first brave dunk"), a tall tile of the spotlight section on the other.
9. **32.0–36.0 Booking.** The phone fills the form (recorded), the check lands on a beat, and a "Booked ✓" stamp pops beside it.
10. **36.0–39.0 Callback duel.** Two phones again: left dimmed ("no booking"), right with the booked stamp. "Same town. Same lessons."
11. **39.0–45.0 WebDrip end card.** A rounded mask wipe. Headline "Your swim school / could be the / one they book." with a scribble highlight on "the one they book". Logo on the strongest late hit, button "Book your meeting → getwebdrip.com", follow line. Holds settled ≥3 s while the music fades.

## 5. Look and sound

- **Camera language:** slow push-ins on holds (≤1.03), a crane-style rise for the laptop entrance, a lateral dolly for the swipe-away, and gentle 3D tilts (≤8° feed / ≤5° TikTok, <0.6 s) that always settle flat.
- **Transition family:** *divider wipes and swipes*. A vertical split line slides to hand the frame to the winner, the losing phone swipes off, and phones move as shared elements between shots. No blur crossfades this time.
- **Typography:** Delius Swash Caps (the site's hand-drawn display face) for big lines and callouts in sentence case, with a hand-drawn scribble underline that draws on beneath the key word. JetBrains Mono for small chips (timer, labels). Per-word mask slide-ups on the beat.
- **Color grade:** high-key and sunny. Cream canvas (#FFF9EC) with a faint dot grid, pool-blue glow behind the hero device, sun-yellow accent for highlights and progress. The "old site" is deliberately desaturated grey so the contrast reads instantly.
- **Pacing curve:** fast open (cuts every 2–3 s for the first 10 s), a breath at 10 s (silence beat), a steady glide through 10–28 s, a lift at 28–36 s, then a settle on the end card.
- **Music:** feel-good acoustic / indie-pop instrumental with claps or light drums, 90–110 BPM, a memorable plucky motif and a clear lift. Playful and warm, not club. A different genre from the last three runs (cinematic pop, warm cinematic, indie-electronic).
- **Voice:** af_heart (warm American, a friend calling you out), speed ~1.0, with natural pauses. Delivery: amused on "yeah, no", lowered and slower on "nobody's ever gonna know", brighter from "now this one".
- **Sound design (fewer and tied to real moments):** a whoosh on the swipe-away and each divider wipe, a soft pop on each callout chip, a tick when the timer chip ticks (first 3 s only), a near-silence dip at 10 s, a warm impact when the logo lands, and a tick on the end-card button.

## 6. Better than last time

1. **A story with stakes instead of a feature tour.** Every scene moves the "two tabs, one booking" plot forward; site features appear as reasons the parent books, not as labelled sections. *(Fixes weakness 1.)*
2. **A brand-new structure.** Split-screen duel → POV browse → duo → explode → callback duel, with a divider-wipe transition family and a silence-beat reveal from this run's research. *(Fixes weakness 2; applies the silence-before-reveal takeaway.)*
3. **A light, high-key canvas plus kinetic hand-drawn type as the storyteller**, so the muted viewer gets the whole plot from the type alone. *(Fixes weakness 3; applies the type-carries-the-message takeaway.)*

It's more gripping because the viewer is cast as the parent in frame 1 with a ticking 10-second timer, and it sells better because the ending makes the cost of a weak site concrete (same lessons, no booking) right before the WebDrip CTA.

## 7. Uniqueness check vs the last 10 runs

| Dimension | This run | Last runs |
|---|---|---|
| Story angle | School-gate scroll: two tabs, one booking | Feature tours; "your website is the lobby"; "nervous first-timer tonight"; "read your homepage out loud" |
| Edit style | Split-screen duel → POV browse | Macro pull-back + labelled walkthrough (shared template) |
| Hook type | Mid-action split screen with a 10 s timer | Macro pull-back / question VO |
| Transition family | Divider wipes, swipe-aways, shared-element phone moves | Blur / wipe / push / scale / rise crossfades |
| Typography | Delius Swash Caps hand-drawn + scribble underline | Poppins, Oswald, Outfit sans |
| Color grade | High-key cream + pool blue, desaturated "before" | Dark pine, dark monochrome, glassy dusk |
| Music genre | Acoustic indie-pop with claps | Cinematic pop, warm cinematic, indie-electronic, afro-house, future bass |
| Voice | af_heart (last three: bf_emma, af_heart, af_heart → not three in a row) | — |

Not the same story angle or edit style as any of the last 5, nor the same transition family or music genre as the last 3. **Passed.**
