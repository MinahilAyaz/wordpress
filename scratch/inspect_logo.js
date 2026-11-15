const fs = require('fs');
const svg = fs.readFileSync('footor logo.svg', 'utf8');
const m = svg.match(/base64,([^"]+)/);
if (m) {
    const buf = Buffer.from(m[1], 'base64');
    fs.writeFileSync('scratch/extracted_footer_logo.jpg', buf);
    console.log('Extracted jpeg size:', buf.length);
}
