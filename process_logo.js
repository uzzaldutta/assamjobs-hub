const sharp = require('sharp');
const fs = require('fs');

const inputPath = 'C:/Users/SONY/.gemini/antigravity/brain/c32e4699-7971-4328-8aa4-075b27288892/.user_uploaded/media_1788793096466.jpg';
const outputPath = 'public/logo.png';
const outputPathWebp = 'public/logo.webp';

async function processImage() {
  try {
    // Resize to max 800px width/height for web usage
    // We'll output a PNG for drop-in replacement of logo.png
    await sharp(inputPath)
      .resize(800, 800, { fit: 'inside' })
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(outputPath);
      
    await sharp(inputPath)
      .resize(800, 800, { fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(outputPathWebp);

    console.log('Image successfully optimized and saved.');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();
