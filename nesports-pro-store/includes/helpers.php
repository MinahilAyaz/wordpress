<?php
/**
 * NESPORTS3 - Template helpers and the product catalog used by the home page.
 * Images live in assets/images/ (copied from the project's /images folder).
 */
if (!defined('ABSPATH')) {
    exit;
}

function nesports_img($file) {
    if (empty($file)) return '';
    if (strpos($file, 'http://') === 0 || strpos($file, 'https://') === 0 || strpos($file, '//') === 0) {
        return $file;
    }
    // Encode each path segment individually so subdirectories (e.g. clothing/image.jpg) are preserved
    $parts = explode('/', str_replace('\\', '/', $file));
    $encoded = array_map('rawurlencode', $parts);
    return NESPORTS_PLUGIN_URL . 'assets/images/' . implode('/', $encoded);
}

function nesports_money($value) {
    if (function_exists('wc_price')) {
        return wp_strip_all_tags(wc_price((float) $value));
    }
    return '€' . number_format((float) $value, 2);
}

/** Category key => pill label (order = pill order). */
function nesports_categories() {
    if (function_exists('get_terms')) {
        $terms = get_terms(array(
            'taxonomy'   => 'product_cat',
            'hide_empty' => true,
        ));
        if (!empty($terms) && !is_wp_error($terms)) {
            $cats = array();
            foreach ($terms as $t) {
                if (strtolower($t->slug) === 'uncategorized') continue;
                $cats[$t->slug] = strtoupper($t->name);
            }
            if (!empty($cats)) {
                return $cats;
            }
        }
    }

    return array(
        'belts'  => 'WEIGHTLIFTING BELTS',
        'straps' => 'LIFTING STRAPS',
        'knee'   => 'KNEE WRAPS',
        'elbow'  => 'ELBOW WRAPS',
        'speed'  => 'SPEED BALL',
        'wrist'  => 'WRIST WRAPS',
        'bags'   => 'GYM BAGS',
        'ankle'    => 'ANKLE STRAPS',
        'pads'     => 'BARBELL PADS',
        'clothing' => 'CLOTHING',
    );
}

/**
 * Hero slides: 100% Authentic Gym Photoshoot Series
 */
function nesports_hero_slides() {
    return array(
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
    );
}

/**
 * Product catalog (names, prices and images from nesports3.com or live WooCommerce).
 * price = current price, old = regular price, main/hover = files or URLs.
 */
function nesports_catalog() {
    static $cached_catalog = null;
    if ($cached_catalog !== null) {
        return $cached_catalog;
    }

    if (function_exists('wc_get_products')) {
        $wc_products = wc_get_products(array(
            'status'  => 'publish',
            'limit'   => 50,
            'orderby' => 'menu_order title',
            'order'   => 'ASC',
        ));

        if (!empty($wc_products)) {
            $catalog = array();
            foreach ($wc_products as $p) {
                $id = $p->get_id();
                $terms = get_the_terms($id, 'product_cat');
                $cat_slug = 'all';
                if (!empty($terms) && !is_wp_error($terms)) {
                    $cat_slug = $terms[0]->slug;
                }

                $image_id = $p->get_image_id();
                $main_img = $image_id ? wp_get_attachment_image_url($image_id, 'woocommerce_thumbnail') : '';
                if (!$main_img && function_exists('wc_placeholder_img_src')) {
                    $main_img = wc_placeholder_img_src();
                }

                $gallery_ids = $p->get_gallery_image_ids();
                $hover_img   = !empty($gallery_ids) ? wp_get_attachment_image_url($gallery_ids[0], 'woocommerce_thumbnail') : $main_img;

                $reg_price  = (float) $p->get_regular_price();
                $curr_price = (float) $p->get_price();
                $old_price  = ($reg_price > $curr_price) ? $reg_price : $curr_price;

                $catalog[] = array(
                    'id'      => $id,
                    'name'    => $p->get_name(),
                    'slug'    => $p->get_slug(),
                    'cat'     => $cat_slug,
                    'price'   => $curr_price,
                    'old'     => $old_price,
                    'reviews' => (int) $p->get_rating_count(),
                    'main'    => $main_img,
                    'hover'   => $hover_img,
                );
            }
            if (!empty($catalog)) {
                $cached_catalog = $catalog;
                return $catalog;
            }
        }
    }

    $cached_catalog = nesports_preset_catalog();
    return $cached_catalog;
}

function nesports_preset_catalog() {
    return array(
        array('name' => 'Classic Weightlifting Belt Leather',            'slug' => 'pro-leather-weightlifting-lever-belt-10mm',     'cat' => 'belts',  'price' => 59.99, 'old' => 79.99, 'reviews' => 128, 'main' => 'DSC_0167-scaled-1.jpg',                        'hover' => 'DSC_0166-scaled-1.jpg'),
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
        array('name' => 'Elbow Wrap', 'slug' => 'elbow-wrap', 'cat' => 'elbow', 'price' => 24.99, 'old' => 34.99, 'reviews' => 84, 'main' => 'Elbow-Wrap-1-scaled.jpg', 'hover' => 'Elbow-Wrap-scaled.jpg'),
        array('name' => 'Ankle Strap Cable Pull (Black)', 'slug' => 'ankle-strap-black', 'cat' => 'ankle', 'price' => 11.99, 'old' => 14.99, 'reviews' => 59, 'main' => 'Ankle-Strap-Cable-pull-scaled.jpg', 'hover' => 'Ankle-Strap-Cable-pull-1-scaled.jpg'),
        array('name' => 'Barbell Pad (Black)', 'slug' => 'barbell-pad-black', 'cat' => 'pads', 'price' => 24.99, 'old' => 24.99, 'reviews' => 70, 'main' => 'Barbell-Pad-5-scaled.jpg', 'hover' => 'DSC_0179-Copy-scaled-1.jpg'),
        array('name' => 'Water Proof gym Bag (Black)', 'slug' => 'water-proof-gym-bag-black', 'cat' => 'bags', 'price' => 11.99, 'old' => 14.99, 'reviews' => 61, 'main' => 'Gym-Bag-scaled.jpg', 'hover' => 'Gym-Bag-1-scaled.jpg'),
        array('name' => 'Classic weightlifting belt Leather', 'slug' => 'classic-weightlifting-belt-leather', 'cat' => 'belts', 'price' => 19.99, 'old' => 29.99, 'reviews' => 71, 'main' => 'DSC_0166-scaled-1.jpg', 'hover' => 'DSC_0167-scaled-1.jpg'),
        array('name' => 'Classic weightlifting belt', 'slug' => 'classic-weightlifting-belt', 'cat' => 'belts', 'price' => 14.99, 'old' => 19.99, 'reviews' => 62, 'main' => 'WhatsApp-Image-2024-07-08-at-19.21.32_c020a8d1.jpg', 'hover' => 'WhatsApp-Image-2024-07-08-at-19.21.33_efbbace4.jpg'),
        array('name' => 'Barbell Pad (Camo Blue)', 'slug' => 'barbell-pad-camo-blue', 'cat' => 'pads', 'price' => 24.99, 'old' => 24.99, 'reviews' => 74, 'main' => 'DSC_0177-scaled-1.jpg', 'hover' => 'DSC_0179-Copy-scaled-1.jpg'),
        array('name' => 'Barbell pad (Gray Camo)', 'slug' => 'barbell-pad-gray-camo', 'cat' => 'pads', 'price' => 24.99, 'old' => 24.99, 'reviews' => 67, 'main' => 'Baerbell-Pad-scaled.jpg', 'hover' => 'Barbell-Pad-1-scaled.jpg'),
        array('name' => 'Ankle Strap Cable Pull (Camo Blue)', 'slug' => 'ankle-strap-camo-blue', 'cat' => 'ankle', 'price' => 11.99, 'old' => 14.99, 'reviews' => 81, 'main' => 'Ankle-Strap-Cable-pull-5-scaled.jpg', 'hover' => 'Ankle-Strap-Cable-pull-3-scaled.jpg'),
        array('name' => 'Premium Ankle Straps', 'slug' => 'premium-ankle-straps-2', 'cat' => 'ankle', 'price' => 9.99, 'old' => 14.99, 'reviews' => 66, 'main' => 'DSC_0210-scaled-1.jpg', 'hover' => 'DSC_2459-scaled-1.jpg'),
        array('name' => 'Lifting Straps (Padded) Black', 'slug' => 'lifting-straps-padded-black', 'cat' => 'straps', 'price' => 9.99, 'old' => 19.99, 'reviews' => 89, 'main' => 'WhatsApp-Image-2024-07-08-at-19.20.29_3dc5ad04.jpg', 'hover' => 'WhatsApp-Image-2024-07-08-at-19.20.29_13856fb5-Copy.jpg'),
        array('name' => 'Foot Loops Cable Pull (Black)', 'slug' => 'foot-loops-cable-pull-black', 'cat' => 'ankle', 'price' => 9.99, 'old' => 24.99, 'reviews' => 45, 'main' => 'Foot-Strap-Cable-pull-padded.jpg', 'hover' => 'Foot-Strap-Cable-pull-padded-2.jpg'),
        array('name' => 'Wrist Bandages  45 cm Wrist  (Black/Yellow)', 'slug' => 'wrist-bandages-45-cm-wrist-black', 'cat' => 'wrist', 'price' => 9.99, 'old' => 19.99, 'reviews' => 83, 'main' => 'Wrist-Bandage-3.jpg', 'hover' => 'Wrist-Bandage-1.jpg'),
        array('name' => 'Lifting Straps with Extra Padded', 'slug' => 'lifting-straps-with-wrist-pad', 'cat' => 'straps', 'price' => 16.99, 'old' => 24.99, 'reviews' => 49, 'main' => '1-scaled.jpg', 'hover' => '0-1-min-scaled.jpg'),
        array('name' => 'Weighlifting Dip Belt with Chain', 'slug' => 'weighlifting-dip-belt-with-chain', 'cat' => 'belts', 'price' => 24.99, 'old' => 29.99, 'reviews' => 48, 'main' => 'Dip-Belt.jpg', 'hover' => 'Dip-Belt-1.jpg'),
        // Clothing & Apparel (All 13 Authentic Lifter T-Shirts)
        array('name' => 'Strength Club Oversized T-Shirt (Black)', 'slug' => 'strength-club-oversized-t-shirt', 'cat' => 'clothing', 'price' => 34.99, 'old' => 44.99, 'reviews' => 94, 'main' => 'clothing/Black NE3Sports Strength Club T-Shirt.png', 'hover' => 'clothing/Black T-Shirt with Red Strength Club Design.png'),
        array('name' => 'Strength Club Athletic Fit T-Shirt', 'slug' => 'strength-club-athletic-fit-t-shirt', 'cat' => 'clothing', 'price' => 34.99, 'old' => 44.99, 'reviews' => 88, 'main' => 'clothing/Black NE3Sports Strength Club T-Shirt (1).png', 'hover' => 'clothing/Black NE3Sports Strength Club T-Shirt.png'),
        array('name' => 'Strength Club Red Edition T-Shirt', 'slug' => 'strength-club-red-edition-t-shirt', 'cat' => 'clothing', 'price' => 34.99, 'old' => 44.99, 'reviews' => 91, 'main' => 'clothing/Black T-Shirt with Red Strength Club Design.png', 'hover' => 'clothing/Black NE3Sports Strength Club T-Shirt.png'),
        array('name' => 'Lift The World Signature T-Shirt (Black)', 'slug' => 'lift-the-world-oversized-t-shirt', 'cat' => 'clothing', 'price' => 34.99, 'old' => 44.99, 'reviews' => 108, 'main' => 'clothing/Lift-The-World-T-Shirt-Black-1.jpg', 'hover' => 'clothing/Lift-The-World-T-Shirt-Red-1.jpg'),
        array('name' => 'Lift The World Signature T-Shirt (Crimson Red)', 'slug' => 'lift-the-world-red-edition-t-shirt', 'cat' => 'clothing', 'price' => 34.99, 'old' => 44.99, 'reviews' => 76, 'main' => 'clothing/Lift-The-World-T-Shirt-Red-1.jpg', 'hover' => 'clothing/Lift-The-World-T-Shirt-Black-1.jpg'),
        array('name' => 'Anime Dark Edition Graphic T-Shirt', 'slug' => 'anime-oversized-t-shirt', 'cat' => 'clothing', 'price' => 39.99, 'old' => 49.99, 'reviews' => 120, 'main' => 'clothing/Anime-6.jpg', 'hover' => 'clothing/Anime_7f0fadc8-522d-45ac-b9e6-8208133f1390.jpg'),
        array('name' => 'Anime Berserk Statement T-Shirt', 'slug' => 'anime-berserk-oversized-t-shirt', 'cat' => 'clothing', 'price' => 39.99, 'old' => 49.99, 'reviews' => 114, 'main' => 'clothing/Anime-1.jpg', 'hover' => 'clothing/Anime-6.jpg'),
        array('name' => 'Anime Shadow Graphic T-Shirt', 'slug' => 'anime-shadow-oversized-t-shirt', 'cat' => 'clothing', 'price' => 39.99, 'old' => 49.99, 'reviews' => 98, 'main' => 'clothing/Anime-2.jpg', 'hover' => 'clothing/Anime_7f0fadc8-522d-45ac-b9e6-8208133f1390.jpg'),
        array('name' => 'Anime Vanguard Graphic T-Shirt', 'slug' => 'anime-vanguard-graphic-t-shirt', 'cat' => 'clothing', 'price' => 39.99, 'old' => 49.99, 'reviews' => 84, 'main' => 'clothing/Anime_7f0fadc8-522d-45ac-b9e6-8208133f1390.jpg', 'hover' => 'clothing/Anime-1.jpg'),
        array('name' => 'Son Of The West Statement T-Shirt', 'slug' => 'son-of-the-west-oversized-t-shirt', 'cat' => 'clothing', 'price' => 34.99, 'old' => 44.99, 'reviews' => 65, 'main' => 'clothing/Back-Son-Of-The-West.jpg', 'hover' => 'clothing/Anime-1.jpg'),
        array('name' => 'Pro Coach Performance Oversized T-Shirt (Green)', 'slug' => 'pro-coach-oversized-t-shirt', 'cat' => 'clothing', 'price' => 34.99, 'old' => 44.99, 'reviews' => 58, 'main' => 'clothing/Procoach-T-Shirt-Green.jpg', 'hover' => 'clothing/Vintage Navy Pro Coach T-Shirt Graphic.png'),
        array('name' => 'Pro Coach Iron Tee (Red Back Print)', 'slug' => 'pro-coach-red-iron-t-shirt', 'cat' => 'clothing', 'price' => 34.99, 'old' => 44.99, 'reviews' => 72, 'main' => 'clothing/Red Pro Coach Iron Tee Back Print.png', 'hover' => 'clothing/Procoach-T-Shirt-Green.jpg'),
        array('name' => 'Pro Coach Vintage Navy Graphic T-Shirt', 'slug' => 'pro-coach-vintage-navy-t-shirt', 'cat' => 'clothing', 'price' => 34.99, 'old' => 44.99, 'reviews' => 69, 'main' => 'clothing/Vintage Navy Pro Coach T-Shirt Graphic.png', 'hover' => 'clothing/Red Pro Coach Iron Tee Back Print.png'),
    );
}

/**
 * 5 Clean Aesthetic Curated Categories (Stockholm Scandinavian Style).
 * Replaces repetitive single-product tiles with high-level category cards.
 */
function nesports_collections() {
    return array(
        array(
            'title'    => 'Weightlifting Belts',
            'subtitle' => 'Genuine Leather 10mm',
            'price'    => '€59.99',
            'old_price'=> '€69.99',
            'badge'    => 'Save 15%',
            'category' => 'belts',
            'img'      => 'WhatsApp-Image-2024-07-08-at-19.21.32_c020a8d1.jpg',
            'url'      => '/product-category/weightlifting-belts/'
        ),
        array(
            'title'    => 'Lifting Straps',
            'subtitle' => 'Padded Heavy Duty Grip',
            'price'    => '€9.99',
            'old_price'=> '€14.99',
            'badge'    => 'Save 15%',
            'category' => 'straps',
            'img'      => '1-800x800.jpg',
            'url'      => '/product-category/lifting-straps/'
        ),
        array(
            'title'    => 'Knee Wraps',
            'subtitle' => 'Elastic Power Support',
            'price'    => '€16.99',
            'old_price'=> '€19.99',
            'badge'    => 'Save 15%',
            'category' => 'knee-wrap',
            'img'      => 'Knee-Wrap-800x800.jpg',
            'url'      => '/product-category/knee-wrap/'
        ),
        array(
            'title'    => 'Elbow Wraps',
            'subtitle' => 'Compression Stability',
            'price'    => '€14.99',
            'old_price'=> '€18.99',
            'badge'    => 'Save 15%',
            'category' => 'elbow-wrap',
            'img'      => 'Elbow-Wrap-1-scaled.jpg',
            'url'      => '/product-category/elbow-wrap/'
        ),
        array(
            'title'    => 'Wrist Straps',
            'subtitle' => 'Thumb Loop Reinforcement',
            'price'    => '€12.99',
            'old_price'=> '€15.99',
            'badge'    => 'Save 15%',
            'category' => 'wrist-straps',
            'img'      => 'Wrist-Bandage-Black-800x800.jpg',
            'url'      => '/product-category/wrist-straps/'
        ),
        array(
            'title'    => 'Gym Bags',
            'subtitle' => 'Waterproof Athletic Pack',
            'price'    => '€8.99',
            'old_price'=> '€11.99',
            'badge'    => 'Save 15%',
            'category' => 'gym-bag',
            'img'      => 'Gym-Bag-8-800x800.jpg',
            'url'      => '/product-category/gym-bag/'
        ),
        array(
            'title'    => 'Speed Ball Sets',
            'subtitle' => 'Pro Reflex Swivel Set',
            'price'    => '€24.99',
            'old_price'=> '€29.99',
            'badge'    => 'Save 15%',
            'category' => 'speed-ball',
            'img'      => 'hero-speed-ball.png',
            'url'      => '/product-category/speed-ball/'
        ),
        array(
            'title'    => 'Ankle Straps',
            'subtitle' => 'Cable Attachment D-Ring',
            'price'    => '€11.99',
            'old_price'=> '€14.99',
            'badge'    => 'Save 15%',
            'category' => 'ankle-straps',
            'img'      => 'Ankle-Strap-Cable-pull-scaled.jpg',
            'url'      => '/product-category/ankle-straps/'
        ),
        array(
            'title'    => 'Barbell Pads',
            'subtitle' => 'Ergonomic Neck Protection',
            'price'    => '€14.99',
            'old_price'=> '€18.99',
            'badge'    => 'Save 15%',
            'category' => 'barbell-pads',
            'img'      => 'Baerbell-Pad-scaled.jpg',
            'url'      => '/product-category/barbell-pads/'
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
        // Lifting Packs (5 items)
        array('name' => 'Pull Day Pack (Blue)',         'cat' => 'lifting',  'items' => array('lifting-strap-padded-blue', 'wrist-bandages-45-cm-wrist-black-2')),
        array('name' => 'Heavy Lifter Pack (Black)',    'cat' => 'lifting',  'items' => array('lifting-straps-with-extra-padded-black', 'wrist-bandages-45-cm-wrist-black-2')),
        array('name' => 'Pro Powerlifting Pack',        'cat' => 'lifting',  'items' => array('pro-leather-weightlifting-lever-belt-10mm', 'lifting-straps-with-extra-padded-black')),
        array('name' => 'Grip & Wrist Armor Pack',      'cat' => 'lifting',  'items' => array('lifting-straps-padded-blue-2', 'wrist-bandages-45-cm-wrist-black-2')),
        array('name' => 'Deadlift & Dip Belt Pack',     'cat' => 'lifting',  'items' => array('quick-release-lever-power-belt', 'lifting-strap-padded-red')),

        // Leg & Knee Packs (5 items)
        array('name' => 'Red Edition Squat Pack',       'cat' => 'legs',     'items' => array('lifting-strap-padded-red', 'knee-wrap')),
        array('name' => 'Leg Day Pack (Blue)',          'cat' => 'legs',     'items' => array('lifting-straps-padded-blue-2', 'knee-wrap-copy')),
        array('name' => 'Competition Knee & Belt Pack', 'cat' => 'legs',     'items' => array('competition-weightlifting-belt-13mm-black', 'knee-wrap')),
        array('name' => 'Heavy Duty Joint Support Pack', 'cat' => 'legs',    'items' => array('heavy-duty-neoprene-elbow-wraps', 'knee-wrap-copy')),
        array('name' => 'Squat Pad & Knee Wrap Pack',   'cat' => 'legs',     'items' => array('barbell-pad-black', 'knee-wrap')),

        // Training Packs (5 items)
        array('name' => 'Gym Carry Pack (Gray)',        'cat' => 'training', 'items' => array('water-proof-gym-bag-gray', 'wrist-bandages-45-cm-wrist-black-2')),
        array('name' => 'Speed & Strength Pack',        'cat' => 'training', 'items' => array('speed-ball-set-maya-hide-leather-red-black', 'water-proof-gym-bag-blue')),
        array('name' => 'Speed Reflex Pro Pack',        'cat' => 'training', 'items' => array('speed-ball-set-maya-hide-leather-2', 'water-proof-gym-bag-gray')),
        array('name' => 'Athlete Conditioning Pack',    'cat' => 'training', 'items' => array('speed-ball-set-maya-hide-leather', 'water-proof-gym-bag-blue')),
        array('name' => 'Glute & Carry Essentials Pack','cat' => 'training', 'items' => array('ankle-strap-black', 'water-proof-gym-bag-black')),
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
 * Clothing Items for the Clothing Section Carousel (All 13 Authentic Lifter T-Shirts)
 * Matched exactly to Hardbody Clothing carousel style (Portrait photo cards + label + arrow)
 */
function nesports_clothing() {
    return array(
        array(
            'id'    => 'strength-club',
            'title' => 'STRENGTH CLUB',
            'tag'   => 'HEAVYWEIGHT OVERSIZED',
            'img'   => 'clothing/Black NE3Sports Strength Club T-Shirt.png',
            'url'   => '/product/strength-club-oversized-t-shirt/'
        ),
        array(
            'id'    => 'strength-club-athletic',
            'title' => 'STRENGTH CLUB PRO',
            'tag'   => 'ATHLETIC FIT OVERSIZED',
            'img'   => 'clothing/Black NE3Sports Strength Club T-Shirt (1).png',
            'url'   => '/product/strength-club-athletic-fit-t-shirt/'
        ),
        array(
            'id'    => 'strength-club-red',
            'title' => 'STRENGTH CLUB RED',
            'tag'   => 'RUBY LOGO EDITION',
            'img'   => 'clothing/Black T-Shirt with Red Strength Club Design.png',
            'url'   => '/product/strength-club-red-edition-t-shirt/'
        ),
        array(
            'id'    => 'lift-the-world',
            'title' => 'LIFT THE WORLD',
            'tag'   => 'SIGNATURE ATHLETE TEE',
            'img'   => 'clothing/Lift-The-World-T-Shirt-Black-1.jpg',
            'url'   => '/product/lift-the-world-oversized-t-shirt/'
        ),
        array(
            'id'    => 'red-edition',
            'title' => 'RED EDITION',
            'tag'   => 'LIMITED ATHLETE DROP',
            'img'   => 'clothing/Lift-The-World-T-Shirt-Red-1.jpg',
            'url'   => '/product/lift-the-world-red-edition-t-shirt/'
        ),
        array(
            'id'    => 'anime-drop',
            'title' => 'ANIME DARK DROP',
            'tag'   => 'LIMITED EDITION GRAPHIC',
            'img'   => 'clothing/Anime-6.jpg',
            'url'   => '/product/anime-oversized-t-shirt/'
        ),
        array(
            'id'    => 'anime-berserk',
            'title' => 'ANIME BERSERK',
            'tag'   => 'HEAVYWEIGHT GRAPHIC TEE',
            'img'   => 'clothing/Anime-1.jpg',
            'url'   => '/product/anime-berserk-oversized-t-shirt/'
        ),
        array(
            'id'    => 'anime-shadow',
            'title' => 'ANIME SHADOW',
            'tag'   => 'GRAPHIC VANGUARD TEE',
            'img'   => 'clothing/Anime-2.jpg',
            'url'   => '/product/anime-shadow-oversized-t-shirt/'
        ),
        array(
            'id'    => 'anime-vanguard',
            'title' => 'ANIME WARRIOR',
            'tag'   => 'OVERSIZED STATEMENT',
            'img'   => 'clothing/Anime_7f0fadc8-522d-45ac-b9e6-8208133f1390.jpg',
            'url'   => '/product/anime-vanguard-graphic-t-shirt/'
        ),
        array(
            'id'    => 'son-of-the-west',
            'title' => 'SON OF THE WEST',
            'tag'   => 'ACID WASH STATEMENT',
            'img'   => 'clothing/Back-Son-Of-The-West.jpg',
            'url'   => '/product/son-of-the-west-oversized-t-shirt/'
        ),
        array(
            'id'    => 'pro-coach',
            'title' => 'PRO COACH GREEN',
            'tag'   => 'PERFORMANCE OVERSIZED',
            'img'   => 'clothing/Procoach-T-Shirt-Green.jpg',
            'url'   => '/product/pro-coach-oversized-t-shirt/'
        ),
        array(
            'id'    => 'pro-coach-red',
            'title' => 'PRO COACH RED IRON',
            'tag'   => 'BORN IN IRON GRAPHIC',
            'img'   => 'clothing/Red Pro Coach Iron Tee Back Print.png',
            'url'   => '/product/pro-coach-red-iron-t-shirt/'
        ),
        array(
            'id'    => 'pro-coach-navy',
            'title' => 'PRO COACH NAVY',
            'tag'   => 'VINTAGE GRAPHIC TEE',
            'img'   => 'clothing/Vintage Navy Pro Coach T-Shirt Graphic.png',
            'url'   => '/product/pro-coach-vintage-navy-t-shirt/'
        )
    );
}

/**
 * Shop by Color product collections.
 * Filtered by authentic NESPORTS3 products in each color group.
 */
function nesports_color_items() {
    return array(
        'red' => array(
            'label' => 'RED',
            'hex'   => '#dc2626',
            'items' => array(
                array(
                    'name'      => 'Lift The World T-Shirt (Crimson Red)',
                    'price'     => 34.99,
                    'old_price' => 44.99,
                    'badge'     => 'Save 22%',
                    'img'       => 'clothing/Lift-The-World-T-Shirt-Red-1.jpg',
                    'url'       => '/product/lift-the-world-red-edition-t-shirt/',
                    'cat'       => 'clothing'
                ),
                array(
                    'name'      => 'Pro Coach Iron Tee (Red Back Print)',
                    'price'     => 34.99,
                    'old_price' => 44.99,
                    'badge'     => 'New Arrival',
                    'img'       => 'clothing/Red Pro Coach Iron Tee Back Print.png',
                    'url'       => '/product/pro-coach-red-iron-t-shirt/',
                    'cat'       => 'clothing'
                ),
                array(
                    'name'      => 'Strength Club T-Shirt (Red Design)',
                    'price'     => 34.99,
                    'old_price' => 44.99,
                    'badge'     => 'Limited',
                    'img'       => 'clothing/Black T-Shirt with Red Strength Club Design.png',
                    'url'       => '/product/strength-club-red-edition-t-shirt/',
                    'cat'       => 'clothing'
                ),
                array(
                    'name'      => 'Competition Knee Wraps (Red Edition)',
                    'price'     => 29.99,
                    'old_price' => 39.99,
                    'badge'     => 'Save 25%',
                    'img'       => 'Knee-Wrap-800x800.jpg',
                    'url'       => '/product/knee-wrap/',
                    'cat'       => 'knee'
                ),
                array(
                    'name'      => 'Padded Heavy Lifting Straps (Red)',
                    'price'     => 9.99,
                    'old_price' => 19.99,
                    'badge'     => 'Save 50%',
                    'img'       => '2-red-800x800.jpg',
                    'url'       => '/product/lifting-strap-padded-red/',
                    'cat'       => 'straps'
                ),
                array(
                    'name'      => 'Speed Ball Set Leather (Red & Black)',
                    'price'     => 24.99,
                    'old_price' => 39.99,
                    'badge'     => 'Save 38%',
                    'img'       => '1-1-2-800x800.jpg',
                    'url'       => '/product/speed-ball-set-maya-hide-leather-red-black/',
                    'cat'       => 'speed'
                ),
            )
        ),
        'black' => array(
            'label' => 'BLACK',
            'hex'   => '#18181b',
            'items' => array(
                array(
                    'name'      => 'Strength Club Oversized T-Shirt (Black)',
                    'price'     => 34.99,
                    'old_price' => 44.99,
                    'badge'     => 'Best Seller',
                    'img'       => 'clothing/Black NE3Sports Strength Club T-Shirt.png',
                    'url'       => '/product/strength-club-oversized-t-shirt/',
                    'cat'       => 'clothing'
                ),
                array(
                    'name'      => 'Lift The World Signature Black Tee',
                    'price'     => 34.99,
                    'old_price' => 44.99,
                    'badge'     => 'Athlete Series',
                    'img'       => 'clothing/Lift-The-World-T-Shirt-Black-1.jpg',
                    'url'       => '/product/lift-the-world-oversized-t-shirt/',
                    'cat'       => 'clothing'
                ),
                array(
                    'name'      => 'Pro Leather Lever Belt 10mm (Stealth Black)',
                    'price'     => 59.99,
                    'old_price' => 79.99,
                    'badge'     => 'Save 25%',
                    'img'       => 'DSC_0167-scaled-1.jpg',
                    'url'       => '/product/pro-leather-weightlifting-lever-belt-10mm/',
                    'cat'       => 'belts'
                ),
                array(
                    'name'      => 'Power Lifting Belt 13mm (Black Edition)',
                    'price'     => 69.99,
                    'old_price' => 89.99,
                    'badge'     => 'Pro Grade',
                    'img'       => 'WhatsApp-Image-2024-07-08-at-19.21.32_c020a8d1.jpg',
                    'url'       => '/product/competition-weightlifting-belt-13mm-black/',
                    'cat'       => 'belts'
                ),
                array(
                    'name'      => 'Weightlifting Dip Belt with Steel Chain',
                    'price'     => 64.99,
                    'old_price' => 84.99,
                    'badge'     => 'Save 24%',
                    'img'       => 'Dip-Belt-800x800.jpg',
                    'url'       => '/product/quick-release-lever-power-belt/',
                    'cat'       => 'belts'
                ),
                array(
                    'name'      => 'Lifting Straps Extra Padded (Stealth Black)',
                    'price'     => 9.99,
                    'old_price' => 19.99,
                    'badge'     => 'Save 50%',
                    'img'       => '1-800x800.jpg',
                    'url'       => '/product/lifting-straps-with-extra-padded-black/',
                    'cat'       => 'straps'
                ),
                array(
                    'name'      => 'Water Proof Gym Bag (Black Edition)',
                    'price'     => 11.99,
                    'old_price' => 14.99,
                    'badge'     => 'Save 20%',
                    'img'       => 'Gym-Bag-scaled.jpg',
                    'url'       => '/product/water-proof-gym-bag-black/',
                    'cat'       => 'bags'
                ),
                array(
                    'name'      => 'Ankle Strap Cable Pull (Black)',
                    'price'     => 11.99,
                    'old_price' => 14.99,
                    'badge'     => 'Save 20%',
                    'img'       => 'Ankle-Strap-Cable-pull-scaled.jpg',
                    'url'       => '/product/ankle-strap-black/',
                    'cat'       => 'ankle'
                ),
            )
        ),
        'blue' => array(
            'label' => 'BLUE',
            'hex'   => '#2563eb',
            'items' => array(
                array(
                    'name'      => 'Strength Club T-Shirt (Blue Logo)',
                    'price'     => 34.99,
                    'old_price' => 44.99,
                    'badge'     => 'Athletic Fit',
                    'img'       => 'clothing/Black NE3Sports Strength Club T-Shirt (1).png',
                    'url'       => '/product/strength-club-athletic-fit-t-shirt/',
                    'cat'       => 'clothing'
                ),
                array(
                    'name'      => 'Pro Coach Vintage Graphic T-Shirt (Navy Blue)',
                    'price'     => 34.99,
                    'old_price' => 44.99,
                    'badge'     => 'New Arrival',
                    'img'       => 'clothing/Vintage Navy Pro Coach T-Shirt Graphic.png',
                    'url'       => '/product/pro-coach-vintage-navy-t-shirt/',
                    'cat'       => 'clothing'
                ),
                array(
                    'name'      => 'Competition Knee Wraps (Speed Blue)',
                    'price'     => 29.99,
                    'old_price' => 39.99,
                    'badge'     => 'Save 25%',
                    'img'       => 'Knee-Wrap-9-800x800.jpg',
                    'url'       => '/product/knee-wrap-copy/',
                    'cat'       => 'knee'
                ),
                array(
                    'name'      => 'Padded Heavy Lifting Straps (Blue)',
                    'price'     => 9.99,
                    'old_price' => 14.99,
                    'badge'     => 'Save 33%',
                    'img'       => 'A2.jpg',
                    'url'       => '/product/lifting-strap-padded-blue/',
                    'cat'       => 'straps'
                ),
                array(
                    'name'      => 'Water Proof Gym Bag (Speed Blue)',
                    'price'     => 11.99,
                    'old_price' => 19.99,
                    'badge'     => 'Save 40%',
                    'img'       => 'Gym-Bag-8-800x800.jpg',
                    'url'       => '/product/water-proof-gym-bag-blue/',
                    'cat'       => 'bags'
                ),
                array(
                    'name'      => 'Barbell Squat Pad (Camo Blue)',
                    'price'     => 24.99,
                    'old_price' => 24.99,
                    'badge'     => 'Limited',
                    'img'       => 'DSC_0177-scaled-1.jpg',
                    'url'       => '/product/barbell-pad-camo-blue/',
                    'cat'       => 'pads'
                ),
                array(
                    'name'      => 'Ankle Strap Cable Pull (Camo Blue)',
                    'price'     => 11.99,
                    'old_price' => 14.99,
                    'badge'     => 'Save 20%',
                    'img'       => 'Ankle-Strap-Cable-pull-5-scaled.jpg',
                    'url'       => '/product/ankle-strap-camo-blue/',
                    'cat'       => 'ankle'
                ),
                array(
                    'name'      => 'Lifting Straps Padded (Royal Blue)',
                    'price'     => 9.99,
                    'old_price' => 19.99,
                    'badge'     => 'Save 50%',
                    'img'       => 'WhatsApp-Image-2024-07-08-at-19.20.29_ba3cfe08-800x800.jpg',
                    'url'       => '/product/lifting-straps-padded-blue-2/',
                    'cat'       => 'straps'
                ),
            )
        ),
        'green' => array(
            'label' => 'GREEN',
            'hex'   => '#15803d',
            'items' => array(
                array(
                    'name'      => 'Pro Coach Performance T-Shirt (Forest Green)',
                    'price'     => 34.99,
                    'old_price' => 44.99,
                    'badge'     => 'Save 22%',
                    'img'       => 'clothing/Procoach-T-Shirt-Green.png',
                    'url'       => '/product/pro-coach-oversized-t-shirt/',
                    'cat'       => 'clothing'
                ),
            )
        ),
        'grey' => array(
            'label' => 'GREY',
            'hex'   => '#71717a',
            'items' => array(
                array(
                    'name'      => 'Water Proof Gym Bag (Steel Gray)',
                    'price'     => 11.99,
                    'old_price' => 19.99,
                    'badge'     => 'Save 40%',
                    'img'       => 'Gym-Bag-9-800x800.jpg',
                    'url'       => '/product/water-proof-gym-bag-gray/',
                    'cat'       => 'bags'
                ),
                array(
                    'name'      => 'Barbell Squat Pad (Gray Camo)',
                    'price'     => 24.99,
                    'old_price' => 24.99,
                    'badge'     => 'Limited',
                    'img'       => 'Baerbell-Pad-scaled.jpg',
                    'url'       => '/product/barbell-pad-gray-camo/',
                    'cat'       => 'pads'
                ),
            )
        ),
        'gold' => array(
            'label' => 'GOLD',
            'hex'   => '#d97706',
            'items' => array(
                array(
                    'name'      => 'Speed Ball Set Leather (Black & Gold)',
                    'price'     => 24.99,
                    'old_price' => 39.99,
                    'badge'     => 'Save 38%',
                    'img'       => '1-1-800x800.jpg',
                    'url'       => '/product/speed-ball-set-maya-hide-leather/',
                    'cat'       => 'speed'
                ),
                array(
                    'name'      => 'Wrist Bandages 45cm (Black / Yellow)',
                    'price'     => 9.99,
                    'old_price' => 19.99,
                    'badge'     => 'Save 50%',
                    'img'       => 'Wrist-Bandage-3.jpg',
                    'url'       => '/product/wrist-bandages-45-cm-wrist-black/',
                    'cat'       => 'wrist'
                ),
            )
        )
    );
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
                'DSC_0167-scaled-1.jpg',
                'DSC_0166-scaled-1.jpg',
                'WhatsApp-Image-2024-07-08-at-19.21.32_c020a8d1.jpg',
                'WhatsApp-Image-2024-07-08-at-19.21.33_efbbace4.jpg'
            ),
            'colors' => array(
                array('name' => 'Black / White Stitch', 'color' => 'linear-gradient(135deg, #18181b 50%, #e4e4e7 50%)', 'img' => 'DSC_0167-scaled-1.jpg'),
                array('name' => 'Stealth Black',        'color' => '#18181b', 'img' => 'DSC_0166-scaled-1.jpg'),
                array('name' => 'Black / Royal Blue',   'color' => 'linear-gradient(135deg, #18181b 50%, #2563eb 50%)', 'img' => 'WhatsApp-Image-2024-07-08-at-19.21.32_c020a8d1.jpg')
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

    $is_clothing = (is_array($product) && isset($product['cat']) && $product['cat'] === 'clothing');

    if ($is_clothing) {
        return array(
            'gallery' => array($main, $hover),
            'colors'  => array(
                array('name' => 'Original', 'color' => '#18181b', 'img' => $main)
            ),
            'has_thickness' => false,
            'has_size'      => true,
            'size_label'    => 'Size:',
            'sizes'         => array(
                array('label' => 'S',   'val' => 'S (Chest 38" - 40")'),
                array('label' => 'M',   'val' => 'M (Chest 40" - 42")'),
                array('label' => 'L',   'val' => 'L (Chest 42" - 44")'),
                array('label' => 'XL',  'val' => 'XL (Chest 44" - 46")'),
                array('label' => 'XXL', 'val' => 'XXL (Chest 46" - 48")'),
            ),
            'has_size_guide'=> true,
            'pack_includes' => array(
                '1x NESPORTS3 ' . (is_array($product) ? $product['name'] : 'Oversized T-Shirt'),
                'Authentic Heavyweight Lifter Boxy Fit',
                'Official NESPORTS3 Quality Tag'
            ),
            'specs' => array(
                'Material'   => '100% Heavyweight Combed Cotton (240 GSM)',
                'Fit'        => 'Oversized Drop-Shoulder Boxy Fit',
                'Print'      => 'High-Density Textured Screen Print',
                'Pre-Shrunk' => 'Yes (Pre-washed for zero shrinkage)',
                'Care'       => 'Machine wash cold inside out, hang dry'
            )
        );
    }

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

