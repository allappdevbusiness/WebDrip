// Remove the previous build's bundles so hashed files don't pile up.
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
rmSync(resolve(site, 'assets'), { recursive: true, force: true });
console.log('cleaned', resolve(site, 'assets'));
