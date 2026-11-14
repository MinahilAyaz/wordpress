<?php
if (!defined('ABSPATH')) {
    exit;
}

class NESports_Activator {

    /**
     * Runs on plugin activation
     */
    public static function activate() {
        self::set_default_options();
        self::generate_all_pages();
    }

    /**
     * Runs on plugin deactivation
     */
    public static function deactivate() {
        // We do not delete pages upon deactivation to preserve user content,
        // but flush rewrite rules cleanly.
        flush_rewrite_rules();
    }

    /**
     * Set default plugin settings
     */
    public static function set_default_options() {
        $default_settings = array(
            'announcement_text' => 'Free shipping on all orders',
            'announcement_active' => 'yes',
            'hero_badge'        => 'ENGINEERED FOR THE RELENTLESS',
            'hero_title'        => 'BUILT TO OUTLAST YOUR HARDEST SETS',
            'hero_subtitle'     => 'Competition-grade lever belts, reinforced padded straps, and elite lifting accessories engineered for maximum PRs.',
            'hero_primary_cta'  => 'SHOP LEVER BELTS',
            'hero_primary_url'  => '/product-category/weightlifting-belts/',
            'hero_secondary_cta'=> 'EXPLORE ALL GEAR',
            'hero_secondary_url'=> '/shop/',
            'accent_color'      => '#e11d48',
            'support_email'     => 'support@nesports3.com',
            'support_phone'     => '+1 (800) 555-0199',
            'instagram_url'     => 'https://instagram.com/nesports3',
            'youtube_url'       => 'https://youtube.com',
        );

        if (!get_option('nesports_store_settings')) {
            update_option('nesports_store_settings', $default_settings);
        }
    }

    /**
     * Generate or update all website pages
     */
    public static function generate_all_pages() {
        $pages = array(
            'home' => array(
                'title'     => 'NE Sports | Elite Weightlifting & Powerlifting Gear',
                'slug'      => 'home',
                'content'   => '<!-- NESPORTS_PRO_HOME_PAGE -->',
                'template'  => 'templates/page-home.php',
                'set_front' => true,
            ),
            'our-story' => array(
                'title'     => 'The NE Sports Story & Mission',
                'slug'      => 'our-story',
                'content'   => '<!-- NESPORTS_PRO_STORY_PAGE -->',
                'template'  => 'templates/page-story.php',
                'set_front' => false,
            ),
            'contact' => array(
                'title'     => 'Contact & Help Center',
                'slug'      => 'contact-us',
                'content'   => '<!-- NESPORTS_PRO_CONTACT_PAGE -->',
                'template'  => 'templates/page-contact.php',
                'set_front' => false,
            ),
            'shop' => array(
                'title'     => 'Shop All Products',
                'slug'      => 'shop',
                'content'   => '<!-- NESPORTS_PRO_SHOP_PAGE -->',
                'template'  => 'templates/page-category.php',
                'set_front' => false,
            )
        );

        $created_pages = get_option('nesports_generated_pages', array());

        foreach ($pages as $key => $page_data) {
            $existing_page_id = isset($created_pages[$key]) ? $created_pages[$key] : 0;
            $page_obj = $existing_page_id ? get_post($existing_page_id) : null;

            // Check if page already exists by path if not in options
            if (!$page_obj) {
                $page_by_path = get_page_by_path($page_data['slug']);
                if ($page_by_path) {
                    $existing_page_id = $page_by_path->ID;
                    $page_obj = $page_by_path;
                }
            }

            if (!$page_obj || $page_obj->post_status === 'trash') {
                $new_page_id = wp_insert_post(array(
                    'post_title'     => $page_data['title'],
                    'post_name'      => $page_data['slug'],
                    'post_content'   => $page_data['content'],
                    'post_status'    => 'publish',
                    'post_type'      => 'page',
                    'comment_status' => 'closed',
                    'ping_status'    => 'closed',
                ));

                if (!is_wp_error($new_page_id)) {
                    $created_pages[$key] = $new_page_id;
                    update_post_meta($new_page_id, '_nesports_page_type', $key);
                    update_post_meta($new_page_id, '_wp_page_template', $page_data['template']);
                }
            } else {
                $created_pages[$key] = $page_obj->ID;
                update_post_meta($page_obj->ID, '_nesports_page_type', $key);
                update_post_meta($page_obj->ID, '_wp_page_template', $page_data['template']);
            }

            // Set Front Page if requested
            if (!empty($page_data['set_front']) && isset($created_pages[$key])) {
                update_option('show_on_front', 'page');
                update_option('page_on_front', $created_pages[$key]);
            }
        }

        update_option('nesports_generated_pages', $created_pages);

        // Setup Primary Menu
        self::setup_navigation_menu($created_pages);

        flush_rewrite_rules();
        return $created_pages;
    }

    /**
     * Create or update navigation menu
     */
    private static function setup_navigation_menu($created_pages) {
        $menu_name = 'NE Sports Pro Navigation';
        $menu_exists = wp_get_nav_menu_object($menu_name);

        if (!$menu_exists) {
            $menu_id = wp_create_nav_menu($menu_name);
            if (!is_wp_error($menu_id)) {
                // Add Belts Category Link
                wp_update_nav_menu_item($menu_id, 0, array(
                    'menu-item-title'  => __('Weightlifting Belts', 'nesports-pro-store'),
                    'menu-item-url'    => home_url('/product-category/weightlifting-belts/'),
                    'menu-item-status' => 'publish',
                ));

                // Add Straps Category Link
                wp_update_nav_menu_item($menu_id, 0, array(
                    'menu-item-title'  => __('Lifting Straps', 'nesports-pro-store'),
                    'menu-item-url'    => home_url('/product-category/lifting-straps/'),
                    'menu-item-status' => 'publish',
                ));

                // Add Knee Wraps
                wp_update_nav_menu_item($menu_id, 0, array(
                    'menu-item-title'  => __('Knee & Elbow Wraps', 'nesports-pro-store'),
                    'menu-item-url'    => home_url('/product-category/knee-wrap/'),
                    'menu-item-status' => 'publish',
                ));

                // Add Gym Bags
                wp_update_nav_menu_item($menu_id, 0, array(
                    'menu-item-title'  => __('Gym Bags', 'nesports-pro-store'),
                    'menu-item-url'    => home_url('/product-category/gym-bag/'),
                    'menu-item-status' => 'publish',
                ));

                // Add Story Page
                if (isset($created_pages['our-story'])) {
                    wp_update_nav_menu_item($menu_id, 0, array(
                        'menu-item-object-id' => $created_pages['our-story'],
                        'menu-item-object'    => 'page',
                        'menu-item-type'      => 'post_type',
                        'menu-item-status'    => 'publish',
                    ));
                }

                // Assign menu to primary theme location
                $locations = get_theme_mod('nav_menu_locations');
                if (is_array($locations)) {
                    $locations['primary'] = $menu_id;
                    $locations['main_menu'] = $menu_id;
                    set_theme_mod('nav_menu_locations', $locations);
                }
            }
        }
    }
}

