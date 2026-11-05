<?php
/**
 * NESPORTS3 - Section: Hero Carousel
 * Usable standalone or via shortcode [nesports_hero]
 */
if (!defined('ABSPATH')) {
    exit;
}
$hero_slides = nesports_hero_slides();
?>
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

