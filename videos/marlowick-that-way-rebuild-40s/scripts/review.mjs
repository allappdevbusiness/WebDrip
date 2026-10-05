// Renders review stills at chosen frames (optionally with the private guides composition).
// Usage: node scripts/review.mjs [--guides] 0,30,180,...   -> out/review/f<frame>.png
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
const guides = process.argv.includes('--guides');
const frames = process.argv.filter((a) => /^[\d,]+$/.test(a)).join(',').split(',').filter(Boolean).map(Number);
const id = guides ? 'MarlowickRebuild40Guides' : 'MarlowickRebuild40';
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const composition = await selectComposition({ serveUrl, id, browserExecutable });
fs.mkdirSync('out/review', { recursive: true });
for (const frame of frames) {
  await renderStill({ serveUrl, composition, frame, output: `out/review/${guides ? 'g' : 'f'}${String(frame).padStart(4, '0')}.png`, browserExecutable, imageFormat: 'png' });
  process.stdout.write(frame + ' ');
}
console.log('done');
