<?php
/**
 * Plugin Name: NESPORTS3 Direct Story Logo V54
 * Description: Replaces story image with logo on all story renders
 * Version: 54.0.0
 * Author: NESports
 */

$logo_url = 'https://www.nesports3.com/wp-content/uploads/2025/08/logo.png';

// Filter HTML of the elementor widget
add_filter('elementor/widget/render_content', function($content, $widget) use ($logo_url) {
    if ($widget->get_name() === 'nesports_story_widget') {
        $content = preg_replace(
            '/src=["\'][^"\']*WhatsApp-Image[^"\']*["\']/i',
            'src="' . esc_url($logo_url) . '"',
            $content
        );
    }
    return $content;
}, 99, 2);

// Filter the_content
add_filter('the_content', function($content) use ($logo_url) {
    if (is_page(array(30090, 'our-story', 'about-us'))) {
        $content = preg_replace(
            '/src=["\'][^"\']*WhatsApp-Image[^"\']*["\']/i',
            'src="' . esc_url($logo_url) . '"',
            $content
        );
    }
    return $content;
}, 99);

// Buffer output just in case template is loaded directly
add_action('template_redirect', function() use ($logo_url) {
    if (is_page(array(30090, 'our-story', 'about-us')) || (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], 'our-story') !== false)) {
        ob_start(function($html) use ($logo_url) {
            return preg_replace(
                '/src=["\'][^"\']*WhatsApp-Image[^"\']*["\']/i',
                'src="' . esc_url($logo_url) . '"',
                $html
            );
        });
    }
}, 1);

// Update database post meta as well
add_action('init', function() use ($logo_url) {
    $post_id = 30090;
    $meta = get_post_meta($post_id, '_elementor_data', true);
    if (!empty($meta) && strpos($meta, 'WhatsApp-Image') !== false) {
        $updated = str_replace('WhatsApp-Image-2024-07-08-at-19.17.50_f9c47d7b-800x530.jpg', $logo_url, $meta);
        update_post_meta($post_id, '_elementor_data', wp_slash($updated));
    }
    
    // Also update nesports_store_settings
    $settings = get_option('nesports_store_settings', array());
    $settings['about_feature_img'] = $logo_url;
    update_option('nesports_store_settings', $settings);
    
    // Clear elementor cache
    if (class_exists('\Elementor\Plugin')) {
        \Elementor\Plugin::$instance->files_manager->clear_cache();
    }
}, 5);
