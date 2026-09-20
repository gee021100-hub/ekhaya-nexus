// Generates the PWA/add-to-homescreen icons from the club crest.
// Run: node scripts/generate-icons.mjs
import sharp from 'sharp';
import { mkdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const crest = await readFile(join(root, 'public/branding/ekhaya-logo.jpg'));
const iconDir = join(root, 'public/icons');
await mkdir(iconDir, { recursive: true });

const gold = '#c9a32d';

// Standard app icons (crest fills the canvas).
await Promise.all([
  sharp(crest).resize(192, 192, { fit: 'cover' }).png().toFile(join(iconDir, 'icon-192.png')),
  sharp(crest).resize(512, 512, { fit: 'cover' }).png().toFile(join(iconDir, 'icon-512.png')),
  sharp(crest).resize(512, 512, { fit: 'cover' }).png().toFile(join(root, 'app/icon.png')),
]);

// Maskable icon: crest on a gold tile, scaled to the safe zone so Android
// masks without clipping the artwork.
const safe = 820;
const offset = Math.round((1024 - safe) / 2);
const inner = await sharp(crest).resize(safe, safe, { fit: 'cover' }).png().toBuffer();
const tile = await sharp({ create: { width: 1024, height: 1024, channels: 4, background: gold } })
  .composite([{ input: inner, top: offset, left: offset }])
  .png()
  .toBuffer();
await sharp(tile).resize(512, 512).png().toFile(join(iconDir, 'icon-maskable-512.png'));

// Apple home-screen icon.
await sharp(crest).resize(180, 180, { fit: 'cover' }).png().toFile(join(root, 'app/apple-icon.png'));

console.log('Icons generated: public/icons/*.png, app/icon.png, app/apple-icon.png');