const fs = require('fs');
const filePath = 'nesports-pro-store/includes/helpers.php';
let content = fs.readFileSync(filePath, 'utf8');

// Fix the accidental multi-line mess around line 203
const badLine203 = `array('name'      => 'Ankle Strap Cable Pull (Camo Blue)',
                    'price'     => 11.99,
                    'old_price' => 14.99,
                    'badge'     => 'Save 20%',
                    'img'       => 'Ankle-Strap-Cable-pull-5-scaled.jpg',
                    'images'    => array(
                        'Ankle-Strap-Cable-pull-5-scaled.jpg',
                        'Ankle-Strap-Cable-pull-3-scaled.jpg',
                        'Ankle-Strap-Cable-pull-5-scaled.jpg',
                    ),
                    'url'       => '/product/ankle-strap-camo-blue/',
                    'cat'       => 'ankle', 'price' => 11.99, 'old' => 14.99, 'reviews' => 81, 'main' => 'Ankle-Strap-Cable-pull-5-scaled.jpg', 'hover' => 'Ankle-Strap-Cable-pull-3-scaled.jpg'),`;

const goodLine203 = `array('name' => 'Ankle Strap Cable Pull (Camo Blue)', 'slug' => 'ankle-strap-camo-blue', 'cat' => 'ankle', 'price' => 11.99, 'old' => 14.99, 'reviews' => 81, 'main' => 'Ankle-Strap-Cable-pull-5-scaled.jpg', 'hover' => 'Ankle-Strap-Cable-pull-3-scaled.jpg'),`;

if (content.includes(badLine203)) {
  content = content.replace(badLine203, goodLine203);
}

// Now replace lines 1101-1113 in nesports_color_items
const oldColorAnkle = `'name'      => 'Ankle Strap Cable Pull (Camo Blue)',
                    'price'     => 11.99,
                    'old_price' => 14.99,
                    'badge'     => 'Save 20%',
                    'img'       => 'Ankle-Strap-Cable-pull-5-scaled.jpg',
                    'images'    => array(
                        'Ankle-Strap-Cable-pull-5-scaled.jpg',
                        'Ankle-Strap-Cable-pull-scaled.jpg',
                        'Ankle-Strap-Cable-pull-1-scaled.jpg',
                    ),
                    'url'       => '/product/ankle-strap-camo-blue/',
                    'cat'       => 'ankle'`;

const newColorAnkle = `'name'      => 'Ankle Strap Cable Pull (Camo Blue)',
                    'price'     => 11.99,
                    'old_price' => 14.99,
                    'badge'     => 'Save 20%',
                    'img'       => 'Ankle-Strap-Cable-pull-5-scaled.jpg',
                    'images'    => array(
                        'Ankle-Strap-Cable-pull-5-scaled.jpg',
                        'Ankle-Strap-Cable-pull-3-scaled.jpg',
                        'Ankle-Strap-Cable-pull-5-scaled.jpg',
                    ),
                    'url'       => '/product/ankle-strap-camo-blue/',
                    'cat'       => 'ankle'`;

if (content.includes(oldColorAnkle)) {
  content = content.replace(oldColorAnkle, newColorAnkle);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Restored line 203 and updated nesports_color_items ankle strap!');
