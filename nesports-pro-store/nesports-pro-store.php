<?php
/**
 * Plugin Name: NE Sports Pro Store - Auto Page Generator
 * Plugin URI: https://www.nesports3.com/
 * Description: Transforms your store with high-impact, dark athletic brand pages inspired by premium fitness brands like Hardbody. Automatically generates and manages the Home page, Brand Story, and Contact pages with complete frontend and backend controls.
 * Version: 1.0.0
 * Author: NE Sports Development Team
 * Author URI: https://www.nesports3.com/
 * Text Domain: nesports-pro-store
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

define('NESPORTS_VERSION', '1.0.0');
define('NESPORTS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('NESPORTS_PLUGIN_URL', plugin_dir_url(__FILE__));

// Require Core Classes
require_once NESPORTS_PLUGIN_DIR . 'includes/helpers.php';
require_once NESPORTS_PLUGIN_DIR . 'includes/class-nesports-activator.php';
require_once NESPORTS_PLUGIN_DIR . 'includes/class-nesports-admin.php';
require_once NESPORTS_PLUGIN_DIR . 'includes/class-nesports-frontend.php';

/**
 * Plugin Activation Hook
 */
function nesports_pro_store_activate() {
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
    // Initialize Admin
    if (is_admin()) {
        $admin = new NESports_Admin();
        $admin->init();
    }
    
    // Initialize Frontend
    $frontend = new NESports_Frontend();
    $frontend->init();
}
add_action('plugins_loaded', 'nesports_pro_store_init');

