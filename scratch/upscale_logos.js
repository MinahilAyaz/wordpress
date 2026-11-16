const sharp = require('sharp');
const fs = require('fs');

async function processHeader() {
  const input = 'C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/.user_uploaded/media_1794852411104_f27de6d5.png';
  
  // 1. Load image and trim any transparent padding
  const trimmed = await sharp(input).trim().toBuffer({ resolveWithObject: true });
  console.log('Trimmed header:', trimmed.info);

  // 2. High-quality upscale with Lanczos3 and slight sharpening for maximum crispness
  const upscaled = await sharp(trimmed.data)
    .resize(2200, null, {
      kernel: sharp.kernel.lanczos3,
      fastShrinkOnLoad: false
    })
    .sharpen({ sigma: 1.2, m1: 1.0, m2: 2.0 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  fs.writeFileSync('scratch/header_logo_highres.png', upscaled);
  console.log('Saved scratch/header_logo_highres.png, size:', upscaled.length);
}

async function processFooter() {
  const input = 'C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/.user_uploaded/media_1794852416552_40c8ab87.png';

  const trimmed = await sharp(input).trim().toBuffer({ resolveWithObject: true });
  console.log('Trimmed footer:', trimmed.info);

  // 1. High-res version of the exact uploaded artwork (1200x1200)
  const upscaled = await sharp(trimmed.data)
    .resize(1200, 1200, {
      kernel: sharp.kernel.lanczos3,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .sharpen({ sigma: 1.2, m1: 1.0, m2: 2.0 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync('scratch/footer_logo_exact_1200.png', upscaled);

  // 2. Create the dark-background optimized version where Black -> White, Red stays Red
  // Let's inspect each pixel in the 1200x1200 buffer
  const { data, info } = await sharp(upscaled).raw().toBuffer({ resolveWithObject: true });
  const darkBgBuffer = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
    if (a < 20) {
      darkBgBuffer[i] = 0;
      darkBgBuffer[i+1] = 0;
      darkBgBuffer[i+2] = 0;
      darkBgBuffer[i+3] = 0;
      continue;
    }

    // Is it red? (r significantly higher than g and b)
    if (r > 120 && (r - g) > 50 && (r - b) > 50) {
      // Red stays red (brand red #e11d48)
      darkBgBuffer[i] = 225;
      darkBgBuffer[i+1] = 29;
      darkBgBuffer[i+2] = 72;
      darkBgBuffer[i+3] = a;
    } else if (r < 100 && g < 100 && b < 100) {
      // Black elements -> White on dark background
      darkBgBuffer[i] = 255;
      darkBgBuffer[i+1] = 255;
      darkBgBuffer[i+2] = 255;
      darkBgBuffer[i+3] = a;
    } else {
      darkBgBuffer[i] = r;
      darkBgBuffer[i+1] = g;
      darkBgBuffer[i+2] = b;
      darkBgBuffer[i+3] = a;
    }
  }

  await sharp(darkBgBuffer, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile('scratch/footer_logo_white_contrast_1200.png');

  console.log('Saved both footer logo variants (exact and dark-optimized)');
}

Promise.all([processHeader(), processFooter()]).then(() => console.log('All processed!'));
