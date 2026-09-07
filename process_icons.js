const sharp = require('sharp');
const inputPath = 'C:/Users/SONY/.gemini/antigravity/brain/c32e4699-7971-4328-8aa4-075b27288892/.user_uploaded/media_1788793096466.jpg';

async function processImage() {
  await sharp(inputPath)
    .resize(192, 192, { fit: 'cover' })
    .jpeg({ quality: 85 })
    .toFile('public/logo.jpg');
    
  // also create icon-192 and icon-512 for pwa
  await sharp(inputPath).resize(192, 192).png().toFile('public/icon-192.png');
  await sharp(inputPath).resize(512, 512).png().toFile('public/icon-512.png');
}

processImage();
