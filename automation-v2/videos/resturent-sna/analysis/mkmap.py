import json, numpy as np
OFF=1.056
r=json.load(open('raw.json')); grid=np.array(r['beats'])
intro_notes=[(1.056,'E','riff1 E (first clean onset)'),(1.863,'E','riff1 E'),(2.133,'G','riff1 G'),(2.511,'E','riff1 E'),(2.850,'D','riff1 D'),(3.152,'C','riff1 C (long)'),(4.107,'B','riff1 B (long)'),
 (5.088,'E','riff2 E'),(5.901,'E','riff2 E'),(6.156,'G','riff2 G'),(6.510,'E','riff2 E'),(6.798,'D','riff2 D'),(7.129,'C','riff2 C (long)'),(8.130,'B','riff2 B (long)')]
# intro beat grid (0.504 s/beat, downbeat 1.100)
intro_beats=[round(1.100+i*0.504,3) for i in range(16)]
beats=intro_beats+[float(x) for x in grid if x<=51.3]
def at(i,f):  # fractional beat in drum grid
    i0=int(np.floor(f)); return float(grid[i+i0]+(grid[i+i0+1]-grid[i+i0])*(f-i0))
pattern=[(0,'E'),(1.5,'E'),(2,'G'),(2.75,'E'),(3.5,'D'),(4,'C'),(6,'B')]
riffs=[]
for c in range(11):
    i=c*8
    if i+7>=len(grid): break
    for f,n in pattern:
        s=at(i,f)
        if s<=51.06: riffs.append((round(s,3),n,f'riff{c+3} {n}'))
notes=intro_notes+riffs
cycles=[round(float(grid[c*8]),3) for c in range(11)]
voc=[v for v in r['voc'] if v<51.06]
sections=[(1.056,'INTRO_RIFF_SOLO','guitar riff alone x2'),(9.125,'DRUMS_IN','crash + kick, riff with full beat'),(16.509,'VOCALS_IN','verse 1 vocal entrance'),(47.264,'RELEASE','distorted guitar swell / build'),(47.729,'PRECHORUS','G chord pre-chorus'),(51.056,'END','video end')]
v=lambda s: round(s-OFF,3)
out=dict(source_file='The_White_Stripes_-_Seven_Nation_Army.mp3',offset_song_s=OFF,duration_s=50.0,
 note='All times in VIDEO seconds (song - offset). Song time = video + offset_song_s.',
 sections=[dict(t=v(s),song=s,id=i,desc=d) for s,i,d in sections],
 beats=[v(b) for b in beats if b>=1.05],
 riffCycles=[v(1.056),v(5.088)]+[v(c) for c in cycles],
 riffNotes=[dict(t=v(s),song=s,note=n,desc=d) for s,n,d in notes],
 vocals=[v(x) for x in voc])
json.dump(out,open('/home/user/WebDrip/automation-v2/videos/resturent-sna/src/beatmap.json','w'),indent=1)
print(json.dumps(out)[:1500])
print(len(out['beats']),len(out['riffNotes']))
