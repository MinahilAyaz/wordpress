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
        'icon'     => 'fa-solid fa-truck-fast',
        'title'    => 'FREE & FAST SHIPPING',
        'subtitle' => 'Quick dispatch across Germany & Europe',
    ),
    array(
        'icon'     => 'fa-solid fa-shield-halved',
        'title'    => 'COMPETITION-GRADE GEAR',
        'subtitle' => 'Heavy-duty leather & reinforced stitching',
    ),
    array(
        'icon'     => 'fa-solid fa-rotate-left',
        'title'    => '30-DAY EASY RETURNS',
        'subtitle' => 'Hassle-free exchanges & size guarantee',
    ),
    array(
        'icon'     => 'fa-solid fa-award',
        'title'    => 'ENGINEERED IN GERMANY',
        'subtitle' => 'Gym-tested quality from Remscheid',
    ),
);
?>
<section class="hb-trustbar" aria-label="Store Guarantees">
    <div class="hb-trustbar-inner">
        <?php foreach ($trust_items as $item) : ?>
        <div class="hb-trustbar-item">
            <div class="hb-trustbar-icon" aria-hidden="true">
                <i class="<?php echo esc_attr($item['icon']); ?>"></i>
            </div>
            <div class="hb-trustbar-text">
                <h3 class="hb-trustbar-title"><?php echo esc_html($item['title']); ?></h3>
                <p class="hb-trustbar-sub"><?php echo esc_html($item['subtitle']); ?></p>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
</section>

