<?php
/**
 * NESPORTS3 - Section: Mid-Page Parallax Banner
 * Usable standalone or via shortcode [nesports_banner]
 */
if (!defined('ABSPATH')) {
    exit;
}
?>
<section class="hb-static-banner" style="--static-bg: url('<?php echo esc_url(nesports_img('DSC_0750-scaled.jpg')); ?>');">
    <div class="hb-static-banner-overlay"></div>
    <div class="hb-static-banner-content">
        <span class="hb-static-banner-eyebrow">STRENGTH ISN'T GIVEN. IT'S EARNED.</span>
        <h2 class="hb-static-banner-title">BUILT FOR PROGRESS.<br>ENGINEERED TO ENDURE.</h2>
        <div class="hb-static-banner-action">
            <a class="hb-static-banner-btn" href="<?php echo esc_url(home_url('/our-story/')); ?>" aria-label="Learn why we built this">
                <span>Learn Why We Built This</span>
            </a>
        </div>
    </div>
</section>

