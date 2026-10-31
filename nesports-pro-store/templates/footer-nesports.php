<?php
/**
 * NESPORTS3 - Footer
 */
$settings = get_option('nesports_store_settings', array());
$phone = !empty($settings['support_phone']) ? $settings['support_phone'] : '+1 (800) 555-0199';
$email = !empty($settings['support_email']) ? $settings['support_email'] : 'support@nesports3.com';
?>
<footer class="hb-footer">
    <div class="hb-footer-grid">
        <div>
            <div class="hb-footer-logo"><img src="<?php echo esc_url(nesports_img('logo-1.png')); ?>" alt="NESPORTS3"></div>
            <p>Lifting belts, straps, wraps and gym essentials built for serious lifters.</p>
        </div>
        <div>
            <h4>EQUIPMENT</h4>
            <a href="<?php echo esc_url(home_url('/product-category/weightlifting-belts/')); ?>">Weightlifting Belts</a>
            <a href="<?php echo esc_url(home_url('/product-category/lifting-straps/')); ?>">Lifting Straps</a>
            <a href="<?php echo esc_url(home_url('/product-category/knee-wrap/')); ?>">Knee Wraps</a>
            <a href="<?php echo esc_url(home_url('/product-category/gym-bag/')); ?>">Gym Bags</a>
        </div>
        <div>
            <h4>SUPPORT</h4>
            <a href="<?php echo esc_url(home_url('/sizing-guide/')); ?>">Sizing Guide</a>
            <a href="<?php echo esc_url(home_url('/our-story/')); ?>">Our Story</a>
            <a href="<?php echo esc_url(home_url('/contact-us/')); ?>">Contact</a>
        </div>
        <div>
            <h4>CONTACT</h4>
            <span><?php echo esc_html($phone); ?></span>
            <span><?php echo esc_html($email); ?></span>
        </div>
    </div>
    <div class="hb-footer-bottom">
        <span>&copy; <?php echo date('Y'); ?> NESPORTS3. All rights reserved.</span>
        <span class="hb-credit">Developed by Hazsols Solutions</span>
        <img src="<?php echo esc_url(nesports_img('payments.png')); ?>" alt="Visa, Mastercard, PayPal, American Express, Visa Electron, Maestro">
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
