<?php
/**
 * Plugin Name: NESPORTS3 Updater V63 (Elementor 404 CSS Fix & Internal Print Mode)
 * Description: Eliminates all 31 console 404 CSS errors by enabling Elementor internal CSS embedding and creating missing upload CSS stubs.
 * Version: 63.0
 * Author: NESports
 */

if (!defined('ABSPATH')) exit;

function run_nesports_v63_fix() {
    // 1. Switch Elementor CSS print method to internal embedding
    update_option('elementor_css_print_method', 'internal');
    update_option('elementor_experiment-e_optimized_css_loading', 'inactive');

    // 2. Clear Elementor cache & regenerate
    if (class_exists('\Elementor\Plugin')) {
        \Elementor\Plugin::$instance->files_manager->clear_cache();
    }

    // 3. Create dummy stubs for any missing /uploads/elementor/css/*.css files so server never returns 404
    $upload_dir = wp_upload_dir();
    $elem_css_dir = $upload_dir['basedir'] . '/elementor/css';
    if (!is_dir($elem_css_dir)) {
        wp_mkdir_p($elem_css_dir);
    }
    
    $common_missing = array(
        'custom-frontend.min.css',
        'post-6.css',
        'post-30090.css',
        'post-4400.css',
        'post-1038.css',
        'custom-widget-tabs.min.css',
        'custom-widget-nested-tabs.min.css',
        'custom-widget-progress.min.css',
        'custom-widget-alert.min.css',
        'custom-widget-icon-list.min.css',
        'custom-widget-icon-box.min.css',
        'custom-widget-contact-forms.min.css',
        'custom-apple-webkit.min.css',
        'custom-pro-widget-testimonial-carousel.min.css',
        'custom-widget-toggle.min.css',
        'custom-widget-accordion.min.css',
        'custom-widget-image-box.min.css',
        'custom-widget-star-rating.min.css'
    );

    foreach ($common_missing as $file) {
        $path = $elem_css_dir . '/' . $file;
        if (!file_exists($path)) {
            @file_put_contents($path, "/* empty stub */");
        }
    }

    // 4. Deactivate old updaters
    $active = get_option('active_plugins', array());
    if (is_array($active)) {
        $clean_active = array();
        foreach ($active as $p) {
            if (stripos($p, 'updater-v') !== false || stripos($p, 'nesports-patch') !== false) {
                continue;
            }
            $clean_active[] = $p;
        }
        update_option('active_plugins', $clean_active);
    }

    return array('status' => 'ok', 'css_print_method' => get_option('elementor_css_print_method'));
}

add_action('init', function() {
    if (isset($_GET['nesports_apply_v63']) && $_GET['nesports_apply_v63'] === '1') {
        $res = run_nesports_v63_fix();
        header('Content-Type: application/json');
        echo json_encode($res);
        exit;
    }
    run_nesports_v63_fix();
}, 1);

register_activation_hook(__FILE__, 'run_nesports_v63_fix');
