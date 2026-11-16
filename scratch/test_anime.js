const sharp = require('sharp');

async function testAnime() {
  const meta1 = await sharp('C:\\Users\\abdul\\Desktop\\wordpress\\clothing\\Anime-1.jpg').metadata();
  const meta2 = await sharp('C:\\Users\\abdul\\Desktop\\wordpress\\clothing\\Anime-2.jpg').metadata();
  const meta6 = await sharp('C:\\Users\\abdul\\Desktop\\wordpress\\clothing\\Anime-6.jpg').metadata();
  console.log('Anime-1:', meta1.width, meta1.height);
  console.log('Anime-2:', meta2.width, meta2.height);
  console.log('Anime-6:', meta6.width, meta6.height);

  // Let's sample middle region
  const r1 = await sharp('C:\\Users\\abdul\\Desktop\\wordpress\\clothing\\Anime-1.jpg')
    .extract({ left: Math.floor(meta1.width * 0.4), top: Math.floor(meta1.height * 0.4), width: 100, height: 100 })
    .stats();
  const r2 = await sharp('C:\\Users\\abdul\\Desktop\\wordpress\\clothing\\Anime-2.jpg')
    .extract({ left: Math.floor(meta2.width * 0.4), top: Math.floor(meta2.height * 0.4), width: 100, height: 100 })
    .stats();
  const r6 = await sharp('C:\\Users\\abdul\\Desktop\\wordpress\\clothing\\Anime-6.jpg')
    .extract({ left: Math.floor(meta6.width * 0.4), top: Math.floor(meta6.height * 0.4), width: 100, height: 100 })
    .stats();

  console.log('r1 stats:', r1.channels.map(c => Math.round(c.mean)));
  console.log('r2 stats:', r2.channels.map(c => Math.round(c.mean)));
  console.log('r6 stats:', r6.channels.map(c => Math.round(c.mean)));
}
testAnime();
