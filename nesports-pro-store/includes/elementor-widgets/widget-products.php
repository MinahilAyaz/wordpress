<?php
if (!defined('ABSPATH')) {
    exit;
}

use Elementor\Widget_Base;
use Elementor\Controls_Manager;

class NESports_Elementor_Products_Widget extends Widget_Base {

    public function get_name() {
        return 'nesports_products_widget';
    }

    public function get_title() {
        return esc_html__('NE Sports Products Grid & Filter', 'nesports-pro-store');
    }

    public function get_icon() {
        return 'eicon-products';
    }

    public function get_categories() {
        return array('nesports-pro');
    }

    public function get_keywords() {
        return array('products', 'shop', 'catalog', 'woocommerce', 'nesports');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_content',
            array(
                'label' => esc_html__('Filter Settings', 'nesports-pro-store'),
                'tab'   => Controls_Manager::TAB_CONTENT,
            )
        );

        $this->add_control(
            'show_filters',
            array(
                'label'        => esc_html__('Show Category Pills', 'nesports-pro-store'),
                'type'         => Controls_Manager::SWITCHER,
                'label_on'     => esc_html__('Yes', 'nesports-pro-store'),
                'label_off'    => esc_html__('No', 'nesports-pro-store'),
                'return_value' => 'yes',
                'default'      => 'yes',
            )
        );

        $this->add_control(
            'all_products_label',
            array(
                'label'     => esc_html__('All Products Label', 'nesports-pro-store'),
                'type'      => Controls_Manager::TEXT,
                'default'   => 'ALL PRODUCTS',
                'condition' => array(
                    'show_filters' => 'yes',
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
            'pill_active_color',
            array(
                'label'     => esc_html__('Active Pill Color', 'nesports-pro-store'),
                'type'      => Controls_Manager::COLOR,
                'selectors' => array(
                    '{{WRAPPER}} .hb-pill.is-active' => 'background: {{VALUE}}; border-color: {{VALUE}};',
                ),
            )
        );

        $this->add_control(
            'add_cart_color',
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
        $show_filters = $settings['show_filters'] === 'yes';
        $all_label    = !empty($settings['all_products_label']) ? $settings['all_products_label'] : 'ALL PRODUCTS';

        $products   = nesports_catalog();
        $categories = nesports_categories();
        ?>
        <section class="hb-collection" id="shop" data-slider>
            <?php if ($show_filters): ?>
            <div class="hb-collection-bar">
                <div class="hb-pills">
                    <button type="button" class="hb-pill hb-pill--master is-active" data-filter="all">
                        <i class="fa-solid fa-shapes"></i> <?php echo esc_html($all_label); ?>
                    </button>
                    <span class="hb-pill-divider" aria-hidden="true"></span>
                    <?php foreach ($categories as $key => $label): ?>
                        <button type="button" class="hb-pill" data-filter="<?php echo esc_attr($key); ?>"><?php echo esc_html($label); ?></button>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>

            <div class="hb-cards hb-product-grid">
                <?php foreach ($products as $p):
                    $url     = home_url('/product/' . $p['slug'] . '/');
                    $on_sale = $p['old'] > $p['price'];
                ?>
                <article class="hb-card" data-cat="<?php echo esc_attr($p['cat']); ?>">
                    <div class="hb-card-top-wrap">
                        <a class="hb-card-media" href="<?php echo esc_url($url); ?>">
                            <img class="hb-img-main" src="<?php echo esc_url(nesports_img($p['main'])); ?>" alt="<?php echo esc_attr($p['name']); ?>" loading="lazy">
                            <img class="hb-img-hover" src="<?php echo esc_url(nesports_img($p['hover'])); ?>" alt="" loading="lazy">
                        </a>
                        <button type="button" class="hb-card-quick-add" data-id="<?php echo esc_attr($p['slug']); ?>" data-name="<?php echo esc_attr($p['name']); ?>" data-price="<?php echo esc_attr($p['price']); ?>" data-img="<?php echo esc_url(nesports_img($p['main'])); ?>" aria-label="Add <?php echo esc_attr($p['name']); ?> to cart">
                            <i class="fa-solid fa-plus"></i> Add to cart
                        </button>
                    </div>
                    <div class="hb-card-body">
                        <h3 class="hb-card-title"><a href="<?php echo esc_url($url); ?>"><?php echo esc_html($p['name']); ?></a></h3>
                        <div class="hb-card-price<?php echo $on_sale ? ' is-sale' : ''; ?>">
                            <span class="now"><?php echo esc_html(nesports_money($p['price'])); ?></span>
                            <?php if ($on_sale): ?><s><?php echo esc_html(nesports_money($p['old'])); ?></s><?php endif; ?>
                        </div>
                        <?php if (!empty($p['desc'])): ?>
                            <p class="hb-card-desc"><?php echo esc_html($p['desc']); ?></p>
                        <?php endif; ?>
                    </div>
                </article>
                <?php endforeach; ?>
            </div>
        </section>
        <?php
    }
}

