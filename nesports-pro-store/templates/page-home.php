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

    <!-- 1. HERO CAROUSEL -->
    <?php include NESPORTS_PLUGIN_DIR . 'templates/sections/section-hero.php'; ?>

    <!-- 2. POPULAR CATEGORIES (4 Cards Matched to Reference) -->
    <?php include NESPORTS_PLUGIN_DIR . 'templates/sections/section-categories.php'; ?>

    <!-- 3. MID-PAGE PARALLAX BANNER -->
    <?php include NESPORTS_PLUGIN_DIR . 'templates/sections/section-banner.php'; ?>

    <!-- 4. POWER PACKS & BUNDLES -->
    <?php include NESPORTS_PLUGIN_DIR . 'templates/sections/section-bundles.php'; ?>

</main>

<?php include NESPORTS_PLUGIN_DIR . 'templates/footer-nesports.php'; ?>
