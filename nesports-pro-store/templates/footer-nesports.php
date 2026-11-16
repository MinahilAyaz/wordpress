<?php
/**
 * NESPORTS3 - Footer
 */
$settings = get_option('nesports_store_settings', array());
$phone = !empty($settings['support_phone']) ? $settings['support_phone'] : '+1 (800) 555-0199';
$email = !empty($settings['support_email']) ? $settings['support_email'] : 'support@nesports3.com';
?>
<footer class="hb-footer">
    <style id="hb-footer-custom-style">
    .hb-footer-logo {
        display: inline-block !important;
        background: transparent !important;
        border: none !important;
        border-radius: 0 !important;
        padding: 0 !important;
        margin-bottom: 16px !important;
    }
    .hb-footer-logo img {
        height: 76px !important;
        width: auto !important;
        display: block !important;
    }
    .hb-footer-social {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        margin-top: 18px !important;
    }
    .hb-footer-social a {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 36px !important;
        height: 36px !important;
        border-radius: 50% !important;
        background: #1e1e24 !important;
        color: #ffffff !important;
        text-decoration: none !important;
        margin: 0 !important;
        transition: background 0.25s ease, transform 0.2s ease, color 0.25s ease !important;
    }
    .hb-footer-social a svg {
        display: block !important;
    }
    .hb-footer-social a:hover {
        background: #e11d48 !important;
        color: #ffffff !important;
        transform: translateY(-2px) !important;
    }
    </style>

    <div class="hb-footer-grid">
        <div>
            <div class="hb-footer-logo"><img src="<?php echo esc_url(nesports_img('footer-logo.svg')); ?>" srcset="<?php echo esc_url(nesports_img('footer-logo.png')); ?> 2x" alt="NESPORTS3" loading="lazy" decoding="async"></div>
            <p>Lifting belts, straps, wraps and gym essentials built for serious lifters.</p>
            <div class="hb-footer-social">
                <a href="https://www.tiktok.com/@ne_sports3?_r=1&amp;_t=ZG-9BPPEAisLrd" target="_blank" rel="noopener noreferrer" aria-label="TikTok" title="TikTok">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.4a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3.14 15.7a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.82-.01l1.64-4.55z"/></svg>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61570206840697" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://www.instagram.com/nesports39/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://www.amazon.de/s?k=NES3" target="_blank" rel="noopener noreferrer" aria-label="Amazon" title="Amazon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13.957 10.37c-.36-.03-.79-.046-1.304-.046-1.927 0-3.254.81-3.254 2.508 0 1.547 1.047 2.36 2.457 2.36 1.096 0 1.956-.513 2.443-1.42v1.18c0 .243.14.39.38.39h1.72c.24 0 .378-.147.378-.39V9.75c0-2.61-1.71-3.96-4.57-3.96-2.58 0-4.35 1.258-4.66 3.238-.03.22.1.37.33.39l1.83.18c.24.02.37-.09.41-.31.25-1.12 1.09-1.72 2.21-1.72 1.29 0 2.07.6 2.07 1.83v.982l-1.99.07zm-1.02 3.19c-.83 0-1.44-.39-1.44-1.17 0-.82.68-1.28 1.78-1.28.29 0 .54.02.73.04v.93c-.22.92-.68 1.48-1.07 1.48zm9.58 7.37c-.24.18-.57.14-.84-.08-2.63-2.14-6.42-3.32-10.74-3.32-3.79 0-7.3 1.02-9.98 2.87-.27.19-.57.17-.79-.06l-.76-.84c-.2-.22-.16-.5.1-.7 3.03-2.1 7.02-3.25 11.39-3.25 4.9 0 9.17 1.35 12.16 3.79.28.23.32.55.11.81l-.65.78zm-1.25-1.95c-.2.24-.46.22-.64.04-1.2-1.22-3.88-2.17-5.96-2.17-.4 0-.49-.3-.14-.54 2.05-1.39 5.34-.99 6.47.46.16.2.14.46-.03.67l.3-.46z"/></svg>
                </a>
                <a href="https://www.ebay.de/str/nesports3?_trksid=p4429486.m3561.l161211" target="_blank" rel="noopener noreferrer" aria-label="eBay" title="eBay">
                    <svg width="20" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5.38 8.44C4.78 7.82 4.02 7.5 3.09 7.5c-1.04 0-1.85.39-2.42 1.16-.58.78-.86 1.87-.86 3.27 0 1.41.28 2.49.85 3.26.57.77 1.38 1.15 2.43 1.15 1.04 0 1.85-.38 2.43-1.15.57-.77.86-1.85.86-3.26 0-1.4-.29-2.49-.87-3.27l-.13-.17zm-1.15 4.37c0 .94-.13 1.63-.4 2.07-.26.44-.65.66-1.15.66-.5 0-.89-.22-1.15-.66-.27-.44-.4-1.13-.4-2.07 0-.93.13-1.63.4-2.07.26-.44.65-.66 1.15-.66.5 0 .89.22 1.15.66.27.44.4 1.14.4 2.07v-.001zm5.72-2.58h-1.69v6.09h1.69c.87 0 1.55-.26 2.04-.77.49-.52.74-1.28.74-2.28 0-.99-.25-1.74-.74-2.26-.49-.52-1.17-.78-2.04-.78zm.5 4.54c-.22.21-.55.32-.98.32h-.02v-3.79c.43 0 .76.11.98.32.22.21.33.62.33 1.23 0 .61-.11 1.02-.33 1.23l.02.69zm7.04-4.54c-.66 0-1.22.24-1.67.73v-.57h-1.66v6.09h1.66v-3.41c0-.49.12-.87.37-1.13.25-.26.58-.39 1-.39.42 0 .75.13 1 .39.25.26.37.64.37 1.13v3.41h1.66v-3.56c0-.91-.25-1.62-.75-2.12-.5-.5-1.16-.76-1.98-.76v.02zm-3.6-2.56h1.66v1.94h-1.66V7.67zm10.15 4.79c-.43-.46-1.04-.69-1.83-.69-.79 0-1.4.23-1.84.69-.43.46-.65 1.12-.65 1.99v3.42h1.66v-3.27c0-.52.12-.91.36-1.18.24-.26.57-.4.99-.4.42 0 .75.13.99.4.24.27.36.66.36 1.18v3.27h1.66v-3.42c0-.87-.22-1.53-.66-1.99h-.04z"/></svg>
                </a>
            </div>
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
        <span class="hb-credit">Developed by <a href="https://www.hazsols.com/" target="_blank" rel="noopener noreferrer" style="display:inline;margin:0;color:#ffffff;text-decoration:none;">Hazsols Solutions</a></span>
        <img src="<?php echo esc_url(nesports_img('payments.png')); ?>" alt="Visa, Mastercard, PayPal, American Express, Visa Electron, Maestro">
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
