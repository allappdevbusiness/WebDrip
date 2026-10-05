// node analysis/stills.mjs out_dir t1 t2 ... (video seconds) → renders stills + contact sheet
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [out, ...ts] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browserExecutable = fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium_headless_shell')).map((d) => `/opt/pw-browsers/${d}/chrome-linux/headless_shell`).find((p) => fs.existsSync(p));
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public') });
const composition = await selectComposition({ serveUrl, id: 'CarritoRojoSNA', browserExecutable });
const files = [];
for (const t of ts) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(t) * composition.fps));
  const f = path.join(out, `t${Number(t).toFixed(3)}.png`);
  await renderStill({ serveUrl, composition, frame, output: f, browserExecutable, scale: 0.5 });
  files.push(f);
}
execFileSync('python3', [path.join(root, 'analysis/sheet.py'), path.join(out, 'sheet.jpg'), ...files], { stdio: 'inherit' });
