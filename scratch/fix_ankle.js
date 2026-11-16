const fs = require('fs');
const filePath = 'nesports-pro-store/includes/helpers.php';
let content = fs.readFileSync(filePath, 'utf8');

const oldBlock = `'Ankle-Strap-Cable-pull-5-scaled.jpg',
                        'Ankle-Strap-Cable-pull-scaled.jpg',
                        'Ankle-Strap-Cable-pull-1-scaled.jpg',`;

const newBlock = `'Ankle-Strap-Cable-pull-5-scaled.jpg',
                        'Ankle-Strap-Cable-pull-3-scaled.jpg',
                        'Ankle-Strap-Cable-pull-5-scaled.jpg',`;

content = content.split(oldBlock).join(newBlock);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Replaced all occurrences of Camo Blue ankle straps!');
