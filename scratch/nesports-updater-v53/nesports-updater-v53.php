<?php
/**
 * Plugin Name: NESPORTS3 Direct Story Logo V53
 * Description: Directly publishes the logo to post 30090 and clears Elementor cache
 * Version: 53.0.0
 * Author: NESports
 */

add_action('init', function() {
    $logo_url = 'https://www.nesports3.com/wp-content/uploads/2025/08/logo.png';
    $post_id = 30090;

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

    // Update in database directly
    update_post_meta($post_id, '_elementor_data', wp_slash(wp_json_encode($data)));
    delete_post_meta($post_id, '_elementor_css');
    
    // Also update settings fallback
    $settings = get_option('nesports_store_settings', array());
    $settings['about_feature_img'] = $logo_url;
    update_option('nesports_store_settings', $settings);

    // If query param set, die with success
    if (isset($_GET['test_story_v53'])) {
        wp_die('V53_SUCCESS: Logo updated on post 30090');
    }
}, 1);
