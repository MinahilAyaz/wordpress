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
                'default' => 'Power Packs & Bundles',
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
        $settings     = $this->get_settings_for_display();
        $title        = !empty($settings['section_title']) ? $settings['section_title'] : 'Power Packs & Bundles';
        $show_filters = $settings['show_filters'] === 'yes';

        $bundles     = nesports_bundles();
        $bundle_tabs = nesports_bundle_tabs();
        ?>
        <section class="hb-bundles-section" id="bundles" data-slider>
            <div class="hb-section-header">
                <h2 class="hb-section-title"><?php echo esc_html($title); ?></h2>
            </div>

            <?php if ($show_filters): ?>
            <div class="hb-pills hb-pills--center">
                <button type="button" class="hb-pill is-active" data-filter="all">ALL PACKS</button>
                <?php foreach ($bundle_tabs as $key => $label): ?>
                    <button type="button" class="hb-pill" data-filter="<?php echo esc_attr($key); ?>"><?php echo esc_html($label); ?></button>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>

            <div class="hb-cards hb-cards--center">
                <?php foreach ($bundles as $b):
                    $pct = round((1 - $b['price'] / $b['old']) * 100);
                    $url = home_url($b['url']);
                ?>
                <article class="hb-card" data-cat="<?php echo esc_attr($b['cat']); ?>">
                    <div class="hb-card-top-wrap">
                        <span class="hb-bundle-badge">SAVE <?php echo esc_html($pct); ?>%</span>
                        <a class="hb-card-media hb-card-media--pair" href="<?php echo esc_url($url); ?>">
                            <img class="hb-pair-a" src="<?php echo esc_url(nesports_img($b['imgs'][0])); ?>" alt="" loading="lazy">
                            <img class="hb-pair-b" src="<?php echo esc_url(nesports_img($b['imgs'][1])); ?>" alt="" loading="lazy">
                        </a>
                        <button type="button" class="hb-card-quick-add" data-id="<?php echo esc_attr('bundle-' . $b['cat']); ?>" data-name="<?php echo esc_attr($b['name']); ?>" data-price="<?php echo esc_attr($b['price']); ?>" data-img="<?php echo esc_url(nesports_img($b['imgs'][0])); ?>" aria-label="Add <?php echo esc_attr($b['name']); ?> to cart">
                            <i class="fa-solid fa-plus"></i> Add to cart
                        </button>
                    </div>
                    <div class="hb-card-body">
                        <h3 class="hb-card-title"><a href="<?php echo esc_url($url); ?>"><?php echo esc_html($b['name']); ?></a></h3>
                        <div class="hb-card-price is-sale">
                            <span class="now"><?php echo esc_html(nesports_money($b['price'])); ?></span>
                            <s><?php echo esc_html(nesports_money($b['old'])); ?></s>
                        </div>
                    </div>
                </article>
                <?php endforeach; ?>
            </div>
        </section>
        <?php
    }
}

