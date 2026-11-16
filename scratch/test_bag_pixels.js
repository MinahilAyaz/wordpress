const fs = require('fs');

// Let's inspect the files
const checkBags = [
    'Gym-Bag-1-2-800x800.jpg',
    'Gym-Bag-1-800x800.jpg',
    'Gym-Bag-8-800x800.jpg',
    'Gym-Bag-9-800x800.jpg',
    'Gym-Bag-3-scaled.jpg',
    'Gym-Bag-4-scaled.jpg'
];

for (const b of checkBags) {
    const p = 'nesports-pro-store/assets/images/' + b;
    const stats = fs.statSync(p);
    console.log(b, stats.size);
}
