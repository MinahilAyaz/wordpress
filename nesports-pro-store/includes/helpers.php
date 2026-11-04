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
        array('name' => 'Pull Day Pack (Blue)',        'cat' => 'lifting',  'items' => array('lifting-strap-padded-blue', 'wrist-bandages-45-cm-wrist-black-2')),
        array('name' => 'Heavy Lifter Pack (Black)',   'cat' => 'lifting',  'items' => array('lifting-straps-with-extra-padded-black', 'knee-wrap-copy')),
        array('name' => 'Red Edition Pack',            'cat' => 'legs',     'items' => array('lifting-strap-padded-red', 'knee-wrap')),
        array('name' => 'Leg Day Pack (Blue)',         'cat' => 'legs',     'items' => array('lifting-straps-padded-blue-2', 'knee-wrap-copy')),
        array('name' => 'Gym Carry Pack (Gray)',       'cat' => 'training', 'items' => array('water-proof-gym-bag-gray', 'wrist-bandages-45-cm-wrist-black-2')),
        array('name' => 'Speed & Strength Pack',       'cat' => 'training', 'items' => array('speed-ball-set-maya-hide-leather-red-black', 'water-proof-gym-bag-blue')),
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
