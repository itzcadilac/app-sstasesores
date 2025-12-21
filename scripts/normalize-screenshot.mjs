import sharp from 'sharp';
import fs from 'node:fs';

const srcPath = process.argv[2];
const outPath = process.argv[3] || 'store/graphics/screenshots/01-login.png';

if (!srcPath) {
  console.error('Uso: node scripts/normalize-screenshot.mjs <ruta/captura_origen> [ruta/salida.png]');
  process.exit(1);
}

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function main() {
  await ensureDir('store/graphics/screenshots');
  await sharp(srcPath)
    .resize({ width: 1080, height: 1920, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log('Screenshot normalizada en:', outPath);
}

main().catch((err) => { console.error(err); process.exit(1); });