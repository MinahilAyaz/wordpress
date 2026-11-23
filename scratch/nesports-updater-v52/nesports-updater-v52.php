<?php
/**
 * Plugin Name: NESPORTS3 Live Story Publisher V52
 * Description: Directly publishes the logo to post 30090 and clears Elementor cache
 * Version: 52.0.0
 * Author: NESports
 */

add_action('init', function() {
    $logo_url = 'https://www.nesports3.com/wp-content/uploads/2025/08/logo.png';
    $post_id = 30090;

    // 1. Update nesports_store_settings
    $settings = get_option('nesports_store_settings', array());
    $settings['about_feature_img'] = $logo_url;
    update_option('nesports_store_settings', $settings);

    // 2. Build Elementor data without htmlCache so it re-renders fresh
    $zero_pad = array('unit' => 'px', 'top' => '0', 'right' => '0', 'bottom' => '0', 'left' => '0', 'isLinked' => true);
    $data = array(
        array(
            'id'       => 'nesstry01',
            'elType'   => 'container',
            'settings' => array('content_width' => 'full', 'padding' => $zero_pad, 'margin' => $zero_pad),
            'elements' => array(
                array(
                    'id'         => 'nesstryw1',
                    'elType'     => 'widget',
                    'widgetType' => 'nesports_story_widget',
                    'settings'   => array(
                        'banner_title' => 'About Us',
                        'image'        => array(
                            'url' => $logo_url,
                            'id'  => 29108,
                        ),
                        'fallback_img' => $logo_url,
                    ),
                    'elements'   => array(),
                ),
            ),
            'isInner'  => false,
        ),
    );

    update_post_meta($post_id, '_elementor_data', wp_slash(wp_json_encode($data)));
    update_post_meta($post_id, '_elementor_edit_mode', 'builder');
    update_post_meta($post_id, '_nesports_page_type', 'our-story');
    update_post_meta($post_id, '_nesports_elementor_seeded', '1');

    // 3. Clear Elementor CSS cache
    if (class_exists('\Elementor\Plugin')) {
        \Elementor\Plugin::$instance->files_manager->clear_cache();
    }

    // Touch post to update modified date
    wp_update_post(array('ID' => $post_id, 'post_status' => 'publish'));
}, 5);
