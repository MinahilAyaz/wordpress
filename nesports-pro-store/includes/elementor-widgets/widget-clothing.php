<?php
if (!defined('ABSPATH')) {
    exit;
}

use Elementor\Widget_Base;
use Elementor\Controls_Manager;
use Elementor\Repeater;

class NESports_Elementor_Clothing_Widget extends Widget_Base {

    public function get_name() {
        return 'nesports_clothing_widget';
    }

    public function get_title() {
        return esc_html__('NE Sports Clothing Carousel', 'nesports-pro-store');
    }

    public function get_icon() {
        return 'eicon-posts-carousel';
    }

    public function get_categories() {
        return array('nesports-pro');
    }

    public function get_keywords() {
        return array('clothing', 'apparel', 't-shirts', 'carousel', 'slider', 'nesports');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_content',
            array(
                'label' => esc_html__('Section Header', 'nesports-pro-store'),
                'tab'   => Controls_Manager::TAB_CONTENT,
            )
        );

        $this->add_control(
            'section_title',
            array(
                'label'   => esc_html__('Section Title', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => 'Clothing',
            )
        );

        $this->add_control(
            'section_desc',
            array(
                'label'   => esc_html__('Section Description', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXTAREA,
                'default' => '',
            )
        );

        $this->end_controls_section();

        // Clothing Items Repeater
        $this->start_controls_section(
            'section_items',
            array(
                'label' => esc_html__('Clothing Cards', 'nesports-pro-store'),
                'tab'   => Controls_Manager::TAB_CONTENT,
            )
        );

        $repeater = new Repeater();

        $repeater->add_control(
            'title',
            array(
                'label'       => esc_html__('Item Title', 'nesports-pro-store'),
                'type'        => Controls_Manager::TEXT,
                'default'     => 'T-Shirts & Tanks',
                'label_block' => true,
            )
        );

        $repeater->add_control(
            'image',
            array(
                'label'   => esc_html__('Card Image', 'nesports-pro-store'),
                'type'    => Controls_Manager::MEDIA,
                'default' => array(
                    'url' => '',
                ),
            )
        );

        $repeater->add_control(
            'fallback_img',
            array(
                'label'       => esc_html__('Internal Image (Fallback)', 'nesports-pro-store'),
                'type'        => Controls_Manager::TEXT,
                'default'     => 'clothing/44.png',
                'placeholder' => 'clothing/44.png',
            )
        );

        $repeater->add_control(
            'url',
            array(
                'label'       => esc_html__('Link URL', 'nesports-pro-store'),
                'type'        => Controls_Manager::URL,
                'placeholder' => esc_html__('https://your-link.com', 'nesports-pro-store'),
                'default'     => array(
                    'url' => '/product-category/clothing/',
                ),
            )
        );

        $this->add_control(
            'clothing_items',
            array(
                'label'       => esc_html__('Items', 'nesports-pro-store'),
                'type'        => Controls_Manager::REPEATER,
                'fields'      => $repeater->get_controls(),
                'title_field' => '{{{ title }}}',
                'default'     => array(
                    array(
                        'title'        => 'T-Shirts & Tanks',
                        'fallback_img' => 'clothing/44.png',
                        'url'          => array('url' => '/product-category/clothing/'),
                    ),
                    array(
                        'title'        => 'Hoodies & Sweats',
                        'fallback_img' => 'clothing/55.png',
                        'url'          => array('url' => '/product-category/clothing/'),
                    ),
                    array(
                        'title'        => 'Shorts & Bottoms',
                        'fallback_img' => 'clothing/66.png',
                        'url'          => array('url' => '/product-category/clothing/'),
                    ),
                    array(
                        'title'        => 'Performance Wear',
                        'fallback_img' => 'clothing/11.png',
                        'url'          => array('url' => '/product-category/clothing/'),
                    ),
                ),
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        include NESPORTS_PLUGIN_DIR . 'templates/sections/section-clothing.php';
    }
}
