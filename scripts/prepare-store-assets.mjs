import sharp from 'sharp';
import fs from 'node:fs';

const logoPath = 'assets/images/logo-foreground.png';
const outDir = 'store/graphics';

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function generateIcon512() {
  const size = 512;
  const margin = 0.75; // logo occupies 75% of canvas
  const resized = await sharp(logoPath)
    .resize(Math.round(size * margin), Math.round(size * margin), { fit: 'contain' })
    .png()
    .toBuffer();

  const canvas = sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  });

  await canvas
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toFile(`${outDir}/icon_512.png`);
}

async function generateFeatureGraphic() {
  const width = 1024;
  const height = 500;
  const logoHeight = Math.round(height * 0.7); // ~70% of height
  const logoWidthBuffer = await sharp(logoPath)
    .resize(logoHeight, logoHeight, { fit: 'contain' })
    .png()
    .toBuffer();

  const canvas = sharp({
    create: { width, height, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
  });

  // Center horizontally and vertically
  const left = Math.round((width - logoHeight) / 2);
  const top = Math.round((height - logoHeight) / 2);

  await canvas
    .composite([{ input: logoWidthBuffer, left, top }])
    .png()
    .toFile(`${outDir}/feature_graphic_1024x500.png`);
}

async function main() {
  await ensureDir(outDir);
  await generateIcon512();
  await generateFeatureGraphic();
  console.log('Generated:');
  console.log(` - ${outDir}/icon_512.png`);
  console.log(` - ${outDir}/feature_graphic_1024x500.png`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});