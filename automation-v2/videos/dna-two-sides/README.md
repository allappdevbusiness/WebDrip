# One Technology. Two Lives. — DNA, Timothy Spencer and David Vasquez

A 75-second vertical (1080 × 1920, 30 fps) true-crime short. Higgsfield generated the cinematic and motion-design
shots; Remotion re-times them frame by frame onto the voiceover and adds every label, caption, line and stamp.
The mix uses two Epidemic tracks and 19 Epidemic effects.

Media (footage frames, keyframes, voice, music, effects, renders) stays out of git. This folder holds the edit
source, the sound map and the generation log, so the video can be rebuilt from the Higgsfield job IDs.

## Higgsfield credit plan (hard cap 50)

Prices were checked with `get_cost` before any generation. The ledger then charged Seedance 1.5 Pro (720p, 4 s,
no generated audio) **2.4** credits per clip, not the 4.8 quoted, so the plan grew to six extra motion shots.

| Item | Model | Unit | Qty | Credits |
| --- | --- | --- | --- | --- |
| Keyframes (start/end frames, 4-folder still) | Seedream 5.0 Flash 1k | 0.5 | 9 | 4.5 |
| Cinematic shots: map dive, street, prison corridor, corridor push, door to daylight | Seedance 1.5 Pro 720p 4 s | 2.4 | 5 | 12.0 |
| Motion-design shots: files, timeline, board, fingerprint, DNA → court, DNA film, courthouse doors, 4 folders | Seedance 1.5 Pro | 2.4 | 8 | 19.2 |
| Transition shots: paper → prison, final split | Seedance 1.5 Pro | 2.4 | 2 | 4.8 |
| **Used** (balance 242.47 → 204.37) | | | | **38.1** |
| Regeneration reserve (unused) | | | | 11.9 |

No shot needed a regeneration.

## Shots

| Clip | Job | Used for |
| --- | --- | --- |
| v1 | fe9ee647 (start 3219d2da map, end 2265f690 street) | USA → Virginia → Richmond → street, one move |
| v13 | 9215d791 | wet 1987 street push |
| v2 | 4abe8a08 (start fcbeca7d desk) | four folders land, red strings |
| v3 | 75d5fa6e | flight through floating dates/evidence |
| v4 | 49088aed | evidence board fills; Remotion freezes it, cuts the empty "?" slot |
| v5 | 03bb948f (48affb40 → f5d67c97) | fingerprint ridges crumble → sketch lines → evidence slide |
| v6 | e3a108f7 (f5d67c97 → cff79ff6) | sample → columns → courthouse hallway |
| v15 | 3f9476c2 | autoradiograph film behind the Remotion band lanes |
| v14 | 9a79e7f6 | courthouse hallway, doors open |
| v11 | 21a91a35 (2d7bd6f7 still) | four folders align (pull-back half only) |
| v7 | 235e3293 (d4272055 → e2958bbd) | camera passes through the file into the prison corridor |
| v12 | 204741f8 | corridor push (Vasquez) |
| v16 | fff7ed09 | far door opens to daylight (pardon) |
| v8 | 7e6cd596 | one line splits → courtroom door / prison door |

Each clip is exported as 24 fps JPGs (`public/f/<clip>/NNN.jpg`, lanczos 1080 × 1920) so `Video.tsx` can
speed-ramp it with a piecewise time map. One example is the desk shot, where each folder landing is pinned to
"One case / another / another / a fourth".

## Sound map (video seconds, from `timeline.ts` + whisper word times)

| Moment | Sound |
| --- | --- |
| 0.0 map dive | deep sub boom, fast whoosh peaking at 1.45 s, city ambience from 2.2 s, low hit on "1987" |
| 6.55 / 7.39 / 8.11 / 8.87 files | paper slam, slam, faster drop, strongest drop + low hit; riser peaking at 10.7 s |
| 10.95–12.45 dates | clock bed + one mechanical tick per month; low hit on "same pattern" |
| 15.75–17.51 board | pin clicks per city, shutter on "detectives"; **music hard-stops at 20.4 s**, single low hit for "?" |
| 22.6 fingerprint | low mechanical drone, reverse suction cut at 25.75 s, then near-silence |
| 26.88 "It was DNA." | one dark cinematic hit (peak on the word); tight digital click on "matched" (30.0 s) |
| 32.25 court | low sub whoosh |
| 41.4–44.1 four names | four restrained low impacts (−17 dB); deep boom on "4" |
| 47.0 pattern interrupt | low whoosh; Hidden Enigma ends; paper-pass whoosh; prison room tone + fluorescent hum; Fugacious piano from 49.4 s |
| 54.2 / 57.3 / 59.1 / 61.3 | file drop, metal door slam on "35", shutter on "served four", stamp on "case reopened" |
| 65.2 "pardoned" | real prison lock: its final clunk lands on the word |
| 67.9 / 69.4 / 72.5 | riser into CONVICT impact, EXONERATE impact, low final resolve hit |

Music: *Hidden Enigma* (Dream Cave) 10.0–30.4 s → 0–20.4 s, a thin −7 dB return under the fingerprint, then from
40.0 s after the DNA hit until 47.0 s; *Fugacious* (Gavin Luke) from 9.8 s at 49.4 s. `mix.py` ducks the bed −10 dB
under speech and masters to −14 LUFS.

## Facts on screen

- Spencer's Arlington trial (Susan Tucker) opened July 1988; it was the first Virginia case where DNA was used to prove
  identity. He was convicted of four murders: Debbie Dudley Davis, Susan Hellams, Diane Cho and Susan Tucker (1987).
- David Vasquez entered an Alford plea for the 1984 Arlington murder of Carolyn Hamm and was sentenced to 35 years. He
  served about four (the Innocence Project's figure) and was pardoned by Governor Baliles on 4 January 1989 after
  investigators tied that murder to Spencer.

## Rebuild

1. Download each job's result and export frames (see above). Keyframes: `public/img/k4.jpg` (four folders still).
2. Voice: `python3 _toolkit/vo.py gen|align|captions audio/vo.json` (Kokoro `af_heart`, whisper base.en).
3. Audio: `python3 audio/prep.py && python3 _toolkit/mix.py <mixwork>/mix.json` → `public/mix.wav`.
4. `npx remotion render src/index.ts TikTok out.mp4 --codec=h264 --crf=17` (fonts in `public/fonts/`).
