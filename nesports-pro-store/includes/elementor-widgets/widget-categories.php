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
        return array('categories', 'grid', 'cards', 'collections', 'nesports', 'top sellers');
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

        $this->add_control(
            'show_filter_pills',
            array(
                'label'        => esc_html__('Show Filter Pills', 'nesports-pro-store'),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => esc_html__('Yes', 'nesports-pro-store'),
                'label_off'    => esc_html__('No', 'nesports-pro-store'),
                'return_value' => 'yes',
                'default'      => 'yes',
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
            'subtitle',
            array(
                'label'       => esc_html__('Subtitle / Product Spec', 'nesports-pro-store'),
                'type'        => Controls_Manager::TEXT,
                'default'     => '',
                'placeholder' => esc_html__('e.g. Genuine Leather 10mm', 'nesports-pro-store'),
            )
        );

        $repeater->add_control(
            'price',
            array(
                'label'       => esc_html__('Price (€)', 'nesports-pro-store'),
                'type'        => Controls_Manager::TEXT,
                'default'     => '',
                'placeholder' => esc_html__('e.g. €59.99', 'nesports-pro-store'),
            )
        );

        $repeater->add_control(
            'old_price',
            array(
                'label'       => esc_html__('Old Price (€)', 'nesports-pro-store'),
                'type'        => Controls_Manager::TEXT,
                'default'     => '',
                'placeholder' => esc_html__('e.g. €69.99', 'nesports-pro-store'),
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
                'label'       => esc_html__('Internal Image Filename (Fallback)', 'nesports-pro-store'),
                'type'        => Controls_Manager::TEXT,
                'default'     => '',
                'placeholder' => 'DSC_0167-scaled-1.jpg',
            )
        );

        $repeater->add_control(
            'url',
            array(
                'label'       => esc_html__('Link URL', 'nesports-pro-store'),
                'type'        => Controls_Manager::URL,
                'placeholder' => esc_html__('https://your-link.com', 'nesports-pro-store'),
                'default'     => array(
                    'url' => '',
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
                        'subtitle'     => 'Genuine Leather 10mm',
                        'price'        => '€59.99',
                        'old_price'    => '€69.99',
                        'fallback_img' => 'DSC_0167-scaled-1.jpg',
                        'url'          => array('url' => '/product-category/weightlifting-belts/'),
                    ),
                    array(
                        'title'        => 'Lifting Straps',
                        'subtitle'     => 'Padded Heavy Duty Grip',
                        'price'        => '€9.99',
                        'old_price'    => '€14.99',
                        'fallback_img' => '1-800x800.jpg',
                        'url'          => array('url' => '/product-category/lifting-straps/'),
                    ),
                    array(
                        'title'        => 'Elbow Wraps',
                        'subtitle'     => 'Compression Stability',
                        'price'        => '€14.99',
                        'old_price'    => '€18.99',
                        'fallback_img' => 'Knee-Wrap-800x800.jpg',
                        'url'          => array('url' => '/product-category/elbow-wrap/'),
                    ),
                    array(
                        'title'        => 'Wrist Straps',
                        'subtitle'     => 'Thumb Loop Reinforcement',
                        'price'        => '€12.99',
                        'old_price'    => '€15.99',
                        'fallback_img' => 'Wrist-Bandage-Black-800x800.jpg',
                        'url'          => array('url' => '/product-category/wrist-straps/'),
                    ),
                    array(
                        'title'        => 'Gym Bags',
                        'subtitle'     => 'Waterproof Athletic Pack',
                        'price'        => '€8.99',
                        'old_price'    => '€11.99',
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
                    '{{WRAPPER}} .hb-top-sellers-title' => 'color: {{VALUE}};',
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
        $settings = $this->get_settings_for_display();
        include NESPORTS_PLUGIN_DIR . 'templates/sections/section-categories.php';
    }
}
