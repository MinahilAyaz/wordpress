const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.resolve('nesports-pro-store/assets/images');

async function installLogos() {
  const headerSvg = fs.readFileSync('scratch/header-logo-trimmed.svg', 'utf8');
  const footerSvg = fs.readFileSync('scratch/footer-logo-trimmed.svg', 'utf8');

  // 1. Write vector SVGs
  fs.writeFileSync(path.join(imgDir, 'logo-1.svg'), headerSvg);
  fs.writeFileSync(path.join(imgDir, 'header-logo.svg'), headerSvg);
  fs.writeFileSync(path.join(imgDir, 'footer-logo.svg'), footerSvg);
  console.log('Saved vector SVGs to assets/images/');

  // 2. Render high-res 2x/3x Retina PNGs
  const headerPng = await sharp(Buffer.from(headerSvg))
    .resize(1600, 574)
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(imgDir, 'logo-1.png'), headerPng);
  fs.writeFileSync(path.join(imgDir, 'header-logo.png'), headerPng);
  console.log('Saved high-res Retina logo-1.png (1600x574)');

  const footerPng = await sharp(Buffer.from(footerSvg))
    .resize(1000, 1000)
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(imgDir, 'footer-logo.png'), footerPng);
  console.log('Saved high-res Retina footer-logo.png (1000x1000)');
}

installLogos().catch(console.error);
