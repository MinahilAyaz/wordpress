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
            'section_desc',
            array(
                'label'   => esc_html__('Section Description', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXTAREA,
                'default' => 'Power, protection & performance built into every stack. Stack and save.',
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

        $repeater = new Repeater();

        $repeater->add_control(
            'bundle_name',
            array(
                'label'       => esc_html__('Bundle / Pack Name', 'nesports-pro-store'),
                'type'        => Controls_Manager::TEXT,
                'default'     => 'Pro Power Pack',
                'label_block' => true,
            )
        );

        $repeater->add_control(
            'bundle_cat',
            array(
                'label'   => esc_html__('Filter Category', 'nesports-pro-store'),
                'type'    => Controls_Manager::SELECT,
                'default' => 'training',
                'options' => array(
                    'training' => esc_html__('Training Packs', 'nesports-pro-store'),
                    'lifting'  => esc_html__('Lifting Packs', 'nesports-pro-store'),
                    'legs'     => esc_html__('Leg & Knee Packs', 'nesports-pro-store'),
                    'custom'   => esc_html__('+ Add New Category (Custom)', 'nesports-pro-store'),
                ),
            )
        );

        $repeater->add_control(
            'custom_cat',
            array(
                'label'       => esc_html__('New Category Name', 'nesports-pro-store'),
                'type'        => Controls_Manager::TEXT,
                'default'     => '',
                'placeholder' => esc_html__('e.g. Wrist Packs, Speed Ball, Belts...', 'nesports-pro-store'),
                'description' => esc_html__('Type any new category name. It will automatically show as a filter tab button at the top!', 'nesports-pro-store'),
                'condition'   => array(
                    'bundle_cat' => 'custom',
                ),
            )
        );

        $repeater->add_control(
            'bundle_price',
            array(
                'label'   => esc_html__('Sale Price (€)', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => '€59.99',
            )
        );

        $repeater->add_control(
            'bundle_old_price',
            array(
                'label'   => esc_html__('Regular Price (€)', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => '€79.99',
            )
        );

        $repeater->add_control(
            'bundle_image',
            array(
                'label'   => esc_html__('Image', 'nesports-pro-store'),
                'type'    => Controls_Manager::MEDIA,
                'default' => array(
                    'url' => \Elementor\Utils::get_placeholder_image_src(),
                ),
            )
        );

        $repeater->add_control(
            'bundle_link',
            array(
                'label'       => esc_html__('Link', 'nesports-pro-store'),
                'type'        => Controls_Manager::URL,
                'placeholder' => esc_html__('https://your-link.com', 'nesports-pro-store'),
                'default'     => array(
                    'url' => '/shop/',
                ),
            )
        );

        $this->add_control(
            'custom_bundles',
            array(
                'label'       => esc_html__('Custom Bundles & Packs (Leave empty to use catalog defaults)', 'nesports-pro-store'),
                'type'        => Controls_Manager::REPEATER,
                'fields'      => $repeater->get_controls(),
                'title_field' => '{{{ bundle_name }}}',
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
        $settings = $this->get_settings_for_display();
        include NESPORTS_PLUGIN_DIR . 'templates/sections/section-bundles.php';
    }
}

