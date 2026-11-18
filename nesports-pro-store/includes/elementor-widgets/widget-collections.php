<?php
if (!defined('ABSPATH')) {
    exit;
}

use Elementor\Widget_Base;
use Elementor\Controls_Manager;

class NESports_Elementor_Collections_Widget extends Widget_Base {

    public function get_name() {
        return 'nesports_collections_widget';
    }

    public function get_title() {
        return esc_html__('NE Sports Collections Carousel', 'nesports-pro-store');
    }

    public function get_icon() {
        return 'eicon-gallery-grid';
    }

    public function get_categories() {
        return array('nesports-pro');
    }

    public function get_keywords() {
        return array('collections', 'categories', 'carousel', 'nesports');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_content',
            array(
                'label' => esc_html__('Collections Settings', 'nesports-pro-store'),
                'tab'   => Controls_Manager::TAB_CONTENT,
            )
        );

        $this->add_control(
            'section_title',
            array(
                'label'   => esc_html__('Section Title', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => 'Collections',
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        include NESPORTS_PLUGIN_DIR . 'templates/sections/section-collections-carousel.php';
    }
}
