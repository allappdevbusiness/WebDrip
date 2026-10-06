// Post-build: render every page (from the SSR bundle) and inject the HTML into its
// built file, so the full content is there before JavaScript runs. Then write the
// page files, hashed JS/CSS and local image paths into sw.js for precaching.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const site = resolve(app, '..');
const { pages, precacheUrls } = await import(pathToFileURL(resolve(app, 'node_modules/.wd-ssr/entry-server.js')).href);

const marker = '<div id="root"></div>';
for (const [file, render] of Object.entries(pages)) {
  const htmlPath = resolve(site, file);
  const html = readFileSync(htmlPath, 'utf8');
  if (!html.includes(marker)) throw new Error(`root marker not found in built ${file}`);
  writeFileSync(htmlPath, html.replace(marker, `<div id="root">${render()}</div>`));
  console.log('prerendered', file);
}

const assets = readdirSync(resolve(site, 'assets'))
  .filter((f) => /\.(js|css)$/.test(f) || /-latin-(?!ext)[\w-]*\.woff2$/.test(f))
  .map((f) => './assets/' + f);
const swPath = resolve(site, 'sw.js');
const sw = readFileSync(swPath, 'utf8');
const list = ['./', ...Object.keys(pages).map((f) => './' + f), ...assets, ...precacheUrls];
writeFileSync(swPath, sw.replace(/const PRECACHE = \[[^\]]*\];/, `const PRECACHE = ${JSON.stringify(list, null, 2)};`));
console.log(`wrote ${list.length} precache entries to sw.js`);
