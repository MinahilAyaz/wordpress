const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images';

async function makeAssets() {
  console.log('Generating color-accurate product image variants...');

  // 1. Blue Knee Wraps
  console.log('1. Blue Knee Wraps...');
  await sharp(path.join(dir, 'Knee-Wrap-9-800x800.jpg'))
    .resize(800, 800, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'knee-wrap-blue-1.jpg'));

  await sharp(path.join(dir, 'Knee-Wrap-9-800x800.jpg'))
    .flop()
    .resize(800, 800, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'knee-wrap-blue-2.jpg'));

  await sharp(path.join(dir, 'Knee-Wrap-9-800x800.jpg'))
    .extract({ left: 100, top: 100, width: 600, height: 600 })
    .resize(800, 800, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'knee-wrap-blue-3.jpg'));

  // 2. Blue Camo Barbell Pads
  console.log('2. Blue Camo Barbell Pads...');
  await sharp(path.join(dir, 'DSC_0177-scaled-1.jpg'))
    .resize(800, 800, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'barbell-pad-blue-1.jpg'));

  await sharp(path.join(dir, 'DSC_0179-Copy-scaled-1.jpg'))
    .resize(800, 800, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'barbell-pad-blue-2.jpg'));

  await sharp(path.join(dir, 'DSC_0177-scaled-1.jpg'))
    .flop()
    .resize(800, 800, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'barbell-pad-blue-3.jpg'));

  // 3. Blue Gym Bag
  console.log('3. Blue Gym Bag...');
  await sharp(path.join(dir, 'Gym-Bag-8-800x800.jpg'))
    .resize(800, 800, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'gym-bag-blue-1.jpg'));

  await sharp(path.join(dir, 'Gym-Bag-8-800x800.jpg'))
    .flop()
    .resize(800, 800, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'gym-bag-blue-2.jpg'));

  await sharp(path.join(dir, 'Gym-Bag-8-800x800.jpg'))
    .extract({ left: 100, top: 100, width: 600, height: 600 })
    .resize(800, 800, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'gym-bag-blue-3.jpg'));

  // 4. Black Gym Bag
  console.log('4. Black Gym Bag...');
  await sharp(path.join(dir, 'Gym-Bag-scaled.jpg'))
    .resize(800, 800, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'gym-bag-black-1.jpg'));

  await sharp(path.join(dir, 'Gym-Bag-1-800x800.jpg'))
    .resize(800, 800, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'gym-bag-black-2.jpg'));

  await sharp(path.join(dir, 'Gym-Bag-1-scaled.jpg'))
    .resize(800, 800, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'gym-bag-black-3.jpg'));

  // 5. Gold / Yellow Wrist Bandages
  console.log('5. Gold / Yellow Wrist Bandages...');
  await sharp(path.join(dir, 'Wrist-Bandage-3.jpg'))
    .resize(800, 800, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'wrist-bandage-gold-1.jpg'));

  await sharp(path.join(dir, 'Wrist-Bandage-3.jpg'))
    .flop()
    .resize(800, 800, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'wrist-bandage-gold-2.jpg'));

  await sharp(path.join(dir, 'Wrist-Bandage-3.jpg'))
    .extract({ left: 200, top: 200, width: 1200, height: 1200 })
    .resize(800, 800, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'wrist-bandage-gold-3.jpg'));

  // 6. Gold Speed Ball
  console.log('6. Gold Speed Ball...');
  await sharp(path.join(dir, '1-1-800x800.jpg'))
    .resize(800, 800, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'speed-ball-gold-1.jpg'));

  await sharp(path.join(dir, '1-1-1-800x800.jpg'))
    .resize(800, 800, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'speed-ball-gold-2.jpg'));

  await sharp(path.join(dir, '1-1-800x800.jpg'))
    .flop()
    .resize(800, 800, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(path.join(dir, 'speed-ball-gold-3.jpg'));

  console.log('ALL ASSETS GENERATED SUCCESSFULLY!');
}

makeAssets().catch(console.error);
