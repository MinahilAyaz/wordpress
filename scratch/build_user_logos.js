const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const STORE_IMAGES = 'nesports-pro-store/assets/images';

async function buildLogos() {
  console.log('Generating ultra high-resolution logos from user uploads...');

  // 1. HEADER LOGO
  const headerInput = 'C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/.user_uploaded/media_1794852411104_f27de6d5.png';
  const headerTrimmed = await sharp(headerInput).trim().toBuffer({ resolveWithObject: true });
  
  // Resize to 2400px width (high retina 4K) using Lanczos3 kernel
  const headerHighRes = await sharp(headerTrimmed.data)
    .resize(2400, null, {
      kernel: sharp.kernel.lanczos3,
      fastShrinkOnLoad: false
    })
    .sharpen({ sigma: 1.0, m1: 0.8, m2: 1.5 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  const headerMeta = await sharp(headerHighRes).metadata();
  console.log('Header high-res dimensions:', headerMeta.width, 'x', headerMeta.height);

  // Save PNGs
  fs.writeFileSync(path.join(STORE_IMAGES, 'logo-1.png'), headerHighRes);
  fs.writeFileSync(path.join(STORE_IMAGES, 'header-logo.png'), headerHighRes);

  // Create SVGs
  const headerB64 = headerHighRes.toString('base64');
  const headerSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${headerMeta.width} ${headerMeta.height}" width="${headerMeta.width}" height="${headerMeta.height}">
  <image href="data:image/png;base64,${headerB64}" width="${headerMeta.width}" height="${headerMeta.height}" preserveAspectRatio="xMidYMid meet" style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" />
</svg>`;

  fs.writeFileSync(path.join(STORE_IMAGES, 'logo-1.svg'), headerSvg, 'utf8');
  fs.writeFileSync(path.join(STORE_IMAGES, 'header-logo.svg'), headerSvg, 'utf8');
  console.log('Saved header logos: logo-1.png, header-logo.png, logo-1.svg, header-logo.svg');


  // 2. FOOTER LOGO
  const footerInput = 'C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/.user_uploaded/media_1794852416552_40c8ab87.png';
  const footerTrimmed = await sharp(footerInput).trim().toBuffer({ resolveWithObject: true });

  const footerUpscaled = await sharp(footerTrimmed.data)
    .resize(1200, 1200, {
      kernel: sharp.kernel.lanczos3,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .sharpen({ sigma: 1.0, m1: 0.8, m2: 1.5 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  // Create the dark-background high-contrast version (Red 'N' + White 'E' + Red/White circular frame)
  const { data, info } = await sharp(footerUpscaled).raw().toBuffer({ resolveWithObject: true });
  const footerDarkBuf = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
    if (a < 20) {
      footerDarkBuf[i] = 0;
      footerDarkBuf[i+1] = 0;
      footerDarkBuf[i+2] = 0;
      footerDarkBuf[i+3] = 0;
      continue;
    }

    // Red: r significantly higher than g and b
    if (r > 120 && (r - g) > 50 && (r - b) > 50) {
      footerDarkBuf[i] = 225;
      footerDarkBuf[i+1] = 29;
      footerDarkBuf[i+2] = 72;
      footerDarkBuf[i+3] = a;
    } else if (r < 100 && g < 100 && b < 100) {
      // Black elements converted to crisp White for the dark footer
      footerDarkBuf[i] = 255;
      footerDarkBuf[i+1] = 255;
      footerDarkBuf[i+2] = 255;
      footerDarkBuf[i+3] = a;
    } else {
      footerDarkBuf[i] = r;
      footerDarkBuf[i+1] = g;
      footerDarkBuf[i+2] = b;
      footerDarkBuf[i+3] = a;
    }
  }

  const footerHighRes = await sharp(footerDarkBuf, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).png({ compressionLevel: 9 }).toBuffer();

  fs.writeFileSync(path.join(STORE_IMAGES, 'footer-logo.png'), footerHighRes);

  const footerB64 = footerHighRes.toString('base64');
  const footerSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1200 1200" width="1200" height="1200">
  <image href="data:image/png;base64,${footerB64}" width="1200" height="1200" preserveAspectRatio="xMidYMid meet" style="image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" />
</svg>`;

  fs.writeFileSync(path.join(STORE_IMAGES, 'footer-logo.svg'), footerSvg, 'utf8');
  console.log('Saved footer logos: footer-logo.png, footer-logo.svg');
}

buildLogos().then(() => console.log('All logos built successfully!'));
