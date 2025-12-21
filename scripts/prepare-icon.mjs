import sharp from 'sharp';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const src = new URL('../assets/images/logo.png', import.meta.url);
  const out = new URL('../assets/images/logo-foreground.png', import.meta.url);

  // Target canvas 1024x1024 with transparent background
  const size = 1024;

  // Load source and get metadata
  const input = sharp(fileURLToPath(src));
  const meta = await input.metadata();

  // Compute scale to fit within safe area (~80% of canvas)
  const safe = Math.floor(size * 0.8);
  const srcW = meta.width || safe;
  const srcH = meta.height || safe;
  const scale = Math.min(safe / srcW, safe / srcH);
  const targetW = Math.max(1, Math.floor(srcW * scale));
  const targetH = Math.max(1, Math.floor(srcH * scale));

  const resized = await input
    .resize(targetW, targetH, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  // Create transparent canvas and composite center
  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toFile(fileURLToPath(out));

  console.log('Generated:', fileURLToPath(out));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
