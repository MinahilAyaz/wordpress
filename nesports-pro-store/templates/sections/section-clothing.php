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
    .hb-clothing-carousel-wrap {
        position: relative !important;
        width: 100% !important;
        overflow: hidden !important;
    }
    .hb-clothing-track {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        gap: 18px !important;
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

    /* 4-Card Desktop Layout matching Reference Screenshot 2 */
    .hb-clothing-card {
        flex: 0 0 calc((100% - 54px) / 4) !important;
        min-width: 240px !important;
        height: 420px !important;
        position: relative !important;
        border-radius: 18px !important;
        overflow: hidden !important;
        text-decoration: none !important;
        color: #ffffff !important;
        background: #18181b !important;
        scroll-snap-align: start !important;
        display: block !important;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08) !important;
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .hb-clothing-card:hover {
        transform: translateY(-4px) !important;
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.16) !important;
    }
    .hb-clothing-card-img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        object-position: center !important;
        display: block !important;
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .hb-clothing-card:hover .hb-clothing-card-img {
        transform: scale(1.06) !important;
    }
    .hb-clothing-card-overlay {
        position: absolute !important;
        inset: 0 !important;
        background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.65) 80%, rgba(0,0,0,0.92) 100%) !important;
        pointer-events: none !important;
        transition: opacity 0.3s ease !important;
    }
    .hb-clothing-card:hover .hb-clothing-card-overlay {
        opacity: 0.95 !important;
    }
    .hb-clothing-card-content {
        position: absolute !important;
        bottom: 22px !important;
        left: 22px !important;
        right: 22px !important;
        z-index: 2 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-start !important;
    }
    .hb-clothing-card-label {
        font-family: var(--hb-font, 'Poppins', sans-serif) !important;
        font-size: 16.5px !important;
        font-weight: 700 !important;
        color: #ffffff !important;
        letter-spacing: 0.5px !important;
        text-transform: uppercase !important;
        line-height: 1.2 !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 8px !important;
    }
    .hb-clothing-card-arrow {
        display: inline-block !important;
        font-size: 18px !important;
        line-height: 1 !important;
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .hb-clothing-card:hover .hb-clothing-card-arrow {
        transform: translateX(5px) !important;
    }

    @media (max-width: 1100px) {
        .hb-clothing-card {
            flex: 0 0 calc((100% - 36px) / 3) !important;
            height: 380px !important;
        }
    }
    @media (max-width: 820px) {
        .hb-clothing-card {
            flex: 0 0 calc((100% - 18px) / 2) !important;
            height: 350px !important;
        }
    }
    @media (max-width: 600px) {
        .hb-clothing-section {
            padding: 32px 16px 40px !important;
        }
        .hb-clothing-title {
            font-size: 24px !important;
        }
        .hb-clothing-card {
            flex: 0 0 74vw !important;
            min-width: 220px !important;
            height: 330px !important;
        }
    }
    </style>

    <div class="hb-clothing-header">
        <h2 class="hb-clothing-title">Clothing</h2>
        <div class="hb-clothing-carousel-controls">
            <button type="button" class="hb-carousel-arrow hb-clothing-prev" id="hb-clothing-prev" aria-label="Previous" disabled>
                <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button type="button" class="hb-carousel-arrow hb-clothing-next" id="hb-clothing-next" aria-label="Next">
                <i class="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    </div>

    <div class="hb-clothing-carousel-wrap">
        <div class="hb-clothing-track" id="hb-clothing-track">
            <?php foreach ($clothing as $c): ?>
            <a class="hb-clothing-card" href="<?php echo esc_url(home_url($c['url'])); ?>">
                <img class="hb-clothing-card-img" src="<?php echo esc_url(nesports_img($c['img'])); ?>" alt="<?php echo esc_attr($c['title']); ?>" loading="lazy">
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
                    return card.offsetWidth + 18;
                }
                return 320;
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
