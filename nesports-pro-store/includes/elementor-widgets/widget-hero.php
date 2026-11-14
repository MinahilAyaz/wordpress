<?php
if (!defined('ABSPATH')) {
    exit;
}

use Elementor\Widget_Base;
use Elementor\Controls_Manager;
use Elementor\Repeater;

class NESports_Elementor_Hero_Widget extends Widget_Base {

    public function get_name() {
        return 'nesports_hero_widget';
    }

    public function get_title() {
        return esc_html__('NE Sports Hero Slider', 'nesports-pro-store');
    }

    public function get_icon() {
        return 'eicon-slider-album';
    }

    public function get_categories() {
        return array('nesports-pro');
    }

    public function get_keywords() {
        return array('hero', 'slider', 'carousel', 'nesports', 'store');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_slides',
            array(
                'label' => esc_html__('Hero Slides', 'nesports-pro-store'),
                'tab'   => Controls_Manager::TAB_CONTENT,
            )
        );

        $repeater = new Repeater();

        $repeater->add_control(
            'badge',
            array(
                'label'   => esc_html__('Badge Text', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => 'NEW DROP',
            )
        );

        $repeater->add_control(
            'sub',
            array(
                'label'       => esc_html__('Subheading / Eyebrow', 'nesports-pro-store'),
                'type'        => Controls_Manager::TEXT,
                'default'     => 'MAXIMUM CORE STABILITY',
                'label_block' => true,
            )
        );

        $repeater->add_control(
            'title',
            array(
                'label'       => esc_html__('Slide Title', 'nesports-pro-store'),
                'type'        => Controls_Manager::TEXT,
                'default'     => 'Pro Lever Lifting Belts',
                'label_block' => true,
            )
        );

        $repeater->add_control(
            'desc',
            array(
                'label'   => esc_html__('Description', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXTAREA,
                'default' => 'Competition-grade 10mm & 13mm leather belts with stainless steel lever buckle for heavy squats and pulls.',
            )
        );

        $repeater->add_control(
            'image',
            array(
                'label'   => esc_html__('Slide Image', 'nesports-pro-store'),
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
                'default' => 'DSC_2246-scaled.jpg',
            )
        );

        $repeater->add_control(
            'watermark',
            array(
                'label'   => esc_html__('Background Watermark', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => 'NESPORTS3',
            )
        );

        $repeater->add_control(
            'btn1_text',
            array(
                'label'   => esc_html__('Primary Button Text', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => 'SHOP NOW',
            )
        );

        $repeater->add_control(
            'btn1_url',
            array(
                'label'       => esc_html__('Primary Button Link', 'nesports-pro-store'),
                'type'        => Controls_Manager::URL,
                'placeholder' => esc_html__('https://your-link.com', 'nesports-pro-store'),
                'default'     => array(
                    'url' => '/product-category/weightlifting-belts/',
                ),
            )
        );

        $repeater->add_control(
            'btn2_text',
            array(
                'label'   => esc_html__('Secondary Button Text', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => 'VIEW ALL PRODUCTS',
            )
        );

        $repeater->add_control(
            'btn2_url',
            array(
                'label'       => esc_html__('Secondary Button Link', 'nesports-pro-store'),
                'type'        => Controls_Manager::URL,
                'placeholder' => esc_html__('https://your-link.com', 'nesports-pro-store'),
                'default'     => array(
                    'url' => '/shop/',
                ),
            )
        );

        $this->add_control(
            'slides',
            array(
                'label'       => esc_html__('Slider Items', 'nesports-pro-store'),
                'type'        => Controls_Manager::REPEATER,
                'fields'      => $repeater->get_controls(),
                'title_field' => '{{{ title }}}',
                'default'     => array(
                    array(
                        'badge'        => 'POWER GEAR',
                        'sub'          => 'SQUAT WITH CONFIDENCE',
                        'title'        => 'Competition Power Gear',
                        'desc'         => 'Heavy-duty competition pads, knee wraps and supportive accessories engineered for record-breaking lifts.',
                        'btn1_text'    => 'SHOP NOW',
                        'btn1_url'     => array('url' => '/shop/'),
                        'btn2_text'    => 'VIEW ALL PRODUCTS',
                        'btn2_url'     => array('url' => '/shop/'),
                        'fallback_img' => 'DSC_0749-scaled.jpg',
                        'watermark'    => 'NESPORTS3',
                    ),
                    array(
                        'badge'        => 'NEW DROP',
                        'sub'          => 'MAXIMUM CORE STABILITY',
                        'title'        => 'Pro Lever Lifting Belts',
                        'desc'         => 'Competition-grade 10mm & 13mm leather belts with stainless steel lever buckle for heavy squats and pulls.',
                        'btn1_text'    => 'SHOP NOW',
                        'btn1_url'     => array('url' => '/product-category/weightlifting-belts/'),
                        'btn2_text'    => 'VIEW ALL PRODUCTS',
                        'btn2_url'     => array('url' => '/shop/'),
                        'fallback_img' => 'DSC_2246-scaled.jpg',
                        'watermark'    => 'NESPORTS3',
                    ),
                    array(
                        'badge'        => 'ATHLETE SERIES',
                        'sub'          => 'CARRY EVERYTHING',
                        'title'        => 'Water Proof Gym Bags',
                        'desc'         => 'Durable, waterproof multi-compartment gym backpacks and duffels built for serious athletes.',
                        'btn1_text'    => 'SHOP NOW',
                        'btn1_url'     => array('url' => '/product-category/gym-bag/'),
                        'btn2_text'    => 'VIEW ALL PRODUCTS',
                        'btn2_url'     => array('url' => '/shop/'),
                        'fallback_img' => 'WhatsApp-Image-2024-07-08-at-19.17.50_f9c47d7b-800x530.jpg',
                        'watermark'    => 'NESPORTS3',
                    ),
                    array(
                        'badge'        => 'BEST SELLER',
                        'sub'          => 'BUILT FOR HEAVY PULLS',
                        'title'        => 'Padded Lifting Straps',
                        'desc'         => 'Engineered with high-density neoprene cushioning and heavy-duty industrial webbing for maximum deadlift grip.',
                        'btn1_text'    => 'SHOP NOW',
                        'btn1_url'     => array('url' => '/product-category/lifting-straps/'),
                        'btn2_text'    => 'VIEW ALL PRODUCTS',
                        'btn2_url'     => array('url' => '/shop/'),
                        'fallback_img' => 'DSC_0750-scaled.jpg',
                        'watermark'    => 'NESPORTS3',
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
            'accent_color',
            array(
                'label'     => esc_html__('Primary Button Color', 'nesports-pro-store'),
                'type'      => Controls_Manager::COLOR,
                'selectors' => array(
                    '{{WRAPPER}} .hb-hero-btn--red' => 'background: {{VALUE}}; border-color: {{VALUE}};',
                    '{{WRAPPER}} .hb-hero-dots button.is-active' => 'background: {{VALUE}}; width: 36px;',
                ),
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        $slides   = !empty($settings['slides']) ? $settings['slides'] : array();

        if (empty($slides)) {
            $default_slides = nesports_hero_slides();
            $slides = array();
            foreach ($default_slides as $ds) {
                $slides[] = array(
                    'title'        => $ds['title'],
                    'sub'          => $ds['sub'],
                    'desc'         => $ds['desc'],
                    'badge'        => $ds['badge'],
                    'fallback_img' => $ds['img'],
                    'btn1_text'    => 'SHOP NOW',
                    'btn1_url'     => array('url' => $ds['url']),
                    'btn2_text'    => 'VIEW ALL PRODUCTS',
                    'btn2_url'     => array('url' => '/shop/'),
                    'watermark'    => 'NESPORTS3',
                );
            }
        }
        ?>
        <section class="hb-hero" id="hb-hero">
            <div class="hb-hero-track" id="hb-hero-track">
                <?php foreach ($slides as $i => $s):
                    $img_src = '';
                    if (!empty($s['image']['url'])) {
                        $img_src = $s['image']['url'];
                    } elseif (!empty($s['fallback_img'])) {
                        $img_src = nesports_img($s['fallback_img']);
                    }

                    $btn1_url = !empty($s['btn1_url']['url']) ? $s['btn1_url']['url'] : '#';
                    if (strpos($btn1_url, 'http') !== 0 && strpos($btn1_url, '#') !== 0) {
                        $btn1_url = home_url($btn1_url);
                    }

                    $btn2_url = !empty($s['btn2_url']['url']) ? $s['btn2_url']['url'] : '#';
                    if (strpos($btn2_url, 'http') !== 0 && strpos($btn2_url, '#') !== 0) {
                        $btn2_url = home_url($btn2_url);
                    }

                    $watermark = !empty($s['watermark']) ? $s['watermark'] : 'NESPORTS3';
                ?>
                <div class="hb-hero-slide hb-hero-slide--photo<?php echo $i === 0 ? ' is-active' : ''; ?>">
                    <span class="hb-hero-watermark" aria-hidden="true"><?php echo esc_html($watermark); ?></span>
                    
                    <div class="hb-hero-media">
                        <img src="<?php echo esc_url($img_src); ?>" alt="<?php echo esc_attr($s['title']); ?>"<?php echo $i > 0 ? ' loading="lazy"' : ''; ?>>
                    </div>

                    <div class="hb-hero-caption">
                        <?php if (!empty($s['sub'])): ?>
                            <span class="hb-hero-sub"><?php echo esc_html($s['sub']); ?></span>
                        <?php endif; ?>

                        <h2 class="hb-hero-title"><?php echo esc_html($s['title']); ?></h2>
                        
                        <?php if (!empty($s['desc'])): ?>
                            <p class="hb-hero-desc"><?php echo esc_html($s['desc']); ?></p>
                        <?php endif; ?>

                        <div class="hb-hero-bottom-row">
                            <?php if (!empty($s['btn1_text'])): ?>
                                <a href="<?php echo esc_url($btn1_url); ?>" class="hb-hero-btn hb-hero-btn--red"><?php echo esc_html($s['btn1_text']); ?></a>
                            <?php endif; ?>
                            <?php if (!empty($s['btn2_text'])): ?>
                                <a href="<?php echo esc_url($btn2_url); ?>" class="hb-hero-btn hb-hero-btn--white"><?php echo esc_html($s['btn2_text']); ?></a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
            <div class="hb-hero-dots" id="hb-hero-dots">
                <?php foreach ($slides as $i => $s): ?>
                    <button type="button" class="<?php echo $i === 0 ? 'is-active' : ''; ?>" data-slide="<?php echo (int) $i; ?>" aria-label="Slide <?php echo (int) $i + 1; ?>"></button>
                <?php endforeach; ?>
            </div>
        </section>
        <?php
    }
}

