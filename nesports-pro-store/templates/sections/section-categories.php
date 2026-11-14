<?php
/**
 * NESPORTS3 - Section: Top Sellers (Exact Hardbody Store Carousel Reference)
 * Usable standalone or via shortcode [nesports_categories]
 */
if (!defined('ABSPATH')) {
    exit;
}
$collections = nesports_collections();
?>
<section class="hb-collections-section hb-top-sellers-section" id="top-sellers">
    <style id="hb-top-sellers-critical-css">
    .hb-top-sellers-section {
        padding: 44px 32px 48px !important;
        max-width: 1440px !important;
        margin: 0 auto !important;
        box-sizing: border-box !important;
        width: 100% !important;
        overflow: hidden !important;
    }

    /* Top Sellers Navigation Header Grid */
    .hb-top-sellers-nav-grid {
        display: grid !important;
        grid-template-columns: 1fr auto !important;
        grid-template-rows: auto auto !important;
        gap: 14px 16px !important;
        margin-bottom: 24px !important;
        align-items: center !important;
        width: 100% !important;
    }
    .hb-top-sellers-title {
        grid-column: 1 / -1 !important;
        grid-row: 1 / 2 !important;
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: clamp(28px, 3.2vw, 40px) !important;
        font-weight: 700 !important;
        color: #111111 !important;
        margin: 0 !important;
        letter-spacing: -0.8px !important;
        line-height: 1.15 !important;
        text-align: left !important;
    }
    .hb-filter-pills-wrap {
        grid-column: 1 / 2 !important;
        grid-row: 2 / 3 !important;
        min-width: 0 !important;
        width: 100% !important;
        overflow: hidden !important;
    }
    .hb-filter-pills {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        overflow-x: auto !important;
        scrollbar-width: none !important;
        -webkit-overflow-scrolling: touch !important;
        padding: 4px 4px 6px !important;
        width: 100% !important;
        min-width: 0 !important;
        scroll-padding-right: 20px !important;
    }
    .hb-filter-pills::-webkit-scrollbar {
        display: none !important;
    }
    .hb-filter-pills::after {
        content: '' !important;
        display: block !important;
        flex: 0 0 16px !important;
        width: 16px !important;
        height: 1px !important;
    }

    /* Exact Screenshot 1 Pill Style with Left-to-Right Curtain Fill Animation */
    .hb-filter-pill {
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

    /* Left-to-Right Curtain Animation - EXACTLY from Screenshot 1 (.hb-pill) */
    .hb-filter-pill::before {
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

    /* Hover: curtain fills smoothly from left to right, text turns white */
    .hb-filter-pill:hover::before {
        transform: scaleX(1) !important;
    }
    .hb-filter-pill:hover {
        color: #ffffff !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12) !important;
    }

    /* Active: stays filled */
    .hb-filter-pill.is-active::before {
        transform: scaleX(1) !important;
    }
    .hb-filter-pill.is-active {
        color: #ffffff !important;
        border-color: #111111 !important;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18) !important;
    }

    /* Carousel navigation controls (< >) */
    .hb-carousel-controls {
        grid-column: 2 / 3 !important;
        grid-row: 2 / 3 !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 10px !important;
        flex-shrink: 0 !important;
        margin-left: 8px !important;
        justify-self: end !important;
    }
    .hb-carousel-arrow {
        width: 44px !important;
        height: 44px !important;
        border-radius: 50% !important;
        border: 1.5px solid #e4e4e7 !important;
        background: #ffffff !important;
        color: #18181b !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        font-size: 14px !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
        transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
        padding: 0 !important;
        outline: none !important;
    }
    .hb-carousel-arrow:hover {
        border-color: #111111 !important;
        background: #111111 !important;
        color: #ffffff !important;
        transform: scale(1.08) !important;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15) !important;
    }
    .hb-carousel-arrow:active {
        transform: scale(0.92) !important;
    }
    .hb-carousel-arrow:disabled,
    .hb-carousel-arrow[disabled] {
        opacity: 0.25 !important;
        cursor: not-allowed !important;
        pointer-events: none !important;
        border-color: #e4e4e7 !important;
        background: #ffffff !important;
        color: #a1a1aa !important;
        transform: none !important;
        box-shadow: none !important;
    }
        transform: scale(0.92) !important;
    }

    /* Carousel track */
    .hb-category-carousel-wrap {
        position: relative !important;
        width: 100% !important;
        overflow: hidden !important;
    }
    .hb-category-track {
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
    .hb-category-track::-webkit-scrollbar {
        display: none !important;
    }

    /* Card styling */
    .hb-category-card {
        flex: 0 0 calc((100% - 72px) / 5) !important;
        min-width: 220px !important;
        max-width: 280px !important;
        box-sizing: border-box !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: stretch !important;
        text-decoration: none !important;
        color: inherit !important;
        background: transparent !important;
        cursor: pointer !important;
        scroll-snap-align: start !important;
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .hb-category-card:hover {
        transform: translateY(-6px) !important;
    }

    /* Left-to-right card transition */
    @keyframes cardSlideLeftToRight {
        0% {
            opacity: 0;
            transform: translateX(-40px) scale(0.96);
        }
        100% {
            opacity: 1;
            transform: translateX(0) scale(1);
        }
    }
    .hb-category-card.anim-l2r {
        animation: cardSlideLeftToRight 0.45s cubic-bezier(0.16, 1, 0.3, 1) both !important;
    }

    /* Card Media container */
    .hb-category-media {
        position: relative !important;
        width: 100% !important;
        aspect-ratio: 1 / 1 !important;
        background: #f6f6f8 !important;
        border-radius: 16px !important;
        overflow: hidden !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border: 1px solid rgba(0, 0, 0, 0.03) !important;
        transition: background 0.3s ease, box-shadow 0.35s ease !important;
    }
    .hb-category-card:hover .hb-category-media {
        background: #eeeeF1 !important;
        box-shadow: 0 14px 32px -6px rgba(0, 0, 0, 0.1) !important;
    }

    .hb-card-badge {
        position: absolute !important;
        top: 12px !important;
        left: 12px !important;
        background: #e11d48 !important;
        color: #ffffff !important;
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        letter-spacing: 0.3px !important;
        padding: 4px 10px !important;
        border-radius: 9999px !important;
        z-index: 2 !important;
        text-transform: uppercase !important;
        box-shadow: 0 2px 6px rgba(225, 29, 72, 0.3) !important;
    }
    .hb-category-media img {
        width: 78% !important;
        height: 78% !important;
        max-width: 78% !important;
        max-height: 78% !important;
        object-fit: contain !important;
        object-position: center !important;
        mix-blend-mode: multiply !important;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .hb-category-card:hover .hb-category-media img {
        transform: scale(1.08) !important;
    }
    .hb-category-bottom {
        display: flex !important;
        justify-content: space-between !important;
        align-items: flex-start !important;
        gap: 8px !important;
        margin-top: 12px !important;
        width: 100% !important;
        padding: 0 2px !important;
    }
    .hb-category-meta-left {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        flex: 1 !important;
        min-width: 0 !important;
    }
    .hb-category-title {
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: 14.5px !important;
        font-weight: 600 !important;
        color: #111111 !important;
        margin: 0 !important;
        text-align: left !important;
        letter-spacing: -0.2px !important;
        line-height: 1.35 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        width: 100% !important;
        transition: color 0.2s ease !important;
    }
    .hb-category-card:hover .hb-category-title {
        color: var(--hb-accent, #e11d48) !important;
    }
    .hb-category-subtitle {
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: 12px !important;
        color: #71717a !important;
        margin-top: 2px !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        width: 100% !important;
    }
    .hb-category-price-box {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-end !important;
        flex-shrink: 0 !important;
    }
    .hb-price-now {
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: 14px !important;
        font-weight: 700 !important;
        color: #111111 !important;
        line-height: 1.2 !important;
    }
    .hb-price-old {
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: 11.5px !important;
        color: #a1a1aa !important;
        text-decoration: line-through !important;
        line-height: 1.2 !important;
    }
    @media (max-width: 1200px) {
        .hb-category-card {
            flex: 0 0 calc((100% - 54px) / 4) !important;
        }
    }
    @media (max-width: 992px) {
        .hb-top-sellers-nav-grid {
            grid-template-columns: 1fr auto !important;
            grid-template-rows: auto auto !important;
            gap: 16px 12px !important;
            margin-bottom: 20px !important;
        }
        .hb-top-sellers-title {
            grid-column: 1 / 2 !important;
            grid-row: 1 / 2 !important;
            margin: 0 !important;
        }
        .hb-carousel-controls {
            grid-column: 2 / 3 !important;
            grid-row: 1 / 2 !important;
            justify-self: end !important;
            margin-left: 0 !important;
        }
        .hb-filter-pills-wrap {
            grid-column: 1 / -1 !important;
            grid-row: 2 / 3 !important;
            width: 100% !important;
        }
        .hb-category-card {
            flex: 0 0 calc((100% - 36px) / 3) !important;
        }
    }
    @media (max-width: 768px) {
        .hb-top-sellers-section {
            padding: 32px 16px 36px !important;
        }
        .hb-top-sellers-title {
            font-size: 24px !important;
        }
        .hb-category-card {
            flex: 0 0 68vw !important;
            min-width: 200px !important;
        }
        .hb-carousel-arrow {
            width: 38px !important;
            height: 38px !important;
            font-size: 13px !important;
        }
    }
    </style>

    <div class="hb-collections-container">
        <div class="hb-top-sellers-nav-grid">
            <h2 class="hb-top-sellers-title">Top Sellers</h2>

            <div class="hb-filter-pills-wrap">
                <div class="hb-filter-pills" id="hb-top-filter-pills">
                    <button type="button" class="hb-filter-pill is-active" data-filter="all">ALL ITEMS</button>
                    <button type="button" class="hb-filter-pill" data-filter="belts">BELTS</button>
                    <button type="button" class="hb-filter-pill" data-filter="straps">LIFTING STRAPS</button>
                    <button type="button" class="hb-filter-pill" data-filter="knee-wrap">KNEE WRAPS</button>
                    <button type="button" class="hb-filter-pill" data-filter="elbow-wrap">ELBOW WRAPS</button>
                    <button type="button" class="hb-filter-pill" data-filter="wrist-straps">WRIST STRAPS</button>
                    <button type="button" class="hb-filter-pill" data-filter="gym-bag">GYM BAGS</button>
                    <button type="button" class="hb-filter-pill" data-filter="speed-ball">SPEED BALL</button>
                    <button type="button" class="hb-filter-pill" data-filter="ankle-straps">ANKLE STRAPS</button>
                    <button type="button" class="hb-filter-pill" data-filter="barbell-pads">BARBELL PADS</button>
                </div>
            </div>

            <div class="hb-carousel-controls">
                <button type="button" class="hb-carousel-arrow hb-carousel-prev" id="hb-top-seller-prev" aria-label="Previous" disabled>
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <button type="button" class="hb-carousel-arrow hb-carousel-next" id="hb-top-seller-next" aria-label="Next">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        </div>

        <div class="hb-category-carousel-wrap">
            <div class="hb-category-track" id="hb-top-seller-track">
                <?php foreach ($collections as $c): ?>
                <a class="hb-category-card" data-cat="<?php echo esc_attr($c['category']); ?>" href="<?php echo esc_url(home_url($c['url'])); ?>">
                    <div class="hb-category-media">
                        <?php if (!empty($c['badge'])): ?>
                            <span class="hb-card-badge"><?php echo esc_html($c['badge']); ?></span>
                        <?php endif; ?>
                        <img src="<?php echo esc_url(nesports_img($c['img'])); ?>" alt="<?php echo esc_attr($c['title']); ?>" loading="lazy">
                    </div>
                    <div class="hb-category-bottom">
                        <div class="hb-category-meta-left">
                            <h3 class="hb-category-title"><?php echo esc_html($c['title']); ?></h3>
                            <?php if (!empty($c['subtitle'])): ?>
                                <span class="hb-category-subtitle"><?php echo esc_html($c['subtitle']); ?></span>
                            <?php endif; ?>
                        </div>
                        <div class="hb-category-price-box">
                            <span class="hb-price-now"><?php echo esc_html($c['price']); ?></span>
                            <?php if (!empty($c['old_price'])): ?>
                                <span class="hb-price-old"><?php echo esc_html($c['old_price']); ?></span>
                            <?php endif; ?>
                        </div>
                    </div>
                </a>
                <?php endforeach; ?>
            </div>
        </div>
    </div>

    <script id="hb-top-sellers-script">
    (function() {
        function initTopSellers() {
            var track = document.getElementById('hb-top-seller-track');
            var prev = document.getElementById('hb-top-seller-prev');
            var next = document.getElementById('hb-top-seller-next');
            var pills = document.querySelectorAll('#hb-top-filter-pills .hb-filter-pill');

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
                var card = track.querySelector('.hb-category-card:not([style*="display: none"])');
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

            // Listen to scroll & resize
            track.addEventListener('scroll', updateArrowState, { passive: true });
            window.addEventListener('resize', updateArrowState);

            // Left-to-right animated filtering
            pills.forEach(function(pill) {
                pill.addEventListener('click', function() {
                    pills.forEach(function(p) { p.classList.remove('is-active'); });
                    pill.classList.add('is-active');

                    var cat = pill.getAttribute('data-filter');
                    var cards = track.querySelectorAll('.hb-category-card');

                    var delay = 0;
                    cards.forEach(function(card) {
                        var cardCat = card.getAttribute('data-cat');
                        card.classList.remove('anim-l2r');
                        if (cat === 'all' || cardCat === cat) {
                            card.style.display = 'flex';
                            card.style.animationDelay = (delay * 0.06) + 's';
                            void card.offsetWidth; // Reflow for restart
                            card.classList.add('anim-l2r');
                            delay++;
                        } else {
                            card.style.display = 'none';
                        }
                    });

                    track.scrollTo({ left: 0, behavior: 'smooth' });
                    setTimeout(updateArrowState, 100);
                    setTimeout(updateArrowState, 300);
                });
            });

            // Initial arrow state
            updateArrowState();
            setTimeout(updateArrowState, 150);
            setTimeout(updateArrowState, 500);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initTopSellers);
        } else {
            initTopSellers();
        }
    })();
    </script>
</section>
