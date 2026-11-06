<?php
/**
 * NESPORTS3 - Section: Curated Collections (Category Cards)
 * Usable standalone or via shortcode [nesports_categories]
 */
if (!defined('ABSPATH')) {
    exit;
}
$collections = nesports_collections();
?>
<section class="hb-collections-section" id="collections">
    <div class="hb-section-header">
        <h2 class="hb-section-title">Curated Collections</h2>
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

