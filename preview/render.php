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

$GLOBALS['nes_settings'] = json_decode(getenv('NES_SETTINGS') ?: '{}', true) ?: array();

function get_option($k, $d = false) { return $k === 'nesports_store_settings' ? $GLOBALS['nes_settings'] : $d; }
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
    echo '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap">';
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
} elseif ($page === 'sizing') {
    if (file_exists(NESPORTS_PLUGIN_DIR . 'templates/page-sizing.php')) {
        require NESPORTS_PLUGIN_DIR . 'templates/page-sizing.php';
    } else {
        require NESPORTS_PLUGIN_DIR . 'templates/page-home.php';
    }
} else {
    require NESPORTS_PLUGIN_DIR . 'templates/page-home.php';
}

