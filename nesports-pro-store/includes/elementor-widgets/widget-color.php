<?php
if (!defined('ABSPATH')) {
    exit;
}

use Elementor\Widget_Base;
use Elementor\Controls_Manager;
use Elementor\Repeater;

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

        $this->add_control(
            'section_desc',
            array(
                'label'   => esc_html__('Section Description', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXTAREA,
                'default' => '',
            )
        );

        $this->end_controls_section();

        // Color Products Repeater
        $this->start_controls_section(
            'section_cards',
            array(
                'label' => esc_html__('Color Products', 'nesports-pro-store'),
                'tab'   => Controls_Manager::TAB_CONTENT,
            )
        );

        $repeater = new Repeater();

        $repeater->add_control(
            'name',
            array(
                'label'       => esc_html__('Product Name', 'nesports-pro-store'),
                'type'        => Controls_Manager::TEXT,
                'default'     => 'Lift The World T-Shirt (Crimson Red)',
                'label_block' => true,
            )
        );

        $repeater->add_control(
            'color',
            array(
                'label'   => esc_html__('Color Tab', 'nesports-pro-store'),
                'type'    => Controls_Manager::SELECT,
                'default' => 'red',
                'options' => array(
                    'red'   => esc_html__('RED', 'nesports-pro-store'),
                    'black' => esc_html__('BLACK', 'nesports-pro-store'),
                    'blue'  => esc_html__('BLUE', 'nesports-pro-store'),
                    'green' => esc_html__('GREEN', 'nesports-pro-store'),
                    'grey'  => esc_html__('GREY', 'nesports-pro-store'),
                    'gold'  => esc_html__('GOLD', 'nesports-pro-store'),
                ),
            )
        );

        $repeater->add_control(
            'price',
            array(
                'label'   => esc_html__('Sale Price (€)', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => '€34.99',
            )
        );

        $repeater->add_control(
            'old_price',
            array(
                'label'   => esc_html__('Regular / Old Price (€)', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => '€44.99',
            )
        );

        $repeater->add_control(
            'image',
            array(
                'label'   => esc_html__('Product Image', 'nesports-pro-store'),
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
                'default'     => 'clothing/norm-lift-the-world-red.jpg',
                'placeholder' => 'clothing/norm-lift-the-world-red.jpg',
            )
        );

        $repeater->add_control(
            'url',
            array(
                'label'       => esc_html__('Product Link URL', 'nesports-pro-store'),
                'type'        => Controls_Manager::URL,
                'placeholder' => esc_html__('https://your-link.com', 'nesports-pro-store'),
                'default'     => array(
                    'url' => '/product/lift-the-world-red-edition-t-shirt/',
                ),
            )
        );

        $this->add_control(
            'color_cards',
            array(
                'label'       => esc_html__('Products List', 'nesports-pro-store'),
                'type'        => Controls_Manager::REPEATER,
                'fields'      => $repeater->get_controls(),
                'title_field' => '{{{ name }}} [{{{ color }}}]',
                'default'     => array(
                    array(
                        'name'         => 'Lift The World T-Shirt (Crimson Red)',
                        'color'        => 'red',
                        'price'        => '€34.99',
                        'old_price'    => '€44.99',
                        'fallback_img' => 'clothing/norm-lift-the-world-red.jpg',
                        'url'          => array('url' => '/product/lift-the-world-red-edition-t-shirt/'),
                    ),
                    array(
                        'name'         => 'Pro Powerlifting Lever Belt 10mm (Crimson Red)',
                        'color'        => 'red',
                        'price'        => '€59.99',
                        'old_price'    => '€69.99',
                        'fallback_img' => 'belt-crimson-red-800x800.jpg',
                        'url'          => array('url' => '/product/pro-powerlifting-lever-belt-crimson-red-10mm/'),
                    ),
                    array(
                        'name'         => 'Competition Knee Wraps (Red Stripe)',
                        'color'        => 'red',
                        'price'        => '€29.99',
                        'old_price'    => '€39.99',
                        'fallback_img' => 'knee-wrap-red-stripes-800x800.jpg',
                        'url'          => array('url' => '/product/competition-knee-wraps-red-stripe/'),
                    ),
                    array(
                        'name'         => 'Padded Heavy Lifting Straps (Crimson Red)',
                        'color'        => 'red',
                        'price'        => '€9.99',
                        'old_price'    => '€19.99',
                        'fallback_img' => 'straps-padded-crimson-red-800x800.jpg',
                        'url'          => array('url' => '/product/padded-heavy-lifting-straps-crimson-red/'),
                    ),
                    array(
                        'name'         => 'Speed Ball Set Leather (Red & Black)',
                        'color'        => 'red',
                        'price'        => '€24.99',
                        'old_price'    => '€39.99',
                        'fallback_img' => 'speed-ball-red-1.jpg',
                        'url'          => array('url' => '/product/speed-ball-set-leather-red-black/'),
                    ),
                    array(
                        'name'         => 'Classic Weightlifting Belt Leather (Stealth Black)',
                        'color'        => 'black',
                        'price'        => '€69.99',
                        'old_price'    => '€89.99',
                        'fallback_img' => 'DSC_0167-scaled-1.jpg',
                        'url'          => array('url' => '/product/classic-weightlifting-belt-leather/'),
                    ),
                    array(
                        'name'         => 'Padded Lifting Straps (Royal Blue)',
                        'color'        => 'blue',
                        'price'        => '€14.99',
                        'old_price'    => '€19.99',
                        'fallback_img' => '1-800x800.jpg',
                        'url'          => array('url' => '/product/padded-lifting-straps-royal-blue/'),
                    ),
                ),
            )
        );

        $this->end_controls_section();

        // Styling
        $this->start_controls_section(
            'section_style',
            array(
                'label' => esc_html__('Styling', 'nesports-pro-store'),
                'tab'   => Controls_Manager::TAB_STYLE,
            )
        );

        $this->add_control(
            'title_color',
            array(
                'label'     => esc_html__('Title Color', 'nesports-pro-store'),
                'type'      => Controls_Manager::COLOR,
                'selectors' => array(
                    '{{WRAPPER}} .hb-color-title' => 'color: {{VALUE}};',
                ),
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        include NESPORTS_PLUGIN_DIR . 'templates/sections/section-color.php';
    }
}
