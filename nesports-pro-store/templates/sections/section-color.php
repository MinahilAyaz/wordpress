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

    /* NESPORTS3 Card Style (5-card desktop layout) */
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
        background: #f6f6f8 !important;
        border-radius: 16px !important;
        overflow: hidden !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border: 1px solid rgba(0, 0, 0, 0.03) !important;
        transition: background 0.3s ease, box-shadow 0.35s ease !important;
    }
    .hb-color-card:hover .hb-color-media {
        background: #eeeff2 !important;
        box-shadow: 0 14px 32px -6px rgba(0, 0, 0, 0.1) !important;
    }
    .hb-color-media img {
        width: 82% !important;
        height: 82% !important;
        object-fit: contain !important;
        display: block !important;
        mix-blend-mode: multiply !important;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .hb-color-card:hover .hb-color-media img {
        transform: scale(1.08) !important;
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
    </style>

    <div class="hb-color-container">
        <div class="hb-color-nav-grid">
            <div class="hb-color-title-wrap">
                <h2 class="hb-color-title">Shop by Color</h2>
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
                ?>
                <a class="hb-color-card <?php echo $is_shown ? '' : 'is-hidden'; ?>" data-color="<?php echo esc_attr($c_key); ?>" href="<?php echo esc_url(home_url($item['url'])); ?>" style="<?php echo $is_shown ? 'display:flex !important;' : 'display:none !important;'; ?>">
                    <div class="hb-color-media">
                        <img src="<?php echo esc_url(nesports_img($item['img'])); ?>" alt="<?php echo esc_attr($item['name']); ?>" loading="lazy">
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

            updateArrowState();
            setTimeout(updateArrowState, 150);
            setTimeout(updateArrowState, 500);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initColorSection);
        } else {
            initColorSection();
        }
    })();
    </script>
</section>
