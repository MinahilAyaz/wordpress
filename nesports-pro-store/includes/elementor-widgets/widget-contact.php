<?php
if (!defined('ABSPATH')) {
    exit;
}

use Elementor\Widget_Base;
use Elementor\Controls_Manager;

class NESports_Elementor_Contact_Widget extends Widget_Base {

    public function get_name() {
        return 'nesports_contact_widget';
    }

    public function get_title() {
        return esc_html__('NE Sports Contact Us Form', 'nesports-pro-store');
    }

    public function get_icon() {
        return 'eicon-form-horizontal';
    }

    public function get_categories() {
        return array('nesports-pro');
    }

    public function get_keywords() {
        return array('contact', 'form', 'help', 'nesports');
    }

    protected function register_controls() {
        $this->start_controls_section(
            'section_content',
            array(
                'label' => esc_html__('Contact Section Content', 'nesports-pro-store'),
                'tab'   => Controls_Manager::TAB_CONTENT,
            )
        );

        $this->add_control(
            'eyebrow',
            array(
                'label'   => esc_html__('Eyebrow Subtitle', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => 'INFORMATION ABOUT US',
            )
        );

        $this->add_control(
            'heading',
            array(
                'label'   => esc_html__('Main Heading', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => 'CONTACT US FOR ANY QUESTIONS',
            )
        );

        $this->add_control(
            'button_text',
            array(
                'label'   => esc_html__('Submit Button Text', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXT,
                'default' => 'ASK A QUESTION',
            )
        );

        $this->add_control(
            'success_msg',
            array(
                'label'   => esc_html__('Success Message', 'nesports-pro-store'),
                'type'    => Controls_Manager::TEXTAREA,
                'default' => 'Thank you! Your message has been sent successfully. We will get back to you shortly.',
            )
        );

        $this->end_controls_section();
    }

    protected function render() {
        $settings    = $this->get_settings_for_display();
        $eyebrow     = !empty($settings['eyebrow']) ? $settings['eyebrow'] : 'INFORMATION ABOUT US';
        $heading     = !empty($settings['heading']) ? $settings['heading'] : 'CONTACT US FOR ANY QUESTIONS';
        $button_text = !empty($settings['button_text']) ? $settings['button_text'] : 'ASK A QUESTION';
        $success_msg = !empty($settings['success_msg']) ? $settings['success_msg'] : 'Thank you! Your message has been sent successfully. We will get back to you shortly.';
        ?>
        <div class="hb-main hb-page-contact">
            <div class="hb-container">
                <div class="hb-contact-wrapper">
                    <span class="hb-contact-eyebrow"><?php echo esc_html($eyebrow); ?></span>
                    <h1 class="hb-contact-heading"><?php echo esc_html($heading); ?></h1>

                    <form class="hb-contact-form" id="hb-contact-form" onsubmit="if(window.handleContactSubmit) handleContactSubmit(event); else event.preventDefault();">
                        <div class="hb-form-row">
                            <div class="hb-form-col">
                                <label for="contact_name">Your Name</label>
                                <input type="text" id="contact_name" name="contact_name" required>
                            </div>
                            <div class="hb-form-col">
                                <label for="contact_email">Your Email</label>
                                <input type="email" id="contact_email" name="contact_email" required>
                            </div>
                        </div>

                        <div class="hb-form-row">
                            <div class="hb-form-col">
                                <label for="contact_phone">Phone Number</label>
                                <input type="tel" id="contact_phone" name="contact_phone">
                            </div>
                            <div class="hb-form-col">
                                <label for="contact_company">Company</label>
                                <input type="text" id="contact_company" name="contact_company">
                            </div>
                        </div>

                        <div class="hb-form-row hb-form-row-full">
                            <div class="hb-form-col">
                                <label for="contact_message">Your Message</label>
                                <textarea id="contact_message" name="contact_message" rows="8" required></textarea>
                            </div>
                        </div>

                        <div class="hb-form-actions">
                            <button type="submit" class="hb-btn-ask" id="hb-btn-ask"><?php echo esc_html($button_text); ?></button>
                        </div>

                        <div class="hb-form-success" id="hb-form-success" style="display: none;">
                            <i class="fa-solid fa-circle-check"></i> <?php echo esc_html($success_msg); ?>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <script>
        window.handleContactSubmit = function(e) {
            e.preventDefault();
            var btn = document.getElementById('hb-btn-ask');
            var successMsg = document.getElementById('hb-form-success');
            if (!btn || !successMsg) return;
            var orig = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'SENDING...';
            setTimeout(function() {
                btn.disabled = false;
                btn.textContent = orig;
                var form = document.getElementById('hb-contact-form');
                if (form) form.reset();
                successMsg.style.display = 'block';
                setTimeout(function() {
                    successMsg.style.display = 'none';
                }, 5000);
            }, 800);
        };
        </script>
        <?php
    }
}

