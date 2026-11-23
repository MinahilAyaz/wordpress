<?php
/**
 * NESPORTS3 - Section: Clothing (Exact Hardbody Store Reference)
 * Usable standalone or via shortcode [nesports_clothing]
 */
if (!defined('ABSPATH')) {
    exit;
}
$clothing = nesports_clothing();
?>
<section class="hb-clothing-section" id="clothing">
    <style id="hb-clothing-critical-css">
    .hb-clothing-section {
        padding: 44px 32px 52px !important;
        max-width: 1440px !important;
        margin: 0 auto !important;
        box-sizing: border-box !important;
        width: 100% !important;
        overflow: hidden !important;
    }
    .hb-clothing-header {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        margin-bottom: 24px !important;
        width: 100% !important;
    }
    .hb-clothing-title {
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: clamp(28px, 3.2vw, 40px) !important;
        font-weight: 700 !important;
        color: #111111 !important;
        margin: 0 !important;
        letter-spacing: -0.8px !important;
        line-height: 1.15 !important;
        text-align: left !important;
    }
    .hb-clothing-carousel-controls {
        display: inline-flex !important;
        align-items: center !important;
        gap: 10px !important;
        flex-shrink: 0 !important;
    }
    .hb-clothing-arrow {
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
    .hb-clothing-arrow:hover:not(:disabled) {
        border-color: #111111 !important;
        background: #111111 !important;
        color: #ffffff !important;
        transform: scale(1.05) !important;
    }
    .hb-clothing-arrow:disabled {
        opacity: 0.3 !important;
        cursor: not-allowed !important;
        border-color: #e5e7eb !important;
        color: #a1a1aa !important;
    }
    .hb-clothing-carousel-wrap {
        position: relative !important;
        width: 100% !important;
        overflow: hidden !important;
    }
    .hb-clothing-track {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        gap: 16px !important;
        overflow-x: auto !important;
        scroll-behavior: smooth !important;
        scroll-snap-type: x mandatory !important;
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: none !important;
        padding: 4px 2px 14px !important;
        margin: 0 !important;
        width: 100% !important;
    }
    .hb-clothing-track::-webkit-scrollbar {
        display: none !important;
    }

    /* 5-Card Desktop Layout - All 5 categories shown simultaneously */
    .hb-clothing-card {
        flex: 0 0 calc((100% - 64px) / 5) !important;
        min-width: 0 !important;
        height: 330px !important;
        position: relative !important;
        border-radius: 16px !important;
        overflow: hidden !important;
        text-decoration: none !important;
        color: #ffffff !important;
        background: #18181b !important;
        scroll-snap-align: start !important;
        display: block !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .hb-clothing-card:hover {
        transform: translateY(-4px) !important;
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.16) !important;
    }
    .hb-clothing-card-media {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        overflow: hidden !important;
    }
    .hb-clothing-card-img {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        object-position: center !important;
        display: block !important;
        transition: opacity 0.45s ease-in-out, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
        will-change: opacity, transform !important;
    }
    .hb-clothing-card-img.hb-img-primary {
        opacity: 1 !important;
        z-index: 1 !important;
        transform: scale(1) !important;
    }
    .hb-clothing-card-img.hb-img-hover {
        opacity: 0 !important;
        z-index: 2 !important;
        transform: scale(1.02) !important;
    }
    .hb-clothing-card:hover .hb-clothing-card-img.hb-img-primary {
        opacity: 0 !important;
        transform: scale(1.06) !important;
    }
    .hb-clothing-card:hover .hb-clothing-card-img.hb-img-hover {
        opacity: 1 !important;
        transform: scale(1.06) !important;
    }
    .hb-clothing-card-overlay {
        position: absolute !important;
        inset: 0 !important;
        z-index: 3 !important;
        background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.65) 80%, rgba(0,0,0,0.92) 100%) !important;
        pointer-events: none !important;
        transition: opacity 0.3s ease !important;
    }
    .hb-clothing-card:hover .hb-clothing-card-overlay {
        opacity: 0.95 !important;
    }
    .hb-clothing-card-content {
        position: absolute !important;
        bottom: 16px !important;
        left: 14px !important;
        right: 14px !important;
        z-index: 4 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-start !important;
    }
    .hb-clothing-card-label {
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: 13.5px !important;
        font-weight: 700 !important;
        color: #ffffff !important;
        letter-spacing: 0.4px !important;
        text-transform: uppercase !important;
        line-height: 1.2 !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
    }
    .hb-clothing-card-arrow {
        display: inline-block !important;
        font-size: 15px !important;
        line-height: 1 !important;
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .hb-clothing-card:hover .hb-clothing-card-arrow {
        transform: translateX(5px) !important;
    }

    @media (max-width: 1200px) {
        .hb-clothing-card {
            flex: 0 0 calc((100% - 48px) / 4) !important;
            height: 320px !important;
        }
    }
    @media (max-width: 900px) {
        .hb-clothing-card {
            flex: 0 0 calc((100% - 32px) / 3) !important;
            height: 300px !important;
        }
    }
    @media (max-width: 650px) {
        .hb-clothing-card {
            flex: 0 0 calc((100% - 16px) / 2) !important;
            height: 270px !important;
        }
    }
    @media (max-width: 480px) {
        .hb-clothing-section {
            padding: 32px 16px 40px !important;
        }
        .hb-clothing-title {
            font-size: 24px !important;
        }
        .hb-clothing-card {
            flex: 0 0 76vw !important;
            height: 270px !important;
        }
    }
    
    @media (max-width: 991px) {
        .hb-clothing-header {
            justify-content: center !important;
            text-align: center !important;
            width: 100% !important;
        }
        .hb-clothing-title {
            text-align: center !important;
            width: 100% !important;
            margin: 0 auto !important;
        }
    }
    </style>

    <div class="hb-clothing-header">
        <div>
            <h2 class="hb-clothing-title"><?php echo esc_html(nesports_setting('clothing_title', 'Clothing')); ?></h2>
            <?php $clothing_desc = nesports_setting('clothing_desc', ''); if (!empty($clothing_desc)): ?>
                <p class="hb-clothing-desc" style="margin: 4px 0 0; color: var(--hb-text-color, #64748b); font-size: 14px;"><?php echo esc_html($clothing_desc); ?></p>
            <?php endif; ?>
        </div>
        <div class="hb-clothing-carousel-controls">
            <button type="button" class="hb-clothing-arrow hb-clothing-arrow-prev" id="hb-clothing-prev" aria-label="Previous">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button type="button" class="hb-clothing-arrow hb-clothing-arrow-next" id="hb-clothing-next" aria-label="Next">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
        </div>
    </div>

    <div class="hb-clothing-carousel-wrap">
        <div class="hb-clothing-track" id="hb-clothing-track">
            <?php foreach ($clothing as $c): 
                $hover_img = !empty($c['hover_img']) ? $c['hover_img'] : $c['img'];
            ?>
            <a class="hb-clothing-card" href="<?php echo esc_url(home_url($c['url'])); ?>">
                <div class="hb-clothing-card-media">
                    <img class="hb-clothing-card-img hb-img-primary" src="<?php echo esc_url(nesports_img($c['img'])); ?>" alt="<?php echo esc_attr($c['title']); ?>" loading="lazy">
                    <img class="hb-clothing-card-img hb-img-hover" src="<?php echo esc_url(nesports_img($hover_img)); ?>" alt="<?php echo esc_attr($c['title']); ?> Front" loading="lazy">
                </div>
                <div class="hb-clothing-card-overlay"></div>
                <div class="hb-clothing-card-content">
                    <span class="hb-clothing-card-label">
                        <?php echo esc_html($c['title']); ?>
                        <span class="hb-clothing-card-arrow">&rarr;</span>
                    </span>
                </div>
            </a>
            <?php endforeach; ?>
        </div>
    </div>

    <script id="hb-clothing-script">
    (function() {
        function initClothingCarousel() {
            var track = document.getElementById('hb-clothing-track');
            var prev = document.getElementById('hb-clothing-prev');
            var next = document.getElementById('hb-clothing-next');

            if (!track) return;

            function updateClothingArrowState() {
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
                var card = track.querySelector('.hb-clothing-card');
                if (card) {
                    return card.offsetWidth + 16;
                }
                return 280;
            }

            if (prev) {
                prev.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (prev.disabled) return;
                    track.scrollBy({ left: -getStep(), behavior: 'smooth' });
                    setTimeout(updateClothingArrowState, 150);
                    setTimeout(updateClothingArrowState, 350);
                });
            }

            if (next) {
                next.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (next.disabled) return;
                    track.scrollBy({ left: getStep(), behavior: 'smooth' });
                    setTimeout(updateClothingArrowState, 150);
                    setTimeout(updateClothingArrowState, 350);
                });
            }

            track.addEventListener('scroll', updateClothingArrowState, { passive: true });
            window.addEventListener('resize', updateClothingArrowState);

            updateClothingArrowState();
            setTimeout(updateClothingArrowState, 150);
            setTimeout(updateClothingArrowState, 500);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initClothingCarousel);
        } else {
            initClothingCarousel();
        }
    })();
    </script>
</section>
