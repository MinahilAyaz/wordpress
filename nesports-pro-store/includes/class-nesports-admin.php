<?php
if (!defined('ABSPATH')) {
    exit;
}

class NESports_Admin {

    public function init() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_action('wp_ajax_nesports_regenerate_pages', array($this, 'ajax_regenerate_pages'));
    }

    /**
     * Add admin menu
     */
    public function add_admin_menu() {
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
     * Enqueue Admin Assets
     */
    public function enqueue_admin_assets($hook) {
        if (strpos($hook, 'nesports-pro-store') === false) {
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
                    <button type="button" id="btn-regenerate-pages" class="button button-primary button-hero">
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
                                    value="<?php echo esc_attr(isset($settings['announcement_text']) ? $settings['announcement_text'] : 'FREE WORLDWIDE SHIPPING OVER $75 • LIFETIME LEVER WARRANTY'); ?>" 
                                    class="widefat" />
                                <p class="description">Displays across the very top bar of every page, exactly like hardbody.store.</p>
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
                                    value="<?php echo esc_attr(isset($settings['accent_color']) ? $settings['accent_color'] : '#e60000'); ?>" />
                                <span class="description">Default is Hardbody-grade Crimson Red (<code>#e60000</code>).</span>
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

