<?php
/**
 * Plugin Name: NE Sports Pro Store - Auto Page Generator
 * Plugin URI: https://www.nesports3.com/
 * Description: Transforms your store with high-impact, dark athletic brand pages inspired by premium fitness brands like Hardbody. Automatically generates and manages the Home page, Brand Story, and Contact pages with complete frontend and backend controls.
 * Version: 1.0.21
 * Author: NE Sports Development Team
 * Author URI: https://www.nesports3.com/
 * Text Domain: nesports-pro-store
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

define('NESPORTS_VERSION', '1.0.21');
define('NESPORTS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('NESPORTS_PLUGIN_URL', plugin_dir_url(__FILE__));

// Require Core Classes
require_once NESPORTS_PLUGIN_DIR . 'includes/helpers.php';
require_once NESPORTS_PLUGIN_DIR . 'includes/class-nesports-activator.php';
require_once NESPORTS_PLUGIN_DIR . 'includes/class-nesports-admin.php';
require_once NESPORTS_PLUGIN_DIR . 'includes/class-nesports-frontend.php';
require_once NESPORTS_PLUGIN_DIR . 'includes/class-nesports-elementor.php';

function nesports_rrmdir_legacy($dir) {
    if (!is_dir($dir)) {
        return;
    }
    $items = @scandir($dir);
    if (is_array($items)) {
        foreach ($items as $item) {
            if ($item === '.' || $item === '..') {
                continue;
            }
            $p = $dir . '/' . $item;
            if (is_dir($p)) {
                nesports_rrmdir_legacy($p);
            } else {
                @unlink($p);
            }
        }
    }
    @rmdir($dir);
}

/**
 * Self-heal any legacy backslash-extracted files from WP_PLUGIN_DIR/nesports-pro-store
 */
function nesports_migrate_legacy_backslash_files() {
    if (get_option('nesports_legacy_migrated_v2') === 'yes') {
        return;
    }
    $legacy_dir = WP_PLUGIN_DIR . '/nesports-pro-store';
    if (is_dir($legacy_dir) && realpath($legacy_dir) !== realpath(rtrim(NESPORTS_PLUGIN_DIR, '/\\'))) {
        // Deactivate legacy slug if present in active_plugins
        $active = get_option('active_plugins', array());
        if (is_array($active)) {
            $filtered = array_values(array_filter($active, function($p) {
                return strpos($p, 'nesports-pro-store/') !== 0;
            }));
            if (count($filtered) !== count($active)) {
                update_option('active_plugins', $filtered);
            }
        }
        nesports_rrmdir_legacy($legacy_dir);
    }
    update_option('nesports_legacy_migrated_v2', 'yes');
}

/**
 * Plugin Activation Hook
 */
function nesports_pro_store_activate() {
    nesports_migrate_legacy_backslash_files();
    NESports_Activator::activate();
}
register_activation_hook(__FILE__, 'nesports_pro_store_activate');

/**
 * Plugin Deactivation Hook
 */
function nesports_pro_store_deactivate() {
    NESports_Activator::deactivate();
}
register_deactivation_hook(__FILE__, 'nesports_pro_store_deactivate');

/**
 * Initialize Plugin Core
 */
function nesports_pro_store_init() {
    nesports_migrate_legacy_backslash_files();
    // Initialize Admin
    if (is_admin()) {
        $admin = new NESports_Admin();
        $admin->init();
    }
    
    // Initialize Frontend
    $frontend = new NESports_Frontend();
    $frontend->init();

    // Initialize Elementor Widgets
    $elementor = new NESports_Elementor();
    $elementor->init();

    add_action('init', 'nesports_handle_server_cache_purge');
}
add_action('plugins_loaded', 'nesports_pro_store_init');

function nesports_handle_server_cache_purge() {
    if (!isset($_GET['nes_purge'])) {
        return;
    }
    $results = array();
    $urls = array(
        home_url('/'),
        home_url('/.*'),
        home_url('/shop/'),
        home_url('/our-story/'),
        home_url('/about-us-3/'),
        home_url('/contact-us/'),
    );
    foreach ($urls as $u) {
        $r1 = wp_remote_request($u, array(
            'method'  => 'PURGE',
            'timeout' => 5,
            'headers' => array(
                'X-Purge-Method' => (strpos($u, '.*') !== false) ? 'regex' : 'default',
            ),
        ));
        $results[$u] = is_wp_error($r1) ? $r1->get_error_message() : wp_remote_retrieve_response_code($r1);
    }
    if (function_exists('wp_cache_flush')) {
        wp_cache_flush();
    }
    header('Content-Type: application/json');
    echo wp_json_encode(array(
        'purge_results' => $results,
        'server_addr'   => isset($_SERVER['SERVER_ADDR']) ? $_SERVER['SERVER_ADDR'] : '',
        'remote_addr'   => isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '',
    ));
    exit;
}

