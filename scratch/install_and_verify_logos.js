const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.resolve('nesports-pro-store/assets/images');

async function install() {
  const headerSvg = fs.readFileSync('scratch/header-logo-perfect.svg', 'utf8');
  const footerSvg = fs.readFileSync('scratch/footer-logo-perfect.svg', 'utf8');

  // SVGs
  fs.writeFileSync(path.join(imgDir, 'logo-1.svg'), headerSvg);
  fs.writeFileSync(path.join(imgDir, 'header-logo.svg'), headerSvg);
  fs.writeFileSync(path.join(imgDir, 'footer-logo.svg'), footerSvg);
  console.log('Installed vector SVGs in nesports-pro-store/assets/images/');

  // High-res 4x PNGs
  const headerPng = await sharp(Buffer.from(headerSvg))
    .resize(2400, 845)
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(imgDir, 'logo-1.png'), headerPng);
  console.log('Installed 4x high-res logo-1.png (2400x845)');

  const footerPng = await sharp(Buffer.from(footerSvg))
    .resize(1200, 1200)
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(imgDir, 'footer-logo.png'), footerPng);
  console.log('Installed 4x high-res footer-logo.png (1200x1200)');
}

install().catch(console.error);
