#!/usr/bin/env bash
# Mix, render and mux the final 30.000 s / 900-frame vertical promo.
# usage: tools/render.sh <music_dir> <sfx_dir> <out.mp4> [hook_clip.mp4 hook_in_seconds [focus_x_percent]]
#   music_dir: full.wav + instrumental.wav (Epidemic Sound "Rose In The Garden", Cody Francis, via the Epidemic connector)
#   sfx_dir:   paper-fold.wav, paper-scrunch.wav, ui-touch.wav (Epidemic Sound SFX, ids in README)
#   hook clip: an authorised Great Gatsby (2013) clip; its own audio plays under the 2.53 s hook.
set -euo pipefail
cd "$(dirname "$0")/.."
MUSIC=$1; SFX=$2; OUT=$3; HOOK=${4:-}; HOOK_IN=${5:-0}; FOCUS=${6:-50}
WORK=$(mktemp -d)
BROWSER=${REMOTION_BROWSER:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}
PY=${PYTHON:-python3}
PROPS='{}'
if [ -n "$HOOK" ]; then
  mkdir -p public/hook && cp "$HOOK" public/hook/gatsby.mp4
  # re-time the clip to 30 fps so trimBefore counts in this composition's frames
  ffmpeg -v error -y -i public/hook/gatsby.mp4 -r 30 -c:v libx264 -crf 14 -pix_fmt yuv420p -c:a aac public/hook/gatsby30.mp4
  PROPS=$(printf '{"hookSrc":"hook/gatsby30.mp4","hookIn":%d,"hookFocusX":%s}' "$(python3 -c "print(round($HOOK_IN*30))")" "$FOCUS")
  "$PY" tools/mix.py "$MUSIC" "$SFX" "$WORK/mix.wav" "$HOOK" "$HOOK_IN"
else
  "$PY" tools/mix.py "$MUSIC" "$SFX" "$WORK/mix.wav"
fi
npx remotion render src/index.ts Larkmere "$WORK/picture.mp4" --browser-executable="$BROWSER" --concurrency=4 --crf=15 --muted --gl=swangle --props="$PROPS" --log=error
ffmpeg -v error -y -i "$WORK/picture.mp4" -i "$WORK/mix.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 -t 30 -movflags +faststart "$OUT"
ffprobe -v error -select_streams v -count_frames -show_entries stream=nb_read_frames -of csv=p=0 "$OUT" | xargs -I{} echo "video frames: {} (expect 900)"
rm -rf "$WORK"
