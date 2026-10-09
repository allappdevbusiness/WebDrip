#!/usr/bin/env bash
# Rebuild every visual asset in public/ from scratch (photos, stem cutouts, site recordings, card snaps, fonts).
# Music + SFX are not fetched here: they come from the Epidemic Sound connector (see README).
# needs: node deps installed (npm i), python3 with numpy scipy pillow, ffmpeg, Playwright's Chromium.
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT=$(git rev-parse --show-toplevel)
PY=${PYTHON:-python3}
WORK=${WORK:-$(mktemp -d)}
mkdir -p public/photos public/cut public/snaps public/rec public/fonts "$WORK/raw" "$WORK/rec"

# 1. fonts: the site's own faces (Abril Fatface, Inter, JetBrains Mono), latin subset
"$PY" - <<'PYEOF'
import re, urllib.request
ua = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'}
css = urllib.request.urlopen(urllib.request.Request('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Inter:wght@400;800&family=JetBrains+Mono:wght@500;700&display=swap', headers=ua)).read().decode()
names = {'Abril Fatface': 'AbrilFatface-400.woff2', 'Inter': 'Inter-var.woff2', 'JetBrains Mono': 'JetBrainsMono-var.woff2'}
for sub, block in re.findall(r'/\* (\S+) \*/\s*@font-face \{([^}]*)\}', css):
    if sub != 'latin': continue
    fam = re.search(r"font-family: '([^']+)'", block).group(1)
    urllib.request.urlretrieve(re.search(r'url\((https://[^)]+\.woff2)\)', block).group(1), 'public/fonts/' + names[fam])
PYEOF

# 2. photos (Unsplash; credits in photo-credits.json)
"$PY" - "$WORK/raw" <<'PYEOF'
import json, sys, urllib.request
A = json.load(open('tools/assets.json'))
for name, p in A['photos'].items():
    urllib.request.urlretrieve(f"{p['url']}&{p['size']}&q=85&fm=jpg", f"{sys.argv[1]}/{name}.jpg")
PYEOF
for f in "$WORK"/raw/site-*.jpg "$WORK"/raw/macro-*.jpg; do cp "$f" public/photos/; done

# 3. real-stem cutouts (colour-distance matte + un-premultiply, see tools/cutout.py)
"$PY" - "$WORK/raw" <<'PYEOF'
import json, subprocess, sys
for src, out, crop, largest in json.load(open('tools/assets.json'))['cutouts']:
    args = [sys.executable, '-I', 'tools/cutout.py', f'{sys.argv[1]}/{src}.jpg', f'public/cut/{out}.png', crop or '-'] + (['largest'] if largest else [])
    subprocess.run(args, check=True)
PYEOF

# 4. the real site: serve the repo, record the shots, take card snaps
( cd "$ROOT" && python3 -m http.server 8080 --bind 127.0.0.1 >/dev/null 2>&1 ) & SRV=$!
trap 'kill $SRV 2>/dev/null || true' EXIT
sleep 1
for plan in rec-plan.json rec-plan-hero2.json; do
  sed "s|REC_OUT|$WORK/rec|" tools/$plan > "$WORK/$plan"
  NODE_PATH=$PWD/node_modules node "$ROOT/_toolkit/rec.js" "$WORK/$plan"
done
cp "$WORK"/rec/{m-hero2,m-field,m-wsorder,d-hero}.mp4 public/rec/
mkdir -p "$WORK/snaps" && NODE_PATH=$PWD/node_modules node tools/snap.js "$WORK/snaps"
cp "$WORK"/snaps/m-card-{posy,love,wild}.png "$WORK"/snaps/m-wed-card3.png public/snaps/
echo "assets ready in public/"
