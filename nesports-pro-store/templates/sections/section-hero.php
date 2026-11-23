<?php
/**
 * NESPORTS3 - Section: Hero Carousel
 * Usable standalone or via shortcode [nesports_hero]
 */
if (!defined('ABSPATH')) {
    exit;
}
$hero_slides = nesports_hero_slides();
?>
<section class="hb-hero" id="hb-hero">
    <div class="hb-hero-track" id="hb-hero-track">
        <?php 
        foreach ($hero_slides as $i => $s): 
            $title = ($i === 0 && nesports_setting('hero_title')) ? nesports_setting('hero_title') : $s['title'];
            $sub   = ($i === 0 && nesports_setting('hero_badge')) ? nesports_setting('hero_badge') : $s['sub'];
            $desc  = ($i === 0 && nesports_setting('hero_subtitle')) ? nesports_setting('hero_subtitle') : $s['desc'];
            $img   = ($i === 0 && nesports_setting('hero_bg_image')) ? nesports_setting('hero_bg_image') : $s['img'];
            $btn1  = ($i === 0 && nesports_setting('hero_primary_cta')) ? nesports_setting('hero_primary_cta') : 'SHOP NOW';
            $url1  = ($i === 0 && nesports_setting('hero_primary_url')) ? nesports_setting('hero_primary_url') : $s['url'];
            $btn2  = ($i === 0 && nesports_setting('hero_secondary_cta')) ? nesports_setting('hero_secondary_cta') : 'VIEW ALL PRODUCTS';
            $url2  = ($i === 0 && nesports_setting('hero_secondary_url')) ? nesports_setting('hero_secondary_url') : '/shop/';
        ?>
        <div class="hb-hero-slide hb-hero-slide--<?php echo esc_attr($s['type']); ?><?php echo $i === 0 ? ' is-active' : ''; ?>">
            <span class="hb-hero-watermark" aria-hidden="true">NESPORTS3</span>
            
            <div class="hb-hero-media">
                <img src="<?php echo esc_url(nesports_img($img)); ?>" alt="<?php echo esc_attr($title); ?>"<?php echo $i > 0 ? ' loading="lazy"' : ''; ?>>
            </div>

            <div class="hb-hero-caption">
                <span class="hb-hero-sub"><?php echo esc_html($sub); ?></span>
                <h2 class="hb-hero-title"><?php echo esc_html($title); ?></h2>
                
                <?php if (!empty($desc)): ?>
                    <p class="hb-hero-desc"><?php echo esc_html($desc); ?></p>
                <?php endif; ?>

                <div class="hb-hero-bottom-row">
                    <a href="<?php echo esc_url(home_url($url1)); ?>" class="hb-hero-btn hb-hero-btn--red"><?php echo esc_html($btn1); ?></a>
                    <a href="<?php echo esc_url(home_url($url2)); ?>" class="hb-hero-btn hb-hero-btn--white"><?php echo esc_html($btn2); ?></a>
                </div>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
    <div class="hb-hero-dots" id="hb-hero-dots">
        <?php foreach ($hero_slides as $i => $s): ?>
            <button type="button" class="<?php echo $i === 0 ? 'is-active' : ''; ?>" data-slide="<?php echo (int) $i; ?>" aria-label="Slide <?php echo (int) $i + 1; ?>"></button>
        <?php endforeach; ?>
    </div>
</section>

