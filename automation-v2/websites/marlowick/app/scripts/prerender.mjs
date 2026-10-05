// Post-build: render <App /> to HTML (from the SSR bundle) and inject it into
// the built index.html, so the full page is there before JavaScript runs.
// Then write the hashed JS/CSS names and image URLs into sw.js for precaching.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const site = resolve(app, '..');
const { render, precacheUrls } = await import(pathToFileURL(resolve(app, 'node_modules/.wd-ssr/entry-server.js')).href);

const htmlPath = resolve(site, 'index.html');
const html = readFileSync(htmlPath, 'utf8');
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error('root marker not found in built index.html');
writeFileSync(htmlPath, html.replace(marker, `<div id="root">${render()}</div>`));

const assets = readdirSync(resolve(site, 'assets'))
  .filter((f) => /\.(js|css)$/.test(f) || /-latin-(?!ext)[\w-]*\.woff2$/.test(f))
  .map((f) => './assets/' + f);
const swPath = resolve(site, 'sw.js');
const sw = readFileSync(swPath, 'utf8');
const list = ['./', './index.html', ...assets, ...precacheUrls];
writeFileSync(swPath, sw.replace(/const PRECACHE = \[[^\]]*\];/, `const PRECACHE = ${JSON.stringify(list, null, 2)};`));
console.log(`prerendered ${htmlPath} and wrote ${list.length} precache entries`);
