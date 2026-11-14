<?php
/**
 * NESPORTS3 - Section: Products Slider with Category Filter
 * Usable standalone or via shortcode [nesports_products]
 */
if (!defined('ABSPATH')) {
    exit;
}
$products   = nesports_catalog();
$categories = nesports_categories();
?>
<section class="hb-collection" id="shop" data-slider>
    <div class="hb-collection-bar">
        <div class="hb-pills">
            <button type="button" class="hb-pill hb-pill--master is-active" data-filter="all"><i class="fa-solid fa-shapes"></i> ALL PRODUCTS</button>
            <span class="hb-pill-divider" aria-hidden="true"></span>
            <?php foreach ($categories as $key => $label): ?>
                <button type="button" class="hb-pill" data-filter="<?php echo esc_attr($key); ?>"><?php echo esc_html($label); ?></button>
            <?php endforeach; ?>
        </div>
    </div>

    <div class="hb-cards hb-product-grid">
        <?php foreach ($products as $p):
            $url     = home_url('/product/' . $p['slug'] . '/');
            $on_sale = $p['old'] > $p['price'];
            $pct     = $on_sale ? round((1 - $p['price'] / $p['old']) * 100) : 0; ?>
        <article class="hb-card" data-cat="<?php echo esc_attr($p['cat']); ?>">
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
</section>

