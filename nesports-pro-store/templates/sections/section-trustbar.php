<?php
/**
 * NESPORTS3 - Section: Trust Bar (Below Hero)
 * Usable standalone or via shortcode [nesports_trustbar]
 */
if (!defined('ABSPATH')) {
    exit;
}

$trust_items = array(
    array(
        'icon'  => 'fa-solid fa-truck-fast',
        'title' => 'FREE & FAST SHIPPING',
    ),
    array(
        'icon'  => 'fa-solid fa-shield-halved',
        'title' => 'COMPETITION-GRADE GEAR',
    ),
    array(
        'icon'  => 'fa-solid fa-rotate-left',
        'title' => '30-DAY EASY RETURNS',
    ),
    array(
        'icon'  => 'fa-solid fa-award',
        'title' => 'ENGINEERED IN GERMANY',
    ),
);
?>
<section class="hb-trustbar" aria-label="Store Guarantees">
    <style id="hb-trustbar-clean-css">
    .hb-trustbar {
        padding: 16px 32px !important;
    }
    .hb-trustbar-sub {
        display: none !important;
    }
    .hb-trustbar-item {
        justify-content: center !important;
    }
    </style>
    <div class="hb-trustbar-inner">
        <?php foreach ($trust_items as $item) : ?>
        <div class="hb-trustbar-item">
            <div class="hb-trustbar-icon" aria-hidden="true">
                <i class="<?php echo esc_attr($item['icon']); ?>"></i>
            </div>
            <div class="hb-trustbar-text">
                <h3 class="hb-trustbar-title"><?php echo esc_html($item['title']); ?></h3>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
</section>
