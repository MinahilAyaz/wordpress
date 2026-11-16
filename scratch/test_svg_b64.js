const sharp = require('sharp');
const fs = require('fs');

const pngB64 = fs.readFileSync('nesports-pro-store/assets/images/logo-1.png').toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 2400 845" width="2400" height="845">
  <image href="data:image/png;base64,${pngB64}" width="2400" height="845" preserveAspectRatio="xMidYMid meet" />
</svg>`;

sharp(Buffer.from(svg))
  .resize(360)
  .png()
  .toFile('scratch/test_retina_svg.png')
  .then(() => {
    console.log('Successfully rendered high-res SVG with embedded 2400px base64!');
    const stat = fs.statSync('scratch/test_retina_svg.png');
    console.log('Output size:', stat.size);
  })
  .catch(err => console.error('Error:', err));
