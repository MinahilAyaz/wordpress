<?php
if (!defined('ABSPATH')) {
    exit;
}

use Elementor\Widget_Base;
use Elementor\Controls_Manager;

class NESports_Elementor_Banner_Widget extends Widget_Base {

    public function get_name() {
        return 'nesports_banner_widget';
    }

    public function get_title() {
        return esc_html__('NE Sports Parallax Banner', 'nesports-pro-store');
    }

    public function get_icon() {
        return 'eicon-banner';
    }

    public function get_categories() {
        return array('nesports-pro');
    }

    public function get_keywords() {
        return array('banner', 'parallax', 'promo', 'call to action', 'nesports');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_content',
            array(
                'label' => esc_html__('Banner Content', 'nesports-pro-store'),
                'tab'   => Controls_Manager::TAB_CONTENT,
            )
        );

        $this->add_control(
            'eyebrow',
            array(
                'label'   => esc_html__('Eyebrow / Subtitle', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => "STRENGTH ISN'T GIVEN. IT'S EARNED.",
            )
        );

        $this->add_control(
            'title',
            array(
                'label'   => esc_html__('Main Heading (HTML allowed)', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXTAREA,
                'default' => "BUILT FOR PROGRESS.<br>ENGINEERED TO ENDURE.",
            )
        );

        $this->add_control(
            'button_text',
            array(
                'label'   => esc_html__('Button Text', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => 'Learn Why We Built This',
            )
        );

        $this->add_control(
            'button_url',
            array(
                'label'       => esc_html__('Button Link', 'nesports-pro-store'),
                'type'        => Controls_Manager::URL,
                'placeholder' => esc_html__('https://your-link.com', 'nesports-pro-store'),
                'default'     => array(
                    'url' => '/our-story/',
                ),
            )
        );

        $this->add_control(
            'bg_image',
            array(
                'label'   => esc_html__('Background Image', 'nesports-pro-store'),
                'type'    => Controls_Manager::MEDIA,
                'default' => array(
                    'url' => '',
                ),
            )
        );

        $this->add_control(
            'fallback_img',
            array(
                'label'   => esc_html__('Internal Image Filename (Fallback)', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => 'DSC_0750-scaled.jpg',
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
            'overlay_color',
            array(
                'label'     => esc_html__('Overlay Color', 'nesports-pro-store'),
                'type'      => Controls_Manager::COLOR,
                'selectors' => array(
                    '{{WRAPPER}} .hb-static-banner-overlay' => 'background: {{VALUE}};',
                ),
            )
        );

        $this->add_control(
            'btn_color',
            array(
                'label'     => esc_html__('Button Accent Color', 'nesports-pro-store'),
                'type'      => Controls_Manager::COLOR,
                'selectors' => array(
                    '{{WRAPPER}} .hb-static-banner-btn' => 'background: {{VALUE}}; border-color: {{VALUE}};',
                ),
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();

        $bg_url = '';
        if (!empty($settings['bg_image']['url'])) {
            $bg_url = $settings['bg_image']['url'];
        } elseif (!empty($settings['fallback_img'])) {
            $bg_url = nesports_img($settings['fallback_img']);
        } else {
            $bg_url = nesports_img('DSC_0750-scaled.jpg');
        }

        $btn_url = !empty($settings['button_url']['url']) ? $settings['button_url']['url'] : '#';
        if (strpos($btn_url, 'http') !== 0 && strpos($btn_url, '#') !== 0) {
            $btn_url = home_url($btn_url);
        }

        $eyebrow     = !empty($settings['eyebrow']) ? $settings['eyebrow'] : '';
        $title       = !empty($settings['title']) ? $settings['title'] : '';
        $button_text = !empty($settings['button_text']) ? $settings['button_text'] : '';
        ?>
        <section class="hb-static-banner" style="--static-bg: url('<?php echo esc_url($bg_url); ?>');">
            <div class="hb-static-banner-overlay"></div>
            <div class="hb-static-banner-content">
                <?php if ($eyebrow): ?>
                    <span class="hb-static-banner-eyebrow"><?php echo esc_html($eyebrow); ?></span>
                <?php endif; ?>

                <?php if ($title): ?>
                    <h2 class="hb-static-banner-title"><?php echo wp_kses_post($title); ?></h2>
                <?php endif; ?>

                <?php if ($button_text): ?>
                    <div class="hb-static-banner-action">
                        <a class="hb-static-banner-btn" href="<?php echo esc_url($btn_url); ?>">
                            <span><?php echo esc_html($button_text); ?></span>
                        </a>
                    </div>
                <?php endif; ?>
            </div>
        </section>
        <?php
    }
}

