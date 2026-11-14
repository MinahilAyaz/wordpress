<?php
if (!defined('ABSPATH')) {
    exit;
}

class NESports_Frontend {

    public function init() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_filter('template_include', array($this, 'route_custom_templates'), 999999);

        // Elementor & WordPress Section Shortcodes
        add_shortcode('nesports_hero', array($this, 'render_hero_shortcode'));
        add_shortcode('nesports_trustbar', array($this, 'render_trustbar_shortcode'));
        add_shortcode('nesports_products', array($this, 'render_products_shortcode'));
        add_shortcode('nesports_banner', array($this, 'render_banner_shortcode'));
        add_shortcode('nesports_categories', array($this, 'render_categories_shortcode'));
        add_shortcode('nesports_bundles', array($this, 'render_bundles_shortcode'));
        add_shortcode('nesports_clothing', array($this, 'render_clothing_shortcode'));
        add_shortcode('nesports_pro_home', array($this, 'render_home_shortcode'));
    }

    /**
     * Enqueue Google Fonts and Custom Dark Athletic Styles
     */
    public function enqueue_assets() {
        // Enqueue Google Fonts (Poppins)
        wp_enqueue_style(
            'nesports-google-fonts',
            'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap',
            array(),
            null
        );

        // Enqueue FontAwesome for icons
        wp_enqueue_style(
            'nesports-font-awesome',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
            array(),
            '6.5.1'
        );

        // Enqueue Plugin Frontend CSS (auto-cache-busting via filemtime)
        $css_ver = NESPORTS_VERSION . '.' . (file_exists(NESPORTS_PLUGIN_DIR . 'assets/css/nesports-frontend.css') ? filemtime(NESPORTS_PLUGIN_DIR . 'assets/css/nesports-frontend.css') : time());
        wp_enqueue_style(
            'nesports-frontend-css',
            NESPORTS_PLUGIN_URL . 'assets/css/nesports-frontend.css',
            array(),
            $css_ver
        );

        // Inject Dynamic Custom Colors from settings
        $settings = get_option('nesports_store_settings', array());
        $accent_color = !empty($settings['accent_color']) ? sanitize_hex_color($settings['accent_color']) : '#e11d48';
        if (!$accent_color) {
            $accent_color = '#e11d48';
        }
        $custom_css = ":root { --hb-accent: {$accent_color}; }";
        wp_add_inline_style('nesports-frontend-css', $custom_css);

        // Enqueue Plugin Frontend JS (auto-cache-busting via filemtime)
        $js_ver = NESPORTS_VERSION . '.' . (file_exists(NESPORTS_PLUGIN_DIR . 'assets/js/nesports-frontend.js') ? filemtime(NESPORTS_PLUGIN_DIR . 'assets/js/nesports-frontend.js') : time());
        wp_enqueue_script(
            'nesports-frontend-js',
            NESPORTS_PLUGIN_URL . 'assets/js/nesports-frontend.js',
            array('jquery'),
            $js_ver,
            true
        );

        wp_localize_script('nesports-frontend-js', 'nesports_vars', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'cart_url' => function_exists('wc_get_cart_url') ? wc_get_cart_url() : home_url('/cart/'),
        ));
    }

    /**
     * Route template when viewing generated pages
     */
    public function route_custom_templates($template) {
        $req_uri  = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
        $req_path = parse_url($req_uri, PHP_URL_PATH);
        $req_path = $req_path ? rtrim($req_path, '/') : '';

        // Virtual Single Product Route (/product/<slug>/)
        if (preg_match('#/product/([^/]+)$#i', $req_path, $m)) {
            $_GET['slug'] = sanitize_title($m[1]);
            global $wp_query;
            if ($wp_query) {
                $wp_query->is_404 = false;
            }
            status_header(200);
            if (file_exists(NESPORTS_PLUGIN_DIR . 'templates/page-product.php')) {
                return NESPORTS_PLUGIN_DIR . 'templates/page-product.php';
            }
        }

        // Virtual Product Category Route (/product-category/<slug>/ or /category/<slug>/)
        if (preg_match('#/(?:product-category|category)/([^/]+)$#i', $req_path, $m)) {
            $_GET['cat'] = sanitize_title($m[1]);
            global $wp_query;
            if ($wp_query) {
                $wp_query->is_404 = false;
            }
            status_header(200);
            if (file_exists(NESPORTS_PLUGIN_DIR . 'templates/page-category.php')) {
                return NESPORTS_PLUGIN_DIR . 'templates/page-category.php';
            }
        }

        if (is_front_page() || is_home()) {
            $front_id = (int) get_option('page_on_front');
            if ($front_id) {
                $page_type = get_post_meta($front_id, '_nesports_page_type', true);
                if ($page_type === 'home' || file_exists(NESPORTS_PLUGIN_DIR . 'templates/page-home.php')) {
                    $home_template = NESPORTS_PLUGIN_DIR . 'templates/page-home.php';
                    if (file_exists($home_template)) {
                        return $home_template;
                    }
                }
            }
        }

        if (is_page()) {
            $post_id = get_the_ID();
            $page_type = get_post_meta($post_id, '_nesports_page_type', true);
            
            if ($page_type === 'home' && file_exists(NESPORTS_PLUGIN_DIR . 'templates/page-home.php')) {
                return NESPORTS_PLUGIN_DIR . 'templates/page-home.php';
            }
            if (($page_type === 'our-story' || is_page(array('our-story', 'about-us', 'about-us-3'))) && file_exists(NESPORTS_PLUGIN_DIR . 'templates/page-story.php')) {
                return NESPORTS_PLUGIN_DIR . 'templates/page-story.php';
            }
            if (($page_type === 'contact' || is_page(array('contact-us', 'contact'))) && file_exists(NESPORTS_PLUGIN_DIR . 'templates/page-contact.php')) {
                return NESPORTS_PLUGIN_DIR . 'templates/page-contact.php';
            }
            if (($page_type === 'shop' || is_page(array('shop', 'all-products', 'catalog'))) && file_exists(NESPORTS_PLUGIN_DIR . 'templates/page-category.php')) {
                return NESPORTS_PLUGIN_DIR . 'templates/page-category.php';
            }
        }

        // Single product route
        if ((function_exists('is_product') && is_product()) || is_singular('product')) {
            if (file_exists(NESPORTS_PLUGIN_DIR . 'templates/page-product.php')) {
                return NESPORTS_PLUGIN_DIR . 'templates/page-product.php';
            }
        }

        // Shop or product category archive route
        if ((function_exists('is_shop') && is_shop()) || (function_exists('is_product_category') && is_product_category())) {
            if (file_exists(NESPORTS_PLUGIN_DIR . 'templates/page-category.php')) {
                return NESPORTS_PLUGIN_DIR . 'templates/page-category.php';
            }
        }

        return $template;
    }

    public function render_hero_shortcode() {
        ob_start();
        include NESPORTS_PLUGIN_DIR . 'templates/sections/section-hero.php';
        return ob_get_clean();
    }

    public function render_trustbar_shortcode() {
        ob_start();
        include NESPORTS_PLUGIN_DIR . 'templates/sections/section-trustbar.php';
        return ob_get_clean();
    }

    public function render_products_shortcode() {
        ob_start();
        include NESPORTS_PLUGIN_DIR . 'templates/sections/section-products.php';
        return ob_get_clean();
    }

    public function render_banner_shortcode() {
        ob_start();
        include NESPORTS_PLUGIN_DIR . 'templates/sections/section-banner.php';
        return ob_get_clean();
    }

    public function render_categories_shortcode() {
        ob_start();
        include NESPORTS_PLUGIN_DIR . 'templates/sections/section-categories.php';
        return ob_get_clean();
    }

    public function render_bundles_shortcode() {
        ob_start();
        include NESPORTS_PLUGIN_DIR . 'templates/sections/section-bundles.php';
        return ob_get_clean();
    }

    public function render_clothing_shortcode() {
        ob_start();
        include NESPORTS_PLUGIN_DIR . 'templates/sections/section-clothing.php';
        return ob_get_clean();
    }

    public function render_home_shortcode() {
        ob_start();
        include NESPORTS_PLUGIN_DIR . 'templates/page-home.php';
        return ob_get_clean();
    }

    private function adjust_brightness($hex, $steps) {
        $steps = max(-255, min(255, $steps));
        $hex = str_replace('#', '', $hex);
        if (strlen($hex) == 3) {
            $hex = str_repeat(substr($hex, 0, 1), 2) . str_repeat(substr($hex, 1, 1), 2) . str_repeat(substr($hex, 2, 1), 2);
        }
        $color_parts = str_split($hex, 2);
        $return = '#';
        foreach ($color_parts as $color) {
            $color = hexdec($color);
            $color = max(0, min(255, $color + $steps));
            $return .= str_pad(dechex($color), 2, '0', STR_PAD_LEFT);
        }
        return $return;
    }
}

