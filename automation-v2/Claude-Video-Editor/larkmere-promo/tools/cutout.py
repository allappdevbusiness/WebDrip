import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
src, out, crop = sys.argv[1], sys.argv[2], (sys.argv[3] if len(sys.argv) > 3 and sys.argv[3] != "-" else None)
largest = len(sys.argv) > 4 and sys.argv[4] == "largest"
im = Image.open(src).convert('RGB')
if crop: x0, y0, x1, y1 = map(int, crop.split(',')); im = im.crop((x0, y0, x1, y1))
a = np.asarray(im).astype(np.float32) / 255.0
# background model: heavy blur of pixels that look like background (low saturation, bright) -> handles gradients
mx, mn = a.max(2), a.min(2); sat = (mx - mn) / (mx + 1e-4); lum = a @ np.array([0.299, 0.587, 0.114])
bgish = (sat < 0.10) & (lum > 0.55)
w = ndi.gaussian_filter(bgish.astype(np.float32), 40) + 1e-4
bg = np.stack([ndi.gaussian_filter(a[..., c] * bgish, 40) / w for c in range(3)], -1)
bg[w < 0.02] = np.median(a[bgish], 0) if bgish.any() else 1.0
d = np.sqrt(((a - bg) ** 2).sum(2))                      # colour distance from local background
dark = np.clip(bg @ np.array([0.299, 0.587, 0.114]) - lum, 0, 1)
score = np.maximum(d * 2.2, sat * 1.6) + dark * 1.5
alpha = np.clip((score - 0.10) / 0.22, 0, 1)
alpha = ndi.median_filter(alpha, 3)
# remove specks: keep components larger than 0.2% of the biggest
lab, n = ndi.label(alpha > 0.5)
if n:
    sizes = ndi.sum(np.ones_like(alpha), lab, range(1, n + 1)); keep = np.isin(lab, 1 + (np.array([np.argmax(sizes)]) if largest else np.where(sizes > sizes.max() * 0.002)[0]))
    keep = ndi.binary_dilation(keep, iterations=3); alpha *= keep
# decontaminate: un-premultiply against background
A = alpha[..., None]
fg = np.where(A > 0.02, (a - (1 - A) * bg) / np.maximum(A, 0.02), a)
rgba = np.concatenate([np.clip(fg, 0, 1), A], -1)
ys, xs = np.where(alpha > 0.03); pad = 8
y0, y1, x0, x1 = max(0, ys.min() - pad), ys.max() + pad, max(0, xs.min() - pad), xs.max() + pad
Image.fromarray((rgba[y0:y1, x0:x1] * 255).astype(np.uint8), 'RGBA').save(out)
print(out, x1 - x0, y1 - y0)
