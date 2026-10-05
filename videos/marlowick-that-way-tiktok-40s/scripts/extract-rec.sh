#!/usr/bin/env bash
# Rebuilds the per-frame JPEGs Remotion reads (public/rec/<shot>/00000.jpg ...) from the recorded clips.
set -euo pipefail
cd "$(dirname "$0")/../public/rec"
for clip in mob-menu mob-book mob-occasion; do
  rm -rf "$clip"; mkdir -p "$clip"
  ffmpeg -loglevel error -i "$clip.mp4" -q:v 2 -start_number 0 "$clip/%05d.jpg"
  echo "$clip: $(ls "$clip" | wc -l) frames"
done
