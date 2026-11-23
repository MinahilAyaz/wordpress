<?php
if (!defined('ABSPATH')) {
    exit;
}

use Elementor\Widget_Base;
use Elementor\Controls_Manager;

if (!function_exists('nesports_setting')) {
    function nesports_setting($key, $default = '') {
        $settings = get_option('nesports_store_settings', array());
        if (!is_array($settings)) $settings = array();
        return (isset($settings[$key]) && $settings[$key] !== '') ? $settings[$key] : $default;
    }
}
if (!function_exists('nesports_img')) {
    function nesports_img($file) {
        if (empty($file)) return '';
        if (strpos($file, 'http://') === 0 || strpos($file, 'https://') === 0 || strpos($file, '//') === 0) return $file;
        $url = defined('NESPORTS_PLUGIN_URL') ? NESPORTS_PLUGIN_URL : plugins_url('/', __DIR__ . '/../../');
        return rtrim($url, '/') . '/assets/images/' . $file;
    }
}

class NESports_Elementor_Story_Widget extends Widget_Base {

    public function get_name() {
        return 'nesports_story_widget';
    }

    public function get_title() {
        return esc_html__('NE Sports About Us / Story', 'nesports-pro-store');
    }

    public function get_icon() {
        return 'eicon-info-box';
    }

    public function get_categories() {
        return array('nesports-pro');
    }

    public function get_keywords() {
        return array('about', 'story', 'mission', 'nesports');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_content',
            array(
                'label' => esc_html__('About Us Content', 'nesports-pro-store'),
                'tab'   => Controls_Manager::TAB_CONTENT,
            )
        );

        $this->add_control(
            'banner_title',
            array(
                'label'   => esc_html__('Top Banner Title', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => 'About Us',
            )
        );

        $this->add_control(
            'image',
            array(
                'label'   => esc_html__('Feature Image', 'nesports-pro-store'),
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
                'default' => 'WhatsApp-Image-2024-07-08-at-19.17.50_f9c47d7b-800x530.jpg',
            )
        );

        $this->add_control(
            'story_text',
            array(
                'label'   => esc_html__('Story Content', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXTAREA,
                'rows'    => 10,
                'default' => 'At NE Sports3, we believe sports and fitness are more than just activities – they are a lifestyle. Our mission is to empower athletes, fitness enthusiasts, and everyday champions with the highest-quality sports and gym products that inspire performance, strength, and confidence.

From durable gym equipment and training accessories to premium sports gear, we carefully select every product to ensure it meets the needs of both beginners and professionals. Whether you’re building strength in the gym, training for competition, or simply staying active, NE Sports3 is here to support your journey.

We are passionate about helping our community stay fit, healthy, and motivated. That’s why we combine top-notch products, affordable prices, and reliable service – because your goals matter to us.

At NE Sports3, it’s not just about products, it’s about progress. Let us be your trusted partner in achieving your fitness and sports ambitions.',
            )
        );

        $this->add_control(
            'motto',
            array(
                'label'   => esc_html__('Bottom Motto Line', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => 'Train harder. Play stronger. Live better – with NE Sports3.',
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();

        // Direct 1-to-1 priority: If edited in Elementor, show Elementor settings.
        // Fall back gracefully to Dashboard global settings if not set.
        $img_src = !empty($settings['image']['url']) ? $settings['image']['url'] : (!empty(nesports_setting('about_feature_img')) ? nesports_img(nesports_setting('about_feature_img')) : nesports_img($settings['fallback_img']));
        $banner_title = !empty($settings['banner_title']) ? $settings['banner_title'] : nesports_setting('about_banner_title', 'About Us');
        $story_title  = !empty($settings['story_title']) ? $settings['story_title'] : nesports_setting('about_story_title', '');
        $story_text   = !empty($settings['story_text']) ? $settings['story_text'] : nesports_setting('about_story_text', '');
        $motto        = !empty($settings['motto']) ? $settings['motto'] : nesports_setting('about_motto', '');
        ?>
        <div class="hb-about-page">
            <section class="hb-about-hero-banner">
                <h1 class="hb-about-banner-title"><?php echo esc_html($banner_title); ?></h1>
            </section>

            <section class="hb-about-content-section">
                <div class="hb-about-container">
                    <div class="hb-about-two-col">
                        <div class="hb-about-media-col">
                            <img src="<?php echo esc_url($img_src); ?>" alt="<?php echo esc_attr($banner_title); ?>" class="hb-about-feature-img" loading="lazy">
                        </div>
                        <div class="hb-about-text-col">
                            <?php if ($story_title): ?>
                                <h2 style="font-size: 28px; font-weight: 700; color: #111111; margin: 0 0 16px;"><?php echo esc_html($story_title); ?></h2>
                            <?php endif; ?>
                            <?php 
                            if (strpos($story_text, '<p>') !== false) {
                                echo wp_kses_post($story_text);
                            } else {
                                $paras = explode("\n\n", str_replace("\r\n", "\n", $story_text));
                                foreach ($paras as $p) {
                                    if (trim($p) !== '') {
                                        echo '<p>' . wp_kses_post(nl2br(trim($p))) . '</p>';
                                    }
                                }
                            }
                            ?>
                            <?php if ($motto): ?>
                                <p class="hb-about-motto"><?php echo esc_html($motto); ?></p>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <style>
        .hb-about-page { background: #ffffff; min-height: 70vh; }
        .hb-about-hero-banner { background: #000000; color: #ffffff; padding: 56px 20px; text-align: center; }
        .hb-about-banner-title { font-size: clamp(32px, 4vw, 48px); font-weight: 400; color: #ffffff; margin: 0; font-family: var(--hb-font); letter-spacing: -0.01em; }
        .hb-about-content-section { padding: 70px 24px 100px; }
        .hb-about-container { max-width: 1160px; margin: 0 auto; }
        .hb-about-two-col { display: grid; grid-template-columns: 1fr 1.15fr; gap: 56px; align-items: center; }
        .hb-about-feature-img { width: 100%; height: auto; display: block; border-radius: 8px; object-fit: cover; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); }
        .hb-about-text-col { display: flex; flex-direction: column; gap: 18px; font-size: 15.5px; line-height: 1.75; color: #374151; font-family: var(--hb-font); }
        .hb-about-text-col p { margin: 0; }
        .hb-about-motto { font-size: 16.5px; color: #111827; padding-top: 8px; font-weight: 600; }
        @media (max-width: 900px) {
            .hb-about-two-col { grid-template-columns: 1fr; gap: 40px; }
            .hb-about-content-section { padding: 50px 20px 70px; }
            .hb-about-hero-banner { padding: 44px 20px; }
        }
        </style>
        <?php
    }
}

