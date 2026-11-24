<?php
/**
 * NESPORTS3 - Section: Collections Carousel
 * Matched exactly to Hardbody Store Reference (Title "Collections", arrows top right, portrait cards with smooth zoom, dark gradient, uppercase title and arrow)
 */
if (!defined('ABSPATH')) {
    exit;
}

$collections_list = array(
    array(
        'title' => 'LEVER BELTS',
        'url'   => home_url('/product-category/weightlifting-belts/'),
        'img'   => 'DSC_0167-scaled-1.jpg',
        'alt'   => 'NESPORTS3 Lever Belts Collection',
    ),
    array(
        'title' => 'LIFTING STRAPS',
        'url'   => home_url('/product-category/lifting-straps/'),
        'img'   => '1-800x800.jpg',
        'alt'   => 'NESPORTS3 Lifting Straps Collection',
    ),
    array(
        'title' => 'KNEE WRAPS',
        'url'   => home_url('/product-category/knee-wrap/'),
        'img'   => 'Knee-Wrap-800x800.jpg',
        'alt'   => 'NESPORTS3 Knee Wraps Collection',
    ),
    array(
        'title' => 'WRIST WRAPS',
        'url'   => home_url('/product-category/wrist-straps/'),
        'img'   => 'Wrist-Bandage-Black-800x800.jpg',
        'alt'   => 'NESPORTS3 Wrist Wraps Collection',
    ),
    array(
        'title' => 'ELBOW WRAPS',
        'url'   => home_url('/product-category/elbow-wrap/'),
        'img'   => 'Elbow-Wrap-1-scaled.jpg',
        'alt'   => 'NESPORTS3 Elbow Wraps Collection',
    ),
    array(
        'title' => 'DIP BELTS',
        'url'   => home_url('/product-category/weightlifting-belts/'),
        'img'   => 'Dip-Belt-800x800.jpg',
        'alt'   => 'NESPORTS3 Weighted Dip Belts Collection',
    ),
    array(
        'title' => 'GYM BAGS',
        'url'   => home_url('/product-category/gym-bag/'),
        'img'   => 'Gym-Bag-8-800x800.jpg',
        'alt'   => 'NESPORTS3 Gym Bags Collection',
    ),
    array(
        'title' => 'SPEED BALLS',
        'url'   => home_url('/product-category/speed-ball/'),
        'img'   => 'speed-ball-red-1.jpg',
        'alt'   => 'NESPORTS3 Speed Balls Collection',
    ),
    array(
        'title' => 'BARBELL PADS',
        'url'   => home_url('/product-category/barbell-pads/'),
        'img'   => 'Barbell-Pad-1-scaled.jpg',
        'alt'   => 'NESPORTS3 Barbell Pads Collection',
    ),
    array(
        'title' => 'ANKLE STRAPS',
        'url'   => home_url('/product-category/ankle-straps/'),
        'img'   => 'Ankle-Strap-Cable-pull-scaled.jpg',
        'alt'   => 'NESPORTS3 Ankle Cable Straps Collection',
    ),
    array(
        'title' => 'OVERSIZED TEES',
        'url'   => home_url('/product-category/clothing/'),
        'img'   => 'clothing/Lift-The-World-T-Shirt-Black-1.jpg',
        'alt'   => 'NESPORTS3 Oversized Gym T-Shirts Collection',
    ),
    array(
        'title' => 'HOODIES',
        'url'   => home_url('/product-category/clothing/'),
        'img'   => 'clothing/hoodie-kaizen-anime-front.jpg',
        'alt'   => 'NESPORTS3 Graphic Power Hoodies Collection',
    ),
);

if (!empty($settings['collection_cards']) && is_array($settings['collection_cards'])) {
    $custom_cols = array();
    foreach ($settings['collection_cards'] as $item) {
        $c_title = !empty($item['title']) ? $item['title'] : 'Collection';
        $c_img = '';
        if (!empty($item['image']['url'])) {
            $c_img = $item['image']['url'];
        } elseif (!empty($item['fallback_img'])) {
            $c_img = $item['fallback_img'];
        } else {
            $c_img = 'DSC_0167-scaled-1.jpg';
        }
        $c_url = !empty($item['url']['url']) ? $item['url']['url'] : '/product-category/weightlifting-belts/';
        $c_alt = !empty($item['alt']) ? $item['alt'] : 'NESPORTS3 ' . $c_title;

        $custom_cols[] = array(
            'title' => $c_title,
            'url'   => $c_url,
            'img'   => $c_img,
            'alt'   => $c_alt,
        );
    }
    if (!empty($custom_cols)) {
        $collections_list = $custom_cols;
    }
}

$c_sec_title = !empty($settings['section_title']) ? $settings['section_title'] : nesports_setting('collections_title', 'Collections');
$c_sec_desc  = isset($settings['section_desc']) ? $settings['section_desc'] : nesports_setting('collections_desc', '');
?>

<section class="hb-collections-carousel-section" id="collections">
    <style id="hb-collections-carousel-critical-css">
    .hb-collections-carousel-section {
        padding: 48px 32px 36px !important;
        max-width: 1440px !important;
        margin: 0 auto !important;
        box-sizing: border-box !important;
        width: 100% !important;
        overflow: hidden !important;
    }
    .hb-collections-carousel-header {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        margin-bottom: 24px !important;
        width: 100% !important;
    }
    .hb-collections-carousel-title {
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: clamp(28px, 3.2vw, 40px) !important;
        font-weight: 700 !important;
        color: #111111 !important;
        margin: 0 !important;
        letter-spacing: -0.8px !important;
        line-height: 1.15 !important;
        text-align: left !important;
    }
    .hb-collections-carousel-controls {
        display: inline-flex !important;
        align-items: center !important;
        gap: 10px !important;
        flex-shrink: 0 !important;
    }
    .hb-collections-arrow {
        width: 44px !important;
        height: 44px !important;
        border-radius: 50% !important;
        border: 1px solid #e5e7eb !important;
        background: #ffffff !important;
        color: #111111 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        padding: 0 !important;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04) !important;
    }
    .hb-collections-arrow:hover:not(:disabled) {
        border-color: #111111 !important;
        background: #111111 !important;
        color: #ffffff !important;
        transform: scale(1.05) !important;
    }
    .hb-collections-arrow:disabled {
        opacity: 0.3 !important;
        cursor: not-allowed !important;
        border-color: #e5e7eb !important;
        color: #a1a1aa !important;
    }
    .hb-collections-arrow svg {
        width: 16px !important;
        height: 16px !important;
        fill: currentColor !important;
        stroke: currentColor !important;
        stroke-width: 0.5 !important;
    }
    .hb-collections-track-wrap {
        position: relative !important;
        width: 100% !important;
        overflow: hidden !important;
    }
    .hb-collections-track {
        display: flex !important;
        gap: 16px !important;
        overflow-x: auto !important;
        scroll-behavior: smooth !important;
        scroll-snap-type: x mandatory !important;
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: none !important;
        padding: 6px 2px 14px !important;
        margin: 0 !important;
    }
    .hb-collections-track::-webkit-scrollbar {
        display: none !important;
    }
    .hb-collection-card {
        flex: 0 0 calc((100% - 64px) / 5) !important;
        min-width: 0 !important;
        position: relative !important;
        border-radius: 14px !important;
        overflow: hidden !important;
        scroll-snap-align: start !important;
        text-decoration: none !important;
        display: block !important;
        background: #18181b !important;
        aspect-ratio: 3 / 4 !important;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08) !important;
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    @media (max-width: 1280px) {
        .hb-collection-card {
            flex: 0 0 calc((100% - 48px) / 4) !important;
        }
    }
    @media (max-width: 960px) {
        .hb-collection-card {
            flex: 0 0 calc((100% - 32px) / 3) !important;
        }
    }
    @media (max-width: 680px) {
        .hb-collection-card {
            flex: 0 0 calc((100% - 16px) / 2) !important;
            border-radius: 12px !important;
        }
        .hb-collections-carousel-section {
            padding: 32px 16px 24px !important;
        }
    }
    @media (max-width: 440px) {
        .hb-collection-card {
            flex: 0 0 76% !important;
        }
    }
    .hb-collection-card:hover {
        transform: translateY(-4px) !important;
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.16) !important;
    }
    .hb-collection-card-img-wrap {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        overflow: hidden !important;
    }
    .hb-collection-card-img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        display: block !important;
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .hb-collection-card:hover .hb-collection-card-img {
        transform: scale(1.06) !important;
    }
    .hb-collection-card-overlay {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.32) 70%, rgba(0,0,0,0.85) 100%) !important;
        pointer-events: none !important;
        z-index: 1 !important;
        transition: background 0.35s ease !important;
    }
    .hb-collection-card:hover .hb-collection-card-overlay {
        background: linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.42) 65%, rgba(0,0,0,0.92) 100%) !important;
    }
    .hb-collection-card-content {
        position: absolute !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        padding: 16px 14px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        z-index: 2 !important;
    }
    .hb-collection-card-title {
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: 13.5px !important;
        font-weight: 700 !important;
        color: #ffffff !important;
        letter-spacing: 0.4px !important;
        text-transform: uppercase !important;
        margin: 0 !important;
        line-height: 1.2 !important;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6) !important;
    }
    .hb-collection-card-arrow {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: #ffffff !important;
        font-size: 18px !important;
        line-height: 1 !important;
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .hb-collection-card:hover .hb-collection-card-arrow {
        transform: translateX(5px) !important;
    }
    </style>

    <div class="hb-collections-carousel-header">
        <div>
            <h2 class="hb-collections-carousel-title"><?php echo esc_html($c_sec_title); ?></h2>
            <?php if (!empty($c_sec_desc)): ?>
                <p class="hb-collections-carousel-desc" style="margin: 4px 0 0; color: var(--hb-text-color, #64748b); font-size: 14px;"><?php echo esc_html($c_sec_desc); ?></p>
            <?php endif; ?>
        </div>
        <div class="hb-collections-carousel-controls">
            <button type="button" class="hb-collections-arrow hb-collections-arrow--prev" id="hb-collections-carousel-prev" aria-label="Previous Collections" disabled>
                <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            </button>
            <button type="button" class="hb-collections-arrow hb-collections-arrow--next" id="hb-collections-carousel-next" aria-label="Next Collections">
                <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            </button>
        </div>
    </div>

    <div class="hb-collections-track-wrap">
        <div class="hb-collections-track" id="hb-collections-carousel-track">
            <?php foreach ($collections_list as $col) : ?>
                <a href="<?php echo esc_url($col['url']); ?>" class="hb-collection-card">
                    <div class="hb-collection-card-img-wrap">
                        <img src="<?php echo esc_url(nesports_img($col['img'])); ?>"
                             alt="<?php echo esc_attr($col['alt']); ?>"
                             class="hb-collection-card-img"
                             loading="lazy" />
                    </div>
                    <div class="hb-collection-card-overlay"></div>
                    <div class="hb-collection-card-content">
                        <span class="hb-collection-card-title"><?php echo esc_html($col['title']); ?></span>
                        <span class="hb-collection-card-arrow">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </span>
                    </div>
                </a>
            <?php endforeach; ?>
        </div>
    </div>

    <script id="hb-collections-carousel-js">
    (function() {
        var track = document.getElementById('hb-collections-carousel-track');
        var prevBtn = document.getElementById('hb-collections-carousel-prev');
        var nextBtn = document.getElementById('hb-collections-carousel-next');
        if (!track || !prevBtn || !nextBtn) return;

        function getScrollStep() {
            var card = track.querySelector('.hb-collection-card');
            return card ? (card.offsetWidth + 16) : 250;
        }

        function updateArrows() {
            var maxScroll = track.scrollWidth - track.clientWidth - 4;
            prevBtn.disabled = track.scrollLeft <= 5;
            nextBtn.disabled = track.scrollLeft >= maxScroll;
        }

        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
        });

        track.addEventListener('scroll', updateArrows, { passive: true });
        window.addEventListener('resize', updateArrows, { passive: true });
        setTimeout(updateArrows, 100);

        if (window.jQuery) {
            jQuery(window).on('elementor/frontend/init', function() {
                if (window.elementorFrontend && window.elementorFrontend.hooks) {
                    window.elementorFrontend.hooks.addAction('frontend/element_ready/nesports_collections_widget.default', function($scope) {
                        updateArrows();
                    });
                }
            });
        }
    })();
    </script>
</section>
