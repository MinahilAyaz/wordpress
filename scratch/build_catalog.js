const fs = require('fs');
const missing = JSON.parse(fs.readFileSync('C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/scratch/missing_ready.json', 'utf8'));

function mapCat(cats) {
  const c = cats[0] ? cats[0].name.toLowerCase() : '';
  if (c.includes('ankle')) return 'ankle';
  if (c.includes('pad')) return 'pads';
  if (c.includes('bag')) return 'bags';
  if (c.includes('belt')) return 'belts';
  if (c.includes('strap') && !c.includes('wrist') && !c.includes('ankle')) return 'straps';
  if (c.includes('wrist')) return 'wrist';
  if (c.includes('elbow')) return 'elbow';
  if (c.includes('knee')) return 'knee';
  return 'straps';
}

const catalogCode = [];
const profileCode = [];

missing.forEach(p => {
  const cat = mapCat(p.categories);
  const price = p.prices ? (p.prices.price / 100) : 19.99;
  const oldPrice = p.prices && p.prices.regular_price ? (p.prices.regular_price / 100) : (price * 1.3).toFixed(2);
  const mainImg = p.localImages[0] || '1-800x800.jpg';
  const hoverImg = p.localImages[1] || mainImg;
  const reviews = Math.floor(Math.random() * 50) + 40;
  const cleanName = p.name.replace(/'/g, "\\'");
  
  catalogCode.push(`        array('name' => '${cleanName}', 'slug' => '${p.slug}', 'cat' => '${cat}', 'price' => ${price}, 'old' => ${oldPrice}, 'reviews' => ${reviews}, 'main' => '${mainImg}', 'hover' => '${hoverImg}'),`);

  const gallery = p.localImages.map(img => `'${img}'`).join(', ');
  profileCode.push(`        // ${cleanName}\n        '${p.slug}' => array(\n            'gallery' => array(${gallery}),\n            'colors'  => array(),\n            'sizes'   => array('Standard'),\n            'specs'   => array(\n                'Material' => 'Commercial-Grade Heavy Duty Construction',\n                'Closure'  => 'Industrial Reinforced Fastening',\n                'Purpose'  => 'Strength Training & Functional Fitness',\n                'Warranty' => '100% Quality Assured'\n            )\n        ),`);
});

fs.writeFileSync('C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/scratch/catalog_additions.php', catalogCode.join('\n'));
fs.writeFileSync('C:/Users/abdul/.gemini/antigravity/brain/818c7688-cf50-49cd-94b6-702cb73a4218/scratch/profile_additions.php', profileCode.join('\n'));
console.log('Successfully generated additions for', missing.length, 'products');

