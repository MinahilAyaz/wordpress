const fs = require('fs');
const files = fs.readdirSync('nesports-pro-store/assets/images');
const cats = {
  belts: ['belt', '0167', 'dip-belt'],
  straps: ['strap', '1-800x800', 'a2', '2-red'],
  knee: ['knee'],
  elbow: ['elbow'],
  wrist: ['wrist'],
  bag: ['bag'],
  speed: ['speed'],
  ankle: ['ankle'],
  pad: ['pad', 'baerbell']
};

for (const [cat, kws] of Object.entries(cats)) {
  const matches = files.filter(f => kws.some(kw => f.toLowerCase().includes(kw)));
  console.log(`=== ${cat} (${matches.length}) ===`);
  matches.forEach(m => console.log('  ', m));
}
