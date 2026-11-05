<?php
/**
 * NESPORTS3 - Template helpers and the product catalog used by the home page.
 * Images live in assets/images/ (copied from the project's /images folder).
 */
if (!defined('ABSPATH')) {
    exit;
}

function nesports_img($file) {
    return NESPORTS_PLUGIN_URL . 'assets/images/' . rawurlencode($file);
}

function nesports_money($value) {
    return '€' . number_format((float) $value, 2);
}

/** Category key => pill label (order = pill order). */
function nesports_categories() {
    return array(
        'belts'  => 'WEIGHTLIFTING BELTS',
        'straps' => 'LIFTING STRAPS',
        'knee'   => 'KNEE WRAPS',
        'elbow'  => 'ELBOW WRAPS',
        'speed'  => 'SPEED BALL',
        'wrist'  => 'WRIST WRAPS',
        'bags'   => 'GYM BAGS',
    );
}

/**
 * Hero slides: 100% Authentic Gym Photoshoot Series
 */
function nesports_hero_slides() {
    return array(
        array(
            'type'     => 'photo',
            'badge'    => 'NEW DROP',
            'img'      => 'DSC_2246-scaled.jpg',
            'sub'      => 'MAXIMUM CORE STABILITY',
            'title'    => 'Pro Lever Lifting Belts',
            'desc'     => 'Competition-grade 10mm & 13mm leather belts with stainless steel lever buckle for heavy squats and pulls.',
            'price'    => '€59.99',
            'old'      => '€79.99',
            'url'      => '/product-category/weightlifting-belts/'
        ),
        array(
            'type'     => 'photo',
            'badge'    => 'ATHLETE SERIES',
            'img'      => 'WhatsApp-Image-2024-07-08-at-19.17.50_f9c47d7b-800x530.jpg',
            'sub'      => 'CARRY EVERYTHING',
            'title'    => 'Water Proof Gym Bags',
            'desc'     => 'Durable, waterproof multi-compartment gym backpacks and duffels built for serious athletes.',
            'price'    => '€11.99',
            'old'      => '€19.99',
            'url'      => '/product-category/gym-bag/'
        ),
        array(
            'type'     => 'photo',
            'badge'    => 'BEST SELLER',
            'img'      => 'DSC_0750-scaled.jpg',
            'sub'      => 'BUILT FOR HEAVY PULLS',
            'title'    => 'Padded Lifting Straps',
            'desc'     => 'Engineered with high-density neoprene cushioning and heavy-duty industrial webbing for maximum deadlift grip.',
            'price'    => '€9.99',
            'old'      => '€14.99',
            'url'      => '/product-category/lifting-straps/'
        ),
        array(
            'type'     => 'photo',
            'badge'    => 'POWER GEAR',
            'img'      => 'DSC_0749-scaled.jpg',
            'sub'      => 'SQUAT WITH CONFIDENCE',
            'title'    => 'Competition Power Gear',
            'desc'     => 'Heavy-duty competition pads, knee wraps and supportive accessories engineered for record-breaking lifts.',
            'price'    => '€24.99',
            'old'      => '€39.99',
            'url'      => '/shop/'
        ),
    );
}

/**
 * Product catalog (names, prices and images from nesports3.com).
 * price = current price, old = regular price, main/hover = files in assets/images/.
 */
function nesports_catalog() {
    return array(
        array('name' => 'Classic Weightlifting Belt Leather',            'slug' => 'pro-leather-weightlifting-lever-belt-10mm',     'cat' => 'belts',  'price' => 59.99, 'old' => 79.99, 'reviews' => 128, 'main' => 'DSC_0166-scaled-1.jpg',                        'hover' => 'DSC_0167-scaled-1.jpg'),
        array('name' => 'Power Lifting Belt 13mm (Black)',              'slug' => 'competition-weightlifting-belt-13mm-black',   'cat' => 'belts',  'price' => 69.99, 'old' => 89.99, 'reviews' => 86,  'main' => 'WhatsApp-Image-2024-07-08-at-19.21.32_c020a8d1.jpg',        'hover' => 'WhatsApp-Image-2024-07-08-at-19.21.33_efbbace4.jpg'),
        array('name' => 'Weightlifting Dip Belt with Steel Chain',       'slug' => 'quick-release-lever-power-belt',             'cat' => 'belts',  'price' => 64.99, 'old' => 84.99, 'reviews' => 54,  'main' => 'Dip-Belt-800x800.jpg',                       'hover' => 'Dip-Belt-1-800x800.jpg'),
        array('name' => 'Heavy Duty Neoprene Elbow Wraps (Pair)',        'slug' => 'heavy-duty-neoprene-elbow-wraps',             'cat' => 'elbow',  'price' => 24.99, 'old' => 34.99, 'reviews' => 39,  'main' => 'Knee-Wrap-800x800.jpg',                       'hover' => 'Knee-wrap-1-800x800.jpg'),
        array('name' => 'Lifting Strap Padded (Blue)',                  'slug' => 'lifting-strap-padded-blue',                  'cat' => 'straps', 'price' => 9.99,  'old' => 14.99, 'reviews' => 112, 'main' => 'A2.jpg',                                     'hover' => 'A3-1-800x800.jpg'),
        array('name' => 'Lifting Strap Padded (Red)',                   'slug' => 'lifting-strap-padded-red',                   'cat' => 'straps', 'price' => 9.99,  'old' => 19.99, 'reviews' => 74,  'main' => '2-red-800x800.jpg',                           'hover' => 'A8-800x800.jpg'),
        array('name' => 'Lifting Straps with Extra Padded (Black)',     'slug' => 'lifting-straps-with-extra-padded-black',     'cat' => 'straps', 'price' => 9.99,  'old' => 19.99, 'reviews' => 95,  'main' => '1-800x800.jpg',                               'hover' => '2-800x800.jpg'),
        array('name' => 'Lifting Straps (Padded) Blue',                 'slug' => 'lifting-straps-padded-blue-2',               'cat' => 'straps', 'price' => 9.99,  'old' => 19.99, 'reviews' => 63,  'main' => 'WhatsApp-Image-2024-07-08-at-19.20.29_ba3cfe08-800x800.jpg', 'hover' => 'WhatsApp-Image-2024-07-08-at-19.20.29_13856fb5-Copy-800x800.jpg'),
        array('name' => 'Knee Wrap (Blue)',                             'slug' => 'knee-wrap-copy',                             'cat' => 'knee',   'price' => 29.99, 'old' => 39.99, 'reviews' => 82,  'main' => 'Knee-Wrap-9-800x800.jpg',                     'hover' => 'Kne-wrap-4-800x800.jpg'),
        array('name' => 'Knee Wrap (Red)',                              'slug' => 'knee-wrap',                                  'cat' => 'knee',   'price' => 29.99, 'old' => 39.99, 'reviews' => 118, 'main' => 'Knee-Wrap-800x800.jpg',                       'hover' => 'Knee-wrap-1-800x800.jpg'),
        array('name' => 'Speed Ball Set Maya Hide Leather Red Black',   'slug' => 'speed-ball-set-maya-hide-leather-red-black', 'cat' => 'speed',  'price' => 24.99, 'old' => 39.99, 'reviews' => 45,  'main' => '1-1-2-800x800.jpg',                        'hover' => '2-1-2-800x800.jpg'),
        array('name' => 'Speed Ball Set Maya Hide Leather',             'slug' => 'speed-ball-set-maya-hide-leather-2',         'cat' => 'speed',  'price' => 24.99, 'old' => 39.99, 'reviews' => 67,  'main' => '1-1-1-800x800.jpg',                           'hover' => '2-1-1-800x800.jpg'),
        array('name' => 'Speed Ball Set Maya Hide Leather Black Gold',  'slug' => 'speed-ball-set-maya-hide-leather',           'cat' => 'speed',  'price' => 24.99, 'old' => 39.99, 'reviews' => 53,  'main' => '1-1-800x800.jpg',                             'hover' => '2-1-800x800.jpg'),
        array('name' => 'Wrist Bandages 45 cm (Black)',                 'slug' => 'wrist-bandages-45-cm-wrist-black-2',         'cat' => 'wrist',  'price' => 9.99,  'old' => 19.99, 'reviews' => 91,  'main' => 'Wrist-Bandage-Black-800x800.jpg',             'hover' => 'Wrist-Bandage-1-800x800.jpg'),
        array('name' => 'Water Proof Gym Bag (Gray)',                   'slug' => 'water-proof-gym-bag-gray',                   'cat' => 'bags',   'price' => 11.99, 'old' => 19.99, 'reviews' => 42,  'main' => 'Gym-Bag-9-800x800.jpg',                       'hover' => 'Gym-Bag-1-2-800x800.jpg'),
        array('name' => 'Water Proof Gym Bag (Blue)',                   'slug' => 'water-proof-gym-bag-blue',                   'cat' => 'bags',   'price' => 11.99, 'old' => 19.99, 'reviews' => 38,  'main' => 'Gym-Bag-8-800x800.jpg',                       'hover' => 'Gym-Bag-1-800x800.jpg'),
    );
}

/**
 * 4 Clean Aesthetic Curated Categories (Stockholm Scandinavian Style).
 * Replaces repetitive single-product tiles with high-level category cards.
 */
function nesports_collections() {
    return array(
        array(
            'title'    => 'Weightlifting Belts',
            'sub'      => '10mm & 13mm Lever Power Belts',
            'img'      => 'DSC_0166-scaled-1.jpg',
            'action'   => 'Explore Belts',
            'url'      => '/product-category/weightlifting-belts/'
        ),
        array(
            'title'    => 'Straps & Joint Wraps',
            'sub'      => 'Knee Wraps & Padded Deadlift Straps',
            'img'      => 'Knee-Wrap-800x800.jpg',
            'action'   => 'Explore Wraps',
            'url'      => '/product-category/lifting-straps/'
        ),
        array(
            'title'    => 'Boxing & Speed Balls',
            'sub'      => 'Maya Hide Leather Reflex Gear',
            'img'      => '1-1-2-800x800.jpg',
            'action'   => 'Explore Speed Gear',
            'url'      => '/product-category/speed-ball/'
        ),
        array(
            'title'    => 'Athlete Bags & Packs',
            'sub'      => 'Waterproof Multi-Compartment Duffels',
            'img'      => 'Gym-Bag-8-800x800.jpg',
            'action'   => 'Explore Bags',
            'url'      => '/product-category/gym-bag/'
        ),
    );
}

/** Bundle pills: key => label. */
function nesports_bundle_tabs() {
    return array(
        'lifting'  => 'LIFTING PACKS',
        'legs'     => 'KNEE & LEG PACKS',
        'training' => 'TRAINING PACKS',
    );
}

/**
 * Bundles are built from catalog products (by slug). Bundle price = sum of the
 * items' current prices minus NESPORTS_BUNDLE_DISCOUNT percent.
 * NOTE: these bundles are placeholders; edit names/items/discount to match real offers.
 */
function nesports_bundles() {
    $discount = 15;
    $defs = array(
        // Lifting Packs (4 items)
        array('name' => 'Pull Day Pack (Blue)',         'cat' => 'lifting',  'items' => array('lifting-strap-padded-blue', 'wrist-bandages-45-cm-wrist-black-2')),
        array('name' => 'Heavy Lifter Pack (Black)',    'cat' => 'lifting',  'items' => array('lifting-straps-with-extra-padded-black', 'wrist-bandages-45-cm-wrist-black-2')),
        array('name' => 'Pro Powerlifting Pack',        'cat' => 'lifting',  'items' => array('pro-leather-weightlifting-lever-belt-10mm', 'lifting-straps-with-extra-padded-black')),
        array('name' => 'Grip & Wrist Armor Pack',      'cat' => 'lifting',  'items' => array('lifting-straps-padded-blue-2', 'wrist-bandages-45-cm-wrist-black-2')),

        // Leg & Knee Packs (4 items)
        array('name' => 'Red Edition Squat Pack',       'cat' => 'legs',     'items' => array('lifting-strap-padded-red', 'knee-wrap')),
        array('name' => 'Leg Day Pack (Blue)',          'cat' => 'legs',     'items' => array('lifting-straps-padded-blue-2', 'knee-wrap-copy')),
        array('name' => 'Competition Knee & Belt Pack', 'cat' => 'legs',     'items' => array('competition-weightlifting-belt-13mm-black', 'knee-wrap')),
        array('name' => 'Heavy Duty Joint Support Pack', 'cat' => 'legs',    'items' => array('heavy-duty-neoprene-elbow-wraps', 'knee-wrap-copy')),

        // Training Packs (4 items)
        array('name' => 'Gym Carry Pack (Gray)',        'cat' => 'training', 'items' => array('water-proof-gym-bag-gray', 'wrist-bandages-45-cm-wrist-black-2')),
        array('name' => 'Speed & Strength Pack',        'cat' => 'training', 'items' => array('speed-ball-set-maya-hide-leather-red-black', 'water-proof-gym-bag-blue')),
        array('name' => 'Speed Reflex Pro Pack',        'cat' => 'training', 'items' => array('speed-ball-set-maya-hide-leather-2', 'water-proof-gym-bag-gray')),
        array('name' => 'Athlete Conditioning Pack',    'cat' => 'training', 'items' => array('speed-ball-set-maya-hide-leather', 'water-proof-gym-bag-blue')),
    );

    $by_slug = array();
    foreach (nesports_catalog() as $p) {
        $by_slug[$p['slug']] = $p;
    }

    $bundles = array();
    foreach ($defs as $d) {
        $items = array();
        $sum = 0;
        foreach ($d['items'] as $slug) {
            if (isset($by_slug[$slug])) {
                $items[] = $by_slug[$slug];
                $sum += $by_slug[$slug]['price'];
            }
        }
        if (count($items) < 2) {
            continue;
        }
        $bundles[] = array(
            'name'  => $d['name'],
            'cat'   => $d['cat'],
            'imgs'  => array($items[0]['main'], $items[1]['main']),
            'old'   => round($sum, 2),
            'price' => round($sum * (100 - $discount) / 100, 2),
            'url'   => '/shop/',
        );
    }
    return $bundles;
}

/**
 * Detailed profile for each product:
 * Strictly product-specific gallery images, color swatches, selectors and specifications.
 * Ensures NO mixed images, foreign products, or irrelevant selectors appear on single product pages.
 */
function nesports_product_profile($product) {
    $slug = is_array($product) ? $product['slug'] : $product;
    
    $profiles = array(
        // 1. Classic Weightlifting Belt Leather
        'pro-leather-weightlifting-lever-belt-10mm' => array(
            'gallery' => array(
                'DSC_0166-scaled-1.jpg',
                'DSC_0167-scaled-1.jpg',
                'WhatsApp-Image-2024-07-08-at-19.21.32_c020a8d1.jpg',
                'WhatsApp-Image-2024-07-08-at-19.21.33_efbbace4.jpg'
            ),
            'colors' => array(
                array('name' => 'Stealth Black',        'color' => '#18181b', 'img' => 'DSC_0166-scaled-1.jpg'),
                array('name' => 'Black / Royal Blue',   'color' => 'linear-gradient(135deg, #18181b 50%, #2563eb 50%)', 'img' => 'WhatsApp-Image-2024-07-08-at-19.21.32_c020a8d1.jpg'),
                array('name' => 'Black / White Stitch', 'color' => 'linear-gradient(135deg, #18181b 50%, #e4e4e7 50%)', 'img' => 'DSC_0167-scaled-1.jpg')
            ),
            'has_thickness' => true,
            'thickness_options' => array('10mm (Standard)', '13mm (Competition)'),
            'has_size' => true,
            'size_label' => 'Size:',
            'sizes' => array(
                array('label' => 'S',  'val' => 'S (28" - 32")'),
                array('label' => 'M',  'val' => 'M (32" - 36")'),
                array('label' => 'L',  'val' => 'L (36" - 40")'),
                array('label' => 'XL', 'val' => 'XL (40" - 44")')
            ),
            'has_size_guide' => true,
            'pack_includes' => array(
                '1x 10mm Competition Steerhide Leather Lever Belt',
                '1x Unbreakable Matte Cast Alloy Steel Lever Buckle',
                'Official NESPORTS3 Ironclad Lifetime Hardware Guarantee'
            ),
            'specs' => array(
                'Material'     => '100% Vegetable Tanned Steerhide Leather',
                'Width'        => '4 Inches (10cm) Uniform IPF Spec',
                'Thickness'    => '10mm Competition Rigidity',
                'Buckle'       => 'Cast Steel Quick-Release Lever Mechanism',
                'Stitching'    => 'Quadruple High-Tensile Bonded Nylon',
                'Approved For' => 'Powerlifting, Heavy Squats & Deadlifts'
            )
        ),

        // 2. Power Lifting Belt 13mm (Black)
        'competition-weightlifting-belt-13mm-black' => array(
            'gallery' => array(
                'WhatsApp-Image-2024-07-08-at-19.21.32_c020a8d1.jpg',
                'WhatsApp-Image-2024-07-08-at-19.21.33_efbbace4.jpg',
                'DSC_0166-scaled-1.jpg',
                'DSC_0167-scaled-1.jpg'
            ),
            'colors' => array(
                array('name' => 'Black / Royal Blue',   'color' => 'linear-gradient(135deg, #18181b 50%, #2563eb 50%)', 'img' => 'WhatsApp-Image-2024-07-08-at-19.21.32_c020a8d1.jpg'),
                array('name' => 'Stealth Black',        'color' => '#18181b', 'img' => 'DSC_0166-scaled-1.jpg')
            ),
            'has_thickness' => true,
            'thickness_options' => array('13mm (Competition)', '10mm (Standard)'),
            'has_size' => true,
            'size_label' => 'Size:',
            'sizes' => array(
                array('label' => 'S',  'val' => 'S (28" - 32")'),
                array('label' => 'M',  'val' => 'M (32" - 36")'),
                array('label' => 'L',  'val' => 'L (36" - 40")'),
                array('label' => 'XL', 'val' => 'XL (40" - 44")')
            ),
            'has_size_guide' => true,
            'pack_includes' => array(
                '1x 13mm Heavy Duty Competition Steerhide Lever Belt',
                '1x Unbreakable Matte Cast Alloy Steel Lever Buckle',
                'Official NESPORTS3 Ironclad Lifetime Hardware Guarantee'
            ),
            'specs' => array(
                'Material'     => '100% Vegetable Tanned Steerhide Leather',
                'Width'        => '4 Inches (10cm) Uniform IPF Spec',
                'Thickness'    => '13mm (+/- 1mm) Maximum Rigidity',
                'Buckle'       => 'Cast Steel Quick-Release Lever Mechanism',
                'Stitching'    => 'Quadruple High-Tensile Bonded Nylon',
                'Approved For' => 'Powerlifting, Maximum Effort Squats & Deadlifts'
            )
        ),

        // 3. Weightlifting Dip Belt with Steel Chain
        'quick-release-lever-power-belt' => array(
            'gallery' => array(
                'Dip-Belt-800x800.jpg',
                'Dip-Belt-1-800x800.jpg'
            ),
            'colors' => array(
                array('name' => 'Stealth Black', 'color' => '#18181b', 'img' => 'Dip-Belt-800x800.jpg')
            ),
            'has_thickness' => false,
            'has_size' => true,
            'size_label' => 'Fit:',
            'sizes' => array(
                array('label' => 'Universal Fit', 'val' => 'Universal Fit (Adjustable 36" Chain)')
            ),
            'has_size_guide' => false,
            'pack_includes' => array(
                '1x Heavy-Duty Contoured Neoprene Dip Belt',
                '1x 36-Inch (91cm) Welded Heavy Gauge Steel Chain',
                '2x Heavy-Duty Steel Locking Carabiners'
            ),
            'specs' => array(
                'Belt Material' => 'Reinforced Polypropylene & Neoprene Padding',
                'Chain'         => '36-Inch (91cm) Welded High-Tensile Steel',
                'Back Width'    => '6 Inches (15cm) Ergonomic Contoured Support',
                'Max Load'      => 'Tested up to 150 kg (330 lbs)',
                'Purpose'       => 'Weighted Dips, Chin-Ups, Pull-Ups & Belt Squats'
            )
        ),

        // 4. Heavy Duty Neoprene Elbow Wraps (Pair)
        'heavy-duty-neoprene-elbow-wraps' => array(
            'gallery' => array(
                'Knee-Wrap-800x800.jpg',
                'Knee-wrap-1-800x800.jpg'
            ),
            'colors' => array(
                array('name' => 'Competition Red / Black', 'color' => 'linear-gradient(135deg, #dc2626 50%, #18181b 50%)', 'img' => 'Knee-Wrap-800x800.jpg')
            ),
            'has_thickness' => false,
            'has_size' => true,
            'size_label' => 'Size:',
            'sizes' => array(
                array('label' => 'M (10" - 12")', 'val' => 'M (10" - 12" Elbow Circumference)'),
                array('label' => 'L (12" - 14")', 'val' => 'L (12" - 14" Elbow Circumference)'),
                array('label' => 'XL (14" - 16")', 'val' => 'XL (14" - 16" Elbow Circumference)')
            ),
            'has_size_guide' => false,
            'pack_includes' => array(
                '1x Pair (2 Wraps) Heavy Duty Elastic Elbow Support Wraps',
                'High-Tension Velcro Lockdown System',
                'Official NESPORTS3 Joint Support Guarantee'
            ),
            'specs' => array(
                'Material'     => 'Elastic Cotton & Poly Blend with Neoprene Core',
                'Length'       => '40 Inches (100cm)',
                'Width'        => '3 Inches (7.5cm)',
                'Closure'      => 'Reinforced Hook & Loop Velcro',
                'Approved For' => 'Bench Press, Overhead Press & Tendon Compression'
            )
        ),

        // 5. Lifting Strap Padded (Blue)
        'lifting-strap-padded-blue' => array(
            'gallery' => array(
                'A2.jpg',
                'A3-1-800x800.jpg'
            ),
            'colors' => array(
                array('name' => 'Royal Blue / Black', 'color' => 'linear-gradient(135deg, #2563eb 50%, #18181b 50%)', 'img' => 'A2.jpg')
            ),
            'has_thickness' => false,
            'has_size' => true,
            'size_label' => 'Size:',
            'sizes' => array(
                array('label' => 'One Size (Pair)', 'val' => 'One Size (Pair) - 24" Standard Length')
            ),
            'has_size_guide' => false,
            'pack_includes' => array(
                '1x Pair (2 Straps) Padded Deadlift Lifting Straps (Blue)',
                '5mm High-Density Neoprene Wrist Padding',
                'Official NESPORTS3 Grip Guarantee'
            ),
            'specs' => array(
                'Material'     => 'Heavy Duty 100% Cotton Webbing + Neoprene Cushion',
                'Length'       => '24 Inches (60cm)',
                'Width'        => '1.5 Inches (3.8cm)',
                'Max Load'     => '400kg+ Tested Tensile Strength',
                'Approved For' => 'Deadlifts, Shrugs, Barbell Rows & Lat Pulldowns'
            )
        ),

        // 6. Lifting Strap Padded (Red)
        'lifting-strap-padded-red' => array(
            'gallery' => array(
                '2-red-800x800.jpg',
                'A8-800x800.jpg'
            ),
            'colors' => array(
                array('name' => 'Competition Red / Black', 'color' => 'linear-gradient(135deg, #dc2626 50%, #18181b 50%)', 'img' => '2-red-800x800.jpg')
            ),
            'has_thickness' => false,
            'has_size' => true,
            'size_label' => 'Size:',
            'sizes' => array(
                array('label' => 'One Size (Pair)', 'val' => 'One Size (Pair) - 24" Standard Length')
            ),
            'has_size_guide' => false,
            'pack_includes' => array(
                '1x Pair (2 Straps) Padded Deadlift Lifting Straps (Red Edition)',
                '5mm High-Density Neoprene Wrist Padding',
                'Official NESPORTS3 Grip Guarantee'
            ),
            'specs' => array(
                'Material'     => 'Heavy Duty 100% Cotton Webbing + Neoprene Cushion',
                'Length'       => '24 Inches (60cm)',
                'Width'        => '1.5 Inches (3.8cm)',
                'Max Load'     => '400kg+ Tested Tensile Strength',
                'Approved For' => 'Deadlifts, Shrugs, Barbell Rows & Heavy Pulls'
            )
        ),

        // 7. Lifting Straps with Extra Padded (Black)
        'lifting-straps-with-extra-padded-black' => array(
            'gallery' => array(
                '1-800x800.jpg',
                '2-800x800.jpg'
            ),
            'colors' => array(
                array('name' => 'Stealth Black', 'color' => '#18181b', 'img' => '1-800x800.jpg')
            ),
            'has_thickness' => false,
            'has_size' => true,
            'size_label' => 'Size:',
            'sizes' => array(
                array('label' => 'One Size (Pair)', 'val' => 'One Size (Pair) - 24" Extra Padded')
            ),
            'has_size_guide' => false,
            'pack_includes' => array(
                '1x Pair (2 Straps) Extra Padded Black Lifting Straps',
                '6mm Ultra-Thick Neoprene Wrist Shield',
                'Official NESPORTS3 Grip Guarantee'
            ),
            'specs' => array(
                'Material'     => 'Industrial Cotton Canvas + 6mm Heavy-Duty Neoprene',
                'Length'       => '24 Inches (60cm)',
                'Width'        => '1.5 Inches (3.8cm)',
                'Max Load'     => '450kg+ Tested Tensile Strength',
                'Approved For' => 'Maximum Effort Pulls & Wrist Bruise Prevention'
            )
        ),

        // 8. Lifting Straps (Padded) Blue
        'lifting-straps-padded-blue-2' => array(
            'gallery' => array(
                'WhatsApp-Image-2024-07-08-at-19.20.29_ba3cfe08-800x800.jpg',
                'WhatsApp-Image-2024-07-08-at-19.20.29_13856fb5-Copy-800x800.jpg'
            ),
            'colors' => array(
                array('name' => 'Royal Blue / Black', 'color' => 'linear-gradient(135deg, #2563eb 50%, #18181b 50%)', 'img' => 'WhatsApp-Image-2024-07-08-at-19.20.29_ba3cfe08-800x800.jpg')
            ),
            'has_thickness' => false,
            'has_size' => true,
            'size_label' => 'Size:',
            'sizes' => array(
                array('label' => 'One Size (Pair)', 'val' => 'One Size (Pair) - Heavy-Duty Loop & Strap')
            ),
            'has_size_guide' => false,
            'pack_includes' => array(
                '1x Pair (2 Straps) Padded Pro Lifting Straps with Solid Steel Ring',
                'Neoprene Wrist Support Cushion',
                'Official NESPORTS3 Grip Guarantee'
            ),
            'specs' => array(
                'Material'     => 'Reinforced Webbing + Neoprene + Heavy Nickel Plated Ring',
                'Length'       => 'Standard Quick-Wrap Fit',
                'Width'        => '1.5 Inches (3.8cm)',
                'Hardware'     => 'Welded Solid Steel Ring',
                'Approved For' => 'Quick-Wrap Deadlifts, Lat Pulldowns & Shrugs'
            )
        ),

        // 9. Knee Wrap (Blue)
        'knee-wrap-copy' => array(
            'gallery' => array(
                'Knee-Wrap-9-800x800.jpg',
                'Kne-wrap-4-800x800.jpg'
            ),
            'colors' => array(
                array('name' => 'Electric Blue / Black', 'color' => 'linear-gradient(135deg, #2563eb 50%, #18181b 50%)', 'img' => 'Knee-Wrap-9-800x800.jpg')
            ),
            'has_thickness' => false,
            'has_size' => true,
            'size_label' => 'Length:',
            'sizes' => array(
                array('label' => '2.0m (Pair)', 'val' => '2.0 Meters (Standard Competition)'),
                array('label' => '2.5m (Pair)', 'val' => '2.5 Meters (Heavy Squats)')
            ),
            'has_size_guide' => false,
            'pack_includes' => array(
                '1x Pair (2 Wraps) Heavy Duty Elastic Knee Wraps (Blue)',
                'Reinforced Hook & Loop Closure Fastener'
            ),
            'specs' => array(
                'Material'     => 'Heavy Duty Elastic Cotton Poly Weave',
                'Length'       => '2.0 Meters (78 Inches)',
                'Width'        => '3 Inches (7.5cm)',
                'Closure'      => 'High-Tension Hook & Loop',
                'Approved For' => 'Heavy Squats, Leg Press & Patellar Tendon Rebound'
            )
        ),

        // 10. Knee Wrap (Red)
        'knee-wrap' => array(
            'gallery' => array(
                'Knee-Wrap-800x800.jpg',
                'Knee-wrap-1-800x800.jpg'
            ),
            'colors' => array(
                array('name' => 'Competition Red / Black', 'color' => 'linear-gradient(135deg, #dc2626 50%, #18181b 50%)', 'img' => 'Knee-Wrap-800x800.jpg')
            ),
            'has_thickness' => false,
            'has_size' => true,
            'size_label' => 'Length:',
            'sizes' => array(
                array('label' => '2.0m (Pair)', 'val' => '2.0 Meters (Standard Competition)'),
                array('label' => '2.5m (Pair)', 'val' => '2.5 Meters (Heavy Squats)')
            ),
            'has_size_guide' => false,
            'pack_includes' => array(
                '1x Pair (2 Wraps) Heavy Duty Elastic Knee Wraps (Red)',
                'Reinforced Hook & Loop Closure Fastener'
            ),
            'specs' => array(
                'Material'     => 'Heavy Duty Elastic Cotton Poly Weave',
                'Length'       => '2.0 Meters (78 Inches)',
                'Width'        => '3 Inches (7.5cm)',
                'Closure'      => 'High-Tension Hook & Loop',
                'Approved For' => 'Heavy Squats, Leg Press & Patellar Tendon Rebound'
            )
        ),

        // 11. Speed Ball Set Maya Hide Leather Red Black
        'speed-ball-set-maya-hide-leather-red-black' => array(
            'gallery' => array(
                '1-1-2-800x800.jpg',
                '2-1-2-800x800.jpg'
            ),
            'colors' => array(
                array('name' => 'Red / Black', 'color' => 'linear-gradient(135deg, #dc2626 50%, #18181b 50%)', 'img' => '1-1-2-800x800.jpg')
            ),
            'has_thickness' => false,
            'has_size' => true,
            'size_label' => 'Kit Edition:',
            'sizes' => array(
                array('label' => 'Pro Kit (Swivel Included)', 'val' => 'Pro Kit (Speed Ball + 360° Steel Swivel + Fixtures)')
            ),
            'has_size_guide' => false,
            'pack_includes' => array(
                '1x Maya Hide Leather Speed Ball (Red / Black)',
                '1x 360-Degree Ball Bearing Stainless Steel Swivel Kit',
                '4x Heavy-Duty Steel Mounting Screws & Bolts'
            ),
            'specs' => array(
                'Material'     => 'Multi-Layered Maya Hide Synthetic Leather',
                'Swivel'       => 'Heavy Duty 360-Degree Sealed Ball Bearing',
                'Bladder'      => 'Anti-Leak High Rebound Latex Bladder',
                'Stitching'    => 'Hand-Stitched High-Tensile Polyester',
                'Approved For' => 'Boxing Rhythm, Hand-Eye Coordination & Agility'
            )
        ),

        // 12. Speed Ball Set Maya Hide Leather
        'speed-ball-set-maya-hide-leather-2' => array(
            'gallery' => array(
                '1-1-1-800x800.jpg',
                '2-1-1-800x800.jpg'
            ),
            'colors' => array(
                array('name' => 'Stealth Black', 'color' => '#18181b', 'img' => '1-1-1-800x800.jpg')
            ),
            'has_thickness' => false,
            'has_size' => true,
            'size_label' => 'Kit Edition:',
            'sizes' => array(
                array('label' => 'Pro Kit (Swivel Included)', 'val' => 'Pro Kit (Speed Ball + 360° Steel Swivel + Fixtures)')
            ),
            'has_size_guide' => false,
            'pack_includes' => array(
                '1x Maya Hide Leather Speed Ball (Stealth Black)',
                '1x 360-Degree Ball Bearing Stainless Steel Swivel Kit',
                '4x Heavy-Duty Steel Mounting Screws & Bolts'
            ),
            'specs' => array(
                'Material'     => 'Multi-Layered Maya Hide Synthetic Leather',
                'Swivel'       => 'Heavy Duty 360-Degree Sealed Ball Bearing',
                'Bladder'      => 'Anti-Leak High Rebound Latex Bladder',
                'Stitching'    => 'Hand-Stitched High-Tensile Polyester',
                'Approved For' => 'Boxing Rhythm, Hand-Eye Coordination & Agility'
            )
        ),

        // 13. Speed Ball Set Maya Hide Leather Black Gold
        'speed-ball-set-maya-hide-leather' => array(
            'gallery' => array(
                '1-1-800x800.jpg',
                '2-1-800x800.jpg'
            ),
            'colors' => array(
                array('name' => 'Black / Gold', 'color' => 'linear-gradient(135deg, #18181b 50%, #d97706 50%)', 'img' => '1-1-800x800.jpg')
            ),
            'has_thickness' => false,
            'has_size' => true,
            'size_label' => 'Kit Edition:',
            'sizes' => array(
                array('label' => 'Pro Kit (Swivel Included)', 'val' => 'Pro Kit (Speed Ball + 360° Steel Swivel + Fixtures)')
            ),
            'has_size_guide' => false,
            'pack_includes' => array(
                '1x Maya Hide Leather Speed Ball (Black & Gold)',
                '1x 360-Degree Ball Bearing Stainless Steel Swivel Kit',
                '4x Heavy-Duty Steel Mounting Screws & Bolts'
            ),
            'specs' => array(
                'Material'     => 'Multi-Layered Maya Hide Synthetic Leather',
                'Swivel'       => 'Heavy Duty 360-Degree Sealed Ball Bearing',
                'Bladder'      => 'Anti-Leak High Rebound Latex Bladder',
                'Stitching'    => 'Hand-Stitched High-Tensile Polyester',
                'Approved For' => 'Boxing Rhythm, Hand-Eye Coordination & Agility'
            )
        ),

        // 14. Wrist Bandages 45 cm (Black)
        'wrist-bandages-45-cm-wrist-black-2' => array(
            'gallery' => array(
                'Wrist-Bandage-Black-800x800.jpg',
                'Wrist-Bandage-1-800x800.jpg'
            ),
            'colors' => array(
                array('name' => 'Stealth Black', 'color' => '#18181b', 'img' => 'Wrist-Bandage-Black-800x800.jpg')
            ),
            'has_thickness' => false,
            'has_size' => true,
            'size_label' => 'Length:',
            'sizes' => array(
                array('label' => '45 cm (18")', 'val' => '45 cm (18 Inches) - Pair')
            ),
            'has_size_guide' => false,
            'pack_includes' => array(
                '1x Pair (2 Wraps) 45cm Competition Wrist Bandages',
                'Reinforced Elastic Thumb Loops',
                'Commercial Heavy-Duty Hook & Loop Fastener'
            ),
            'specs' => array(
                'Material'     => 'Heavy Duty Woven Elastic & Cotton',
                'Length'       => '45cm (18 Inches) Competition Legal',
                'Width'        => '3 Inches (7.5cm)',
                'Fastener'     => 'Commercial Grade Hook & Loop',
                'Approved For' => 'Bench Press, Overhead Press & Wrist Joint Stabilization'
            )
        ),

        // 15. Water Proof Gym Bag (Gray)
        'water-proof-gym-bag-gray' => array(
            'gallery' => array(
                'Gym-Bag-9-800x800.jpg',
                'Gym-Bag-1-2-800x800.jpg'
            ),
            'colors' => array(
                array('name' => 'Steel Gray / Black', 'color' => 'linear-gradient(135deg, #64748b 50%, #18181b 50%)', 'img' => 'Gym-Bag-9-800x800.jpg')
            ),
            'has_thickness' => false,
            'has_size' => true,
            'size_label' => 'Capacity:',
            'sizes' => array(
                array('label' => '45 Liters', 'val' => '45 Liters (Large Gym Duffel)')
            ),
            'has_size_guide' => false,
            'pack_includes' => array(
                '1x Water-Resistant Multi-Compartment Sports Duffel (Gray)',
                '1x Separate Ventilated Shoe / Wet Gear Pocket',
                'Heavy Duty Drawstring & Carrying Straps'
            ),
            'specs' => array(
                'Material'     => '100% Water-Resistant High-Density Nylon',
                'Capacity'     => '45 Liters (Large)',
                'Compartments' => 'Main Dry Storage, Shoe Pocket, Mesh Bottle Pocket, Front Zip',
                'Zippers'      => 'Reinforced Smooth Glide Hardware',
                'Approved For' => 'Gym Training, Powerlifting Gear Carry & Travel'
            )
        ),

        // 16. Water Proof Gym Bag (Blue)
        'water-proof-gym-bag-blue' => array(
            'gallery' => array(
                'Gym-Bag-8-800x800.jpg',
                'Gym-Bag-1-800x800.jpg'
            ),
            'colors' => array(
                array('name' => 'Speed Blue / Black', 'color' => 'linear-gradient(135deg, #2563eb 50%, #18181b 50%)', 'img' => 'Gym-Bag-8-800x800.jpg')
            ),
            'has_thickness' => false,
            'has_size' => true,
            'size_label' => 'Capacity:',
            'sizes' => array(
                array('label' => '45 Liters', 'val' => '45 Liters (Large Gym Duffel)')
            ),
            'has_size_guide' => false,
            'pack_includes' => array(
                '1x Water-Resistant Multi-Compartment Sports Duffel (Blue)',
                '1x Separate Ventilated Shoe / Wet Gear Pocket',
                'Heavy Duty Drawstring & Carrying Straps'
            ),
            'specs' => array(
                'Material'     => '100% Water-Resistant High-Density Nylon',
                'Capacity'     => '45 Liters (Large)',
                'Compartments' => 'Main Dry Storage, Shoe Pocket, Mesh Bottle Pocket, Front Zip',
                'Zippers'      => 'Reinforced Smooth Glide Hardware',
                'Approved For' => 'Gym Training, Powerlifting Gear Carry & Travel'
            )
        )
    );

    if (isset($profiles[$slug])) {
        return $profiles[$slug];
    }

    // Fallback safe profile
    $main = is_array($product) && !empty($product['main']) ? $product['main'] : 'DSC_0166-scaled-1.jpg';
    $hover = is_array($product) && !empty($product['hover']) ? $product['hover'] : $main;
    return array(
        'gallery' => array($main, $hover),
        'colors'  => array(
            array('name' => 'Default', 'color' => '#18181b', 'img' => $main)
        ),
        'has_thickness' => false,
        'has_size'      => false,
        'has_size_guide'=> false,
        'pack_includes' => array(
            '1x ' . (is_array($product) ? $product['name'] : 'Authentic Gear Item'),
            'Official NESPORTS3 Quality Guarantee'
        ),
        'specs' => array(
            'Brand'    => 'NESPORTS3 Official',
            'Category' => is_array($product) && isset($product['cat']) ? ucfirst($product['cat']) : 'Gear',
            'Quality'  => 'Reinforced Commercial Grade Craftsmanship'
        )
    );
}

