const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');

async function inspectFooter() {
  const { data, info } = await sharp('scratch/extracted_footor_logo.jpg')
    .raw()
    .toBuffer({ resolveWithObject: true });
  console.log('Footor logo jpg info:', info);

  // Separate Red channels vs White/Black channels
  // Red: high R, low G, low B
  // White: high R, high G, high B
  // Black: low R, low G, low B
  const redMask = Buffer.alloc(info.width * info.height);
  const whiteMask = Buffer.alloc(info.width * info.height);
  const blackMask = Buffer.alloc(info.width * info.height);

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i], g = data[i+1], b = data[i+2];
    const pIdx = i / info.channels;
    
    // Red condition: r > 120 and r - g > 50 and r - b > 50
    if (r > 120 && (r - g) > 40 && (r - b) > 40) {
      redMask[pIdx] = 0; // black in mask = foreground in potrace
    } else {
      redMask[pIdx] = 255;
    }

    // White condition: r > 180, g > 180, b > 180
    if (r > 180 && g > 180 && b > 180) {
      whiteMask[pIdx] = 0;
    } else {
      whiteMask[pIdx] = 255;
    }

    // Dark/black condition: r < 60 && g < 60 && b < 60
    if (r < 60 && g < 60 && b < 60) {
      blackMask[pIdx] = 0;
    } else {
      blackMask[pIdx] = 255;
    }
  }

  await sharp(redMask, { raw: { width: info.width, height: info.height, channels: 1 } })
    .png().toFile('scratch/footer_mask_red.png');
  await sharp(whiteMask, { raw: { width: info.width, height: info.height, channels: 1 } })
    .png().toFile('scratch/footer_mask_white.png');
  await sharp(blackMask, { raw: { width: info.width, height: info.height, channels: 1 } })
    .png().toFile('scratch/footer_mask_black.png');
  console.log('Generated masks in scratch/');
}

inspectFooter().catch(console.error);
