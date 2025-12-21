import sharp from 'sharp';
import fs from 'node:fs';

const srcPath = process.argv[2];
if (!srcPath) {
  console.error('Uso: node scripts/prepare-promo-image.mjs <ruta/imagen_origen>');
  process.exit(1);
}

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function toFeatureGraphic(inputPath, outPath) {
  // 1024x500, center-crop (cover)
  await sharp(inputPath)
    .resize({ width: 1024, height: 500, fit: 'cover', position: 'centre' })
    .png()
    .toFile(outPath);
}

async function toPhonePortrait(inputPath, outPath) {
  // 1080x1920 portrait, center-crop (cover)
  await sharp(inputPath)
    .resize({ width: 1080, height: 1920, fit: 'cover', position: 'centre' })
    .png()
    .toFile(outPath);
}

async function main() {
  const outDir = 'store/graphics';
  await ensureDir(outDir);

  const featureOut = `${outDir}/promo_feature_1024x500.png`;
  const phoneOut = `${outDir}/promo_phone_1080x1920.png`;

  await toFeatureGraphic(srcPath, featureOut);
  await toPhonePortrait(srcPath, phoneOut);

  console.log('Generado:');
  console.log(` - ${featureOut}`);
  console.log(` - ${phoneOut}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});