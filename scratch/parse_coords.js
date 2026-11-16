const fs = require('fs');

const svg = fs.readFileSync('header_logo.svg', 'utf8');
const coords = svg.match(/[-+]?[0-9]*\.?[0-9]+(?:[eE][-+]?[0-9]+)?/g) || [];

// Let's parse numbers from d="..." attributes specifically
const dMatches = svg.match(/d="([^"]+)"/g) || [];
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

for (const d of dMatches) {
  // Extract all numbers
  const nums = d.match(/[-+]?[0-9]*\.?[0-9]+/g).map(Number);
  // Numbers usually come in pairs (x, y)
  for (let i = 0; i < nums.length; i += 2) {
    const x = nums[i];
    const y = nums[i+1];
    if (x !== undefined && !isNaN(x)) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    }
    if (y !== undefined && !isNaN(y)) {
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log(`True Coordinate Range from Path Data:`);
console.log(`X: [${minX}, ${maxX}] (width: ${maxX - minX})`);
console.log(`Y: [${minY}, ${maxY}] (height: ${maxY - minY})`);
console.log(`Aspect ratio: ${(maxX - minX) / (maxY - minY)}`);
