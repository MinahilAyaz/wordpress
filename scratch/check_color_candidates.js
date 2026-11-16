const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function checkCandidates() {
  const dir = 'C:\\Users\\abdul\\Desktop\\wordpress\\nesports-pro-store\\assets\\images';

  console.log('=== GYM BAGS ===');
  const bagFiles = fs.readdirSync(dir).filter(f => /Gym-Bag/i.test(f));
  for (const f of bagFiles) {
    const meta = await sharp(path.join(dir, f)).metadata();
    const stats = await sharp(path.join(dir, f)).stats();
    console.log(`${f} [${meta.width}x${meta.height}] RGB: R:${Math.round(stats.channels[0].mean)} G:${Math.round(stats.channels[1].mean)} B:${Math.round(stats.channels[2].mean)}`);
  }

  console.log('\n=== KNEE WRAPS ===');
  const kneeFiles = fs.readdirSync(dir).filter(f => /Knee-Wrap|knee/i.test(f));
  for (const f of kneeFiles) {
    const meta = await sharp(path.join(dir, f)).metadata();
    const stats = await sharp(path.join(dir, f)).stats();
    console.log(`${f} [${meta.width}x${meta.height}] RGB: R:${Math.round(stats.channels[0].mean)} G:${Math.round(stats.channels[1].mean)} B:${Math.round(stats.channels[2].mean)}`);
  }

  console.log('\n=== SQUAT PADS ===');
  const padFiles = fs.readdirSync(dir).filter(f => /Pad/i.test(f) && !/Foot/i.test(f));
  for (const f of padFiles) {
    const meta = await sharp(path.join(dir, f)).metadata();
    const stats = await sharp(path.join(dir, f)).stats();
    console.log(`${f} [${meta.width}x${meta.height}] RGB: R:${Math.round(stats.channels[0].mean)} G:${Math.round(stats.channels[1].mean)} B:${Math.round(stats.channels[2].mean)}`);
  }

  console.log('\n=== WRIST BANDAGES ===');
  const wristFiles = fs.readdirSync(dir).filter(f => /Wrist/i.test(f));
  for (const f of wristFiles) {
    const meta = await sharp(path.join(dir, f)).metadata();
    const stats = await sharp(path.join(dir, f)).stats();
    console.log(`${f} [${meta.width}x${meta.height}] RGB: R:${Math.round(stats.channels[0].mean)} G:${Math.round(stats.channels[1].mean)} B:${Math.round(stats.channels[2].mean)}`);
  }

  console.log('\n=== SPEED BALLS ===');
  const speedFiles = fs.readdirSync(dir).filter(f => /1-1|speed-ball/i.test(f));
  for (const f of speedFiles) {
    const meta = await sharp(path.join(dir, f)).metadata();
    const stats = await sharp(path.join(dir, f)).stats();
    console.log(`${f} [${meta.width}x${meta.height}] RGB: R:${Math.round(stats.channels[0].mean)} G:${Math.round(stats.channels[1].mean)} B:${Math.round(stats.channels[2].mean)}`);
  }
}

checkCandidates();
