const fs = require('fs');
const path = require('path');

const helpersPath = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\includes\\helpers.php';
const content = fs.readFileSync(helpersPath, 'utf8');

// Extract nesports_color_items body
const startIdx = content.indexOf('function nesports_color_items()');
const endIdx = content.indexOf('function nesports_product_profile', startIdx);
const chunk = content.substring(startIdx, endIdx);

console.log('--- ALL COLOR ITEMS AND THEIR SLIDES ---');
const regex = /'name'\s*=>\s*'([^']+)'[\s\S]*?'images'\s*=>\s*array\(([\s\S]*?)\)/g;
let m;
while ((m = regex.exec(chunk)) !== null) {
  const name = m[1];
  const images = m[2].split(',').map(s => s.trim().replace(/'/g, '')).filter(Boolean);
  console.log(`Product: "${name}" => [${images.join(', ')}]`);
}
