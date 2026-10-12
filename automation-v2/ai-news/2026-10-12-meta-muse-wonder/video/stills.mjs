// usage: node stills.mjs <outdir> <guides 0|1> <sec,sec,...>
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const [outDir, g, list] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public') });
const inputProps = { guides: g === '1', mute: true };
const comp = await selectComposition({ serveUrl, id: 'MuseWonder', inputProps, browserExecutable });
for (const sec of list.split(',').map(Number)) {
  const frame = Math.min(comp.durationInFrames - 1, Math.round(sec * 30));
  await renderStill({ serveUrl, composition: comp, frame, output: `${outDir}/f${String(frame).padStart(4, '0')}.jpg`, imageFormat: 'jpeg', jpegQuality: 80, inputProps, browserExecutable,
    onBrowserLog: (l) => { if (l.type === 'error') console.log('BROWSER', l.text); } });
  console.log('still', sec, frame);
}
