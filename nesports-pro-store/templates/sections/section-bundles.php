<?php
/**
 * NESPORTS3 - Section: Bundles
 * Usable standalone or via shortcode [nesports_bundles]
 */
if (!defined('ABSPATH')) {
    exit;
}
$bundles     = nesports_bundles();
$bundle_tabs = nesports_bundle_tabs();
?>
<section class="hb-bundles-section" id="bundles" data-slider>
    <style id="hb-bundles-critical-css">
    .hb-bundles-section {
        padding: 44px 32px 48px !important;
        max-width: 1440px !important;
        margin: 0 auto !important;
        box-sizing: border-box !important;
        width: 100% !important;
    }
    .hb-bundles-header {
        text-align: left !important;
        margin-bottom: 4px !important;
    }
    .hb-bundles-title {
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: clamp(28px, 3.2vw, 40px) !important;
        font-weight: 700 !important;
        color: #111111 !important;
        margin: 0 0 16px 0 !important;
        letter-spacing: -0.8px !important;
        line-height: 1.15 !important;
        text-align: left !important;
    }
    .hb-bundles-pills {
        display: flex !important;
        align-items: center !important;
        justify-content: flex-start !important;
        gap: 8px !important;
        overflow-x: auto !important;
        scrollbar-width: none !important;
        -webkit-overflow-scrolling: touch !important;
        padding: 4px 2px 18px !important;
        margin-bottom: 8px !important;
        width: 100% !important;
    }
    .hb-bundles-pills::-webkit-scrollbar {
        display: none !important;
    }
    .hb-bundles-pills .hb-pill {
        position: relative !important;
        overflow: hidden !important;
        isolation: isolate !important;
        background: #f4f4f5 !important;
        border: 1px solid rgba(0, 0, 0, 0.04) !important;
        border-radius: 999px !important;
        padding: 8px 18px !important;
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: 11.5px !important;
        font-weight: 500 !important;
        letter-spacing: .35px !important;
        text-transform: uppercase !important;
        cursor: pointer !important;
        white-space: nowrap !important;
        flex-shrink: 0 !important;
        color: #52525b !important;
        user-select: none !important;
        z-index: 1 !important;
        transition: color 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                    border-color 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                    box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .hb-bundles-pills .hb-pill::before {
        content: '' !important;
        position: absolute !important;
        inset: 0 !important;
        background: #111111 !important;
        border-radius: inherit !important;
        transform: scaleX(0) !important;
        transform-origin: left center !important;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        z-index: -1 !important;
    }
    .hb-bundles-pills .hb-pill:hover::before {
        transform: scaleX(1) !important;
    }
    .hb-bundles-pills .hb-pill:hover {
        color: #ffffff !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12) !important;
    }
    .hb-bundles-pills .hb-pill.is-active::before {
        transform: scaleX(1) !important;
    }
    .hb-bundles-pills .hb-pill.is-active {
        color: #ffffff !important;
        border-color: #111111 !important;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18) !important;
    }
    @media (max-width: 768px) {
        .hb-bundles-section {
            padding: 32px 16px 36px !important;
        }
        .hb-bundles-title {
            font-size: 24px !important;
        }
    }
    </style>

    <div class="hb-bundles-header">
        <h2 class="hb-bundles-title">Bundles</h2>
    </div>
    <div class="hb-pills hb-bundles-pills">
        <button type="button" class="hb-pill is-active" data-filter="all">ALL PACKS</button>
        <?php foreach ($bundle_tabs as $key => $label): ?>
            <button type="button" class="hb-pill" data-filter="<?php echo esc_attr($key); ?>"><?php echo esc_html($label); ?></button>
        <?php endforeach; ?>
    </div>
    <div class="hb-cards">
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

