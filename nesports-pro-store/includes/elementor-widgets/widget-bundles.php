<?php
if (!defined('ABSPATH')) {
    exit;
}

use Elementor\Widget_Base;
use Elementor\Controls_Manager;
use Elementor\Repeater;

class NESports_Elementor_Bundles_Widget extends Widget_Base {

    public function get_name() {
        return 'nesports_bundles_widget';
    }

    public function get_title() {
        return esc_html__('NE Sports Packs & Bundles', 'nesports-pro-store');
    }

    public function get_icon() {
        return 'eicon-product-price-list';
    }

    public function get_categories() {
        return array('nesports-pro');
    }

    public function get_keywords() {
        return array('bundles', 'packs', 'discount', 'products', 'nesports');
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
                'default' => 'Bundles',
            )
        );

        $this->add_control(
            'show_filters',
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

        // Style Section
        $this->start_controls_section(
            'section_style',
            array(
                'label' => esc_html__('Styling', 'nesports-pro-store'),
                'tab'   => Controls_Manager::TAB_STYLE,
            )
        );

        $this->add_control(
            'badge_color',
            array(
                'label'     => esc_html__('Save % Badge Color', 'nesports-pro-store'),
                'type'      => Controls_Manager::COLOR,
                'selectors' => array(
                    '{{WRAPPER}} .hb-bundle-badge' => 'background: {{VALUE}};',
                ),
            )
        );

        $this->add_control(
            'button_color',
            array(
                'label'     => esc_html__('Add To Cart Button Color', 'nesports-pro-store'),
                'type'      => Controls_Manager::COLOR,
                'selectors' => array(
                    '{{WRAPPER}} .hb-card-quick-add' => 'background: {{VALUE}};',
                ),
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        include NESPORTS_PLUGIN_DIR . 'templates/sections/section-bundles.php';
    }
}

