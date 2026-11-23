<?php
/**
 * Plugin Name: NESPORTS3 Direct Story Logo V55
 * Description: Replaces story image with the selected wrist wraps image
 * Version: 55.0.0
 * Author: NESports
 */

$wrist_wrap_img = 'https://www.nesports3.com/wp-content/uploads/2026/09/WhatsApp-Image-2026-07-14-.jpeg';

// Filter HTML of the elementor widget
add_filter('elementor/widget/render_content', function($content, $widget) use ($wrist_wrap_img) {
    if ($widget->get_name() === 'nesports_story_widget') {
        $content = preg_replace(
            '/src=["\'][^"\']*(?:WhatsApp-Image|logo\.png)[^"\']*["\']/i',
            'src="' . esc_url($wrist_wrap_img) . '"',
            $content
        );
    }
    return $content;
}, 99, 2);

// Filter the_content
add_filter('the_content', function($content) use ($wrist_wrap_img) {
    if (is_page(array(30090, 'our-story', 'about-us'))) {
        $content = preg_replace(
            '/src=["\'][^"\']*(?:WhatsApp-Image|logo\.png)[^"\']*["\']/i',
            'src="' . esc_url($wrist_wrap_img) . '"',
            $content
        );
    }
    return $content;
}, 99);

// Buffer output just in case template is loaded directly
add_action('template_redirect', function() use ($wrist_wrap_img) {
    if (is_page(array(30090, 'our-story', 'about-us')) || (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], 'our-story') !== false)) {
        ob_start(function($html) use ($wrist_wrap_img) {
            return preg_replace(
                '/src=["\'][^"\']*(?:WhatsApp-Image|logo\.png)[^"\']*["\']/i',
                'src="' . esc_url($wrist_wrap_img) . '"',
                $html
            );
        });
    }
}, 1);

// Update database post meta as well
add_action('init', function() use ($wrist_wrap_img) {
    $post_id = 30090;
    
    // Also update nesports_store_settings
    $settings = get_option('nesports_store_settings', array());
    $settings['about_feature_img'] = $wrist_wrap_img;
    update_option('nesports_store_settings', $settings);
    
    // Clear elementor cache
    if (class_exists('\Elementor\Plugin')) {
        \Elementor\Plugin::$instance->files_manager->clear_cache();
    }
}, 5);
