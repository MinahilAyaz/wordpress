const fs = require('fs');
const filePath = 'nesports-pro-store/includes/helpers.php';
let content = fs.readFileSync(filePath, 'utf8');

// Replace black gym bag
content = content.replace(
  /'name'\s*=>\s*'Water Proof Gym Bag \(Black Edition\)'[\s\S]*?'cat'\s*=>\s*'bags'/,
  `'name'      => 'Water Proof Gym Bag (Black Edition)',
                    'price'     => 11.99,
                    'old_price' => 14.99,
                    'badge'     => 'Save 20%',
                    'img'       => 'gym-bag-black-1.jpg',
                    'images'    => array(
                        'gym-bag-black-1.jpg',
                        'gym-bag-black-2.jpg',
                        'gym-bag-black-3.jpg',
                    ),
                    'url'       => '/product/water-proof-gym-bag-black/',
                    'cat'       => 'bags'`
);

// Replace black lifting straps
content = content.replace(
  /'name'\s*=>\s*'Lifting Straps Extra Padded \(Stealth Black\)'[\s\S]*?'cat'\s*=>\s*'straps'/,
  `'name'      => 'Lifting Straps Extra Padded (Stealth Black)',
                    'price'     => 9.99,
                    'old_price' => 19.99,
                    'badge'     => 'Save 50%',
                    'img'       => 'straps-black-1.jpg',
                    'images'    => array(
                        'straps-black-1.jpg',
                        'straps-black-2.jpg',
                        'straps-black-3.jpg',
                    ),
                    'url'       => '/product/lifting-straps-with-extra-padded-black/',
                    'cat'       => 'straps'`
);

// Replace blue knee wraps
content = content.replace(
  /'name'\s*=>\s*'Competition Knee Wraps \(Speed Blue\)'[\s\S]*?'cat'\s*=>\s*'knee'/,
  `'name'      => 'Competition Knee Wraps (Speed Blue)',
                    'price'     => 29.99,
                    'old_price' => 39.99,
                    'badge'     => 'Save 25%',
                    'img'       => 'knee-wrap-blue-1.jpg',
                    'images'    => array(
                        'knee-wrap-blue-1.jpg',
                        'knee-wrap-blue-2.jpg',
                        'knee-wrap-blue-3.jpg',
                    ),
                    'url'       => '/product/knee-wrap-copy/',
                    'cat'       => 'knee'`
);

// Replace blue lifting straps
content = content.replace(
  /'name'\s*=>\s*'Padded Heavy Lifting Straps \(Blue\)'[\s\S]*?'cat'\s*=>\s*'straps'/,
  `'name'      => 'Padded Heavy Lifting Straps (Blue)',
                    'price'     => 9.99,
                    'old_price' => 14.99,
                    'badge'     => 'Save 33%',
                    'img'       => 'straps-blue-1.jpg',
                    'images'    => array(
                        'straps-blue-1.jpg',
                        'straps-blue-2.jpg',
                        'straps-blue-3.jpg',
                    ),
                    'url'       => '/product/lifting-strap-padded-blue/',
                    'cat'       => 'straps'`
);

// Replace blue gym bag
content = content.replace(
  /'name'\s*=>\s*'Water Proof Gym Bag \(Speed Blue\)'[\s\S]*?'cat'\s*=>\s*'bags'/,
  `'name'      => 'Water Proof Gym Bag (Speed Blue)',
                    'price'     => 11.99,
                    'old_price' => 19.99,
                    'badge'     => 'Save 40%',
                    'img'       => 'gym-bag-blue-1.jpg',
                    'images'    => array(
                        'gym-bag-blue-1.jpg',
                        'gym-bag-blue-2.jpg',
                        'gym-bag-blue-3.jpg',
                    ),
                    'url'       => '/product/water-proof-gym-bag-blue/',
                    'cat'       => 'bags'`
);

// Replace blue barbell pad
content = content.replace(
  /'name'\s*=>\s*'Barbell Squat Pad \(Camo Blue\)'[\s\S]*?'cat'\s*=>\s*'pads'/,
  `'name'      => 'Barbell Squat Pad (Camo Blue)',
                    'price'     => 24.99,
                    'old_price' => 24.99,
                    'badge'     => 'Limited',
                    'img'       => 'barbell-pad-blue-1.jpg',
                    'images'    => array(
                        'barbell-pad-blue-1.jpg',
                        'barbell-pad-blue-2.jpg',
                        'barbell-pad-blue-3.jpg',
                    ),
                    'url'       => '/product/barbell-pad-camo-blue/',
                    'cat'       => 'pads'`
);

// Replace blue ankle strap
content = content.replace(
  /'name'\s*=>\s*'Ankle Strap Cable Pull \(Camo Blue\)'[\s\S]*?'cat'\s*=>\s*'ankle'/,
  `'name'      => 'Ankle Strap Cable Pull (Camo Blue)',
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
                    'cat'       => 'ankle'`
);

// Replace blue royal straps
content = content.replace(
  /'name'\s*=>\s*'Lifting Straps Padded \(Royal Blue\)'[\s\S]*?'cat'\s*=>\s*'straps'/,
  `'name'      => 'Lifting Straps Padded (Royal Blue)',
                    'price'     => 9.99,
                    'old_price' => 19.99,
                    'badge'     => 'Save 50%',
                    'img'       => 'straps-blue-2.jpg',
                    'images'    => array(
                        'straps-blue-2.jpg',
                        'straps-blue-1.jpg',
                        'straps-blue-3.jpg',
                    ),
                    'url'       => '/product/lifting-straps-padded-blue-2/',
                    'cat'       => 'straps'`
);

// Replace red speed ball
content = content.replace(
  /'name'\s*=>\s*'Speed Ball Set Leather \(Red & Black\)'[\s\S]*?'cat'\s*=>\s*'speed'/,
  `'name'      => 'Speed Ball Set Leather (Red & Black)',
                    'price'     => 24.99,
                    'old_price' => 39.99,
                    'img'       => 'speed-ball-red-1.jpg',
                    'images'    => array(
                        'speed-ball-red-1.jpg',
                        'speed-ball-red-2.jpg',
                        'speed-ball-red-3.jpg',
                    ),
                    'url'       => '/product/speed-ball-set-maya-hide-leather-red-black/',
                    'cat'       => 'speed'`
);

// Replace gold speed ball
content = content.replace(
  /'name'\s*=>\s*'Speed Ball Set Leather \(Black & Gold\)'[\s\S]*?'cat'\s*=>\s*'speed'/,
  `'name'      => 'Speed Ball Set Leather (Black & Gold)',
                    'price'     => 24.99,
                    'old_price' => 39.99,
                    'badge'     => 'Save 38%',
                    'img'       => 'speed-ball-gold-1.jpg',
                    'images'    => array(
                        'speed-ball-gold-1.jpg',
                        'speed-ball-gold-2.jpg',
                        'speed-ball-gold-3.jpg',
                    ),
                    'url'       => '/product/speed-ball-set-maya-hide-leather/',
                    'cat'       => 'speed'`
);

// Replace gold wrist bandages
content = content.replace(
  /'name'\s*=>\s*'Wrist Bandages 45cm \(Black \/ Yellow\)'[\s\S]*?'cat'\s*=>\s*'wrist'/,
  `'name'      => 'Wrist Bandages 45cm (Black / Yellow)',
                    'price'     => 9.99,
                    'old_price' => 19.99,
                    'badge'     => 'Save 50%',
                    'img'       => 'wrist-bandage-gold-1.jpg',
                    'images'    => array(
                        'wrist-bandage-gold-1.jpg',
                        'wrist-bandage-gold-2.jpg',
                        'wrist-bandage-gold-3.jpg',
                    ),
                    'url'       => '/product/wrist-bandages-45-cm-wrist-black/',
                    'cat'       => 'wrist'`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated helpers.php!');
