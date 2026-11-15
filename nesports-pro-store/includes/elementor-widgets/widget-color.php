<?php
if (!defined('ABSPATH')) {
    exit;
}

use Elementor\Widget_Base;
use Elementor\Controls_Manager;

class NESports_Elementor_Color_Widget extends Widget_Base {

    public function get_name() {
        return 'nesports_color_widget';
    }

    public function get_title() {
        return esc_html__('NE Sports Shop by Color', 'nesports-pro-store');
    }

    public function get_icon() {
        return 'eicon-color-picker';
    }

    public function get_categories() {
        return array('nesports-pro');
    }

    public function get_keywords() {
        return array('color', 'colour', 'shop', 'palette', 'carousel', 'nesports');
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
                'default' => 'Shop by Colour',
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        include NESPORTS_PLUGIN_DIR . 'templates/sections/section-color.php';
    }
}
