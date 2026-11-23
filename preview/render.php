<?php
/**
 * Local preview shim: defines the few WordPress functions the plugin templates
 * use, so the REAL templates can be rendered without a WordPress install.
 * Used only by server.js for development. Not part of the shipped plugin.
 */
define('ABSPATH', __DIR__);
define('NESPORTS_VERSION', 'dev');
define('NESPORTS_PLUGIN_DIR', dirname(__DIR__) . '/nesports-pro-store/');
define('NESPORTS_PLUGIN_URL', '/nesports-pro-store/');

$settings_file = __DIR__ . '/settings.json';
$local_file_settings = file_exists($settings_file) ? (json_decode(file_get_contents($settings_file), true) ?: array()) : array();
$GLOBALS['nes_settings'] = array_merge($local_file_settings, json_decode(getenv('NES_SETTINGS') ?: '{}', true) ?: array());

$catalog_file = __DIR__ . '/catalog.json';
$GLOBALS['nes_catalog'] = file_exists($catalog_file) ? (json_decode(file_get_contents($catalog_file), true) ?: array()) : array();

function get_option($k, $d = false) {
    if ($k === 'nesports_store_settings') return $GLOBALS['nes_settings'];
    if ($k === 'nesports_managed_catalog') return !empty($GLOBALS['nes_catalog']) ? $GLOBALS['nes_catalog'] : $d;
    return $d;
}
function esc_html($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); }
function esc_attr($s) { return esc_html($s); }
function esc_url($s) { return esc_html($s); }
function home_url($p = '') { return $p === '' ? '/' : $p; }
function language_attributes() { echo 'lang="en"'; }
function bloginfo($s) { echo 'UTF-8'; }
function wp_title() { echo 'NESPORTS3 | Lifting Gear'; }
function body_class($c = '') { echo 'class="' . esc_attr($c) . '"'; }
function wp_head() {
    $accent = $GLOBALS['nes_settings']['accent_color'] ?? '#e11d48';
    echo '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap">';
    echo '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">';
    echo '<link rel="stylesheet" href="' . NESPORTS_PLUGIN_URL . 'assets/css/nesports-frontend.css?v=' . time() . '">';
    echo '<style>:root{--hb-accent:' . esc_attr($accent) . ';}</style>';
}
function wp_footer() {
    echo '<script src="' . NESPORTS_PLUGIN_URL . 'assets/js/nesports-frontend.js?v=' . time() . '"></script>';
}

require NESPORTS_PLUGIN_DIR . 'includes/helpers.php';

$page = getenv('NES_PAGE') ?: 'home';
if ($page === 'contact') {
    require NESPORTS_PLUGIN_DIR . 'templates/page-contact.php';
} elseif ($page === 'about' || $page === 'story') {
    require NESPORTS_PLUGIN_DIR . 'templates/page-story.php';
} elseif ($page === 'category' || $page === 'shop') {
    require NESPORTS_PLUGIN_DIR . 'templates/page-category.php';
} elseif ($page === 'product') {
    require NESPORTS_PLUGIN_DIR . 'templates/page-product.php';
} else {
    require NESPORTS_PLUGIN_DIR . 'templates/page-home.php';
}

