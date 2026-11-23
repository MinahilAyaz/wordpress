<?php
if (!defined('ABSPATH')) {
    exit;
}

/**
 * NESports Elementor Integration Handler
 */
class NESports_Elementor {

    public function init() {
        // Register custom widget category
        add_action('elementor/elements/categories_registered', array($this, 'register_category'));

        // Register custom widgets (Elementor 3.5+)
        add_action('elementor/widgets/register', array($this, 'register_widgets'));
        // Legacy support (< Elementor 3.5)
        add_action('elementor/widgets/widgets_registered', array($this, 'register_widgets_legacy'));

        // Enqueue styles & scripts in Elementor Editor preview
        add_action('elementor/editor/after_enqueue_scripts', array($this, 'enqueue_elementor_assets'));
        add_action('elementor/frontend/after_enqueue_scripts', array($this, 'enqueue_elementor_assets'));

        // Auto-seed Elementor pages so Home, Story, and Contact open in Elementor with NESPORTS3 widgets ready to edit
        add_action('init', array($this, 'maybe_seed_elementor_pages'), 20);
    }

    /**
     * Add "NE Sports Pro Store" category in Elementor widgets panel
     */
    public function register_category($elements_manager) {
        $elements_manager->add_category(
            'nesports-pro',
            array(
                'title' => esc_html__('NE Sports Pro Store', 'nesports-pro-store'),
                'icon'  => 'fa fa-dumbbell',
            )
        );
    }

    /**
     * Register Widgets (Elementor 3.5+)
     */
    public function register_widgets($widgets_manager) {
        $this->load_widget_files();

        $widgets = array(
            'NESports_Elementor_Hero_Widget',
            'NESports_Elementor_TrustBar_Widget',
            'NESports_Elementor_Categories_Widget',
            'NESports_Elementor_Banner_Widget',
            'NESports_Elementor_Collections_Widget',
            'NESports_Elementor_Bundles_Widget',
            'NESports_Elementor_Clothing_Widget',
            'NESports_Elementor_Color_Widget',
            'NESports_Elementor_Products_Widget',
            'NESports_Elementor_Story_Widget',
            'NESports_Elementor_Contact_Widget',
        );

        foreach ($widgets as $w_class) {
            if (class_exists($w_class)) {
                $widgets_manager->register(new $w_class());
            }
        }
    }

    /**
     * Register Widgets Legacy (< Elementor 3.5)
     */
    public function register_widgets_legacy() {
        if (!class_exists('\Elementor\Plugin')) {
            return;
        }
        $this->load_widget_files();

        $manager = \Elementor\Plugin::instance()->widgets_manager;
        if (!method_exists($manager, 'register_widget_type')) {
            return;
        }

        $widgets = array(
            'NESports_Elementor_Hero_Widget',
            'NESports_Elementor_TrustBar_Widget',
            'NESports_Elementor_Categories_Widget',
            'NESports_Elementor_Banner_Widget',
            'NESports_Elementor_Collections_Widget',
            'NESports_Elementor_Bundles_Widget',
            'NESports_Elementor_Clothing_Widget',
            'NESports_Elementor_Color_Widget',
            'NESports_Elementor_Products_Widget',
            'NESports_Elementor_Story_Widget',
            'NESports_Elementor_Contact_Widget',
        );

        foreach ($widgets as $w_class) {
            if (class_exists($w_class)) {
                $manager->register_widget_type(new $w_class());
            }
        }
    }

    /**
     * Load Widget PHP Files
     */
    private function load_widget_files() {
        $dir = NESPORTS_PLUGIN_DIR . 'includes/elementor-widgets/';
        require_once $dir . 'widget-hero.php';
        require_once $dir . 'widget-trustbar.php';
        require_once $dir . 'widget-categories.php';
        require_once $dir . 'widget-banner.php';
        require_once $dir . 'widget-collections.php';
        require_once $dir . 'widget-bundles.php';
        require_once $dir . 'widget-clothing.php';
        require_once $dir . 'widget-color.php';
        require_once $dir . 'widget-products.php';
        require_once $dir . 'widget-story.php';
        require_once $dir . 'widget-contact.php';
    }

    /**
     * Automatically seed Home, Story, and Contact pages with NESPORTS3 Elementor widgets
     * so opening "Edit with Elementor" immediately displays the new NESPORTS3 sections.
     */
    public function maybe_seed_elementor_pages() {
        if (get_option('nesports_elementor_seeded_v11') === 'yes') {
            return;
        }

        // Ensure pages exist first
        if (class_exists('NESports_Activator')) {
            NESports_Activator::generate_all_pages();
        }

        $zero_pad = array(
            'unit'     => 'px',
            'top'      => '0',
            'right'    => '0',
            'bottom'   => '0',
            'left'     => '0',
            'isLinked' => true,
        );

        // 1. Seed Home Page
        $front_id = (int) get_option('page_on_front');
        if (!$front_id) {
            $home_page = get_page_by_path('home');
            if ($home_page) {
                $front_id = $home_page->ID;
            }
        }

        if ($front_id) {
            $home_data = array(
                array(
                    'id'       => 'neshero01',
                    'elType'   => 'container',
                    'settings' => array('content_width' => 'full', 'padding' => $zero_pad, 'margin' => $zero_pad),
                    'elements' => array(
                        array(
                            'id'         => 'nesherow1',
                            'elType'     => 'widget',
                            'widgetType' => 'nesports_hero_widget',
                            'settings'   => array(),
                            'elements'   => array(),
                        ),
                    ),
                    'isInner'  => false,
                ),
                array(
                    'id'       => 'nestrst01',
                    'elType'   => 'container',
                    'settings' => array('content_width' => 'full', 'padding' => $zero_pad, 'margin' => $zero_pad),
                    'elements' => array(
                        array(
                            'id'         => 'nestrstw1',
                            'elType'     => 'widget',
                            'widgetType' => 'nesports_trustbar_widget',
                            'settings'   => array(),
                            'elements'   => array(),
                        ),
                    ),
                    'isInner'  => false,
                ),
                array(
                    'id'       => 'nescats02',
                    'elType'   => 'container',
                    'settings' => array('content_width' => 'full', 'padding' => $zero_pad, 'margin' => $zero_pad),
                    'elements' => array(
                        array(
                            'id'         => 'nescatsw2',
                            'elType'     => 'widget',
                            'widgetType' => 'nesports_categories_widget',
                            'settings'   => array(),
                            'elements'   => array(),
                        ),
                    ),
                    'isInner'  => false,
                ),
                array(
                    'id'       => 'nesbanr03',
                    'elType'   => 'container',
                    'settings' => array('content_width' => 'full', 'padding' => $zero_pad, 'margin' => $zero_pad),
                    'elements' => array(
                        array(
                            'id'         => 'nesbanrw3',
                            'elType'     => 'widget',
                            'widgetType' => 'nesports_banner_widget',
                            'settings'   => array(),
                            'elements'   => array(),
                        ),
                    ),
                    'isInner'  => false,
                ),
                array(
                    'id'       => 'nescol03b',
                    'elType'   => 'container',
                    'settings' => array('content_width' => 'full', 'padding' => $zero_pad, 'margin' => $zero_pad),
                    'elements' => array(
                        array(
                            'id'         => 'nescolw3b',
                            'elType'     => 'widget',
                            'widgetType' => 'nesports_collections_widget',
                            'settings'   => array(),
                            'elements'   => array(),
                        ),
                    ),
                    'isInner'  => false,
                ),
                array(
                    'id'       => 'nesbund04',
                    'elType'   => 'container',
                    'settings' => array('content_width' => 'full', 'padding' => $zero_pad, 'margin' => $zero_pad),
                    'elements' => array(
                        array(
                            'id'         => 'nesbundw4',
                            'elType'     => 'widget',
                            'widgetType' => 'nesports_bundles_widget',
                            'settings'   => array(),
                            'elements'   => array(),
                        ),
                    ),
                    'isInner'  => false,
                ),
                array(
                    'id'       => 'nescloth05',
                    'elType'   => 'container',
                    'settings' => array('content_width' => 'full', 'padding' => $zero_pad, 'margin' => $zero_pad),
                    'elements' => array(
                        array(
                            'id'         => 'nesclothw5',
                            'elType'     => 'widget',
                            'widgetType' => 'nesports_clothing_widget',
                            'settings'   => array(),
                            'elements'   => array(),
                        ),
                    ),
                    'isInner'  => false,
                ),
                array(
                    'id'       => 'nescolor06',
                    'elType'   => 'container',
                    'settings' => array('content_width' => 'full', 'padding' => $zero_pad, 'margin' => $zero_pad),
                    'elements' => array(
                        array(
                            'id'         => 'nescolorw6',
                            'elType'     => 'widget',
                            'widgetType' => 'nesports_color_widget',
                            'settings'   => array(),
                            'elements'   => array(),
                        ),
                    ),
                    'isInner'  => false,
                ),
            );
            $this->apply_elementor_seed($front_id, $home_data, 'home');
        }

        // 2. Seed Story / About Us Pages
        $story_slugs = array('our-story', 'about-us', 'about-us-3');
        $story_data  = array(
            array(
                'id'       => 'nesstry01',
                'elType'   => 'container',
                'settings' => array('content_width' => 'full', 'padding' => $zero_pad, 'margin' => $zero_pad),
                'elements' => array(
                    array(
                        'id'         => 'nesstryw1',
                        'elType'     => 'widget',
                        'widgetType' => 'nesports_story_widget',
                        'settings'   => array(),
                        'elements'   => array(),
                    ),
                ),
                'isInner'  => false,
            ),
        );
        foreach ($story_slugs as $slug) {
            $p = get_page_by_path($slug);
            if ($p) {
                $this->apply_elementor_seed($p->ID, $story_data, 'our-story');
            }
        }

        // 3. Seed Contact Us Page
        $contact_slugs = array('contact-us', 'contact');
        $contact_data  = array(
            array(
                'id'       => 'nescntc01',
                'elType'   => 'container',
                'settings' => array('content_width' => 'full', 'padding' => $zero_pad, 'margin' => $zero_pad),
                'elements' => array(
                    array(
                        'id'         => 'nescntcw1',
                        'elType'     => 'widget',
                        'widgetType' => 'nesports_contact_widget',
                        'settings'   => array(),
                        'elements'   => array(),
                    ),
                ),
                'isInner'  => false,
            ),
        );
        foreach ($contact_slugs as $slug) {
            $p = get_page_by_path($slug);
            if ($p) {
                $this->apply_elementor_seed($p->ID, $contact_data, 'contact');
            }
        }

        // 4. Seed Shop / All Products Page
        $shop_slugs = array('shop', 'all-products', 'catalog');
        $shop_data  = array(
            array(
                'id'       => 'nesshop01',
                'elType'   => 'container',
                'settings' => array('content_width' => 'full', 'padding' => $zero_pad, 'margin' => $zero_pad),
                'elements' => array(
                    array(
                        'id'         => 'nesshopw1',
                        'elType'     => 'widget',
                        'widgetType' => 'nesports_products_widget',
                        'settings'   => array(),
                        'elements'   => array(),
                    ),
                ),
                'isInner'  => false,
            ),
        );
        foreach ($shop_slugs as $slug) {
            $p = get_page_by_path($slug);
            if ($p) {
                $this->apply_elementor_seed($p->ID, $shop_data, 'shop');
            }
        }

        // 5. Auto-import the 4 Native Elementor Kit Templates into Saved Templates (elementor_library)
        $kit_dir = NESPORTS_PLUGIN_DIR . 'assets/elementor-kit/';
        $kit_files = array(
            '1-Home-Page-Template.json',
            '2-Shop-All-Products-Template.json',
            '3-About-Us-Template.json',
            '4-Contact-Us-Template.json',
        );
        foreach ($kit_files as $kf) {
            $kpath = $kit_dir . $kf;
            if (file_exists($kpath)) {
                $raw = file_get_contents($kpath);
                $decoded = json_decode($raw, true);
                if (is_array($decoded) && !empty($decoded['content']) && !empty($decoded['title'])) {
                    $found = get_posts(array(
                        'post_type'      => 'elementor_library',
                        'title'          => $decoded['title'],
                        'post_status'    => 'any',
                        'posts_per_page' => 1,
                    ));
                    $tpl_id = !empty($found) ? $found[0]->ID : wp_insert_post(array(
                        'post_title'  => $decoded['title'],
                        'post_status' => 'publish',
                        'post_type'   => 'elementor_library',
                    ));
                    if ($tpl_id && !is_wp_error($tpl_id)) {
                        update_post_meta($tpl_id, '_elementor_data', wp_slash(wp_json_encode($decoded['content'])));
                        update_post_meta($tpl_id, '_elementor_edit_mode', 'builder');
                        update_post_meta($tpl_id, '_elementor_template_type', 'page');
                        wp_set_object_terms($tpl_id, 'page', 'elementor_library_type');
                    }
                }
            }
        }

        if (did_action('elementor/loaded') && class_exists('\Elementor\Plugin')) {
            \Elementor\Plugin::$instance->files_manager->clear_cache();
        }

        update_option('nesports_elementor_seeded_v9', 'yes');
    }

    private function apply_elementor_seed($post_id, $elementor_data, $page_type) {
        $old_data = get_post_meta($post_id, '_elementor_data', true);
        if (!empty($old_data) && !get_post_meta($post_id, '_nesports_backup_elementor_data', true)) {
            update_post_meta($post_id, '_nesports_backup_elementor_data', $old_data);
        }

        update_post_meta($post_id, '_elementor_data', wp_slash(wp_json_encode($elementor_data)));
        update_post_meta($post_id, '_elementor_edit_mode', 'builder');
        update_post_meta($post_id, '_elementor_template_type', 'wp-page');
        update_post_meta($post_id, '_nesports_page_type', $page_type);
        update_post_meta($post_id, '_nesports_elementor_seeded', '1');
    }

    /**
     * Ensure Frontend Styles & Scripts are loaded inside Elementor Editor
     */
    public function enqueue_elementor_assets() {
        wp_enqueue_style(
            'nesports-google-fonts',
            'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap',
            array(),
            null
        );
        wp_enqueue_style(
            'nesports-font-awesome',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
            array(),
            '6.5.1'
        );
        $css_ver = NESPORTS_VERSION . '.' . (file_exists(NESPORTS_PLUGIN_DIR . 'assets/css/nesports-frontend.css') ? filemtime(NESPORTS_PLUGIN_DIR . 'assets/css/nesports-frontend.css') : time());
        wp_enqueue_style(
            'nesports-frontend-css',
            NESPORTS_PLUGIN_URL . 'assets/css/nesports-frontend.css',
            array(),
            $css_ver
        );

        $settings = get_option('nesports_store_settings', array());
        $accent_color = !empty($settings['accent_color']) ? sanitize_hex_color($settings['accent_color']) : '#e11d48';
        if (!$accent_color) {
            $accent_color = '#e11d48';
        }
        wp_add_inline_style('nesports-frontend-css', ":root { --hb-accent: {$accent_color}; }");

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
}
