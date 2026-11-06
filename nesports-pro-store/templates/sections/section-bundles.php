<?php
/**
 * NESPORTS3 - Section: Curated Bundles & Power Packs
 * Usable standalone or via shortcode [nesports_bundles]
 */
if (!defined('ABSPATH')) {
    exit;
}
$bundles     = nesports_bundles();
$bundle_tabs = nesports_bundle_tabs();
?>
<section class="hb-bundles-section" id="bundles" data-slider>
    <div class="hb-section-header">
        <h2 class="hb-section-title">Power Packs &amp; Bundles</h2>
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
                <span class="hb-bundle-badge">SAVE <?php echo esc_html($pct); ?>%</span>
                <a class="hb-card-media hb-card-media--pair" href="<?php echo esc_url(home_url($b['url'])); ?>">
                    <img class="hb-pair-a" src="<?php echo esc_url(nesports_img($b['imgs'][0])); ?>" alt="" loading="lazy">
                    <img class="hb-pair-b" src="<?php echo esc_url(nesports_img($b['imgs'][1])); ?>" alt="" loading="lazy">
                </a>
                <button type="button" class="hb-card-quick-add" data-id="<?php echo esc_attr('bundle-' . $b['cat']); ?>" data-name="<?php echo esc_attr($b['name']); ?>" data-price="<?php echo esc_attr($b['price']); ?>" data-img="<?php echo esc_url(nesports_img($b['imgs'][0])); ?>" aria-label="Add <?php echo esc_attr($b['name']); ?> to cart">
                    <i class="fa-solid fa-plus"></i> Add to cart
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

