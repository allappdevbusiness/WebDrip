# Vertical Plan Preview

- Source: `/home/user/WebDrip/meme-15k-edit/cac/final/shorts/short-001-horizontal.mp4`
- Source media: 1920x1080 at 29.970 fps (`30000/1001`)
- Duration: 55.155s
- Output: 608x1080 (`9:16`)
- Strategy: `SCENE_CROP`
- Formal render allowed: `true`
- Formal render source: `/home/user/WebDrip/meme-15k-edit/cac/final/final-video.mp4`
- Formal render generations after the bound source: `1`

## Strategy Duration

- `STATIC_CROP`: 0.000s (0.00%)
- `SCENE_CROP`: 44.246s (80.22%)
- `LETTERBOX`: 10.909s (19.78%)
- `REVIEW_REQUIRED`: 0.000s (0.00%)

## Segments

1. `0.000` - `2.002` `LETTERBOX` `MULTI_SUBJECT`  
   Reason: Both hosts in frame; one 9:16 crop would cut a face. Remotion stacks two face-centred crops; LETTERBOX stands in because the plan has no stack strategy.
2. `2.002` - `8.909` `SCENE_CROP` `PRESENTER`; crop=(590,0) 608x1080  
   Reason: Greg single; tracked face span x 715-1073 sits inside 590-1198 with >120 px margin.
3. `8.909` - `11.778` `LETTERBOX` `WIDE_INFORMATION`  
   Reason: Founder Instagram profile insert must be shown whole and uncropped.
4. `11.778` - `21.922` `SCENE_CROP` `PRESENTER`; crop=(570,0) 608x1080  
   Reason: Greg single; face span x 713-1036 inside 570-1178.
5. `21.922` - `26.426` `LETTERBOX` `WIDE_INFORMATION`  
   Reason: Meme-page grid insert must be shown whole and uncropped.
6. `26.426` - `44.378` `SCENE_CROP` `PRESENTER`; crop=(565,0) 608x1080  
   Reason: Greg single; face span x 691-1047 inside 565-1173.
7. `44.378` - `45.912` `LETTERBOX` `MULTI_SUBJECT`  
   Reason: Both hosts react; stacked in Remotion so both faces stay whole.
8. `45.912` - `55.155` `SCENE_CROP` `PRESENTER`; crop=(539,0) 608x1080  
   Reason: Greg single; face span x 667-1019 inside 539-1147.

## Visual Evidence

- `1.000s` `work/cache/shorts/short-001-vertical-visual/visual_frames/frame_0002_000001s.jpg` - Two-shot: host left x~555, host right x~1255; both faces must stay whole.
- `5.000s` `work/cache/shorts/short-001-vertical-visual/visual_frames/frame_0006_000005s.jpg` - Greg centred, face x~890; inside crop 590-1198.
- `10.000s` `work/cache/shorts/short-001-vertical-visual/visual_frames/frame_0011_000010s.jpg` - Profile card insert, full frame, needs letterbox.
- `19.000s` `work/cache/shorts/short-001-vertical-visual/visual_frames/frame_0020_000019s.jpg` - Greg raises hand to head; face x~800 stays inside crop 570-1178.
- `23.000s` `work/cache/shorts/short-001-vertical-visual/visual_frames/frame_0024_000023s.jpg` - Meme grid insert, full frame, scrolling.
- `33.000s` `work/cache/shorts/short-001-vertical-visual/visual_frames/frame_0034_000033s.jpg` - Greg grimace, face x~880 inside crop 565-1173.
- `36.000s` `work/cache/shorts/short-001-vertical-visual/visual_frames/frame_0037_000036s.jpg` - Greg leans left, face x~860 inside crop.
- `45.000s` `work/cache/shorts/short-001-vertical-visual/visual_frames/frame_0046_000045s.jpg` - Hosts two-shot reaction; stacked in Remotion.
- `50.000s` `work/cache/shorts/short-001-vertical-visual/visual_frames/frame_0051_000050s.jpg` - Arm extends far right and leaves the crop; face stays whole.
- `54.000s` `work/cache/shorts/short-001-vertical-visual/visual_frames/frame_0055_000054s.jpg` - Greg smiling, face x~840 inside crop 539-1147.

## Warnings

- Two-shot segments are marked LETTERBOX for validation only; the delivered video stacks two face-centred crops in Remotion.
- Final 9:16 render is made by Remotion, not render_vertical.py --mode final (user requirement).

## Validator Warnings

- None.
