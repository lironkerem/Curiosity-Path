// bump-version.mjs — updates SW cache version to today's date + HHMM
// Cross-platform replacement for bump-version.bat
// Runs automatically before every build via: node bump-version.mjs

import { readFileSync, writeFileSync, existsSync } from 'fs';

const now    = new Date();
const pad    = n => String(n).padStart(2, '0');
const date   = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
const time   = `${pad(now.getHours())}${pad(now.getMinutes())}`;
const version = `tcp-${date}-${time}`;

const swPath = 'public/service-worker.js';

if (!existsSync(swPath)) {
    console.warn('[BUMP] WARNING: public/service-worker.js not found');
    process.exit(0);
}

const content    = readFileSync(swPath, 'utf8');
const updated    = content.replace(/tcp-[\d-]+/g, version);
writeFileSync(swPath, updated, 'utf8');

console.log(`[BUMP] ✓ Updated public/service-worker.js to: ${version}`);