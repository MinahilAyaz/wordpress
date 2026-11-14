<?php
/**
 * NESPORTS3 - Category & Shop Page Template
 */
$current_page = 'category';
include NESPORTS_PLUGIN_DIR . 'templates/header-nesports.php';

$all_products = nesports_catalog();
$categories   = nesports_categories();

// Determine current category from query, WordPress queried object, or URL path
$cat_slug = isset($_GET['cat']) ? sanitize_text_field($_GET['cat']) : '';

if (empty($cat_slug) && function_exists('get_queried_object')) {
    $qo = get_queried_object();
    if ($qo && isset($qo->slug)) {
        $cat_slug = $qo->slug;
    }
}

if (empty($cat_slug) && !empty($_SERVER['REQUEST_URI'])) {
    if (preg_match('#/product-category/([^/?#]+)#i', $_SERVER['REQUEST_URI'], $m)) {
        $cat_slug = $m[1];
    } elseif (preg_match('#/category/([^/?#]+)#i', $_SERVER['REQUEST_URI'], $m)) {
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
    'clothing'            => 'clothing',
    'apparel'             => 'clothing',
    't-shirts'            => 'clothing',
    'shirts'              => 'clothing',
);
if (isset($aliases[$cat_slug])) {
    $cat_slug = $aliases[$cat_slug];
}

// Category descriptions
$cat_meta = array(
    'all'      => array('title' => 'All Products',          'desc' => 'Explore the complete line of NESPORTS3 competition gear, wraps, straps, and athletic equipment.'),
    'clothing' => array('title' => 'Clothing & Apparel',    'desc' => 'Heavyweight oversized lifter t-shirts and signature graphic drops built for serious athletes.'),
    'belts'    => array('title' => 'Weightlifting Belts',   'desc' => 'Competition-grade leather and lever belts engineered for maximum core support.'),
    'straps'   => array('title' => 'Lifting Straps',        'desc' => 'Padded heavy-duty lifting straps built for heavy pulls, deadlifts, and maximum grip endurance.'),
    'knee'     => array('title' => 'Knee Wraps & Sleeves',  'desc' => 'Elastic reinforced knee wraps for maximum rebound, joint stabilization, and heavy squat support.'),
    'elbow'    => array('title' => 'Elbow Wraps',           'desc' => 'Compression support wraps designed to safeguard elbows during heavy bench and overhead pressing.'),
    'speed'    => array('title' => 'Speed Ball Sets',       'desc' => 'Genuine Maya Hide leather speed balls designed for boxing, reflex speed, and conditioning.'),
    'wrist'    => array('title' => 'Wrist Straps & Wraps',  'desc' => 'Rigid wrist support bandages designed for bench press, overhead lifts, and joint protection.'),
    'bags'     => array('title' => 'Gym Bags',              'desc' => 'Durable waterproof gym backpacks and carryalls engineered for athletes.'),
    'ankle'    => array('title' => 'Ankle Straps & Loops',   'desc' => 'Heavy-duty padded ankle straps and foot loops engineered for cable machine glute kickbacks and leg curls.'),
    'pads'     => array('title' => 'Barbell Pads',          'desc' => 'High-density anti-slip neck and hip pads designed for comfortable, heavy squats and hip thrusts.'),
);

$current_meta = isset($cat_meta[$cat_slug]) ? $cat_meta[$cat_slug] : array(
    'title' => ucwords(str_replace('-', ' ', $cat_slug)),
    'desc'  => 'Official NESPORTS3 equipment engineered for relentless athletes.'
);

// Filter products
if ($cat_slug === 'all' || empty($cat_slug)) {
    $filtered_products = $all_products;
} else {
    $filtered_products = array_filter($all_products, function($p) use ($cat_slug) {
        return $p['cat'] === $cat_slug;
    });
}
?>

<?php if (empty($_GET['cat']) && function_exists('the_content') && did_action('elementor/loaded') && is_page() && (isset($_GET['elementor-preview']) || get_post_meta(get_the_ID(), '_nesports_elementor_seeded', true))) : ?>
<main class="hb-category-page">
    <section class="hb-cat-hero">
        <div class="hb-cat-hero-inner">
            <nav class="hb-breadcrumbs" aria-label="Breadcrumb">
                <a href="<?php echo esc_url(home_url('/')); ?>">Home</a>
                <span class="hb-bc-sep">/</span>
                <span class="hb-bc-current"><?php echo esc_html($current_meta['title']); ?></span>
            </nav>
            <h1 class="hb-cat-title"><?php echo esc_html($current_meta['title']); ?></h1>
        </div>
    </section>
    <?php
    while (have_posts()) :
        the_post();
        the_content();
    endwhile;
    ?>
</main>
<?php else : ?>
<main class="hb-category-page">
    <!-- Category Hero Banner -->
    <section class="hb-cat-hero">
        <div class="hb-cat-hero-inner">
            <nav class="hb-breadcrumbs" aria-label="Breadcrumb">
                <a href="<?php echo esc_url(home_url('/')); ?>">Home</a>
                <span class="hb-bc-sep">/</span>
                <a href="<?php echo esc_url(home_url('/#shop')); ?>">Categories</a>
                <?php if ($cat_slug !== 'all'): ?>
                    <span class="hb-bc-sep">/</span>
                    <span class="hb-bc-current"><?php echo esc_html($current_meta['title']); ?></span>
                <?php endif; ?>
            </nav>

            <h1 class="hb-cat-title"><?php echo esc_html($current_meta['title']); ?></h1>
        </div>
    </section>

    <!-- Category Pills Filter Bar -->
    <div class="hb-cat-filter-bar">
        <div class="hb-cat-filter-inner">
            <a href="<?php echo esc_url(home_url('/shop/')); ?>" class="hb-pill hb-pill--master <?php echo ($cat_slug === 'all' || empty($cat_slug)) ? 'is-active' : ''; ?>"><i class="fa-solid fa-shapes"></i> ALL PRODUCTS</a>
            <span class="hb-pill-divider" aria-hidden="true"></span>
            <a href="<?php echo esc_url(home_url('/product-category/clothing/')); ?>" class="hb-pill <?php echo ($cat_slug === 'clothing') ? 'is-active' : ''; ?>">CLOTHING</a>
            <a href="<?php echo esc_url(home_url('/product-category/weightlifting-belts/')); ?>" class="hb-pill <?php echo ($cat_slug === 'belts') ? 'is-active' : ''; ?>">BELTS</a>
            <a href="<?php echo esc_url(home_url('/product-category/lifting-straps/')); ?>" class="hb-pill <?php echo ($cat_slug === 'straps') ? 'is-active' : ''; ?>">LIFTING STRAPS</a>
            <a href="<?php echo esc_url(home_url('/product-category/knee-wrap/')); ?>" class="hb-pill <?php echo ($cat_slug === 'knee') ? 'is-active' : ''; ?>">KNEE WRAPS</a>
            <a href="<?php echo esc_url(home_url('/product-category/elbow-wrap/')); ?>" class="hb-pill <?php echo ($cat_slug === 'elbow') ? 'is-active' : ''; ?>">ELBOW WRAPS</a>
            <a href="<?php echo esc_url(home_url('/category/decoration/')); ?>" class="hb-pill <?php echo ($cat_slug === 'speed') ? 'is-active' : ''; ?>">SPEED BALL</a>
            <a href="<?php echo esc_url(home_url('/product-category/wrist-straps/')); ?>" class="hb-pill <?php echo ($cat_slug === 'wrist') ? 'is-active' : ''; ?>">WRIST WRAPS</a>
            <a href="<?php echo esc_url(home_url('/product-category/gym-bag/')); ?>" class="hb-pill <?php echo ($cat_slug === 'bags') ? 'is-active' : ''; ?>">GYM BAGS</a>
            <a href="<?php echo esc_url(home_url('/product-category/ankle-straps/')); ?>" class="hb-pill <?php echo ($cat_slug === 'ankle') ? 'is-active' : ''; ?>">ANKLE STRAPS</a>
            <a href="<?php echo esc_url(home_url('/product-category/barbell-pads/')); ?>" class="hb-pill <?php echo ($cat_slug === 'pads') ? 'is-active' : ''; ?>">BARBELL PADS</a>
        </div>
    </div>

    <!-- Product Grid -->
    <section class="hb-cat-grid-section">
        <div class="hb-cat-grid-inner">
            <?php if (empty($filtered_products)): ?>
                <div class="hb-cat-empty">
                    <i class="fa-solid fa-box-open hb-empty-icon"></i>
                    <h3>No products found</h3>
                    <p>We are currently restocking this category. Check out our other popular categories below.</p>
                    <a href="<?php echo esc_url(home_url('/#shop')); ?>" class="hb-btn-red">VIEW ALL GEAR</a>
                </div>
            <?php else: ?>
                <div class="hb-product-grid">
                    <?php foreach ($filtered_products as $p):
                        $url     = home_url('/product/' . $p['slug'] . '/');
                        $on_sale = $p['old'] > $p['price'];
                        $pct     = $on_sale ? round((1 - $p['price'] / $p['old']) * 100) : 0; ?>
                    <article class="hb-card">
                        <div class="hb-card-top-wrap">
                            <a class="hb-card-media" href="<?php echo esc_url($url); ?>">
                                <img class="hb-img-main" src="<?php echo esc_url(nesports_img($p['main'])); ?>" alt="<?php echo esc_attr($p['name']); ?>" loading="lazy">
                                <img class="hb-img-hover" src="<?php echo esc_url(nesports_img($p['hover'])); ?>" alt="" loading="lazy">
                            </a>
                            <button type="button" class="hb-card-quick-add" data-id="<?php echo esc_attr($p['slug']); ?>" data-name="<?php echo esc_attr($p['name']); ?>" data-price="<?php echo esc_attr($p['price']); ?>" data-img="<?php echo esc_url(nesports_img($p['main'])); ?>" aria-label="Add <?php echo esc_attr($p['name']); ?> to cart">
                                <i class="fa-solid fa-plus"></i> Add to cart
                            </button>
                        </div>
                        <div class="hb-card-body">
                            <h3 class="hb-card-title"><a href="<?php echo esc_url($url); ?>"><?php echo esc_html($p['name']); ?></a></h3>
                            <div class="hb-card-price<?php echo $on_sale ? ' is-sale' : ''; ?>">
                                <span class="now"><?php echo esc_html(nesports_money($p['price'])); ?></span>
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

<?php include NESPORTS_PLUGIN_DIR . 'templates/footer-nesports.php'; ?>

