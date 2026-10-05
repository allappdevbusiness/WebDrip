import sys
from PIL import Image, ImageDraw
out, files = sys.argv[1], sys.argv[2:]
W, H = 270, 480
cols = min(6, len(files)); rows = (len(files) + cols - 1) // cols
im = Image.new('RGB', (cols * W, rows * (H + 22)), 'black'); d = ImageDraw.Draw(im)
for i, f in enumerate(files):
    t = Image.open(f).convert('RGB').resize((W, H)); x, y = (i % cols) * W, (i // cols) * (H + 22)
    im.paste(t, (x, y + 22)); d.text((x + 4, y + 4), f.split('/')[-1][1:-4], fill='yellow')
im.save(out, quality=85)
