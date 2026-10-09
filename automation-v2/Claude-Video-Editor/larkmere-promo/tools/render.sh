#!/usr/bin/env bash
# Mix, render and mux the final 35.000 s / 1050-frame vertical promo.
# usage: tools/render.sh <music_dir> <sfx_dir> <out.mp4>
#   music_dir: full.wav + instrumental.wav (Epidemic Sound "Rose In The Garden", Cody Francis, via the Epidemic connector)
#   sfx_dir:   paper-fold.wav, paper-scrunch.wav, ui-touch.wav (Epidemic Sound SFX, ids in README)
set -euo pipefail
cd "$(dirname "$0")/.."
MUSIC=$1; SFX=$2; OUT=$3
WORK=$(mktemp -d)
BROWSER=${REMOTION_BROWSER:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}
PY=${PYTHON:-python3}
"$PY" tools/mix.py "$MUSIC" "$SFX" "$WORK/mix.wav"
npx remotion render src/index.ts Larkmere "$WORK/picture.mp4" --browser-executable="$BROWSER" --concurrency=4 --crf=15 --muted --gl=swangle --log=error
ffmpeg -v error -y -i "$WORK/picture.mp4" -i "$WORK/mix.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -ar 48000 -t 35 -movflags +faststart "$OUT"
ffprobe -v error -select_streams v -count_frames -show_entries stream=nb_read_frames -of csv=p=0 "$OUT" | xargs -I{} echo "video frames: {} (expect 1050)"
rm -rf "$WORK"
