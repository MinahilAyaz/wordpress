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

    <!-- HERO CAROUSEL (neighbouring slides peek at both edges) -->
    <section class="hb-hero" id="hb-hero">
        <div class="hb-hero-track" id="hb-hero-track">
            <?php foreach ($hero_slides as $i => $s): ?>
            <a class="hb-hero-slide hb-hero-slide--<?php echo esc_attr($s['type']); ?><?php echo $i === 0 ? ' is-active' : ''; ?>" href="<?php echo esc_url(home_url($s['url'])); ?>">
                <span class="hb-hero-watermark" aria-hidden="true">NESPORTS3</span>
                
                <div class="hb-hero-media">
                    <img src="<?php echo esc_url(nesports_img($s['img'])); ?>" alt="<?php echo esc_attr($s['title']); ?>"<?php echo $i > 0 ? ' loading="lazy"' : ''; ?>>
                </div>

                <div class="hb-hero-caption">
                    <?php if (!empty($s['badge'])): ?>
                        <span class="hb-hero-badge"><i class="fa-solid fa-bolt"></i> <?php echo esc_html($s['badge']); ?></span>
                    <?php endif; ?>

                    <span class="hb-hero-sub"><?php echo esc_html($s['sub']); ?></span>
                    <strong class="hb-hero-title"><?php echo esc_html($s['title']); ?></strong>
                    
                    <?php if (!empty($s['desc'])): ?>
                        <p class="hb-hero-desc"><?php echo esc_html($s['desc']); ?></p>
                    <?php endif; ?>

                    <div class="hb-hero-bottom-row">
                        <?php if (!empty($s['price'])): ?>
                            <div class="hb-hero-price-wrap">
                                <span class="hb-hero-price-label">From</span>
                                <span class="hb-hero-price-now"><?php echo esc_html($s['price']); ?></span>
                                <?php if (!empty($s['old'])): ?>
                                    <s class="hb-hero-price-old"><?php echo esc_html($s['old']); ?></s>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>

                        <span class="hb-hero-btn">SHOP NOW <i class="fa-solid fa-arrow-right"></i></span>
                    </div>
                </div>
            </a>
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
                <a class="hb-card-media" href="<?php echo esc_url($url); ?>">
                    <img class="hb-img-main" src="<?php echo esc_url(nesports_img($p['main'])); ?>" alt="<?php echo esc_attr($p['name']); ?>" loading="lazy">
                    <img class="hb-img-hover" src="<?php echo esc_url(nesports_img($p['hover'])); ?>" alt="" loading="lazy">
                </a>
                <div class="hb-card-body">
                    <div class="hb-card-meta">
                        <h3><a href="<?php echo esc_url($url); ?>"><?php echo esc_html($p['name']); ?></a></h3>
                        <div class="hb-card-price<?php echo $on_sale ? ' is-sale' : ''; ?>">
                            <span class="now"><?php echo esc_html(nesports_money($p['price'])); ?></span>
                            <?php if ($on_sale): ?><s><?php echo esc_html(nesports_money($p['old'])); ?></s><?php endif; ?>
                        </div>
                    </div>
                    <button type="button" class="hb-card-quick-add" data-id="<?php echo esc_attr($p['slug']); ?>" data-name="<?php echo esc_attr($p['name']); ?>" data-price="<?php echo esc_attr($p['price']); ?>" data-img="<?php echo esc_url(nesports_img($p['main'])); ?>" aria-label="Add <?php echo esc_attr($p['name']); ?> to cart">
                        <i class="fa-solid fa-plus"></i> Quick Add
                    </button>
                </div>
            </article>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- YOURS TO MAKE (dark brand band) -->
    <section class="hb-make" style="--make-bg: url('<?php echo esc_url(nesports_img('WhatsApp-Image-2024-07-08-at-19.17.50_f9c47d7b-800x530.jpg')); ?>');">
        <div class="hb-make-inner">
            <span class="hb-eyebrow">STRENGTH ISN'T GIVEN. IT'S EARNED.</span>
            <h2>Yours To Make</h2>
            <p>NESPORTS3 is a community of lifters built on self-development, discipline and drive.</p>
            <p>Every piece of gear we make is designed for the way you train: padded straps for heavy pulls, wraps for heavy squats, speed balls for fast hands and bags that carry it all. Our products are made to be used hard, session after session.</p>
            <p>We build for progress. Whether you are chasing your first PR or your hundredth, NESPORTS3 is here to help you get there.</p>
            <a class="hb-btn" href="<?php echo esc_url(home_url('/our-story/')); ?>">Our story</a>
        </div>
    </section>

    <!-- COLLECTIONS -->
    <section class="hb-block" id="collections" data-slider>
        <div class="hb-block-head">
            <h2 class="hb-block-title">Collections</h2>
            <div class="hb-slider-arrows hb-slider-arrows--sm">
                <button type="button" class="hb-prev" aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button>
                <button type="button" class="hb-next" aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
        </div>
        <div class="hb-cards hb-tiles">
            <?php foreach ($collections as $c): ?>
            <a class="hb-tile hb-tile--<?php echo esc_attr($c['type']); ?>" href="<?php echo esc_url(home_url($c['url'])); ?>">
                <img src="<?php echo esc_url(nesports_img($c['img'])); ?>" alt="<?php echo esc_attr($c['label']); ?>" loading="lazy">
                <span class="hb-tile-label"><?php echo esc_html($c['label']); ?> <i class="fa-solid fa-arrow-right"></i></span>
            </a>
            <?php endforeach; ?>
        </div>
    </section>

    <!-- BUNDLES -->
    <section class="hb-block" id="bundles" data-slider>
        <div class="hb-block-head hb-block-head--stack">
            <div>
                <h2 class="hb-block-title">NESPORTS3 Bundles</h2>
                <p class="hb-block-sub">Power, protection &amp; performance built into every pack. Bundle and save.</p>
            </div>
            <div class="hb-slider-arrows hb-slider-arrows--sm">
                <button type="button" class="hb-prev" aria-label="Previous"><i class="fa-solid fa-chevron-left"></i></button>
                <button type="button" class="hb-next" aria-label="Next"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
        </div>
        <div class="hb-pills hb-pills--sm">
            <button type="button" class="hb-pill is-active" data-filter="all">ALL PACKS</button>
            <?php foreach ($bundle_tabs as $key => $label): ?>
                <button type="button" class="hb-pill" data-filter="<?php echo esc_attr($key); ?>"><?php echo esc_html($label); ?></button>
            <?php endforeach; ?>
        </div>
        <div class="hb-cards">
            <?php foreach ($bundles as $b):
                $pct = round((1 - $b['price'] / $b['old']) * 100); ?>
            <article class="hb-card" data-cat="<?php echo esc_attr($b['cat']); ?>">
                <a class="hb-card-media hb-card-media--pair" href="<?php echo esc_url(home_url($b['url'])); ?>">
                    <img class="hb-pair-a" src="<?php echo esc_url(nesports_img($b['imgs'][0])); ?>" alt="" loading="lazy">
                    <img class="hb-pair-b" src="<?php echo esc_url(nesports_img($b['imgs'][1])); ?>" alt="" loading="lazy">
                </a>
                <div class="hb-card-body">
                    <div class="hb-card-meta">
                        <h3><a href="<?php echo esc_url(home_url($b['url'])); ?>"><?php echo esc_html($b['name']); ?></a></h3>
                        <div class="hb-card-price is-sale">
                            <span class="now"><?php echo esc_html(nesports_money($b['price'])); ?></span>
                            <s><?php echo esc_html(nesports_money($b['old'])); ?></s>
                        </div>
                    </div>
                    <button type="button" class="hb-card-quick-add" data-id="<?php echo esc_attr('bundle-' . $b['cat']); ?>" data-name="<?php echo esc_attr($b['name']); ?>" data-price="<?php echo esc_attr($b['price']); ?>" data-img="<?php echo esc_url(nesports_img($b['imgs'][0])); ?>" aria-label="Add <?php echo esc_attr($b['name']); ?> to cart">
                        <i class="fa-solid fa-plus"></i> Quick Add
                    </button>
                </div>
            </article>
            <?php endforeach; ?>
        </div>
    </section>

</main>

<?php include NESPORTS_PLUGIN_DIR . 'templates/footer-nesports.php'; ?>
