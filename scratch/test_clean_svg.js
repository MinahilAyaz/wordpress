const sharp = require('sharp');
const fs = require('fs');

(async () => {
  let svg = fs.readFileSync('header_logo.svg', 'utf8');
  // Remove width and height attributes, keeping only viewBox
  svg = svg.replace(/\s+width="[^"]+"/, '').replace(/\s+height="[^"]+"/, '');
  
  const png = await sharp(Buffer.from(svg)).resize(2750, 990).png().toBuffer({ resolveWithObject: true });
  const { data, info } = png;
  
  let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const a = data[(y * info.width + x) * 4 + 3];
      if (a > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  console.log(`Rendered without width/height bounds: x [${minX}, ${maxX}] (${maxX - minX}px), y [${minY}, ${maxY}] (${maxY - minY}px)`);
  const contentW = maxX - minX;
  const contentH = maxY - minY;
  console.log('Content width:', contentW, 'height:', contentH, 'aspect:', contentW / contentH);
})();
