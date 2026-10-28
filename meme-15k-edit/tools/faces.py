"""Per-frame YuNet faces with eye landmarks (same model and thresholds as extreme-motion-design track.py --face).

track.py only writes the face box and roll; the eye-flash effect needs the two eye points, which YuNet already returns.
Usage: python tools/faces.py public/footage.mp4 --start 43.0 --end 46.0 -o public/track/eyes_b.json
"""
import argparse, json, os, pathlib
import cv2

ap = argparse.ArgumentParser()
ap.add_argument('video')
ap.add_argument('--start', type=float, default=0)
ap.add_argument('--end', type=float, default=1e9)
ap.add_argument('-o', '--out', required=True)
a = ap.parse_args()

cache = pathlib.Path(os.environ.get('MOTION_DESIGN_CACHE', 'work/cache/motion-design'))
cap = cv2.VideoCapture(a.video)
fps = cap.get(cv2.CAP_PROP_FPS)
w, h = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
det = cv2.FaceDetectorYN.create(str(cache / 'yunet.onnx'), '', (w, h), 0.6, 0.3, 50)
first = round(a.start * fps)
cap.set(cv2.CAP_PROP_POS_FRAMES, first)
frames, f = [], first
while f / fps < a.end:
    ok, im = cap.read()
    if not ok:
        break
    _, faces = det.detect(im)
    out = []
    for r in (faces if faces is not None else []):
        x, y, fw, fh = r[:4]
        out.append({'x': round(float(x + fw / 2), 1), 'y': round(float(y + fh / 2), 1), 'w': round(float(fw), 1), 'h': round(float(fh), 1),
                    # YuNet landmarks: right eye, left eye (image left/right as seen), nose, mouth corners
                    'eyes': [[round(float(r[4]), 1), round(float(r[5]), 1)], [round(float(r[6]), 1), round(float(r[7]), 1)]],
                    'mouth': [round(float((r[10] + r[12]) / 2), 1), round(float((r[11] + r[13]) / 2), 1)],
                    'score': round(float(r[14]), 3)})
    frames.append({'f': f, 'faces': sorted(out, key=lambda o: o['x'])})
    f += 1
json.dump({'fps': fps, 'width': w, 'height': h, 'frames': frames}, open(a.out, 'w'))
print(a.out, len(frames), 'frames')
