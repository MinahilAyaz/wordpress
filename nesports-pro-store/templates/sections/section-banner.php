<?php
/**
 * NESPORTS3 - Section: Mid-Page Parallax Banner
 * Usable standalone or via shortcode [nesports_banner]
 */
if (!defined('ABSPATH')) {
    exit;
}
?>
<?php
$banner_bg = nesports_setting('banner_img', 'DSC_0750-scaled.jpg');
$banner_eyebrow = nesports_setting('banner_badge', "STRENGTH ISN'T GIVEN. IT'S EARNED.");
$banner_title = nesports_setting('banner_title', "BUILT FOR PROGRESS.<br>ENGINEERED TO ENDURE.");
$banner_btn_text = nesports_setting('banner_btn_text', 'Learn Why We Built This');
$banner_btn_url = nesports_setting('banner_btn_url', '/our-story/');
?>
<section class="hb-static-banner" style="--static-bg: url('<?php echo esc_url(nesports_img($banner_bg)); ?>');">
    <div class="hb-static-banner-overlay"></div>
    <div class="hb-static-banner-content">
        <span class="hb-static-banner-eyebrow"><?php echo esc_html($banner_eyebrow); ?></span>
        <h2 class="hb-static-banner-title"><?php echo wp_kses_post($banner_title); ?></h2>
        <div class="hb-static-banner-action">
            <a class="hb-static-banner-btn" href="<?php echo esc_url(home_url($banner_btn_url)); ?>" aria-label="<?php echo esc_attr($banner_btn_text); ?>">
                <span><?php echo esc_html($banner_btn_text); ?></span>
            </a>
        </div>
    </div>
</section>

