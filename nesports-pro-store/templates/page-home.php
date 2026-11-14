<?php
/**
 * NESPORTS3 - Flagship Home Page
 */
if (!defined('ABSPATH')) {
    exit;
}

include NESPORTS_PLUGIN_DIR . 'templates/header-nesports.php';
?>

<main class="hb-main">
<?php
if (function_exists('the_content') && did_action('elementor/loaded') && (isset($_GET['elementor-preview']) || get_post_meta(get_the_ID(), '_nesports_elementor_seeded', true))) :
    while (have_posts()) :
        the_post();
        the_content();
    endwhile;
else :
?>
    <!-- 1. HERO CAROUSEL -->
    <?php include NESPORTS_PLUGIN_DIR . 'templates/sections/section-hero.php'; ?>

    <!-- 1b. TRUST BAR -->
    <?php include NESPORTS_PLUGIN_DIR . 'templates/sections/section-trustbar.php'; ?>

    <!-- 2. POPULAR CATEGORIES (4 Cards Matched to Reference) -->
    <?php include NESPORTS_PLUGIN_DIR . 'templates/sections/section-categories.php'; ?>

    <!-- 3. MID-PAGE PARALLAX BANNER -->
    <?php include NESPORTS_PLUGIN_DIR . 'templates/sections/section-banner.php'; ?>

    <!-- 4. POWER PACKS & BUNDLES -->
    <?php include NESPORTS_PLUGIN_DIR . 'templates/sections/section-bundles.php'; ?>
<?php endif; ?>
</main>

<?php include NESPORTS_PLUGIN_DIR . 'templates/footer-nesports.php'; ?>
