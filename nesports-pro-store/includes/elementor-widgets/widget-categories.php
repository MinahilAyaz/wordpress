<?php
if (!defined('ABSPATH')) {
    exit;
}

use Elementor\Widget_Base;
use Elementor\Controls_Manager;
use Elementor\Repeater;

class NESports_Elementor_Categories_Widget extends Widget_Base {

    public function get_name() {
        return 'nesports_categories_widget';
    }

    public function get_title() {
        return esc_html__('NE Sports Popular Categories', 'nesports-pro-store');
    }

    public function get_icon() {
        return 'eicon-gallery-grid';
    }

    public function get_categories() {
        return array('nesports-pro');
    }

    public function get_keywords() {
        return array('categories', 'grid', 'cards', 'collections', 'nesports');
    }

    protected function register_controls() {
        // Content Section
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
                'default' => 'Top Sellers',
            )
        );

        $this->end_controls_section();

        // Categories Repeater
        $this->start_controls_section(
            'section_cards',
            array(
                'label' => esc_html__('Category Cards', 'nesports-pro-store'),
                'tab'   => Controls_Manager::TAB_CONTENT,
            )
        );

        $repeater = new Repeater();

        $repeater->add_control(
            'title',
            array(
                'label'       => esc_html__('Category Name', 'nesports-pro-store'),
                'type'        => Controls_Manager::TEXT,
                'default'     => 'Weightlifting Belts',
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
                'label'   => esc_html__('Internal Image Filename (Fallback)', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => 'DSC_0167-scaled-1.jpg',
            )
        );

        $repeater->add_control(
            'url',
            array(
                'label'       => esc_html__('Link URL', 'nesports-pro-store'),
                'type'        => Controls_Manager::URL,
                'placeholder' => esc_html__('https://your-link.com', 'nesports-pro-store'),
                'default'     => array(
                    'url' => '/product-category/weightlifting-belts/',
                ),
            )
        );

        $this->add_control(
            'categories',
            array(
                'label'       => esc_html__('Categories', 'nesports-pro-store'),
                'type'        => Controls_Manager::REPEATER,
                'fields'      => $repeater->get_controls(),
                'title_field' => '{{{ title }}}',
                'default'     => array(
                    array(
                        'title'        => 'Weightlifting Belts',
                        'fallback_img' => 'DSC_0167-scaled-1.jpg',
                        'url'          => array('url' => '/product-category/weightlifting-belts/'),
                    ),
                    array(
                        'title'        => 'Lifting Straps',
                        'fallback_img' => '1-800x800.jpg',
                        'url'          => array('url' => '/product-category/lifting-straps/'),
                    ),
                    array(
                        'title'        => 'Elbow Wraps',
                        'fallback_img' => 'Knee-Wrap-800x800.jpg',
                        'url'          => array('url' => '/product-category/elbow-wrap/'),
                    ),
                    array(
                        'title'        => 'Wrist Straps',
                        'fallback_img' => 'Wrist-Bandage-Black-800x800.jpg',
                        'url'          => array('url' => '/product-category/wrist-straps/'),
                    ),
                    array(
                        'title'        => 'Gym Bags',
                        'fallback_img' => 'Gym-Bag-8-800x800.jpg',
                        'url'          => array('url' => '/product-category/gym-bag/'),
                    ),
                ),
            )
        );

        $this->end_controls_section();

        // Style Section
        $this->start_controls_section(
            'section_style',
            array(
                'label' => esc_html__('Styling', 'nesports-pro-store'),
                'tab'   => Controls_Manager::TAB_STYLE,
            )
        );

        $this->add_control(
            'heading_color',
            array(
                'label'     => esc_html__('Title Color', 'nesports-pro-store'),
                'type'      => Controls_Manager::COLOR,
                'selectors' => array(
                    '{{WRAPPER}} .hb-collections-title' => 'color: {{VALUE}};',
                ),
            )
        );

        $this->add_control(
            'card_title_color',
            array(
                'label'     => esc_html__('Card Label Color', 'nesports-pro-store'),
                'type'      => Controls_Manager::COLOR,
                'selectors' => array(
                    '{{WRAPPER}} .hb-category-title' => 'color: {{VALUE}};',
                ),
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        include NESPORTS_PLUGIN_DIR . 'templates/sections/section-categories.php';
    }
}

