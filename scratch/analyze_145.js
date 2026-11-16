const sharp = require('sharp');

async function analyze145() {
  const { data, info } = await sharp('scratch/extracted_footer_logo.png')
    .raw()
    .toBuffer({ resolveWithObject: true });
  console.log('145x145 info:', info);

  let redMinX = info.width, redMaxX = 0, redMinY = info.height, redMaxY = 0;
  let whiteMinX = info.width, whiteMaxX = 0, whiteMinY = info.height, whiteMaxY = 0;

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
      if (a > 30) {
        if (r > 140 && (r - g) > 50) {
          if (x < redMinX) redMinX = x;
          if (x > redMaxX) redMaxX = x;
          if (y < redMinY) redMinY = y;
          if (y > redMaxY) redMaxY = y;
        } else if (r > 180 && g > 180 && b > 180) {
          if (x < whiteMinX) whiteMinX = x;
          if (x > whiteMaxX) whiteMaxX = x;
          if (y < whiteMinY) whiteMinY = y;
          if (y > whiteMaxY) whiteMaxY = y;
        }
      }
    }
  }

  console.log('Red bounds:', { redMinX, redMaxX, redMinY, redMaxY });
  console.log('White bounds:', { whiteMinX, whiteMaxX, whiteMinY, whiteMaxY });
}

analyze145().catch(console.error);
