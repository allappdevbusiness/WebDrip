"""Rebuild video/public/ for the Muse Wonder short: Unsplash photos, phone-screen mask/shading, blank flip calendar, fonts.

Usage: python3 -I tools/prep_assets.py <path-to-video-dir>
Needs: Unsplash API access (api.unsplash.com, images.unsplash.com), opencv-python-headless, numpy, and
`npm install` already run in the video dir (fonts come from @fontsource packages).
Writes src/pov_quad.json (screen corners of the hand-held phone photo) as well.
"""
import json, os, shutil, subprocess, sys
import cv2
import numpy as np

V = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.join(V, 'public'); IMG = os.path.join(PUB, 'img'); os.makedirs(IMG, exist_ok=True)
photos = json.load(open(os.path.join(HERE, '..', 'config', 'photos.json')))
WIDTH = {'pov_phone': 2400, 'meta_sign': 3200}

def curl(url, out):
    subprocess.run(['curl', '-sS', '--fail', '-m', '60', '-o', out, url], check=True)

for name, p in photos.items():
    meta = json.loads(subprocess.run(['curl', '-sS', '--fail', f"https://api.unsplash.com/photos/{p['id']}"], capture_output=True, text=True, check=True).stdout)
    curl(meta['urls']['raw'] + f"&w={WIDTH.get(name, 2000)}&q=85&fm=jpg", os.path.join(IMG, name + '.jpg'))
    subprocess.run(['curl', '-sS', '-o', os.devnull, meta['links']['download_location']])  # Unsplash API guideline
    print('photo', name, p['photographer'])

# hand-held phone: find the white screen, fit its four straight edges, export quad + mask + shading
im = cv2.imread(os.path.join(IMG, 'pov_phone.jpg')); h, w = im.shape[:2]
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
_, th = cv2.threshold(g, 200, 255, cv2.THRESH_BINARY)
n, lab, st, _ = cv2.connectedComponentsWithStats(th)
mask = ((lab == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])) * 255).astype(np.uint8)
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
c = max(cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)[0], key=cv2.contourArea).reshape(-1, 2).astype(float)
x0, y0, x1, y1 = c[:, 0].min(), c[:, 1].min(), c[:, 0].max(), c[:, 1].max(); H, W = y1 - y0, x1 - x0
def fit(sel, vertical):
    p = c[sel]
    return ('v',) + tuple(np.polyfit(p[:, 1], p[:, 0], 1)) if vertical else ('h',) + tuple(np.polyfit(p[:, 0], p[:, 1], 1))
mid = (c[:, 1] > y0 + 0.15 * H) & (c[:, 1] < y1 - 0.15 * H)
L = fit((c[:, 0] < x0 + 25) & mid, True); Rr = fit((c[:, 0] > x1 - 25) & mid, True)
T = fit((c[:, 1] < y0 + 25) & (((c[:, 0] > x0 + 0.12 * W) & (c[:, 0] < x0 + 0.25 * W)) | ((c[:, 0] > x1 - 0.25 * W) & (c[:, 0] < x1 - 0.12 * W))), False)  # skip the notch
B = fit((c[:, 1] > y1 - 25) & (c[:, 0] > x0 + 0.15 * W) & (c[:, 0] < x1 - 0.15 * W), False)
def inter(v, hh):
    _, a, b = v; _, cc, d = hh; y = (cc * b + d) / (1 - cc * a); return [round(a * y + b, 1), round(y, 1)]
q = {'tl': inter(L, T), 'tr': inter(Rr, T), 'br': inter(Rr, B), 'bl': inter(L, B), 'img': [w, h]}
json.dump(q, open(os.path.join(V, 'src', 'pov_quad.json'), 'w')); print('quad', q)
m = cv2.GaussianBlur(mask, (5, 5), 0)
cv2.imwrite(os.path.join(IMG, 'pov_mask.png'), np.dstack([np.full_like(m, 255)] * 3 + [m]))
sh = np.where(mask > 0, np.clip(g / np.percentile(g[mask > 0], 97), 0, 1) * 255, 255).astype(np.uint8)
cv2.imwrite(os.path.join(IMG, 'pov_shade.png'), cv2.merge([sh, sh, sh]))

# flip calendar: paint out the printed "26" so our own pages can flip on the card
im = cv2.imread(os.path.join(IMG, 'calendar_flip.jpg')); g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
mk = np.zeros_like(g); ya, yb, xa, xb = 1460, 1975, 660, 1345
mk[ya:yb, xa:xb] = (g[ya:yb, xa:xb] < 150).astype(np.uint8) * 255
mk = cv2.dilate(mk, np.ones((15, 15), np.uint8))
out = cv2.inpaint(im, mk, 9, cv2.INPAINT_TELEA)
bl = cv2.GaussianBlur(out, (0, 0), 25); mm = cv2.GaussianBlur(mk, (0, 0), 6).astype(float)[..., None] / 255
cv2.imwrite(os.path.join(IMG, 'calendar_blank.jpg'), (out * (1 - mm) + bl * mm).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 92])

# fonts (local woff2: the render browser has no Google Fonts access)
fs = os.path.join(V, 'node_modules', '@fontsource')
for pkg, f in [('inter-tight', f'inter-tight-latin-{wt}-normal.woff2') for wt in (500, 600, 700, 800, 900)] + [
        ('anton', 'anton-latin-400-normal.woff2'), ('jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff2'),
        ('jetbrains-mono', 'jetbrains-mono-latin-700-normal.woff2'), ('caveat', 'caveat-latin-700-normal.woff2')]:
    shutil.copy(os.path.join(fs, pkg, 'files', f), PUB)
print('done')
