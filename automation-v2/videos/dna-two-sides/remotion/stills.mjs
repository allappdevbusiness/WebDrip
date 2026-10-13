import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'path';
const frames = process.argv.slice(2).map(Number);
const BR = process.env.BR;
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const composition = await selectComposition({ serveUrl, id: 'TikTok', browserExecutable: BR });
for (const f of frames) {
  await renderStill({ serveUrl, composition, frame: f, output: `../stills/f${String(f).padStart(4, '0')}.jpg`, imageFormat: 'jpeg', jpegQuality: 70, browserExecutable: BR, scale: 0.4 });
  process.stdout.write(f + ' ');
}
