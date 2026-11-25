<?php
/**
 * NESPORTS3 - Section: Shop by Color (Matched to Hardbody Store Reference)
 * Usable standalone or via shortcode [nesports_color]
 */
if (!defined('ABSPATH')) {
    exit;
}
$color_groups = nesports_color_items();
$active_color = 'red'; // Default active color

if (!empty($settings['color_cards']) && is_array($settings['color_cards'])) {
    $custom_groups = array();
    $color_meta = array(
        'red'    => array('label' => 'RED', 'hex' => '#dc2626'),
        'black'  => array('label' => 'BLACK', 'hex' => '#18181b'),
        'blue'   => array('label' => 'BLUE', 'hex' => '#2563eb'),
        'green'  => array('label' => 'GREEN', 'hex' => '#16a34a'),
        'grey'   => array('label' => 'GREY', 'hex' => '#71717a'),
        'gray'   => array('label' => 'GREY', 'hex' => '#71717a'),
        'gold'   => array('label' => 'GOLD', 'hex' => '#eab308'),
        'white'  => array('label' => 'WHITE', 'hex' => '#f4f4f5'),
        'yellow' => array('label' => 'YELLOW', 'hex' => '#facc15'),
        'pink'   => array('label' => 'PINK', 'hex' => '#ec4899'),
        'purple' => array('label' => 'PURPLE', 'hex' => '#9333ea'),
        'orange' => array('label' => 'ORANGE', 'hex' => '#ea580c'),
        'navy'   => array('label' => 'NAVY', 'hex' => '#1e3a8a'),
        'camo'   => array('label' => 'CAMO', 'hex' => '#57534e'),
        'maroon' => array('label' => 'MAROON', 'hex' => '#881337'),
    );

    foreach ($settings['color_cards'] as $card) {
        $color_raw = (!empty($card['color']) && $card['color'] === 'custom' && !empty($card['custom_color'])) 
            ? $card['custom_color'] 
            : (!empty($card['color']) ? $card['color'] : 'red');

        $c_key = sanitize_title($color_raw);
        if (empty($c_key)) $c_key = 'red';

        if (!isset($custom_groups[$c_key])) {
            $label = isset($color_meta[$c_key]) ? $color_meta[$c_key]['label'] : strtoupper(trim($color_raw));
            $hex   = isset($color_meta[$c_key]) ? $color_meta[$c_key]['hex'] : '#3b82f6';
            $custom_groups[$c_key] = array(
                'label' => $label,
                'hex'   => $hex,
                'items' => array(),
            );
        }

        $p_img = '';
        if (!empty($card['image']['url'])) {
            $p_img = $card['image']['url'];
        } elseif (!empty($card['fallback_img'])) {
            $p_img = $card['fallback_img'];
        } else {
            $p_img = 'clothing/norm-lift-the-world-red.jpg';
        }

        $p_price = !empty($card['price']) ? $card['price'] : '34.99';
        if (is_string($p_price)) $p_price = (float) preg_replace('/[^0-9.]/', '', $p_price);
        $p_old = !empty($card['old_price']) ? $card['old_price'] : '';
        if (is_string($p_old) && !empty($p_old)) $p_old = (float) preg_replace('/[^0-9.]/', '', $p_old);

        $custom_groups[$c_key]['items'][] = array(
            'name'      => !empty($card['name']) ? $card['name'] : 'Product',
            'price'     => $p_price,
            'old_price' => $p_old,
            'img'       => $p_img,
            'images'    => array($p_img),
            'url'       => !empty($card['url']['url']) ? $card['url']['url'] : '/shop/',
            'cat'       => !empty($card['cat']) ? $card['cat'] : 'gear',
        );
    }

    if (!empty($custom_groups)) {
        $color_groups = $custom_groups;
        $active_color = array_key_first($color_groups);
    }
}

$color_title = !empty($settings['section_title']) ? $settings['section_title'] : nesports_setting('color_title', 'Shop by Colour');
$color_desc  = isset($settings['section_desc']) ? $settings['section_desc'] : nesports_setting('color_desc', '');
?>
<section class="hb-color-section" id="shop-by-color">
    <style id="hb-color-critical-css">
    .hb-color-section {
        padding: 44px 32px 52px !important;
        max-width: 1440px !important;
        margin: 0 auto !important;
        box-sizing: border-box !important;
        width: 100% !important;
        overflow: hidden !important;
    }

    /* Section Navigation Header Grid */
    .hb-color-nav-grid {
        display: grid !important;
        grid-template-columns: 1fr auto !important;
        grid-template-rows: auto auto !important;
        gap: 16px 16px !important;
        margin-bottom: 24px !important;
        align-items: center !important;
        width: 100% !important;
    }
    .hb-color-title-wrap {
        grid-column: 1 / -1 !important;
        grid-row: 1 / 2 !important;
        display: inline-flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
    }
    .hb-color-title {
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: clamp(28px, 3.2vw, 40px) !important;
        font-weight: 700 !important;
        color: #111111 !important;
        margin: 0 !important;
        letter-spacing: -0.8px !important;
        line-height: 1.15 !important;
        text-align: left !important;
        position: relative !important;
        display: inline-block !important;
    }

    .hb-color-pills-wrap {
        grid-column: 1 / 2 !important;
        grid-row: 2 / 3 !important;
        min-width: 0 !important;
        width: 100% !important;
        overflow: hidden !important;
    }
    .hb-color-pills {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        overflow-x: auto !important;
        scrollbar-width: none !important;
        -webkit-overflow-scrolling: touch !important;
        padding: 4px 4px 6px !important;
        width: 100% !important;
        min-width: 0 !important;
        scroll-padding-right: 20px !important;
    }
    .hb-color-pills::-webkit-scrollbar {
        display: none !important;
    }
    .hb-color-pills::after {
        content: '' !important;
        display: block !important;
        flex: 0 0 16px !important;
        width: 16px !important;
        height: 1px !important;
    }

    /* Filter Pill - Text Only (No Color Dots) with Left-to-Right Curtain Animation */
    .hb-color-pill {
        position: relative !important;
        overflow: hidden !important;
        isolation: isolate !important;
        background: #f4f4f5 !important;
        border: 1px solid rgba(0, 0, 0, 0.05) !important;
        border-radius: 999px !important;
        padding: 9px 24px !important;
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        letter-spacing: .5px !important;
        text-transform: uppercase !important;
        cursor: pointer !important;
        white-space: nowrap !important;
        flex-shrink: 0 !important;
        color: #18181b !important;
        user-select: none !important;
        z-index: 1 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: color 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                    border-color 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                    box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .hb-color-pill::before {
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
    .hb-color-pill:hover::before {
        transform: scaleX(1) !important;
    }
    .hb-color-pill:hover {
        color: #ffffff !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12) !important;
    }
    .hb-color-pill.is-active::before {
        transform: scaleX(1) !important;
    }
    .hb-color-pill.is-active {
        color: #ffffff !important;
        background: #111111 !important;
        border-color: #111111 !important;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18) !important;
    }

    /* Carousel navigation controls (< >) */
    .hb-color-carousel-controls {
        grid-column: 2 / 3 !important;
        grid-row: 2 / 3 !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 10px !important;
        flex-shrink: 0 !important;
        margin-left: 8px !important;
        justify-self: end !important;
    }

    /* Carousel Track */
    .hb-color-carousel-wrap {
        position: relative !important;
        width: 100% !important;
        overflow: hidden !important;
    }
    .hb-color-track {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        gap: 18px !important;
        overflow-x: auto !important;
        scroll-behavior: smooth !important;
        scroll-snap-type: x mandatory !important;
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: none !important;
        padding: 6px 2px 22px !important;
        margin: 0 !important;
        width: 100% !important;
    }
    .hb-color-track::-webkit-scrollbar {
        display: none !important;
    }

    /* NESPORTS3 Card Style (5-card desktop layout) - Single clean surface, no card inside card */
    .hb-color-card {
        flex: 0 0 calc((100% - 72px) / 5) !important;
        min-width: 220px !important;
        max-width: 280px !important;
        box-sizing: border-box !important;
        display: flex;
        flex-direction: column !important;
        align-items: stretch !important;
        text-decoration: none !important;
        color: inherit !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
        cursor: pointer !important;
        scroll-snap-align: start !important;
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .hb-color-card.is-hidden {
        display: none !important;
    }
    .hb-color-card:hover {
        transform: translateY(-6px) !important;
    }

    /* Left-to-right card transition */
    @keyframes colorCardSlideLeftToRight {
        0% {
            opacity: 0;
            transform: translateX(-35px) scale(0.97);
        }
        100% {
            opacity: 1;
            transform: translateX(0) scale(1);
        }
    }
    .hb-color-card.anim-l2r {
        animation: colorCardSlideLeftToRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) both !important;
    }

    .hb-color-media {
        position: relative !important;
        width: 100% !important;
        aspect-ratio: 1 / 1 !important;
        background: #ffffff !important;
        border-radius: 16px !important;
        overflow: hidden !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border: 1px solid #eaeaec !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
        transition: border-color 0.3s ease, box-shadow 0.35s ease !important;
    }
    .hb-color-card:hover .hb-color-media {
        background: #ffffff !important;
        border-color: #d4d4d8 !important;
        box-shadow: 0 14px 32px -6px rgba(0, 0, 0, 0.08) !important;
    }

    /* Banners completely removed */
    .hb-color-badge {
        display: none !important;
    }

    /* Multi-angle slide track matching Hardbody Screenshot 2 */
    .hb-color-media .hb-card-slider-track {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        width: 100% !important;
        height: 100% !important;
        transform: translateX(0%);
        transition: transform 0.42s cubic-bezier(0.25, 1, 0.5, 1) !important;
        will-change: transform !important;
    }
    .hb-color-media .hb-card-slide {
        flex: 0 0 100% !important;
        min-width: 100% !important;
        width: 100% !important;
        height: 100% !important;
        position: relative !important;
        overflow: hidden !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: #ffffff !important;
    }
    .hb-color-media .hb-card-slide-img,
    .hb-color-media img {
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        object-fit: contain !important;
        object-position: center !important;
        display: block !important;
        pointer-events: none !important;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .hb-color-media .hb-card-slide-img[src*="model"],
    .hb-color-media .hb-card-slide-img[src*="hero"],
    .hb-color-media img[src*="model"],
    .hb-color-media img[src*="hero"] {
        object-fit: cover !important;
    }
    .hb-color-card:hover .hb-color-media .hb-card-slide-img,
    .hb-color-card:hover .hb-color-media img {
        transform: scale(1.04) !important;
    }

    /* 3-dot indicator matching Hardbody Store Screenshot 2 */
    .hb-color-section .hb-card-dots-wrap {
        position: absolute !important;
        bottom: 10px !important;
        left: 0 !important;
        right: 0 !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        z-index: 6 !important;
        pointer-events: none !important;
    }
    .hb-color-section .hb-card-dots {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        background: #f4f4f5 !important;
        border: 1px solid rgba(0, 0, 0, 0.06) !important;
        padding: 4px 10px !important;
        border-radius: 9999px !important;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05) !important;
        pointer-events: auto !important;
    }
    .hb-color-section .hb-card-dot {
        width: 6px !important;
        height: 6px !important;
        border-radius: 50% !important;
        background: #d4d4d8 !important;
        border: none !important;
        display: inline-block !important;
        cursor: pointer !important;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .hb-color-section .hb-card-dot:hover {
        background: #52525b !important;
    }
    .hb-color-section .hb-card-dot.is-active {
        background: #111111 !important;
        transform: scale(1.35) !important;
    }

    .hb-color-bottom {
        padding: 14px 4px 4px !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: flex-start !important;
        justify-content: space-between !important;
        gap: 12px !important;
    }
    .hb-color-meta-left {
        flex: 1 1 auto !important;
        min-width: 0 !important;
    }
    .hb-color-card-title {
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: 13.5px !important;
        font-weight: 600 !important;
        color: #18181b !important;
        margin: 0 !important;
        line-height: 1.35 !important;
        display: -webkit-box !important;
        -webkit-line-clamp: 2 !important;
        -webkit-box-orient: vertical !important;
        overflow: hidden !important;
        text-align: left !important;
    }
    .hb-color-card:hover .hb-color-card-title {
        color: #e11d48 !important;
    }

    .hb-color-price-box {
        flex: 0 0 auto !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-end !important;
        text-align: right !important;
    }
    .hb-color-price-now {
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: 13.5px !important;
        font-weight: 700 !important;
        color: #18181b !important;
        line-height: 1.2 !important;
    }
    .hb-color-price-old {
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: 11.5px !important;
        font-weight: 500 !important;
        color: #a1a1aa !important;
        text-decoration: line-through !important;
        line-height: 1.2 !important;
        margin-top: 2px !important;
    }

    /* Responsive Breakdown */
    @media (max-width: 1200px) {
        .hb-color-card {
            flex: 0 0 calc((100% - 54px) / 4) !important;
        }
    }
    @media (max-width: 992px) {
        .hb-color-nav-grid {
            grid-template-columns: 1fr auto !important;
        }
        .hb-color-pills-wrap {
            grid-column: 1 / -1 !important;
            grid-row: 2 / 3 !important;
            width: 100% !important;
        }
        .hb-color-card {
            flex: 0 0 calc((100% - 36px) / 3) !important;
        }
    }
    @media (max-width: 768px) {
        .hb-color-section {
            padding: 32px 16px 36px !important;
        }
        .hb-color-title {
            font-size: 24px !important;
        }
        .hb-color-card {
            flex: 0 0 68vw !important;
            min-width: 200px !important;
        }
    }
    
    @media (max-width: 991px) {
        .hb-color-title-wrap {
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
        }
        .hb-color-title {
            text-align: center !important;
            width: 100% !important;
            margin: 0 auto 16px auto !important;
        }
        .hb-color-nav {
            justify-content: center !important;
        }
    }
    </style>

    <div class="hb-color-container">
        <div class="hb-color-nav-grid">
            <div class="hb-color-title-wrap">
                <h2 class="hb-color-title"><?php echo esc_html($color_title); ?></h2>
                <?php if (!empty($color_desc)): ?>
                    <p class="hb-color-desc" style="margin: 4px 0 0; color: var(--hb-text-color, #64748b); font-size: 14px;"><?php echo esc_html($color_desc); ?></p>
                <?php endif; ?>
            </div>

            <div class="hb-color-pills-wrap">
                <div class="hb-color-pills" id="hb-color-filter-pills">
                    <?php foreach ($color_groups as $c_key => $c_group): ?>
                    <button type="button" class="hb-color-pill <?php echo ($c_key === $active_color) ? 'is-active' : ''; ?>" data-color="<?php echo esc_attr($c_key); ?>">
                        <?php echo esc_html($c_group['label']); ?>
                    </button>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="hb-color-carousel-controls">
                <button type="button" class="hb-carousel-arrow hb-color-prev" id="hb-color-prev" aria-label="Previous" disabled>
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <button type="button" class="hb-carousel-arrow hb-color-next" id="hb-color-next" aria-label="Next">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        </div>

        <div class="hb-color-carousel-wrap">
            <div class="hb-color-track" id="hb-color-track">
                <?php foreach ($color_groups as $c_key => $c_group):
                    foreach ($c_group['items'] as $item):
                        $is_shown = ($c_key === $active_color);
                        $card_imgs = !empty($item['images']) && is_array($item['images']) ? $item['images'] : array($item['img']);
                        $has_sub   = count($card_imgs) > 1;
                ?>
                <a class="hb-color-card <?php echo $is_shown ? '' : 'is-hidden'; ?>" data-color="<?php echo esc_attr($c_key); ?>" href="<?php echo esc_url(home_url($item['url'])); ?>" style="<?php echo $is_shown ? 'display:flex !important;' : 'display:none !important;'; ?>">
                    <div class="hb-color-media hb-card-media">
                        <?php if ($has_sub): ?>
                            <div class="hb-card-slider-track">
                                <?php foreach ($card_imgs as $idx => $img_path): ?>
                                <div class="hb-card-slide" data-idx="<?php echo $idx; ?>">
                                    <img class="hb-card-slide-img" src="<?php echo esc_url(nesports_img($img_path)); ?>" alt="<?php echo esc_attr($item['name']); ?>" loading="lazy">
                                </div>
                                <?php endforeach; ?>
                            </div>
                            <div class="hb-card-dots-wrap">
                                <div class="hb-card-dots">
                                    <?php foreach ($card_imgs as $idx => $img_path): ?>
                                    <span class="hb-card-dot<?php echo $idx === 0 ? ' is-active' : ''; ?>" data-idx="<?php echo $idx; ?>"></span>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        <?php else: ?>
                            <img src="<?php echo esc_url(nesports_img($item['img'])); ?>" alt="<?php echo esc_attr($item['name']); ?>" loading="lazy">
                        <?php endif; ?>
                    </div>
                    <div class="hb-color-bottom">
                        <div class="hb-color-meta-left">
                            <h3 class="hb-color-card-title"><?php echo esc_html($item['name']); ?></h3>
                        </div>
                        <div class="hb-color-price-box">
                            <span class="hb-color-price-now"><?php echo esc_html(nesports_money($item['price'])); ?></span>
                            <?php if (!empty($item['old_price']) && $item['old_price'] > $item['price']): ?>
                                <span class="hb-color-price-old"><?php echo esc_html(nesports_money($item['old_price'])); ?></span>
                            <?php endif; ?>
                        </div>
                    </div>
                </a>
                <?php 
                    endforeach;
                endforeach; ?>
            </div>
        </div>
    </div>

    <script id="hb-color-script">
    (function() {
        function initColorSection() {
            var track = document.getElementById('hb-color-track');
            var prev = document.getElementById('hb-color-prev');
            var next = document.getElementById('hb-color-next');
            var pills = document.querySelectorAll('#hb-color-filter-pills .hb-color-pill');

            if (!track) return;

            function updateArrowState() {
                var maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
                var currentScroll = track.scrollLeft;

                if (prev) {
                    var atStart = currentScroll <= 4;
                    prev.disabled = atStart;
                    if (atStart) {
                        prev.setAttribute('disabled', 'disabled');
                    } else {
                        prev.removeAttribute('disabled');
                    }
                }

                if (next) {
                    var atEnd = currentScroll >= (maxScroll - 6) || maxScroll <= 2;
                    next.disabled = atEnd;
                    if (atEnd) {
                        next.setAttribute('disabled', 'disabled');
                    } else {
                        next.removeAttribute('disabled');
                    }
                }
            }

            function getStep() {
                var card = track.querySelector('.hb-color-card:not(.is-hidden)');
                if (card) {
                    return (card.offsetWidth + 18) * 2;
                }
                return 300;
            }

            if (prev) {
                prev.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (prev.disabled) return;
                    track.scrollBy({ left: -getStep(), behavior: 'smooth' });
                    setTimeout(updateArrowState, 150);
                    setTimeout(updateArrowState, 350);
                });
            }

            if (next) {
                next.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (next.disabled) return;
                    track.scrollBy({ left: getStep(), behavior: 'smooth' });
                    setTimeout(updateArrowState, 150);
                    setTimeout(updateArrowState, 350);
                });
            }

            track.addEventListener('scroll', updateArrowState, { passive: true });
            window.addEventListener('resize', updateArrowState);

            // Filter pills logic
            pills.forEach(function(pill) {
                pill.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (pill.classList.contains('is-active')) return;

                    pills.forEach(function(p) { p.classList.remove('is-active'); });
                    pill.classList.add('is-active');

                    var color = pill.getAttribute('data-color');
                    var cards = track.querySelectorAll('.hb-color-card');

                    var delay = 0;
                    cards.forEach(function(card) {
                        var cardColor = card.getAttribute('data-color');
                        card.classList.remove('anim-l2r');
                        if (cardColor === color) {
                            card.classList.remove('is-hidden');
                            card.style.setProperty('display', 'flex', 'important');
                            card.style.animationDelay = (delay * 0.05) + 's';
                            void card.offsetWidth; // Reflow for animation restart
                            card.classList.add('anim-l2r');
                            delay++;
                        } else {
                            card.classList.add('is-hidden');
                            card.style.setProperty('display', 'none', 'important');
                        }
                    });

                    track.scrollTo({ left: 0, behavior: 'auto' });
                    setTimeout(updateArrowState, 60);
                    setTimeout(updateArrowState, 250);
                });
            });

            // Multi-angle hover scrubber for each color card (Screenshot 2 Hardbody reference)
            var colorCards = track.querySelectorAll('.hb-color-card');
            colorCards.forEach(function(card) {
                var sliderTrack = card.querySelector('.hb-card-slider-track');
                if (!sliderTrack) return;
                var slides = card.querySelectorAll('.hb-card-slide');
                var dots = card.querySelectorAll('.hb-card-dot');
                var count = slides.length;
                if (count <= 1) return;

                var currentIdx = 0;

                function goTo(index) {
                    if (index < 0) index = 0;
                    if (index >= count) index = count - 1;
                    if (currentIdx === index && sliderTrack.style.transform === 'translateX(-' + (index * 100) + '%)') {
                        return;
                    }
                    currentIdx = index;
                    sliderTrack.style.transform = 'translateX(-' + (index * 100) + '%)';
                    dots.forEach(function(d, i) {
                        if (i === index) {
                            d.classList.add('is-active');
                        } else {
                            d.classList.remove('is-active');
                        }
                    });
                }

                card.addEventListener('mousemove', function(e) {
                    var rect = card.getBoundingClientRect();
                    var mouseX = e.clientX - rect.left;
                    var width = rect.width;
                    if (width <= 0) return;

                    var targetIndex = 0;
                    if (count === 2) {
                        targetIndex = (mouseX < width * 0.5) ? 0 : 1;
                    } else if (count === 3) {
                        if (mouseX < width * 0.333) {
                            targetIndex = 0;
                        } else if (mouseX < width * 0.666) {
                            targetIndex = 1;
                        } else {
                            targetIndex = 2;
                        }
                    } else {
                        targetIndex = Math.min(count - 1, Math.floor((mouseX / width) * count));
                    }

                    goTo(targetIndex);
                });

                card.addEventListener('mouseleave', function() {
                    goTo(0);
                });

                dots.forEach(function(dot) {
                    function activate(e) {
                        if (e) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        var idx = parseInt(dot.getAttribute('data-idx') || '0', 10);
                        goTo(idx);
                    }
                    dot.addEventListener('mouseenter', activate);
                    dot.addEventListener('click', activate);
                });
            });

            updateArrowState();
            setTimeout(updateArrowState, 150);
            setTimeout(updateArrowState, 500);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initColorSection);
        } else {
            initColorSection();
        }

        if (window.jQuery) {
            jQuery(window).on('elementor/frontend/init', function() {
                if (window.elementorFrontend && window.elementorFrontend.hooks) {
                    window.elementorFrontend.hooks.addAction('frontend/element_ready/nesports_color_widget.default', function($scope) {
                        initColorSection();
                    });
                }
            });
        }
    })();
    </script>
</section>
