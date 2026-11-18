const fs = require('fs');
const dir = 'nesports-pro-store/assets/images';
const files = fs.readdirSync(dir);

const findMatching = (query) => {
    return files.filter(f => f.toLowerCase().includes(query.toLowerCase()));
};

console.log('Belts:', findMatching('belt').slice(0, 10));
console.log('Straps:', findMatching('strap').slice(0, 10));
console.log('Wraps:', findMatching('wrap').slice(0, 10));
console.log('Bag:', findMatching('bag').slice(0, 10));
console.log('Speed:', findMatching('speed').slice(0, 10));
console.log('DSC:', findMatching('dsc').slice(0, 20));
