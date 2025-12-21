import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const srcDir = 'store/graphics/source';
const outDir = 'store/graphics/screenshots';

async function ensureDir(dir) { await fs.promises.mkdir(dir, { recursive: true }); }

function sanitizeName(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-_.]/g, '').replace(/\.(jpg|jpeg|png)$/i, '');
}

async function normalizeScreenshot(inputPath, outPath) {
  await sharp(inputPath)
    .resize({ width: 1080, height: 1920, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
}

async function main() {
  await ensureDir(outDir);
  const files = (await fs.promises.readdir(srcDir)).filter(f => /\.(png|jpg|jpeg)$/i.test(f)).sort((a,b)=>a.localeCompare(b));
  if (files.length === 0) {
    console.error(`No se encontraron imágenes en ${srcDir}`);
    process.exit(1);
  }
  let index = 1;
  for (const f of files) {
    const base = sanitizeName(f);
    const num = String(index).padStart(2, '0');
    const out = path.join(outDir, `${num}-${base}.png`);
    await normalizeScreenshot(path.join(srcDir, f), out);
    console.log(`Generada: ${out}`);
    index++;
  }
  console.log(`Total generadas: ${index-1}`);
}

main().catch(err => { console.error(err); process.exit(1); });