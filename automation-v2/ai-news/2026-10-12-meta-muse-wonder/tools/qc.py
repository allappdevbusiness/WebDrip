import json, subprocess, sys, re, os
import numpy as np
f = sys.argv[1]; out = sys.argv[2]; os.makedirs(out, exist_ok=True)
pr = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-show_entries', 'stream=codec_name,width,height,r_frame_rate,nb_read_frames,pix_fmt,sample_rate,channels:format=duration,size', '-of', 'json', f], capture_output=True, text=True).stdout)
print('PROBE', json.dumps(pr))
e = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', f, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
summ = e[e.rfind('Summary:'):]
print('LOUDNESS', ' '.join(summ.split()))
fz = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', f, '-vf', 'freezedetect=n=0.002:d=1.2', '-map', '0:v', '-f', 'null', '-'], capture_output=True, text=True).stderr
print('FREEZES', re.findall(r'freeze_(?:start|duration|end): [\d.]+', fz))
# visual change per frame (mean abs diff on 270x480 grey), longest stretch without a noticeable change
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-vf', 'scale=135:240,format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, 240, 135).astype(np.float32)
d = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))
big = np.where(d > 6)[0]  # cuts / big changes
gaps = np.diff(np.concatenate([[0], big, [len(fr) - 1]])) / 30
print('CUTS', len(big), 'max gap between big changes (s)', round(gaps.max(), 2), 'at', round(np.concatenate([[0], big])[np.argmax(gaps)] / 30, 2))
moving = (d > 0.15).mean()
print('frames with motion', round(moving * 100, 1), '%; stillest 1s windows:', sorted([(round(d[i:i+30].mean(), 3), round(i / 30, 1)) for i in range(0, len(d) - 30, 15)])[:5])
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f, '-vf', 'fps=2,scale=360:640', f'{out}/f%03d.jpg'])
