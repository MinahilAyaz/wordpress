const sharp = require('sharp');

(async () => {
  const m = await sharp('scratch/user_logo_zoom.png').metadata();
  console.log('User logo zoom dimensions:', m.width, 'x', m.height);
  
  // Let's also check the rendered SVG dimensions in headless / test
  const svgBuffer = require('fs').readFileSync('nesports-pro-store/assets/images/header-logo.svg');
  const rendered = await sharp(svgBuffer).metadata();
  console.log('SVG intrinsic dimensions:', rendered.width, 'x', rendered.height);
})();
