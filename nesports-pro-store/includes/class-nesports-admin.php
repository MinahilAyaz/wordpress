<?php
if (!defined('ABSPATH')) {
    exit;
}

class NESports_Admin {

    public function init() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_init', array($this, 'handle_product_actions'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_action('wp_ajax_nesports_regenerate_pages', array($this, 'ajax_regenerate_pages'));
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
        foreach ($input as $key => $val) {
            $clean[$key] = sanitize_text_field($val);
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
            $price    = floatval($_POST['product_price'] ?? 0);
            $old      = floatval($_POST['product_old_price'] ?? $price);
            $main_img = sanitize_text_field($_POST['product_main_img'] ?? '');
            $hover_img= sanitize_text_field($_POST['product_hover_img'] ?? '');

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
                'main'    => $main_img,
                'hover'   => $hover_img
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
            $price    = floatval($_POST['product_price'] ?? 0);
            $old      = floatval($_POST['product_old_price'] ?? $price);
            $main_img = sanitize_text_field($_POST['product_main_img'] ?? '');
            $hover_img= sanitize_text_field($_POST['product_hover_img'] ?? '');

            foreach ($catalog as &$item) {
                if (isset($item['slug']) && $item['slug'] === $slug) {
                    if (!empty($name)) $item['name'] = $name;
                    $item['cat']   = $cat;
                    $item['price'] = $price;
                    $item['old']   = ($old >= $price) ? $old : $price;
                    if (!empty($main_img)) $item['main'] = $main_img;
                    if (!empty($hover_img)) $item['hover'] = $hover_img;
                    break;
                }
            }
            unset($item);

            update_option('nesports_managed_catalog', $catalog);
            wp_redirect(admin_url('admin.php?page=nesports-store-products&msg=updated'));
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
                                        <code style="font-size: 11.5px; color: #64748b; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">/product/<?php echo esc_html($slug); ?>/</code>
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
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Category *</label>
                        <select name="product_cat" required class="widefat" style="height: 40px; border-radius: 6px;">
                            <?php foreach ($categories as $cat_k => $cat_name): ?>
                                <option value="<?php echo esc_attr($cat_k); ?>"><?php echo esc_html($cat_name); ?></option>
                            <?php endforeach; ?>
                        </select>
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

                    <div style="margin-bottom: 22px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Hover / Secondary Image (Optional)</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="add-product-hover-img" name="product_hover_img" placeholder="Optional 2nd angle image" class="widefat" style="height: 40px; border-radius: 6px;" />
                            <button type="button" class="button" onclick="nesportsSelectMedia('add-product-hover-img')" style="height: 40px; white-space: nowrap;">
                                Upload / Media
                            </button>
                        </div>
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
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Category</label>
                        <select id="edit-product-cat" name="product_cat" required class="widefat" style="height: 40px; border-radius: 6px;">
                            <?php foreach ($categories as $cat_k => $cat_name): ?>
                                <option value="<?php echo esc_attr($cat_k); ?>"><?php echo esc_html($cat_name); ?></option>
                            <?php endforeach; ?>
                        </select>
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

                    <div style="margin-bottom: 22px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: #334155;">Hover Image (Optional)</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="edit-product-hover-img" name="product_hover_img" class="widefat" style="height: 40px; border-radius: 6px;" />
                            <button type="button" class="button" onclick="nesportsSelectMedia('edit-product-hover-img')" style="height: 40px; white-space: nowrap;">
                                Upload / Media
                            </button>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #e2e8f0; padding-top: 18px;">
                        <button type="button" onclick="document.getElementById('nesports-edit-modal').style.display='none';" class="button button-secondary" style="height: 40px; padding: 0 16px;">Cancel</button>
                        <button type="submit" class="button button-primary" style="height: 40px; padding: 0 24px; background: #0f172a; border-color: #0f172a; font-weight: 600;">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>

        <script>
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

        function nesportsOpenEditModal(prod) {
            document.getElementById('edit-product-slug').value = prod.slug || '';
            document.getElementById('edit-product-name').value = prod.name || '';
            document.getElementById('edit-product-cat').value = prod.cat || 'belts';
            document.getElementById('edit-product-price').value = prod.price || '';
            document.getElementById('edit-product-old-price').value = prod.old || prod.price || '';
            document.getElementById('edit-product-main-img').value = prod.main || '';
            document.getElementById('edit-product-hover-img').value = prod.hover || '';
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

    /**
     * Render main dashboard
     */
    public function render_admin_dashboard() {
        $settings = get_option('nesports_store_settings', array());
        $pages = get_option('nesports_generated_pages', array());
        $front_page_id = (int) get_option('page_on_front');
        ?>
        <div class="wrap nesports-admin-wrap">
            <div class="nesports-admin-header">
                <div class="nesports-brand">
                    <span class="nesports-badge">PRO EDITION</span>
                    <h1>NE SPORTS <span>STORE ENGINE</span></h1>
                    <p>Hardbody-inspired athletic branding, automated page layouts & performance storefront controls.</p>
                </div>
                <div class="nesports-quick-actions">
                    <a href="<?php echo esc_url(admin_url('admin.php?page=nesports-store-products')); ?>" class="button button-primary button-hero" style="background: #e11d48; border-color: #be123c;">
                        <span class="dashicons dashicons-cart"></span> Manage Store Products & Prices
                    </a>
                    <button type="button" id="btn-regenerate-pages" class="button button-secondary button-hero">
                        <span class="dashicons dashicons-update"></span> Regenerate All Pages
                    </button>
                    <a href="<?php echo esc_url(home_url('/')); ?>" target="_blank" class="button button-secondary button-hero">
                        <span class="dashicons dashicons-external"></span> View Live Store
                    </a>
                </div>
            </div>

            <div id="nesports-ajax-notice" style="display:none;" class="notice notice-success is-dismissible">
                <p id="nesports-ajax-message"></p>
            </div>

            <!-- Dashboard Content Tabs -->
            <div class="nesports-admin-grid">
                <!-- Left Column: Pages Status -->
                <div class="nesports-card">
                    <div class="nesports-card-header">
                        <h2><span class="dashicons dashicons-admin-page"></span> Deployed Pages Status</h2>
                        <span class="nesports-pill-live">3 Pages Connected</span>
                    </div>
                    <div class="nesports-card-body">
                        <table class="nesports-table">
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
                                $page_list = array(
                                    'home' => array('name' => 'Flagship Home Page', 'slug' => 'home'),
                                    'our-story' => array('name' => 'The NE Sports Story', 'slug' => 'our-story'),
                                    'contact' => array('name' => 'Contact & Help Center', 'slug' => 'contact-us')
                                );

                                foreach ($page_list as $key => $pinfo):
                                    $pid = isset($pages[$key]) ? $pages[$key] : 0;
                                    $page_exists = $pid && get_post($pid) && get_post_status($pid) !== 'trash';
                                    $is_front = ($pid && $pid === $front_page_id);
                                ?>
                                <tr>
                                    <td>
                                        <strong><?php echo esc_html($pinfo['name']); ?></strong>
                                        <?php if ($is_front): ?>
                                            <span class="nesports-badge-front">Front Page</span>
                                        <?php endif; ?>
                                    </td>
                                    <td><code>/<?php echo esc_html($pinfo['slug']); ?>/</code></td>
                                    <td>
                                        <?php if ($page_exists): ?>
                                            <span class="status-dot status-active"></span> Published
                                        <?php else: ?>
                                            <span class="status-dot status-missing"></span> Not Deployed
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php if ($page_exists): ?>
                                            <a href="<?php echo esc_url(get_permalink($pid)); ?>" target="_blank" class="button button-small">View</a>
                                            <a href="<?php echo esc_url(admin_url('post.php?post=' . $pid . '&action=edit')); ?>" class="button button-small">Edit in WP</a>
                                        <?php else: ?>
                                            <button type="button" class="button button-small btn-single-gen" data-page="<?php echo esc_attr($key); ?>">Create</button>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Right Column: Quick Settings -->
                <div class="nesports-card">
                    <div class="nesports-card-header">
                        <h2><span class="dashicons dashicons-admin-generic"></span> Quick Storefront Controls</h2>
                    </div>
                    <div class="nesports-card-body">
                        <form method="post" action="options.php">
                            <?php
                            settings_fields('nesports_store_options_group');
                            ?>
                            <div class="nesports-form-group">
                                <label for="announcement_text"><strong>Top Announcement Ticker:</strong></label>
                                <input type="text" id="announcement_text" name="nesports_store_settings[announcement_text]" 
                                    value="<?php echo esc_attr(isset($settings['announcement_text']) ? $settings['announcement_text'] : 'Free shipping on All DE orders over 150€'); ?>" 
                                    class="widefat" />
                                <p class="description">Displays across the top bar.</p>
                            </div>

                            <div class="nesports-form-group">
                                <label for="support_phone"><strong>Support Phone / WhatsApp:</strong></label>
                                <input type="text" id="support_phone" name="nesports_store_settings[support_phone]" 
                                    value="<?php echo esc_attr(isset($settings['support_phone']) ? $settings['support_phone'] : '+1 (800) 555-0199'); ?>" 
                                    class="widefat" />
                            </div>

                            <div class="nesports-form-group">
                                <label for="support_email"><strong>Support Email:</strong></label>
                                <input type="email" id="support_email" name="nesports_store_settings[support_email]" 
                                    value="<?php echo esc_attr(isset($settings['support_email']) ? $settings['support_email'] : 'support@nesports3.com'); ?>" 
                                    class="widefat" />
                            </div>

                            <div class="nesports-form-group">
                                <label for="accent_color"><strong>Brand Accent Color:</strong></label>
                                <input type="color" id="accent_color" name="nesports_store_settings[accent_color]" 
                                    value="<?php echo esc_attr(isset($settings['accent_color']) ? $settings['accent_color'] : '#e11d48'); ?>" />
                            </div>

                            <?php submit_button('Save Storefront Settings', 'primary', 'submit', false); ?>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }

    /**
     * Render Hero & Banners sub-settings
     */
    public function render_hero_settings() {
        $settings = get_option('nesports_store_settings', array());
        ?>
        <div class="wrap nesports-admin-wrap">
            <div class="nesports-admin-header">
                <div class="nesports-brand">
                    <span class="nesports-badge">HERO CUSTOMIZER</span>
                    <h1>HOMEPAGE HERO & <span>BANNER SETTINGS</span></h1>
                </div>
            </div>

            <div class="nesports-card">
                <div class="nesports-card-body">
                    <form method="post" action="options.php">
                        <?php settings_fields('nesports_store_options_group'); ?>
                        
                        <div class="nesports-form-group">
                            <label><strong>Hero Top Badge:</strong></label>
                            <input type="text" name="nesports_store_settings[hero_badge]" 
                                value="<?php echo esc_attr(isset($settings['hero_badge']) ? $settings['hero_badge'] : 'ENGINEERED FOR THE RELENTLESS'); ?>" class="widefat" />
                        </div>

                        <div class="nesports-form-group">
                            <label><strong>Main Hero Title (Headline):</strong></label>
                            <input type="text" name="nesports_store_settings[hero_title]" 
                                value="<?php echo esc_attr(isset($settings['hero_title']) ? $settings['hero_title'] : 'BUILT TO OUTLAST YOUR HARDEST SETS'); ?>" class="widefat" />
                        </div>

                        <div class="nesports-form-group">
                            <label><strong>Hero Subtitle / Description:</strong></label>
                            <textarea name="nesports_store_settings[hero_subtitle]" rows="3" class="widefat"><?php echo esc_textarea(isset($settings['hero_subtitle']) ? $settings['hero_subtitle'] : 'Competition-grade lever belts, reinforced padded straps, and elite lifting accessories engineered for maximum PRs.'); ?></textarea>
                        </div>

                        <div style="display: flex; gap: 20px;">
                            <div class="nesports-form-group" style="flex: 1;">
                                <label><strong>Primary CTA Button Text:</strong></label>
                                <input type="text" name="nesports_store_settings[hero_primary_cta]" 
                                    value="<?php echo esc_attr(isset($settings['hero_primary_cta']) ? $settings['hero_primary_cta'] : 'SHOP LEVER BELTS'); ?>" class="widefat" />
                            </div>
                            <div class="nesports-form-group" style="flex: 1;">
                                <label><strong>Primary CTA Link:</strong></label>
                                <input type="text" name="nesports_store_settings[hero_primary_url]" 
                                    value="<?php echo esc_attr(isset($settings['hero_primary_url']) ? $settings['hero_primary_url'] : '/product-category/weightlifting-belts/'); ?>" class="widefat" />
                            </div>
                        </div>

                        <div style="display: flex; gap: 20px;">
                            <div class="nesports-form-group" style="flex: 1;">
                                <label><strong>Secondary CTA Button Text:</strong></label>
                                <input type="text" name="nesports_store_settings[hero_secondary_cta]" 
                                    value="<?php echo esc_attr(isset($settings['hero_secondary_cta']) ? $settings['hero_secondary_cta'] : 'EXPLORE ALL GEAR'); ?>" class="widefat" />
                            </div>
                            <div class="nesports-form-group" style="flex: 1;">
                                <label><strong>Secondary CTA Link:</strong></label>
                                <input type="text" name="nesports_store_settings[hero_secondary_url]" 
                                    value="<?php echo esc_attr(isset($settings['hero_secondary_url']) ? $settings['hero_secondary_url'] : '/shop/'); ?>" class="widefat" />
                            </div>
                        </div>

                        <?php submit_button('Update Hero Section', 'primary'); ?>
                    </form>
                </div>
            </div>
        </div>
        <?php
    }
}
