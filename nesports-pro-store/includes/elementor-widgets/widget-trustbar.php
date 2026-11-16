<?php
if (!defined('ABSPATH')) {
    exit;
}

use Elementor\Widget_Base;
use Elementor\Controls_Manager;
use Elementor\Repeater;

class NESports_Elementor_TrustBar_Widget extends Widget_Base {

    public function get_name() {
        return 'nesports_trustbar_widget';
    }

    public function get_title() {
        return esc_html__('NE Sports Trust Bar', 'nesports-pro-store');
    }

    public function get_icon() {
        return 'eicon-check-circle';
    }

    public function get_categories() {
        return array('nesports-pro');
    }

    public function get_keywords() {
        return array('trust', 'bar', 'shipping', 'guarantee', 'badges', 'nesports');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_trust_items',
            array(
                'label' => esc_html__('Trust Badges', 'nesports-pro-store'),
                'tab'   => Controls_Manager::TAB_CONTENT,
            )
        );

        $repeater = new Repeater();

        $repeater->add_control(
            'icon_class',
            array(
                'label'   => esc_html__('FontAwesome Icon Class', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => 'fa-solid fa-truck-fast',
            )
        );

        $repeater->add_control(
            'title',
            array(
                'label'       => esc_html__('Title', 'nesports-pro-store'),
                'type'        => Controls_Manager::TEXT,
                'default'     => 'FREE & FAST SHIPPING',
                'label_block' => true,
            )
        );

        $repeater->add_control(
            'subtitle',
            array(
                'label'       => esc_html__('Subtitle', 'nesports-pro-store'),
                'type'        => Controls_Manager::TEXT,
                'default'     => 'Quick dispatch across Germany & Europe',
                'label_block' => true,
            )
        );

        $this->add_control(
            'items',
            array(
                'label'       => esc_html__('Trust Items', 'nesports-pro-store'),
                'type'        => Controls_Manager::REPEATER,
                'fields'      => $repeater->get_controls(),
                'title_field' => '{{{ title }}}',
                'default'     => array(
                    array(
                        'icon_class' => 'fa-solid fa-truck-fast',
                        'title'      => 'FREE & FAST SHIPPING',
                        'subtitle'   => 'Quick dispatch across Germany & Europe',
                    ),
                    array(
                        'icon_class' => 'fa-solid fa-shield-halved',
                        'title'      => 'COMPETITION-GRADE GEAR',
                        'subtitle'   => 'Heavy-duty leather & reinforced stitching',
                    ),
                    array(
                        'icon_class' => 'fa-solid fa-rotate-left',
                        'title'      => '30-DAY EASY RETURNS',
                        'subtitle'   => 'Hassle-free exchanges & size guarantee',
                    ),
                    array(
                        'icon_class' => 'fa-solid fa-award',
                        'title'      => 'ENGINEERED IN GERMANY',
                        'subtitle'   => 'Gym-tested quality from Remscheid',
                    ),
                ),
            )
        );

        $this->end_controls_section();

        $this->start_controls_section(
            'section_style',
            array(
                'label' => esc_html__('Styling', 'nesports-pro-store'),
                'tab'   => Controls_Manager::TAB_STYLE,
            )
        );

        $this->add_control(
            'bg_color',
            array(
                'label'     => esc_html__('Background Color', 'nesports-pro-store'),
                'type'      => Controls_Manager::COLOR,
                'default'   => '#111115',
                'selectors' => array(
                    '{{WRAPPER}} .hb-trustbar' => 'background: {{VALUE}};',
                ),
            )
        );

        $this->add_control(
            'icon_color',
            array(
                'label'     => esc_html__('Icon Color', 'nesports-pro-store'),
                'type'      => Controls_Manager::COLOR,
                'default'   => '#ffffff',
                'selectors' => array(
                    '{{WRAPPER}} .hb-trustbar-icon' => 'color: {{VALUE}};',
                ),
            )
        );

        $this->add_control(
            'title_color',
            array(
                'label'     => esc_html__('Title Color', 'nesports-pro-store'),
                'type'      => Controls_Manager::COLOR,
                'default'   => '#ffffff',
                'selectors' => array(
                    '{{WRAPPER}} .hb-trustbar-title' => 'color: {{VALUE}};',
                ),
            )
        );

        $this->add_control(
            'subtitle_color',
            array(
                'label'     => esc_html__('Subtitle Color', 'nesports-pro-store'),
                'type'      => Controls_Manager::COLOR,
                'default'   => '#a1a1aa',
                'selectors' => array(
                    '{{WRAPPER}} .hb-trustbar-sub' => 'color: {{VALUE}};',
                ),
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        $items    = !empty($settings['items']) ? $settings['items'] : array();
        if (empty($items)) {
            return;
        }
        ?>
        <section class="hb-trustbar" aria-label="Store Guarantees">
        <style>
        .hb-trustbar-sub { display: none !important; }
        .hb-trustbar-item { justify-content: center !important; }
        .hb-trustbar { padding: 16px 32px !important; }
        </style>
            <div class="hb-trustbar-inner">
                <?php foreach ($items as $item) :
                    $icon = !empty($item['icon_class']) ? $item['icon_class'] : 'fa-solid fa-check';
                ?>
                <div class="hb-trustbar-item">
                    <div class="hb-trustbar-icon" aria-hidden="true">
                        <i class="<?php echo esc_attr($icon); ?>"></i>
                    </div>
                    <div class="hb-trustbar-text">
                        <h3 class="hb-trustbar-title"><?php echo esc_html($item['title']); ?></h3>
                        
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </section>
        <?php
    }
}

