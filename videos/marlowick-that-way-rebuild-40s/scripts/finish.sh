#!/usr/bin/env bash
# Loudness-normalises the Remotion render (two-pass loudnorm, linear gain, -14 LUFS / -1.5 dBTP so the AAC
# stays under -1 dBTP), re-encodes video to limited-range yuv420p and writes the fast-start delivery file.
set -euo pipefail
IN=out/render-raw.mp4
OUT=out/webdrip-marlowick-rebuild-tiktok-40s.mp4
M=$(ffmpeg -hide_banner -i "$IN" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g(){ echo "$M" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
AF="loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000"
ffmpeg -loglevel error -y -i "$IN" -map 0:v:0 -map 0:a:0 \
  -vf "scale=in_range=full:out_range=limited,format=yuv420p" -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:v libx264 -profile:v high -preset slow -crf 16 -r 60 -frames:v 2400 \
  -af "$AF" -c:a aac -b:a 320k -ar 48000 -ac 2 -t 40 -movflags +faststart "$OUT"
ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=pix_fmt,nb_read_frames,duration -of default=nw=1 "$OUT"
