<?php
if (!defined('ABSPATH')) {
    exit;
}

class NESports_Admin {

    public function init() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_init', array($this, 'handle_product_actions'));
        add_action('admin_init', array($this, 'redirect_legacy_editor'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_action('wp_ajax_nesports_regenerate_pages', array($this, 'ajax_regenerate_pages'));
        add_action('update_option_nesports_store_settings', array($this, 'on_settings_updated'), 10, 2);
        add_action('elementor/document/save', array($this, 'on_elementor_saved'), 10, 2);
        add_action('save_post', array($this, 'on_wp_post_saved'), 10, 3);
    }

    public function redirect_legacy_editor() {
        if (isset($_GET['post']) && $_GET['post'] == 4400 && isset($_GET['action']) && $_GET['action'] === 'elementor') {
            wp_redirect(admin_url('post.php?post=30090&action=elementor'));
            exit;
        }
    }

    public function on_settings_updated($old_val, $new_val) {
        $target_posts = array(30090, 4400);
        foreach ($target_posts as $post_id) {
            $meta = get_post_meta($post_id, '_elementor_data', true);
            if (!empty($meta)) {
                $decoded = json_decode($meta, true);
                if (is_array($decoded)) {
                    $changed = false;
                    $sync_elements = function(&$elements) use (&$sync_elements, $new_val, &$changed) {
                        foreach ($elements as &$el) {
                            if (isset($el['widgetType']) && in_array($el['widgetType'], array('nesports-story', 'nesports_story_widget'), true)) {
                                if (!isset($el['settings'])) $el['settings'] = array();
                                if (isset($new_val['about_story_text'])) {
                                    $el['settings']['story_text'] = $new_val['about_story_text'];
                                    $changed = true;
                                }
                                if (isset($new_val['about_story_title'])) {
                                    $el['settings']['story_title'] = $new_val['about_story_title'];
                                    $changed = true;
                                }
                                if (isset($new_val['about_banner_title'])) {
                                    $el['settings']['banner_title'] = $new_val['about_banner_title'];
                                    $changed = true;
                                }
                                if (isset($new_val['about_motto'])) {
                                    $el['settings']['motto'] = $new_val['about_motto'];
                                    $changed = true;
                                }
                                if (!empty($new_val['about_feature_img'])) {
                                    $el['settings']['image'] = array('url' => $new_val['about_feature_img'], 'id' => '', 'size' => '');
                                    $changed = true;
                                }
                            }
                            if (!empty($el['elements']) && is_array($el['elements'])) {
                                $sync_elements($el['elements']);
                            }
                        }
                    };
                    $sync_elements($decoded);
                    if ($changed) {
                        update_post_meta($post_id, '_elementor_data', wp_slash(json_encode($decoded)));
                        clean_post_cache($post_id);
                    }
                }
            }
        }
        if (class_exists('\Elementor\Plugin')) {
            \Elementor\Plugin::$instance->files_manager->clear_cache();
        }
    }

    public function on_elementor_saved($document, $data) {
        $post_id = $document ? $document->get_main_id() : 0;
        if (!$post_id) return;

        if ($post_id == 4400 || $post_id == 30090) {
            $other_id = ($post_id == 4400) ? 30090 : 4400;
            $raw_data = get_post_meta($post_id, '_elementor_data', true);
            if (!empty($raw_data)) {
                // Instantly sync & clone exact Elementor content to the sister page!
                update_post_meta($other_id, '_elementor_data', wp_slash($raw_data));
                update_post_meta($other_id, '_elementor_edit_mode', 'builder');
                clean_post_cache($other_id);
                clean_post_cache($post_id);

                $elements = json_decode($raw_data, true);
                if (is_array($elements)) {
                    $this->extract_and_sync_story_settings($elements);
                }
            }
        }

        if (class_exists('\Elementor\Plugin')) {
            \Elementor\Plugin::$instance->files_manager->clear_cache();
        }
        if (function_exists('wp_cache_flush')) {
            wp_cache_flush();
        }
    }

    public function on_wp_post_saved($post_id, $post, $update) {
        if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) return;
        if ($post_id == 4400 || $post_id == 30090) {
            $other_id = ($post_id == 4400) ? 30090 : 4400;
            $raw_data = get_post_meta($post_id, '_elementor_data', true);
            if (!empty($raw_data)) {
                update_post_meta($other_id, '_elementor_data', wp_slash($raw_data));
                update_post_meta($other_id, '_elementor_edit_mode', 'builder');
                clean_post_cache($other_id);

                $elements = json_decode($raw_data, true);
                if (is_array($elements)) {
                    $this->extract_and_sync_story_settings($elements);
                }
            }
        }
    }

    private function extract_and_sync_story_settings($elements) {
        $found = false;
        $updates = array();

        $scan = function($items) use (&$scan, &$updates, &$found) {
            foreach ($items as $item) {
                if (isset($item['widgetType']) && in_array($item['widgetType'], array('nesports-story', 'nesports_story_widget'), true)) {
                    $st = $item['settings'] ?? array();
                    if (isset($st['story_text']) && $st['story_text'] !== '') {
                        $updates['about_story_text'] = $st['story_text'];
                        $found = true;
                    }
                    if (isset($st['banner_title']) && $st['banner_title'] !== '') {
                        $updates['about_banner_title'] = $st['banner_title'];
                        $found = true;
                    }
                    if (isset($st['story_title']) && $st['story_title'] !== '') {
                        $updates['about_story_title'] = $st['story_title'];
                        $found = true;
                    }
                    if (!empty($st['image']['url'])) {
                        $updates['about_feature_img'] = $st['image']['url'];
                        $found = true;
                    }
                    if (isset($st['motto']) && $st['motto'] !== '') {
                        $updates['about_motto'] = $st['motto'];
                        $found = true;
                    }
                }
                if (!empty($item['elements']) && is_array($item['elements'])) {
                    $scan($item['elements']);
                }
            }
        };

        $scan($elements);

        if ($found && !empty($updates)) {
            $cur = get_option('nesports_store_settings', array());
            $merged = array_merge($cur, $updates);
            remove_action('update_option_nesports_store_settings', array($this, 'on_settings_updated'), 10);
            update_option('nesports_store_settings', $merged);
            add_action('update_option_nesports_store_settings', array($this, 'on_settings_updated'), 10, 2);
        }
    }

    /**
     * Add admin menus
     */
    public function add_admin_menu() {
        // 1. Prominent Top-Level Menu for Store Products
        add_menu_page(
            __('Store Products', 'nesports-pro-store'),
            __('Store Products', 'nesports-pro-store'),
            'manage_options',
            'nesports-store-products',
            array($this, 'render_products_manager'),
            'dashicons-cart',
            26
        );

        // 2. NE Sports Pro Store Engine Menu
        add_menu_page(
            __('NE Sports Store', 'nesports-pro-store'),
            __('NE Sports Store', 'nesports-pro-store'),
            'manage_options',
            'nesports-pro-store',
            array($this, 'render_admin_dashboard'),
            'dashicons-shield',
            56
        );

        add_submenu_page(
            'nesports-pro-store',
            __('Dashboard & Pages', 'nesports-pro-store'),
            __('Dashboard & Pages', 'nesports-pro-store'),
            'manage_options',
            'nesports-pro-store',
            array($this, 'render_admin_dashboard')
        );

        add_submenu_page(
            'nesports-pro-store',
            __('Products & Prices', 'nesports-pro-store'),
            __('Products & Prices', 'nesports-pro-store'),
            'manage_options',
            'nesports-store-products',
            array($this, 'render_products_manager')
        );

        add_submenu_page(
            'nesports-pro-store',
            __('Hero & Banners', 'nesports-pro-store'),
            __('Hero & Banners', 'nesports-pro-store'),
            'manage_options',
            'nesports-pro-store-hero',
            array($this, 'render_hero_settings')
        );
    }

    /**
     * Register settings in WP Options
     */
    public function register_settings() {
        register_setting('nesports_store_options_group', 'nesports_store_settings', array(
            'sanitize_callback' => array($this, 'sanitize_settings')
        ));
    }

    public function sanitize_settings($input) {
        $clean = array();
        if (!is_array($input)) return $clean;
        foreach ($input as $key => $val) {
            if ($key === 'about_story_text' || $key === 'hero_subtitle') {
                $clean[$key] = wp_kses_post($val);
            } elseif (strpos($key, 'url') !== false || strpos($key, 'img') !== false || strpos($key, 'image') !== false) {
                $clean[$key] = esc_url_raw($val);
            } elseif (is_string($val)) {
                $clean[$key] = sanitize_text_field($val);
            } else {
                $clean[$key] = $val;
            }
        }
        return $clean;
    }

    /**
     * Enqueue Admin Assets & WordPress Media Library
     */
    public function enqueue_admin_assets($hook) {
        if (strpos($hook, 'nesports') !== false) {
            wp_enqueue_media();
        }

        if (strpos($hook, 'nesports-pro-store') === false && strpos($hook, 'nesports-store-products') === false) {
            return;
        }

        wp_enqueue_style(
            'nesports-admin-css',
            NESPORTS_PLUGIN_URL . 'assets/css/nesports-admin.css',
            array(),
            NESPORTS_VERSION
        );

        wp_enqueue_script(
            'nesports-admin-js',
            NESPORTS_PLUGIN_URL . 'assets/js/nesports-admin.js',
            array('jquery'),
            NESPORTS_VERSION,
            true
        );

        wp_localize_script('nesports-admin-js', 'nesports_admin_obj', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce'    => wp_create_nonce('nesports_admin_nonce')
        ));
    }

    /**
     * Handle Product Actions (Add, Quick Price, Edit, Delete, Reset)
     */
    public function handle_product_actions() {
        if (!isset($_POST['nesports_product_action'])) {
            return;
        }

        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized user', 'nesports-pro-store'));
        }

        check_admin_referer('nesports_product_action_nonce');

        $action = sanitize_text_field($_POST['nesports_product_action']);
        $catalog = function_exists('nesports_get_managed_catalog') ? nesports_get_managed_catalog() : get_option('nesports_managed_catalog', array());
        if (!is_array($catalog)) {
            $catalog = array();
        }

        if ($action === 'add_product') {
            $name     = sanitize_text_field($_POST['product_name'] ?? '');
            $cat      = sanitize_text_field($_POST['product_cat'] ?? 'belts');
            if (!empty($_POST['new_category_name'])) {
                $new_cat = sanitize_text_field($_POST['new_category_name']);
                if (function_exists('nesports_add_custom_category')) {
                    $created_slug = nesports_add_custom_category($new_cat);
                    if ($created_slug) $cat = $created_slug;
                } else {
                    $cat = sanitize_title($new_cat);
                }
            }
            $price    = floatval($_POST['product_price'] ?? 0);
            $old      = floatval($_POST['product_old_price'] ?? $price);
            $main_img = sanitize_text_field($_POST['product_main_img'] ?? '');
            $hover_img= sanitize_text_field($_POST['product_hover_img'] ?? '');
            $desc     = sanitize_text_field($_POST['product_desc'] ?? '');

            // Process Color & Size variations
            $colors_raw = sanitize_text_field($_POST['product_colors'] ?? '');
            $sizes_raw  = sanitize_text_field($_POST['product_sizes'] ?? '');
            $colors = array();
            if (!empty($colors_raw)) {
                foreach (explode(',', $colors_raw) as $c_part) {
                    $c_part = trim($c_part);
                    if (!empty($c_part)) $colors[] = $c_part;
                }
            }
            $sizes = array();
            if (!empty($sizes_raw)) {
                foreach (explode(',', $sizes_raw) as $s_part) {
                    $s_part = trim($s_part);
                    if (!empty($s_part)) $sizes[] = $s_part;
                }
            }

            if (empty($name)) {
                wp_redirect(admin_url('admin.php?page=nesports-store-products&error=empty_name'));
                exit;
            }

            if (empty($main_img)) {
                $main_img = 'DSC_0167-scaled-1.jpg';
            }
            if (empty($hover_img)) {
                $hover_img = $main_img;
            }

            $slug = sanitize_title($name);
            // Ensure unique slug
            $existing_slugs = array_column($catalog, 'slug');
            if (in_array($slug, $existing_slugs)) {
                $slug .= '-' . time();
            }

            $new_item = array(
                'name'    => $name,
                'slug'    => $slug,
                'cat'     => $cat,
                'price'   => $price,
                'old'     => $old > $price ? $old : $price,
                'reviews' => rand(25, 95),
                'desc'    => $desc,
                'main'    => $main_img,
                'hover'   => $hover_img,
                'colors'  => $colors,
                'sizes'   => $sizes
            );

            // Prepend new product to top of catalog
            array_unshift($catalog, $new_item);
            update_option('nesports_managed_catalog', $catalog);

            wp_redirect(admin_url('admin.php?page=nesports-store-products&msg=added'));
            exit;
        }

        if ($action === 'quick_price') {
            $slug  = sanitize_text_field($_POST['product_slug'] ?? '');
            $price = floatval($_POST['product_price'] ?? 0);
            $old   = floatval($_POST['product_old_price'] ?? $price);

            foreach ($catalog as &$item) {
                if (isset($item['slug']) && $item['slug'] === $slug) {
                    $item['price'] = $price;
                    $item['old']   = ($old >= $price) ? $old : $price;
                    break;
                }
            }
            unset($item);

            update_option('nesports_managed_catalog', $catalog);
            wp_redirect(admin_url('admin.php?page=nesports-store-products&msg=price_saved'));
            exit;
        }

        if ($action === 'edit_product') {
            $slug     = sanitize_text_field($_POST['product_slug'] ?? '');
            $name     = sanitize_text_field($_POST['product_name'] ?? '');
            $cat      = sanitize_text_field($_POST['product_cat'] ?? 'belts');
            if (!empty($_POST['new_category_name'])) {
                $new_cat = sanitize_text_field($_POST['new_category_name']);
                if (function_exists('nesports_add_custom_category')) {
                    $created_slug = nesports_add_custom_category($new_cat);
                    if ($created_slug) $cat = $created_slug;
                } else {
                    $cat = sanitize_title($new_cat);
                }
            }
            $price    = floatval($_POST['product_price'] ?? 0);
            $old      = floatval($_POST['product_old_price'] ?? $price);
            $main_img = sanitize_text_field($_POST['product_main_img'] ?? '');
            $hover_img= sanitize_text_field($_POST['product_hover_img'] ?? '');
            $desc     = sanitize_text_field($_POST['product_desc'] ?? '');

            // Process Color & Size variations
            $colors_raw = sanitize_text_field($_POST['product_colors'] ?? '');
            $sizes_raw  = sanitize_text_field($_POST['product_sizes'] ?? '');
            $colors = array();
            if (!empty($colors_raw)) {
                foreach (explode(',', $colors_raw) as $c_part) {
                    $c_part = trim($c_part);
                    if (!empty($c_part)) $colors[] = $c_part;
                }
            }
            $sizes = array();
            if (!empty($sizes_raw)) {
                foreach (explode(',', $sizes_raw) as $s_part) {
                    $s_part = trim($s_part);
                    if (!empty($s_part)) $sizes[] = $s_part;
                }
            }

            foreach ($catalog as &$item) {
                if (isset($item['slug']) && $item['slug'] === $slug) {
                    if (!empty($name)) $item['name'] = $name;
                    $item['cat']   = $cat;
                    $item['price'] = $price;
                    $item['old']   = ($old >= $price) ? $old : $price;
                    $item['desc']  = $desc;
                    if (!empty($main_img)) $item['main'] = $main_img;
                    if (!empty($hover_img)) $item['hover'] = $hover_img;
                    $item['colors'] = $colors;
                    $item['sizes']  = $sizes;
                    break;
                }
            }
            unset($item);

            update_option('nesports_managed_catalog', $catalog);
            wp_redirect(admin_url('admin.php?page=nesports-store-products&msg=updated'));
            exit;
        }

        if ($action === 'add_category') {
            $cat_name = sanitize_text_field($_POST['category_name'] ?? '');
            if (!empty($cat_name) && function_exists('nesports_add_custom_category')) {
                nesports_add_custom_category($cat_name);
                wp_redirect(admin_url('admin.php?page=nesports-store-products&msg=cat_added'));
                exit;
            }
            wp_redirect(admin_url('admin.php?page=nesports-store-products&error=empty_cat'));
            exit;
        }

        if ($action === 'delete_category') {
            $cat_slug = sanitize_text_field($_POST['category_slug'] ?? '');
            if (!empty($cat_slug) && function_exists('nesports_delete_custom_category')) {
                nesports_delete_custom_category($cat_slug);
                wp_redirect(admin_url('admin.php?page=nesports-store-products&msg=cat_deleted'));
                exit;
            }
            wp_redirect(admin_url('admin.php?page=nesports-store-products'));
            exit;
        }

        if ($action === 'delete_product') {
            $slug = sanitize_text_field($_POST['product_slug'] ?? '');
            $catalog = array_values(array_filter($catalog, function($item) use ($slug) {
                return isset($item['slug']) && $item['slug'] !== $slug;
            }));

            update_option('nesports_managed_catalog', $catalog);
            wp_redirect(admin_url('admin.php?page=nesports-store-products&msg=deleted'));
            exit;
        }

        if ($action === 'reset_catalog') {
            if (function_exists('nesports_preset_catalog')) {
                $catalog = nesports_preset_catalog();
                update_option('nesports_managed_catalog', $catalog);
            }
            wp_redirect(admin_url('admin.php?page=nesports-store-products&msg=reset'));
            exit;
        }
    }

    /**
     * AJAX handler to regenerate pages
     */
    public function ajax_regenerate_pages() {
        check_ajax_referer('nesports_admin_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => 'Unauthorized action'));
        }

        $pages = NESports_Activator::generate_all_pages();
        wp_send_json_success(array(
            'message' => 'All pages and menus have been regenerated successfully!',
            'pages'   => $pages
        ));
    }

    /**
     * Render Dedicated Products & Prices Manager
     */
    public function render_products_manager() {
        $catalog = function_exists('nesports_get_managed_catalog') ? nesports_get_managed_catalog() : (get_option('nesports_managed_catalog') ?: array());
        $categories = function_exists('nesports_categories') ? nesports_categories() : array(
            'belts'    => 'WEIGHTLIFTING BELTS',
            'straps'   => 'LIFTING STRAPS',
            'knee'     => 'KNEE WRAPS',
            'elbow'    => 'ELBOW WRAPS',
            'speed'    => 'SPEED BALL',
            'wrist'    => 'WRIST WRAPS',
            'bags'     => 'GYM BAGS',
            'ankle'    => 'ANKLE STRAPS',
            'pads'     => 'BARBELL PADS',
            'clothing' => 'CLOTHING',
        );

        $msg = sanitize_text_field($_GET['msg'] ?? '');
        $error = sanitize_text_field($_GET['error'] ?? '');
        ?>
        <div class="wrap nesports-products-admin-wrap" style="max-width: 1380px; margin: 20px auto 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            
            <!-- Header bar -->
            <div style="background: #ffffff; border-radius: 12px; padding: 24px 28px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; border-left: 5px solid #e11d48;">
                <div>
                    <h1 style="margin: 0 0 6px; font-size: 26px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 10px;">
                        <span class="dashicons dashicons-cart" style="font-size: 30px; width: 30px; height: 30px; color: #e11d48;"></span>
                        NESPORTS3 Store &mdash; Product & Price Manager
                    </h1>
                    <p style="margin: 0; color: #64748b; font-size: 14px;">
                        Manage your store's live catalog, add new products, update prices, or remove items. Changes reflect instantly on the live storefront!
                    </p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button type="button" onclick="document.getElementById('nesports-category-modal').style.display='flex';" class="button" style="height: 40px; padding: 0 16px; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; border-radius: 8px; border: 1px solid #cbd5e1; background: #ffffff; color: #334155;">
                        <span class="dashicons dashicons-category" style="margin-top: 2px; color: #e11d48;"></span> Manage Categories
                    </button>
                    <button type="button" onclick="document.getElementById('nesports-add-modal').style.display='flex';" class="button button-primary" style="background: #e11d48; border-color: #be123c; font-size: 14px; height: 40px; padding: 0 20px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; border-radius: 8px;">
                        <span class="dashicons dashicons-plus-alt2" style="margin-top: 2px;"></span> Add New Product
                    </button>
                    <a href="<?php echo esc_url(home_url('/')); ?>" target="_blank" class="button" style="height: 40px; padding: 0 16px; font-size: 14px; display: inline-flex; align-items: center; gap: 6px; border-radius: 8px;">
                        <span class="dashicons dashicons-external" style="margin-top: 2px;"></span> View Live Store
                    </a>
                </div>
            </div>

            <!-- Notifications -->
            <?php if ($msg === 'added'): ?>
                <div class="notice notice-success is-dismissible" style="padding: 12px 18px; border-radius: 8px; font-size: 14px; font-weight: 500;">
                    <p><strong>Success!</strong> New product has been added to your store catalog and is now live.</p>
                </div>
            <?php elseif ($msg === 'price_saved'): ?>
                <div class="notice notice-success is-dismissible" style="padding: 12px 18px; border-radius: 8px; font-size: 14px; font-weight: 500;">
                    <p><strong>Price Updated!</strong> The product price has been successfully updated on the live website.</p>
                </div>
            <?php elseif ($msg === 'updated'): ?>
                <div class="notice notice-success is-dismissible" style="padding: 12px 18px; border-radius: 8px; font-size: 14px; font-weight: 500;">
                    <p><strong>Success!</strong> Product details were updated successfully.</p>
                </div>
            <?php elseif ($msg === 'deleted'): ?>
                <div class="notice notice-warning is-dismissible" style="padding: 12px 18px; border-radius: 8px; font-size: 14px; font-weight: 500;">
                    <p><strong>Deleted!</strong> The product was removed from your store catalog.</p>
                </div>
            <?php elseif ($msg === 'reset'): ?>
                <div class="notice notice-info is-dismissible" style="padding: 12px 18px; border-radius: 8px; font-size: 14px; font-weight: 500;">
                    <p>Store catalog was restored to default preset products.</p>
                </div>
            <?php elseif ($msg === 'cat_added'): ?>
                <div class="notice notice-success is-dismissible" style="padding: 12px 18px; border-radius: 8px; font-size: 14px; font-weight: 500;">
                    <p><strong>Category Added!</strong> New category has been registered and is now live across store filters and products.</p>
                </div>
            <?php elseif ($msg === 'cat_deleted'): ?>
                <div class="notice notice-warning is-dismissible" style="padding: 12px 18px; border-radius: 8px; font-size: 14px; font-weight: 500;">
                    <p>Category was removed.</p>
                </div>
            <?php elseif ($error === 'empty_cat'): ?>
                <div class="notice notice-error is-dismissible" style="padding: 12px 18px; border-radius: 8px; font-size: 14px; font-weight: 500;">
                    <p><strong>Error!</strong> Category Name cannot be empty.</p>
                </div>
            <?php elseif ($error === 'empty_name'): ?>
                <div class="notice notice-error is-dismissible" style="padding: 12px 18px; border-radius: 8px; font-size: 14px; font-weight: 500;">
                    <p><strong>Error!</strong> Product Name cannot be empty.</p>
                </div>
            <?php endif; ?>

            <!-- Stats Bar -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div style="background: #ffffff; padding: 18px 22px; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.05);">
                    <span style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">Total Products</span>
                    <div style="font-size: 30px; font-weight: 700; color: #0f172a; margin-top: 4px;"><?php echo count($catalog); ?></div>
                </div>
                <div style="background: #ffffff; padding: 18px 22px; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.05);">
                    <span style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">Categories</span>
                    <div style="font-size: 30px; font-weight: 700; color: #0f172a; margin-top: 4px;"><?php echo count($categories); ?></div>
                </div>
                <div style="background: #ffffff; padding: 18px 22px; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.05);">
                    <span style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600;">Currency</span>
                    <div style="font-size: 30px; font-weight: 700; color: #0f172a; margin-top: 4px;">EUR (&euro;)</div>
                </div>
            </div>

            <!-- Search & Filter Controls -->
            <div style="background: #ffffff; padding: 16px 20px; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; gap: 15px; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 260px;">
                    <span class="dashicons dashicons-search" style="color: #94a3b8;"></span>
                    <input type="text" id="nesports-search-input" onkeyup="nesportsFilterTable()" placeholder="Search products by title or category..." style="width: 100%; max-width: 360px; height: 38px; border-radius: 6px; border: 1px solid #cbd5e1; padding: 0 12px; font-size: 14px;" />
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <select id="nesports-cat-filter" onchange="nesportsFilterTable()" style="height: 38px; border-radius: 6px; border: 1px solid #cbd5e1; padding: 0 12px; font-size: 14px;">
                        <option value="">All Categories</option>
                        <?php foreach ($categories as $cat_key => $cat_lbl): ?>
                            <option value="<?php echo esc_attr($cat_key); ?>"><?php echo esc_html($cat_lbl); ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>

            <!-- Products Table -->
            <div style="background: #ffffff; border-radius: 12px; box-shadow: 0 1px 6px rgba(0,0,0,0.06); overflow: hidden;">
                <table class="wp-list-table widefat fixed striped" id="nesports-products-table" style="border: none;">
                    <thead>
                        <tr style="background: #f8fafc;">
                            <th style="width: 70px; padding: 14px 16px; font-weight: 700; color: #475569;">Image</th>
                            <th style="padding: 14px 16px; font-weight: 700; color: #475569;">Product Name</th>
                            <th style="width: 140px; padding: 14px 16px; font-weight: 700; color: #475569;">Category</th>
                            <th style="width: 150px; padding: 14px 16px; font-weight: 700; color: #475569;">Regular Price (&euro;)</th>
                            <th style="width: 150px; padding: 14px 16px; font-weight: 700; color: #475569;">Sale Price (&euro;)</th>
                            <th style="width: 220px; padding: 14px 16px; font-weight: 700; color: #475569; text-align: right;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($catalog)): ?>
                            <tr>
                                <td colspan="6" style="text-align: center; padding: 30px; color: #64748b;">
                                    No products found in the catalog. Click "+ Add New Product" above to create one.
                                </td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($catalog as $prod): 
                                $slug = $prod['slug'] ?? '';
                                $name = $prod['name'] ?? 'Untitled';
                                $cat  = $prod['cat'] ?? 'general';
                                $curr = floatval($prod['price'] ?? 0);
                                $old  = floatval($prod['old'] ?? $curr);
                                $img  = $prod['main'] ?? '';
                                $hover= $prod['hover'] ?? '';
                                $img_url = function_exists('nesports_img') ? nesports_img($img) : $img;
                            ?>
                                <tr class="nesports-prod-row" data-cat="<?php echo esc_attr(strtolower($cat)); ?>">
                                    <td style="padding: 12px 16px; vertical-align: middle;">
                                        <div style="width: 52px; height: 52px; border-radius: 8px; overflow: hidden; background: #0f172a; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0;">
                                            <?php if (!empty($img_url)): ?>
                                                <img src="<?php echo esc_url($img_url); ?>" alt="<?php echo esc_attr($name); ?>" style="width: 100%; height: 100%; object-fit: cover;" />
                                            <?php else: ?>
                                                <span class="dashicons dashicons-format-image" style="color: #94a3b8;"></span>
                                            <?php endif; ?>
                                        </div>
                                    </td>
                                    <td style="padding: 12px 16px; vertical-align: middle;">
                                        <strong class="nesports-prod-name" style="font-size: 14.5px; color: #0f172a; display: block; margin-bottom: 3px;"><?php echo esc_html($name); ?></strong>
                                        <?php if (!empty($prod['desc'])): ?>
                                            <div style="font-size: 12px; color: #64748b; margin-bottom: 4px; font-style: italic; line-height: 1.35; max-width: 320px;">
                                                <?php echo esc_html($prod['desc']); ?>
                                            </div>
                                        <?php endif; ?>
                                        <code style="font-size: 11.5px; color: #64748b; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">/product/<?php echo esc_html($slug); ?>/</code>
                                        
                                        <?php if (!empty($prod['colors'])): ?>
                                            <div style="margin-top: 6px; display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
                                                <span style="font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase;">Colors:</span>
                                                <?php foreach ((array)$prod['colors'] as $c): 
                                                    $c_label = is_array($c) ? ($c['name'] ?? '') : $c;
                                                    if (!$c_label) continue;
                                                ?>
                                                    <span style="display: inline-block; padding: 1px 6px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 10.5px; color: #1e293b;"><?php echo esc_html($c_label); ?></span>
                                                <?php endforeach; ?>
                                            </div>
                                        <?php endif; ?>
                                        <?php if (!empty($prod['sizes'])): ?>
                                            <div style="margin-top: 4px; display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
                                                <span style="font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase;">Sizes:</span>
                                                <?php foreach ((array)$prod['sizes'] as $s): 
                                                    $s_label = is_array($s) ? ($s['label'] ?? $s['val'] ?? '') : $s;
                                                    if (!$s_label) continue;
                                                ?>
                                                    <span style="display: inline-block; padding: 1px 6px; background: #e0e7ff; border: 1px solid #c7d2fe; border-radius: 4px; font-size: 10.5px; color: #3730a3; font-weight: 600;"><?php echo esc_html($s_label); ?></span>
                                                <?php endforeach; ?>
                                            </div>
                                        <?php endif; ?>
                                    </td>
                                    <td style="padding: 12px 16px; vertical-align: middle;">
                                        <span style="display: inline-block; padding: 3px 10px; background: #e0f2fe; color: #0369a1; border-radius: 999px; font-size: 11.5px; font-weight: 600; text-transform: uppercase;">
                                            <?php echo esc_html($categories[$cat] ?? strtoupper($cat)); ?>
                                        </span>
                                    </td>
                                    
                                    <!-- Inline Quick Price Form -->
                                    <form method="post" action="">
                                        <?php wp_nonce_field('nesports_product_action_nonce'); ?>
                                        <input type="hidden" name="nesports_product_action" value="quick_price" />
                                        <input type="hidden" name="product_slug" value="<?php echo esc_attr($slug); ?>" />

                                        <td style="padding: 12px 16px; vertical-align: middle;">
                                            <div style="position: relative; display: inline-flex; align-items: center;">
                                                <span style="position: absolute; left: 8px; color: #64748b; font-weight: 600;">&euro;</span>
                                                <input type="number" step="0.01" min="0" name="product_old_price" value="<?php echo esc_attr(number_format($old, 2, '.', '')); ?>" style="width: 105px; padding-left: 22px; height: 34px; border-radius: 6px; font-weight: 600;" />
                                            </div>
                                        </td>
                                        <td style="padding: 12px 16px; vertical-align: middle;">
                                            <div style="position: relative; display: inline-flex; align-items: center;">
                                                <span style="position: absolute; left: 8px; color: #e11d48; font-weight: 700;">&euro;</span>
                                                <input type="number" step="0.01" min="0" name="product_price" value="<?php echo esc_attr(number_format($curr, 2, '.', '')); ?>" style="width: 105px; padding-left: 22px; height: 34px; border-radius: 6px; font-weight: 700; color: #e11d48;" />
                                            </div>
                                        </td>
                                        <td style="padding: 12px 16px; vertical-align: middle; text-align: right;">
                                            <div style="display: inline-flex; gap: 6px; align-items: center;">
                                                <button type="submit" class="button button-small" style="background: #0f172a; color: #ffffff; border-color: #0f172a; font-weight: 600; height: 30px; line-height: 28px; border-radius: 6px;">
                                                    Save Price
                                                </button>
                                    </form>

                                                <button type="button" 
                                                        onclick="nesportsOpenEditModal(<?php echo esc_attr(json_encode($prod)); ?>)"
                                                        class="button button-small" 
                                                        style="height: 30px; line-height: 28px; border-radius: 6px;" 
                                                        title="Edit Product Details">
                                                    Edit
                                                </button>

                                                <form method="post" action="" onsubmit="return confirm('Are you sure you want to delete <?php echo esc_js($name); ?>? This cannot be undone.');" style="display: inline;">
                                                    <?php wp_nonce_field('nesports_product_action_nonce'); ?>
                                                    <input type="hidden" name="nesports_product_action" value="delete_product" />
                                                    <input type="hidden" name="product_slug" value="<?php echo esc_attr($slug); ?>" />
                                                    <button type="submit" class="button button-small button-link-delete" style="height: 30px; line-height: 28px; color: #dc2626; border: 1px solid #fecaca; background: #fff5f5; border-radius: 6px; padding: 0 8px;">
                                                        Delete
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>

            <!-- Footer Tools -->
            <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
                <form method="post" action="" onsubmit="return confirm('Warning: This will restore all standard preset products. Are you sure?');">
                    <?php wp_nonce_field('nesports_product_action_nonce'); ?>
                    <input type="hidden" name="nesports_product_action" value="reset_catalog" />
                    <button type="submit" class="button" style="color: #64748b; font-size: 12px;">
                        Reset Catalog to Factory Defaults
                    </button>
                </form>
            </div>
        </div>

        <!-- =========================================================================
             MODAL: ADD NEW PRODUCT
             ========================================================================= -->
        <div id="nesports-add-modal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.7); z-index: 100000; align-items: center; justify-content: center; padding: 20px;">
            <div style="background: #ffffff; width: 100%; max-width: 580px; border-radius: 14px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); overflow: hidden; max-height: 90vh; display: flex; flex-direction: column;">
                <div style="padding: 18px 24px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; background: #f8fafc;">
                    <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #0f172a;">+ Add New Store Product</h3>
                    <button type="button" onclick="document.getElementById('nesports-add-modal').style.display='none';" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b;">&times;</button>
                </div>
                
                <form method="post" action="" style="padding: 24px; overflow-y: auto;">
                    <?php wp_nonce_field('nesports_product_action_nonce'); ?>
                    <input type="hidden" name="nesports_product_action" value="add_product" />

                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Product Name *</label>
                        <input type="text" name="product_name" required placeholder="e.g. Pro Leather Lever Belt 10mm" class="widefat" style="height: 40px; border-radius: 6px;" />
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Short Product Description</label>
                        <textarea name="product_desc" placeholder="e.g. 10mm genuine leather with heavy-duty stainless steel lever buckle" class="widefat" rows="2" style="border-radius: 6px; font-size: 13px;"></textarea>
                        <p class="description" style="margin-top: 4px;">Displays directly under the product price on category & shop cards.</p>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Category *</label>
                        <select name="product_cat" id="add-product-cat-select" onchange="nesportsToggleNewCatInput(this, 'add-new-cat-wrap')" required class="widefat" style="height: 40px; border-radius: 6px;">
                            <?php foreach ($categories as $cat_k => $cat_name): ?>
                                <option value="<?php echo esc_attr($cat_k); ?>"><?php echo esc_html($cat_name); ?></option>
                            <?php endforeach; ?>
                            <option value="__new__" style="color: #e11d48; font-weight: 700;">+ Add New Category...</option>
                        </select>
                        <div id="add-new-cat-wrap" style="display: none; margin-top: 8px;">
                            <input type="text" name="new_category_name" placeholder="Enter new category name (e.g. Gym Gloves)" class="widefat" style="height: 38px; border-radius: 6px; border: 1.5px solid #e11d48; background: #fff1f2;" />
                            <p class="description" style="color: #e11d48; margin-top: 3px;">This new category will be created and added to your store automatically.</p>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Sale Price (&euro;) *</label>
                            <input type="number" step="0.01" min="0" name="product_price" required placeholder="59.99" class="widefat" style="height: 40px; border-radius: 6px;" />
                        </div>
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Regular Price (&euro;) (Strikethrough)</label>
                            <input type="number" step="0.01" min="0" name="product_old_price" placeholder="79.99" class="widefat" style="height: 40px; border-radius: 6px;" />
                        </div>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Product Main Image *</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="add-product-main-img" name="product_main_img" placeholder="Image filename (e.g. DSC_0167-scaled-1.jpg) or full Media URL" class="widefat" style="height: 40px; border-radius: 6px;" />
                            <button type="button" class="button" onclick="nesportsSelectMedia('add-product-main-img')" style="height: 40px; white-space: nowrap;">
                                Upload / Media
                            </button>
                        </div>
                        <p class="description" style="margin-top: 4px;">Click "Upload / Media" to pick from WordPress Media Library or enter image name.</p>
                    </div>

                    <div style="margin-bottom: 18px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Hover / Secondary Image (Optional)</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="add-product-hover-img" name="product_hover_img" placeholder="Optional 2nd angle image" class="widefat" style="height: 40px; border-radius: 6px;" />
                            <button type="button" class="button" onclick="nesportsSelectMedia('add-product-hover-img')" style="height: 40px; white-space: nowrap;">
                                Upload / Media
                            </button>
                        </div>
                    </div>

                    <!-- Variations: Colors -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <label style="font-weight: 700; color: #0f172a; font-size: 13.5px; display: flex; align-items: center; gap: 6px;">
                                <span class="dashicons dashicons-art" style="color: #e11d48; font-size: 18px; width: 18px; height: 18px;"></span> Available Colors (Variations)
                            </label>
                            <span style="font-size: 11px; color: #64748b;">Optional</span>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
                            <?php foreach (array('Black', 'Red', 'Royal Blue', 'Grey', 'Army Green', 'White', 'Gold', 'Pink') as $preset_c): ?>
                                <button type="button" class="button button-small" onclick="nesportsAddVariationPill('add-product-colors', '<?php echo esc_js($preset_c); ?>')" style="border-radius: 14px; font-size: 11px; height: 24px; line-height: 22px;">+ <?php echo esc_html($preset_c); ?></button>
                            <?php endforeach; ?>
                        </div>
                        <input type="text" id="add-product-colors" name="product_colors" placeholder="e.g. Black, Red, Royal Blue, Grey (comma-separated)" class="widefat" style="height: 38px; border-radius: 6px; font-size: 13px;" />
                        <p class="description" style="margin-top: 4px; font-size: 11.5px;">Click quick presets above or type comma-separated color names. Shows as color circles on product page.</p>
                    </div>

                    <!-- Variations: Sizes -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 22px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <label style="font-weight: 700; color: #0f172a; font-size: 13.5px; display: flex; align-items: center; gap: 6px;">
                                <span class="dashicons dashicons-tag" style="color: #2563eb; font-size: 18px; width: 18px; height: 18px;"></span> Available Sizes (Variations)
                            </label>
                            <span style="font-size: 11px; color: #64748b;">Optional</span>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
                            <?php foreach (array('XS', 'S', 'M', 'L', 'XL', 'XXL', '10mm', '13mm', 'One Size') as $preset_s): ?>
                                <button type="button" class="button button-small" onclick="nesportsAddVariationPill('add-product-sizes', '<?php echo esc_js($preset_s); ?>')" style="border-radius: 14px; font-size: 11px; height: 24px; line-height: 22px;">+ <?php echo esc_html($preset_s); ?></button>
                            <?php endforeach; ?>
                        </div>
                        <input type="text" id="add-product-sizes" name="product_sizes" placeholder="e.g. XS, S, M, L, XL, XXL or 10mm, 13mm (comma-separated)" class="widefat" style="height: 38px; border-radius: 6px; font-size: 13px;" />
                        <p class="description" style="margin-top: 4px; font-size: 11.5px;">Click quick presets above or type comma-separated sizes. Displays as clean Hardbody-style selection boxes on product page.</p>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #e2e8f0; padding-top: 18px;">
                        <button type="button" onclick="document.getElementById('nesports-add-modal').style.display='none';" class="button button-secondary" style="height: 40px; padding: 0 16px;">Cancel</button>
                        <button type="submit" class="button button-primary" style="height: 40px; padding: 0 24px; background: #e11d48; border-color: #be123c; font-weight: 600;">Publish Product</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- =========================================================================
             MODAL: EDIT PRODUCT
             ========================================================================= -->
        <div id="nesports-edit-modal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.7); z-index: 100000; align-items: center; justify-content: center; padding: 20px;">
            <div style="background: #ffffff; width: 100%; max-width: 580px; border-radius: 14px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); overflow: hidden; max-height: 90vh; display: flex; flex-direction: column;">
                <div style="padding: 18px 24px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; background: #f8fafc;">
                    <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #0f172a;">Edit Product</h3>
                    <button type="button" onclick="document.getElementById('nesports-edit-modal').style.display='none';" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b;">&times;</button>
                </div>
                
                <form method="post" action="" style="padding: 24px; overflow-y: auto;">
                    <?php wp_nonce_field('nesports_product_action_nonce'); ?>
                    <input type="hidden" name="nesports_product_action" value="edit_product" />
                    <input type="hidden" id="edit-product-slug" name="product_slug" value="" />

                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Product Name</label>
                        <input type="text" id="edit-product-name" name="product_name" required class="widefat" style="height: 40px; border-radius: 6px;" />
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Short Product Description</label>
                        <textarea id="edit-product-desc" name="product_desc" placeholder="e.g. 10mm genuine leather with heavy-duty stainless steel lever buckle" class="widefat" rows="2" style="border-radius: 6px; font-size: 13px;"></textarea>
                        <p class="description" style="margin-top: 4px;">Displays directly under the product price on category & shop cards.</p>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Category</label>
                        <select id="edit-product-cat" name="product_cat" onchange="nesportsToggleNewCatInput(this, 'edit-new-cat-wrap')" required class="widefat" style="height: 40px; border-radius: 6px;">
                            <?php foreach ($categories as $cat_k => $cat_name): ?>
                                <option value="<?php echo esc_attr($cat_k); ?>"><?php echo esc_html($cat_name); ?></option>
                            <?php endforeach; ?>
                            <option value="__new__" style="color: #e11d48; font-weight: 700;">+ Add New Category...</option>
                        </select>
                        <div id="edit-new-cat-wrap" style="display: none; margin-top: 8px;">
                            <input type="text" name="new_category_name" placeholder="Enter new category name (e.g. Resistance Bands)" class="widefat" style="height: 38px; border-radius: 6px; border: 1.5px solid #e11d48; background: #fff1f2;" />
                            <p class="description" style="color: #e11d48; margin-top: 3px;">This will create the category and move this product into it.</p>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Sale Price (&euro;)</label>
                            <input type="number" step="0.01" min="0" id="edit-product-price" name="product_price" required class="widefat" style="height: 40px; border-radius: 6px;" />
                        </div>
                        <div>
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Regular Price (&euro;)</label>
                            <input type="number" step="0.01" min="0" id="edit-product-old-price" name="product_old_price" class="widefat" style="height: 40px; border-radius: 6px;" />
                        </div>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Main Image (URL or Filename)</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="edit-product-main-img" name="product_main_img" class="widefat" style="height: 40px; border-radius: 6px;" />
                            <button type="button" class="button" onclick="nesportsSelectMedia('edit-product-main-img')" style="height: 40px; white-space: nowrap;">
                                Upload / Media
                            </button>
                        </div>
                    </div>

                    <div style="margin-bottom: 18px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Hover Image (Optional)</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="edit-product-hover-img" name="product_hover_img" class="widefat" style="height: 40px; border-radius: 6px;" />
                            <button type="button" class="button" onclick="nesportsSelectMedia('edit-product-hover-img')" style="height: 40px; white-space: nowrap;">
                                Upload / Media
                            </button>
                        </div>
                    </div>

                    <!-- Variations: Colors -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <label style="font-weight: 700; color: #0f172a; font-size: 13.5px; display: flex; align-items: center; gap: 6px;">
                                <span class="dashicons dashicons-art" style="color: #e11d48; font-size: 18px; width: 18px; height: 18px;"></span> Available Colors (Variations)
                            </label>
                            <span style="font-size: 11px; color: #64748b;">Optional</span>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
                            <?php foreach (array('Black', 'Red', 'Royal Blue', 'Grey', 'Army Green', 'White', 'Gold', 'Pink') as $preset_c): ?>
                                <button type="button" class="button button-small" onclick="nesportsAddVariationPill('edit-product-colors', '<?php echo esc_js($preset_c); ?>')" style="border-radius: 14px; font-size: 11px; height: 24px; line-height: 22px;">+ <?php echo esc_html($preset_c); ?></button>
                            <?php endforeach; ?>
                        </div>
                        <input type="text" id="edit-product-colors" name="product_colors" placeholder="e.g. Black, Red, Royal Blue, Grey (comma-separated)" class="widefat" style="height: 38px; border-radius: 6px; font-size: 13px;" />
                        <p class="description" style="margin-top: 4px; font-size: 11.5px;">Click quick presets above or type comma-separated color names. Shows as color circles on product page.</p>
                    </div>

                    <!-- Variations: Sizes -->
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 22px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <label style="font-weight: 700; color: #0f172a; font-size: 13.5px; display: flex; align-items: center; gap: 6px;">
                                <span class="dashicons dashicons-tag" style="color: #2563eb; font-size: 18px; width: 18px; height: 18px;"></span> Available Sizes (Variations)
                            </label>
                            <span style="font-size: 11px; color: #64748b;">Optional</span>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
                            <?php foreach (array('XS', 'S', 'M', 'L', 'XL', 'XXL', '10mm', '13mm', 'One Size') as $preset_s): ?>
                                <button type="button" class="button button-small" onclick="nesportsAddVariationPill('edit-product-sizes', '<?php echo esc_js($preset_s); ?>')" style="border-radius: 14px; font-size: 11px; height: 24px; line-height: 22px;">+ <?php echo esc_html($preset_s); ?></button>
                            <?php endforeach; ?>
                        </div>
                        <input type="text" id="edit-product-sizes" name="product_sizes" placeholder="e.g. XS, S, M, L, XL, XXL or 10mm, 13mm (comma-separated)" class="widefat" style="height: 38px; border-radius: 6px; font-size: 13px;" />
                        <p class="description" style="margin-top: 4px; font-size: 11.5px;">Click quick presets above or type comma-separated sizes. Displays as clean Hardbody-style selection boxes on product page.</p>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #e2e8f0; padding-top: 18px;">
                        <button type="button" onclick="document.getElementById('nesports-edit-modal').style.display='none';" class="button button-secondary" style="height: 40px; padding: 0 16px;">Cancel</button>
                        <button type="submit" class="button button-primary" style="height: 40px; padding: 0 24px; background: #0f172a; border-color: #0f172a; font-weight: 600;">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- =========================================================================
             MODAL: MANAGE CATEGORIES
             ========================================================================= -->
        <div id="nesports-category-modal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.7); z-index: 100000; align-items: center; justify-content: center; padding: 20px;">
            <div style="background: #ffffff; width: 100%; max-width: 520px; border-radius: 14px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2); overflow: hidden; max-height: 90vh; display: flex; flex-direction: column;">
                <div style="padding: 18px 24px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; background: #f8fafc;">
                    <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                        <span class="dashicons dashicons-category" style="color: #e11d48;"></span> Store Categories
                    </h3>
                    <button type="button" onclick="document.getElementById('nesports-category-modal').style.display='none';" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b;">&times;</button>
                </div>

                <div style="padding: 24px; overflow-y: auto;">
                    <!-- Add Category Form -->
                    <form method="post" action="" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 22px;">
                        <?php wp_nonce_field('nesports_product_action_nonce'); ?>
                        <input type="hidden" name="nesports_product_action" value="add_category" />
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #0f172a; font-size: 13.5px;">+ Add New Category</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" name="category_name" required placeholder="e.g. Gym Gloves, Shakers, Bands" class="widefat" style="height: 40px; border-radius: 6px;" />
                            <button type="submit" class="button button-primary" style="height: 40px; padding: 0 18px; background: #e11d48; border-color: #be123c; font-weight: 600; white-space: nowrap;">
                                Add Category
                            </button>
                        </div>
                    </form>

                    <!-- Existing Categories List -->
                    <label style="display: block; font-weight: 700; margin-bottom: 10px; color: #334155; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                        Current Categories (<?php echo count($categories); ?>)
                    </label>
                    <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; max-height: 280px; overflow-y: auto;">
                        <table class="widefat striped" style="border: none;">
                            <tbody>
                                <?php 
                                $custom_cats = get_option('nesports_custom_categories', array());
                                foreach ($categories as $cat_slug => $cat_label): 
                                    $is_custom = isset($custom_cats[$cat_slug]);
                                ?>
                                    <tr>
                                        <td style="padding: 10px 14px; font-weight: 600; color: #0f172a;">
                                            <?php echo esc_html($cat_label); ?>
                                            <code style="font-size: 11px; margin-left: 6px; color: #64748b; font-weight: 400;">/<?php echo esc_html($cat_slug); ?>/</code>
                                        </td>
                                        <td style="padding: 10px 14px; text-align: right;">
                                            <?php if ($is_custom): ?>
                                                <form method="post" action="" onsubmit="return confirm('Delete category <?php echo esc_js($cat_label); ?>?');" style="display: inline;">
                                                    <?php wp_nonce_field('nesports_product_action_nonce'); ?>
                                                    <input type="hidden" name="nesports_product_action" value="delete_category" />
                                                    <input type="hidden" name="category_slug" value="<?php echo esc_attr($cat_slug); ?>" />
                                                    <button type="submit" class="button button-small" style="color: #dc2626; border-color: #fecaca; background: #fff5f5; height: 26px; line-height: 24px; font-size: 11.5px;">
                                                        Delete
                                                    </button>
                                                </form>
                                            <?php else: ?>
                                                <span style="font-size: 11px; color: #94a3b8; font-weight: 500;">Preset</span>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style="padding: 14px 24px; border-top: 1px solid #e2e8f0; background: #f8fafc; display: flex; justify-content: flex-end;">
                    <button type="button" onclick="document.getElementById('nesports-category-modal').style.display='none';" class="button button-secondary" style="height: 36px; padding: 0 16px;">Close</button>
                </div>
            </div>
        </div>

        <script>
        function nesportsToggleNewCatInput(selectEl, targetWrapId) {
            var wrap = document.getElementById(targetWrapId);
            if (!wrap) return;
            if (selectEl.value === '__new__') {
                wrap.style.display = 'block';
                var inp = wrap.querySelector('input');
                if (inp) { inp.required = true; inp.focus(); }
            } else {
                wrap.style.display = 'none';
                var inp = wrap.querySelector('input');
                if (inp) { inp.required = false; inp.value = ''; }
            }
        }
        function nesportsFilterTable() {
            var search = (document.getElementById('nesports-search-input').value || '').toLowerCase();
            var cat = (document.getElementById('nesports-cat-filter').value || '').toLowerCase();
            var rows = document.querySelectorAll('.nesports-prod-row');

            rows.forEach(function(r) {
                var name = (r.querySelector('.nesports-prod-name').innerText || '').toLowerCase();
                var rCat = (r.getAttribute('data-cat') || '').toLowerCase();
                
                var matchSearch = !search || name.indexOf(search) !== -1 || rCat.indexOf(search) !== -1;
                var matchCat = !cat || rCat === cat;

                if (matchSearch && matchCat) {
                    r.style.display = '';
                } else {
                    r.style.display = 'none';
                }
            });
        }

        function nesportsAddVariationPill(inputId, val) {
            var inp = document.getElementById(inputId);
            if (!inp) return;
            var current = inp.value.trim();
            if (!current) {
                inp.value = val;
            } else {
                var items = current.split(',').map(function(s){ return s.trim(); });
                if (items.indexOf(val) === -1) {
                    items.push(val);
                    inp.value = items.join(', ');
                }
            }
            inp.focus();
        }

        function nesportsOpenEditModal(prod) {
            document.getElementById('edit-product-slug').value = prod.slug || '';
            document.getElementById('edit-product-name').value = prod.name || '';
            document.getElementById('edit-product-desc').value = prod.desc || '';
            document.getElementById('edit-product-cat').value = prod.cat || 'belts';
            var editNewCatWrap = document.getElementById('edit-new-cat-wrap');
            if (editNewCatWrap) editNewCatWrap.style.display = 'none';
            document.getElementById('edit-product-price').value = prod.price || '';
            document.getElementById('edit-product-old-price').value = prod.old || prod.price || '';
            document.getElementById('edit-product-main-img').value = prod.main || '';
            document.getElementById('edit-product-hover-img').value = prod.hover || '';

            // Populate Color variations
            var colorsVal = '';
            if (Array.isArray(prod.colors)) {
                colorsVal = prod.colors.map(function(c){ return typeof c === 'object' ? (c.name || '') : c; }).filter(Boolean).join(', ');
            } else if (typeof prod.colors === 'string') {
                colorsVal = prod.colors;
            }
            var colorsInput = document.getElementById('edit-product-colors');
            if (colorsInput) colorsInput.value = colorsVal;

            // Populate Size variations
            var sizesVal = '';
            if (Array.isArray(prod.sizes)) {
                sizesVal = prod.sizes.map(function(s){ return typeof s === 'object' ? (s.val || s.label || '') : s; }).filter(Boolean).join(', ');
            } else if (typeof prod.sizes === 'string') {
                sizesVal = prod.sizes;
            }
            var sizesInput = document.getElementById('edit-product-sizes');
            if (sizesInput) sizesInput.value = sizesVal;

            document.getElementById('nesports-edit-modal').style.display = 'flex';
        }

        function nesportsSelectMedia(targetInputId) {
            var mediaUploader = wp.media({
                title: 'Select Product Image',
                button: { text: 'Use this Image' },
                multiple: false
            });
            mediaUploader.on('select', function() {
                var attachment = mediaUploader.state().get('selection').first().toJSON();
                document.getElementById(targetInputId).value = attachment.url;
            });
            mediaUploader.open();
        }
        </script>
        <?php
    }

    public function render_master_dashboard() {
        $this->render_admin_dashboard();
    }

    /**
     * Render main dashboard (Master Client Hub)
     */
    public function render_admin_dashboard() {
        $settings = get_option('nesports_store_settings', array());
        $pages = get_option('nesports_generated_pages', array());
        $front_page_id = (int) get_option('page_on_front');
        $active_tab = isset($_GET['tab']) ? sanitize_key($_GET['tab']) : 'pages';
        ?>
        <div class="wrap nesports-admin-wrap">
            <div class="nesports-admin-header">
                <div class="nesports-brand">
                    <span class="nesports-badge">CLIENT MASTER CONTROL HUB</span>
                    <h1>NE SPORTS <span>STORE ENGINE</span></h1>
                    <p>Complete self-serve controls: Edit pages, change images, update products, customize banners & colors in 1 click.</p>
                </div>
                <div class="nesports-quick-actions">
                    <a href="<?php echo esc_url(home_url('/')); ?>" target="_blank" class="button button-primary button-hero" style="background: #e11d48; border-color: #be123c;">
                        <span class="dashicons dashicons-external"></span> View Live Storefront
                    </a>
                    <a href="<?php echo esc_url(home_url('/our-story/')); ?>" target="_blank" class="button button-secondary button-hero">
                        <span class="dashicons dashicons-visibility"></span> View Story Page
                    </a>
                </div>
            </div>

            <?php if (isset($_GET['settings-updated']) || isset($_GET['saved'])): ?>
                <div class="notice notice-success is-dismissible" style="border-left-color: #10b981; padding: 12px 18px; margin: 15px 0;">
                    <p style="margin: 0; font-size: 14px; font-weight: 600; color: #065f46;">
                        <span class="dashicons dashicons-yes-alt" style="color: #10b981; vertical-align: text-top;"></span> 
                        Storefront changes saved successfully! Live pages are updated.
                    </p>
                </div>
            <?php endif; ?>

            <!-- Navigation Tabs Bar -->
            <nav class="nav-tab-wrapper" style="margin-bottom: 24px; border-bottom: 2px solid #cbd5e1; display: flex; gap: 6px;">
                <a href="<?php echo esc_url(admin_url('admin.php?page=nesports-pro-store&tab=pages')); ?>" 
                   class="nav-tab <?php echo $active_tab === 'pages' ? 'nav-tab-active' : ''; ?>"
                   style="<?php echo $active_tab === 'pages' ? 'background: #ffffff; border-color: #cbd5e1; border-bottom-color: #ffffff; color: #e11d48; font-weight: 700;' : 'background: #f1f5f9; color: #475569;'; ?> font-size: 14px; padding: 10px 18px; border-radius: 6px 6px 0 0; display: inline-flex; align-items: center; gap: 6px;">
                    <span class="dashicons dashicons-admin-page"></span> All Pages & Story Content
                </a>
                <a href="<?php echo esc_url(admin_url('admin.php?page=nesports-pro-store&tab=hero')); ?>" 
                   class="nav-tab <?php echo $active_tab === 'hero' ? 'nav-tab-active' : ''; ?>"
                   style="<?php echo $active_tab === 'hero' ? 'background: #ffffff; border-color: #cbd5e1; border-bottom-color: #ffffff; color: #e11d48; font-weight: 700;' : 'background: #f1f5f9; color: #475569;'; ?> font-size: 14px; padding: 10px 18px; border-radius: 6px 6px 0 0; display: inline-flex; align-items: center; gap: 6px;">
                    <span class="dashicons dashicons-format-image"></span> Home Hero & Banners
                </a>
                <a href="<?php echo esc_url(admin_url('admin.php?page=nesports-pro-store&tab=products')); ?>" 
                   class="nav-tab <?php echo $active_tab === 'products' ? 'nav-tab-active' : ''; ?>"
                   style="<?php echo $active_tab === 'products' ? 'background: #ffffff; border-color: #cbd5e1; border-bottom-color: #ffffff; color: #e11d48; font-weight: 700;' : 'background: #f1f5f9; color: #475569;'; ?> font-size: 14px; padding: 10px 18px; border-radius: 6px 6px 0 0; display: inline-flex; align-items: center; gap: 6px;">
                    <span class="dashicons dashicons-cart"></span> Products & Catalog
                </a>
                <a href="<?php echo esc_url(admin_url('admin.php?page=nesports-pro-store&tab=styling')); ?>" 
                   class="nav-tab <?php echo $active_tab === 'styling' ? 'nav-tab-active' : ''; ?>"
                   style="<?php echo $active_tab === 'styling' ? 'background: #ffffff; border-color: #cbd5e1; border-bottom-color: #ffffff; color: #e11d48; font-weight: 700;' : 'background: #f1f5f9; color: #475569;'; ?> font-size: 14px; padding: 10px 18px; border-radius: 6px 6px 0 0; display: inline-flex; align-items: center; gap: 6px;">
                    <span class="dashicons dashicons-art"></span> Colors & Section Controls
                </a>
            </nav>

            <!-- TAB 1: ALL PAGES & STORY CONTENT -->
            <?php if ($active_tab === 'pages'): ?>
            <div class="nesports-admin-grid">
                <!-- Left Column: Pages List -->
                <div class="nesports-card">
                    <?php
                    $all_wp_pages_count = function_exists('wp_count_posts') ? (wp_count_posts('page')->publish + wp_count_posts('page')->draft) : 15;
                    ?>
                    <div class="nesports-card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                        <div>
                            <h2><span class="dashicons dashicons-admin-page"></span> All Website Pages (<?php echo $all_wp_pages_count; ?> Available)</h2>
                        </div>
                        <div>
                            <span class="nesports-pill-live">Real-time Connected</span>
                        </div>
                    </div>
                    <div class="nesports-card-body" style="padding: 16px 20px;">
                        <!-- Quick Help Banner -->
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #e11d48; border-radius: 6px; padding: 10px 14px; margin-bottom: 12px; font-size: 12px; color: #334155; line-height: 1.5;">
                            <strong>Quick Guide: Where to edit each page?</strong>
                            <div style="display: flex; gap: 14px; flex-wrap: wrap; margin-top: 4px;">
                                <span>🏠 <strong>Home:</strong> <a href="?tab=hero" style="color: #0369a1; text-decoration: none; font-weight: 600;">Tab 2 (Hero & Banners) &rarr;</a></span>
                                <span>🛍️ <strong>Shop:</strong> <a href="?tab=products" style="color: #92400e; text-decoration: none; font-weight: 600;">Tab 3 (Products & Catalog) &rarr;</a></span>
                                <span>📖 <strong>Story:</strong> Click <strong style="color: #e11d48;">Edit Story</strong> button below</span>
                                <span>📞 <strong>Contact:</strong> Click <strong style="color: #047857;">Edit Contact</strong> button below</span>
                            </div>
                        </div>

                        <!-- Quick Search Filter -->
                        <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                            <span class="dashicons dashicons-search" style="color: #94a3b8;"></span>
                            <input type="text" id="nes-pages-search" onkeyup="nesFilterPagesTable()" placeholder="Quick filter pages by name or slug..." style="width: 100%; height: 36px; border-radius: 6px; padding: 0 12px; border: 1px solid #cbd5e1; font-size: 13.5px;" />
                        </div>
                        <div style="max-height: 580px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
                            <table class="nesports-table" style="margin: 0; width: 100%;">
                                <thead>
                                    <tr>
                                        <th>Page Name</th>
                                        <th>Slug</th>
                                        <th>Role</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php
                                    $all_wp_pages = function_exists('get_pages') ? get_pages(array(
                                        'post_status' => 'publish,draft,private',
                                        'sort_column' => 'post_date',
                                        'sort_order'  => 'DESC'
                                    )) : array();

                                    foreach ($all_wp_pages as $p):
                                        $pid = $p->ID;
                                        $is_front = ($pid === $front_page_id || $p->post_name === 'home');
                                        $is_story = ($pid === 30090 || $p->post_name === 'our-story');
                                        $is_contact = ($pid === 4439 || $p->post_name === 'contact-us');
                                        $is_shop = ($pid === 47 || $p->post_name === 'shop');
                                        $is_draft = ($p->post_status === 'draft');
                                        $title = !empty(trim($p->post_title)) ? $p->post_title : '(Untitled Page #' . $pid . ')';
                                    ?>
                                    <tr class="nes-page-item-row" data-name="<?php echo esc_attr(strtolower($title)); ?>" data-slug="<?php echo esc_attr(strtolower($p->post_name)); ?>">
                                        <td style="padding: 10px 12px; vertical-align: middle;">
                                            <strong style="color: #0f172a; font-size: 13px;"><?php echo esc_html($title); ?></strong>
                                            <?php if ($is_front): ?>
                                                <span style="margin-left: 4px; font-size: 10px; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 999px; font-weight: 700;">Home</span>
                                            <?php elseif ($is_story): ?>
                                                <span style="margin-left: 4px; font-size: 10px; background: #ecfdf5; color: #047857; padding: 2px 6px; border-radius: 999px; font-weight: 700;">Our Story</span>
                                            <?php elseif ($is_contact): ?>
                                                <span style="margin-left: 4px; font-size: 10px; background: #ecfdf5; color: #047857; padding: 2px 6px; border-radius: 999px; font-weight: 700;">Contact</span>
                                            <?php endif; ?>
                                        </td>
                                        <td style="padding: 10px 12px; vertical-align: middle;">
                                            <code style="font-size: 11.5px; background: #f1f5f9; padding: 2px 5px; border-radius: 4px;">/<?php echo esc_html($p->post_name); ?>/</code>
                                        </td>
                                        <td style="padding: 10px 12px; vertical-align: middle;">
                                            <?php if ($is_draft): ?>
                                                <span style="background: #f1f5f9; color: #64748b; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">Draft</span>
                                            <?php else: ?>
                                                <span style="display: inline-block; width: 6px; height: 6px; background: #10b981; border-radius: 50%; margin-right: 3px;"></span>
                                                <span style="color: #059669; font-weight: 600; font-size: 11.5px;">Live</span>
                                            <?php endif; ?>
                                        </td>
                                        <td style="padding: 10px 12px; vertical-align: middle; text-align: right; white-space: nowrap;">
                                            <a href="<?php echo esc_url(get_permalink($pid)); ?>" target="_blank" class="button button-small" style="font-size: 11px; height: 26px; line-height: 24px; padding: 0 6px;">View</a>
                                            <?php if ($is_front): ?>
                                                <a href="?tab=hero" class="button button-small" style="font-size: 11px; height: 26px; line-height: 24px; padding: 0 8px; background: #e0f2fe; color: #0369a1; border-color: #bae6fd; font-weight: 700;">Edit Home &rarr;</a>
                                            <?php elseif ($is_story): ?>
                                                <button type="button" onclick="nesSwitchPageEditor('story')" class="button button-small button-primary" style="font-size: 11px; height: 26px; line-height: 24px; padding: 0 8px; background: #e11d48; border-color: #be123c;">Edit Story</button>
                                            <?php elseif ($is_contact): ?>
                                                <button type="button" onclick="nesSwitchPageEditor('contact')" class="button button-small" style="font-size: 11px; height: 26px; line-height: 24px; padding: 0 8px; background: #ecfdf5; color: #047857; border-color: #a7f3d0; font-weight: 700;">Edit Contact</button>
                                            <?php elseif ($is_shop): ?>
                                                <a href="?tab=products" class="button button-small" style="font-size: 11px; height: 26px; line-height: 24px; padding: 0 8px; background: #fef3c7; color: #92400e; border-color: #fde68a; font-weight: 700;">Edit Shop &rarr;</a>
                                            <?php else: ?>
                                                <a href="<?php echo esc_url(admin_url('post.php?post=' . $pid . '&action=edit')); ?>" class="button button-small" style="font-size: 11px; height: 26px; line-height: 24px; padding: 0 6px;">Edit in WP</a>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Interactive Page Visual Editor (Story & Contact) -->
                <div class="nesports-card" id="editor-page-card">
                    <div class="nesports-card-header" style="background: #0f172a; color: #ffffff; border-radius: 8px 8px 0 0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding: 12px 20px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <button type="button" id="tab-btn-story" onclick="nesSwitchPageEditor('story')" class="button button-primary" style="background: #e11d48; border-color: #be123c; color: #ffffff; font-size: 12.5px; height: 32px; line-height: 30px; font-weight: 700;">
                                <span class="dashicons dashicons-format-aside" style="vertical-align: middle;"></span> Story & About Us
                            </button>
                            <button type="button" id="tab-btn-contact" onclick="nesSwitchPageEditor('contact')" class="button" style="background: #1e293b; color: #cbd5e1; border-color: #334155; font-size: 12.5px; height: 32px; line-height: 30px; font-weight: 600;">
                                <span class="dashicons dashicons-phone" style="vertical-align: middle;"></span> Contact Us Page
                            </button>
                        </div>
                        <span style="font-size: 12px; background: #1e293b; color: #94a3b8; padding: 4px 10px; border-radius: 4px; font-weight: 500;">Direct Page Editor</span>
                    </div>

                    <!-- PANEL 1: STORY PAGE EDITOR -->
                    <div id="editor-story-panel" class="nesports-card-body" style="padding: 20px;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">
                            <h3 style="margin: 0; font-size: 15px; color: #0f172a;"><span class="dashicons dashicons-book"></span> Editing Page: <em>The NE Sports Story & Mission (/our-story/)</em></h3>
                            <a href="/our-story" target="_blank" class="button button-small" style="font-size: 11px;">View Live Page &rarr;</a>
                        </div>
                        <form method="post" action="options.php">
                            <?php settings_fields('nesports_store_options_group'); ?>
                            <input type="hidden" name="tab" value="pages" />

                            <div class="nesports-form-group">
                                <label for="about_banner_title"><strong>Page Top Banner Title:</strong></label>
                                <input type="text" id="about_banner_title" name="nesports_store_settings[about_banner_title]" 
                                    value="<?php echo esc_attr(isset($settings['about_banner_title']) ? $settings['about_banner_title'] : 'About Us'); ?>" class="widefat" />
                            </div>

                            <div class="nesports-form-group">
                                <label for="about_story_title"><strong>Main Story Headline:</strong></label>
                                <input type="text" id="about_story_title" name="nesports_store_settings[about_story_title]" 
                                    value="<?php echo esc_attr(isset($settings['about_story_title']) ? $settings['about_story_title'] : 'NE Sports3 — Built for the Relentless'); ?>" class="widefat" />
                            </div>

                            <!-- Feature Image with Live Preview and 1-Click Upload -->
                            <div class="nesports-form-group" style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px;">
                                <label style="display: block; margin-bottom: 8px;"><strong>Story Feature Photo (Left Side Image):</strong></label>
                                <?php 
                                $current_about_img = isset($settings['about_feature_img']) && !empty($settings['about_feature_img']) ? $settings['about_feature_img'] : 'https://www.nesports3.com/wp-content/uploads/2026/09/WhatsApp-Image-2026-07-14-.jpeg';
                                ?>
                                <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 10px;">
                                    <div style="width: 140px; height: 95px; border-radius: 6px; overflow: hidden; background: #e2e8f0; border: 1px solid #cbd5e1; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                                        <img id="preview-about-img" src="<?php echo esc_url(nesports_img($current_about_img)); ?>" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;" />
                                    </div>
                                    <div style="flex: 1;">
                                        <input type="text" id="about_feature_img" name="nesports_store_settings[about_feature_img]" 
                                            value="<?php echo esc_attr($current_about_img); ?>" class="widefat" style="margin-bottom: 8px; font-size: 13px;" placeholder="Paste image URL or use button..." />
                                        <button type="button" class="button button-secondary nes-media-btn" data-target="#about_feature_img" data-preview="#preview-about-img">
                                            <span class="dashicons dashicons-upload" style="margin-top: 4px;"></span> Choose / Upload Photo
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- Quick Presets for 1-Click Demo -->
                                <div style="font-size: 12px; color: #64748b; margin-top: 6px;">
                                    <strong>Quick Presets:</strong>
                                    <button type="button" class="button button-small nes-preset-btn" data-target="#about_feature_img" data-preview="#preview-about-img" data-url="https://www.nesports3.com/wp-content/uploads/2025/08/logo.png" style="font-size: 11px; margin-left: 4px;">NESports Logo</button>
                                    <button type="button" class="button button-small nes-preset-btn" data-target="#about_feature_img" data-preview="#preview-about-img" data-url="https://www.nesports3.com/wp-content/uploads/2026/09/WhatsApp-Image-2026-07-14-.jpeg" style="font-size: 11px; margin-left: 2px;">Wrist Wraps</button>
                                    <button type="button" class="button button-small nes-preset-btn" data-target="#about_feature_img" data-preview="#preview-about-img" data-url="/nesports-pro-store/assets/images/WhatsApp-Image-2024-07-08-at-19.17.50_f9c47d7b-800x530.jpg" style="font-size: 11px; margin-left: 2px;">Athlete Model</button>
                                </div>
                            </div>

                            <div class="nesports-form-group">
                                <label for="about_story_text"><strong>Story Text Content:</strong></label>
                                <textarea id="about_story_text" name="nesports_store_settings[about_story_text]" rows="5" class="widefat" style="font-size: 13px; line-height: 1.6;"><?php echo esc_textarea(isset($settings['about_story_text']) ? $settings['about_story_text'] : "At NE Sports3, we believe sports and fitness are more than just activities – they are a lifestyle. Our mission is to empower athletes, fitness enthusiasts, and everyday champions with the highest-quality sports and gym products that inspire performance, strength, and confidence.\n\nFrom durable gym equipment and training accessories to premium sports gear, we carefully select every product to ensure it meets the needs of both beginners and professionals."); ?></textarea>
                            </div>

                            <div class="nesports-form-group">
                                <label for="about_motto"><strong>Bottom Motto Line:</strong></label>
                                <input type="text" id="about_motto" name="nesports_store_settings[about_motto]" 
                                    value="<?php echo esc_attr(isset($settings['about_motto']) ? $settings['about_motto'] : 'Train harder. Play stronger. Live better – with NE Sports3.'); ?>" class="widefat" />
                            </div>

                            <div style="margin-top: 20px;">
                                <?php submit_button('Save Story Page Changes', 'primary', 'submit', false); ?>
                            </div>
                        </form>
                    </div>

                    <!-- PANEL 2: CONTACT US PAGE EDITOR -->
                    <div id="editor-contact-panel" class="nesports-card-body" style="padding: 20px; display: none;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">
                            <h3 style="margin: 0; font-size: 15px; color: #0f172a;"><span class="dashicons dashicons-phone"></span> Editing Page: <em>Contact Us (/contact-us/)</em></h3>
                            <a href="/contact-us" target="_blank" class="button button-small" style="font-size: 11px;">View Live Page &rarr;</a>
                        </div>
                        <form method="post" action="options.php">
                            <?php settings_fields('nesports_store_options_group'); ?>
                            <input type="hidden" name="tab" value="pages" />

                            <div class="nesports-form-group">
                                <label for="contact_eyebrow"><strong>Top Eyebrow Badge:</strong></label>
                                <input type="text" id="contact_eyebrow" name="nesports_store_settings[contact_eyebrow]" 
                                    value="<?php echo esc_attr(isset($settings['contact_eyebrow']) ? $settings['contact_eyebrow'] : 'INFORMATION ABOUT US'); ?>" class="widefat" />
                            </div>

                            <div class="nesports-form-group">
                                <label for="contact_heading"><strong>Main Page Heading:</strong></label>
                                <input type="text" id="contact_heading" name="nesports_store_settings[contact_heading]" 
                                    value="<?php echo esc_attr(isset($settings['contact_heading']) ? $settings['contact_heading'] : 'CONTACT US FOR ANY QUESTIONS'); ?>" class="widefat" />
                            </div>

                            <div class="nesports-form-group">
                                <label for="contact_desc"><strong>Intro Subheading / Note:</strong></label>
                                <input type="text" id="contact_desc" name="nesports_store_settings[contact_desc]" 
                                    value="<?php echo esc_attr(isset($settings['contact_desc']) ? $settings['contact_desc'] : 'We are here to assist with any questions regarding our products, orders, or custom fitness gear.'); ?>" class="widefat" />
                            </div>

                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
                                <h4 style="margin: 0 0 12px; font-size: 13.5px; color: #0f172a;"><span class="dashicons dashicons-admin-site"></span> Direct Support Channels:</h4>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                                    <div class="nesports-form-group">
                                        <label for="support_phone"><strong>Phone / WhatsApp:</strong></label>
                                        <input type="text" id="support_phone" name="nesports_store_settings[support_phone]" 
                                            value="<?php echo esc_attr(isset($settings['support_phone']) ? $settings['support_phone'] : '+1 (800) 555-0199'); ?>" class="widefat" />
                                    </div>
                                    <div class="nesports-form-group">
                                        <label for="support_email"><strong>Support Email:</strong></label>
                                        <input type="email" id="support_email" name="nesports_store_settings[support_email]" 
                                            value="<?php echo esc_attr(isset($settings['support_email']) ? $settings['support_email'] : 'support@nesports3.com'); ?>" class="widefat" />
                                    </div>
                                </div>
                                <div class="nesports-form-group" style="margin-top: 10px;">
                                    <label for="contact_address"><strong>Office / Warehouse Address:</strong></label>
                                    <input type="text" id="contact_address" name="nesports_store_settings[contact_address]" 
                                        value="<?php echo esc_attr(isset($settings['contact_address']) ? $settings['contact_address'] : 'Berlin, Germany / European Distribution'); ?>" class="widefat" />
                                </div>
                            </div>

                            <div class="nesports-form-group">
                                <label for="contact_btn_text"><strong>Contact Form Submit Button Text:</strong></label>
                                <input type="text" id="contact_btn_text" name="nesports_store_settings[contact_btn_text]" 
                                    value="<?php echo esc_attr(isset($settings['contact_btn_text']) ? $settings['contact_btn_text'] : 'ASK A QUESTION'); ?>" class="widefat" />
                            </div>

                            <div style="margin-top: 20px;">
                                <?php submit_button('Save Contact Page Changes', 'primary', 'submit', false); ?>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <?php endif; ?>

            <!-- TAB 2: HOME HERO & BANNERS -->
            <?php if ($active_tab === 'hero'): ?>
            <div class="nesports-card">
                <div class="nesports-card-header" style="background: #0f172a; color: #ffffff; border-radius: 8px 8px 0 0;">
                    <h2 style="color: #ffffff;"><span class="dashicons dashicons-format-image" style="color: #e11d48;"></span> Homepage Hero Banner & Ticker Controls</h2>
                </div>
                <div class="nesports-card-body" style="padding: 24px;">
                    <form method="post" action="options.php">
                        <?php settings_fields('nesports_store_options_group'); ?>
                        <input type="hidden" name="tab" value="hero" />

                        <!-- Top Announcement Bar -->
                        <h3 style="margin-top: 0; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; font-size: 15px; color: #0f172a;">
                            <span class="dashicons dashicons-megaphone"></span> 1. Top Announcement Bar (Header Ticker)
                        </h3>
                        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                            <div class="nesports-form-group">
                                <label for="announcement_text"><strong>Announcement Text:</strong></label>
                                <input type="text" id="announcement_text" name="nesports_store_settings[announcement_text]" 
                                    value="<?php echo esc_attr(isset($settings['announcement_text']) ? $settings['announcement_text'] : 'Free shipping on All DE orders over 150€'); ?>" class="widefat" />
                            </div>
                            <div class="nesports-form-group">
                                <label for="announcement_bg"><strong>Ticker Background:</strong></label>
                                <input type="color" id="announcement_bg" name="nesports_store_settings[announcement_bg]" 
                                    value="<?php echo esc_attr(isset($settings['announcement_bg']) ? $settings['announcement_bg'] : '#000000'); ?>" />
                            </div>
                            <div class="nesports-form-group">
                                <label for="announcement_color"><strong>Ticker Text Color:</strong></label>
                                <input type="color" id="announcement_color" name="nesports_store_settings[announcement_color]" 
                                    value="<?php echo esc_attr(isset($settings['announcement_color']) ? $settings['announcement_color'] : '#ffffff'); ?>" />
                            </div>
                        </div>

                        <!-- Hero Main Banner -->
                        <h3 style="padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; font-size: 15px; color: #0f172a;">
                            <span class="dashicons dashicons-star-filled"></span> 2. Main Hero Slide (First Slide)
                        </h3>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div class="nesports-form-group">
                                <label><strong>Hero Top Badge:</strong></label>
                                <input type="text" name="nesports_store_settings[hero_badge]" 
                                    value="<?php echo esc_attr(isset($settings['hero_badge']) ? $settings['hero_badge'] : 'ENGINEERED FOR THE RELENTLESS'); ?>" class="widefat" />
                            </div>
                            <div class="nesports-form-group">
                                <label><strong>Main Hero Headline:</strong></label>
                                <input type="text" name="nesports_store_settings[hero_title]" 
                                    value="<?php echo esc_attr(isset($settings['hero_title']) ? $settings['hero_title'] : 'BUILT TO OUTLAST YOUR HARDEST SETS'); ?>" class="widefat" />
                            </div>
                        </div>

                        <div class="nesports-form-group">
                            <label><strong>Hero Subtitle / Description:</strong></label>
                            <textarea name="nesports_store_settings[hero_subtitle]" rows="2" class="widefat"><?php echo esc_textarea(isset($settings['hero_subtitle']) ? $settings['hero_subtitle'] : 'Competition-grade lever belts, reinforced padded straps, and elite lifting accessories engineered for maximum PRs.'); ?></textarea>
                        </div>

                        <!-- Hero Background Image Upload -->
                        <div class="nesports-form-group" style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px; margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px;"><strong>Hero Background Photo:</strong></label>
                            <?php 
                            $current_hero_img = isset($settings['hero_bg_image']) && !empty($settings['hero_bg_image']) ? $settings['hero_bg_image'] : 'hero-slide-knee-wraps.jpg';
                            ?>
                            <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 10px;">
                                <div style="width: 140px; height: 95px; border-radius: 6px; overflow: hidden; background: #e2e8f0; border: 1px solid #cbd5e1; flex-shrink: 0;">
                                    <img id="preview-hero-img" src="<?php echo esc_url(nesports_img($current_hero_img)); ?>" alt="Hero Preview" style="width: 100%; height: 100%; object-fit: cover;" />
                                </div>
                                <div style="flex: 1;">
                                    <input type="text" id="hero_bg_image" name="nesports_store_settings[hero_bg_image]" 
                                        value="<?php echo esc_attr($current_hero_img); ?>" class="widefat" style="margin-bottom: 8px; font-size: 13px;" />
                                    <button type="button" class="button button-secondary nes-media-btn" data-target="#hero_bg_image" data-preview="#preview-hero-img">
                                        <span class="dashicons dashicons-upload" style="margin-top: 4px;"></span> Choose / Upload Hero Photo
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- CTA Buttons -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div style="background: #fdf2f8; padding: 12px; border-radius: 6px; border: 1px solid #fbcfe8;">
                                <label><strong>Primary Button Text:</strong></label>
                                <input type="text" name="nesports_store_settings[hero_primary_cta]" 
                                    value="<?php echo esc_attr(isset($settings['hero_primary_cta']) ? $settings['hero_primary_cta'] : 'SHOP LEVER BELTS'); ?>" class="widefat" style="margin-bottom: 8px;" />
                                <label><strong>Primary Button Link:</strong></label>
                                <input type="text" name="nesports_store_settings[hero_primary_url]" 
                                    value="<?php echo esc_attr(isset($settings['hero_primary_url']) ? $settings['hero_primary_url'] : '/product-category/weightlifting-belts/'); ?>" class="widefat" />
                            </div>

                            <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
                                <label><strong>Secondary Button Text:</strong></label>
                                <input type="text" name="nesports_store_settings[hero_secondary_cta]" 
                                    value="<?php echo esc_attr(isset($settings['hero_secondary_cta']) ? $settings['hero_secondary_cta'] : 'EXPLORE ALL GEAR'); ?>" class="widefat" style="margin-bottom: 8px;" />
                                <label><strong>Secondary Button Link:</strong></label>
                                <input type="text" name="nesports_store_settings[hero_secondary_url]" 
                                    value="<?php echo esc_attr(isset($settings['hero_secondary_url']) ? $settings['hero_secondary_url'] : '/shop/'); ?>" class="widefat" />
                            </div>
                        </div>

                        <div>
                            <?php submit_button('Save Hero & Banner Settings', 'primary', 'submit', false); ?>
                        </div>
                    </form>
                </div>
            </div>
            <?php endif; ?>

            <!-- TAB 3: PRODUCTS & CATALOG -->
            <?php if ($active_tab === 'products'): ?>
            <div class="nesports-card">
                <div class="nesports-card-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <h2><span class="dashicons dashicons-cart"></span> Store Products & Quick Prices</h2>
                    <a href="<?php echo esc_url(admin_url('admin.php?page=nesports-store-products')); ?>" class="button button-primary" style="background: #e11d48; border-color: #be123c;">
                        Full Product Manager &rarr;
                    </a>
                </div>
                <div class="nesports-card-body" style="padding: 20px;">
                    <p style="color: #64748b; font-size: 14px; margin-top: 0;">
                        Manage all products, change prices, update images, and edit descriptions directly.
                    </p>
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center;">
                        <span class="dashicons dashicons-products" style="font-size: 48px; width: 48px; height: 48px; color: #e11d48; margin-bottom: 12px;"></span>
                        <h3 style="margin: 0 0 8px;">Store Products & Inventory Engine</h3>
                        <p style="color: #64748b; max-width: 500px; margin: 0 auto 16px;">Add new lifting gear, edit live prices, set sales discounts, and manage photos in 1 click.</p>
                        <a href="<?php echo esc_url(admin_url('admin.php?page=nesports-store-products')); ?>" class="button button-primary button-hero" style="background: #e11d48; border-color: #be123c;">
                            <span class="dashicons dashicons-cart"></span> Open Product & Price Editor
                        </a>
                    </div>
                </div>
            </div>
            <?php endif; ?>

            <!-- TAB 4: COLORS & SECTION CONTROLS -->
            <?php if ($active_tab === 'styling'): ?>
            <div class="nesports-admin-grid">
                <!-- Left: Brand Colors -->
                <div class="nesports-card">
                    <div class="nesports-card-header">
                        <h2><span class="dashicons dashicons-art"></span> Brand Styling & Accent Colors</h2>
                    </div>
                    <div class="nesports-card-body" style="padding: 20px;">
                        <form method="post" action="options.php">
                            <?php settings_fields('nesports_store_options_group'); ?>
                            <input type="hidden" name="tab" value="styling" />

                            <div class="nesports-form-group">
                                <label for="accent_color"><strong>Main Brand Accent Color:</strong></label>
                                <div style="display: flex; align-items: center; gap: 10px; margin-top: 6px;">
                                    <input type="color" id="accent_color" name="nesports_store_settings[accent_color]" 
                                        value="<?php echo esc_attr(isset($settings['accent_color']) ? $settings['accent_color'] : '#e11d48'); ?>" />
                                    <code><?php echo esc_html(isset($settings['accent_color']) ? $settings['accent_color'] : '#e11d48'); ?></code>
                                </div>
                                <p class="description">Used on buttons, badges, hover links, and highlights.</p>
                            </div>

                            <div class="nesports-form-group">
                                <label for="btn_bg_color"><strong>Primary Buttons Background:</strong></label>
                                <div style="display: flex; align-items: center; gap: 10px; margin-top: 6px;">
                                    <input type="color" id="btn_bg_color" name="nesports_store_settings[btn_bg_color]" 
                                        value="<?php echo esc_attr(isset($settings['btn_bg_color']) ? $settings['btn_bg_color'] : '#e11d48'); ?>" />
                                    <code><?php echo esc_html(isset($settings['btn_bg_color']) ? $settings['btn_bg_color'] : '#e11d48'); ?></code>
                                </div>
                            </div>

                            <div style="margin-top: 24px;">
                                <?php submit_button('Save Color Settings', 'primary', 'submit', false); ?>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Right: Homepage Section Toggles -->
                <div class="nesports-card">
                    <div class="nesports-card-header">
                        <h2><span class="dashicons dashicons-visibility"></span> Homepage Sections On/Off Switches</h2>
                    </div>
                    <div class="nesports-card-body" style="padding: 20px;">
                        <form method="post" action="options.php">
                            <?php settings_fields('nesports_store_options_group'); ?>
                            <input type="hidden" name="tab" value="styling" />

                            <p style="color: #64748b; font-size: 13px; margin-top: 0;">Check or uncheck to instantly show or hide sections on the homepage:</p>

                            <?php 
                            $sections = array(
                                'show_announcement' => 'Top Announcement Ticker Bar',
                                'show_hero'         => 'Hero Carousel & Action Banner',
                                'show_trustbar'     => 'Trust Badges (Shipping, Guarantee, 30-Day Returns)',
                                'show_categories'   => 'Popular Categories Grid (Belts, Wraps, Straps, Bags)',
                                'show_products'     => 'Top Sellers & Featured Products Grid',
                                'show_collections'  => 'Collections Carousel',
                                'show_bundles'      => 'Bundles & Value Sets Section',
                                'show_clothing'     => 'Performance Apparel & Clothing Grid',
                                'show_story'        => 'Our Story & Brand Mission Section',
                                'show_footer'       => 'Footer Brand Links & Payment Badges',
                            );
                            foreach ($sections as $s_key => $s_label):
                                $is_on = nesports_section_enabled($s_key, true);
                            ?>
                            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
                                <label for="<?php echo esc_attr($s_key); ?>" style="font-size: 13.5px; font-weight: 500; color: #1e293b; cursor: pointer;">
                                    <?php echo esc_html($s_label); ?>
                                </label>
                                <input type="hidden" name="nesports_store_settings[<?php echo esc_attr($s_key); ?>]" value="0" />
                                <input type="checkbox" id="<?php echo esc_attr($s_key); ?>" name="nesports_store_settings[<?php echo esc_attr($s_key); ?>]" value="1" <?php checked($is_on, true); ?> style="width: 18px; height: 18px; accent-color: #e11d48;" />
                            </div>
                            <?php endforeach; ?>

                            <div style="margin-top: 20px;">
                                <?php submit_button('Save Section Visibility', 'primary', 'submit', false); ?>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <?php endif; ?>

            <!-- Client Hub JavaScript Helper -->
            <script>
            function nesFilterPagesTable() {
                var search = (document.getElementById('nes-pages-search').value || '').toLowerCase();
                var rows = document.querySelectorAll('.nes-page-item-row');
                rows.forEach(function(r) {
                    var name = (r.getAttribute('data-name') || '').toLowerCase();
                    var slug = (r.getAttribute('data-slug') || '').toLowerCase();
                    if (!search || name.indexOf(search) !== -1 || slug.indexOf(search) !== -1) {
                        r.style.display = '';
                    } else {
                        r.style.display = 'none';
                    }
                });
            }

            function nesSwitchPageEditor(panel) {
                var storyPanel = document.getElementById('editor-story-panel');
                var contactPanel = document.getElementById('editor-contact-panel');
                var storyBtn = document.getElementById('tab-btn-story');
                var contactBtn = document.getElementById('tab-btn-contact');
                
                if (panel === 'contact') {
                    if (storyPanel) storyPanel.style.display = 'none';
                    if (contactPanel) contactPanel.style.display = 'block';
                    if (storyBtn) { storyBtn.style.background = '#1e293b'; storyBtn.style.color = '#cbd5e1'; storyBtn.style.borderColor = '#334155'; }
                    if (contactBtn) { contactBtn.style.background = '#e11d48'; contactBtn.style.color = '#ffffff'; contactBtn.style.borderColor = '#be123c'; }
                } else {
                    if (storyPanel) storyPanel.style.display = 'block';
                    if (contactPanel) contactPanel.style.display = 'none';
                    if (storyBtn) { storyBtn.style.background = '#e11d48'; storyBtn.style.color = '#ffffff'; storyBtn.style.borderColor = '#be123c'; }
                    if (contactBtn) { contactBtn.style.background = '#1e293b'; contactBtn.style.color = '#cbd5e1'; contactBtn.style.borderColor = '#334155'; }
                }
                
                var card = document.getElementById('editor-page-card');
                if (card) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }

            document.addEventListener('DOMContentLoaded', function() {
                // Preset buttons click handler
                document.querySelectorAll('.nes-preset-btn').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        var targetId = this.getAttribute('data-target');
                        var previewId = this.getAttribute('data-preview');
                        var url = this.getAttribute('data-url');
                        var input = document.querySelector(targetId);
                        var img = document.querySelector(previewId);
                        if (input) input.value = url;
                        if (img) img.src = url;
                    });
                });

                // Media uploader button click handler
                document.querySelectorAll('.nes-media-btn').forEach(function(btn) {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        var targetId = this.getAttribute('data-target');
                        var previewId = this.getAttribute('data-preview');
                        var input = document.querySelector(targetId);
                        var img = document.querySelector(previewId);

                        if (typeof wp !== 'undefined' && wp.media) {
                            var customUploader = wp.media({
                                title: 'Select or Upload Photo',
                                button: { text: 'Use this photo' },
                                multiple: false
                            });
                            customUploader.on('select', function() {
                                var attachment = customUploader.state().get('selection').first().toJSON();
                                if (input) input.value = attachment.url;
                                if (img) img.src = attachment.url;
                            });
                            customUploader.open();
                        } else {
                            var currentVal = input ? input.value : '';
                            var newUrl = prompt('Enter or paste image URL / filename:', currentVal);
                            if (newUrl && input) {
                                input.value = newUrl;
                                if (img) img.src = newUrl;
                            }
                        }
                    });
                });

                // Live preview on typing input
                ['#about_feature_img', '#hero_bg_image'].forEach(function(id) {
                    var inp = document.querySelector(id);
                    if (inp) {
                        inp.addEventListener('input', function() {
                            var prevId = id === '#about_feature_img' ? '#preview-about-img' : '#preview-hero-img';
                            var img = document.querySelector(prevId);
                            if (img) img.src = this.value;
                        });
                    }
                });
            });
            </script>
        </div>
        <?php
    }

    /**
     * Render Hero & Banners sub-settings (redirects cleanly to Tab 2)
     */
    public function render_hero_settings() {
        $_GET['tab'] = 'hero';
        $this->render_admin_dashboard();
    }
}
