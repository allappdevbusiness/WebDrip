# Claude vs ChatGPT — 10 s motion graphic

One-page, silent 10 s animation of the "I tried ChatGPT for my edits. Claude crushed it." still.
Two cuts: `TikTok` (1080×1920, middle block ≤ 780 px wide to clear the button column) and `Feed` (1080×1350).

```
npm install
HS=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell | head -1)
npx remotion render src/index.tsx TikTok out/tiktok.mp4 --codec=h264 --crf=16 --browser-executable=$HS
npx remotion render src/index.tsx Feed out/feed.mp4 --codec=h264 --crf=16 --browser-executable=$HS
# silent AAC track for platform compatibility
ffmpeg -i out/tiktok.mp4 -f lavfi -i anullsrc=r=44100:cl=stereo -c:v copy -c:a aac -shortest -movflags +faststart out/final-tiktok.mp4
```

`still.html` is the static image version (render with Playwright at `?fmt=tiktok` or `?fmt=feed`).
Logos: OpenAI and Claude marks from `@lobehub/icons-static-svg`.
