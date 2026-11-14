<?php
/**
 * NESPORTS3 - Section: Top Sellers (Hardbody Scandinavian Carousel)
 * Usable standalone or via shortcode [nesports_categories]
 */
if (!defined('ABSPATH')) {
    exit;
}
$collections = nesports_collections();
?>
<section class="hb-collections-section hb-top-sellers-section" id="top-sellers">
    <div class="hb-collections-container">
        <div class="hb-collections-header">
            <h2 class="hb-collections-title">Top Sellers</h2>
            <div class="hb-carousel-controls">
                <button type="button" class="hb-carousel-arrow hb-carousel-prev" id="hb-cat-slider-prev" aria-label="Previous">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <button type="button" class="hb-carousel-arrow hb-carousel-next" id="hb-cat-slider-next" aria-label="Next">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        </div>
        <div class="hb-category-carousel-wrap">
            <div class="hb-category-track" id="hb-category-track">
                <?php foreach ($collections as $c): ?>
                <a class="hb-category-card" href="<?php echo esc_url(home_url($c['url'])); ?>">
                    <div class="hb-category-media">
                        <img src="<?php echo esc_url(nesports_img($c['img'])); ?>" alt="<?php echo esc_attr($c['title']); ?>" loading="lazy">
                    </div>
                    <div class="hb-category-label">
                        <h3 class="hb-category-title"><?php echo esc_html($c['title']); ?></h3>
                        <span class="hb-category-explore">
                            <span>Explore collection</span>
                            <i class="fa-solid fa-arrow-right-long" aria-hidden="true"></i>
                        </span>
                    </div>
                </a>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</section>
