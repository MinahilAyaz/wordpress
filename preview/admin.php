<?php
/**
 * Local preview shim for WordPress Admin Dashboard
 */
define('ABSPATH', __DIR__);
define('NESPORTS_VERSION', 'dev');
define('NESPORTS_PLUGIN_DIR', dirname(__DIR__) . '/nesports-pro-store/');
define('NESPORTS_PLUGIN_URL', '/nesports-pro-store/');

$settings_file = __DIR__ . '/settings.json';
$catalog_file = __DIR__ . '/catalog.json';

$GLOBALS['nes_settings'] = file_exists($settings_file) ? (json_decode(file_get_contents($settings_file), true) ?: array()) : array();
$GLOBALS['nes_catalog'] = file_exists($catalog_file) ? (json_decode(file_get_contents($catalog_file), true) ?: array()) : array();

function get_option($k, $d = false) {
    if ($k === 'nesports_store_settings') {
        return !empty($GLOBALS['nes_settings']) ? $GLOBALS['nes_settings'] : $d;
    }
    if ($k === 'nesports_managed_catalog') {
        return !empty($GLOBALS['nes_catalog']) ? $GLOBALS['nes_catalog'] : $d;
    }
    return $d;
}

function update_option($k, $v) {
    if ($k === 'nesports_store_settings') {
        $GLOBALS['nes_settings'] = $v;
        file_put_contents(__DIR__ . '/settings.json', json_encode($v, JSON_PRETTY_PRINT));
    }
    if ($k === 'nesports_managed_catalog') {
        $GLOBALS['nes_catalog'] = $v;
        file_put_contents(__DIR__ . '/catalog.json', json_encode($v, JSON_PRETTY_PRINT));
    }
    return true;
}

function esc_html($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); }
function esc_attr($s) { return esc_html($s); }
function esc_url($s) { return esc_html($s); }
function esc_url_raw($s) { return (string) $s; }
function esc_textarea($s) { return esc_html($s); }
function wp_kses_post($s) { return (string) $s; }
function sanitize_key($k) { return preg_replace('/[^a-z0-9_-]/i', '', strtolower((string) $k)); }
function sanitize_text_field($s) { return trim(strip_tags((string) $s)); }
function sanitize_title($s) { return strtolower(preg_replace('/[^a-zA-Z0-9_-]+/', '-', (string) $s)); }
function home_url($p = '') { return $p === '' ? '/' : $p; }
function admin_url($p = '') { return '/' . ltrim($p, '/'); }
function checked($checked, $current = true, $echo = true) {
    $res = ((string) $checked === (string) $current) ? " checked='checked'" : "";
    if ($echo) echo $res;
    return $res;
}
function current_user_can($cap) { return true; }
function check_admin_referer($a = -1, $b = '_wpnonce') { return true; }
function wp_create_nonce($a = -1) { return 'preview_nonce'; }
function wp_nonce_field($a = -1, $b = '_wpnonce', $c = true, $d = true) {
    echo '<input type="hidden" name="' . esc_attr($b) . '" value="preview_nonce" />';
}
function settings_fields($group) {
    echo '<input type="hidden" name="option_page" value="' . esc_attr($group) . '" />';
    echo '<input type="hidden" name="action" value="update" />';
    echo '<input type="hidden" name="_wpnonce" value="preview_nonce" />';
}


function wp_count_posts($type = 'page') {
    return (object) array('publish' => 12, 'draft' => 3);
}

function get_the_modified_date($format = 'M j, Y', $id = 0) {
    return date($format);
}

function get_permalink($id = 0) {
    return '/?page_id=' . $id;
}

function get_post($id = 0) {
    return (object) array('ID' => $id, 'post_title' => 'Page ' . $id);
}

function get_post_status($id = 0) {
    return 'publish';
}

function get_pages($args = array()) {
    $pages_data = array(
        (object) array('ID' => 1038, 'post_title' => 'Flagship Home Page', 'post_name' => 'home', 'post_status' => 'publish'),
        (object) array('ID' => 30090, 'post_title' => 'The NE Sports Story & Mission', 'post_name' => 'our-story', 'post_status' => 'publish'),
        (object) array('ID' => 4439, 'post_title' => 'Contact Us', 'post_name' => 'contact-us', 'post_status' => 'publish'),
        (object) array('ID' => 47, 'post_title' => 'Shop & Catalog', 'post_name' => 'shop', 'post_status' => 'publish'),
        (object) array('ID' => 9, 'post_title' => 'Cart', 'post_name' => 'cart', 'post_status' => 'publish'),
        (object) array('ID' => 10, 'post_title' => 'Checkout', 'post_name' => 'checkout', 'post_status' => 'publish'),
        (object) array('ID' => 11, 'post_title' => 'My account', 'post_name' => 'my-account', 'post_status' => 'publish'),
        (object) array('ID' => 3, 'post_title' => 'Privacy Policy', 'post_name' => 'privacy-policy', 'post_status' => 'draft'),
        (object) array('ID' => 5, 'post_title' => 'Refund and returns policy', 'post_name' => 'refund_returns', 'post_status' => 'draft'),
        (object) array('ID' => 12, 'post_title' => 'Wishlist', 'post_name' => 'wishlist', 'post_status' => 'publish'),
        (object) array('ID' => 13, 'post_title' => 'Portfolio', 'post_name' => 'portfolio', 'post_status' => 'publish'),
        (object) array('ID' => 14, 'post_title' => 'Compare', 'post_name' => 'compare', 'post_status' => 'publish'),
        (object) array('ID' => 15, 'post_title' => 'Blog', 'post_name' => 'blog', 'post_status' => 'publish'),
        (object) array('ID' => 29888, 'post_title' => 'Elementor #29888', 'post_name' => 'elementor-29888', 'post_status' => 'draft'),
        (object) array('ID' => 30091, 'post_title' => 'About us', 'post_name' => 'about-us-3', 'post_status' => 'publish'),
    );
    return $pages_data;
}

function wp_redirect($loc) {
    header('Location: ' . $loc);
    echo "Location: " . $loc . "\n\n";
    echo '<script>window.location.href=' . json_encode($loc) . ';</script>';
    exit;
}
function wp_die($msg = '') { die($msg); }
function submit_button($text = 'Save Changes', $type = 'primary', $name = 'submit', $wrap = true, $other_attributes = null) {
    echo '<p class="submit"><input type="submit" name="' . htmlspecialchars($name) . '" id="' . htmlspecialchars($name) . '" class="button button-' . htmlspecialchars($type) . '" value="' . htmlspecialchars($text) . '" /></p>';
}

if (!empty($_SERVER['QUERY_STRING'])) {
    parse_str($_SERVER['QUERY_STRING'], $_GET);
}
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw_input = file_get_contents('php://stdin');
    if (!empty($raw_input)) {
        parse_str($raw_input, $_POST);
    }
}

require NESPORTS_PLUGIN_DIR . 'includes/helpers.php';
require NESPORTS_PLUGIN_DIR . 'includes/class-nesports-admin.php';

$admin = new NESports_Admin();

// Handle POST actions if any
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['nesports_store_settings'])) {
        $saved = get_option('nesports_store_settings', array());
        $merged = array_merge($saved, $_POST['nesports_store_settings']);
        update_option('nesports_store_settings', $merged);
        $tab_dest = isset($_POST['tab']) ? $_POST['tab'] : (isset($_GET['tab']) ? $_GET['tab'] : 'pages');
        $redirect_to = '/admin?settings-updated=true&tab=' . urlencode($tab_dest);
        header('Location: ' . $redirect_to);
        echo "Location: " . $redirect_to . "\n\n";
        echo '<script>window.location.href=' . json_encode($redirect_to) . ';</script>';
        exit;
    }
    $admin->handle_product_actions();
}

$tab = isset($_GET['tab']) ? sanitize_key($_GET['tab']) : 'pages';
$_GET['tab'] = $tab;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NESPORTS3 - Master Client Control Hub</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/dashicons@0.9.0/css/dashicons.min.css">
    <link rel="stylesheet" href="/nesports-pro-store/assets/css/nesports-admin.css">
    <style>
        body { background: #f0f2f5; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .wp-topbar-shim { background: #1d2327; color: #c3c4c7; height: 36px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; font-size: 13px; font-weight: 500; }
        .wp-topbar-shim a { color: #c3c4c7; text-decoration: none; }
        .wp-topbar-shim a:hover { color: #e11d48; }
        .wp-layout-shim { display: flex; min-height: calc(100vh - 36px); }
        .wp-sidebar-shim { width: 220px; background: #1d2327; padding-top: 14px; flex-shrink: 0; }
        .wp-sidebar-shim a { display: flex; align-items: center; gap: 10px; padding: 12px 18px; font-size: 13.5px; color: #c3c4c7; text-decoration: none; font-weight: 500; }
        .wp-sidebar-shim a:hover { background: #14171a; color: #ffffff; }
        .wp-sidebar-shim a.on { background: #e11d48; color: #ffffff; font-weight: 700; }
        .wp-main-shim { flex: 1; padding: 24px 32px; overflow-y: auto; }
        .button { display: inline-block; font-size: 13px; min-height: 32px; line-height: 30px; padding: 0 14px; border-radius: 4px; cursor: pointer; border: 1px solid #cbd5e1; background: #ffffff; color: #334155; text-decoration: none; font-weight: 600; }
        .button-primary { background: #e11d48 !important; border-color: #be123c !important; color: #ffffff !important; }
        .button-secondary { background: #f8fafc; border-color: #cbd5e1; color: #334155; }
        .widefat { width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; box-sizing: border-box; }
        .description { font-size: 12.5px; color: #64748b; margin: 4px 0 0; }
    </style>
</head>
<body>
    <div class="wp-topbar-shim">
        <div><strong>NESPORTS3</strong> &bull; <a href="/" target="_blank">Visit Storefront &rarr;</a> &bull; <a href="/our-story" target="_blank">Visit Story Page &rarr;</a></div>
        <div>Howdy, Admin (Client Master Hub)</div>
    </div>
    <div class="wp-layout-shim">
        <aside class="wp-sidebar-shim">
            <a href="/admin?tab=pages" class="<?php echo $tab === 'pages' ? 'on' : ''; ?>"><span class="dashicons dashicons-admin-page"></span> All Pages & Story</a>
            <a href="/admin?tab=hero" class="<?php echo $tab === 'hero' ? 'on' : ''; ?>"><span class="dashicons dashicons-format-image"></span> Hero & Banners</a>
            <a href="/admin?tab=products" class="<?php echo $tab === 'products' ? 'on' : ''; ?>"><span class="dashicons dashicons-cart"></span> Store Products</a>
            <a href="/admin?tab=styling" class="<?php echo $tab === 'styling' ? 'on' : ''; ?>"><span class="dashicons dashicons-art"></span> Colors & Controls</a>
            <div style="margin: 20px 14px 10px; border-top: 1px solid #334155; padding-top: 14px; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.05em;">Live Previews</div>
            <a href="/" target="_blank"><span class="dashicons dashicons-external"></span> Storefront Preview &rarr;</a>
            <a href="/our-story" target="_blank"><span class="dashicons dashicons-external"></span> Story Page Preview &rarr;</a>
            <a href="/contact-us" target="_blank"><span class="dashicons dashicons-external"></span> Contact Page Preview &rarr;</a>
        </aside>
        <main class="wp-main-shim">
            <?php $admin->render_master_dashboard(); ?>
        </main>
    </div>
</body>
</html>
