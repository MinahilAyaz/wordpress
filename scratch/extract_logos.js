const fs = require('fs');

const content = fs.readFileSync('nesports-pro-store/assets/images/footer-logo.svg', 'utf8');
const m = content.match(/data:image\/png;base64,([^"]+)/);
if (m) {
  fs.writeFileSync('scratch/extracted_footer_logo.png', Buffer.from(m[1], 'base64'));
  console.log('Extracted scratch/extracted_footer_logo.png');
}

const c2 = fs.readFileSync('footor logo.svg', 'utf8');
const m2 = c2.match(/data:image\/jpeg;base64,([^"]+)/);
if (m2) {
  fs.writeFileSync('scratch/extracted_footor_logo.jpg', Buffer.from(m2[1], 'base64'));
  console.log('Extracted scratch/extracted_footor_logo.jpg');
}
