# Lessons (keep it to the 15–20 most useful)

What worked, what didn't, what to try next. Merge repeats; newest insight wins. The voice and tone rules in the run prompt always beat anything here.

## Story and words
1. Sell one story, not a feature tour: one owner, one customer, one problem, told as problem → stakes → turn → proof → payoff. It reads with the sound off.
2. Every on-screen line is a plain, complete sentence a stranger understands instantly. No slang, puns, riddles or punchy fragments ("Two shops. Ten seconds. One thumb." failed this). Cold-read every beat before rendering.
3. A code-built "before" site (generic, no name: "call for a quote", "online booking: coming soon") shows the problem instantly without touching a real business.
4. A visible device that carries the story (a clock chip ticking 9:04 → 9:06 → 7:58 AM) gives the viewer a reason to keep watching and makes re-hooks feel like plot, not decoration.
5. Next: try a story that starts from the owner's side (their morning, their phone) rather than the customer's, and let the payoff be something the owner sees.

## Edit and craft
6. Never reuse a scene sequence. The toolkit holds building blocks only; acts, pacing and transitions come from each brief.
7. Canvas is light or brand-coloured, never dark. A light dusk lavender reads as "night" without going dark.
8. Real depth = crane (rotateX), orbit (rotateY) and dolly (scale/translate) that settle flat, plus a lift-out of one page element. Keep tilts ≤ 8–10° feed / 6° TikTok and under 0.6 s; start crane rises ≤ 120 px below their rest so nothing is cropped by the canvas mid-move.
9. Holds longer than ~2.5 s need a slow drift (≤ 3% push), a page auto-scroll or a floating element. Run `freezedetect` on the render to find dead stretches.
10. On TikTok, show the desktop as a tall crop at ≥ 0.6× scale (a 800×1040 window at ~1.15× panning from the headline to the cards) and make every hook card big: anything that leaves > 25% empty looks lost.
11. Break titles into balanced phrases; keep story text ≤ 2 lines (TikTok: 62 px at 840 wide is the safe maximum for ~46 characters).

## Music
12. With a vocal song, map its sections first (whisper on the VOCALS stem for words, chroma/MFCC cross-correlation to place the edit on the original), then put the story's turn on a matching lyric and the payoff on the chorus.
13. EditRecording: one required region, `maxResults: 1`, no `forceDuration`. Two regions came back FAILED; `forceDuration` time-stretches. DownloadRecording and DownloadSoundEffect are FORBIDDEN on this plan, so the edit is the only source.
14. Code-made SFX only on real visual moments (about 12 per video), well under the song; master to −14 LUFS.

## Tooling and posting
15. Chromium proxy needs `bypass: '<-loopback>,localhost,127.0.0.1'` or local pages 405.
16. Never `pkill -f` a pattern that also appears in your own command line: it kills the shell running it. Find the PID and kill that.
17. Background chains (`a && cd x && curl … &`) lose the `cd`. Use absolute output paths so audio never lands in the repo.
18. Check brand names against `topics-log.json` and `sites/` as well as the web: older runs live under `sites/<date>-<name>/`.
19. Buffer TikTok "large number of posts… wait 24 hours" is a final error; don't retry in the same run.
