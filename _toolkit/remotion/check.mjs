// WebDrip promo kit — alignment checker. Renders stills at every frame the run's story marks as a resting hold or a
// transition midpoint, for both cuts, logs DOM bounding boxes from the composition and checks them.
// The run's story module (src/story.ts) must export: DURATION, checkFrames() -> [{ f, kind: 'rest'|'transition', act }],
// tiltAt(fmt, f) -> largest 3D rotation in degrees at frame f.
// Usage: node check.mjs [feed|tiktok] [--frames 40,120]   (stills land in /tmp/stills/check, guides drawn on)
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const BROWSER = fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium_headless_shell-')).map((d) => `/opt/pw-browsers/${d}/chrome-linux/headless_shell`)[0];
const OUT = '/tmp/stills/check'; fs.mkdirSync(OUT, { recursive: true });
const args = process.argv.slice(2);
const fmts = args[0] && !args[0].startsWith('--') ? [args[0]] : ['feed', 'tiktok'];
const onlyFrames = args.includes('--frames') ? args[args.indexOf('--frames') + 1].split(',').map(Number) : null;

// compile the story + kit modules for node (they're TypeScript with extensionless imports)
fs.mkdirSync('.check', { recursive: true });
execFileSync('node_modules/.bin/esbuild', ['src/story.ts', '--bundle', '--format=esm', '--platform=node', '--outfile=.check/story.mjs', '--log-level=error']);
execFileSync('node_modules/.bin/esbuild', ['src/kit.ts', '--bundle', '--format=esm', '--platform=node', '--outfile=.check/kit.mjs', '--log-level=error']);
const S = await import(path.resolve('.check/story.mjs'));
const K = await import(path.resolve('.check/kit.mjs'));
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });

const inside = (b, r, tol = 0.5) => b.x >= r.x - tol && b.y >= r.y - tol && b.x + b.w <= r.x + r.w + tol && b.y + b.h <= r.y + r.h + tol;
const inter = (a, b) => a.x < b.x + b.w - 0.5 && b.x < a.x + a.w - 0.5 && a.y < b.y + b.h - 0.5 && b.y < a.y + a.h - 0.5;
const IMPORTANT = ['frame', 'phone', 'tile', 'text', 'logo', 'button', 'subs'];
const DEVICES = ['frame', 'phone', 'tile'];

const report = { pass: true, stills: [] };
for (const fmt of fmts) {
  const id = fmt === 'feed' ? 'Feed' : 'TikTok';
  const props = { fmt, logBoxes: true, showGuides: true };
  const comp = await selectComposition({ serveUrl, id, inputProps: props, browserExecutable: BROWSER });
  let frames = S.checkFrames();
  if (onlyFrames) frames = onlyFrames.map((f) => frames.find((x) => x.f === f) || { f, kind: 'rest', act: '?' });
  const SAFE = K.SAFE[fmt], CAN = { x: 0, y: 0, w: K.CANVAS[fmt].w, h: K.CANVAS[fmt].h };
  for (const fr of frames) {
    let boxes = null;
    const file = `${OUT}/${fmt}-${String(fr.f).padStart(4, '0')}.png`;
    await renderStill({ composition: comp, serveUrl, frame: fr.f, output: file, inputProps: props, browserExecutable: BROWSER,
      onBrowserLog: (log) => { if (log.text.startsWith('BOXES')) boxes = JSON.parse(log.text.slice(5)); } });
    const errs = [];
    if (!boxes) errs.push('no boxes logged');
    else {
      const vis = boxes.filter((b) => b.w > 0 && b.h > 0 && b.op > 0.05);
      const rest = fr.kind === 'rest';
      for (const b of vis) {
        if (!IMPORTANT.includes(b.kind)) continue;
        if (rest && !inside(b, SAFE)) errs.push(`${b.id} outside safe area ${JSON.stringify([b.x, b.y, b.w, b.h])}`);
        if (fr.kind === 'transition' && DEVICES.includes(b.kind) && !inside(b, CAN, 2)) errs.push(`${b.id} cropped by canvas mid-transition`);
        if (fmt === 'tiktok' && rest) for (const u of K.TT_UI) if (inter(b, u)) errs.push(`${b.id} touches TikTok UI ${JSON.stringify(u)}`);
      }
      if (rest) {
        const tol = fmt === 'tiktok' ? 4 : 2;
        const centred = (b, label) => {
          const lm = b.x - SAFE.x, rm = SAFE.x + SAFE.w - (b.x + b.w);
          if (Math.abs(lm - rm) > tol) errs.push(`${label} not centred (L ${lm.toFixed(1)} / R ${rm.toFixed(1)})`);
        };
        for (const b of vis.filter((x) => [...DEVICES, 'logo', 'button'].includes(x.kind) && !x.offset)) centred(b, b.id);
        // deliberately offset pieces (split screens, side-by-side phones) must be centred as one group per scene
        const byScene = {};
        for (const b of vis.filter((x) => x.offset && x.kind !== 'text')) (byScene[b.scene] = byScene[b.scene] || []).push(b);
        for (const b of vis.filter((x) => x.offset && x.kind === 'text')) if (byScene[b.scene]) byScene[b.scene].push(b);
        for (const [sc, bs] of Object.entries(byScene)) {
          const x0 = Math.min(...bs.map((b) => b.x)), x1 = Math.max(...bs.map((b) => b.x + b.w));
          centred({ x: x0, w: x1 - x0 }, `${sc} offset group [${bs.map((b) => b.id).join('+')}]`);
        }
        // device screens: correct aspect and fully covered by their video (no gaps)
        for (const sc of vis.filter((x) => x.kind === 'screen')) {
          const want = sc.src === 'mob' ? K.MOB.w / K.MOB.h : K.DESK.w / K.DESK.h;
          if (Math.abs(sc.w / sc.h - want) / want > 0.005) errs.push(`${sc.id} aspect ${(sc.w / sc.h).toFixed(4)} != ${want.toFixed(4)}`);
          const v = vis.filter((x) => x.kind === 'video' && x.scene === sc.scene && inter(x, sc));
          if (!v.some((x) => x.x <= sc.x + 1 && x.y <= sc.y + 1 && x.x + x.w >= sc.x + sc.w - 1 && x.y + x.h >= sc.y + sc.h - 1)) errs.push(`${sc.id} not filled by its clip`);
        }
        // text never overlaps device frames; subtitles never collide with anything important
        const texts = vis.filter((x) => x.kind === 'text'), devs = vis.filter((x) => DEVICES.includes(x.kind));
        for (const tx of texts) for (const d of devs) if (tx.scene === d.scene && inter(tx, d)) errs.push(`${tx.id} overlaps ${d.id}`);
        for (const sb of vis.filter((x) => x.kind === 'subs')) for (const o of vis.filter((x) => IMPORTANT.includes(x.kind) && x.kind !== 'subs')) if (inter(sb, o)) errs.push(`subs collide with ${o.id}`);
        // flat & square during holds
        const tilt = S.tiltAt(fmt, fr.f);
        if (Math.abs(tilt) > 0.01) errs.push(`tilted during hold (${tilt.toFixed(2)}°)`);
      }
    }
    const ok = errs.length === 0; if (!ok) report.pass = false;
    report.stills.push({ fmt, frame: fr.f, kind: fr.kind, act: fr.act, ok, errs, boxes: boxes ? boxes.length : 0 });
    console.log(`${ok ? 'PASS' : 'FAIL'} ${fmt} f${fr.f} ${fr.kind} ${fr.act}${ok ? '' : ' -> ' + errs.join('; ')}`);
  }
}
fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 1));
console.log(report.pass ? 'ALIGNMENT CHECK PASSED' : 'ALIGNMENT CHECK FAILED');
process.exit(report.pass ? 0 : 1);
