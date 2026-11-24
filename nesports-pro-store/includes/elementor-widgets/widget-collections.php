<?php
if (!defined('ABSPATH')) {
    exit;
}

use Elementor\Widget_Base;
use Elementor\Controls_Manager;
use Elementor\Repeater;

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
        return array('collections', 'categories', 'carousel', 'nesports', 'cards');
    }

    protected function register_controls() {
        // Section Header
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

        $this->add_control(
            'section_desc',
            array(
                'label'   => esc_html__('Section Description', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXTAREA,
                'default' => '',
            )
        );

        $this->end_controls_section();

        // Cards Repeater
        $this->start_controls_section(
            'section_cards',
            array(
                'label' => esc_html__('Collection Cards', 'nesports-pro-store'),
                'tab'   => Controls_Manager::TAB_CONTENT,
            )
        );

        $repeater = new Repeater();

        $repeater->add_control(
            'title',
            array(
                'label'       => esc_html__('Card Title', 'nesports-pro-store'),
                'type'        => Controls_Manager::TEXT,
                'default'     => 'LEVER BELTS',
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
                'default'     => 'DSC_0167-scaled-1.jpg',
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
                    'url' => '/product-category/weightlifting-belts/',
                ),
            )
        );

        $this->add_control(
            'collection_cards',
            array(
                'label'       => esc_html__('Cards', 'nesports-pro-store'),
                'type'        => Controls_Manager::REPEATER,
                'fields'      => $repeater->get_controls(),
                'title_field' => '{{{ title }}}',
                'default'     => array(
                    array(
                        'title'        => 'LEVER BELTS',
                        'fallback_img' => 'DSC_0167-scaled-1.jpg',
                        'url'          => array('url' => '/product-category/weightlifting-belts/'),
                    ),
                    array(
                        'title'        => 'LIFTING STRAPS',
                        'fallback_img' => '1-800x800.jpg',
                        'url'          => array('url' => '/product-category/lifting-straps/'),
                    ),
                    array(
                        'title'        => 'KNEE WRAPS',
                        'fallback_img' => 'Knee-Wrap-800x800.jpg',
                        'url'          => array('url' => '/product-category/knee-wrap/'),
                    ),
                    array(
                        'title'        => 'WRIST WRAPS',
                        'fallback_img' => 'Wrist-Bandage-Black-800x800.jpg',
                        'url'          => array('url' => '/product-category/wrist-straps/'),
                    ),
                    array(
                        'title'        => 'ELBOW WRAPS',
                        'fallback_img' => 'Elbow-Wrap-1-scaled.jpg',
                        'url'          => array('url' => '/product-category/elbow-wrap/'),
                    ),
                    array(
                        'title'        => 'DIP BELTS',
                        'fallback_img' => 'Dip-Belt-800x800.jpg',
                        'url'          => array('url' => '/product-category/weightlifting-belts/'),
                    ),
                    array(
                        'title'        => 'GYM BAGS',
                        'fallback_img' => 'Gym-Bag-8-800x800.jpg',
                        'url'          => array('url' => '/product-category/gym-bag/'),
                    ),
                    array(
                        'title'        => 'SPEED BALLS',
                        'fallback_img' => 'speed-ball-red-1.jpg',
                        'url'          => array('url' => '/product-category/speed-ball/'),
                    ),
                    array(
                        'title'        => 'BARBELL PADS',
                        'fallback_img' => 'Barbell-Pad-1-scaled.jpg',
                        'url'          => array('url' => '/product-category/barbell-pads/'),
                    ),
                    array(
                        'title'        => 'ANKLE STRAPS',
                        'fallback_img' => 'Ankle-Strap-Cable-pull-scaled.jpg',
                        'url'          => array('url' => '/product-category/ankle-straps/'),
                    ),
                    array(
                        'title'        => 'OVERSIZED TEES',
                        'fallback_img' => 'clothing/Lift-The-World-T-Shirt-Black-1.jpg',
                        'url'          => array('url' => '/product-category/clothing/'),
                    ),
                    array(
                        'title'        => 'HOODIES',
                        'fallback_img' => 'clothing/hoodie-kaizen-anime-front.jpg',
                        'url'          => array('url' => '/product-category/clothing/'),
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
                    '{{WRAPPER}} .hb-collections-carousel-title' => 'color: {{VALUE}};',
                ),
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        include NESPORTS_PLUGIN_DIR . 'templates/sections/section-collections-carousel.php';
    }
}
