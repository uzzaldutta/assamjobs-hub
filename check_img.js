const sharp = require('sharp');
const inputPath = 'C:/Users/SONY/.gemini/antigravity/brain/c32e4699-7971-4328-8aa4-075b27288892/.user_uploaded/media_1788793096466.jpg';

async function check() {
  const metadata = await sharp(inputPath).metadata();
  console.log('Dimensions:', metadata.width, 'x', metadata.height);
}
check();
