// node tools/stills.mjs <outDir> <frame,frame,...>  — bundles once, renders PNG stills for review
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const [out, list] = process.argv.slice(2);
const frames = list.split(',').map(Number);
fs.mkdirSync(out, { recursive: true });
const browserExecutable = process.env.REMOTION_BROWSER || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const composition = await selectComposition({ serveUrl, id: 'Larkmere', browserExecutable });
for (const frame of frames) {
  await renderStill({ serveUrl, composition, frame, output: path.join(out, `f${String(frame).padStart(3, '0')}.png`), browserExecutable, chromiumOptions: { gl: 'swangle' } });
  process.stdout.write(frame + ' ');
}
console.log('done');
