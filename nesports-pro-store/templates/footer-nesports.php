<?php
/**
 * NESPORTS3 - Footer
 */
$settings = get_option('nesports_store_settings', array());
$phone = nesports_setting('support_phone', '+1 (800) 555-0199');
$email = nesports_setting('support_email', 'support@nesports3.com');
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
                <a href="https://www.amazon.de/s?k=NES3" target="_blank" rel="noopener noreferrer" aria-label="Amazon" title="Amazon" class="hb-social-amazon">
                    <svg width="20" height="20" viewBox="0 0 24 24" style="display:block;">
                        <path fill="#ffffff" d="M13.62 14.51c-.63.48-1.54.76-2.5.76-1.57 0-2.61-.83-2.61-2.22 0-1.74 1.55-2.4 3.73-2.4.52 0 1.01.04 1.38.1v3.76zm2.46 3.65c-.17.14-.42.15-.61.04-.88-.7-1.04-1.02-1.53-1.73-1.46 1.48-2.51 1.95-4.32 1.95-2.25 0-4.04-1.39-4.04-3.79 0-2.12 1.38-3.56 3.49-4.06 1.83-.44 4.39-.52 4.39-2.02 0-.82-.66-1.45-1.99-1.45-1.38 0-2.16.55-2.43 1.76-.05.21-.21.37-.43.37l-2.07-.22c-.22-.02-.38-.2-.35-.42.47-2.67 2.76-3.86 5.37-3.86 2.67 0 4.54 1.25 4.54 3.86v4.98c0 1.54.64 2.22 1.25 3.06.16.22.14.5-.04.66-.46.39-1.28 1.1-1.28 1.1v-.21z"/>
                        <path fill="#FF9900" d="M22.13 19.73c-.28.21-.69.16-1-.1-3.13-2.56-7.65-3.96-12.8-3.96-4.52 0-8.7 1.22-11.89 3.43-.32.22-.68.2-.95-.08l-.8-.88c-.24-.26-.19-.6.12-.83 3.61-2.5 8.37-3.88 13.58-3.88 5.84 0 10.93 1.61 14.5 4.52.33.27.38.65.13.96l-.89.94zm-1.49-2.33c-.24.29-.55.26-.77.05-1.43-1.46-4.63-2.6-7.11-2.6-.48 0-.59-.36-.17-.65 2.45-1.67 6.37-1.19 7.72.55.19.24.17.55-.04.8l.37-.15z"/>
                    </svg>
                </a>
                <a href="https://www.ebay.de/str/nesports3?_trksid=p4429486.m3561.l161211" target="_blank" rel="noopener noreferrer" aria-label="eBay" title="eBay" class="hb-social-ebay">
                    <svg width="24" height="15" viewBox="0 0 100 40" style="display:block;">
                        <path fill="#e53238" d="M19.8 19.3c-.2-4.5-3.3-7.5-7.7-7.5-4.6 0-8 3.5-8 8.2 0 4.8 3.3 8.3 8.2 8.3 3.6 0 6.6-2 7.5-5.1h-4.2c-.6 1.4-1.8 2.2-3.3 2.2-2.1 0-3.8-1.5-4-3.7h11.4c.1-.8.1-1.6.1-2.4zm-11.4-1.5c.3-1.8 1.8-3.1 3.7-3.1 1.9 0 3.3 1.3 3.6 3.1H8.4z"/>
                        <path fill="#0064d2" d="M34.5 17.6c-1.3-1.3-3.1-2-5.3-2h-5.4V3.6h4.3v8.5c.7-.2 1.5-.3 2.3-.3 3.2 0 5.7 1.2 7.3 3.2 1.6 2 2.4 4.8 2.4 8.2s-.8 6.2-2.4 8.2c-1.6 2-4.1 3.2-7.3 3.2-2.3 0-4.3-.7-5.8-2.2v1.7h-4.3V3.6h4.3v13.6c.9-.9 2.1-1.6 3.5-2 1.2-.4 2.4-.6 3.6-.6 2.3 0 4.1.7 5.4 2 1.3 1.3 2 3.3 2 5.7s-.7 4.4-2 5.7c-1.3 1.3-3.1 2-5.4 2-1.8 0-3.3-.4-4.5-1.3V33c1.3.8 2.8 1.2 4.5 1.2 3.2 0 5.7-1.2 7.3-3.2 1.6-2 2.4-4.8 2.4-8.2s-.8-6.2-2.4-8.2z"/>
                        <path fill="#f5af02" d="M53.8 17.3c-.9-.7-2.1-1-3.6-1-1.8 0-3.3.6-4.3 1.7-1.1 1.1-1.6 2.6-1.6 4.4v.3h4.2v-.3c0-.9.2-1.6.7-2.1.5-.5 1.2-.8 2-.8.8 0 1.4.2 1.8.6.4.4.6.9.6 1.6v1.4l-3.9.4c-2.4.2-4.2.8-5.4 1.7-1.2.9-1.8 2.2-1.8 3.9 0 1.6.5 2.9 1.6 3.9 1.1 1 2.6 1.5 4.5 1.5 2.1 0 3.8-.7 5-2.1v1.8h4.1V23.4c0-2.6-.6-4.5-1.9-5.6-.5-.3-1.2-.5-2-.5zm-.2 8.7c0 .9-.3 1.7-.9 2.3-.6.6-1.5 1-2.6 1-1 0-1.8-.3-2.3-.8-.5-.5-.8-1.2-.8-2.1 0-.9.3-1.6.9-2.1.6-.5 1.6-.8 3-.9l2.7-.3v2.9z"/>
                        <path fill="#86b817" d="M72.9 16.5l-4.8 13.5-4.8-13.5h-4.6l7.3 18.2-3.1 7.4h4.4l9.9-25.6h-4.3z"/>
                    </svg>
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
        <span><?php echo esc_html(nesports_setting('footer_copyright', '© ' . date('Y') . ' NESPORTS3. All rights reserved.')); ?></span>
        <span class="hb-credit">Developed by <a href="https://www.hazsols.com/" target="_blank" rel="noopener noreferrer" style="display:inline;margin:0;color:#ffffff;text-decoration:none;">Hazsols Solutions</a></span>
        <img src="<?php echo esc_url(nesports_img('payments.png')); ?>" alt="Visa, Mastercard, PayPal, American Express, Visa Electron, Maestro">
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
