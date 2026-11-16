const sharp = require('sharp');
const fs = require('fs');

(async () => {
  // Render root header_logo.svg at 2000px wide
  const buf = await sharp('header_logo.svg').resize(2000).png().toBuffer();
  fs.writeFileSync('scratch/test_root_2000.png', buf);
  console.log('Rendered test_root_2000.png successfully');
})();
