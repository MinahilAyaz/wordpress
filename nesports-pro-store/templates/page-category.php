<?php
/**
 * NESPORTS3 - Category & Collection Page Template
 * Matched exactly to Hardbody Store Collection reference (Screenshot 2)
 */
$current_page = 'category';
include NESPORTS_PLUGIN_DIR . 'templates/header-nesports.php';

$all_products = nesports_catalog();
$categories   = nesports_categories();

// Determine current category / collection slug from query or URL
$cat_slug = isset($_GET['cat']) ? sanitize_text_field($_GET['cat']) : '';

if (empty($cat_slug) && function_exists('get_queried_object')) {
    $qo = get_queried_object();
    if ($qo && isset($qo->slug)) {
        $cat_slug = $qo->slug;
    }
}

$is_collection = false;
$req_uri = !empty($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';

if (preg_match('~/(?:collections|collection)/([^/?#]+)~i', $req_uri, $m)) {
    $cat_slug = $m[1];
    $is_collection = true;
} elseif (preg_match('~/(?:product-category|category)/([^/?#]+)~i', $req_uri, $m)) {
    if (empty($cat_slug)) {
        $cat_slug = $m[1];
    }
}

if (empty($cat_slug)) {
    $cat_slug = getenv('NES_CAT') ?: 'all';
}

// Normalize slug from URL aliases
$aliases = array(
    'weightlifting-belts' => 'belts',
    'lifting-straps'      => 'straps',
    'knee-wrap'           => 'knee',
    'knee-wraps'          => 'knee',
    'elbow-wrap'          => 'elbow',
    'elbow-wraps'         => 'elbow',
    'wrist-straps'        => 'wrist',
    'wrist-bandages'      => 'wrist',
    'gym-bag'             => 'bags',
    'gym-bags'            => 'bags',
    'speed-ball'          => 'speed',
    'decoration'          => 'speed',
    'ankle-straps'        => 'ankle',
    'ankle-strap'         => 'ankle',
    'ankle'               => 'ankle',
    'barbell-pads'        => 'pads',
    'barbell-pad'         => 'pads',
    'pads'                => 'pads',
    'apparel'             => 'clothing',
    't-shirts'            => 'clothing',
    'shirts'              => 'clothing',
    'anime-drop'          => 'anime',
    'anime_collection'    => 'anime',
);
if (isset($aliases[$cat_slug])) {
    $cat_slug = $aliases[$cat_slug];
}

// Check if this is an authentic clothing collection
$collection_data = null;
if (function_exists('nesports_clothing_collections')) {
    $collection_data = nesports_clothing_collections($cat_slug);
    if ($collection_data) {
        $is_collection = true;
    }
}

// Category & Collection metadata
$cat_meta = array(
    'all'             => array('title' => 'All Products',              'desc' => 'Explore the complete line of NESPORTS3 competition gear, wraps, straps, and athletic equipment.'),
    'clothing'        => array('title' => 'Clothing & Apparel',        'desc' => 'Heavyweight oversized lifter t-shirts and signature graphic drops built for serious athletes.'),
    'strength-club'   => array('title' => 'Strength Club Collection',  'desc' => 'Heavyweight oversized lifter t-shirts featuring authentic NE3Sports Strength Club graphics.'),
    'lift-the-world'  => array('title' => 'Lift The World Collection', 'desc' => 'Signature athlete oversized tees built for heavyweight powerlifters and gym warriors.'),
    'anime'           => array('title' => 'Anime Collection',          'desc' => 'Limited edition oversized anime lifter graphics inspired by legendary battles.'),
    'son-of-the-west' => array('title' => 'Son Of The West Collection','desc' => 'Acid wash statement t-shirts engineered with distressed anime lifter artwork.'),
    'pro-coach'       => array('title' => 'Pro Coach Collection',      'desc' => 'Performance oversized tees with Born in Iron graphics for dedicated coaches and lifters.'),
    'belts'           => array('title' => 'Weightlifting Belts',       'desc' => 'Competition-grade leather and lever belts engineered for maximum core support.'),
    'straps'          => array('title' => 'Lifting Straps',            'desc' => 'Padded heavy-duty lifting straps built for heavy pulls, deadlifts, and maximum grip endurance.'),
    'knee'            => array('title' => 'Knee Wraps & Sleeves',      'desc' => 'Elastic reinforced knee wraps for maximum rebound, joint stabilization, and heavy squat support.'),
    'elbow'           => array('title' => 'Elbow Wraps',               'desc' => 'Compression support wraps designed to safeguard elbows during heavy bench and overhead pressing.'),
    'speed'           => array('title' => 'Speed Ball Sets',           'desc' => 'Genuine Maya Hide leather speed balls designed for boxing, reflex speed, and conditioning.'),
    'wrist'           => array('title' => 'Wrist Straps & Wraps',      'desc' => 'Rigid wrist support bandages designed for bench press, overhead lifts, and joint protection.'),
    'bags'            => array('title' => 'Gym Bags',                  'desc' => 'Durable waterproof gym backpacks and carryalls engineered for athletes.'),
    'ankle'           => array('title' => 'Ankle Straps & Loops',       'desc' => 'Heavy-duty padded ankle straps and foot loops engineered for cable machine glute kickbacks and leg curls.'),
    'pads'            => array('title' => 'Barbell Pads',              'desc' => 'High-density anti-slip neck and hip pads designed for comfortable, heavy squats and hip thrusts.'),
);

$current_meta = isset($cat_meta[$cat_slug]) ? $cat_meta[$cat_slug] : array(
    'title' => ucwords(str_replace('-', ' ', $cat_slug)),
    'desc'  => 'Official NESPORTS3 equipment engineered for relentless athletes.'
);

// Determine filtered products
if ($collection_data && !empty($collection_data['products'])) {
    $filtered_products = $collection_data['products'];
} elseif ($cat_slug === 'clothing') {
    $is_collection = true;
    // Combine all products from all collections
    $all_collections = nesports_clothing_collections();
    $filtered_products = array();
    foreach ($all_collections as $key => $col) {
        if (in_array($key, array('anime-drop', 'anime_collection'), true)) continue;
        foreach ($col['products'] as $prod) {
            $filtered_products[] = $prod;
        }
    }
} elseif ($cat_slug === 'all' || empty($cat_slug)) {
    $filtered_products = $all_products;
} else {
    $filtered_products = array_filter($all_products, function($p) use ($cat_slug) {
        return $p['cat'] === $cat_slug;
    });
}
?>

<style id="hb-collection-page-css">
.hb-collection-page {
    width: 100% !important;
    background: #ffffff !important;
    min-height: 80vh !important;
    box-sizing: border-box !important;
}

/* Hero Header matching Hardbody reference */
.hb-collection-page .hb-cat-hero,
.hb-category-page .hb-cat-hero,
.hb-cat-hero {
    background: #ffffff !important;
    color: #111111 !important;
    padding: 32px 32px 16px !important;
    max-width: 1440px !important;
    margin: 0 auto !important;
    width: 100% !important;
    box-sizing: border-box !important;
    text-align: left !important;
}
.hb-cat-hero-inner {
    max-width: 100% !important;
    margin: 0 !important;
    text-align: left !important;
}
.hb-breadcrumbs {
    font-size: 13.5px !important;
    color: #71717a !important;
    margin-bottom: 12px !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    font-family: var(--hb-font, 'Poppins', sans-serif) !important;
}
.hb-breadcrumbs a {
    color: #52525b !important;
    text-decoration: none !important;
    transition: color 0.2s ease !important;
}
.hb-breadcrumbs a:hover {
    color: #111111 !important;
}
.hb-bc-sep {
    color: #d4d4d8 !important;
}
.hb-bc-current {
    color: #111111 !important;
    font-weight: 500 !important;
}
.hb-cat-title {
    font-size: clamp(28px, 3.4vw, 42px) !important;
    font-weight: 700 !important;
    color: #111111 !important;
    margin: 0 !important;
    letter-spacing: -0.6px !important;
    font-family: var(--hb-font, 'Poppins', sans-serif) !important;
    line-height: 1.2 !important;
}

.hb-collection-toolbar {
    display: none !important;
}
.hb-toolbar-left {
    display: inline-flex !important;
    align-items: center !important;
    gap: 16px !important;
    flex-wrap: wrap !important;
}
.hb-btn-filters {
    display: inline-flex !important;
    align-items: center !important;
    gap: 8px !important;
    padding: 8px 22px !important;
    border-radius: 9999px !important;
    border: 1.5px solid #111111 !important;
    background: #ffffff !important;
    color: #111111 !important;
    font-size: 13.5px !important;
    font-weight: 600 !important;
    font-family: var(--hb-font, 'Poppins', sans-serif) !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
}
.hb-btn-filters:hover {
    background: #111111 !important;
    color: #ffffff !important;
}
.hb-sort-wrap {
    display: inline-flex !important;
    align-items: center !important;
    gap: 10px !important;
    font-size: 13.5px !important;
    color: #111111 !important;
    font-family: var(--hb-font, 'Poppins', sans-serif) !important;
    font-weight: 500 !important;
}
.hb-sort-select-pill {
    position: relative !important;
    display: inline-flex !important;
    align-items: center !important;
    padding: 7px 20px 7px 16px !important;
    border-radius: 9999px !important;
    border: 1.5px solid #111111 !important;
    background: #ffffff !important;
}
.hb-sort-select {
    appearance: none !important;
    -webkit-appearance: none !important;
    border: none !important;
    background: transparent !important;
    font-family: inherit !important;
    font-size: 13.5px !important;
    font-weight: 600 !important;
    color: #111111 !important;
    cursor: pointer !important;
    padding-right: 14px !important;
    outline: none !important;
}
.hb-sort-dot {
    font-size: 18px !important;
    line-height: 1 !important;
    color: #111111 !important;
    margin-left: -4px !important;
    pointer-events: none !important;
}

/* Category & Collection Pills */
.hb-cat-filter-bar {
    max-width: 1440px !important;
    margin: 0 auto 28px !important;
    padding: 0 32px !important;
    box-sizing: border-box !important;
}
.hb-cat-filter-inner {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    overflow-x: auto !important;
    scrollbar-width: none !important;
    padding-bottom: 4px !important;
}
.hb-cat-filter-inner::-webkit-scrollbar {
    display: none !important;
}
.hb-pill {
    padding: 7px 18px !important;
    border-radius: 9999px !important;
    font-size: 12.5px !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    text-decoration: none !important;
    background: #f4f4f5 !important;
    color: #27272a !important;
    border: 1px solid transparent !important;
    white-space: nowrap !important;
    transition: all 0.2s ease !important;
    font-family: var(--hb-font, 'Poppins', sans-serif) !important;
}
.hb-pill:hover,
.hb-pill.is-active {
    background: #111111 !important;
    color: #ffffff !important;
}
.hb-pill-divider {
    width: 1px !important;
    height: 20px !important;
    background: #e4e4e7 !important;
    display: inline-block !important;
    margin: 0 4px !important;
    flex-shrink: 0 !important;
}

/* 4-column Hardbody product grid matching Screenshot 2 */
.hb-cat-grid-section {
    max-width: 1440px !important;
    margin: 0 auto !important;
    padding: 0 32px 72px !important;
    box-sizing: border-box !important;
    width: 100% !important;
}
.hb-product-grid {
    display: grid !important;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 24px !important;
    width: 100% !important;
}
@media (max-width: 1100px) {
    .hb-product-grid {
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 20px !important;
    }
}
@media (max-width: 768px) {
    .hb-product-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 16px !important;
    }
    .hb-cat-hero,
    .hb-collection-toolbar,
    .hb-cat-filter-bar,
    .hb-cat-grid-section {
        padding-left: 16px !important;
        padding-right: 16px !important;
    }
}

/* Card Styling matching Hardbody Screenshot 2 */
.hb-card {
    background: #ffffff !important;
    border-radius: 18px !important;
    overflow: hidden !important;
    display: flex !important;
    flex-direction: column !important;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04) !important;
    border: 1px solid #f0f0f2 !important;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    position: relative !important;
}
.hb-card:hover {
    transform: translateY(-4px) !important;
    box-shadow: 0 12px 28px rgba(0,0,0,0.09) !important;
}
.hb-card-top-wrap {
    position: relative !important;
    width: 100% !important;
    aspect-ratio: 1 / 1.08 !important;
    background: #f7f7f8 !important;
    overflow: hidden !important;
    border-radius: 18px 18px 0 0 !important;
}
.hb-card-media {
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    position: relative !important;
    text-decoration: none !important;
}

/* Horizontal slide track with smooth left-to-right cubic-bezier transition */
.hb-card-slider-track {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    width: 100% !important;
    height: 100% !important;
    transform: translateX(0%);
    transition: transform 0.42s cubic-bezier(0.25, 1, 0.5, 1) !important;
    will-change: transform !important;
}
.hb-card-slide {
    flex: 0 0 100% !important;
    min-width: 100% !important;
    width: 100% !important;
    height: 100% !important;
    position: relative !important;
    overflow: hidden !important;
}
.hb-card-slide-img,
.hb-img-main {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    object-position: center !important;
    display: block !important;
    pointer-events: none !important;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.hb-card:hover .hb-card-slide-img,
.hb-card:hover .hb-img-main {
    transform: scale(1.025);
}

/* 3-dot interactive indicator matching Screenshot 2 */
.hb-card-dots-wrap {
    position: absolute !important;
    bottom: 8px !important;
    left: 0 !important;
    right: 0 !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    z-index: 6 !important;
    pointer-events: none !important;
}
.hb-card-dots {
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
    background: #ffffff !important;
    padding: 5px 12px !important;
    border-radius: 9999px !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12) !important;
    pointer-events: auto !important;
}
.hb-card-dot {
    width: 6px !important;
    height: 6px !important;
    border-radius: 50% !important;
    background: #d4d4d8 !important;
    border: none !important;
    padding: 0 !important;
    cursor: pointer !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.hb-card-dot:hover {
    background: #52525b !important;
}
.hb-card-dot.is-active {
    background: #111111 !important;
    transform: scale(1.35) !important;
}

/* Card Body inline layout matching Hardbody Screenshot 2 */
.hb-card-body {
    display: flex !important;
    justify-content: space-between !important;
    align-items: baseline !important;
    gap: 12px !important;
    padding: 16px 14px 18px !important;
    background: #ffffff !important;
    box-sizing: border-box !important;
}
.hb-card-title {
    margin: 0 !important;
    font-size: 14.5px !important;
    font-weight: 600 !important;
    line-height: 1.35 !important;
    color: #111111 !important;
    flex: 1 !important;
    font-family: var(--hb-font, 'Poppins', sans-serif) !important;
}
.hb-card-title a {
    color: inherit !important;
    text-decoration: none !important;
}
.hb-card-title a:hover {
    color: #dc2626 !important;
}
.hb-card-price {
    margin: 0 !important;
    font-size: 14.5px !important;
    font-weight: 500 !important;
    color: #111111 !important;
    white-space: nowrap !important;
    flex-shrink: 0 !important;
    font-family: var(--hb-font, 'Poppins', sans-serif) !important;
}
.hb-card-price.is-sale .now {
    font-weight: 600 !important;
    color: #dc2626 !important;
}
.hb-card-price.is-sale s {
    font-size: 12.5px !important;
    color: #a1a1aa !important;
    margin-left: 6px !important;
}

.hb-cat-empty {
    text-align: center !important;
    padding: 64px 20px !important;
    color: #71717a !important;
    grid-column: 1 / -1 !important;
}
.hb-empty-icon {
    font-size: 48px !important;
    margin-bottom: 16px !important;
    color: #d4d4d8 !important;
}
</style>

<?php
$page_id = get_queried_object_id();
if (!$page_id) {
    $page_id = get_the_ID();
}
$is_elementor = false;
if (class_exists('\Elementor\Plugin')) {
    if (\Elementor\Plugin::$instance->preview->is_preview_mode() 
        || \Elementor\Plugin::$instance->editor->is_edit_mode() 
        || isset($_GET['elementor-preview']) 
        || isset($_GET['preview'])) {
        $is_elementor = true;
    } elseif ($page_id && \Elementor\Plugin::$instance->db->is_built_with_elementor($page_id)) {
        $is_elementor = true;
    }
}

if ($is_elementor) :
?>
<main class="hb-category-page hb-collection-page elementor-entry-content" style="padding: 40px 20px; min-height: 400px;">
    <?php
    if (have_posts()) {
        while (have_posts()) {
            the_post();
            the_content();
        }
    } else {
        $post_obj = get_post($page_id);
        if ($post_obj) {
            setup_postdata($post_obj);
            the_content();
            wp_reset_postdata();
        } else {
            the_content();
        }
    }
    ?>
</main>
<?php else : ?>

<main class="hb-category-page hb-collection-page">
    <!-- Category / Collection Hero Banner -->
    <section class="hb-cat-hero">
        <div class="hb-cat-hero-inner">
            <nav class="hb-breadcrumbs" aria-label="Breadcrumb">
                <a href="<?php echo esc_url(home_url('/')); ?>">Home</a>
                <span class="hb-bc-sep">/</span>
                <?php if ($is_collection): ?>
                    <a href="<?php echo esc_url(home_url('/collections/clothing/')); ?>">Collections</a>
                <?php else: ?>
                    <a href="<?php echo esc_url(home_url('/#shop')); ?>">Categories</a>
                <?php endif; ?>
                <?php if ($cat_slug !== 'all'): ?>
                    <span class="hb-bc-sep">/</span>
                    <span class="hb-bc-current"><?php echo esc_html($current_meta['title']); ?></span>
                <?php endif; ?>
            </nav>

            <h1 class="hb-cat-title"><?php echo esc_html($current_meta['title']); ?></h1>
        </div>
    </section>



    <!-- Category / Collection Pills -->
    <div class="hb-cat-filter-bar">
        <div class="hb-cat-filter-inner">
            <?php if ($is_collection): ?>
                <a href="<?php echo esc_url(home_url('/collections/clothing/')); ?>" class="hb-pill hb-pill--master <?php echo ($cat_slug === 'clothing') ? 'is-active' : ''; ?>"><i class="fa-solid fa-shapes"></i> ALL CLOTHING</a>
                <span class="hb-pill-divider" aria-hidden="true"></span>
                <a href="<?php echo esc_url(home_url('/collections/strength-club/')); ?>" class="hb-pill <?php echo ($cat_slug === 'strength-club') ? 'is-active' : ''; ?>">STRENGTH CLUB</a>
                <a href="<?php echo esc_url(home_url('/collections/lift-the-world/')); ?>" class="hb-pill <?php echo ($cat_slug === 'lift-the-world') ? 'is-active' : ''; ?>">LIFT THE WORLD</a>
                <a href="<?php echo esc_url(home_url('/collections/anime/')); ?>" class="hb-pill <?php echo ($cat_slug === 'anime') ? 'is-active' : ''; ?>">ANIME</a>
                <a href="<?php echo esc_url(home_url('/collections/son-of-the-west/')); ?>" class="hb-pill <?php echo ($cat_slug === 'son-of-the-west') ? 'is-active' : ''; ?>">SON OF THE WEST</a>
                <a href="<?php echo esc_url(home_url('/collections/pro-coach/')); ?>" class="hb-pill <?php echo ($cat_slug === 'pro-coach') ? 'is-active' : ''; ?>">PRO COACH</a>
            <?php else: ?>
                <a href="<?php echo esc_url(home_url('/shop/')); ?>" class="hb-pill hb-pill--master <?php echo ($cat_slug === 'all' || empty($cat_slug)) ? 'is-active' : ''; ?>"><i class="fa-solid fa-shapes"></i> ALL PRODUCTS</a>
                <span class="hb-pill-divider" aria-hidden="true"></span>
                <a href="<?php echo esc_url(home_url('/collections/clothing/')); ?>" class="hb-pill <?php echo ($cat_slug === 'clothing') ? 'is-active' : ''; ?>">CLOTHING</a>
                <a href="<?php echo esc_url(home_url('/product-category/weightlifting-belts/')); ?>" class="hb-pill <?php echo ($cat_slug === 'belts') ? 'is-active' : ''; ?>">BELTS</a>
                <a href="<?php echo esc_url(home_url('/product-category/lifting-straps/')); ?>" class="hb-pill <?php echo ($cat_slug === 'straps') ? 'is-active' : ''; ?>">LIFTING STRAPS</a>
                <a href="<?php echo esc_url(home_url('/product-category/knee-wrap/')); ?>" class="hb-pill <?php echo ($cat_slug === 'knee') ? 'is-active' : ''; ?>">KNEE WRAPS</a>
                <a href="<?php echo esc_url(home_url('/product-category/elbow-wrap/')); ?>" class="hb-pill <?php echo ($cat_slug === 'elbow') ? 'is-active' : ''; ?>">ELBOW WRAPS</a>
                <a href="<?php echo esc_url(home_url('/category/decoration/')); ?>" class="hb-pill <?php echo ($cat_slug === 'speed') ? 'is-active' : ''; ?>">SPEED BALL</a>
                <a href="<?php echo esc_url(home_url('/product-category/wrist-straps/')); ?>" class="hb-pill <?php echo ($cat_slug === 'wrist') ? 'is-active' : ''; ?>">WRIST WRAPS</a>
                <a href="<?php echo esc_url(home_url('/product-category/gym-bag/')); ?>" class="hb-pill <?php echo ($cat_slug === 'bags') ? 'is-active' : ''; ?>">GYM BAGS</a>
                <a href="<?php echo esc_url(home_url('/product-category/ankle-straps/')); ?>" class="hb-pill <?php echo ($cat_slug === 'ankle') ? 'is-active' : ''; ?>">ANKLE STRAPS</a>
                <a href="<?php echo esc_url(home_url('/product-category/barbell-pads/')); ?>" class="hb-pill <?php echo ($cat_slug === 'pads') ? 'is-active' : ''; ?>">BARBELL PADS</a>
            <?php endif; ?>
        </div>
    </div>

    <!-- 4-Column Product Grid -->
    <section class="hb-cat-grid-section">
        <div class="hb-cat-grid-inner">
            <?php if (empty($filtered_products)): ?>
                <div class="hb-cat-empty">
                    <i class="fa-solid fa-box-open hb-empty-icon"></i>
                    <h3>No products found</h3>
                    <p>We are currently restocking this collection. Check out our other popular collections.</p>
                    <a href="<?php echo esc_url(home_url('/collections/clothing/')); ?>" class="hb-btn-red">VIEW ALL CLOTHING</a>
                </div>
            <?php else: ?>
                <div class="hb-product-grid" id="hb-product-grid">
                    <?php foreach ($filtered_products as $p):
                        $url      = !empty($p['url']) ? home_url($p['url']) : home_url('/product/' . $p['slug'] . '/');
                        $has_sub  = !empty($p['images']) && is_array($p['images']) && count($p['images']) > 1;
                        $main_src = $has_sub ? nesports_img($p['images'][0]) : nesports_img(isset($p['main']) ? $p['main'] : '');
                        $on_sale  = isset($p['old']) && $p['old'] > $p['price'];
                        $price    = (float) $p['price'];
                        $name     = $p['name'];
                    ?>
                    <article class="hb-card" data-slug="<?php echo esc_attr($p['slug']); ?>" data-name="<?php echo esc_attr($name); ?>" data-price="<?php echo esc_attr($price); ?>">
                        <div class="hb-card-top-wrap">
                            <a class="hb-card-media" href="<?php echo esc_url($url); ?>">
                                <?php if ($has_sub): ?>
                                    <div class="hb-card-slider-track">
                                        <?php foreach ($p['images'] as $idx => $img_path): ?>
                                        <div class="hb-card-slide" data-idx="<?php echo $idx; ?>">
                                            <img class="hb-card-slide-img" src="<?php echo esc_url(nesports_img($img_path)); ?>" alt="<?php echo esc_attr($name); ?>" loading="lazy">
                                        </div>
                                        <?php endforeach; ?>
                                    </div>
                                <?php else: ?>
                                    <img class="hb-img-main" src="<?php echo esc_url($main_src); ?>" alt="<?php echo esc_attr($name); ?>" loading="lazy">
                                <?php endif; ?>
                            </a>

                            <?php if ($has_sub): ?>
                            <!-- 3 Sub-images Dots Indicator matching Screenshot 2 -->
                            <div class="hb-card-dots-wrap">
                                <div class="hb-card-dots">
                                    <?php foreach ($p['images'] as $idx => $img_path): ?>
                                    <button type="button" class="hb-card-dot<?php echo $idx === 0 ? ' is-active' : ''; ?>" data-idx="<?php echo $idx; ?>" aria-label="Photo <?php echo $idx + 1; ?>"></button>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                            <?php endif; ?>
                        </div>
                        <div class="hb-card-body">
                            <h3 class="hb-card-title"><a href="<?php echo esc_url($url); ?>"><?php echo esc_html($name); ?></a></h3>
                            <div class="hb-card-price<?php echo $on_sale ? ' is-sale' : ''; ?>">
                                <span class="now"><?php echo esc_html(nesports_money($price)); ?></span>
                                <?php if ($on_sale): ?><s><?php echo esc_html(nesports_money($p['old'])); ?></s><?php endif; ?>
                            </div>
                        </div>
                    </article>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </section>
</main>
<?php endif; ?>
<script>
(function() {
    function initCardSliders() {
        var cards = document.querySelectorAll('.hb-card');
        cards.forEach(function(card) {
            var track = card.querySelector('.hb-card-slider-track');
            if (!track) return;
            var slides = card.querySelectorAll('.hb-card-slide');
            var dots = card.querySelectorAll('.hb-card-dot');
            var count = slides.length;
            if (count <= 1) return;

            var currentIdx = 0;

            function goTo(index) {
                if (index < 0) index = 0;
                if (index >= count) index = count - 1;
                if (currentIdx === index && track.style.transform === 'translateX(-' + (index * 100) + '%)') {
                    return;
                }
                currentIdx = index;
                track.style.transform = 'translateX(-' + (index * 100) + '%)';
                dots.forEach(function(d, i) {
                    if (i === index) {
                        d.classList.add('is-active');
                    } else {
                        d.classList.remove('is-active');
                    }
                });
            }

            // Left-to-right cursor movement scrubs through slides (Hardbody SecondaryMedia logic)
            card.addEventListener('mousemove', function(e) {
                var rect = card.getBoundingClientRect();
                var mouseX = e.clientX - rect.left;
                var width = rect.width;
                if (width <= 0) return;

                var targetIndex = 0;
                if (count === 2) {
                    targetIndex = (mouseX < width * 0.5) ? 0 : 1;
                } else if (count === 3) {
                    if (mouseX < width * 0.33) {
                        targetIndex = 0;
                    } else if (mouseX < width * 0.67) {
                        targetIndex = 1;
                    } else {
                        targetIndex = 2;
                    }
                } else {
                    targetIndex = Math.min(count - 1, Math.floor((mouseX / width) * count));
                }

                goTo(targetIndex);
            });

            // Mouse leaves the shirt card: smoothly slides back to the first image
            card.addEventListener('mouseleave', function() {
                goTo(0);
            });

            // Dot hover & click
            dots.forEach(function(dot) {
                function activate(e) {
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    var idx = parseInt(dot.getAttribute('data-idx') || '0', 10);
                    goTo(idx);
                }
                dot.addEventListener('mouseenter', activate);
                dot.addEventListener('click', activate);
            });

            // Touch swipe support for mobile
            var touchStartX = 0;
            card.addEventListener('touchstart', function(e) {
                if (e.touches && e.touches[0]) {
                    touchStartX = e.touches[0].clientX;
                }
            }, { passive: true });

            card.addEventListener('touchend', function(e) {
                if (e.changedTouches && e.changedTouches[0]) {
                    var diffX = e.changedTouches[0].clientX - touchStartX;
                    if (Math.abs(diffX) > 35) {
                        if (diffX < 0) {
                            goTo(currentIdx + 1);
                        } else {
                            goTo(currentIdx - 1);
                        }
                    }
                }
            }, { passive: true });
        });

        // Filter button toggle
        var btnFilters = document.getElementById('hb-btn-filters');
        if (btnFilters) {
            btnFilters.addEventListener('click', function() {
                var bar = document.querySelector('.hb-cat-filter-bar');
                if (bar) {
                    bar.style.display = (bar.style.display === 'none') ? 'block' : 'none';
                }
            });
        }

        // Sort dropdown handler
        var sortSelect = document.getElementById('hb-sort-select');
        var grid = document.getElementById('hb-product-grid');
        if (sortSelect && grid) {
            sortSelect.addEventListener('change', function() {
                var val = this.value;
                var cards = Array.from(grid.querySelectorAll('.hb-card'));
                if (val === 'price-asc') {
                    cards.sort(function(a, b) {
                        return parseFloat(a.dataset.price || 0) - parseFloat(b.dataset.price || 0);
                    });
                } else if (val === 'price-desc') {
                    cards.sort(function(a, b) {
                        return parseFloat(b.dataset.price || 0) - parseFloat(a.dataset.price || 0);
                    });
                } else if (val === 'title-asc') {
                    cards.sort(function(a, b) {
                        return (a.dataset.name || '').localeCompare(b.dataset.name || '');
                    });
                } else if (val === 'title-desc') {
                    cards.sort(function(a, b) {
                        return (b.dataset.name || '').localeCompare(a.dataset.name || '');
                    });
                }
                cards.forEach(function(card) { grid.appendChild(card); });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCardSliders);
    } else {
        initCardSliders();
    }
})();
</script>

<?php include NESPORTS_PLUGIN_DIR . 'templates/footer-nesports.php'; ?>
