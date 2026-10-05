#!/usr/bin/env bash
# Converts Remotion's full-range (yuvj420p) H.264 to standard limited-range yuv420p, keeps the AAC track,
# enforces exactly 2400 frames / 40.000 s and writes the fast-start delivery file.
set -euo pipefail
IN=out/render-raw.mp4
OUT=out/webdrip-marlowick-that-way-tiktok-40s.mp4
ffmpeg -loglevel error -y -i "$IN" -map 0:v:0 -map 0:a:0 \
  -vf "scale=in_range=full:out_range=limited,format=yuv420p" -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:v libx264 -profile:v high -preset slow -crf 16 -r 60 -frames:v 2400 \
  -c:a copy -t 40 -movflags +faststart "$OUT"
ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=pix_fmt,nb_read_frames,duration -of default=nw=1 "$OUT"
