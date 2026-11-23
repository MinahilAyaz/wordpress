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
$page_id = get_queried_object_id();
if (!$page_id) {
    $page_id = (int) get_option('page_on_front');
}
if (!$page_id) {
    $page_id = 1038;
}

$is_elementor = false;
if (class_exists('\Elementor\Plugin')) {
    if (\Elementor\Plugin::$instance->preview->is_preview_mode() 
        || \Elementor\Plugin::$instance->editor->is_edit_mode() 
        || isset($_GET['elementor-preview']) 
        || isset($_GET['preview'])) {
        $is_elementor = true;
    } elseif (\Elementor\Plugin::$instance->db->is_built_with_elementor($page_id)) {
        $is_elementor = true;
    }
}

if ($is_elementor) :
    if (have_posts()) {
        while (have_posts()) {
            the_post();
            the_content();
        }
    } else {
        $post_obj = get_post($page_id);
        if ($post_obj) {
            setup_postdata($post_obj);
            the_content();
            wp_reset_postdata();
        } else {
            the_content();
        }
    }
else :
?>
    <!-- 1. HERO CAROUSEL -->
    <?php if (nesports_section_enabled('show_hero', true)) : ?>
        <?php include NESPORTS_PLUGIN_DIR . 'templates/sections/section-hero.php'; ?>
    <?php endif; ?>

    <!-- 1b. TRUST BAR -->
    <?php if (nesports_section_enabled('show_trustbar', true)) : ?>
        <?php include NESPORTS_PLUGIN_DIR . 'templates/sections/section-trustbar.php'; ?>
    <?php endif; ?>

    <!-- 2. POPULAR CATEGORIES (4 Cards Matched to Reference) -->
    <?php if (nesports_section_enabled('show_categories', true)) : ?>
        <?php include NESPORTS_PLUGIN_DIR . 'templates/sections/section-categories.php'; ?>
    <?php endif; ?>

    <!-- 3. MID-PAGE PARALLAX BANNER -->
    <?php if (nesports_section_enabled('show_banner', true)) : ?>
        <?php include NESPORTS_PLUGIN_DIR . 'templates/sections/section-banner.php'; ?>
    <?php endif; ?>

    <!-- 3b. COLLECTIONS CAROUSEL (Matched to Hardbody Store Reference) -->
    <?php if (nesports_section_enabled('show_collections', true)) : ?>
        <?php include NESPORTS_PLUGIN_DIR . 'templates/sections/section-collections-carousel.php'; ?>
    <?php endif; ?>

    <!-- 4. BUNDLES -->
    <?php if (nesports_section_enabled('show_bundles', true)) : ?>
        <?php include NESPORTS_PLUGIN_DIR . 'templates/sections/section-bundles.php'; ?>
    <?php endif; ?>

    <!-- 5. CLOTHING CAROUSEL -->
    <?php if (nesports_section_enabled('show_clothing', true)) : ?>
        <?php include NESPORTS_PLUGIN_DIR . 'templates/sections/section-clothing.php'; ?>
    <?php endif; ?>

    <!-- 6. SHOP BY COLOUR -->
    <?php if (nesports_section_enabled('show_color', true)) : ?>
        <?php include NESPORTS_PLUGIN_DIR . 'templates/sections/section-color.php'; ?>
    <?php endif; ?>
<?php endif; ?>
</main>

<?php include NESPORTS_PLUGIN_DIR . 'templates/footer-nesports.php'; ?>
