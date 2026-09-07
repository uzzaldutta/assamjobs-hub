const sharp = require('sharp');
const inputPath = 'C:/Users/SONY/.gemini/antigravity/brain/c32e4699-7971-4328-8aa4-075b27288892/.user_uploaded/media_1788793096466.jpg';

async function processImage() {
  try {
    // 1. Crop to remove the bottom circles (approx bottom 300px)
    // Left: 0, Top: 0, Width: 1024, Height: 720 (to keep "ASSAMJOBS HUB" but cut "ONE PLATFORM..." and icons)
    const croppedBuffer = await sharp(inputPath)
      .extract({ left: 0, top: 0, width: 1024, height: 710 })
      .toBuffer();

    // 2. Trim excess white space
    const trimmedBuffer = await sharp(croppedBuffer)
      .trim({ threshold: 240, background: '#ffffff' })
      .toBuffer();

    // 3. Save as optimized PNG for logo (Height 160 is plenty for retina h-20 (80px))
    await sharp(trimmedBuffer)
      .resize({ height: 160, withoutEnlargement: true })
      .png({ quality: 85, compressionLevel: 9 })
      .toFile('public/logo.png');

    await sharp(trimmedBuffer)
      .resize({ height: 160, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile('public/logo.webp');

    // 4. Create App Icons (Square, padded with white if necessary)
    await sharp(trimmedBuffer)
      .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile('public/icon-192.png');

    await sharp(trimmedBuffer)
      .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile('public/icon-512.png');
      
    // Create Apple Touch Icon (JPEG is fine)
    await sharp(trimmedBuffer)
      .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .jpeg({ quality: 90 })
      .toFile('public/logo.jpg');

    console.log('Images intelligently cropped, trimmed, optimized, and saved.');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();
