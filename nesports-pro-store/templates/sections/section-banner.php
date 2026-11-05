<?php
/**
 * NESPORTS3 - Section: Mid-Page Parallax Banner
 * Usable standalone or via shortcode [nesports_banner]
 */
if (!defined('ABSPATH')) {
    exit;
}
?>
<section class="hb-static-banner" style="--static-bg: url('<?php echo esc_url(nesports_img('DSC_2246-scaled.jpg')); ?>');">
    <div class="hb-static-banner-overlay"></div>
    <div class="hb-static-banner-content">
        <span class="hb-static-banner-eyebrow">STRENGTH ISN'T GIVEN. IT'S EARNED.</span>
        <h2 class="hb-static-banner-title">BUILT FOR PROGRESS.<br>ENGINEERED TO ENDURE.</h2>
        <div class="hb-static-banner-action">
            <a class="hb-static-play-btn" href="<?php echo esc_url(home_url('/our-story/')); ?>" aria-label="Explore our story">
                <span class="hb-static-play-icon">
                    <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.5 13.134C23.1667 13.5189 23.1667 14.4811 22.5 14.866L3 26.1244C2.33333 26.5093 1.5 26.0281 1.5 25.2583L1.5 2.74167C1.5 1.97187 2.33333 1.49074 3 1.87564L22.5 13.134Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    </svg>
                </span>
                <span class="hb-static-play-label">OUR STORY</span>
            </a>
        </div>
    </div>
</section>

