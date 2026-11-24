<?php
/**
 * NESPORTS3 - Section: Bundles
 * Usable standalone or via shortcode [nesports_bundles]
 * Matched to Hardbody Store Reference (Professional unified studio pack images, 3-dot hover slider, no banners)
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
        overflow: hidden !important;
    }
    .hb-bundles-header {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        margin-bottom: 8px !important;
        width: 100% !important;
    }
    .hb-bundles-title {
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: clamp(28px, 3.2vw, 40px) !important;
        font-weight: 700 !important;
        color: #111111 !important;
        margin: 0 !important;
        letter-spacing: -0.8px !important;
        line-height: 1.15 !important;
        text-align: left !important;
    }
    .hb-bundles-carousel-controls {
        display: inline-flex !important;
        align-items: center !important;
        gap: 10px !important;
        flex-shrink: 0 !important;
    }
    .hb-bundles-arrow {
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
    .hb-bundles-arrow:hover:not(:disabled) {
        border-color: #111111 !important;
        background: #111111 !important;
        color: #ffffff !important;
        transform: scale(1.05) !important;
    }
    .hb-bundles-arrow:disabled {
        opacity: 0.3 !important;
        cursor: not-allowed !important;
        border-color: #e5e7eb !important;
        color: #a1a1aa !important;
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

    /* 1-ROW CAROUSEL TRACK (Strictly 1 Row, Never 3 Rows) */
    .hb-bundles-carousel-wrap {
        position: relative !important;
        width: 100% !important;
        overflow: hidden !important;
    }
    .hb-bundles-section .hb-bundles-track,
    .hb-bundles-section .hb-cards {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        gap: 20px !important;
        overflow-x: auto !important;
        scroll-behavior: smooth !important;
        scroll-snap-type: x mandatory !important;
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: none !important;
        padding: 4px 2px 18px !important;
        margin: 0 !important;
        width: 100% !important;
    }
    .hb-bundles-section .hb-bundles-track::-webkit-scrollbar,
    .hb-bundles-section .hb-cards::-webkit-scrollbar {
        display: none !important;
    }

    .hb-bundles-section .hb-bundles-track .hb-card,
    .hb-bundles-section .hb-cards .hb-card {
        flex: 0 0 calc((100% - 80px) / 5) !important;
        min-width: 220px !important;
        max-width: 280px !important;
        width: auto !important;
        scroll-snap-align: start !important;
        box-sizing: border-box !important;
        position: relative !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
    }

    /* 3-Image Slider Track & Slides */
    .hb-bundles-section .hb-bundle-media {
        position: relative !important;
        width: 100% !important;
        aspect-ratio: 1 / 1 !important;
        background: #ffffff !important;
        border: 1px solid #eaeaec !important;
        border-radius: 16px !important;
        overflow: hidden !important;
        box-shadow: none !important;
        transition: border-color 0.3s ease, box-shadow 0.35s ease !important;
        display: block !important;
        text-decoration: none !important;
        padding: 0 !important;
        margin: 0 !important;
    }
    .hb-bundles-section .hb-card:hover .hb-bundle-media {
        border-color: #d4d4d8 !important;
        box-shadow: 0 14px 32px -6px rgba(0, 0, 0, 0.08) !important;
    }

    .hb-bundles-section .hb-card-slider-track {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        width: 100% !important;
        height: 100% !important;
        transform: translateX(0%);
        transition: transform 0.42s cubic-bezier(0.25, 1, 0.5, 1) !important;
        will-change: transform !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    .hb-bundles-section .hb-card-slide {
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
        padding: 0 !important;
        margin: 0 !important;
    }

    .hb-bundles-section .hb-card-slide-img {
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        object-fit: contain !important;
        object-position: center !important;
        display: block !important;
        pointer-events: none !important;
        position: static !important;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .hb-bundles-section .hb-card:hover .hb-card-slide-img {
        transform: scale(1.04) !important;
    }

    /* 3-Dot Indicators */
    .hb-bundles-section .hb-card-dots-wrap {
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
    .hb-bundles-section .hb-card-dots {
        display: inline-flex !important;
        align-items: center !important;
        gap: 5px !important;
        background: rgba(255, 255, 255, 0.9) !important;
        padding: 3px 8px !important;
        border-radius: 9999px !important;
        backdrop-filter: blur(6px) !important;
        -webkit-backdrop-filter: blur(6px) !important;
        border: 1px solid rgba(0, 0, 0, 0.06) !important;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;
        pointer-events: auto !important;
    }
    .hb-bundles-section .hb-card-dot {
        width: 5px !important;
        height: 5px !important;
        border-radius: 50% !important;
        background: #d4d4d8 !important;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        cursor: pointer !important;
        display: inline-block !important;
    }
    .hb-bundles-section .hb-card-dot:hover {
        background: #71717a !important;
    }
    .hb-bundles-section .hb-card-dot.is-active {
        background: #111111 !important;
        width: 14px !important;
        border-radius: 9999px !important;
    }

    /* Banners & Add to cart completely removed */
    .hb-bundles-section .hb-bundle-badge,
    .hb-bundles-section .hb-card-quick-add {
        display: none !important;
    }

    /* Card Typography */
    .hb-bundles-section .hb-card-body {
        padding: 12px 2px 4px !important;
        text-align: left !important;
    }
    .hb-bundles-section .hb-card-title {
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        color: #111111 !important;
        margin: 0 0 6px 0 !important;
        line-height: 1.3 !important;
    }
    .hb-bundles-section .hb-card-title a {
        color: inherit !important;
        text-decoration: none !important;
        transition: color 0.2s ease !important;
    }
    .hb-bundles-section .hb-card-title a:hover {
        color: #e11d48 !important;
    }
    .hb-bundles-section .hb-card-price {
        display: flex !important;
        align-items: baseline !important;
        gap: 8px !important;
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: 14px !important;
    }
    .hb-bundles-section .hb-card-price .now {
        font-weight: 700 !important;
        color: #e11d48 !important;
    }
    .hb-bundles-section .hb-card-price s {
        font-weight: 400 !important;
        color: #a1a1aa !important;
        font-size: 13px !important;
    }

    @media (max-width: 1200px) {
        .hb-bundles-section .hb-bundles-track .hb-card,
        .hb-bundles-section .hb-cards .hb-card {
            flex: 0 0 calc((100% - 60px) / 4) !important;
        }
    }
    @media (max-width: 900px) {
        .hb-bundles-section .hb-bundles-track .hb-card,
        .hb-bundles-section .hb-cards .hb-card {
            flex: 0 0 calc((100% - 40px) / 3) !important;
        }
    }
    @media (max-width: 650px) {
        .hb-bundles-section .hb-bundles-track .hb-card,
        .hb-bundles-section .hb-cards .hb-card {
            flex: 0 0 calc((100% - 20px) / 2) !important;
            min-width: 160px !important;
        }
    }
    @media (max-width: 480px) {
        .hb-bundles-section {
            padding: 32px 16px 36px !important;
        }
        .hb-bundles-title {
            font-size: 24px !important;
        }
    }
</style>

<?php
$b_title = !empty($settings['section_title']) ? $settings['section_title'] : nesports_setting('bundles_title', 'Bundles');
$b_desc  = isset($settings['section_desc']) ? $settings['section_desc'] : nesports_setting('bundles_desc', 'Power, protection & performance built into every stack. Stack and save.');
$b_show_filters = isset($settings['show_filters']) ? ($settings['show_filters'] === 'yes') : true;

if (!empty($settings['custom_bundles']) && is_array($settings['custom_bundles'])) {
    $custom_list = array();
    foreach ($settings['custom_bundles'] as $cb) {
        $img_url = !empty($cb['bundle_image']['url']) ? $cb['bundle_image']['url'] : 'DSC_0167-scaled-1.jpg';
        $link_url = !empty($cb['bundle_link']['url']) ? $cb['bundle_link']['url'] : '/shop/';
        $b_price = !empty($cb['bundle_price']) ? $cb['bundle_price'] : '€59.99';
        if (is_numeric($b_price)) $b_price = '€' . number_format((float)$b_price, 2);
        $b_old = !empty($cb['bundle_old_price']) ? $cb['bundle_old_price'] : '';
        if (!empty($b_old) && is_numeric($b_old)) $b_old = '€' . number_format((float)$b_old, 2);

        $cat_raw = (!empty($cb['bundle_cat']) && $cb['bundle_cat'] === 'custom' && !empty($cb['custom_cat'])) 
            ? $cb['custom_cat'] 
            : (!empty($cb['bundle_cat']) ? $cb['bundle_cat'] : 'training');
        
        $cat_slug = sanitize_title($cat_raw);
        if (empty($cat_slug)) $cat_slug = 'training';
        $cat_label = trim($cat_raw);
        if ($cat_slug === 'lifting') $cat_label = 'Lifting Packs';
        elseif ($cat_slug === 'legs') $cat_label = 'Leg & Knee Packs';
        elseif ($cat_slug === 'training') $cat_label = 'Training Packs';

        $custom_list[] = array(
            'name'      => !empty($cb['bundle_name']) ? $cb['bundle_name'] : 'Pack',
            'cat'       => $cat_slug,
            'cat_label' => $cat_label,
            'price'     => $b_price,
            'old'       => $b_old,
            'url'       => $link_url,
            'images'    => array($img_url),
            'imgs'      => array($img_url),
        );
    }
    if (!empty($custom_list)) {
        $bundles = $custom_list;
    }
}

// Build dynamic filter tabs from default tabs + any custom categories defined
$dynamic_tabs = array();
foreach ($bundle_tabs as $k => $l) {
    $dynamic_tabs[$k] = $l;
}
foreach ($bundles as $b) {
    if (!empty($b['cat']) && $b['cat'] !== 'all') {
        $slug = sanitize_title($b['cat']);
        if (!isset($dynamic_tabs[$slug])) {
            $dynamic_tabs[$slug] = !empty($b['cat_label']) ? $b['cat_label'] : ucwords(str_replace(array('-', '_'), ' ', $b['cat']));
        }
    }
}
?>
    <div class="hb-bundles-header">
        <div>
            <h2 class="hb-bundles-title"><?php echo esc_html($b_title); ?></h2>
            <?php if (!empty($b_desc)): ?>
                <p class="hb-bundles-desc" style="margin: 4px 0 0; color: var(--hb-text-color, #64748b); font-size: 14px;"><?php echo esc_html($b_desc); ?></p>
            <?php endif; ?>
        </div>
        <div class="hb-bundles-carousel-controls">
            <button type="button" class="hb-bundles-arrow hb-bundles-prev" id="hb-bundles-prev" aria-label="Previous">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button type="button" class="hb-bundles-arrow hb-bundles-next" id="hb-bundles-next" aria-label="Next">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
        </div>
    </div>
    <?php if ($b_show_filters): ?>
    <div class="hb-pills hb-bundles-pills">
        <button type="button" class="hb-pill is-active" data-filter="all">ALL PACKS</button>
        <?php foreach ($dynamic_tabs as $key => $label): ?>
            <button type="button" class="hb-pill" data-filter="<?php echo esc_attr($key); ?>"><?php echo esc_html(strtoupper($label)); ?></button>
        <?php endforeach; ?>
    </div>
    <?php endif; ?>
    <div class="hb-bundles-carousel-wrap">
        <div class="hb-cards hb-bundles-track" id="hb-bundles-track">
        <?php foreach ($bundles as $b):
            $url = home_url($b['url']);
            $card_imgs = !empty($b['images']) ? $b['images'] : $b['imgs'];
        ?>
        <article class="hb-card" data-cat="<?php echo esc_attr($b['cat']); ?>">
            <a class="hb-bundle-media" href="<?php echo esc_url($url); ?>">
                <div class="hb-card-slider-track">
                    <?php foreach ($card_imgs as $idx => $imgPath): ?>
                    <div class="hb-card-slide" data-idx="<?php echo $idx; ?>">
                        <img class="hb-card-slide-img" src="<?php echo esc_url(nesports_img($imgPath)); ?>" alt="<?php echo esc_attr($b['name']); ?>" loading="lazy">
                    </div>
                    <?php endforeach; ?>
                </div>
                <!-- 3-Dot Scrubber Indicator -->
                <div class="hb-card-dots-wrap">
                    <div class="hb-card-dots">
                        <?php foreach ($card_imgs as $idx => $imgPath): ?>
                        <span class="hb-card-dot<?php echo $idx === 0 ? ' is-active' : ''; ?>" data-idx="<?php echo $idx; ?>"></span>
                        <?php endforeach; ?>
                    </div>
                </div>
            </a>
            <div class="hb-card-body">
                <h3 class="hb-card-title"><a href="<?php echo esc_url($url); ?>"><?php echo esc_html($b['name']); ?></a></h3>
                <div class="hb-card-price is-sale">
                    <span class="now"><?php echo esc_html(nesports_money($b['price'])); ?></span>
                    <s><?php echo esc_html(nesports_money($b['old'])); ?></s>
                </div>
            </div>
        </article>
        <?php endforeach; ?>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // 1. Left-to-right multi-angle hover scrubber for each bundle card
    var bundleCards = document.querySelectorAll('.hb-bundles-section .hb-card');
    bundleCards.forEach(function(card) {
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
            if (mouseX < width * 0.333) {
                targetIndex = 0;
            } else if (mouseX < width * 0.666) {
                targetIndex = 1;
            } else {
                targetIndex = 2;
            }
            goTo(targetIndex);
        });

        card.addEventListener('mouseleave', function() {
            goTo(0);
        });

        dots.forEach(function(dot) {
            dot.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var idx = parseInt(dot.getAttribute('data-idx') || '0', 10);
                goTo(idx);
            });
        });
    });

    // 2. Bundles 1-Row Carousel Arrow Navigation
    var bundlesTrack = document.getElementById('hb-bundles-track');
    var bundlesPrev = document.getElementById('hb-bundles-prev');
    var bundlesNext = document.getElementById('hb-bundles-next');

    function updateBundlesArrowState() {
        if (!bundlesTrack) return;
        var maxScroll = Math.max(0, bundlesTrack.scrollWidth - bundlesTrack.clientWidth);
        var currentScroll = bundlesTrack.scrollLeft;

        if (bundlesPrev) {
            var atStart = currentScroll <= 4;
            bundlesPrev.disabled = atStart;
            if (atStart) {
                bundlesPrev.setAttribute('disabled', 'disabled');
            } else {
                bundlesPrev.removeAttribute('disabled');
            }
        }

        if (bundlesNext) {
            var atEnd = currentScroll >= (maxScroll - 6) || maxScroll <= 2;
            bundlesNext.disabled = atEnd;
            if (atEnd) {
                bundlesNext.setAttribute('disabled', 'disabled');
            } else {
                bundlesNext.removeAttribute('disabled');
            }
        }
    }

    function getBundlesScrollStep() {
        var visibleCard = bundlesTrack ? bundlesTrack.querySelector('.hb-card:not([style*="display: none"])') : null;
        if (visibleCard) {
            return (visibleCard.offsetWidth + 20) * 2;
        }
        return 260;
    }

    if (bundlesPrev) {
        bundlesPrev.addEventListener('click', function(e) {
            e.preventDefault();
            if (bundlesPrev.disabled) return;
            bundlesTrack.scrollBy({ left: -getBundlesScrollStep(), behavior: 'smooth' });
            setTimeout(updateBundlesArrowState, 150);
            setTimeout(updateBundlesArrowState, 350);
        });
    }

    if (bundlesNext) {
        bundlesNext.addEventListener('click', function(e) {
            e.preventDefault();
            if (bundlesNext.disabled) return;
            bundlesTrack.scrollBy({ left: getBundlesScrollStep(), behavior: 'smooth' });
            setTimeout(updateBundlesArrowState, 150);
            setTimeout(updateBundlesArrowState, 350);
        });
    }

    if (bundlesTrack) {
        bundlesTrack.addEventListener('scroll', updateBundlesArrowState, { passive: true });
        window.addEventListener('resize', updateBundlesArrowState);
        updateBundlesArrowState();
        setTimeout(updateBundlesArrowState, 200);
        setTimeout(updateBundlesArrowState, 600);
    }

    // 3. Bundles pill category filter
    var pills = document.querySelectorAll('.hb-bundles-pills .hb-pill');
    var cards = document.querySelectorAll('.hb-bundles-section .hb-card');
    pills.forEach(function(pill) {
        pill.addEventListener('click', function() {
            pills.forEach(function(p) { p.classList.remove('is-active'); });
            pill.classList.add('is-active');
            var filter = pill.getAttribute('data-filter');
            cards.forEach(function(card) {
                var cat = card.getAttribute('data-cat');
                if (filter === 'all' || cat === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
            if (bundlesTrack) {
                bundlesTrack.scrollLeft = 0;
                setTimeout(updateBundlesArrowState, 60);
                setTimeout(updateBundlesArrowState, 250);
            }
        });
    });
});
</script>
