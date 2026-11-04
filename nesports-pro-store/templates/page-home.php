<?php
/**
 * NESPORTS3 - Page 1: Home (layout matched to hardbody.store, content from nesports3.com)
 */
include NESPORTS_PLUGIN_DIR . 'templates/header-nesports.php';

// Hero slides: 100% Authentic Gym Photoshoot Series (Ultra High-Res 2560x1703 DSLR Photography)
$hero_slides = array(
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

$products     = nesports_catalog();
$categories   = nesports_categories();
$collections  = nesports_collections();
$bundles      = nesports_bundles();
$bundle_tabs  = nesports_bundle_tabs();
?>

<main class="hb-main">

    <!-- HERO CAROUSEL -->
    <section class="hb-hero" id="hb-hero">
        <div class="hb-hero-track" id="hb-hero-track">
            <?php foreach ($hero_slides as $i => $s): ?>
            <div class="hb-hero-slide hb-hero-slide--<?php echo esc_attr($s['type']); ?><?php echo $i === 0 ? ' is-active' : ''; ?>">
                <span class="hb-hero-watermark" aria-hidden="true">NESPORTS3</span>
                
                <div class="hb-hero-media">
                    <img src="<?php echo esc_url(nesports_img($s['img'])); ?>" alt="<?php echo esc_attr($s['title']); ?>"<?php echo $i > 0 ? ' loading="lazy"' : ''; ?>>
                </div>

                <div class="hb-hero-caption">
                    <span class="hb-hero-sub"><?php echo esc_html($s['sub']); ?></span>
                    <h2 class="hb-hero-title"><?php echo esc_html($s['title']); ?></h2>
                    
                    <?php if (!empty($s['desc'])): ?>
                        <p class="hb-hero-desc"><?php echo esc_html($s['desc']); ?></p>
                    <?php endif; ?>

                    <div class="hb-hero-bottom-row">
                        <a href="<?php echo esc_url(home_url($s['url'])); ?>" class="hb-hero-btn hb-hero-btn--red">SHOP NOW</a>
                        <a href="<?php echo esc_url(home_url('/shop/')); ?>" class="hb-hero-btn hb-hero-btn--white">VIEW ALL PRODUCTS</a>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <div class="hb-hero-dots" id="hb-hero-dots">
            <?php foreach ($hero_slides as $i => $s): ?>
                <button type="button" class="<?php echo $i === 0 ? 'is-active' : ''; ?>" data-slide="<?php echo (int) $i; ?>" aria-label="Slide <?php echo (int) $i + 1; ?>"></button>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- PRODUCT SLIDER WITH FILTER PILLS -->
    <section class="hb-collection" id="shop" data-slider>
        <div class="hb-collection-bar">
            <div class="hb-pills">
                <button type="button" class="hb-pill is-active" data-filter="all">ALL PRODUCTS</button>
                <?php foreach ($categories as $key => $label): ?>
                    <button type="button" class="hb-pill" data-filter="<?php echo esc_attr($key); ?>"><?php echo esc_html($label); ?></button>
                <?php endforeach; ?>
            </div>
            <div class="hb-slider-arrows">
                <button type="button" class="hb-prev" aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button>
                <button type="button" class="hb-next" aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
        </div>

        <div class="hb-cards">
            <?php foreach ($products as $p):
                $url     = home_url('/product/' . $p['slug'] . '/');
                $on_sale = $p['old'] > $p['price'];
                $pct     = $on_sale ? round((1 - $p['price'] / $p['old']) * 100) : 0; ?>
            <article class="hb-card" data-cat="<?php echo esc_attr($p['cat']); ?>">
                <div class="hb-card-top-wrap">
                    <a class="hb-card-media" href="<?php echo esc_url($url); ?>">
                        <?php if ($on_sale): ?>
                            <span class="hb-card-badge">Sale</span>
                        <?php endif; ?>
                        <img class="hb-img-main" src="<?php echo esc_url(nesports_img($p['main'])); ?>" alt="<?php echo esc_attr($p['name']); ?>" loading="lazy">
                        <img class="hb-img-hover" src="<?php echo esc_url(nesports_img($p['hover'])); ?>" alt="" loading="lazy">
                    </a>
                    <button type="button" class="hb-card-quick-add" data-id="<?php echo esc_attr($p['slug']); ?>" data-name="<?php echo esc_attr($p['name']); ?>" data-price="<?php echo esc_attr($p['price']); ?>" data-img="<?php echo esc_url(nesports_img($p['main'])); ?>" aria-label="Add <?php echo esc_attr($p['name']); ?> to cart">
                        Add to cart
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
    </section>

    <!-- STOCKHOLM 103 MID-PAGE STATIC PARALLAX BANNER -->
    <section class="hb-static-banner" style="--static-bg: url('<?php echo esc_url(nesports_img('DSC_2246-scaled.jpg')); ?>');">
        <div class="hb-static-banner-overlay"></div>
        <div class="hb-static-banner-content">
            <span class="hb-static-banner-eyebrow">STRENGTH ISN'T GIVEN. IT'S EARNED.</span>
            <h2 class="hb-static-banner-title">BUILT FOR PROGRESS.<br>ENGINEERED TO ENDURE.</h2>
            <div class="hb-static-banner-action">
                <a class="hb-static-play-btn" href="<?php echo esc_url(home_url('/our-story/')); ?>" aria-label="Explore our story">
                    <span class="hb-static-play-icon">
                        <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.5 13.134C23.1667 13.5189 23.1667 14.4811 22.5 14.866L3 26.1244C2.33333 26.5093 1.5 26.0281 1.5 25.2583L1.5 2.74167C1.5 1.97187 2.33333 1.49074 3 1.87564L22.5 13.134Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                        </svg>
                    </span>
                    <span class="hb-static-play-label">OUR STORY</span>
                </a>
            </div>
        </div>
    </section>

    <!-- FEATURED COLLECTIONS (4 Clean Aesthetic Category Cards) -->
    <section class="hb-collections-section" id="collections">
        <div class="hb-section-header">
            <span class="hb-section-eyebrow">SHOP BY CATEGORY</span>
            <h2 class="hb-section-title">Curated Collections</h2>
            <p class="hb-section-sub">Explore our core product lines built for competitive lifting and high-intensity training.</p>
        </div>
        <div class="hb-category-grid">
            <?php foreach ($collections as $c): ?>
            <a class="hb-category-card" href="<?php echo esc_url(home_url($c['url'])); ?>">
                <div class="hb-category-media">
                    <img src="<?php echo esc_url(nesports_img($c['img'])); ?>" alt="<?php echo esc_attr($c['title']); ?>" loading="lazy">
                </div>
                <div class="hb-category-info">
                    <h3 class="hb-category-title"><?php echo esc_html($c['title']); ?></h3>
                    <p class="hb-category-sub"><?php echo esc_html($c['sub']); ?></p>
                    <span class="hb-category-link"><?php echo esc_html($c['action']); ?> <i class="fa-solid fa-arrow-right"></i></span>
                </div>
            </a>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- CURATED BUNDLES (Clean Scandinavian Layout) -->
    <section class="hb-bundles-section" id="bundles" data-slider>
        <div class="hb-section-header">
            <span class="hb-section-eyebrow">SAVE 15% ON TRAINING KITS</span>
            <h2 class="hb-section-title">Power Packs &amp; Bundles</h2>
            <p class="hb-section-sub">Essential gear combinations engineered to work together. Hand-picked and bundled with exclusive savings.</p>
        </div>
        <div class="hb-pills hb-pills--center">
            <button type="button" class="hb-pill is-active" data-filter="all">ALL PACKS</button>
            <?php foreach ($bundle_tabs as $key => $label): ?>
                <button type="button" class="hb-pill" data-filter="<?php echo esc_attr($key); ?>"><?php echo esc_html($label); ?></button>
            <?php endforeach; ?>
        </div>
        <div class="hb-cards hb-cards--center">
            <?php foreach ($bundles as $b):
                $pct = round((1 - $b['price'] / $b['old']) * 100); ?>
            <article class="hb-card" data-cat="<?php echo esc_attr($b['cat']); ?>">
                <div class="hb-card-top-wrap">
                    <a class="hb-card-media hb-card-media--pair" href="<?php echo esc_url(home_url($b['url'])); ?>">
                        <span class="hb-card-badge">Save <?php echo (int) $pct; ?>%</span>
                        <img class="hb-pair-a" src="<?php echo esc_url(nesports_img($b['imgs'][0])); ?>" alt="" loading="lazy">
                        <img class="hb-pair-b" src="<?php echo esc_url(nesports_img($b['imgs'][1])); ?>" alt="" loading="lazy">
                    </a>
                    <button type="button" class="hb-card-quick-add" data-id="<?php echo esc_attr('bundle-' . $b['cat']); ?>" data-name="<?php echo esc_attr($b['name']); ?>" data-price="<?php echo esc_attr($b['price']); ?>" data-img="<?php echo esc_url(nesports_img($b['imgs'][0])); ?>" aria-label="Add <?php echo esc_attr($b['name']); ?> to cart">
                        Add to cart
                    </button>
                </div>
                <div class="hb-card-body">
                    <h3 class="hb-card-title"><a href="<?php echo esc_url(home_url($b['url'])); ?>"><?php echo esc_html($b['name']); ?></a></h3>
                    <div class="hb-card-price is-sale">
                        <span class="now"><?php echo esc_html(nesports_money($b['price'])); ?></span>
                        <s><?php echo esc_html(nesports_money($b['old'])); ?></s>
                    </div>
                </div>
            </article>
            <?php endforeach; ?>
        </div>
    </section>

</main>

<?php include NESPORTS_PLUGIN_DIR . 'templates/footer-nesports.php'; ?>
