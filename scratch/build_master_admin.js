const fs = require('fs');
const path = require('path');

const adminClassFile = path.join(__dirname, '..', 'nesports-pro-store', 'includes', 'class-nesports-admin.php');

const phpCode = `<?php
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
        // 1. NE Sports Master Store Dashboard
        add_menu_page(
            __('NE Sports Store', 'nesports-pro-store'),
            __('NE Sports Store', 'nesports-pro-store'),
            'manage_options',
            'nesports-pro-store',
            array($this, 'render_master_dashboard'),
            'dashicons-shield',
            25
        );

        add_submenu_page(
            'nesports-pro-store',
            __('Master Dashboard', 'nesports-pro-store'),
            __('Master Dashboard', 'nesports-pro-store'),
            'manage_options',
            'nesports-pro-store',
            array($this, 'render_master_dashboard')
        );

        add_submenu_page(
            'nesports-pro-store',
            __('Products & Variations', 'nesports-pro-store'),
            __('Products & Variations', 'nesports-pro-store'),
            'manage_options',
            'nesports-store-products',
            array($this, 'render_products_manager')
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
        if (!is_array($input)) {
            return array();
        }
        $clean = array();
        foreach ($input as $key => $val) {
            if (is_array($val)) {
                $clean[$key] = array_map('sanitize_text_field', $val);
            } elseif (
                strpos($key, 'desc') !== false ||
                strpos($key, 'subtitle') !== false ||
                strpos($key, 'story') !== false ||
                strpos($key, 'content') !== false ||
                strpos($key, 'motto') !== false
            ) {
                $clean[$key] = wp_kses_post($val);
            } else {
                $clean[$key] = sanitize_text_field($val);
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
            wp_enqueue_style('wp-color-picker');
            wp_enqueue_script('wp-color-picker');
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

        $redirect_tab = isset($_POST['redirect_tab']) ? sanitize_text_field($_POST['redirect_tab']) : 'products';

        if ($action === 'add_product') {
            $name      = sanitize_text_field($_POST['product_name'] ?? '');
            $cat       = sanitize_text_field($_POST['product_cat'] ?? 'belts');
            $price     = floatval($_POST['product_price'] ?? 0);
            $old       = floatval($_POST['product_old_price'] ?? $price);
            $main_img  = sanitize_text_field($_POST['product_main_img'] ?? '');
            $hover_img = sanitize_text_field($_POST['product_hover_img'] ?? '');
            $sizes     = sanitize_text_field($_POST['product_sizes'] ?? 'S, M, L, XL');
            $colors    = sanitize_text_field($_POST['product_colors'] ?? 'Black');

            if (empty($name)) {
                wp_redirect(admin_url('admin.php?page=nesports-pro-store&tab=' . $redirect_tab . '&error=empty_name'));
                exit;
            }

            if (empty($main_img)) {
                $main_img = 'DSC_0167-scaled-1.jpg';
            }
            if (empty($hover_img)) {
                $hover_img = $main_img;
            }

            $slug = sanitize_title($name);
            $existing_slugs = array_column($catalog, 'slug');
            if (in_array($slug, $existing_slugs)) {
                $slug .= '-' . time();
            }

            $new_item = array(
                'name'       => $name,
                'slug'       => $slug,
                'cat'        => $cat,
                'price'      => $price,
                'old'        => $old > $price ? $old : $price,
                'reviews'    => rand(25, 95),
                'main'       => $main_img,
                'hover'      => $hover_img,
                'variations' => array(
                    'sizes'  => $sizes,
                    'colors' => $colors
                )
            );

            array_unshift($catalog, $new_item);
            update_option('nesports_managed_catalog', $catalog);

            wp_redirect(admin_url('admin.php?page=nesports-pro-store&tab=' . $redirect_tab . '&msg=added'));
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
            wp_redirect(admin_url('admin.php?page=nesports-pro-store&tab=' . $redirect_tab . '&msg=price_saved'));
            exit;
        }

        if ($action === 'edit_product') {
            $slug      = sanitize_text_field($_POST['product_slug'] ?? '');
            $name      = sanitize_text_field($_POST['product_name'] ?? '');
            $cat       = sanitize_text_field($_POST['product_cat'] ?? 'belts');
            $price     = floatval($_POST['product_price'] ?? 0);
            $old       = floatval($_POST['product_old_price'] ?? $price);
            $main_img  = sanitize_text_field($_POST['product_main_img'] ?? '');
            $hover_img = sanitize_text_field($_POST['product_hover_img'] ?? '');
            $sizes     = sanitize_text_field($_POST['product_sizes'] ?? 'S, M, L, XL');
            $colors    = sanitize_text_field($_POST['product_colors'] ?? 'Black');

            foreach ($catalog as &$item) {
                if (isset($item['slug']) && $item['slug'] === $slug) {
                    if (!empty($name)) $item['name'] = $name;
                    $item['cat']   = $cat;
                    $item['price'] = $price;
                    $item['old']   = ($old >= $price) ? $old : $price;
                    if (!empty($main_img)) $item['main'] = $main_img;
                    if (!empty($hover_img)) $item['hover'] = $hover_img;
                    $item['variations'] = array(
                        'sizes'  => $sizes,
                        'colors' => $colors
                    );
                    break;
                }
            }
            unset($item);

            update_option('nesports_managed_catalog', $catalog);
            wp_redirect(admin_url('admin.php?page=nesports-pro-store&tab=' . $redirect_tab . '&msg=updated'));
            exit;
        }

        if ($action === 'delete_product') {
            $slug = sanitize_text_field($_POST['product_slug'] ?? '');
            $catalog = array_values(array_filter($catalog, function($item) use ($slug) {
                return isset($item['slug']) && $item['slug'] !== $slug;
            }));

            update_option('nesports_managed_catalog', $catalog);
            wp_redirect(admin_url('admin.php?page=nesports-pro-store&tab=' . $redirect_tab . '&msg=deleted'));
            exit;
        }

        if ($action === 'reset_catalog') {
            if (function_exists('nesports_preset_catalog')) {
                $catalog = nesports_preset_catalog();
                update_option('nesports_managed_catalog', $catalog);
            }
            wp_redirect(admin_url('admin.php?page=nesports-pro-store&tab=' . $redirect_tab . '&msg=reset'));
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
     * Render Master Dashboard (Single Page Control for Entire Website)
     */
    public function render_master_dashboard() {
        $settings = get_option('nesports_store_settings', array());
        if (!is_array($settings)) {
            $settings = array();
        }

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

        $active_tab = sanitize_text_field($_GET['tab'] ?? 'home');
        $msg = sanitize_text_field($_GET['msg'] ?? '');
        $error = sanitize_text_field($_GET['error'] ?? '');
        ?>
        <div class="wrap nesports-master-admin-wrap" style="max-width: 1400px; margin: 20px auto 50px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            
            <!-- MASTER HEADER -->
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 14px; padding: 26px 32px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; color: #ffffff; flex-wrap: wrap; gap: 16px;">
                <div>
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 6px;">
                        <span style="background: #e11d48; color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; letter-spacing: 1px; text-transform: uppercase;">MASTER DASHBOARD</span>
                        <span style="color: #94a3b8; font-size: 13px;">Full Website Control</span>
                    </div>
                    <h1 style="margin: 0; font-size: 26px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                        NE SPORTS3 &mdash; STORE CUSTOMIZER & MANAGER
                    </h1>
                    <p style="margin: 6px 0 0; color: #94a3b8; font-size: 13.5px;">
                        Elementor-style section-by-section and page-by-page control for all titles, descriptions, banners, colors, SEO & products!
                    </p>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <a href="<?php echo esc_url(home_url('/')); ?>" target="_blank" class="button" style="background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); color: #ffffff; height: 42px; padding: 0 18px; font-size: 13.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; border-radius: 8px; backdrop-filter: blur(8px);">
                        <span class="dashicons dashicons-external" style="margin-top: 1px;"></span> View Live Store
                    </a>
                </div>
            </div>

            <!-- NOTIFICATIONS -->
            <?php if (isset($_GET['settings-updated']) && $_GET['settings-updated'] === 'true'): ?>
                <div class="notice notice-success is-dismissible" style="padding: 14px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; background: #ecfdf5; border-left: 4px solid #10b981; color: #065f46; margin-bottom: 22px;">
                    All website settings, titles, descriptions, and colors have been saved and are now LIVE!
                </div>
            <?php elseif ($msg === 'added'): ?>
                <div class="notice notice-success is-dismissible" style="padding: 14px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; background: #ecfdf5; border-left: 4px solid #10b981; color: #065f46; margin-bottom: 22px;">
                    Success! New product has been added to your catalog.
                </div>
            <?php elseif ($msg === 'price_saved'): ?>
                <div class="notice notice-success is-dismissible" style="padding: 14px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; background: #ecfdf5; border-left: 4px solid #10b981; color: #065f46; margin-bottom: 22px;">
                    Product price updated successfully on the storefront!
                </div>
            <?php elseif ($msg === 'updated'): ?>
                <div class="notice notice-success is-dismissible" style="padding: 14px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; background: #ecfdf5; border-left: 4px solid #10b981; color: #065f46; margin-bottom: 22px;">
                    Product details updated successfully!
                </div>
            <?php elseif ($msg === 'deleted'): ?>
                <div class="notice notice-warning is-dismissible" style="padding: 14px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; background: #fffbeb; border-left: 4px solid #f59e0b; color: #92400e; margin-bottom: 22px;">
                    Product removed from store catalog.
                </div>
            <?php elseif ($error === 'empty_name'): ?>
                <div class="notice notice-error is-dismissible" style="padding: 14px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; background: #fef2f2; border-left: 4px solid #ef4444; color: #991b1b; margin-bottom: 22px;">
                    Error! Product Name cannot be empty.
                </div>
            <?php endif; ?>

            <!-- MASTER TABS BAR -->
            <div class="nesports-tabs-nav" style="display: flex; gap: 8px; border-bottom: 2px solid #e2e8f0; margin-bottom: 24px; overflow-x: auto; scrollbar-width: none;">
                <button type="button" class="nes-tab-btn <?php echo $active_tab === 'home' ? 'active' : ''; ?>" onclick="nesSwitchTab('home')" style="padding: 12px 20px; font-size: 14px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 3px solid transparent; color: #64748b; display: flex; align-items: center; gap: 8px;">
                    <span class="dashicons dashicons-admin-home"></span> 1. Home Page Sections
                </button>
                <button type="button" class="nes-tab-btn <?php echo $active_tab === 'about' ? 'active' : ''; ?>" onclick="nesSwitchTab('about')" style="padding: 12px 20px; font-size: 14px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 3px solid transparent; color: #64748b; display: flex; align-items: center; gap: 8px;">
                    <span class="dashicons dashicons-book"></span> 2. About Us Page
                </button>
                <button type="button" class="nes-tab-btn <?php echo $active_tab === 'contact' ? 'active' : ''; ?>" onclick="nesSwitchTab('contact')" style="padding: 12px 20px; font-size: 14px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 3px solid transparent; color: #64748b; display: flex; align-items: center; gap: 8px;">
                    <span class="dashicons dashicons-phone"></span> 3. Contact Us Page
                </button>
                <button type="button" class="nes-tab-btn <?php echo $active_tab === 'products' ? 'active' : ''; ?>" onclick="nesSwitchTab('products')" style="padding: 12px 20px; font-size: 14px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 3px solid transparent; color: #64748b; display: flex; align-items: center; gap: 8px;">
                    <span class="dashicons dashicons-cart"></span> 4. Products & Variations
                </button>
                <button type="button" class="nes-tab-btn <?php echo $active_tab === 'colors' ? 'active' : ''; ?>" onclick="nesSwitchTab('colors')" style="padding: 12px 20px; font-size: 14px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 3px solid transparent; color: #64748b; display: flex; align-items: center; gap: 8px;">
                    <span class="dashicons dashicons-art"></span> 5. Colors & Styling
                </button>
                <button type="button" class="nes-tab-btn <?php echo $active_tab === 'seo' ? 'active' : ''; ?>" onclick="nesSwitchTab('seo')" style="padding: 12px 20px; font-size: 14px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 3px solid transparent; color: #64748b; display: flex; align-items: center; gap: 8px;">
                    <span class="dashicons dashicons-search"></span> 6. SEO Keywords & Meta
                </button>
                <button type="button" class="nes-tab-btn <?php echo $active_tab === 'header_footer' ? 'active' : ''; ?>" onclick="nesSwitchTab('header_footer')" style="padding: 12px 20px; font-size: 14px; font-weight: 600; border: none; background: none; cursor: pointer; border-bottom: 3px solid transparent; color: #64748b; display: flex; align-items: center; gap: 8px;">
                    <span class="dashicons dashicons-megaphone"></span> 7. Header & Footer
                </button>
            </div>

            <!-- FORM START FOR SETTINGS TABS (Options.php) -->
            <form method="post" action="options.php" id="nesports-master-settings-form">
                <?php settings_fields('nesports_store_options_group'); ?>

                <!-- ==========================================
                     TAB 1: HOME PAGE SECTIONS
                     ========================================== -->
                <div id="nes-tab-home" class="nes-tab-pane" style="<?php echo $active_tab === 'home' ? 'display:block;' : 'display:none;'; ?>">
                    <div style="background: #ffffff; border-radius: 12px; padding: 24px 30px; box-shadow: 0 1px 6px rgba(0,0,0,0.06); margin-bottom: 24px;">
                        <h2 style="margin: 0 0 6px; font-size: 20px; font-weight: 700; color: #0f172a;">Home Page &mdash; Section-by-Section Editor</h2>
                        <p style="margin: 0 0 24px; color: #64748b; font-size: 14px;">
                            Configure every section of your flagship homepage. Change headlines, add rich descriptions, upload media, or toggle section visibility on/off.
                        </p>

                        <!-- SECTION 1: HERO CAROUSEL -->
                        <div class="nes-accordion-card" style="border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 20px; overflow: hidden;">
                            <div class="nes-accordion-header" onclick="nesToggleAccordion(this)" style="background: #f8fafc; padding: 16px 20px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="background: #0f172a; color: #fff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700;">1</span>
                                    <strong style="font-size: 16px; color: #1e293b;">Hero Carousel Banner Section</strong>
                                </div>
                                <div style="display: flex; align-items: center; gap: 14px;">
                                    <label onclick="event.stopPropagation();" style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #475569;">
                                        <input type="checkbox" name="nesports_store_settings[show_hero]" value="1" <?php checked(isset($settings['show_hero']) ? $settings['show_hero'] : '1', '1'); ?> /> Enable Section
                                    </label>
                                    <span class="dashicons dashicons-arrow-down-alt2 nes-accordion-icon"></span>
                                </div>
                            </div>
                            <div class="nes-accordion-body" style="padding: 24px 20px; display: block; border-top: 1px solid #e2e8f0;">
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px; margin-bottom: 16px;">
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Hero Top Eyebrow / Badge:</label>
                                        <input type="text" name="nesports_store_settings[hero_badge]" value="<?php echo esc_attr($settings['hero_badge'] ?? 'SQUAT WITH CONFIDENCE'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                                    </div>
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Main Hero Title / Headline:</label>
                                        <input type="text" name="nesports_store_settings[hero_title]" value="<?php echo esc_attr($settings['hero_title'] ?? 'COMPETITION POWER GEAR'); ?>" class="widefat" style="height:40px; border-radius:6px; font-weight:600;" />
                                    </div>
                                </div>
                                <div style="margin-bottom: 16px;">
                                    <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Hero Subtitle / Full Description:</label>
                                    <textarea name="nesports_store_settings[hero_subtitle]" rows="3" class="widefat" style="border-radius:6px; padding:10px;"><?php echo esc_textarea($settings['hero_subtitle'] ?? 'Heavy-duty competition pads, knee wraps and supportive accessories engineered for record-breaking lifts.'); ?></textarea>
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; margin-bottom: 16px;">
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Primary Button Text:</label>
                                        <input type="text" name="nesports_store_settings[hero_primary_cta]" value="<?php echo esc_attr($settings['hero_primary_cta'] ?? 'SHOP NOW'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                                    </div>
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Primary Button Link (URL):</label>
                                        <input type="text" name="nesports_store_settings[hero_primary_url]" value="<?php echo esc_attr($settings['hero_primary_url'] ?? '/shop/'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                                    </div>
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Secondary Button Text:</label>
                                        <input type="text" name="nesports_store_settings[hero_secondary_cta]" value="<?php echo esc_attr($settings['hero_secondary_cta'] ?? 'VIEW ALL PRODUCTS'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                                    </div>
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Secondary Button Link (URL):</label>
                                        <input type="text" name="nesports_store_settings[hero_secondary_url]" value="<?php echo esc_attr($settings['hero_secondary_url'] ?? '/shop/'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                                    </div>
                                </div>
                                <div>
                                    <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Hero Image / Media:</label>
                                    <div style="display: flex; gap: 8px;">
                                        <input type="text" id="nes-hero-bg-img" name="nesports_store_settings[hero_bg_image]" value="<?php echo esc_attr($settings['hero_bg_image'] ?? 'DSC_0749-scaled.jpg'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                                        <button type="button" class="button" onclick="nesportsSelectMedia('nes-hero-bg-img')" style="height:40px; white-space:nowrap;">Upload / Select Media</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 2: TRUST / GUARANTEE FEATURES BAR -->
                        <div class="nes-accordion-card" style="border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 20px; overflow: hidden;">
                            <div class="nes-accordion-header" onclick="nesToggleAccordion(this)" style="background: #f8fafc; padding: 16px 20px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="background: #0f172a; color: #fff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700;">2</span>
                                    <strong style="font-size: 16px; color: #1e293b;">Guarantees / Trust Bar (Under Hero)</strong>
                                </div>
                                <div style="display: flex; align-items: center; gap: 14px;">
                                    <label onclick="event.stopPropagation();" style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #475569;">
                                        <input type="checkbox" name="nesports_store_settings[show_trustbar]" value="1" <?php checked(isset($settings['show_trustbar']) ? $settings['show_trustbar'] : '1', '1'); ?> /> Enable Section
                                    </label>
                                    <span class="dashicons dashicons-arrow-down-alt2 nes-accordion-icon"></span>
                                </div>
                            </div>
                            <div class="nes-accordion-body" style="padding: 24px 20px; display: none; border-top: 1px solid #e2e8f0;">
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                                    <div style="background: #f8fafc; padding: 14px; border-radius: 8px;">
                                        <label style="font-weight:700; color:#0f172a; display:block; margin-bottom:6px;">Badge 1 (Shipping):</label>
                                        <input type="text" name="nesports_store_settings[trust_1_title]" value="<?php echo esc_attr($settings['trust_1_title'] ?? 'FREE & FAST SHIPPING'); ?>" class="widefat" style="height:36px; border-radius:4px; margin-bottom:6px;" />
                                        <input type="text" name="nesports_store_settings[trust_1_desc]" value="<?php echo esc_attr($settings['trust_1_desc'] ?? 'On all orders over 150€'); ?>" placeholder="Description" class="widefat" style="height:36px; border-radius:4px;" />
                                    </div>
                                    <div style="background: #f8fafc; padding: 14px; border-radius: 8px;">
                                        <label style="font-weight:700; color:#0f172a; display:block; margin-bottom:6px;">Badge 2 (Quality):</label>
                                        <input type="text" name="nesports_store_settings[trust_2_title]" value="<?php echo esc_attr($settings['trust_2_title'] ?? 'COMPETITION-GRADE GEAR'); ?>" class="widefat" style="height:36px; border-radius:4px; margin-bottom:6px;" />
                                        <input type="text" name="nesports_store_settings[trust_2_desc]" value="<?php echo esc_attr($settings['trust_2_desc'] ?? 'Heavy-duty industrial build'); ?>" placeholder="Description" class="widefat" style="height:36px; border-radius:4px;" />
                                    </div>
                                    <div style="background: #f8fafc; padding: 14px; border-radius: 8px;">
                                        <label style="font-weight:700; color:#0f172a; display:block; margin-bottom:6px;">Badge 3 (Returns):</label>
                                        <input type="text" name="nesports_store_settings[trust_3_title]" value="<?php echo esc_attr($settings['trust_3_title'] ?? '30-DAY EASY RETURNS'); ?>" class="widefat" style="height:36px; border-radius:4px; margin-bottom:6px;" />
                                        <input type="text" name="nesports_store_settings[trust_3_desc]" value="<?php echo esc_attr($settings['trust_3_desc'] ?? '100% money back guarantee'); ?>" placeholder="Description" class="widefat" style="height:36px; border-radius:4px;" />
                                    </div>
                                    <div style="background: #f8fafc; padding: 14px; border-radius: 8px;">
                                        <label style="font-weight:700; color:#0f172a; display:block; margin-bottom:6px;">Badge 4 (Engineering):</label>
                                        <input type="text" name="nesports_store_settings[trust_4_title]" value="<?php echo esc_attr($settings['trust_4_title'] ?? 'ENGINEERED IN GERMANY'); ?>" class="widefat" style="height:36px; border-radius:4px; margin-bottom:6px;" />
                                        <input type="text" name="nesports_store_settings[trust_4_desc]" value="<?php echo esc_attr($settings['trust_4_desc'] ?? 'Precision designed for lifters'); ?>" placeholder="Description" class="widefat" style="height:36px; border-radius:4px;" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 3: POPULAR CATEGORIES / TOP SELLERS -->
                        <div class="nes-accordion-card" style="border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 20px; overflow: hidden;">
                            <div class="nes-accordion-header" onclick="nesToggleAccordion(this)" style="background: #f8fafc; padding: 16px 20px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="background: #0f172a; color: #fff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700;">3</span>
                                    <strong style="font-size: 16px; color: #1e293b;">Top Sellers / Popular Categories</strong>
                                </div>
                                <div style="display: flex; align-items: center; gap: 14px;">
                                    <label onclick="event.stopPropagation();" style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #475569;">
                                        <input type="checkbox" name="nesports_store_settings[show_categories]" value="1" <?php checked(isset($settings['show_categories']) ? $settings['show_categories'] : '1', '1'); ?> /> Enable Section
                                    </label>
                                    <span class="dashicons dashicons-arrow-down-alt2 nes-accordion-icon"></span>
                                </div>
                            </div>
                            <div class="nes-accordion-body" style="padding: 24px 20px; display: none; border-top: 1px solid #e2e8f0;">
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px;">
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Section Title / Headline:</label>
                                        <input type="text" name="nesports_store_settings[categories_title]" value="<?php echo esc_attr($settings['categories_title'] ?? 'Top Sellers'); ?>" class="widefat" style="height:40px; border-radius:6px; font-weight:600;" />
                                    </div>
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Section Subtitle / Description:</label>
                                        <input type="text" name="nesports_store_settings[categories_desc]" value="<?php echo esc_attr($settings['categories_desc'] ?? 'Explore our most popular lifting essentials.'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 4: MID-PAGE PARALLAX BANNER -->
                        <div class="nes-accordion-card" style="border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 20px; overflow: hidden;">
                            <div class="nes-accordion-header" onclick="nesToggleAccordion(this)" style="background: #f8fafc; padding: 16px 20px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="background: #0f172a; color: #fff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700;">4</span>
                                    <strong style="font-size: 16px; color: #1e293b;">Mid-Page Brand Parallax Banner</strong>
                                </div>
                                <div style="display: flex; align-items: center; gap: 14px;">
                                    <label onclick="event.stopPropagation();" style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #475569;">
                                        <input type="checkbox" name="nesports_store_settings[show_banner]" value="1" <?php checked(isset($settings['show_banner']) ? $settings['show_banner'] : '1', '1'); ?> /> Enable Section
                                    </label>
                                    <span class="dashicons dashicons-arrow-down-alt2 nes-accordion-icon"></span>
                                </div>
                            </div>
                            <div class="nes-accordion-body" style="padding: 24px 20px; display: none; border-top: 1px solid #e2e8f0;">
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px; margin-bottom: 16px;">
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Banner Top Badge:</label>
                                        <input type="text" name="nesports_store_settings[banner_badge]" value="<?php echo esc_attr($settings['banner_badge'] ?? 'BUILT FOR THE RELENTLESS'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                                    </div>
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Banner Headline (HTML/br allowed):</label>
                                        <input type="text" name="nesports_store_settings[banner_title]" value="<?php echo esc_attr($settings['banner_title'] ?? 'BUILT FOR PROGRESS.<br>ENGINEERED TO ENDURE.'); ?>" class="widefat" style="height:40px; border-radius:6px; font-weight:600;" />
                                    </div>
                                </div>
                                <div style="margin-bottom: 16px;">
                                    <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Banner Full Paragraph Description:</label>
                                    <textarea name="nesports_store_settings[banner_desc]" rows="3" class="widefat" style="border-radius:6px; padding:10px;"><?php echo esc_textarea($settings['banner_desc'] ?? 'Heavy-duty competition pads, knee wraps and supportive accessories engineered for record-breaking lifts.'); ?></textarea>
                                </div>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px;">
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Button Text:</label>
                                        <input type="text" name="nesports_store_settings[banner_btn_text]" value="<?php echo esc_attr($settings['banner_btn_text'] ?? 'EXPLORE THE GEAR'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                                    </div>
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Button Link:</label>
                                        <input type="text" name="nesports_store_settings[banner_btn_url]" value="<?php echo esc_attr($settings['banner_btn_url'] ?? '/shop/'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 5: COLLECTIONS CAROUSEL -->
                        <div class="nes-accordion-card" style="border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 20px; overflow: hidden;">
                            <div class="nes-accordion-header" onclick="nesToggleAccordion(this)" style="background: #f8fafc; padding: 16px 20px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="background: #0f172a; color: #fff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700;">5</span>
                                    <strong style="font-size: 16px; color: #1e293b;">Collections Carousel Section</strong>
                                </div>
                                <div style="display: flex; align-items: center; gap: 14px;">
                                    <label onclick="event.stopPropagation();" style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #475569;">
                                        <input type="checkbox" name="nesports_store_settings[show_collections]" value="1" <?php checked(isset($settings['show_collections']) ? $settings['show_collections'] : '1', '1'); ?> /> Enable Section
                                    </label>
                                    <span class="dashicons dashicons-arrow-down-alt2 nes-accordion-icon"></span>
                                </div>
                            </div>
                            <div class="nes-accordion-body" style="padding: 24px 20px; display: none; border-top: 1px solid #e2e8f0;">
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px;">
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Section Title / Headline:</label>
                                        <input type="text" name="nesports_store_settings[collections_title]" value="<?php echo esc_attr($settings['collections_title'] ?? 'Collections'); ?>" class="widefat" style="height:40px; border-radius:6px; font-weight:600;" />
                                    </div>
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Section Subtitle / Description:</label>
                                        <input type="text" name="nesports_store_settings[collections_desc]" value="<?php echo esc_attr($settings['collections_desc'] ?? 'Browse by specialized equipment collections.'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 6: BUNDLES SECTION -->
                        <div class="nes-accordion-card" style="border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 20px; overflow: hidden;">
                            <div class="nes-accordion-header" onclick="nesToggleAccordion(this)" style="background: #f8fafc; padding: 16px 20px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="background: #0f172a; color: #fff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700;">6</span>
                                    <strong style="font-size: 16px; color: #1e293b;">Hardbody Bundles Section</strong>
                                </div>
                                <div style="display: flex; align-items: center; gap: 14px;">
                                    <label onclick="event.stopPropagation();" style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #475569;">
                                        <input type="checkbox" name="nesports_store_settings[show_bundles]" value="1" <?php checked(isset($settings['show_bundles']) ? $settings['show_bundles'] : '1', '1'); ?> /> Enable Section
                                    </label>
                                    <span class="dashicons dashicons-arrow-down-alt2 nes-accordion-icon"></span>
                                </div>
                            </div>
                            <div class="nes-accordion-body" style="padding: 24px 20px; display: none; border-top: 1px solid #e2e8f0;">
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 18px; margin-bottom: 16px;">
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Section Title / Headline:</label>
                                        <input type="text" name="nesports_store_settings[bundles_title]" value="<?php echo esc_attr($settings['bundles_title'] ?? 'Bundles'); ?>" class="widefat" style="height:40px; border-radius:6px; font-weight:600;" />
                                    </div>
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Discount Badge / Tag:</label>
                                        <input type="text" name="nesports_store_settings[bundles_badge]" value="<?php echo esc_attr($settings['bundles_badge'] ?? 'SAVE 20%'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                                    </div>
                                </div>
                                <div>
                                    <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Bundle Subtitle / Full Description:</label>
                                    <textarea name="nesports_store_settings[bundles_desc]" rows="2" class="widefat" style="border-radius:6px; padding:10px;"><?php echo esc_textarea($settings['bundles_desc'] ?? 'Power, protection & performance built into every stack. Stack and save.'); ?></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 7: STRENGTH CLUB APPAREL / CLOTHING -->
                        <div class="nes-accordion-card" style="border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 20px; overflow: hidden;">
                            <div class="nes-accordion-header" onclick="nesToggleAccordion(this)" style="background: #f8fafc; padding: 16px 20px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="background: #0f172a; color: #fff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700;">7</span>
                                    <strong style="font-size: 16px; color: #1e293b;">Clothing & Apparel Section</strong>
                                </div>
                                <div style="display: flex; align-items: center; gap: 14px;">
                                    <label onclick="event.stopPropagation();" style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #475569;">
                                        <input type="checkbox" name="nesports_store_settings[show_clothing]" value="1" <?php checked(isset($settings['show_clothing']) ? $settings['show_clothing'] : '1', '1'); ?> /> Enable Section
                                    </label>
                                    <span class="dashicons dashicons-arrow-down-alt2 nes-accordion-icon"></span>
                                </div>
                            </div>
                            <div class="nes-accordion-body" style="padding: 24px 20px; display: none; border-top: 1px solid #e2e8f0;">
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px;">
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Section Title / Headline:</label>
                                        <input type="text" name="nesports_store_settings[clothing_title]" value="<?php echo esc_attr($settings['clothing_title'] ?? 'Clothing'); ?>" class="widefat" style="height:40px; border-radius:6px; font-weight:600;" />
                                    </div>
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Section Subtitle / Description:</label>
                                        <input type="text" name="nesports_store_settings[clothing_desc]" value="<?php echo esc_attr($settings['clothing_desc'] ?? 'Oversized heavy cotton tees, lifter sweatpants, and signature training wear.'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- SECTION 8: SHOP BY COLOR -->
                        <div class="nes-accordion-card" style="border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 20px; overflow: hidden;">
                            <div class="nes-accordion-header" onclick="nesToggleAccordion(this)" style="background: #f8fafc; padding: 16px 20px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <span style="background: #0f172a; color: #fff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700;">8</span>
                                    <strong style="font-size: 16px; color: #1e293b;">Shop by Color Section</strong>
                                </div>
                                <div style="display: flex; align-items: center; gap: 14px;">
                                    <label onclick="event.stopPropagation();" style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #475569;">
                                        <input type="checkbox" name="nesports_store_settings[show_color]" value="1" <?php checked(isset($settings['show_color']) ? $settings['show_color'] : '1', '1'); ?> /> Enable Section
                                    </label>
                                    <span class="dashicons dashicons-arrow-down-alt2 nes-accordion-icon"></span>
                                </div>
                            </div>
                            <div class="nes-accordion-body" style="padding: 24px 20px; display: none; border-top: 1px solid #e2e8f0;">
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px;">
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Section Title / Headline:</label>
                                        <input type="text" name="nesports_store_settings[color_title]" value="<?php echo esc_attr($settings['color_title'] ?? 'Shop by Color'); ?>" class="widefat" style="height:40px; border-radius:6px; font-weight:600;" />
                                    </div>
                                    <div>
                                        <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Section Subtitle / Description:</label>
                                        <input type="text" name="nesports_store_settings[color_desc]" value="<?php echo esc_attr($settings['color_desc'] ?? 'Match your competition look. Choose your signature colorway.'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- ==========================================
                     TAB 2: ABOUT US PAGE
                     ========================================== -->
                <div id="nes-tab-about" class="nes-tab-pane" style="<?php echo $active_tab === 'about' ? 'display:block;' : 'display:none;'; ?>">
                    <div style="background: #ffffff; border-radius: 12px; padding: 24px 30px; box-shadow: 0 1px 6px rgba(0,0,0,0.06); margin-bottom: 24px;">
                        <h2 style="margin: 0 0 6px; font-size: 20px; font-weight: 700; color: #0f172a;">About Us / Our Story Page Settings</h2>
                        <p style="margin: 0 0 24px; color: #64748b; font-size: 14px;">
                            Manage the banner title, full brand story paragraphs, feature image, and brand motto.
                        </p>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px; margin-bottom: 18px;">
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">About Page Banner Title:</label>
                                <input type="text" name="nesports_store_settings[about_banner_title]" value="<?php echo esc_attr($settings['about_banner_title'] ?? 'About Us'); ?>" class="widefat" style="height:40px; border-radius:6px; font-weight:600;" />
                            </div>
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Story Section Headline:</label>
                                <input type="text" name="nesports_store_settings[about_story_title]" value="<?php echo esc_attr($settings['about_story_title'] ?? 'The NE Sports Story'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                            </div>
                        </div>

                        <div style="margin-bottom: 18px;">
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Feature Brand Photo (URL or Upload):</label>
                            <div style="display: flex; gap: 8px;">
                                <input type="text" id="nes-about-feature-img" name="nesports_store_settings[about_feature_img]" value="<?php echo esc_attr($settings['about_feature_img'] ?? 'WhatsApp-Image-2024-07-08-at-19.17.50_f9c47d7b-800x530.jpg'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                                <button type="button" class="button" onclick="nesportsSelectMedia('nes-about-feature-img')" style="height:40px; white-space:nowrap;">Upload / Select Media</button>
                            </div>
                        </div>

                        <div style="margin-bottom: 18px;">
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Full Brand Story (Paragraphs / Description):</label>
                            <textarea name="nesports_store_settings[about_story_desc]" rows="8" class="widefat" style="border-radius:6px; padding:12px; line-height:1.6; font-size:14px;"><?php 
                            echo esc_textarea($settings['about_story_desc'] ?? "At NE Sports3, we believe sports and fitness are more than just activities – they are a lifestyle. Our mission is to empower athletes, fitness enthusiasts, and everyday champions with the highest-quality sports and gym products that inspire performance, strength, and confidence.\n\nFrom durable gym equipment and training accessories to premium sports gear, we carefully select every product to ensure it meets the needs of both beginners and professionals. Whether you’re building strength in the gym, training for competition, or simply staying active, NE Sports3 is here to support your journey.\n\nWe are passionate about helping our community stay fit, healthy, and motivated. That’s why we combine top-notch products, affordable prices, and reliable service – because your goals matter to us.\n\nAt NE Sports3, it’s not just about products, it’s about progress. Let us be your trusted partner in achieving your fitness and sports ambitions."); 
                            ?></textarea>
                            <p class="description">Separate paragraphs by blank lines. Will render cleanly on the About Us page.</p>
                        </div>

                        <div>
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Brand Motto / Signature Quote:</label>
                            <input type="text" name="nesports_store_settings[about_motto]" value="<?php echo esc_attr($settings['about_motto'] ?? 'Train harder. Play stronger. Live better – with NE Sports3.'); ?>" class="widefat" style="height:40px; border-radius:6px; font-weight:600; color:#e11d48;" />
                        </div>
                    </div>
                </div>

                <!-- ==========================================
                     TAB 3: CONTACT US PAGE
                     ========================================== -->
                <div id="nes-tab-contact" class="nes-tab-pane" style="<?php echo $active_tab === 'contact' ? 'display:block;' : 'display:none;'; ?>">
                    <div style="background: #ffffff; border-radius: 12px; padding: 24px 30px; box-shadow: 0 1px 6px rgba(0,0,0,0.06); margin-bottom: 24px;">
                        <h2 style="margin: 0 0 6px; font-size: 20px; font-weight: 700; color: #0f172a;">Contact Us Page Settings</h2>
                        <p style="margin: 0 0 24px; color: #64748b; font-size: 14px;">
                            Configure the contact page titles, description, support phone, email, and location.
                        </p>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px; margin-bottom: 18px;">
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Contact Page Eyebrow / Tagline:</label>
                                <input type="text" name="nesports_store_settings[contact_eyebrow]" value="<?php echo esc_attr($settings['contact_eyebrow'] ?? 'INFORMATION ABOUT US'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                            </div>
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Main Contact Heading:</label>
                                <input type="text" name="nesports_store_settings[contact_heading]" value="<?php echo esc_attr($settings['contact_heading'] ?? 'CONTACT US FOR ANY QUESTIONS'); ?>" class="widefat" style="height:40px; border-radius:6px; font-weight:600;" />
                            </div>
                        </div>

                        <div style="margin-bottom: 18px;">
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Contact Subtitle / Help Description:</label>
                            <textarea name="nesports_store_settings[contact_desc]" rows="3" class="widefat" style="border-radius:6px; padding:10px;"><?php echo esc_textarea($settings['contact_desc'] ?? 'Have questions about sizing, custom wholesale orders, or your delivery? Reach out to our dedicated fitness support team.'); ?></textarea>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin-bottom: 18px;">
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Support Phone / WhatsApp:</label>
                                <input type="text" name="nesports_store_settings[support_phone]" value="<?php echo esc_attr($settings['support_phone'] ?? '+1 (800) 555-0199'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                            </div>
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Support Email:</label>
                                <input type="email" name="nesports_store_settings[support_email]" value="<?php echo esc_attr($settings['support_email'] ?? 'support@nesports3.com'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                            </div>
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Warehouse / Location:</label>
                                <input type="text" name="nesports_store_settings[support_address]" value="<?php echo esc_attr($settings['support_address'] ?? 'Berlin, Germany'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                            </div>
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Working Hours:</label>
                                <input type="text" name="nesports_store_settings[support_hours]" value="<?php echo esc_attr($settings['support_hours'] ?? 'Mon - Fri: 9:00 AM - 6:00 PM CET'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                            </div>
                        </div>

                        <div>
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Contact Form Submit Button Text:</label>
                            <input type="text" name="nesports_store_settings[contact_btn_text]" value="<?php echo esc_attr($settings['contact_btn_text'] ?? 'ASK A QUESTION'); ?>" class="widefat" style="height:40px; border-radius:6px; max-width:320px;" />
                        </div>
                    </div>
                </div>

                <!-- ==========================================
                     TAB 5: COLORS & STYLING
                     ========================================== -->
                <div id="nes-tab-colors" class="nes-tab-pane" style="<?php echo $active_tab === 'colors' ? 'display:block;' : 'display:none;'; ?>">
                    <div style="background: #ffffff; border-radius: 12px; padding: 24px 30px; box-shadow: 0 1px 6px rgba(0,0,0,0.06); margin-bottom: 24px;">
                        <h2 style="margin: 0 0 6px; font-size: 20px; font-weight: 700; color: #0f172a;">Live Colors & Typography Customizer</h2>
                        <p style="margin: 0 0 24px; color: #64748b; font-size: 14px;">
                            Click any color box to select your preferred brand accent, heading colors, text colors, and top announcement bar style.
                        </p>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 20px;">
                            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;">
                                <label style="display:block; font-weight:700; color:#0f172a; margin-bottom:6px;">Brand Primary Accent Color:</label>
                                <p style="font-size:12.5px; color:#64748b; margin:0 0 12px;">Controls buttons, sales badges, and highlights.</p>
                                <input type="color" name="nesports_store_settings[accent_color]" value="<?php echo esc_attr($settings['accent_color'] ?? '#e11d48'); ?>" style="height:44px; width:100%; border-radius:6px; cursor:pointer;" />
                            </div>

                            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;">
                                <label style="display:block; font-weight:700; color:#0f172a; margin-bottom:6px;">Headings Text Color:</label>
                                <p style="font-size:12.5px; color:#64748b; margin:0 0 12px;">Controls H1, H2, and title colors across the site.</p>
                                <input type="color" name="nesports_store_settings[heading_color]" value="<?php echo esc_attr($settings['heading_color'] ?? '#111111'); ?>" style="height:44px; width:100%; border-radius:6px; cursor:pointer;" />
                            </div>

                            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;">
                                <label style="display:block; font-weight:700; color:#0f172a; margin-bottom:6px;">Body & Paragraph Text Color:</label>
                                <p style="font-size:12.5px; color:#64748b; margin:0 0 12px;">Controls regular paragraphs and descriptions.</p>
                                <input type="color" name="nesports_store_settings[text_color]" value="<?php echo esc_attr($settings['text_color'] ?? '#4b5563'); ?>" style="height:44px; width:100%; border-radius:6px; cursor:pointer;" />
                            </div>

                            <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;">
                                <label style="display:block; font-weight:700; color:#0f172a; margin-bottom:6px;">Top Announcement Bar Background:</label>
                                <p style="font-size:12.5px; color:#64748b; margin:0 0 12px;">Background of the fixed top announcement bar.</p>
                                <input type="color" name="nesports_store_settings[topbar_bg]" value="<?php echo esc_attr($settings['topbar_bg'] ?? '#141518'); ?>" style="height:44px; width:100%; border-radius:6px; cursor:pointer;" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ==========================================
                     TAB 6: SEO KEYWORDS & METADATA
                     ========================================== -->
                <div id="nes-tab-seo" class="nes-tab-pane" style="<?php echo $active_tab === 'seo' ? 'display:block;' : 'display:none;'; ?>">
                    <div style="background: #ffffff; border-radius: 12px; padding: 24px 30px; box-shadow: 0 1px 6px rgba(0,0,0,0.06); margin-bottom: 24px;">
                        <h2 style="margin: 0 0 6px; font-size: 20px; font-weight: 700; color: #0f172a;">SEO Keywords & Search Engine Metadata</h2>
                        <p style="margin: 0 0 24px; color: #64748b; font-size: 14px;">
                            Configure Google search titles, descriptions, and focus keywords to help your store rank higher on search engines.
                        </p>

                        <div style="margin-bottom: 18px;">
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">SEO Site / Meta Title:</label>
                            <input type="text" name="nesports_store_settings[seo_site_title]" value="<?php echo esc_attr($settings['seo_site_title'] ?? 'NESPORTS3 | Premium Lifting Gear & Power Accessories'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                            <p class="description">Optimal length: 50-60 characters.</p>
                        </div>

                        <div style="margin-bottom: 18px;">
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Google Meta Description:</label>
                            <textarea name="nesports_store_settings[seo_meta_desc]" rows="3" class="widefat" style="border-radius:6px; padding:10px;"><?php echo esc_textarea($settings['seo_meta_desc'] ?? 'Official store for NESPORTS3 competition lever belts, heavy-duty lifting straps, knee wraps, and gym accessories. Engineered in Germany for record-breaking lifts.'); ?></textarea>
                            <p class="description">Optimal length: 150-160 characters. Appears directly in Google search snippets.</p>
                        </div>

                        <div style="margin-bottom: 18px;">
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Target SEO Keywords (comma separated):</label>
                            <input type="text" name="nesports_store_settings[seo_keywords]" value="<?php echo esc_attr($settings['seo_keywords'] ?? 'powerlifting belt, lever belt, knee wraps, lifting straps, gym bag, nesports3, power gear'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                        </div>

                        <div>
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Social Share Preview Image (OG Image):</label>
                            <div style="display: flex; gap: 8px;">
                                <input type="text" id="nes-seo-og-img" name="nesports_store_settings[seo_og_image]" value="<?php echo esc_attr($settings['seo_og_image'] ?? 'DSC_0749-scaled.jpg'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                                <button type="button" class="button" onclick="nesportsSelectMedia('nes-seo-og-img')" style="height:40px; white-space:nowrap;">Upload / Select Media</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ==========================================
                     TAB 7: HEADER & FOOTER
                     ========================================== -->
                <div id="nes-tab-header_footer" class="nes-tab-pane" style="<?php echo $active_tab === 'header_footer' ? 'display:block;' : 'display:none;'; ?>">
                    <div style="background: #ffffff; border-radius: 12px; padding: 24px 30px; box-shadow: 0 1px 6px rgba(0,0,0,0.06); margin-bottom: 24px;">
                        <h2 style="margin: 0 0 6px; font-size: 20px; font-weight: 700; color: #0f172a;">Header & Footer Settings</h2>
                        <p style="margin: 0 0 24px; color: #64748b; font-size: 14px;">
                            Update top announcement bar text, shipping threshold limit, footer text, and official social media profile links.
                        </p>

                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px; margin-bottom: 18px;">
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Top Bar Announcement Ticker Text:</label>
                                <input type="text" name="nesports_store_settings[announcement_text]" value="<?php echo esc_attr($settings['announcement_text'] ?? 'Free shipping on All DE orders over 150€'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                            </div>
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Free Shipping Minimum Amount (&euro;):</label>
                                <input type="number" name="nesports_store_settings[free_shipping_min]" value="<?php echo esc_attr($settings['free_shipping_min'] ?? '150'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                            </div>
                        </div>

                        <div style="margin-bottom: 18px;">
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Footer Copyright Notice:</label>
                            <input type="text" name="nesports_store_settings[footer_copyright]" value="<?php echo esc_attr($settings['footer_copyright'] ?? '© 2026 NESPORTS3. All rights reserved.'); ?>" class="widefat" style="height:40px; border-radius:6px;" />
                        </div>

                        <h3 style="margin: 24px 0 14px; font-size: 16px; font-weight: 700; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Social Media Profile Links</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Instagram URL:</label>
                                <input type="url" name="nesports_store_settings[social_instagram]" value="<?php echo esc_attr($settings['social_instagram'] ?? 'https://www.instagram.com/nesports39/?hl=en'); ?>" class="widefat" style="height:38px; border-radius:6px;" />
                            </div>
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">TikTok URL:</label>
                                <input type="url" name="nesports_store_settings[social_tiktok]" value="<?php echo esc_attr($settings['social_tiktok'] ?? 'https://www.tiktok.com/@ne_sports3?_r=1&_t=ZG-9BPPEAisLrd'); ?>" class="widefat" style="height:38px; border-radius:6px;" />
                            </div>
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Facebook URL:</label>
                                <input type="url" name="nesports_store_settings[social_facebook]" value="<?php echo esc_attr($settings['social_facebook'] ?? 'https://www.facebook.com/profile.php?id=61570206840697'); ?>" class="widefat" style="height:38px; border-radius:6px;" />
                            </div>
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Amazon Store URL:</label>
                                <input type="url" name="nesports_store_settings[social_amazon]" value="<?php echo esc_attr($settings['social_amazon'] ?? 'https://www.amazon.de/s?k=NES3'); ?>" class="widefat" style="height:38px; border-radius:6px;" />
                            </div>
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">eBay Store URL:</label>
                                <input type="url" name="nesports_store_settings[social_ebay]" value="<?php echo esc_attr($settings['social_ebay'] ?? 'https://www.ebay.de/str/nesports3?_trksid=p4429486.m3561.l161211'); ?>" class="widefat" style="height:38px; border-radius:6px;" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FLOATING STICKY SAVE BAR -->
                <div style="position: sticky; bottom: 20px; z-index: 100; background: #0f172a; padding: 16px 24px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);">
                    <div style="color: #ffffff; font-size: 14px; font-weight: 500;">
                        Changes will be saved directly to your live website.
                    </div>
                    <div>
                        <button type="submit" class="button button-primary" style="background: #e11d48; border-color: #be123c; height: 44px; padding: 0 28px; font-size: 14.5px; font-weight: 700; border-radius: 8px; box-shadow: 0 4px 12px rgba(225,29,72,0.4);">
                            Save All Website Settings
                        </button>
                    </div>
                </div>

            </form>
            <!-- FORM END -->

            <!-- ==========================================
                 TAB 4: PRODUCTS & VARIATIONS MANAGER
                 ========================================== -->
            <div id="nes-tab-products" class="nes-tab-pane" style="<?php echo $active_tab === 'products' ? 'display:block;' : 'display:none;'; ?>">
                <div style="background: #ffffff; border-radius: 12px; padding: 24px 30px; box-shadow: 0 1px 6px rgba(0,0,0,0.06); margin-bottom: 24px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
                        <div>
                            <h2 style="margin: 0 0 6px; font-size: 20px; font-weight: 700; color: #0f172a;">Store Products & Variations Manager</h2>
                            <p style="margin: 0; color: #64748b; font-size: 14px;">
                                Add products, update prices, manage sizes & colors, or remove items from the live storefront.
                            </p>
                        </div>
                        <div>
                            <button type="button" onclick="document.getElementById('nesports-add-modal').style.display='flex';" class="button button-primary" style="background: #e11d48; border-color: #be123c; font-size: 14px; height: 42px; padding: 0 22px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; border-radius: 8px;">
                                <span class="dashicons dashicons-plus-alt2" style="margin-top: 1px;"></span> Add New Product
                            </button>
                        </div>
                    </div>

                    <!-- Search & Filter Controls -->
                    <div style="background: #f8fafc; padding: 14px 18px; border-radius: 8px; margin-bottom: 18px; display: flex; align-items: center; justify-content: space-between; gap: 15px; flex-wrap: wrap; border: 1px solid #e2e8f0;">
                        <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 240px;">
                            <span class="dashicons dashicons-search" style="color: #94a3b8;"></span>
                            <input type="text" id="nesports-search-input" onkeyup="nesportsFilterTable()" placeholder="Search products by title or category..." style="width: 100%; max-width: 360px; height: 38px; border-radius: 6px; border: 1px solid #cbd5e1; padding: 0 12px; font-size: 14px;" />
                        </div>
                        <div>
                            <select id="nesports-cat-filter" onchange="nesportsFilterTable()" style="height: 38px; border-radius: 6px; border: 1px solid #cbd5e1; padding: 0 12px; font-size: 14px;">
                                <option value="">All Categories</option>
                                <?php foreach ($categories as $cat_key => $cat_lbl): ?>
                                    <option value="<?php echo esc_attr($cat_key); ?>"><?php echo esc_html($cat_lbl); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>

                    <!-- Products Table -->
                    <div style="border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
                        <table class="wp-list-table widefat fixed striped" id="nesports-products-table" style="border: none;">
                            <thead>
                                <tr style="background: #f1f5f9;">
                                    <th style="width: 70px; padding: 12px 14px; font-weight: 700; color: #475569;">Image</th>
                                    <th style="padding: 12px 14px; font-weight: 700; color: #475569;">Product Name & Variations</th>
                                    <th style="width: 140px; padding: 12px 14px; font-weight: 700; color: #475569;">Category</th>
                                    <th style="width: 130px; padding: 12px 14px; font-weight: 700; color: #475569;">Price (&euro;)</th>
                                    <th style="width: 130px; padding: 12px 14px; font-weight: 700; color: #475569;">Sale Price (&euro;)</th>
                                    <th style="width: 220px; padding: 12px 14px; font-weight: 700; color: #475569; text-align: right;">Actions</th>
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
                                        $hover= $prod['hover'] ?? $img;
                                        $sizes = isset($prod['variations']['sizes']) ? $prod['variations']['sizes'] : 'S, M, L, XL';
                                        $colors = isset($prod['variations']['colors']) ? $prod['variations']['colors'] : 'Black';
                                    ?>
                                        <tr class="nesports-prod-row" data-cat="<?php echo esc_attr($cat); ?>">
                                            <td style="vertical-align: middle; padding: 10px 14px;">
                                                <div style="width: 50px; height: 50px; border-radius: 6px; overflow: hidden; background: #f1f5f9; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center;">
                                                    <?php if (!empty($img)): ?>
                                                        <img src="<?php echo esc_url(nesports_img($img)); ?>" alt="<?php echo esc_attr($name); ?>" style="max-width: 100%; max-height: 100%; object-fit: cover;" />
                                                    <?php else: ?>
                                                        <span class="dashicons dashicons-format-image" style="color: #94a3b8;"></span>
                                                    <?php endif; ?>
                                                </div>
                                            </td>
                                            <td style="vertical-align: middle; padding: 10px 14px;">
                                                <strong class="nesports-prod-name" style="font-size: 14.5px; color: #0f172a; display: block;"><?php echo esc_html($name); ?></strong>
                                                <div style="display: flex; gap: 8px; margin-top: 4px; font-size: 12px; color: #64748b;">
                                                    <span><strong>Sizes:</strong> <?php echo esc_html($sizes); ?></span>
                                                    <span>&bull;</span>
                                                    <span><strong>Colors:</strong> <?php echo esc_html($colors); ?></span>
                                                </div>
                                            </td>
                                            <td style="vertical-align: middle; padding: 10px 14px;">
                                                <span style="display: inline-block; padding: 3px 8px; border-radius: 999px; background: #f1f5f9; font-size: 11.5px; font-weight: 600; color: #475569; text-transform: uppercase;">
                                                    <?php echo esc_html($categories[$cat] ?? strtoupper($cat)); ?>
                                                </span>
                                            </td>
                                            <form method="post" action="<?php echo esc_url(admin_url('admin.php?page=nesports-pro-store')); ?>">
                                                <?php wp_nonce_field('nesports_product_action_nonce'); ?>
                                                <input type="hidden" name="nesports_product_action" value="quick_price" />
                                                <input type="hidden" name="product_slug" value="<?php echo esc_attr($slug); ?>" />
                                                <input type="hidden" name="redirect_tab" value="products" />
                                                <td style="vertical-align: middle; padding: 10px 14px;">
                                                    <input type="number" step="0.01" name="product_old_price" value="<?php echo esc_attr($old); ?>" style="width: 85px; height: 34px; border-radius: 4px; border: 1px solid #cbd5e1; font-weight: 600;" />
                                                </td>
                                                <td style="vertical-align: middle; padding: 10px 14px;">
                                                    <input type="number" step="0.01" name="product_price" value="<?php echo esc_attr($curr); ?>" style="width: 85px; height: 34px; border-radius: 4px; border: 1px solid #cbd5e1; font-weight: 700; color: #e11d48;" />
                                                </td>
                                                <td style="vertical-align: middle; text-align: right; padding: 10px 14px;">
                                                    <div style="display: inline-flex; align-items: center; gap: 6px;">
                                                        <button type="submit" class="button button-small" title="Save Price" style="height: 32px; padding: 0 10px; font-weight: 600;">Save</button>
                                                        <button type="button" class="button button-small" onclick='nesportsOpenEditModal(<?php echo json_encode(array("slug" => $slug, "name" => $name, "cat" => $cat, "price" => $curr, "old" => $old, "main" => $img, "hover" => $hover, "sizes" => $sizes, "colors" => $colors)); ?>)' title="Full Edit" style="height: 32px; padding: 0 10px;">Edit</button>
                                            </form>
                                            <form method="post" action="<?php echo esc_url(admin_url('admin.php?page=nesports-pro-store')); ?>" style="display: inline;" onsubmit="return confirm('Are you sure you want to remove this product from the live catalog?');">
                                                <?php wp_nonce_field('nesports_product_action_nonce'); ?>
                                                <input type="hidden" name="nesports_product_action" value="delete_product" />
                                                <input type="hidden" name="product_slug" value="<?php echo esc_attr($slug); ?>" />
                                                <input type="hidden" name="redirect_tab" value="products" />
                                                <button type="submit" class="button button-small button-link-delete" style="height: 32px; color: #dc2626; padding: 0 8px;">Delete</button>
                                            </form>
                                                    </div>
                                                </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ADD PRODUCT MODAL -->
            <div id="nesports-add-modal" style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(15,23,42,0.6); backdrop-filter:blur(4px); z-index:99999; align-items:center; justify-content:center; padding:20px;">
                <div style="background:#ffffff; border-radius:12px; width:100%; max-width:620px; box-shadow:0 20px 40px rgba(0,0,0,0.25); max-height:90vh; overflow-y:auto; padding:28px 32px;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; border-bottom:1px solid #e2e8f0; padding-bottom:14px;">
                        <h2 style="margin:0; font-size:20px; font-weight:700; color:#0f172a;">Add New Product</h2>
                        <button type="button" onclick="document.getElementById('nesports-add-modal').style.display='none';" style="background:none; border:none; font-size:24px; cursor:pointer; color:#94a3b8;">&times;</button>
                    </div>

                    <form method="post" action="<?php echo esc_url(admin_url('admin.php?page=nesports-pro-store')); ?>">
                        <?php wp_nonce_field('nesports_product_action_nonce'); ?>
                        <input type="hidden" name="nesports_product_action" value="add_product" />
                        <input type="hidden" name="redirect_tab" value="products" />

                        <div style="margin-bottom:16px;">
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Product Name *</label>
                            <input type="text" name="product_name" required placeholder="e.g. 10mm Competition Lever Belt - Stealth Black" class="widefat" style="height:40px; border-radius:6px;" />
                        </div>

                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Category *</label>
                                <select name="product_cat" class="widefat" style="height:40px; border-radius:6px;">
                                    <?php foreach ($categories as $ck => $cv): ?>
                                        <option value="<?php echo esc_attr($ck); ?>"><?php echo esc_html($cv); ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Sale Price (&euro;) *</label>
                                <input type="number" step="0.01" name="product_price" required placeholder="59.99" class="widefat" style="height:40px; border-radius:6px;" />
                            </div>
                        </div>

                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Regular Price (&euro;) (Optional)</label>
                                <input type="number" step="0.01" name="product_old_price" placeholder="79.99" class="widefat" style="height:40px; border-radius:6px;" />
                            </div>
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Available Sizes</label>
                                <input type="text" name="product_sizes" placeholder="S, M, L, XL, XXL" value="S, M, L, XL" class="widefat" style="height:40px; border-radius:6px;" />
                            </div>
                        </div>

                        <div style="margin-bottom:16px;">
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Available Colors</label>
                            <input type="text" name="product_colors" placeholder="Black, Red, Blue, Camo" value="Stealth Black" class="widefat" style="height:40px; border-radius:6px;" />
                        </div>

                        <div style="margin-bottom:16px;">
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Main Image (Filename or URL)</label>
                            <div style="display:flex; gap:8px;">
                                <input type="text" id="add-prod-main-img" name="product_main_img" placeholder="e.g. DSC_0167-scaled-1.jpg" class="widefat" style="height:40px; border-radius:6px;" />
                                <button type="button" class="button" onclick="nesportsSelectMedia('add-prod-main-img')" style="height:40px; white-space:nowrap;">Upload / Media</button>
                            </div>
                        </div>

                        <div style="margin-bottom:22px;">
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Hover Image (Optional)</label>
                            <div style="display:flex; gap:8px;">
                                <input type="text" id="add-prod-hover-img" name="product_hover_img" placeholder="Second image shown on mouse hover" class="widefat" style="height:40px; border-radius:6px;" />
                                <button type="button" class="button" onclick="nesportsSelectMedia('add-prod-hover-img')" style="height:40px; white-space:nowrap;">Upload / Media</button>
                            </div>
                        </div>

                        <div style="display:flex; justify-content:flex-end; gap:10px; border-top:1px solid #e2e8f0; padding-top:18px;">
                            <button type="button" onclick="document.getElementById('nesports-add-modal').style.display='none';" class="button button-secondary" style="height:40px; padding:0 16px;">Cancel</button>
                            <button type="submit" class="button button-primary" style="height:40px; padding:0 24px; background:#e11d48; border-color:#be123c; font-weight:700;">Publish Product</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- EDIT PRODUCT MODAL -->
            <div id="nesports-edit-modal" style="display:none; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(15,23,42,0.6); backdrop-filter:blur(4px); z-index:99999; align-items:center; justify-content:center; padding:20px;">
                <div style="background:#ffffff; border-radius:12px; width:100%; max-width:620px; box-shadow:0 20px 40px rgba(0,0,0,0.25); max-height:90vh; overflow-y:auto; padding:28px 32px;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; border-bottom:1px solid #e2e8f0; padding-bottom:14px;">
                        <h2 style="margin:0; font-size:20px; font-weight:700; color:#0f172a;">Edit Product Details</h2>
                        <button type="button" onclick="document.getElementById('nesports-edit-modal').style.display='none';" style="background:none; border:none; font-size:24px; cursor:pointer; color:#94a3b8;">&times;</button>
                    </div>

                    <form method="post" action="<?php echo esc_url(admin_url('admin.php?page=nesports-pro-store')); ?>">
                        <?php wp_nonce_field('nesports_product_action_nonce'); ?>
                        <input type="hidden" name="nesports_product_action" value="edit_product" />
                        <input type="hidden" name="product_slug" id="edit-product-slug" value="" />
                        <input type="hidden" name="redirect_tab" value="products" />

                        <div style="margin-bottom:16px;">
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Product Name *</label>
                            <input type="text" id="edit-product-name" name="product_name" required class="widefat" style="height:40px; border-radius:6px;" />
                        </div>

                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Category *</label>
                                <select id="edit-product-cat" name="product_cat" class="widefat" style="height:40px; border-radius:6px;">
                                    <?php foreach ($categories as $ck => $cv): ?>
                                        <option value="<?php echo esc_attr($ck); ?>"><?php echo esc_html($cv); ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Sale Price (&euro;) *</label>
                                <input type="number" step="0.01" id="edit-product-price" name="product_price" required class="widefat" style="height:40px; border-radius:6px;" />
                            </div>
                        </div>

                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Regular Price (&euro;)</label>
                                <input type="number" step="0.01" id="edit-product-old-price" name="product_old_price" class="widefat" style="height:40px; border-radius:6px;" />
                            </div>
                            <div>
                                <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Sizes</label>
                                <input type="text" id="edit-product-sizes" name="product_sizes" class="widefat" style="height:40px; border-radius:6px;" />
                            </div>
                        </div>

                        <div style="margin-bottom:16px;">
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Colors</label>
                            <input type="text" id="edit-product-colors" name="product_colors" class="widefat" style="height:40px; border-radius:6px;" />
                        </div>

                        <div style="margin-bottom:16px;">
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Main Image (Filename or URL)</label>
                            <div style="display:flex; gap:8px;">
                                <input type="text" id="edit-product-main-img" name="product_main_img" class="widefat" style="height:40px; border-radius:6px;" />
                                <button type="button" class="button" onclick="nesportsSelectMedia('edit-product-main-img')" style="height:40px; white-space:nowrap;">Upload / Media</button>
                            </div>
                        </div>

                        <div style="margin-bottom:22px;">
                            <label style="display:block; font-weight:600; margin-bottom:6px; color:#334155;">Hover Image (Optional)</label>
                            <div style="display:flex; gap:8px;">
                                <input type="text" id="edit-product-hover-img" name="product_hover_img" class="widefat" style="height:40px; border-radius:6px;" />
                                <button type="button" class="button" onclick="nesportsSelectMedia('edit-product-hover-img')" style="height:40px; white-space:nowrap;">Upload / Media</button>
                            </div>
                        </div>

                        <div style="display:flex; justify-content:flex-end; gap:10px; border-top:1px solid #e2e8f0; padding-top:18px;">
                            <button type="button" onclick="document.getElementById('nesports-edit-modal').style.display='none';" class="button button-secondary" style="height:40px; padding:0 16px;">Cancel</button>
                            <button type="submit" class="button button-primary" style="height:40px; padding:0 24px; background:#0f172a; border-color:#0f172a; font-weight:600;">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>

        <style>
        .nes-tab-btn.active {
            color: #e11d48 !important;
            border-bottom-color: #e11d48 !important;
        }
        .nes-accordion-header:hover {
            background: #f1f5f9 !important;
        }
        </style>

        <script>
        function nesSwitchTab(tabId) {
            document.querySelectorAll('.nes-tab-pane').forEach(function(el) {
                el.style.display = 'none';
            });
            document.querySelectorAll('.nes-tab-btn').forEach(function(btn) {
                btn.classList.remove('active');
            });
            var targetPane = document.getElementById('nes-tab-' + tabId);
            if (targetPane) {
                targetPane.style.display = 'block';
            }
            event.currentTarget.classList.add('active');
            // update url without reload
            if (history.pushState) {
                var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?page=nesports-pro-store&tab=' + tabId;
                window.history.pushState({path:newUrl},'',newUrl);
            }
        }

        function nesToggleAccordion(headerEl) {
            var card = headerEl.closest('.nes-accordion-card');
            var body = card.querySelector('.nes-accordion-body');
            var icon = card.querySelector('.nes-accordion-icon');
            if (body.style.display === 'none' || body.style.display === '') {
                body.style.display = 'block';
                if (icon) {
                    icon.classList.remove('dashicons-arrow-right-alt2');
                    icon.classList.add('dashicons-arrow-down-alt2');
                }
            } else {
                body.style.display = 'none';
                if (icon) {
                    icon.classList.remove('dashicons-arrow-down-alt2');
                    icon.classList.add('dashicons-arrow-right-alt2');
                }
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

        function nesportsOpenEditModal(prod) {
            document.getElementById('edit-product-slug').value = prod.slug || '';
            document.getElementById('edit-product-name').value = prod.name || '';
            document.getElementById('edit-product-cat').value = prod.cat || 'belts';
            document.getElementById('edit-product-price').value = prod.price || '';
            document.getElementById('edit-product-old-price').value = prod.old || prod.price || '';
            document.getElementById('edit-product-main-img').value = prod.main || '';
            document.getElementById('edit-product-hover-img').value = prod.hover || '';
            document.getElementById('edit-product-sizes').value = prod.sizes || 'S, M, L, XL';
            document.getElementById('edit-product-colors').value = prod.colors || 'Black';
            document.getElementById('nesports-edit-modal').style.display = 'flex';
        }

        function nesportsSelectMedia(targetInputId) {
            if (typeof wp !== 'undefined' && wp.media) {
                var mediaUploader = wp.media({
                    title: 'Select Image',
                    button: { text: 'Use this Image' },
                    multiple: false
                });
                mediaUploader.on('select', function() {
                    var attachment = mediaUploader.state().get('selection').first().toJSON();
                    document.getElementById(targetInputId).value = attachment.url;
                });
                mediaUploader.open();
            } else {
                var url = prompt('Enter Image URL or Filename:');
                if (url) {
                    document.getElementById(targetInputId).value = url;
                }
            }
        }
        </script>
        <?php
    }

    /**
     * Dedicated Products Manager fallback
     */
    public function render_products_manager() {
        $_GET['tab'] = 'products';
        $this->render_master_dashboard();
    }
}
`;

fs.writeFileSync(adminClassFile, phpCode, 'utf8');
console.log('Successfully updated class-nesports-admin.php with Master Dashboard!');
