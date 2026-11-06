<?php
/**
 * NESPORTS3 - Section: Popular Categories
 * Usable standalone or via shortcode [nesports_categories]
 */
if (!defined('ABSPATH')) {
    exit;
}
$collections = nesports_collections();
?>
<section class="hb-collections-section" id="categories">
    <div class="hb-collections-container">
        <div class="hb-collections-header">
            <h2 class="hb-collections-title">Popular Categories</h2>
        </div>
        <div class="hb-category-grid">
            <?php foreach ($collections as $c): ?>
            <a class="hb-category-card" href="<?php echo esc_url(home_url($c['url'])); ?>">
                <div class="hb-category-media">
                    <img src="<?php echo esc_url(nesports_img($c['img'])); ?>" alt="<?php echo esc_attr($c['title']); ?>" loading="lazy">
                </div>
                <div class="hb-category-label">
                    <h3 class="hb-category-title"><?php echo esc_html($c['title']); ?></h3>
                    <span class="hb-category-arrow" aria-hidden="true"><i class="fa-solid fa-arrow-right-long"></i></span>
                </div>
            </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>


